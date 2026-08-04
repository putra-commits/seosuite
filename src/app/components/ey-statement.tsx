import Image from 'next/image';
import type { SitePhoto } from '@/config/photos';

/**
 * Cetakan "statement break" EY: foto full-bleed + scrim DUA lapis,
 * teks rata bawah. min-h WAJIB diulang di container, kalau tidak tinggi kolaps.
 */
export default function EyStatement({
  id,
  eyebrow,
  headline,
  body,
  photo,
  priority = false,
}: {
  id?: string;
  eyebrow: string;
  headline: string;
  body?: string;
  photo: SitePhoto;
  priority?: boolean;
}) {
  return (
    <section
      id={id}
      className="relative min-h-[42vh] scroll-mt-24 overflow-hidden sm:min-h-[50vh]"
    >
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes="100vw"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
        className="object-cover object-center"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-ink-900/60" />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-ink-900 via-transparent to-ink-900/35"
      />

      <div className="relative mx-auto flex min-h-[42vh] max-w-6xl flex-col justify-end px-4 pb-12 pt-20 sm:min-h-[50vh] sm:px-6 sm:pb-14">
        {/* Aksen EY memakai amber-400/amber-300 PERSIS seperti komponen induknya
            di adolo.id (src/components/ey-statement.tsx & grow-together-cta.tsx).
            adolo.id punya DUA lapisan warna: lapisan produk biru->cyan, dan
            lapisan editorial EY yang beraksen amber. Versi pertama desain ulang
            ini membuang amber sama sekali sehingga terasa lebih dingin daripada
            induknya. Jangan diganti jadi accent/cyan tanpa mengubah adolo.id juga. */}
        <span aria-hidden="true" className="ey-accent-bar mb-4 h-1 w-14 bg-amber-400" />
        <p className="section-label text-amber-300">{eyebrow}</p>
        {/* max-w-2xl dipertahankan seperti komponen asli adolo.id — measure
            pendek itu justru ciri tipografi editorial EY. */}
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {headline}
        </h2>
        {body && (
          <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-200/90 sm:text-base">
            {body}
          </p>
        )}
      </div>
    </section>
  );
}
