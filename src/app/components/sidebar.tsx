'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Search, TrendingUp, ShieldCheck,
  Unlink, MapPin, Bot, Layers, Trash2,
  Binary, Filter
} from 'lucide-react';
import { AdoloSeoMark } from './logo';

const MENU = [
  {
    title: 'Wawasan',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'Riset Kata Kunci', href: '/keywords', icon: Search },
      { name: 'Topik Trending', href: '/trending', icon: TrendingUp },
    ]
  },
  {
    title: 'Audit',
    items: [
      { name: 'Audit Teknis', href: '/audit', icon: Binary },
      { name: 'Integritas Konten', href: '/content-audit', icon: ShieldCheck },
      { name: 'Audit Link', href: '/links', icon: Unlink },
      { name: 'Audit Funnel', href: '/funnel', icon: Filter },
    ]
  },
  {
    title: 'Optimasi',
    items: [
      { name: 'SEO Lokal', href: '/local-seo', icon: MapPin },
      { name: 'AEO & GEO', href: '/aeo-geo', icon: Bot },
      { name: 'Pilar Builder', href: '/pilar', icon: Layers },
      { name: 'Detektor Kanibal', href: '/cannibal', icon: Trash2 },
    ]
  }
];


export default function Sidebar() {
  const pathname = usePathname();
  // Sidebar alat hanya untuk rute alat. Halaman publik (/ dan /blog) tidak boleh
  // menampilkannya — sebelumnya bocor tampil di seluruh rute blog.
  if (pathname === '/' || pathname === '/blog' || pathname.startsWith('/blog/')) return null;

  return (
    <div className="w-64 h-screen border-r border-[#27272a] bg-[#09090b] flex flex-col sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 group">
          <AdoloSeoMark className="h-8 w-8" />
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white">Adolo<span className="text-gradient">SEO</span></h1>
            <p className="text-[10px] text-zinc-500 font-medium tracking-widest">Enterprise v3.0</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto pb-6">
        {MENU.map((section, idx) => (
          <div key={idx} className="mb-6">
            <h2 className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {section.title}
            </h2>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all group ${
                      isActive
                        ? 'bg-zinc-800 text-white font-medium shadow-sm'
                        : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800 mt-auto">
        <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-400">
            BP
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-zinc-200 truncate">Sovereign SEO</p>
            <p className="text-[10px] text-zinc-500">v3.0 Production</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
