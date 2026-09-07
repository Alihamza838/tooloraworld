import React from 'react';
import { ChangelogEntry } from '../../types';
import { History, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

interface ChangelogBoxProps {
  changelog: ChangelogEntry[];
}

export const ChangelogBox: React.FC<ChangelogBoxProps> = ({ changelog }) => {
  return (
    <section 
      id="changelog"
      className="my-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-5 sm:p-6 shadow-xs"
      aria-label="Editorial Changelog and Revision History"
    >
      <div className="flex items-center gap-2 pb-3 border-b border-slate-200 dark:border-slate-800 mb-4">
        <History className="w-5 h-5 text-orange-600 dark:text-orange-400" />
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          Document Revision History & Editorial Changelog
        </h3>
      </div>

      <div className="space-y-3">
        {changelog.map((entry, idx) => (
          <div 
            key={idx}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-start gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase mt-0.5 ${
                entry.type === 'security'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                  : entry.type === 'major'
                  ? 'bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}>
                v{entry.version}
              </span>
              <div>
                <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200">
                  {entry.summary}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Edited by <strong>{entry.editor}</strong> on {entry.date}
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-400 dark:text-slate-500 self-end sm:self-center">
              {entry.type.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
