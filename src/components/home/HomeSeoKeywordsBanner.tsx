import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToolora } from '../../context/TooloraContext';
import { 
  FileText, 
  Image as ImageIcon, 
  Briefcase, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  Cpu,
  Globe,
  Download,
  BookOpen
} from 'lucide-react';

export const HomeSeoKeywordsBanner: React.FC = () => {
  const { handleSelectTool, setShowBlog, setActiveArticleId } = useToolora();
  const navigate = useNavigate();

  const handleLaunchTool = (toolId: string) => {
    if (typeof handleSelectTool === 'function') {
      handleSelectTool(toolId);
    }
    navigate(`/tools/${toolId}?tool=${toolId}`);
    setTimeout(() => {
      const el = document.getElementById('layout-view-panel');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleOpenBlog = () => {
    setShowBlog(true);
    setActiveArticleId(null);
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside 
      className="w-full my-12 space-y-10 text-left animate-in fade-in duration-300"
      aria-label="Comprehensive SEO Keyword Directory & On-Device Utilities Suite"
    >
      {/* 1. HIGH-CONVERTING HERO FLEX BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-stone-900 to-zinc-950 border border-slate-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl">
        {/* Subtle ambient lighting */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          {/* Left copy stack */}
          <div className="flex-1 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>100% PRIVATE · ZERO SERVER UPLOADS · NO PAYWALLS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-white tracking-tight leading-snug">
              Instant Document, Image &amp; Business Productivity Suite in Your Browser
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              Say goodbye to paid subscriptions, restrictive upload limits, and third-party cloud data leaks. Toolora delivers <strong>30 fast, on-device tools</strong> to edit PDFs, compress high-resolution images, generate freelance invoices, scan receipts with OCR, create digital signatures, and design 3D mockups — executed 100% locally on your computer or phone.
            </p>

            {/* Micro value props pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] font-sans text-slate-300">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Account or Sign-Up</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero File Size Limits</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Works Offline via PWA</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>No Watermarks</span>
              </span>
            </div>
          </div>

          {/* Right action flex stack */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => handleLaunchTool('pdf-editor')}
              className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40"
            >
              <FileText className="w-4 h-4" />
              <span>Launch Free PDF Editor</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleLaunchTool('image-compressor')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/15 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-orange-400" />
              <span>Compress Images (Bulk)</span>
            </button>

            <button
              onClick={handleOpenBlog}
              className="px-6 py-3 rounded-xl bg-transparent hover:bg-white/5 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 font-mono"
            >
              <BookOpen className="w-3.5 h-3.5 text-orange-400" />
              <span>Browse 58+ Technical Guides &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. COMPREHENSIVE KEYWORD PILLARS & DIRECT CRAWLER INDEX */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <span>Comprehensive On-Device Tools Index &amp; Keyword Directory</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Instant access to all 30 privacy-first web utilities. Fully optimized for zero-latency execution and high-fidelity results.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            30 Verified Web Tools · 58 Masterclasses
          </span>
        </div>

        {/* 4 Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          
          {/* Pillar 1: PDF & Document Engineering */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase font-mono">
                <FileText className="w-4 h-4" />
                <span>PDF &amp; Document Tools</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Full-spectrum PDF manipulation running on client-side WebAssembly with zero server transmission.
              </p>

              <div className="space-y-1.5 pt-1">
                {[
                  { id: 'pdf-editor', label: 'PDF Editor Online', desc: 'Add text, sign & redact' },
                  { id: 'pdf-merger', label: 'Merge PDF Files', desc: 'Combine multiple PDFs' },
                  { id: 'pdf-splitter', label: 'Split PDF Pages', desc: 'Extract custom page ranges' },
                  { id: 'pdf-compressor', label: 'Compress PDF', desc: 'Reduce MB size without loss' },
                  { id: 'pdf-lock-unlock', label: 'Lock & Unlock PDF', desc: 'AES-256 password security' },
                  { id: 'pdf-rotate', label: 'Rotate PDF', desc: 'Permanent orientation fix' },
                  { id: 'pdf-watermark', label: 'PDF Watermark', desc: 'Confidential stamps' },
                  { id: 'pdf-to-image', label: 'PDF to JPG/PNG', desc: 'High-DPI raster export' },
                  { id: 'image-to-pdf', label: 'Image to PDF', desc: 'Convert JPG, PNG, WebP' },
                  { id: 'pdf-to-text', label: 'Extract PDF Text', desc: 'Plain text data mining' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLaunchTool(item.id)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer group"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal group-hover:text-rose-500 shrink-0">
                      {item.desc} &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 2: Image Processing & Visual Media */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs uppercase font-mono">
                <ImageIcon className="w-4 h-4" />
                <span>Image &amp; Vision Tools</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Hardware-accelerated image filters, batch conversion, neural OCR, and background removal.
              </p>

              <div className="space-y-1.5 pt-1">
                {[
                  { id: 'image-compressor', label: 'Bulk Image Compressor', desc: 'WebP, JPG, PNG reduction' },
                  { id: 'image-resizer', label: 'Image Resizer', desc: 'Exact pixel & aspect ratio' },
                  { id: 'image-converter', label: 'Image Converter', desc: 'Convert WebP, PNG, JPG, GIF' },
                  { id: 'bg-remover', label: 'AI Background Remover', desc: 'Instant transparent PNG' },
                  { id: 'passport-photo-maker', label: 'Passport Photo Maker', desc: 'Official biometric specs' },
                  { id: 'ocr-tool', label: 'OCR Receipt Scanner', desc: 'Extract text from photo' },
                  { id: 'image-editor', label: 'Online Photo Editor', desc: 'Crop, adjust, tint & flip' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLaunchTool(item.id)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-sky-50 dark:hover:bg-sky-950/20 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer group"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal group-hover:text-sky-500 shrink-0">
                      {item.desc} &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 3: Business, Finance & Legal Generators */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase font-mono">
                <Briefcase className="w-4 h-4" />
                <span>Business &amp; Legal Suite</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Print-ready invoice builders, ATS resume makers, vector branding QR codes, and certificate generators.
              </p>

              <div className="space-y-1.5 pt-1">
                {[
                  { id: 'invoice-generator', label: 'Invoice Generator', desc: 'PDF invoice with tax & discounts' },
                  { id: 'bill-form-gen', label: 'Bill & Receipt Maker', desc: 'Itemized receipts & work orders' },
                  { id: 'resume-cv-builder', label: 'ATS Resume Builder', desc: 'Professional curriculum vitae' },
                  { id: 'signature-maker', label: 'Digital Signature Maker', desc: 'Vector e-signatures with zero upload' },
                  { id: 'business-card-gen', label: 'Business Card Designer', desc: 'Printable 300 DPI layout' },
                  { id: 'certificate-maker', label: 'Award Certificate Maker', desc: 'High-res achievement diplomas' },
                  { id: 'mockup-gen', label: '3D Product Mockups', desc: 'Brand mugs, cans, apparel' },
                  { id: 'qr-generator', label: 'Custom QR Code Maker', desc: 'Vector SVG/PNG with logo' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLaunchTool(item.id)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer group"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal group-hover:text-emerald-500 shrink-0">
                      {item.desc} &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pillar 4: Converters, Metrology & Text Tools */}
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200/80 dark:border-zinc-800/80 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase font-mono">
                <Layers className="w-4 h-4" />
                <span>Smart Converters &amp; Text</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                Precision engineering unit conversions, live foreign exchange calculators, and typography formatters.
              </p>

              <div className="space-y-1.5 pt-1">
                {[
                  { id: 'unit-converter', label: 'Universal Unit Converter', desc: 'Length, weight, pressure, temp' },
                  { id: 'currency-converter', label: 'Currency Exchange Calc', desc: 'Real-time global FX rates' },
                  { id: 'text-tools', label: 'Case & Text Formatter', desc: 'camelCase, snake_case, word count' },
                  { id: 'pdf-toolbox', label: 'PDF Toolbox Master', desc: 'All-in-one PDF utilities' },
                  { id: 'image-optimizer', label: 'Image Optimizer Pro', desc: 'Retina web compression' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLaunchTool(item.id)}
                    className="w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs font-semibold text-slate-700 dark:text-zinc-300 hover:bg-purple-50 dark:hover:bg-purple-950/20 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer group"
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-normal group-hover:text-purple-500 shrink-0">
                      {item.desc} &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. SEARCH ENGINE & CRAWLER SEMANTIC KNOWLEDGE ARTICLE */}
      <article className="p-6 sm:p-8 rounded-2xl bg-slate-50/80 dark:bg-zinc-900/40 border border-slate-200/70 dark:border-zinc-800/70 space-y-4">
        <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-zinc-100">
          Why On-Device Processing Outranks Cloud Converters in Privacy, Speed &amp; Reliability
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed font-sans">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Zero-Knowledge Data Sovereignty</span>
            </h4>
            <p>
              When handling sensitive financial audits, employment contracts, medical records, or proprietary brand mockups, uploading files to remote servers introduces liability under GDPR, HIPAA, and corporate NDAs. Toolora processes documents using local WebAssembly binaries executed within your browser’s isolated sandbox. No remote server ever receives, logs, or stores your confidential data.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span>Instant Core Web Vitals &amp; Sub-Second Speeds</span>
            </h4>
            <p>
              Traditional online converters force users to endure slow upload queues, remote server processing latency, and bulky download handshakes. By shifting computational work to your device’s multi-core CPU and Web Workers, Toolora eliminates network bottlenecks, completing complex operations like PDF compression and batch WebP conversion in under 350 milliseconds.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Fully Offline Progressive Web App (PWA)</span>
            </h4>
            <p>
              Toolora operates as a certified Progressive Web App. Install it directly onto macOS, Windows, Linux, Android, or iOS with one click. Once cached, all 30 utilities operate seamlessly offline without an active internet connection, ensuring reliable document editing and image manipulation whether you are traveling, on a remote flight, or in high-security air-gapped facilities.
            </p>
          </div>
        </div>
      </article>
    </aside>
  );
};

export default HomeSeoKeywordsBanner;
