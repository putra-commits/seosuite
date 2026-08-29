'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Globe,
  Building2,
  Phone,
  MapPin,
  Tag,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Bot,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

const AUDIT_STEPS = [
  { label: 'Menghubungi Server & Proteksi SSRF', icon: Globe, detail: 'Memeriksa HTTP status, SSL, dan robots.txt' },
  { label: 'Menganalisis On-Page & Heading', icon: Search, detail: 'Memeriksa Title, Meta Desc, H1 tunggal, dan Alt Gambar' },
  { label: 'Mengukur Kecepatan & Core Web Vitals', icon: Zap, detail: 'Menghitung TTFB, payload HTML, dan respon mobile' },
  { label: 'Audit Sinyal Lokal & Konversi WhatsApp', icon: Phone, detail: 'Mendeteksi link wa.me, NAP, dan schema LocalBusiness' },
  { label: 'Kesiapan Mesin Pencari AI (AEO/GEO)', icon: Bot, detail: 'Mengevaluasi Schema FAQPage, format tanya-jawab, dan E-E-A-T' },
];

export default function CekSeoPage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [vertical, setVertical] = useState('Jasa / Layanan Profesional');

  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Silakan masukkan URL website bisnis Anda');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setCurrentStep(0);

    // Animasi progress tahapan jujur
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < AUDIT_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1800);

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: url.trim(),
          businessName: businessName.trim(),
          whatsapp: whatsapp.trim(),
          city: city.trim(),
          vertical: vertical.trim(),
        }),
      });

      const data = await res.json();
      clearInterval(interval);

      if (!res.ok || data.error) {
        setErrorMessage(data.error || 'Terjadi kesalahan saat memeriksa website.');
        setLoading(false);
        return;
      }

      // Berhasil, arahkan ke halaman laporan publik
      if (data.slug) {
        router.push(`/laporan/${data.slug}`);
      } else {
        setErrorMessage('Gagal membuka laporan hasil audit.');
        setLoading(false);
      }
    } catch {
      clearInterval(interval);
      setErrorMessage('Koneksi terputus. Pastikan URL benar dan server aktif.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#040609] text-zinc-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-indigo-900/20 via-amber-600/10 to-transparent blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 py-16 md:py-24">
        {/* Header Badge */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-300">
              SEOsuite 5-Layer Health & Lead Audit
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Audit Website & Temukan <br />
            <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-indigo-300 bg-clip-text text-transparent">
              3 Kebocoran Pelanggan Anda
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-400 leading-relaxed font-medium">
            Bukan sekadar skor 0–100. Kami menganalisis aspek teknis, kecepatan mobile, tombol konversi WhatsApp lokal, dan kesiapan kutipan di Google AI & ChatGPT dalam 60 detik.
          </p>
        </div>

        {/* Audit Form Container */}
        <div className="relative rounded-3xl bg-zinc-950/70 border border-white/10 backdrop-blur-2xl p-8 md:p-10 shadow-2xl shadow-black/80">
          <AnimatePresence mode="wait">
            {!loading ? (
              <motion.form
                key="audit-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Field 1: URL Target */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                    URL Website Bisnis <span className="text-amber-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                      <Globe className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="contoh: klinikgigisehat.id atau https://tokokopi.com"
                      className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                {/* Grid Fields: Info Bisnis & WhatsApp */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Nama Bisnis */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Nama Brand / Bisnis
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="contoh: Klinik Gigi Sehat Setiabudi"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Nomor WhatsApp */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Nomor WhatsApp Anda <span className="text-zinc-500 text-[10px] lowercase">(untuk update hasil)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="contoh: 081234567890"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Kota */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Kota Operasional
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="contoh: Jakarta Selatan / Bandung"
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                      />
                    </div>
                  </div>

                  {/* Jenis Usaha */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
                      Kategori Industri
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
                        <Tag className="w-4 h-4" />
                      </div>
                      <select
                        value={vertical}
                        onChange={(e) => setVertical(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-sm font-medium"
                      >
                        <option value="Kesehatan / Klinik / Dokter">Kesehatan / Klinik / Dokter</option>
                        <option value="Kuliner / Restoran / Cafe">Kuliner / Restoran / Cafe</option>
                        <option value="Properti / Villa / Hotel">Properti / Villa / Hotel</option>
                        <option value="Jasa / Layanan Profesional">Jasa / Layanan Profesional</option>
                        <option value="Toko Online / Retail / E-commerce">Toko Online / Retail</option>
                        <option value="SaaS / Startup / Software">SaaS / Startup / Software</option>
                        <option value="Media / Portal Berita / Blog">Media / Portal Berita</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </motion.div>
                )}

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-black" />
                  Mulai Audit 5-Layer Sekarang — Gratis
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Seal */}
                <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-zinc-500 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Aman & Terenkripsi
                  </span>
                  <span>•</span>
                  <span>Hasil Instan ~60 Detik</span>
                  <span>•</span>
                  <span>Privasi Data Terlindungi</span>
                </div>
              </motion.form>
            ) : (
              /* Loading & Progress Animation */
              <motion.div
                key="audit-loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="py-8 space-y-8"
              >
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-2">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Sedang Menganalisis Website: <span className="text-amber-400">{url}</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Mohon tunggu sebentar, engine sedang merayapi 5 modul kesehatan digital Anda...
                  </p>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3 max-w-lg mx-auto">
                  {AUDIT_STEPS.map((step, idx) => {
                    const isDone = idx < currentStep;
                    const isCurrent = idx === currentStep;
                    const Icon = step.icon;

                    return (
                      <div
                        key={step.label}
                        className={`flex items-center gap-4 p-3.5 rounded-xl border transition-all ${
                          isDone
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                            : isCurrent
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 shadow-md shadow-amber-500/5'
                              : 'bg-white/[0.01] border-white/5 text-zinc-600 opacity-60'
                        }`}
                      >
                        <div className="shrink-0">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                          ) : isCurrent ? (
                            <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                          ) : (
                            <Icon className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate">{step.label}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{step.detail}</p>
                        </div>
                        {isDone && <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Selesai</span>}
                        {isCurrent && <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest animate-pulse">Memeriksa</span>}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
