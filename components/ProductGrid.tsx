/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';

const categories = ['All', 'Games', 'Character', 'Stories'];

interface ProductGridProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products;
    return products.filter(p => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <section id="products" className="py-32 px-6 md:px-12 bg-white">
      <div className="max-w-[1800px] mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col items-center text-center mb-24 space-y-8">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Our Ecosystem</span>
          <h2 className="text-4xl md:text-6xl font-serif text-slate-900">Featured IPs</h2>
          
          {/* Minimal Filter */}
          <div className="flex flex-wrap justify-center gap-8 pt-4 border-t border-slate-100 w-full max-w-2xl">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-sm uppercase tracking-widest pb-1 border-b transition-all duration-300 ${
                  activeCategory === cat 
                    ? 'border-slate-900 text-slate-900 font-medium' 
                    : 'border-transparent text-slate-400 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Large Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={onProductClick} />
          ))}
          {filteredProducts.length === 0 && (
             <div className="col-span-full text-center text-slate-400 py-12">
               Loading digital assets...
             </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;