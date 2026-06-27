/**
 * audit-store.ts — File-based storage untuk audit results
 * Simpan di data/audits/{uuid}.json & data/history/{domain}.json
 */
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR = path.join(process.cwd(), 'data');
const AUDITS_DIR = path.join(DATA_DIR, 'audits');
const HISTORY_DIR = path.join(DATA_DIR, 'history');

async function ensureDirs() {
  await fs.mkdir(AUDITS_DIR, { recursive: true });
  await fs.mkdir(HISTORY_DIR, { recursive: true });
}

export interface StoredAudit {
  uuid: string;
  url: string;
  score: number;
  sections: unknown[];
  timestamp: string;
  verdict?: string;
}

export async function saveAudit(data: Omit<StoredAudit, 'uuid'>): Promise<string> {
  await ensureDirs();
  const uuid = randomUUID();
  const stored: StoredAudit = { uuid, ...data };
  await fs.writeFile(path.join(AUDITS_DIR, `${uuid}.json`), JSON.stringify(stored, null, 2));

  // Simpan ke history domain
  const domain = new URL(data.url).hostname.replace('www.', '');
  const histFile = path.join(HISTORY_DIR, `${domain}.json`);
  let history: StoredAudit[] = [];
  try {
    const raw = await fs.readFile(histFile, 'utf-8');
    history = JSON.parse(raw);
  } catch { /* file belum ada */ }
  history.unshift(stored);
  history = history.slice(0, 20); // max 20 history per domain
  await fs.writeFile(histFile, JSON.stringify(history, null, 2));

  return uuid;
}

export async function getAudit(uuid: string): Promise<StoredAudit | null> {
  try {
    const raw = await fs.readFile(path.join(AUDITS_DIR, `${uuid}.json`), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getDomainHistory(domain: string): Promise<StoredAudit[]> {
  try {
    const cleanDomain = domain.replace('www.', '');
    const raw = await fs.readFile(path.join(HISTORY_DIR, `${cleanDomain}.json`), 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getLatestAuditForDomain(domain: string): Promise<StoredAudit | null> {
  const history = await getDomainHistory(domain);
  if (!history.length) return null;
  const latest = history[0];
  // Return if < 6 jam
  const age = Date.now() - new Date(latest.timestamp).getTime();
  if (age < 6 * 60 * 60 * 1000) return latest;
  return null;
}
