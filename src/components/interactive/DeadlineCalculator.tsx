import React, { useState } from 'react';
import { Calculator, Clock, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const DeadlineCalculator: React.FC = () => {
  const [fileCount, setFileCount] = useState<number>(5);
  const [fileType, setFileType] = useState<'pdf' | 'mockup' | 'ocr'>('mockup');
  const [cloudLatencyMs, setCloudLatencyMs] = useState<number>(4500);

  // Calculate local vs cloud time savings
  const localTimePerItemSec = fileType === 'mockup' ? 0.05 : fileType === 'pdf' ? 0.1 : 0.8;
  const cloudTimePerItemSec = (cloudLatencyMs / 1000) + (fileType === 'mockup' ? 2 : fileType === 'pdf' ? 3 : 4);

  const totalLocalSec = (fileCount * localTimePerItemSec).toFixed(2);
  const totalCloudSec = (fileCount * cloudTimePerItemSec).toFixed(1);
  const timeSavedSec = (Number(totalCloudSec) - Number(totalLocalSec)).toFixed(1);
  const dataKeptLocalMb = (fileCount * (fileType === 'mockup' ? 8.5 : fileType === 'pdf' ? 12.0 : 4.2)).toFixed(1);

  return (
    <div className="my-8 rounded-2xl border border-orange-200 dark:border-orange-900/60 bg-gradient-to-br from-orange-50/70 via-white to-amber-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/40 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-orange-100 dark:border-orange-900/40 mb-4">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-lg bg-orange-600 text-white">
            <Calculator className="w-4 h-4" />
          </span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Interactive Local-First Efficiency & Privacy Calculator
          </h4>
        </div>
        <span className="text-[10px] font-mono font-bold bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
          MICRO-TOOL
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Batch Asset Count: <span className="font-mono text-orange-600 dark:text-orange-400 font-bold">{fileCount} files</span>
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={fileCount}
            onChange={(e) => setFileCount(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
            Workload Archetype:
          </label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value as any)}
            className="w-full text-xs font-medium px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          >
            <option value="mockup">3D Brand Mockup Simulation</option>
            <option value="pdf">Client-Side PDF Manipulation & Redaction</option>
            <option value="ocr">Bilingual Neural OCR Extraction</option>
          </select>
        </div>
      </div>

      {/* Metrics outcome */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-orange-100 dark:border-orange-900/40">
        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Total Toolora Time</span>
          <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
            {totalLocalSec}s
          </div>
          <span className="text-[10px] text-slate-400">Instant RAM pipeline</span>
        </div>

        <div className="p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Est. Cloud SaaS Time</span>
          <div className="text-lg font-black text-slate-600 dark:text-slate-300 font-mono">
            {totalCloudSec}s
          </div>
          <span className="text-[10px] text-slate-400">Upload + Queue latency</span>
        </div>

        <div className="p-3 rounded-xl bg-orange-600 text-white shadow-md shadow-orange-600/20">
          <span className="text-[11px] text-orange-100">Zero Cloud Ingress</span>
          <div className="text-lg font-black font-mono">
            {dataKeptLocalMb} MB
          </div>
          <span className="text-[10px] text-orange-200">100% Kept on device</span>
        </div>
      </div>
    </div>
  );
};
