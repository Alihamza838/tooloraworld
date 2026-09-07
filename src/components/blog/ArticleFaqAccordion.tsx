// src/components/blog/ArticleFaqAccordion.tsx
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Check, Copy, MessageSquareText } from 'lucide-react';
import MarkdownText from './MarkdownText';

export interface ArticleFaqItem {
  q: string;
  a: string;
}

interface ArticleFaqAccordionProps {
  faqs: ArticleFaqItem[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export const ArticleFaqAccordion: React.FC<ArticleFaqAccordionProps> = ({
  faqs,
  title = "Frequently Asked Questions & Answers",
  subtitle = "High-intent answers covering security, speed, browser compatibility, and step-by-step techniques.",
  className = ""
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0); // First item open by default for featured snippet clarity
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const handleCopyAnswer = (text: string, idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const cleanText = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
      navigator.clipboard.writeText(cleanText);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2500);
    } catch {}
  };

  return (
    <section className={`w-full space-y-5 text-left ${className}`} aria-labelledby="faq-accordion-heading">
      {/* Header Section with semantic markup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-200/90 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <h3 id="faq-accordion-heading" className="text-base sm:text-lg font-black text-slate-900 dark:text-zinc-100 font-display tracking-tight">
              {title}
            </h3>
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-normal leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        <span className="self-start sm:self-center text-[10px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-full border border-orange-200/50 dark:border-orange-900/30 shrink-0 font-mono">
          {faqs.length} Researched Answers
        </span>
      </div>

      {/* Accordion List */}
      <div className="space-y-2.5">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const faqId = `article-faq-item-${idx}`;
          const contentId = `article-faq-content-${idx}`;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-orange-50/25 dark:bg-orange-950/15 border-orange-200/90 dark:border-orange-900/40 shadow-xs'
                  : 'bg-white dark:bg-zinc-900/60 border-slate-200/80 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Question Trigger Button */}
              <button
                id={faqId}
                aria-expanded={isOpen}
                aria-controls={contentId}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 transition-colors ${
                    isOpen
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 group-hover:text-orange-600 dark:group-hover:text-orange-400'
                  }`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <h4 className="text-[13px] sm:text-sm font-bold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                    {faq.q}
                  </h4>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-orange-600 dark:text-orange-400' : ''
                    }`}
                  />
                </div>
              </button>

              {/* Accordion Content Panel */}
              {isOpen && (
                <div
                  id={contentId}
                  role="region"
                  aria-labelledby={faqId}
                  className="px-4 sm:px-5 pb-5 pt-0 animate-in fade-in-50 duration-200"
                >
                  <div className="border-t border-slate-150 dark:border-zinc-800/80 pt-3.5 space-y-3">
                    <MarkdownText
                      content={faq.a}
                      className="text-[13px] sm:text-[14px] text-slate-600 dark:text-zinc-300 leading-relaxed max-w-4xl"
                    />

                    {/* Footer action to copy or mark helpful */}
                    <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200/60 dark:border-zinc-800/60">
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                        Verified Technical Snippet
                      </span>
                      <button
                        onClick={(e) => handleCopyAnswer(faq.a, idx, e)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 transition-colors cursor-pointer"
                        title="Copy answer text"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-slate-400" />
                            <span>Copy Answer</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ArticleFaqAccordion;
