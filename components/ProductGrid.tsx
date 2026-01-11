/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  initialCategory?: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick, initialCategory }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);

  // LOGIC UPDATE: Fetch cards for the Main Landing Page where 'level' column equals 'Cover'
  const categoryCovers = useMemo(() => {
    return products.filter(p => p.level?.trim().toLowerCase() === 'cover');
  }, [products]);

  // Helper to get item count for a category (counting only Items)
  const getCategoryCount = (cat: string) => {
    return products.filter(p => p.category?.trim() === cat && p.level?.trim().toLowerCase() === 'item').length;
  };

  // Navigation Logic
  const handleNavigate = (direction: 'next' | 'prev') => {
      if (!activeCategory || categoryCovers.length === 0) return;
      
      const currentCoverIndex = categoryCovers.findIndex(c => c.category === activeCategory);
      // If active category isn't in covers (edge case), default to 0
      const safeIndex = currentCoverIndex === -1 ? 0 : currentCoverIndex;
      
      let newIndex;
      if (direction === 'next') {
          newIndex = (safeIndex + 1) % categoryCovers.length;
      } else {
          newIndex = (safeIndex - 1 + categoryCovers.length) % categoryCovers.length;
      }
      
      setActiveCategory(categoryCovers[newIndex].category);
      
      // Smooth scroll to top of section
      const section = document.getElementById('products');
      if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
      }
  };

  const handleReturnToHub = () => {
      setActiveCategory(null);
      const section = document.getElementById('products');
      if (section) {
          section.scrollIntoView({ behavior: 'smooth' });
      }
  };

  // --- RENDER: HUB VIEW (Category Covers) ---
  if (!activeCategory) {
      return (
        <section id="products" className="py-16 md:py-32 px-6 md:px-12 bg-white">
          <div className="max-w-[1800px] mx-auto">
            
            <div className="flex flex-col items-center text-center mb-12 md:mb-24 space-y-4 md:space-y-8">
                {/* TEXT UPDATE: Header */}
                <span className="text-xs font-bold uppercase tracking-[0.2em] bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">DISCOVERY HUB</span>
                <h2 className="text-4xl md:text-6xl font-serif text-slate-900">Featured IPs</h2>
                {/* TEXT UPDATE: Subtitle */}
                <p className="max-w-2xl text-slate-500 font-light">Select a category to explore our IP ecosystem.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {categoryCovers.map(cover => (
                <div 
                  key={cover.id}
                  onClick={() => setActiveCategory(cover.category)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  <div className="absolute inset-0 bg-slate-900">
                     {cover.imageUrl && (
                        <img 
                            src={cover.imageUrl} 
                            alt={cover.name}
                            className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-40"
                        />
                     )}
                  </div>
                  
                  {/* Content Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center border-2 border-transparent group-hover:border-white/10 transition-colors duration-500 rounded-2xl m-2">
                     <h3 className="text-3xl md:text-4xl font-serif text-white mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500 drop-shadow-lg">
                        {cover.category}
                     </h3>

                     {/* TAGLINE DISPLAY */}
                     {cover.tagline && (
                       <p className="text-white/90 text-sm font-light tracking-wide mb-4 max-w-[90%] translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                         {cover.tagline}
                       </p>
                     )}

                     <span className="inline-block px-4 py-1 rounded-full border border-white/30 text-white/80 text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 backdrop-blur-sm">
                        {getCategoryCount(cover.category)} IPs Discovered
                     </span>
                     {/* TEXT UPDATE: Button */}
                     <span className="absolute bottom-8 text-white/60 text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-200">
                        ENTER CATEGORY &rarr;
                     </span>
                  </div>
                </div>
              ))}
              
              {categoryCovers.length === 0 && (
                 <div className="col-span-full text-center text-slate-400 py-24 border border-dashed border-slate-200 rounded-xl">
                   <span className="text-lg font-serif italic">Initializing Ecosystem Data...</span>
                   <p className="text-xs mt-2">No categories marked as 'Cover' found.</p>
                 </div>
              )}
            </div>
          </div>
        </section>
      );
  }

  // --- RENDER: CATEGORY PAGE (Individual IPs) ---
  // LOGIC UPDATE: fetch all rows where 'level' equals 'Item' and 'category' matches
  const currentProducts = products.filter(p => 
      p.category?.trim() === activeCategory && 
      p.level?.trim().toLowerCase() === 'item'
  );

  return (
    <section id="products" className="pt-16 pb-8 md:pt-32 md:pb-24 px-6 md:px-12 bg-white min-h-screen">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Sub-Navigation Controls - Optimized Vertical Spacing */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 md:mb-16 gap-3 md:gap-0 border-b border-slate-100 pb-4 md:pb-6">
            {/* Return Button */}
            <button 
                onClick={handleReturnToHub}
                className="group flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-[#A855F7] transition-colors order-1 md:order-none"
            >
                <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#A855F7] group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                </div>
                Return to Hub
            </button>

            {/* Title Area - Reduced Vertical Margins */}
            <div className="text-center order-2 md:order-none">
                {/* TEXT UPDATE: Top Label */}
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-[#A855F7] mb-1 animate-fade-in">CATEGORY</span>
                <h2 className="text-3xl md:text-5xl font-serif text-slate-900 animate-fade-in-up leading-none">{activeCategory}</h2>
            </div>

            {/* Next/Prev Frontier Controls */}
            <div className="flex items-center gap-3 md:gap-4 order-3 md:order-none">
                 <button 
                    onClick={() => handleNavigate('prev')}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {/* TEXT UPDATE: Button Text */}
                    <span className="hidden md:inline">PREVIOUS CATEGORY</span>
                    <span className="md:hidden">Prev</span>
                </button>
                <button 
                    onClick={() => handleNavigate('next')}
                    className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 transition-colors"
                >
                    {/* TEXT UPDATE: Button Text */}
                    <span className="hidden md:inline">NEXT CATEGORY</span>
                    <span className="md:hidden">Next</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 md:w-4 md:h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>

        {/* 3-Column Grid for Category Items - Reduced Vertical Gap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 md:gap-y-16 min-h-[400px]">
          {currentProducts.map(product => (
            <div key={product.id} className="animate-fade-in-up">
                <ProductCard product={product} onClick={onProductClick} />
            </div>
          ))}
          
          {currentProducts.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center text-slate-400 py-24 border border-dashed border-slate-200 rounded-xl">
               <span className="text-lg font-serif italic mb-2">No active IPs found in this category.</span>
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;