import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUrl, safeFetchUrl } from '@/lib/security';

interface AeoCheck { item: string; pass: boolean; detail: string; type: 'AEO' | 'GEO'; }

export async function GET(req: NextRequest) {
  const targetUrl = req.nextUrl.searchParams.get('url');
  if (!targetUrl) return NextResponse.json({ error: 'Missing url param' }, { status: 400 });

  const validation = validateAndSanitizeUrl(targetUrl);
  if (!validation.valid || !validation.sanitizedUrl) {
    return NextResponse.json({ error: validation.error || 'URL tidak valid' }, { status: 400 });
  }
  const safeUrl = validation.sanitizedUrl;

  try {
    const res = await safeFetchUrl(safeUrl, { headers: { 'User-Agent': 'SEOsuite/3.0 Bot' } });
    if (!res) return NextResponse.json({ error: 'URL tidak dapat diakses atau diblokir demi keamanan' }, { status: 400 });
    const html = await res.text();
    const checks: AeoCheck[] = [];

    // ── AEO: Answer Engine Optimization ──
    const hasFAQ = /FAQPage|mainEntity.*Question/i.test(html);
    checks.push({ item: 'FAQ Schema (FAQPage)', pass: hasFAQ, detail: hasFAQ ? 'FAQPage schema detected — eligible for rich snippets' : 'No FAQPage schema — add FAQ structured data for featured snippets', type: 'AEO' });

    const hasHowTo = /HowTo|step.*itemListElement/i.test(html);
    checks.push({ item: 'HowTo Schema', pass: hasHowTo, detail: hasHowTo ? 'HowTo schema found — step-by-step format' : 'No HowTo schema — useful for tutorial content', type: 'AEO' });

    const hasQA = /QAPage|acceptedAnswer/i.test(html);
    checks.push({ item: 'Q&A Schema', pass: hasQA, detail: hasQA ? 'Q&A structured data found' : 'No Q&A schema — add for answer-focused content', type: 'AEO' });

    const questionHeadings = (html.match(/<h[2-4][^>]*>[^<]*(apa|bagaimana|mengapa|kenapa|how|what|why|when|where|who|kapan|dimana|siapa)[^<]*<\/h[2-4]>/gi) || []).length;
    checks.push({ item: 'Question-based headings', pass: questionHeadings >= 2, detail: `${questionHeadings} question headings found — ${questionHeadings >= 2 ? 'good for snippet targeting' : 'add more question-format H2/H3'}`, type: 'AEO' });

    // Check for concise answer paragraphs (40-60 words after headings)
    const shortParas = (html.match(/<p[^>]*>[^<]{100,300}<\/p>/g) || []).length;
    checks.push({ item: 'Concise answer paragraphs', pass: shortParas >= 3, detail: `${shortParas} concise paragraphs — ${shortParas >= 3 ? 'good snippet candidates' : 'add short direct-answer paragraphs'}`, type: 'AEO' });

    const hasTable = /<table/i.test(html);
    checks.push({ item: 'Data tables', pass: hasTable, detail: hasTable ? 'Tables found — eligible for table featured snippets' : 'No tables — add comparison/data tables where relevant', type: 'AEO' });

    const hasList = (html.match(/<[ou]l[^>]*>[\s\S]*?<\/[ou]l>/gi) || []).length >= 2;
    checks.push({ item: 'Ordered/Unordered lists', pass: hasList, detail: hasList ? 'Multiple lists found — good for list snippets' : 'Add structured lists for list-type featured snippets', type: 'AEO' });

    // ── GEO: Generative Engine Optimization ──
    const hasAuthor = /author|itemprop=["']author/i.test(html);
    checks.push({ item: 'Author attribution (E-E-A-T)', pass: hasAuthor, detail: hasAuthor ? 'Author information found — E-E-A-T signal' : 'No author attribution — critical for AI citation', type: 'GEO' });

    const hasDatePub = /datePublished|dateModified|article:published_time/i.test(html);
    checks.push({ item: 'Publication date', pass: hasDatePub, detail: hasDatePub ? 'Publication date in metadata' : 'No datePublished — AI engines favor fresh, dated content', type: 'GEO' });

    const hasArticleSchema = /NewsArticle|Article|BlogPosting/i.test(html);
    checks.push({ item: 'Article/NewsArticle schema', pass: hasArticleSchema, detail: hasArticleSchema ? 'Article schema present — crawlable by AI' : 'Add Article structured data for AI engine indexing', type: 'GEO' });

    const hasCitations = /cite|blockquote|data-source|rel=["']nofollow/i.test(html);
    checks.push({ item: 'Citations & sources', pass: hasCitations, detail: hasCitations ? 'Citations/sources detected — trust signal' : 'No citations — add source references for AI credibility', type: 'GEO' });

    const hasSpecificData = /\d+[%,.]?\d*\s*(persen|percent|juta|miliar|triliun|ribu|million|billion)/i.test(html);
    checks.push({ item: 'Specific data/statistics', pass: hasSpecificData, detail: hasSpecificData ? 'Statistical data found — citation-worthy' : 'No specific stats — add data points for AI citation', type: 'GEO' });

    const wordCount = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').split(' ').length;
    const goodLength = wordCount >= 800;
    checks.push({ item: 'Content depth (800+ words)', pass: goodLength, detail: `~${wordCount} words — ${goodLength ? 'sufficient depth for AI indexing' : 'thin content, expand for better AI coverage'}`, type: 'GEO' });

    const hasCanonical = /rel=["']canonical/i.test(html);
    checks.push({ item: 'Canonical tag', pass: hasCanonical, detail: hasCanonical ? 'Canonical URL set — prevents duplicate indexing' : 'No canonical — AI may index wrong version', type: 'GEO' });

    const hasAboutSchema = /AboutPage|description.*content/i.test(html);
    checks.push({ item: 'About/Description signals', pass: hasAboutSchema, detail: hasAboutSchema ? 'About/Description signals found' : 'Add clear about info for entity recognition', type: 'GEO' });

    const aeoChecks = checks.filter(c => c.type === 'AEO');
    const geoChecks = checks.filter(c => c.type === 'GEO');
    const aeoScore = Math.round((aeoChecks.filter(c => c.pass).length / aeoChecks.length) * 100);
    const geoScore = Math.round((geoChecks.filter(c => c.pass).length / geoChecks.length) * 100);

    return NextResponse.json({
      url: targetUrl,
      aeoScore,
      geoScore,
      overallScore: Math.round((aeoScore + geoScore) / 2),
      checks,
      summary: {
        aeo: { total: aeoChecks.length, passed: aeoChecks.filter(c => c.pass).length },
        geo: { total: geoChecks.length, passed: geoChecks.filter(c => c.pass).length },
      },
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
