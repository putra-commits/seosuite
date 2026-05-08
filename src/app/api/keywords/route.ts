import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const seed = req.nextUrl.searchParams.get('q');
  if (!seed) return NextResponse.json({ error: 'Missing q param' }, { status: 400 });

  try {
    // Google Autocomplete API
    const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=id&gl=id&q=${encodeURIComponent(seed)}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'SEOsuite/3.0' } });
    const data = await res.json();
    const suggestions: string[] = data[1] || [];

    // Expand with modifiers
    const modifiers = ['cara', 'tips', 'apa itu', 'terbaru', 'harga', 'review', 'manfaat', 'dampak'];
    const expanded: string[] = [];
    
    const expandPromises = modifiers.slice(0, 4).map(async mod => {
      try {
        const mUrl = `https://suggestqueries.google.com/complete/search?client=firefox&hl=id&gl=id&q=${encodeURIComponent(`${seed} ${mod}`)}`;
        const mRes = await fetch(mUrl, { headers: { 'User-Agent': 'SEOsuite/3.0' } });
        const mData = await mRes.json();
        return (mData[1] || []) as string[];
      } catch { return []; }
    });

    const results = await Promise.allSettled(expandPromises);
    for (const r of results) {
      if (r.status === 'fulfilled') expanded.push(...r.value);
    }

    // Deduplicate
    const all = [...new Set([...suggestions, ...expanded])].filter(s => s.toLowerCase() !== seed.toLowerCase());

    // Score by length & relevance
    const keywords = all.map(kw => {
      let score = 50;
      if (kw.includes(seed)) score += 20;
      if (kw.split(' ').length >= 3) score += 15; // long-tail bonus
      if (kw.split(' ').length >= 5) score += 10;
      if (/\d{4}/.test(kw)) score += 5; // year = timely
      return { keyword: kw, score: Math.min(100, score), words: kw.split(' ').length };
    }).sort((a, b) => b.score - a.score);

    return NextResponse.json({
      seed,
      total: keywords.length,
      keywords,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
