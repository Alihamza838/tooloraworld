import React from 'react';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles.js';

export interface ToolGuide {
  title: string;
  steps: string[];
  tips: string;
}

interface ToolGuideCardProps {
  guide: ToolGuide;
}

export default function ToolGuideCard({ guide }: ToolGuideCardProps) {
  return (
    <div className="rounded-2xl p-5 sm:p-7 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs space-y-5 text-left">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-orange-600 text-white shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
            {guide.title}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-0.5">
            Step-by-step verified workflow
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {guide.steps.map((step, i) => (
          <div
            key={i}
            className="relative p-4 rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] transition-all hover:shadow-md group"
          >
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 bg-orange-600 text-white">
              Step {i + 1}
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
              {step}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F8F9FA] dark:bg-[#0B0F19] border border-slate-200/80 dark:border-[#1E293B]">
        <span className="text-lg shrink-0">💡</span>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-medium">
          <span className="font-bold text-slate-800 dark:text-zinc-200 mr-1">
            Pro tip:
          </span>
          {guide.tips}
        </p>
      </div>
    </div>
  );
}
