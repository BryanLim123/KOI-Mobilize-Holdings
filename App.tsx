/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import About from './components/About';
import Journal from './components/Journal';
import Assistant from './components/Assistant';
import Footer from './components/Footer';
import ProductDetail from './components/ProductDetail';
import JournalDetail from './components/JournalDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import { Product, ViewState, HeroData, AIKnowledgeItem, AboutData, JournalArticle } from './types';
import { PRODUCTS, BRAND_NAME } from './constants';
import { fetchAppContent } from './services/dataLoader';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<ViewState>({ type: 'home' });
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>([]);
  const [aiKnowledge, setAiKnowledge] = useState<AIKnowledgeItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
        try {
            const { hero, products: fetchedProducts, knowledge, about, articles } = await fetchAppContent();
            
            if (fetchedProducts.length > 0) {
                setProducts(fetchedProducts);
            } else {
                setProducts(PRODUCTS); // Fallback only if fetch completely fails/empty
            }
            
            if (hero) setHeroData(hero);
            if (about) setAboutData(about);
            if (articles.length > 0) setJournalArticles(articles);
            if (knowledge.length > 0) setAiKnowledge(knowledge);

        } catch (error) {
            console.error("Initialization error:", error);
        } finally {
            // Ensure visual loading persists for at least 800ms to prevent flickering on fast connections
            setTimeout(() => {
                setIsLoading(false);
            }, 800);
        }
    };
    
    loadData();
  }, []);

  // Handle navigation (clicks on Navbar or Footer links)
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    
    // If we are not home, go home first
    if (view.type !== 'home') {
      setView({ type: 'home' });
      // Allow state update to render Home before scrolling
      setTimeout(() => scrollToSection(targetId), 0);
    } else {
      scrollToSection(targetId);
    }
  };

  const scrollToSection = (targetId: string) => {
    if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    
    const element = document.getElementById(targetId);
    if (element) {
      // Manual scroll calculation to account for fixed header
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });

      try {
        window.history.pushState(null, '', `#${targetId}`);
      } catch (err) {
        // Ignore SecurityError in restricted environments
      }
    }
  };

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product]);
    setIsCartOpen(true);
  };

  const removeFromCart = (index: number) => {
    const newItems = [...cartItems];
    newItems.splice(index, 1);
    setCartItems(newItems);
  };

  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-[#0f172a] z-[100] flex items-center justify-center">
              <div className="flex flex-col items-center">
                  <img 
                      src="https://storage.googleapis.com/rawmind-ai/KOI%20SG%20TEST/logo_low_res.png" 
                      alt={BRAND_NAME}
                      className="h-32 w-auto max-w-[250px] object-contain animate-pulse"
                  />
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-slate-200 selection:text-slate-900 animate-fade-in">
      {view.type !== 'checkout' && (
        <Navbar 
            onNavClick={handleNavClick} 
            cartCount={cartItems.length}
            onOpenCart={() => setIsCartOpen(true)}
            logoUrl={heroData?.logoUrl}
        />
      )}
      
      <main>
        {view.type === 'home' && (
          <>
            <Hero data={heroData} />
            <About data={aboutData} />
            <ProductGrid 
                products={products}
                onProductClick={(p) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setView({ type: 'product', product: p });
                }} 
            />
            <Journal 
                articles={journalArticles}
                onArticleClick={(a) => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setView({ type: 'journal', article: a });
                }} 
            />
          </>
        )}

        {view.type === 'product' && (
          <ProductDetail 
            product={view.product} 
            onBack={() => {
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('products'), 50);
            }}
            onAddToCart={addToCart}
          />
        )}

        {view.type === 'journal' && (
          <JournalDetail 
            article={view.article}
            allArticles={journalArticles}
            onBack={() => {
              setView({ type: 'home' });
              setTimeout(() => scrollToSection('journal'), 50);
            }}
            onNext={(nextArticle) => {
               window.scrollTo({ top: 0, behavior: 'smooth' });
               setView({ type: 'journal', article: nextArticle });
            }}
          />
        )}

        {view.type === 'checkout' && (
            <Checkout 
                items={cartItems}
                onBack={() => setView({ type: 'home' })}
            />
        )}
      </main>

      {view.type !== 'checkout' && <Footer onLinkClick={handleNavClick} />}
      
      <Assistant products={products} knowledge={aiKnowledge} />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onCheckout={() => {
            setIsCartOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setView({ type: 'checkout' });
        }}
      />
    </div>
  );
}

export default App;