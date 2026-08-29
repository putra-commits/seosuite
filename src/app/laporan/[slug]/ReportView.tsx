'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Phone,
  MessageCircle,
  Share2,
  Printer,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Bot,
  Layers,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import { StoredAuditRecord } from '@/lib/audit-store';

interface Props {
  report: StoredAuditRecord;
}

export default function ReportView({ report }: Props) {
  const [activeTab, setActiveTab] = useState<string>('technical');
  const [copied, setCopied] = useState(false);

  const operatorWhatsApp = process.env.NEXT_PUBLIC_WHATSAPP_OPERATOR || '6281234567890';
  const waContactUrl = (packageText: string) => {
    const text = encodeURIComponent(
      `Halo Tim AdoloSEO, saya baru saja melihat laporan audit website saya di https://seo.adolo.id/laporan/${report.slug}.\n\nSaya tertarik untuk konsultasi mengenai: *${packageText}*. Mohon info langkah selanjutnya!`
    );
    return `https://wa.me/${operatorWhatsApp}?text=${text}`;
  };

  const handleShare = () => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: `Audit SEO ${report.domain} — Skor ${report.score}/100`,
        text: `Lihat hasil audit SEO 5-Layer untuk ${report.domain}`,
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formattedDate = new Date(report.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const gradeColor =
    report.score >= 80 ? '#10b981' :
    report.score >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-[#040609] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200 print:bg-white print:text-black">
      {/* Top Navbar */}
      <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Zap className="w-4 h-4 text-black fill-black" />
            </div>
            <span className="font-black text-lg tracking-tight uppercase text-white">
              SEO<span className="text-amber-400">suite</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-xs font-bold text-zinc-300 flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Bagikan'}</span>
            </button>
            <Link
              href="/cek-seo"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/10"
            >
              Audit Lain <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10 md:py-16 space-y-12">
        {/* 1. Header Overview & Score Ring */}
        <section className="relative rounded-3xl bg-zinc-950/60 border border-white/10 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden print:border-black print:bg-transparent print:p-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Score Ring */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 print:border-none">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1f242e" strokeWidth="10" />
                  <motion.circle
                    initial={{ strokeDashoffset: 314 }}
                    animate={{ strokeDashoffset: 314 - (report.score / 100) * 314 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    cx="60" cy="60" r="50" fill="none"
                    stroke={gradeColor}
                    strokeWidth="10"
                    strokeDasharray="314"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black font-mono tracking-tight text-white print:text-black">
                    {report.score}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">/ 100</span>
                </div>
              </div>
              <div
                className="mt-4 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest border"
                style={{ borderColor: gradeColor, color: gradeColor }}
              >
                Grade {report.grade} • {report.score >= 70 ? 'Cukup Sehat' : report.score >= 50 ? 'Butuh Perbaikan' : 'Kritis'}
              </div>
            </div>

            {/* Title & Owner Summary */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-bold">
                  {report.vertical}
                </span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-zinc-400 text-xs font-medium">{report.city}</span>
                <span className="text-zinc-500 text-xs">•</span>
                <span className="text-zinc-500 text-xs font-mono">{formattedDate}</span>
              </div>

              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight print:text-black">
                {report.businessName}
              </h1>
              <p className="text-xs text-amber-400/80 font-mono break-all">{report.url}</p>

              {/* Owner Summary Card */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-zinc-300 text-sm leading-relaxed print:text-black">
                <p className="font-semibold text-white mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Ringkasan Analisis Bisnis:
                </p>
                {report.summaryText}
              </div>
            </div>
          </div>
        </section>

        {/* 2. Top 3 Priority Issues (Luka Kritis) */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> 3 Perbaikan Prioritas Minggu Ini
              </div>
              <h2 className="text-2xl font-black text-white print:text-black">Luka Kritis yang Menghambat Konversi</h2>
            </div>
            <span className="text-xs text-zinc-500 hidden sm:inline">Urutan berdasarkan Impact × Effort</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {report.top3Issues.map((issue, idx) => (
              <div
                key={issue.id}
                className="relative rounded-2xl bg-zinc-950/80 border border-rose-500/20 p-6 space-y-4 hover:border-rose-500/40 transition-all shadow-xl print:border-black"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-400 font-mono font-bold text-xs flex items-center justify-center border border-rose-500/20">
                    0{idx + 1}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      Impact: {issue.impact}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      Effort: {issue.effort}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-black text-white leading-snug print:text-black">
                    {issue.title_id}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {issue.why_it_matters_id}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 text-[11px] text-zinc-500">
                  <span className="font-semibold text-zinc-300 block mb-0.5">Solusi Cepat:</span>
                  {issue.how_to_fix_id}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Estimasi Dampak Bisnis */}
        <section className="rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-transparent border border-amber-500/20 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 print:border-black">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" /> Estimasi Dampak Bisnis
            </div>
            <p className="text-sm md:text-base text-zinc-200 font-medium leading-relaxed print:text-black">
              {report.lossEstimateText}
            </p>
            <p className="text-[11px] text-zinc-500 italic">
              *Estimasi otomatis berdasarkan audit heuristik kecepatan mobile & kebiasaan konversi pengguna Indonesia.
            </p>
          </div>

          <a
            href={waContactUrl('Perbaikan 3 Luka Kritis Website')}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            Konsultasi Perbaikan via WA
          </a>
        </section>

        {/* 4. Rincian 5 Modul Audit */}
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-4 h-4" /> Evaluasi Lengkap 5-Layer
            </div>
            <h2 className="text-2xl font-black text-white print:text-black">Detail Pemeriksaan Komprehensif</h2>
          </div>

          {/* Module Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4 print:hidden">
            {report.modules.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === m.id
                    ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10'
                    : 'bg-white/[0.03] text-zinc-400 hover:bg-white/[0.07] border border-white/5'
                }`}
              >
                <span>{m.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  activeTab === m.id ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-300'
                }`}>
                  {m.score}%
                </span>
              </button>
            ))}
          </div>

          {/* Active Module Findings */}
          <div className="space-y-4">
            {report.modules
              .filter((m) => activeTab === m.id || typeof window === 'undefined')
              .map((m) => (
                <div key={m.id} className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    {m.findings.map((item) => (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all ${
                          item.pass
                            ? 'bg-zinc-950/40 border-emerald-500/20 text-zinc-300'
                            : item.severity === 'critical'
                              ? 'bg-rose-500/5 border-rose-500/30 text-rose-200'
                              : 'bg-amber-500/5 border-amber-500/20 text-amber-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {item.pass ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <XCircle className={`w-5 h-5 ${item.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />
                              )}
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-black text-white print:text-black">
                                  {item.title_id}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.2 rounded uppercase ${
                                  item.severity === 'critical'
                                    ? 'bg-rose-500/20 text-rose-300'
                                    : item.severity === 'warn'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-zinc-800 text-zinc-400'
                                }`}>
                                  {item.severity}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-400 leading-relaxed">
                                {item.why_it_matters_id}
                              </p>
                              {item.evidence && (
                                <p className="text-[11px] font-mono text-zinc-500">
                                  Bukti: {item.evidence}
                                </p>
                              )}
                              {!item.pass && item.how_to_fix_id && (
                                <p className="text-[11px] text-amber-400/90 pt-1">
                                  💡 <strong>Cara Perbaiki:</strong> {item.how_to_fix_id}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* 5. CTA Paket Solusi & Penawaran Jasa */}
        <section className="rounded-3xl bg-zinc-950/80 border border-white/10 p-8 md:p-12 space-y-8 shadow-2xl print:hidden">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Solusi Eksekusi Langsung ke Source Code
            </span>
            <h2 className="text-3xl font-black text-white">
              Pilihan Paket Perbaikan & Pertumbuhan
            </h2>
            <p className="text-xs text-zinc-400 max-w-xl mx-auto">
              Bukan sekadar slide presentasi. Tim fullstack kami langsung melakukan refactor kode, pasang schema, dan optimasi performa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Paket 1: Sprint 3 Isu */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-amber-500/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Paket Sprint</span>
                <h3 className="text-xl font-bold text-white">Fix 3 Luka Kritis</h3>
                <p className="text-xs text-zinc-400">
                  Perbaikan langsung 3 isu utama yang ditemukan pada audit ini (WhatsApp CTA, Title/H1, dan Core Web Vitals).
                </p>
                <div className="text-2xl font-black text-white">
                  Rp 1.5jt <span className="text-xs text-zinc-500 font-normal">/ satu kali (7–14 hari)</span>
                </div>
              </div>
              <a
                href={waContactUrl('Paket Fix 3 Luka Kritis (Rp 1.5jt)')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer block"
              >
                Pilih Sprint 3 Isu
              </a>
            </div>

            {/* Paket 2: Retainer Lokal (Featured) */}
            <div className="relative p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500 transition-all space-y-5 flex flex-col justify-between shadow-xl shadow-amber-500/10">
              <div className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-wider">
                Paling Populer
              </div>
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Retainer UMKM</span>
                <h3 className="text-xl font-bold text-white">Local Dominance & WA</h3>
                <p className="text-xs text-zinc-300">
                  Optimasi Google Maps, LocalBusiness Schema, monitoring ranking kata kunci lokal, dan optimasi landing WhatsApp.
                </p>
                <div className="text-2xl font-black text-amber-400">
                  Rp 3.5jt <span className="text-xs text-zinc-400 font-normal">/ bulan</span>
                </div>
              </div>
              <a
                href={waContactUrl('Paket Retainer Local Dominance (Rp 3.5jt/bln)')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md shadow-amber-500/20 cursor-pointer block"
              >
                Mulai Retainer Lokal
              </a>
            </div>

            {/* Paket 3: Enterprise & AI Visibility */}
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-indigo-500/50 transition-all space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Fullstack & AEO</span>
                <h3 className="text-xl font-bold text-white">AEO / GEO & pSEO</h3>
                <p className="text-xs text-zinc-400">
                  Dominasi jawaban AI Overview, audit E-E-A-T mendalam, pembuatan programmatic SEO landing pages kota.
                </p>
                <div className="text-2xl font-black text-white">
                  Rp 7.5jt+ <span className="text-xs text-zinc-500 font-normal">/ project</span>
                </div>
              </div>
              <a
                href={waContactUrl('Paket AEO / GEO & Programmatic SEO')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center transition-all cursor-pointer block"
              >
                Konsultasi Custom
              </a>
            </div>
          </div>
        </section>

        {/* Footer Disclaimer */}
        <footer className="pt-8 border-t border-white/10 text-center space-y-2 text-xs text-zinc-500">
          <p>
            Audit ini dijalankan secara otomatis menggunakan engine heuristik 5-Layer AdoloSEO. Hasil evaluasi merupakan indikator kesehatan teknis dan estimasi konversi, bukan jaminan mutlak posisi ranking Google.
          </p>
          <p>© 2026 AdoloSEO — Sovereign Growth Engine.</p>
        </footer>
      </main>
    </div>
  );
}
