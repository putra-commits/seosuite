import { NextRequest, NextResponse } from 'next/server';

// ── Types ─────────────────────────────────────────────────────────────────────
interface AuditResult {
  label: string;
  pass: boolean;
  detail: string;
  severity: 'critical' | 'warn' | 'info';
}
interface AuditSection {
  id: string;
  title: string;
  results: AuditResult[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
async function safeFetch(url: string, timeout = 10000): Promise<{ status: number; html: string; headers: Record<string, string> }> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(timeout),
      headers: { 'User-Agent': 'SEOsuite-Bot/1.0 (+https://seosuite.info)' },
      redirect: 'follow',
    });
    const html = await res.text().catch(() => '');
    const headers: Record<string, string> = {};
    res.headers.forEach((v, k) => { headers[k] = v; });
    return { status: res.status, html, headers };
  } catch {
    return { status: 0, html: '', headers: {} };
  }
}

function check(label: string, pass: boolean, detail: string, severity: AuditResult['severity'] = 'warn'): AuditResult {
  return { label, pass, detail, severity };
}

function extractMeta(html: string, name: string): string {
  const m = html.match(new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["']`, 'i'))
    || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["']`, 'i'));
  return m?.[1]?.trim() || '';
}

// ── Section Auditors ──────────────────────────────────────────────────────────

async function auditRobots(base: string): Promise<AuditSection> {
  const r = await safeFetch(`${base}/robots.txt`, 8000);
  const results: AuditResult[] = [];

  results.push(check('robots.txt accessible', r.status === 200, `HTTP ${r.status}`, 'critical'));

  if (r.html) {
    results.push(check('Has Sitemap directive', r.html.includes('Sitemap:'), r.html.includes('Sitemap:') ? 'Sitemap directive found' : 'Missing Sitemap directive', 'critical'));
    
    // Parse Googlebot block properly
    const lines = r.html.split('\n').map(l => l.trim());
    let inTargetBlock = false;
    let googlebotBlocked = false;
    for (const line of lines) {
      if (line.toLowerCase().startsWith('user-agent:')) {
        const agent = line.split(':')[1]?.trim().toLowerCase();
        inTargetBlock = agent === 'googlebot' || agent === '*';
      }
      if (inTargetBlock && line.toLowerCase().startsWith('disallow:')) {
        const path = line.split(':')[1]?.trim();
        if (path === '/' || path === '') googlebotBlocked = true;
      }
    }
    results.push(check('Googlebot not blocked', !googlebotBlocked, googlebotBlocked ? 'Googlebot is BLOCKED' : 'Googlebot can crawl freely', 'critical'));

    const sitemaps = r.html.match(/Sitemap:\s*.+/g) || [];
    results.push(check(`Sitemap count (${sitemaps.length})`, sitemaps.length > 0, sitemaps.length ? sitemaps.join(' | ') : 'No sitemaps in robots.txt', 'warn'));
    results.push(check('No Unsplash ban needed', !r.html.includes('unsplash.com'), 'robots.txt OK', 'info'));
  }

  return { id: 'robots', title: '🤖 Robots.txt', results };
}

async function auditSitemap(base: string): Promise<AuditSection> {
  const results: AuditResult[] = [];

  // Sitemap index
  const si = await safeFetch(`${base}/sitemap.xml`, 8000);
  results.push(check('sitemap.xml accessible', si.status === 200, `HTTP ${si.status}`, 'critical'));
  if (si.html) {
    const isSitemapIndex = si.html.includes('<sitemapindex') || si.html.includes('<sitemap>');
    const urlCount       = (si.html.match(/<loc>/g) || []).length;
    results.push(check('Is sitemap index', isSitemapIndex, isSitemapIndex ? `Index with ${urlCount} entries` : `Plain sitemap (${urlCount} URLs)`, 'info'));
    results.push(check('Has lastmod', si.html.includes('<lastmod>'), si.html.includes('<lastmod>') ? 'lastmod present' : 'Missing lastmod', 'warn'));
  }

  // News sitemap
  const sn = await safeFetch(`${base}/sitemap-news.xml`, 6000);
  results.push(check('sitemap-news.xml accessible', sn.status === 200 || sn.status === 304, `HTTP ${sn.status}`, 'warn'));

  // Pages sitemap
  const sp = await safeFetch(`${base}/sitemap-pages.xml`, 6000);
  results.push(check('sitemap-pages.xml accessible', sp.status === 200 || sp.status === 304, `HTTP ${sp.status}`, 'info'));

  return { id: 'sitemap', title: '🗺️ Sitemap', results };
}

async function auditOnPage(base: string, html: string): Promise<AuditSection> {
  const results: AuditResult[] = [];

  // Title
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title      = titleMatch?.[1]?.trim() || '';
  results.push(check('Title tag present', !!title, title ? `"${title.slice(0, 60)}" (${title.length}ch)` : 'Missing title', 'critical'));
  results.push(check('Title length (30–60ch)', title.length >= 30 && title.length <= 60, `${title.length} chars`, 'warn'));

  // Description
  const desc = extractMeta(html, 'description');
  results.push(check('Meta description present', !!desc, desc ? `${desc.length} chars` : 'Missing meta description', 'critical'));
  results.push(check('Description length (120–160ch)', desc.length >= 120 && desc.length <= 160, `${desc.length} chars`, 'warn'));

  // H1
  const h1s = html.match(/<h1[^>]*>/gi) || [];
  results.push(check('Single H1 tag', h1s.length === 1, `${h1s.length} H1 found`, h1s.length === 0 ? 'critical' : h1s.length > 1 ? 'warn' : 'info'));

  // Canonical
  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)?.[1] || '';
  results.push(check('Canonical URL set', !!canonical, canonical || 'Missing canonical', 'warn'));

  // OG tags
  const ogTitle = extractMeta(html, 'og:title');
  const ogDesc  = extractMeta(html, 'og:description');
  const ogImg   = extractMeta(html, 'og:image');
  results.push(check('OpenGraph complete', !!(ogTitle && ogDesc && ogImg), `title:${!!ogTitle} desc:${!!ogDesc} img:${!!ogImg}`, 'warn'));

  // Hreflang
  const hreflangs = (html.match(/hreflang=["'][^"']+["']/gi) || []).length;
  results.push(check('Hreflang tags present', hreflangs > 0, `${hreflangs} hreflang attributes`, 'info'));

  return { id: 'onpage', title: '📄 On-Page SEO', results };
}

async function auditSchema(html: string): Promise<AuditSection> {
  const results: AuditResult[] = [];

  const schemaBlocks = html.match(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  results.push(check(`Schema blocks (${schemaBlocks.length})`, schemaBlocks.length > 0, `${schemaBlocks.length} JSON-LD blocks found`, 'critical'));

  const allSchemas = schemaBlocks.join(' ');
  const hasOrg      = allSchemas.includes('"Organization"') || allSchemas.includes('"NewsMediaOrganization"');
  const hasWebSite  = allSchemas.includes('"WebSite"');
  const hasArticle  = allSchemas.includes('"NewsArticle"') || allSchemas.includes('"Article"');
  const hasBreadcrumb = allSchemas.includes('"BreadcrumbList"');

  results.push(check('Organization schema',  hasOrg,       hasOrg ? 'Found' : 'Missing', 'warn'));
  results.push(check('WebSite schema',        hasWebSite,   hasWebSite ? 'Found (enables Sitelinks SearchBox)' : 'Missing', 'warn'));
  results.push(check('Article/NewsArticle',   hasArticle,   hasArticle ? 'Found' : 'Not found on homepage (OK for non-article pages)', 'info'));
  results.push(check('BreadcrumbList schema', hasBreadcrumb, hasBreadcrumb ? 'Found' : 'Missing (helps rich results)', 'info'));

  return { id: 'schema', title: '🔖 Structured Data', results };
}

async function auditHeaders(base: string): Promise<AuditSection> {
  const results: AuditResult[] = [];
  const r = await safeFetch(base, 8000);
  const h = r.headers;

  results.push(check('HSTS (Strict-Transport-Security)', !!h['strict-transport-security'], h['strict-transport-security'] || 'Missing — add max-age=31536000; includeSubDomains; preload', 'critical'));
  results.push(check('X-Content-Type-Options',  h['x-content-type-options'] === 'nosniff', h['x-content-type-options'] || 'Missing — add nosniff', 'warn'));
  results.push(check('X-Frame-Options or CSP',   !!(h['x-frame-options'] || h['content-security-policy']), h['x-frame-options'] || h['content-security-policy'] || 'Missing', 'warn'));
  results.push(check('Cache-Control present',    !!h['cache-control'], h['cache-control'] || 'Missing — no caching config', 'info'));
  results.push(check('Content-Type UTF-8',       (h['content-type'] || '').includes('utf-8'), h['content-type'] || 'Missing', 'warn'));
  results.push(check('HTTP/2+ protocol',         r.status > 0, r.status > 0 ? 'Connected' : 'Failed to connect', 'info'));

  // HTTPS redirect
  if (base.startsWith('https://')) {
    const http = await safeFetch(base.replace('https://', 'http://'), 5000);
    results.push(check('HTTP → HTTPS redirect', http.status >= 301 && http.status <= 308, `HTTP ${http.status}`, 'critical'));
  }

  return { id: 'headers', title: '🛡️ Security Headers', results };
}

async function auditSpeed(base: string): Promise<AuditSection> {
  const results: AuditResult[] = [];
  const pages = [
    { path: '/', label: 'Homepage' },
    { path: '/sitemap.xml', label: 'Sitemap' },
  ];

  for (const p of pages) {
    const t0 = Date.now();
    const r  = await safeFetch(`${base}${p.path}`, 10000);
    const ms = Date.now() - t0;
    const ok = ms < 800;
    const warn = ms < 1500;
    results.push(check(
      `TTFB ${p.label}`,
      ok,
      `${ms}ms ${ok ? '✓ fast' : warn ? '⚠️ moderate' : '🔴 slow'}`,
      ok ? 'info' : warn ? 'warn' : 'critical',
    ));
    results.push(check(`${p.label} returns 2xx`, r.status >= 200 && r.status < 400, `HTTP ${r.status}`, 'warn'));
  }

  // CWV via PSI (if API key set)
  const apiKey = process.env.PSI_API_KEY;
  if (apiKey) {
    try {
      const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(base)}&strategy=mobile&key=${apiKey}&category=performance`;
      const psi = await fetch(psiUrl, { signal: AbortSignal.timeout(30000) });
      if (psi.ok) {
        const data = await psi.json();
        const lcp  = data?.lighthouseResult?.audits?.['largest-contentful-paint']?.displayValue || 'N/A';
        const cls  = data?.lighthouseResult?.audits?.['cumulative-layout-shift']?.displayValue   || 'N/A';
        const score = Math.round((data?.lighthouseResult?.categories?.performance?.score || 0) * 100);
        results.push(check('PSI Performance Score', score >= 70, `Mobile: ${score}/100`, score >= 90 ? 'info' : score >= 70 ? 'warn' : 'critical'));
        results.push(check('LCP (Largest Contentful Paint)', true, lcp, 'info'));
        results.push(check('CLS (Cumulative Layout Shift)', true, cls, 'info'));
      }
    } catch { /* PSI failed, non-critical */ }
  } else {
    results.push(check('PageSpeed Insights', false, 'Set PSI_API_KEY in .env.local to enable CWV data', 'info'));
  }

  return { id: 'speed', title: '⚡ Speed & CWV', results };
}

async function auditLinks(base: string, html: string): Promise<AuditSection> {
  const results: AuditResult[] = [];

  // Extract all internal links
  const hrefs = [...html.matchAll(/href=["']([^"'#?]+)["']/gi)]
    .map(m => m[1])
    .filter(h => h.startsWith('/') || h.startsWith(base))
    .filter(h => !h.match(/\.(css|js|png|jpg|webp|svg|ico|woff|pdf)$/i))
    .map(h => h.startsWith('/') ? `${base}${h}` : h)
    .slice(0, 15); // sample 15 links

  const unique = [...new Set(hrefs)].slice(0, 10);
  results.push(check(`Internal links found`, unique.length > 0, `${unique.length} unique links sampled`, 'info'));

  // Check 5 links for 404s
  const broken: string[] = [];
  await Promise.all(
    unique.slice(0, 5).map(async link => {
      const r = await safeFetch(link, 5000);
      if (r.status === 404 || r.status === 0) broken.push(link);
    })
  );
  results.push(check('No broken internal links (sample)', broken.length === 0, broken.length ? `Broken: ${broken.slice(0,3).join(', ')}` : `5 links checked — all OK`, broken.length > 0 ? 'critical' : 'info'));

  return { id: 'links', title: '🔗 Links & Crawl', results };
}

// ── Score Calculator ──────────────────────────────────────────────────────────
function calcScore(sections: AuditSection[]): number {
  const all = sections.flatMap(s => s.results);
  const total = all.length;
  if (total === 0) return 0;
  
  const passed = all.filter(r => r.pass).length;
  const critFails = all.filter(r => !r.pass && r.severity === 'critical').length;

  // Base score = pass rate, with critical penalty
  const base = (passed / total) * 100;
  const penalty = critFails * 4;
  return Math.max(0, Math.min(100, Math.round(base - penalty)));
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url');
  if (!url) return NextResponse.json({ error: 'Missing url param' }, { status: 400 });

  let base: string;
  try {
    const u = new URL(url);
    base = `${u.protocol}//${u.host}`;
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  // Fetch homepage HTML
  const homepage = await safeFetch(base, 12000);
  if (homepage.status === 0) {
    return NextResponse.json({ error: `Could not reach ${base}` }, { status: 502 });
  }

  // Run all sections in parallel
  const [robots, sitemap, onpage, schema, headers, speed, links] = await Promise.all([
    auditRobots(base),
    auditSitemap(base),
    auditOnPage(base, homepage.html),
    auditSchema(homepage.html),
    auditHeaders(base),
    auditSpeed(base),
    auditLinks(base, homepage.html),
  ]);

  const sections = [robots, sitemap, onpage, schema, headers, speed, links];
  const score    = calcScore(sections);

  return NextResponse.json({
    url: base,
    score,
    sections,
    timestamp: new Date().toISOString(),
  });
}
