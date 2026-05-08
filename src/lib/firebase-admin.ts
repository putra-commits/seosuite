import { initializeApp, cert, getApps, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let db: Firestore;

export function getDb(): Firestore {
  if (!db) {
    if (getApps().length === 0) {
      const saPath = path.resolve(process.cwd(), '../bernas/service-account.json');
      const sa = JSON.parse(fs.readFileSync(saPath, 'utf8'));
      initializeApp({ credential: cert(sa) });
    }
    db = getFirestore();
  }
  return db;
}
