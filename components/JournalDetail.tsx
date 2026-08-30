/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import type { JournalArticle } from '../types';

interface JournalDetailProps {
  article: JournalArticle;
  allArticles: JournalArticle[];
  onBack: () => void;
  onNext: (article: JournalArticle) => void;
  /** Sign-off line at the foot of the article. */
  signature?: string;
}

/**
 * Block tags authored in the CMS:
 *   [DP] drop-cap paragraph   [Q] pull quote   [B] dark panel, "|" splits lines
 * Blocks are separated by a blank line.
 */
export const parseArticleContent = (content: string): React.ReactNode => {
  if (!content) return null;

  return content.split(/\n\s*\n/).map((block, index) => {
    const text = block.trim();
    if (!text) return null;

    if (text.startsWith('[DP]')) {
      return (
        <p
          key={index}
          className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-slate-600"
        >
          {text.replace('[DP]', '').trim()}
        </p>
      );
    }

    if (text.startsWith('[Q]')) {
      return (
        <blockquote
          key={index}
          className="border-l-2 border-slate-900 pl-6 italic text-xl text-slate-900 my-10 font-serif"
        >
          "{text.replace('[Q]', '').trim()}"
        </blockquote>
      );
    }

    if (text.startsWith('[B]')) {
      const lines = text.replace('[B]', '').trim().split('|').map((l) => l.trim());
      return (
        <div key={index} className="my-12 p-8 bg-slate-900 text-white font-serif italic text-center">
          {lines.map((line, i) => (
            <p key={i} className={i < lines.length - 1 ? 'mb-2' : ''}>
              {line}
            </p>
          ))}
        </div>
      );
    }

    return (
      <p key={index} className="mb-6 text-slate-600">
        {text}
      </p>
    );
  });
};

const navButtonClass =
  'group flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-sm bg-slate-900/90 backdrop-blur-md border border-[#A855F7]/30 text-white hover:scale-105 hover:bg-gradient-to-r hover:from-[#A855F7]/90 hover:to-[#F97316]/90 hover:border-transparent hover:shadow-md';

const JournalDetail: React.FC<JournalDetailProps> = ({ article, allArticles, onBack, onNext, signature }) => {
  const currentIndex = allArticles.findIndex((a) => a.id === article.id);
  const nextArticle =
    allArticles.length > 1 ? allArticles[(currentIndex + 1) % allArticles.length] : null;

  return (
    <div className="min-h-screen bg-white animate-fade-in-up">
      <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
        <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/30" />
      </div>

      <div className="max-w-3xl mx-auto px-6 md:px-12 -mt-32 relative z-10 pb-32">
        <div className="bg-white p-8 md:p-16 shadow-xl shadow-slate-900/5 border border-slate-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-100 pb-8 gap-6 md:gap-0">
            <div className="flex items-center gap-6 md:gap-8">
              <button onClick={onBack} className={navButtonClass}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to Insights
              </button>

              {nextArticle && (
                <button onClick={() => onNext(nextArticle)} className={navButtonClass}>
                  Next Article
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 self-end md:self-auto">
              {article.date}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-12 leading-tight text-center">
            {article.title}
          </h1>

          <div className="prose prose-slate prose-lg mx-auto font-light leading-loose text-slate-600">
            {parseArticleContent(article.content)}
          </div>

          {article.sourceLink && (
            <div className="mt-12 text-center">
              <a
                href={article.sourceLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest text-slate-900 transition-all duration-300 hover:scale-105 hover:text-[#A855F7]"
                style={{
                  background:
                    'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box',
                  border: '1px solid transparent',
                  borderRadius: '0.75rem',
                }}
              >
                External Source
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          )}

          {signature && (
            <div className="mt-16 pt-12 border-t border-slate-100 flex justify-center">
              <span className="text-xl font-serif italic text-slate-900">{signature}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
