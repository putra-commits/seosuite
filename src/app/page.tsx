'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, Zap, MapPin, 
  Bot, BarChart3, Lock, Shield, 
  Globe, ChevronRight, LayoutGrid,
  Search, Target, Crown, Rocket, Cpu, Star, XCircle, AlertTriangle,
  ShieldCheck, Binary, Unlink, Trash2, TrendingUp, Compass, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/footer';

const TIERS = [
  {
    name: 'Personal',
    price: 'Rp 499.000',
    period: '/bulan',
    desc: 'Bangun otoritas digital dan personal branding yang tak terkalahkan.',
    icon: Rocket,
    color: 'text-amber-500/80',
    features: [
      'Audit Otoritas Personal',
      'Riset Kata Kunci Niche',
      'Monitor Core Web Vitals',
      '1 Properti Domain',
      'Optimasi Media Sosial'
    ],
    cta: 'Mulai Branding',
    popular: false
  },
  {
    name: 'Merchant',
    price: 'Rp 1.499.000',
    period: '/bulan',
    desc: 'Untuk pemilik ecommerce yang bosan dengan potongan marketplace.',
    icon: Cpu,
    color: 'text-amber-400',
    features: [
      'Audit Arsitektur Konversi',
      'Sinkronisasi GSC/GA4 Harian',
      'Pemantauan Pirate Funnel',
      'Strategi Bebas Marketplace',
      '5 Properti Domain',
      'Respon Prioritas'
    ],
    cta: 'Kejar Profit',
    popular: true
  },
  {
    name: 'Sovereign',
    price: 'Rp 4.999.000',
    period: '/bulan',
    desc: 'Dominasi mutlak untuk jaringan enterprise volume tinggi.',
    icon: Crown,
    color: 'text-amber-500',
    features: [
      'Node Sovereign Terdedikasi',
      'Optimasi AI Search (AEO/GEO)',
      'Pelindung Kanibalisasi Konten',
      'Domain Tak Terbatas',
      'Concierge VIP 24/7',
      'Laporan Whitelabel'
    ],
    cta: 'Konsultasi VIP (WhatsApp)',
    popular: false,
    isEnterprise: true,
    scarcity: 'Sisa kuota: 2 slot bulan ini'
  }
];

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
  const [loading, setLoading] = useState<string | null>(null);
  
  // Test Website Flow State
  const [testUrl, setTestUrl] = useState("");
  const [testState, setTestState] = useState<"idle" | "scanning" | "lead_capture" | "result" | "error">("idle");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Lead Capture State
  const [leadName, setLeadName] = useState("");
  const [leadWa, setLeadWa] = useState("");
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

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
      
    } catch (err: any) {
      setErrorMessage(err.message);
      setTestState("error");
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadWa) return;
    
    setIsSubmittingLead(true);
    try {
      // Simulate API call to save lead
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Lead captured:', { name: leadName, wa: leadWa, url: testUrl });
      
      setTestState("result");
    } catch (err) {
      console.error("Failed to capture lead", err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleCheckout = async (tierName: string) => {
    setLoading(tierName);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierName }),
      });
      const data = await res.json();
      
      if (data.token) {
        // @ts-ignore
        window.snap.pay(data.token, {
          onSuccess: (result: any) => console.log('success', result),
          onPending: (result: any) => console.log('pending', result),
          onError: (result: any) => console.log('error', result),
          onClose: () => console.log('customer closed the popup without finishing the payment'),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-white selection:bg-yellow-500/30">
      {/* Midtrans Snap Script */}
      <script
        type="text/javascript"
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#090b10]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <Zap size={16} className="text-black fill-black" />
            </div>
            <p className="text-xl font-bold text-white tracking-tight">
              SEO<span className="text-zinc-500 font-medium">suite</span>
            </p>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">Fitur</a>
            <a href="#pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors">Harga</a>
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-[0.2em] hover:border-yellow-500/50 hover:text-yellow-500 transition-all shadow-[0_0_15px_rgba(234,179,8,0.05)]">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-24 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-5xl mx-auto px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-8 shadow-2xl"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Pusat Komando Akuisisi</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1] text-white"
          >
            Website Anda <br />
            <span className="text-zinc-600">Hanya Jadi Beban Biaya Server?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed mb-12"
          >
            Berhenti membakar uang untuk <span className="text-red-500 font-bold">Paid Ads</span> berdarah-darah. Biarkan AI kami membedah isi perut website Anda dan membuktikan <span className="text-yellow-500 font-bold">mengapa kompetitor mencuri 90% pelanggan Anda</span> setiap harinya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto"
          >
            {(testState === "idle" || testState === "error") && (
              <form onSubmit={handleTestWebsite} className="flex flex-col sm:flex-row gap-4 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-xl">
                <input 
                  type="text" 
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  placeholder="contoh: website-pesaing-anda.com" 
                  className="flex-1 bg-transparent border-none outline-none text-white px-6 py-4 placeholder:text-zinc-600 font-medium"
                  required
                />
                <button type="submit" className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Bongkar Kebocoran Website <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            )}

            {(testState === "idle" || testState === "error") && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-500"
              >
                <Shield className="w-4 h-4 text-yellow-500" />
                Lebih dari 4.200+ pemilik bisnis telah menyadari kebodohan strategi SEO mereka minggu ini.
              </motion.div>
            )}

            {testState === "error" && (
              <p className="mt-4 text-sm text-red-500 font-medium">{errorMessage}</p>
            )}

            {testState === "scanning" && (
              <div className="p-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center gap-6">
                <div className="w-12 h-12 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold text-white animate-pulse">Menganalisis Arsitektur AI...</h3>
                  <p className="text-sm font-medium text-zinc-500">Membaca HTML dan mengevaluasi SEO, AEO, serta GEO.</p>
                </div>
              </div>
            )}

            {testState === "lead_capture" && (
              <div className="p-8 bg-zinc-900/90 border border-amber-500/20 rounded-3xl backdrop-blur-xl text-left shadow-[0_0_40px_rgba(245,158,11,0.05)] animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Audit Selesai!</h3>
                  <p className="text-zinc-400 text-sm">Kami menemukan <strong className="text-amber-400 font-bold">celah potensial</strong> di <span className="text-white font-semibold">{testUrl}</span>. Masukkan WhatsApp Anda untuk melihat skor dan menerima Laporan PDF Eksekutif.</p>
                </div>

                <form onSubmit={handleSubmitLead} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="John Doe" 
                      className="w-full bg-zinc-950 border border-white/5 outline-none text-white px-4 py-3 rounded-xl focus:border-amber-500 transition-colors placeholder:text-zinc-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">Nomor WhatsApp</label>
                    <input 
                      type="tel" 
                      value={leadWa}
                      onChange={(e) => setLeadWa(e.target.value)}
                      placeholder="+62 812..." 
                      className="w-full bg-zinc-950 border border-white/5 outline-none text-white px-4 py-3 rounded-xl focus:border-amber-500 transition-colors placeholder:text-zinc-700"
                      required
                    />
                  </div>
                  <button type="submit" disabled={isSubmittingLead} className="w-full py-4 mt-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold uppercase tracking-wider text-xs hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                    {isSubmittingLead ? <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" /> : 'Buka Kunci Laporan Audit'} <Lock className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[10px] text-center text-zinc-600 mt-6 font-medium">Data Anda aman 100%. Kami hanya akan mengirimkan PDF hasil audit ke WhatsApp ini.</p>
              </div>
            )}

            {testState === "result" && auditResult && (
              <div className="p-8 bg-zinc-900/95 border border-amber-500/20 rounded-3xl backdrop-blur-xl text-left shadow-[0_0_50px_rgba(245,158,11,0.05)] animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col gap-6">
                  
                  {/* Global Score Header */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-950 border border-amber-500/30 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-2xl font-black text-amber-400">{auditResult.finalScore}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Hasil Audit Arsitektur</h3>
                      </div>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        Ditemukan <strong className="text-amber-400 font-bold">celah kebocoran konversi</strong> pada domain <strong className="text-white font-semibold">{auditResult.url}</strong>. ChatGPT & mesin pencari AI lainnya berpotensi melewatkan produk Anda jika arsitektur data tidak segera dioptimalkan.
                      </p>
                    </div>
                  </div>

                  {/* 4 Pillars Score */}
                  <div className="grid grid-cols-4 gap-4 border-y border-zinc-800/80 py-4">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">SEO Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.seoScore > 70 ? 'text-amber-400' : 'text-zinc-400'}`}>{auditResult.seoScore}</p>
                    </div>
                    <div className="text-center border-l border-zinc-800/50">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">CWV Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.cwvScore > 70 ? 'text-amber-400' : 'text-zinc-400'}`}>{auditResult.cwvScore}</p>
                    </div>
                    <div className="text-center border-l border-zinc-800/50">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">AEO Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.aeoScore > 70 ? 'text-amber-400' : 'text-zinc-400'}`}>{auditResult.aeoScore}</p>
                    </div>
                    <div className="text-center border-l border-zinc-800/50">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">GEO Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.geoScore > 70 ? 'text-amber-400' : 'text-zinc-400'}`}>{auditResult.geoScore}</p>
                    </div>
                  </div>

                  {/* Analytics Status */}
                  <div className="flex gap-4 mb-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${auditResult.hasGA ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                       {auditResult.hasGA ? <Check className="w-3 h-3 text-amber-400" /> : <XCircle className="w-3 h-3 text-zinc-600" />}
                       <span className="text-xs font-bold">Google Analytics (GA4)</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${auditResult.hasGSC ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                       {auditResult.hasGSC ? <Check className="w-3 h-3 text-amber-400" /> : <XCircle className="w-3 h-3 text-zinc-600" />}
                       <span className="text-xs font-bold">Search Console (GSC)</span>
                    </div>
                  </div>

                  {/* Issues List */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Rekomendasi Perbaikan Prioritas:</h4>
                    <ul className="space-y-3 mb-6 text-sm font-medium text-zinc-400">
                      {auditResult.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /> 
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-4 rounded-xl bg-amber-500 text-zinc-950 font-bold uppercase tracking-wider text-xs hover:bg-amber-400 transition-all shadow-[0_0_30px_rgba(245,158,11,0.2)]"
                  >
                    Selamatkan Bisnis Saya Sekarang
                  </button>
                  <button 
                    onClick={() => { setTestState("idle"); setTestUrl(""); }}
                    className="w-full py-2 text-xs font-semibold text-zinc-500 hover:text-white text-center transition-colors"
                  >
                    Audit URL Lain
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section id="features" className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-sm font-black text-yellow-500 mb-4">Masalah Tersembunyi</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
              Website Anda <span className="text-zinc-500">Bisa Menghasilkan Lebih Banyak.</span>
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
              Kenapa website kompetitor lebih ramai? Karena mereka menggunakan <span className="text-white font-semibold">Arsitektur Konversi</span>. SEO saja tidak cukup di era AI. Anda butuh optimasi yang membuat website Anda "berbicara" kepada mesin pencari AI dan mengarahkan trafik ke dompet Anda.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Profit-Oriented SEO</p>
                  <p className="text-sm text-zinc-500">Bukan cuma cari ranking, tapi cari pembeli.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">AI Search Dominance (AEO & GEO)</p>
                  <p className="text-sm text-zinc-500">Pastikan bisnis Anda jadi jawaban utama di ChatGPT & Perplexity.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="p-8 rounded-3xl bg-[#131316] border border-zinc-800 shadow-2xl relative z-10">
               <h4 className="text-xl font-bold text-white mb-6">Siapa Yang Butuh SEOsuite?</h4>
               <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-[#090b10] border border-zinc-800 group hover:border-yellow-500/50 transition-all">
                     <p className="text-sm font-semibold text-yellow-500 mb-2">Personal Branding</p>
                     <p className="text-sm text-zinc-400 leading-relaxed">Bangun otoritas digital yang tak terbantahkan. Jadilah wajah pertama yang muncul saat nama atau bidang Anda dicari.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#090b10] border border-zinc-800 group hover:border-amber-500/50 transition-all">
                     <p className="text-sm font-semibold text-amber-500 mb-2">Pemilik Ecommerce</p>
                     <p className="text-sm text-zinc-400 leading-relaxed">Bosan dengan potongan marketplace yang mencekik? Ubah toko online mandiri Anda menjadi mesin penjualan yang efisien.</p>
                  </div>
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-yellow-600/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Comparison & Research Section */}
      <section className="py-24 bg-[#050505] relative overflow-hidden border-t border-white/5">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
            <div>
               <h2 className="text-sm font-black text-yellow-500 mb-4">Salesman 24 Jam Non-Stop</h2>
               <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6 text-white">
                 Jadikan ChatGPT, Gemini & Siri <span className="text-zinc-500">Sebagai Salesman Anda.</span>
               </h3>
               <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                 Berhenti membakar uang untuk <span className="text-red-400 font-semibold">Paid Ads</span>. Saatnya membangun aset digital yang bekerja 24 jam sehari, 7 hari seminggu tanpa minta naik gaji. Dengan menguasai <span className="text-yellow-500 font-semibold">SEO, AEO, dan GEO</span>, Anda merekrut algoritma terbesar di dunia untuk menjual produk Anda saat Anda sedang tidur.
               </p>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-1.5 h-12 bg-red-500 rounded-full" />
                     <div>
                        <p className="text-base font-semibold text-white">Iklan Berbayar (Ads)</p>
                        <p className="text-sm text-zinc-500">ROI Statis • Biaya Terus Meningkat • Berhenti Saat Saldo Habis</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-1.5 h-12 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                     <div>
                        <p className="text-base font-semibold text-white">Ekosistem SEO, AEO & GEO</p>
                        <p className="text-sm text-zinc-500">ROI Eksponensial • Bekerja 24 Jam • Dipercaya oleh AI</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#131316] border border-zinc-800 relative h-[360px] flex items-end gap-4">
               {/* Mock Graph */}
               <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-zinc-800 w-full opacity-10" />
                  <div className="border-t border-zinc-800 w-full opacity-10" />
                  <div className="border-t border-zinc-800 w-full opacity-20" />
               </div>
               
               <div className="flex-1 flex flex-col justify-end gap-2 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
                    className="w-full bg-zinc-800/40 border-t-2 border-zinc-700/60 rounded-t-lg flex items-center justify-center"
                  >
                     <span className="text-xs font-bold text-zinc-500 -rotate-90">ADS</span>
                  </motion.div>
                  <p className="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">Bulan 1</p>
               </div>
               <div className="flex-1 flex flex-col justify-end gap-2 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
                    className="w-full bg-zinc-800/40 border-t-2 border-zinc-700/60 rounded-t-lg"
                  />
                  <p className="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">Bulan 6</p>
               </div>
               <div className="flex-1 flex flex-col justify-end gap-2 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '80%' }} viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-amber-500/10 border-t-2 border-amber-500 rounded-t-lg flex items-center justify-center shadow-[0_-20px_40px_rgba(245,158,11,0.05)]"
                  >
                     <span className="text-xs font-bold text-amber-400 -rotate-90">ORGANIK</span>
                  </motion.div>
                  <p className="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">Bulan 12</p>
               </div>
               
               <div className="absolute top-8 left-8 p-4 bg-[#090b10]/90 backdrop-blur border border-zinc-800 rounded-xl">
                  <p className="text-[10px] font-semibold text-amber-400 uppercase tracking-widest mb-1">Pertumbuhan Kumulatif</p>
                  <p className="text-2xl font-bold text-white">+440%</p>
               </div>
            </div>
          </div>

          {/* Trifecta Dominasi Digital */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-16 border-t border-white/5">
             <div className="space-y-3">
                <div className="text-3xl font-bold text-white tracking-tight">1. SEO <span className="text-xs font-semibold text-yellow-500 uppercase tracking-widest block mt-2">Penakluk Google</span></div>
                <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                  <strong className="text-white">Search Engine Optimization:</strong> Menempatkan website Anda di peringkat tertinggi pencarian tradisional Google, menyergap calon pembeli secara organik tepat saat mereka mencari solusi yang Anda tawarkan.
                </p>
             </div>
             <div className="space-y-3">
                <div className="text-3xl font-bold text-white tracking-tight">2. AEO <span className="text-xs font-semibold text-amber-500 uppercase tracking-widest block mt-2">Penakluk ChatGPT & Gemini</span></div>
                <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                  <strong className="text-white">Answer Engine Optimization:</strong> Mengkondisikan konten Anda agar direkomendasikan sebagai "Jawaban Terbaik Mutlak" saat prospek bertanya kepada Chatbot AI pintar seputar industri Anda.
                </p>
             </div>
             <div className="space-y-3">
                <div className="text-3xl font-bold text-white tracking-tight">3. GEO <span className="text-xs font-semibold text-amber-600 uppercase tracking-widest block mt-2">Penakluk Siri & Voice AI</span></div>
                <p className="text-sm text-zinc-400 leading-relaxed pt-2">
                  <strong className="text-white">Generative Engine Optimization:</strong> Mengoptimasi keberadaan merek Anda agar menjadi rujukan utama saat pengguna melakukan pencarian melalui perangkat suara cerdas dan ekosistem pintar Apple.
                </p>
             </div>
          </div>
        </div>
      </section>
      {/* The Sovereign Arsenal Section */}
      <section id="arsenal" className="py-24 relative border-t border-white/5 bg-[#090b10] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full pointer-events-none opacity-50">
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-600/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-[10px] font-black text-yellow-500 mb-4 uppercase tracking-[0.3em]">Sovereign Arsenal</h2>
            <h3 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 text-white">
              Bukan Sekadar Alat, Ini <span className="text-zinc-600">Senjata Pemusnah Massal Kompetitor.</span>
            </h3>
            <p className="text-zinc-400 text-lg leading-relaxed">
              10 Fitur <strong className="text-white">Enterprise-grade</strong> yang didesain bukan untuk orang awam, melainkan untuk para dominator pasar yang siap mengambil alih pangsa pencarian secara brutal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Pillar 1: Pertahanan */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-zinc-400" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white">Integritas & Audit</h4>
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Pilar Pertahanan</p>
                 </div>
              </div>
              
              <ArsenalCard 
                icon={<Binary />} color="zinc"
                title="Audit Teknis" 
                desc="Temukan dan musnahkan error 404, masalah rendering JS, dan hambatan indexing yang mencegah Google merayapi situs Anda." 
              />
              <ArsenalCard 
                icon={<ShieldCheck />} color="zinc"
                title="Integritas Konten" 
                desc="Pindai plagiarisme, keyword stuffing, dan thin content yang membuat algoritma Google menghukum ranking Anda." 
              />
              <ArsenalCard 
                icon={<Unlink />} color="zinc"
                title="Audit Link" 
                desc="Deteksi backlink toxic dan spam yang diam-diam menyabotase otoritas domain Anda dari belakang." 
              />
              <ArsenalCard 
                icon={<Trash2 />} color="zinc"
                title="Detektor Kanibal" 
                desc="Hentikan halaman web Anda sendiri saling membunuh dan berebut ranking untuk kata kunci yang sama." 
              />
            </div>

            {/* Pillar 2: Intelejen */}
            <div className="space-y-6 mt-12 lg:mt-0">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Target className="w-5 h-5 text-amber-500" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white">Kecerdasan Pasar</h4>
                    <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest">Pilar Intelejen</p>
                 </div>
              </div>

              <ArsenalCard 
                icon={<Search />} color="amber"
                title="Riset Kata Kunci" 
                desc="Intai kata kunci 'Golden Ratio' ber-volume tinggi dengan persaingan rendah yang diabaikan kompetitor Anda." 
              />
              <ArsenalCard 
                icon={<TrendingUp />} color="amber"
                title="Analitik Trending" 
                desc="Tunggangi gelombang pencarian real-time dan jadilah yang pertama mempublikasikan tren sebelum pasar menyadarinya." 
              />
              <ArsenalCard 
                icon={<MapPin />} color="amber"
                title="Sovereign Lokal" 
                desc="Dominasi Google Maps dan pencarian 'Near Me' untuk memonopoli pelanggan di wilayah geografis Anda." 
              />
            </div>

            {/* Pillar 3: Penyerangan */}
            <div className="space-y-6 mt-12 lg:mt-0">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-yellow-500" />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold text-white">Ekspansi & Konversi</h4>
                    <p className="text-xs font-semibold text-yellow-600 uppercase tracking-widest">Pilar Penyerangan</p>
                 </div>
              </div>

              <ArsenalCard 
                icon={<Compass />} color="yellow"
                title="Arsitektur Funnel" 
                desc="Bedah dan tambal kebocoran di halaman konversi Anda. Ubah trafik dingin menjadi pembeli fanatik." 
              />
              <ArsenalCard 
                icon={<Bot />} color="yellow"
                title="AEO & GEO Readiness" 
                desc="Injeksi sinyal AI ke dalam konten agar ChatGPT, Gemini, dan Siri selalu merekomendasikan produk Anda." 
              />
              <ArsenalCard 
                icon={<Layers />} color="yellow"
                title="Pilar Builder" 
                desc="Bangun kluster topik raksasa (Silo Architecture) yang memaksa Google memandang Anda sebagai otoritas absolut." 
              />
            </div>

          </div>
        </div>
      </section>
      {/* Pricing */}
      <section id="pricing" className="py-32 relative border-t border-white/5 bg-[#090b10]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-[10px] font-black text-yellow-500 mb-4 uppercase tracking-[0.3em]">Arsitektur Harga</h2>
            <h3 className="text-4xl font-black tracking-tighter text-white">Pilih tingkat <span className="text-zinc-600">Dominasi</span> Anda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[2.5rem] bg-[#0c0f16]/60 border transition-all relative group overflow-hidden ${
                  tier.popular 
                  ? 'border-amber-500/40 shadow-[0_0_50px_rgba(245,158,11,0.06)] bg-white/[0.02] backdrop-blur-xl hover:border-amber-500/60' 
                  : 'bg-white/[0.01] border border-white/5 hover:border-white/15 hover:bg-white/[0.03] backdrop-blur-xl'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest rounded-bl-xl">
                    Paling Strategis
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center mb-6 ${tier.color}`}>
                  <tier.icon className="w-6 h-6" />
                </div>

                <h4 className="text-xl font-bold text-white mb-2">{tier.name}</h4>
                <p className="text-sm text-zinc-500 mb-8 leading-relaxed">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-3xl font-bold text-white tracking-tight">{tier.price}</span>
                  <span className="text-sm text-zinc-500 font-medium">{tier.period}</span>
                </div>

                <div className="space-y-4 mb-10">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                      <Check className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {tier.scarcity && (
                  <div className="mb-4 flex items-center gap-2 justify-center py-2.5 px-4 rounded-xl bg-amber-500/5 border border-amber-500/10 text-amber-300/80 text-xs font-semibold uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    {tier.scarcity}
                  </div>
                )}

                <button 
                  onClick={() => {
                    if (tier.isEnterprise) {
                      const text = encodeURIComponent("Halo Tim SEOsuite, saya tertarik dengan paket Sovereign dan ingin konsultasi arsitektur Enterprise untuk bisnis saya.");
                      window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
                    } else {
                      handleCheckout(tier.name);
                    }
                  }}
                  disabled={loading === tier.name}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border ${
                    tier.popular 
                    ? 'bg-amber-500 text-zinc-950 hover:bg-amber-400 border-transparent shadow-[0_0_30px_rgba(245,158,11,0.2)]' 
                    : 'bg-zinc-900/80 hover:bg-zinc-800/80 border-white/10 text-zinc-300 hover:text-white'
                  }`}
                >
                  {loading === tier.name ? (
                    <div className="w-5 h-5 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                  ) : (
                    tier.cta
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 relative border-t border-white/5 bg-[#050505] overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-yellow-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
            Siap Mendominasi <br /> <span className="text-yellow-500">Pencarian AI?</span>
          </h2>
          <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            Berhenti membiarkan kompetitor mencuri calon pembeli Anda. Bangun kedaulatan digital yang bekerja 24 jam penuh tanpa henti.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Mulai Dominasi Sekarang <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold hover:bg-zinc-800 transition-colors w-full sm:w-auto"
            >
              Audit Website Gratis
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ArsenalCard({ icon, title, desc, color }: any) {
  const colorMap: any = {
    zinc: 'hover:border-zinc-500',
    amber: 'hover:border-amber-500',
    yellow: 'hover:border-yellow-500',
  };
  const iconColorMap: any = {
    zinc: 'text-zinc-400 group-hover:text-white',
    amber: 'text-amber-600 group-hover:text-amber-400',
    yellow: 'text-yellow-600 group-hover:text-yellow-400',
  };

  return (
    <div className={`p-6 rounded-3xl bg-[#131316] border border-zinc-800 transition-all duration-300 group cursor-default ${colorMap[color]}`}>
      <div className={`w-12 h-12 rounded-xl bg-[#090b10] border border-zinc-800 flex items-center justify-center mb-5 transition-colors ${iconColorMap[color]}`}>
        {icon}
      </div>
      <h5 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-white transition-colors">{title}</h5>
      <p className="text-sm text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}
