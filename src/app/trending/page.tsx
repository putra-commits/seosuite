'use client';

import { useState, useEffect } from 'react';
import { Loader2, TrendingUp, ExternalLink, Flame, RefreshCw, Globe, ArrowUpRight } from 'lucide-react';

interface Trend { title: string; traffic: string; link: string; pubDate: string; description: string; }
interface TrendData { trends: Trend[]; realtime: string[]; geo: string; timestamp: string; }

export default function TrendingPage() {
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchTrends() {
    setLoading(true);
    try { setData(await (await fetch('/api/trending')).json()); }
    catch { alert('Failed to fetch trends'); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchTrends(); }, []);

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Sinyal Pasar</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Topik Tren</h1>
          <p className="text-zinc-500 text-sm max-w-lg">
            Intelijen viral real-time dari Google Trends Indonesia. Sinkronisasi dengan permintaan pencarian dan percakapan sosial.
          </p>
        </div>
        
        <button 
          onClick={fetchTrends} 
          disabled={loading}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          {loading ? 'Mengambil...' : 'Perbarui Tren'}
        </button>
      </header>

      {loading && !data && (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-orange-500 animate-spin mb-6" />
          <p className="text-sm text-zinc-500 font-medium animate-pulse">Menghubungkan ke Google Trends API...</p>
        </div>
      )}

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
          {/* Main Trends List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              Volume Pencarian Harian
            </h3>
            <div className="space-y-3">
              {data.trends.map((t, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 group transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5 min-w-0">
                      <span className="text-2xl font-bold font-mono text-zinc-800 group-hover:text-zinc-700 shrink-0 w-8">
                        {(i + 1).toString().padStart(2, '0')}
                      </span>
                      <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-bold text-white truncate">{t.title}</p>
                          {t.link && (
                            <a href={t.link} target="_blank" rel="noopener" className="text-zinc-600 hover:text-white transition-colors">
                              <ArrowUpRight className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        {t.description && (
                          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2">
                            {t.description}
                          </p>
                        )}
                      </div>
                    </div>
                    {t.traffic && (
                      <div className="shrink-0 text-right">
                        <span className="text-[10px] font-bold px-2 py-1 rounded bg-orange-500/10 text-orange-500 uppercase tracking-tighter">
                          {t.traffic} Kunjungan
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Realtime Buzz Sidebar */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Flame className="w-4 h-4 text-red-500" />
                Buzz Real-time
              </h3>
              <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 divide-y divide-zinc-800">
                {data.realtime.map((r, i) => (
                  <div key={i} className="py-3 first:pt-0 last:pb-0 flex items-center gap-3 group">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${i < 3 ? 'bg-red-500' : 'bg-zinc-700'}`} />
                    <span className="text-xs font-medium text-zinc-400 group-hover:text-white transition-colors truncate">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 text-center">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">Wawasan Regional</p>
              <div className="flex items-center justify-center gap-2 text-zinc-300 mb-2">
                <Globe className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-bold">{data.geo} / Indonesia</span>
              </div>
              <p className="text-[10px] text-zinc-500">
                Data diperbarui {new Date(data.timestamp).toLocaleTimeString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
