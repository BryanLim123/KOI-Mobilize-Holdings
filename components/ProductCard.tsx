/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="group flex flex-col gap-3 md:gap-6 cursor-pointer" onClick={() => onClick(product)}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 ease-in-out group-hover:scale-110"
        />
        
        {/* Hover overlay with "Discover IP" - Glassmorphism style */}
        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors duration-500 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span 
                    className="inline-block px-6 py-3 text-xs uppercase tracking-widest font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    style={{
                        background: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box",
                        border: "1px solid transparent",
                        borderRadius: "0.5rem",
                        backdropFilter: "blur(12px)"
                    }}
                >
                    Discover IP
                </span>
            </div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-xl md:text-2xl font-serif font-medium text-slate-900 mb-0.5 md:mb-1 group-hover:text-blue-600 transition-colors">{product.name}</h3>
        <p className="text-sm font-light text-slate-500 mb-2 md:mb-3 tracking-wide">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;