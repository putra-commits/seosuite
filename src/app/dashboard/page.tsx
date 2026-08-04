'use client';

import Link from 'next/link';
import { 
  ArrowUpRight, BarChart3, Binary, ShieldCheck, 
  Bot, Search, TrendingUp, Unlink, Trash2, 
  MapPin, Layers, CheckCircle2, Zap, LayoutGrid,
  Shield, Globe, Database, Compass, MousePointer2,
  Eye, Target, ExternalLink
} from 'lucide-react';
import { motion } from 'framer-motion';

const HIGHLIGHTS = [
  { 
    name: 'Arsitektur Konversi', 
    href: '/funnel', 
    icon: Compass, 
    desc: 'Audit mendalam pada funnel penjualan untuk mengidentifikasi kebocoran pendapatan dan memaksimalkan ROI trafik.',
    status: 'Prioritas Tinggi',
    glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]'
  },
  { 
    name: 'Kesiapan AEO & GEO', 
    href: '/aeo-geo', 
    icon: Bot, 
    desc: 'Dominasi jawaban AI dan hasil pencarian generatif untuk memastikan brand Anda tetap relevan di masa depan.',
    status: 'Strategis',
    glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]'
  }
];

const MODULES = [
  { name: 'Kecerdasan Kata Kunci', href: '/keywords', icon: Search, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  { name: 'Funnel & Pertumbuhan', href: '/funnel', icon: Compass, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { name: 'Analitik Trending', href: '/trending', icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { name: 'Kedaulatan Konten', href: '/content-audit', icon: ShieldCheck, color: 'text-red-500', bg: 'bg-red-500/10' },
  { name: 'Arsitektur Link', href: '/links', icon: Unlink, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Deteksi Kanibalisasi', href: '/cannibal', icon: Trash2, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { name: 'Kehadiran Lokal', href: '/local-seo', icon: MapPin, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
];

export default function Dashboard() {
  return (
    <div className="p-8 lg:p-16 max-w-7xl mx-auto space-y-20 font-sans">
      {/* Hero Section */}
      <header className="relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Pusat Komando AdoloSEO v3.0</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-6 text-white">
            Pusat <span className="text-zinc-600">Pendapatan</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg leading-relaxed font-bold">
            Orkestrasi kekaisaran pertumbuhan digital Anda. Ubah trafik menjadi profit nyata dengan audit <span className="text-white">Arsitektur Konversi</span> dan dominasi <span className="text-white">Pencarian Generatif</span>.
          </p>
        </div>
      </header>

      {/* Global Intelligence Hub (GSC / GA Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         <IntelligenceCard 
            label="Impresi GSC" value="4.2jt" sub="+12.4% vs seb" 
            icon={<Eye className="w-4 h-4 text-amber-500" />} 
            color="border-amber-500/20"
         />
         <IntelligenceCard 
            label="Klik GSC" value="128.5rb" sub="+8.2% vs seb" 
            icon={<MousePointer2 className="w-4 h-4 text-emerald-500" />} 
            color="border-emerald-500/20"
         />
         <IntelligenceCard 
            label="Revenue Yield" value="Rp 248jt" sub="+18.4% efisiensi" 
            icon={<BarChart3 className="w-4 h-4 text-amber-500" />} 
            color="border-amber-500/20"
         />
         <IntelligenceCard 
            label="Konversi Goal" value="3.8rb" sub="+15.1% efisiensi" 
            icon={<Target className="w-4 h-4 text-indigo-500" />} 
            color="border-indigo-500/20"
         />
      </div>

      {/* Main Operating Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Tactical Intelligence */}
        <div className="lg:col-span-8 space-y-12">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] flex items-center gap-3">
              Inti Taktis <span className="text-zinc-800">/</span> Performa
            </h2>
            <div className="h-px flex-1 bg-zinc-900 mx-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {HIGHLIGHTS.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`group p-10 rounded-[2.5rem] bg-zinc-900/20 border border-zinc-800 hover:border-zinc-600 transition-all relative overflow-hidden ${item.glow}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl">
                      <item.icon className="w-7 h-7 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="px-3 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-zinc-300 transition-colors">
                      {item.status}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-white mb-4 flex items-center gap-2 uppercase tracking-tighter">
                    {item.name}
                    <ExternalLink className="w-4 h-4 text-zinc-800 group-hover:text-amber-500 transition-all" />
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed font-bold">
                    {item.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Revenue Potential Projection (Chart) */}
          <div className="rounded-[3rem] bg-zinc-900/10 border border-zinc-800 p-10 space-y-8">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                   Proyeksi <span className="text-emerald-500">Pendapatan</span> Kumulatif
                </h3>
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Model: Organic Compound ROI</span>
             </div>
             
             <div className="h-[200px] flex items-end gap-2 relative">
                <div className="absolute inset-0 border-b border-zinc-800 opacity-50" />
                <div className="flex-1 h-[20%] bg-zinc-800/20 border-t border-zinc-700 rounded-t flex items-center justify-center">
                   <span className="text-[8px] font-bold text-zinc-600 -rotate-90">Bln 1</span>
                </div>
                <div className="flex-1 h-[25%] bg-zinc-800/30 border-t border-zinc-700 rounded-t" />
                <div className="flex-1 h-[35%] bg-amber-500/10 border-t border-amber-500/50 rounded-t" />
                <div className="flex-1 h-[50%] bg-amber-500/20 border-t border-amber-500/70 rounded-t" />
                <div className="flex-1 h-[75%] bg-emerald-500/30 border-t border-emerald-500 rounded-t shadow-[0_-10px_20px_rgba(16,185,129,0.1)] flex items-center justify-center">
                   <span className="text-[8px] font-bold text-emerald-400 -rotate-90">BREAKOUT</span>
                </div>
                <div className="flex-1 h-full bg-emerald-500/40 border-t-2 border-emerald-500 rounded-t shadow-[0_-20px_40px_rgba(16,185,129,0.2)]" />
             </div>
             
             <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-900">
                <div>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Estimasi ROI (12 Bln)</p>
                   <p className="text-xl font-black text-white">+440.2%</p>
                </div>
                <div>
                   <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status Asset</p>
                   <p className="text-xl font-black text-emerald-500 uppercase tracking-tighter">Sovereign Growth</p>
                </div>
             </div>
          </div>

          {/* Top Ranking Queries Table (GSC Simulation) */}
          <div className="rounded-[3rem] bg-zinc-900/10 border border-zinc-800 p-10 space-y-8">
             <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                   Performa <span className="text-amber-500">Pencarian</span>
                </h3>
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Sumber: GSC API v1</span>
             </div>
              <div className="space-y-4">
                <QueryRow query="strategi branding personal" clicks="24.2rb" pos="1.2" trend="up" />
                <QueryRow query="ecommerce tanpa marketplace" clicks="18.5rb" pos="2.4" trend="up" />
                <QueryRow query="optimasi konversi website" clicks="12.1rb" pos="3.8" trend="down" />
                <QueryRow query="jasa audit seo profesional" clicks="9.4rb" pos="1.1" trend="stable" />
              </div>
          </div>
        </div>

        {/* Right: Operational Modules & System Health */}
        <div className="lg:col-span-4 space-y-12">
          <h2 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em]">
            Stack Operasional
          </h2>
          <div className="space-y-4">
            {MODULES.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className="flex items-center gap-5 p-6 rounded-[1.5rem] border border-zinc-800/60 bg-zinc-950/40 hover:bg-zinc-900/60 hover:border-zinc-600 transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 transition-all group-hover:rotate-12`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <span className="text-sm font-black text-zinc-500 group-hover:text-zinc-100 transition-colors uppercase tracking-widest">{item.name}</span>
                <ArrowUpRight className="w-4 h-4 text-zinc-800 ml-auto opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
          
          <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-zinc-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
               <Shield size={60} className="text-emerald-500" />
            </div>
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Status Pipeline</p>
            <div className="space-y-4">
              {[
                { label: 'GSC Real-time Sync', status: 'Online', color: 'bg-emerald-500' },
                { label: 'GA4 Goal Injection', status: 'Optimal', color: 'bg-emerald-500' },
                { label: 'PSI Automated Scan', status: 'Verified', color: 'bg-amber-500' },
                { label: 'Sovereign Node', status: 'Connected', color: 'bg-emerald-500' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</span>
                  <div className="flex items-center gap-2">
                     <div className={`w-1.5 h-1.5 rounded-full ${s.color} animate-pulse`} />
                     <span className="text-[10px] font-black text-zinc-100 uppercase">{s.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <footer className="pt-20 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-black fill-black" />
            </div>
          </Link>
          <p className="text-[10px] text-zinc-500 font-black tracking-[0.4em] uppercase">
            © 2026 SOVEREIGN TECHNOLOGY <span className="text-zinc-800 mx-2">|</span> AdoloSEO v3.0
          </p>
        </div>
      </footer>
    </div>
  );
}

function IntelligenceCard({ label, value, sub, icon, color }: any) {
   return (
      <div className={`p-8 rounded-[2rem] bg-zinc-900/30 border ${color} hover:bg-zinc-900/60 transition-all cursor-default group`}>
         <div className="flex items-center justify-between mb-6">
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800">
               {icon}
            </div>
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-tighter">{sub}</span>
         </div>
         <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-1">{label}</p>
         <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
      </div>
   );
}

function QueryRow({ query, clicks, pos, trend }: any) {
   return (
      <div className="flex items-center justify-between p-4 rounded-2xl bg-zinc-950/50 border border-zinc-900 hover:border-zinc-700 transition-all group cursor-default">
         <div className="flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ${trend === 'up' ? 'bg-emerald-500' : trend === 'down' ? 'bg-red-500' : 'bg-zinc-700'}`} />
            <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{query}</span>
         </div>
         <div className="flex items-center gap-8">
            <div className="text-right">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Avg Pos</p>
               <p className="text-sm font-black text-white">{pos}</p>
            </div>
            <div className="text-right w-20">
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Clicks</p>
               <p className="text-sm font-black text-emerald-500">{clicks}</p>
            </div>
         </div>
      </div>
   );
}
