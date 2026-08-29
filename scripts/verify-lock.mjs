/**
 * Uji kunci berkas leads.json.
 *
 * 30 penulis serentak menambah entri dengan pola baca-ubah-tulis — persis
 * yang dilakukan saveAuditReport di PM2 cluster. Tanpa kunci, sebagian
 * entri hilang (atau penulisan atomiknya bentrok). Dengan kunci, semuanya
 * selamat.
 *
 * Jalankan: node scripts/verify-lock.mjs
 */
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath, pathToFileURL } from 'url';
import { execFileSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'adoloseo-lockbuild-'));

// Pakai entri JS-nya langsung, bukan shim .cmd — spawn .cmd ditolak Node di Windows.
execFileSync(
  process.execPath,
  [
    path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
    'src/lib/file-lock.ts',
    '--outDir', outDir,
    '--module', 'esnext',
    '--target', 'es2022',
    '--moduleResolution', 'bundler',
  ],
  { cwd: root, stdio: 'inherit' }
);
await fs.rename(path.join(outDir, 'file-lock.js'), path.join(outDir, 'file-lock.mjs'));
const { withFileLock, writeJsonAtomic } = await import(
  pathToFileURL(path.join(outDir, 'file-lock.mjs')).href
);

const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'adoloseo-lock-'));
const file = path.join(dir, 'leads.json');
await writeJsonAtomic(file, []);

const N = 30;
await Promise.all(
  Array.from({ length: N }, (_, i) =>
    withFileLock(file, async () => {
      const list = JSON.parse(await fs.readFile(file, 'utf-8'));
      // Jeda sengaja: melebarkan jendela balapan supaya bug tanpa kunci pasti terlihat
      await new Promise(r => setTimeout(r, 5));
      list.push({ id: i });
      await writeJsonAtomic(file, list);
    })
  )
);

const final = JSON.parse(await fs.readFile(file, 'utf-8'));
const unik = new Set(final.map(x => x.id)).size;
await fs.rm(dir, { recursive: true, force: true });
await fs.rm(outDir, { recursive: true, force: true });

console.log(`Ditulis: ${N}, tersimpan: ${final.length}, unik: ${unik}`);
if (final.length !== N || unik !== N) {
  console.error('GAGAL — ada entri yang hilang, kunci tidak bekerja');
  process.exit(1);
}
console.log('LULUS — tidak ada entri yang hilang');
