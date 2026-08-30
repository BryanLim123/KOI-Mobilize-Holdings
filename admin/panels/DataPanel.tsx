/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import type { SiteDocument } from '../../types';
import { downloadJSON, importDocument, listBackups, restoreBackup } from '../../services/contentService';
import { Button, Card, PanelHeader } from '../ui';

interface Props {
  doc: SiteDocument;
  /** Called after an import or restore replaces the whole document. */
  onReplaced: (doc: SiteDocument) => void;
  hasUnsavedChanges: boolean;
}

type Backup = { name: string; size: number; createdAt: string };

const DataPanel: React.FC<Props> = ({ doc, onReplaced, hasUnsavedChanges }) => {
  const [backups, setBackups] = useState<Backup[] | null>(null);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    try {
      setBackups(await listBackups());
    } catch (e) {
      setStatus({ kind: 'error', text: (e as Error).message });
      setBackups([]);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleImport = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as SiteDocument;
      if (!confirm(`Replace ALL live content with "${file.name}"?\n\nA backup of the current content is taken first.`)) {
        return;
      }
      const saved = await importDocument(parsed);
      onReplaced(saved);
      setStatus({ kind: 'ok', text: `Imported ${file.name}.` });
      refresh();
    } catch (e) {
      setStatus({ kind: 'error', text: `Import failed: ${(e as Error).message}` });
    }
  };

  const handleRestore = async (name: string) => {
    if (!confirm(`Restore ${name}?\n\nThe current content is backed up first, so this is reversible.`)) return;
    try {
      const restored = await restoreBackup(name);
      onReplaced(restored);
      setStatus({ kind: 'ok', text: `Restored ${name}.` });
      refresh();
    } catch (e) {
      setStatus({ kind: 'error', text: (e as Error).message });
    }
  };

  const counts = {
    'IP categories': doc.portfolio.categories.length,
    'IP entries': doc.portfolio.categories.reduce((n, c) => n + c.items.length, 0),
    Pillars: doc.about.pillars.length,
    Articles: doc.journal.articles.length,
    'Q&A': doc.assistant.qaItems.length,
    Knowledge: doc.knowledge.length,
  };

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Backup & Export"
        hint="Everything lives in one JSON file. Export it, edit it elsewhere, import it back — nothing is locked into this tool."
      />

      {status && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm ${
            status.kind === 'ok'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {status.text}
        </div>
      )}

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Current content</h3>
        <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-3">
          {Object.entries(counts).map(([label, n]) => (
            <div key={label} className="rounded-lg bg-slate-50 px-4 py-3">
              <div className="text-2xl font-semibold text-slate-900">{n}</div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{label}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-500">
          Last saved {new Date(doc.updatedAt).toLocaleString()} by {doc.updatedBy}.
        </p>
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">Export / Import</h3>
        <p className="mb-4 text-xs text-slate-500">
          {hasUnsavedChanges
            ? 'You have unsaved edits — the export below reflects what is on screen, not what is saved.'
            : 'Export writes exactly what is live right now.'}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={() => downloadJSON(doc, `koi-content-${new Date().toISOString().slice(0, 10)}.json`)}
          >
            Export JSON
          </Button>
          <Button variant="ghost" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = '';
            }}
          />
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Automatic backups</h3>
            <p className="mt-1 text-xs text-slate-500">
              A snapshot is taken before every save. The 40 most recent are kept.
            </p>
          </div>
          <Button variant="subtle" onClick={refresh}>
            Refresh
          </Button>
        </div>

        {backups === null ? (
          <p className="py-8 text-center text-sm text-slate-400">Loading…</p>
        ) : backups.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-400">No backups yet.</p>
        ) : (
          <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto rounded-lg border border-slate-200">
            {backups.map((b) => (
              <div key={b.name} className="flex items-center justify-between gap-4 px-4 py-2.5">
                <div className="min-w-0">
                  <div className="truncate font-mono text-xs text-slate-700">{b.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {new Date(b.createdAt).toLocaleString()} · {(b.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <Button variant="ghost" onClick={() => handleRestore(b.name)}>
                  Restore
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-slate-400">Deploying a static build</h3>
        <p className="text-xs leading-relaxed text-slate-500">
          Every save also writes <code className="font-mono text-slate-700">public/content.json</code>. To ship a
          version that needs no server running, run{' '}
          <code className="font-mono text-slate-700">npm run publish:content</code> and then{' '}
          <code className="font-mono text-slate-700">npm run build</code>, and upload{' '}
          <code className="font-mono text-slate-700">dist/</code>. The site reads that snapshot when the API is
          unreachable.
        </p>
      </Card>
    </div>
  );
};

export default DataPanel;
