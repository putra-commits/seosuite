/**
 * admin-auth.ts — Gate sederhana untuk endpoint & halaman admin.
 * Token diambil dari env ADMIN_TOKEN (Doppler, bukan .env yang di-commit).
 */

import { NextRequest } from 'next/server';
import { timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE = 'seosuite_admin';

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * Mengembalikan true kalau request membawa token admin yang benar.
 * Kalau ADMIN_TOKEN belum diset, SEMUA request ditolak — fail closed,
 * supaya deploy tanpa secret tidak diam-diam membuka database lead.
 */
export function isAdminRequest(req: NextRequest): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return false;

  const header = req.headers.get('authorization') || '';
  const bearer = header.startsWith('Bearer ') ? header.slice(7) : '';
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value || '';

  return (bearer !== '' && safeEqual(bearer, expected))
    || (cookie !== '' && safeEqual(cookie, expected));
}
