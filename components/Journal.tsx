/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import type { JournalContent, JournalArticle } from '../types';

interface JournalProps {
  data: JournalContent;
  onArticleClick: (article: JournalArticle) => void;
}

const ITEMS_PER_PAGE = 3;

const Journal: React.FC<JournalProps> = ({ data, onArticleClick }) => {
  const [pageIndex, setPageIndex] = useState(0);

  // Unpublished drafts stay in the CMS but never reach the site
  const sortedArticles = useMemo(() => {
    return data.articles
      .filter((a) => a.published !== false)
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (isNaN(dateA)) return 1;
        if (isNaN(dateB)) return -1;
        return dateB - dateA;
      });
  }, [data.articles]);

  const totalPages = Math.ceil(sortedArticles.length / ITEMS_PER_PAGE);
  const safePageIndex = totalPages > 0 ? pageIndex % totalPages : 0;

  const visibleArticles = useMemo(() => {
    const start = safePageIndex * ITEMS_PER_PAGE;
    return sortedArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedArticles, safePageIndex]);

  return (
    <section id="journal" className="bg-slate-50 py-16 md:py-32 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 pb-8 border-b border-slate-200">
          <div>
            <span className="block text-xs font-bold uppercase tracking-[0.2em] mb-4 bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">
              {data.sectionLabel}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-slate-900">{data.sectionTitle}</h2>
          </div>

          {totalPages > 1 && (
            <div className="flex gap-6 mt-8 md:mt-0">
              <button
                onClick={() => setPageIndex((p) => (p - 1 + totalPages) % totalPages)}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Prev
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={() => setPageIndex((p) => (p + 1) % totalPages)}
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 min-h-[500px]">
          {sortedArticles.length === 0 ? (
            <div className="col-span-3 text-center text-slate-400 py-12">No insights published yet.</div>
          ) : (
            visibleArticles.map((article) => (
              <div
                key={article.id}
                className="group cursor-pointer flex flex-col text-left animate-fade-in"
                onClick={() => onArticleClick(article)}
              >
                <div className="w-full aspect-[4/3] overflow-hidden mb-6 md:mb-8 bg-slate-200 relative">
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-900 z-10">
                    {article.date}
                  </div>
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
                    loading="lazy"
                  />
                </div>
                <div className="flex flex-col flex-1 text-left">
                  <h3 className="text-2xl font-serif text-slate-900 mb-2 md:mb-4 leading-tight group-hover:text-blue-800 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 font-light leading-relaxed line-clamp-3">{article.excerpt}</p>
                  <span className="mt-4 text-xs font-bold uppercase tracking-widest text-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Read Article &rarr;
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Journal;
