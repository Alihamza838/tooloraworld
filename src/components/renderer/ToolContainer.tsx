import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Lock from 'lucide-react/dist/esm/icons/lock.js';

import { Tool } from '../../types';
import ToolGuideCard, { ToolGuide } from './ToolGuideCard';
import UniversalToolContent from './UniversalToolContent';
import ToolArticlesSection from './ToolArticlesSection';
import RelatedToolsSection from './RelatedToolsSection';
import LearnMoreArticlesSection, { ArticlePreview } from './LearnMoreArticlesSection';
import ToolFeedbackForm from './ToolFeedbackForm';

interface ToolContainerProps {
  tool: Tool;
  guide?: ToolGuide;
  relatedTools: Tool[];
  relatedArticles: ArticlePreview[];
  children: React.ReactNode;
}

export default function ToolContainer({
  tool,
  guide,
  relatedTools,
  relatedArticles,
  children,
}: ToolContainerProps) {
  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'pdf':
        return 'PDF Solutions';
      case 'image':
        return 'Image Studio';
      case 'document':
        return 'Document & Generators';
      case 'utility':
        return 'Utilities & Converters';
      default:
        return 'Productivity Suite';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FA] dark:bg-[#0B0F19] transition-colors duration-200">
      <div className="max-w-[1270px] mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-5">
        
        {/* ── 1. STANDARDIZED MINIMAL HEADER & BREADCRUMBS ───────────────────── */}
        <header className="space-y-2 text-left pt-1">
          {/* Breadcrumbs */}
          <nav
            className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium select-none"
            aria-label="Breadcrumb"
          >
            <Link
              to="/"
              className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
            >
              Home
            </Link>
            <span>/</span>
            <Link
              to={`/?category=${tool.category}`}
              className="capitalize hover:text-orange-600 dark:hover:text-orange-400 text-slate-600 dark:text-zinc-400 transition-colors"
            >
              {getCategoryLabel(tool.category)}
            </Link>
            <span>/</span>
            <span className="text-slate-800 dark:text-zinc-200 font-bold truncate">
              {tool.name}
            </span>
          </nav>

          {/* Title & Trust Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight font-display">
              {tool.name}
            </h1>

            <div className="flex flex-wrap items-center gap-2 shrink-0 self-start sm:self-center">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/30 flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> 100% Client-Side Private
              </span>

              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200/60 dark:border-orange-900/30">
                100% Free
              </span>
            </div>
          </div>
        </header>

        {/* ── 2. UNIFORM TOOL CONTENT WORKSPACE AREA ─────────────────────────── */}
        <section
          aria-label={`${tool.name} Workspace`}
          className="rounded-3xl p-4 sm:p-6 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs min-h-[320px]"
        >
          {children}
        </section>

        {/* ── 3. EMBEDDED 'HOW TO USE' FLEX CARDS ───────────────────────────── */}
        {guide && (
          <section aria-label="Step-by-step Instructions">
            <ToolGuideCard guide={guide} />
          </section>
        )}

        {/* ── 4. UNIVERSAL DEEP DIVE, SPECS & FAQS ──────────────────────────── */}
        <UniversalToolContent toolId={tool.id} />

        {/* ── 5. CONTEXTUAL BLOG GUIDES & CASE STUDIES ──────────────────────── */}
        <ToolArticlesSection toolId={tool.id} />

        {/* ── 6. RELATED TOOLS + ARCHITECTURE ARTICLES ──────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-5 text-left">
          <RelatedToolsSection tools={relatedTools} />
          <LearnMoreArticlesSection articles={relatedArticles} />
        </div>

        {/* ── 7. INTERACTIVE FEEDBACK FORM ───────────────────────────────────── */}
        <ToolFeedbackForm />
      </div>
    </div>
  );
}
