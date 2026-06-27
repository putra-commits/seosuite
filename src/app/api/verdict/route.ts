import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ verdict: null, error: 'ANTHROPIC_API_KEY not set' }, { status: 200 });
  }

  try {
    const { url, score, sections } = await req.json();

    // Ringkas issues untuk prompt
    const criticals: string[] = [];
    const warns: string[] = [];
    for (const section of sections || []) {
      for (const r of section.results || []) {
        if (!r.pass && r.severity === 'critical') criticals.push(`${section.title}: ${r.label}`);
        else if (!r.pass && r.severity === 'warn') warns.push(`${r.label}`);
      }
    }

    const prompt = `Kamu adalah konsultan SEO senior Indonesia. Analisis hasil audit SEO berikut dan berikan verdict singkat (2-3 kalimat) dalam Bahasa Indonesia yang langsung dan tajam.

Domain: ${url}
Score: ${score}/100
Masalah Kritis (${criticals.length}): ${criticals.slice(0, 5).join(', ') || 'Tidak ada'}
Peringatan (${warns.length}): ${warns.slice(0, 5).join(', ') || 'Tidak ada'}

Berikan estimasi kasar berapa % traffic yang hilang akibat masalah ini, dan 1-2 tindakan prioritas. Tone: to the point, tidak basa-basi. Contoh: "Website ini kehilangan sekitar 30-40% potensi traffic karena X dan Y. Prioritas: perbaiki Z segera."`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json({ verdict: null }, { status: 200 });
    }

    const data = await res.json();
    const verdict = data?.content?.[0]?.text?.trim() || null;
    return NextResponse.json({ verdict });
  } catch {
    return NextResponse.json({ verdict: null }, { status: 200 });
  }
}
