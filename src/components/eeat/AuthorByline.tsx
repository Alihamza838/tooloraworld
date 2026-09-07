import React from 'react';
import { AuthorProfile } from '../../types';
import { AUTHORS } from '../../data/authors';
import { ShieldCheck, Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface AuthorBylineProps {
  authorId: string;
  reviewerId?: string;
  publishedDate: string;
  modifiedDate: string;
  readTime: string;
}

export const AuthorByline: React.FC<AuthorBylineProps> = ({
  authorId,
  reviewerId,
  publishedDate,
  modifiedDate,
  readTime
}) => {
  const author: AuthorProfile = AUTHORS[authorId] || AUTHORS['dr-marcus-vance'];
  const reviewer: AuthorProfile | undefined = reviewerId ? AUTHORS[reviewerId] : undefined;

  const formatDate = (d: string) => {
    try {
      return new Date(d).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return d;
    }
  };

  return (
    <div className="my-5 flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-200/80 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
      {/* Author Details */}
      <div className="flex items-center gap-3">
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20 dark:ring-orange-400/20 [image-rendering:-webkit-optimize-contrast]"
          loading="lazy"
        />
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-slate-100">
            <span>{author.name}</span>
            {author.verified && (
              <span title="Verified Technical Analyst & Domain Expert" className="inline-flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            {author.credentials}
          </p>
        </div>
      </div>

      {/* Peer Reviewer & Metadata */}
      <div className="flex flex-wrap items-center gap-4 text-[11px]">
        {reviewer && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Reviewed by <strong>{reviewer.name}</strong></span>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>Updated {formatDate(modifiedDate)}</span>
        </div>

        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{readTime}</span>
        </div>
      </div>
    </div>
  );
};
