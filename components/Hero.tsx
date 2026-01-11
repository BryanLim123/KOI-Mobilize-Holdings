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
  // Defaults are essentially empty/placeholder to allow smooth fading in from the App loader
  const bgImage = data?.backgroundImage || "";
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
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight mb-8 leading-tight bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent pb-2">
            {renderTitle()}
          </h1>
          <p className="max-w-2xl mx-0 md:mx-auto text-lg md:text-2xl text-slate-100 font-light leading-relaxed mb-12 text-shadow-sm whitespace-pre-line">
            {subtitle}
          </p>
          
          {/* MONOKOILY Button - Responsive Scaling Applied */}
          <button 
            type="button"
            className="group relative inline-flex items-center justify-center px-6 py-3 md:px-12 md:py-5 overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] cursor-default"
          >
             {/* Default State Background & Border (Absolute) */}
             <div 
               className="absolute inset-0 transition-opacity duration-300 ease-in-out group-hover:opacity-0"
               style={{
                 background: "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box",
                 border: "1px solid transparent",
                 backdropFilter: "blur(12px)",
                 borderRadius: "0.75rem"
               }}
             />

             {/* Hover State Background (Absolute) */}
             <div 
               className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-90 bg-gradient-to-r from-[#A855F7] to-[#F97316]"
               style={{ borderRadius: "0.75rem" }}
             />

             {/* Text Content - Responsive Size */}
             <span className="relative z-10 text-white font-bold text-sm md:text-lg tracking-[0.15em] uppercase drop-shadow-md">
                {/* Text Swap logic */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center transition-all duration-300 ease-in-out group-hover:opacity-0 group-hover:scale-95 group-hover:blur-sm">
                   MONOKOILY
                </span>
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center transition-all duration-300 ease-in-out opacity-0 scale-105 blur-sm group-hover:opacity-100 group-hover:scale-100 group-hover:blur-0 whitespace-nowrap">
                   COMING REAL SOON
                </span>
                {/* Invisible Spacer to define button size based on longest text */}
                <span className="opacity-0 pointer-events-none">COMING REAL SOON</span>
             </span>
          </button>
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