// src/components/renderer/ToolArticlesSection.tsx
import React, { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToolora } from '../../context/TooloraContext';
import { TOOLS } from '../../data';
import { getArticlesForTool } from '../blog/articlesIndex';
import type { BlogPost } from '../blog/types';
import LucideIcon from '../LucideIcon';
import VisualSeparator from '../ui/VisualSeparator';
import { 
  BookOpen, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';

interface ToolArticlesSectionProps {
  toolId: string;
}

export const ToolArticlesSection: React.FC<ToolArticlesSectionProps> = ({ toolId }) => {
  const navigate = useNavigate();
  const { setShowBlog, setActiveArticleId, setActiveToolId } = useToolora();

  const articles = useMemo(() => {
    return getArticlesForTool(toolId, 2);
  }, [toolId]);

  const currentTool = useMemo(() => {
    return TOOLS.find((t) => t.id === toolId);
  }, [toolId]);

  if (!articles || articles.length === 0) return null;

  const handleOpenArticle = (article: BlogPost) => {
    navigate(`/blog/${article.slug || article.id}`);
    setShowBlog(true);
    setActiveArticleId(article.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTool = (targetToolId: string) => {
    setActiveToolId(targetToolId);
    setShowBlog(false);
    navigate(`/tools/${targetToolId}?tool=${targetToolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full space-y-6 text-left" aria-label="Recommended In-Depth Guides">
      {/* Visual Separator Component distinguishing Tool Category from Recommended Articles */}
      <VisualSeparator
        categoryLabel={`${currentTool?.category ? currentTool.category.toUpperCase() : 'UTILITY'} SUITE`}
        sectionTitle={`Recommended In-Depth Guides for ${currentTool?.name || 'This Tool'}`}
        badgeText="Verified Masterclasses"
        icon="book"
      />

      {/* Grid of 2 Compact Dynamic Long-Form Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {articles.map((article, idx) => {
          const relatedToolsList = (article.relatedTools || [])
            .map((tid) => TOOLS.find((t) => t.id === tid))
            .filter(Boolean);

          return (
            <article
              key={article.id || idx}
              className="group bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between relative"
            >
              <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col">
                {/* Header Metadata: Tag, Read Time, Published Date */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/70 dark:border-orange-900/40 font-mono">
                      {article.tag || 'Guide'}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                      <Clock className="w-3 h-3 text-orange-500 shrink-0" />
                      {article.readTime || '8 min read'}
                    </span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500">
                    {article.date}
                  </span>
                </div>

                {/* Article Cover Image with compact aspect ratio */}
                {article.coverImage && (
                  <div
                    onClick={() => handleOpenArticle(article)}
                    className="relative w-full rounded-xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-zinc-900 aspect-[21/9] border border-slate-100 dark:border-zinc-800"
                  >
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                )}

                {/* Title & E-E-A-T Author Information */}
                <div className="space-y-1">
                  <h3
                    onClick={() => handleOpenArticle(article)}
                    className="text-sm sm:text-base font-black text-slate-900 dark:text-zinc-100 font-display tracking-tight hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {article.title}
                  </h3>

                  {/* Author Credential Snippet */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-zinc-400">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">
                      By {article.author}
                    </span>
                    <span>·</span>
                    <span className="truncate text-[10px] text-orange-600 dark:text-orange-400 font-medium">
                      {article.authorRole}
                    </span>
                  </div>
                </div>

                {/* Highly readable, benefit-driven excerpt snippet */}
                <p className="text-xs text-slate-600 dark:text-zinc-300 leading-relaxed font-normal flex-1 line-clamp-2">
                  {article.excerpt}
                </p>

                {/* Key Takeaways Highlights (1 compact takeaway) */}
                {article.takeaways && article.takeaways.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-900/70 border border-slate-150 dark:border-zinc-800/80 space-y-1">
                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 font-mono">
                      <Sparkles className="w-2.5 h-2.5" /> Key Takeaway
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-300 leading-relaxed line-clamp-1">
                      {article.takeaways[0]}
                    </p>
                  </div>
                )}

                {/* Internal Links to Related Tools Section */}
                {relatedToolsList.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 space-y-1.5">
                    <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 font-mono">
                      <Tag className="w-2.5 h-2.5" /> Related Tools
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {relatedToolsList.slice(0, 3).map((relTool) => {
                        if (!relTool) return null;
                        return (
                          <button
                            key={relTool.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenTool(relTool.id);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 dark:bg-zinc-800 dark:hover:bg-orange-950/30 dark:hover:text-orange-300 dark:hover:border-orange-900/40 text-slate-700 dark:text-zinc-300 border border-slate-200/60 dark:border-zinc-700/60 transition-colors cursor-pointer"
                            title={`Open ${relTool.name}`}
                          >
                            <LucideIcon name={relTool.icon} className="w-2.5 h-2.5 text-orange-500 shrink-0" />
                            <span>{relTool.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Card Action Link */}
              <div className="px-4 py-3 bg-slate-50/70 dark:bg-zinc-900/40 border-t border-slate-150 dark:border-zinc-800/80 flex items-center justify-between">
                <span className="text-[10px] font-medium text-slate-400 dark:text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Verified Private
                </span>

                <button
                  onClick={() => handleOpenArticle(article)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-orange-600 hover:bg-orange-700 text-white transition-all duration-150 shadow-2xs cursor-pointer active:scale-95"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default ToolArticlesSection;
