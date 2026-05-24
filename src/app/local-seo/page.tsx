'use client';

import { useState, useRef } from 'react';
import { MapPin, Globe, Loader2, CheckCircle2, XCircle, ArrowUpRight, Compass } from 'lucide-react';
import Footer from '../components/footer';

interface Check { item: string; pass: boolean; detail: string; category: string; }
interface LocalData { url: string; score: number; totalChecks: number; passed: number; failed: number; checks: Check[]; }

export default function LocalSeoPage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<LocalData | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function run() {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    const target = url.startsWith('http') ? url : `https://${url}`;
    setLoading(true); setData(null);
    try { setData(await (await fetch(`/api/local-seo?url=${encodeURIComponent(target)}`)).json()); }
    catch { alert('Failed'); }
    finally { setLoading(false); }
  }

  const categories = data ? [...new Set(data.checks.map(c => c.category))] : [];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-cyan-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Intelijen Kedekatan</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Audit SEO Lokal</h1>
        <p className="text-zinc-500 text-sm max-w-lg mb-8">
          Menganalisis konsistensi NAP, sinyal Geo-targeting, dan kepatuhan Skema Lokal untuk aset perusahaan Anda.
        </p>

        {/* Local SEO Intelligence Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-l-cyan-500/50 border-l-2">
              <div className="text-3xl font-black text-white mb-1">76%</div>
              <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-2">Visit Rate</p>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                76% orang yang melakukan pencarian lokal di smartphone mengunjungi bisnis terkait dalam 24 jam.
              </p>
           </div>
           <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-l-emerald-500/50 border-l-2">
              <div className="text-3xl font-black text-white mb-1">28%</div>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">Purchase Intent</p>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                28% dari pencarian "di dekat saya" (near me) berakhir dengan pembelian nyata di lokasi.
              </p>
           </div>
           <div className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 border-l-amber-500/50 border-l-2">
              <div className="text-3xl font-black text-white mb-1">46%</div>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">Global Intent</p>
              <p className="text-[10px] text-zinc-500 font-bold leading-relaxed">
                46% dari seluruh pencarian di Google adalah untuk mencari informasi bisnis atau layanan lokal.
              </p>
           </div>
        </div>
      </header>

      {/* Input Section */}
      <div className="flex gap-3 mb-10 p-2 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
        <input 
          ref={inputRef}
          type="url" 
          placeholder="https://seosuite.info" 
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && run()}
          className="flex-1 bg-transparent px-4 py-3 text-sm outline-none font-mono"
        />
        <button 
          onClick={run}
          disabled={loading}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Compass className="w-4 h-4" />}
          {loading ? 'Memindai...' : 'Analisis Kehadiran'}
        </button>
      </div>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-cyan-500 animate-spin mx-auto mb-6" />
          <p className="text-sm text-zinc-500 font-medium animate-pulse">Memverifikasi penanda berbasis lokasi dan sinyal kutipan...</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Summary Card */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-center flex flex-col justify-center">
              <p className={`text-4xl font-bold mb-1 ${
                data.score >= 80 ? 'text-emerald-500' : data.score >= 50 ? 'text-amber-500' : 'text-red-500'
              }`}>{data.score}</p>
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Otoritas Lokal</p>
            </div>
            {[
              { label: 'Pengecekan', value: data.totalChecks, color: 'text-zinc-400' },
              { label: 'Lulus', value: data.passed, color: 'text-emerald-500' },
              { label: 'Gagal', value: data.failed, color: 'text-red-500' },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Detailed Checks */}
          <div className="space-y-6">
            {categories.map(cat => (
              <div key={cat} className="space-y-3">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Sinyal {cat}</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800">
                  {data.checks.filter(c => c.category === cat).map((c, i) => (
                    <div key={i} className="p-5 flex items-start gap-4 hover:bg-zinc-800/20 transition-all">
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
                          <ArrowUpRight className="w-3 h-3 text-zinc-700" />
                        </div>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{c.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {data && !loading && <div className="mt-20"><Footer /></div>}
    </div>
  );
}
