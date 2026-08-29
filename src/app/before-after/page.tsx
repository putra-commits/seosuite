'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Globe, TrendingUp, TrendingDown, Minus, RefreshCw, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuditResult { label: string; pass: boolean; detail: string; severity: 'critical' | 'warn' | 'info'; }
interface AuditSection { id: string; title: string; results: AuditResult[]; }
interface StoredAudit { uuid: string; url: string; score: number; sections: AuditSection[]; timestamp: string; }

function Delta({ now, before }: { now: number; before: number }) {
  const delta = now - before;
  if (Math.abs(delta) < 1) return <span className="text-zinc-600 flex items-center gap-0.5 text-sm font-black"><Minus className="w-3 h-3" />0</span>;
  if (delta > 0) return <span className="text-emerald-400 flex items-center gap-0.5 text-sm font-black"><TrendingUp className="w-3 h-3" />+{delta}</span>;
  return <span className="text-red-400 flex items-center gap-0.5 text-sm font-black"><TrendingDown className="w-3 h-3" />{delta}</span>;
}

function BeforeAfterInner() {
  const searchParams = useSearchParams();
  const [domain, setDomain] = useState(searchParams.get('domain') || '');
  const [history, setHistory] = useState<StoredAudit[]>([]);
  const [loading, setLoading] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [input, setInput] = useState(searchParams.get('domain') || '');

  async function loadHistory(url: string) {
    setLoading(true);
    try {
      const d = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      const res = await fetch(`/api/domain-history?domain=${encodeURIComponent(d)}`);
      const data = await res.json();
      setHistory(data.history || []);
      setDomain(url);
    } catch { /* skip */ }
    setLoading(false);
  }

  useEffect(() => {
    if (input) loadHistory(input);
  }, []);

  async function runNewAudit() {
    if (!input.trim()) return;
    const target = input.startsWith('http') ? input : `https://${input}`;
    setAuditing(true);
    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(target)}`);
      const data = await res.json();
      // Simpan
      await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: data.url, score: data.score, sections: data.sections, timestamp: data.timestamp }),
      });
      await loadHistory(target);
    } catch { /* skip */ }
    setAuditing(false);
  }

  const latest = history[0];
  const previous = history[1];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Progress Tracker</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Before vs After</h1>
        <p className="text-zinc-500 text-sm">Track improvement SEO domain dari waktu ke waktu</p>
      </header>

      {/* Input */}
      <div className="flex gap-3 mb-10">
        <div className="flex-1 flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
          <Globe className="w-4 h-4 text-zinc-600 shrink-0" />
          <input
            type="text"
            placeholder="contoh.com"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadHistory(input)}
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-zinc-700 font-mono"
          />
        </div>
        <button
          onClick={() => loadHistory(input)}
          disabled={loading}
          className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50"
        >
          Lihat History
        </button>
        <button
          onClick={runNewAudit}
          disabled={auditing || !input.trim()}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {auditing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {auditing ? 'Mengaudit…' : 'Audit Baru'}
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 text-zinc-500 text-sm">Memuat history…</div>
      )}

      {!loading && history.length === 0 && domain && (
        <div className="text-center py-16">
          <p className="text-zinc-500 text-sm mb-4">Belum ada data audit untuk domain ini.</p>
          <button onClick={runNewAudit} disabled={auditing} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
            Audit Sekarang
          </button>
        </div>
      )}

      {!loading && history.length > 0 && (
        <div className="space-y-8">
          {/* Delta summary */}
          {latest && previous && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-4"
            >
              {/* Score delta */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">Score Delta</p>
                <div className="text-4xl font-black font-mono mb-1">
                  <Delta now={latest.score} before={previous.score} />
                </div>
                <p className="text-xs text-zinc-600">{previous.score} → {latest.score}</p>
              </div>

              {/* Critical issues delta */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">Masalah Kritis</p>
                {(() => {
                  const nowC = latest.sections.flatMap(s => s.results).filter(r => !r.pass && r.severity === 'critical').length;
                  const prevC = previous.sections.flatMap(s => s.results).filter(r => !r.pass && r.severity === 'critical').length;
                  const diff = nowC - prevC;
                  const color = diff < 0 ? 'text-emerald-400' : diff > 0 ? 'text-red-400' : 'text-zinc-500';
                  return (
                    <>
                      <p className={`text-4xl font-black font-mono mb-1 ${color}`}>{diff > 0 ? '+' : ''}{diff}</p>
                      <p className="text-xs text-zinc-600">{prevC} → {nowC}</p>
                    </>
                  );
                })()}
              </div>

              {/* Pass rate delta */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 text-center">
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-2">Pass Rate</p>
                {(() => {
                  const nowAll = latest.sections.flatMap(s => s.results);
                  const prevAll = previous.sections.flatMap(s => s.results);
                  const nowPct = nowAll.length ? Math.round(nowAll.filter(r => r.pass).length / nowAll.length * 100) : 0;
                  const prevPct = prevAll.length ? Math.round(prevAll.filter(r => r.pass).length / prevAll.length * 100) : 0;
                  return (
                    <>
                      <div className="text-4xl font-black font-mono mb-1">
                        <Delta now={nowPct} before={prevPct} />
                      </div>
                      <p className="text-xs text-zinc-600">{prevPct}% → {nowPct}%</p>
                    </>
                  );
                })()}
              </div>
            </motion.div>
          )}

          {/* Section-by-section comparison */}
          {latest && previous && (
            <div className="rounded-2xl border border-zinc-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Perbandingan Per Seksi</h3>
              </div>
              <div className="divide-y divide-zinc-800">
                {latest.sections.map(section => {
                  const prevSection = previous.sections.find(s => s.id === section.id);
                  const nowPass = section.results.filter(r => r.pass).length;
                  const nowTotal = section.results.length;
                  const nowPct = nowTotal ? Math.round(nowPass / nowTotal * 100) : 100;
                  const prevPass = prevSection?.results.filter(r => r.pass).length ?? nowPass;
                  const prevTotal = prevSection?.results.length ?? nowTotal;
                  const prevPct = prevTotal ? Math.round(prevPass / prevTotal * 100) : 100;
                  const color = nowPct >= 80 ? '#10b981' : nowPct >= 60 ? '#f59e0b' : '#ef4444';

                  return (
                    <div key={section.id} className="px-6 py-4 grid grid-cols-12 items-center gap-4 hover:bg-zinc-800/30 transition-colors">
                      <div className="col-span-4">
                        <p className="text-sm font-semibold text-zinc-200">{section.title.replace(/[🤖🗺️📄🔖🛡️⚡🔗]/gu, '').trim()}</p>
                        <p className="text-[11px] text-zinc-500">{nowPass}/{nowTotal} lulus</p>
                      </div>
                      <div className="col-span-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all" style={{ width: `${nowPct}%`, backgroundColor: color }} />
                          </div>
                          <span className="text-sm font-black font-mono" style={{ color }}>{nowPct}%</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-center">
                        <span className="text-xs text-zinc-500 font-mono">{prevPct}%</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <Delta now={nowPct} before={prevPct} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* History timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">Riwayat Audit ({history.length})</h3>
            {history.map((audit, i) => {
              const color = audit.score >= 80 ? '#10b981' : audit.score >= 60 ? '#f59e0b' : '#ef4444';
              const date = new Date(audit.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
              return (
                <div key={audit.uuid} className={`flex items-center gap-4 px-5 py-3 rounded-xl border ${i === 0 ? 'border-zinc-600 bg-zinc-900' : 'border-zinc-800 bg-zinc-900/30'}`}>
                  <div className="text-2xl font-black font-mono w-12 text-right shrink-0" style={{ color }}>{audit.score}</div>
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 font-mono">{date}</p>
                    {i === 0 && <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Terbaru</span>}
                  </div>
                  <a href={`/hasil/${audit.uuid}`} className="text-[10px] text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest">
                    Lihat →
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BeforeAfterPage() {
  return (
    <Suspense fallback={<div className="p-12 text-zinc-500">Loading…</div>}>
      <BeforeAfterInner />
    </Suspense>
  );
}
