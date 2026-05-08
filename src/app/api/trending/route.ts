import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Google Trends Daily Trends RSS → JSON via unofficial endpoint
    const url = 'https://trends.google.com/trending/rss?geo=ID';
    const res = await fetch(url, { headers: { 'User-Agent': 'SEOsuite/3.0' } });
    const xml = await res.text();

    // Parse RSS items
    const items: { title: string; traffic: string; link: string; pubDate: string; description: string }[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const block = match[1];
      const get = (tag: string) => {
        const m = block.match(new RegExp(`<${tag}><!\\[CDATA\\[(.+?)\\]\\]><\\/${tag}>|<${tag}>(.+?)<\\/${tag}>`));
        return m ? (m[1] || m[2] || '').trim() : '';
      };
      const traffic = (() => {
        const m = block.match(/<ht:approx_traffic>([^<]+)<\/ht:approx_traffic>/);
        return m ? m[1].trim() : '';
      })();

      items.push({
        title: get('title'),
        traffic,
        link: get('link'),
        pubDate: get('pubDate'),
        description: get('description').replace(/<[^>]+>/g, '').substring(0, 200),
      });
    }

    // Also get Google Trends "realtime" via suggest
    const realtimeKeywords = [
      'berita hari ini', 'trending Indonesia', 'viral hari ini',
    ];
    const suggests: string[] = [];
    for (const seed of realtimeKeywords.slice(0, 2)) {
      try {
        const sUrl = `https://suggestqueries.google.com/complete/search?client=firefox&hl=id&gl=id&q=${encodeURIComponent(seed)}`;
        const sRes = await fetch(sUrl, { headers: { 'User-Agent': 'SEOsuite/3.0' } });
        const sData = await sRes.json();
        suggests.push(...(sData[1] || []));
      } catch { /* skip */ }
    }

    return NextResponse.json({
      trends: items.slice(0, 20),
      realtime: [...new Set(suggests)].slice(0, 15),
      geo: 'ID',
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
