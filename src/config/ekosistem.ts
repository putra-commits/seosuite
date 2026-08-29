/**
 * Ekosistem produk Adolo — cermin dari adolo.id.
 *
 * SUMBER KEBENARAN ADA DI LUAR REPO INI:
 *   /var/www/adolo.id/src/config/products.ts
 *   dan endpoint hidupnya https://adolo.id/api/products
 *
 * Berkas ini sengaja SALINAN STATIS, bukan fetch saat build. Alasannya:
 * kalau adolo.id sedang tumbang, build AdoloSEO tidak boleh ikut gagal.
 * Konsekuensinya daftar ini bisa basi — cara menyegarkan:
 *
 *   curl -s https://adolo.id/api/products | jq -r '.[] | "\(.status) \(.subBrand) \(.url)"'
 *
 * lalu samakan isinya. Terakhir disamakan: 4 Agustus 2026.
 *
 * ATURAN YANG DIWARISI DARI adolo.id (`canLinkExternally`): produk berstatus
 * 'soon' TIDAK BOLEH ditaut keluar — hanya 'production' dan 'beta'. Ini yang
 * dulu tidak ada di footer SEOsuite, sehingga tiga tautan mati sempat tayang
 * (agenc1st.id, adoloweb.com, autoprofit.id yang 502).
 */

export type StatusProduk = 'production' | 'beta' | 'soon';

export type Produk = {
  nama: string;
  url: string;
  status: StatusProduk;
};

/** Produk keluarga Adolo. Urutannya mengikuti adolo.id. */
export const PRODUK_ADOLO: Produk[] = [
  { nama: 'AdoloChat', url: 'https://chat.adolo.id', status: 'production' },
  { nama: 'AdoloCRM', url: 'https://crm.adolo.id', status: 'production' },
  { nama: 'AdoloFlow', url: 'https://flow.adolo.id', status: 'production' },
  { nama: 'AdoloAds', url: 'https://ads.adolo.id', status: 'production' },
  { nama: 'AdoloPartner', url: 'https://partner.adolo.id', status: 'production' },
  { nama: 'AdoloBot', url: 'https://bot.adolo.id', status: 'production' },
  { nama: 'AdoloCamp', url: 'https://adolo.id/produk/kodingstudio', status: 'production' },
  { nama: 'AdoloCert', url: 'https://adolo.id/produk/csa', status: 'production' },
  // AdoloSEO = situs ini. Belum terdaftar di products.ts adolo.id —
  // TODO Putu: daftarkan di sana juga supaya footer adolo.id ikut menautnya balik.
  { nama: 'AdoloSEO', url: 'https://seo.adolo.id', status: 'beta' },
  { nama: 'AdoloMail', url: 'https://adolo.id/produk/adolomail', status: 'beta' },
  { nama: 'AdoloCloud', url: 'https://adolo.id/produk/adolocloud', status: 'beta' },
  { nama: 'AdoloWorks', url: 'https://adolo.id/produk/adoloworks', status: 'beta' },
  { nama: 'AdoloPost', url: 'https://post.adolo.id', status: 'beta' },
  { nama: 'AdoloBooks', url: 'https://books.adolo.id', status: 'beta' },
];

export function produkBerstatus(status: StatusProduk): Produk[] {
  return PRODUK_ADOLO.filter((p) => p.status === status);
}

/** Halaman perusahaan di adolo.id. */
export const TAUTAN_PERUSAHAAN = [
  { label: 'Ekosistem', href: 'https://adolo.id/ekosistem' },
  { label: 'Academy', href: 'https://adolo.id/academy' },
  { label: 'Blog', href: 'https://adolo.id/blog' },
  { label: 'Newsletter', href: 'https://adolo.id/newsletter' },
  { label: 'Studi Kasus', href: 'https://adolo.id/studi-kasus' },
  { label: 'FAQ', href: 'https://adolo.id/faq' },
  { label: 'Tentang Kami', href: 'https://adolo.id/tentang-kami' },
  { label: 'Kontak', href: 'https://adolo.id/kontak' },
];

/** Halaman legal di adolo.id — satu badan hukum, satu set dokumen. */
export const TAUTAN_LEGAL = [
  { label: 'Syarat & Ketentuan', href: 'https://adolo.id/syarat-ketentuan' },
  { label: 'Kebijakan Privasi', href: 'https://adolo.id/kebijakan-privasi' },
  { label: 'Kebijakan Pengembalian Dana', href: 'https://adolo.id/kebijakan-pengembalian' },
];
