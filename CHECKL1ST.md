# ✅ CHECKL1ST: QUALITY ASSURANCE & ECOSYSTEM VALUE ENGINE

Dokumen ini adalah acuan resmi (**Docs-as-Code**) untuk jaminan kualitas teknis (QA), kepatuhan visual, dan kesiapan pemasaran lintas-ekosistem di bawah payung **Ecosystem Bernas Mahakarya Asia**.

Setiap kali sebelum melakukan push ke GitHub, pengujian pra-rilis (*pre-release*), atau pembuatan *production build*, wajib memastikan seluruh checklist di bawah ini terpenuhi dengan **status lulus penuh (100% Passed)**.

---

## 🛠️ 1. Build & Compilation Guard (Teknis & Keamanan)

* [x] **TypeScript Strict Verification**:
  * Wajib menjalankan type-checking dan memastikan nol kesalahan kompilasi sebelum rilis:
    ```bash
    npx tsc --noEmit
    ```
* [x] **Webpack & Next.js Build Success**:
  * Jalankan perintah kompilasi produksi lokal untuk memastikan tidak ada pemblokiran build:
    ```bash
    npm run build
    ```
* [x] **Fatal UTF-8 Encoding Guard (0x97 Byte Bug)**:
  * **Dilarang** menyalin teks mentah secara langsung dari MS Word, Google Docs, atau WhatsApp Web ke dalam file `.ts`/`.tsx` (karena membawa karakter terdistorsi tak kasat mata seperti `0x97` byte).
  * **Wajib** menggunakan `Paste as Plain Text` (Ctrl+Shift+V) untuk semua penulisan teks statis.
* [x] **Security & Credential Shield**:
  * Pastikan tidak ada API Key, secret credentials, atau password database yang ter-hardcode di kode *client-side*.
  * Pastikan file `.env.local` terdaftar aman di dalam `.gitignore`.

---

## 🎨 2. Kepatuhan WCM Boilerplate (Desain & Estetika)

* [x] **Visual Dark Luxury Standard**:
  * Latar belakang menggunakan warna gelap mewah terkurasi (`#040609`, `#070b13`, atau `#0f172a`). Warna abu-abu kusam atau putih menyala dilarang untuk tema utama.
  * Aksen menggunakan warna Emas/Amber (`#f59e0b`) danRoyal-Violet (`#6366f1`) untuk pendaran latar (*ambient glow*).
* [x] **Geometric Typography Guard**:
  * Judul utama, nama brand, tombol, dan angka metrik wajib berhuruf tegak, tegas, dan tebal (sans-serif modern). **Dilarang** menggunakan huruf miring (*italic*) pada elemen-elemen tersebut agar terlihat kokoh dan berwibawa.
* [x] **Glassmorphism Border Cards**:
  * Seluruh konsol widget atau kartu grid menggunakan border tipis semi-transparan dengan blur tinggi (`backdrop-blur-xl bg-white/[0.02] border border-white/10`) disertai micro-animation berdurasi `duration-300` pada interaksi hover.

---

## 🔗 3. Kepatuhan Footer Ekosistem (Jaring SEO Lintas-Platform - Kelas A/B / Settings Menu - Kelas C)

* [x] **Unified 4-Column Layout / Settings System**:
  * Footer wajib terbagi menjadi 4 kolom yang proporsional dan responsif (Untuk Kelas A & B) or terintegrasi di menu settings (Untuk Kelas C).
* [x] **Flagship Ecosystem Features Column (Col 3 - Sovereign Arsenal)**:
  * Menampilkan tautan/atribusi ke 6 pilar layanan andalan ekosistem guna memicu strategi *cross-selling* pasif:
    * Mini CRM, WhatsApp API, AI Chat & RAG Engine (AI Advisor & Builder), AI Copywriter & Web Builder, SEO & GEO Optimizer, AI Lead Finder.
* [x] **Ecosystem SEO Backlinks Column (Col 4 - Sinergi Ekosistem)**:
  * Wajib merender tautan eksternal aktif (*Dofollow* dengan atribut `target="_blank"`) menuju:
    * **Universitas Mahakarya Asia** (`https://unmaha.ac.id`)
    * **BERNAS.id Portal Berita** (`https://bernas.id`)
    * **Katalog 73 App autoprofit.id** (`https://autoprofit.id`)
    * **BizGrow SuperApp** (`https://bizgrow.id`)
    * **Alchem1st Revenue Engine** (`https://alchem1st.id`)
* [x] **Dynamic Active Year**:
  * Hak cipta pada footer wajib memuat tahun aktif dinamis (`new Date().getFullYear()`).
* [x] **TEFA Attribution**:
  * Wajib menyertakan atribusi resmi: `Developed by Teaching Factory (TEFA) Student Developers × PT ADOLO COACHING MENTORING.`

---

## 🚀 4. Marketing Flight Readiness & Lead Capture Shield

* [x] **Sitemap & OpenGraph Dinamis**:
  * Setiap halaman publik wajib memiliki sitemap XML dinamis dan metadata OpenGraph (`og:image`, `og:title`) untuk sebaran media sosial yang profesional.
* [x] **Lead Capture Wall**:
  * Dilarang memberikan hasil *free tools* atau **akses AI Chat & RAG konsultasi pembuka** secara cuma-cuma penuh. Gunakan form pengunci WhatsApp/Email untuk mendapatkan data prospek pemasaran.
* [x] **High-Ticket VIP Sales Flow**:
  * Untuk paket penawaran di atas Rp 2 Juta, tombol checkout langsung wajib digantikan dengan tombol **Konsultasi VIP (WhatsApp)** untuk memfasilitasi komunikasi manusia berkonversi tinggi.
* [x] **FOMO & Scarcity Badges**:
  * Sertakan penanda kuota terbatas (contoh: "Tersisa 2 Slot Lisensi Subsidi TEFA Bulan Ini") pada tier harga tertinggi untuk memicu psikologi kelangkaan.
* [x] **No Silent Dummies Policy Compliance**:
  * Pastikan seluruh data, metrik, dan grafik tiruan/simulasi yang dirender di dashboard publik maupun internal telah diberi tanda/badge **(DUMMY)** atau **(SIMULASI)** secara jelas. Metrik utama operasional dasbor wajib 100% dinamis terhubung ke data riil.
* [x] **AI Auto Prospecting Integration**:
  * Menyediakan dasbor otomatisasi pemasaran B2B (`/prospecting`) yang terintegrasi dengan saluran penawaran personal LinkedIn dan nomor WhatsApp pengirim super admin secara otonom.
  * Bebas dari silent dummy metrics dan terhubung dengan dynamic scanner untuk memeriksa kesiapan deploy produk SaaS.

---

## 🤝 5. Sinergi Integrasi Ekosistem (Jualan Ekosistem)

* [x] **Ecosystem Branding Declaration**:
  * Pastikan aplikasi ini tidak terlihat seperti aplikasi *standalone* (mandiri terisolasi). Di bagian header/landing page wajib memuat teks deklarasi: **"Part of Ecosystem Bernas Mahakarya Asia"** atau **"Sinergi Universitas Mahakarya Asia & BERNAS.id"**.
* [x] **Cross-App Navigation & RAG Hub**:
  * Menyediakan navigasi ringkas atau tombol panel pencarian (*search overlay*) menuju modul ekosistem pendukung lainnya untuk mempermudah retensi pengguna.
  * Pastikan modul AI Chat & RAG (AI Advisor) merujuk secara halus ke sister-apps jika mendeteksi kebutuhan khusus (misal: RAG Kumaha merekomendasikan major/prodi di UNMAHA, RAG BizGrow merekomendasikan pencarian leads di OmniClaw).
* [x] **Tim INTI UX Testing & AI Ingestor Loop**:
  * Menyediakan dasbor pengujian UX terintegrasi (`/ux-test`) bagi penguji inti (Mbak Sugik, Pak Hendra, Bu Sri, Pak Salam) lengkap dengan WA dispatch.
  * Menyediakan sistem Automated Ingestor AI (`/api/ux-report`) untuk mem-parse dan menyimpan masukan tim INTI ke database perbaikan pengembang secara otonom tanpa download/upload manual.
