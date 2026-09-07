import React, { useState } from 'react';
import { Sparkles, Check, Copy, ShieldCheck } from 'lucide-react';

interface QuickAnswerBoxProps {
  definition: string;
  summaryBullets: string[];
  confidenceScore?: string;
  sourceKeyword?: string;
}

export const QuickAnswerBox: React.FC<QuickAnswerBoxProps> = ({
  definition,
  summaryBullets,
  confidenceScore = '99.5% Verified Standard',
  sourceKeyword
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${definition}\n\nKey Facts:\n${summaryBullets.map(b => `• ${b}`).join('\n')}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      id="quick-answer"
      className="my-6 rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-50/80 via-white to-amber-50/40 dark:from-orange-950/30 dark:via-slate-900/60 dark:to-slate-900/90 p-5 sm:p-6 shadow-sm shadow-orange-500/5 transition-all"
      aria-label="Executive Quick Answer & Summary"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-orange-100 dark:border-orange-900/40 mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-600 text-white shadow-sm shadow-orange-600/30">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-orange-900 dark:text-orange-300 font-mono">
              Quick Answer {sourceKeyword ? `· ${sourceKeyword}` : ''}
            </h3>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              {confidenceScore}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-xs"
          title="Copy Summary"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Direct Answer (Position 0 Target) */}
      <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed font-sans mb-4">
        {definition}
      </p>

      {/* Scannable Takeaways */}
      {summaryBullets.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-orange-100/60 dark:border-orange-900/20">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Core Takeaways for Search & AI Engines:
          </span>
          <ul className="grid sm:grid-cols-1 gap-2">
            {summaryBullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold text-[11px] mt-0.5">
                  ✓
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
