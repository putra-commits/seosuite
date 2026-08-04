# Foto situs AdoloSEO — sumber & lisensi

Semua foto **di-host lokal** (disalin sebagai berkas, bukan hotlink). Tidak
ada URL ke pexels.com / unsplash.com / cloudinary di dalam kode.

Ketiganya **disalin dari repo adolo.id** (`/var/www/adolo.id/public/brand/photos/`)
pada **4 Agustus 2026**, lalu dikompres ulang agar tiap berkas di bawah ambang
QA 200 KB. Sumber asli: Pexels, lisensi Pexels (bebas untuk komersial, tanpa
atribusi wajib) — ID foto mengikuti manifest lisensi repo adolo.id.

| File | Sumber (Pexels photo ID) | Dipakai di |
|---|---|---|
| `statement-jakarta-night.jpg` | 16898413 | Section 3 — statement break halaman depan |
| `tim-kerja.jpg` | 8636605 | Section 5 — comparison split (Ads vs Ekosistem Organik) |
| `jakarta-skyline.jpg` | 36180051 | Section 9 — CTA penutup + CTA bawah artikel blog |

Manifest & alt text Bahasa Indonesia: `src/config/photos.ts`.
Jangan menulis path foto langsung di JSX — impor dari manifest itu.
