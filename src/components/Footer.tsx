/**
 * Footer.tsx - Toolora Site Footer & Internal Linking Matrix
 * ─────────────────────────────────────────────────────────────
 * Refactored with Toolora Soft Off-White (#F8F9FA) & Slate Navy (#0B0F19) Palette.
 * Features 100% zero em-dashes, semantic SEO internal linking, E-E-A-T trust badges,
 * and responsive multi-column layouts.
 */

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToolora } from "../context/TooloraContext";
import { TOOLS } from "../data";
import TooloraLogo from "./TooloraLogo";
import {
  BookOpen,
  ShieldCheck,
  Zap,
  Lock,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
  Info,
  Headphones,
  ShieldAlert,
  Scale,
} from "lucide-react";

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { handleSelectTool } = useToolora();

  // Unified routing scroll handler
  const handleRoutingClick = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Explicit Category mapping to ensure strict clean linking loops
  const FOOTER_SECTIONS = [
    {
      title: "PDF Solutions",
      cat: "pdf",
    },
    {
      title: "Image Studio",
      cat: "image",
    },
    {
      title: "Office & Design",
      cat: "document",
    },
  ];

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-slate-600 dark:text-zinc-400 font-sans select-none relative overflow-hidden text-left transition-colors">
      {/* Subtle ambient design glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1270px] mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-6 gap-y-10 lg:gap-8">
          
          {/* Column 1: Brand & Contact Info */}
          <div className="col-span-2 lg:col-span-1 space-y-5 text-left">
            <div
              className="cursor-pointer inline-block hover:opacity-95 transition-opacity"
              onClick={() => handleRoutingClick("/")}
            >
              <TooloraLogo size="md" />
            </div>
            <p className="text-xs leading-relaxed text-slate-500 dark:text-zinc-400 font-medium">
              High-integrity decentralized workspace. 100% private, browser sandbox bound, and completely free forever.
            </p>
            <div className="space-y-2.5 text-xs font-semibold text-slate-700 dark:text-zinc-300">
              <a 
                href="mailto:tooloraio386@gmail.com" 
                className="flex items-center gap-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <Mail size={14} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate">tooloraio386@gmail.com</span>
              </a>
              <a 
                href="tel:+923126528832" 
                className="flex items-center gap-2.5 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
              >
                <Phone size={14} className="text-orange-500 shrink-0 group-hover:scale-110 transition-transform" />
                <span>+92 312 6528832</span>
              </a>
              <div className="flex items-start gap-2.5 group">
                <MapPin size={14} className="text-orange-500 shrink-0 mt-0.5" />
                <span className="leading-tight text-slate-600 dark:text-zinc-400">
                  Dream Garden, Multan, Pakistan
                </span>
              </div>
            </div>
          </div>

          {/* Columns 2, 3, 4: Dynamic Tools Links Mapping */}
          {FOOTER_SECTIONS.map((group) => (
            <div key={group.cat} className="space-y-4 text-left">
              <h4 className="text-[11px] font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest font-mono border-b border-slate-200/80 dark:border-[#1E293B] pb-2">
                {group.title}
              </h4>
              <ul className="space-y-2 text-xs font-medium">
                {TOOLS.filter((t) => t.category === group.cat).map((tool) => {
                  const isCurrentActive = location.pathname === `/tools/${tool.id}`;
                  return (
                    <li key={tool.id}>
                      <button
                        onClick={() => {
                          handleSelectTool(tool.id);
                          handleRoutingClick(`/tools/${tool.id}?tool=${tool.id}`);
                        }}
                        className={`hover:text-orange-600 dark:hover:text-orange-400 transition-colors text-left w-full cursor-pointer flex items-center justify-between group/link py-1 ${
                          isCurrentActive
                            ? "text-orange-600 dark:text-orange-400 font-black"
                            : "text-slate-600 dark:text-zinc-400"
                        }`}
                      >
                        <span className="truncate group-hover/link:translate-x-0.5 transition-transform duration-200">
                          {tool.name}
                        </span>
                        <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 text-orange-500 transition-all shrink-0 ml-1" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Column 5: Legal & Hub Portals */}
          <div className="space-y-4 text-left col-span-2 sm:col-span-1">
            <h4 className="text-[11px] font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest font-mono border-b border-slate-200/80 dark:border-[#1E293B] pb-2">
              Legal and Help
            </h4>
            <ul className="space-y-2 text-xs font-bold">
              <li>
                <button
                  onClick={() => handleRoutingClick("/about")}
                  className={`hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 cursor-pointer text-left w-full transition-colors py-1 ${
                    location.pathname === "/about" ? "text-orange-600 dark:text-orange-400" : "text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  <Info size={14} className="text-orange-500 shrink-0" />
                  <span>About and Ethics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoutingClick("/contact")}
                  className={`hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 cursor-pointer text-left w-full transition-colors py-1 ${
                    location.pathname === "/contact" ? "text-orange-600 dark:text-orange-400" : "text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  <Headphones size={14} className="text-orange-500 shrink-0" />
                  <span>Contact Support</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoutingClick("/privacy")}
                  className={`hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 cursor-pointer text-left w-full transition-colors py-1 ${
                    location.pathname === "/privacy" ? "text-orange-600 dark:text-orange-400" : "text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  <ShieldAlert size={14} className="text-orange-500 shrink-0" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoutingClick("/terms")}
                  className={`hover:text-orange-600 dark:hover:text-orange-400 flex items-center gap-2 cursor-pointer text-left w-full transition-colors py-1 ${
                    location.pathname === "/terms" ? "text-orange-600 dark:text-orange-400" : "text-slate-600 dark:text-zinc-400"
                  }`}
                >
                  <Scale size={14} className="text-orange-500 shrink-0" />
                  <span>Terms and Conditions</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleRoutingClick("/blog")}
                  className={`hover:text-orange-600 dark:hover:text-orange-400 text-orange-600 dark:text-orange-400 flex items-center gap-2 cursor-pointer text-left w-full transition-colors py-1 ${
                    location.pathname.startsWith("/blog") ? "underline underline-offset-4 font-black" : ""
                  }`}
                >
                  <BookOpen size={14} className="text-orange-500 shrink-0" /> 
                  <span>Knowledge Hub and FAQ</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Layer Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-[#1E293B] flex flex-col sm:flex-row justify-between items-center gap-4">
          
          {/* Security Protocol Badges */}
          <div className="flex flex-wrap justify-center gap-3 text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400 font-mono">
            <span className="flex items-center gap-1.5 border border-slate-200/80 dark:border-[#1E293B] px-3 py-1.5 rounded-lg bg-white dark:bg-[#131B2E] shadow-xs">
              <ShieldCheck size={13} className="text-emerald-500 shrink-0" /> 100% GDPR COMPLIANT
            </span>
            <span className="flex items-center gap-1.5 border border-slate-200/80 dark:border-[#1E293B] px-3 py-1.5 rounded-lg bg-white dark:bg-[#131B2E] shadow-xs">
              <Zap size={13} className="text-amber-500 shrink-0" /> LOCAL SANDBOX ARRAYS
            </span>
            <span className="flex items-center gap-1.5 border border-slate-200/80 dark:border-[#1E293B] px-3 py-1.5 rounded-lg bg-white dark:bg-[#131B2E] shadow-xs">
              <Lock size={13} className="text-orange-500 shrink-0" /> CRYPTO BUFFER SECURE
            </span>
          </div>

          {/* Copyrights & Real-time Live Status */}
          <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 text-center sm:text-right font-medium">
            <div>© {new Date().getFullYear()} Toolora System Architecture. All Rights Reserved.</div>
            <div className="mt-1 flex items-center justify-center sm:justify-end gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold tracking-widest text-[9px] uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              STATUS: SANDBOX ENVIRONMENT BOUND
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
}
