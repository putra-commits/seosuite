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
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return { valid: false, error: 'Akses ke domain lokal atau IP privat dilarang demi keamanan (SSRF Protection)' };
      }
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
