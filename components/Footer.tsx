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

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <footer id="footer" className="bg-slate-900 pt-24 pb-12 px-6 text-slate-400">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        <div className="md:col-span-4">
          <h4 className="text-2xl font-serif text-white mb-6">KOI Mobilize Holdings</h4>
          <p className="max-w-xs font-light leading-relaxed mb-6">
            A Global IP Platform Connecting Games, Media, and Digital Assets.
          </p>
          <div className="flex flex-col gap-1 text-sm font-light">
             <span className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-2">Contact</span>
             <a href="mailto:info@koinflation.co" className="hover:text-white transition-colors">info@koinflation.co</a>
          </div>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 tracking-wide text-xs uppercase">Ecosystem</h4>
          <ul className="space-y-4 font-light text-sm">
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:text-white transition-colors underline-offset-4 hover:underline">MsKOI</a></li>
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Pumfys</a></li>
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:text-white transition-colors underline-offset-4 hover:underline">KOI City</a></li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-bold text-white mb-6 tracking-wide text-xs uppercase">Company</h4>
          <ul className="space-y-4 font-light text-sm">
            <li><a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Our Vision</a></li>
            <li><a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Mission</a></li>
            <li><a href="#journal" onClick={(e) => onLinkClick(e, 'journal')} className="hover:text-white transition-colors underline-offset-4 hover:underline">Insights</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-bold text-white mb-6 tracking-wide text-xs uppercase">Stay Updated</h4>
          <div className="flex flex-col gap-4">
            <input 
              type="email" 
              placeholder="email@company.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribeStatus === 'loading' || subscribeStatus === 'success'}
              className="bg-transparent border-b border-slate-600 py-2 text-lg outline-none focus:border-white transition-colors placeholder-slate-600 text-white disabled:opacity-50" 
            />
            <button 
              onClick={handleSubscribe}
              disabled={subscribeStatus !== 'idle' || !email}
              className="self-start text-xs font-bold uppercase tracking-widest mt-2 hover:text-white disabled:cursor-default disabled:hover:text-slate-500 disabled:opacity-50 transition-opacity"
            >
              {subscribeStatus === 'idle' && 'Subscribe'}
              {subscribeStatus === 'loading' && 'Processing...'}
              {subscribeStatus === 'success' && 'Subscribed'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-20 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest opacity-60">
        <p>&copy; 2025 KOI Mobilize Holdings. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;