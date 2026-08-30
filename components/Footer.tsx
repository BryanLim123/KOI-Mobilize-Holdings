/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import type { SiteContent } from '../types';
import { subscribe } from '../services/contentService';

interface FooterProps {
  site: SiteContent;
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

const Footer: React.FC<FooterProps> = ({ site }) => {
  const [status, setStatus] = useState<Status>('idle');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { footer } = site;

  const handleSubscribe = async () => {
    if (!email) return;
    setStatus('loading');
    const result = await subscribe(email);

    if (result.ok) {
      setStatus('success');
      setEmail('');
      setMessage('');
    } else {
      setStatus('error');
      setMessage(result.message);
    }
    setTimeout(() => {
      setStatus('idle');
      setMessage('');
    }, 4000);
  };

  return (
    <footer id="footer" className="bg-slate-900 pt-16 pb-12 px-6 text-slate-400 border-t border-slate-800">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
        {/* Contact / branding */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <h4 className="text-2xl font-serif text-white mb-6">{site.companyName}</h4>
            <p className="max-w-xs font-light leading-relaxed mb-6">{footer.blurb}</p>
          </div>
          <div className="flex flex-col gap-1 text-sm font-light mt-auto">
            <span className="uppercase tracking-widest text-xs font-bold text-slate-500 mb-2">Contact</span>
            <a href={`mailto:${site.contactEmail}`} className="hover:text-white transition-colors">
              {site.contactEmail}
            </a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-white mb-6 tracking-wide text-xs uppercase">{footer.newsletterTitle}</h4>
          <p className="mb-6 font-light text-sm max-w-md">{footer.newsletterBlurb}</p>
          <div className="flex flex-col gap-4 max-w-md">
            <input
              type="email"
              placeholder="email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              disabled={status === 'loading' || status === 'success'}
              className="bg-transparent border-b border-slate-600 py-3 text-lg outline-none focus:border-white transition-colors placeholder-slate-600 text-white disabled:opacity-50"
            />
            <button
              onClick={handleSubscribe}
              disabled={status !== 'idle' || !email}
              className={`self-start text-xs font-bold uppercase tracking-widest mt-2 transition-all duration-300 ${
                status === 'success'
                  ? 'text-[#A855F7]'
                  : status === 'error'
                    ? 'text-amber-400'
                    : 'hover:text-white disabled:cursor-default disabled:hover:text-slate-500 disabled:opacity-50'
              }`}
            >
              {status === 'idle' && 'Subscribe'}
              {status === 'loading' && 'PROCESSING...'}
              {status === 'success' && 'SUCCESS!'}
              {status === 'error' && 'TRY AGAIN'}
            </button>

            {status === 'success' && (
              <p className="text-sm text-[#A855F7] font-medium animate-fade-in mt-2">
                {footer.newsletterSuccess}
              </p>
            )}
            {status === 'error' && message && (
              <p className="text-sm text-amber-400 font-light animate-fade-in mt-2">{message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest opacity-60 gap-4">
        <p>{site.copyright}</p>
        <div className="flex gap-6">
          {footer.legalLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
