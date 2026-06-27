import { NextRequest, NextResponse } from 'next/server';
import { saveAudit } from '@/lib/audit-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, score, sections, timestamp, verdict } = body;
    if (!url || score === undefined || !sections) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
    const uuid = await saveAudit({ url, score, sections, timestamp: timestamp || new Date().toISOString(), verdict });
    return NextResponse.json({ uuid });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
