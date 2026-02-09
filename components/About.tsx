/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState } from 'react';
import { AboutData, Pillar } from '../types';

interface AboutProps {
  data: AboutData | null;
}

// Sub-component for Sci-Fi Card Logic
const SciFiPillar: React.FC<{
  pillar: Pillar;
  renderMedia: (src: string, alt: string, className: string) => React.ReactNode;
}> = ({ pillar, renderMedia }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const { title, description: desc, media: mediaSrc, id, detailContent } = pillar;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tilt if detail view is active to allow scrolling without motion sickness/layout issues
    if (!cardRef.current || showDetail) return;
    
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
    if (!showDetail) setRotation({ x: 0, y: 0 });
  };

  const toggleDetail = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent bubbling if needed
    setShowDetail(!showDetail);
    // Reset rotation when opening details
    if (!showDetail) setRotation({ x: 0, y: 0 });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      // Aspect ratio 4/5, rounded-[32px], glass border logic
      // UPDATE: hover:scale-[1.02], neon shadow, duration-500
      className="relative w-full aspect-[4/5] overflow-hidden bg-slate-900 group rounded-[32px] border border-white/10 transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
      style={{ perspective: '1200px' }}
    >
      <div 
        className="w-full h-full relative transition-transform duration-100 ease-out"
        style={{
           transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
           transition: isHovered && !showDetail ? 'transform 0.1s' : 'transform 0.5s ease-out',
           transformStyle: 'preserve-3d'
        }}
      >
          {/* Animated Neon Gradient Border Overlay */}
          {/* Using a mask approach to ensure it is a 1px border sitting on top */}
          <div 
            className={`absolute inset-0 z-50 pointer-events-none rounded-[32px] border border-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            style={{
                background: 'linear-gradient(45deg, #A855F7, #F97316, #A855F7) border-box',
                WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
            }}
          />

          {/* Holographic Scan Line */}
          <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden opacity-0 group-hover:opacity-40 transition-opacity duration-500 rounded-[32px]">
             <div 
                className="w-full h-[25%] absolute -top-full"
                style={{
                    background: 'linear-gradient(to bottom, transparent, rgba(168, 85, 247, 0.8), transparent)',
                    animation: isHovered && !showDetail ? 'scan-line 2.5s linear infinite' : 'none',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
                }}
             />
          </div>

          {/* Background Media */}
          <div className="absolute inset-0 w-full h-full" style={{ transform: 'translateZ(0px)' }}>
             {/* UPDATE: duration-500 for smoother scaling */}
             {renderMedia(mediaSrc, title, "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105")}
          </div>
          
          {/* Bottom-Heavy Dark Gradient Overlay - Permanent readability layer */}
          <div className={`absolute inset-0 transition-all duration-500 z-10 ${showDetail ? 'bg-black/95' : 'bg-gradient-to-t from-black/90 via-black/40 to-transparent'}`} />

          {/* MAIN CONTENT LAYER - Flex Col Justify End to push everything to bottom */}
          <div className="absolute inset-0 z-40 flex flex-col justify-end px-8 pb-12" style={{ transform: 'translateZ(40px)' }}>
               
               {/* Content Wrapper - Animates up on hover */}
               <div className="flex flex-col gap-4 transition-transform duration-500 group-hover:-translate-y-2">
                   
                   {/* Header Group (ID + Title) */}
                   <div className="flex flex-col gap-2">
                        <span className="block text-[10px] tracking-[0.3em] uppercase text-purple-400 font-bold drop-shadow-sm">
                            {id}
                        </span>
                        <h3 className="text-3xl font-serif text-white leading-tight drop-shadow-lg">
                            {title}
                        </h3>
                   </div>

                   {/* Description / Detail Area */}
                   <div className="relative">
                        {/* Default Description View */}
                        <div className={`transition-all duration-500 ${showDetail ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100 h-auto'}`}>
                             <p className="text-sm text-gray-300 leading-relaxed line-clamp-3 drop-shadow-md">
                                {desc}
                             </p>
                        </div>

                        {/* Detail Scroll View - Expands upwards when active */}
                        <div className={`transition-all duration-500 ${showDetail ? 'opacity-100 h-[250px] mt-4' : 'opacity-0 h-0 overflow-hidden'}`}>
                            <div className="h-full overflow-y-auto pr-2 custom-scrollbar text-gray-300 font-light leading-relaxed text-sm">
                                {detailContent ? (
                                    detailContent.split('\n').map((line, idx) => (
                                        <React.Fragment key={idx}>
                                            {line}
                                            <br />
                                        </React.Fragment>
                                    ))
                                ) : (
                                    <span className="italic opacity-50">Content unavailable.</span>
                                )}
                            </div>
                        </div>
                   </div>

                   {/* Action Button */}
                   <div className="pt-2">
                       <button
                            onClick={toggleDetail}
                            className="group/btn relative inline-flex items-center justify-center px-6 py-3 overflow-hidden rounded-xl transition-all duration-300 hover:brightness-125"
                       >
                            {/* Dynamic Background */}
                            <div 
                               className="absolute inset-0 transition-all duration-300"
                               style={{
                                 background: showDetail 
                                    ? "linear-gradient(to right, #A855F7, #F97316)" 
                                    : "linear-gradient(rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05)) padding-box, linear-gradient(to right, #A855F7, #F97316) border-box",
                                 border: showDetail ? "none" : "1px solid transparent",
                                 borderRadius: "0.75rem",
                                 backdropFilter: showDetail ? "none" : "blur(4px)"
                               }}
                            />
                            <span className={`relative z-10 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors text-white`}>
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
               </div>
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
  
  // Use dynamic pillars array
  const pillars = data?.pillars || [];

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
        /* Custom Scrollbar for Details */
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
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

      {/* Dynamic Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 min-h-[60vh] max-w-[1800px] mx-auto">
        {pillars.length > 0 ? (
            pillars.map((pillar) => (
                <SciFiPillar 
                    key={pillar.id}
                    pillar={pillar}
                    renderMedia={renderMedia}
                />
            ))
        ) : (
            <div className="col-span-full text-center text-slate-400 py-12">
                Loading Strategic Pillars...
            </div>
        )}
      </div>
    </section>
  );
};

export default About;