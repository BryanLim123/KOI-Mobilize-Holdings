/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { PortfolioContent, IPCategory, IPItem } from '../../types';
import {
  Card,
  Grid,
  ListEditor,
  MediaField,
  PanelHeader,
  TextArea,
  TextField,
  Toggle,
  slugify,
  uid,
} from '../ui';

interface Props {
  value: PortfolioContent;
  onChange: (v: PortfolioContent) => void;
}

const newItem = (categoryName: string): IPItem => ({
  id: `${slugify(categoryName) || 'ip'}-${uid('x').slice(2)}`,
  name: 'New IP',
  tagline: '',
  description: '',
  imageUrl: '',
  actionLink: '',
  actionLabel: 'View Case Study',
  inquiryLabel: 'INQUIRE ABOUT LICENSING ( coming soon )',
  inquiryEnabled: false,
});

const PortfolioPanel: React.FC<Props> = ({ value, onChange }) => {
  const set = <K extends keyof PortfolioContent>(key: K, v: PortfolioContent[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-8">
      <PanelHeader
        title="IP Portfolio"
        hint="Categories are the cards on the hub; each category holds the IP entries shown inside it."
      />

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Section copy</h3>
        <Grid>
          <TextField label="Section label" value={value.sectionLabel} onChange={(v) => set('sectionLabel', v)} />
          <TextField label="Section title" value={value.sectionTitle} onChange={(v) => set('sectionTitle', v)} />
          <TextField
            label="Section subtitle"
            value={value.sectionSubtitle}
            onChange={(v) => set('sectionSubtitle', v)}
          />
          <TextField
            label="Count suffix"
            value={value.countSuffix}
            onChange={(v) => set('countSuffix', v)}
            hint='Rendered as "3 IPs Discovered".'
          />
          <TextField label="Enter-category label" value={value.enterLabel} onChange={(v) => set('enterLabel', v)} />
        </Grid>
      </Card>

      <Card>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">Categories</h3>
        <ListEditor<IPCategory>
          items={value.categories}
          onChange={(v) => set('categories', v)}
          addLabel="Add category"
          emptyLabel="No categories yet."
          makeNew={() => ({
            id: uid('cat'),
            name: 'New Category',
            tagline: '',
            coverImage: '',
            items: [],
          })}
          renderTitle={(cat) => `${cat.name || 'Untitled'}  ·  ${cat.items.length} IP${cat.items.length === 1 ? '' : 's'}`}
          renderBody={(cat, updateCat) => (
            <>
              <Grid>
                <TextField label="Category name" value={cat.name} onChange={(v) => updateCat({ name: v })} />
                <TextField
                  label="ID"
                  value={cat.id}
                  onChange={(v) => updateCat({ id: v })}
                  mono
                  hint="Internal only. Changing it is safe."
                />
              </Grid>
              <TextField
                label="Cover tagline"
                value={cat.tagline}
                onChange={(v) => updateCat({ tagline: v })}
                hint="One line shown on the hub card."
              />
              <MediaField
                label="Cover image"
                value={cat.coverImage}
                onChange={(v) => updateCat({ coverImage: v })}
              />

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h4 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  IP entries in “{cat.name}”
                </h4>
                <ListEditor<IPItem>
                  items={cat.items}
                  onChange={(items) => updateCat({ items })}
                  addLabel="Add IP entry"
                  emptyLabel="This category has no IP entries yet."
                  makeNew={() => newItem(cat.name)}
                  renderTitle={(item) => item.name || 'Untitled'}
                  renderBody={(item, updateItem) => (
                    <>
                      <Grid>
                        <TextField label="Name" value={item.name} onChange={(v) => updateItem({ name: v })} />
                        <TextField
                          label="Tagline"
                          value={item.tagline}
                          onChange={(v) => updateItem({ tagline: v })}
                          hint="Italic line under the title. Optional."
                        />
                      </Grid>
                      <MediaField
                        label="Image"
                        value={item.imageUrl}
                        onChange={(v) => updateItem({ imageUrl: v })}
                      />
                      <TextArea
                        label="Description"
                        value={item.description}
                        onChange={(v) => updateItem({ description: v })}
                        rows={8}
                        hint="Full body text on the detail page. Line breaks are preserved."
                      />
                      <Grid>
                        <TextField
                          label="Action link"
                          value={item.actionLink}
                          onChange={(v) => updateItem({ actionLink: v })}
                          mono
                          hint="Leave empty to hide the button."
                        />
                        <TextField
                          label="Action button label"
                          value={item.actionLabel}
                          onChange={(v) => updateItem({ actionLabel: v })}
                        />
                      </Grid>
                      <TextField
                        label="Licensing button label"
                        value={item.inquiryLabel}
                        onChange={(v) => updateItem({ inquiryLabel: v })}
                        hint="Leave empty to remove the button entirely."
                      />
                      <Toggle
                        label="Licensing button is clickable"
                        checked={item.inquiryEnabled}
                        onChange={(v) => updateItem({ inquiryEnabled: v })}
                        hint="Off = greyed out. On = scrolls the visitor to the contact footer."
                      />
                    </>
                  )}
                />
              </div>
            </>
          )}
        />
      </Card>
    </div>
  );
};

export default PortfolioPanel;
