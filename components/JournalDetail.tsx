/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { JournalArticle } from '../types';

interface JournalDetailProps {
  article: JournalArticle;
  allArticles: JournalArticle[];
  onBack: () => void;
  onNext: (article: JournalArticle) => void;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ article, allArticles, onBack, onNext }) => {

  const parseContent = (content: string): React.ReactNode => {
    if (!content) return null;

    // Split raw content by double newlines or single newlines followed by padding to treat them as blocks
    // This regex looks for double newlines or significant whitespace breaks
    const blocks = content.split(/\n\s*\n/);

    return blocks.map((block, index) => {
        const text = block.trim();
        if (!text) return null;

        if (text.startsWith('[DP]')) {
            // Dropcap Paragraph
            const cleanText = text.replace('[DP]', '').trim();
            return (
                <p key={index} className="mb-6 first-letter:text-5xl first-letter:font-serif first-letter:mr-3 first-letter:float-left text-slate-600">
                    {cleanText}
                </p>
            );
        }

        if (text.startsWith('[Q]')) {
            // Blockquote
            const cleanText = text.replace('[Q]', '').trim();
            return (
                <blockquote key={index} className="border-l-2 border-slate-900 pl-6 italic text-xl text-slate-900 my-10 font-serif">
                    "{cleanText}"
                </blockquote>
            );
        }

        if (text.startsWith('[B]')) {
            // Black Background Block
            const cleanText = text.replace('[B]', '').trim();
            const lines = cleanText.split('|').map(l => l.trim());
            return (
                <div key={index} className="my-12 p-8 bg-slate-900 text-white font-serif italic text-center">
                    {lines.map((line, lineIdx) => (
                        <p key={lineIdx} className={lineIdx < lines.length - 1 ? "mb-2" : ""}>{line}</p>
                    ))}
                </div>
            );
        }

        // Default Paragraph
        return <p key={index} className="mb-6 text-slate-600">{text}</p>;
    });
  };

  // Logic to find the next article
  const currentIndex = allArticles.findIndex(a => a.id === article.id);
  // Loop back to the first article if it's the last one, or just get next
  const nextArticle = allArticles.length > 1 
    ? allArticles[(currentIndex + 1) % allArticles.length] 
    : null;

  return (
    <div className="min-h-screen bg-white animate-fade-in-up">
       {/* Hero Image for Article - Full bleed to top so navbar sits on it */}
       <div className="w-full h-[50vh] md:h-[60vh] relative overflow-hidden">
          <img 
             src={article.image} 
             alt={article.title} 
             className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/30"></div>
       </div>

       <div className="max-w-3xl mx-auto px-6 md:px-12 -mt-32 relative z-10 pb-32">
          <div className="bg-white p-8 md:p-16 shadow-xl shadow-slate-900/5 border border-slate-100">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-100 pb-8 gap-6 md:gap-0">
                <div className="flex items-center gap-6 md:gap-8">
                    <button 
                      onClick={onBack}
                      className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                      Back to Insights
                    </button>

                    {nextArticle && (
                        <button 
                          onClick={() => onNext(nextArticle)}
                          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
                        >
                          Next Article
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                             <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                          </svg>
                        </button>
                    )}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 self-end md:self-auto">{article.date}</span>
             </div>

             <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-12 leading-tight text-center">
               {article.title}
             </h1>

             <div className="prose prose-slate prose-lg mx-auto font-light leading-loose text-slate-600">
               {parseContent(article.content)}
             </div>
             
             <div className="mt-16 pt-12 border-t border-slate-100 flex justify-center">
                 <span className="text-xl font-serif italic text-slate-900">KOI Mobilize Holdings</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default JournalDetail;