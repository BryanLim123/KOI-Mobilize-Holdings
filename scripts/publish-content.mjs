/**
 * Copy the live content out of the server store and into the repo, so a static
 * build (bucket / CDN, no Node process) serves exactly what the admin panel shows.
 *
 *   npm run publish:content && npm run build
 *
 * Writes:
 *   public/content.json          fetched at runtime by the built site
 *   content/site-content.json    bundled fallback if even that 404s
 */

import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIVE = path.join(ROOT, 'server', 'data', 'content.json');
const SEED = path.join(ROOT, 'content', 'site-content.json');
const SNAPSHOT = path.join(ROOT, 'public', 'content.json');

if (!fsSync.existsSync(LIVE)) {
  console.error(
    'No live content at server/data/content.json.\n' +
      'Start the API once (npm run server) so it seeds itself, then re-run this.',
  );
  process.exit(1);
}

const doc = JSON.parse(await fs.readFile(LIVE, 'utf8'));
const text = JSON.stringify(doc, null, 2) + '\n';

await fs.mkdir(path.dirname(SNAPSHOT), { recursive: true });
await fs.writeFile(SNAPSHOT, text, 'utf8');
await fs.writeFile(SEED, text, 'utf8');

const counts = {
  categories: doc.portfolio?.categories?.length ?? 0,
  items: (doc.portfolio?.categories ?? []).reduce((n, c) => n + (c.items?.length ?? 0), 0),
  pillars: doc.about?.pillars?.length ?? 0,
  articles: doc.journal?.articles?.length ?? 0,
  qa: doc.assistant?.qaItems?.length ?? 0,
  knowledge: doc.knowledge?.length ?? 0,
};

console.log('Published content snapshot');
console.log(`  last edited  ${doc.updatedAt} by ${doc.updatedBy}`);
console.log(`  ${Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join('   ')}`);
console.log('  -> public/content.json');
console.log('  -> content/site-content.json');
