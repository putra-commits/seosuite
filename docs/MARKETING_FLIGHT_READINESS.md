# MARKETING FLIGHT READINESS CHECKLIST (WCM)
## Standar Otoritas, Visual, Copywriting & Blog Terpadu (SOTA Standard)

Dokumen ini adalah panduan kesiapan penerbangan pemasaran (*Marketing Flight Readiness Checklist*) bagi ekosistem **Website Cash Machine (WCM)**. Gunakan checklist ini sebelum meluncurkan (*go-live*) setiap sub-aplikasi SaaS di bawah payung **Sovereign SaaS Factory** (**Agenc1st**, **OmniAds**, **SEOsuite**, dan **AdoloWeb**) agar seluruh visual, struktur copywriting, footer, dan modul blog terstandardisasi secara elit.

---

## 🎨 PILAR 1: LAYOUT & VISUAL BREATHING ROOM (Anti-Rame & Padet)

Layout yang terlalu ramai dan padat merusak persepsi kemewahan (*luxury perception*) dan menurunkan rasio konversi. Pastikan setiap halaman bernapas dengan lega:

- [ ] **1. Section Spacing (Breathing Room)**:
  * Gunakan padding vertikal tinggi pada setiap section utama: minimal `py-24` atau `py-32`.
  * Jangan menumpuk section tanpa pemisah visual. Gunakan border bawah tipis berwarna gelap (`border-b border-white/5`).
- [ ] **2. Font & Line Height (Anti-Tabrakan)**:
  * Judul utama (`h1`, `h2`) wajib menggunakan pelacakan rapat (`tracking-tighter` atau `tracking-tight`).
  * Gunakan line height yang aman: `leading-snug` atau `leading-[1.1]` untuk judul besar, dan `leading-relaxed` untuk teks deskripsi. **Dilarang keras memakai `leading-tight` pada judul multi-baris** agar karakter tidak saling bertumpuk di layar mobile.
- [ ] **3. Grids & Columns**:
  * Batasi jumlah kolom grid: maksimal 3 kolom untuk desktop (misal: kartu generasi WCM) dan 1 kolom untuk mobile (`grid-cols-1 md:grid-cols-3`).
  * Jangan paksakan 4 kolom jika teks di dalamnya padat; gunakan layout list atau expander.
- [ ] **4. Glassmorphism Card Borders**:
  * Gunakan satu standard kartu kaca: `bg-white/[0.01] border border-white/5 backdrop-blur-xl rounded-[2rem] p-8`.
  * Efek Hover: Berikan transisi halus dengan geseran ke atas `transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/20`.

---

## ✍️ PILAR 2: COPYWRITING & HIERARKI PERSUASIF (WCM Framework)

Struktur kata-kata wajib mengikuti formula *High-Ticket B2B Conversion* yang elegan:

- [ ] **1. Top-Badge Kehormatan**:
  * Mulai halaman dengan satu badge kecil berhuruf kapital di atas judul utama (misal: `🏆 KEBANGGAAN AKADEMIK UNMAHA` atau `✨ SOVEREIGN SaaS FACTORY PRO`) menggunakan kontainer transparan emas/ungu (`bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-black tracking-widest`).
- [ ] **2. Master Headline (The Core Promise)**:
  * Fokus pada janji pendapatan atau kedaulatan digital (misal: `THE ULTIMATE REVENUE ENGINE FOR ADS` atau `Your AI-Native Growth Partner`).
  * Gunakan perpaduan gradasi emas yang anggun (`bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500`) hanya pada kata kunci utama.
- [ ] **3. Sub-Headline yang Menenangkan**:
  * Gunakan 2-3 kalimat deskriptif berwarna abu-abu (`text-zinc-400`) yang secara logis menjelaskan bagaimana sistem bekerja tanpa terkesan *hype* murahan.
- [ ] **4. Minimalis Bullet Points (Rule of 3)**:
  * Batasi poin keunggulan dalam kartu maksimal 3-5 item.
  * Gunakan ikon `CheckCircle2` atau `Check` berwarna emas (`text-amber-400`) untuk memberikan kontras visual.

---

## 👣 PILAR 3: STANDARISASI FOOTER TERPADU (The Trust Anchor)

Setiap sub-aplikasi wajib memiliki Footer lengkap di bagian bawah halaman utama untuk mengunci kepercayaan pengunjung:

- [ ] **1. Desain & Latar Belakang**:
  * Menggunakan warna latar belakang gelap solid (`bg-[#040609]` atau `bg-[#05070c]`) dengan border atas tipis (`border-t border-white/5`).
- [ ] **2. Hak Cipta Dinamis**:
  * Teks hak cipta: `© {currentYear} {AppName} AI. Hak Cipta Dilindungi.`
  * Variabel `{currentYear}` wajib didefinisikan secara dinamis menggunakan `const currentYear = new Date().getFullYear();` untuk mencegah error render.
- [ ] **3. Atribusi TEFA & Adolo**:
  * Teks akreditasi wajib dicantumkan: `Developed by Teaching Factory (TEFA) Student Developers × PT ADOLO COACHING MENTORING.`
- [ ] **4. Tautan Navigasi & Akademik**:
  * Sediakan navigasi cepat di sebelah kanan (atau tengah pada mobile):
    * `ROI Projections` (anchor scroll)
    * `Platform Comparison` (anchor scroll)
    * `Clearance Portal` (anchor scroll)
    * `UNMAHA` (tautan keluar ke `https://unmaha.ac.id`)
- [ ] **5. Ekosistem Cross-Linking (Ecosystem Bernas Mahakarya Asia)**:
  * Cantumkan daftar cross-linking lengkap ke seluruh portal dan B2B SaaS di bawah naungan **Ecosystem Bernas Mahakarya Asia** yang saling mendukung secara SEO:
    * **BERNAS** (Media & Portal Intelektual) -> `https://bernas.id`
    * **UNMAHA** (Universitas Mahakarya Asia) -> `https://unmaha.ac.id`
    * **Agenc1st** (Tech-Enabled Agency & PMB) -> `https://agenc1st.id`
    * **SEOsuite** (SEO/GEO Answer Engine Platform) -> `https://seosuite.info`
    * **AdoloWeb** (AI-Native B2B Growth Engine) -> `https://adoloweb.com`
    * **OmniAds** (AI-Powered Ads & Pirate Funnels) -> `https://omniads.ai`

---

## 📝 PILAR 4: MODUL BLOG MARKDOWN TERPADU (Sovereign Intel Engine)

Modul blog berbasis **Docs-as-Code** (seperti pada **SEOsuite**) wajib diadopsi di seluruh repositori untuk membangun otoritas SEO dan GEO secara mandiri tanpa database eksternal:

- [ ] **1. Instalasi Dependencies**:
  * Pastikan package berikut terinstal di `package.json`:
    ```json
    "gray-matter": "^4.0.3",
    "marked": "^18.0.4"
    ```
- [ ] **2. Struktur Folder & Content**:
  * Buat folder penyimpanan artikel Markdown: `src/content/blog/`
  * Format frontmatter artikel wajib terstandardisasi:
    ```markdown
    ---
    title: "Mengapa Arsitektur Konversi Lebih Penting Daripada Traffic"
    description: "Analisis mendalam mengenai kebocoran sales funnel di era AI."
    date: "2026-05-27"
    category: "Konversi"
    image: "/images/blog/pilar1.png"
    ---
    ```
- [ ] **3. Halaman Indeks Blog (`src/app/blog/page.tsx`)**:
  * Menggunakan fungsi pembaca markdown otonom (`fs.readdirSync` dan `fs.readFileSync`) dengan pengurutan tanggal menurun (*descending*).
  * Desain grid kartu gelap-emas minimalis.
- [ ] **4. Halaman Single Post (`src/app/blog/[slug]/page.tsx`)**:
  * Menggunakan parser `marked` untuk mengonversi konten Markdown menjadi HTML secara dinamis.
  * Konten wajib dibungkus dengan kelas Tailwind Typography premium (`prose prose-invert max-w-3xl mx-auto`) untuk memastikan keterbacaan tingkat tinggi.

---

## 🛠️ DAFTAR CHECKLIST KESIAPAN RILIS (Flight Board)

| Modul Kesiapan | Status | Penanggung Jawab | Catatan Teknis |
| :--- | :---: | :--- | :--- |
| **Section Spacing (`py-24`+)** | [ ] | Dev / UI Designer | Berikan ruang bernapas antar elemen |
| **Line Height (`leading-snug`+)** | [ ] | Frontend Dev | Cek judul multi-baris di layar HP |
| **Luxury Palette (Slate-Gold)** | [ ] | UI Designer | Ganti semua warna neon cyan & merah menyala |
| **Complete Footer Grid** | [ ] | Frontend Dev | Atribusi TEFA & link UNMAHA aktif |
| **Markdown Blog Engine** | [ ] | Fullstack Dev | Baca file lokal dari `src/content/blog/` |
| **Typecheck Parsial (`npx tsc`)** | [ ] | QA / Dev | Sukses kompilasi dengan Exit Code 0 |
