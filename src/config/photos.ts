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

export const ctaPhoto: SitePhoto = {
  src: '/brand/photos/jakarta-skyline.jpg',
  alt: 'Cakrawala kota Jakarta dari ketinggian',
};
