// src/components/home/HomeRecommendedArticles.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToolora } from '../../context/TooloraContext';
import { FULL_ARTICLES } from '../blog/articlesIndex';
import { TOOLS } from '../../data';
import VisualSeparator from '../ui/VisualSeparator';
import LucideIcon from '../LucideIcon';
import { 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  BookOpen 
} from 'lucide-react';

export const HomeRecommendedArticles: React.FC = () => {
  const navigate = useNavigate();
  const { setShowBlog, setActiveArticleId, setActiveToolId } = useToolora();

  // Select top high-intent featured guides across primary categories
  const featuredArticles = FULL_ARTICLES.slice(0, 4);

  const handleOpenArticle = (slugOrId: string) => {
    navigate(`/blog/${slugOrId}`);
    setShowBlog(true);
    setActiveArticleId(slugOrId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTool = (toolId: string) => {
    setActiveToolId(toolId);
    setShowBlog(false);
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="w-full space-y-6 text-left" aria-label="Featured Technical Guides">
      {/* Visual Separator Component dividing the Tool Category from Recommended Articles */}
      <VisualSeparator
        categoryLabel="DOCUMENTATION &amp; DEEP DIVES"
        sectionTitle="Recommended In-Depth Guides &amp; Practical Masterclasses"
        badgeText="58+ Articles Published"
        icon="book"
      />

      {/* Grid of 4 Concise Recommended Articles in Window View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4.5">
        {featuredArticles.map((article) => {
          const matchingTool = article.toolId ? TOOLS.find((t) => t.id === article.toolId) : null;

          return (
            <article
              key={article.id}
              className="group bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-2xl overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {/* Header Meta */}
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border border-orange-200/70 dark:border-orange-900/40 font-mono">
                    {article.tag}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500 dark:text-zinc-400">
                    <Clock className="w-3 h-3 text-orange-500" />
                    {article.readTime}
                  </span>
                </div>

                {/* Cover Image - concise aspect */}
                {article.coverImage && (
                  <div
                    onClick={() => handleOpenArticle(article.slug || article.id)}
                    className="relative w-full rounded-xl overflow-hidden cursor-pointer bg-slate-100 dark:bg-zinc-900 aspect-[16/9] border border-slate-150 dark:border-zinc-800"
                  >
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Heading & Excerpt */}
                <div className="space-y-1.5 flex-1">
                  <h3
                    onClick={() => handleOpenArticle(article.slug || article.id)}
                    className="text-xs sm:text-sm font-bold text-slate-900 dark:text-zinc-100 font-display hover:text-orange-600 dark:hover:text-orange-400 cursor-pointer transition-colors leading-snug line-clamp-2"
                  >
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed font-normal line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                {/* Quick Link / Tool Trigger */}
                <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">
                    By {article.author.split(' ')[0]}
                  </span>

                  {matchingTool ? (
                    <button
                      onClick={() => handleOpenTool(matchingTool.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline font-mono px-2 py-0.5 rounded bg-orange-50 dark:bg-orange-950/30"
                    >
                      <span>{matchingTool.name}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleOpenArticle(article.slug || article.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default HomeRecommendedArticles;
