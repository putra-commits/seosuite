/**
 * Satu sumber kebenaran untuk kanal kontak publik.
 *
 * Nomor placeholder lama (6281234567890) SUDAH DIBUANG dari seluruh permukaan
 * publik. Default di bawah memakai nomor WhatsApp Business Official Adolo
 * (resmi dari WhatsApp/Meta) yang sudah aktif — bukan nomor karangan.
 *
 * TODO Putu: kalau lead AdoloSEO harus mendarat di nomor lain, JANGAN edit
 * berkas ini di produksi — set env var berikut lalu restart PM2:
 *   NEXT_PUBLIC_WHATSAPP_NUMBER=628xxxxxxxxxx   (format internasional, tanpa +)
 */
const FALLBACK_WHATSAPP = '6287796885208';

/** Nomor WhatsApp tujuan, format wa.me (internasional, tanpa tanda +). */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || FALLBACK_WHATSAPP;

/** Bangun tautan wa.me lengkap dengan pesan yang sudah ter-encode. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
