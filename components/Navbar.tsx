/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import type { SiteContent } from '../types';

interface NavbarProps {
  site: SiteContent;
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ site, onNavClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    onNavClick(e, targetId);
  };

  const textColorClass = scrolled || mobileMenuOpen ? 'text-slate-900' : 'text-white';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled || mobileMenuOpen
            ? 'bg-white/95 backdrop-blur-md py-3 shadow-sm border-b border-slate-100'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-8 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              onNavClick(e, '');
            }}
            className="z-50 relative transition-opacity hover:opacity-80 flex items-center"
          >
            {site.logoUrl ? (
              <img
                src={site.logoUrl}
                alt={site.brandName}
                className="h-12 md:h-16 w-auto object-contain max-w-[150px]"
              />
            ) : (
              <span
                className={`text-2xl font-serif font-bold tracking-tight transition-colors duration-500 ${textColorClass}`}
              >
                {site.brandName}
                <span className="font-light opacity-70"> Holdings</span>
              </span>
            )}
          </a>

          {/* Desktop links */}
          <div
            className={`hidden md:flex items-center gap-12 text-sm font-medium tracking-widest uppercase transition-colors duration-500 ${textColorClass}`}
          >
            {site.nav.map((link) => (
              <a
                key={`${link.target}-${link.label}`}
                href={`#${link.target}`}
                onClick={(e) => handleLinkClick(e, link.target)}
                className="transition-all duration-300 hover:bg-gradient-to-r hover:from-[#A855F7] hover:to-[#F97316] hover:bg-clip-text hover:text-transparent"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Mobile toggle */}
          <div className={`flex items-center gap-6 z-50 relative transition-colors duration-500 ${textColorClass}`}>
            <button
              className={`block md:hidden focus:outline-none transition-colors duration-500 ${textColorClass}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 flex flex-col justify-center items-center transition-all duration-500 ease-in-out ${
          mobileMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center space-y-8 text-xl font-serif font-medium text-slate-900">
          {site.nav.map((link) => (
            <a
              key={`m-${link.target}-${link.label}`}
              href={`#${link.target}`}
              onClick={(e) => handleLinkClick(e, link.target)}
              className="hover:text-[#A855F7] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;
