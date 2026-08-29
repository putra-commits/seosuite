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
// DIUBAH 4 Agu 2026 dari 5208 ke 6780. Alasannya bukan preferensi:
// nomor 5208 terdaftar di WhatsApp atas nama "Jasa Promo ID", sehingga
// pembeli Adolo mendarat di chat bermerek lain. adolo.id sendiri sudah
// memindahkan seluruh CTA-nya ke 6780 hari ini (PR #79 repo adolo.id).
// AdoloSEO ikut, supaya satu ekosistem satu pintu.
const FALLBACK_WHATSAPP = '6287796886780';

/** Nomor WhatsApp tujuan, format wa.me (internasional, tanpa tanda +). */
export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/[^0-9]/g, '') || FALLBACK_WHATSAPP;

/** Bangun tautan wa.me lengkap dengan pesan yang sudah ter-encode. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Saklar pembayaran online.
 *
 * DIMATIKAN 4 Agu 2026 atas keputusan Putu. Alasannya bukan teknis:
 * kunci Midtrans di lingkungan ini milik entitas lain (Yayasan), bukan
 * PT Adolo Coaching Mentoring yang menjual AdoloSEO. Menyalakannya berarti
 * uang penjualan mendarat di rekening entitas yang salah — masalah
 * pembukuan dan pajak, bukan sekadar konfigurasi.
 *
 * Skripnya juga masih menunjuk app.sandbox.midtrans.com, jadi kalaupun
 * dinyalakan sekarang, popup pembayaran tidak akan pernah menagih uang
 * sungguhan sementara pelanggan mengira sudah membayar.
 *
 * Selama false: seluruh tier ditutup manual lewat WhatsApp, dan skrip
 * Midtrans Snap tidak dimuat sama sekali.
 *
 * Untuk menyalakan nanti: pastikan kunci Midtrans PT ACM sudah terpasang
 * DAN src/app/page.tsx sudah menunjuk app.midtrans.com (bukan sandbox),
 * baru ubah nilai di bawah jadi true.
 */
export const PEMBAYARAN_ONLINE_AKTIF = false;
