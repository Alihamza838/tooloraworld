import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tool } from '../../types';
import LucideIcon from '../LucideIcon';

interface RelatedToolsSectionProps {
  tools: Tool[];
}

export default function RelatedToolsSection({ tools }: RelatedToolsSectionProps) {
  const navigate = useNavigate();

  if (!tools || tools.length === 0) return null;

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs space-y-4 text-left">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-orange-600 dark:bg-orange-500" />
        <h3 className="text-sm font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
          Related Tools
        </h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => {
              navigate(`/tools/${tool.id}?tool=${tool.id}`);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="p-4 min-h-[72px] text-left rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] transition-all group cursor-pointer hover:border-orange-400 hover:shadow-md active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                <LucideIcon name={tool.icon} className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug line-clamp-1">
                {tool.name}
              </p>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 leading-snug">
              {tool.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
