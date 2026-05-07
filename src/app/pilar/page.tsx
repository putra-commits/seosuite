'use client';

import { useState } from 'react';
import { Map, Plus, X, Zap, ArrowLeft, Download, BarChart3, Globe, FileText, TrendingUp } from 'lucide-react';
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
  informational: 'badge-blue',
  commercial:    'badge-yellow',
  transactional: 'badge-green',
};

const DEFAULT_KEYWORDS = [
  'Next.js Server Components', 'SEO Technical Audit', 'Core Web Vitals Optimization',
  'Content Marketing Strategy', 'Digital Transformation UMKM', 'AI Marketing Automation',
];
const DEFAULT_CITIES = ['Jakarta', 'Bandung', 'Surabaya', 'Yogyakarta', 'Medan',
  'Makassar', 'Semarang', 'Palembang', 'Balikpapan', 'Denpasar'];

export default function PilarPage() {
  const [keywords, setKeywords]     = useState<string[]>(DEFAULT_KEYWORDS);
  const [cities, setCities]         = useState<string[]>(DEFAULT_CITIES.slice(0, 5));
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
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-40"
        style={{ borderColor: 'var(--border)', background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-sm" style={{ fontFamily: 'var(--font-display)' }}>SEOsuite</span>
          </Link>
          <span style={{ color: 'var(--border-bright)' }}>/</span>
          <div className="flex items-center gap-1.5">
            <Map className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Pilar1st</span>
            <span className="badge-blue text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ml-1">Add-on</span>
          </div>
        </div>
        {result && (
          <button onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors hover:border-blue-500/50"
            style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-4 text-xs"
            style={{ borderColor: 'var(--border-bright)', background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
            <Map className="w-3.5 h-3.5 text-purple-400" />
            National Data Alchemist — GEO × Keyword Matrix
          </div>
          <h1 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            Pilar<span className="gradient-text">1st</span> Builder
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            100 keywords × 10 kota = 1.000 artikel tanpa duplikasi. Topic cluster otomatis dengan GEO-SEO matrix.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Config Panel */}
          <div className="lg:col-span-1 space-y-4">
            {/* Keywords */}
            <div className="rounded-xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold">Keywords <span style={{ color: 'var(--text-muted)' }}>({keywords.length}/100)</span></h2>
              </div>
              <div className="flex gap-2 mb-3">
                <input value={kwInput} onChange={e => setKwInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addKeyword()}
                  placeholder="Add keyword..."
                  className="flex-1 bg-transparent text-xs py-2 px-3 rounded-lg border outline-none placeholder:text-slate-700"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }} />
                <button onClick={addKeyword}
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ background: 'var(--accent)' }}>
                  <Plus className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {keywords.map((kw, i) => (
                  <div key={i} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                    style={{ background: 'var(--bg-surface)' }}>
                    <span className="text-xs font-mono truncate" style={{ color: 'var(--text-secondary)' }}>{kw}</span>
                    <button onClick={() => setKeywords(p => p.filter((_, j) => j !== i))}>
                      <X className="w-3 h-3 hover:text-red-400" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cities */}
            <div className="rounded-xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <h2 className="text-sm font-semibold mb-3">Kota GEO-SEO <span style={{ color: 'var(--text-muted)' }}>({cities.length}/10)</span></h2>
              <div className="flex gap-2 mb-3">
                <input value={cityInput} onChange={e => setCityInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addCity()}
                  placeholder="Tambah kota..."
                  className="flex-1 bg-transparent text-xs py-2 px-3 rounded-lg border outline-none placeholder:text-slate-700"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                <button onClick={addCity}
                  className="p-2 rounded-lg hover:opacity-80"
                  style={{ background: 'rgba(168,85,247,0.2)' }}>
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cities.map((c, i) => (
                  <div key={i} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs border"
                    style={{ borderColor: 'var(--border-bright)', background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                    <Globe className="w-3 h-3" />
                    {c}
                    <button onClick={() => setCities(p => p.filter((_, j) => j !== i))}>
                      <X className="w-2.5 h-2.5" style={{ color: 'var(--text-muted)' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button onClick={generate} disabled={loading || keywords.length === 0}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #3b82f6)', color: 'white', boxShadow: '0 0 32px rgba(124,58,237,0.3)' }}>
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Generating...</>
              ) : (
                <><Map className="w-4 h-4" /> Generate {keywords.length * cities.length} Articles</>
              )}
            </button>
          </div>

          {/* Result Panel */}
          <div className="lg:col-span-2">
            {!result && !loading && (
              <div className="h-64 flex flex-col items-center justify-center gap-3 rounded-xl border"
                style={{ borderColor: 'var(--border)', borderStyle: 'dashed' }}>
                <Map className="w-10 h-10" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Configure keywords & cities, then generate your cluster</p>
              </div>
            )}

            {loading && (
              <div className="h-64 flex flex-col items-center justify-center gap-4 rounded-xl border"
                style={{ borderColor: 'var(--border)' }}>
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-500 animate-spin" />
                  <Map className="w-5 h-5 text-purple-400 absolute inset-0 m-auto" />
                </div>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Building topic cluster matrix...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Articles', value: result.summary.totalArticles, icon: <FileText className="w-3.5 h-3.5 text-blue-400" />, color: '#60a5fa' },
                    { label: 'Coverage', value: `${result.summary.coverage}%`, icon: <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />, color: '#10b981' },
                    { label: 'Est. Days', value: result.summary.estimatedDays, icon: <TrendingUp className="w-3.5 h-3.5 text-amber-400" />, color: '#f59e0b' },
                    { label: 'Keywords', value: result.summary.keywords, icon: <Map className="w-3.5 h-3.5 text-purple-400" />, color: '#a78bfa' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl border p-3" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      <div className="flex items-center gap-1.5 mb-1.5">{s.icon}<span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: 'var(--text-muted)' }}>{s.label}</span></div>
                      <p className="text-xl font-black" style={{ fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</p>
                    </div>
                  ))}
                </div>

                {/* Intent breakdown */}
                <div className="rounded-xl border p-4" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>Search Intent Distribution</h3>
                  <div className="flex gap-3 flex-wrap">
                    {Object.entries(result.summary.intentBreakdown).map(([intent, count]) => (
                      <div key={intent} className={`${INTENT_COLORS[intent]} text-xs font-semibold px-3 py-1.5 rounded-full`}>
                        {intent}: {count}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Keyword tabs + cluster list */}
                <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                  {/* Keyword selector */}
                  <div className="border-b overflow-x-auto" style={{ borderColor: 'var(--border)' }}>
                    <div className="flex">
                      {result.clusters.map((c, i) => (
                        <button key={i} onClick={() => setActiveKw(i)}
                          className="px-4 py-2.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors"
                          style={{
                            borderColor: activeKw === i ? 'var(--accent)' : 'transparent',
                            color: activeKw === i ? 'var(--text-primary)' : 'var(--text-muted)',
                          }}>
                          {c.keyword}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cluster articles */}
                  {activeKw !== null && result.clusters[activeKw] && (
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {result.clusters[activeKw].clusters.map((a, i) => (
                        <div key={i} className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-1 shrink-0">
                            <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
                            <span className="text-xs font-bold w-20 shrink-0" style={{ color: 'var(--text-muted)' }}>{a.city}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                            <p className="text-xs mt-0.5 font-mono truncate" style={{ color: 'var(--text-muted)' }}>/nasional/news/{a.slug}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={`${INTENT_COLORS[a.intent]} text-[10px] font-bold px-2 py-0.5 rounded-full`}>{a.intent}</span>
                            <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>{a.wordTarget}w</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
