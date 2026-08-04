# Foto situs AdoloSEO — sumber & lisensi

Semua foto **di-host lokal** (disalin sebagai berkas, bukan hotlink). Tidak
ada URL ke pexels.com / unsplash.com / cloudinary di dalam kode.

Semuanya **disalin dari repo adolo.id** (`/var/www/adolo.id/public/brand/photos/`)
pada **4 Agustus 2026**, lalu dikompres ulang agar tiap berkas di bawah ambang
QA 200 KB. Sumber asli: Pexels, lisensi Pexels (bebas untuk komersial, tanpa
atribusi wajib) — ID foto mengikuti manifest lisensi repo adolo.id.

| File | Dimensi | Orientasi | Dipakai di |
|---|---|---|---|
| `statement-jakarta-night.jpg` | 1800x1012 | lanskap | Section 3 — statement break halaman depan |
| `tim-kerja.jpg` | 1400x934 | lanskap | Section 5 — comparison split (Ads vs Ekosistem Organik) |
| `hero-jakarta-dusk.jpg` | 1800x1200 | lanskap | Section 9 — CTA penutup + CTA bawah artikel blog |

**Aturan orientasi.** Ketiga slot di atas adalah banner LEBAR (`object-cover`
pada section `min-h-[50vh]`–`min-h-[70vh]`). Foto POTRET dilarang dipakai di
sini: `jakarta-skyline.jpg` (1400x2100, potret 2:3) sempat dipasang di slot CTA
dan hanya menyisakan ±29% tinggi tengah gambar — langit dan garis cakrawalanya
terpotong habis. Berkas itu sudah dilepas dari repo (riwayatnya tetap ada di
git); kalau suatu saat butuh ubin tegak, ambil lagi dari repo adolo.id dan
pakai dengan `aspect-[4/5]` seperti PhotoStrip di sana.

Manifest & alt text Bahasa Indonesia: `src/config/photos.ts`.
Jangan menulis path foto langsung di JSX — impor dari manifest itu.
