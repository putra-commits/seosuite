import { NextRequest, NextResponse } from 'next/server';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PilarCluster {
  pillar: string;
  keyword: string;
  clusters: Array<{
    title: string;
    slug: string;
    city: string;
    intent: 'informational' | 'commercial' | 'transactional';
    wordTarget: number;
  }>;
}

// ── Geo-SEO cities (30 titik GEO-SEO Matrix: Rute Transit Nasional & Lokal) ──
const GEO_CITIES = [
  // Cluster Sumbagsel & Lampung (Rute Kereta/Transit ke Baturaja)
  'Baturaja', 'Belitang', 'Muaradua', 'Way Kanan', 'Kotabumi', 
  'Bandar Lampung', 'Palembang', 'Prabumulih', 'Muara Enim', 'Tanjung Enim', 
  'Lahat', 'Lubuklinggau', 'Martapura', 
  
  // Episentrum
  'Yogyakarta', 'Jakarta', 'Kalibata',
  
  // Cluster Jawa Tengah/Barat (Basis Pelajar yang berkiblat ke Jogja)
  'Semarang', 'Surakarta', 'Purwokerto', 'Cirebon', 'Magelang',
  
  // Cluster Jabodetabek (Hyperlocal KRL & Busway ke Kalibata City)
  'Bogor', 'Depok', 'Bekasi', 'Tangerang', 'Tangerang Selatan', 
  'Cikarang', 'Bojonggede', 'Pasar Minggu', 'Manggarai'
];

// ── Intent classifier ─────────────────────────────────────────────────────────
function classifyIntent(keyword: string): 'informational' | 'commercial' | 'transactional' {
  const kw = keyword.toLowerCase();
  if (/beli|harga|jasa|biaya|hire|daftar|download/.test(kw)) return 'transactional';
  if (/terbaik|rekomendasi|review|vs|compare|agency|konsultan/.test(kw)) return 'commercial';
  return 'informational';
}

// ── Title generator (GEO × Keyword matrix) ────────────────────────────────────
function generateClusters(keyword: string, cities: string[]): PilarCluster['clusters'] {
  const intent   = classifyIntent(keyword);
  const kwSlug   = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const templates = [
    (k: string, c: string) => `Mengapa Eksekusi ${k} di ${c} Sering Berujung Gagal? (Analisis Kritis)`,
    (k: string, c: string) => `Membongkar Fakta Pahit: Rahasia ${k} di ${c} yang Disembunyikan Agency`,
    (k: string, c: string) => `Jangan Coba ${k} di Pasar ${c} Sebelum Membaca Investigasi Ini`,
    (k: string, c: string) => `Realita ${k} di ${c}: Uang Habis Tanpa Hasil (dan Solusi Konkretnya)`,
    (k: string, c: string) => `Strategi ${k} vs Konvensional di ${c}: Siapa yang Punah Duluan?`,
    (k: string, c: string) => `Blueprint Rahasia ${k} di ${c}: Dominasi Saat Kompetitor Tertidur`,
    (k: string, c: string) => `Kapan Saat yang Tepat Berhenti Membakar Uang untuk ${k} di ${c}?`,
    (k: string, c: string) => `Studi Kasus: Kebocoran Anggaran Akibat Kesalahan ${k} di ${c}`,
    (k: string, c: string) => `Apakah ${k} di ${c} Benar Menguntungkan, atau Sekadar Tren Sesaat?`,
    (k: string, c: string) => `Eksploitasi Celah Pasar ${c} Menggunakan Strategi ${k} Anti-Boncos`
  ];

  return cities.map((city, i) => {
    const fn    = templates[i % templates.length];
    const title = fn(keyword, city);
    const citySlug = city.toLowerCase().replace(/\s+/g, '-');
    return {
      title,
      slug: `${kwSlug}-${citySlug}`,
      city,
      intent,
      wordTarget: intent === 'informational' ? 1500 : intent === 'commercial' ? 2000 : 1200,
    };
  });
}

// ── Pilar score calculator ────────────────────────────────────────────────────
function calcCoverage(clusters: PilarCluster[]): number {
  const total    = clusters.reduce((s, c) => s + c.clusters.length, 0);
  const expected = clusters.length * GEO_CITIES.length;
  return expected > 0 ? Math.round((total / expected) * 100) : 0;
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { keywords, cities }: { keywords: string[]; cities?: string[] } = body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return NextResponse.json({ error: 'Provide keywords array' }, { status: 400 });
    }

    const targetCities = (cities && cities.length > 0 ? cities : GEO_CITIES).slice(0, 30);
    const kwList       = keywords.slice(0, 100); // max 100 keywords

    const clusters: PilarCluster[] = kwList.map(kw => ({
      pillar:   kw,
      keyword:  kw,
      clusters: generateClusters(kw, targetCities),
    }));

    const totalArticles = clusters.reduce((s, c) => s + c.clusters.length, 0);
    const intentBreakdown = {
      informational: clusters.flatMap(c => c.clusters).filter(a => a.intent === 'informational').length,
      commercial:    clusters.flatMap(c => c.clusters).filter(a => a.intent === 'commercial').length,
      transactional: clusters.flatMap(c => c.clusters).filter(a => a.intent === 'transactional').length,
    };

    return NextResponse.json({
      summary: {
        keywords:      kwList.length,
        cities:        targetCities.length,
        totalArticles,
        coverage:      calcCoverage(clusters),
        intentBreakdown,
        estimatedDays: Math.ceil(totalArticles / 50), // 50 articles/day pace
      },
      clusters,
      generatedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// ── GET: default keyword suggestions ─────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    defaultKeywords: [
      'Next.js Server Components', 'Vector Database Indonesia', 'AI Marketing Automation',
      'SEO Technical Audit', 'Core Web Vitals Optimization', 'Content Marketing Strategy',
      'Digital Transformation UMKM', 'Cloud Computing Indonesia', 'Data Analytics Bisnis',
      'Mobile App Development',
    ],
    defaultCities: GEO_CITIES,
    maxKeywords: 100,
    maxCities: 10,
  });
}
