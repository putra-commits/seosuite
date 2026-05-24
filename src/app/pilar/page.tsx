'use client';

import { useState } from 'react';
import { 
  Map, Plus, X, Zap, Download, BarChart3, Globe, FileText, 
  TrendingUp, ArrowRight, Search, LayoutGrid, Info, ChevronRight,
  Database, Compass, Loader2
} from 'lucide-react';
import Link from 'next/link';

interface ClusterArticle {
  title: string;
  slug: string;
  city: string;
  intent: 'informational' | 'commercial' | 'transactional';
  wordTarget: number;
}
interface PilarCluster { pillar: string; keyword: string; clusters: ClusterArticle[]; }
interface PilarSummary {
  keywords: number; cities: number; totalArticles: number;
  coverage: number; estimatedDays: number;
  intentBreakdown: { informational: number; commercial: number; transactional: number };
}
interface PilarResult { summary: PilarSummary; clusters: PilarCluster[]; generatedAt: string; }

const INTENT_COLORS: Record<string, string> = {
  informational: 'bg-amber-500/10 text-amber-500',
  commercial:    'bg-amber-500/10 text-amber-500',
  transactional: 'bg-emerald-500/10 text-emerald-500',
};

const INTENT_LABELS: Record<string, string> = {
  informational: 'Informasional',
  commercial:    'Komersial',
  transactional: 'Transaksional',
};

const DEFAULT_KEYWORDS = [
  'Optimasi SEO On-Page', 'Audit Teknis Website', 'Riset Kata Kunci Berprofit',
  'Strategi Konten Pilar', 'Digital Marketing UMKM', 'Otomasi Pemasaran AI',
];
const DEFAULT_CITIES = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan'];

export default function PilarPage() {
  const [keywords, setKeywords]     = useState<string[]>(DEFAULT_KEYWORDS);
  const [cities, setCities]         = useState<string[]>(DEFAULT_CITIES);
  const [kwInput, setKwInput]       = useState('');
  const [cityInput, setCityInput]   = useState('');
  const [loading, setLoading]       = useState(false);
  const [result, setResult]         = useState<PilarResult | null>(null);
  const [activeKw, setActiveKw]     = useState<number | null>(null);

  function addKeyword() {
    const kw = kwInput.trim();
    if (kw && !keywords.includes(kw) && keywords.length < 100) {
      setKeywords(p => [...p, kw]);
      setKwInput('');
    }
  }
  function addCity() {
    const c = cityInput.trim();
    if (c && !cities.includes(c) && cities.length < 10) {
      setCities(p => [...p, c]);
      setCityInput('');
    }
  }

  async function generate() {
    if (keywords.length === 0) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/pilar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords, cities }),
      });
      const data: PilarResult = await res.json();
      setResult(data);
      setActiveKw(0);
    } finally { setLoading(false); }
  }

  function exportCSV() {
    if (!result) return;
    const rows = [['Keyword', 'City', 'Title', 'Slug', 'Intent', 'Word Target']];
    result.clusters.forEach(c =>
      c.clusters.forEach(a =>
        rows.push([c.keyword, a.city, a.title, a.slug, a.intent, String(a.wordTarget)])
      )
    );
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = `pilar1st-${Date.now()}.csv`; a.click();
  }

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-4 h-4 text-purple-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Pilar Builder</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Arsitek Klaster Topik</h1>
          <p className="text-zinc-500 text-sm max-w-2xl">
            Tingkatkan otoritas konten Anda dengan klaster topik GEO-SEO otomatis. 
            Transformasikan kata kunci benih menjadi peta jalan editorial 1.000 artikel.
          </p>
        </div>
        
        {result && (
          <button 
            onClick={exportCSV}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm"
          >
            <Download className="w-4 h-4" /> Ekspor Matriks CSV
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Configuration */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-6">
            {/* Keywords */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Kata Kunci Benih</h3>
                <span className="text-[10px] text-zinc-600 font-bold">{keywords.length}/100</span>
              </div>
              <div className="flex gap-2 mb-4">
                <input 
                  value={kwInput} 
                  onChange={e => setKwInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addKeyword()}
                  placeholder="misal: Tren Real Estate"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-purple-500/50 transition-colors font-mono"
                />
                <button onClick={addKeyword} className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 transition-all">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto no-scrollbar">
                {keywords.map((kw, i) => (
                  <div key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 group">
                    <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{kw}</span>
                    <button onClick={() => setKeywords(p => p.filter((_, j) => j !== i))} className="text-zinc-700 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-white uppercase tracking-widest">Target GEO</h3>
                <span className="text-[10px] text-zinc-600 font-bold">{cities.length}/10</span>
              </div>
              <div className="flex gap-2 mb-4">
                <input 
                  value={cityInput} 
                  onChange={e => setCityInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCity()}
                  placeholder="misal: Jakarta"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-amber-500/50 transition-colors font-mono"
                />
                <button onClick={addCity} className="p-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 transition-all">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 group">
                    <Globe className="w-2.5 h-2.5 text-zinc-600" />
                    <span className="text-[10px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">{c}</span>
                    <button onClick={() => setCities(p => p.filter((_, j) => j !== i))} className="text-zinc-700 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={generate} 
              disabled={loading || keywords.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-3 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
              {loading ? 'Membangun Matriks...' : `Hasilkan ${keywords.length * cities.length} Node Klaster`}
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex gap-4">
            <Info className="w-5 h-5 text-amber-500 shrink-0" />
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              <strong className="text-amber-500/80">Tips Pro:</strong> Menggunakan kota dalam strategi kata kunci Anda meningkatkan relevansi lokal hingga 40% untuk Google Discover dan mesin GEO AI.
            </p>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-8">
          {!result && !loading && (
            <div className="h-[500px] rounded-3xl border border-zinc-800 border-dashed flex flex-col items-center justify-center text-center p-12">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
                <LayoutGrid className="w-8 h-8 text-zinc-700" />
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-2">Matriks Tidak Aktif</h3>
              <p className="text-sm text-zinc-500 max-w-xs leading-relaxed">Konfigurasi kata kunci benih dan target kota Anda untuk menghasilkan pilar konten yang terstruktur.</p>
            </div>
          )}

          {loading && (
            <div className="h-[500px] rounded-3xl bg-zinc-900/30 border border-zinc-800 flex flex-col items-center justify-center p-12">
              <div className="w-20 h-20 rounded-full border-2 border-zinc-800 border-t-purple-500 animate-spin mb-8 flex items-center justify-center">
                <Compass className="w-8 h-8 text-purple-400" />
              </div>
              <p className="text-sm text-zinc-400 font-bold tracking-widest uppercase animate-pulse">Mengorkestrasi Arsitektur Node Klaster...</p>
            </div>
          )}

          {result && (
            <div className="space-y-8 animate-in fade-in duration-700">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Artikel', value: result.summary.totalArticles, icon: <FileText className="w-4 h-4 text-amber-400" /> },
                  { label: 'Cakupan', value: `${result.summary.coverage}%`, icon: <BarChart3 className="w-4 h-4 text-emerald-400" /> },
                  { label: 'Waktu Bangun', value: `${result.summary.estimatedDays}h`, icon: <TrendingUp className="w-4 h-4 text-amber-400" /> },
                  { label: 'Hub Klaster', value: result.summary.keywords, icon: <Map className="w-4 h-4 text-purple-400" /> },
                ].map(s => (
                  <div key={s.label} className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-2 mb-2">
                      {s.icon}
                      <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{s.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Cluster Detail */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="p-2 border-b border-zinc-800 bg-zinc-950/50 overflow-x-auto no-scrollbar">
                  <div className="flex gap-1">
                    {result.clusters.map((c, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveKw(i)}
                        className={`px-6 py-2.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                          activeKw === i 
                            ? 'bg-zinc-800 text-white shadow-sm' 
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {c.keyword}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto divide-y divide-zinc-800/50">
                  {activeKw !== null && result.clusters[activeKw] && (
                    result.clusters[activeKw].clusters.map((a, i) => (
                      <div key={i} className="p-5 flex items-center justify-between hover:bg-zinc-800/10 group transition-all">
                        <div className="flex items-start gap-4 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-600 shrink-0 mt-0.5">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[9px] font-black uppercase text-zinc-600 tracking-tighter w-14 shrink-0">{a.city}</span>
                              <p className="text-sm font-bold text-zinc-200 group-hover:text-white truncate">{a.title}</p>
                            </div>
                            <p className="text-[10px] text-zinc-600 font-mono truncate">/berita/nasional/{a.slug}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6 shrink-0 ml-6">
                          <div className="text-right">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${INTENT_COLORS[a.intent]}`}>
                              {INTENT_LABELS[a.intent]}
                            </span>
                          </div>
                          <div className="w-10 text-right">
                            <span className="text-[10px] font-bold text-zinc-500">{a.wordTarget}w</span>
                          </div>
                          <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-700 group-hover:text-white transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
