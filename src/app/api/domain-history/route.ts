import { NextRequest, NextResponse } from 'next/server';
import { getDomainHistory } from '@/lib/audit-store';

export async function GET(req: NextRequest) {
  const domain = req.nextUrl.searchParams.get('domain');
  if (!domain) return NextResponse.json({ error: 'Missing domain' }, { status: 400 });
  const history = await getDomainHistory(domain);
  return NextResponse.json({ history });
}
