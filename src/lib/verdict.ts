/**
 * verdict.ts — Verdict naratif dari Claude untuk hasil audit unified.
 *
 * Dipanggil sekali saat audit dijalankan lalu disimpan bersama laporan,
 * bukan tiap kali halaman laporan dibuka — satu laporan yang di-share ke
 * grup WhatsApp bisa dibuka puluhan kali untuk teks yang sama.
 *
 * Gagal = kembalikan null. Verdict adalah pemanis, bukan syarat: audit
 * tetap sah tanpa dia, jadi jangan pernah menggagalkan audit karenanya.
 */

import { CalculatedAudit } from './scoring';

const MODEL = process.env.VERDICT_MODEL || 'claude-haiku-4-5-20251001';

export async function generateVerdict(
  url: string,
  audit: CalculatedAudit
): Promise<string | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const criticals = audit.modules
    .flatMap(m => (m.findings || []).map(f => ({ ...f, modul: m.title })))
    .filter(f => f.severity === 'critical' && !f.pass)
    .slice(0, 6)
    .map(f => `${f.modul}: ${f.title_id || f.id}`);

  const prompt = `Kamu konsultan SEO senior Indonesia. Berikan verdict singkat (2-3 kalimat) Bahasa Indonesia yang langsung dan tajam untuk pemilik bisnis — bukan untuk teknisi.

Domain: ${url}
Skor: ${audit.overallScore}/100 (grade ${audit.grade})
Masalah kritis: ${criticals.join('; ') || 'Tidak ada'}
Tiga prioritas: ${audit.top3Issues.map(i => i.title_id).join('; ') || '-'}

Sebut dampaknya ke calon pelanggan yang hilang, lalu 1-2 tindakan prioritas. Tanpa basa-basi, tanpa jargon teknis, tanpa menyebut dirimu AI.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      console.error('Verdict API gagal:', res.status);
      return null;
    }

    const data = await res.json();
    return data?.content?.[0]?.text?.trim() || null;
  } catch (err) {
    console.error('Verdict error:', err);
    return null;
  }
}
