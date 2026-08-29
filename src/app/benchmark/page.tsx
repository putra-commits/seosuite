'use client';

import { useState } from 'react';
import { Globe, Zap, CheckCircle2, XCircle, AlertTriangle, RefreshCw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditResult { label: string; pass: boolean; detail: string; severity: 'critical' | 'warn' | 'info'; }
interface AuditSection { id: string; title: string; results: AuditResult[]; }
interface AuditReport { url: string; score: number; sections: AuditSection[]; timestamp: string; }

function MiniScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const r = 32, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  return (
    <div className="relative inline-block">
      <svg width={size} height={size} viewBox="0 0 80 80" className="rotate-[-90deg]">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#27272a" strokeWidth="6" />
        <motion.circle
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'circOut' }}
          cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-black font-mono" style={{ color }}>{score}</span>
      </div>
    </div>
  );
}

export default function BenchmarkPage() {
  const [urlA, setUrlA] = useState('');
  const [urlB, setUrlB] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportA, setReportA] = useState<AuditReport | null>(null);
  const [reportB, setReportB] = useState<AuditReport | null>(null);

  async function runBenchmark() {
    if (!urlA.trim() || !urlB.trim()) return;
    const a = urlA.startsWith('http') ? urlA : `https://${urlA}`;
    const b = urlB.startsWith('http') ? urlB : `https://${urlB}`;
    setLoading(true);
    setReportA(null);
    setReportB(null);

    const [resA, resB] = await Promise.allSettled([
      fetch(`/api/audit?url=${encodeURIComponent(a)}`).then(r => r.json()),
      fetch(`/api/audit?url=${encodeURIComponent(b)}`).then(r => r.json()),
    ]);

    if (resA.status === 'fulfilled') setReportA(resA.value);
    if (resB.status === 'fulfilled') setReportB(resB.value);
    setLoading(false);
  }

  // Build comparison matrix
  const allSectionIds = reportA?.sections.map(s => s.id) || [];

  function getSectionPct(report: AuditReport | null, sectionId: string) {
    if (!report) return null;
    const sec = report.sections.find(s => s.id === sectionId);
    if (!sec || !sec.results.length) return null;
    return Math.round(sec.results.filter(r => r.pass).length / sec.results.length * 100);
  }

  function countByType(report: AuditReport | null, type: 'critical' | 'warn') {
    if (!report) return 0;
    return report.sections.flatMap(s => s.results).filter(r => !r.pass && r.severity === type).length;
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Competitor Intelligence</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Benchmark Kompetitor</h1>
        <p className="text-zinc-500 text-sm">Bandingkan 2 domain side-by-side untuk melihat siapa yang unggul di setiap area SEO</p>
      </header>

      {/* URL inputs */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Domain A (kamu)</label>
          <div className="flex items-center gap-3 bg-zinc-900 border border-blue-500/30 rounded-xl px-4 py-3">
            <Globe className="w-4 h-4 text-blue-500 shrink-0" />
            <input
              type="text"
              placeholder="bernas.id"
              value={urlA}
              onChange={e => setUrlA(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-zinc-700 font-mono"
            />
          </div>
        </div>
        <div>
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Domain B (kompetitor)</label>
          <div className="flex items-center gap-3 bg-zinc-900 border border-red-500/30 rounded-xl px-4 py-3">
            <Globe className="w-4 h-4 text-red-500 shrink-0" />
            <input
              type="text"
              placeholder="kompetitor.com"
              value={urlB}
              onChange={e => setUrlB(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runBenchmark()}
              className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-zinc-700 font-mono"
            />
          </div>
        </div>
      </div>

      <button
        onClick={runBenchmark}
        disabled={loading || !urlA.trim() || !urlB.trim()}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 mb-10"
      >
        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        {loading ? 'Menganalisis keduanya…' : 'Mulai Benchmark'}
      </button>

      <AnimatePresence>
        {reportA && reportB && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Score header */}
            <div className="grid grid-cols-3 gap-4">
              {/* Domain A */}
              <div className={`rounded-2xl border p-6 text-center ${reportA.score >= reportB.score ? 'border-blue-500/40 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                <p className="text-[10px] text-zinc-500 font-mono mb-3 truncate">{new URL(reportA.url).hostname}</p>
                <MiniScoreRing score={reportA.score} />
                {reportA.score >= reportB.score && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[9px] font-black uppercase">
                    Unggul
                  </div>
                )}
              </div>

              {/* VS */}
              <div className="flex flex-col items-center justify-center gap-2">
                <span className="text-3xl font-black text-zinc-600">VS</span>
                {(() => {
                  const diff = reportA.score - reportB.score;
                  const color = diff > 0 ? 'text-blue-400' : diff < 0 ? 'text-red-400' : 'text-zinc-600';
                  return (
                    <div className={`text-lg font-black font-mono ${color}`}>
                      {diff > 0 ? '+' : ''}{diff}
                    </div>
                  );
                })()}
              </div>

              {/* Domain B */}
              <div className={`rounded-2xl border p-6 text-center ${reportB.score > reportA.score ? 'border-red-500/40 bg-red-500/5' : 'border-zinc-800 bg-zinc-900/30'}`}>
                <p className="text-[10px] text-zinc-500 font-mono mb-3 truncate">{new URL(reportB.url).hostname}</p>
                <MiniScoreRing score={reportB.score} />
                {reportB.score > reportA.score && (
                  <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[9px] font-black uppercase">
                    Unggul
                  </div>
                )}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Masalah Kritis', valA: countByType(reportA, 'critical'), valB: countByType(reportB, 'critical'), lowerBetter: true },
                { label: 'Peringatan', valA: countByType(reportA, 'warn'), valB: countByType(reportB, 'warn'), lowerBetter: true },
                { label: 'Total Lulus', valA: reportA.sections.flatMap(s => s.results).filter(r => r.pass).length, valB: reportB.sections.flatMap(s => s.results).filter(r => r.pass).length, lowerBetter: false },
              ].map(stat => {
                const aWins = stat.lowerBetter ? stat.valA < stat.valB : stat.valA > stat.valB;
                const bWins = stat.lowerBetter ? stat.valB < stat.valA : stat.valB > stat.valA;
                return (
                  <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-3">{stat.label}</p>
                    <div className="flex items-end justify-between">
                      <span className={`text-2xl font-black font-mono ${aWins ? 'text-blue-400' : bWins ? 'text-zinc-400' : 'text-zinc-400'}`}>{stat.valA}</span>
                      <span className="text-xs text-zinc-600">vs</span>
                      <span className={`text-2xl font-black font-mono ${bWins ? 'text-red-400' : aWins ? 'text-zinc-400' : 'text-zinc-400'}`}>{stat.valB}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section comparison table */}
            <div className="rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80 grid grid-cols-12">
                <div className="col-span-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">Seksi</div>
                <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-blue-400 text-center">
                  {new URL(reportA.url).hostname}
                </div>
                <div className="col-span-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center">Delta</div>
                <div className="col-span-3 text-[10px] font-black uppercase tracking-widest text-red-400 text-center">
                  {new URL(reportB.url).hostname}
                </div>
              </div>
              <div className="divide-y divide-zinc-800">
                {allSectionIds.map(id => {
                  const pctA = getSectionPct(reportA, id);
                  const pctB = getSectionPct(reportB, id);
                  if (pctA === null || pctB === null) return null;
                  const diff = pctA - pctB;
                  const secTitle = reportA.sections.find(s => s.id === id)?.title.replace(/[🤖🗺️📄🔖🛡️⚡🔗]/gu, '').trim() || id;
                  const colorA = pctA >= 80 ? '#10b981' : pctA >= 60 ? '#f59e0b' : '#ef4444';
                  const colorB = pctB >= 80 ? '#10b981' : pctB >= 60 ? '#f59e0b' : '#ef4444';

                  return (
                    <div key={id} className="px-6 py-4 grid grid-cols-12 items-center hover:bg-zinc-800/30 transition-colors">
                      <div className="col-span-4">
                        <p className="text-sm font-semibold text-zinc-200">{secTitle}</p>
                      </div>
                      {/* A bar */}
                      <div className="col-span-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pctA}%`, backgroundColor: colorA }} />
                        </div>
                        <span className="text-xs font-black font-mono w-9 text-right shrink-0" style={{ color: colorA }}>{pctA}%</span>
                      </div>
                      {/* Delta */}
                      <div className="col-span-2 text-center">
                        {diff > 0
                          ? <span className="text-[11px] font-black text-emerald-400">+{diff}</span>
                          : diff < 0
                          ? <span className="text-[11px] font-black text-red-400">{diff}</span>
                          : <span className="text-[11px] font-black text-zinc-600">—</span>
                        }
                      </div>
                      {/* B bar */}
                      <div className="col-span-3 flex items-center gap-2">
                        <span className="text-xs font-black font-mono w-9 shrink-0" style={{ color: colorB }}>{pctB}%</span>
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pctB}%`, backgroundColor: colorB }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Takeaway */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Kesimpulan</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {new URL(reportA.url).hostname} unggul di:
                  </p>
                  <ul className="space-y-1">
                    {allSectionIds.filter(id => (getSectionPct(reportA, id) ?? 0) > (getSectionPct(reportB, id) ?? 0)).map(id => (
                      <li key={id} className="text-xs text-zinc-400">
                        · {reportA.sections.find(s => s.id === id)?.title.replace(/[🤖🗺️📄🔖🛡️⚡🔗]/gu, '').trim()}
                        <span className="text-zinc-600 ml-1">
                          ({getSectionPct(reportA, id)}% vs {getSectionPct(reportB, id)}%)
                        </span>
                      </li>
                    ))}
                    {allSectionIds.every(id => (getSectionPct(reportA, id) ?? 0) <= (getSectionPct(reportB, id) ?? 0)) && (
                      <li className="text-xs text-zinc-600 italic">Tidak ada area unggul</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] text-red-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
                    <XCircle className="w-3 h-3" /> {new URL(reportA.url).hostname} perlu kejar:
                  </p>
                  <ul className="space-y-1">
                    {allSectionIds.filter(id => (getSectionPct(reportA, id) ?? 0) < (getSectionPct(reportB, id) ?? 0)).map(id => (
                      <li key={id} className="text-xs text-zinc-400">
                        · {reportA.sections.find(s => s.id === id)?.title.replace(/[🤖🗺️📄🔖🛡️⚡🔗]/gu, '').trim()}
                        <span className="text-zinc-600 ml-1">
                          (gap {(getSectionPct(reportB, id) ?? 0) - (getSectionPct(reportA, id) ?? 0)}%)
                        </span>
                      </li>
                    ))}
                    {allSectionIds.every(id => (getSectionPct(reportA, id) ?? 0) >= (getSectionPct(reportB, id) ?? 0)) && (
                      <li className="text-xs text-zinc-600 italic">Unggul di semua area 🎉</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
