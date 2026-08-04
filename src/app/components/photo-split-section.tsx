import Image from 'next/image';
import type { ReactNode } from 'react';
import type { SitePhoto } from '@/config/photos';

/**
 * Split 50-50 TANPA gap (kolom foto menempel ke kolom teks — ciri editorial EY).
 * Overlay duotone dua lapis (multiply + screen) mengunci foto apa pun
 * ke palet biru-cyan.
 */
export default function PhotoSplitSection({
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
    <section className="border-y border-white/10 bg-ink">
      <div className="mx-auto grid max-w-6xl lg:grid-cols-2">
        <div className="relative min-h-[18rem] lg:min-h-[28rem]">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            loading="lazy"
            className="object-cover grayscale"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-tr from-brand-900/80 via-brand-700/40 to-accent/25 mix-blend-multiply"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-brand-500/15 mix-blend-screen" />
        </div>

        <div className="flex flex-col justify-center px-4 py-14 sm:px-8 sm:py-16 lg:px-12">
          <span aria-hidden="true" className="ey-accent-bar mb-4 h-1 w-14 bg-accent" />
          <p className="section-label text-accent">{eyebrow}</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {headline}
          </h2>
          <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-slate-300">{body}</p>
          {children}
        </div>
      </div>
    </section>
  );
}
