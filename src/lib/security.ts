/**
 * security.ts — SSRF Protection & URL Sanitization
 * Memastikan request audit aman dan tidak mengakses IP privat/internal server.
 */

const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d+\.\d+\.\d+$/,
  /^10\.\d+\.\d+\.\d+$/,
  /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/,
  /^192\.168\.\d+\.\d+$/,
  /^169\.254\.\d+\.\d+$/,
  /^0\.0\.0\.0$/,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i,
];

/** Normalisasi bentuk IPv4 non-desimal (oktal, heksadesimal, integer) ke dotted-quad. */
function normalizeIpv4(host: string): string | null {
  const asInt = /^(0x[0-9a-f]+|0[0-7]*|\d+)$/i.test(host) ? Number(host) : NaN;
  if (Number.isInteger(asInt) && asInt >= 0 && asInt <= 0xffffffff) {
    return [asInt >>> 24, (asInt >>> 16) & 255, (asInt >>> 8) & 255, asInt & 255].join('.');
  }
  const parts = host.split('.');
  if (parts.length === 4 && parts.every(p => /^(0x[0-9a-f]+|0[0-7]*|\d+)$/i.test(p))) {
    const nums = parts.map(p => Number(p));
    if (nums.every(n => Number.isInteger(n) && n >= 0 && n <= 255)) return nums.join('.');
  }
  return null;
}

/** true kalau hostname/IP mengarah ke jaringan lokal atau metadata cloud. */
export function isBlockedHost(host: string): boolean {
  const h = host.toLowerCase().replace(/^\[|\]$/g, '');
  const candidates = [h, normalizeIpv4(h)].filter(Boolean) as string[];
  return candidates.some(c => PRIVATE_IP_PATTERNS.some(p => p.test(c)));
}

export interface ValidationResult {
  valid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

export function validateAndSanitizeUrl(inputUrl: string): ValidationResult {
  if (!inputUrl || typeof inputUrl !== 'string') {
    return { valid: false, error: 'URL tidak boleh kosong' };
  }

  let normalized = inputUrl.trim();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = `https://${normalized}`;
  }

  try {
    const parsed = new URL(normalized);

    // 1. Whitelist Protocol
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Hanya protokol HTTP dan HTTPS yang diizinkan' };
    }

    const hostname = parsed.hostname.toLowerCase();

    // 2. Blacklist Private & Loopback IP / Hostnames
    if (isBlockedHost(hostname)) {
      return { valid: false, error: 'Akses ke domain lokal atau IP privat dilarang demi keamanan (SSRF Protection)' };
    }

    // 3. Domain format check
    if (!hostname.includes('.') && hostname !== 'localhost') {
      return { valid: false, error: 'Format domain tidak valid (membutuhkan TLD seperti .com, .id, dll)' };
    }

    // 4. Return clean base URL
    const cleanUrl = `${parsed.protocol}//${parsed.host}${parsed.pathname === '/' ? '' : parsed.pathname}`;
    return { valid: true, sanitizedUrl: cleanUrl };
  } catch {
    return { valid: false, error: 'Format URL tidak valid' };
  }
}
