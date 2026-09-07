import React from 'react';
import { Sparkles, Layers, ShieldCheck } from 'lucide-react';

interface ArticleImagePlaceholderProps {
  title: string;
  category: string;
  aspectRatio?: string;
}

export const ArticleImagePlaceholder: React.FC<ArticleImagePlaceholderProps> = ({
  title,
  category,
  aspectRatio = '16/9'
}) => {
  return (
    <div 
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-orange-500/20 p-6 flex flex-col justify-between text-white my-6 shadow-xl"
      style={{ aspectRatio }}
    >
      {/* Decorative ambient elements */}
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between z-10">
        <span className="text-[11px] font-mono font-bold tracking-widest uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10 text-orange-300">
          {category}
        </span>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
          <ShieldCheck className="w-4 h-4" />
          <span>Vector Master</span>
        </div>
      </div>

      <div className="z-10 my-auto">
        <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white line-clamp-2 max-w-xl">
          {title}
        </h3>
        <p className="text-xs text-orange-200/70 mt-2 font-mono">
          Toolora High-DPI Zero-Crop Graphical Pipeline
        </p>
      </div>

      <div className="flex items-center justify-between z-10 pt-4 border-t border-white/10 text-[11px] text-white/60">
        <span>300 DPI Vector Spec</span>
        <span>HTML5 Canvas Level 2</span>
      </div>
    </div>
  );
};
