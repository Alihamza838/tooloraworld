import React from 'react';
import { KeyFactItem } from '../../types';
import { CheckCircle, Database, Gauge, HardDrive } from 'lucide-react';

interface KeyFactsBoxProps {
  facts: KeyFactItem[];
  title?: string;
}

export const KeyFactsBox: React.FC<KeyFactsBoxProps> = ({ 
  facts, 
  title = 'Essential Technical & Performance Facts' 
}) => {
  return (
    <div className="my-6 rounded-2xl border border-orange-100 dark:border-orange-900/40 bg-gradient-to-b from-orange-50/40 to-white dark:from-slate-900 dark:to-slate-900 p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="w-4 h-4 text-orange-600 dark:text-orange-400" />
        <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono">
          {title}
        </h4>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {facts.map((fact, idx) => (
          <div 
            key={idx}
            className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 p-3.5 flex flex-col justify-between shadow-xs hover:border-orange-300 dark:hover:border-orange-700 transition-all"
          >
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {fact.label}
            </span>
            <div className="my-1 text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              {fact.value}
            </div>
            {fact.metric && (
              <span className="text-[10px] font-mono text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 px-2 py-0.5 rounded w-fit">
                {fact.metric}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
