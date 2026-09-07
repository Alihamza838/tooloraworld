import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useToolora } from '../../context/TooloraContext';

export interface ArticlePreview {
  id: string;
  title: string;
  excerpt: string;
  tag: string;
}

interface LearnMoreArticlesSectionProps {
  articles: ArticlePreview[];
}

export default function LearnMoreArticlesSection({
  articles,
}: LearnMoreArticlesSectionProps) {
  const navigate = useNavigate();
  const { setShowBlog, setActiveArticleId } = useToolora();

  if (!articles || articles.length === 0) return null;

  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs space-y-4 text-left">
      <div className="flex items-center gap-2">
        <div className="w-1 h-5 rounded-full bg-emerald-500" />
        <h3 className="text-sm font-black text-slate-800 dark:text-zinc-100 uppercase tracking-wider">
          Learn More & Architecture
        </h3>
      </div>
      <div className="space-y-3">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={() => {
              navigate(`/blog/${article.id}`);
              setShowBlog(true);
              setActiveArticleId(article.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full p-3.5 text-left rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] transition-all group cursor-pointer hover:border-orange-400 hover:shadow-md active:scale-[0.98]"
          >
            <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full mb-1.5 bg-orange-600 text-white shadow-3xs font-mono">
              {article.tag}
            </span>
            <p className="text-xs font-bold text-slate-800 dark:text-zinc-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-snug">
              {article.excerpt}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
