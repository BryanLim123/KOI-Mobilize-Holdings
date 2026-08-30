/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import type { KnowledgeItem } from '../../types';
import { Card, ListEditor, PanelHeader, TextArea, TextField, uid } from '../ui';

interface Props {
  value: KnowledgeItem[];
  onChange: (v: KnowledgeItem[]) => void;
}

const KnowledgePanel: React.FC<Props> = ({ value, onChange }) => {
  const [query, setQuery] = useState('');

  const matchCount = useMemo(() => {
    if (!query.trim()) return value.length;
    const q = query.toLowerCase();
    return value.filter((k) => `${k.category} ${k.information}`.toLowerCase().includes(q)).length;
  }, [value, query]);

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Knowledge Base"
        hint="Reference copy about the brand, lore and product. Not rendered on the site today — it is the source material for press kits, decks and any future assistant."
      />

      <Card>
        <div className="mb-4 flex items-end gap-4">
          <div className="flex-1">
            <TextField
              label="Filter"
              value={query}
              onChange={setQuery}
              placeholder="Search category or text..."
            />
          </div>
          <p className="pb-3 text-xs text-slate-500">
            {matchCount} of {value.length} entries
          </p>
        </div>

        <ListEditor<KnowledgeItem>
          items={value}
          onChange={onChange}
          addLabel="Add entry"
          emptyLabel="No knowledge entries yet."
          makeNew={() => ({ id: uid('k'), category: 'General', information: '' })}
          renderTitle={(item) => (
            <span className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                {item.category || 'General'}
              </span>
              <span className="truncate font-normal text-slate-500">
                {item.information.slice(0, 90) || 'Empty'}
              </span>
            </span>
          )}
          renderBody={(item, update) => (
            <>
              <TextField
                label="Category"
                value={item.category}
                onChange={(v) => update({ category: v })}
              />
              <TextArea
                label="Information"
                value={item.information}
                onChange={(v) => update({ information: v })}
                rows={6}
              />
            </>
          )}
        />
      </Card>
    </div>
  );
};

export default KnowledgePanel;
