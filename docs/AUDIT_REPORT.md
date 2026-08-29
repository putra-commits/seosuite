# 📊 Laporan Audit Kesiapan Repositori SEOsuite
> **Dokumen Evaluasi Teknis & Strategis: Transformasi Mesin Audit SEO Menjadi Generator Klien (Lead Engine)**  
> **Tanggal**: 2026-08-29  
> **Status Repositori**: `In Progress / Refactoring to Product-Led Lead Engine`

---

## 🎯 1. Ringkasan Eksekutif (Scorecard Kesiapan)

| Parameter Evaluasi | Bobot | Skor | Status | Catatan Teknis Utama |
| :--- | :---: | :---: | :---: | :--- |
| **Arsitektur & UI/UX Dasar** | 15% | **70/100** | 🟢 Baik | Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Dark Luxury Design System telah terpasang. |
| **Unified Audit Engine (5 Modul)** | 30% | **45/100** | 🟡 Parsial | Endpoint audit terpecah (`/api/audit`, `/api/local-seo`, `/api/aeo-geo`). Belum bersatu dalam pipeline modular terpadu. |
| **Lead Engine & Monetisasi Funnel** | 25% | **20/100** | 🔴 Kritis | Form hanya menerima URL (belum menangkap Nama Usaha, No. WA, Kota, Vertikal). Belum ada admin lead (`/admin/leads`). |
| **Scoring & Prioritisasi Masalah** | 15% | **25/100** | 🔴 Kritis | Skor dihitung secara linier (belum weighted 30:20:20:15:15). Belum ada ekstraksi 3 Isu Kritis (*Impact × Effort*). |
| **Keamanan & Validasi (SSRF Guard)** | 10% | **15/100** | 🔴 Kritis | Belum ada filter IP privat (`127.0.0.1`, `localhost`, range 10.x/192.168.x). Rentan eksploitasi SSRF. |
| **Dokumentasi Teknis & QA** | 5% | **40/100** | 🟡 Parsial | Ada checklist ekosistem, namun dokumen spesifikasi checklist audit (`docs/AUDIT_CHECKS.md`) dan unit testing belum ada. |
| **TOTAL KESIAPAN KESELURUHAN** | **100%** | **41.5 / 100** | 🟡 **Fase Fondasi** | **Siap ditransformasikan ke Mesin Lead & Product-Led Engine.** |

---

## 📋 2. Matriks Komparatif: Kebutuhan Spesifikasi vs Kondisi Eksisting

| No | Kebutuhan Spesifikasi Brief | Kondisi Eksisting di Repo | Status | Tindakan Korektif (Action Item) |
| :---: | :--- | :--- | :---: | :--- |
| **1** | **Form Input Lead Lengkap** (`/cek-seo`)<br>• URL Target<br>• Nama Bisnis & Kategori<br>• Nomor WhatsApp & Kota | Form di `/cek` hanya memiliki 1 input field: `URL`. | 🔴 **Gap** | Buat/perbarui halaman `/cek-seo` dengan form multi-field untuk menangkap data profil bisnis dan nomor WhatsApp. |
| **2** | **Progress Bar Audit (60–90 detik)** | Ada simulasi progress bar (7 langkah) di `/cek/page.tsx`. | 🟢 **Siap** | Sinkronkan label progress dengan 5 modul riil (Technical, On-Page, Performance, Local ID, AI Visibility). |
| **3** | **Skor Terbobot (Weighted Scoring)**<br>• Technical (30%)<br>• On-page (20%)<br>• Performance (20%)<br>• Local ID (15%)<br>• AI Readiness (15%) | Menggunakan kalkulasi persentase kelulusan mentah dikurangi penalti fail di `api/audit/route.ts`. | 🔴 **Gap** | Implementasikan engine `scoring.ts` dengan bobot tetap 30:20:20:15:15 dan penalti tingkat keparahan (*severity*). |
| **4** | **3 Isu Prioritas Bisnis (*Impact × Effort*)** | Menampilkan daftar fail tanpa pemilahan dampak bisnis bagi pemilik usaha. | 🔴 **Gap** | Bangun algoritma ekstraksi *Top 3 Urgent Issues* yang disertai bahasa awam pemilik usaha dan estimasi kerugian lead/omzet. |
| **5** | **Halaman Laporan Publik** (`/laporan/[slug]`) | Tersedia di `/hasil/[uuid]` dengan persistensi file JSON lokal. | 🟡 **Parsial** | Alihkan/tambahkan routing `/laporan/[slug]`. Amankan privasi nomor WA operator/klien agar tidak tampil di publik. |
| **6** | **Lead Inbox Operator** (`/admin/leads`) | Belum ada dashboard admin lead. | 🔴 **Belum Ada** | Buat halaman admin `/admin/leads` dengan tabel database lead, status prospek (New/Contacted/Won/Lost), dan filter. |
| **7** | **Generator Chat WhatsApp 1-Klik** | Belum ada fungsi copy template pesan WhatsApp. | 🔴 **Belum Ada** | Tambahkan tombol di admin & laporan untuk menghasilkan salinan teks WhatsApp personal berbasis 3 temuan audit. |
| **8** | **Proteksi SSRF & Timeout Guard** | `safeFetch` melakukan request langsung tanpa validasi IP hostname. | 🔴 **Kritis** | Pasang validasi DNS & blokir alamat IP lokal/privat (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, dll). |
| **9** | **Export PDF Ringkas** | Belum ada fitur cetak atau export PDF. | 🔴 **Belum Ada** | Implementasikan CSS `@media print` atau endpoint generator PDF 1–2 halaman ringkas berorientasi proposal. |
| **10** | **Komparasi Kompetitor Ringan** | Belum ada field komparasi kompetitor. | 🔴 **Belum Ada** | Sediakan input opsional 1–2 domain kompetitor untuk membandingkan Title, H1, Schema, dan Performa. |

---

## 🔍 3. Evaluasi Kesiapan 5 Modul Audit SEO (A - E)

```
                       ┌──────────────────────────────────────────┐
                       │       UNIFIED SEO AUDIT ENGINE           │
                       └────────────────────┬─────────────────────┘
                                            │
        ┌──────────────┬────────────────────┼────────────────────┬──────────────┐
        ▼              ▼                    ▼                    ▼              ▼
  [A. Technical] [B. On-Page]        [C. Speed & CWV]     [D. Local ID]   [E. AI / AEO]
    Bobot 30%      Bobot 20%            Bobot 20%           Bobot 15%       Bobot 15%
   (75% Ready)    (60% Ready)          (50% Ready)         (50% Ready)     (50% Ready)
```

| Modul | Bobot | Parameter yang Sudah Dicek | Parameter yang Belum Ada / Perlu Diperbaiki | Status |
| :--- | :---: | :--- | :--- | :---: |
| **A. Technical & Indexability** | **30%** | • Status HTTP 200<br>• Aksesibilitas `robots.txt` & Googlebot<br>• Aksesibilitas `sitemap.xml`<br>• Canonical URL & Security Headers | • Deteksi Noindex pada homepage<br>• HTML lang attribute (`lang="id"`)<br>• Deteksi Soft-404 / Thin page<br>• Mobile viewport tag | 🟢 **75%** |
| **B. On-Page Structure** | **20%** | • Title tag & panjang karakter<br>• Meta description & panjang karakter<br>• Single H1 validation<br>• Open Graph completeness | • Validasi hierarki Heading (H1 ➔ H2 ➔ H3)<br>• Missing `alt` pada tag `<img>`<br>• Deteksi keyword stuffing kasar<br>• Rasio teks terhadap HTML | 🟡 **60%** |
| **C. Speed & Core Web Vitals** | **20%** | • TTFB homepage & sitemap<br>• PageSpeed Insights API (LCP, CLS, Score) | • Fallback saat API Key PSI kosong (Estimasi HTML size, script blocking, jumlah request gambar)<br>• Cek dimensi gambar (CLS guard) | 🟡 **50%** |
| **D. Local SEO Indonesia** | **15%** | *(Tersedia di file terpisah `/api/local-seo`)*<br>• Deteksi tag Address & Telepon<br>• Schema `LocalBusiness`<br>• Embed Google Maps | • Pengecekan link WhatsApp aktif (`wa.me` / `api.whatsapp.com`)<br>• Konsistensi NAP di homepage<br>• Jam operasional toko/klinik<br>• Integrasi ke skor audit utama | 🟡 **50%** |
| **E. AI Visibility (AEO/GEO)** | **15%** | *(Tersedia di file terpisah `/api/aeo-geo`)*<br>• Schema FAQPage, HowTo, QAPage<br>• Heading berbasis pertanyaan (Apa, Bagaimana)<br>• Attribusi Author (E-E-A-T) | • Paragraf jawaban ringkas (40–60 kata)<br>• Struktur tabel & list perbandingan<br>• Integrasi ke skor audit utama<br>• Standar format tanpa overclaim | 🟡 **50%** |

---

## 💼 4. Kesiapan Terhadap 3 Model Bisnis & Monetisasi

### Posisi 1: Product-Led SEO (SaaS & Media)
* **Kebutuhan**: Setiap hasil audit menjadi halaman publik `/laporan/[domain-slug]` yang terindeks Google dengan meta title & description unik, membawa trafik organik berkelanjutan.
* **Kondisi Repo**: Struktur URL saat ini memakai UUID acak (`/hasil/[uuid]`).
* **Rekomendasi**: Ubah skema penyimpanan dan routing ke `/laporan/[domain-slug]` dengan metadata dinamis (`Audit SEO {domain} — Skor {n}/100 | SEOsuite`).

### Posisi 2: Technical + AI Visibility Retainer (Startup & Bisnis Menengah)
* **Kebutuhan**: Laporan menyajikan audit mendalam kesiapan AI search (Schema Organization, FAQ, Author E-E-A-T, llms.txt context) dan kesiapan Core Web Vitals.
* **Kondisi Repo**: Kode AEO/GEO sudah ada di `/api/aeo-geo`, tetapi belum digabung dalam laporan komprehensif.
* **Rekomendasi**: Satukan analisis AEO/GEO ke dalam kartu laporan utama dengan rekomendasi teknis sprint 14–30 hari.

### Posisi 3: Local + Fullstack (Pasar UMKM Indonesia)
* **Kebutuhan**: Audit mendeteksi hilangnya potensi lead WhatsApp, ketidaklengkapan Google Business Profile / Maps, dan kecepatan mobile buruk, lalu mengarahkan ke perbaikan 14 hari.
* **Kondisi Repo**: Belum ada form pengambil nomor WhatsApp dan kalkulator estimasi kebocoran lead lokal.
* **Rekomendasi**: Tambahkan field WhatsApp & jenis usaha di form audit, serta buat generator pesan penawaran otomatis ke WhatsApp pemilik bisnis.

---

## 🚀 5. Roadmap Eksekusi Bertahap (Sprint Execution Plan)

```
┌────────────────────────┐    ┌────────────────────────┐    ┌────────────────────────┐
│        FASE 1          │    │        FASE 2          │    │        FASE 3          │
│ Engine & Security Core │───>│   Form & Lead Engine   │───>│ Laporan & Admin Inbox  │
│ (auditor.ts, scoring)  │    │ (/cek-seo, multi-step) │    │(/laporan, /admin/leads)│
└────────────────────────┘    └────────────────────────┘    └────────────────────────┘
```

### 🔴 Fase 1: Engine Audit Terpadu & Keamanan (P0)
1. Buat `src/lib/security.ts`: Pasang URL sanitizer & SSRF blocking untuk IP privat/localhost.
2. Buat `src/lib/auditor.ts`: Gabungkan logika crawler & parser untuk 5 modul (Technical, On-page, Performance, Local ID, AI Visibility).
3. Buat `src/lib/scoring.ts`: Terapkan weighted scoring (30-20-20-15-15) dan algoritma penentuan *Top 3 High-Impact Issues*.
4. Buat `docs/AUDIT_CHECKS.md`: Dokumentasi rincian 50+ parameter audit.

### 🟠 Fase 2: Antarmuka Input & Capture Prospek (P1)
1. Buat `src/app/cek-seo/page.tsx`: Form input URL, Nama Usaha, WhatsApp, Kota, dan Vertikal Bisnis dengan progress bar audit 60–90 detik.
2. Update `src/lib/audit-store.ts`: Simpan data audit beserta metadata lead (nama bisnis, nomor WA, kota, top 3 issue, status).

### 🟡 Fase 3: Laporan Berorientasi Konversi & Admin Leads (P1)
1. Buat `src/app/laporan/[slug]/page.tsx`: Halaman laporan publik dengan 5 modul, skor visual, 3 luka berdarah, estimasi dampak, dan tombol CTA paket WhatsApp.
2. Buat `src/app/admin/leads/page.tsx`: Dashboard monitoring lead masuk, filter kota/vertikal, dan tombol salin pesan WhatsApp instan (*Copy 1-Click Outreach Script*).
3. Tambahkan styling `@media print` untuk unduhan laporan PDF rapi.

---
*Dokumen ini dibuat otomatis sebagai bagian dari standardisasi kualitas dan strategi monetisasi repositori SEOsuite.*
