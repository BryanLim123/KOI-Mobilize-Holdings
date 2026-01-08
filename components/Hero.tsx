/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { HeroData } from '../types';

interface HeroProps {
  data: HeroData | null;
}

const Hero: React.FC<HeroProps> = ({ data }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
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
        // Ignore SecurityError
      }
    }
  };

  // Defaults are essentially empty/placeholder to allow smooth fading in from the App loader
  const bgImage = data?.backgroundImage || "";
  const title = data?.title || "A Global IP Platform";
  const subtitle = data?.subtitle || "Connecting Games, Media, and Digital Assets. \nCo-building sustainable, scalable ecosystems.";
  const companyLabel = data?.companyLabel || "KOI Mobilize Holdings";

  // Helper to process title with HTML-like logic (handling the "Platform" styling if present in default)
  // For standard strings, we render directly.
  const renderTitle = () => {
    if (data?.title) return <>{data.title}</>;
    return <>A Global IP <span className="italic text-blue-100">Platform</span></>;
  };

  return (
    <section className="relative w-full h-screen min-h-[800px] overflow-hidden bg-slate-900">
      
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full bg-slate-900">
        {bgImage && (
            <video 
                src={bgImage} 
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
            />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start text-left md:items-center md:text-center px-6">
        <div className="animate-fade-in-up w-full md:w-auto">
          <span className="block text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-blue-200 mb-6 backdrop-blur-sm bg-white/5 px-4 py-2 rounded-full mx-0 md:mx-auto w-fit border border-white/10">
            {companyLabel}
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white tracking-tight mb-8 drop-shadow-sm leading-tight text-shadow-md">
            {renderTitle()}
          </h1>
          <p className="max-w-2xl mx-0 md:mx-auto text-lg md:text-2xl text-slate-100 font-light leading-relaxed mb-12 text-shadow-sm whitespace-pre-line">
            {subtitle}
          </p>
          
          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
            className="group relative px-10 py-4 bg-white text-slate-900 rounded-none text-sm font-bold uppercase tracking-widest hover:bg-blue-50 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-xl inline-block"
          >
            <span className="relative z-10 group-hover:text-blue-900">Our Vision</span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;