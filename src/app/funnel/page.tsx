'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, ArrowRight, AlertTriangle, TrendingUp, 
  Target, Zap, DollarSign, Activity, 
  ChevronRight, RefreshCw, Layers, Shield
} from 'lucide-react';

export default function FunnelAuditPage() {
  const [traffic, setTraffic] = useState(50000);
  const [aov, setAov] = useState(750000); // Rp 750k
  const [crActivation, setCrActivation] = useState(15); // % of traffic that 'activates'
  const [crRetention, setCrRetention] = useState(40);  // % of activated users that return
  const [crReferral, setCrReferral] = useState(5);     // % of users that refer others
  const [crRevenue, setCrRevenue] = useState(12);     // % of retained users that pay

  const funnelData = useMemo(() => {
    // AARRR Logic
    const acquisition = traffic;
    const activation = Math.round(acquisition * (crActivation / 100));
    const retention = Math.round(activation * (crRetention / 100));
    
    // Referral adds back to acquisition (viral loop)
    const referrals = Math.round(retention * (crReferral / 100));
    const totalEffectiveUsers = retention + referrals;
    
    const revenueUsers = Math.round(totalEffectiveUsers * (crRevenue / 100));
    const totalRevenue = revenueUsers * aov;
    
    // Leakage calculation: If each stage had a "Good" benchmark CR
    const benchmarks = { activation: 25, retention: 60, referral: 15, revenue: 20 };
    const potActivation = traffic * (benchmarks.activation / 100);
    const potRetention = potActivation * (benchmarks.retention / 100);
    const potReferrals = potRetention * (benchmarks.referral / 100);
    const potRevenueUsers = (potRetention + potReferrals) * (benchmarks.revenue / 100);
    const potentialRevenue = potRevenueUsers * aov;
    const leakage = potentialRevenue - totalRevenue;

    return {
      stages: [
        { name: 'Akuisisi', value: acquisition, color: 'bg-blue-600', desc: 'Total trafik masuk' },
        { name: 'Aktivasi', value: activation, color: 'bg-indigo-600', desc: 'Pengalaman nilai pertama' },
        { name: 'Retensi', value: retention, color: 'bg-purple-600', desc: 'Pengguna yang kembali' },
        { name: 'Referensi', value: referrals, color: 'bg-pink-600', desc: 'Pengguna yang mengajak orang lain' },
        { name: 'Pendapatan', value: revenueUsers, color: 'bg-emerald-600', desc: 'Pelanggan yang membayar' },
      ],
      revenue: totalRevenue,
      leakage: leakage > 0 ? leakage : 0,
      conversionRate: ((revenueUsers / traffic) * 100).toFixed(2)
    };
  }, [traffic, aov, crActivation, crRetention, crReferral, crRevenue]);

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-400 font-sans p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-500 uppercase tracking-wider">
              Mesin Audit Pertumbuhan
            </div>
            <div className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-xs font-medium text-zinc-500 text-blue-500/80 font-mono">MODE_AARRR_BAJAK_LAUT</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            Pusat Komando <span className="text-blue-500 italic">Pertumbuhan</span>
            <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
          </h1>
          <p className="text-sm mt-2 max-w-xl leading-relaxed text-zinc-500">
            Analisis <span className="text-emerald-500 font-bold">Arsitektur Konversi</span> untuk website personal branding & ecommerce. Identifikasi titik gesekan (friction points) dan pulihkan pendapatan yang hilang akibat funnel yang tidak optimal.
          </p>
        </div>

        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-xs font-bold text-zinc-300 uppercase">Live Simulation</span>
           </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Controls & Visualization */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-default group">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 group-hover:text-blue-400 transition-colors">Hasil Pertumbuhan</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">{funnelData.conversionRate}%</span>
                <span className="text-xs font-medium text-emerald-500 mb-1">AARRR Teroptimasi</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-default group">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1 group-hover:text-emerald-400 transition-colors">Pendapatan Bulanan</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-white">Rp {(funnelData.revenue / 1000000).toFixed(1)}Jt</span>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 relative overflow-hidden group cursor-default">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500/80 mb-1">Kebocoran Tersembunyi</p>
              <div className="flex items-end gap-2">
                <span className="text-2xl font-bold text-red-500">Rp {(funnelData.leakage / 1000000).toFixed(1)}Jt</span>
              </div>
            </div>
          </div>

          {/* Funnel Visualizer */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900/30 border border-zinc-800 relative overflow-hidden min-h-[600px] flex flex-col items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_70%)]" />
            
            <div className="w-full max-w-sm space-y-3 relative z-10">
              {funnelData.stages.map((stage, idx) => {
                const width = 100 - (idx * 15);
                const prevValue = idx > 0 ? funnelData.stages[idx-1].value : null;
                const dropoff = prevValue ? Math.round((1 - stage.value / prevValue) * 100) : null;

                return (
                  <div key={stage.name} className="relative group/stage">
                    <motion.div 
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: `${width}%`, opacity: 1 }}
                      transition={{ delay: idx * 0.08, duration: 0.8, ease: "circOut" }}
                      className={`h-20 mx-auto rounded-xl ${stage.color} relative shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col items-center justify-center group-hover/stage:scale-[1.05] group-hover/stage:-translate-y-1 transition-all duration-300`}
                      style={{ filter: `brightness(${1.1 - idx * 0.1})` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      <span className="text-white font-black text-xl tracking-tighter">{stage.value.toLocaleString()}</span>
                      <span className="text-white/70 text-[9px] font-black uppercase tracking-[0.2em]">{stage.name}</span>
                      
                      {/* Description tooltip on hover */}
                      <div className="absolute -left-48 opacity-0 group-hover/stage:opacity-100 transition-opacity pointer-events-none hidden md:block">
                         <div className="p-3 rounded-lg bg-zinc-900 border border-zinc-800 shadow-2xl text-[10px] w-40">
                            <span className="text-white font-bold block mb-1 uppercase">{stage.name}</span>
                            <span className="text-zinc-500 leading-tight">{stage.desc}</span>
                         </div>
                      </div>

                      {/* Connection Dots */}
                      {idx < funnelData.stages.length - 1 && (
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col gap-1">
                          <div className="w-1 h-1 rounded-full bg-zinc-800" />
                          <div className="w-1 h-1 rounded-full bg-zinc-800" />
                        </div>
                      )}
                    </motion.div>

                    {dropoff !== null && idx !== 3 && ( // Don't show dropoff for Referral since it's an add-back in this logic
                      <div className="absolute -right-24 top-1/2 -translate-y-1/2 flex items-center gap-2">
                        <div className="w-6 h-[1px] bg-zinc-800" />
                        <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-[9px] font-black text-red-500 uppercase">
                          {dropoff}% BOCOR
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Insights & Inputs */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Pirate Controls */}
          <div className="p-8 rounded-[2.5rem] bg-zinc-900 border border-zinc-800 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-pink-500" />
              Penalaan Vital
            </h3>
            
            <div className="space-y-6">
              {/* Traffic & AOV */}
              <div className="grid grid-cols-2 gap-4 pb-6 border-b border-zinc-800">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Trafik Bulanan</label>
                  <input 
                    type="number" value={traffic} onChange={(e) => setTraffic(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm font-bold focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">AOV (Rp)</label>
                  <input 
                    type="number" value={aov} onChange={(e) => setAov(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white text-sm font-bold focus:border-blue-500/50 outline-none transition-all"
                  />
                </div>
              </div>

              {/* AARRR Sliders */}
              <div className="space-y-6">
                 <PirateSlider label="Activation" value={crActivation} onChange={setCrActivation} color="accent-indigo-500" />
                 <PirateSlider label="Retention" value={crRetention} onChange={setCrRetention} color="accent-purple-500" />
                 <PirateSlider label="Referral" value={crReferral} onChange={setCrReferral} color="accent-pink-500" />
                 <PirateSlider label="Revenue" value={crRevenue} onChange={setCrRevenue} color="accent-emerald-500" />
              </div>
            </div>
          </div>


          {/* AI Insights */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600" />
            
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              Growth Intelligence
            </h3>

            <div className="space-y-6">
              <InsightItem 
                icon={<Shield className="text-indigo-500" />}
                title="Kebocoran Aktivasi"
                desc="Tingkat aktivasi 15% menunjukkan hilangnya kepercayaan di awal. Memperbaiki onboarding dapat meningkatkan LTV (Lifetime Value) sebesar 40% tanpa biaya iklan tambahan."
                impact="Potensi: +Rp 1.2M/bln"
              />
              <InsightItem 
                icon={<Layers className="text-purple-500" />}
                title="Efek Pengganda Organik"
                desc="Berbeda dengan Ads, optimasi AEO/GEO memberikan trafik berkelanjutan. Trafik dari sitasi AI 4.4x lebih mungkin melakukan pembelian dibanding klik iklan."
                impact="ROI: Eksponensial"
              />
              <InsightItem 
                icon={<Target className="text-pink-500" />}
                title="Sovereign Referral Loop"
                desc="Koefisien referensi rendah (0.05). Ecommerce mandiri butuh loop viral untuk lepas dari ketergantungan marketplace dan biaya admin yang besar."
                impact="Margin Profit: +25%"
              />
            </div>

            <button className="w-full mt-8 py-4 bg-zinc-100 hover:bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2 group">
              Ekspor Laporan Profit
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Conversion Architecture Audit Section */}
        <div className="mt-12 p-10 rounded-[3rem] bg-zinc-900/30 border border-zinc-800 backdrop-blur-md relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
              <Zap size={120} className="text-blue-500" />
           </div>
           
           <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3 italic uppercase tracking-tighter">
             Conversion <span className="text-zinc-600">Architecture</span> Audit
           </h2>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ConversionPoint 
                label="Gesekan CTA Utama" 
                rate="3.2%" 
                status="Kritis" 
                advice="Tambahkan bukti sosial di dekat tombol utama." 
                color="text-red-500"
              />
              <ConversionPoint 
                label="Kecepatan Landing Page" 
                rate="1.8s" 
                status="Optimal" 
                advice="Core Web Vitals berada dalam persentil ke-90." 
                color="text-emerald-500"
              />
              <ConversionPoint 
                label="UX Formulir Mobile" 
                rate="42%" 
                status="Butuh Perbaikan" 
                advice="Sederhanakan kolom formulir pada layar kecil." 
                color="text-amber-500"
              />
              <ConversionPoint 
                label="Skor Kepercayaan" 
                rate="65/100" 
                status="Stabil" 
                advice="Tingkatkan visibilitas testimoni di bagian atas halaman." 
                color="text-blue-500"
              />
           </div>

           <div className="mt-12 pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div>
                    <p className="text-sm font-bold text-white italic">Overall Conversion Health: <span className="text-emerald-500 uppercase tracking-widest">B+ Strong</span></p>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase">Last audited 2 minutes ago via UX1st Engine</p>
                 </div>
              </div>
              <button className="px-8 py-3 rounded-2xl bg-zinc-100 text-black font-black text-xs uppercase tracking-widest hover:bg-white transition-all">
                 Download Audit Log
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

function ConversionPoint({ label, rate, status, advice, color }: any) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-all group/item">
       <div className="flex justify-between items-start mb-4">
          <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{label}</p>
          <span className={`text-[8px] font-black px-2 py-0.5 rounded border ${color} border-current/20 bg-current/5 uppercase tracking-tighter`}>
            {status}
          </span>
       </div>
       <div className="text-3xl font-black text-white italic mb-2 tracking-tighter">{rate}</div>
       <p className="text-[10px] leading-relaxed text-zinc-500 font-medium group-hover/item:text-zinc-400 transition-colors">
          {advice}
       </p>
    </div>
  );
}


function PirateSlider({ label, value, onChange, color }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label} Rate</label>
        <span className="text-xs font-mono text-white">{value}%</span>
      </div>
      <input 
        type="range" min="0" max="100" step="1"
        value={value} onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full ${color} h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer`}
      />
    </div>
  );
}

function InsightItem({ icon, title, desc, impact }: any) {
  return (
    <div className="flex gap-4 group/item">
      <div className="w-10 h-10 shrink-0 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center group-hover/item:border-zinc-700 transition-colors">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-bold text-zinc-200 mb-1">{title}</h4>
        <p className="text-xs text-zinc-500 leading-relaxed mb-2">{desc}</p>
        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{impact}</span>
      </div>
    </div>
  );
}

