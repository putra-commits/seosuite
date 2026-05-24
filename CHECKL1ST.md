# 🛡️ THE SEOSUITE PRE-FLIGHT CHECKLIST (QUALITY & CONVERSION GUARD)
**Dokumen Standar QA & Anti-Regresi untuk SEOsuite (Sovereign SaaS Factory)**

> Dokumen `CHECKL1ST` ini adalah panduan mutlak. Setiap programmer (Manusia maupun AI Agensial) **DIWAJIBKAN** memvalidasi seluruh poin di bawah ini SEBELUM melakukan `git commit`, `push`, atau *deployment* ke server produksi. Kegagalan mematuhi checklist ini dapat mematikan "Mesin Kasir" SEOsuite.

---

## 1. COMPILATION & BUILD GUARD
Setiap kali sebelum push kode ke GitHub, wajib memastikan Next.js compiler tidak terganggu oleh *bug* ketikan atau TypeScript.
- [ ] **Zero Typescript Errors (`tsc --noEmit`):** Wajib menembus validasi TypeScript tanpa ada pesan error merah.
- [ ] **Build Sukses (`npm run build`):** Harus berhasil mengkompilasi *production build* tanpa kendala (Zero Hydration Mismatch).
- [ ] **Encoding Fatal Bug Guard:** JANGAN *copy-paste* teks panjang/artikel langsung dari Microsoft Word ke dalam `.tsx` untuk menghindari karakter perusak UTF-8 (`0x97`). Gunakan `Paste as Plain Text`.

## 2. DARK LUXURY THEME & AESTHETICS (UI/UX)
Sesuai dengan standarisasi **AutoProfit.id**, tampilan SEOsuite harus memancarkan kemewahan (*Dark Luxury*).
- [ ] **Konsistensi Warna:** Pastikan warna utama berfokus pada Hitam (`#090b10`), *Zinc-900* (Card/Glass), dan Emas/Kuning (`yellow-500` / `amber-600`).
- [ ] **Zero Broken Tailwind Classes:** Hindari penggunaan *utility class* Tailwind yang bertentangan atau menyebabkan layout berantakan di layar Mobile (responsif mutlak).
- [ ] **Glassmorphism Standar:** Setiap Card paket berlangganan atau elemen *overlay* harus mempertahankan transparansi blur (*glassmorphism*) yang elegan.

## 3. FUNNEL PENJUALAN & CONVERSION INTEGRITY
SEOsuite dirancang sebagai mesin pencetak profit. Alur dari pengunjung ke pembeli tidak boleh terputus.
- [ ] **Test Website Flow:** Pastikan input box "Masukkan URL Website" di *Hero Section* berfungsi memicu animasi *scanning*.
- [ ] **Trigger Psikologis:** *Mockup* hasil audit "Skor Merah" (Skor 35) wajib muncul dengan warna peringatan (merah) yang jelas untuk menciptakan urgensi.
- [ ] **Auto-Scroll CTA:** Tombol "Perbaiki Sekarang" pada hasil audit WAJIB menggulir layar secara otomatis ke bagian `Pricing`.

## 4. INTEGRASI PAYMENT & AUTH (MIDTRANS)
Tanpa poin ini, aplikasi hanyalah brosur kosong.
- [ ] **Midtrans Snap Script:** Tag `<script>` Midtrans Snap API harus dirender secara aman (menggunakan environment variable `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY`).
- [ ] **Zero Hardcoded Secrets:** Token, API Keys Midtrans Server, dan rahasia database JANGAN PERNAH di-hardcode. Harus dipanggil via `.env.local` di *backend* (`/api/*`).
- [ ] **Checkout Route Proxy:** *Trigger* pembayaran dari Client-Side ke Midtrans WAJIB melalui jalur *proxy* API Internal (e.g. `/api/checkout`).

## 5. SERVER ARCHITECTURE & DEPLOYMENT (PM2)
- [ ] **Node / React Server Components:** Memisahkan secara tegas mana yang `use client` (komponen interaktif seperti tombol animasi, input URL) dan Server Components (untuk render data statis yang SEO-friendly).
- [ ] **Zero Unpublish Guard:** JANGAN matikan proses produksi (PM2) tanpa persiapan rollback. Jika memutakhirkan server VPS:
  ```bash
  git pull
  npm run build
  pm2 restart seosuite
  ```

---
**Diperbarui secara Otonom oleh: AI Antigravity**
**Afiliasi Repositori:** AutoProfit Sovereign Ecosystem
*No Code Gets Pushed Unless This Checklist Turns Green.*
