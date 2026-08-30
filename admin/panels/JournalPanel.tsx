/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { JournalContent, JournalArticle } from '../../types';
import { parseArticleContent } from '../../components/JournalDetail';
import {
  Button,
  Card,
  Grid,
  ListEditor,
  MediaField,
  PanelHeader,
  TextArea,
  TextField,
  Toggle,
  uid,
} from '../ui';

interface Props {
  value: JournalContent;
  onChange: (v: JournalContent) => void;
}

/** Inline preview so editors can see what [DP] / [Q] / [B] actually produce. */
const ContentEditor: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Article body</span>
        <Button variant="subtle" onClick={() => setShowPreview(!showPreview)}>
          {showPreview ? 'Edit' : 'Preview'}
        </Button>
      </div>

      {showPreview ? (
        <div className="max-h-[500px] overflow-y-auto rounded-lg border border-slate-200 bg-white p-6 font-light leading-loose text-slate-600">
          {parseArticleContent(value) || <span className="italic text-slate-400">Nothing to preview.</span>}
        </div>
      ) : (
        <textarea
          value={value ?? ''}
          rows={18}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y rounded-lg border border-slate-300 bg-white px-3 py-2.5 font-mono text-xs leading-relaxed text-slate-900 outline-none focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/15"
        />
      )}

      <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-500">
        Separate blocks with a blank line. Start a block with{' '}
        <code className="font-mono font-bold text-slate-700">[DP]</code> for a drop-cap opener,{' '}
        <code className="font-mono font-bold text-slate-700">[Q]</code> for a pull quote, or{' '}
        <code className="font-mono font-bold text-slate-700">[B]</code> for a dark panel (use{' '}
        <code className="font-mono font-bold text-slate-700">|</code> to split it into lines). Anything else is a
        normal paragraph.
      </div>
    </div>
  );
};

const JournalPanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof JournalContent>(key: K, v: JournalContent[K]) =>
    onChange({ ...value, [key]: v });

  const publishedCount = value.articles.filter((a) => a.published !== false).length;

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Insights"
        hint={`${publishedCount} of ${value.articles.length} article${
          value.articles.length === 1 ? '' : 's'
        } visible on the site. Articles are sorted newest-first by date, 3 per page.`}
      />

      <Card>
        <Grid>
          <TextField label="Section label" value={value.sectionLabel} onChange={(v) => set('sectionLabel', v)} />
          <TextField label="Section title" value={value.sectionTitle} onChange={(v) => set('sectionTitle', v)} />
        </Grid>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Articles</h3>
        <ListEditor<JournalArticle>
          items={value.articles}
          onChange={(v) => set('articles', v)}
          addLabel="Add article"
          emptyLabel="No articles yet."
          makeNew={() => ({
            id: uid('post'),
            title: 'New article',
            date: new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            excerpt: '',
            image: '',
            content: '',
            sourceLink: '',
            published: false,
          })}
          renderTitle={(a) => (
            <span className="flex items-center gap-2">
              {a.published === false && (
                <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700">
                  Draft
                </span>
              )}
              <span className="truncate">{a.title || 'Untitled'}</span>
              <span className="shrink-0 text-xs font-normal text-slate-400">{a.date}</span>
            </span>
          )}
          renderBody={(a, update) => (
            <>
              <Toggle
                label="Published"
                checked={a.published !== false}
                onChange={(v) => update({ published: v })}
                hint="Drafts stay here but never appear on the website."
              />
              <Grid>
                <TextField label="Title" value={a.title} onChange={(v) => update({ title: v })} />
                <TextField
                  label="Date"
                  value={a.date}
                  onChange={(v) => update({ date: v })}
                  hint='Any parseable date, e.g. "March 8, 2025". Controls sort order.'
                />
              </Grid>
              <MediaField label="Cover image" value={a.image} onChange={(v) => update({ image: v })} />
              <TextArea
                label="Excerpt"
                value={a.excerpt}
                onChange={(v) => update({ excerpt: v })}
                rows={3}
                hint="Clamped to 3 lines on the listing card."
              />
              <ContentEditor value={a.content} onChange={(v) => update({ content: v })} />
              <TextField
                label="External source link"
                value={a.sourceLink}
                onChange={(v) => update({ sourceLink: v })}
                mono
                hint="Leave empty to hide the External Source button."
              />
            </>
          )}
        />
      </Card>
    </div>
  );
};

export default JournalPanel;
