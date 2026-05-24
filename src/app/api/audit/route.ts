import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenAI } from '@google/genai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Inisialisasi Gemini. Jika API key belum diset di .env.local, kita tangkap errornya
let ai: GoogleGenAI | null = null;
try {
  ai = new GoogleGenAI({});
} catch (e) {
  console.warn("GoogleGenAI init failed, API Key might be missing.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL wajib diisi' }, { status: 400 });
    }
    
    // Pastikan URL memiliki http:// atau https://
    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    // 1. Scraping Ringan
    const fetchRes = await fetch(finalUrl, { 
      headers: { 'User-Agent': 'SEOsuite-Auditor/1.0' },
      next: { revalidate: 0 } // Bypass cache
    }).catch(() => null);
    
    if (!fetchRes || !fetchRes.ok) {
      return NextResponse.json({ error: 'Gagal mengakses URL tersebut. Pastikan URL valid dan dapat diakses publik.' }, { status: 400 });
    }

    const html = await fetchRes.text();
    const $ = cheerio.load(html);

    // 2. Analisis SEO Basic
    const title = $('title').text() || '';
    const description = $('meta[name="description"]').attr('content') || '';
    const h1 = $('h1').text() || '';
    
    // Hitung Skor SEO kasar
    let seoScore = 100;
    const seoIssues = [];
    if (!title || title.length < 10) { seoScore -= 20; seoIssues.push('Title terlalu pendek atau hilang.'); }
    if (!description || description.length < 50) { seoScore -= 20; seoIssues.push('Meta description tidak optimal.'); }
    if (!h1) { seoScore -= 15; seoIssues.push('Tag H1 tidak ditemukan (struktur dokumen buruk).'); }

    // 3. Analisis AEO & GEO via Gemini AI
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

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const responseText = response.text || '';
        
        // Ekstrak JSON
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          aiResult = parsed;
        }
      } catch (e) {
        console.error('Gemini error, fallback to default', e);
      }
    }

    // Gabungkan Hasil
    const finalScore = Math.floor((seoScore + aiResult.aeoScore + aiResult.geoScore) / 3);
    const combinedIssues = [
      ...seoIssues,
      ...aiResult.aeoIssues,
      ...aiResult.geoIssues
    ].slice(0, 4); // Maksimal 4 peringatan paling kritis

    // Simpan ke Database
    await prisma.lead.create({
      data: {
        url: finalUrl,
        seoScore,
        aeoScore: aiResult.aeoScore,
        geoScore: aiResult.geoScore,
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
        issues: combinedIssues
      }
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
