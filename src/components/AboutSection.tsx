// src/components/AboutSection.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToolora } from '../context/TooloraContext';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Lock, 
  Heart, 
  Sparkles, 
  Users, 
  CheckCircle2, 
  FileText,
  Mail,
  ArrowRight,
  HardDrive,
  Globe,
  Layers,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AboutSection() {
  const { setActiveToolId, setShowBlog, setShowAbout, setShowContact } = useToolora();
  const navigate = useNavigate();

  const handleConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.65 }
    });
  };

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
    setShowAbout(false);
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div id="about-us-container" className="max-w-[1270px] w-full mx-auto px-4 py-8 space-y-10 animate-in fade-in duration-300 text-left">
      
      {/* Editorial Header Hero Banner */}
      <div className="relative rounded-3xl border border-slate-200/80 dark:border-[#1E293B] bg-white dark:bg-[#131B2E] p-8 sm:p-12 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-[200px] h-[200px] bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-5 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[10px] font-black tracking-wider uppercase border border-orange-200/60 dark:border-orange-900/30 font-mono">
            <Sparkles className="w-3 h-3" /> OUR MISSION &amp; CORE ETHOS
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display leading-tight">
            High performance utility. <br />
            <span className="text-orange-600 dark:text-orange-400">Zero remote data tracks.</span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
            Toolora was built upon a radical conviction: modern digital utilities must be blistering fast, enterprise-grade, and demand zero surrender of your personal privacy. We develop decentralized, client-side tools so your confidential files, business records, and creative assets never touch remote servers.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link 
              to="/"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2"
            >
              <span>Explore 28+ Free Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              to="/contact"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer active:scale-95"
            >
              Contact Engineering
            </Link>
          </div>
        </div>
      </div>

      {/* The Core Pillars (3-Column Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Pillar 1: No Servers */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] p-6 rounded-2xl space-y-4 shadow-xs hover:border-orange-300 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-100/50 dark:border-rose-900/10">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            On-Device RAM Sandbox
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Zero external APIs, remote host directories, or logging databases. Your files are processed strictly inside virtual WebAssembly context blocks and dynamic browser canvas buffers.
          </p>
        </div>

        {/* Pillar 2: Micro Speed */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] p-6 rounded-2xl space-y-4 shadow-xs hover:border-orange-300 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/10">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Raw Hardware Computing
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Harnessing your device's CPU and GPU cores. Image compression, PDF merging, 3D apparel mockups, and OCR text extraction render instantaneously with zero queue delays.
          </p>
        </div>

        {/* Pillar 3: Offline Freedom */}
        <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] p-6 rounded-2xl space-y-4 shadow-xs hover:border-orange-300 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-100/50 dark:border-orange-900/10">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
            100% Free Forever
          </h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            No credit cards, no monthly subscriptions, and no watermark traps. Built to empower developers, entrepreneurs, students, and businesses with unconstrained digital freedom.
          </p>
        </div>

      </div>

      {/* Featured Key Tools Matrix with Internal Links */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest font-mono">
            FLAGSHIP SUITE
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Explore Flagship Utilities
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Click any flagship tool below to start creating immediately without signing up.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <button
            onClick={() => handleOpenTool('mockup-gen')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-orange-400 hover:bg-orange-50/30 text-left transition-all group cursor-pointer"
          >
            <Layers className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-orange-600 transition-colors">
              3D Mockup Generator
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
              Photorealistic apparel, mugs, cans, packaging &amp; billboards with live decal mapping.
            </p>
          </button>

          <button
            onClick={() => handleOpenTool('pdf-editor')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-orange-400 hover:bg-orange-50/30 text-left transition-all group cursor-pointer"
          >
            <FileText className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-orange-600 transition-colors">
              PDF Studio &amp; Annotator
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
              Full multi-page editing, digital signatures, redactions &amp; vector stamp overlays.
            </p>
          </button>

          <button
            onClick={() => handleOpenTool('resume-cv-builder')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-orange-400 hover:bg-orange-50/30 text-left transition-all group cursor-pointer"
          >
            <Award className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-orange-600 transition-colors">
              ATS Resume Builder
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
              Recruiter-tested templates designed to parse seamlessly through HR systems.
            </p>
          </button>

          <button
            onClick={() => handleOpenTool('invoice-generator')}
            className="p-4 rounded-xl border border-slate-200/80 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50 hover:border-orange-400 hover:bg-orange-50/30 text-left transition-all group cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-orange-500 mb-2" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-zinc-100 group-hover:text-orange-600 transition-colors">
              Invoice Generator
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2">
              Itemized billing, tax calculation, and instant professional PDF exports.
            </p>
          </button>
        </div>
      </div>

      {/* Why We Are Radically Different */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
        <div className="border-b border-slate-100 dark:border-zinc-800/80 pb-5">
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            Why We Are Radically Different from Traditional SaaS
          </h2>
          <p className="text-xs text-slate-400 dark:text-zinc-500 font-mono mt-1">
            ✦ PROVABLE CLIENT-SIDE PRIVACY ARCHITECTURE
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-zinc-300 font-normal">
          <div className="space-y-4">
            <p>
              Traditional online document websites act as covert data-aggregation machines. When you compress a PDF contract or scale a sensitive corporate layout, your file is uploaded to remote cloud instances, indexed, logged for telemetry parameters, and sometimes retained for periods of days.
            </p>
            <p>
              We believe this architecture is obsolete and dangerous. With modern browser rendering technologies (like HTML5 Canvas, WebAssembly modules, and local client stream writers), your local laptop or phone possesses more than enough processing capability to run heavy workloads locally.
            </p>
          </div>
          <div className="space-y-4">
            <p>
              Toolora executes 100% of its pipeline inside your local system RAM. Your business records remain protected under secure sandboxing boundaries. No cookies, no trackers, no external databases, and no login structures exist to intercept your workspace session.
            </p>
            <p className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold bg-orange-50/50 dark:bg-orange-950/20 p-3.5 rounded-xl border border-orange-200/60 dark:border-orange-900/30 text-xs">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>We do not process, intercept, or sell a single byte of your uploaded data. Ever.</span>
            </p>
          </div>
        </div>

        {/* Dynamic Fun / Community Widget */}
        <div className="bg-slate-50 dark:bg-zinc-900/60 rounded-2xl p-5 border border-slate-200/80 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left space-y-0.5">
            <span className="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono">CLIENT ENVIRONMENT VERIFIED</span>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100">Help protect privacy across the internet</h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Click the security badge to trigger celebratory confirmation of offline data preservation!
            </p>
          </div>
          <button
            onClick={handleConfetti}
            className="px-4 py-2 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 hover:border-orange-400 text-slate-800 dark:text-zinc-200 text-xs font-black rounded-lg cursor-pointer transition-all active:scale-95 shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Verify Sandbox</span>
          </button>
        </div>

      </div>

    </div>
  );
}
