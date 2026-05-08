import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase-admin';

// ─── Disease Patterns ──────────────────────────────────────────
const STALE_DATA = [
  /\b(data|statistik|survei|riset|laporan|GDP|PDB|pertumbuhan)\b.*?\b(2024|2023|2022|2021|2020)\b/gi,
  /\bQ[1-4]\s*2024\b/gi, /\bkuartal\s+\w+\s+2024\b/gi, /\bBPS\s+202[0-4]\b/gi,
  /\btahun\s+202[0-4]\b.*?\b(menunjukkan|mencatat|melaporkan)\b/gi,
];
const WRONG_MINISTERS = [
  /\bSri Mulyani\b.*?\b(Menteri|Menkeu)\b/gi, /\b(Menteri|Menkeu)\b.*?\bSri Mulyani\b/gi,
  /\bNadiem Makarim\b.*?\b(Menteri|Mendikbud)\b/gi, /\b(Menteri|Mendikbud)\b.*?\bNadiem Makarim\b/gi,
  /\bErick Thohir\b.*?\b(Menteri|Men\s*BUMN)\b/gi, /\b(Menteri|Men\s*BUMN)\b.*?\bErick Thohir\b/gi,
  /\bLuhut\b.*?\b(Menteri|Menko)\b/gi, /\b(Menteri|Menko)\b.*?\bLuhut\b/gi,
];
const VAGUE_ATTR = [
  /dalam berbagai kesempatan\s+(selalu\s+)?menekankan/gi, /pernah menyatakan/gi,
  /kerap menyuarakan/gi, /selalu menekankan pentingnya/gi, /berkali-kali menegaskan/gi,
];
const FAKE_QUOTES = [/[""\u201C\u201D]([^""\u201C\u201D]{20,200})[""\u201C\u201D]\s*,?\s*(kata|ujar|ungkap|tutur|tegas|jelas)\s/gi];
const SELF_PROMO = [/\bUNMAHA\b/gi, /\bLSAF GLOBAL\b/gi, /\bAgenc1st\b/gi, /\bpmb\.unmaha/gi];

interface Finding { type: string; severity: 'CRITICAL' | 'WARNING' | 'INFO'; }

function auditContent(content: string): Finding[] {
  const f: Finding[] = [];
  const scan = (patterns: RegExp[], type: string, sev: Finding['severity']) => {
    for (const p of patterns) {
      p.lastIndex = 0;
      let m;
      while ((m = p.exec(content)) !== null) f.push({ type, severity: sev });
    }
  };
  scan(STALE_DATA, 'STALE', 'CRITICAL');
  scan(WRONG_MINISTERS, 'MINISTER', 'CRITICAL');
  scan(VAGUE_ATTR, 'VAGUE', 'WARNING');
  scan(FAKE_QUOTES, 'QUOTE', 'WARNING');
  let promo = 0;
  for (const p of SELF_PROMO) { p.lastIndex = 0; let m; while ((m = p.exec(content)) !== null) promo++; }
  if (promo > 5) f.push({ type: 'PROMO', severity: 'INFO' });
  return f;
}

export async function GET(req: NextRequest) {
  const limit = parseInt(req.nextUrl.searchParams.get('limit') || '100');
  const fetchAll = limit === 0;

  const db = getDb();
  const CUTOFF = new Date('2025-01-01T00:00:00Z');

  // Paginated fetch
  const allDocs: FirebaseFirestore.QueryDocumentSnapshot[] = [];
  let lastDoc: FirebaseFirestore.QueryDocumentSnapshot | undefined;
  let reachedCutoff = false;

  while (!reachedCutoff) {
    let q = db.collection('articles').orderBy('createdAt', 'desc').limit(500);
    if (lastDoc) q = q.startAfter(lastDoc);
    const snap = await q.get();
    if (snap.empty) break;
    for (const doc of snap.docs) {
      const ca = doc.data().createdAt?.toDate?.();
      if (ca && ca < CUTOFF) { reachedCutoff = true; break; }
      allDocs.push(doc);
    }
    lastDoc = snap.docs[snap.docs.length - 1];
    if (!fetchAll && allDocs.length >= limit * 2) break;
  }

  const published = allDocs.filter(d => d.data().status === 'published').slice(0, fetchAll ? Infinity : limit);

  let critical = 0, review = 0, pass = 0;
  const diseaseMap: Record<string, number> = {};
  const articles: { id: string; title: string; score: number; verdict: string; findings: string[] }[] = [];

  for (const doc of published) {
    const d = doc.data();
    const findings = auditContent(d.content || '');
    let score = 100;
    for (const f of findings) score -= f.severity === 'CRITICAL' ? 25 : f.severity === 'WARNING' ? 10 : 3;
    score = Math.max(0, score);
    for (const f of findings) diseaseMap[f.type] = (diseaseMap[f.type] || 0) + 1;

    let verdict = 'PASS';
    if (score < 50 || findings.some(f => f.severity === 'CRITICAL')) { verdict = 'CRITICAL'; critical++; }
    else if (score < 80) { verdict = 'REVIEW'; review++; }
    else pass++;

    articles.push({
      id: doc.id,
      title: d.title || '(no title)',
      score,
      verdict,
      findings: findings.map(f => f.type),
    });
  }

  articles.sort((a, b) => a.score - b.score);

  const labels: Record<string, string> = {
    STALE: 'Data Basi', MINISTER: 'Pejabat Lama', VAGUE: 'Atribusi Samar',
    QUOTE: 'Kutipan Fabricated', PROMO: 'Self-Promo',
  };
  const diseases = Object.entries(diseaseMap)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => ({ key: k, label: labels[k] || k, count: v }));

  return NextResponse.json({
    stats: { total: published.length, critical, review, pass },
    diseases,
    articles,
  });
}
