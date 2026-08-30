/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The CMS. Reached at #/admin.
 *
 * Editing model: the whole document is held in local state and written back as
 * one atomic save. That keeps "unsaved changes" honest and makes the export
 * button always match what is on screen.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { SiteDocument, ContentSection } from '../types';
import {
  API_BASE,
  clearToken,
  fetchContentForAdmin,
  getToken,
  hasContentApi,
  login,
  logout,
  saveDocument,
} from '../services/contentService';
import { Button } from './ui';

import SitePanel from './panels/SitePanel';
import HeroPanel from './panels/HeroPanel';
import AboutPanel from './panels/AboutPanel';
import PortfolioPanel from './panels/PortfolioPanel';
import JournalPanel from './panels/JournalPanel';
import AssistantPanel from './panels/AssistantPanel';
import KnowledgePanel from './panels/KnowledgePanel';
import SubscribersPanel from './panels/SubscribersPanel';
import DataPanel from './panels/DataPanel';

type TabId = ContentSection | 'subscribers' | 'data';

const TABS: { id: TabId; label: string; group: string }[] = [
  { id: 'site', label: 'Site & Branding', group: 'Content' },
  { id: 'hero', label: 'Hero', group: 'Content' },
  { id: 'about', label: 'Our Core', group: 'Content' },
  { id: 'portfolio', label: 'IP Portfolio', group: 'Content' },
  { id: 'journal', label: 'Insights', group: 'Content' },
  { id: 'assistant', label: 'Q&A Widget', group: 'Content' },
  { id: 'knowledge', label: 'Knowledge Base', group: 'Content' },
  { id: 'subscribers', label: 'Subscribers', group: 'Operations' },
  { id: 'data', label: 'Backup & Export', group: 'Operations' },
];

/* ---------------------------------------------------------------- */
/* Login                                                             */
/* ---------------------------------------------------------------- */

const LoginScreen: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(password);
      onSuccess();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="font-serif text-2xl text-slate-900">KOI Content Studio</h1>
        <p className="mt-1 mb-6 text-sm text-slate-500">Sign in to edit the website.</p>

        <label className="block">
          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Password
          </span>
          <input
            type="password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/15"
          />
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#A855F7] to-[#F97316] py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110 disabled:opacity-40"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-400">
          API: <span className="font-mono">{API_BASE}</span>
          <br />
          The password lives in <span className="font-mono">.env</span> as{' '}
          <span className="font-mono">ADMIN_PASSWORD</span>.
        </p>
      </form>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Shell                                                             */
/* ---------------------------------------------------------------- */

/**
 * The published site ships this bundle but no server, so the CMS cannot work
 * there. Say so plainly rather than showing a login that can never succeed.
 */
const NoApiScreen: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-900 px-6">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
      <h1 className="font-serif text-2xl text-slate-900">Content Studio</h1>
      <p className="mt-3 text-sm leading-relaxed text-slate-500">
        Editing runs on your own machine, not on the published site. Open the project locally and
        run <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">npm start</code>,
        then visit{' '}
        <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
          localhost:3000/#/admin
        </code>
        .
      </p>
      <a
        href="/"
        className="mt-6 inline-block rounded-lg bg-gradient-to-r from-[#A855F7] to-[#F97316] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:brightness-110"
      >
        Back to the site
      </a>
    </div>
  </div>
);

const AdminApp: React.FC = () => {
  if (!hasContentApi) return <NoApiScreen />;
  return <AdminStudio />;
};

const AdminStudio: React.FC = () => {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const [doc, setDoc] = useState<SiteDocument | null>(null);
  const [savedDoc, setSavedDoc] = useState<SiteDocument | null>(null);
  const [tab, setTab] = useState<TabId>('site');
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      setLoadError('');
      const fetched = await fetchContentForAdmin();
      setDoc(fetched);
      setSavedDoc(fetched);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.toLowerCase().includes('authenticat')) {
        clearToken();
        setAuthed(false);
      } else {
        setLoadError(msg);
      }
    }
  }, []);

  useEffect(() => {
    if (authed) load();
  }, [authed, load]);

  const dirty = useMemo(
    () => Boolean(doc && savedDoc && JSON.stringify(doc) !== JSON.stringify(savedDoc)),
    [doc, savedDoc],
  );

  // Guard against losing edits to a stray refresh or tab close
  useEffect(() => {
    if (!dirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [dirty]);

  const flash = (kind: 'ok' | 'error', text: string) => {
    setToast({ kind, text });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSave = async () => {
    if (!doc) return;
    setSaving(true);
    try {
      const saved = await saveDocument(doc);
      setDoc(saved);
      setSavedDoc(saved);
      flash('ok', 'Saved. The website is updated.');
    } catch (e) {
      flash('error', `Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  };

  // Ctrl/Cmd+S saves, like every other editor
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (dirty && !saving) handleSave();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
        <p className="max-w-md text-sm text-red-600">{loadError}</p>
        <p className="max-w-md text-xs text-slate-500">
          Is the API running? Start it with <span className="font-mono">npm run server</span>. It should be
          listening at <span className="font-mono">{API_BASE}</span>.
        </p>
        <Button variant="ghost" onClick={load}>
          Retry
        </Button>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-400">
        Loading content…
      </div>
    );
  }

  const set = <K extends ContentSection>(key: K, value: SiteDocument[K]) =>
    setDoc({ ...doc, [key]: value });

  const groups = [...new Set(TABS.map((t) => t.group))];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-6 py-3">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg">KOI Content Studio</span>
            <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-500">
              v5.0
            </span>
            {dirty && (
              <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Unsaved changes
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button variant="subtle" onClick={() => window.open('/', '_blank')}>
              View site
            </Button>
            <Button variant="ghost" onClick={load} disabled={saving}>
              Revert
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!dirty || saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
            <Button
              variant="subtle"
              onClick={async () => {
                if (dirty && !confirm('You have unsaved changes. Sign out anyway?')) return;
                await logout();
                setAuthed(false);
              }}
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1500px] gap-8 px-6 py-8">
        {/* Sidebar */}
        <nav className="w-56 shrink-0">
          <div className="sticky top-24 space-y-6">
            {groups.map((group) => (
              <div key={group}>
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {group}
                </p>
                <div className="space-y-0.5">
                  {TABS.filter((t) => t.group === group).map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                        tab === t.id
                          ? 'bg-slate-900 font-semibold text-white'
                          : 'text-slate-600 hover:bg-slate-200/60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>

        {/* Panel */}
        <main className="min-w-0 flex-1 pb-24">
          {tab === 'site' && <SitePanel value={doc.site} onChange={(v) => set('site', v)} />}
          {tab === 'hero' && <HeroPanel value={doc.hero} onChange={(v) => set('hero', v)} />}
          {tab === 'about' && <AboutPanel value={doc.about} onChange={(v) => set('about', v)} />}
          {tab === 'portfolio' && (
            <PortfolioPanel value={doc.portfolio} onChange={(v) => set('portfolio', v)} />
          )}
          {tab === 'journal' && <JournalPanel value={doc.journal} onChange={(v) => set('journal', v)} />}
          {tab === 'assistant' && (
            <AssistantPanel value={doc.assistant} onChange={(v) => set('assistant', v)} />
          )}
          {tab === 'knowledge' && (
            <KnowledgePanel value={doc.knowledge} onChange={(v) => set('knowledge', v)} />
          )}
          {tab === 'subscribers' && <SubscribersPanel />}
          {tab === 'data' && (
            <DataPanel
              doc={doc}
              hasUnsavedChanges={dirty}
              onReplaced={(replaced) => {
                setDoc(replaced);
                setSavedDoc(replaced);
              }}
            />
          )}
        </main>
      </div>

      {/* Sticky save bar */}
      {dirty && (
        <div className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-4 rounded-full border border-slate-700 bg-slate-900 py-2 pl-5 pr-2 text-white shadow-2xl">
          <span className="text-xs font-medium">Unsaved changes</span>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-full bg-gradient-to-r from-[#A855F7] to-[#F97316] px-5 py-2 text-xs font-bold uppercase tracking-widest transition-all hover:brightness-110 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-lg px-5 py-3 text-sm font-medium text-white shadow-xl ${
            toast.kind === 'ok' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}
    </div>
  );
};

export default AdminApp;
