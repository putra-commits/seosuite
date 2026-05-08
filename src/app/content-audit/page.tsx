'use client';

import { useState } from 'react';
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Loader2,
  Trash2, Search, ArrowUpRight, Filter, Info
} from 'lucide-react';

interface Disease { key: string; label: string; count: number; }
interface Article { id: string; title: string; score: number; verdict: string; findings: string[]; }
interface AuditData {
  stats: { total: number; critical: number; review: number; pass: number };
  diseases: Disease[];
  articles: Article[];
}

const LABELS: Record<string, string> = {
  STALE: 'Data Usang', MINISTER: 'Pejabat Lama', VAGUE: 'Atribusi Samar',
  QUOTE: 'Kutipan Palsu', PROMO: 'Self-Promo',
};

export default function ContentAuditPage() {
  const [data, setData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [unpublishing, setUnpublishing] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'REVIEW' | 'PASS'>('ALL');
  const [limit, setLimit] = useState('100');
  const [unpublished, setUnpublished] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  async function runAudit() {
    setLoading(true); setData(null); setUnpublished(0);
    try {
      const res = await fetch(`/api/content-audit?limit=${limit}`);
      setData(await res.json());
    } catch { alert('Audit failed'); }
    finally { setLoading(false); }
  }

  async function unpublishCritical() {
    if (!data) return;
    const ids = data.articles.filter(a => a.verdict === 'CRITICAL').map(a => a.id);
    if (ids.length === 0) return;
    if (!confirm(`Batalkan publikasi ${ids.length} artikel KRITIS?`)) return;
    setUnpublishing(true);
    try {
      const res = await fetch('/api/unpublish', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, reason: 'Content Integrity Audit — CRITICAL' }),
      });
      setUnpublished((await res.json()).unpublished);
    } catch { alert('Gagal membatalkan publikasi'); }
    finally { setUnpublishing(false); }
  }

  const filtered = data?.articles.filter(a => {
    if (filter !== 'ALL' && a.verdict !== filter) return false;
    if (searchTerm && !a.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) || [];

  return (
    <div className="p-8 lg:p-12 max-w-6xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Kedaulatan Konten</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Audit Integritas Konten</h1>
          <p className="text-zinc-500 text-sm max-w-lg">Mendeteksi data usang, kutipan palsu, dan atribusi basi di seluruh basis data publikasi Anda.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1 flex items-center gap-2">
            <span className="text-[10px] font-bold text-zinc-500 uppercase">Limit</span>
            <select 
              value={limit} 
              onChange={e => setLimit(e.target.value)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="500">500</option>
            </select>
          </div>
          <button 
            onClick={runAudit} 
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Menganalisis basis data...' : 'Pindai Integritas'}
          </button>
        </div>
      </header>

      {loading && (
        <div className="py-24 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-emerald-500 animate-spin mb-6" />
          <p className="text-sm text-zinc-500 font-medium animate-pulse text-center">
            Membedah konten artikel melalui mesin Alchemy...<br/>
            <span className="text-[10px] uppercase tracking-widest mt-2 block">Mencocokkan atribusi dengan basis data pemerintah terkini</span>
          </p>
        </div>
      )}

      {data && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Dipindai', value: data.stats.total, color: 'text-zinc-400' },
              { label: 'Kritis', value: data.stats.critical, color: 'text-red-500' },
              { label: 'Dalam Tinjauan', value: data.stats.review, color: 'text-amber-500' },
              { label: 'Teroptimasi', value: data.stats.pass, color: 'text-emerald-500' },
            ].map(s => (
              <div key={s.label} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Disease Breakdown */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Rincian Masalah
              </h3>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase">Tipe Deteksi</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase text-right">Jumlah</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase">Tingkat Keparahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800">
                    {data.diseases.map(d => (
                      <tr key={d.key} className="hover:bg-zinc-800/20">
                        <td className="px-6 py-4 text-sm font-medium text-zinc-200">{d.label}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white text-right font-mono">{d.count}</td>
                        <td className="px-6 py-4">
                          <div className="w-full max-w-[100px] h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${d.key === 'STALE' || d.key === 'MINISTER' ? 'bg-red-500' : 'bg-amber-500'}`}
                              style={{ width: `${Math.min(100, (d.count / data.stats.total) * 1000)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-500" />
                Tindakan Darurat
              </h3>
              <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-red-500 mt-1" />
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Membatalkan publikasi artikel dengan status <span className="text-red-500 font-bold">KRITIS</span> akan segera memindahkannya ke draf. 
                    Direkomendasikan untuk menjaga otoritas editorial yang tinggi.
                  </p>
                </div>
                <button 
                  onClick={unpublishCritical} 
                  disabled={unpublishing || data.stats.critical === 0}
                  className="w-full bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-30"
                >
                  {unpublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  Tarik {data.stats.critical} Artikel Kritis
                </button>
                {unpublished > 0 && (
                  <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold text-center">
                    BERHASIL: {unpublished} ARTIKEL DITARIK
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Detailed List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Article Ledger</h3>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-1.5">
                <Search className="w-3.5 h-3.5 text-zinc-500" />
                <input 
                  type="text" 
                  placeholder="Filter berdasarkan judul..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="bg-transparent text-xs font-medium text-white outline-none w-48"
                />
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-2 border-b border-zinc-800 flex items-center gap-1">
                {(['ALL', 'CRITICAL', 'REVIEW', 'PASS'] as const).map(f => (
                  <button 
                    key={f} 
                    onClick={() => setFilter(f)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                      filter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {f === 'ALL' ? 'SEMUA' : f === 'CRITICAL' ? 'KRITIS' : f === 'REVIEW' ? 'TINJAUAN' : 'LULUS'}
                  </button>
                ))}
              </div>
              <div className="divide-y divide-zinc-800 max-h-[600px] overflow-y-auto">
                {filtered.map(a => (
                  <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-zinc-800/20 group transition-all">
                    <div className="mt-0.5">
                      {a.verdict === 'CRITICAL' ? <XCircle className="w-5 h-5 text-red-500" /> :
                       a.verdict === 'REVIEW' ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
                       <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white">{a.title}</p>
                        <ArrowUpRight className="w-3 h-3 text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-zinc-600 uppercase">ID: {a.id.substring(0, 8)}</span>
                        <div className="flex gap-1">
                          {a.findings.slice(0, 2).map((f, i) => (
                            <span key={i} className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              f === 'STALE' || f === 'MINISTER' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              {LABELS[f] || f}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold font-mono ${
                        a.score < 50 ? 'text-red-500' : a.score < 80 ? 'text-amber-500' : 'text-emerald-500'
                      }`}>{a.score}</p>
                      <p className="text-[9px] font-bold text-zinc-600 uppercase">Skor Integritas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
