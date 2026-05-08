'use client';

import { useState } from 'react';
import {
  Loader2, Trash2, CheckCircle2, XCircle, Fish, ArrowUpRight, Filter, Info, ChevronDown, Search
} from 'lucide-react';

interface Art { id: string; title: string; keyword: string; len: number; }
interface Group { keep: Art; drops: Art[]; }
interface CannibalData {
  stats: { totalScanned: number; groupsFound: number; duplicates: number; uniqueKept: number };
  groups: Group[];
}

export default function CannibalPage() {
  const [data, setData] = useState<CannibalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [unpublished, setUnpublished] = useState(0);
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  async function runScan() {
    setLoading(true); setData(null); setUnpublished(0);
    try { setData(await (await fetch('/api/cannibal')).json()); }
    catch { alert('Scan gagal'); }
    finally { setLoading(false); }
  }

  async function unpublishAll() {
    if (!data) return;
    const ids = data.groups.flatMap(g => g.drops.map(d => d.id));
    if (!ids.length || !confirm(`Unpublish ${ids.length} artikel duplikat?`)) return;
    setUnpublishing(true);
    try {
      const res = await fetch('/api/unpublish', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, reason: 'SEO Suite — cannibal duplicate removal' }),
      });
      setUnpublished((await res.json()).unpublished);
    } catch { alert('Gagal membatalkan publikasi'); }
    finally { setUnpublishing(false); }
  }

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Fish className="w-4 h-4 text-amber-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Optimasi Konten</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Detektor Kanibalisasi</h1>
          <p className="text-zinc-500 text-sm max-w-lg">Identifikasi artikel yang hampir duplikat yang bersaing untuk kata kunci yang sama. Konsolidasikan otoritas ke dalam satu aset berperforma tinggi.</p>
        </div>
        
        <button 
          onClick={runScan} 
          disabled={loading}
          className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white px-8 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          {loading ? 'Menganalisis klaster...' : 'Pindai Database'}
        </button>
      </header>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-amber-500 animate-spin mx-auto mb-6" />
          <p className="text-sm text-zinc-500 font-medium animate-pulse">Menjalankan analisis klaster pada judul artikel...</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Dipindai', value: data.stats.totalScanned, color: 'text-zinc-400' },
              { label: 'Klaster Ditemukan', value: data.stats.groupsFound, color: 'text-amber-500' },
              { label: 'Duplikat', value: data.stats.duplicates, color: 'text-red-500' },
              { label: 'Unik Disimpan', value: data.stats.uniqueKept, color: 'text-emerald-500' },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Action Hub */}
          <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Strategi Konsolidasi</h3>
                <p className="text-xs text-zinc-500 max-w-md mt-1 leading-relaxed">
                  Sistem secara otomatis memprioritaskan artikel terpanjang sebagai versi "Master". 
                  Duplikat yang ditarik akan dipindahkan ke draf untuk menghentikan kanibalisasi kata kunci.
                </p>
              </div>
            </div>
            {data.stats.duplicates > 0 && (
              <button 
                onClick={unpublishAll} 
                disabled={unpublishing}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-30 whitespace-nowrap"
              >
                {unpublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Konsolidasikan {data.stats.duplicates} Duplikat
              </button>
            )}
          </div>

          {unpublished > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-in slide-in-from-top duration-300">
              <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Berhasil Mengonsolidasi {unpublished} Aset</p>
            </div>
          )}

          {/* Clusters */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-1">Klaster Terdeteksi</h3>
            <div className="space-y-3">
              {data.groups.map((g, i) => (
                <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
                  <button 
                    onClick={() => setExpandedGroup(expandedGroup === i ? null : i)}
                    className="w-full p-5 flex items-center justify-between text-left hover:bg-zinc-800/20 transition-all"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0">
                        {g.drops.length + 1} Versi
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-zinc-100 group-hover:text-white truncate">
                          {g.keep.keyword || '(No Keyword Linked)'}
                        </p>
                        <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Unggulan: {g.keep.title}</p>
                      </div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-zinc-600 transition-transform ${expandedGroup === i ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expandedGroup === i && (
                    <div className="px-5 pb-5 animate-in slide-in-from-top-2 duration-200">
                      <div className="pt-4 border-t border-zinc-800 space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-white mb-1 truncate">{g.keep.title}</p>
                            <p className="text-[9px] font-bold text-emerald-500/60 uppercase tracking-widest">Status: Dipertahankan (Master) — {g.keep.len} Karakter</p>
                          </div>
                        </div>
                        {g.drops.map(d => (
                          <div key={d.id} className="flex items-start gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                            <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-zinc-300 mb-1 truncate">{d.title}</p>
                              <p className="text-[9px] font-bold text-red-500/60 uppercase tracking-widest">Status: Ditarik — {d.len} Karakter</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
