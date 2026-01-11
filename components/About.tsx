/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { AboutData } from '../types';

interface AboutProps {
  data: AboutData | null;
}

const About: React.FC<AboutProps> = ({ data }) => {
  // Use data from loader, falling back to empty string if missing in data but present in object
  // If data is null (loading failed), fallback to defaults
  
  const purpose = data?.purpose || "Build Trust and Vision.";
  const vision = data?.vision || "To create a new generation of IP that lives seamlessly across digital and physical worlds, fostering connection and innovation.";
  const mission = data?.mission || "We empower creators, brands, and communities to co-build sustainable, scalable IP ecosystems that stand the test of time.";
  
  // Use the new mainImage property from data, mapped from Intro > MainImage
  const mainImage = data?.mainImage || "";
  
  // Strict Key Matching implies we trust the data loader mapping.
  // We apply fallbacks only if the string is empty/undefined.
  const pillar1Title = data?.pillar1Title || "Create";
  const pillar1Desc = data?.pillar1Desc || "Original IP development across games, characters, and stories. We build worlds that invite exploration.";
  const pillar1Media = data?.pillar1Media || "";

  const pillar2Title = data?.pillar2Title || "Commercialize";
  const pillar2Desc = data?.pillar2Desc || "Licensing, brand collaborations, and digital asset monetization. We turn creativity into sustainable value.";
  const pillar2Media = data?.pillar2Media || "";

  const renderMedia = (src: string, alt: string, className: string) => {
    if (!src) return <div className={`${className} bg-slate-200`} />;

    // Handle .mp4 video check
    const isVideo = src?.toLowerCase().trim().endsWith('.mp4');
    if (isVideo) {
      return (
        <video
          src={src}
          className={className}
          autoPlay
          loop
          muted
          playsInline
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        className={className}
      />
    );
  };

  return (
    <section id="about" className="bg-slate-50">
      
      {/* Introduction / Purpose */}
      <div className="py-16 md:py-24 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-8 md:gap-32">
        <div className="md:w-1/3">
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 block bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">Our Purpose</span>
          <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight whitespace-pre-line">
            {purpose}
          </h2>
        </div>
        <div className="md:w-2/3 max-w-2xl">
          <div className="mb-6 md:mb-12">
            <h3 className="text-xl font-medium mb-2 md:mb-4 bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent inline-block">Our Vision</h3>
            <p className="text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">
                {vision}
            </p>
          </div>
          <div className="mb-6 md:mb-12">
            <h3 className="text-xl font-medium mb-2 md:mb-4 bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent inline-block">Our Mission</h3>
            <p className="text-lg text-slate-600 font-light leading-relaxed whitespace-pre-line">
                {mission}
            </p>
          </div>
          
          <div className="w-full h-[300px] rounded-sm overflow-hidden relative bg-slate-200">
            {/* Removed contrast-[1.1] grayscale-[0.5] to show original image */}
            {renderMedia(mainImage, "Our Vision", "w-full h-full object-cover")}
          </div>
        </div>
      </div>

      {/* What We Do - Two Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        {/* Pillar 01 */}
        <div className="relative h-[500px] lg:h-auto overflow-hidden group bg-slate-900">
           <div className="absolute inset-0 w-full h-full transition-transform duration-[2s] group-hover:scale-105">
             {renderMedia(pillar1Media, pillar1Title, "w-full h-full object-cover")}
           </div>
           {/* Replaced bg-slate-900/60 with bg-black/20 and added text shadows */}
           <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-8 md:p-12 lg:p-24 transition-colors group-hover:bg-black/30">
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 drop-shadow-md bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">Pillar 01</span>
                <h3 className="text-4xl md:text-5xl font-serif mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                    {pillar1Title}
                </h3>
                <p className="text-lg text-white font-light leading-relaxed max-w-md whitespace-pre-line drop-shadow-md">
                    {pillar1Desc}
                </p>
           </div>
        </div>
        
        {/* Pillar 02 */}
        <div className="relative h-[500px] lg:h-auto overflow-hidden group bg-blue-900">
            <div className="absolute inset-0 w-full h-full transition-transform duration-[2s] group-hover:scale-105">
                {renderMedia(pillar2Media, pillar2Title, "w-full h-full object-cover")}
            </div>
           {/* Replaced bg-blue-900/70 with bg-black/20 and added text shadows */}
           <div className="absolute inset-0 bg-black/20 flex flex-col justify-center p-8 md:p-12 lg:p-24 transition-colors group-hover:bg-black/30">
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 drop-shadow-md bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent">Pillar 02</span>
                <h3 className="text-4xl md:text-5xl font-serif mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                    {pillar2Title}
                </h3>
                <p className="text-lg text-white font-light leading-relaxed max-w-md whitespace-pre-line drop-shadow-md">
                    {pillar2Desc}
                </p>
           </div>
        </div>
      </div>
    </section>
  );
};

export default About;