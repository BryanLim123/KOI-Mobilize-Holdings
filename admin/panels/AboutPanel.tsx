/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { AboutContent, Pillar, PhilosophyContent } from '../../types';
import {
  Card,
  Grid,
  ListEditor,
  MediaField,
  PanelHeader,
  StringListEditor,
  TextArea,
  TextField,
  Toggle,
} from '../ui';

const EMPTY_PHILOSOPHY: PhilosophyContent = {
  enabled: true,
  label: 'Our Philosophy',
  title: 'Core Philosophy',
  steps: [],
  closing: '',
};

interface Props {
  value: AboutContent;
  onChange: (v: AboutContent) => void;
}

const AboutPanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof AboutContent>(key: K, v: AboutContent[K]) => onChange({ ...value, [key]: v });

  const philosophy = value.philosophy ?? EMPTY_PHILOSOPHY;
  const setPhilosophy = <K extends keyof PhilosophyContent>(key: K, v: PhilosophyContent[K]) =>
    onChange({ ...value, philosophy: { ...philosophy, [key]: v } });

  const nextPillarId = (count: number) => `Pillar${String(count + 1).padStart(2, '0')}`;

  return (
    <div className="space-y-8">
      <PanelHeader title="Our Core" hint="Purpose, vision, mission and the strategic pillar cards." />

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Introduction</h3>
        <div className="space-y-5">
          <Grid>
            <TextField
              label="Section label"
              value={value.sectionLabel}
              onChange={(v) => set('sectionLabel', v)}
              hint="Small gradient text above the heading."
            />
            <TextField
              label="Purpose (large heading)"
              value={value.purpose}
              onChange={(v) => set('purpose', v)}
            />
          </Grid>

          <Grid>
            <TextField label="Vision heading" value={value.visionTitle} onChange={(v) => set('visionTitle', v)} />
            <TextField label="Mission heading" value={value.missionTitle} onChange={(v) => set('missionTitle', v)} />
          </Grid>

          <TextArea label="Vision text" value={value.vision} onChange={(v) => set('vision', v)} rows={4} />
          <TextArea label="Mission text" value={value.mission} onChange={(v) => set('mission', v)} rows={4} />

          <MediaField label="Main image" value={value.mainImage} onChange={(v) => set('mainImage', v)} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">Core philosophy</h3>
        <p className="mb-4 text-xs text-slate-500">
          The value chain shown between the intro and the pillar cards. The steps render as one connected
          chain that runs purple to orange; the closing line sits below it in its own pill.
        </p>

        <div className="space-y-5">
          <Toggle
            label="Show the philosophy band on the site"
            checked={philosophy.enabled}
            onChange={(v) => setPhilosophy('enabled', v)}
          />
          <Grid>
            <TextField
              label="Section label"
              value={philosophy.label}
              onChange={(v) => setPhilosophy('label', v)}
              hint="Small gradient text above the heading."
            />
            <TextField
              label="Heading"
              value={philosophy.title}
              onChange={(v) => setPhilosophy('title', v)}
            />
          </Grid>

          <StringListEditor
            label="Chain steps"
            items={philosophy.steps}
            onChange={(v) => setPhilosophy('steps', v)}
            addLabel="Add step"
            placeholder="e.g. Platform"
            hint="One word or short phrase per step. Each step is a node; the arrows between them are drawn automatically, so do not type “From … to …” here."
          />

          <TextField
            label="Closing line"
            value={philosophy.closing}
            onChange={(v) => setPhilosophy('closing', v)}
            hint="The summary statement under the chain. Leave empty to hide it."
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">Strategic pillars</h3>
        <p className="mb-4 text-xs text-slate-500">
          Each pillar is one hover card. The short description shows by default (3 lines); the detail text
          appears in the scrollable panel behind the DETAILS button. A pillar with no detail text hides that
          button entirely.
        </p>
        <ListEditor<Pillar>
          items={value.pillars}
          onChange={(v) => set('pillars', v)}
          addLabel="Add pillar"
          emptyLabel="No pillars yet."
          makeNew={(i) => ({
            id: nextPillarId(i),
            title: 'New Pillar',
            description: '',
            media: '',
            detailContent: '',
          })}
          renderTitle={(item) => `${item.id} — ${item.title || 'Untitled'}`}
          renderBody={(item, update) => (
            <>
              <Grid>
                <TextField
                  label="ID"
                  value={item.id}
                  onChange={(v) => update({ id: v })}
                  mono
                  hint="Shown as the small purple label on the card."
                />
                <TextField label="Title" value={item.title} onChange={(v) => update({ title: v })} />
              </Grid>
              <MediaField label="Card media" value={item.media} onChange={(v) => update({ media: v })} />
              <TextArea
                label="Short description"
                value={item.description}
                onChange={(v) => update({ description: v })}
                rows={4}
                hint="Clamped to 3 lines on the card."
              />
              <TextArea
                label="Detail content"
                value={item.detailContent}
                onChange={(v) => update({ detailContent: v })}
                rows={12}
                hint="Long-form text behind the DETAILS button. Line breaks are preserved."
              />
            </>
          )}
        />
      </Card>
    </div>
  );
};

export default AboutPanel;
