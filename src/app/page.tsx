'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowRight, Check, Zap, MapPin, 
  Bot, BarChart3, Lock, Shield, 
  Globe, ChevronRight, LayoutGrid,
  Search, Target, Crown, Rocket, Cpu, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import Footer from './components/footer';

const TIERS = [
  {
    name: 'Personal',
    price: 'Rp 499.000',
    period: '/bulan',
    desc: 'Bangun otoritas digital dan personal branding yang tak terkalahkan.',
    icon: Rocket,
    color: 'text-blue-500',
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
    color: 'text-emerald-500',
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
    cta: 'Jadi Berdaulat',
    popular: false
  }
];

export default function LandingPage() {
  const [loading, setLoading] = useState<string | null>(null);

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
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
      {/* Midtrans Snap Script */}
      <script
        type="text/javascript"
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-blue-600 fill-blue-600" />
            <span className="text-2xl font-black tracking-tighter uppercase italic">SEO<span className="text-zinc-600">suite</span></span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a href="#features" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Fitur</a>
            <a href="#pricing" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">Harga</a>
            <Link href="/dashboard" className="px-6 py-2 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-black uppercase tracking-widest hover:border-zinc-600 transition-all">
              Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 mb-8"
          >
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Ubah Website Anda Menjadi Mesin Profit</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] italic"
          >
            Website Anda <br />
            <span className="text-zinc-700">Tidak Menghasilkan?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-2xl max-w-4xl mx-auto font-bold leading-relaxed mb-12"
          >
            Banyak orang punya website tapi <span className="text-white italic">cuma jadi pajangan</span>. SEOsuite hadir untuk mengoptimalkan kekuatan yang selama ini Anda abaikan. Bukan cuma SEO, tapi <span className="text-blue-500">GEO, AEO, Funnel,</span> dan <span className="text-emerald-500">Audit Konversi</span> untuk mendongkrak revenue nyata.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <button className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg uppercase tracking-tighter hover:bg-zinc-200 transition-all flex items-center gap-3">
              Mulai Optimasi Sekarang <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-10 py-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-black text-lg uppercase tracking-tighter hover:border-zinc-600 transition-all">
              Audit Website Gratis
            </button>
          </motion.div>
        </div>
      </section>

      {/* Pain Point Section */}
      <section id="features" className="py-32 border-t border-white/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div>
            <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.4em] mb-6">Masalah Tersembunyi</h2>
            <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none mb-8">
              Website Anda <span className="text-zinc-700">Bisa Menghasilkan Lebih Banyak.</span>
            </h3>
            <p className="text-zinc-500 text-lg font-bold leading-relaxed mb-8">
              Kenapa website kompetitor lebih ramai? Karena mereka menggunakan <span className="text-white">Arsitektur Konversi</span>. SEO saja tidak cukup di era AI. Anda butuh optimasi yang membuat website Anda "berbicara" kepada mesin pencari AI (AEO/GEO) dan mengarahkan trafik ke dompet Anda (Funnel & Pirate Framework).
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase italic">Profit-Oriented SEO</p>
                  <p className="text-xs text-zinc-500">Bukan cuma cari ranking, tapi cari pembeli.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase italic">AI Search Dominance</p>
                  <p className="text-xs text-zinc-500">Pastikan bisnis Anda jadi jawaban utama di ChatGPT & Perplexity.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="p-8 rounded-[3rem] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 shadow-2xl relative z-10">
               <h4 className="text-xl font-black text-white mb-6 uppercase italic tracking-tighter">Siapa Yang Butuh SEOsuite?</h4>
               <div className="space-y-6">
                  <div className="p-6 rounded-2xl bg-black border border-zinc-800 group hover:border-blue-500/50 transition-all">
                     <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Personal Branding</p>
                     <p className="text-sm text-zinc-400 font-medium">Bangun otoritas digital yang tak terbantahkan. Jadilah wajah pertama yang muncul saat nama atau bidang Anda dicari.</p>
                  </div>
                  <div className="p-6 rounded-2xl bg-black border border-zinc-800 group hover:border-emerald-500/50 transition-all">
                     <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">Pemilik Ecommerce</p>
                     <p className="text-sm text-zinc-400 font-medium">Bosan dengan potongan marketplace yang mencekik? Ubah toko online mandiri Anda menjadi mesin penjualan yang efisien.</p>
                  </div>
               </div>
            </div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      {/* Comparison & Research Section */}
      <section className="py-40 bg-[#050505] relative overflow-hidden border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
            <div>
               <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-6">Efisiensi Modal</h2>
               <h3 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none mb-8 text-white">
                 Berhenti Membayar <span className="text-zinc-700">Untuk Trafik Sementara.</span>
               </h3>
               <p className="text-zinc-400 text-lg font-bold leading-relaxed mb-8">
                 Iklan berbayar (Paid Ads) adalah <span className="text-red-500">biaya variabel</span> yang hilang saat Anda berhenti membayar. SEO & AEO adalah <span className="text-emerald-500">aset modal</span> yang terus tumbuh dan menghasilkan profit secara eksponensial.
               </p>
               
               <div className="space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-2 h-12 bg-red-500" />
                     <div>
                        <p className="text-sm font-black text-white uppercase italic">Iklan Berbayar (Ads)</p>
                        <p className="text-xs text-zinc-600 font-bold uppercase">ROI Statis | Biaya Terus Meningkat | Kepercayaan Rendah</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="w-2 h-12 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                     <div>
                        <p className="text-sm font-black text-white uppercase italic">SEOsuite Ecosystem</p>
                        <p className="text-xs text-zinc-600 font-bold uppercase">ROI Eksponensial | Aset Permanen | Otoritas Tertinggi</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p-8 rounded-[3rem] bg-zinc-900/20 border border-zinc-800 relative h-[400px] flex items-end gap-4">
               {/* Mock Graph */}
               <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none">
                  <div className="border-t border-zinc-800 w-full opacity-10" />
                  <div className="border-t border-zinc-800 w-full opacity-10" />
                  <div className="border-t border-zinc-800 w-full opacity-20" />
               </div>
               
               <div className="flex-1 flex flex-col justify-end gap-1 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
                    className="w-full bg-red-500/20 border-t-2 border-red-500/50 rounded-t-lg flex items-center justify-center"
                  >
                     <span className="text-[10px] font-black text-red-500 -rotate-90">ADS</span>
                  </motion.div>
                  <p className="text-[8px] text-center font-black text-zinc-700 uppercase">Bulan 1</p>
               </div>
               <div className="flex-1 flex flex-col justify-end gap-1 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '40%' }} viewport={{ once: true }}
                    className="w-full bg-red-500/20 border-t-2 border-red-500/50 rounded-t-lg"
                  />
                  <p className="text-[8px] text-center font-black text-zinc-700 uppercase">Bulan 6</p>
               </div>
               <div className="flex-1 flex flex-col justify-end gap-1 h-full relative z-10">
                  <motion.div 
                    initial={{ height: 0 }} whileInView={{ height: '80%' }} viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="w-full bg-emerald-500/30 border-t-2 border-emerald-500 rounded-t-lg flex items-center justify-center shadow-[0_-20px_40px_rgba(16,185,129,0.1)]"
                  >
                     <span className="text-[10px] font-black text-emerald-400 -rotate-90">ORGANIK</span>
                  </motion.div>
                  <p className="text-[8px] text-center font-black text-zinc-700 uppercase">Bulan 12</p>
               </div>
               
               <div className="absolute top-10 left-10 p-4 bg-black/80 backdrop-blur border border-zinc-800 rounded-2xl">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Pertumbuhan Kumulatif</p>
                  <p className="text-2xl font-black text-white italic">+440%</p>
               </div>
            </div>
          </div>

          {/* AI Search Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-20 border-t border-white/5">
             <div className="space-y-4">
                <div className="text-5xl font-black text-white italic tracking-tighter">60%</div>
                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Zero-Click Searches</p>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  Sebagian besar pencarian kini berakhir tanpa klik. SEOsuite mengoptimalkan <span className="text-white">AEO</span> agar brand Anda tetap muncul sebagai jawaban utama AI.
                </p>
             </div>
             <div className="space-y-4">
                <div className="text-5xl font-black text-white italic tracking-tighter">4.4x</div>
                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Nilai Trafik Sitasi AI</p>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  Pengunjung yang datang dari sitasi AI (ChatGPT/Perplexity) memiliki nilai konversi <span className="text-white">4.4 kali lebih tinggi</span> dibanding trafik organik biasa.
                </p>
             </div>
             <div className="space-y-4">
                <div className="text-5xl font-black text-white italic tracking-tighter">35%</div>
                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest">Boost Klik Sitasi</p>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  Brand yang disitasi dalam <span className="text-white">AI Overviews</span> menerima klik 35% lebih banyak dibanding kompetitor yang hanya muncul di hasil pencarian tradisional.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-40 relative border-t border-white/5 bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-24">
            <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Arsitektur Harga</h2>
            <h3 className="text-5xl font-black tracking-tighter italic">Pilih tingkat <span className="text-zinc-700">Dominasi</span> Anda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`p-10 rounded-[3rem] bg-zinc-900/40 border transition-all relative group overflow-hidden ${
                  tier.popular ? 'border-blue-500/50 shadow-[0_0_50px_rgba(59,130,246,0.1)]' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 right-0 px-6 py-2 bg-blue-500 text-black text-[10px] font-black uppercase tracking-widest rounded-bl-2xl italic">
                    Paling Strategis
                  </div>
                )}
                
                <div className={`w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center mb-8 ${tier.color}`}>
                  <tier.icon className="w-7 h-7" />
                </div>

                <h4 className="text-2xl font-black text-white mb-2 uppercase italic tracking-tighter">{tier.name}</h4>
                <p className="text-sm text-zinc-500 font-bold mb-8">{tier.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-10">
                  <span className="text-4xl font-black text-white tracking-tighter">{tier.price}</span>
                  <span className="text-sm text-zinc-600 font-bold uppercase tracking-widest">{tier.period}</span>
                </div>

                <div className="space-y-4 mb-12">
                  {tier.features.map(f => (
                    <div key={f} className="flex items-center gap-3 text-sm font-bold text-zinc-400">
                      <Check className={`w-4 h-4 shrink-0 ${tier.color}`} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => handleCheckout(tier.name)}
                  disabled={loading === tier.name}
                  className={`w-full py-5 rounded-2xl font-black text-lg uppercase tracking-tighter transition-all flex items-center justify-center gap-2 ${
                    tier.popular 
                    ? 'bg-blue-500 text-black hover:bg-blue-400' 
                    : 'bg-zinc-800 text-white hover:bg-zinc-700'
                  }`}
                >
                  {loading === tier.name ? (
                    <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
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
