'use client';

import { useId } from 'react';

/**
 * Mark AdoloSEO — huruf "A" keluarga Adolo yang palangnya diganti cincin
 * kaca pembesar. Mark saja, tanpa teks (wordmark ditata di kode, sebelah mark).
 *
 * Gradien di-suffix useId() karena mark dipakai lebih dari sekali per halaman
 * (nav + footer). Id duplikat membuat gradien kedua kosong/hitam.
 */
export function AdoloSeoMark({
  className = 'h-9 w-9',
  title,
}: {
  className?: string;
  title?: string;
}) {
  const raw = useId();
  const uid = raw.replace(/[^a-zA-Z0-9]/g, '');
  const gradA = `asGradA-${uid}`;
  const gradLens = `asGradLens-${uid}`;

  return (
    <svg
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <linearGradient id={gradA} x1="0.08" y1="0.02" x2="0.92" y2="0.98">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="40%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id={gradLens} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>

      {/* E1 — rangka huruf A */}
      <path
        d="M128 428 L256 84 L384 428"
        fill="none"
        stroke={`url(#${gradA})`}
        strokeWidth="62"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* E2 — highlight lipatan pita di kaki kiri */}
      <path
        d="M250 118 L164 350"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="16"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* E3 — cincin lensa (palang A + kaca pembesar) */}
      <circle cx="256" cy="316" r="70" fill="none" stroke={`url(#${gradLens})`} strokeWidth="38" />
      {/* E4 — kilau lensa */}
      <path
        d="M212 286 A 62 62 0 0 1 244 258"
        fill="none"
        stroke="#ffffff"
        strokeWidth="12"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

/** Wordmark teks: Adolo + SEO bergradasi. Selalu berdampingan dengan mark. */
export function AdoloSeoWordmark({ className = '' }: { className?: string }) {
  return (
    <span className={className}>
      Adolo<span className="text-gradient">SEO</span>
    </span>
  );
}

export default AdoloSeoMark;
