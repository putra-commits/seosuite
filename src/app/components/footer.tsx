/**
 * Footer AdoloSEO — mengikuti struktur footer adolo.id
 * (`/var/www/adolo.id/src/components/site-footer.tsx`) supaya satu keluarga:
 * 4 kolom = identitas / produk / perusahaan / legal, dengan lencana status
 * berwarna sama (emerald=production, sky=beta, amber=segera hadir).
 *
 * Yang DIBUANG dari footer lama beserta alasannya:
 * - "Ecosystem Bernas Mahakarya Asia" -> footer adolo.id mendaftar produk
 *   keluarga Adolo, bukan payung lintas-entitas.
 * - agenc1st.id dan adoloweb.com -> domainnya tidak ada (DNS gagal resolve).
 * - autoprofit.id -> balas 502.
 * - "TEFA ACADEMY x UNMAHA" & "Developed by TEFA Student Developers" ->
 *   UNMAHA punya merek institusional sendiri yang sengaja dipisahkan dari
 *   sisi komersial Adolo. Menyebut "dibangun mahasiswa" juga melemahkan
 *   posisi harga paket Rp4.999.000.
 * - "Secured by SSL" -> setiap situs punya SSL; itu bukan pembeda.
 */
import React from 'react';
import Link from 'next/link';
import { AdoloSeoMark } from './logo';
import {
  TAUTAN_LEGAL,
  TAUTAN_PERUSAHAAN,
  produkBerstatus,
  type Produk,
  type StatusProduk,
} from '@/config/ekosistem';

const GAYA_LENCANA: Record<StatusProduk, string> = {
  production: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  beta: 'border-sky-400/30 bg-sky-400/10 text-sky-300',
  soon: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
};

const LABEL_KELOMPOK: Record<StatusProduk, { judul: string; warna: string }> = {
  production: { judul: 'Production', warna: 'text-emerald-500/80' },
  beta: { judul: 'Beta', warna: 'text-sky-500/80' },
  soon: { judul: 'Segera hadir', warna: 'text-amber-500/80' },
};

function TautanProduk({ produk }: { produk: Produk }) {
  // Situs ini sendiri: ditaut ke beranda, bukan keluar.
  if (produk.nama === 'AdoloSEO') {
    return (
      <Link href="/" className="inline-flex flex-wrap items-center text-white transition hover:text-accent">
        {produk.nama}
        <span className="ml-1.5 text-[10px] font-normal uppercase tracking-wide text-slate-500">
          Anda di sini
        </span>
      </Link>
    );
  }

  // Aturan yang diwarisi dari canLinkExternally() di adolo.id: produk 'soon'
  // TIDAK ditaut keluar. Inilah yang dulu tidak ada, sehingga tiga tautan
  // mati sempat tayang di footer.
  if (produk.status === 'soon') {
    return <span className="inline-flex flex-wrap items-center text-slate-500">{produk.nama}</span>;
  }

  return (
    <a
      href={produk.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex flex-wrap items-center transition hover:text-white"
    >
      {produk.nama}
      {produk.status !== 'production' && (
        <span
          className={`ml-1.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${GAYA_LENCANA[produk.status]}`}
        >
          {LABEL_KELOMPOK[produk.status].judul}
        </span>
      )}
    </a>
  );
}

function KelompokProduk({ status }: { status: StatusProduk }) {
  const daftar = produkBerstatus(status);
  if (daftar.length === 0) return null;
  const { judul, warna } = LABEL_KELOMPOK[status];

  return (
    <div>
      <p className={`mb-2 text-[10px] font-semibold uppercase tracking-wider ${warna}`}>{judul}</p>
      <ul className="space-y-2">
        {daftar.map((produk) => (
          <li key={produk.nama}>
            <TautanProduk produk={produk} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const tahun = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-ink-900 text-slate-400 selection:bg-accent/20">
      <div className="hairline-gradient" />

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[15%] top-0 h-[300px] w-[300px] rounded-full bg-brand-600/10 blur-[120px]"
        />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
          {/* Kolom 1: identitas — badan hukum yang sama dengan adolo.id */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="AdoloSEO">
              <AdoloSeoMark className="h-10 w-10" />
              <span className="font-display text-lg font-bold tracking-tight text-white">
                Adolo<span className="text-gradient">SEO</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              PT Adolo Coaching Mentoring
              <br />
              IDX Tower, Jl. Jend. Sudirman, Jakarta Selatan
            </p>
            <p className="mt-4 text-xs text-slate-500">
              Bagian dari ekosistem{' '}
              <a
                href="https://adolo.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 underline underline-offset-2 transition hover:text-white"
              >
                adolo.id
              </a>
            </p>
          </div>

          {/* Kolom 2: produk keluarga Adolo */}
          <div>
            <p className="section-label text-slate-400">Produk</p>
            <div className="mt-4 space-y-5 text-sm">
              <KelompokProduk status="production" />
              <KelompokProduk status="beta" />
              <KelompokProduk status="soon" />
            </div>
          </div>

          {/* Kolom 3: perusahaan — halaman adolo.id, tidak diduplikasi di sini */}
          <div>
            <p className="section-label text-slate-400">Perusahaan</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TAUTAN_PERUSAHAAN.map((tautan) => (
                <li key={tautan.href}>
                  <a
                    href={tautan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    {tautan.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: legal — satu badan hukum, satu set dokumen */}
          <div>
            <p className="section-label text-slate-400">Legal</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {TAUTAN_LEGAL.map((tautan) => (
                <li key={tautan.href}>
                  <a
                    href={tautan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-white"
                  >
                    {tautan.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-5 text-center text-xs text-slate-500">
        &copy; {tahun} PT Adolo Coaching Mentoring
      </div>
    </footer>
  );
}
