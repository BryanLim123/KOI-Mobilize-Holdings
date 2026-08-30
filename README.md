# KOI Global IP Platform — V5.0

Same website as V4.1. New backend.

V4.1 read its content from seven published Google Sheets as CSV and posted newsletter
signups to a Google Apps Script. V5.0 replaces both with a small content API and a
built-in CMS. Media files still live in the Google Cloud Storage bucket — nothing about
the asset URLs changed.

---

## Quick start

```bash
npm install
npm start
```

That runs both processes:

| | URL | What it is |
|---|---|---|
| Website | http://localhost:3000 | the public site |
| Admin | http://localhost:3000/#/admin | the CMS |
| API | http://localhost:4000 | content + subscribers |

Log into the admin with the password in `.env` (`ADMIN_PASSWORD`). **Change it before
putting this anywhere but your own machine.**

To run them separately: `npm run dev` (website) and `npm run server` (API).

---

## Where content lives

Everything the website displays is one JSON document.

```
content/site-content.json     committed seed / bundled fallback
server/data/content.json      the live copy the admin panel edits
server/data/backups/          automatic snapshot before every save (last 40)
public/content.json           static mirror, rewritten on every save
```

Read order at runtime, first hit wins:

1. `GET {VITE_API_URL}/api/content` — live, used while the API is running
2. `/content.json` — static snapshot, used on a CDN/bucket deploy with no server
3. the bundled seed — last resort so the site never renders blank

Because of (2) and (3) the site keeps working even if the API is down.

---

## The admin panel

`http://localhost:3000/#/admin`

| Section | What you edit |
|---|---|
| Site & Branding | logos, company name, contact email, nav links, footer copy |
| Hero | headline, subtitle, background video/image, CTA button |
| Our Core | purpose / vision / mission, the Core Philosophy chain, and the pillar cards incl. their long detail text |
| IP Portfolio | categories and the IP entries inside each one |
| Insights | articles, with a live preview of the `[DP]` / `[Q]` / `[B]` formatting |
| Q&A Widget | the script the floating panel plays, and whether it shows at all |
| Knowledge Base | brand/lore reference copy (not rendered on the site — source material) |
| Subscribers | newsletter signups, with CSV export |
| Backup & Export | export/import the whole JSON, restore any automatic backup |

Notes:

- Edits are held locally until you press **Save changes** (or Ctrl/Cmd+S). The bar at the
  bottom tells you when something is unsaved; closing the tab warns you.
- **Revert** discards local edits and re-reads the server.
- Every media field shows a thumbnail so you can confirm a bucket URL resolves before saving.
- Articles have a **Published** switch — drafts stay in the CMS and never reach the site.

### Article formatting

Blocks are separated by a blank line:

| Prefix | Renders as |
|---|---|
| `[DP]` | opening paragraph with a drop cap |
| `[Q]` | pull quote |
| `[B]` | dark panel; `\|` splits it into lines |
| *(none)* | normal paragraph |

---

## Deploying

The published site is **static**. It has no server: it reads the `public/content.json`
that is committed to the repo. The CMS runs on your machine only.

### Publishing a content change

```bash
npm run publish:content
git add public/content.json content/site-content.json
git commit -m "Content: <what changed>"
git push
```

Vercel rebuilds on push. That is the whole loop — edit in the admin panel, publish, push.

For a text-only tweak you can also edit `public/content.json` directly on github.com; the
deploy picks it up. Pull afterwards so your local copy does not drift.

### Environment

`VITE_API_URL` must be **unset** in the Vercel project. Empty means "no API in this build",
which makes the site read the committed snapshot and makes `/#/admin` show a "run it
locally" notice instead of a login form that cannot work.

Vercel needs no other configuration — it auto-detects Vite, runs `npm run build`, serves
`dist/`.

### If you ever want the CMS editable in production

Deploy `server/` on a Node host, then in Vercel set `VITE_API_URL` to its URL. On that host
set `ADMIN_PASSWORD` (long and random) and `ALLOWED_ORIGINS` to your site's origin. Until
you do that, `server/` is a local tool and nothing is exposed.

---

## API

Public:

| | |
|---|---|
| `GET /api/content` | the full document |
| `POST /api/subscribers` | `{ email }` — newsletter signup |
| `POST /api/auth/login` | `{ password }` → `{ token }` |

Authenticated (`Authorization: Bearer <token>`, 12h sessions):

| | |
|---|---|
| `PUT /api/content` | replace the whole document |
| `PUT /api/content/:section` | replace one section |
| `GET /api/export` / `POST /api/import` | download / upload JSON |
| `GET /api/backups`, `POST /api/backups/:name/restore` | snapshots |
| `GET /api/subscribers` (`?format=csv`), `DELETE /api/subscribers/:id` | signups |

Writes are validated (all seven sections present, arrays are arrays) and rejected wholesale
if malformed, so a bad import cannot half-break the site. Writes are atomic (temp file +
rename) and take a backup first.

---

## Migrating from Google Sheets

Already done — `content/site-content.json` was generated from the live sheets. To re-pull:

```bash
npm run migrate
```

This **overwrites** `content/site-content.json` from the published sheet URLs. It does not
touch `server/data/content.json`, so your live edits are safe. Keep it only as an emergency
path; the sheets are no longer the source of truth.

---

## What changed from V4.1

| | V4.1 | V5.0 |
|---|---|---|
| Content source | 7 published Google Sheets, CSV-scraped at page load | one JSON document behind an API |
| Editing | edit a spreadsheet, hope the column headers still match | typed admin panel with previews and validation |
| Newsletter | Google Apps Script, `no-cors` fire-and-forget | real endpoint, real confirmation, CSV export |
| Portfolio data | flat rows tagged `Cover` / `Item`, joined by category *name* | categories with nested items |
| Pillars | two sheets joined on a hand-typed `PillarID` | one object per pillar |
| Backups | Sheets version history | snapshot before every save, restorable from the UI |
| Gemini SDK | a dependency and an API key, unused | removed |
| Load path | 7 network requests, silent failure per sheet | 1 request, with two fallbacks |

Layout, styling, animations, section order and copy are unchanged.

The V4.1 folder is untouched and still runs.
