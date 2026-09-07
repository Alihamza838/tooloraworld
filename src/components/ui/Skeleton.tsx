// src/components/ui/Skeleton.tsx
import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded' | 'text';
  animation?: 'shimmer' | 'pulse' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rounded',
  animation = 'shimmer',
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'text':
        return 'rounded-md h-4 my-1';
      case 'rectangular':
        return 'rounded-none';
      case 'rounded':
      default:
        return 'rounded-xl';
    }
  };

  const getAnimationClass = () => {
    switch (animation) {
      case 'shimmer':
        return 'animate-shimmer';
      case 'pulse':
        return 'animate-pulse';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <div
      className={`bg-slate-200/80 dark:bg-slate-800/70 select-none pointer-events-none ${getVariantClass()} ${getAnimationClass()} ${className}`}
      aria-hidden="true"
    />
  );
};

// ─── TOOL CARD SKELETON (Matching Toolora's Interactive Cards) ───────────────
export const ToolCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`p-5 rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] shadow-xs flex flex-col justify-between h-[210px] sm:h-[220px] relative overflow-hidden ${className}`}
    >
      {/* Header: Icon Box + Category Badge */}
      <div className="flex items-start justify-between gap-3">
        <Skeleton variant="rounded" className="w-12 h-12 rounded-2xl shrink-0" />
        <Skeleton variant="rounded" className="w-20 h-6 rounded-full" />
      </div>

      {/* Title & Description */}
      <div className="space-y-2 my-auto">
        <Skeleton variant="text" className="w-3/4 h-5 rounded-lg" />
        <Skeleton variant="text" className="w-full h-3.5 rounded" />
        <Skeleton variant="text" className="w-4/5 h-3.5 rounded" />
      </div>

      {/* Footer Meta & Button */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
        <Skeleton variant="text" className="w-24 h-3 rounded" />
        <Skeleton variant="rounded" className="w-16 h-7 rounded-xl" />
      </div>
    </div>
  );
};

// ─── TOOL WORKSPACE SKELETON (Full Tool Workspace Loading State) ──────────────
export const ToolWorkspaceSkeleton: React.FC<{ toolName?: string }> = ({ toolName = 'Utility Workspace' }) => {
  return (
    <div className="w-full space-y-6 animate-in fade-in-50 duration-300">
      {/* Workspace Header Skeleton */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton variant="rounded" className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton variant="rounded" className="w-28 h-5 rounded-full" />
                <Skeleton variant="rounded" className="w-20 h-5 rounded-full" />
              </div>
              <Skeleton variant="text" className="w-64 sm:w-80 h-7 rounded-lg" />
              <Skeleton variant="text" className="w-48 sm:w-96 h-4 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" className="w-24 h-10 rounded-xl" />
            <Skeleton variant="rounded" className="w-28 h-10 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main Workspace Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center Upload & Action Canvas */}
        <div className="lg:col-span-8 space-y-6">
          {/* File Upload / Interactive Dropzone Box */}
          <div className="bg-white dark:bg-[#131B2E] border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[300px] space-y-4">
            <Skeleton variant="circular" className="w-16 h-16 rounded-2xl" />
            <div className="space-y-2 max-w-sm w-full flex flex-col items-center">
              <Skeleton variant="text" className="w-48 h-5 rounded-lg" />
              <Skeleton variant="text" className="w-64 h-3.5 rounded" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <Skeleton variant="rounded" className="w-36 h-11 rounded-2xl" />
              <Skeleton variant="rounded" className="w-28 h-11 rounded-2xl" />
            </div>
          </div>

          {/* Secondary Controls Bar */}
          <div className="bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="rounded" className="w-24 h-8 rounded-lg" />
              <Skeleton variant="rounded" className="w-28 h-8 rounded-lg" />
            </div>
            <Skeleton variant="rounded" className="w-32 h-9 rounded-xl" />
          </div>
        </div>

        {/* Right Sidebar Options Panel */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <Skeleton variant="text" className="w-32 h-5 rounded-md" />
              <Skeleton variant="rounded" className="w-12 h-5 rounded-full" />
            </div>

            {/* Config Sliders & Inputs */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton variant="text" className="w-24 h-3.5 rounded" />
                <Skeleton variant="rounded" className="w-full h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="text" className="w-28 h-3.5 rounded" />
                <Skeleton variant="rounded" className="w-full h-10 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton variant="text" className="w-36 h-3.5 rounded" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton variant="rounded" className="w-full h-9 rounded-xl" />
                  <Skeleton variant="rounded" className="w-full h-9 rounded-xl" />
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <Skeleton variant="rounded" className="w-full h-12 rounded-2xl" />
            </div>
          </div>

          {/* Privacy Guarantee Snippet Skeleton */}
          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-4 flex items-center gap-3">
            <Skeleton variant="circular" className="w-8 h-8 rounded-xl shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton variant="text" className="w-32 h-3.5 rounded" />
              <Skeleton variant="text" className="w-44 h-3 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ARTICLE CARD SKELETON (For Guides and Blog Hub) ─────────────────────────
export const ArticleCardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between ${className}`}
    >
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800" />
      <div className="p-6 sm:p-7 space-y-5 flex-1 flex flex-col">
        {/* Header Metadata */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton variant="rounded" className="w-20 h-5 rounded-full" />
            <Skeleton variant="rounded" className="w-16 h-4 rounded-md" />
          </div>
          <Skeleton variant="rounded" className="w-20 h-4 rounded" />
        </div>

        {/* Cover Image Placeholder */}
        <Skeleton variant="rounded" className="w-full aspect-video rounded-2xl" />

        {/* Title & Author */}
        <div className="space-y-2">
          <Skeleton variant="text" className="w-11/12 h-6 rounded-lg" />
          <Skeleton variant="text" className="w-2/3 h-6 rounded-lg" />
          <div className="flex items-center gap-2 pt-1">
            <Skeleton variant="circular" className="w-5 h-5" />
            <Skeleton variant="text" className="w-32 h-3.5 rounded" />
          </div>
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5 flex-1">
          <Skeleton variant="text" className="w-full h-3.5 rounded" />
          <Skeleton variant="text" className="w-full h-3.5 rounded" />
          <Skeleton variant="text" className="w-4/5 h-3.5 rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-150 dark:border-slate-800/80 flex items-center justify-between">
        <Skeleton variant="text" className="w-28 h-4 rounded" />
        <Skeleton variant="rounded" className="w-28 h-9 rounded-xl" />
      </div>
    </div>
  );
};

// ─── ARTICLE VIEW SKELETON (Full Article Loading State) ──────────────────────
export const ArticleViewSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in-50 duration-300 py-6 text-left">
      {/* Back Button & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Skeleton variant="rounded" className="w-24 h-9 rounded-xl" />
        <Skeleton variant="text" className="w-48 h-4 rounded" />
      </div>

      {/* Article Header Card */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl p-6 sm:p-9 space-y-6 shadow-xs">
        <div className="flex items-center gap-2">
          <Skeleton variant="rounded" className="w-24 h-6 rounded-full" />
          <Skeleton variant="rounded" className="w-20 h-6 rounded-full" />
        </div>

        <div className="space-y-3">
          <Skeleton variant="text" className="w-full h-9 rounded-xl" />
          <Skeleton variant="text" className="w-4/5 h-9 rounded-xl" />
        </div>

        {/* Author details */}
        <div className="flex items-center gap-3 pt-2">
          <Skeleton variant="circular" className="w-11 h-11" />
          <div className="space-y-1.5">
            <Skeleton variant="text" className="w-36 h-4 rounded" />
            <Skeleton variant="text" className="w-48 h-3.5 rounded" />
          </div>
        </div>

        {/* Big Cover Image */}
        <Skeleton variant="rounded" className="w-full aspect-video rounded-2xl" />
      </div>

      {/* Content Prose Blocks */}
      <div className="bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-3xl p-6 sm:p-9 space-y-6 shadow-xs">
        <Skeleton variant="text" className="w-48 h-6 rounded-lg" />
        <div className="space-y-2">
          <Skeleton variant="text" className="w-full h-4 rounded" />
          <Skeleton variant="text" className="w-full h-4 rounded" />
          <Skeleton variant="text" className="w-11/12 h-4 rounded" />
          <Skeleton variant="text" className="w-4/5 h-4 rounded" />
        </div>

        <Skeleton variant="rounded" className="w-full h-32 rounded-2xl" />

        <div className="space-y-2">
          <Skeleton variant="text" className="w-full h-4 rounded" />
          <Skeleton variant="text" className="w-full h-4 rounded" />
          <Skeleton variant="text" className="w-3/4 h-4 rounded" />
        </div>
      </div>
    </div>
  );
};

// ─── CATEGORY PILLS SKELETON ────────────────────────────────────────────────
export const CategoryPillsSkeleton: React.FC = () => {
  return (
    <div className="flex items-center gap-2 overflow-hidden py-1">
      <Skeleton variant="rounded" className="w-20 h-10 rounded-full shrink-0" />
      <Skeleton variant="rounded" className="w-24 h-10 rounded-full shrink-0" />
      <Skeleton variant="rounded" className="w-28 h-10 rounded-full shrink-0" />
      <Skeleton variant="rounded" className="w-24 h-10 rounded-full shrink-0" />
      <Skeleton variant="rounded" className="w-32 h-10 rounded-full shrink-0" />
      <Skeleton variant="rounded" className="w-24 h-10 rounded-full shrink-0" />
    </div>
  );
};

export default Skeleton;
