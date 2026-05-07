'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Search, Zap, Shield, Globe, BarChart3, AlertTriangle,
  CheckCircle2, XCircle, Clock, TrendingUp, Activity,
  ChevronRight, ArrowRight, Star, Code2, Gauge, FileText,
  Link2, Image as ImageIcon, Map, RefreshCw, ExternalLink,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuditResult {
  label: string;
  pass: boolean;
  detail: string;
  severity: 'critical' | 'warn' | 'info';
}

interface AuditSection {
  id: string;
  icon: React.ReactNode;
  title: string;
  results: AuditResult[];
}

interface AuditReport {
  url: string;
  score: number;
  sections: AuditSection[];
  timestamp: string;
}

// ─── Score Ring Component ─────────────────────────────────────────────────────
function ScoreRing({ score, size = 140 }: { score: number; size?: number }) {
  const r = 60;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 90 ? '#10b981' : score >= 70 ? '#f59e0b' : '#ef4444';

  return (
    <svg width={size} height={size} viewBox="0 0 140 140" className="rotate-[-90deg]">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1e2a3a" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color})` }}
      />
    </svg>
  );
}

// ─── Audit Result Row ──────────────────────────────────────────────────────────
function ResultRow({ r }: { r: AuditResult }) {
  const icons = {
    pass:     <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    critical: <XCircle      className="w-4 h-4 text-red-400 shrink-0" />,
    warn:     <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
  };
  const icon = r.pass ? icons.pass : r.severity === 'critical' ? icons.critical : icons.warn;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg transition-colors"
      style={{ background: r.pass ? 'transparent' : r.severity === 'critical' ? 'rgba(239,68,68,0.05)' : 'rgba(245,158,11,0.04)' }}
    >
      <div className="mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.label}</p>
        <p className="text-xs mt-0.5 font-mono" style={{ color: 'var(--text-muted)' }}>{r.detail}</p>
      </div>
    </div>
  );
}

// ─── Feature Card (Landing) ───────────────────────────────────────────────────
function FeatureCard({ icon, title, desc, badge }: { icon: React.ReactNode; title: string; desc: string; badge?: string }) {
  return (
    <div className="card-glow rounded-2xl p-6 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div className="p-2.5 rounded-xl" style={{ background: 'var(--accent-glow)' }}>{icon}</div>
        {badge && <span className="badge-blue text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full">{badge}</span>}
      </div>
      <h3 className="font-semibold text-sm mb-1.5" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, trend, color }: { label: string; value: string; trend?: string; color?: string }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
      <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="text-2xl font-black" style={{ fontFamily: 'var(--font-display)', color: color || 'var(--text-primary)' }}>{value}</p>
      {trend && <p className="text-xs mt-1 text-emerald-400">{trend}</p>}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [url, setUrl]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [report, setReport]     = useState<AuditReport | null>(null);
  const [view, setView]         = useState<'landing' | 'report'>('landing');
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Progress animation during audit
  useEffect(() => {
    if (!loading) return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress(p => p >= 90 ? 90 : p + Math.random() * 8);
    }, 400);
    return () => clearInterval(id);
  }, [loading]);

  async function runAudit() {
    if (!url.trim()) { inputRef.current?.focus(); return; }
    const target = url.startsWith('http') ? url : `https://${url}`;
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch(`/api/audit?url=${encodeURIComponent(target)}`);
      const data: AuditReport = await res.json();
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      setReport(data);
      setView('report');
    } catch {
      alert('Audit failed — check the URL and try again.');
    } finally {
      setLoading(false);
    }
  }

  // ── LANDING ──────────────────────────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <main style={{ minHeight: '100vh' }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(5,8,16,0.8)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50 }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>SEOsuite</span>
            <span className="badge-blue text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ml-1">Beta</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#features" className="text-xs hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>Features</a>
            <a href="#pricing" className="text-xs hover:text-white transition-colors" style={{ color: 'var(--text-muted)' }}>Pricing</a>
            <button
              onClick={() => setView('report')}
              className="text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90"
              style={{ background: 'var(--accent)', color: 'white' }}
            >
              Launch App →
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="text-center px-6 pt-24 pb-20 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8" style={{ borderColor: 'var(--border-bright)', background: 'var(--bg-card)', color: 'var(--text-secondary)' }}>
            <div className="pulse-dot w-2 h-2 rounded-full" style={{ background: 'var(--accent-green)' }} />
            <span className="text-xs font-semibold">Powered by PageSpeed Insights + GSC API</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-none tracking-tighter mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            SEO Intelligence{' '}
            <span className="gradient-text">Automated.</span>
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            53-point technical audit, real-time Core Web Vitals, keyword rank tracking, schema validation — all in one command.
          </p>

          {/* URL Input */}
          <div className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 flex items-center gap-3 px-4 rounded-xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-bright)' }}>
              <Globe className="w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                ref={inputRef}
                type="url"
                placeholder="https://yourdomain.com"
                value={url}
                onChange={e => setUrl(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && runAudit()}
                className="flex-1 bg-transparent text-sm py-3.5 outline-none placeholder:text-slate-600"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}
              />
            </div>
            <button
              onClick={runAudit}
              disabled={loading}
              className="px-6 py-3.5 rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 disabled:opacity-50 whitespace-nowrap"
              style={{ background: 'var(--accent)', color: 'white', boxShadow: '0 0 24px rgba(59,130,246,0.3)' }}
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Run Audit →'}
            </button>
          </div>

          {/* Example sites */}
          <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
            {['bernas.id', 'detik.com', 'kompas.com'].map(s => (
              <button
                key={s}
                onClick={() => { setUrl(`https://${s}`); }}
                className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:border-blue-500/50"
                style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', fontFamily: 'var(--font-mono)' }}
              >
                {s}
              </button>
            ))}
          </div>
        </section>

        {/* Stats bar */}
        <div className="border-y py-6 px-6" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Audit Points', value: '53', color: '#60a5fa' },
              { label: 'CWV Metrics', value: '5', color: '#a78bfa' },
              { label: 'Response Time', value: '<2s', color: '#10b981' },
              { label: 'Accuracy', value: '99.1%', color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <section id="features" className="py-20 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3" style={{ fontFamily: 'var(--font-display)' }}>Everything SEO in one place</h2>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Built for technical SEO teams and developers who demand precision</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FeatureCard icon={<Gauge className="w-5 h-5 text-blue-400" />}  title="Core Web Vitals"       desc="Real-time LCP, INP, CLS, FCP, TTFB — both CrUX field data and Lighthouse lab scores." badge="Live" />
            <FeatureCard icon={<Shield className="w-5 h-5 text-emerald-400" />} title="Security Headers"  desc="HSTS, CSP, X-Frame-Options, CORS — full HTTP security header audit per page." />
            <FeatureCard icon={<Code2 className="w-5 h-5 text-purple-400" />}   title="Schema Validator"  desc="Detects and validates JSON-LD structured data blocks — NewsArticle, BreadcrumbList, FAQ." />
            <FeatureCard icon={<Map className="w-5 h-5 text-amber-400" />}       title="Sitemap Health"    desc="Validates sitemap index, child sitemaps, URL count, lastmod freshness, and robots.txt sync." />
            <FeatureCard icon={<Link2 className="w-5 h-5 text-pink-400" />}      title="Broken Links"      desc="Autonomous internal link crawler — detects 404 leakage and crawl budget waste." badge="New" />
            <FeatureCard icon={<BarChart3 className="w-5 h-5 text-cyan-400" />}  title="GSC Integration"   desc="Keyword performance, impressions, CTR, and position — 7-day and 24-hour windows." />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-8 px-6 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 SEOsuite.info — Built on{' '}
            <a href="https://bernas.id" className="text-blue-400 hover:underline" target="_blank" rel="noopener">BERNAS Intelligence Engine</a>
          </p>
        </footer>
      </main>
    );
  }

  // ── REPORT / DASHBOARD ────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-3 border-b sticky top-0 z-40" style={{ borderColor: 'var(--border)', background: 'rgba(5,8,16,0.95)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => setView('landing')} className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-sm" style={{ fontFamily: 'var(--font-display)' }}>SEOsuite</span>
          </button>
          {report && (
            <span className="text-xs font-mono px-2 py-1 rounded" style={{ background: 'var(--bg-card)', color: 'var(--text-muted)' }}>
              {report.url}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2">
              <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'var(--accent)' }} />
              </div>
              <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{Math.round(progress)}%</span>
            </div>
          )}
          {/* Quick audit input */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <Search className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
            <input
              type="url"
              placeholder="audit another URL..."
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && runAudit()}
              className="bg-transparent text-xs outline-none w-48 placeholder:text-slate-700"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}
            />
          </div>
          <button
            onClick={runAudit}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90 disabled:opacity-50"
            style={{ background: 'var(--accent)', color: 'white' }}
          >
            {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <><Zap className="w-3.5 h-3.5" /> Audit</>}
          </button>
        </div>
      </header>

      {/* Content */}
      {!report && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Globe className="w-12 h-12" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Enter a URL above to run a full SEO audit</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
            <Zap className="w-6 h-6 text-blue-400 absolute inset-0 m-auto" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm mb-1" style={{ fontFamily: 'var(--font-display)' }}>Running 53-point audit...</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Checking robots, sitemaps, schema, CWV, headers & more</p>
          </div>
        </div>
      )}

      {report && (
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Score Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
            <div className="relative shrink-0">
              <ScoreRing score={report.score} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black" style={{ fontFamily: 'var(--font-display)' }}>{report.score}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>/100</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-black" style={{ fontFamily: 'var(--font-display)' }}>SEO Health Report</h1>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${report.score >= 90 ? 'badge-green' : report.score >= 70 ? 'badge-yellow' : 'badge-red'}`}>
                  {report.score >= 90 ? '✅ Excellent' : report.score >= 70 ? '⚠️ Good' : '🔴 Needs Work'}
                </span>
              </div>
              <p className="text-sm mb-3 font-mono" style={{ color: 'var(--text-muted)' }}>{report.url}</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: 'Checks', value: report.sections.flatMap(s => s.results).length },
                  { label: 'Passed', value: report.sections.flatMap(s => s.results).filter(r => r.pass).length, color: '#10b981' },
                  { label: 'Critical', value: report.sections.flatMap(s => s.results).filter(r => !r.pass && r.severity === 'critical').length, color: '#ef4444' },
                  { label: 'Warnings', value: report.sections.flatMap(s => s.results).filter(r => !r.pass && r.severity === 'warn').length, color: '#f59e0b' },
                ].map(s => (
                  <div key={s.label} className="px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}: </span>
                    <span className="text-sm font-bold" style={{ color: s.color || 'var(--text-primary)' }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-xs flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
              <Clock className="w-3.5 h-3.5" />
              {new Date(report.timestamp).toLocaleTimeString()}
            </div>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {report.sections.map((s, i) => {
              const fails = s.results.filter(r => !r.pass).length;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border"
                  style={{
                    background: activeTab === i ? 'var(--accent)' : 'var(--bg-card)',
                    borderColor: activeTab === i ? 'var(--accent)' : 'var(--border)',
                    color: activeTab === i ? 'white' : 'var(--text-secondary)',
                  }}
                >
                  {s.icon}
                  {s.title}
                  {fails > 0 && <span className="badge-red text-[10px] px-1.5 py-0.5 rounded-full">{fails}</span>}
                </button>
              );
            })}
          </div>

          {/* Active Section */}
          {report.sections[activeTab] && (
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
              <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
                {report.sections[activeTab].icon}
                <h2 className="font-semibold text-sm">{report.sections[activeTab].title}</h2>
              </div>
              <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                {report.sections[activeTab].results.map((r, i) => (
                  <ResultRow key={i} r={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
