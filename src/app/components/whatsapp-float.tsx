'use client';

import { MessageCircle } from 'lucide-react';

// TODO Putu: 6281234567890 masih nomor PLACEHOLDER, bukan nomor Adolo.
// Ganti dengan nomor WhatsApp resmi sebelum kampanye dijalankan.
export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent("Halo Tim AdoloSEO, saya tertarik dengan Arsitektur Konversi dan ingin mendiskusikan potensi dominasi pasar untuk bisnis saya.");
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="group fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full bg-gradient-to-r from-brand-600 to-accent p-4 text-white shadow-[0_0_30px_rgba(37,99,235,0.35)] transition-transform duration-300 hover:scale-110"
      aria-label="Konsultasi Enterprise WhatsApp"
    >
      <MessageCircle className="h-8 w-8" />

      {/* Tooltip */}
      <span className="pointer-events-none absolute right-full top-1/2 mr-4 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-ink-800 px-4 py-2 text-xs font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
        Konsultasi VIP (Bebas Biaya)
      </span>

      {/* Ping effect */}
      <span className="absolute right-0 top-0 h-3 w-3 animate-ping rounded-full bg-accent" />
      <span className="absolute right-0 top-0 h-3 w-3 rounded-full border border-ink-900 bg-accent" />
    </button>
  );
}
