// src/components/BlogSection.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Universal Blog & Knowledge Authority Hub
// Renders both the streamlined Article Index catalog (with simple, real data,
// category pills, and instant search) and the in-depth E-E-A-T Article Reader.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToolora } from '../context/TooloraContext';
import { FULL_ARTICLES, ARTICLES_BY_ID } from './blog/articlesIndex';
import type { BlogPost } from './blog/types';
import ArticleShell from './blog/ArticleShell';
import { GUIDES } from '../data/guidesData';
import { GuideDetailView } from './markdown/GuideDetailView';
import { TOOLS } from '../data';
import LucideIcon from './LucideIcon';
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Tag,
  ShieldCheck,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  X
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Articles' },
  { id: 'pdf', label: 'PDF Tech', matchTags: ['PDF Tools', 'PDF Engineering', 'PDF Security', 'PDF Conversion', 'PDF Architecture'] },
  { id: 'image', label: 'Image Studio', matchTags: ['Image Tools', 'Image Processing', 'OCR Scanner', 'Computer Vision'] },
  { id: 'doc', label: 'Document & Business', matchTags: ['Document Tools', 'Branding & Generators', 'Financial Tools', 'Career & HR', 'Signatures'] },
  { id: 'utility', label: 'Math & Converters', matchTags: ['Converters', 'Typography & Text', 'Converters & Formatting', 'Web Optimization'] },
];

const ITEMS_PER_PAGE = 12;

export default function BlogSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    activeArticleId,
    setActiveArticleId,
    setActiveToolId,
    setShowBlog
  } = useToolora();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Sync active article from pathname if user navigated directly or clicked back/forward
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/blog/') || path.startsWith('/guides/')) {
      const slugOrId = path.replace('/blog/', '').replace('/guides/', '').split('?')[0].trim();
      if (slugOrId && slugOrId !== 'all') {
        setActiveArticleId(slugOrId);
      }
    }
  }, [location.pathname, setActiveArticleId]);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Check if an article is currently selected
  const activePost: BlogPost | null = useMemo(() => {
    if (!activeArticleId) return null;
    return (
      ARTICLES_BY_ID[activeArticleId] ||
      FULL_ARTICLES.find(
        (a) => a.id === activeArticleId || a.slug === activeArticleId
      ) ||
      null
    );
  }, [activeArticleId]);

  // Check if a Guide is selected
  const activeGuide = useMemo(() => {
    if (!activeArticleId) return null;
    return (
      GUIDES.find(
        (g) =>
          g.frontmatter.id === activeArticleId ||
          g.frontmatter.slug === activeArticleId
      ) || null
    );
  }, [activeArticleId]);

  // Filter articles for the catalog index
  const filteredArticles = useMemo(() => {
    return FULL_ARTICLES.filter((article) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catConfig = CATEGORY_TABS.find((c) => c.id === selectedCategory);
        if (catConfig?.matchTags) {
          const matches = catConfig.matchTags.some(
            (t) => t.toLowerCase() === article.tag.toLowerCase()
          );
          if (!matches) return false;
        }
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inTitle = article.title.toLowerCase().includes(q);
        const inExcerpt = article.excerpt.toLowerCase().includes(q);
        const inTag = article.tag.toLowerCase().includes(q);
        const inKeyword = article.focusKeyword.toLowerCase().includes(q);
        const inAuthor = article.author.toLowerCase().includes(q);
        if (!inTitle && !inExcerpt && !inTag && !inKeyword && !inAuthor) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / ITEMS_PER_PAGE));
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredArticles.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  const handleOpenArticle = (post: BlogPost) => {
    const slug = post.slug || post.id;
    setActiveArticleId(slug);
    navigate(`/blog/${slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
    setShowBlog(false);
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setActiveArticleId(null);
    navigate('/blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ─────────────────────────────────────────────────────────────────────────
  // 1. ARTICLE DETAIL VIEW (E-E-A-T Shell or Guide View)
  // ─────────────────────────────────────────────────────────────────────────
  if (activePost) {
    return (
      <div className="w-full">
        <ArticleShell
          post={activePost}
          onBack={handleBackToCatalog}
          onOpenTool={handleOpenTool}
          onNavigateArticle={(slugOrId) => {
            const nextPost =
              ARTICLES_BY_ID[slugOrId] ||
              FULL_ARTICLES.find(
                (a) => a.id === slugOrId || a.slug === slugOrId
              );
            if (nextPost) {
              handleOpenArticle(nextPost);
            }
          }}
        />
      </div>
    );
  }

  if (activeGuide) {
    return (
      <div className="w-full">
        <GuideDetailView
          guide={activeGuide.frontmatter}
          content={activeGuide.content}
          onBack={handleBackToCatalog}
          onSelectTool={handleOpenTool}
        />
      </div>
    );
  }

  // If activeArticleId was passed but not found, show clean not-found message
  if (activeArticleId) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 mx-auto flex items-center justify-center">
          <BookOpen className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100">
          Article Not Found
        </h2>
        <p className="text-sm text-slate-500 dark:text-zinc-400">
          We couldn't locate the requested guide article. It may have been updated or moved.
        </p>
        <button
          onClick={handleBackToCatalog}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold font-display cursor-pointer transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. MAIN BLOG CATALOG PAGE (Clean, Simple, Scannable & To-The-Point)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full space-y-8 pb-16 animate-in fade-in duration-200 text-left">
      
      {/* ── BREADCRUMBS ── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-medium" aria-label="Breadcrumb">
        <button
          onClick={() => navigate('/')}
          className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <span className="text-slate-900 dark:text-zinc-100 font-bold">
          Blog
        </span>
      </nav>

      {/* ── CLEAN HEADER HERO SECTION ── */}
      <div className="flex items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-zinc-800">
        <div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            Blog
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-zinc-400 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 font-bold text-slate-700 dark:text-zinc-300">
            {FULL_ARTICLES.length} Published Articles
          </span>
        </div>
      </div>

      {/* ── SEARCH & CATEGORY BAR ── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" id="blog-category-filter">
            {CATEGORY_TABS.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? FULL_ARTICLES.length
                  : FULL_ARTICLES.filter((a) =>
                      cat.matchTags?.some(
                        (t) => t.toLowerCase() === a.tag.toLowerCase()
                      )
                    ).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border active:scale-95 ${
                    isSelected
                      ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                      : 'bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, topics, tools..."
              className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-orange-500 dark:focus:border-orange-500 transition-colors shadow-3xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Summary if filtered */}
        {(selectedCategory !== 'all' || searchQuery.trim()) && (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-1">
            <span>
              Showing <strong>{filteredArticles.length}</strong> matching{' '}
              {filteredArticles.length === 1 ? 'article' : 'articles'}
            </span>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* ── ARTICLES CARDS GRID (Simplified, high-contrast, clean) ── */}
      {filteredArticles.length === 0 ? (
        <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/30 space-y-3">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-zinc-300">
            No articles match "{searchQuery}"
          </p>
          <p className="text-xs text-slate-500 dark:text-zinc-400">
            Try searching for another keyword or reset the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
          {paginatedArticles.map((article) => {
            const matchingTool = article.toolId
              ? TOOLS.find((t) => t.id === article.toolId)
              : null;

            return (
              <article
                key={article.id}
                onClick={() => handleOpenArticle(article)}
                className="group bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between cursor-pointer"
              >
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  {/* Category Tag & Read Time */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/60 dark:border-orange-900/30 font-mono">
                      {article.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 dark:text-zinc-400">
                      <Clock className="w-3 h-3 text-orange-500" />
                      {article.readTime}
                    </span>
                  </div>

                  {/* Thumbnail Cover Image with descriptive alt */}
                  {article.coverImage && (
                    <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-900 aspect-[16/9] border border-slate-100 dark:border-zinc-800">
                      <img
                        src={article.coverImage}
                        alt={`${article.title} - Guide Thumbnail`}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Title & Excerpt */}
                  <div className="space-y-1.5 flex-1">
                    <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 font-display tracking-tight group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug line-clamp-2">
                      {article.title}
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Author Credential & Related Tool Shortcut */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 font-bold text-[9px] flex items-center justify-center shrink-0">
                        {article.author.charAt(0)}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-600 dark:text-zinc-400 truncate">
                        {article.author.split(' ')[0]}
                      </span>
                    </div>

                    {matchingTool ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenTool(matchingTool.id);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline shrink-0 font-mono px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/30"
                      >
                        <span>Tool</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-zinc-300 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        <span>Read</span>
                        <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── PAGINATION CONTROLS ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => {
              setCurrentPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === 1}
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-850 cursor-pointer disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => {
                setCurrentPage(pageNum);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentPage === pageNum
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850'
              }`}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => {
              setCurrentPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            disabled={currentPage === totalPages}
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-300 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-850 cursor-pointer disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
