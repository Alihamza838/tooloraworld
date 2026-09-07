import React from 'react';
import { Table, ArrowUpDown } from 'lucide-react';

interface FactTableProps {
  caption: string;
  headers: string[];
  rows: string[][];
}

export const FactTable: React.FC<FactTableProps> = ({ caption, headers, rows }) => {
  return (
    <div className="my-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm">
      <div className="bg-slate-50 dark:bg-slate-800/60 px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Table className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            {caption}
          </span>
        </div>
        <span className="text-[10px] font-mono uppercase bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded font-semibold">
          AI & Search Grounding
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100/70 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
            <tr>
              {headers.map((header, idx) => (
                <th key={idx} className="px-4 py-3 whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {rows.map((row, rIdx) => (
              <tr 
                key={rIdx} 
                className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
              >
                {row.map((cell, cIdx) => (
                  <td 
                    key={cIdx} 
                    className={`px-4 py-3 ${
                      cIdx === 0 
                        ? 'font-medium text-slate-900 dark:text-slate-100' 
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
