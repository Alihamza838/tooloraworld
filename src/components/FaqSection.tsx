import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  FileText, 
  Zap, 
  Search, 
  ArrowRight,
  Lock,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { useToolora } from '../context/TooloraContext';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Privacy & Security' | 'PDF & Documents' | 'Images & OCR' | 'Business & Legal' | 'General';
  keywords: string[];
  recommendedToolId?: string;
  recommendedToolName?: string;
}

export const TOP_FAQS: FaqItem[] = [
  {
    id: 'free-no-limits',
    question: 'Are all Toolora PDF, Image, and Document tools 100% free with no file size limits or paywalls?',
    answer: 'Yes, 100% of Toolora’s utilities are completely free with zero subscription fees, paywalls, daily quotas, or arbitrary file size limits. Every tool runs locally in your device’s browser memory (WebAssembly & HTML5 Canvas), which eliminates cloud hosting and compute overhead, allowing us to keep all features free forever without watermarks.',
    category: 'General',
    keywords: ['free online pdf tools', 'unlimited pdf compressor', 'free image converter', 'no watermark', '100% free converter'],
    recommendedToolId: 'pdf-compressor',
    recommendedToolName: 'PDF Compressor'
  },
  {
    id: 'privacy-client-side',
    question: 'How does client-side WebAssembly file processing protect my privacy and confidential records?',
    answer: 'Unlike conventional online file converters that upload your confidential PDFs, contracts, tax files, and private photos to remote cloud servers, Toolora processes all files directly in your browser’s local CPU and RAM buffers. Zero bytes of your documents or images ever leave your device. The instant you close or refresh the browser tab, all residual memory buffers are instantly purged.',
    category: 'Privacy & Security',
    keywords: ['privacy-first pdf editor', 'client-side document processing', 'zero upload file converter', 'gdpr hipaa compliant pdf', 'secure local converter'],
    recommendedToolId: 'pdf-editor',
    recommendedToolName: 'PDF Editor'
  },
  {
    id: 'compress-without-quality-loss',
    question: 'How can I compress PDF and image files without losing visual clarity or sharp text?',
    answer: 'Toolora’s PDF Compressor and Image Compressor use intelligent vector-aware font deduplication, image stream quantization, and modern WebP / DCT decode algorithms. The compressor strips bloated metadata, unreferenced objects, and unneeded color profiles while preserving high-DPI retina sharpness and print-ready typography.',
    category: 'PDF & Documents',
    keywords: ['compress pdf without losing quality', 'reduce image file size', 'webp jpg png compressor', 'high quality pdf reduction', 'lossless image compression'],
    recommendedToolId: 'pdf-compressor',
    recommendedToolName: 'PDF Compressor'
  },
  {
    id: 'ocr-image-to-text',
    question: 'Can I convert scanned documents, screenshots, and photos to editable text using OCR?',
    answer: 'Yes! Toolora includes a built-in client-side Optical Character Recognition (OCR) engine powered by Tesseract WebAssembly. You can drag and drop scanned PDF pages, receipts, invoices, or screenshots in PNG, JPG, or WebP format to instantly extract editable plain text or structured Markdown with high character accuracy across multiple languages.',
    category: 'Images & OCR',
    keywords: ['free online ocr', 'image to text converter', 'scanned pdf to text', 'extract text from photo', 'tesseract ocr browser'],
    recommendedToolId: 'ocr-tool',
    recommendedToolName: 'Image to Text (OCR)'
  },
  {
    id: 'electronic-signature-legal',
    question: 'Is an electronic signature drawn on Toolora legally binding under ESIGN and eIDAS?',
    answer: 'Yes. E-signatures generated on Toolora conform to the United States Electronic Signatures in Global and National Commerce Act (ESIGN, 15 U.S.C. § 7001), the Uniform Electronic Transactions Act (UETA), and European Union eIDAS regulations. Our canvas uses smooth Bézier interpolation for natural handwritten strokes and exports transparent 300 DPI PNG signatures ready for contracts.',
    category: 'Business & Legal',
    keywords: ['legally binding e-signature', 'esign ueta compliance', 'draw signature online', 'electronic signature generator', 'transparent signature maker'],
    recommendedToolId: 'signature-maker',
    recommendedToolName: 'Signature Maker'
  },
  {
    id: 'ats-friendly-resume-cv',
    question: 'How does the ATS-Friendly Resume & CV Builder ensure job applications pass recruiter filters?',
    answer: 'Applicant Tracking Systems (ATS) reject resumes designed with complex multi-layer graphics, text frames, or non-standard fonts. Toolora’s Resume Builder produces clean, semantically structured DOM hierarchies with standard heading tiers, standard bullet points, and ATS-optimized PDF / TXT exports so your qualifications are parsed accurately by corporate recruiting platforms.',
    category: 'Business & Legal',
    keywords: ['ats friendly resume builder', 'free cv maker online', 'standard resume format', 'job application cv maker', 'parseable resume builder'],
    recommendedToolId: 'resume-cv-builder',
    recommendedToolName: 'Resume & CV Builder'
  },
  {
    id: 'offline-invoices-certificates-mockups',
    question: 'Can I generate professional invoices, certificates, and 3D product mockups offline without internet?',
    answer: 'Yes. Toolora is built as an offline-first Progressive Web App (PWA). All calculation matrices, SVG rendering pipelines, QR generation algorithms, and 3D mockup texture overlays operate entirely in client JavaScript. Once the website is loaded, you can draft invoices, issue verified certificates, and produce merchandise mockups completely offline.',
    category: 'Business & Legal',
    keywords: ['free invoice generator pdf', 'certificate maker with qr', '3d product mockup builder', 'offline business utilities', 'commercial billing generator'],
    recommendedToolId: 'invoice-generator',
    recommendedToolName: 'Invoice Generator'
  },
  {
    id: 'supported-formats-conversion',
    question: 'What file formats are supported across Toolora’s conversion, editing, and watermarking tools?',
    answer: 'Toolora supports extensive file formats including PDF (v1.3 to v2.0), JPG/JPEG, PNG (with full alpha transparency), WebP, SVG vectors, GIF, BMP, plain text (TXT), JSON data, and Markdown (MD). You can convert PDF to images, images to PDF, rotate individual pages, apply watermarks, and extract embedded text with instant one-click downloads.',
    category: 'PDF & Documents',
    keywords: ['convert pdf to png', 'jpg to pdf converter', 'webp to png converter', 'pdf watermark tool', 'multi format file converter'],
    recommendedToolId: 'image-converter',
    recommendedToolName: 'Image Converter'
  },
  {
    id: 'no-registration-no-software',
    question: 'Do I need to create an account, register an email, or install software to use Toolora?',
    answer: 'No registration, email, phone number, credit card, or software installation is ever needed. You can use any tool immediately from any modern web browser on iPhone, iPad, Android smartphones, Mac, Windows, Linux, and Chromebooks. You can also click “Install App” to add Toolora to your home screen or desktop taskbar as a lightweight PWA.',
    category: 'General',
    keywords: ['no registration pdf tools', 'instant online converter', 'pwa web utilities', 'browser tools for mobile and mac', 'free no account needed'],
    recommendedToolId: 'pdf-merger',
    recommendedToolName: 'PDF Merger'
  },
  {
    id: 'speed-comparison-cloud-vs-wasm',
    question: 'Why is Toolora’s in-browser processing significantly faster than traditional online converters?',
    answer: 'Traditional cloud converters require three sluggish steps: uploading multi-megabyte files over internet connections, waiting in remote server processing queues, and downloading the finished file back. Toolora executes everything locally on your device’s GPU and multi-core CPU using WebAssembly, resulting in near-instant processing with 0-millisecond network latency.',
    category: 'Privacy & Security',
    keywords: ['fastest online pdf converter', 'instant image resizer', 'zero queue file processing', 'webassembly file tools', 'local browser processing speed'],
    recommendedToolId: 'image-resizer',
    recommendedToolName: 'Image Resizer'
  }
];

export default function FaqSection() {
  const { setActiveToolId, setShowBlog, setShowAbout, setShowContact, setShowPrivacy, setShowTerms } = useToolora();
  const [openIds, setOpenIds] = useState<string[]>(['free-no-limits', 'privacy-client-side']);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleFaq = (id: string) => {
    if (openIds.includes(id)) {
      setOpenIds(openIds.filter(i => i !== id));
    } else {
      setOpenIds([...openIds, id]);
    }
  };

  const handleToolClick = (toolId: string) => {
    setActiveToolId(toolId);
    setShowBlog(false);
    setShowAbout(false);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = ['All', 'Privacy & Security', 'PDF & Documents', 'Images & OCR', 'Business & Legal', 'General'];

  const filteredFaqs = TOP_FAQS.filter(faq => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Schema.org FAQPage structured data for Google Search rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': TOP_FAQS.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };

  return (
    <section id="faq-section" className="w-full max-w-[1270px] mx-auto px-3 sm:px-4 py-12 sm:py-16 text-left">
      {/* Inject FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header Panel */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-900/40 text-orange-700 dark:text-orange-400 text-xs font-black uppercase tracking-wider font-mono">
          <HelpCircle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
          <span>Frequently Asked Questions & Search Guide</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-zinc-50 font-display tracking-tight leading-tight">
          Everything you need to know about <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">Toolora</span>
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 leading-relaxed font-sans font-normal">
          Explore answers on zero-upload data privacy, WebAssembly performance, legal e-signatures, ATS resume compliance, and 100% free browser tools.
        </p>

        {/* Search bar inside FAQ */}
        <div className="pt-2 max-w-lg mx-auto relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords (e.g., OCR, compress without loss, legal signature)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs sm:text-sm text-slate-800 dark:text-zinc-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/40 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3.5 max-w-4xl mx-auto">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white dark:bg-zinc-900/90 border-orange-300 dark:border-orange-500/40 shadow-md shadow-orange-500/5'
                    : 'bg-white/80 dark:bg-zinc-900/40 border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-start justify-between gap-4 p-4 sm:p-5 text-left cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <span className="shrink-0 w-7 h-7 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 font-mono text-xs font-black flex items-center justify-center mt-0.5 border border-orange-100 dark:border-orange-900/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-orange-600/80 dark:text-orange-400/80 uppercase font-mono tracking-wider block">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 font-display leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 bg-orange-100/80 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400' : ''}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Content */}
                {isOpen && (
                  <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 border-t border-slate-100 dark:border-zinc-800/60 mt-1">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-sans pt-3">
                      {faq.answer}
                    </p>

                    {/* Keywords & Direct Action */}
                    <div className="mt-4 pt-3 border-t border-dashed border-slate-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-zinc-500 font-mono">
                          Keywords:
                        </span>
                        {faq.keywords.slice(0, 3).map((kw) => (
                          <span
                            key={kw}
                            className="text-[10px] font-semibold bg-slate-50 dark:bg-zinc-800/80 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded-md border border-slate-200/50 dark:border-zinc-700/50"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>

                      {faq.recommendedToolId && (
                        <button
                          onClick={() => handleToolClick(faq.recommendedToolId!)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors cursor-pointer group"
                        >
                          <span>Launch {faq.recommendedToolName}</span>
                          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl space-y-2">
            <p className="text-sm font-semibold text-slate-600 dark:text-zinc-400">
              No matching answers found for "{searchQuery}".
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
              className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="mt-10 max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-orange-50/80 dark:from-zinc-900 dark:via-orange-950/10 dark:to-zinc-900 border border-orange-200/60 dark:border-orange-900/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 font-display">
              100% Privacy & Sovereign In-Browser Guarantee
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 leading-normal">
              No server logging, no telemetry document tracking, and zero cloud storage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 className="w-3 h-3" /> GDPR & HIPAA Ready
          </span>
        </div>
      </div>
    </section>
  );
}
