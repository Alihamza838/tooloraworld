import React from 'react';
import { useToolora } from '../context/TooloraContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Layers, Maximize2, CheckCircle2 } from 'lucide-react';

export default function MockupStudioBanner() {
  const { handleSelectTool } = useToolora();
  const navigate = useNavigate();

  const handleLaunch = (toolId: string = 'mockup-gen') => {
    if (typeof handleSelectTool === 'function') {
      handleSelectTool(toolId);
    }
    navigate(`/tools/${toolId}?tool=${toolId}`);
    setTimeout(() => {
      const el = document.getElementById('layout-view-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const productTags = [
    { label: 'Coffee Cups', icon: '☕' },
    { label: 'Soda Cans', icon: '🥤' },
    { label: 'T-Shirts', icon: '👕' },
    { label: 'Baseball Caps', icon: '🧢' },
    { label: 'Tote Bags', icon: '👜' },
    { label: 'Product Boxes', icon: '📦' },
    { label: 'Phone Cases', icon: '📱' },
    { label: 'Ceramic Mugs', icon: '🥛' },
    { label: 'Glass Bottles', icon: '🍾' }
  ];

  return (
    <section className="w-full my-8 animate-in fade-in duration-300">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1c1917] via-[#0f142c] to-[#0a0d1e] text-white p-6 sm:p-10 lg:p-12 shadow-2xl shadow-orange-950/20 border border-orange-500/20">
        
        {/* Ambient atmospheric glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-orange-500/15 via-rose-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />
        <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] bg-gradient-to-tr from-orange-600/15 via-amber-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Heading, description, interactive tags & CTA */}
          <div className="flex-1 space-y-5 text-left w-full">
            
            {/* Badges Header Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-400/30 text-[11px] font-black tracking-wider text-orange-200 uppercase font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping shrink-0" />
                <span>✨ NEW · BRANDING SUITE</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[11px] font-bold text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% In-Browser WebGL</span>
              </div>
            </div>

            {/* Display Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.15] font-display">
              Put your logo on real products
            </h2>

            {/* Descriptive body */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl font-normal">
              The new <strong className="text-white font-semibold">Mockup Studio Pro</strong> transforms your flat logos and vector graphics into photorealistic branded coffee cups, soda cans, t-shirts, baseball caps, product boxes, tote bags, and packaging. It blends directly with lighting, shadows, and surface contours using advanced WebGL displacement — <strong className="text-white font-semibold">100% locally on your machine with zero server uploads</strong>.
            </p>

            {/* Product Preset Interactive Chips */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Supported Product Mockups:
              </span>
              <div className="flex flex-wrap gap-2">
                {productTags.map((tag) => (
                  <button
                    key={tag.label}
                    onClick={() => handleLaunch('mockup-gen')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-orange-500 hover:text-white px-3.5 py-1.5 rounded-xl border border-white/15 hover:border-orange-400 transition-all cursor-pointer text-slate-200 hover:-translate-y-0.5 shadow-sm active:scale-95 select-none"
                  >
                    <span>{tag.icon}</span>
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons & Value Propostion */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => handleLaunch('mockup-gen')}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm sm:text-[14px] rounded-xl transition-all shadow-lg shadow-orange-500/25 active:scale-95 cursor-pointer hover:shadow-orange-500/40 font-display"
              >
                <span>Try the Mockup Generator</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleLaunch('mockup-gen')}
                className="inline-flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-[13px] rounded-xl transition-all border border-white/15 cursor-pointer active:scale-95"
              >
                <Layers className="w-4 h-4 text-orange-400" />
                <span>50+ Free Templates</span>
              </button>
            </div>

            {/* Key Quality Guarantees */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2 font-mono">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Watermarks</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant Ultra 4K PNG Export</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero File Uploads</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Stacked Product Showcase Visual Deck */}
          <div 
            onClick={() => handleLaunch('mockup-gen')}
            className="w-full lg:w-[380px] xl:w-[420px] shrink-0 rounded-3xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/15 p-6 sm:p-8 flex flex-col items-center justify-center relative cursor-pointer group/card overflow-hidden shadow-2xl hover:border-orange-500/40 transition-all duration-300"
          >
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full group-hover/card:translate-x-full transition-transform duration-1000" />

            <div className="relative flex items-center justify-center w-full h-[220px] sm:h-[240px] select-none">
              
              {/* Soda / Drink Can (Left Card) */}
              <div className="absolute left-2 sm:left-4 w-24 h-36 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 rounded-2xl shadow-2xl border border-white/40 flex flex-col justify-between p-3 transform -rotate-12 translate-y-3 group-hover/card:-rotate-8 group-hover/card:-translate-x-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">🥤</span>
                  <span className="text-[8px] font-bold font-mono px-1 py-0.5 bg-slate-800 text-white rounded">CAN</span>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-700">Soda Can</div>
                  <div className="w-full h-1.5 bg-orange-500 rounded-full mt-1" />
                </div>
              </div>

              {/* T-Shirt Center Flagship Card */}
              <div className="z-20 w-32 sm:w-36 h-44 sm:h-48 bg-gradient-to-b from-orange-500 to-amber-600 text-white rounded-2xl shadow-2xl border border-orange-300/40 flex flex-col items-center justify-between p-4 transform scale-105 group-hover/card:scale-110 group-hover/card:shadow-orange-500/30 transition-all duration-300">
                <div className="w-full flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase tracking-wider font-mono bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    NEW PRO
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
                </div>
                <div className="flex flex-col items-center my-auto">
                  <span className="text-5xl drop-shadow-md">👕</span>
                  <span className="text-[11px] font-bold tracking-tight text-white mt-1">Crew T-Shirt</span>
                </div>
                <div className="w-full bg-black/20 rounded-lg py-1 px-2 text-center text-[9px] font-mono font-semibold">
                  Multiply Shaders
                </div>
              </div>

              {/* Baseball Cap (Right Card) */}
              <div className="absolute right-2 sm:right-4 w-24 h-36 bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 rounded-2xl shadow-2xl border border-white/40 flex flex-col justify-between p-3 transform rotate-12 translate-y-3 group-hover/card:rotate-8 group-hover/card:translate-x-1 transition-all duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-3xl">🧢</span>
                  <span className="text-[8px] font-bold font-mono px-1 py-0.5 bg-emerald-700 text-white rounded">CAP</span>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-700">Snapback</div>
                  <div className="w-full h-1.5 bg-emerald-500 rounded-full mt-1" />
                </div>
              </div>

            </div>

            {/* Bottom Card Footer with Live Preview Trigger */}
            <div className="w-full pt-4 mt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-sans">
              <span className="font-semibold group-hover/card:text-orange-300 transition-colors flex items-center gap-1.5">
                <span>Click to Open Studio</span>
                <span className="group-hover/card:translate-x-1 transition-transform">➔</span>
              </span>
              <div className="p-1.5 rounded-lg bg-white/10 text-white/90 group-hover/card:bg-white/20 transition-colors">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
