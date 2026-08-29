/**
 * Uji slug laporan: tiga audit untuk domain yang sama harus menghasilkan
 * tiga laporan berbeda (-, -2, -3) tanpa ada yang tertimpa, dan ketiganya
 * tetap ada di index lead.
 *
 * Jalankan: node scripts/verify-slug.mjs
 */
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath, pathToFileURL } from 'url';
import { execFileSync } from 'child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = await fs.mkdtemp(path.join(os.tmpdir(), 'adoloseo-slugbuild-'));

// Pakai entri JS tsc langsung — spawn shim .cmd ditolak Node di Windows.
execFileSync(
  process.execPath,
  [
    path.join(root, 'node_modules', 'typescript', 'bin', 'tsc'),
    'src/lib/audit-store.ts',
    '--outDir', outDir,
    '--module', 'esnext',
    '--target', 'es2022',
    '--moduleResolution', 'bundler',
    '--skipLibCheck',
  ],
  { cwd: root, stdio: 'inherit' }
);

// Impor relatif hasil kompilasi tidak berekstensi; Node ESM butuh ekstensi.
for (const f of await fs.readdir(outDir)) {
  if (!f.endsWith('.js')) continue;
  const full = path.join(outDir, f);
  const isi = (await fs.readFile(full, 'utf-8'))
    .replace(/(from\s+['"]\.\/[\w-]+)(['"])/g, '$1.mjs$2');
  await fs.writeFile(full.replace(/\.js$/, '.mjs'), isi, 'utf-8');
}

const dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'adoloseo-slug-'));
process.env.ADOLOSEO_DATA_DIR = dataDir;

const { saveAuditReport, getAuditBySlug, getAllLeads } = await import(
  pathToFileURL(path.join(outDir, 'audit-store.mjs')).href
);

const audit = {
  overallScore: 54, grade: 'C', statusColor: 'amber',
  summaryText: 'ringkasan', lossEstimateText: 'estimasi',
  top3Issues: [], modules: [],
};

const hasil = [];
for (let i = 1; i <= 3; i++) {
  const rec = await saveAuditReport({
    url: 'https://klinikgigisehat.id',
    businessName: `Audit ke-${i}`,
    audit: { ...audit, overallScore: 50 + i },
  });
  hasil.push(rec);
}

const slugs = hasil.map(r => r.slug);
console.log('Slug yang dihasilkan:', slugs.join(', '));

let gagal = false;
if (new Set(slugs).size !== 3) {
  console.error('GAGAL — slug tidak unik, laporan saling menimpa');
  gagal = true;
}

// Tiap laporan harus masih bisa dibaca dengan isi aslinya
for (const rec of hasil) {
  const dibaca = await getAuditBySlug(rec.slug);
  if (!dibaca || dibaca.score !== rec.score || dibaca.businessName !== rec.businessName) {
    console.error(`GAGAL — laporan ${rec.slug} hilang atau tertimpa`);
    gagal = true;
  }
}

const leads = await getAllLeads();
if (leads.length !== 3) {
  console.error(`GAGAL — index lead berisi ${leads.length}, seharusnya 3`);
  gagal = true;
}

await fs.rm(dataDir, { recursive: true, force: true });
await fs.rm(outDir, { recursive: true, force: true });
if (gagal) process.exit(1);
console.log('LULUS — 3 laporan unik, semuanya utuh, 3 lead tersimpan');
