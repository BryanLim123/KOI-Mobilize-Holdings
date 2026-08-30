/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { SiteContent } from '../../types';
import { Card, Grid, ListEditor, MediaField, PanelHeader, TextArea, TextField } from '../ui';

interface Props {
  value: SiteContent;
  onChange: (v: SiteContent) => void;
}

const SitePanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof SiteContent>(key: K, v: SiteContent[K]) =>
    onChange({ ...value, [key]: v });

  const setFooter = <K extends keyof SiteContent['footer']>(key: K, v: SiteContent['footer'][K]) =>
    onChange({ ...value, footer: { ...value.footer, [key]: v } });

  return (
    <div className="space-y-8">
      <PanelHeader
        title="Site & Branding"
        hint="Identity, navigation and footer. These appear on every page."
      />

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Identity</h3>
        <Grid>
          <TextField label="Brand name" value={value.brandName} onChange={(v) => set('brandName', v)} />
          <TextField label="Company name" value={value.companyName} onChange={(v) => set('companyName', v)} />
          <TextField
            label="Contact email"
            value={value.contactEmail}
            onChange={(v) => set('contactEmail', v)}
          />
          <TextField label="Copyright line" value={value.copyright} onChange={(v) => set('copyright', v)} />
        </Grid>
        <div className="mt-5 space-y-5">
          <MediaField label="Navbar logo" value={value.logoUrl} onChange={(v) => set('logoUrl', v)} />
          <MediaField
            label="Loading-screen logo"
            value={value.loaderLogoUrl}
            onChange={(v) => set('loaderLogoUrl', v)}
            hint="Shown on the dark splash while content loads."
          />
        </div>
      </Card>

      <Card>
        <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-slate-400">Navigation</h3>
        <p className="mb-4 text-xs text-slate-500">
          Target must be one of: <code className="font-mono">about</code>,{' '}
          <code className="font-mono">products</code>, <code className="font-mono">journal</code>,{' '}
          <code className="font-mono">footer</code>.
        </p>
        <ListEditor
          items={value.nav}
          onChange={(v) => set('nav', v)}
          makeNew={() => ({ label: 'New link', target: 'about' })}
          addLabel="Add nav link"
          renderTitle={(item) => `${item.label}  →  #${item.target}`}
          renderBody={(item, update) => (
            <Grid>
              <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
              <TextField label="Target section" value={item.target} onChange={(v) => update({ target: v })} mono />
            </Grid>
          )}
        />
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Footer</h3>
        <div className="space-y-5">
          <TextArea label="Footer blurb" value={value.footer.blurb} onChange={(v) => setFooter('blurb', v)} rows={3} />
          <Grid>
            <TextField
              label="Newsletter heading"
              value={value.footer.newsletterTitle}
              onChange={(v) => setFooter('newsletterTitle', v)}
            />
            <TextField
              label="Success message"
              value={value.footer.newsletterSuccess}
              onChange={(v) => setFooter('newsletterSuccess', v)}
            />
          </Grid>
          <TextArea
            label="Newsletter blurb"
            value={value.footer.newsletterBlurb}
            onChange={(v) => setFooter('newsletterBlurb', v)}
            rows={3}
          />

          <div>
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">Legal links</h4>
            <ListEditor
              items={value.footer.legalLinks}
              onChange={(v) => setFooter('legalLinks', v)}
              makeNew={() => ({ label: 'New link', href: '#' })}
              addLabel="Add legal link"
              renderTitle={(item) => item.label}
              renderBody={(item, update) => (
                <Grid>
                  <TextField label="Label" value={item.label} onChange={(v) => update({ label: v })} />
                  <TextField label="URL" value={item.href} onChange={(v) => update({ href: v })} mono />
                </Grid>
              )}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SitePanel;
