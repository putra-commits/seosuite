import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUrl, safeFetchUrl } from '@/lib/security';

interface LocalCheck { item: string; pass: boolean; detail: string; category: string; }

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
    const checks: LocalCheck[] = [];

    // --- NAP (Name, Address, Phone) ---
    const hasAddress = /<address/i.test(html) || /itemprop=["']address/i.test(html);
    checks.push({ item: 'Address tag / itemprop', pass: hasAddress, detail: hasAddress ? 'Found structured address' : 'No <address> or itemprop="address" found', category: 'NAP' });

    const hasTel = /tel:|phone|itemprop=["']telephone/i.test(html);
    checks.push({ item: 'Phone number', pass: hasTel, detail: hasTel ? 'Phone contact detected' : 'No telephone link/itemprop found', category: 'NAP' });

    // --- Local Schema ---
    const hasLocalBiz = /LocalBusiness|Organization|NewsMediaOrganization/i.test(html);
    checks.push({ item: 'LocalBusiness/Organization schema', pass: hasLocalBiz, detail: hasLocalBiz ? 'Local business schema detected' : 'Missing LocalBusiness or Organization schema', category: 'Schema' });

    const hasGeo = /GeoCoordinates|latitude|longitude/i.test(html);
    checks.push({ item: 'GeoCoordinates', pass: hasGeo, detail: hasGeo ? 'Geo coordinates found in schema' : 'No GeoCoordinates in structured data', category: 'Schema' });

    const hasOpenHours = /openingHours|OpeningHoursSpecification/i.test(html);
    checks.push({ item: 'Opening Hours', pass: hasOpenHours, detail: hasOpenHours ? 'Opening hours specified' : 'No opening hours in schema', category: 'Schema' });

    const hasAreaServed = /areaServed|serviceArea/i.test(html);
    checks.push({ item: 'Service Area / Area Served', pass: hasAreaServed, detail: hasAreaServed ? 'Service area defined' : 'No areaServed in schema', category: 'Schema' });

    // --- GBP signals ---
    const hasGoogleMaps = /maps\.google|google\.com\/maps|goo\.gl\/maps/i.test(html);
    checks.push({ item: 'Google Maps embed/link', pass: hasGoogleMaps, detail: hasGoogleMaps ? 'Google Maps reference found' : 'No Google Maps link or embed', category: 'GBP' });

    // --- Local content signals ---
    const hasHreflang = /hreflang/i.test(html);
    checks.push({ item: 'Hreflang tag', pass: hasHreflang, detail: hasHreflang ? 'Hreflang for language targeting' : 'No hreflang tag for regional targeting', category: 'i18n' });

    const hasGeoMeta = /geo\.(region|placename|position)|ICBM/i.test(html);
    checks.push({ item: 'Geo meta tags', pass: hasGeoMeta, detail: hasGeoMeta ? 'Geo meta tags detected' : 'No geo.region/placename meta tags', category: 'i18n' });

    // --- Reviews ---
    const hasReview = /Review|AggregateRating|ratingValue/i.test(html);
    checks.push({ item: 'Review/Rating schema', pass: hasReview, detail: hasReview ? 'Review or rating schema found' : 'No review/rating structured data', category: 'Social Proof' });

    // --- Contact page ---
    const hasContact = /contact|hubungi|kontak/i.test(html);
    checks.push({ item: 'Contact page reference', pass: hasContact, detail: hasContact ? 'Contact references found' : 'No contact page or CTA', category: 'NAP' });

    const score = Math.round((checks.filter(c => c.pass).length / checks.length) * 100);

    return NextResponse.json({
      url: targetUrl,
      score,
      totalChecks: checks.length,
      passed: checks.filter(c => c.pass).length,
      failed: checks.filter(c => !c.pass).length,
      checks,
    });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
