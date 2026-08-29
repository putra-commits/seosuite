import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUrl, safeFetchUrl } from '@/lib/security';

interface LinkResult {
  url: string;
  status: number;
  type: 'internal' | 'external';
  anchor: string;
  source: string;
  toxic: boolean;
  reason?: string;
}

const TOXIC_PATTERNS = [
  /\b(casino|gambling|poker|slot|betting|viagra|cialis|porn|xxx|pharma)\b/i,
  /\.(ru|cn|tk|ml|ga|cf|gq|pw|top|xyz)\//i,
  /free-?(?:download|movie|software|crack|keygen)/i,
  /buy-?(?:cheap|discount|online)/i,
];

function isToxicDomain(url: string): { toxic: boolean; reason?: string } {
  for (const p of TOXIC_PATTERNS) {
    if (p.test(url)) return { toxic: true, reason: `Matches pattern: ${p.source.substring(0, 30)}` };
  }
  return { toxic: false };
}

async function checkLink(url: string, timeout = 8000): Promise<{ status: number; ok: boolean }> {
  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), timeout);
    const res = await safeFetchUrl(url, { method: 'HEAD', signal: controller.signal }, timeout);
    clearTimeout(tid);
    if (!res) return { status: 0, ok: false };
    return { status: res.status, ok: res.ok };
  } catch {
    return { status: 0, ok: false };
  }
}

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get('url');
  if (!targetUrl) return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });

  const validation = validateAndSanitizeUrl(targetUrl);
  if (!validation.valid || !validation.sanitizedUrl) {
    return NextResponse.json({ error: validation.error || 'URL tidak valid' }, { status: 400 });
  }
  const safeUrl = validation.sanitizedUrl;

  try {
    // Fetch the page HTML
    const pageRes = await safeFetchUrl(safeUrl, { headers: { 'User-Agent': 'SEOsuite/3.0 Bot' } });
    if (!pageRes) return NextResponse.json({ error: 'URL tidak dapat diakses atau diblokir demi keamanan' }, { status: 400 });
    const html = await pageRes.text();

    // Extract all <a> tags
    const linkRegex = /<a\s+[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
    const baseUrl = new URL(targetUrl);
    const links: { href: string; anchor: string; type: 'internal' | 'external' }[] = [];
    let match;

    while ((match = linkRegex.exec(html)) !== null) {
      const href = match[1].trim();
      const anchor = match[2].replace(/<[^>]+>/g, '').trim().substring(0, 80);
      if (!href || href.startsWith('javascript:') || href.startsWith('mailto:')) continue;

      let fullUrl: string;
      try {
        fullUrl = new URL(href, targetUrl).toString();
      } catch { continue; }

      const isInternal = new URL(fullUrl).hostname === baseUrl.hostname;
      links.push({ href: fullUrl, anchor, type: isInternal ? 'internal' : 'external' });
    }

    // Deduplicate
    const unique = [...new Map(links.map(l => [l.href, l])).values()];

    // Check links (limit to 50 for speed)
    const toCheck = unique.slice(0, 50);
    const results: LinkResult[] = [];

    const checks = await Promise.allSettled(
      toCheck.map(async l => {
        const { status } = await checkLink(l.href);
        const toxicCheck = l.type === 'external' ? isToxicDomain(l.href) : { toxic: false };
        return {
          url: l.href,
          status,
          type: l.type,
          anchor: l.anchor,
          source: targetUrl,
          toxic: toxicCheck.toxic,
          reason: toxicCheck.reason,
        } as LinkResult;
      })
    );

    for (const c of checks) {
      if (c.status === 'fulfilled') results.push(c.value);
    }

    const internal = results.filter(r => r.type === 'internal');
    const external = results.filter(r => r.type === 'external');
    const broken = results.filter(r => r.status === 0 || r.status >= 400);
    const toxic = results.filter(r => r.toxic);
    const healthy = external.filter(r => !r.toxic && r.status >= 200 && r.status < 400);

    return NextResponse.json({
      stats: {
        totalLinks: unique.length,
        checked: results.length,
        internal: internal.length,
        external: external.length,
        broken: broken.length,
        toxic: toxic.length,
        healthy: healthy.length,
      },
      broken,
      toxic,
      healthy: healthy.slice(0, 20),
      internal: internal.slice(0, 30),
    });
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch: ${(e as Error).message}` }, { status: 500 });
  }
}
