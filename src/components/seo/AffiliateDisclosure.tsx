import React from 'react';
import { Info } from 'lucide-react';

export const AffiliateDisclosure: React.FC = () => {
  return (
    <aside 
      className="my-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-3.5 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed flex items-start gap-2.5"
      aria-label="Editorial Transparency & FTC Compliance Notice"
    >
      <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
      <div>
        <strong className="text-slate-800 dark:text-slate-200">FTC & Editorial Disclosure:</strong> Toolora is an independent, sovereign utility suite. Our technical benchmarks, articles, and recommendations are based on peer-reviewed W3C and ISO standards. We do not accept paid placements for editorial reviews.
      </div>
    </aside>
  );
};
