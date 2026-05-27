'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MessageCircle, MapPin, ShieldCheck, Heart, Award, Globe, Zap } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 bg-[#040609] border-t border-white/5 pt-20 pb-10 px-6 lg:px-12 text-zinc-400 font-sans selection:bg-amber-500/20 mt-auto">
      
      {/* Footer Ambient Background glows */}
      <div className="absolute top-0 right-[15%] w-[350px] h-[350px] bg-amber-500/5 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-[15%] w-[350px] h-[350px] bg-indigo-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        
        {/* Column 1: Brand & TEFA Charter */}
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <Zap className="w-8 h-8 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
              SEO<span className="text-zinc-600">suite</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-500 leading-relaxed">
            <strong className="text-zinc-300">AEO/GEO Answer Engine Platform.</strong> Transformasi website Anda menjadi aset kedaulatan digital. Audit konversi enterprise untuk dominasi pasar.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-widest bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500/80" /> Sovereign Engine
            </div>
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
              <a href="https://agenc1st.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors block">
                • Agenc1st (Tech-Enabled Agency & PMB)
              </a>
            </li>
            <li>
              <a href="https://seosuite.info" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors block">
                • SEOsuite (AEO/GEO Answer Engine Platform)
              </a>
            </li>
            <li>
              <a href="https://adoloweb.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors block">
                • AdoloWeb (AI-Native B2B Growth Engine)
              </a>
            </li>
            <li>
              <a href="https://omniads.ai" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors block">
                • OmniAds (AI-Powered Ads Optimization)
              </a>
            </li>
            <li className="pt-2.5 border-t border-white/5">
              <a href="https://autoprofit.id" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 text-zinc-300 transition-colors flex items-center gap-1.5 font-bold">
                <Globe size={12} className="text-zinc-500" /> Katalog 73 App autoprofit.id
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3: Flagship Ecosystem Features (Col 3 - Sovereign Arsenal) */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Sovereign Arsenal
          </h4>
          <div className="space-y-4">
            <ul className="space-y-2 text-[11px] font-semibold text-zinc-500">
              <li><Link href="/aeo-geo" className="hover:text-white transition-colors block">• AEO & GEO Optimizers</Link></li>
              <li><Link href="/funnel" className="hover:text-white transition-colors block">• Pirate Funnel Auditor</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors block">• Intelijen SEO (Blog)</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors block">• Dasbor Sovereign</Link></li>
            </ul>
          </div>
        </div>

        {/* Column 4: Sertifikasi & Kontak */}
        <div className="flex flex-col gap-5">
          <h4 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/5 pb-2">
            Sertifikasi & Kemitraan
          </h4>
          <ul className="space-y-3.5 text-xs font-semibold text-zinc-500">
            <li className="flex items-center gap-2">
              <Award className="w-4 h-4 text-zinc-500 shrink-0" />
              <a href="https://lsafglobal.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
                LSAF Global ACCA / FIA Qualification
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Award className="w-4 h-4 text-zinc-500 shrink-0" />
              <a href="https://csainstitute.or.id" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-300 transition-colors">
                CSA® Certified Securities Analyst
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-zinc-500 shrink-0" />
              <span className="text-zinc-500 font-normal">Kemendikbudristek Ditjen Vokasi</span>
            </li>
            <li className="pt-3 border-t border-white/5 flex items-center gap-2 text-zinc-400 font-bold">
              <MessageCircle className="w-4 h-4 text-zinc-500 shrink-0" />
              <a href="https://wa.me/62811283522" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                Official WA: +62 811-283-522
              </a>
            </li>
            <li className="flex items-start gap-2 text-zinc-500">
              <MapPin className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
              <span className="font-normal text-[11px] leading-relaxed">
                Jakarta & Yogyakarta, Indonesia
              </span>
            </li>
          </ul>
        </div>

      </div>

      <div className="h-px bg-white/5 max-w-7xl mx-auto mb-8" />

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
        <p className="text-center md:text-left">
          © {currentYear} SEOsuite AI. Hak Cipta Dilindungi. <br className="md:hidden" />
          <span className="text-zinc-500">Developed by Teaching Factory (TEFA) Student Developers × PT ADOLO COACHING MENTORING.</span>
        </p>
        <div className="flex items-center gap-6">
          <span>TEFA Accredited</span>
          <span>|</span>
          <span>Sovereign Platform</span>
        </div>
      </div>

    </footer>
  );
}
