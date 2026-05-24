'use client';

import Link from 'next/link';
import { Zap, Lock, Globe, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-zinc-900 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
                <Zap size={20} className="text-black fill-black" />
              </div>
              <p className="text-xl font-black text-white tracking-tight">
                SEO<span className="text-zinc-500 font-medium">suite</span>
              </p>
            </Link>
            <p className="text-xs text-zinc-500 font-bold leading-relaxed">
              Platform kedaulatan digital untuk optimasi profit dan otoritas brand.
            </p>
          </div>
          
          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Produk</h4>
            <ul className="space-y-3">
              <li><Link href="/aeo-geo" className="text-xs text-zinc-500 hover:text-white transition-colors font-bold">AEO & GEO</Link></li>
              <li><Link href="/funnel" className="text-xs text-zinc-500 hover:text-white transition-colors font-bold">Audit Funnel</Link></li>
              <li><Link href="/local-seo" className="text-xs text-zinc-500 hover:text-white transition-colors font-bold">SEO Lokal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors font-bold">Privacy Policy</Link></li>
              <li><Link href="#" className="text-xs text-zinc-500 hover:text-white transition-colors font-bold">Terms of Service</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-xl">
              <Lock className="w-3 h-3 text-zinc-600" />
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Secured by SSL</span>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-zinc-900/50 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-zinc-700 font-black tracking-[0.4em] uppercase">
            © 2026 SOVEREIGN TECHNOLOGY <span className="text-zinc-800 mx-2">|</span> SEOsuite v3.0
          </p>
          <div className="flex items-center gap-6 opacity-30 grayscale grayscale-0 hover:opacity-100 transition-all">
             <div className="text-[8px] font-black text-zinc-500">MIDTRANS</div>
             <div className="text-[8px] font-black text-zinc-500">VISA</div>
             <div className="text-[8px] font-black text-zinc-500">MASTERCARD</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
