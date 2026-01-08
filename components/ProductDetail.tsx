/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  return (
    <div className="pt-36 min-h-screen bg-white animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-24">
        
        {/* Breadcrumb / Back */}
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors mb-8 relative z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to IPs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Left: Main Image Only */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-slate-100 overflow-hidden shadow-sm">
              <img 
                src={product.imageUrl} 
                alt={product.name} 
                className="w-full h-full object-cover animate-fade-in-up"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center max-w-xl">
             <span className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">{product.category}</span>
             <h1 className="text-4xl md:text-5xl font-serif text-slate-900 mb-4">{product.name}</h1>
             <p className="text-xl font-light text-slate-500 italic mb-8">{product.tagline}</p>
             
             <p className="text-slate-600 leading-relaxed font-light text-lg mb-8 border-b border-slate-200 pb-8">
               {product.longDescription || product.description}
             </p>

             <div className="flex flex-col gap-4">
               {/* Licensing Button - Disabled */}
               <button 
                 disabled
                 className="w-full py-5 bg-slate-100 text-slate-400 text-sm font-bold cursor-not-allowed text-center border border-slate-200 tracking-widest"
               >
                 INQUIRE ABOUT LICENSING ( coming soon )
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetail;