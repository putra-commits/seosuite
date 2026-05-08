import { NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

function titleSimilarity(a: string, b: string): number {
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, '').split(' ').filter(w => w.length > 3);
  const sa = new Set(norm(a)), sb = new Set(norm(b));
  const inter = [...sa].filter(x => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union === 0 ? 0 : inter / union;
}

export async function GET() {
  const db = getDb();
  const CUTOFF = new Date('2025-01-01T00:00:00Z');

  const allDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined;
  let done = false;

  while (!done) {
    let q = db.collection('articles').orderBy('createdAt', 'desc').limit(500);
    if (lastDoc) q = q.startAfter(lastDoc);
    const snap = await q.get();
    if (snap.empty) break;
    for (const doc of snap.docs) {
      const ca = doc.data().createdAt?.toDate?.();
      if (ca && ca < CUTOFF) { done = true; break; }
      if (doc.data().status === 'published') allDocs.push(doc);
    }
    lastDoc = snap.docs[snap.docs.length - 1];
  }

  interface Art { id: string; title: string; keyword: string; len: number; }
  const articles: Art[] = allDocs.map(d => ({
    id: d.id,
    title: d.data().title || '',
    keyword: d.data().keyword || '',
    len: (d.data().content || '').replace(/<[^>]+>/g, '').length,
  }));

  const processed = new Set<string>();
  const groups: { keep: Art; drops: Art[] }[] = [];

  for (let i = 0; i < articles.length; i++) {
    if (processed.has(articles[i].id)) continue;
    const grp = [articles[i]];
    processed.add(articles[i].id);
    for (let j = i + 1; j < articles.length; j++) {
      if (processed.has(articles[j].id)) continue;
      if (articles[i].keyword !== articles[j].keyword) continue;
      if (titleSimilarity(articles[i].title, articles[j].title) > 0.5) {
        grp.push(articles[j]);
        processed.add(articles[j].id);
      }
    }
    if (grp.length > 1) {
      grp.sort((a, b) => b.len - a.len);
      groups.push({ keep: grp[0], drops: grp.slice(1) });
    }
  }

  const totalDuplicates = groups.reduce((a, g) => a + g.drops.length, 0);

  return NextResponse.json({
    stats: {
      totalScanned: articles.length,
      groupsFound: groups.length,
      duplicates: totalDuplicates,
      uniqueKept: articles.length - totalDuplicates,
    },
    groups: groups.slice(0, 50), // top 50 for UI
  });
}
