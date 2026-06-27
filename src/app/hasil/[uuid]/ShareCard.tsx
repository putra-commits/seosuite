'use client';

import { StoredAudit } from '@/lib/audit-store';
import { Zap, CheckCircle2, XCircle, AlertTriangle, Share2, ArrowRight, Copy, Check, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface Props { audit: StoredAudit; }

interface AuditResult { label: string; pass: boolean; detail: string; severity: 'critical' | 'warn' | 'info'; }
interface AuditSection { id: string; title: string; results: AuditResult[]; }

function ScoreRing({ score }: { score: number }) {
  const r = 52, circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 60 ? 'C' : score >= 40 ? 'D' : 'F';

  return (
    <div className="flex flex-col items-center gap-2">
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
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-black font-mono" style={{ color }}>{score}</span>
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">/ 100</span>
        </div>
      </div>
      <span className="px-4 py-1 rounded-full border text-xs font-black uppercase tracking-widest" style={{ borderColor: color, color }}>
        Grade {grade}
      </span>
    </div>
  );
}

export default function ShareCard({ audit }: Props) {
  const [copied, setCopied] = useState(false);
  const sections = audit.sections as AuditSection[];
  const domain = new URL(audit.url).hostname;
  const date = new Date(audit.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

  const criticals = sections
    .flatMap(s => s.results.map(r => ({ ...r, sectionTitle: s.title })))
    .filter(r => !r.pass && r.severity === 'critical');
  const warns = sections
    .flatMap(s => s.results.map(r => ({ ...r, sectionTitle: s.title })))
    .filter(r => !r.pass && r.severity === 'warn');
  const passed = sections
    .flatMap(s => s.results)
    .filter(r => r.pass).length;
  const total = sections.flatMap(s => s.results).length;

  function share() {
    const text = `Website ${domain} dapat SEO score ${audit.score}/100 dari SEOsuite.\n\nCek website kamu juga: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({ title: `SEO Score ${audit.score}/100`, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-sm tracking-tight uppercase italic">SEO<span className="text-zinc-600">suite</span></span>
          </div>
          <a href="/cek" className="text-[10px] text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center gap-1">
            Cek Website-mu <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        {/* Score Hero Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <ScoreRing score={audit.score} />
            <div className="flex-1 text-center md:text-left">
              <p className="text-[10px] text-zinc-500 font-mono mb-1 uppercase tracking-widest">Hasil Audit SEO</p>
              <h1 className="text-2xl font-black text-white mb-1">{domain}</h1>
              <p className="text-xs text-zinc-600 mb-4">{date} · {total} titik diperiksa</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black">
                  <CheckCircle2 className="w-3 h-3" /> {passed} lulus
                </div>
                {criticals.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black">
                    <XCircle className="w-3 h-3" /> {criticals.length} kritis
                  </div>
                )}
                {warns.length > 0 && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black">
                    <AlertTriangle className="w-3 h-3" /> {warns.length} peringatan
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Verdict if present */}
        {audit.verdict && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">AI Verdict</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{audit.verdict}</p>
          </div>
        )}

        {/* Section breakdown */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {sections.map(s => {
            const tot = s.results.length;
            const pass = s.results.filter(r => r.pass).length;
            const pct = tot > 0 ? Math.round((pass / tot) * 100) : 100;
            const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444';
            return (
              <div key={s.id} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-[10px] text-zinc-500 font-medium mb-1">{s.title.replace(/[🤖🗺️📄🔖🛡️⚡🔗]/gu, '').trim()}</p>
                <p className="text-2xl font-black font-mono" style={{ color }}>{pct}%</p>
                <p className="text-[10px] text-zinc-600">{pass}/{tot} lulus</p>
              </div>
            );
          })}
        </div>

        {/* Top critical issues */}
        {criticals.length > 0 && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-3 flex items-center gap-2">
              <XCircle className="w-3.5 h-3.5" /> Masalah Kritis
            </h2>
            <div className="space-y-2">
              {criticals.slice(0, 5).map((c, i) => (
                <div key={i} className="flex items-start gap-2">
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

        {/* Share + CTA */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-5">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2">
              <Share2 className="w-3.5 h-3.5" /> Bagikan
            </h3>
            <button
              onClick={share}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Disalin!' : 'Copy Link & Teks'}
            </button>
            <p className="text-[10px] text-zinc-600 mt-2 text-center">Share ke WA · LinkedIn · X</p>
          </div>

          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
            <h3 className="text-sm font-black text-white mb-2">Cek website-mu</h3>
            <p className="text-xs text-zinc-400 mb-3">Gratis. Tidak perlu daftar.</p>
            <a href="/cek" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all">
              Audit Gratis <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Badge */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">🏅 Pasang Badge</h3>
          <div className="bg-zinc-950 rounded-lg p-3 overflow-x-auto mb-3">
            <code className="text-[11px] text-emerald-400 font-mono whitespace-nowrap">
              {`<a href="https://seosuite.info/hasil/${audit.uuid}"><img src="https://seosuite.info/api/badge/${domain}" alt="SEO Score" /></a>`}
            </code>
          </div>
          <img src={`/api/badge/${domain}`} alt="SEO Badge" className="h-7" />
        </div>
      </div>
    </div>
  );
}
