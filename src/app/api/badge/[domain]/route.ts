import { NextRequest, NextResponse } from 'next/server';
import { getLatestAuditForDomain, saveAudit } from '@/lib/audit-store';

// Audit cepat untuk badge — gunakan origin dari request agar tidak hardcode
async function quickAudit(domain: string, origin: string): Promise<number> {
  try {
    const base = `https://${domain}`;
    const res = await fetch(`${origin}/api/audit?url=${encodeURIComponent(base)}`, {
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.score || 0;
  } catch {
    return 0;
  }
}

function buildSvg(domain: string, score: number): string {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444';
  const label = score >= 80 ? 'GREAT' : score >= 60 ? 'FAIR' : 'NEEDS WORK';
  const domainShort = domain.length > 20 ? domain.slice(0, 18) + '…' : domain;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="28" viewBox="0 0 220 28" role="img" aria-label="SEO Score: ${score}/100">
  <title>SEO Score: ${score}/100 — ${label}</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#18181b"/>
      <stop offset="100%" stop-color="#27272a"/>
    </linearGradient>
  </defs>
  <rect width="220" height="28" rx="6" fill="url(#bg)"/>
  <rect x="0" y="0" width="3" height="28" rx="3" fill="${color}"/>
  <text x="11" y="18" font-family="system-ui,sans-serif" font-size="10" font-weight="700" fill="#a1a1aa">SEO</text>
  <text x="31" y="18" font-family="system-ui,sans-serif" font-size="10" fill="#71717a">${domainShort}</text>
  <rect x="150" y="5" width="64" height="18" rx="4" fill="${color}22"/>
  <text x="182" y="17.5" font-family="system-ui,sans-serif" font-size="11" font-weight="900" fill="${color}" text-anchor="middle">${score}/100</text>
</svg>`;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params;
  const origin = req.nextUrl.origin;

  // Cek cache dulu
  let cached = await getLatestAuditForDomain(domain);
  let score: number;

  if (cached) {
    score = cached.score;
  } else {
    score = await quickAudit(domain, origin);
    // Simpan ke store untuk cache
    if (score > 0) {
      await saveAudit({
        url: `https://${domain}`,
        score,
        sections: [],
        timestamp: new Date().toISOString(),
      });
    }
  }

  const svg = buildSvg(domain, score);

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=21600', // 6 jam
      'Access-Control-Allow-Origin': '*',
    },
  });
}
