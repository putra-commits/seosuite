# 💰 REVENUE ACADEMY — seosuite

> AKSES: SUPER ADMIN ONLY — jangan ekspos ke publik atau klien
> Terakhir diperbarui: 2026-06-27
> Doktrin: **Bukan jual kursus. Kita ajak orang bangun bisnis AUTOPROFIT via System + Automation + Agentic AI + GRC.**

---

## 0. Manifesto

SEOsuite adalah **Feeder #2** — mesin yang mengidentifikasi bisnis dengan SEO lemah dan mengubah mereka menjadi prospek hangat (warm lead) untuk ekosistem.

Kenapa SEO lemah = warm lead? Karena bisnis yang punya website tapi tidak muncul di Google **sudah tahu ada masalah** — mereka tinggal butuh seseorang yang tunjukkan buktinya. SEOsuite yang tunjukkan buktinya. agenc1st yang closing-nya.

seosuite.info adalah platform B2B SaaS yang melakukan:
1. **Audit SEO 53 titik** — technical, on-page, off-page, local-SEO, Core Web Vitals
2. **Keyword intelligence** — gap analysis, cluster topik, volume vs kompetisi
3. **Local SEO scanner** — Google Business Profile, citation consistency, review score
4. **Pilar konten generator** — struktur konten 3 bulan dari 1 topik utama

Setiap bisnis yang masuk seosuite.info dan punya skor rendah = prospek tertarik untuk beli jasa SEO dari agenc1st atau beli WCM.

---

## 1. Posisi di 4 Pilar

### System
- **Audit engine 53 titik terstandar:** setiap audit menghasilkan skor 0–100 per kategori (Technical, On-page, Local, Off-page, UX)
- **Dashboard multi-tenant:** tiap klien punya akun, bisa pantau perkembangan skor SEO dari waktu ke waktu
- **Laporan otomatis:** PDF audit tergenerate otomatis setelah crawl selesai — siap dikirim ke klien
- **Histori audit:** perbandingan skor bulan lalu vs bulan ini → bisnis bisa lihat progres
- PostgreSQL + Prisma — semua data audit tersimpan sovereign, ZERO Firebase
- Self-hosted di DigitalOcean — tidak ada data klien yang keluar ke platform pihak ketiga

### Automation
- **Crawl otomatis terjadwal:** setelah klien daftar, SEOsuite crawl website mereka setiap bulan (atau mingguan untuk paket premium)
- **Keyword cluster otomatis:** AI group keywords serupa → pilih 1 representatif per cluster → buang duplikat
- **Core Web Vitals monitor (CWV):** pantau LCP, CLS, FID/INP setiap minggu → alert kalau ada degradasi
- **Pilar konten generator:** input 1 topik utama → AI generate 30+ ide artikel terstruktur (pilar + cluster) → klien tinggal eksekusi
- **Alert sistem:** kalau skor SEO turun > 10 poin dalam 7 hari → otomatis kirim notif WA/email ke klien
- **Competitor tracker:** _placeholder_ — monitor skor SEO kompetitor klien secara berkala

### Agentic AI
- **AI analisis hasil audit → rekomendasi action terurut:** bukan hanya "halaman ini lambat" tapi "perbaiki LCP di homepage dulu karena traffic tertinggi, estimasi impact: +15% konversi"
- **Prioritas fix berdasarkan ROI:** AI hitung mana issue yang kalau diperbaiki punya dampak terbesar terhadap ranking → klien tahu harus mulai dari mana
- **Pilar konten AI:** Groq llama-3.3-70b generate outline artikel + meta description + target keyword dari setiap topik pilar
- **Insight kompetitor:** AI bandingkan profil backlink dan konten klien vs kompetitor → identifikasi gap yang bisa dieksploitasi
- **Lead scoring dari audit:** AI beri skor "urgency" ke setiap bisnis yang di-audit — bisnis dengan skor sangat rendah + industri kompetitif = hot lead untuk outreach segera
- **Report writer AI:** AI generate narasi penjelasan audit dalam bahasa bisnis (bukan jargon teknis) → klien mengerti tanpa harus jadi SEO expert

### GRC (Governance, Risk, Compliance)
- **Data audit klien terisolasi per tenant:** klien A tidak bisa lihat data audit klien B — walled garden sempurna
- **ZERO Firebase:** tidak ada data audit yang tersimpan di Google/Firebase
- **API key management:** setiap tenant punya API key mereka sendiri untuk integrasi eksternal
- **Rate limiting crawl:** cegah crawl berlebihan yang bisa trigger blokir dari target website
- **Disclaimer audit:** laporan audit selalu sertakan disclaimer "estimasi dan rekomendasi, bukan garansi ranking"
- **Data retention:** _placeholder_ — kebijakan berapa lama data crawl mentah disimpan sebelum diarsip

---

## 2. Revenue Streams

| # | Stream | Model | Harga | Status |
|---|--------|-------|-------|--------|
| 1 | SaaS SEO audit subscription — Basic | Bulanan per domain | Rp 499rb/bln | 🟢 Live |
| 2 | SaaS SEO audit subscription — Pro | Bulanan per domain (lebih banyak fitur) | _placeholder_ Rp 999rb/bln | 🟡 Perlu di-launch |
| 3 | SaaS SEO audit subscription — Agency | Bulanan multi-domain | _placeholder_ Rp 2,5jt/bln (10 domain) | ⚪ Roadmap |
| 4 | White-label audit report | Per laporan untuk dijual kembali | _placeholder_ Rp 200rb/laporan | ⚪ Roadmap |
| 5 | SEO consulting upsell | Via agenc1st — retainer SEO bulanan | Rp 3jt–10jt/bln | 🟡 Manual, belum terintegrasi |
| 6 | One-time deep audit | Per website, non-subscription | _placeholder_ Rp 1,5jt/audit | ⚪ Roadmap |
| 7 | Pilar konten package | Per domain per kuartal | _placeholder_ Rp 2jt/kuartal | ⚪ Roadmap |
| 8 | Feeder ke alchem1st | Indirect — warm leads multiply revenue ekosistem | N/A | 🟢 Berjalan |

**Catatan:** SEOsuite punya dua mode revenue — **langsung** (subscription SaaS) dan **tidak langsung** (warm lead ke alchem1st → closing di agenc1st). Keduanya harus dioptimasi bersamaan.

**Estimasi revenue langsung (12 bulan):** _placeholder_ — hitung dari target subscriber × ARPU Rp 499rb/bln

---

## 3. Flywheel

```
Bisnis dengan website cari cara naik ranking Google
        ↓
Temukan SEOsuite → daftar → jalankan audit gratis/trial
        ↓
Lihat skor SEO mereka rendah (bukti konkret masalah)
        ↓
AI beri rekomendasi → klien butuh bantuan eksekusi
        ↓
Option A: Beli subscription SEOsuite (monitor + rekomendasi)
Option B: Kontak agenc1st untuk done-for-you SEO
Option C: Keduanya
        ↓
Lead masuk alchem1st → autonomous outreach → closing agenc1st
        ↓
Klien agenc1st naik ranking → mereferensikan bisnis lain
        ↓ (loop, trust terbangun via hasil nyata)
```

**Network effect:** setiap bisnis yang naik ranking karena guna SEOsuite + agenc1st = social proof untuk dapat klien berikutnya.

---

## 4. Action Plan

### Immediate (minggu ini)
- [ ] Setup endpoint push lead ke alchem1st: bisnis dengan skor audit < 40 → otomatis POST ke `/api/v2/leads/ingest`
- [ ] Buat CTA di halaman hasil audit: "Skor Anda rendah. Ingin kami bantu perbaiki? →" (link ke agenc1st)
- [ ] Verifikasi billing cycle subscription — tidak ada pembayaran yang ke Firebase/GCP

### Short-term (bulan ini)
- [ ] Launch paket Pro (Rp 999rb/bln) dengan tambahan fitur: competitor tracker, monthly report PDF
- [ ] Integrasi bernas.id: artikel tutorial SEO di bernas → backlink ke seosuite.info → demo credibility
- [ ] Tambah 5 bisnis pertama sebagai case study: audit → action plan → before/after ranking
- [ ] Setup automated nurture sequence: bisnis yang daftar trial tapi belum upgrade → WA sequence via alchem1st

### Mid-term (Q3 2026)
- [ ] Launch paket Agency (Rp 2,5jt/bln) — target digital agency kecil yang mau resell audit ke klien mereka
- [ ] White-label program: agency bisa generate laporan dengan brand mereka sendiri
- [ ] Integrasi OmniClaw: domain dari harvest OmniClaw → SEOsuite crawl → score → kalau rendah push ke alchem1st sebagai "double-qualified" lead
- [ ] Fitur benchmark industri: "Skor SEO Anda vs rata-rata industri F&B di Jakarta"

---

## 5. Peta Keterkaitan Repo

```
SEOsuite (Feeder #2 — seosuite.info)
    │
    ├──→ alchem1st        [bisnis skor audit rendah → /api/v2/leads/ingest]
    │                      source: "seosuite_audit"
    │                      Header: x-ingest-key: {INGEST_API_KEY}
    │                      notes: "SEO Score: 28/100, Top issue: no meta, no backlink"
    │
    ├──→ agenc1st         [upsell SEO consulting via CTA di halaman hasil audit]
    │                      Klien klik CTA → masuk pipeline agenc1st
    │
    ├──← bernas           [artikel tutorial SEO di bernas → backlink ke seosuite.info]
    │                      Demo credibility sekaligus SEO untuk seosuite itu sendiri
    │
    ├──← OmniClaw         [OmniClaw harvest domain bisnis → SEOsuite audit domain]
    │                      (roadmap — cross-feeder enrichment, double-qualify lead)
    │
    └──→ WCM              [klien yang website-nya jelek dan SEO rendah → offer WCM]
                           CTA: "Website lama + SEO lemah? Kami punya solusi →"
```

**Kontrak push lead dari SEOsuite ke alchem1st:**
```json
POST alchem1st /api/v2/leads/ingest
Header: x-ingest-key: {INGEST_API_KEY}
Body: {
  "source": "seosuite_audit",
  "listName": "seosuite_low_score",
  "contacts": [{
    "phone": "628...",
    "email": "owner@bisnis.com",
    "name": "Nama Pemilik / Bisnis",
    "notes": "SEO Score: 28/100 | Domain: bisnis.com | Top issues: no title tag, 0 backlinks, page speed 34"
  }]
}
```

---

## 6. KPI

| Metrik | Target Bulan 1 | Target Bulan 3 | Target Bulan 6 |
|--------|---------------|---------------|---------------|
| Audit terjalankan per hari | 10 | 50 | 200 |
| Subscriber aktif (Basic) | 10 | 50 | 150 |
| Subscriber aktif (Pro) | 0 | 10 | 40 |
| MRR dari subscription | Rp 5jt | Rp 30jt | Rp 100jt |
| Lead ke alchem1st dari audit rendah | 5/hari | 20/hari | 80/hari |
| Conversion trial → paid | _placeholder_ % | 15% | 20% |
| Klien SEO consulting via agenc1st (dari SEOsuite) | 1 | 5 | 15 |
| Churn rate subscription | < 10%/bln | < 7%/bln | < 5%/bln |

---

> SEOsuite bukan tool audit biasa. Ini adalah mesin "aha moment" — tempat pemilik bisnis akhirnya sadar bahwa website mereka tidak ada gunanya kalau tidak ada di Google. Kita yang tunjukkan datanya. Kita juga yang tawarkan solusinya.
