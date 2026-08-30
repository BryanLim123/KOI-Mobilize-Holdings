/**
 * One-off migration: Google Sheets (V4.1) -> content/site-content.json (V5.0)
 *
 * Run once:  npm run migrate
 *
 * After this you never need Google Sheets again. Keep this file only as a
 * historical record / emergency re-import path.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'content', 'site-content.json');

const BASE =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vSXddgRxLZ0LndykpC73ZyzqxsuKoj4mzyY2Jpe5dohuRbBuIiYXVt1jyFhYJAxluL2aDELOArfubtL/pub';

const GIDS = {
  hero: '0',
  products: '1257734799',
  knowledge: '1529591673',
  about: '350955839',
  pillars: '1422155392',
  journal: '519114801',
  qa: '1167661763',
};

/* ------------------------------------------------------------------ */
/* CSV                                                                 */
/* ------------------------------------------------------------------ */

function parseCSV(text) {
  const rows = [];
  let row = [];
  let val = '';
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const n = text[i + 1];

    if (inQuote) {
      if (c === '"' && n === '"') {
        val += '"';
        i++;
      } else if (c === '"') {
        inQuote = false;
      } else {
        val += c;
      }
      continue;
    }

    if (c === '"') inQuote = true;
    else if (c === ',') {
      row.push(val.trim());
      val = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && n === '\n') i++;
      row.push(val.trim());
      val = '';
      if (row.some((v) => v !== '')) rows.push(row);
      row = [];
    } else val += c;
  }
  if (val || row.length) {
    row.push(val.trim());
    if (row.some((v) => v !== '')) rows.push(row);
  }

  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1).map((values) =>
    headers.reduce((o, h, i) => {
      o[h] = values[i] ?? '';
      return o;
    }, {}),
  );
}

async function grab(gid) {
  const url = `${BASE}?gid=${gid}&single=true&output=csv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet ${gid} -> HTTP ${res.status}`);
  return parseCSV(await res.text());
}

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'item';

/* ------------------------------------------------------------------ */
/* Build                                                               */
/* ------------------------------------------------------------------ */

async function main() {
  console.log('Fetching published sheets ...');
  const [heroRows, productRows, knowledgeRows, aboutRows, pillarRows, journalRows, qaRows] =
    await Promise.all(Object.values(GIDS).map(grab));

  const kv = (rows, section, key) => {
    const r = rows.find(
      (x) =>
        (x.section || '').trim().toLowerCase() === section.toLowerCase() &&
        (x.key || '').trim().toLowerCase() === key.toLowerCase(),
    );
    return r ? r.content || r.value || '' : '';
  };

  /* --- hero + site chrome ---------------------------------------- */
  const hero = {
    title: kv(heroRows, 'Hero', 'MainTitle'),
    subtitle: kv(heroRows, 'Hero', 'SubTitle'),
    backgroundMedia: kv(heroRows, 'Hero', 'HeroImage'),
    badgeLabel: kv(heroRows, 'Hero', 'CompanyLabel'),
    ctaText: 'MONOKOILY',
    ctaHoverText: 'COMING REAL SOON',
    ctaLink: '',
  };

  const site = {
    brandName: 'KOI Mobilize',
    companyName: 'KOI Mobilize Holdings',
    logoUrl: kv(heroRows, 'Hero', 'LogoUrl'),
    loaderLogoUrl: kv(heroRows, 'Hero', 'LogoUrl'),
    contactEmail: 'info@koinflation.co',
    copyright: '© 2025 KOI Mobilize Holdings. All rights reserved.',
    nav: [
      { label: 'Our Core', target: 'about' },
      { label: 'Our IPs', target: 'products' },
      { label: 'Insights', target: 'journal' },
      { label: 'Contact', target: 'footer' },
    ],
    footer: {
      blurb: 'A Global IP Platform Connecting Games, Media, and Digital Assets.',
      newsletterTitle: 'Stay Updated',
      newsletterBlurb:
        'Join our newsletter to receive the latest updates on our IP ecosystem and digital asset launches.',
      newsletterSuccess: 'Welcome to the MONOKOILY ecosystem!',
      legalLinks: [
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
      ],
    },
  };

  /* --- about + pillars -------------------------------------------- */
  const detailById = {};
  pillarRows.forEach((r) => {
    const id = (r.pillarid || r.id || '').trim();
    if (id) detailById[id.toLowerCase()] = r.detailcontent || r.content || '';
  });

  const pillarIds = [
    ...new Set(
      aboutRows
        .map((r) => (r.section || '').trim())
        .filter((s) => s.toLowerCase().startsWith('pillar')),
    ),
  ].sort();

  const pillars = pillarIds
    .map((id) => ({
      id,
      title: kv(aboutRows, id, 'Title'),
      description: kv(aboutRows, id, 'Desc'),
      media: kv(aboutRows, id, 'Media'),
      detailContent: detailById[id.toLowerCase()] || '',
    }))
    .filter((p) => p.title);

  const about = {
    sectionLabel: 'Our Purpose',
    purpose: kv(aboutRows, 'Intro', 'Purpose'),
    visionTitle: kv(aboutRows, 'Intro', 'VisionTitle') || 'Our Vision',
    vision: kv(aboutRows, 'Intro', 'VisionText'),
    missionTitle: kv(aboutRows, 'Intro', 'MissionTitle') || 'Our Mission',
    mission: kv(aboutRows, 'Intro', 'MissionText'),
    mainImage: kv(aboutRows, 'Intro', 'MainImage'),
    // Never lived in the sheets — authored in the CMS, seeded here so a re-run
    // does not silently drop the band.
    philosophy: {
      enabled: true,
      label: 'Our Philosophy',
      title: 'Core Philosophy',
      steps: ['IP', 'Platform', 'Community', 'Commerce', 'Digital Value'],
      closing: 'From Web2 to Web3',
    },
    pillars,
  };

  /* --- portfolio: flat Cover/Item rows -> nested categories -------- */
  const categories = [];
  const byName = new Map();

  productRows
    .filter((r) => (r.level || '').trim().toLowerCase() === 'cover')
    .forEach((r, i) => {
      const name = (r.category || '').trim();
      if (!name) return;
      const cat = {
        id: r.id || `cat-${i + 1}`,
        name,
        tagline: r['tagline / description'] || r.tagline || '',
        coverImage: r.imageurl || r.image || '',
        items: [],
      };
      categories.push(cat);
      byName.set(name, cat);
    });

  productRows
    .filter((r) => (r.level || '').trim().toLowerCase() === 'item')
    .forEach((r, i) => {
      const catName = (r.category || '').trim();
      let cat = byName.get(catName);
      if (!cat) {
        cat = { id: `cat-x-${i}`, name: catName || 'Uncategorised', tagline: '', coverImage: '', items: [] };
        categories.push(cat);
        byName.set(catName, cat);
      }
      const body = r['tagline / description'] || r.tagline || r.description || '';
      cat.items.push({
        id: `${slug(catName)}-${slug(r.name) || i}`,
        name: r.name || 'Untitled',
        tagline: '',
        description: body,
        imageUrl: r.imageurl || r.image || '',
        actionLink: r.actionlink || r.link || '',
        actionLabel: 'View Case Study',
        inquiryLabel: 'INQUIRE ABOUT LICENSING ( coming soon )',
        inquiryEnabled: false,
      });
    });

  const portfolio = {
    sectionLabel: 'DISCOVERY HUB',
    sectionTitle: 'Featured IPs',
    sectionSubtitle: 'Select a category to explore our IP ecosystem.',
    countSuffix: 'IPs Discovered',
    enterLabel: 'ENTER CATEGORY',
    categories,
  };

  /* --- journal ----------------------------------------------------- */
  const journal = {
    sectionLabel: 'News & Updates',
    sectionTitle: 'Insights',
    articles: journalRows.map((r, i) => ({
      id: String(r.id || i + 1),
      title: r.title || 'Untitled',
      date: r.date || '',
      excerpt: r.excerpt || '',
      image: r.imageurl || r.image || '',
      content: r.content || '',
      sourceLink: r.sourcelink || r.link || '',
      published: true,
    })),
  };

  /* --- assistant --------------------------------------------------- */
  const assistant = {
    enabled: true,
    title: 'Strategic Q&A',
    welcomeMessage:
      'Welcome to our Strategic Q&A. Use the "Next" button to reveal answers and "Skip" to move to the next strategic topic.',
    qaItems: qaRows
      .map((r, i) => ({
        id: String(r.id || i + 1),
        question: r.question || r.q || '',
        answer: r.answer || r.a || '',
      }))
      .filter((x) => x.question && x.answer),
  };

  /* --- knowledge base ---------------------------------------------- */
  const knowledge = knowledgeRows
    .map((r, i) => ({
      id: `k-${i + 1}`,
      category: r.category || 'General',
      information: r.information || r.info || r.content || '',
    }))
    .filter((k) => k.information);

  const doc = {
    schemaVersion: 1,
    updatedAt: new Date().toISOString(),
    updatedBy: 'migrate-from-sheets',
    site,
    hero,
    about,
    portfolio,
    journal,
    assistant,
    knowledge,
  };

  await fs.mkdir(path.dirname(OUT), { recursive: true });
  await fs.writeFile(OUT, JSON.stringify(doc, null, 2) + '\n', 'utf8');

  console.log(`\nWrote ${path.relative(ROOT, OUT)}`);
  console.log(
    `  categories: ${categories.length}  items: ${categories.reduce((n, c) => n + c.items.length, 0)}`,
  );
  console.log(`  pillars: ${pillars.length}  articles: ${journal.articles.length}`);
  console.log(`  qa: ${assistant.qaItems.length}  knowledge: ${knowledge.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
