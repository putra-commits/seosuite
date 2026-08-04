'use client';

import { useState, useRef } from 'react';
import { Bot, Globe, Loader2, CheckCircle2, XCircle, Sparkles, ArrowUpRight, Zap } from 'lucide-react';
import Footer from '../components/footer';

interface Check { item: string; pass: boolean; detail: string; type: 'AEO' | 'GEO'; }
interface AeoData {
  url: string; aeoScore: number; geoScore: number; overallScore: number;
  checks: Check[];
  summary: { aeo: { total: number; passed: number }; geo: { total: number; passed: number } };
}

export default function AeoGeoPage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<AeoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'AEO' | 'GEO'>('AEO');
  const inputRef = useRef<HTMLInputElement>(null);

  async function run() {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    const target = url.startsWith('http') ? url : `https://${url}`;
    setLoading(true); setData(null);
    try { setData(await (await fetch(`/api/aeo-geo?url=${encodeURIComponent(target)}`)).json()); }
    catch { alert('Failed'); }
    finally { setLoading(false); }
  }

  const filtered = data?.checks.filter(c => c.type === tab) || [];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-violet-400">Optimasi Generasi Baru</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Kesiapan AEO & GEO</h1>
        <p className="text-zinc-500 text-sm max-w-lg mb-8">
          Evaluasi performa konten Anda di Answer Engines (AEO) dan ekosistem Generative AI Search (GEO).
        </p>

        {/* AI Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-l-violet-500/50 border-l-2">
              <div className="text-3xl font-black text-white mb-1">4.4x</div>
              <p className="text-[10px] font-black text-violet-500 uppercase tracking-widest mb-2">Conversion Value</p>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                Trafik yang datang dari sitasi AI memiliki nilai konversi 4.4x lebih tinggi dibanding trafik organik biasa.
              </p>
           </div>
           <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-l-amber-500/50 border-l-2">
              <div className="text-3xl font-black text-white mb-1">60%</div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Zero-Click Search</p>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                60% pencarian kini berakhir tanpa klik. Menjadi "Jawaban Utama" di AI adalah satu-satunya cara bertahan.
              </p>
           </div>
           <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-l-emerald-500/50 border-l-2">
              <div className="text-3xl font-black text-white mb-1">35%</div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Citation Boost</p>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                Mendapatkan sitasi di AI Overviews meningkatkan CTR (Click-Through Rate) hingga 35% lebih besar.
              </p>
           </div>
        </div>
      </header>

      {/* Input Section */}
      <div className="flex gap-3 mb-10 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
        <input 
          ref={inputRef}
          type="url" 
          placeholder="https://contoh-website-anda.com/blog/artikel" 
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-mono"
        />
        <button 
          onClick={run}
          disabled={loading}
          className="bg-violet-600 hover:bg-violet-500 text-white px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(139,92,246,0.2)]"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
          {loading ? 'Menganalisis...' : 'Audit Konten'}
        </button>
      </div>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-violet-500 animate-spin mx-auto mb-6" />
          <p className="text-sm text-zinc-500 font-medium animate-pulse">Menjalankan analisis semantik dan verifikasi data terstruktur...</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Summary Scores */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Answer Engine', value: data.aeoScore, color: 'text-amber-500', sub: 'Efisiensi AEO' },
              { label: 'Generative AI', value: data.geoScore, color: 'text-violet-500', sub: 'Visibilitas GEO' },
              { label: 'Skor AI Ready', value: data.overallScore, color: data.overallScore >= 70 ? 'text-emerald-500' : 'text-amber-500', sub: 'Indeks Komposit' },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center">
                <p className={`text-3xl font-bold mb-1 ${s.color}`}>{s.value}%</p>
                <p className="text-xs font-bold text-white mb-1">{s.label}</p>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Tabbed Results */}
          <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
              {(['AEO', 'GEO'] as const).map(t => (
                <button 
                  key={t} 
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    tab === t 
                      ? (t === 'AEO' ? 'bg-amber-600 text-white' : 'bg-violet-600 text-white') 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t === 'AEO' ? '🎯 Sinyal Answer Engine' : '🤖 Sinyal Generative Engine'}
                </button>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800">
              {filtered.map((c, i) => (
                <div key={i} className="p-5 flex items-start gap-4 hover:bg-zinc-800/20 transition-all group">
                  <div className="mt-1 shrink-0">
                    {c.pass ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-bold text-zinc-100">{c.item}</p>
                      <Zap className={`w-3 h-3 ${c.pass ? 'text-zinc-700' : 'text-zinc-800'}`} />
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed font-medium">{c.detail}</p>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-sm text-zinc-600 font-medium">Tidak ada sinyal terdeteksi untuk kategori ini.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {data && !loading && <div className="mt-20"><Footer /></div>}
    </div>
  );
}
