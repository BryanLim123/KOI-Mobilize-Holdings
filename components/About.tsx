/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState } from 'react';
import { AboutData } from '../types';

interface AboutProps {
  data: AboutData | null;
}

// Sub-component for Sci-Fi Card Logic
const SciFiPillar: React.FC<{
  title: string;
  desc: string;
  mediaSrc: string;
  pillarLabel: string;
  renderMedia: (src: string, alt: string, className: string) => React.ReactNode;
}> = ({ title, desc, mediaSrc, pillarLabel, renderMedia }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Max tilt: 2.5 degrees for premium feel
    const rotateX = ((y - centerY) / centerY) * -2.5; 
    const rotateY = ((x - centerX) / centerX) * 2.5;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative h-[500px] lg:h-auto overflow-hidden bg-slate-900 group"
      style={{ perspective: '1200px' }}
    >
      <div 
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
           transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
           transition: isHovered ? 'transform 0.1s' : 'transform 0.5s ease-out',
           transformStyle: 'preserve-3d'
        }}
      >
          {/* Animated Glowing Gradient Border */}
          <div className="absolute inset-0 z-30 pointer-events-none p-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-sm">
             <div className="absolute inset-0 w-full h-full" 
                  style={{
                      background: 'linear-gradient(45deg, #A855F7, #F97316, #A855F7)',
                      backgroundSize: '200% 200%',
                      animation: 'gradient-move 3s linear infinite',
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      WebkitMaskComposite: 'xor'
                  }} 
             />
          </div>

          {/* Holographic Scan Line */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-40 transition-opacity duration-500">
             <div 
                className="w-full h-[25%] absolute -top-full"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.8), transparent)',
                    animation: isHovered ? 'scan-line 2.5s linear infinite' : 'none',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
                }}
             />
          </div>

          {/* Background Media */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0px)' }}>
             {renderMedia(mediaSrc, title, "w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105")}
          </div>
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-500 z-10" />

          {/* Text Content - With Z-Depth Parallax */}
          <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 lg:p-24 z-20 pointer-events-none" style={{ transform: 'translateZ(40px)' }}>
                <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 md:mb-6 drop-shadow-md bg-gradient-to-r from-[#A855F7] to-[#F97316] bg-clip-text text-transparent inline-block w-fit">
                    {pillarLabel}
                </span>
                <h3 className="text-4xl md:text-5xl font-serif mb-4 md:mb-6 text-white leading-tight drop-shadow-lg">
                    {title}
                </h3>
                <p className="text-lg text-white font-light leading-relaxed max-w-md whitespace-pre-line drop-shadow-md">
                    {desc}
                </p>
           </div>
      </div>
    </div>
  );
};


const About: React.FC<AboutProps> = ({ data }) => {
  // Use data from loader
  const purpose = data?.purpose || "Build Trust and Vision.";
  const vision = data?.vision || "To create a new generation of IP that lives seamlessly across digital and physical worlds, fostering connection and innovation.";
  const mission = data?.mission || "We empower creators, brands, and communities to co-build sustainable, scalable IP ecosystems that stand the test of time.";
  
  const mainImage = data?.mainImage || "";
  
  const pillar1Title = data?.pillar1Title || "Create";
  const pillar1Desc = data?.pillar1Desc || "Original IP development across games, characters, and stories. We build worlds that invite exploration.";
  const pillar1Media = data?.pillar1Media || "";

  const pillar2Title = data?.pillar2Title || "Commercialize";
  const pillar2Desc = data?.pillar2Desc || "Licensing, brand collaborations, and digital asset monetization. We turn creativity into sustainable value.";
  const pillar2Media = data?.pillar2Media || "";

  const renderMedia = (src: string, alt: string, className: string) => {
    if (!src) return <div className={`${className} bg-slate-200`} />;

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
      <style>{`
        @keyframes gradient-move {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        @keyframes scan-line {
            0% { top: -30%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 120%; opacity: 0; }
        }
      `}</style>
      
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
          
          {/* Main Image - Purpose Section */}
          <div className="w-full aspect-square md:aspect-auto md:h-[500px] rounded-sm overflow-hidden relative bg-transparent flex justify-center items-center">
            {renderMedia(mainImage, "Our Vision", "w-full h-auto md:h-full object-contain")}
          </div>
        </div>
      </div>

      {/* What We Do - Two Pillars (Upgraded Sci-Fi Version) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[60vh]">
        <SciFiPillar 
            pillarLabel="Pillar 01"
            title={pillar1Title}
            desc={pillar1Desc}
            mediaSrc={pillar1Media}
            renderMedia={renderMedia}
        />
        <SciFiPillar 
            pillarLabel="Pillar 02"
            title={pillar2Title}
            desc={pillar2Desc}
            mediaSrc={pillar2Media}
            renderMedia={renderMedia}
        />
      </div>
    </section>
  );
};

export default About;