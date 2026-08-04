'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { AdoloSeoMark } from './logo';

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: 'Fitur', href: '/#features' },
  { label: 'Arsenal', href: '/#arsenal' },
  { label: 'Harga', href: '/#pricing' },
  { label: 'Blog', href: '/blog' },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <AdoloSeoMark className="h-9 w-9" />
          <span className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
            Adolo<span className="text-gradient">SEO</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 text-sm font-medium text-slate-300 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 transition hover:bg-white/5 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg bg-gradient-to-r from-brand-600 to-accent px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/20 transition hover:brightness-110"
          >
            Dashboard
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="site-nav-mobile"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            className="rounded-lg border border-white/15 p-2 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="site-nav-mobile" className="border-t border-white/10 bg-ink/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
