import React from 'react';
import { useToolora } from '../context/TooloraContext';
import { useNavigate } from 'react-router-dom';
import { 
  PenTool, 
  Sparkles, 
  FileText, 
  ScanText, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  CheckCircle2,
  Layers,
  Box,
  Briefcase,
  FileCheck
} from 'lucide-react';

interface MainToolItem {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  category: string;
  description: string;
  icon: React.ElementType;
  iconGradient: string;
  borderHover: string;
  glowHover: string;
  features: string[];
  cta: string;
  stat: string;
}

const MAIN_TOOLS: MainToolItem[] = [
  {
    id: 'pdf-editor',
    name: 'Interactive PDF Slate & Editor',
    badge: 'FLAGSHIP • PDF',
    badgeColor: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    category: 'PDF Document Studio',
    description: 'Type anywhere over documents, draw freehand, stamp signatures, redact text, and export crisp vector pages.',
    icon: PenTool,
    iconGradient: 'from-orange-500 to-amber-500 text-white shadow-orange-500/25',
    borderHover: 'hover:border-orange-500/50',
    glowHover: 'hover:shadow-orange-500/10',
    features: ['Direct In-Browser Annotation', 'Legal Signature Stamping', 'Zero-Upload Privacy'],
    cta: 'Open PDF Editor',
    stat: '4.9 ★ • 120k+ docs'
  },
  {
    id: 'mockup-gen',
    name: '3D Product Mockup Studio',
    badge: '3D ENGINE',
    badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    category: 'Brand & Apparel Studio',
    description: 'Generate photorealistic 3D apparel, ceramic mugs, packaging boxes, tech devices, and merchandise showcases in real-time.',
    icon: Sparkles,
    iconGradient: 'from-amber-500 to-rose-500 text-white shadow-rose-500/25',
    borderHover: 'hover:border-amber-500/50',
    glowHover: 'hover:shadow-amber-500/10',
    features: ['Real-Time WebGL Lighting', 'Custom Displacement Maps', 'Ultra 4K PNG Export'],
    cta: 'Launch 3D Studio',
    stat: 'Photorealistic WebGL'
  },
  {
    id: 'resume-cv-builder',
    name: 'ATS-Friendly Resume & CV Builder',
    badge: 'CAREER PRO',
    badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    category: 'Professional Careers',
    description: 'Build recruiter-grade, ATS-optimized curriculum vitae with semantic layout grids, live preview, and instant print export.',
    icon: Briefcase,
    iconGradient: 'from-emerald-500 to-teal-500 text-white shadow-emerald-500/25',
    borderHover: 'hover:border-emerald-500/50',
    glowHover: 'hover:shadow-emerald-500/10',
    features: ['100% ATS Parser Safe', 'Modern Clean Layouts', 'Instant PDF Download'],
    cta: 'Build Resume & CV',
    stat: 'Recruiter Verified'
  },
  {
    id: 'ocr-tool',
    name: 'Smart Image to Text (OCR)',
    badge: 'WASM AI',
    badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    category: 'Vision & Extraction',
    description: 'Extract raw selectable text, tables, and Markdown from scanned papers, receipts, screenshots, and photos at lightning speed.',
    icon: ScanText,
    iconGradient: 'from-purple-500 to-violet-600 text-white shadow-purple-500/25',
    borderHover: 'hover:border-purple-500/50',
    glowHover: 'hover:shadow-purple-500/10',
    features: ['Multi-Language Tesseract', 'Table & Formatting Parse', 'Confidential On-Device'],
    cta: 'Extract Plain Text',
    stat: '100+ Languages'
  }
];

export default function FeaturedMainTools() {
  const { handleSelectTool } = useToolora();
  const navigate = useNavigate();

  const handleLaunch = (toolId: string) => {
    if (typeof handleSelectTool === 'function') {
      handleSelectTool(toolId);
    }
    navigate(`/tools/${toolId}?tool=${toolId}`);
    
    // Smooth scroll to active tool
    setTimeout(() => {
      const el = document.getElementById('layout-view-panel');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <section className="w-full mb-8 pt-2">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 border border-orange-200/60 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 text-[11px] font-black uppercase tracking-wider font-mono mb-2">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Top Flagship Workspaces</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            Core Flagship Utilities
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1 max-w-2xl font-normal">
            High-precision, client-side workspaces engineered for everyday enterprise workflows with 0% data transmission to the cloud.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Hardware Accelerated • 100% Private</span>
        </div>
      </div>

      {/* 4-Item Responsive Bento / Flex Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {MAIN_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <div
              key={tool.id}
              onClick={() => handleLaunch(tool.id)}
              className={`group relative rounded-2xl bg-white dark:bg-[#0E131F]/90 border border-slate-200/90 dark:border-zinc-800/90 p-5 sm:p-6 transition-all duration-300 ${tool.borderHover} ${tool.glowHover} shadow-sm hover:shadow-xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden`}
            >
              {/* Subtle Ambient Hover Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-500" />

              {/* Card Top Row: Icon + Badge */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.iconGradient} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300 shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border font-mono ${tool.badgeColor} shrink-0`}>
                    {tool.badge}
                  </span>
                </div>

                {/* Tool Name & Category */}
                <div className="mb-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-mono">
                    {tool.category}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors font-display leading-snug">
                    {tool.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-3 leading-relaxed mb-4 font-normal">
                  {tool.description}
                </p>

                {/* Key Features List */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-zinc-800/80 mb-5">
                  {tool.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-zinc-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Live Stat & Action Button */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-500 mb-3">
                  <span>{tool.stat}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
                </div>

                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-orange-600 dark:bg-zinc-900 dark:hover:bg-orange-600 text-slate-800 hover:text-white dark:text-zinc-200 dark:hover:text-white border border-slate-200 dark:border-zinc-800 hover:border-orange-600 font-bold text-xs flex items-center justify-center gap-2 transition-all duration-200 group-hover:shadow-md group-hover:shadow-orange-600/20"
                >
                  <span>{tool.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
