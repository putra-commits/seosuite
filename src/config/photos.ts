/**
 * Manifest foto situs — satu sumber kebenaran.
 * Dilarang menulis URL foto inline di JSX, dan dilarang hotlink ke
 * situs stok mana pun: semua berkas di-host sendiri di /public/brand/photos.
 * Jejak lisensi: public/brand/photos/README.md
 */
export type SitePhoto = { src: string; alt: string };

export const statementPhoto: SitePhoto = {
  src: '/brand/photos/statement-jakarta-night.jpg',
  alt: 'Gedung perkantoran Jakarta di malam hari',
};

export const comparisonPhoto: SitePhoto = {
  src: '/brand/photos/tim-kerja.jpg',
  alt: 'Tim bekerja bersama menyusun strategi pertumbuhan digital',
};

/**
 * WAJIB berorientasi LANSKAP. Foto ini dipakai sebagai banner lebar
 * (min-h-[70vh], object-cover) di dua tempat: CTA penutup halaman depan dan
 * CTA bawah setiap artikel. Sebelumnya memakai jakarta-skyline.jpg yang
 * berukuran 1400x2100 (POTRET 2:3) sehingga hanya ±29% tinggi tengah gambar
 * yang terlihat — langit dan garis cakrawalanya hilang, tersisa pita gedung.
 */
export const ctaPhoto: SitePhoto = {
  src: '/brand/photos/hero-jakarta-dusk.jpg',
  alt: 'Cakrawala kota Jakarta menjelang senja',
};
