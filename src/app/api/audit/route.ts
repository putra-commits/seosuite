import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import Groq from 'groq-sdk';
import { PrismaClient } from '@prisma/client';
import { validateAndSanitizeUrl, safeFetchUrl } from '@/lib/security';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const WINDOW_MS = 10 * 60 * 1000;

const prisma = new PrismaClient();

// Inisialisasi Groq. Jika API key belum diset di .env, kita tangkap errornya
let groq: Groq | null = null;
try {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} catch (e) {
  console.warn("Groq init failed, API Key might be missing.");
}

export async function POST(req: Request) {
  const { allowed, retryAfterSec } = rateLimit(clientIp(req), 10, WINDOW_MS);
  if (!allowed) {
    return NextResponse.json(
      { error: `Terlalu banyak permintaan audit. Coba lagi dalam ${retryAfterSec} detik.` },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
    );
  }

  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL wajib diisi' }, { status: 400 });
    }
    
    // Validasi & sanitasi URL (SSRF guard)
    const validation = validateAndSanitizeUrl(url);
    if (!validation.valid || !validation.sanitizedUrl) {
      return NextResponse.json({ error: validation.error || 'URL tidak valid' }, { status: 400 });
    }
    const finalUrl = validation.sanitizedUrl;

    // 1. Scraping Ringan
    const fetchRes = await safeFetchUrl(finalUrl, { headers: { 'User-Agent': 'SEOsuite-Auditor/1.0' }, next: { revalidate: 0 } });
    
    if (!fetchRes || !fetchRes.ok) {
      return NextResponse.json({ error: 'Gagal mengakses URL tersebut. Pastikan URL valid dan dapat diakses publik.' }, { status: 400 });
    }

    const html = await fetchRes.text();
    const $ = cheerio.load(html);

    // 2. Analisis SEO & CWV Heuristik
    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').text() || '';
    
    // Hitung Skor SEO kasar
    let seoScore = 100;
    const seoIssues = [];
    if (!title || title.length < 10) { seoScore -= 20; seoIssues.push('Title terlalu pendek atau hilang.'); }
    if (!description || description.length < 50) { seoScore -= 20; seoIssues.push('Meta description tidak optimal.'); }
    if (!h1) { seoScore -= 15; seoIssues.push('Tag H1 tidak ditemukan (struktur dokumen buruk).'); }

    // CWV Heuristics
    let cwvScore = 95;
    const imagesWithoutLazy = $('img:not([loading="lazy"])').length;
    if (imagesWithoutLazy > 3) {
      cwvScore -= 15;
      seoIssues.push(`Ditemukan ${imagesWithoutLazy} gambar tanpa optimasi lazy-loading (LCP Lambat).`);
    }
    if (html.length > 300000) { // Jika HTML > 300KB
      cwvScore -= 25;
      seoIssues.push('Ukuran DOM terlalu besar, berisiko merusak skor TBT (Total Blocking Time).');
    }
    if (cwvScore < 0) cwvScore = 20;

    // GA & GSC Detection
    const hasGA = html.includes('googletagmanager.com/gtag/js') || html.includes('google-analytics.com/analytics.js') || html.includes('G-');
    const hasGSC = html.includes('<meta name="google-site-verification"');

    if (!hasGA) seoIssues.push('Sistem analitik pelacakan pengunjung (GA4) tidak terdeteksi.');
    if (!hasGSC) seoIssues.push('Website belum diverifikasi di Google Search Console (Blind SEO).');

    // 3. Analisis AEO & GEO via Groq AI
    // Ambil teks utama saja (hapus script/style)
    $('script, style, nav, footer, iframe, noscript').remove();
    const mainText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 5000); // Batasi 5000 karakter

    const prompt = `
Anda adalah Auditor AEO (Answer Engine Optimization) dan GEO (Generative Engine Optimization).
Analisis teks website ini secara ketat (berikan skor rendah jika tidak dioptimasi dengan baik):
"${mainText}"

Evaluasi berdasarkan kriteria berikut dan berikan format JSON murni:
{
  "aeoScore": <number 0-100>,
  "geoScore": <number 0-100>,
  "aeoIssues": ["issue 1", "issue 2"],
  "geoIssues": ["issue 1", "issue 2"]
}

Panduan Penilaian:
- AEO tinggi jika teks memiliki struktur FAQ, jawaban langsung, atau paragraf informatif padat yang disukai ChatGPT/Perplexity. Jika hanya berisi teks marketing murahan, beri skor di bawah 40.
- GEO tinggi jika entitas bisnis, brand, kredibilitas, dan otoritas lokal/global disebutkan secara eksplisit. Jika entitas tidak jelas, beri skor di bawah 35.
JANGAN berikan teks selain JSON.
`;

    // Default Fallback (Trigger Psikologis)
    let aiResult = {
      aeoScore: 35,
      geoScore: 28,
      aeoIssues: ['Tidak ditemukan struktur data yang disukai AI pencari.'],
      geoIssues: ['Entitas bisnis tidak terbangun (Zero-Click Search Optimization gagal).']
    };

    if (groq) {
      try {
        const response = await groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.1,
          response_format: { type: 'json_object' }
        });
        const responseText = response.choices[0]?.message?.content || '{}';
        
        // Ekstrak JSON
        const parsed = JSON.parse(responseText);
        if (parsed.aeoScore !== undefined) {
          aiResult = parsed;
        }
      } catch (e) {
        console.error('Groq error, fallback to default', e);
      }
    }

    // Gabungkan Hasil
    const finalScore = Math.floor((seoScore + aiResult.aeoScore + aiResult.geoScore + cwvScore) / 4);
    const combinedIssues = [
      ...seoIssues,
      ...aiResult.aeoIssues,
      ...aiResult.geoIssues
    ].slice(0, 6); // Maksimal 6 peringatan

    // Simpan ke Database
    await prisma.lead.create({
      data: {
        url: finalUrl,
        seoScore,
        aeoScore: aiResult.aeoScore,
        geoScore: aiResult.geoScore,
        cwvScore,
        hasGA,
        hasGSC,
        finalScore,
        issues: combinedIssues,
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        url: finalUrl,
        finalScore,
        seoScore,
        aeoScore: aiResult.aeoScore,
        geoScore: aiResult.geoScore,
        cwvScore,
        hasGA,
        hasGSC,
        issues: combinedIssues
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
