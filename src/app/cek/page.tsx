'use client';

import { useState } from 'react';
import { Globe, Zap, CheckCircle2, XCircle, AlertTriangle, Share2, ArrowRight, Sparkles, Copy, Check, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AuditResult { label: string; pass: boolean; detail: string; severity: 'critical' | 'warn' | 'info'; }
interface AuditSection { id: string; title: string; results: AuditResult[]; }
interface AuditReport { url: string; score: number; sections: AuditSection[]; timestamp: string; }

function ScoreRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 120 120" className="rotate-[-90deg]">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#27272a" strokeWidth="8" />
          <motion.circle
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.8, ease: 'circOut' }}
            cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round" strokeDasharray={circ}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="text-5xl font-black text-white font-mono"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <div className="px-4 py-1 rounded-full border text-xs font-black uppercase tracking-widest" style={{ borderColor: color, color }}>
        Grade {grade}
      </div>
    </div>
  );
}

export default function CekPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [shareUrl, setShareUrl] = useState('');
  const [verdict, setVerdict] = useState('');
  const [copied, setCopied] = useState(false);
  const [uuid, setUuid] = useState('');

  const steps = [
    'Menghubungi server…',
    'Memeriksa robots.txt & sitemap…',
    'Menganalisis on-page SEO…',
    'Mengecek security headers…',
    'Mengukur kecepatan…',
    'Memeriksa broken links…',
    'Menghitung skor akhir…',
  ];

  async function runAudit() {
    if (!url.trim()) return;
    const target = url.startsWith('http') ? url : `https://${url}`;
    setLoading(true);
    setReport(null);
    setShareUrl('');
    setVerdict('');
    setUuid('');
    setProgress(0);

    // Simulasi progress dengan label
    let step = 0;
    const progressInterval = setInterval(() => {
      setProgress(p => {
        const next = p + (100 / (steps.length * 8));
        if (next >= (step + 1) * (100 / steps.length)) step = Math.min(step + 1, steps.length - 1);
        setProgressLabel(steps[Math.min(step, steps.length - 1)]);
        return Math.min(next, 95);
      });
    }, 180);

    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(target)}`);
      const data: AuditReport = await res.json();
      clearInterval(progressInterval);
      setProgress(100);

      setReport(data);

      // Generate AI verdict (fire & forget, update UI when done)
      fetch('/api/verdict', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: data.url, score: data.score, sections: data.sections }),
      }).then(r => r.json()).then(d => { if (d.verdict) setVerdict(d.verdict); }).catch(() => {});

      // Simpan dan dapatkan share URL
      const saveRes = await fetch('/api/save-audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: data.url, score: data.score, sections: data.sections, timestamp: data.timestamp }),
      });
      const { uuid: savedUuid } = await saveRes.json();
      setUuid(savedUuid);
      setShareUrl(`${window.location.origin}/hasil/${savedUuid}`);
    } catch {
      clearInterval(progressInterval);
    } finally {
      setLoading(false);
    }
  }

  function copyShare() {
    const text = `Website saya dapat SEO score ${report?.score}/100 dari SEOsuite.\nCek website kamu juga: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Top 3 critical issues
  const criticals = report?.sections
    .flatMap(s => s.results.map(r => ({ ...r, section: s.title })))
    .filter(r => !r.pass && r.severity === 'critical')
    .slice(0, 3) || [];

  const warnings = report?.sections
    .flatMap(s => s.results.map(r => ({ ...r, section: s.title })))
    .filter(r => !r.pass && r.severity === 'warn')
    .slice(0, 4) || [];

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-sm tracking-tight uppercase italic">SEO<span className="text-zinc-600">suite</span></span>
          </div>
          <a href="/dashboard" className="text-[10px] text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center gap-1">
            Masuk ke Dashboard <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" /> Gratis · Tanpa Daftar · 53-Point Audit
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Cek SEO Website<br />
            <span className="text-zinc-600">Kamu Sekarang</span>
          </h1>
          <p className="text-zinc-500 text-base max-w-xl mx-auto">
            Audit teknis 53 titik. Robots, sitemap, on-page, security headers, kecepatan, broken links — selesai dalam 15 detik.
          </p>
        </div>

        {/* Input */}
        <div className="relative group mb-8">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/30 to-indigo-600/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative flex gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center pl-3">
              <Globe className="w-5 h-5 text-zinc-600" />
            </div>
            <input
              type="url"
              placeholder="bernas.id atau https://contoh.com"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runAudit()}
              disabled={loading}
              className="flex-1 bg-transparent py-3 text-sm outline-none text-white placeholder:text-zinc-700 font-mono disabled:opacity-50"
            />
            <button
              onClick={runAudit}
              disabled={loading || !url.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-7 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : <Zap className="w-4 h-4" />}
              {loading ? 'Mengaudit…' : 'Audit Gratis'}
            </button>
          </div>
        </div>

        {/* Progress */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 space-y-3"
            >
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                />
              </div>
              <p className="text-[11px] text-zinc-500 text-center font-mono">{progressLabel}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {report && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ScoreRing score={report.score} />
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-xs text-zinc-500 font-mono mb-1">{report.url}</p>
                    <h2 className="text-2xl font-black text-white mb-2">
                      {report.score >= 80 ? 'SEO-mu bagus!' : report.score >= 60 ? 'Ada ruang untuk perbaikan' : 'Website perlu perhatian serius'}
                    </h2>
                    <p className="text-zinc-500 text-sm mb-4">
                      {criticals.length} masalah kritis · {warnings.length} peringatan ditemukan
                    </p>

                    {/* Section scores mini */}
                    <div className="grid grid-cols-2 gap-2">
                      {report.sections.slice(0, 4).map(s => {
                        const total = s.results.length;
                        const passed = s.results.filter(r => r.pass).length;
                        const pct = total > 0 ? Math.round((passed / total) * 100) : 100;
                        const col = pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-red-500';
                        return (
                          <div key={s.id} className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-800/50">
                            <span className="text-[10px] text-zinc-400 font-medium">{s.title.replace(/[🤖🗺️📄🔖🛡️⚡🔗]/gu, '').trim()}</span>
                            <span className={`text-[10px] font-black ${col}`}>{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Verdict */}
              {verdict && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">AI Verdict</span>
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{verdict}</p>
                </motion.div>
              )}

              {/* Critical Issues */}
              {criticals.length > 0 && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
                    <XCircle className="w-3.5 h-3.5" /> {criticals.length} Masalah Kritis
                  </h3>
                  <div className="space-y-2">
                    {criticals.map((c, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-red-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-200">{c.label}</p>
                          <p className="text-xs text-zinc-500">{c.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {warnings.length > 0 && (
                <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" /> {warnings.length} Peringatan
                  </h3>
                  <div className="space-y-2">
                    {warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-1 h-1 rounded-full bg-amber-500 mt-2 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-zinc-200">{w.label}</p>
                          <p className="text-xs text-zinc-500">{w.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Share + CTA */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Share */}
                {shareUrl && (
                  <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5" /> Bagikan Hasil
                    </h3>
                    <p className="text-xs text-zinc-500 mb-3">Link unik hasil auditmu — bisa di-share ke WA, LinkedIn, Instagram:</p>
                    <div className="flex gap-2">
                      <input
                        readOnly
                        value={shareUrl}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-[11px] font-mono text-zinc-300 outline-none truncate"
                      />
                      <button
                        onClick={copyShare}
                        className="px-3 py-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                      </button>
                    </div>
                    <a href={shareUrl} target="_blank" className="mt-2 flex items-center gap-1 text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors">
                      <ExternalLink className="w-3 h-3" /> Lihat halaman share
                    </a>
                  </div>
                )}

                {/* CTA */}
                <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white mb-2">Mau skor lebih tinggi?</h3>
                    <p className="text-xs text-zinc-400 mb-4">
                      Dapatkan laporan lengkap + monitoring mingguan + rank tracker. Mulai dari Rp 499rb/bln.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <a href="/dashboard" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                      Daftar Gratis <ArrowRight className="w-3 h-3" />
                    </a>
                    {uuid && (
                      <a href={`/before-after?domain=${encodeURIComponent(report.url)}`} className="flex items-center justify-center gap-2 w-full border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                        Pantau Progress
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Badge embed snippet */}
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                  🏅 Pasang Badge di Website-mu
                </h3>
                <p className="text-xs text-zinc-500 mb-3">Tempel kode ini di footer website-mu untuk tampilkan skor SEO real-time:</p>
                <div className="bg-zinc-950 rounded-lg p-3 overflow-x-auto mb-3">
                  <code className="text-[11px] text-emerald-400 font-mono whitespace-nowrap">
                    {`<a href="https://seosuite.info/cek"><img src="https://seosuite.info/api/badge/${new URL(report.url).hostname}" alt="SEO Score" /></a>`}
                  </code>
                </div>
                <img
                  src={`/api/badge/${new URL(report.url).hostname}`}
                  alt="SEO Badge Preview"
                  className="h-7"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Social proof */}
        {!report && !loading && (
          <div className="mt-16 text-center">
            <p className="text-[11px] text-zinc-600 font-medium mb-4 uppercase tracking-widest">Dipercaya untuk audit website</p>
            <div className="flex flex-wrap justify-center gap-6 text-[11px] text-zinc-700 font-mono">
              {['bernas.id', 'unmaha.ac.id', 'autoprofit.id', 'agenc1st.com'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
