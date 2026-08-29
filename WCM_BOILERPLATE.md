# 🛠️ WCM BOILERPLATE: STANDAR EKOSISTEM BERNAS MAHAKARYA ASIA

Dokumen ini adalah acuan resmi (**Docs-as-Code**) untuk standardisasi visual, tata letak arsitektur, fitur andalan, dan jaring optimasi SEO terpadu di seluruh platform di bawah naungan **Ecosystem Bernas Mahakarya Asia** (didukung oleh **Universitas Mahakarya Asia** dan **BERNAS**).

Setiap repositori wajib mematuhi panduan ini sesuai dengan klasifikasi aplikasinya untuk menjamin kedaulatan visual (*Dark Luxury*) dan sinergi lintas-platform.

---

## 🎨 1. Tiga Klasifikasi Tata Letak & Estetika (3-Class Layout System)

Untuk menjamin kedaulatan visual setara dengan brand premium di ekosistem, seluruh aplikasi dibagi menjadi **3 Kelas Arsitektur Tata Letak**:

### 📦 KELAS A: Standardisasi SaaS & Lead-Magnet (Calculator-Driven)
* **Aplikasi**: `seosuite`, `adoloweb`, `OmniAds`, `alchem1st`
* **Kunci Visual & Layout**:
  * Menggunakan halaman pemasaran statis persuasif dengan transisi micro-animation halus pada interaksi hover (`hover:-translate-y-1 hover:border-amber-500/30 transition-all duration-300`).
  * Latar belakang: Deep Cosmic Slate/Dark (`#040609`, `#070b13`, atau `#0f172a`).
  * Integrasi formulir interaktif atau kalkulator B2B ter-gated WhatsApp.
  * Wajib merender **Footer 4 Kolom** di bagian bawah halaman.

### 📱 KELAS B: Standardisasi SuperApp (Responsive Portal Layout)
* **Aplikasi**: `BizGrow`, `kumaha`
* **Kunci Visual & Layout**:
  * Desktop: Ramping navigation sidebar kiri selebar `80px` dengan ikon kustom + area kanvas kerja terbuka lebar (*tool canvas*) di sebelah kanan.
  * Mobile: Bilah navigasi bawah tetap (`fixed bottom-nav`) yang ramping untuk simulasi native app.
  * Atas: Global header setinggi `72px` dengan search overlay cerdas, role switcher, dan profil stats banner.
  * Wajib merender **Footer 4 Kolom** di bagian bawah kanvas internal.

### 📲 KELAS C: Standardisasi Native Hybrid Shell (Mobile-First / Capacitor Layout)
* **Aplikasi**: `bizhealth`, `brandhealth`, `saleshealth`, `traingrow`
* **Kunci Visual & Layout**:
  * **Viewport-Locked Scaling**: Mengunci rasio layar pada mode absolut (`h-screen overflow-hidden`) tanpa double-scrollbar untuk simulasi aplikasi mobile murni.
  * **Capacitor & Touch Friendly**: Elemen menu interaktif dengan padding besar, gesture-swipe, dan tombol aksi bawah mudah dijangkau jempol.
  * **Footer Exception**: Karena berorientasi pada visual mobile-native, tautan SEO Ekosistem & Atribusi **DILARANG** dipasang sebagai footer klasik di bagian bawah. Sebagai gantinya, link ekosistem disematkan di menu **"Sinergi Ekosistem"** di dalam pengaturan profil atau hub dasbor utama.
  * Atribusi Rilis: `Developed by TEFA Student Developers × Capacitor Mobile Shell`.

---

## 🏗️ 2. Standar Struktur Footer Lintas SEO Ekosistem (Untuk Kelas A & B)

Setiap aplikasi Kelas A & Kelas B wajib merender komponen **Footer 4 Kolom** terpadu untuk mendongkrak optimasi SEO dan memperkuat konversi:

### Susunan Kolom Resmi:
1. **Kolom 1: Brand & Visi (Unik Halaman)**
   * Memuat logo aplikasi, deskripsi singkat kontribusi platform, dan badge keamanan SSL (`Secured by SSL` / `Anti-Defisit Guard Active`).
2. **Kolom 2: Navigasi Halaman Internal (Unik Halaman)**
   * Memuat tautan menu penting, layanan jasa, harga paket, atau dokumentasi khusus milik platform tersebut.
3. **Kolom 3: Fitur Andalan Ekosistem / Sovereign Arsenal (STANDAR)**
   * Menampilkan 6 fitur unggulan SaaS ekosistem untuk strategi *cross-selling* pasif:
     * Mini CRM, WhatsApp Broadcast API, AI Chat & RAG Engine, AI Copywriter, SEO & GEO Optimizer, AI Lead Finder.
4. **Kolom 4: Sinergi Ekosistem / Ecosystem Apps (STANDAR)**
   * Wajib memuat tautan SEO cross-linking berkinerja tinggi (*Dofollow* dengan atribut `target="_blank"`):
     * **Universitas Mahakarya Asia** -> `https://unmaha.ac.id`
     * **BERNAS.id Portal Berita** -> `https://bernas.id`
     * **Katalog 73 App autoprofit.id** -> `https://autoprofit.id`
     * **BizGrow Business App** -> `https://bizgrow.id`
     * **Alchem1st Revenue Engine** -> `https://alchem1st.id`

---

## 🚀 3. Marketing Flight Readiness & Lead Capture Shield

Menjelang masa peluncuran (*launching*), setiap aplikasi wajib mematuhi standar pemasaran ini untuk mencegah kebocoran prospek (*lead leakage*):

* **Sitemap & OpenGraph Dinamis**: Wajib memiliki `sitemap.ts` dinamis dan metadata OpenGraph (`og:image`, `og:title`) untuk sebaran WhatsApp & LinkedIn yang profesional.
* **Lead Capture Wall (Hukum Timbal Balik)**: Penggunaan *tools* gratis (seperti kalkulator, audit, generator, atau **AI Chat/RAG konsultasi awal**) wajib dikunci di belakang form WhatsApp/Email untuk membangun database pemasaran.
* **High-Ticket VIP Sales Flow**: Untuk paket berlangganan dengan harga tinggi (> Rp 2 Juta), ganti tombol Checkout otomatis dengan tombol **Konsultasi VIP (WhatsApp)** untuk interaksi manusia berkonversi tinggi.
* **Psikologi Kelangkaan (Scarcity)**: Gunakan badge batas kuota (contoh: "Tersisa 2 Slot Lisensi Subsidi TEFA Bulan Ini") pada tier penawaran tertinggi untuk memicu psikologi FOMO.
* **Kebijakan Anti-Data Palsu (No Silent Dummies)**: Setiap elemen data, angka, grafik, atau metrik di dasbor (internal maupun publik) yang masih bersifat tiruan (dummy/simulasi) WAJIB diberi tanda atau label **(DUMMY)** atau **(SIMULASI)** yang terlihat jelas. Dilarang keras menampilkan data tiruan seolah-olah data riil tanpa atribusi.
* **Atribusi Developer & Pendidikan**:
  * Wajib menyertakan atribusi: `Developed by Teaching Factory (TEFA) Student Developers × PT ADOLO COACHING MENTORING.`
