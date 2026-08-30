/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Shared form controls for the CMS. Deliberately plain and dense — this is a
 * working tool, not a marketing page.
 */

import React, { useState } from 'react';
import { isVideoUrl } from '../components/Media';

/* ---------------------------------------------------------------- */
/* Layout                                                            */
/* ---------------------------------------------------------------- */

export const PanelHeader: React.FC<{ title: string; hint?: string; children?: React.ReactNode }> = ({
  title,
  hint,
  children,
}) => (
  <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-5 mb-8">
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      {hint && <p className="mt-1 max-w-2xl text-sm text-slate-500">{hint}</p>}
    </div>
    {children && <div className="flex shrink-0 items-center gap-2">{children}</div>}
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => (
  <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</div>
);

export const Grid: React.FC<{ children: React.ReactNode; cols?: 1 | 2 }> = ({ children, cols = 2 }) => (
  <div className={`grid gap-5 ${cols === 2 ? 'md:grid-cols-2' : ''}`}>{children}</div>
);

/* ---------------------------------------------------------------- */
/* Buttons                                                           */
/* ---------------------------------------------------------------- */

type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'subtle';

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#A855F7] to-[#F97316] text-white shadow-sm hover:brightness-110 disabled:opacity-40',
  ghost: 'border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40',
  subtle: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40',
  danger: 'border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-40',
};

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
> = ({ variant = 'ghost', className = '', ...props }) => (
  <button
    {...props}
    className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold uppercase tracking-wider transition-all ${BUTTON_STYLES[variant]} ${className}`}
  />
);

/* ---------------------------------------------------------------- */
/* Fields                                                            */
/* ---------------------------------------------------------------- */

const labelClass = 'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500';
const inputClass =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#A855F7] focus:ring-2 focus:ring-[#A855F7]/15';

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  mono?: boolean;
}

export const TextField: React.FC<FieldProps> = ({ label, value, onChange, placeholder, hint, mono }) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} ${mono ? 'font-mono text-xs' : ''}`}
    />
    {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
  </label>
);

export const TextArea: React.FC<FieldProps & { rows?: number }> = ({
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 5,
  mono,
}) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    <textarea
      value={value ?? ''}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`${inputClass} resize-y leading-relaxed ${mono ? 'font-mono text-xs' : ''}`}
    />
    {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
  </label>
);

export const Toggle: React.FC<{
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  hint?: string;
}> = ({ label, checked, onChange, hint }) => (
  <label className="flex cursor-pointer items-center gap-3 py-1">
    <span
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[#A855F7]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? 'left-[22px]' : 'left-0.5'
        }`}
      />
    </span>
    <span>
      <span className="block text-sm font-medium text-slate-800">{label}</span>
      {hint && <span className="block text-xs text-slate-400">{hint}</span>}
    </span>
  </label>
);

/**
 * URL field with a live thumbnail. Media lives in the Google Cloud bucket —
 * editors paste the public URL and confirm it resolves before saving.
 */
export const MediaField: React.FC<FieldProps> = ({ label, value, onChange, hint }) => {
  const [broken, setBroken] = useState(false);

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="flex gap-3">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {!value ? (
            <span className="text-[10px] uppercase tracking-wider text-slate-400">empty</span>
          ) : broken ? (
            <span className="px-1 text-center text-[10px] font-bold uppercase text-red-500">404</span>
          ) : isVideoUrl(value) ? (
            <video src={value} className="h-full w-full object-cover" muted loop autoPlay playsInline />
          ) : (
            <img
              src={value}
              alt=""
              className="h-full w-full object-cover"
              onError={() => setBroken(true)}
              onLoad={() => setBroken(false)}
            />
          )}
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={value ?? ''}
            placeholder="https://storage.googleapis.com/..."
            onChange={(e) => {
              setBroken(false);
              onChange(e.target.value);
            }}
            className={`${inputClass} font-mono text-xs`}
          />
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
            <span>{hint || '.mp4 / .webm renders as autoplay video, anything else as an image'}</span>
            {value && (
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-[#A855F7] hover:underline"
              >
                open
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Repeatable list                                                   */
/* ---------------------------------------------------------------- */

interface ListEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  /** Called when "Add" is pressed; receives the current count. */
  makeNew: (index: number) => T;
  /** Collapsed row label. */
  renderTitle: (item: T, index: number) => React.ReactNode;
  /** Expanded row body. */
  renderBody: (item: T, update: (patch: Partial<T>) => void, index: number) => React.ReactNode;
  addLabel?: string;
  emptyLabel?: string;
}

export function ListEditor<T>({
  items,
  onChange,
  makeNew,
  renderTitle,
  renderBody,
  addLabel = 'Add item',
  emptyLabel = 'Nothing here yet.',
}: ListEditorProps<T>) {
  const [openIndex, setOpenIndex] = useState<number | null>(items.length === 1 ? 0 : null);

  const update = (index: number, patch: Partial<T>) => {
    const next = items.slice();
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
    setOpenIndex(openIndex === index ? target : openIndex === target ? index : openIndex);
  };

  const remove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    setOpenIndex(null);
  };

  return (
    <div className="space-y-3">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 py-8 text-center text-sm text-slate-400">
          {emptyLabel}
        </p>
      )}

      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex flex-1 items-center gap-3 text-left"
              >
                <span
                  className={`text-slate-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                  aria-hidden
                >
                  ▶
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">
                  {renderTitle(item, index)}
                </span>
              </button>

              <div className="flex shrink-0 items-center gap-1">
                <Button variant="subtle" onClick={() => move(index, -1)} disabled={index === 0} title="Move up">
                  ↑
                </Button>
                <Button
                  variant="subtle"
                  onClick={() => move(index, 1)}
                  disabled={index === items.length - 1}
                  title="Move down"
                >
                  ↓
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    if (confirm('Delete this entry? The change applies when you press Save.')) remove(index);
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>

            {isOpen && (
              <div className="space-y-5 border-t border-slate-200 p-5">
                {renderBody(item, (patch) => update(index, patch), index)}
              </div>
            )}
          </div>
        );
      })}

      <Button
        variant="ghost"
        onClick={() => {
          onChange([...items, makeNew(items.length)]);
          setOpenIndex(items.length);
        }}
      >
        + {addLabel}
      </Button>
    </div>
  );
}

/**
 * Compact editor for a list of short strings. The collapsible ListEditor is
 * overkill when each entry is a single word.
 */
export const StringListEditor: React.FC<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  hint?: string;
  addLabel?: string;
  placeholder?: string;
}> = ({ label, items, onChange, hint, addLabel = 'Add step', placeholder }) => {
  const set = (i: number, v: string) => onChange(items.map((item, n) => (n === i ? v : item)));

  const move = (i: number, delta: number) => {
    const target = i + delta;
    if (target < 0 || target >= items.length) return;
    const next = items.slice();
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  return (
    <div>
      <span className={labelClass}>{label}</span>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-7 shrink-0 text-right font-mono text-xs text-slate-400">
              {String(i + 1).padStart(2, '0')}
            </span>
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) => set(i, e.target.value)}
              className={inputClass}
            />
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="subtle" onClick={() => move(i, -1)} disabled={i === 0} title="Move up">
                ↑
              </Button>
              <Button
                variant="subtle"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                title="Move down"
              >
                ↓
              </Button>
              <Button variant="danger" onClick={() => onChange(items.filter((_, n) => n !== i))}>
                ✕
              </Button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 py-6 text-center text-sm text-slate-400">
            No entries yet.
          </p>
        )}
      </div>

      <div className="mt-3">
        <Button variant="ghost" onClick={() => onChange([...items, ''])}>
          + {addLabel}
        </Button>
      </div>

      {hint && <span className="mt-2 block text-xs text-slate-400">{hint}</span>}
    </div>
  );
};

/* ---------------------------------------------------------------- */

export const slugify = (s: string) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1296).toString(36)}`;
