/**
 * /api/audit/route.ts — Unified SEO & Lead Engine API Endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUrl } from '@/lib/security';
import { runUnifiedAudit } from '@/lib/auditor';
import { saveAuditReport } from '@/lib/audit-store';
import { rateLimit, clientIp } from '@/lib/rate-limit';

const WINDOW_MS = 10 * 60 * 1000;

function throttled(req: NextRequest, limit: number) {
  const { allowed, retryAfterSec } = rateLimit(clientIp(req), limit, WINDOW_MS);
  if (allowed) return null;
  return NextResponse.json(
    { error: `Terlalu banyak permintaan audit. Coba lagi dalam ${retryAfterSec} detik.` },
    { status: 429, headers: { 'Retry-After': String(retryAfterSec) } }
  );
}

export async function POST(req: NextRequest) {
  const limited = throttled(req, 5);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { url, businessName, whatsapp, city, vertical } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL website wajib diisi' }, { status: 400 });
    }

    // 1. Validasi & Sanitasi URL (SSRF Protection)
    const validation = validateAndSanitizeUrl(url);
    if (!validation.valid || !validation.sanitizedUrl) {
      return NextResponse.json({ error: validation.error || 'URL tidak valid atau dilarang (SSRF Guard)' }, { status: 400 });
    }

    // 2. Jalankan Unified 5-Layer Audit
    const auditResult = await runUnifiedAudit(validation.sanitizedUrl);

    // 3. Simpan ke database laporan & lead store
    const savedRecord = await saveAuditReport({
      url: validation.sanitizedUrl,
      businessName,
      whatsapp,
      city,
      vertical,
      audit: auditResult.audit,
    });

    return NextResponse.json({
      success: true,
      slug: savedRecord.slug,
      id: savedRecord.id,
      reportUrl: `/laporan/${savedRecord.slug}`,
      record: savedRecord,
    });
  } catch (err: unknown) {
    console.error('Audit execution error:', err);
    return NextResponse.json(
      { error: 'Gagal menjalankan audit website. Pastikan domain aktif dan dapat diakses dari internet.' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const limited = throttled(req, 10);
  if (limited) return limited;

  const urlParam = req.nextUrl.searchParams.get('url');
  if (!urlParam) {
    return NextResponse.json({ error: 'Parameter url wajib disertakan' }, { status: 400 });
  }

  const validation = validateAndSanitizeUrl(urlParam);
  if (!validation.valid || !validation.sanitizedUrl) {
    return NextResponse.json({ error: validation.error || 'URL tidak valid' }, { status: 400 });
  }

  try {
    const auditResult = await runUnifiedAudit(validation.sanitizedUrl);
    return NextResponse.json({
      success: true,
      url: validation.sanitizedUrl,
      audit: auditResult.audit,
      timestamp: auditResult.timestamp,
    });
  } catch (err: unknown) {
    console.error('Quick audit error:', err);
    return NextResponse.json({ error: 'Gagal melakukan audit pada domain tersebut' }, { status: 500 });
  }
}
