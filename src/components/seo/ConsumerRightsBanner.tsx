import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server } from 'lucide-react';

export const ConsumerRightsBanner: React.FC = () => {
  return (
    <div className="my-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/20 p-4 sm:p-5 text-slate-800 dark:text-slate-200">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-emerald-950 dark:text-emerald-300">
              Verified Zero-Upload Privacy Guarantee & Consumer Rights
            </h4>
            <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 mt-1 leading-relaxed">
              Under GDPR Article 25 (Data Protection by Design) and CCPA standards, Toolora executes all document and graphic conversions <strong>locally in your browser RAM</strong>. Files are never stored, transmitted, indexed, or analyzed.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center text-[11px] font-mono font-semibold bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400">
          <Lock className="w-3.5 h-3.5" />
          <span>Local Sandbox Active</span>
        </div>
      </div>
    </div>
  );
};
