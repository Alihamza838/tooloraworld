import React, { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToolora } from '../context/TooloraContext';
import {
  FileText,
  Layers,
  Box,
  Minimize2,
  PenTool,
  ScanText,
  Scissors,
  Receipt,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface FloatingToolBadge {
  id: string;
  toolId: string;
  title: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  borderColor: string;
  glowColor: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  animationClass: string;
  delay?: string;
  scale?: number;
  hideOnMobile?: boolean;
}

const FLOATING_TOOLS: FloatingToolBadge[] = [
  // ── LEFT SIDE TOOLS ──────────────────────────────────────────
  {
    id: 'badge-pdf-editor',
    toolId: 'pdf-editor',
    title: 'PDF Editor',
    tag: 'Edit & Sign',
    icon: FileText,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-50 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/40',
    borderColor: 'hover:border-rose-400 dark:hover:border-rose-500/60',
    glowColor: 'rgba(244,63,94,0.18)',
    top: '6%',
    left: '2.5%',
    animationClass: 'animate-float-bubble-1',
    delay: '0s',
  },
  {
    id: 'badge-compressor',
    toolId: 'image-compressor',
    title: 'Image Compressor',
    tag: 'Up to -85%',
    icon: Minimize2,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-50 dark:bg-sky-950/50 border-sky-200/80 dark:border-sky-800/40',
    borderColor: 'hover:border-sky-400 dark:hover:border-sky-500/60',
    glowColor: 'rgba(14,165,233,0.18)',
    top: '46%',
    left: '1.8%',
    animationClass: 'animate-float-bubble-2',
    delay: '1.2s',
  },
  {
    id: 'badge-signature',
    toolId: 'signature-maker',
    title: 'Digital Signature',
    tag: 'Zero Upload',
    icon: PenTool,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/40',
    borderColor: 'hover:border-amber-400 dark:hover:border-amber-500/60',
    glowColor: 'rgba(245,158,11,0.18)',
    bottom: '8%',
    left: '4%',
    animationClass: 'animate-float-bubble-4',
    delay: '0.8s',
  },
  {
    id: 'badge-merge-pdf',
    toolId: 'pdf-merger',
    title: 'Merge PDF',
    tag: 'Batch Join',
    icon: Layers,
    iconColor: 'text-orange-600 dark:text-orange-400',
    iconBg: 'bg-orange-50 dark:bg-orange-950/50 border-orange-200/80 dark:border-orange-800/40',
    borderColor: 'hover:border-orange-400 dark:hover:border-orange-500/60',
    glowColor: 'rgba(249,115,22,0.18)',
    top: '12%',
    left: '22%',
    animationClass: 'animate-float-bubble-3',
    delay: '3.5s',
    hideOnMobile: true,
  },

  // ── RIGHT SIDE TOOLS ─────────────────────────────────────────
  {
    id: 'badge-mockup',
    toolId: 'mockup-gen',
    title: '3D Mockup Studio',
    tag: 'WebGL Canvas',
    icon: Box,
    iconColor: 'text-purple-600 dark:text-purple-400',
    iconBg: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200/80 dark:border-purple-800/40',
    borderColor: 'hover:border-purple-400 dark:hover:border-purple-500/60',
    glowColor: 'rgba(168,85,247,0.18)',
    top: '7%',
    right: '3%',
    animationClass: 'animate-float-bubble-2',
    delay: '1.6s',
  },
  {
    id: 'badge-ocr',
    toolId: 'ocr-tool',
    title: 'OCR Scanner',
    tag: 'Extract Text',
    icon: ScanText,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/40',
    borderColor: 'hover:border-emerald-400 dark:hover:border-emerald-500/60',
    glowColor: 'rgba(16,185,129,0.18)',
    top: '44%',
    right: '2%',
    animationClass: 'animate-float-bubble-1',
    delay: '2.2s',
  },
  {
    id: 'badge-bg-remover',
    toolId: 'bg-remover',
    title: 'AI Bg Remover',
    tag: 'Transparent PNG',
    icon: Scissors,
    iconColor: 'text-pink-600 dark:text-pink-400',
    iconBg: 'bg-pink-50 dark:bg-pink-950/50 border-pink-200/80 dark:border-pink-800/40',
    borderColor: 'hover:border-pink-400 dark:hover:border-pink-500/60',
    glowColor: 'rgba(236,72,153,0.18)',
    bottom: '9%',
    right: '5%',
    animationClass: 'animate-float-bubble-3',
    delay: '0.4s',
  },
  {
    id: 'badge-invoice',
    toolId: 'invoice-generator',
    title: 'Invoice Maker',
    tag: 'Print Ready',
    icon: Receipt,
    iconColor: 'text-teal-600 dark:text-teal-400',
    iconBg: 'bg-teal-50 dark:bg-teal-950/50 border-teal-200/80 dark:border-teal-800/40',
    borderColor: 'hover:border-teal-400 dark:hover:border-teal-500/60',
    glowColor: 'rgba(20,184,166,0.18)',
    top: '13%',
    right: '20%',
    animationClass: 'animate-float-bubble-4',
    delay: '2.8s',
    hideOnMobile: true,
  },
];

export interface HeroBackgroundProps {
  className?: string;
  showGrid?: boolean;
  showAmbientGradients?: boolean;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = memo(({
  className = '',
  showGrid = true,
  showAmbientGradients = true,
}) => {
  const navigate = useNavigate();
  const { handleSelectTool } = useToolora();

  const handleToolClick = (toolId: string) => {
    if (typeof handleSelectTool === 'function') {
      handleSelectTool(toolId);
    }
    navigate(`/tools/${toolId}?tool=${toolId}`);
    setTimeout(() => {
      const el = document.getElementById('layout-view-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 80);
  };

  return (
    <div
      aria-hidden="false"
      className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-0 ${className}`}
    >
      {/* ── DYNAMIC AMBIENT GLOW GRADIENTS ── */}
      {showAmbientGradients && (
        <>
          <div className="absolute top-[-15%] left-[18%] w-[55vw] h-[460px] bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.14),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(249,115,22,0.11),transparent_70%)] blur-3xl transform -translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[12%] w-[48vw] h-[420px] bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.10),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(234,88,12,0.07),transparent_70%)] blur-3xl pointer-events-none" />
        </>
      )}

      {/* ── SUBTLE BACKGROUND GRID PATTERN ── */}
      {showGrid && (
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      )}

      {/* ── AMBIENT GLASS SPHERES (Subtle, blurred in background for depth) ── */}
      <div className="absolute top-[8%] left-[2%] w-24 h-24 rounded-full bg-gradient-to-br from-orange-200/30 to-amber-300/10 dark:from-orange-500/10 dark:to-transparent blur-xl pointer-events-none" />
      <div className="absolute bottom-[10%] right-[3%] w-32 h-32 rounded-full bg-gradient-to-br from-orange-300/25 to-pink-300/10 dark:from-orange-500/10 dark:to-transparent blur-2xl pointer-events-none" />
      <div className="absolute top-[48%] right-[1%] w-20 h-20 rounded-full bg-gradient-to-br from-sky-200/30 to-indigo-300/10 dark:from-sky-500/10 dark:to-transparent blur-lg pointer-events-none" />

      {/* ── FLOATING TOOL BADGES (Replaces plain bubbles with real interactive tool icons) ── */}
      <div className="relative w-full h-full">
        {FLOATING_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const style: React.CSSProperties = {
            top: tool.top,
            bottom: tool.bottom,
            left: tool.left,
            right: tool.right,
            animationDelay: tool.delay,
          };

          return (
            <div
              key={tool.id}
              style={style}
              className={`absolute pointer-events-auto cursor-pointer group ${tool.animationClass} ${
                tool.hideOnMobile ? 'hidden xl:block' : 'hidden sm:block'
              }`}
              onClick={() => handleToolClick(tool.toolId)}
              title={`Launch ${tool.title}`}
              role="button"
              tabIndex={0}
            >
              {/* Floating Pill Card with Glassmorphism & 3D Lighting */}
              <div 
                style={{
                  boxShadow: `0 12px 32px -6px ${tool.glowColor}, 0 2px 8px rgba(0,0,0,0.04)`
                }}
                className={`flex items-center gap-2.5 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md border border-slate-200/90 dark:border-zinc-700/80 shadow-sm ${tool.borderColor} transition-all duration-300 hover:scale-105 hover:-translate-y-1 active:scale-95`}
              >
                {/* Icon Capsule with soft gradient & border */}
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${tool.iconBg} ${tool.iconColor} shadow-2xs group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>

                {/* Text Labels */}
                <div className="flex flex-col text-left leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold font-display text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors whitespace-nowrap">
                      {tool.title}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-orange-500" />
                  </div>
                  <span className="text-[10px] font-medium font-mono text-slate-400 dark:text-zinc-400">
                    {tool.tag}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

HeroBackground.displayName = 'HeroBackground';

export default HeroBackground;
