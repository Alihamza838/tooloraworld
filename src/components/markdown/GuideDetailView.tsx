import React, { useState } from 'react';
import { GuideFrontmatter } from '../../types';
import { JsonLdHead } from '../seo/JsonLdHead';
import { QuickAnswerBox } from '../seo/QuickAnswerBox';
import { FactTable } from '../seo/FactTable';
import { KeyFactsBox } from '../seo/KeyFactsBox';
import { ConsumerRightsBanner } from '../seo/ConsumerRightsBanner';
import { AffiliateDisclosure } from '../seo/AffiliateDisclosure';
import { AuthorByline } from '../eeat/AuthorByline';
import { AuthorBioCard } from '../eeat/AuthorBioCard';
import { VerifiedSourceBadge } from '../eeat/VerifiedSourceBadge';
import { SourceCitationList } from '../eeat/SourceCitationList';
import { ChangelogBox } from '../eeat/ChangelogBox';
import { GuideImage } from '../images/GuideImage';
import { MarkdownRenderer } from './MarkdownRenderer';
import { TableOfContents, TocItem } from './TableOfContents';
import { SavePolicyButton } from '../interactive/SavePolicyButton';
import { DeadlineCalculator } from '../interactive/DeadlineCalculator';
import { PolicyQuiz } from '../interactive/PolicyQuiz';
import { 
  ChevronRight, 
  ArrowLeft, 
  Share2, 
  Sparkles, 
  ChevronDown, 
  Wrench, 
  Check, 
  Layers, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';

interface GuideDetailViewProps {
  guide: GuideFrontmatter;
  content: string;
  onBack: () => void;
  onSelectTool?: (toolId: string) => void;
}

export const GuideDetailView: React.FC<GuideDetailViewProps> = ({
  guide,
  content,
  onBack,
  onSelectTool
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate Table of Contents items
  const tocItems: TocItem[] = [
    { id: 'quick-answer', text: 'Executive Quick Answer', level: 2 },
    { id: 'key-facts', text: 'Key Technical Metrics', level: 2 },
    { id: 'fact-table', text: 'Specifications Matrix', level: 2 },
    { id: 'guide-content', text: 'In-Depth Analysis & Math', level: 2 },
    { id: 'micro-tool', text: 'Interactive Calculator', level: 2 },
    { id: 'how-to-steps', text: 'Step-by-Step Execution', level: 2 },
    { id: 'faqs', text: 'Frequently Asked Questions', level: 2 },
    { id: 'sources', text: 'Primary Standards & Citations', level: 2 },
    { id: 'changelog', text: 'Revision Changelog', level: 2 },
    { id: 'author-bio', text: 'About the Analyst', level: 2 }
  ];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: guide.title,
        text: guide.excerpt,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20">
      {/* 7-Layer JSON-LD & Dynamic SEO Head */}
      <JsonLdHead guide={guide} />

      {/* Top Breadcrumbs & Utility Bar */}
      <div className="border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </button>

          <div className="flex items-center gap-2">
            <SavePolicyButton
              item={{
                id: guide.id,
                title: guide.title,
                category: guide.category,
                type: 'guide',
                url: `/guides/${guide.slug}`
              }}
            />

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Share Article"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied Link</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Container with Zero-Gap 2-Column Layout */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content Column (Span 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Category badge and E-E-A-T seal */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full">
                {guide.category}
              </span>
              <VerifiedSourceBadge />
            </div>

            {/* Article Headline (H1) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight font-display">
              {guide.title}
            </h1>

            {/* Executive Excerpt */}
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
              {guide.excerpt}
            </p>

            {/* Author Byline (E-E-A-T) */}
            <AuthorByline
              authorId={guide.authorId}
              reviewerId={guide.reviewerId}
              publishedDate={guide.publishedDate}
              modifiedDate={guide.modifiedDate}
              readTime={guide.readTime}
            />

            {/* Google Position 0 QuickAnswerBox */}
            <QuickAnswerBox
              definition={guide.quickAnswer.definition}
              summaryBullets={guide.quickAnswer.summaryBullets}
              confidenceScore={guide.quickAnswer.confidenceScore}
              sourceKeyword={guide.focusKeyword}
            />

            {/* Zero-Crop Retina Hero Image */}
            <GuideImage
              src={guide.heroImage.src}
              alt={guide.heroImage.alt}
              caption={guide.heroImage.caption}
              category={guide.category}
            />

            {/* Structured Key Facts Box (AEO Grounding) */}
            <div id="key-facts">
              <KeyFactsBox facts={guide.keyFacts} />
            </div>

            {/* Specifications Comparison Table */}
            <div id="fact-table">
              <FactTable
                caption={guide.factTable.caption}
                headers={guide.factTable.headers}
                rows={guide.factTable.rows}
              />
            </div>

            {/* Hydrated Markdown Content */}
            <div id="guide-content" className="pt-2">
              <MarkdownRenderer content={content} />
            </div>

            {/* Interactive Micro-Tool: Deadline / Privacy Calculator */}
            <div id="micro-tool">
              <DeadlineCalculator />
            </div>

            {/* Interactive Policy Quiz */}
            <PolicyQuiz />

            {/* Step-by-Step HowTo Execution Section */}
            {guide.howToSteps.length > 0 && (
              <section id="how-to-steps" className="my-8 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-orange-600 text-white text-xs font-bold font-mono">
                    H2
                  </span>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                    Step-by-Step Technical Execution: {guide.focusKeyword}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {guide.howToSteps.map((step, idx) => (
                    <div
                      key={idx}
                      id={`step-${idx + 1}`}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-orange-600 dark:text-orange-400">
                            STEP 0{idx + 1}
                          </span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {step.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs Accordion for Google Snippet Expansion */}
            <section id="faqs" className="my-8 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800 mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  Frequently Asked Questions (FAQs)
                </h2>
              </div>

              <div className="space-y-2">
                {guide.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-orange-600' : ''}`} />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
                          <p>{faq.answer}</p>
                          {faq.acceptedBy && (
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono block">
                              Verified by: {faq.acceptedBy}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Primary Source Citations */}
            <SourceCitationList sources={guide.sources} />

            {/* Revision Changelog */}
            <ChangelogBox changelog={guide.changelog} />

            {/* Author Bio Card */}
            <div id="author-bio">
              <AuthorBioCard authorId={guide.authorId} reviewerId={guide.reviewerId} />
            </div>

            {/* Consumer Rights Banner & Affiliate Disclosure */}
            <ConsumerRightsBanner />
            <AffiliateDisclosure />
          </div>

          {/* Sticky Sidebar (Span 4) - Zero-Gap Height Matched */}
          <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
            {/* Quick Action Card (Launch Associated Tool) */}
            {guide.toolId && (
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-orange-950/60 text-white shadow-xl border border-orange-500/20 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-white/10 text-orange-300">
                    <Wrench className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-orange-200">
                    Interactive Live Utility
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-bold text-white leading-snug">
                    Try {guide.focusKeyword} in Toolora
                  </h4>
                  <p className="text-xs text-orange-200/80 mt-1 leading-relaxed">
                    100% in-browser processing with zero server uploads, watermarks, or subscription walls.
                  </p>
                </div>

                <button
                  onClick={() => onSelectTool && onSelectTool(guide.toolId!)}
                  className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Launch {guide.focusKeyword} Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Scroll-Synced Table of Contents */}
            <TableOfContents items={tocItems} />

            {/* Key Technical Highlights Widget */}
            <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-mono flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Verification Specs</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Schema Layers:</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">7/7 Validated</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Target Engine:</span>
                  <span className="font-mono font-bold text-orange-600 dark:text-orange-400">W3C Canvas / Wasm</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-slate-400">Data Upload:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">0 KB (Local RAM)</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </article>
  );
};
