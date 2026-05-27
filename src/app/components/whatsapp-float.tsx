'use client';

import { MessageCircle } from 'lucide-react';

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent("Halo Tim SEOsuite, saya tertarik dengan Arsitektur Konversi dan ingin mendiskusikan potensi dominasi pasar untuk bisnis saya.");
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-[0_0_30px_rgba(234,179,8,0.3)] hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
      aria-label="Konsultasi Enterprise WhatsApp"
    >
      <MessageCircle className="w-8 h-8" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs font-bold rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        Konsultasi VIP (Bebas Biaya)
      </span>
      
      {/* Ping effect */}
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border border-black" />
    </button>
  );
}
