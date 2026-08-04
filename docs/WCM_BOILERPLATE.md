# WCM_BOILERPLATE.md: ACUAN DESAIN WEBSITE CASH MACHINE (WCM)
## Standar Desain Dark-Luxury Gelap-Emas &amp; Ungu Premium (SOTA Standard)

Dokumen ini disusun sebagai acuan teknis (*design boilerplate*) bagi pengembang (manusia maupun AI) untuk mengadopsi standar visual premium, minimalis, dan berkonversi tinggi yang telah diimplementasikan pada **Agenc1st**, **OmniAds**, **SEOsuite**, **AdoloWeb**, dan sub-proyek *Sovereign SaaS Factory* lainnya.

---

## 🎨 1. Sovereign Design &amp; Visual Preference Standards

Untuk menjamin kedaulatan visual setara dengan brand elit seperti **autoprofit.id**, **alchem1st**, dan **BizGrow**, setiap layout halaman dan komponen antarmuka wajib mematuhi aturan visual berikut:

### 👍 APA YANG DISUKAI (Standard Design Rules)
1. **Palet Warna Luxury Terkurasi**:
   * **Deep Cosmic Dark (Latar Belakang)**: Gunakan `#070b13` (cosmic space) atau `#040609` (slate dark). Jangan gunakan warna abu-abu terang atau hitam solid hambar.
   * **Luxury Accent (Highlight &amp; Emas)**: Gunakan **Emas/Amber (`#f59e0b` atau `#D4AF37`)** untuk highlight premium dan **Ungu/Royal Violet (`#6d28d9`)** untuk ambient glow.
   * **Muted Low-Opacity States**: Gunakan tingkat transparansi rendah (`border-white/5` atau `border-white/10`) untuk garis pemisah guna mempertahankan kesan eksklusif.
2. **Tipografi Geometris Bersih**:
   * Gunakan font sans-serif modern (`Space Grotesk`, `Outfit`, `Inter`) dengan pelacakan rapat (`tracking-tight` atau `tracking-tighter`).
   * Jangan gunakan huruf miring (`italic`) untuk nama brand, judul menu, atau metrik utama agar terlihat kokoh dan berwibawa.
3. **Glassmorphism Shell Card Borders**:
   * Gunakan border tipis dengan blur tinggi (`backdrop-blur-xl bg-white/[0.02] border border-white/10`) untuk setiap panel informasi atau konsol dasbor.
   * Gunakan micro-animations pada interaksi hover (`transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/30`).

### 👎 APA YANG DILARANG (Strict Design Restrictions)
1. **NO Cheap/Plain Colors**: Hindari warna cyan terang menyala (`#00FFFF`) atau merah primer terang yang terlihat murah.
2. **NO Italics in Brand Names**: Font judul utama dasbor harus tegak, bold, dan solid.
3. **NO Cluttered Monospace Underlines**: Jangan gunakan raw Courier-style atau garis dekorasi bawah berlebih pada sub-teks.
4. **NO Overlapping Text (Teks Bertumpuk)**: Dinarang keras memakai `leading-tight` pada judul utama atau kartu grid agar responsif di layar mobile. Gunakan `leading-snug` atau `leading-normal`.

---

## 🏗️ 2. Template Kode Komponen (Copy-Pasteable React JSX)

Berikut adalah cetak biru kode React + Tailwind CSS yang dapat langsung disalin ke dalam sub-proyek *Sovereign SaaS Factory*:

### A. Template Kartu Perbandingan Tiga Generasi (3-Generation Grid)
Gunakan layout ini untuk membedakan tingkatan layanan atau paket performa iklan secara visual dengan hierarki yang jelas:

```tsx
import React from 'react';
import { Sparkles, Award } from 'lucide-react';

export function AdArchitectureComparison() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-6 py-12">
      
      {/* 1. Generasi Lama (Muted Dusty Slate) */}
      <div className="p-8 rounded-3xl bg-zinc-950/40 border border-zinc-900/60 transition-all flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500 bg-zinc-900/40 border border-zinc-800/60 px-2.5 py-1 rounded">
            Layanan Standard Kuno
          </span>
          <h3 className="text-2xl font-bold text-zinc-350 mt-4 mb-2">Iklan Manual Pasif</h3>
          <div className="text-xl font-bold text-zinc-500 mb-4">Rp 1,5 Jt - Rp 3 Jt</div>
          <p className="text-zinc-500 text-xs leading-relaxed mb-6">
            Penyebaran materi iklan statis secara manual tanpa penargetan audiens cerdas. Anggaran habis tanpa pelacakan konversi nyata.
          </p>
          <ul className="space-y-2.5 text-xs text-zinc-650 mb-6">
            <li>× Optimasi ad-spend manual lambat</li>
            <li>× Tanpa monitoring AI Audiences</li>
            <li>× Rasio klik konversi rendah (~0.5%)</li>
          </ul>
        </div>
        <div className="text-center text-xs text-zinc-500 font-bold bg-zinc-900/20 py-2.5 rounded-xl border border-zinc-800/40">
          Manual &amp; Rentan Defisit
        </div>
      </div>

      {/* 2. Generasi Baru (Standard Metallic Zinc) */}
      <div className="p-8 rounded-3xl bg-zinc-900/20 border border-zinc-800/80 transition-all flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 bg-zinc-800/40 border border-zinc-750 px-2.5 py-1 rounded">
            Layanan Menengah
          </span>
          <h3 className="text-2xl font-bold text-zinc-200 mt-4 mb-2">Ad Manager Standar</h3>
          <div className="text-xl font-bold text-zinc-400 mb-4">Rp 5 Jt - Rp 15 Jt / bln</div>
          <p className="text-zinc-500 text-xs leading-relaxed mb-6">
            Menggunakan dashboard Meta/Google Ads standar. Memerlukan monitoring manual harian dan penyesuaian bidding yang rumit.
          </p>
          <ul className="space-y-2.5 text-xs text-zinc-500 mb-6">
            <li>• Setup audiens berdasarkan minat umum</li>
            <li>• Pelacakan piksel dasar (statis)</li>
            <li>• Konversi rata-rata industri (~1.5%)</li>
          </ul>
        </div>
        <div className="text-center text-xs text-zinc-455 font-bold bg-zinc-800/20 py-2.5 rounded-xl border border-zinc-800/40">
          Ketergantungan CS Manual
        </div>
      </div>

      {/* 3. WCM / Sovereign Level (Premium Gold Glow Card) */}
      <div className="p-8 rounded-3xl bg-[#0F1423] border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.06)] hover:border-amber-400/50 hover:shadow-[0_0_35px_rgba(245,158,11,0.12)] transition-all flex flex-col justify-between relative">
        <div className="absolute top-4 right-4">
          <span className="text-[9px] uppercase tracking-widest font-black text-amber-950 bg-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded animate-pulse">
            REKOMENDASI ELIT
          </span>
        </div>
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
            Generasi 3.0 (OmniAds AI)
          </span>
          <h3 className="text-2xl font-bold text-white mt-4 mb-2 flex items-center gap-1.5">
            OmniAds Smart Campaign ✨
          </h3>
          <div className="text-xl font-bold text-amber-400 mb-4 font-mono">Mulai Rp 2,99 Jt (Subsidi TEFA)</div>
          <p className="text-zinc-300 text-xs leading-relaxed mb-6">
            Kampanye otonom berkinerja tinggi. Meluncurkan dan mengoptimasi iklan 24/7 di multi-platform secara otonom dengan pelacakan Pirate Funnel (AARRR).
          </p>
          <ul className="space-y-2.5 text-xs text-amber-100 mb-6">
            <li className="flex gap-2"><span className="text-amber-400">✨</span> <strong>Konversi super tinggi (~5.0%+)</strong></li>
            <li className="flex gap-2"><span className="text-amber-400">✨</span> Autopilot A/B Testing &amp; Smart Bidding</li>
            <li className="flex gap-2"><span className="text-amber-400">✨</span> AI Outbound Leads Sync Instan</li>
          </ul>
        </div>
        <div className="text-center text-xs text-amber-300 font-bold bg-gradient-to-r from-amber-500/10 to-yellow-500/15 py-2.5 rounded-xl border border-amber-500/20">
          Autopilot Revenue &amp; Konversi Tinggi
        </div>
      </div>

    </div>
  );
}
```

### B. Template Kalkulator Keuntungan (ROI Calculator Widget)
Kalkulator interaktif sangat disukai karena meningkatkan durasi kunjungan pengguna (*session time*) dan mengunci konversi:

```tsx
import React, { useState } from 'react';

export function AdRoiCalculator() {
  const [adSpend, setAdSpend] = useState(5000000); // Rp 5jt
  const [cpc, setCpc] = useState(1500); // Rp 1.500
  const [convRate, setConvRate] = useState(2.0); // 2%
  const [aov, setAov] = useState(250000); // Rp 250rb AOV

  // Calculations
  const totalClicks = Math.round(adSpend / cpc);
  const totalConversions = Math.round(totalClicks * (convRate / 100));
  const estimatedRevenue = totalConversions * aov;
  const netProfit = estimatedRevenue - adSpend;
  const roas = adSpend > 0 ? (estimatedRevenue / adSpend).toFixed(1) : "0.0";

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  return (
    <div className="bg-[#0b0e14] border border-[#1e293b] rounded-2xl p-8 max-w-4xl mx-auto text-zinc-100 relative overflow-hidden shadow-2xl">
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 mb-6">
        Simulasi Proyeksi ROI Iklan AI
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Sliders Area */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Anggaran Iklan / Bulan:</span>
              <span className="text-amber-400 font-bold font-mono">{formatIDR(adSpend)}</span>
            </div>
            <input
              type="range"
              min="1000000"
              max="50000000"
              step="500000"
              value={adSpend}
              onChange={(e) => setAdSpend(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Rasio Konversi Penjualan:</span>
              <span className="text-amber-400 font-bold font-mono">{convRate.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="10.0"
              step="0.1"
              value={convRate}
              onChange={(e) => setConvRate(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-400">
              <span>Rata-rata Nilai Transaksi (AOV):</span>
              <span className="text-amber-400 font-bold font-mono">{formatIDR(aov)}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="25000"
              value={aov}
              onChange={(e) => setAov(Number(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>
        </div>

        {/* Projections Display Area */}
        <div className="bg-gradient-to-br from-[#0F1423] to-[#0b0e14] border border-amber-500/20 rounded-2xl p-6 relative flex flex-col justify-between">
          <span className="absolute top-0 right-0 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-bl-xl text-[9px] font-mono font-bold border-l border-b border-amber-500/20">
            PROYEKSI AUTOPILOT
          </span>
          
          <div className="space-y-4">
            <div>
              <span className="text-xs text-zinc-455 block">Estimasi Omset Pendapatan:</span>
              <span className="text-2xl font-black text-white font-mono">{formatIDR(estimatedRevenue)}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
              <div>
                <span className="text-[10px] text-zinc-455 block">Rata-rata Klik:</span>
                <span className="text-sm font-bold text-zinc-300 font-mono">{totalClicks.toLocaleString('id-ID')} klik</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-455 block">ROAS:</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{roas}x ROAS</span>
              </div>
            </div>

            <div className="border-t border-amber-500/25 pt-4">
              <span className="text-xs text-amber-455 font-bold block uppercase tracking-wider">LABA BERSIH ESTIMASI:</span>
              <span className={`text-3xl font-black font-mono block mt-1 ${netProfit >= 0 ? 'text-amber-400' : 'text-zinc-500'}`}>
                {formatIDR(netProfit)}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
```

### C. Standardized Icon Wrapper Template
Untuk menghindari ikon dengan beragam warna neon mencolok yang merusak estetika, gunakan standardisasi kontainer ikon berikut:

```tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface SpecIconProps {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export function StandardSpecCard({ Icon, title, desc }: SpecIconProps) {
  return (
    <div className="p-6 rounded-2xl bg-[#090b10] border border-zinc-850 hover:border-amber-500/20 hover:bg-[#0c0f16]/60 transition-all duration-300">
      <div className="w-12 h-12 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center mb-5">
        <Icon size={22} />
      </div>
      <h4 className="text-base font-bold text-white mb-2">{title}</h4>
      <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
```

---

## 🛡️ 3. Langkah Integrasi &amp; Validasi Kesiapan (checklist)

Untuk mengadopsi standar visual ini pada **OmniAds**, ikuti tahapan validasi berikut:

- [ ] **1. Standardisasi Variabel CSS (`src/app/globals.css` atau config)**
  * Selaraskan skema warna agar menggunakan `primary: #070b13` dan `accent: #f59e0b` (Gold).
  * Batasi kemunculan warna sekunder di luar rentang warna royal-purple dan amber/gold.
- [ ] **2. Refaktor Layout Papan Utama (`src/app/page.tsx`)**
  * Update background halaman utama ke warna gelap lux (`bg-[#070b13]`).
  * Ganti banner login/utama yang mencolok agar berpadu anggun dengan micro-shadow emas lembut.
  * Tambahkan komponen **AdArchitectureComparison** atau **AdRoiCalculator** jika diperlukan untuk visual demonstrasi produk ads berkinerja tinggi.
- [ ] **3. Targeted Compile Safety Validation**
  * Sebelum push, jalankan perintah validasi kompilasi parsial:
    ```bash
    npx tsc src/app/page.tsx --noEmit --skipLibCheck --esModuleInterop --jsx react-jsx
    ```
  * Pastikan status kompilasi file yang dimodifikasi menghasilkan **sukses penuh (Exit Code 0)** dengan nol pesan kesalahan.
