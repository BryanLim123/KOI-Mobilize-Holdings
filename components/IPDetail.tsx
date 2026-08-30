/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { IPItem, IPCategory } from '../types';

interface IPDetailProps {
  item: IPItem;
  category: IPCategory;
  onBack: () => void;
}

const IPDetail: React.FC<IPDetailProps> = ({ item, category, onBack }) => (
  <div className="pt-36 min-h-screen bg-white animate-fade-in-up">
    <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
      <button
        onClick={onBack}
        className="group relative mb-8 z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-md
                   bg-slate-900/80 backdrop-blur-md border border-[#A855F7]/30 text-white
                   hover:scale-105 hover:bg-gradient-to-r hover:from-[#A855F7]/90 hover:to-[#F97316]/90 hover:border-transparent hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Left: main image */}
        <div className="flex flex-col gap-4">
          <div className="w-full aspect-[4/5] bg-slate-100 overflow-hidden shadow-sm">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover animate-fade-in-up"
            />
          </div>
        </div>

        {/* Right: details */}
        <div className="flex flex-col justify-center max-w-xl">
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{category.name}</span>
          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">{item.name}</h1>

          {item.tagline && (
            <p className="text-xl font-light text-slate-500 italic mb-8">{item.tagline}</p>
          )}

          <p className="text-slate-600 leading-relaxed font-light text-lg mb-8 border-b border-slate-200 pb-8 whitespace-pre-line">
            {item.description}
          </p>

          {item.actionLink && (
            <a
              href={item.actionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center mb-8 px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-900 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] w-full md:w-fit"
              style={{
                background:
                  'linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box',
                border: '1px solid transparent',
                borderRadius: '0.75rem',
                backdropFilter: 'blur(12px)',
              }}
            >
              {item.actionLabel || 'View Case Study'}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          )}

          {item.inquiryLabel && (
            <div className="flex flex-col gap-4">
              <button
                disabled={!item.inquiryEnabled}
                className={
                  item.inquiryEnabled
                    ? 'w-full py-5 bg-slate-900 text-white text-sm font-bold text-center tracking-widest transition-colors hover:bg-slate-800'
                    : 'w-full py-5 bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed text-center border border-slate-200 tracking-widest'
                }
                onClick={() => {
                  if (item.inquiryEnabled) window.location.href = '#footer';
                }}
              >
                {item.inquiryLabel}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default IPDetail;
