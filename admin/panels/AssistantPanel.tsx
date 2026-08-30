/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { AssistantContent, QAItem } from '../../types';
import { Card, Grid, ListEditor, PanelHeader, TextArea, TextField, Toggle, uid } from '../ui';

interface Props {
  value: AssistantContent;
  onChange: (v: AssistantContent) => void;
}

const AssistantPanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof AssistantContent>(key: K, v: AssistantContent[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Q&A Widget"
        hint="The floating panel in the bottom-right corner. It plays this script in order — no AI, no API key."
      />

      <Card>
        <div className="space-y-5">
          <Toggle
            label="Show the Q&A widget on the site"
            checked={value.enabled}
            onChange={(v) => set('enabled', v)}
          />
          <Grid>
            <TextField label="Panel title" value={value.title} onChange={(v) => set('title', v)} />
          </Grid>
          <TextArea
            label="Welcome message"
            value={value.welcomeMessage}
            onChange={(v) => set('welcomeMessage', v)}
            rows={3}
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">
          Question script ({value.qaItems.length})
        </h3>
        <p className="mb-4 text-xs text-slate-500">
          Visitors step through these in order and the list loops. Reorder with the arrows.
        </p>
        <ListEditor<QAItem>
          items={value.qaItems}
          onChange={(v) => set('qaItems', v)}
          addLabel="Add question"
          emptyLabel="No questions yet."
          makeNew={() => ({ id: uid('qa'), question: '', answer: '' })}
          renderTitle={(item, i) => `${i + 1}. ${item.question || 'Untitled question'}`}
          renderBody={(item, update) => (
            <>
              <TextArea
                label="Question"
                value={item.question}
                onChange={(v) => update({ question: v })}
                rows={2}
              />
              <TextArea label="Answer" value={item.answer} onChange={(v) => update({ answer: v })} rows={5} />
            </>
          )}
        />
      </Card>
    </div>
  );
};

export default AssistantPanel;
