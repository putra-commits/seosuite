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
- [ ] **Typography Elegan (Anti-Alay):** JANGAN gunakan teks miring (*italic*) kecuali untuk kutipan/quotes, dan JANGAN gunakan ALL CAPS pada *heading* utama (H1/H2). Gunakan huruf kapital standar (*Sentence Case* / *Title Case*) demi menjaga wibawa dan estetika premium.

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

---

## 6. THE BIG 5 SOVEREIGN RULES (ATURAN MUTLAK)
Sesuai dengan konsolidasi standar The Big 5 (Alchem1st, BizGrow, BERNAS), larangan dan kewajiban berikut **HARUS** dipatuhi:

### 🚨 Fatal Guards
- ❌ **DON'T Copy-Paste Raw Text:** JANGAN *copy-paste* teks mentah dari MS Word / GDocs langsung ke kode. Teks sering membawa *corrupted UTF-8* (`0x97` byte) yang akan merusak Webpack Compiler. Gunakan `Paste as Plain Text`.
- ❌ **DON'T Put `dynamic` Above Imports:** Jangan meletakkan `export const dynamic = "force-dynamic";` sebelum statemen `import`.
- ❌ **DON'T Import Firebase:** SEOsuite adalah *Sovereign App*. 100% data operasional WAJIB menggunakan PostgreSQL via Prisma. Zero Firestore.
- ❌ **DON'T Access `params` Synchronously (Next.js 15+):** Objek `params` dan `searchParams` bersifat *Asynchronous Promise* di Next.js App Router terbaru. JANGAN mengaksesnya secara sinkron (contoh: `params.slug`). WAJIB gunakan `await params` untuk menghindari error `ENOENT undefined`.
- ❌ **DON'T Use `framer-motion` opacity:0 for Critical Content:** Jangan sembunyikan teks SEO dengan `opacity: 0` saat inisialisasi.
- ❌ **DON'T Build While Server Running:** Matikan *process* PM2/Node lama sebelum `npm run build`.

### 💎 UI/UX & Aesthetics (Alchem1st Standard)
- ✅ **DO Use Dark Luxury Palette:** Zinc/Black dengan aksen Yellow Gold (`yellow-500`). DILARANG KERAS menggunakan warna warni norak.
- ❌ **DON'T Use Italics / ALL CAPS:** JANGAN gunakan teks miring (*italic*) dan JANGAN gunakan ALL CAPS pada *heading/subheading*. Gunakan ketebalan font (*font-black/font-bold*) untuk penekanan.
- ✅ **DO Full-Bleed Layout:** Pastikan UI merender *Full-Bleed* layar penuh, tanpa paksaan margin/padding yang menyisakan ruang putih kosong di sisi pinggir.
- ✅ **DO Fallback Styling for Markdown:** Tailwind v4 mereset semua ukuran *heading*. Jika merender konten Markdown, WAJIB injeksi CSS `Typography` murni di `globals.css` sebagai cadangan jika *plugin* `@tailwindcss/typography` gagal dimuat.

### 🧠 AI Generation (BizGrow Standard)
- ✅ **DO Socratic Style:** AI WAJIB merespons dengan format *Bullet Points* atau penomoran yang rapi.
- ❌ **DON'T Use Multiple Choice:** JANGAN menyuruh AI memberikan opsi Pilihan Ganda.
- ✅ **DO API Key Rotation:** Selalu gunakan *load balancing* / *fallback* pada pemanggilan model AI besar.

### 🛡️ SEO Shield (Bernas Standard)
- ❌ **DON'T Use Zero-Damage Paywalls:** JANGAN potong DOM untuk konten tersembunyi, gunakan CSS `blur()` agar Googlebot tetap membaca teks utuh.
- ❌ **DON'T Use YouTube Iframes:** Kurangi ketergantungan pada YouTube embed, utamakan CDN statis.

## 🚀 7. MARKETING FLIGHT READINESS (LEAD & SEO SHIELD)
Menjelang masa peluncuran (*launching*), setiap aplikasi di bawah payung **AutoProfit.id** wajib mematuhi standar pemasaran ini untuk mencegah kebocoran prospek (*lead leakage*).
- [ ] **Distribusi Organik (Sitemap & OpenGraph)**: Wajib memiliki `sitemap.ts` (atau `.xml`) dinamis dan `robots.txt`. Setiap halaman publik/artikel wajib memiliki metadata OpenGraph (`og:image`, `og:title`) dinamis agar terlihat berwibawa saat dibagikan ke WhatsApp dan LinkedIn.
- [ ] **Lead Capture Wall (Hukum Timbal Balik)**: JANGAN PERNAH memberikan hasil *tools* gratis (seperti kalkulator, audit, generator) secara cuma-cuma penuh. Selalu gunakan sistem *Lead Capture Wall* (mengunci hasil di belakang form WhatsApp/Email) untuk membangun database pemasaran Anda.
- [ ] **High-Ticket VIP Sales Flow**: Untuk paket berlangganan B2B atau *Enterprise* (> Rp 2 Juta), ganti tombol Checkout langsung dengan tombol *Konsultasi VIP (WhatsApp)*. Jangan paksa klien kakap checkout tanpa interaksi manusia.
- [ ] **Scarcity & Urgency**: Gunakan *badge* kelangkaan (contoh: "Sisa 2 Slot") pada paket penawaran tertinggi untuk memicu psikologi FOMO.

---
**Diperbarui secara Otonom oleh: AI Antigravity**
**Afiliasi Repositori:** AutoProfit Sovereign Ecosystem
*No Code Gets Pushed Unless This Checklist Turns Green.*
