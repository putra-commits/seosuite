import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  const { ids, reason } = await req.json() as { ids: string[]; reason: string };

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
  }

  const db = getDb();
  let done = 0;

  for (let i = 0; i < ids.length; i += 10) {
    const chunk = ids.slice(i, i + 10);
    const batch = db.batch();
    for (const id of chunk) {
      batch.update(db.collection('articles').doc(id), {
        status: 'draft',
        _auditNote: reason || 'Unpublished by SEO Suite',
        _auditDate: new Date().toISOString(),
      });
    }
    await batch.commit();
    done += chunk.length;
  }

  return NextResponse.json({ success: true, unpublished: done });
}
