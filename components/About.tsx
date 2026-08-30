/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import type { AboutContent, Pillar } from '../types';
import Media from './Media';
import Philosophy from './Philosophy';

interface AboutProps {
  data: AboutContent;
}

/* ------------------------------------------------------------------ */
/* Sci-fi pillar card                                                  */
/* ------------------------------------------------------------------ */

const SciFiPillar: React.FC<{ pillar: Pillar }> = ({ pillar }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const { title, description, media, id, detailContent } = pillar;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Tilt is disabled while the detail panel is open so it stays readable/scrollable
    if (!cardRef.current || showDetail) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotation({
      x: ((e.clientY - rect.top - centerY) / centerY) * -2.5,
      y: ((e.clientX - rect.left - centerX) / centerX) * 2.5,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!showDetail) setRotation({ x: 0, y: 0 });
  };

  const toggleDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetail(!showDetail);
    if (!showDetail) setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-[4/5] overflow-hidden bg-slate-900 group rounded-[32px] border border-white/10 transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
      style={{ perspective: '1200px' }}
    >
      <div
        className="w-full h-full relative"
        style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: isHovered && !showDetail ? 'transform 0.1s' : 'transform 0.5s ease-out',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Animated neon gradient border */}
        <div
          className={`absolute inset-0 z-50 pointer-events-none rounded-[32px] border border-transparent transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: 'linear-gradient(45deg, #A855F7, #F97316, #A855F7) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Holographic scan line */}
        <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-[32px]">
          <div
            className="w-full h-[25%] absolute -top-full"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.8), transparent)',
              animation: isHovered && !showDetail ? 'scan-line 2.5s linear infinite' : 'none',
              boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
            }}
          />
        </div>

        {/* Background media */}
        <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0px)' }}>
          <Media
            src={media}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Readability gradient */}
        <div
          className={`absolute inset-0 transition-all duration-500 z-10 ${
            showDetail ? 'bg-black/95' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'
          }`}
        />

        {/* Content */}
        <div
          className="absolute inset-0 z-40 flex flex-col justify-end px-8 pb-12"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div className="flex flex-col gap-4 transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex flex-col gap-2">
              <span className="block text-[10px] tracking-[0.3em] uppercase text-purple-400 font-bold drop-shadow-sm">
                {id}
              </span>
              <h3 className="text-3xl font-serif text-white leading-tight drop-shadow-lg">{title}</h3>
            </div>

            <div className="relative">
              <div className={`transition-all duration-500 ${showDetail ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 drop-shadow-md whitespace-pre-line">
                  {description}
                </p>
              </div>

              <div className={`transition-all duration-500 ${showDetail ? 'opacity-100 h-[250px] mt-4' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="h-full overflow-y-auto pr-2 custom-scrollbar text-gray-300 font-light leading-relaxed text-sm whitespace-pre-line">
                  {detailContent || <span className="italic opacity-50">Content unavailable.</span>}
                </div>
              </div>
            </div>

            {detailContent && (
              <div className="pt-2">
                <button
                  onClick={toggleDetail}
                  className="group/btn relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl transition-all duration-300 hover:brightness-125"
                >
                  <div
                    className="absolute inset-0 transition-all duration-300"
                    style={{
                      background: showDetail
                        ? 'linear-gradient(to right, #A855F7, #F97316)'
                        : 'linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box',
                      border: showDetail ? 'none' : '1px solid transparent',
                      borderRadius: '0.75rem',
                      backdropFilter: showDetail ? 'none' : 'blur(4px)',
                    }}
                  />
                  <span className="relative z-10 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 text-white">
                    {showDetail ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        BACK
                      </>
                    ) : (
                      <>
                        DETAILS
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */

const About: React.FC<AboutProps> = ({ data }) => {
  const { sectionLabel, purpose, visionTitle, vision, missionTitle, mission, mainImage, pillars, philosophy } =
    data;

  return (
    <section id="about" className="bg-slate-50">
      <style>{`
        @keyframes scan-line {
            0% { top: -30%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 120%; opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #A855F7, #F97316);
            border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to bottom, #9333ea, #ea580c);
        }
      `}</style>

      {/* Purpose / vision / mission */}
      <div className="py-16 md:py-24 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-32">
        <div className="md:w-1/3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 block bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">
            {sectionLabel}
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight whitespace-pre-line">
            {purpose}
          </h2>
        </div>

        <div className="md:w-2/3 max-w-2xl">
          <div className="mb-6 md:mb-12">
            <h3 className="text-xl font-medium mb-2 md:mb-4 bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent inline-block">
              {visionTitle}
            </h3>
            <p className="text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">{vision}</p>
          </div>

          <div className="mb-6 md:mb-12">
            <h3 className="text-xl font-medium mb-2 md:mb-4 bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent inline-block">
              {missionTitle}
            </h3>
            <p className="text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">{mission}</p>
          </div>

          <div className="w-full aspect-square md:aspect-auto md:h-[500px] rounded-sm overflow-hidden relative bg-transparent flex justify-center items-center">
            <Media
              src={mainImage}
              alt={visionTitle}
              className="w-full h-auto md:h-full object-contain"
              placeholderClassName="bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Core philosophy — the bridge from "who we are" to "what we do" */}
      {philosophy?.enabled && <Philosophy data={philosophy} />}

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 pt-16 md:pt-24 min-h-[60vh] max-w-[1800px] mx-auto">
        {pillars.length > 0 ? (
          pillars.map((pillar) => <SciFiPillar key={pillar.id} pillar={pillar} />)
        ) : (
          <div className="col-span-full text-center text-slate-400 py-12">No pillars configured yet.</div>
        )}
      </div>
    </section>
  );
};

export default About;
