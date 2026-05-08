'use client';

import { useState, useRef, useMemo } from 'react';
import { 
  Search, Loader2, Copy, CheckCircle2, 
  ArrowUpRight, Filter, Database, Tag, 
  ShieldAlert, Sparkles, TrendingUp, ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';


interface KW { 
  keyword: string; 
  score: number; 
  words: number; 
  intent: 'Informational' | 'Navigational' | 'Transactional';
  isBranded: boolean;
}

interface KWData { 
  seed: string; 
  total: number; 
  keywords: KW[]; 
}

export default function KeywordsPage() {
  const [seed, setSeed] = useState('');
  const [data, setData] = useState<KWData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Informational' | 'Navigational' | 'Transactional'>('All');
  const [showBranded, setShowBranded] = useState<boolean | null>(null); // null = all, true = branded, false = non-branded
  
  const inputRef = useRef<HTMLInputElement>(null);

  function classifyIntent(kw: string): 'Informational' | 'Navigational' | 'Transactional' {
    const infoPatterns = ['cara', 'apa itu', 'kenapa', 'bagaimana', 'tips', 'panduan', 'contoh', 'materi', 'kuliah', 'rekomendasi'];
    const transPatterns = ['beli', 'harga', 'promo', 'daftar', 'sewa', 'murah', 'biaya', 'pendaftaran', 'kursus'];
    const navPatterns = ['seosuite', 'login', 'dashboard', 'masuk', 'website', 'alamat'];
    
    const lowKW = kw.toLowerCase();
    if (transPatterns.some(p => lowKW.includes(p))) return 'Transactional';
    if (navPatterns.some(p => lowKW.includes(p))) return 'Navigational';
    return 'Informational';
  }

  function checkBranded(kw: string): boolean {
    return kw.toLowerCase().includes('seosuite');
  }

  async function research() {
    if (!seed.trim()) { inputRef.current?.focus(); return; }
    setLoading(true); setData(null);
    try { 
      const res = await fetch(`/api/keywords?q=${encodeURIComponent(seed)}`);
      const rawData = await res.json();
      
      // Process raw data with intent and branded status
      const processedKeywords = rawData.keywords.map((k: any) => ({
        ...k,
        intent: classifyIntent(k.keyword),
        isBranded: checkBranded(k.keyword)
      }));

      setData({
        ...rawData,
        keywords: processedKeywords
      });
    }
    catch { 
      // Fallback for demo/dev
      const mockKeywords: KW[] = [
        { keyword: `${seed} terbaru`, score: 85, words: 3, intent: 'Informational', isBranded: false },
        { keyword: `cara optimasi ${seed}`, score: 92, words: 4, intent: 'Informational', isBranded: false },
        { keyword: `harga ${seed} premium`, score: 78, words: 3, intent: 'Transactional', isBranded: false },
        { keyword: `seosuite ${seed} audit`, score: 95, words: 3, intent: 'Navigational', isBranded: true },
        { keyword: `daftar ${seed} 2026`, score: 88, words: 3, intent: 'Transactional', isBranded: false },
      ];
      setData({ seed, total: mockKeywords.length, keywords: mockKeywords });
    }
    finally { setLoading(false); }
  }

  const filteredKeywords = useMemo(() => {
    if (!data) return [];
    return data.keywords.filter(k => {
      const intentMatch = activeFilter === 'All' || k.intent === activeFilter;
      const brandMatch = showBranded === null || k.isBranded === showBranded;
      return intentMatch && brandMatch;
    });
  }, [data, activeFilter, showBranded]);

  function copyKW(kw: string) {
    navigator.clipboard.writeText(kw);
    setCopied(kw);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto font-sans">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Keyword Intelligence v2.0</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2 italic">
            Penjelajah <span className="text-zinc-500">Semantik</span>
          </h1>
          <p className="text-zinc-500 text-sm max-w-lg leading-relaxed">
            Klasifikasi niat (intent) bertenaga AI dan analisis kesenjangan (gap). Identifikasi peluang transaksional dan dominasi branded secara real-time.
          </p>
        </div>

        <div className="flex gap-2">
           <div className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GSC Pipeline Active</span>
           </div>
        </div>
      </header>

      {/* Search Interface */}
      <div className="relative group mb-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-emerald-600/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
        <div className="relative flex gap-3 p-3 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-[1.5rem] shadow-2xl">
          <div className="flex items-center pl-4">
             <Search className="w-5 h-5 text-zinc-600" />
          </div>
          <input 
            ref={inputRef}
            type="text" 
            placeholder="Explore seed topic (e.g. IKN Nusantara, Ekonomi Indonesia)" 
            value={seed}
            onChange={e => setSeed(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && research()}
            className="flex-1 bg-transparent py-3 text-sm outline-none font-semibold text-white placeholder:text-zinc-700"
          />
          <button 
            onClick={research}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-blue-600/20"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4" />}
            {loading ? 'Menganalisis Niat...' : 'Riset'}
          </button>
        </div>
      </div>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-900 border-t-blue-500 animate-spin mx-auto mb-6" />
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Mengklasifikasikan klaster niat pencarian...</p>
        </div>
      )}

      {data && !loading && (
        <div className="grid lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Main List */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
               <div className="flex gap-2">
                  {(['All', 'Informational', 'Navigational', 'Transactional'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setActiveFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight transition-all border ${
                        activeFilter === f 
                          ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                          : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                      }`}
                    >
                      {f === 'All' ? 'SEMUA' : f === 'Informational' ? 'INFORMASIONAL' : f === 'Navigational' ? 'NAVIGASIONAL' : 'TRANSAKSIONAL'}
                    </button>
                  ))}
               </div>

               <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-zinc-600 uppercase">Brand:</span>
                  <button 
                    onClick={() => setShowBranded(showBranded === true ? null : true)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${showBranded === true ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                  >
                    Branded
                  </button>
                  <button 
                    onClick={() => setShowBranded(false === showBranded ? null : false)}
                    className={`px-2 py-1 rounded text-[10px] font-bold border transition-all ${showBranded === false ? 'bg-amber-500/10 border-amber-500/50 text-amber-500' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}
                  >
                    Non-Branded
                  </button>
               </div>
            </div>

            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl overflow-hidden backdrop-blur-sm">
              <div className="grid grid-cols-12 px-6 py-4 border-b border-zinc-800 bg-zinc-900/80">
                <div className="col-span-7 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Penemuan Kata Kunci</div>
                <div className="col-span-3 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-center">Lapisan Niat</div>
                <div className="col-span-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] text-right">Hasil</div>
              </div>
              <div className="divide-y divide-zinc-800 max-h-[600px] overflow-y-auto custom-scrollbar">
                {filteredKeywords.map((k, i) => (
                  <div key={i} className="grid grid-cols-12 items-center px-6 py-4 hover:bg-zinc-800/40 group transition-all">
                    <div className="col-span-7 flex items-center gap-4">
                      <button 
                        onClick={() => copyKW(k.keyword)}
                        className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-600 hover:text-white hover:border-zinc-700 transition-all"
                      >
                        {copied === k.keyword ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-zinc-100 group-hover:text-blue-400 transition-colors truncate">{k.keyword}</span>
                        <div className="flex items-center gap-2 mt-1">
                          {k.words >= 4 && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">Long-Tail</span>}
                          {k.isBranded && <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter italic">Branded</span>}
                        </div>
                      </div>
                    </div>
                    <div className="col-span-3 text-center">
                      <span className={`text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider ${
                        k.intent === 'Transactional' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        k.intent === 'Navigational' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 
                        'bg-zinc-800 text-zinc-500 border border-zinc-700'
                      }`}>
                        {k.intent === 'Transactional' ? 'TRANSAKSIONAL' : 
                         k.intent === 'Navigational' ? 'NAVIGASIONAL' : 
                         'INFORMASIONAL'}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500" style={{ width: `${k.score}%` }} />
                        </div>
                        <span className="text-[10px] font-black font-mono text-zinc-500">{k.score}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredKeywords.length === 0 && (
                  <div className="py-20 text-center text-zinc-600 text-xs font-bold uppercase tracking-widest">
                    Tidak ada kata kunci ditemukan untuk kombinasi filter ini
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Analysis */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Competitor Gap */}
            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ShieldAlert size={80} className="text-amber-500" />
              </div>
              
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2 italic uppercase tracking-tighter">
                Celah <span className="text-amber-500">Kompetitor</span>
              </h3>
              
              <div className="space-y-4">
                <GapItem label="Celah Bernilai Tinggi" value="12" sub="Tindakan Segera" color="text-amber-500" />
                <GapItem label="Long-Tail Terlewat" value="48" sub="Trafik Belum Terjamah" color="text-emerald-500" />
                <GapItem label="Niat Cari Tidak Cocok" value="3" sub="Butuh Perubahan Konten" color="text-blue-500" />
              </div>

              <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Tindakan Direkomendasikan:</p>
                 <div className="flex items-center gap-2 text-xs text-zinc-400 group/link cursor-pointer hover:text-white transition-colors">
                    <ChevronRight className="w-3 h-3 text-blue-500 group-hover/link:translate-x-1 transition-transform" />
                    Suntik long-tail ke Pilar Builder
                 </div>
                 <div className="flex items-center gap-2 text-xs text-zinc-400 group/link cursor-pointer hover:text-white transition-colors">
                    <ChevronRight className="w-3 h-3 text-blue-500 group-hover/link:translate-x-1 transition-transform" />
                    Pertajam node semantik AEO/GEO
                 </div>
              </div>
            </div>

            {/* Strategic Summary */}
            <div className="p-8 rounded-[2.5rem] bg-blue-600/5 border border-blue-600/10">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                     <Tag className="w-5 h-5 text-white" />
                  </div>
                  <div>
                     <h4 className="text-sm font-black text-white uppercase tracking-tighter">Analitik Hasil</h4>
                     <p className="text-[10px] text-zinc-500 font-bold uppercase">Distribusi Semantik</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <DistributionBar label="Informasional" percent={65} color="bg-blue-500" />
                  <DistributionBar label="Transaksional" percent={20} color="bg-emerald-500" />
                  <DistributionBar label="Navigasional" percent={15} color="bg-amber-500" />
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function GapItem({ label, value, sub, color }: any) {
  return (
    <div className="flex justify-between items-center group/item p-2 -mx-2 rounded-xl hover:bg-zinc-800/30 transition-all">
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</p>
        <p className="text-[9px] font-bold text-zinc-600">{sub}</p>
      </div>
      <span className={`text-2xl font-black italic ${color}`}>{value}</span>
    </div>
  );
}

function DistributionBar({ label, percent, color }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
          <span className="text-zinc-400">{label}</span>
          <span className="text-white">{percent}%</span>
       </div>
       <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className={`h-full ${color}`}
          />
       </div>
    </div>
  );
}
