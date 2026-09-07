// src/components/ui/VisualSeparator.tsx
import React from 'react';
import { BookOpen, Sparkles, SlidersHorizontal, Layers } from 'lucide-react';

interface VisualSeparatorProps {
  categoryLabel?: string;
  sectionTitle?: string;
  badgeText?: string;
  icon?: 'book' | 'tools' | 'sparkles' | 'layers';
  className?: string;
}

export const VisualSeparator: React.FC<VisualSeparatorProps> = ({
  categoryLabel = 'Tool Category',
  sectionTitle = 'Recommended Technical Articles & Guides',
  badgeText = 'Expert Documentation',
  icon = 'book',
  className = ''
}) => {
  const renderIcon = () => {
    switch (icon) {
      case 'tools':
        return <SlidersHorizontal className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
      case 'sparkles':
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      case 'layers':
        return <Layers className="w-4 h-4 text-blue-500" />;
      case 'book':
      default:
        return <BookOpen className="w-4 h-4 text-orange-600 dark:text-orange-400" />;
    }
  };

  return (
    <div className={`w-full my-8 ${className}`}>
      {/* Flex-based structural layout wrapper separating sections */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 via-white to-orange-50/30 dark:from-zinc-900/60 dark:via-zinc-900/30 dark:to-orange-950/20 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs relative overflow-hidden">
        {/* Subtle accent bar on top/left */}
        <div className="absolute top-0 left-0 right-0 sm:right-auto sm:bottom-0 sm:w-1.5 h-1 sm:h-auto bg-gradient-to-r sm:bg-gradient-to-b from-orange-500 via-amber-500 to-orange-600" />

        {/* Left Side: Context Badge & Category Identifier */}
        <div className="flex items-center gap-3.5 pl-0 sm:pl-2">
          <div className="w-10 h-10 rounded-xl bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-center shrink-0 shadow-xs">
            {renderIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 font-mono">
                {categoryLabel}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200/60 dark:border-zinc-700/50">
                {badgeText}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-100 font-display tracking-tight mt-0.5">
              {sectionTitle}
            </h2>
          </div>
        </div>

        {/* Right Side: Visual Divider Lines & Trust Indicator */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800/60">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% In-Browser · Zero File Uploads</span>
          </div>
          <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800 hidden md:block" />
          <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400">
            2 In-Depth Tutorials
          </span>
        </div>
      </div>
    </div>
  );
};

export default VisualSeparator;
