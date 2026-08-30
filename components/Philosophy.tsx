/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * The core philosophy band: one continuous chain of steps, plus a closing line.
 *
 * The brand gradient is not repeated per segment — it is sliced across the whole
 * chain, so the run from the first node to the last *is* the purple-to-orange
 * gradient. Horizontal on desktop, vertical on mobile.
 */

import React from 'react';
import type { PhilosophyContent } from '../types';

const FROM_RGB = [168, 85, 247] as const; // #A855F7
const TO_RGB = [249, 115, 22] as const; // #F97316

/** Colour at position t (0..1) along the brand gradient. */
const mix = (t: number) =>
  `rgb(${FROM_RGB.map((c, i) => Math.round(c + (TO_RGB[i] - c) * t)).join(', ')})`;

interface PhilosophyProps {
  data: PhilosophyContent;
}

const Philosophy: React.FC<PhilosophyProps> = ({ data }) => {
  const { label, title, steps, closing } = data;
  const clean = steps.filter((s) => s.trim() !== '');
  if (clean.length === 0 && !closing) return null;

  const stopAt = (i: number) => mix(clean.length > 1 ? i / (clean.length - 1) : 0);

  return (
    <div className="border-y border-slate-200 bg-white px-6 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-5xl">
        {(label || title) && (
          <div className="mb-12 text-center md:mb-20">
            {label && (
              <span className="mb-4 block bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-xs font-bold uppercase tracking-[0.2em] text-transparent">
                {label}
              </span>
            )}
            {title && <h2 className="font-serif text-4xl text-slate-900 md:text-5xl">{title}</h2>}
          </div>
        )}

        <ol className="flex flex-col items-stretch md:flex-row md:items-start">
          {clean.map((step, i) => (
            <React.Fragment key={`${step}-${i}`}>
              {/*
                Connector — vertical on mobile, horizontal on desktop.
                pt-[3px] centres the 1px rule on the 7px dot.
              */}
              {i > 0 && (
                <li aria-hidden className="flex items-center justify-center md:flex-1 md:pt-[3px]">
                  <span
                    className="my-3 h-8 w-px md:my-0 md:h-px md:w-full"
                    style={{
                      backgroundImage: `linear-gradient(${stopAt(i - 1)}, ${stopAt(i)})`,
                    }}
                  />
                </li>
              )}

              <li className="flex flex-col items-center text-center md:w-32 md:shrink-0">
                <span
                  className="mb-4 h-[7px] w-[7px] shrink-0 rounded-full md:mb-5"
                  style={{
                    backgroundColor: stopAt(i),
                    boxShadow: `0 0 0 5px ${stopAt(i)}1f`,
                  }}
                />
                <span
                  className="mb-1.5 font-mono text-[10px] font-bold tracking-[0.2em]"
                  style={{ color: stopAt(i) }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-xl leading-tight text-slate-900 md:text-2xl">
                  {step}
                </span>
              </li>
            </React.Fragment>
          ))}
        </ol>

        {closing && (
          <div className="mt-14 flex justify-center md:mt-20">
            <span
              className="inline-block px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-900 md:text-sm"
              style={{
                background:
                  'linear-gradient(#fff, #fff) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box',
                border: '1px solid transparent',
                borderRadius: '0.75rem',
              }}
            >
              {closing}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Philosophy;
