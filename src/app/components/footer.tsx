'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Lock, Globe, Shield, Award } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[#040609] border-t border-white/5 pt-20 pb-10 px-8 text-zinc-400 font-sans selection:bg-amber-500/20">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-[15%] w-[300px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand & Charter */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <Zap size={20} className="text-black fill-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-white leading-none">
                SEO<span className="text-yellow-500">suite</span>
              </span>
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.18em] leading-none mt-1.5">
                TEFA ACADEMY × UNMAHA
              </span>
            </div>
          </Link>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Platform kedaulatan digital untuk optimasi profit dan otoritas brand. Dibangun oleh talenta terbaik melalui program Teaching Factory (TEFA) Universitas Mahakarya Asia.
          </p>
          <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl w-fit">
            <Shield className="w-3.5 h-3.5 text-yellow-500/80" /> Active Protection Guard
          </div>
        </div>

        {/* Column 2: Ecosystem Bernas Mahakarya Asia (SEO Cross-Linking) */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Ecosystem Bernas Mahakarya Asia
          </h4>
          <ul className="space-y-2.5 text-[11px] font-semibold text-zinc-400">
            <li>
              <a href="https://bernas.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors block">
                • BERNAS (Media & Portal Intelektual)
              </a>
            </li>
            <li>
              <a href="https://unmaha.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors block">
                • UNMAHA (Universitas Mahakarya Asia)
              </a>
            </li>
            <li>
              <a href="https://agenc1st.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors block">
                • Agenc1st (Tech-Enabled Agency & PMB)
              </a>
            </li>
            <li>
              <a href="https://seosuite.info" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors block">
                • SEOsuite (AEO/GEO Answer Engine Platform)
              </a>
            </li>
            <li>
              <a href="https://adoloweb.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors block">
                • AdoloWeb (AI-Native B2B Growth Engine)
              </a>
            </li>
            <li>
              <a href="https://omniads.ai" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors block">
                • OmniAds (AI-Powered Ads Optimization)
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Quick Navigation */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Quick Links
          </h4>
          <ul className="space-y-3 text-xs font-bold text-zinc-500">
            <li><Link href="#pricing" className="hover:text-white transition-colors block">• ROI & Pricing</Link></li>
            <li><Link href="#features" className="hover:text-white transition-colors block">• Platform Features</Link></li>
            <li><Link href="/blog" className="hover:text-amber-400 text-yellow-500/90 transition-colors font-extrabold block">⭐ Sovereign Intel Blog</Link></li>
            <li>
              <a href="https://unmaha.ac.id" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors block">
                • PMB UNMAHA Resmi
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Secured & Credits */}
        <div className="flex flex-col gap-5 items-start lg:items-end">
          <h4 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2 w-full lg:text-right">
            Security & Trust
          </h4>
          <div className="flex flex-col gap-3 items-start lg:items-end w-full">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Secured by SSL</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl w-fit">
              <Globe className="w-3.5 h-3.5 text-zinc-500" />
              <a href="https://autoprofit.id" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-amber-400">
                73+ autoprofit.id Apps
              </a>
            </div>
          </div>
        </div>

      </div>

      <div className="h-px bg-white/5 max-w-7xl mx-auto mb-8" />

      {/* Dynamic year, TEFA credits, and active links */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 text-[10px] text-zinc-650 font-bold uppercase tracking-widest">
        <p className="text-center lg:text-left text-zinc-500">
          © {currentYear} SEOsuite AI. Hak Cipta Dilindungi.
        </p>
        <p className="text-center text-zinc-500 font-extrabold tracking-wider max-w-lg lg:max-w-none">
          Developed by Teaching Factory (TEFA) Student Developers × PT ADOLO COACHING MENTORING.
        </p>
      </div>
    </footer>
  );
}
