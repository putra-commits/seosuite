/**
 * auditor.ts — Unified 5-Layer SEO & Conversion Audit Engine
 */

import { AuditFinding, CalculatedAudit, calculateOverallAudit } from './scoring';

interface FetchResponse {
  status: number;
  html: string;
  headers: Record<string, string>;
  ttfbMs: number;
}

async function safeFetch(url: string, timeout = 10000): Promise<FetchResponse> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeout),
      headers: {
        'User-Agent': 'SEOsuite-Bot/2.0 (+https://seosuite.info/bot; Mozilla/5.0 Compatible)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
      },
      redirect: 'follow',
    });
    const html = await res.text().catch(() => '');
    const ttfbMs = Date.now() - t0;
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    return { status: res.status, html, headers, ttfbMs };
  } catch {
    return { status: 0, html: '', headers: {}, ttfbMs: Date.now() - t0 };
  }
}

function extractMeta(html: string, name: string): string {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
  return m?.[1]?.trim() || '';
}

// ── Modul A: Technical & Crawlability ─────────────────────────────────────────
async function auditTechnical(baseUrl: string, homepage: FetchResponse): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];

  // TECH-01: Status HTTP
  const is200 = homepage.status >= 200 && homepage.status < 300;
  findings.push({
    id: 'TECH-01',
    category: 'technical',
    severity: 'critical',
    pass: is200,
    title_id: 'Aksesibilitas Server & Status HTTP',
    why_it_matters_id: is200 ? 'Server merespons normal (HTTP 200).' : 'Server mengalami gangguan akses (HTTP non-200), menghalangi bot perayap dan pengunjung.',
    evidence: `HTTP Status Code: ${homepage.status || 'Timeout / Gagal Terhubung'}`,
    how_to_fix_id: 'Pastikan web server aktif dan routing homepage tidak melempar error 4xx atau 5xx.',
    effort: 'S',
    impact: 'H',
    owner: 'dev',
  });

  // TECH-02: HTTPS & SSL
  const isHttps = baseUrl.startsWith('https://');
  findings.push({
    id: 'TECH-02',
    category: 'technical',
    severity: 'critical',
    pass: isHttps,
    title_id: 'Protokol Keamanan HTTPS / SSL',
    why_it_matters_id: isHttps ? 'Situs diamankan dengan enkripsi SSL HTTPS.' : 'Situs belum menggunakan HTTPS, ditandai "Tidak Aman" oleh browser dan diturunkan peringkatnya oleh Google.',
    evidence: `Protokol: ${baseUrl.split(':')[0]}`,
    how_to_fix_id: 'Pasang sertifikat SSL (misal: Let’s Encrypt / Cloudflare SSL) dan paksa pengalihan HTTP ke HTTPS.',
    effort: 'S',
    impact: 'H',
    owner: 'dev',
  });

  // TECH-04: Noindex Detection
  const hasNoindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex[^"']*["']/i.test(homepage.html)
    || (homepage.headers['x-robots-tag'] || '').toLowerCase().includes('noindex');
  findings.push({
    id: 'TECH-04',
    category: 'technical',
    severity: 'critical',
    pass: !hasNoindex,
    title_id: 'Izin Indeks Mesin Pencari (Noindex Check)',
    why_it_matters_id: !hasNoindex ? 'Homepage diizinkan untuk diindeks oleh Google.' : 'Terdapat instruksi NOINDEX di homepage yang menyebabkan website hilang total dari hasil pencarian Google.',
    evidence: hasNoindex ? 'Ditemukan meta tag noindex atau header X-Robots-Tag: noindex' : 'Tidak ada larangan noindex',
    how_to_fix_id: 'Hapus atribut `noindex` dari meta robots atau konfigurasi header web server Anda.',
    effort: 'S',
    impact: 'H',
    owner: 'dev',
  });

  // TECH-05: robots.txt
  const robotsRes = await safeFetch(`${baseUrl}/robots.txt`, 5000);
  const robotsAccessible = robotsRes.status === 200;
  let googlebotBlocked = false;
  if (robotsAccessible && robotsRes.html) {
    const lines = robotsRes.html.split('\n').map(l => l.trim());
    let inTarget = false;
    for (const l of lines) {
      if (l.toLowerCase().startsWith('user-agent:')) {
        const agent = l.split(':')[1]?.trim().toLowerCase();
        inTarget = agent === '*' || agent === 'googlebot';
      }
      if (inTarget && l.toLowerCase().startsWith('disallow:')) {
        const p = l.split(':')[1]?.trim();
        if (p === '/' || p === '/*') googlebotBlocked = true;
      }
    }
  }

  findings.push({
    id: 'TECH-05',
    category: 'technical',
    severity: 'critical',
    pass: robotsAccessible && !googlebotBlocked,
    title_id: 'File robots.txt & Izin Googlebot',
    why_it_matters_id: robotsAccessible && !googlebotBlocked
      ? 'File robots.txt tersedia dan mengizinkan Googlebot merayapi situs.'
      : 'File robots.txt tidak ditemukan atau memblokir akses Googlebot ke seluruh situs.',
    evidence: `Status robots.txt: HTTP ${robotsRes.status}, Googlebot blocked: ${googlebotBlocked}`,
    how_to_fix_id: 'Buat file robots.txt di root folder dan pastikan `Disallow: /` tidak memblokir perayap utama.',
    effort: 'S',
    impact: 'H',
    owner: 'dev',
  });

  // TECH-06: Sitemap XML
  const sitemapRes = await safeFetch(`${baseUrl}/sitemap.xml`, 5000);
  const sitemapOk = sitemapRes.status === 200;
  findings.push({
    id: 'TECH-06',
    category: 'technical',
    severity: 'warn',
    pass: sitemapOk,
    title_id: 'Peta Situs (sitemap.xml)',
    why_it_matters_id: sitemapOk ? 'Sitemap XML tersedia untuk memandu bot perayap.' : 'Sitemap XML tidak ditemukan, memperlambat proses indeks halaman-halaman baru.',
    evidence: `HTTP ${sitemapRes.status} pada /sitemap.xml`,
    how_to_fix_id: 'Generate sitemap.xml otomatis dari CMS / Framework dan daftarkan ke Google Search Console.',
    effort: 'M',
    impact: 'M',
    owner: 'dev',
  });

  // TECH-07: Canonical Tag
  const canonicalMatch = homepage.html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const canonicalUrl = canonicalMatch?.[1]?.trim() || '';
  findings.push({
    id: 'TECH-07',
    category: 'technical',
    severity: 'warn',
    pass: !!canonicalUrl,
    title_id: 'Tag URL Kanonikal (Canonical Tag)',
    why_it_matters_id: canonicalUrl ? `URL Kanonikal terdefinisi: ${canonicalUrl.slice(0, 50)}...` : 'Canonical tag hilang, berisiko memicu masalah konten duplikat.',
    evidence: canonicalUrl ? `Canonical: ${canonicalUrl}` : 'Tag canonical tidak ditemukan',
    how_to_fix_id: 'Tambahkan tag `<link rel="canonical" href="URL_HALAMAN" />` di dalam tag `<head>`.',
    effort: 'S',
    impact: 'M',
    owner: 'dev',
  });

  // TECH-09: Mobile Viewport
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(homepage.html);
  findings.push({
    id: 'TECH-09',
    category: 'technical',
    severity: 'critical',
    pass: hasViewport,
    title_id: 'Konfigurasi Mobile Viewport',
    why_it_matters_id: hasViewport ? 'Viewport mobile terpasang dengan baik.' : 'Meta viewport hilang; website akan ditampilkan mengecil dan tidak ramah layar ponsel.',
    evidence: hasViewport ? 'Meta viewport terdeteksi' : 'Meta viewport tidak ditemukan',
    how_to_fix_id: 'Tambahkan `<meta name="viewport" content="width=device-width, initial-scale=1.0">` di `<head>`.',
    effort: 'S',
    impact: 'H',
    owner: 'dev',
  });

  return findings;
}

// ── Modul B: On-Page Structure ───────────────────────────────────────────────
function auditOnPage(homepage: FetchResponse): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const html = homepage.html;

  // PAGE-01: Title Tag
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch?.[1]?.trim() || '';
  const titleLen = title.length;
  const titleOk = titleLen >= 25 && titleLen <= 70;

  findings.push({
    id: 'PAGE-01',
    category: 'onpage',
    severity: 'critical',
    pass: !!title && titleOk,
    title_id: 'Judul Halaman (Title Tag)',
    why_it_matters_id: title
      ? `Title tag terisi (${titleLen} karakter). ${titleOk ? 'Panjang ideal untuk Google SERP.' : 'Panjang kurang optimal (disarankan 30-65 karakter).'}`
      : 'Title tag tidak ada! Google akan membuat judul otomatis yang kurang menarik klik.',
    evidence: title ? `"${title.slice(0, 65)}${title.length > 65 ? '...' : ''}"` : 'Title tag kosong',
    how_to_fix_id: 'Tulis Title tag memikat dengan format: [Kata Kunci Utama] - [Nilai Tambah / Nama Brand].',
    effort: 'S',
    impact: 'H',
    owner: 'konten',
  });

  // PAGE-02: Meta Description
  const desc = extractMeta(html, 'description');
  const descLen = desc.length;
  const descOk = descLen >= 70 && descLen <= 165;

  findings.push({
    id: 'PAGE-02',
    category: 'onpage',
    severity: 'warn',
    pass: !!desc && descOk,
    title_id: 'Meta Deskripsi (Snippet SERP)',
    why_it_matters_id: desc
      ? `Meta deskripsi ada (${descLen} karakter).`
      : 'Meta deskripsi kosong; calon klien tidak melihat ringkasan penawaran Anda di hasil pencarian.',
    evidence: desc ? `"${desc.slice(0, 90)}${desc.length > 90 ? '...' : ''}"` : 'Meta deskripsi tidak ditemukan',
    how_to_fix_id: 'Tambahkan meta description 120-155 karakter yang mengandung ajakan bertindak (CTA).',
    effort: 'S',
    impact: 'M',
    owner: 'konten',
  });

  // PAGE-03: Single H1
  const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h1Count = h1Matches.length;
  findings.push({
    id: 'PAGE-03',
    category: 'onpage',
    severity: 'critical',
    pass: h1Count === 1,
    title_id: 'Heading Utama (Tag <h1> Tunggal)',
    why_it_matters_id: h1Count === 1
      ? 'Struktur H1 tepat satu tag, mempertegas topik inti halaman.'
      : h1Count === 0
        ? 'Tidak ditemukan tag <h1>, menyulitkan mesin pencari memahami topik utama.'
        : `Ditemukan ${h1Count} tag <h1> ganda, berisiko mengaburkan fokus kata kunci utama.`,
    evidence: `Jumlah tag <h1>: ${h1Count}`,
    how_to_fix_id: 'Pastikan hanya ada 1 tag <h1> per halaman yang memuat penawaran atau solusi utama bisnis.',
    effort: 'S',
    impact: 'H',
    owner: 'dev',
  });

  // PAGE-05: Missing Alt Images
  const imgTags = html.match(/<img[^>]+>/gi) || [];
  let missingAltCount = 0;
  for (const img of imgTags) {
    if (!img.includes('alt=') || /alt=["']\s*["']/i.test(img)) {
      missingAltCount++;
    }
  }
  const altOk = imgTags.length === 0 || missingAltCount === 0;
  findings.push({
    id: 'PAGE-05',
    category: 'onpage',
    severity: 'warn',
    pass: altOk,
    title_id: 'Atribut Gambar (Alt Text Image)',
    why_it_matters_id: altOk
      ? 'Seluruh gambar memiliki deskripsi alt text.'
      : `Ditemukan ${missingAltCount} dari ${imgTags.length} gambar tanpa alt text, menghilangkan potensi ranking Google Images.`,
    evidence: `Total gambar: ${imgTags.length}, Tanpa Alt: ${missingAltCount}`,
    how_to_fix_id: 'Tambahkan atribut `alt="deskripsi gambar"` pada semua tag gambar `<img>`.',
    effort: 'M',
    impact: 'M',
    owner: 'konten',
  });

  // PAGE-06: Open Graph (Social Sharing)
  const ogTitle = extractMeta(html, 'og:title');
  const ogDesc = extractMeta(html, 'og:description');
  const ogImg = extractMeta(html, 'og:image');
  const ogComplete = !!(ogTitle && ogDesc && ogImg);

  findings.push({
    id: 'PAGE-06',
    category: 'onpage',
    severity: 'warn',
    pass: ogComplete,
    title_id: 'Pratinjau Media Sosial & WA (Open Graph)',
    why_it_matters_id: ogComplete
      ? 'Pratinjau link media sosial dan WhatsApp lengkap (Title, Deskripsi, Gambar).'
      : 'Open Graph belum lengkap; link situs akan terlihat polos/kurang menarik saat dibagikan di WhatsApp.',
    evidence: `og:title: ${!!ogTitle}, og:desc: ${!!ogDesc}, og:image: ${!!ogImg}`,
    how_to_fix_id: 'Pasang meta tag `og:title`, `og:description`, dan `og:image` (rasio 1200x630px).',
    effort: 'S',
    impact: 'M',
    owner: 'dev',
  });

  return findings;
}

// ── Modul C: Speed & Performance ─────────────────────────────────────────────
async function auditSpeed(baseUrl: string, homepage: FetchResponse): Promise<AuditFinding[]> {
  const findings: AuditFinding[] = [];
  const apiKey = process.env.PSI_API_KEY;

  // PERF-04: Server Response (TTFB)
  const ttfb = homepage.ttfbMs;
  const ttfbOk = ttfb < 800;
  findings.push({
    id: 'PERF-04',
    category: 'performance',
    severity: 'critical',
    pass: ttfbOk,
    title_id: 'Waktu Respons Server (TTFB)',
    why_it_matters_id: ttfbOk
      ? `Server merespons cepat dalam ${ttfb}ms.`
      : `Waktu respons server lambat (${ttfb}ms), berisiko membuat pengunjung mobile menutup website sebelum terbuka.`,
    evidence: `TTFB Homepage: ${ttfb}ms`,
    how_to_fix_id: 'Gunakan edge caching (Cloudflare), aktifkan CDN, atau optimalkan query backend/hosting server.',
    effort: 'M',
    impact: 'H',
    owner: 'dev',
  });

  // PERF-05: HTML Weight
  const htmlBytes = Buffer.byteLength(homepage.html, 'utf8');
  const htmlKb = Math.round(htmlBytes / 1024);
  const sizeOk = htmlKb < 250;

  findings.push({
    id: 'PERF-05',
    category: 'performance',
    severity: 'warn',
    pass: sizeOk,
    title_id: 'Ukuran Dokumen HTML Dasar',
    why_it_matters_id: sizeOk
      ? `Ukuran HTML ringan (${htmlKb} KB).`
      : `Ukuran HTML terlalu besar (${htmlKb} KB), memperlambat parsing pada koneksi seluler 4G.`,
    evidence: `Ukuran payload HTML: ${htmlKb} KB`,
    how_to_fix_id: 'Aktifkan kompresi Gzip/Brotli dan kurangi inline CSS / script JS berlebih di dalam HTML.',
    effort: 'S',
    impact: 'M',
    owner: 'dev',
  });

  // Core Web Vitals via PageSpeed Insights (jika API key tersedia)
  if (apiKey) {
    try {
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(baseUrl)}&strategy=mobile&key=${apiKey}&category=performance`;
      const psiRes = await fetch(psiUrl, { signal: AbortSignal.timeout(25000) });
      if (psiRes.ok) {
        const data = await psiRes.json();
        const score = Math.round((data?.lighthouseResult?.categories?.performance?.score || 0) * 100);
        const lcp = data?.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A';
        const cls = data?.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue || 'N/A';

        findings.push({
          id: 'PERF-01',
          category: 'performance',
          severity: 'critical',
          pass: score >= 65,
          title_id: 'Skor Performa Mobile Google Lighthouse',
          why_it_matters_id: score >= 65
            ? `Skor performa mobile baik (${score}/100, LCP: ${lcp}).`
            : `Skor performa mobile rendah (${score}/100, LCP: ${lcp}); Google memprioritaskan situs cepat pada pencarian seluler.`,
          evidence: `Lighthouse Score: ${score}/100, LCP: ${lcp}, CLS: ${cls}`,
          how_to_fix_id: 'Optimalkan gambar ke format WebP/AVIF, minimalkan blocking JavaScript, dan gunakan lazy loading.',
          effort: 'L',
          impact: 'H',
          owner: 'dev',
        });
      }
    } catch { /* Fallback used */ }
  }

  // Jika tidak ada PSI, buat estimasi praktis
  if (findings.length < 3) {
    const scripts = (homepage.html.match(/<script[^>]+src=/gi) || []).length;
    const fastEstimate = ttfb < 700 && scripts < 15;
    findings.push({
      id: 'PERF-01',
      category: 'performance',
      severity: 'warn',
      pass: fastEstimate,
      title_id: 'Estimasi Beban Script & Kecepatan Mobile',
      why_it_matters_id: fastEstimate
        ? `Jumlah script eksternal terkendali (${scripts} script).`
        : `Ditemukan ${scripts} script eksternal yang berpotensi memblokir proses render halaman di smartphone.`,
      evidence: `Jumlah script eksternal: ${scripts}`,
      how_to_fix_id: 'Pasang atribut `defer` atau `async` pada file script JavaScript.',
      effort: 'M',
      impact: 'M',
      owner: 'dev',
    });
  }

  return findings;
}

// ── Modul D: Local SEO & Konversi Indonesia ──────────────────────────────────
function auditLocal(homepage: FetchResponse): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const html = homepage.html;

  // LOC-01: WhatsApp Link Detection
  const hasWaLink = /wa\.me\/|api\.whatsapp\.com\/send|web\.whatsapp\.com/i.test(html);
  findings.push({
    id: 'LOC-01',
    category: 'local',
    severity: 'critical',
    pass: hasWaLink,
    title_id: 'Tombol & Tautan Langsung WhatsApp',
    why_it_matters_id: hasWaLink
      ? 'Tombol chat WhatsApp terpasang untuk konversi cepat pelanggan Indonesia.'
      : 'Tidak ditemukan tautan WhatsApp langsung (wa.me); Anda berisiko kehilangan calon pembeli yang enggan mengisi form panjang.',
    evidence: hasWaLink ? 'Tautan wa.me / api.whatsapp.com terdeteksi' : 'Tidak ada link WhatsApp di halaman utama',
    how_to_fix_id: 'Pasang tombol floating CTA "Chat WhatsApp" dengan link format `https://wa.me/628xxxxxxxxxx`.',
    effort: 'S',
    impact: 'H',
    owner: 'bisnis',
  });

  // LOC-02: Phone & Contact
  const hasPhone = /tel:|itemprop=["']telephone/i.test(html) || /(08\d{8,11}|(\+62)\d{8,11})/i.test(html);
  findings.push({
    id: 'LOC-02',
    category: 'local',
    severity: 'critical',
    pass: hasPhone,
    title_id: 'Nomor Telepon & Kontak Bisnis',
    why_it_matters_id: hasPhone
      ? 'Nomor telepon kontak bisnis terdeteksi jelas.'
      : 'Nomor telepon kontak bisnis tidak terlihat di homepage; mengurangi tingkat kepercayaan pembeli lokal.',
    evidence: hasPhone ? 'Nomor telepon terdeteksi di teks/link tel:' : 'Kontak telepon tidak terdeteksi',
    how_to_fix_id: 'Tampilkan nomor kontak di header atau footer dengan link `tel:+62xxxx`.',
    effort: 'S',
    impact: 'H',
    owner: 'bisnis',
  });

  // LOC-03: LocalBusiness Schema
  const hasLocalSchema = /"@(type|context)":\s*"[^"]*(LocalBusiness|Organization|Store|Restaurant|MedicalBusiness|DentalClinic|LegalService)[^"]*"/i.test(html);
  findings.push({
    id: 'LOC-03',
    category: 'local',
    severity: 'warn',
    pass: hasLocalSchema,
    title_id: 'Schema JSON-LD LocalBusiness',
    why_it_matters_id: hasLocalSchema
      ? 'Structured data entitas bisnis terpasang rapi.'
      : 'Schema LocalBusiness tidak terpasang; Google Maps dan Google Search sulit menghubungkan situs dengan profil bisnis fisik.',
    evidence: hasLocalSchema ? 'Schema LocalBusiness/Organization terpasang' : 'Schema tidak ditemukan',
    how_to_fix_id: 'Tambahkan JSON-LD schema `LocalBusiness` lengkap dengan nama, alamat, jam operasional, dan koordinat.',
    effort: 'M',
    impact: 'M',
    owner: 'dev',
  });

  // LOC-04: Maps / Address
  const hasMapsOrAddress = /<address/i.test(html) || /maps\.google|google\.com\/maps|goo\.gl\/maps/i.test(html) || /itemprop=["']address/i.test(html);
  findings.push({
    id: 'LOC-04',
    category: 'local',
    severity: 'warn',
    pass: hasMapsOrAddress,
    title_id: 'Alamat Fisik & Peta Google Maps',
    why_it_matters_id: hasMapsOrAddress
      ? 'Alamat fisik atau sematan Google Maps ditemukan.'
      : 'Tidak ada alamat fisik atau peta yang tersemat; menurunkan relevansi pencarian lokal "terdekat / near me".',
    evidence: hasMapsOrAddress ? 'Alamat / sematan Maps terdeteksi' : 'Alamat fisik tidak ditemukan',
    how_to_fix_id: 'Cantumkan alamat kantor/toko lengkap di footer dan sematkan iframe peta Google Maps.',
    effort: 'S',
    impact: 'M',
    owner: 'konten',
  });

  return findings;
}

// ── Modul E: AI Visibility & AEO Readiness ───────────────────────────────────
function auditAIReadiness(homepage: FetchResponse): AuditFinding[] {
  const findings: AuditFinding[] = [];
  const html = homepage.html;

  // AEO-01: FAQ Schema
  const hasFaq = /FAQPage|mainEntity.*Question/i.test(html);
  findings.push({
    id: 'AEO-01',
    category: 'ai',
    severity: 'warn',
    pass: hasFaq,
    title_id: 'Struktur Data FAQ (Schema FAQPage)',
    why_it_matters_id: hasFaq
      ? 'Schema FAQPage terpasang; siap dikutip oleh Google AI Overview & ChatGPT.'
      : 'Schema FAQPage belum ada; kehilangan peluang jawaban langsung di kotak AI Overview Google.',
    evidence: hasFaq ? 'Schema FAQPage terpasang' : 'Schema FAQPage tidak ditemukan',
    how_to_fix_id: 'Tambahkan blok FAQ beserta Schema JSON-LD `FAQPage` pada halaman produk/layanan.',
    effort: 'M',
    impact: 'H',
    owner: 'dev',
  });

  // AEO-02: Question-based Headings
  const questionHeadingCount = (html.match(/<h[2-4][^>]*>[^<]*(apa|bagaimana|mengapa|kenapa|how|what|why|biaya|berapa|kapan|dimana|siapa)[^<]*<\/h[2-4]>/gi) || []).length;
  const qOk = questionHeadingCount >= 2;
  findings.push({
    id: 'AEO-02',
    category: 'ai',
    severity: 'warn',
    pass: qOk,
    title_id: 'Heading Berbasis Pertanyaan Solutif',
    why_it_matters_id: qOk
      ? `Ditemukan ${questionHeadingCount} heading berbasis pertanyaan pengguna.`
      : 'Heading situs belum menggunakan format tanya-jawab yang disukai mesin pencari generatif (AEO/GEO).',
    evidence: `Jumlah heading tanya-jawab: ${questionHeadingCount}`,
    how_to_fix_id: 'Gunakan judul sub-bab dengan pola pertanyaan konsumen: "Berapa Biaya...", "Bagaimana Cara...", dll.',
    effort: 'S',
    impact: 'M',
    owner: 'konten',
  });

  // AEO-04: Structured Lists & Tables
  const hasListsOrTables = (html.match(/<[ou]l[^>]*>[\s\S]*?<\/[ou]l>/gi) || []).length >= 2 || /<table/i.test(html);
  findings.push({
    id: 'AEO-04',
    category: 'ai',
    severity: 'info',
    pass: hasListsOrTables,
    title_id: 'Format Data Terstruktur (Tabel & Daftar)',
    why_it_matters_id: hasListsOrTables
      ? 'Konten menggunakan tabel atau daftar berpoin yang memudahkan ekstraksi AI.'
      : 'Konten berbentuk teks blok panjang; tambahkan tabel perbandingan atau daftar langkah kerja.',
    evidence: hasListsOrTables ? 'Tabel / Bullet list ditemukan' : 'Tidak ada tabel/list terstruktur',
    how_to_fix_id: 'Ubah poin-poin fitur, harga, dan tahapan layanan ke dalam bentuk bullet list atau tabel ringkas.',
    effort: 'S',
    impact: 'L',
    owner: 'konten',
  });

  // AEO-05: E-E-A-T & Author Signals
  const hasEeat = /author|itemprop=["']author|tentang-kami|about-us|profil/i.test(html);
  findings.push({
    id: 'AEO-05',
    category: 'ai',
    severity: 'warn',
    pass: hasEeat,
    title_id: 'Sinyal Kredibilitas & E-E-A-T (Author/About)',
    why_it_matters_id: hasEeat
      ? 'Sinyal kredibilitas profil usaha atau penanggung jawab ditemukan.'
      : 'Informasi penanggung jawab / profil usaha tidak terdeteksi; AI memprioritaskan sumber dengan entitas terpercaya.',
    evidence: hasEeat ? 'Sinyal profil/author terdeteksi' : 'Profil bisnis/author tidak terdeteksi',
    how_to_fix_id: 'Tautkan halaman "Tentang Kami" atau cantumkan profil penanggung jawab di footer.',
    effort: 'S',
    impact: 'M',
    owner: 'konten',
  });

  return findings;
}

// ── Orchestrator Utama ────────────────────────────────────────────────────────
export async function runUnifiedAudit(targetUrl: string): Promise<{
  url: string;
  audit: CalculatedAudit;
  timestamp: string;
}> {
  // 1. Fetch homepage
  const homepage = await safeFetch(targetUrl, 12000);

  // 2. Run all 5 module audits in parallel
  const [techFindings, speedFindings] = await Promise.all([
    auditTechnical(targetUrl, homepage),
    auditSpeed(targetUrl, homepage),
  ]);

  const onpageFindings = auditOnPage(homepage);
  const localFindings = auditLocal(homepage);
  const aiFindings = auditAIReadiness(homepage);

  // 3. Compile Modules
  const modules = [
    { id: 'technical' as const, title: '🔧 Technical & Indexability', findings: techFindings },
    { id: 'onpage' as const, title: '📄 On-Page SEO & Content', findings: onpageFindings },
    { id: 'performance' as const, title: '⚡ Kecepatan & Core Web Vitals', findings: speedFindings },
    { id: 'local' as const, title: '📍 Sinyal Lokal & Konversi WA (ID)', findings: localFindings },
    { id: 'ai' as const, title: '🤖 Kesiapan Pencarian AI (AEO/GEO)', findings: aiFindings },
  ];

  // 4. Calculate Weighted Scores & Top 3 Issues
  const calculated = calculateOverallAudit(modules);

  return {
    url: targetUrl,
    audit: calculated,
    timestamp: new Date().toISOString(),
  };
}
