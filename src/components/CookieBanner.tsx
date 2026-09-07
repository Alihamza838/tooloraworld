import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie as CookieIcon, ShieldCheck } from 'lucide-react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('cookie-consent');
      if (!consent) {
        setShow(true);
      }
    } catch {
      setShow(false);
    }
  }, []);

  const handleConsent = (action: string) => {
    try {
      localStorage.setItem('cookie-consent', action);
    } catch (e) {
      console.warn('Could not store cookie consent in localStorage', e);
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside 
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-5 bg-white dark:bg-[#131B2E] border-t border-slate-200/80 dark:border-[#1E293B] shadow-2xl transition-colors text-left"
    >
      <div className="max-w-[1270px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 rounded-xl shrink-0 hidden sm:flex border border-orange-100 dark:border-orange-900/30">
            <CookieIcon className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-200 font-medium leading-relaxed">
              We use cookies to keep our local sandbox running and, with your consent, to
              show ads that help keep our developer tools free.{' '}
              <Link
                to="/privacy"
                className="text-orange-600 dark:text-orange-400 font-bold underline hover:opacity-80 transition-opacity whitespace-nowrap ml-1"
              >
                Read our Privacy Policy.
              </Link>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
          <button
            onClick={() => handleConsent('reject')}
            className="min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            Reject
          </button>
          <button
            onClick={() => handleConsent('accept')}
            className="min-h-[44px] px-5 py-2.5 text-xs font-black uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white rounded-xl shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            Accept All
          </button>
        </div>
      </div>
    </aside>
  );
}
