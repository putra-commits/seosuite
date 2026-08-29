/**
 * audit-store.ts — File-based Data Store for Audit Reports & Lead Engine
 * Menyimpan laporan audit dan database prospek di data/audits/ & data/leads.json
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { CalculatedAudit, TopIssue, ModuleSection } from './scoring';
import { withFileLock, writeJsonAtomic } from './file-lock';

// Lokasi data lewat env supaya bisa diarahkan ke volume di luar folder
// deploy. Kalau tetap di dalam folder rilis, seluruh database lead lenyap
// begitu folder deploy diganti.
const DATA_DIR = process.env.ADOLOSEO_DATA_DIR || path.join(process.cwd(), 'data');
const AUDITS_DIR = path.join(DATA_DIR, 'audits');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const MAX_LEADS = 200;

export interface StoredAuditRecord {
  id: string;
  slug: string;
  url: string;
  domain: string;
  businessName: string;
  whatsapp: string;
  city: string;
  vertical: string;
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  statusColor: 'emerald' | 'amber' | 'rose';
  summaryText: string;
  lossEstimateText: string;
  top3Issues: TopIssue[];
  modules: ModuleSection[];
  aiVerdict?: string | null;
  status: 'new' | 'contacted' | 'won' | 'lost';
  isPublic: boolean;
  createdAt: string;
}

async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(AUDITS_DIR, { recursive: true });
  try {
    await fs.access(LEADS_FILE);
  } catch {
    await fs.writeFile(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

export function generateSlug(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'website';
}

/**
 * Cari slug yang belum terpakai. Audit pertama sebuah domain mendapat URL
 * cantik (klinikgigisehat-id); audit berikutnya diberi imbuhan -2, -3, dst.
 *
 * Tanpa ini, audit ulang domain yang sama menimpa laporan lama DAN menghapus
 * lead sebelumnya dari index — riwayat penjualan hilang, dan orang luar bisa
 * sengaja menimpa laporan milik domain orang lain.
 *
 * Harus dipanggil di dalam kunci: cek-lalu-tulis ini balapan kalau tidak.
 */
async function reserveSlug(base: string): Promise<string> {
  for (let n = 1; n <= 500; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    try {
      await fs.access(path.join(AUDITS_DIR, `${candidate}.json`));
    } catch {
      return candidate; // berkas belum ada = slug bebas
    }
  }
  // Ekor yang sangat panjang: jatuh ke akhiran acak daripada menyerah.
  return `${base}-${randomUUID().slice(0, 8)}`;
}

export async function saveAuditReport(params: {
  url: string;
  businessName?: string;
  whatsapp?: string;
  city?: string;
  vertical?: string;
  audit: CalculatedAudit;
  aiVerdict?: string | null;
}): Promise<StoredAuditRecord> {
  await ensureDirs();

  let domain = '';
  try {
    domain = new URL(params.url).hostname.replace(/^www\./, '');
  } catch {
    domain = params.url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }

  const baseSlug = generateSlug(domain);
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  // Satu kunci menaungi pemesanan slug DAN pembaruan index — kalau dipisah,
  // dua audit domain sama di worker berbeda bisa memesan slug yang sama.
  return await withFileLock(LEADS_FILE, async () => {
    const slug = await reserveSlug(baseSlug);

    const record: StoredAuditRecord = {
      id,
      slug,
      url: params.url,
      domain,
      businessName: params.businessName || domain,
      whatsapp: params.whatsapp || '',
      city: params.city || 'Indonesia',
      vertical: params.vertical || 'Umum / Bisnis',
      score: params.audit.overallScore,
      grade: params.audit.grade,
      statusColor: params.audit.statusColor,
      summaryText: params.audit.summaryText,
      lossEstimateText: params.audit.lossEstimateText,
      top3Issues: params.audit.top3Issues,
      modules: params.audit.modules,
      aiVerdict: params.aiVerdict ?? null,
      status: 'new',
      isPublic: true,
      createdAt,
    };

    // Simpan detail laporan per slug & per id
    await writeJsonAtomic(path.join(AUDITS_DIR, `${slug}.json`), record);
    await writeJsonAtomic(path.join(AUDITS_DIR, `${id}.json`), record);

    // Perbarui master index leads. Lead lama TIDAK dihapus: tiap audit adalah
    // satu prospek, dan riwayatnya bagian dari data penjualan.
    try {
      let leads: StoredAuditRecord[] = [];
      try {
        leads = JSON.parse(await fs.readFile(LEADS_FILE, 'utf-8'));
      } catch { /* berkas belum ada atau rusak — mulai dari kosong */ }

      leads.unshift(record);

      if (leads.length > MAX_LEADS) {
        console.warn(`leads.json melewati ${MAX_LEADS}; ${leads.length - MAX_LEADS} lead terlama dipangkas`);
      }
      await writeJsonAtomic(LEADS_FILE, leads.slice(0, MAX_LEADS));
    } catch (err) {
      console.error('Failed to update leads master file:', err);
    }

    return record;
  });
}

export async function getAuditBySlug(slug: string): Promise<StoredAuditRecord | null> {
  await ensureDirs();
  const filePath = path.join(AUDITS_DIR, `${slug.toLowerCase()}.json`);
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    // Coba fallback cari di leads.json
    try {
      const rawLeads = await fs.readFile(LEADS_FILE, 'utf-8');
      const leads: StoredAuditRecord[] = JSON.parse(rawLeads);
      const found = leads.find(l => l.slug === slug || l.id === slug);
      return found || null;
    } catch {
      return null;
    }
  }
}

export async function getAllLeads(): Promise<StoredAuditRecord[]> {
  await ensureDirs();
  try {
    const raw = await fs.readFile(LEADS_FILE, 'utf-8');
    const leads: StoredAuditRecord[] = JSON.parse(raw);
    if (leads.length === 0) {
      // Seed dummy initial report jika masih kosong
      const dummy = await seedDummyAudit();
      return [dummy];
    }
    return leads;
  } catch {
    const dummy = await seedDummyAudit();
    return [dummy];
  }
}

export async function updateLeadStatus(idOrSlug: string, status: StoredAuditRecord['status']): Promise<boolean> {
  await ensureDirs();
  try {
    return await withFileLock(LEADS_FILE, async () => {
      const raw = await fs.readFile(LEADS_FILE, 'utf-8');
      const leads: StoredAuditRecord[] = JSON.parse(raw);
      const item = leads.find(l => l.id === idOrSlug || l.slug === idOrSlug);
      if (!item) return false;

      item.status = status;
      await writeJsonAtomic(LEADS_FILE, leads);

      // Update individual file juga
      try {
        await writeJsonAtomic(path.join(AUDITS_DIR, `${item.slug}.json`), item);
      } catch { /* laporan per-slug boleh gagal, master index yang menentukan */ }

      return true;
    });
  } catch {
    return false;
  }
}

export async function seedDummyAudit(): Promise<StoredAuditRecord> {
  await ensureDirs();
  const dummy: StoredAuditRecord = {
    id: 'demo-audit-klinik-sehat',
    slug: 'klinik-gigi-sehat-id',
    url: 'https://klinikgigisehat.id',
    domain: 'klinikgigisehat.id',
    businessName: 'Klinik Gigi Sehat Setiabudi',
    whatsapp: '081234567890',
    city: 'Jakarta Selatan',
    vertical: 'Kesehatan / Klinik Gigi',
    score: 54,
    grade: 'C',
    statusColor: 'amber',
    summaryText: 'Website Anda sudah aktif dan terindeks, namun mengalami kebocoran calon pasien akibat ketiadaan tombol WhatsApp instan, kecepatan respons lambat, dan belum adanya schema LocalBusiness.',
    lossEstimateText: 'Perkiraan: Website Anda berpotensi kehilangan 15–25 calon pasien baru per bulan yang beralih ke klinik kompetitor yang memiliki tombol reservasi WhatsApp dan peta Maps cepat.',
    top3Issues: [
      {
        id: 'LOC-01',
        title_id: 'Tidak Ditemukan Tombol Chat WhatsApp Langsung',
        why_it_matters_id: '90% pasien klinik di Indonesia memilih booking jadwal via WhatsApp daripada formulir web.',
        how_to_fix_id: 'Pasang floating WhatsApp CTA button di pojok kanan bawah dengan link wa.me.',
        impact: 'H',
        effort: 'S',
        category: 'local',
        severity: 'critical',
      },
      {
        id: 'LOC-03',
        title_id: 'Schema LocalBusiness & Peta Google Maps Belum Terpasang',
        why_it_matters_id: 'Google Maps sulit mengenali lokasi fisik klinik saat orang mencari "klinik gigi terdekat".',
        how_to_fix_id: 'Tambahkan JSON-LD structured data LocalBusiness lengkap dengan alamat dan jam buka.',
        impact: 'H',
        effort: 'M',
        category: 'local',
        severity: 'warn',
      },
      {
        id: 'PERF-04',
        title_id: 'Waktu Respons Server (TTFB) Lambat (1.4 Detik)',
        why_it_matters_id: 'Pengunjung mobile sering menutup halaman jika website tidak muncul dalam 2-3 detik.',
        how_to_fix_id: 'Aktifkan edge caching CDN (Cloudflare) dan optimalkan kompresi gambar.',
        impact: 'H',
        effort: 'M',
        category: 'performance',
        severity: 'critical',
      },
    ],
    modules: [
      {
        id: 'technical',
        title: '🔧 Technical & Indexability',
        weight: 30,
        score: 75,
        findings: [
          {
            id: 'TECH-01',
            category: 'technical',
            severity: 'critical',
            pass: true,
            title_id: 'Aksesibilitas Server & Status HTTP',
            why_it_matters_id: 'Server merespons normal (HTTP 200).',
            evidence: 'HTTP Status Code: 200',
            how_to_fix_id: 'Pastikan web server aktif.',
            effort: 'S',
            impact: 'H',
            owner: 'dev',
          },
          {
            id: 'TECH-02',
            category: 'technical',
            severity: 'critical',
            pass: true,
            title_id: 'Protokol Keamanan HTTPS / SSL',
            why_it_matters_id: 'Situs diamankan dengan enkripsi SSL HTTPS.',
            evidence: 'Protokol: https',
            how_to_fix_id: 'Pasang sertifikat SSL.',
            effort: 'S',
            impact: 'H',
            owner: 'dev',
          },
          {
            id: 'TECH-05',
            category: 'technical',
            severity: 'critical',
            pass: true,
            title_id: 'File robots.txt & Izin Googlebot',
            why_it_matters_id: 'File robots.txt tersedia dan mengizinkan Googlebot merayapi situs.',
            evidence: 'robots.txt OK',
            how_to_fix_id: 'Konfigurasi robots.txt.',
            effort: 'S',
            impact: 'H',
            owner: 'dev',
          },
        ],
      },
      {
        id: 'onpage',
        title: '📄 On-Page SEO & Content',
        weight: 20,
        score: 65,
        findings: [
          {
            id: 'PAGE-01',
            category: 'onpage',
            severity: 'critical',
            pass: true,
            title_id: 'Judul Halaman (Title Tag)',
            why_it_matters_id: 'Title tag terisi (42 karakter).',
            evidence: '"Klinik Gigi Sehat Jakarta Selatan — Dokter Gigi"',
            how_to_fix_id: 'Optimalkan kata kunci.',
            effort: 'S',
            impact: 'H',
            owner: 'konten',
          },
          {
            id: 'PAGE-03',
            category: 'onpage',
            severity: 'critical',
            pass: false,
            title_id: 'Heading Utama (Tag <h1> Tunggal)',
            why_it_matters_id: 'Tidak ditemukan tag <h1>, menyulitkan mesin pencari memahami topik utama.',
            evidence: 'Jumlah tag <h1>: 0',
            how_to_fix_id: 'Tambahkan 1 tag <h1> dengan kata kunci layanan.',
            effort: 'S',
            impact: 'H',
            owner: 'dev',
          },
        ],
      },
      {
        id: 'performance',
        title: '⚡ Kecepatan & Core Web Vitals',
        weight: 20,
        score: 45,
        findings: [
          {
            id: 'PERF-04',
            category: 'performance',
            severity: 'critical',
            pass: false,
            title_id: 'Waktu Respons Server (TTFB)',
            why_it_matters_id: 'Waktu respons server lambat (1420ms).',
            evidence: 'TTFB Homepage: 1420ms',
            how_to_fix_id: 'Gunakan edge caching CDN.',
            effort: 'M',
            impact: 'H',
            owner: 'dev',
          },
        ],
      },
      {
        id: 'local',
        title: '📍 Sinyal Lokal & Konversi WA (ID)',
        weight: 15,
        score: 30,
        findings: [
          {
            id: 'LOC-01',
            category: 'local',
            severity: 'critical',
            pass: false,
            title_id: 'Tombol & Tautan Langsung WhatsApp',
            why_it_matters_id: 'Tidak ditemukan tautan WhatsApp langsung (wa.me).',
            evidence: 'Tidak ada link WhatsApp di halaman utama',
            how_to_fix_id: 'Pasang tombol WhatsApp.',
            effort: 'S',
            impact: 'H',
            owner: 'bisnis',
          },
          {
            id: 'LOC-03',
            category: 'local',
            severity: 'warn',
            pass: false,
            title_id: 'Schema JSON-LD LocalBusiness',
            why_it_matters_id: 'Schema LocalBusiness tidak terpasang.',
            evidence: 'Schema tidak ditemukan',
            how_to_fix_id: 'Tambahkan JSON-LD schema LocalBusiness.',
            effort: 'M',
            impact: 'M',
            owner: 'dev',
          },
        ],
      },
      {
        id: 'ai',
        title: '🤖 Kesiapan Pencarian AI (AEO/GEO)',
        weight: 15,
        score: 40,
        findings: [
          {
            id: 'AEO-01',
            category: 'ai',
            severity: 'warn',
            pass: false,
            title_id: 'Struktur Data FAQ (Schema FAQPage)',
            why_it_matters_id: 'Schema FAQPage belum ada; kehilangan peluang kutipan AI Overview.',
            evidence: 'Schema FAQPage tidak ditemukan',
            how_to_fix_id: 'Tambahkan blok FAQ beserta schema JSON-LD.',
            effort: 'M',
            impact: 'H',
            owner: 'dev',
          },
        ],
      },
    ],
    status: 'new',
    isPublic: true,
    createdAt: new Date().toISOString(),
  };

  await writeJsonAtomic(path.join(AUDITS_DIR, `${dummy.slug}.json`), dummy);
  await writeJsonAtomic(path.join(AUDITS_DIR, `${dummy.id}.json`), dummy);
  await writeJsonAtomic(LEADS_FILE, [dummy]);

  return dummy;
}

// ── Legacy store (dipakai /cek, /before-after, /hasil/[uuid], /api/badge) ─────
// Dipertahankan supaya fitur lama tetap terkompilasi & jalan setelah refactor
// unified engine. Skema berbeda dari StoredAuditRecord — jangan dicampur.

const HISTORY_DIR = path.join(DATA_DIR, 'history');

export interface StoredAudit {
  uuid: string;
  url: string;
  score: number;
  sections: unknown[];
  timestamp: string;
  verdict?: string;
}

export async function saveAudit(data: Omit<StoredAudit, 'uuid'>): Promise<string> {
  await ensureDirs();
  await fs.mkdir(HISTORY_DIR, { recursive: true });
  const uuid = randomUUID();
  const stored: StoredAudit = { uuid, ...data };
  await writeJsonAtomic(path.join(AUDITS_DIR, `${uuid}.json`), stored);

  let domain = data.url;
  try { domain = new URL(data.url).hostname.replace(/^www\./, ''); } catch { /* biarkan apa adanya */ }
  const histFile = path.join(HISTORY_DIR, `${domain}.json`);
  await withFileLock(histFile, async () => {
    let history: StoredAudit[] = [];
    try {
      history = JSON.parse(await fs.readFile(histFile, 'utf-8'));
    } catch { /* file belum ada */ }
    history.unshift(stored);
    await writeJsonAtomic(histFile, history.slice(0, 20));
  });

  return uuid;
}

export async function getAudit(uuid: string): Promise<StoredAudit | null> {
  try {
    const raw = await fs.readFile(path.join(AUDITS_DIR, `${uuid}.json`), 'utf-8');
    const parsed = JSON.parse(raw);
    return typeof parsed?.score === 'number' && Array.isArray(parsed?.sections) ? parsed : null;
  } catch {
    return null;
  }
}

export async function getDomainHistory(domain: string): Promise<StoredAudit[]> {
  try {
    const clean = domain.replace(/^www\./, '');
    return JSON.parse(await fs.readFile(path.join(HISTORY_DIR, `${clean}.json`), 'utf-8'));
  } catch {
    return [];
  }
}

export async function getLatestAuditForDomain(domain: string): Promise<StoredAudit | null> {
  const history = await getDomainHistory(domain);
  const latest = history[0];
  if (!latest) return null;
  const age = Date.now() - new Date(latest.timestamp).getTime();
  return age < 6 * 60 * 60 * 1000 ? latest : null;
}
