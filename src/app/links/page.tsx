'use client';

import { useState, useRef } from 'react';
import {
  Globe, Loader2, Link2, ExternalLink, AlertTriangle,
  CheckCircle2, XCircle, Shield, ArrowUpRight, Search, Anchor
} from 'lucide-react';

interface LinkItem {
  url: string; status: number; type: 'internal' | 'external';
  anchor: string; source: string; toxic: boolean; reason?: string;
}
interface LinkData {
  stats: { totalLinks: number; checked: number; internal: number; external: number; broken: number; toxic: number; healthy: number };
  broken: LinkItem[]; toxic: LinkItem[]; healthy: LinkItem[]; internal: LinkItem[];
}

type Tab = 'broken' | 'toxic' | 'healthy' | 'internal';

export default function LinksPage() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<LinkData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('broken');
  const inputRef = useRef<HTMLInputElement>(null);

  async function runScan() {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    const target = url.startsWith('http') ? url : `https://${url}`;
    setLoading(true); setData(null);
    try { setData(await (await fetch(`/api/links?url=${encodeURIComponent(target)}`)).json()); }
    catch { alert('Scan failed'); }
    finally { setLoading(false); }
  }

  const TABS: { key: Tab; label: string; color: string; count?: number }[] = data ? [
    { key: 'broken', label: 'Rusak', color: 'text-red-500', count: data.stats.broken },
    { key: 'toxic', label: 'Toksik', color: 'text-amber-500', count: data.stats.toxic },
    { key: 'healthy', label: 'Sehat', color: 'text-emerald-500', count: data.stats.healthy },
    { key: 'internal', label: 'Internal', color: 'text-blue-500', count: data.stats.internal },
  ] : [];

  const currentList = data ? (tab === 'broken' ? data.broken : tab === 'toxic' ? data.toxic : tab === 'healthy' ? data.healthy : data.internal) : [];

  return (
    <div className="p-8 lg:p-12 max-w-5xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Link2 className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Intelijen Tautan</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Link & Backlink</h1>
          <p className="text-zinc-500 text-sm max-w-lg">
            Pindai tautan internal yang rusak, pantau toksisitas backlink, dan analisis kesehatan tautan secara menyeluruh di seluruh domain Anda.
          </p>
        </div>
        
        <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <input 
            ref={inputRef}
            type="url" 
            placeholder="https://seosuite.info" 
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runScan()}
            className="bg-transparent px-4 py-2 text-xs outline-none font-mono min-w-[200px]"
          />
          <button 
            onClick={runScan} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
            {loading ? 'Merayap...' : 'Pindai Domain'}
          </button>
        </div>
      </header>

      {loading && (
        <div className="py-24 text-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-blue-500 animate-spin mx-auto mb-6" />
          <p className="text-sm text-zinc-500 font-medium animate-pulse">Merayap struktur domain secara mendalam dan memverifikasi header HTTP...</p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Link', value: data.stats.totalLinks, color: 'text-zinc-400' },
              { label: 'Rusak', value: data.stats.broken, color: 'text-red-500' },
              { label: 'Toksik', value: data.stats.toxic, color: 'text-amber-500' },
              { label: 'Sehat', value: data.stats.healthy, color: 'text-emerald-500' },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Action & Filter Hub */}
          <div className="space-y-4">
            <div className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
              {TABS.map(t => (
                <button 
                  key={t.key} 
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    tab === t.key 
                      ? 'bg-zinc-800 text-white shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                    tab === t.key ? 'bg-zinc-700 text-white' : 'bg-zinc-950 text-zinc-600'
                  }`}>{t.count}</span>
                </button>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto divide-y divide-zinc-800 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                {currentList.length === 0 ? (
                  <div className="py-20 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500/20 mx-auto mb-4" />
                    <p className="text-sm text-zinc-500 font-medium">Tidak ada tautan ditemukan dalam kategori {tab}.</p>
                  </div>
                ) : (
                  currentList.map((l, i) => (
                    <div key={i} className="p-5 flex items-center justify-between hover:bg-zinc-800/20 transition-all group">
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          l.toxic ? 'bg-amber-500/10' : 
                          l.status >= 400 || l.status === 0 ? 'bg-red-500/10' : 
                          'bg-emerald-500/10'
                        }`}>
                          {l.toxic ? <AlertTriangle className="w-4 h-4 text-amber-500" /> :
                           l.status >= 400 || l.status === 0 ? <XCircle className="w-4 h-4 text-red-500" /> :
                           <Link2 className="w-4 h-4 text-emerald-500" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-zinc-400 group-hover:text-zinc-100 transition-colors truncate mb-1">{l.url}</p>
                          <div className="flex items-center gap-3">
                            {l.anchor && (
                              <span className="text-[10px] text-zinc-600 flex items-center gap-1">
                                <Anchor className="w-2.5 h-2.5" />
                                {l.anchor}
                              </span>
                            )}
                            {l.reason && (
                              <span className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest">{l.reason}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 shrink-0 ml-4">
                        <div className="text-right">
                          <p className={`text-xs font-bold ${
                            l.status >= 200 && l.status < 400 ? 'text-emerald-500' : 'text-red-500'
                          }`}>{l.status || 'TIMEOUT'}</p>
                          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{l.type === 'internal' ? 'Internal' : 'Eksternal'}</p>
                        </div>
                        <a 
                          href={l.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
