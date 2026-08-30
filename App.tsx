/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Portfolio from './components/Portfolio';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import IPDetail from './components/IPDetail';
import JournalDetail from './components/JournalDetail';
import AdminApp from './admin/AdminApp';
import { loadContent, type ContentSource } from './services/contentService';
import type { SiteDocument, ViewState } from './types';

/** #/admin (and anything under it) renders the CMS instead of the site. */
function useIsAdminRoute() {
  const read = () => window.location.hash.replace(/^#/, '').startsWith('/admin');
  const [isAdmin, setIsAdmin] = useState(read);
  useEffect(() => {
    const onHash = () => setIsAdmin(read());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return isAdmin;
}

function App() {
  const isAdmin = useIsAdminRoute();
  if (isAdmin) return <AdminApp />;
  return <PublicSite />;
}

function PublicSite() {
  const [content, setContent] = useState<SiteDocument | null>(null);
  const [source, setSource] = useState<ContentSource>('bundled');
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [lastCategoryId, setLastCategoryId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { doc, source: src } = await loadContent();
      if (cancelled) return;
      setContent(doc);
      setSource(src);
      // Hold the loader briefly so the fade-in never flickers on fast connections
      setTimeout(() => setIsLoading(false), 600);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToSection = useCallback((targetId: string) => {
    if (!targetId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(targetId);
    if (!el) return;
    const offset = el.getBoundingClientRect().top + window.scrollY - 85;
    window.scrollTo({ top: offset, behavior: 'smooth' });
    try {
      window.history.pushState(null, '', `#${targetId}`);
    } catch {
      /* restricted embed contexts */
    }
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
      e.preventDefault();
      setLastCategoryId(null);
      if (view.type !== 'home') {
        setView({ type: 'home' });
        setTimeout(() => scrollToSection(targetId), 0);
      } else {
        scrollToSection(targetId);
      }
    },
    [view.type, scrollToSection],
  );

  if (isLoading || !content) {
    const logo = content?.site.loaderLogoUrl || content?.site.logoUrl;
    return (
      <div className="fixed inset-0 bg-[#0f172a] z-[100] flex items-center justify-center">
        {logo ? (
          <img
            src={logo}
            alt={content?.site.brandName || 'Loading'}
            className="h-32 w-auto max-w-[250px] object-contain animate-pulse"
          />
        ) : (
          <div className="h-3 w-3 rounded-full bg-white/60 animate-pulse" />
        )}
      </div>
    );
  }

  const { site, hero, about, portfolio, journal, assistant } = content;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 animate-fade-in">
      <Navbar site={site} onNavClick={handleNavClick} />

      <main>
        {view.type === 'home' && (
          <>
            <Hero data={hero} />
            <About data={about} />
            <Portfolio
              data={portfolio}
              initialCategoryId={lastCategoryId}
              onItemClick={(item, category) => {
                setLastCategoryId(category.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'ip', item, category });
              }}
            />
            <Journal
              data={journal}
              onArticleClick={(article) => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setView({ type: 'journal', article });
              }}
            />
          </>
        )}

        {view.type === 'ip' && (
          <IPDetail
            item={view.item}
            category={view.category}
            onBack={() => {
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('products'), 50);
            }}
          />
        )}

        {view.type === 'journal' && (
          <JournalDetail
            article={view.article}
            allArticles={journal.articles.filter((a) => a.published !== false)}
            signature={site.companyName}
            onBack={() => {
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('journal'), 50);
            }}
            onNext={(next) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView({ type: 'journal', article: next });
            }}
          />
        )}
      </main>

      <Footer site={site} onLinkClick={handleNavClick} />

      {assistant.enabled && <Assistant data={assistant} />}

      {source === 'bundled' && import.meta.env.DEV && (
        <div className="fixed bottom-4 left-4 z-[80] rounded-lg bg-amber-500 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg">
          Bundled fallback content — API unreachable
        </div>
      )}
    </div>
  );
}

export default App;
