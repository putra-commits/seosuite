import Image from 'next/image';
import type { ReactNode } from 'react';
import type { SitePhoto } from '@/config/photos';

/**
 * CTA penutup EY: foto full-bleed min-h-[70vh], scrim dua lapis,
 * pasangan tombol siku-siku disuplai lewat `children`.
 */
export default function GrowTogetherCta({
  eyebrow,
  headline,
  body,
  photo,
  children,
}: {
  eyebrow: string;
  headline: string;
  body: string;
  photo: SitePhoto;
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate min-h-[70vh] overflow-hidden bg-ink-900 text-white">
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="100vw"
        loading="lazy"
        className="object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink-900/60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink-900/95 via-ink-900/60 to-transparent"
      />

      <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-end px-4 py-16 sm:px-6 sm:py-20 lg:justify-center">
        <span aria-hidden="true" className="ey-accent-bar mb-4 h-1 w-14 bg-accent" />
        <p className="section-label text-accent">{eyebrow}</p>
        {/* max-w-2xl + max-w-md/sm:text-lg mengikuti komponen asli adolo.id. */}
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
          {headline}
        </h2>
        <p className="mt-4 max-w-md text-base leading-relaxed text-slate-200/95 sm:text-lg">
          {body}
        </p>
        {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>}
      </div>
    </section>
  );
}
