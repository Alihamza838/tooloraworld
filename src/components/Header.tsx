/**
 * Header.tsx - Toolora Header & Main Navigation Bar
 * ─────────────────────────────────────────────────────────────
 * Refactored with Toolora Soft Off-White (#F8F9FA) & Slate Navy (#0B0F19) Palette.
 * Features 100% zero em-dashes, smooth hover dropdowns, native PWA install trigger,
 * and responsive navigation controls.
 */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToolora } from "../context/TooloraContext";
import TooloraLogo from "./TooloraLogo";
import SearchBox from "./SearchBox";
import {
  ArrowRight,
  ChevronDown,
  Download,
  FileText,
  Image as ImageIcon,
  Layers,
  LayoutGrid,
  Menu,
  Moon,
  Receipt,
  Sun,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidingTabs } from "./ui/SlidingTabs";

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface HeaderProps {
  isSidebarOpen?: boolean;
  setIsSidebarOpen?: (val: boolean | ((prev: boolean) => boolean)) => void;
  onOpenMobileMenu: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
  setShowPrivacy?: (show: boolean) => void;
  setShowTerms?: (show: boolean) => void;
}

// ─── FEATURED TOOLS IN DROPDOWN ──────────────────────────────────────────────
const FEATURED_TOOLS = [
  {
    id: "mockup-gen",
    label: "Mockup Studio Pro",
    description: "Visualize your brand on real products",
    icon: ImageIcon,
    iconBg: "bg-orange-50 dark:bg-orange-950/40",
    iconColor: "text-orange-600 dark:text-orange-400",
    badge: "New",
    badgeColor:
      "bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400",
  },
  {
    id: "invoice-generator",
    label: "Invoice Generator",
    description: "Professional PDF invoices in seconds",
    icon: Receipt,
    iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    badge: null,
    badgeColor: "",
  },
  {
    id: "resume-cv-builder",
    label: "Resume & CV Builder",
    description: "ATS-optimized resumes, locally built",
    icon: FileText,
    iconBg: "bg-violet-50 dark:bg-violet-950/40",
    iconColor: "text-violet-600 dark:text-violet-400",
    badge: "Popular",
    badgeColor:
      "bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400",
  },
  {
    id: "pdf-editor",
    label: "Interactive PDF Editor",
    description: "Merge, split, compress and convert PDFs",
    icon: Layers,
    iconBg: "bg-rose-50 dark:bg-rose-950/40",
    iconColor: "text-rose-600 dark:text-rose-400",
    badge: null,
    badgeColor: "",
  },
] as const;

// ─── DROPDOWN ANIMATION VARIANTS ─────────────────────────────────────────────
const dropdownVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.18,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.97,
    transition: {
      duration: 0.12,
      ease: "easeIn" as const,
    },
  },
} as const;

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function Header({
  isSidebarOpen,
  setIsSidebarOpen,
  onOpenMobileMenu,
}: HeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    theme,
    toggleTheme,
    installing,
    isAppInstalled,
    executeNativePWAInstall,
    handleSelectTool,
  } = useToolora();

  // ── Dropdown open states ──────────────────────────────────────────────────
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);

  // ── SlidingTabs configuration ─────────────────────────────────────────────
  const MAIN_TABS = [
    { label: "Home", path: "/" },
    { label: "Blog", path: "/blog" },
    { label: "Contact", path: "/contact" },
  ];

  const getActiveIndex = () => {
    if (location.pathname === "/") return 0;
    if (location.pathname.startsWith("/blog")) return 1;
    if (location.pathname === "/contact") return 2;
    return 0;
  };

  const handleTabSelect = (index: number) => {
    navigate(MAIN_TABS[index].path);
  };

  // ── PWA Install ───────────────────────────────────────────────────────────
  const handlePWAInstall = async () => {
    await executeNativePWAInstall();
  };

  // ── Tool click handler ────────────────────────────────────────────────────
  const handleToolClick = (toolId: string) => {
    setIsToolsOpen(false);
    handleSelectTool(toolId);
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-[60] w-full border-b border-slate-200/80 dark:border-[#1E293B] bg-white/95 dark:bg-[#131B2E]/95 backdrop-blur-md transition-colors">
      <div className="max-w-[1270px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* ── Logo ───────────────────────────────────────────────────────── */}
        <div
          className="cursor-pointer active:scale-95 transition-transform shrink-0"
          onClick={() => navigate("/")}
        >
          <TooloraLogo size="md" />
        </div>

        {/* ── Desktop Navigation ─────────────────────────────────────────── */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#F8F9FA] dark:bg-[#0B0F19] p-1 rounded-xl border border-slate-200/80 dark:border-[#1E293B]"
          aria-label="Main navigation"
        >
          {/* ── 1. TOOLS DROPDOWN ────────────────────────────────────────── */}
          <div
            className="relative"
            onMouseEnter={() => setIsToolsOpen(true)}
            onMouseLeave={() => setIsToolsOpen(false)}
          >
            <button
              aria-haspopup="true"
              aria-expanded={isToolsOpen}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-slate-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer rounded-lg hover:bg-white dark:hover:bg-[#131B2E]"
            >
              Tools
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isToolsOpen ? "rotate-180 text-orange-500" : ""
                }`}
              />
            </button>

            {/* Dropdown panel */}
            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl shadow-2xl shadow-slate-900/10 dark:shadow-black/40 z-[70] overflow-hidden text-left"
                >
                  <div className="px-4 pt-3 pb-2 border-b border-slate-100 dark:border-[#1E293B]">
                    <p className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest font-mono">
                      Featured Tools
                    </p>
                  </div>

                  <div className="p-2 space-y-0.5">
                    {FEATURED_TOOLS.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleToolClick(tool.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-[#0B0F19] transition-all group cursor-pointer"
                      >
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tool.iconBg} transition-transform group-hover:scale-110 duration-200`}
                        >
                          <tool.icon size={15} className={tool.iconColor} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                              {tool.label}
                            </span>
                            {tool.badge && (
                              <span
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${tool.badgeColor}`}
                              >
                                {tool.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-0.5 truncate">
                            {tool.description}
                          </p>
                        </div>

                        <ArrowRight
                          size={14}
                          className="text-slate-300 dark:text-zinc-600 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="p-2 pt-0">
                    <button
                      onClick={() => {
                        setIsToolsOpen(false);
                        navigate("/");
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-black transition-all active:scale-[0.98] cursor-pointer shadow-xs"
                    >
                      <LayoutGrid size={13} />
                      View All Tools
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── 2. MAIN TABS (Home, Blog, Contact) ───────────────────────── */}
          <SlidingTabs
            tabs={MAIN_TABS}
            activeIndex={getActiveIndex()}
            onSelect={handleTabSelect}
          />

          {/* ── 3. MORE DROPDOWN ─────────────────────────────────────────── */}
          <div
            className="relative ml-1"
            onMouseEnter={() => setIsMoreOpen(true)}
            onMouseLeave={() => setIsMoreOpen(false)}
          >
            <button
              aria-haspopup="true"
              aria-expanded={isMoreOpen}
              className="flex items-center gap-1 px-4 py-2 text-sm font-bold text-slate-600 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-400 transition-colors cursor-pointer rounded-lg hover:bg-white dark:hover:bg-[#131B2E]"
            >
              More{" "}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isMoreOpen ? "rotate-180 text-orange-500" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  variants={dropdownVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-xl shadow-2xl z-[70] p-1 text-left"
                >
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      navigate("/about");
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-orange-600 hover:text-white dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-slate-700 dark:text-zinc-300"
                  >
                    About Us
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      navigate("/privacy");
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-orange-600 hover:text-white dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-slate-700 dark:text-zinc-300"
                  >
                    Privacy Policy
                  </button>
                  <button
                    onClick={() => {
                      setIsMoreOpen(false);
                      navigate("/terms");
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-orange-600 hover:text-white dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors text-slate-700 dark:text-zinc-300"
                  >
                    Terms &amp; Conditions
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── 4. SEARCH BOX ICON ── */}
          <div className="hidden sm:block">
            <SearchBox />
          </div>
        </nav>

        {/* ── Right Actions ───────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 shrink-0">
          {!isAppInstalled && (
            <button
              onClick={handlePWAInstall}
              disabled={installing}
              className="hidden sm:flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider active:scale-95 transition-all cursor-pointer shadow-xs disabled:opacity-60"
            >
              <Download size={14} /> Install App
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${
              theme === "light" ? "dark" : "light"
            } mode`}
            className="p-2.5 rounded-xl border border-slate-200/80 dark:border-[#1E293B] cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={onOpenMobileMenu}
            aria-label="Open mobile menu"
            className="md:hidden p-2.5 border border-slate-200/80 dark:border-[#1E293B] rounded-xl cursor-pointer text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
