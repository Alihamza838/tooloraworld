import React from 'react';
import { SourceCitation } from '../../types';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';

interface SourceCitationListProps {
  sources: SourceCitation[];
}

export const SourceCitationList: React.FC<SourceCitationListProps> = ({ sources }) => {
  return (
    <section 
      id="sources"
      className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs"
      aria-label="Primary Source Citations and Technical Standards"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Primary Standards & Technical Citations
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" />
          Peer-Reviewed References
        </span>
      </div>

      <div className="space-y-3">
        {sources.map((src, idx) => (
          <div 
            key={src.id || idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-800 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 font-mono">
                  [{idx + 1}]
                </span>
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-orange-600 dark:hover:text-orange-400 inline-flex items-center gap-1 group"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-orange-500 transition-colors shrink-0" />
                </a>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pl-5">
                Published by <strong>{src.publisher}</strong> · Accessed {src.accessedDate} {src.doiOrStandard ? `(${src.doiOrStandard})` : ''}
              </p>
            </div>

            <div className="shrink-0 self-end sm:self-center pl-5 sm:pl-0">
              <span className="text-[10px] font-mono font-bold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                Reliability: {src.reliabilityScore}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
