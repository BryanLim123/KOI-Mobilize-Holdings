/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Guided Q&A panel. Fully static — the script comes from the CMS, there is no
 * model call and no API key anywhere in the bundle.
 */

import React, { useState, useRef, useEffect } from 'react';
import type { AssistantContent, ChatMessage } from '../types';

interface AssistantProps {
  data: AssistantContent;
}

const Assistant: React.FC<AssistantProps> = ({ data }) => {
  const { title, welcomeMessage, qaItems } = data;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  // 'question' = answer still hidden; 'answer' = revealed, next click advances
  const [flowState, setFlowState] = useState<'question' | 'answer'>('question');

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current || qaItems.length === 0) return;
    setMessages([
      { role: 'model', text: welcomeMessage, timestamp: Date.now() },
      { role: 'model', text: qaItems[0].question, timestamp: Date.now() + 100 },
    ]);
    hasInitialized.current = true;
  }, [qaItems, welcomeMessage]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isOpen, flowState]);

  const push = (msg: ChatMessage) => setMessages((prev) => [...prev, msg]);

  const handleNext = () => {
    if (qaItems.length === 0) return;

    if (flowState === 'question') {
      push({ role: 'model', text: qaItems[currentIndex % qaItems.length].answer, timestamp: Date.now() });
      setFlowState('answer');
      return;
    }

    const nextIndex = (currentIndex + 1) % qaItems.length;
    setCurrentIndex(nextIndex);
    push({ role: 'model', text: qaItems[nextIndex].question, timestamp: Date.now() });
    setFlowState('question');
  };

  const handleSkip = () => {
    if (qaItems.length === 0) return;
    const nextIndex = (currentIndex + 1) % qaItems.length;
    setCurrentIndex(nextIndex);
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: 'Skip ⏩', timestamp: Date.now() },
      { role: 'model', text: qaItems[nextIndex].question, timestamp: Date.now() + 50 },
    ]);
    setFlowState('question');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl shadow-2xl w-[90vw] sm:w-[400px] h-[500px] md:h-[600px] mb-4 md:mb-6 flex flex-col overflow-hidden border border-white/20 animate-fade-in transition-all duration-300 ease-out">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#A855F7] to-[#F97316] p-4 md:p-5 border-b border-white/10 flex justify-between items-center relative z-10">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              <span className="font-serif italic text-white text-base md:text-lg tracking-wide drop-shadow-md">
                {title}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full p-1"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Transcript */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-8" ref={scrollRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div
                  className={`max-w-[90%] md:max-w-[85%] p-3 md:p-5 text-xs md:text-sm leading-relaxed whitespace-pre-line rounded-xl backdrop-blur-md border ${
                    msg.role === 'user'
                      ? 'bg-white/10 border-white/5 text-white/80 rounded-tr-none'
                      : 'bg-white/5 border-white/10 text-white rounded-tl-none shadow-[0_0_15px_rgba(0,0,0,0.2)]'
                  }`}
                >
                  <span className={msg.role === 'model' ? 'drop-shadow-[0_0_1px_rgba(255,255,255,0.4)]' : ''}>
                    {msg.text}
                  </span>
                </div>
              </div>
            ))}
            {qaItems.length === 0 && (
              <div className="text-center text-white/50 text-xs mt-10">No Q&amp;A configured yet.</div>
            )}
          </div>

          {/* Controls */}
          <div className="p-3 md:p-5 bg-white/5 backdrop-blur-md border-t border-white/10">
            <div className="flex gap-2 md:gap-4">
              <button
                onClick={handleNext}
                disabled={qaItems.length === 0}
                className="flex-1 py-3 md:py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:shadow-none disabled:hover:translate-y-0"
              >
                {flowState === 'question' ? 'Next (Reveal)' : 'Next (Question)'}
              </button>
              <button
                onClick={handleSkip}
                disabled={qaItems.length === 0}
                className="px-4 md:px-6 py-3 md:py-4 bg-transparent hover:bg-white/10 border border-white/20 rounded-lg text-white/80 hover:text-white text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all duration-300 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] disabled:opacity-50"
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-[#A855F7] to-[#F97316] text-white w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full shadow-lg hover:shadow-purple-500/50 hover:scale-110 transition-all duration-300 z-50 border border-white/20"
        aria-label="Open Q&A"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        ) : (
          <span className="font-serif italic text-base md:text-lg px-2 drop-shadow-md">Q&amp;A</span>
        )}
      </button>
    </div>
  );
};

export default Assistant;
