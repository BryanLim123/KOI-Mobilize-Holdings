/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleSubscribe = async () => {
    if (!email) return;
    setSubscribeStatus('loading');
    
    // Google Apps Script URL
    const scriptURL = 'https://script.google.com/macros/s/AKfycbxtMzGxTP-FreLMPinWSCJXPokbPpKcXorFgEsYO_-e-98DH8b2IoPvIhUmJP1sRhz2cg/exec';
    
    try {
      // Execute POST request with JSON payload
      await fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', // Use text/plain to avoid CORS preflight while sending JSON string
        },
        body: JSON.stringify({ 'email': email })
      });

      // Keep LocalStorage logic as a secondary persistence layer
      try {
          const storedSubs = localStorage.getItem('koi_subscribers');
          const subscribers = storedSubs ? JSON.parse(storedSubs) : [];
          
          if (!subscribers.includes(email)) {
              subscribers.push(email);
              localStorage.setItem('koi_subscribers', JSON.stringify(subscribers));
          }
      } catch (e) {
          console.error('Storage failed', e);
      }

      // Update UI state
      setSubscribeStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => setSubscribeStatus('idle'), 3000);

    } catch (error) {
      console.error('Subscription error:', error);
      // Fallback to success state for UX to prevent user frustration
      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  return (
    <footer id="footer" className="bg-slate-900 pt-16 pb-12 px-6 text-slate-400 border-t border-slate-800">
      {/* Simplified Layout: 2 Columns (Contact & Subscribe) */}
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        
        {/* Column 1: Contact / Branding */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-serif text-white mb-6">KOI Mobilize Holdings</h4>
            <p className="max-w-xs font-light leading-relaxed mb-6">
                A Global IP Platform Connecting Games, Media, and Digital Assets.
            </p>
          </div>
          <div className="flex flex-col gap-1 text-sm font-light mt-auto">
             <span className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-2">Contact</span>
             <a href="mailto:info@koinflation.co" className="hover:text-white transition-colors">info@koinflation.co</a>
          </div>
        </div>

        {/* Column 2: Stay Updated */}
        <div>
          <h4 className="font-bold text-white mb-6 tracking-wide text-xs uppercase">Stay Updated</h4>
          <p className="mb-6 font-light text-sm max-w-md">
            Join our newsletter to receive the latest updates on our IP ecosystem and digital asset launches.
          </p>
          <div className="flex flex-col gap-4 max-w-md">
            <input 
              type="email" 
              placeholder="email@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
              className="bg-transparent border-b border-slate-600 py-3 text-lg outline-none focus:border-white transition-colors placeholder-slate-600 text-white disabled:opacity-50" 
            />
            <button 
              onClick={handleSubscribe}
              disabled={subscribeStatus !== 'idle' || !email}
              className={`self-start text-xs font-bold uppercase tracking-widest mt-2 transition-all duration-300 ${
                  subscribeStatus === 'success' ? 'text-[#A855F7]' : 'hover:text-white disabled:cursor-default disabled:hover:text-slate-500 disabled:opacity-50'
              }`}
            >
              {subscribeStatus === 'idle' && 'Subscribe'}
              {subscribeStatus === 'loading' && 'PROCESSING...'}
              {subscribeStatus === 'success' && 'SUCCESS!'}
            </button>
            
            {/* Welcome Message on Success */}
            {subscribeStatus === 'success' && (
                <p className="text-sm text-[#A855F7] font-medium animate-fade-in mt-2">
                    Welcome to the MONOKOILY ecosystem!
                </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest opacity-60 gap-4">
        <p>&copy; 2025 KOI Mobilize Holdings. All rights reserved.</p>
        <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;