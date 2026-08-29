# 📋 SEOsuite Audit Checklist Standard (AUDIT_CHECKS.md)

Dokumen ini memuat standar checklist 5-Layer Audit Engine SEOsuite yang digunakan untuk menganalisis website dan menghasilkan skor kesehatan serta peluang perbaikan konversi.

---

## 🏗️ Modul A: Technical & Crawlability (Bobot 30%)

| ID | Parameter Audit | Tingkat Keparahan | Nilai Ideal / Syarat Lulus | Penjelasan Nilai Bisnis |
| :--- | :--- | :---: | :--- | :--- |
| `TECH-01` | **Status HTTP Homepage** | `critical` | HTTP 200 OK | Halaman utama wajib dapat diakses tanpa error 4xx atau 5xx. |
| `TECH-02` | **Protokol HTTPS & SSL** | `critical` | HTTPS aktif & valid | Menjaga keamanan transaksi dan kepercayaan pengunjung serta Google. |
| `TECH-03` | **Redirect Chain** | `warn` | Maksimal 1 redirect, tanpa loop | Menghemat crawl budget Googlebot dan mempercepat waktu muat halaman. |
| `TECH-04` | **Deteksi Noindex Tak Sengaja** | `critical` | Tidak ada tag `noindex` di homepage | Tag `noindex` menyebabkan situs hilang total dari hasil pencarian Google. |
| `TECH-05` | **File robots.txt** | `critical` | Dapat diakses & tidak memblokir Googlebot | Memastikan mesin pencari memiliki izin membaca konten situs. |
| `TECH-06` | **File sitemap.xml** | `warn` | Ada & terhubung di robots.txt | Membantu Google mengindeks halaman-halaman baru dengan cepat. |
| `TECH-07` | **Canonical Tag** | `warn` | Ada, absolut, dan self-referencing | Mencegah duplikasi konten dan kebingungan Googlebot. |
| `TECH-08` | **HTML Lang Attribute** | `info` | Ada (direkomendasikan `lang="id"`) | Membantu mesin pencari menargetkan wilayah bahasa audiens Indonesia. |
| `TECH-09` | **Mobile Viewport Tag** | `critical` | Ada (`width=device-width, initial-scale=1`) | Syarat mutlak kelulusan Mobile-First Indexing Google. |
| `TECH-10` | **Konsistensi Trailing Slash / WWW** | `info` | Konsisten redirect ke satu versi | Menghindari fragmentasi ranking URL ganda. |
| `TECH-11` | **Security Headers (HSTS, CSP)** | `info` | HSTS & X-Content-Type-Options aktif | Mencegah serangan clickjacking dan eksploitasi MIME type. |

---

## 📝 Modul B: On-Page & Struktur Konten (Bobot 20%)

| ID | Parameter Audit | Tingkat Keparahan | Nilai Ideal / Syarat Lulus | Penjelasan Nilai Bisnis |
| :--- | :--- | :---: | :--- | :--- |
| `PAGE-01` | **Title Tag** | `critical` | Ada, unik, panjang 30–65 karakter | Judul utama yang muncul di pencarian Google; penentu utama CTR. |
| `PAGE-02` | **Meta Description** | `warn` | Ada, panjang 70–160 karakter | Teks cuplikan iklan gratis di Google yang memikat calon pembeli. |
| `PAGE-03` | **Tag H1 Tunggal** | `critical` | Tepat 1 tag `<h1>` per halaman | Menegaskan topik utama halaman kepada mesin pencari. |
| `PAGE-04` | **Hierarki Heading (H1-H3)** | `warn` | Terstruktur urut, tidak lompat jenjang | Memudahkan pembaca dan AI memahami struktur dokumen. |
| `PAGE-05` | **Kelengkapan Alt Gambar** | `warn` | 100% gambar memiliki atribut `alt` | Membuka peluang trafik dari Google Images & aksesibilitas pembaca. |
| `PAGE-06` | **Open Graph Tags (Social)** | `warn` | `og:title`, `og:description`, `og:image` | Tampilan visual menarik saat link situs dibagikan ke WhatsApp / Medsos. |
| `PAGE-07` | **Kedalaman Teks (Word Count)** | `warn` | > 300 kata bermakna (non-landing tipis) | Konten yang terlalu tipis (<50 kata) berisiko dianggap *Thin Content*. |
| `PAGE-08` | **Link Internal Sehat** | `warn` | Tidak ada broken link internal (404) | Memastikan pengunjung dan bot tidak tersesat di halaman mati. |

---

## ⚡ Modul C: Speed & Core Web Vitals (Bobot 20%)

| ID | Parameter Audit | Tingkat Keparahan | Nilai Ideal / Syarat Lulus | Penjelasan Nilai Bisnis |
| :--- | :--- | :---: | :--- | :--- |
| `PERF-01` | **LCP (Largest Contentful Paint)** | `critical` | < 2.5 detik di perangkat mobile | Konten utama muncul cepat agar pengunjung tidak kabur (bounce). |
| `PERF-02` | **CLS (Cumulative Layout Shift)** | `warn` | < 0.1 skor pergeseran | Halaman tidak melompat-lompat saat dimuat di layar ponsel. |
| `PERF-03` | **INP / Responsivitas Interaksi** | `warn` | < 200 ms respons klik | Tombol dan formulir merespons sentuhan pengguna tanpa jeda kaku. |
| `PERF-04` | **Waktu Respon Server (TTFB)** | `critical` | < 800 ms (Homepage) | Kualitas server hosting dalam melayani permintaan pertama. |
| `PERF-05` | **Ukuran HTML & Asset Terkompresi** | `warn` | HTML < 150 KB, gambar webp/modern | Menghemat kuota internet pengunjung dan mempercepat loading di sinyal lemah. |

---

## 📍 Modul D: Local SEO & Konversi Indonesia (Bobot 15%)

| ID | Parameter Audit | Tingkat Keparahan | Nilai Ideal / Syarat Lulus | Penjelasan Nilai Bisnis |
| :--- | :--- | :---: | :--- | :--- |
| `LOC-01` | **Tombol / Link WhatsApp Aktif** | `critical` | Link `wa.me` atau `api.whatsapp.com` terpasang | Saluran closing transaksi #1 bagi konsumen Indonesia. |
| `LOC-02` | **Nomor Telepon & Kontak Terlihat** | `critical` | Link `tel:` atau teks nomor telepon jelas | Memudahkan calon klien langsung menghubungi bisnis dalam 1 klik. |
| `LOC-03` | **Schema LocalBusiness / Organization** | `warn` | JSON-LD `LocalBusiness` valid | Membantu Google Maps & Local Pack mengenali entitas bisnis fisik. |
| `LOC-04` | **Alamat Fisik / Embed Google Maps** | `warn` | Alamat teks lengkap atau iframe Maps | Membangun kepercayaan lokal dan relevansi pencarian berbasis wilayah (*near me*). |
| `LOC-05` | **Jam Operasional Terstruktur** | `info` | Ada di schema / teks halaman kontak | Menghindari kekecewaan konsumen yang datang saat tempat tutup. |
| `LOC-06` | **CTA Above The Fold (Mobile)** | `warn` | Tombol kontak/WA terlihat tanpa scroll | Meningkatkan tingkat konversi pengunjung mobile menjadi prospek nyata. |

---

## 🤖 Modul E: AI Visibility & AEO Readiness (Bobot 15%)

| ID | Parameter Audit | Tingkat Keparahan | Nilai Ideal / Syarat Lulus | Penjelasan Nilai Bisnis |
| :--- | :--- | :---: | :--- | :--- |
| `AEO-01` | **Schema FAQPage / Q&A** | `warn` | JSON-LD `FAQPage` terpasang | Membantu situs dikutip langsung dalam Google AI Overview & ChatGPT. |
| `AEO-02` | **Heading Berbasis Pertanyaan** | `warn` | Menggunakan kata tanya (Apa, Bagaimana, Biaya) | Format ideal yang mudah dicerna oleh LLM / mesin pencari generatif. |
| `AEO-03` | **Paragraf Jawaban Langsung (Direct Answer)** | `info` | Paragraf padat 40–60 kata setelah heading | Struktur siap kutip (*snippet-friendly*) untuk ringkasan AI. |
| `AEO-04` | **Tabel Data & Daftar Berpoin (List)** | `info` | Menggunakan `<table>` atau `<ol>/<ul>` terstruktur | AI menyukai data terstruktur untuk perbandingan harga atau fitur. |
| `AEO-05` | **Sinyal Kepercayaan E-E-A-T (Author/About)** | `warn` | Ada nama penulis, profil usaha, halaman About | Bukti kredibilitas entitas agar AI tidak mengabaikan sumber informasi. |
| `AEO-06` | **File llms.txt (Opsional)** | `info` | Tersedia di root domain `/llms.txt` | Memberikan konteks ringkas bagi agen AI yang merayapi website. |

---

## 🧮 Formula Kalkulasi Skor Kesehatan

$$\text{Skor Total} = (S_{\text{Tech}} \times 0.30) + (S_{\text{Page}} \times 0.20) + (S_{\text{Perf}} \times 0.20) + (S_{\text{Local}} \times 0.15) + (S_{\text{AI}} \times 0.15)$$

*Di mana masing-masing modul bernilai 0–100 berdasarkan tingkat kelulusan parameter.*
