// src/components/TermsSection.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Scale, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ShieldCheck, 
  ArrowRight,
  BookOpen,
  Sparkles,
  Lock,
  Mail,
  Zap
} from 'lucide-react';
import { useToolora } from '../context/TooloraContext';

export default function TermsSection() {
  const { setActiveToolId, setShowBlog, setShowTerms, setShowPrivacy, setShowContact } = useToolora();
  const navigate = useNavigate();

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
    setShowTerms(false);
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-[1270px] w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300 text-left">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-3xl p-6 sm:p-10 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-bold font-mono">
          <Scale size={14} /> FAIR &amp; TRANSPARENT USAGE FRAMEWORK
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
          Terms &amp; Conditions of Service
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
          By utilizing the Toolora online suite of productivity, design, and document applications, you acknowledge and agree to these transparent terms. We believe in providing unconditional, free, and unrestricted tools for creators, professionals, students, and businesses worldwide.
        </p>
      </div>

      {/* Terms Content Card */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] rounded-3xl p-6 sm:p-10 space-y-8">
        
        {/* Section 1 */}
        <section className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> 
            1. Free &amp; Unrestricted Commercial and Personal Use
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            All 28+ tools available across Toolora—including the <button onClick={() => handleOpenTool('mockup-gen')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">3D Mockup Generator</button>, <button onClick={() => handleOpenTool('pdf-editor')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">PDF Editor</button>, <button onClick={() => handleOpenTool('resume-cv-builder')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Resume Builder</button>, <button onClick={() => handleOpenTool('invoice-generator')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Invoice Generator</button>, and <button onClick={() => handleOpenTool('image-compressor')} className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Image Compressor</button>—are provided 100% free of charge. You are explicitly authorized to use all generated outputs for commercial advertising, client projects, ecommerce listings, and corporate workflows with zero royalty obligations.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> 
            2. 100% Intellectual Property Ownership
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            You retain exclusive intellectual property ownership of all assets, brand logos, vector artwork, contracts, and documents edited or created on Toolora. Toolora claims zero rights, licenses, or claims over your creative and business outputs. Because files are compiled locally inside your client RAM, we never possess a copy of your work.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <AlertCircle size={18} className="text-amber-500 shrink-0" /> 
            3. Warranty Disclaimer &amp; Software Integrity
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            The platform is provided on an "as-is" and "as-available" basis without express or implied warranties. While our codebase undergoes continuous automated unit testing and browser sandbox audits, users are advised to maintain independent backups of critical original documents prior to executing destructive operations like irreversible image downscaling or PDF page stripping.
          </p>
        </section>

        {/* Section 4 */}
        <section className="space-y-3 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Scale size={18} className="text-orange-500 shrink-0" /> 
            4. Acceptable Conduct &amp; Prohibited Uses
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            You agree not to utilize our client-side utility suite to forge deceptive legal instruments, compile unlawful materials, or attempt to exploit the client runtime environment. Any violation of international cybersecurity laws is strictly prohibited.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Mail size={18} className="text-orange-500 shrink-0" /> 
            5. Inquiries &amp; Legal Support
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
            If you have questions regarding these terms, licensing clarifications, or custom offline enterprise distributions, reach out to our legal and support team at <a href="mailto:tooloraio386@gmail.com" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">tooloraio386@gmail.com</a> or visit our <Link to="/contact" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">Contact Center</Link>.
          </p>
        </section>

      </div>

      {/* Internal Navigation Bar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
        <div className="text-xs font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-orange-500" />
          <span>Related governance documentation:</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link to="/privacy" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 font-bold transition-colors">
            Privacy Policy
          </Link>
          <Link to="/about" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 font-bold transition-colors">
            About Toolora
          </Link>
          <Link to="/contact" className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-orange-600 font-bold transition-colors">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
