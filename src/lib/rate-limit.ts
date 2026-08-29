/**
 * rate-limit.ts — Pembatas laju in-memory per IP.
 * Catatan: per-proses. Di PM2 cluster tiap worker punya hitungan sendiri,
 * jadi batas efektif = limit x jumlah worker. Cukup untuk menahan
 * penyalahgunaan kasar; pindahkan ke Redis kalau butuh presisi.
 */

const hits = new Map<string, number[]>();

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSec: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { allowed: false, retryAfterSec: Math.ceil((windowMs - (now - recent[0])) / 1000) };
  }

  recent.push(now);
  hits.set(key, recent);

  // Bersihkan entri mati sesekali supaya Map tidak tumbuh tanpa batas.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (v.every(t => now - t >= windowMs)) hits.delete(k);
    }
  }

  return { allowed: true, retryAfterSec: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for') || '';
  return fwd.split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}
