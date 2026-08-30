/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { HeroContent } from '../../types';
import { Card, Grid, MediaField, PanelHeader, TextArea, TextField } from '../ui';

interface Props {
  value: HeroContent;
  onChange: (v: HeroContent) => void;
}

const HeroPanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof HeroContent>(key: K, v: HeroContent[K]) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-8">
      <PanelHeader title="Hero" hint="The full-screen opening section." />

      <Card>
        <div className="space-y-5">
          <TextField
            label="Badge label"
            value={value.badgeLabel}
            onChange={(v) => set('badgeLabel', v)}
            hint="The small pill above the headline. Leave empty to hide it."
          />
          <TextField label="Headline" value={value.title} onChange={(v) => set('title', v)} />
          <TextArea
            label="Subtitle"
            value={value.subtitle}
            onChange={(v) => set('subtitle', v)}
            rows={3}
            hint="Line breaks are preserved on the site."
          />
          <MediaField
            label="Background media"
            value={value.backgroundMedia}
            onChange={(v) => set('backgroundMedia', v)}
            hint="An .mp4 autoplays muted and looped; any image URL renders as a still."
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Call to action</h3>
        <Grid>
          <TextField label="Button text" value={value.ctaText} onChange={(v) => set('ctaText', v)} />
          <TextField
            label="Button text on hover"
            value={value.ctaHoverText}
            onChange={(v) => set('ctaHoverText', v)}
          />
        </Grid>
        <div className="mt-5">
          <TextField
            label="Button link"
            value={value.ctaLink}
            onChange={(v) => set('ctaLink', v)}
            mono
            hint="Leave empty for a decorative button that does not navigate anywhere."
          />
        </div>
      </Card>
    </div>
  );
};

export default HeroPanel;
