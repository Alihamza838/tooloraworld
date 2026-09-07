/**
 * HeroSection.tsx - Toolora Clean Responsive Hero Canvas
 * ─────────────────────────────────────────────────────────────
 * Clean, lightweight, fully responsive layout without heavy 3D transforms.
 * Designed for optimum performance and seamless mobile/desktop experience.
 */

import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToolora } from "../context/TooloraContext";
import HeroBackground from "./HeroBackground";
import {
  ChevronRight,
  Sparkles,
  X,
  Lock,
  Zap,
  Globe,
  Gift,
  LayoutGrid,
  FileText,
} from "lucide-react";

const TRUST_BADGES = [
  { icon: Lock, label: "Private" },
  { icon: Zap, label: "Instant" },
  { icon: Globe, label: "Offline" },
  { icon: Gift, label: "Free Forever" },
] as const;

interface HeroSectionProps {
  onDismiss: () => void;
}

export default function HeroSection({ onDismiss }: HeroSectionProps) {
  const navigate = useNavigate();
  const { setSelectedCategory, handleSelectTool } = useToolora();

  const handleBadgeClick = useCallback(() => {
    if (typeof setSelectedCategory === "function") {
      setSelectedCategory("pdf");
    }
  }, [setSelectedCategory]);

  const handleMockupStudioClick = useCallback(() => {
    if (typeof handleSelectTool === "function") {
      handleSelectTool("mockup-gen");
    }
    navigate("/tools/mockup-gen?tool=mockup-gen");
  }, [handleSelectTool, navigate]);

  const handleExploreClick = useCallback(() => {
    const toolsGrid = document.getElementById("tools-grid");
    if (toolsGrid) {
      toolsGrid.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { replace: true });
      setTimeout(() => {
        document
          .getElementById("tools-grid")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [navigate]);

  return (
    <section className="w-full relative overflow-hidden select-none py-8 sm:py-16 px-3 sm:px-6 lg:px-8">
      {/* 3D-Styled Semi-Transparent Floating Bubbles & Ambient Background */}
      <HeroBackground className="opacity-90 dark:opacity-95" />

      {/* ── OPEN HERO CONTENT CONTAINER (No card wrapper, seamless layout) ── */}
      <div className="relative z-10 max-w-[1270px] mx-auto flex flex-col justify-center items-center text-center">
        
        {/* Dismiss Button (Subtle top right) */}
        <div className="w-full flex justify-end mb-2">
          <button
            onClick={onDismiss}
            className="p-2 rounded-full min-h-[36px] min-w-[36px] flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-zinc-800/80 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Dismiss hero section"
            title="Dismiss hero"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ── NEW BADGE ─────────────────────────────────── */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/tools/pdf-editor?tool=pdf-editor"
            onClick={handleBadgeClick}
            className="group relative inline-flex items-center justify-center min-h-[40px] px-4 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-slate-200/90 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:border-orange-400 hover:shadow-orange-500/10 hover:scale-[1.02] active:scale-95"
          >
            <span className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <FileText className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-slate-800 dark:text-zinc-100">
                New: Advanced PDF Pro Slate
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Link>
        </div>

        {/* ── HEADINGS ────────────────────────────────────── */}
        <div className="max-w-4xl space-y-4">
          <h1 className="text-3xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] sm:leading-[0.98] font-display">
            Free online tools,
            <br />
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 dark:from-orange-400 dark:via-amber-400 dark:to-orange-500 bg-clip-text text-transparent">
              right in your browser
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 dark:text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal pt-1">
            No uploads. No limits. Enterprise-grade document, image &amp; PDF processing{" "}
            <br className="hidden sm:block" />
            running 100% locally on your own device hardware.
          </p>
        </div>

        {/* ── ACTION BUTTONS ──────────────────────────────────── */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 mt-8 mb-10 px-2 sm:px-0">
          <button
            onClick={handleExploreClick}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 border border-slate-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-100 font-extrabold rounded-xl hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-xs text-xs sm:text-sm cursor-pointer"
          >
            <LayoutGrid size={16} className="text-orange-600 dark:text-orange-400" />
            <span>Explore All 28 Tools</span>
          </button>

          <button
            onClick={handleMockupStudioClick}
            className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3 bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl active:scale-95 transition-all shadow-md shadow-orange-600/25 cursor-pointer"
          >
            <Sparkles size={16} className="text-amber-300 fill-current" />
            <span>Launch Mockup Studio</span>
            <ChevronRight size={15} />
          </button>
        </div>

        {/* ── TRUST BADGES ────────────────────────────────────── */}
        <div className="w-full pt-4">
          <div className="grid grid-cols-2 sm:flex sm:flex-row justify-center items-center gap-2 sm:gap-3 max-w-sm sm:max-w-none mx-auto">
            {TRUST_BADGES.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-center gap-2 px-3.5 sm:px-4 py-2 bg-white/80 dark:bg-zinc-900/80 rounded-xl border border-slate-200/80 dark:border-zinc-800 shadow-xs w-full sm:w-auto min-h-[40px]"
              >
                <item.icon className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300 whitespace-nowrap font-mono">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
