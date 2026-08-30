/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Replaces V4.1's dataLoader.ts (Google Sheets CSV scraping).
 *
 * Resolution order, first success wins:
 *   1. the content API          — live edits, used while the server is running
 *   2. /content.json            — static snapshot, used on a CDN/bucket deploy
 *   3. the bundled seed         — last resort so the site never renders empty
 */

import type { SiteDocument, ContentSection } from '../types';
import seed from '../content/site-content.json';

/**
 * Empty means "no content API in this build" — the deployed static site.
 * Local development sets VITE_API_URL in .env.
 */
export const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/** The CMS needs a server; a static deploy has none. */
export const hasContentApi = API_BASE !== '';

const TOKEN_KEY = 'koi_admin_token';

export const FALLBACK_CONTENT = seed as unknown as SiteDocument;

/* ---------------------------------------------------------------- */
/* Public site                                                       */
/* ---------------------------------------------------------------- */

async function tryFetch(url: string, init?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export type ContentSource = 'api' | 'snapshot' | 'bundled';

export async function loadContent(): Promise<{ doc: SiteDocument; source: ContentSource }> {
  if (hasContentApi) {
    const live = await tryFetch(`${API_BASE}/api/content`, { cache: 'no-store' });
    if (live) return { doc: live as SiteDocument, source: 'api' };
  }

  const snapshot = await tryFetch('/content.json', { cache: 'no-store' });
  if (snapshot) return { doc: snapshot as SiteDocument, source: 'snapshot' };

  return { doc: FALLBACK_CONTENT, source: 'bundled' };
}

export async function subscribe(email: string): Promise<{ ok: boolean; message: string }> {
  if (!hasContentApi) {
    return { ok: false, message: 'Signups are not connected yet — please email us instead.' };
  }
  try {
    const res = await fetch(`${API_BASE}/api/subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source: 'website' }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { ok: false, message: data.error || 'Subscription failed' };
    return { ok: true, message: data.added ? 'Subscribed' : 'Already subscribed' };
  } catch {
    return { ok: false, message: 'Cannot reach the server right now' };
  }
}

/* ---------------------------------------------------------------- */
/* Admin                                                             */
/* ---------------------------------------------------------------- */

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t: string) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

class ApiError extends Error {
  constructor(message: string, public status: number, public details?: string[]) {
    super(message);
  }
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...(init.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.error || res.statusText, res.status, data.errors);
  return data as T;
}

export async function login(password: string): Promise<string> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  setToken(data.token);
  return data.token;
}

export async function logout() {
  try {
    await api('/api/auth/logout', { method: 'POST' });
  } finally {
    clearToken();
  }
}

export const fetchContentForAdmin = () => api<SiteDocument>('/api/content');

export const saveSection = <K extends ContentSection>(section: K, value: SiteDocument[K]) =>
  api<SiteDocument>(`/api/content/${section}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });

export const saveDocument = (doc: SiteDocument) =>
  api<SiteDocument>('/api/content', { method: 'PUT', body: JSON.stringify(doc) });

export const importDocument = (doc: SiteDocument) =>
  api<SiteDocument>('/api/import', { method: 'POST', body: JSON.stringify(doc) });

export const listBackups = () =>
  api<{ name: string; size: number; createdAt: string }[]>('/api/backups');

export const restoreBackup = (name: string) =>
  api<SiteDocument>(`/api/backups/${encodeURIComponent(name)}/restore`, { method: 'POST' });

export const listSubscribers = () =>
  api<{ id: string; email: string; createdAt: string; source: string }[]>('/api/subscribers');

export const deleteSubscriber = (id: string) =>
  api(`/api/subscribers/${encodeURIComponent(id)}`, { method: 'DELETE' });

/** Browser-side download so exports never depend on a popup or a new tab. */
export function downloadJSON(doc: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadSubscribersCSV() {
  const res = await fetch(`${API_BASE}/api/subscribers?format=csv`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('Export failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `koi-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
