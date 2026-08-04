'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, Globe, Shield } from 'lucide-react';
import { AdoloSeoMark } from './logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink-900 text-slate-400 selection:bg-accent/20">
      <div className="hairline-gradient" />

      {/* Ambient background glow */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[15%] top-0 h-[300px] w-[300px] rounded-full bg-brand-600/10 blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          {/* Kolom 1: identitas */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="flex items-center gap-3">
              <AdoloSeoMark className="h-10 w-10" />
              <span className="flex flex-col">
                <span className="font-display text-lg font-bold leading-none tracking-tight text-white">
                  Adolo<span className="text-gradient">SEO</span>
                </span>
                <span className="section-label mt-1.5 leading-none text-slate-400">
                  TEFA ACADEMY × UNMAHA
                </span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed">
              Platform kedaulatan digital untuk optimasi profit dan otoritas brand. Dibangun oleh
              talenta terbaik melalui program Teaching Factory (TEFA) Universitas Mahakarya Asia.
            </p>
            <div className="flex w-fit items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              <Shield className="h-3.5 w-3.5 text-accent" /> Active Protection Guard
            </div>
          </div>

          {/* Kolom 2: ekosistem */}
          <div>
            <p className="section-label text-slate-400">Ecosystem Bernas Mahakarya Asia</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a href="https://bernas.id" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  BERNAS (Media &amp; Portal Intelektual)
                </a>
              </li>
              <li>
                <a href="https://unmaha.ac.id" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  UNMAHA (Universitas Mahakarya Asia)
                </a>
              </li>
              <li>
                {/* TODO Putu: agenc1st.id sedang diserahkan ke partner — putuskan apakah tautan ini tetap dipertahankan. */}
                <a href="https://agenc1st.id" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  Agenc1st (Tech-Enabled Agency &amp; PMB)
                </a>
              </li>
              <li>
                <a href="https://adoloweb.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  AdoloWeb (AI-Native B2B Growth Engine)
                </a>
              </li>
              <li>
                <a href="https://omniads.ai" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  OmniAds (AI-Powered Ads Optimization)
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 3: quick links */}
          <div>
            <p className="section-label text-slate-400">Quick Links</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link href="/#pricing" className="transition hover:text-white">ROI &amp; Pricing</Link></li>
              <li><Link href="/#features" className="transition hover:text-white">Platform Features</Link></li>
              <li><Link href="/blog" className="text-accent transition hover:text-white">Sovereign Intel Blog</Link></li>
              <li>
                <a href="https://unmaha.ac.id" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  PMB UNMAHA Resmi
                </a>
              </li>
            </ul>
          </div>

          {/* Kolom 4: security & trust */}
          <div>
            <p className="section-label text-slate-400">Security &amp; Trust</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <span>Secured by SSL</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                <a href="https://autoprofit.id" target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                  73+ autoprofit.id Apps
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-400">
        <p>© {currentYear} AdoloSEO. Hak Cipta Dilindungi.</p>
        <p className="mt-1">
          Developed by Teaching Factory (TEFA) Student Developers × PT ADOLO COACHING MENTORING.
        </p>
      </div>
    </footer>
  );
}
