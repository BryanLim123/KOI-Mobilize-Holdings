/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { BRAND_NAME } from '../constants';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  logoUrl?: string;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, cartCount, onOpenCart, logoUrl }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    onNavClick(e, targetId);
  };

  const handleCartClick = (e: React.MouseEvent) => {
      e.preventDefault();
      setMobileMenuOpen(false);
      onOpenCart();
  }

  // Determine text color based on state
  const textColorClass = (scrolled || mobileMenuOpen) ? 'text-slate-900' : 'text-white';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled || mobileMenuOpen ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-b border-slate-100' : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavClick(e, ''); // Pass empty string to just reset to home
            }}
            className={`z-50 relative transition-opacity hover:opacity-80 flex items-center`}
          >
            {logoUrl ? (
                <img 
                    src={logoUrl} 
                    alt={BRAND_NAME} 
                    className="h-12 md:h-16 w-auto object-contain max-w-[150px]" 
                />
            ) : (
                <span className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-500 ${textColorClass}`}>
                    {BRAND_NAME}<span className="font-light opacity-70"> Holdings</span>
                </span>
            )}
          </a>
          
          {/* Center Links - Desktop */}
          <div className={`hidden md:flex items-center gap-12 text-sm font-medium tracking-widest uppercase transition-colors duration-500 ${textColorClass}`}>
            <a 
                href="#about" 
                onClick={(e) => handleLinkClick(e, 'about')} 
                className="transition-all duration-300 hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#F97316] hover:bg-clip-text hover:text-transparent"
            >
                Our Core
            </a>
            <a 
                href="#products" 
                onClick={(e) => handleLinkClick(e, 'products')} 
                className="transition-all duration-300 hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#F97316] hover:bg-clip-text hover:text-transparent"
            >
                Our IPs
            </a>
            <a 
                href="#journal" 
                onClick={(e) => handleLinkClick(e, 'journal')} 
                className="transition-all duration-300 hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#F97316] hover:bg-clip-text hover:text-transparent"
            >
                Insights
            </a>
            <a 
                href="#footer" 
                onClick={(e) => handleLinkClick(e, 'footer')} 
                className="transition-all duration-300 hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#F97316] hover:bg-clip-text hover:text-transparent"
            >
                Contact
            </a>
          </div>

          {/* Right Actions */}
          <div className={`flex items-center gap-6 z-50 relative transition-colors duration-500 ${textColorClass}`}>
             {/* Hidden Cart for Holdings Site, but kept logic if needed later */}
            <button 
              onClick={handleCartClick}
              className="text-sm font-medium uppercase tracking-widest hover:opacity-60 transition-opacity hidden"
            >
              Assets ({cartCount})
            </button>
            
            {/* Mobile Menu Toggle */}
            <button 
              className={`block md:hidden focus:outline-none transition-colors duration-500 ${textColorClass}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               {mobileMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 </svg>
               )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-white z-40 flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}>
          <div className="flex flex-col items-center space-y-8 text-xl font-serif font-medium text-slate-900">
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:text-[#A855F7] transition-colors">Our Core</a>
            <a href="#products" onClick={(e) => handleLinkClick(e, 'products')} className="hover:text-[#A855F7] transition-colors">Featured IPs</a>
            <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')} className="hover:text-[#A855F7] transition-colors">Insights</a>
            <a href="#footer" onClick={(e) => handleLinkClick(e, 'footer')} className="hover:text-[#A855F7] transition-colors">Contact</a>
          </div>
      </div>
    </>
  );
};

export default Navbar;