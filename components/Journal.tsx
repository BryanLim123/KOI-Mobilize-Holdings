/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { JournalArticle } from '../types';

interface JournalProps {
  articles: JournalArticle[];
  onArticleClick: (article: JournalArticle) => void;
}

const Journal: React.FC<JournalProps> = ({ articles, onArticleClick }) => {
  return (
    <section id="journal" className="bg-slate-50 py-32 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 pb-8 border-b border-slate-200">
            <div>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-4">News & Updates</span>
                <h2 className="text-4xl md:text-6xl font-serif text-slate-900">Latest Insights</h2>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {articles.length === 0 ? (
                <div className="col-span-3 text-center text-slate-400 py-12">
                   Loading insights...
                </div>
            ) : (
                articles.map((article) => (
                    <div key={article.id} className="group cursor-pointer flex flex-col text-left" onClick={() => onArticleClick(article)}>
                        <div className="w-full aspect-[4/3] overflow-hidden mb-8 bg-slate-200">
                            <img 
                                src={article.image} 
                                alt={article.title} 
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale-[0.2] group-hover:grayscale-0"
                            />
                        </div>
                        <div className="flex flex-col flex-1 text-left">
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{article.date}</span>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4 leading-tight group-hover:text-blue-800 transition-colors">{article.title}</h3>
                            <p className="text-slate-600 font-light leading-relaxed">{article.excerpt}</p>
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