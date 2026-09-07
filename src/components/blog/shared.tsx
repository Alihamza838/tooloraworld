// blog/shared.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Optimized UI components for Toolora Blog.
// Includes accessibility roles, dynamic gradients, and SEO-friendly metadata.
// ─────────────────────────────────────────────────────────────────────────────

import React, { memo } from "react";
import { BookOpen, Clock } from "lucide-react";
import { tagClass, initials } from "./utils";

// ── Interfaces ──────────────────────────────────────────────────────────────
interface TagBadgeProps {
  tag: string;
  className?: string;
}

interface AuthorAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  variant?: "orange" | "amber" | "teal";
}

// ── Tag badge (SEO & Accessibility Enhanced) ────────────────────────────────
export const TagBadge = memo(({ tag, className = "" }: TagBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border tracking-wider uppercase backdrop-blur-sm shadow-xs select-none transition-all duration-300 ${tagClass(
      tag,
    )} ${className}`}
    role="status"
    aria-label={`Category: ${tag}`}
  >
    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-pulse" />
    {tag}
  </span>
));
TagBadge.displayName = "TagBadge";

// ── Author avatar (A11y Optimized) ──────────────────────────────────────────
export const AuthorAvatar = memo(
  ({ name, size = 36, className = "" }: AuthorAvatarProps) => (
    <div
      className={`shrink-0 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 text-zinc-700 dark:text-zinc-300 font-bold tracking-wider border border-zinc-200/60 dark:border-zinc-700/50 flex items-center justify-center shadow-inner select-none transition-transform duration-300 hover:scale-105 ${className}`}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.33) }}
      role="img"
      aria-label={`Author: ${name}`}
    >
      {initials(name)}
    </div>
  ),
);
AuthorAvatar.displayName = "AuthorAvatar";

// ── Reading Time ────────────────────────────────────────────────────────────
export const ReadingTime = memo(({ minutes }: { minutes: number }) => (
  <time
    dateTime={`PT${minutes}M`}
    className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400"
  >
    <Clock className="w-3.5 h-3.5" />
    {minutes} min read
  </time>
));
ReadingTime.displayName = "ReadingTime";

// ── Eyebrow ─────────────────────────────────────────────────────────────────
export const Eyebrow = memo(
  ({ children, className = "", variant = "orange" }: EyebrowProps) => {
    const colorMap = {
      orange:
        "from-orange-500 to-amber-600 dark:from-orange-400 dark:to-amber-400",
      amber:
        "from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-400",
      teal: "from-teal-500 to-emerald-600 dark:from-teal-400 dark:to-emerald-400",
    };

    return (
      <span
        className={`inline-block text-xs font-bold tracking-[0.18em] uppercase bg-gradient-to-r ${colorMap[variant]} bg-clip-text text-transparent pb-0.5 select-none ${className}`}
      >
        {children}
      </span>
    );
  },
);
Eyebrow.displayName = "Eyebrow";

// ── Empty State ─────────────────────────────────────────────────────────────
export const EmptyState = memo(
  ({ title, message = "No items found.", actionLabel, onAction }: any) => (
    <div className="flex flex-col items-center justify-center text-center py-20 px-4 rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
        <BookOpen className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="text-xs text-zinc-500 mb-5">{message}</p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl"
        >
          {actionLabel}
        </button>
      )}
    </div>
  ),
);
EmptyState.displayName = "EmptyState";

// ── Skeletons (Performance optimized) ───────────────────────────────────────
export const ArticleCardSkeleton = memo(() => (
  <div
    className="flex flex-col rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4 shadow-xs"
    aria-hidden="true"
  >
    <div
      className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-2xl animate-pulse"
      style={{ aspectRatio: "16/10" }}
    />
    <div className="space-y-3 px-2 flex-1">
      <div className="w-full h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
      <div className="w-3/4 h-5 rounded-lg bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
    </div>
  </div>
));
ArticleCardSkeleton.displayName = "ArticleCardSkeleton";

export const ArticleGridSkeleton = memo(({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
    {Array.from({ length: count }).map((_, i) => (
      <ArticleCardSkeleton key={i} />
    ))}
  </div>
));
ArticleGridSkeleton.displayName = "ArticleGridSkeleton";
