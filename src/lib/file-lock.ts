/**
 * file-lock.ts — Kunci antar-proses untuk berkas JSON bersama.
 *
 * AdoloSEO jalan di PM2 cluster: beberapa worker menulis leads.json
 * bersamaan. Pola baca-ubah-tulis tanpa kunci membuat lead hilang senyap —
 * worker A dan B sama-sama membaca daftar lama, lalu tulisan yang terakhir
 * menimpa lead yang baru saja disimpan worker satunya.
 *
 * Kuncinya berupa direktori: mkdir bersifat atomik di POSIX maupun Windows,
 * jadi hanya satu proses yang berhasil membuatnya.
 */

import { promises as fs } from 'fs';
import path from 'path';

const STALE_MS = 15000;
const RETRY_MS = 40;
const MAX_WAIT_MS = 8000;

async function acquire(lockDir: string): Promise<void> {
  const deadline = Date.now() + MAX_WAIT_MS;

  for (;;) {
    try {
      await fs.mkdir(lockDir);
      return;
    } catch {
      // Kunci yatim (proses mati sebelum melepas) harus bisa didobrak,
      // kalau tidak seluruh penyimpanan lead macet permanen.
      try {
        const st = await fs.stat(lockDir);
        if (Date.now() - st.mtimeMs > STALE_MS) {
          await fs.rmdir(lockDir).catch(() => {});
          continue;
        }
      } catch { /* kunci keburu dilepas proses lain */ }

      if (Date.now() > deadline) {
        throw new Error(`Gagal mengambil kunci ${lockDir} dalam ${MAX_WAIT_MS}ms`);
      }
      await new Promise(r => setTimeout(r, RETRY_MS));
    }
  }
}

/** Jalankan fn sambil memegang kunci eksklusif atas targetFile. */
export async function withFileLock<T>(targetFile: string, fn: () => Promise<T>): Promise<T> {
  const lockDir = `${targetFile}.lock`;
  await acquire(lockDir);
  try {
    return await fn();
  } finally {
    await fs.rmdir(lockDir).catch(() => {});
  }
}

/**
 * Tulis atomik: tulis ke berkas sementara lalu rename. Rename bersifat
 * atomik, jadi pembaca tidak pernah melihat JSON separuh jadi — dan mati
 * listrik di tengah penulisan tidak merusak berkas lama.
 */
export async function writeJsonAtomic(file: string, data: unknown): Promise<void> {
  const tmp = path.join(
    path.dirname(file),
    `.${path.basename(file)}.${process.pid}.${Date.now()}.tmp`
  );
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8');
  await fs.rename(tmp, file);
}
