// src/components/PrivacySection.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  EyeOff, 
  Server, 
  HardDrive, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Mail,
  Zap,
  Globe,
  Cpu
} from 'lucide-react';
import { useToolora } from '../context/TooloraContext';
import { TOOLS } from '../data';

export default function PrivacySection() {
  const { setActiveToolId, setShowBlog, setShowPrivacy, setShowTerms, setShowContact } = useToolora();
  const navigate = useNavigate();

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
    setShowPrivacy(false);
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenArticle = (slug: string) => {
    setShowPrivacy(false);
    setShowBlog(true);
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1270px] w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-bold font-mono">
          <ShieldCheck size={14} /> ZERO CLOUD DATA RETENTION POLICY
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
          Privacy Policy &amp; Data Sovereignty Framework
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          Toolora is architected around a non-negotiable principle: complete data sovereignty. We operate zero file upload backends, zero user identification databases, and zero tracking pixels. Your confidential documents, biometric photographs, financial records, and creative mockups are processed exclusively in your device’s isolated browser sandbox.
        </p>
      </div>

      {/* Core Architectural Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 sm:p-6 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <HardDrive size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% In-Browser Execution</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            All PDF manipulation, image resizing, OCR scanning, and 3D mockup rendering occur locally in WebAssembly and Canvas RAM.
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Server size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Zero Server File Uploads</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Your sensitive tax files, resumes, and business contracts never travel across the internet. When you close the browser tab, memory is instantly purged.
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <EyeOff size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No Telemetry or Profiling</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            We do not sell user behavioral data, capture browser fingerprints, or deploy intrusive analytics beacons.
          </p>
        </div>

        <div className="p-5 sm:p-6 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <Lock size={20} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">GDPR, HIPAA &amp; CCPA Harmony</h3>
          <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
            Because personal records never leave your local hardware environment, regulatory boundaries remain uncompromised.
          </p>
        </div>
      </div>

      {/* Detailed Legal & Architectural Sections */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-3xl p-6 sm:p-10 space-y-8">
        
        <div className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            1. Information Architecture &amp; Data Ingestion
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            When you use our suite of tools—including the <button onClick={() => handleOpenTool('pdf-editor')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">PDF Editor</button>, <button onClick={() => handleOpenTool('mockup-gen')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Mockup Generator</button>, <button onClick={() => handleOpenTool('invoice-generator')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Invoice Generator</button>, or <button onClick={() => handleOpenTool('image-compressor')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Image Compressor</button>—all file buffers, array buffers, and pixel matrices exist exclusively in your computer’s random access memory (RAM). No copy is ever transmitted to or stored on our servers.
          </p>
        </div>

        <div className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            2. Local Storage &amp; User Preferences
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            Toolora utilizes standard client-side `localStorage` exclusively to remember your cosmetic preferences (such as Dark Mode / Light Mode) and your list of bookmarked favorite tools. This data stays 100% on your device and is never synchronized to an external identity provider.
          </p>
        </div>

        <div className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            3. Contact Inquiries &amp; Support Communications
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            If you choose to submit a support inquiry via our <Link to="/contact" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Contact Support Desk</Link>, your email address and message details are utilized strictly to address your technical inquiry. We never add support contacts to marketing newsletters or sell details to data brokers.
          </p>
        </div>

        <div className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            4. Third-Party Service Integrations
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            All cryptographic operations, PDF object tree parsing, vector rasterization, and OCR pipelines are implemented using open-source, client-side libraries compiled to WebAssembly. We do not pipe your data into black-box remote AI APIs or cloud storage buckets.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            5. Contact the Privacy Officer
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            For formal privacy audits, GDPR compliance validation, or questions regarding our client-side sandbox architecture, please contact our team directly at:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-150 dark:border-zinc-800 flex items-center gap-3">
            <Mail className="w-5 h-5 text-orange-500 shrink-0" />
            <div className="text-xs">
              <span className="font-bold text-slate-900 dark:text-zinc-100">Data Protection Officer:</span>{' '}
              <a href="mailto:tooloraio386@gmail.com" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                tooloraio386@gmail.com
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Internal Navigation Links Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span>Explore related legal &amp; technical guides:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link to="/terms" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 font-bold transition-colors">
            Terms of Service
          </Link>
          <Link to="/about" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 font-bold transition-colors">
            About &amp; Ethics
          </Link>
          <Link to="/contact" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 font-bold transition-colors">
            Contact Support
          </Link>
          <Link to="/blog" className="px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/70 font-bold hover:bg-orange-100 transition-colors">
            Knowledge Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
