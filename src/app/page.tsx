'use client';

import { useState } from 'react';
import {
  ArrowRight, Check, MapPin, Bot, BarChart3, Lock, Shield,
  Search, XCircle, AlertTriangle,
  ShieldCheck, Binary, Unlink, Trash2, TrendingUp, Compass, Layers,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from './components/footer';
import SiteNav from './components/site-nav';
import OutlineFrame from './components/outline-frame';
import EyStatement from './components/ey-statement';
import PhotoSplitSection from './components/photo-split-section';
import GrowTogetherCta from './components/grow-together-cta';
import WorkflowOrbit from './components/workflow-orbit';
import { statementPhoto, comparisonPhoto, ctaPhoto } from '@/config/photos';
import { waLink } from '@/config/contact';

interface AuditResult {
  url: string;
  finalScore: number;
  seoScore: number;
  aeoScore: number;
  geoScore: number;
  cwvScore: number;
  hasGA: boolean;
  hasGSC: boolean;
  issues: string[];
}

export default function LandingPage() {

  // Test Website Flow State
  const [testUrl, setTestUrl] = useState("");
  const [testState, setTestState] = useState<"idle" | "scanning" | "lead_capture" | "result" | "error">("idle");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Lead Capture State
  const [leadName, setLeadName] = useState("");
  const [leadWa, setLeadWa] = useState("");

  // Pesan kegagalan checkout yang TERLIHAT pengguna (dulu gagal diam-diam).

  const handleTestWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testUrl) return;

    let finalUrl = testUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
      setTestUrl(finalUrl);
    }

    setTestState("scanning");
    setErrorMessage("");

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: finalUrl }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Gagal melakukan audit.');
      }

      setAuditResult(data.data);
      // Lead capture wall instead of direct result!
      setTestState("lead_capture");

    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Gagal melakukan audit.');
      setTestState("error");
    }
  };

  /**
   * Gerbang kontak. Data nama + WhatsApp TIDAK dikirim ke server mana pun dan
   * TIDAK ditulis ke database — halaman ini tidak punya endpoint lead, dan
   * baris Lead yang dibuat /api/audit belum punya kolom nama/WA (butuh migrasi
   * Prisma, keputusan terpisah). Karena itu naskahnya sudah diperbaiki agar
   * tidak lagi menjanjikan "Laporan PDF dikirim ke WhatsApp": data ini hanya
   * dipakai di browser untuk menyusun pesan WhatsApp yang dikirim PENGGUNA
   * sendiri lewat tombol di panel hasil.
   */
  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadWa) return;
    setTestState("result");
  };

  const auditWaMessage = () => {
    const nama = leadName || '(belum diisi)';
    const wa = leadWa || '(belum diisi)';
    const skor = auditResult
      ? `Skor total ${auditResult.finalScore} (SEO ${auditResult.seoScore} / AEO ${auditResult.aeoScore} / GEO ${auditResult.geoScore} / CWV ${auditResult.cwvScore})`
      : 'Skor belum tersedia';
    return [
      'Halo Tim AdoloSEO, saya baru menjalankan audit gratis di seo.adolo.id.',
      `Nama: ${nama}`,
      `WhatsApp: ${wa}`,
      `Website: ${auditResult?.url || testUrl}`,
      skor,
      'Mohon dibantu tindak lanjutnya.',
    ].join('\n');
  };

  const scrollToLayanan = () => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-ink text-white selection:bg-accent/20">
      {/* 1. Navigasi bersama */}
      <SiteNav />

      {/* 2. Hero + Widget Audit */}
      {/* id="audit" dipakai tombol "Jalankan Audit" di section Layanan —
          widget auditnya memang tinggal di dalam hero, bukan section sendiri. */}
      <section id="audit" className="hero-mesh relative flex min-h-[92vh] scroll-mt-24 items-center overflow-hidden pb-20 pt-32">
        <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center">
          {/* Kolom kiri */}
          <div>
            <span aria-hidden="true" className="ey-accent-bar mb-5 h-1 w-14 bg-accent" />
            <p className="section-label text-accent">Pusat Komando Akuisisi</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl xl:text-6xl">
              Website Anda <br />
              <span className="text-gradient">Hanya Jadi Beban Biaya Server?</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300">
              Berhenti membakar uang untuk Paid Ads berdarah-darah. Biarkan AI kami membedah isi
              perut website Anda dan membuktikan mengapa kompetitor mencuri 90% pelanggan Anda
              setiap harinya.
            </p>

            {(testState === "idle" || testState === "error") && (
              <form onSubmit={handleTestWebsite} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="contoh: website-pesaing-anda.com"
                  className="flex-1 rounded-none border border-white/15 bg-black/40 px-5 py-3.5 text-white outline-none backdrop-blur-sm transition placeholder:text-slate-500 focus:border-accent/60"
                  required
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-none bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:bg-accent-300"
                >
                  Bongkar Kebocoran Website <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            )}

            {testState === "error" && errorMessage && (
              <p className="mt-4 text-sm font-medium text-red-400">{errorMessage}</p>
            )}

            <p className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Shield className="h-4 w-4 shrink-0 text-accent" />
              Lebih dari 4.200+ pemilik bisnis telah menyadari kebodohan strategi SEO mereka minggu ini.
            </p>
          </div>

          {/* Kolom kanan — motif rectangle outline melayang */}
          <OutlineFrame innerClassName="px-4 py-8 sm:px-8">
            {(testState === "idle" || testState === "error") && <WorkflowOrbit />}

            {testState === "scanning" && (
              <div className="flex flex-col items-center justify-center gap-6 py-10">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent/20 border-t-accent" />
                <div className="space-y-2 text-center">
                  <h3 className="font-display text-xl font-bold text-white">Menganalisis Arsitektur AI...</h3>
                  <p className="text-sm text-slate-400">Membaca HTML dan mengevaluasi SEO, AEO, serta GEO.</p>
                </div>
                <div className="w-full space-y-3">
                  <div className="h-3 w-full animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-white/5" />
                  <div className="h-3 w-3/5 animate-pulse rounded bg-white/5" />
                </div>
              </div>
            )}

            {testState === "lead_capture" && (
              <div className="text-left">
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent/30 bg-brand-600/15">
                    <Check className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white">Audit Selesai!</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Kami menemukan <strong className="font-bold text-accent">celah potensial</strong> di{' '}
                    <span className="font-semibold text-white">{testUrl}</span>. Isi nama dan nomor
                    WhatsApp Anda untuk membuka skor lengkapnya di layar berikutnya.
                  </p>
                </div>

                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label className="section-label mb-2 block text-slate-400">Nama Lengkap</label>
                    <input
                      type="text"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-none border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-accent/60"
                      required
                    />
                  </div>
                  <div>
                    <label className="section-label mb-2 block text-slate-400">Nomor WhatsApp</label>
                    <input
                      type="tel"
                      value={leadWa}
                      onChange={(e) => setLeadWa(e.target.value)}
                      placeholder="+62 812..."
                      className="w-full rounded-none border border-white/15 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-accent/60"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-none bg-accent py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:bg-accent-300"
                  >
                    Buka Hasil Audit
                    <Lock className="h-4 w-4" />
                  </button>
                </form>
                <p className="mt-6 text-center text-xs leading-relaxed text-slate-400">
                  Data ini tetap di browser Anda — dipakai hanya untuk menyiapkan pesan WhatsApp
                  yang Anda kirim sendiri. Tidak ada pengiriman otomatis dan tidak ada laporan PDF:
                  hasil audit tampil penuh di layar berikutnya.
                </p>
              </div>
            )}

            {testState === "result" && auditResult && (
              <div className="flex flex-col gap-6 text-left">
                <div className="flex items-center gap-5">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-ink-900">
                    <span className="font-display text-2xl font-bold text-accent">{auditResult.finalScore}</span>
                  </div>
                  <div>
                    <h3 className="section-label text-accent">Hasil Audit Arsitektur</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">
                      Ditemukan <strong className="font-bold text-accent">celah kebocoran konversi</strong> pada
                      domain <strong className="font-semibold text-white">{auditResult.url}</strong>. ChatGPT
                      &amp; mesin pencari AI lainnya berpotensi melewatkan produk Anda jika arsitektur data
                      tidak segera dioptimalkan.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-white/10 py-4 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-400">SEO Score</p>
                    <p className={`font-display text-xl font-bold sm:text-2xl ${auditResult.seoScore > 70 ? 'text-accent' : 'text-slate-400'}`}>{auditResult.seoScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-400">CWV Score</p>
                    <p className={`font-display text-xl font-bold sm:text-2xl ${auditResult.cwvScore > 70 ? 'text-accent' : 'text-slate-400'}`}>{auditResult.cwvScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-400">AEO Score</p>
                    <p className={`font-display text-xl font-bold sm:text-2xl ${auditResult.aeoScore > 70 ? 'text-accent' : 'text-slate-400'}`}>{auditResult.aeoScore}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-slate-400">GEO Score</p>
                    <p className={`font-display text-xl font-bold sm:text-2xl ${auditResult.geoScore > 70 ? 'text-accent' : 'text-slate-400'}`}>{auditResult.geoScore}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className={`flex items-center gap-2 rounded-none border px-3 py-1.5 ${auditResult.hasGA ? 'border-accent/40 bg-brand-600/10 text-accent' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                    {auditResult.hasGA ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span className="text-xs font-bold">Google Analytics (GA4)</span>
                  </div>
                  <div className={`flex items-center gap-2 rounded-none border px-3 py-1.5 ${auditResult.hasGSC ? 'border-accent/40 bg-brand-600/10 text-accent' : 'border-white/10 bg-white/5 text-slate-400'}`}>
                    {auditResult.hasGSC ? <Check className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                    <span className="text-xs font-bold">Search Console (GSC)</span>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-sm font-semibold text-white">Rekomendasi Perbaikan Prioritas:</h4>
                  <ul className="space-y-3 text-sm text-slate-400">
                    {auditResult.issues.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={scrollToLayanan}
                  className="w-full rounded-none bg-accent py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:bg-accent-300"
                >
                  Selamatkan Bisnis Saya Sekarang
                </button>
                {/* Satu-satunya jalur pengiriman yang benar-benar bekerja:
                    pengguna sendiri yang menekan kirim di WhatsApp. */}
                <a
                  href={waLink(auditWaMessage())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-none border border-accent/40 bg-white/5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Kirim Ringkasan Ini ke Tim via WhatsApp
                </a>
                <button
                  onClick={() => { setTestState("idle"); setTestUrl(""); }}
                  className="w-full text-xs font-semibold text-slate-400 transition hover:text-white"
                >
                  Audit URL Lain
                </button>
              </div>
            )}
          </OutlineFrame>
        </div>
      </section>

      {/* 3. Statement Break */}
      <EyStatement
        eyebrow="Masalah Tersembunyi"
        headline="Website Anda Bisa Menghasilkan Lebih Banyak."
        body="Kenapa website kompetitor lebih ramai? Karena mereka menggunakan Arsitektur Konversi. SEO saja tidak cukup di era AI."
        photo={statementPhoto}
      />

      {/* 4. Pain Grid + Kartu Siapa Yang Butuh
           id="features" WAJIB di sini (bukan di <EyStatement>): menekan "Fitur"
           di nav harus mendarat di grid fitur, bukan di foto statement break. */}
      <section id="features" className="relative scroll-mt-24 overflow-hidden bg-ink-900 py-16 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-brand-600/15 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <p className="max-w-2xl text-base leading-relaxed text-slate-300">
            Anda butuh optimasi yang membuat website Anda &quot;berbicara&quot; kepada mesin pencari AI
            dan mengarahkan trafik ke dompet Anda.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="card-lift rounded-2xl border border-white/10 bg-ink p-6 hover:border-accent/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-accent">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
                Profit-Oriented SEO
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                Bukan cuma cari ranking, tapi cari pembeli.
              </p>
            </div>

            <div className="card-lift rounded-2xl border border-white/10 bg-ink p-6 hover:border-accent/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-accent">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-white">
                AI Search Dominance (AEO &amp; GEO)
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-400">
                Pastikan bisnis Anda jadi jawaban utama di ChatGPT &amp; Perplexity.
              </p>
            </div>

            <OutlineFrame innerClassName="p-6">
              <h3 className="font-display text-xl font-bold tracking-tight text-white">
                Siapa Yang Butuh AdoloSEO?
              </h3>
              <div className="mt-5 space-y-4">
                <div className="rounded-xl border border-white/10 bg-ink-800 p-4">
                  <p className="section-label text-accent">Personal Branding</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Bangun otoritas digital yang tak terbantahkan. Jadilah wajah pertama yang muncul
                    saat nama atau bidang Anda dicari.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-ink-800 p-4">
                  <p className="section-label text-accent">Pemilik Ecommerce</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    Bosan dengan potongan marketplace yang mencekik? Ubah toko online mandiri Anda
                    menjadi mesin penjualan yang efisien.
                  </p>
                </div>
              </div>
            </OutlineFrame>
          </div>
        </div>
      </section>

      {/* 5. Comparison Split — Ads vs Ekosistem Organik */}
      <PhotoSplitSection
        eyebrow="Salesman 24 Jam Non-Stop"
        headline="Jadikan ChatGPT, Gemini & Siri Sebagai Salesman Anda."
        body="Berhenti membakar uang untuk Paid Ads. Saatnya membangun aset digital yang bekerja 24 jam sehari, 7 hari seminggu tanpa minta naik gaji. Dengan menguasai SEO, AEO, dan GEO, Anda merekrut algoritma terbesar di dunia untuk menjual produk Anda saat Anda sedang tidur."
        photo={comparisonPhoto}
      >
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-none border border-white/15 bg-black/35 p-4 backdrop-blur-sm">
            <p className="text-base font-semibold text-white">Iklan Berbayar (Ads)</p>
            <p className="mt-1 text-sm text-slate-400">
              ROI Statis • Biaya Terus Meningkat • Berhenti Saat Saldo Habis
            </p>
          </div>
          <div className="rounded-none border border-accent/40 bg-black/35 p-4 backdrop-blur-sm">
            <p className="text-base font-semibold text-white">Ekosistem SEO, AEO &amp; GEO</p>
            <p className="mt-1 text-sm text-accent">
              ROI Eksponensial • Bekerja 24 Jam • Dipercaya oleh AI
            </p>
          </div>
        </div>

        {/* Mock bar-chart */}
        <div className="relative mt-8 flex h-[260px] items-end gap-4 rounded-2xl border border-white/10 bg-ink-800 p-6">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6">
            <div className="w-full border-t border-white/10" />
            <div className="w-full border-t border-white/10" />
            <div className="w-full border-t border-white/10" />
          </div>

          <div className="relative z-10 flex h-full flex-1 flex-col justify-end gap-2">
            <motion.div
              initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
              className="flex w-full items-center justify-center rounded-t-lg bg-slate-700"
            >
              <span className="-rotate-90 text-xs font-bold text-slate-300">ADS</span>
            </motion.div>
            <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bulan 1</p>
          </div>
          <div className="relative z-10 flex h-full flex-1 flex-col justify-end gap-2">
            <motion.div
              initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
              className="w-full rounded-t-lg bg-slate-700"
            />
            <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bulan 6</p>
          </div>
          <div className="relative z-10 flex h-full flex-1 flex-col justify-end gap-2">
            <motion.div
              initial={{ height: 0 }} whileInView={{ height: '80%' }} viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="flex w-full items-center justify-center rounded-t-lg bg-gradient-to-t from-brand-600 to-accent"
            >
              <span className="-rotate-90 text-xs font-bold text-ink-900">ORGANIK</span>
            </motion.div>
            <p className="text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Bulan 12</p>
          </div>

          <div className="absolute left-6 top-6 rounded-none border border-white/15 bg-black/50 p-3 backdrop-blur-sm">
            <p className="section-label text-accent">Pertumbuhan Kumulatif</p>
            <p className="font-display text-2xl font-bold text-white">+440%</p>
          </div>
        </div>
      </PhotoSplitSection>

      {/* 6. Trifecta SEO / AEO / GEO */}
      <section className="bg-ink-900 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                no: '01',
                title: 'SEO — Penakluk Google',
                desc: 'Search Engine Optimization: Menempatkan website Anda di peringkat tertinggi pencarian tradisional Google, menyergap calon pembeli secara organik tepat saat mereka mencari solusi yang Anda tawarkan.',
              },
              {
                no: '02',
                title: 'AEO — Penakluk ChatGPT & Gemini',
                desc: 'Answer Engine Optimization: Mengkondisikan konten Anda agar direkomendasikan sebagai "Jawaban Terbaik Mutlak" saat prospek bertanya kepada Chatbot AI pintar seputar industri Anda.',
              },
              {
                no: '03',
                title: 'GEO — Penakluk Siri & Voice AI',
                desc: 'Generative Engine Optimization: Mengoptimasi keberadaan merek Anda agar menjadi rujukan utama saat pengguna melakukan pencarian melalui perangkat suara cerdas dan ekosistem pintar Apple.',
              },
            ].map((item) => (
              <div
                key={item.no}
                className="card-lift relative overflow-hidden rounded-2xl border border-white/10 bg-ink p-7 hover:border-accent/40"
              >
                <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-600/15 blur-3xl" />
                <p className="relative font-mono text-sm font-semibold tracking-[0.25em] text-accent">{item.no}</p>
                <h3 className="relative mt-4 font-display text-2xl font-bold tracking-tight text-white">
                  {item.title}
                </h3>
                <p className="relative mt-3 text-[15px] leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Sovereign Arsenal */}
      <section id="arsenal" className="scroll-mt-24 bg-ink py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <span aria-hidden="true" className="ey-accent-bar mb-4 h-1 w-14 bg-accent" />
          <p className="section-label text-accent">Sovereign Arsenal</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Bukan Sekadar Alat, Ini Senjata Pemusnah Massal Kompetitor.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            10 Fitur Enterprise-grade yang didesain bukan untuk orang awam, melainkan untuk para
            dominator pasar yang siap mengambil alih pangsa pencarian secara brutal.
          </p>

          {PILLARS.map((pillar) => (
            <div key={pillar.label} className="mt-14">
              <div className="hairline-gradient" />
              <p className="section-label mt-5 text-slate-400">
                {pillar.label} — {pillar.title}
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {pillar.items.map((item) => (
                  <ArsenalCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Pricing */}
      {/* Bekas section harga. AdoloSEO TIDAK menjual langganan.
          Alasannya ada di komentar kepala berkas patch dan di PR: mesin ini
          belum punya Tenant/User/Subscription, jadi langganan tidak bisa
          ditagih maupun dibatasi; dan jasapromo.id sudah menjual SEO dikelola
          dengan mesin yang sama. Auditnya gratis, penutupnya lewat jasapromo. */}
      <section id="layanan" className="relative scroll-mt-24 overflow-hidden bg-ink-900 py-16 sm:py-20">
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-brand-600/12 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <span aria-hidden="true" className="ey-accent-bar mb-4 h-1 w-14 bg-amber-400" />
          <p className="section-label text-amber-300">Setelah Audit</p>
          <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Auditnya gratis. Yang berbayar adalah perbaikannya.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            Audit di atas menunjukkan di mana website Anda bocor. Memperbaikinya butuh
            pengerjaan &mdash; dan itu dikerjakan oleh tim, bukan oleh Anda sendiri.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            {/* Kartu 1: audit gratis */}
            <div className="card-lift flex flex-col rounded-2xl border border-white/10 bg-ink p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600/15 text-accent">
                <Search className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white">Audit Gratis</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Tanpa biaya, tanpa kartu kredit. Jalankan sendiri, sekarang juga.
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
                {[
                  'Skor SEO, AEO, dan GEO website Anda',
                  'Pemeriksaan Core Web Vitals',
                  'Deteksi pemasangan Google Analytics & Search Console',
                  'Daftar masalah yang ditemukan, apa adanya',
                ].map((butir) => (
                  <li key={butir} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                    <span>{butir}</span>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => document.getElementById('audit')?.scrollIntoView({ behavior: 'smooth' })}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-none bg-accent py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:bg-accent-300"
              >
                Jalankan Audit <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {/* Kartu 2: dikerjakan tim, lewat jasapromo */}
            <div className="card-lift flex flex-col rounded-2xl border border-amber-400/40 bg-ink p-7">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-white">Dikerjakan Tim</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Layanan SEO dikelola oleh JasaPromo &mdash; memakai mesin audit yang sama
                dengan halaman ini.
              </p>
              <p className="mt-6 font-display text-3xl font-bold text-white">
                mulai Rp 1.000.000<span className="ml-1 text-base font-normal text-slate-400">/bulan</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm text-slate-300">
                {[
                  'Audit SEO menyeluruh + optimasi on-page',
                  'Riset dan penargetan kata kunci',
                  'Strategi konten dan pemantauan peringkat',
                  'Laporan berkala dari tim yang mengerjakan',
                ].map((butir) => (
                  <li key={butir} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                    <span>{butir}</span>
                  </li>
                ))}
              </ul>
              <a
                href="https://jasapromo.id/layanan/seo"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-none bg-amber-400 py-3.5 text-sm font-bold uppercase tracking-wide text-slate-950 transition hover:bg-amber-300"
              >
                Lihat Paket JasaPromo <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <p className="mt-8 text-sm text-slate-400">
            Kebutuhan berskala besar atau butuh penanganan lintas kanal?{' '}
            <a
              href={waLink('Halo Tim Adolo, saya baru menjalankan audit di seo.adolo.id dan kebutuhan saya berskala besar. Mohon dibantu.')}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-4 transition hover:text-accent"
            >
              bicara langsung dengan tim
            </a>
            .
          </p>
        </div>
      </section>

      {/* 9. Final CTA */}
      <GrowTogetherCta
        eyebrow="Kedaulatan Digital"
        headline="Siap Mendominasi Pencarian AI?"
        body="Berhenti membiarkan kompetitor mencuri calon pembeli Anda. Bangun kedaulatan digital yang bekerja 24 jam penuh tanpa henti."
        photo={ctaPhoto}
      >
        <button
          onClick={scrollToLayanan}
          className="flex items-center justify-center gap-2 rounded-none bg-accent px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink-900 transition hover:bg-accent-300"
        >
          Mulai Dominasi Sekarang <ArrowRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="rounded-none border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
        >
          Audit Website Gratis
        </button>
      </GrowTogetherCta>

      {/* 10. Footer */}
      <Footer />
    </div>
  );
}

const PILLARS = [
  {
    label: 'Pilar Pertahanan',
    title: 'Integritas & Audit',
    items: [
      { icon: <Binary className="h-5 w-5" />, title: 'Audit Teknis', desc: 'Temukan dan musnahkan error 404, masalah rendering JS, dan hambatan indexing yang mencegah Google merayapi situs Anda.' },
      { icon: <ShieldCheck className="h-5 w-5" />, title: 'Integritas Konten', desc: 'Pindai plagiarisme, keyword stuffing, dan thin content yang membuat algoritma Google menghukum ranking Anda.' },
      { icon: <Unlink className="h-5 w-5" />, title: 'Audit Link', desc: 'Deteksi backlink toxic dan spam yang diam-diam menyabotase otoritas domain Anda dari belakang.' },
      { icon: <Trash2 className="h-5 w-5" />, title: 'Detektor Kanibal', desc: 'Hentikan halaman web Anda sendiri saling membunuh dan berebut ranking untuk kata kunci yang sama.' },
    ],
  },
  {
    label: 'Pilar Intelejen',
    title: 'Kecerdasan Pasar',
    items: [
      { icon: <Search className="h-5 w-5" />, title: 'Riset Kata Kunci', desc: "Intai kata kunci 'Golden Ratio' ber-volume tinggi dengan persaingan rendah yang diabaikan kompetitor Anda." },
      { icon: <TrendingUp className="h-5 w-5" />, title: 'Analitik Trending', desc: 'Tunggangi gelombang pencarian real-time dan jadilah yang pertama mempublikasikan tren sebelum pasar menyadarinya.' },
      { icon: <MapPin className="h-5 w-5" />, title: 'Sovereign Lokal', desc: "Dominasi Google Maps dan pencarian 'Near Me' untuk memonopoli pelanggan di wilayah geografis Anda." },
    ],
  },
  {
    label: 'Pilar Penyerangan',
    title: 'Ekspansi & Konversi',
    items: [
      { icon: <Compass className="h-5 w-5" />, title: 'Arsitektur Funnel', desc: 'Bedah dan tambal kebocoran di halaman konversi Anda. Ubah trafik dingin menjadi pembeli fanatik.' },
      { icon: <Bot className="h-5 w-5" />, title: 'AEO & GEO Readiness', desc: 'Injeksi sinyal AI ke dalam konten agar ChatGPT, Gemini, dan Siri selalu merekomendasikan produk Anda.' },
      { icon: <Layers className="h-5 w-5" />, title: 'Pilar Builder', desc: 'Bangun kluster topik raksasa (Silo Architecture) yang memaksa Google memandang Anda sebagai otoritas absolut.' },
    ],
  },
];

function ArsenalCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card-lift rounded-2xl border border-white/10 bg-ink-800 p-5 hover:border-accent/40">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/15 text-accent">
        {icon}
      </div>
      <h3 className="mt-4 font-display text-lg font-bold leading-snug tracking-tight text-white">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
    </div>
  );
}
