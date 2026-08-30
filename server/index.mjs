/**
 * KOI Global IP Platform — content API.
 *
 * Public  : GET  /api/content            full published document
 *           POST /api/subscribers        newsletter signup
 * Admin   : POST /api/auth/login         -> { token }
 *           PUT  /api/content            replace whole document
 *           PUT  /api/content/:section   replace one section
 *           GET  /api/export             download JSON
 *           POST /api/import             upload JSON
 *           GET  /api/backups            list snapshots
 *           POST /api/backups/:name/restore
 *           GET  /api/subscribers        list  (+ ?format=csv)
 *           DELETE /api/subscribers/:id
 */

import http from 'node:http';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  PATHS,
  initStore,
  readContent,
  writeContent,
  writeSection,
  listBackups,
  restoreBackup,
  readSubscribers,
  addSubscriber,
  removeSubscriber,
  subscribersToCSV,
} from './store.mjs';

/* ---------------------------------------------------------------- */
/* Config                                                            */
/* ---------------------------------------------------------------- */

loadDotEnv(path.join(PATHS.root, '.env'));

const PORT = Number(process.env.PORT || 4000);

/**
 * No hard-coded fallback: this source is public, so a default password would be
 * a published credential. With ADMIN_PASSWORD unset we mint a random one per
 * boot and print it — usable, but never guessable.
 */
const GENERATED_PASSWORD = !process.env.ADMIN_PASSWORD;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || crypto.randomBytes(9).toString('base64url');
const ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:4173')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

function loadDotEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (!m) continue;
    const [, k, v = ''] = m;
    if (!(k in process.env)) process.env[k] = v.replace(/^["']|["']$/g, '');
  }
}

/* ---------------------------------------------------------------- */
/* Sessions — in-memory bearer tokens, 12h TTL                       */
/* ---------------------------------------------------------------- */

const sessions = new Map();
const TTL = 12 * 60 * 60 * 1000;

function issueToken() {
  const token = crypto.randomBytes(24).toString('hex');
  sessions.set(token, Date.now() + TTL);
  return token;
}

function validToken(token) {
  const exp = sessions.get(token);
  if (!exp) return false;
  if (exp < Date.now()) {
    sessions.delete(token);
    return false;
  }
  return true;
}

/** Constant-time compare so the password can't be probed by timing. */
function passwordMatches(input) {
  const a = Buffer.from(String(input));
  const b = Buffer.from(ADMIN_PASSWORD);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/* ---------------------------------------------------------------- */
/* HTTP helpers                                                      */
/* ---------------------------------------------------------------- */

function cors(req, res) {
  const origin = req.headers.origin;
  if (origin && (ORIGINS.includes(origin) || ORIGINS.includes('*'))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  } else if (ORIGINS.includes('*')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.setHeader('Access-Control-Max-Age', '86400');
}

const json = (res, code, body, headers = {}) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
};

function readBody(req, limit = 8 * 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Body is not valid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const bearer = (req) => (req.headers.authorization || '').replace(/^Bearer\s+/i, '');

/* ---------------------------------------------------------------- */
/* Validation — reject a document that would break the site          */
/* ---------------------------------------------------------------- */

const SECTIONS = ['site', 'hero', 'about', 'portfolio', 'journal', 'assistant', 'knowledge'];

function validateDocument(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') return ['Document must be an object'];
  for (const s of SECTIONS) {
    if (!(s in doc)) errors.push(`Missing section "${s}"`);
  }
  if (doc.about && !Array.isArray(doc.about.pillars)) errors.push('about.pillars must be an array');
  if (doc.portfolio && !Array.isArray(doc.portfolio.categories))
    errors.push('portfolio.categories must be an array');
  if (doc.journal && !Array.isArray(doc.journal.articles))
    errors.push('journal.articles must be an array');
  if (doc.assistant && !Array.isArray(doc.assistant.qaItems))
    errors.push('assistant.qaItems must be an array');
  if (doc.knowledge && !Array.isArray(doc.knowledge)) errors.push('knowledge must be an array');
  return errors;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------------------------------------------------------- */
/* Router                                                            */
/* ---------------------------------------------------------------- */

async function route(req, res, url) {
  const { pathname, searchParams } = url;
  const method = req.method;

  /* ---- public ---------------------------------------------------- */

  if (method === 'GET' && pathname === '/api/health') {
    return json(res, 200, { ok: true, uptime: process.uptime() });
  }

  if (method === 'GET' && pathname === '/api/content') {
    return json(res, 200, await readContent(), { 'Cache-Control': 'no-store' });
  }

  if (method === 'POST' && pathname === '/api/subscribers') {
    const { email, source } = await readBody(req);
    if (!email || !EMAIL_RE.test(String(email))) {
      return json(res, 400, { error: 'A valid email is required' });
    }
    const result = await addSubscriber(email, source || 'website');
    return json(res, 200, { ok: true, ...result });
  }

  if (method === 'POST' && pathname === '/api/auth/login') {
    const { password } = await readBody(req);
    if (!passwordMatches(password ?? '')) {
      return json(res, 401, { error: 'Incorrect password' });
    }
    return json(res, 200, { token: issueToken(), expiresIn: TTL });
  }

  /* ---- everything below requires a token -------------------------- */

  if (!validToken(bearer(req))) {
    return json(res, 401, { error: 'Not authenticated' });
  }

  if (method === 'POST' && pathname === '/api/auth/logout') {
    sessions.delete(bearer(req));
    return json(res, 200, { ok: true });
  }

  if (method === 'PUT' && pathname === '/api/content') {
    const doc = await readBody(req);
    const errors = validateDocument(doc);
    if (errors.length) return json(res, 400, { error: 'Invalid document', errors });
    return json(res, 200, await writeContent(doc, { by: 'admin' }));
  }

  const sectionMatch = pathname.match(/^\/api\/content\/([a-z]+)$/);
  if (method === 'PUT' && sectionMatch) {
    const section = sectionMatch[1];
    if (!SECTIONS.includes(section)) return json(res, 404, { error: `Unknown section ${section}` });
    const body = await readBody(req);
    const value = body && Object.prototype.hasOwnProperty.call(body, 'value') ? body.value : body;
    return json(res, 200, await writeSection(section, value, { by: 'admin' }));
  }

  if (method === 'GET' && pathname === '/api/export') {
    const doc = await readContent();
    const name = `koi-content-${new Date().toISOString().slice(0, 10)}.json`;
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': `attachment; filename="${name}"`,
    });
    return res.end(JSON.stringify(doc, null, 2));
  }

  if (method === 'POST' && pathname === '/api/import') {
    const doc = await readBody(req);
    const errors = validateDocument(doc);
    if (errors.length) return json(res, 400, { error: 'Invalid document', errors });
    return json(res, 200, await writeContent(doc, { by: 'import' }));
  }

  if (method === 'GET' && pathname === '/api/backups') {
    return json(res, 200, await listBackups());
  }

  const restoreMatch = pathname.match(/^\/api\/backups\/([^/]+)\/restore$/);
  if (method === 'POST' && restoreMatch) {
    return json(res, 200, await restoreBackup(decodeURIComponent(restoreMatch[1])));
  }

  if (method === 'GET' && pathname === '/api/subscribers') {
    const list = await readSubscribers();
    if (searchParams.get('format') === 'csv') {
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="koi-subscribers-${new Date()
          .toISOString()
          .slice(0, 10)}.csv"`,
      });
      return res.end(subscribersToCSV(list));
    }
    return json(res, 200, list);
  }

  const subMatch = pathname.match(/^\/api\/subscribers\/([^/]+)$/);
  if (method === 'DELETE' && subMatch) {
    return json(res, 200, await removeSubscriber(decodeURIComponent(subMatch[1])));
  }

  return json(res, 404, { error: `No route for ${method} ${pathname}` });
}

/* ---------------------------------------------------------------- */

const server = http.createServer(async (req, res) => {
  cors(req, res);
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    await route(req, res, url);
  } catch (err) {
    console.error(`[api] ${req.method} ${url.pathname}:`, err.message);
    json(res, 500, { error: err.message });
  }
});

await initStore();
server.listen(PORT, () => {
  console.log(`\n  KOI content API   http://localhost:${PORT}`);
  console.log(
    GENERATED_PASSWORD
      ? `  admin password    ${ADMIN_PASSWORD}   (random — set ADMIN_PASSWORD in .env to keep one)`
      : '  admin password    set from .env',
  );
  console.log(`  data              server/data/content.json`);
  console.log(`  static snapshot   public/content.json\n`);
});
