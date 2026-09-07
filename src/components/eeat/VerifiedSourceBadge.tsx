import React from 'react';
import { ShieldCheck, CheckCircle, RefreshCw, Cpu } from 'lucide-react';

interface VerifiedSourceBadgeProps {
  auditId?: string;
  lastAuditedDate?: string;
  standard?: string;
}

export const VerifiedSourceBadge: React.FC<VerifiedSourceBadgeProps> = ({
  auditId = 'EEAT-AUDIT-2026-V8',
  lastAuditedDate = 'August 26, 2026',
  standard = 'W3C / ISO 32000-2 Verified'
}) => {
  return (
    <div className="my-4 inline-flex flex-wrap items-center gap-3 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-xs">
      <div className="flex items-center gap-1.5 font-semibold text-emerald-700 dark:text-emerald-400">
        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>E-E-A-T Verified Standard</span>
      </div>

      <div className="hidden sm:block h-3.5 w-px bg-slate-300 dark:bg-slate-700" />

      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-[11px]">
        <Cpu className="w-3.5 h-3.5 text-orange-500" />
        <span>Compliance: <strong>{standard}</strong></span>
      </div>

      <div className="hidden md:block h-3.5 w-px bg-slate-300 dark:bg-slate-700" />

      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
        <span>Audit Ref: {auditId}</span>
      </div>
    </div>
  );
};
