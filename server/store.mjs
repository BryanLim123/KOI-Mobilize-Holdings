/**
 * File-backed JSON store.
 *
 * Why a file and not a database: the whole dataset is a few hundred KB of
 * marketing copy edited by one person. A file is atomic to back up, trivial to
 * diff, and exports itself. Swap this module for a DB adapter later without
 * touching the API surface.
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

export const PATHS = {
  root: ROOT,
  data: path.join(ROOT, 'server', 'data'),
  live: path.join(ROOT, 'server', 'data', 'content.json'),
  seed: path.join(ROOT, 'content', 'site-content.json'),
  backups: path.join(ROOT, 'server', 'data', 'backups'),
  subscribers: path.join(ROOT, 'server', 'data', 'subscribers.json'),
  publicSnapshot: path.join(ROOT, 'public', 'content.json'),
};

const MAX_BACKUPS = 40;

/* ---------------------------------------------------------------- */

function ensureDirs() {
  for (const dir of [PATHS.data, PATHS.backups, path.join(ROOT, 'public')]) {
    if (!fsSync.existsSync(dir)) fsSync.mkdirSync(dir, { recursive: true });
  }
}

/** Write via temp file + rename so a crash mid-write can never truncate data. */
async function writeAtomic(file, text) {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, text, 'utf8');
  await fs.rename(tmp, file);
}

const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');

/* ---------------------------------------------------------------- */
/* Content                                                           */
/* ---------------------------------------------------------------- */

/** First boot copies the migrated seed into the live store. */
export async function initStore() {
  ensureDirs();
  if (!fsSync.existsSync(PATHS.live)) {
    if (!fsSync.existsSync(PATHS.seed)) {
      throw new Error(
        `No content found. Run "npm run migrate" first, or place a JSON at ${PATHS.seed}`,
      );
    }
    await fs.copyFile(PATHS.seed, PATHS.live);
    console.log('[store] seeded server/data/content.json from content/site-content.json');
  }
  if (!fsSync.existsSync(PATHS.subscribers)) {
    await writeAtomic(PATHS.subscribers, '[]');
  }
  await publishSnapshot();
}

export async function readContent() {
  const raw = await fs.readFile(PATHS.live, 'utf8');
  return JSON.parse(raw);
}

/** Snapshot the current file into backups/ before overwriting it. */
async function backup(label = 'auto') {
  try {
    const current = await fs.readFile(PATHS.live, 'utf8');
    await writeAtomic(path.join(PATHS.backups, `content-${stamp()}-${label}.json`), current);
  } catch {
    return; // nothing to back up on first write
  }
  const files = (await fs.readdir(PATHS.backups)).filter((f) => f.endsWith('.json')).sort();
  for (const old of files.slice(0, Math.max(0, files.length - MAX_BACKUPS))) {
    await fs.rm(path.join(PATHS.backups, old), { force: true });
  }
}

/**
 * Mirror the live content to public/content.json so a plain static build
 * (Netlify / GCS bucket / any CDN) serves the same data with no server.
 */
export async function publishSnapshot() {
  const doc = await readContent();
  await writeAtomic(PATHS.publicSnapshot, JSON.stringify(doc, null, 2) + '\n');
  return doc;
}

export async function writeContent(doc, { by = 'admin', label = 'auto' } = {}) {
  await backup(label);
  const next = { ...doc, updatedAt: new Date().toISOString(), updatedBy: by };
  await writeAtomic(PATHS.live, JSON.stringify(next, null, 2) + '\n');
  await publishSnapshot();
  return next;
}

export async function writeSection(section, value, opts = {}) {
  const doc = await readContent();
  if (!(section in doc)) throw new Error(`Unknown section "${section}"`);
  doc[section] = value;
  return writeContent(doc, { ...opts, label: section });
}

export async function listBackups() {
  ensureDirs();
  const files = (await fs.readdir(PATHS.backups)).filter((f) => f.endsWith('.json')).sort().reverse();
  return Promise.all(
    files.map(async (name) => {
      const s = await fs.stat(path.join(PATHS.backups, name));
      return { name, size: s.size, createdAt: s.mtime.toISOString() };
    }),
  );
}

export async function restoreBackup(name) {
  if (name.includes('/') || name.includes('\\') || !name.endsWith('.json')) {
    throw new Error('Invalid backup name');
  }
  const file = path.join(PATHS.backups, name);
  const raw = await fs.readFile(file, 'utf8');
  const doc = JSON.parse(raw);
  return writeContent(doc, { by: 'restore', label: 'pre-restore' });
}

/* ---------------------------------------------------------------- */
/* Subscribers (replaces the Google Apps Script endpoint)            */
/* ---------------------------------------------------------------- */

export async function readSubscribers() {
  try {
    return JSON.parse(await fs.readFile(PATHS.subscribers, 'utf8'));
  } catch {
    return [];
  }
}

export async function addSubscriber(email, source = 'website') {
  const list = await readSubscribers();
  const clean = String(email).trim().toLowerCase();
  if (list.some((s) => s.email === clean)) return { added: false, total: list.length };
  list.push({
    id: `sub-${Date.now()}-${Math.floor(Math.random() * 1e4)}`,
    email: clean,
    createdAt: new Date().toISOString(),
    source,
  });
  await writeAtomic(PATHS.subscribers, JSON.stringify(list, null, 2) + '\n');
  return { added: true, total: list.length };
}

export async function removeSubscriber(id) {
  const list = await readSubscribers();
  const next = list.filter((s) => s.id !== id);
  await writeAtomic(PATHS.subscribers, JSON.stringify(next, null, 2) + '\n');
  return next;
}

export function subscribersToCSV(list) {
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const head = 'Email,Subscribed At,Source';
  return [head, ...list.map((s) => [s.email, s.createdAt, s.source].map(esc).join(','))].join('\n');
}
