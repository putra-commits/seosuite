'use client';

import { useId } from 'react';

/**
 * Mark AdoloSEO — SILUET KELUARGA ADOLO: pita segitiga TERTUTUP bermassa tebal
 * (mobius A) dengan counter segitiga di dalamnya, dan glyph sub-brand
 * DISARANGKAN di dalam counter itu — sama seperti gelembung chat AdoloChat.
 * Glyph AdoloSEO = kaca pembesar: cincin lensa + GAGANG (bukan cincin polos,
 * supaya tidak terbaca sebagai donat/huruf O).
 *
 * Varian React ini sengaja SEDERHANA (tanpa lipatan pita, tanpa kilau lensa):
 * seluruh pemakaian di aplikasi berukuran <= 40px (nav h-9, sidebar h-8,
 * watermark h-4/h-5, footer h-10), dan detail halus jatuh ke bawah 1px pada
 * ukuran itu — hanya jadi lumpur. Varian penuh dengan lipatan pita ada di
 * public/brand/adoloseo-mark.svg (dipakai untuk aset 512px & kartu OG).
 *
 * Warna gradien mengambil CSS variable palet terkunci (--accent/--brand) dari
 * globals.css, jadi ganti palet cukup di satu berkas. Gradien di-suffix
 * useId() karena mark dipakai lebih dari sekali per halaman (nav + footer);
 * id duplikat membuat gradien kedua kosong/hitam.
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
  const gradRibbon = `asRibbon-${uid}`;
  const gradLens = `asLens-${uid}`;

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
        <linearGradient id={gradRibbon} x1="0.06" y1="0.04" x2="0.94" y2="0.96">
          <stop offset="0%" stopColor="var(--accent-300)" />
          <stop offset="28%" stopColor="var(--accent)" />
          <stop offset="62%" stopColor="var(--brand)" />
          <stop offset="100%" stopColor="var(--brand-900)" />
        </linearGradient>
        <linearGradient id={gradLens} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="var(--accent-300)" />
          <stop offset="100%" stopColor="var(--brand)" />
        </linearGradient>
      </defs>

      {/* Pita segitiga tertutup — siluet keluarga Adolo */}
      <path
        d="M283.97 109.08 L424.03 374.92 Q452 428 392 428 L120 428 Q60 428 87.97 374.92 L228.03 109.08 Q256 56 283.97 109.08 Z"
        fill="none"
        stroke={`url(#${gradRibbon})`}
        strokeWidth="68"
        strokeLinejoin="round"
      />
      {/* Kaca pembesar disarangkan di counter segitiga */}
      <circle cx="256" cy="272" r="50" fill="none" stroke={`url(#${gradLens})`} strokeWidth="30" />
      <path
        d="M292 308 L322 338"
        fill="none"
        stroke={`url(#${gradLens})`}
        strokeWidth="30"
        strokeLinecap="round"
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
