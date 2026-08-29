'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  ExternalLink,
  Copy,
  Check,
  Phone,
  Building2,
  MapPin,
  Tag,
  Zap,
  RefreshCw,
  Clock,
  Sparkles,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { StoredAuditRecord } from '@/lib/audit-store';
import { generateWhatsAppMessage } from '@/lib/scoring';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<StoredAuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchLeads() {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (data.leads) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLeads();
  }, []);

  async function handleStatusChange(id: string, newStatus: StoredAuditRecord['status']) {
    setUpdatingId(id);
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingId(null);
    }
  }

  function handleCopyWhatsApp(lead: StoredAuditRecord) {
    const text = generateWhatsAppMessage({
      businessName: lead.businessName,
      domain: lead.domain,
      score: lead.score,
      reportSlug: lead.slug,
      top3Issues: lead.top3Issues || [],
    });

    navigator.clipboard.writeText(text);
    setCopiedId(lead.id);
    setTimeout(() => setCopiedId(null), 2500);
  }

  const filteredLeads = leads.filter((lead) => {
    const matchSearch =
      lead.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.whatsapp.includes(searchTerm);

    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#040609] text-zinc-100 font-sans">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Users className="w-4 h-4 text-black" />
            </div>
            <div>
              <h1 className="text-sm font-black uppercase tracking-wider text-white">
                Lead Intelligence Inbox
              </h1>
              <p className="text-[10px] text-zinc-400">SEOsuite Operator Console v3.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchLeads}
              disabled={loading}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] text-zinc-300 transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <Link
              href="/cek-seo"
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
            >
              + Buat Audit Baru
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
        {/* KPI Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-white/10 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Total Audit / Lead</span>
            <div className="text-3xl font-black text-white font-mono">{leads.length}</div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Prospek Baru (New)</span>
            <div className="text-3xl font-black text-amber-400 font-mono">
              {leads.filter((l) => l.status === 'new').length}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-blue-500/20 space-y-1">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Sudah Dihubungi</span>
            <div className="text-3xl font-black text-blue-400 font-mono">
              {leads.filter((l) => l.status === 'contacted').length}
            </div>
          </div>
          <div className="p-5 rounded-2xl bg-zinc-950/60 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Closing (Won)</span>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {leads.filter((l) => l.status === 'won').length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/60 border border-white/10">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari domain, nama, kota, WA..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-zinc-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="all">Semua Status</option>
              <option value="new">Baru (New)</option>
              <option value="contacted">Sudah Dihubungi</option>
              <option value="won">Closing (Won)</option>
              <option value="lost">Lost</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="rounded-3xl bg-zinc-950/60 border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.02] border-b border-white/10 text-zinc-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">Tanggal & Domain</th>
                  <th className="py-4 px-6">Bisnis & Kategori</th>
                  <th className="py-4 px-6">Kontak WhatsApp</th>
                  <th className="py-4 px-6 text-center">Skor SEO</th>
                  <th className="py-4 px-6">Status Pipeline</th>
                  <th className="py-4 px-6 text-right">Aksi Outreach</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-zinc-500">
                      Tidak ada data lead yang cocok dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const date = new Date(lead.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    });

                    return (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        {/* Domain & Date */}
                        <td className="py-4 px-6 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{lead.domain}</span>
                            <Link
                              href={`/laporan/${lead.slug}`}
                              target="_blank"
                              className="text-amber-400 hover:text-amber-300 transition-colors"
                              title="Buka Laporan Publik"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                          <span className="text-[11px] text-zinc-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {date}
                          </span>
                        </td>

                        {/* Business Info */}
                        <td className="py-4 px-6 space-y-1">
                          <div className="font-semibold text-zinc-200">{lead.businessName}</div>
                          <div className="text-[11px] text-zinc-500 flex items-center gap-2">
                            <span>{lead.vertical}</span>
                            <span>•</span>
                            <span>{lead.city}</span>
                          </div>
                        </td>

                        {/* WhatsApp */}
                        <td className="py-4 px-6">
                          {lead.whatsapp ? (
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline font-mono"
                            >
                              <Phone className="w-3.5 h-3.5" />
                              {lead.whatsapp}
                            </a>
                          ) : (
                            <span className="text-zinc-600 italic text-[11px]">Tanpa No WA</span>
                          )}
                        </td>

                        {/* Skor */}
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`inline-block px-3 py-1 rounded-full font-bold font-mono text-xs ${
                              lead.score >= 80
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : lead.score >= 60
                                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {lead.score}/100
                          </span>
                        </td>

                        {/* Pipeline Status */}
                        <td className="py-4 px-6">
                          <select
                            value={lead.status}
                            disabled={updatingId === lead.id}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as StoredAuditRecord['status'])
                            }
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none transition-all ${
                              lead.status === 'new'
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                : lead.status === 'contacted'
                                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                  : lead.status === 'won'
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-zinc-800 border-white/10 text-zinc-400'
                            }`}
                          >
                            <option value="new">Baru (New)</option>
                            <option value="contacted">Sudah Kontak</option>
                            <option value="won">Closing (Won)</option>
                            <option value="lost">Lost</option>
                          </select>
                        </td>

                        {/* WhatsApp Script Copy */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleCopyWhatsApp(lead)}
                            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                              copiedId === lead.id
                                ? 'bg-emerald-500 text-black border-emerald-400 shadow-md shadow-emerald-500/20'
                                : 'bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 border-white/10'
                            }`}
                          >
                            {copiedId === lead.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-black" />
                                <span>Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Script WA</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
