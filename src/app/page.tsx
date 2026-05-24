'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, Zap, MapPin, 
  Bot, BarChart3, Lock, Shield, 
  Globe, ChevronRight, LayoutGrid,
  Search, Target, Crown, Rocket, Cpu, Star, XCircle, AlertTriangle
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
    color: 'text-yellow-500',
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
    color: 'text-amber-500',
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
    color: 'text-amber-600',
    features: [
      'Node Sovereign Terdedikasi',
      'Optimasi AI Search (AEO/GEO)',
      'Pelindung Kanibalisasi Konten',
      'Domain Tak Terbatas',
      'Concierge VIP 24/7',
      'Laporan Whitelabel'
    ],
    cta: 'Jadi Berdaulat',
    popular: false
  }
];

interface AuditResult {
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
  const [testState, setTestState] = useState<"idle" | "scanning" | "result" | "error">("idle");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

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
      setTestState("result");
      
    } catch (err: any) {
      setErrorMessage(err.message);
      setTestState("error");
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
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            <span className="text-xl font-bold tracking-tight">SEO<span className="text-zinc-500">suite</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">Fitur</a>
            <a href="#pricing" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">Harga</a>
            <Link href="/dashboard" className="px-5 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold hover:border-yellow-500/50 hover:text-yellow-500 transition-all">
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8"
          >
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            <span className="text-xs font-semibold text-zinc-300">Ubah website Anda menjadi mesin profit</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Website Anda <br />
            <span className="text-zinc-500">Tidak Menghasilkan?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed mb-12"
          >
            Banyak orang punya website tapi <span className="text-white font-bold">cuma jadi pajangan</span>. Masukkan URL Anda di bawah ini dan biarkan AI kami menemukan <span className="text-yellow-500 font-semibold">kebocoran trafik</span> Anda secara instan.
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
                  placeholder="contoh: bernas.id" 
                  className="flex-1 bg-transparent border-none outline-none text-white px-6 py-4 placeholder:text-zinc-600 font-medium"
                  required
                />
                <button type="submit" className="px-8 py-4 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Audit Mesin Profit <ArrowRight className="w-5 h-5" />
                </button>
              </form>
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

            {testState === "result" && auditResult && (
              <div className="p-8 bg-[#1a0f0f] border border-red-900/50 rounded-3xl backdrop-blur-xl text-left shadow-[0_0_50px_rgba(220,38,38,0.15)] animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col gap-6">
                  
                  {/* Global Score Header */}
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-red-950 border border-red-900 flex items-center justify-center shrink-0 shadow-inner">
                      <span className="text-2xl font-bold text-red-500">{auditResult.finalScore}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="text-lg font-bold text-red-500">Kritis: Otoritas AI Rendah</h3>
                      </div>
                      <p className="text-zinc-300 text-sm leading-relaxed">
                        Website <strong className="text-white">{auditResult.url}</strong> kehilangan potensi klik AI (ChatGPT/Perplexity) dan pencarian organik.
                      </p>
                    </div>
                  </div>

                  {/* 4 Pillars Score */}
                  <div className="grid grid-cols-4 gap-4 border-y border-red-900/30 py-4">
                    <div className="text-center">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">SEO Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.seoScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{auditResult.seoScore}</p>
                    </div>
                    <div className="text-center border-l border-zinc-800/50">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">CWV Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.cwvScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{auditResult.cwvScore}</p>
                    </div>
                    <div className="text-center border-l border-zinc-800/50">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">AEO Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.aeoScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{auditResult.aeoScore}</p>
                    </div>
                    <div className="text-center border-l border-zinc-800/50">
                      <p className="text-xs font-semibold text-zinc-500 mb-1">GEO Score</p>
                      <p className={`text-xl md:text-2xl font-bold ${auditResult.geoScore > 70 ? 'text-green-500' : 'text-red-500'}`}>{auditResult.geoScore}</p>
                    </div>
                  </div>

                  {/* Analytics Status */}
                  <div className="flex gap-4 mb-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${auditResult.hasGA ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                       {auditResult.hasGA ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                       <span className="text-xs font-bold">Google Analytics (GA4)</span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${auditResult.hasGSC ? 'bg-green-500/10 border-green-500/30 text-green-500' : 'bg-red-500/10 border-red-500/30 text-red-500'}`}>
                       {auditResult.hasGSC ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                       <span className="text-xs font-bold">Search Console (GSC)</span>
                    </div>
                  </div>

                  {/* Issues List */}
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-3">Temuan Utama:</h4>
                    <ul className="space-y-3 mb-6 text-sm font-medium text-zinc-400">
                      {auditResult.issues.map((issue, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> 
                          <span>{issue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 text-white font-bold hover:opacity-90 transition-all shadow-[0_10px_30px_rgba(220,38,38,0.3)]"
                  >
                    Perbaiki Sekarang (Lihat Paket)
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
            <h2 className="text-xs font-bold text-yellow-500 tracking-wider mb-4">MASALAH TERSEMBUNYI</h2>
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
               <h2 className="text-xs font-bold text-yellow-500 tracking-wider mb-4">EFISIENSI MODAL</h2>
               <h3 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6 text-white">
                 Berhenti Membayar <span className="text-zinc-500">Untuk Trafik Sementara.</span>
               </h3>
               <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                 Iklan berbayar (Paid Ads) adalah <span className="text-red-400 font-semibold">biaya variabel</span> yang hilang saat Anda berhenti membayar. SEO & AEO adalah <span className="text-yellow-500 font-semibold">aset modal</span> yang terus tumbuh dan menghasilkan profit secara eksponensial.
               </p>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-1.5 h-12 bg-red-500 rounded-full" />
                     <div>
                        <p className="text-base font-semibold text-white">Iklan Berbayar (Ads)</p>
                        <p className="text-sm text-zinc-500">ROI Statis • Biaya Terus Meningkat • Kepercayaan Rendah</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-1.5 h-12 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
                     <div>
                        <p className="text-base font-semibold text-white">SEOsuite Ecosystem</p>
                        <p className="text-sm text-zinc-500">ROI Eksponensial • Aset Permanen • Otoritas Tertinggi</p>
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
                    className="w-full bg-red-500/20 border-t-2 border-red-500/50 rounded-t-lg flex items-center justify-center"
                  >
                     <span className="text-xs font-bold text-red-500 -rotate-90">ADS</span>
                  </motion.div>
                  <p className="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">Bulan 1</p>
               </div>
               <div className="flex-1 flex flex-col justify-end gap-2 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
                    className="w-full bg-red-500/20 border-t-2 border-red-500/50 rounded-t-lg"
                  />
                  <p className="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">Bulan 6</p>
               </div>
               <div className="flex-1 flex flex-col justify-end gap-2 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '80%' }} viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-yellow-500/30 border-t-2 border-yellow-500 rounded-t-lg flex items-center justify-center shadow-[0_-20px_40px_rgba(234,179,8,0.1)]"
                  >
                     <span className="text-xs font-bold text-yellow-500 -rotate-90">ORGANIK</span>
                  </motion.div>
                  <p className="text-[10px] text-center font-semibold text-zinc-500 uppercase tracking-wider">Bulan 12</p>
               </div>
               
               <div className="absolute top-8 left-8 p-4 bg-[#090b10]/90 backdrop-blur border border-zinc-800 rounded-xl">
                  <p className="text-[10px] font-semibold text-yellow-500 uppercase tracking-widest mb-1">Pertumbuhan Kumulatif</p>
                  <p className="text-2xl font-bold text-white">+440%</p>
               </div>
            </div>
          </div>

          {/* AI Search Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-16 border-t border-white/5">
             <div className="space-y-3">
                <div className="text-4xl font-bold text-white tracking-tight">60%</div>
                <p className="text-sm font-semibold text-zinc-400">Zero-Click Searches</p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Sebagian besar pencarian kini berakhir tanpa klik. Kami mengoptimalkan AEO agar brand Anda tetap muncul sebagai jawaban utama AI.
                </p>
             </div>
             <div className="space-y-3">
                <div className="text-4xl font-bold text-white tracking-tight">4.4x</div>
                <p className="text-sm font-semibold text-zinc-400">Nilai Trafik Sitasi AI</p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Pengunjung yang datang dari sitasi AI (ChatGPT/Perplexity) memiliki nilai konversi 4.4 kali lebih tinggi dibanding organik biasa.
                </p>
             </div>
             <div className="space-y-3">
                <div className="text-4xl font-bold text-white tracking-tight">35%</div>
                <p className="text-sm font-semibold text-zinc-400">Boost Klik Sitasi</p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Brand yang disitasi dalam AI Overviews menerima klik 35% lebih banyak dibanding yang hanya muncul di hasil tradisional.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-32 relative border-t border-white/5 bg-[#090b10]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-20">
            <h2 className="text-xs font-bold text-yellow-500 tracking-wider mb-4">ARSITEKTUR HARGA</h2>
            <h3 className="text-4xl font-bold tracking-tight">Pilih tingkat <span className="text-zinc-500">Dominasi</span> Anda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-8 rounded-3xl bg-[#131316] border transition-all relative group overflow-hidden ${
                  tier.popular ? 'border-yellow-500/50 shadow-[0_0_50px_rgba(234,179,8,0.05)]' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 px-4 py-1.5 bg-yellow-500 text-black text-[10px] font-bold uppercase tracking-wider rounded-bl-xl">
                    Paling Strategis
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-xl bg-[#090b10] border border-zinc-800 flex items-center justify-center mb-6 ${tier.color}`}>
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
                      <Check className={`w-4 h-4 shrink-0 ${tier.color}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleCheckout(tier.name)}
                  disabled={loading === tier.name}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    tier.popular 
                    ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {loading === tier.name ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    tier.cta
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
