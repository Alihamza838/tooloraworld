import React from 'react';
import { motion } from 'framer-motion';

export interface TabItem {
  label: string;
  path: string;
}

interface SlidingTabsProps {
  tabs: TabItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const SlidingTabs: React.FC<SlidingTabsProps> = ({
  tabs,
  activeIndex,
  onSelect
}) => {
  return (
    <div className="relative flex items-center p-0.5 rounded-lg bg-transparent">
      {tabs.map((tab, idx) => {
        const isActive = activeIndex === idx;
        return (
          <button
            key={tab.path}
            onClick={() => onSelect(idx)}
            className={`relative px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors duration-150 cursor-pointer select-none ${
              isActive
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="sliding-active-pill"
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                className="absolute inset-0 bg-white dark:bg-[#131B2E] rounded-lg shadow-2xs border border-slate-200/80 dark:border-[#1E293B] -z-10"
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SlidingTabs;
