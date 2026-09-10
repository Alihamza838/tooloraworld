// blog/ArticleShell.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Generic article renderer. Every standalone article file passes its static
// BlogPost data object into this shell.
//
// SEO / AEO pass:
//   - FAQPage + BlogPosting + BreadcrumbList + (optional) HowTo JSON-LD.
//   - ComparisonTable renders `section.table` as a real styled <table>.
//   - StatBarChart renders `section.chart` as a real horizontal bar chart.
//   - InlineToolChip renders `section.relatedToolId` as a small functional button.
// ─────────────────────────────────────────────────────────────────────────────

import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowRight,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  Clock,
  HelpCircle,
  Shield,
  ShieldAlert,
  Sparkles,
  Table as TableIcon,
} from "lucide-react";
import confetti from "canvas-confetti";
import { TOOLS } from "../../data";
import LucideIcon from "../LucideIcon";
import { TagBadge, AuthorAvatar, Eyebrow } from "./shared";
import MarkdownText from "./MarkdownText";
import ArticleFaqAccordion from "./ArticleFaqAccordion";
import type { ArticleComponentProps, BlogPost, ArticleSection } from "./types";
import { ARTICLES } from "./articlesIndex";

// ── Section image with IntersectionObserver lazy-load ───────────────────────
const SectionImage = memo(({ src, alt }: { src: string; alt: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "120px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full rounded-2xl overflow-hidden my-3 border border-slate-100 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900"
      style={{ aspectRatio: "16/8" }}
    >
      {!loaded && (
        <div className="absolute inset-0 bg-slate-200/80 dark:bg-slate-800/80 animate-shimmer" />
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          width={1200}
          height={600}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
});
SectionImage.displayName = "SectionImage";

// ── Comparison Table ────────────────────────────────────────────────────────
const ComparisonTable = memo(
  ({ table }: { table: NonNullable<ArticleSection["table"]> }) => (
    <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden my-4">
      {table.caption && (
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-zinc-900 flex items-center gap-2 border-b border-slate-200 dark:border-zinc-800">
          <TableIcon className="w-3.5 h-3.5 text-orange-500 shrink-0" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
            {table.caption}
          </p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-slate-900 dark:bg-zinc-800 text-white">
              {table.headers.map((h, i) => (
                <th
                  key={i}
                  className={`text-left px-4 py-3 font-bold whitespace-nowrap ${
                    i === table.highlightColIndex ? "bg-orange-600" : ""
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={
                  rIdx % 2 === 0
                    ? "bg-white dark:bg-zinc-950"
                    : "bg-slate-50/70 dark:bg-zinc-900/40"
                }
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-4 py-3 align-top text-slate-700 dark:text-zinc-300 border-b border-slate-100 dark:border-zinc-800/60 ${
                      cIdx === table.highlightColIndex
                        ? "bg-orange-50/60 dark:bg-orange-950/20 font-semibold text-orange-700 dark:text-orange-400"
                        : ""
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ),
);
ComparisonTable.displayName = "ComparisonTable";

// ── Horizontal Bar Chart ────────────────────────────────────────────────────
const StatBarChart = memo(
  ({ chart }: { chart: NonNullable<ArticleSection["chart"]> }) => {
    const max = Math.max(...chart.data.map((d) => d.value), 1);
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 p-5 space-y-4 my-4 bg-slate-50/50 dark:bg-zinc-900/30">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-orange-500 shrink-0" />
          <p className="text-[12px] font-bold text-slate-800 dark:text-zinc-200">
            {chart.title}
          </p>
        </div>
        <div className="space-y-3">
          {chart.data.map((point, i) => {
            const pct = Math.max(4, Math.round((point.value / max) * 100));
            return (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-zinc-400">
                  <span>{point.label}</span>
                  <span className="text-slate-800 dark:text-zinc-200 font-bold">
                    {point.value}
                    {chart.unit ?? ""}
                  </span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {chart.caption && (
          <p className="text-[11px] text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-200 dark:border-zinc-800">
            {chart.caption}
          </p>
        )}
      </div>
    );
  },
);
StatBarChart.displayName = "StatBarChart";

// ── Inline Tool Chip ────────────────────────────────────────────────────────
const InlineToolChip = memo(
  ({
    toolId,
    onOpenTool,
  }: {
    toolId: string;
    onOpenTool: (id: string) => void;
  }) => {
    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) return null;
    return (
      <button
        onClick={() => onOpenTool(tool.id)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[11px] font-bold hover:bg-orange-100 dark:hover:bg-orange-950/50 transition-colors cursor-pointer border border-orange-200/60 dark:border-orange-900/40 my-2"
      >
        <LucideIcon name={tool.icon} className="w-3.5 h-3.5" />
        Try {tool.name} free <ArrowRight className="w-3 h-3" />
      </button>
    );
  },
);
InlineToolChip.displayName = "InlineToolChip";

// ── Reusable Tool CTA ───────────────────────────────────────────────────────
const ToolCta = memo(
  ({
    tool,
    onOpenTool,
    variant = "primary",
  }: {
    tool: (typeof TOOLS)[number];
    onOpenTool: (id: string) => void;
    variant?: "primary" | "secondary";
  }) => {
    if (variant === "secondary") {
      return (
        <div className="p-5 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-zinc-800">
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              Ready to launch {tool.name}?
            </p>
            <p className="text-[12px] text-slate-500 dark:text-zinc-400 mt-0.5">
              Execute sovereign, private workflows directly inside your browser.
            </p>
          </div>
          <button
            onClick={() => onOpenTool(tool.id)}
            className="shrink-0 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[12px] font-bold rounded-xl transition-transform active:scale-[0.98] whitespace-nowrap cursor-pointer shadow-xs"
          >
            Open Tool Workspace →
          </button>
        </div>
      );
    }
    return (
      <div className="p-5 sm:p-6 bg-gradient-to-br from-orange-50/60 via-amber-50/30 to-white dark:from-orange-950/20 dark:via-zinc-900 dark:to-zinc-950 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4 border border-orange-200/60 dark:border-orange-900/30">
        <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-900 border border-orange-200/60 dark:border-orange-900/40 flex items-center justify-center shrink-0 shadow-xs">
            <LucideIcon
              name={tool.icon}
              className="w-6 h-6 text-orange-600 dark:text-orange-400"
            />
          </div>
          <div className="min-w-0">
            <Eyebrow variant="orange">Verified Free Utility</Eyebrow>
            <h4 className="text-sm font-bold text-slate-900 dark:text-zinc-100 truncate mt-0.5">
              {tool.name}
            </h4>
            <p className="text-[12px] text-slate-500 dark:text-zinc-400 leading-relaxed line-clamp-2 mt-0.5">
              {tool.description}
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenTool(tool.id)}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[12px] font-bold rounded-xl transition-all active:scale-[0.98] shrink-0 self-start sm:self-center whitespace-nowrap cursor-pointer shadow-xs"
        >
          Launch Tool <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  },
);
ToolCta.displayName = "ToolCta";

// ── JSON-LD Builders ────────────────────────────────────────────────────────
function buildFaqSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1"),
      },
    })),
  };
}

function buildArticleSchema(post: BlogPost, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDesc,
    image: post.coverImage,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.authorRole,
      description: post.authorCredentials,
    },
    publisher: {
      "@type": "Organization",
      name: "Toolora",
      logo: { "@type": "ImageObject", url: "/favicon.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    dateModified: post.date,
  };
}

function buildHowToSchema(post: BlogPost) {
  if (!post.howTo) return null;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: post.howTo.title,
    description: post.metaDesc,
    ...(post.howTo.totalTimeMinutes
      ? { totalTime: `PT${post.howTo.totalTimeMinutes}M` }
      : {}),
    step: post.howTo.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

function buildBreadcrumbSchema(post: BlogPost, canonicalUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://toolora.dev/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guides",
        item: "https://toolora.dev/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };
}

// ── Main Article Shell Component ────────────────────────────────────────────

interface ArticleShellProps extends ArticleComponentProps {
  post: BlogPost;
}

export default function ArticleShell({
  post,
  onBack,
  onOpenTool,
  onNavigateArticle,
}: ArticleShellProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(null);

  const matchingTool = post.toolId
    ? TOOLS.find((t) => t.id === post.toolId)
    : null;

  const canonicalUrl = `https://toolora.dev/blog/${post.slug}`;
  const faqSchema = useMemo(() => buildFaqSchema(post), [post]);
  const articleSchema = useMemo(
    () => buildArticleSchema(post, canonicalUrl),
    [post, canonicalUrl],
  );
  const howToSchema = useMemo(() => buildHowToSchema(post), [post]);
  const breadcrumbSchema = useMemo(
    () => buildBreadcrumbSchema(post, canonicalUrl),
    [post, canonicalUrl],
  );

  const handleQuizSubmit = useCallback(() => {
    if (selectedAnswer === null) return;
    setQuizSubmitted(true);
    const correct = selectedAnswer === post.quiz.correctIndex;
    setQuizCorrect(correct);
    if (correct) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.75 },
        colors: ["#ea580c", "#f97316", "#10b981"],
      });
    }
  }, [selectedAnswer, post.quiz.correctIndex]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setQuizCorrect(null);
    setOpenFaqIdx(null);
  }, [post.id]);

  return (
    <div className="bg-white dark:bg-[#131B2E] rounded-3xl overflow-hidden text-left border border-slate-200/80 dark:border-[#1E293B] shadow-sm">
      {/* ── SEO / AI-citability structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {howToSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      )}

      {/* ── Hero Banner ── */}
      <div className="relative w-full overflow-hidden" style={{ height: 280 }}>
        <img
          src={post.coverImage}
          alt={post.title}
          loading="eager"
          fetchPriority="high"
          decoding="sync"
          width={1200}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <TagBadge tag={post.tag} />
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white mt-2 leading-tight tracking-tight max-w-4xl font-display">
            {post.title}
          </h1>
        </div>
      </div>

      <div className="p-5 sm:p-8 lg:p-10 space-y-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" /> All Technical Masterclasses
        </button>

        {/* ── E-E-A-T Author Card ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <AuthorAvatar name={post.author} size={42} />
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-bold text-slate-900 dark:text-zinc-100">
                  {post.author}
                </p>
                <Check className="w-3.5 h-3.5 text-white bg-orange-500 rounded-full p-0.5" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
                {post.authorRole}
              </p>
              <p className="text-[10px] text-orange-600 dark:text-orange-400 font-semibold mt-0.5">
                {post.authorCredentials}
              </p>
            </div>
          </div>
          <div className="sm:ml-auto text-left sm:text-right shrink-0">
            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest block">
              Published
            </span>
            <span className="text-[13px] font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5 sm:justify-end mt-0.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              {post.date} · {post.readTime}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-9">
          {/* ── Main column ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Table of contents */}
            <div className="p-5 bg-orange-50/40 dark:bg-orange-950/15 rounded-2xl border border-orange-200/50 dark:border-orange-900/20">
              <Eyebrow variant="orange">In this guide</Eyebrow>
              <div className="space-y-1.5 mt-3">
                {post.sections.map((s, i) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="flex items-center gap-2.5 text-[13px] font-medium text-slate-700 dark:text-zinc-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors group"
                  >
                    <span className="w-5 h-5 rounded-md bg-white dark:bg-zinc-900 flex items-center justify-center text-[10px] font-bold text-orange-600 dark:text-orange-400 shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors border border-orange-200/60 dark:border-orange-900/40">
                      {i + 1}
                    </span>
                    {s.heading}
                  </a>
                ))}
              </div>
            </div>

            {matchingTool && (
              <ToolCta tool={matchingTool} onOpenTool={onOpenTool} />
            )}

            {post.quote && (
              <blockquote className="relative p-6 border-l-4 border-orange-500 bg-orange-50/30 dark:bg-orange-950/10 rounded-r-2xl">
                <p className="text-[15px] font-medium italic text-slate-700 dark:text-zinc-300 leading-relaxed">
                  "{post.quote}"
                </p>
                <footer className="text-[11px] text-slate-400 dark:text-zinc-500 mt-2 not-italic">
                  {post.author}, {post.authorRole}
                </footer>
              </blockquote>
            )}

            {/* Article Sections */}
            <div className="space-y-9">
              {post.sections.map((section) => (
                <div
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24 space-y-4"
                >
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100 tracking-tight">
                    {section.heading}
                  </h2>
                  {section.image && (
                    <SectionImage src={section.image} alt={section.heading} />
                  )}
                  <MarkdownText
                    content={section.content}
                    className="text-[14px] sm:text-[15px] text-slate-600 dark:text-zinc-300 leading-relaxed space-y-4"
                  />
                  {section.table && <ComparisonTable table={section.table} />}
                  {section.chart && <StatBarChart chart={section.chart} />}
                  {section.relatedToolId && (
                    <InlineToolChip
                      toolId={section.relatedToolId}
                      onOpenTool={onOpenTool}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* How To Steps if present */}
            {post.howTo && (
              <div className="p-6 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl space-y-4 border border-slate-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  {post.howTo.title}
                </h3>
                <div className="space-y-3">
                  {post.howTo.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <span className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 dark:text-zinc-200">
                          {step.name}
                        </p>
                        <p className="text-[12px] text-slate-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key takeaways */}
            <div className="p-6 bg-slate-50 dark:bg-zinc-900/60 rounded-2xl space-y-4 border border-slate-200 dark:border-zinc-800">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-500 flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Key takeaways
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {post.takeaways.map((takeaway, i) => (
                  <div
                    key={i}
                    className="p-4 bg-white dark:bg-zinc-950 rounded-xl space-y-1.5 border border-slate-100 dark:border-zinc-800/80"
                  >
                    <div className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="text-[12px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                      {takeaway}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Knowledge check quiz */}
            <div className="p-6 bg-orange-50/30 dark:bg-orange-950/15 rounded-2xl space-y-4 border border-orange-200/50 dark:border-orange-900/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                  Knowledge Check
                </h4>
              </div>
              <h3 className="text-[15px] sm:text-base font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                {post.quiz.question}
              </h3>
              <div className="space-y-2">
                {post.quiz.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => !quizSubmitted && setSelectedAnswer(idx)}
                    disabled={quizSubmitted}
                    className={`w-full p-3.5 text-[13px] font-medium rounded-xl text-left transition-all duration-200 flex items-center justify-between gap-2 cursor-pointer border ${
                      selectedAnswer === idx
                        ? "bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-800"
                        : "bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 border-slate-200/80 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <span className="leading-relaxed">{opt}</span>
                    {selectedAnswer === idx && (
                      <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswer === null}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-[12px] font-bold rounded-xl disabled:opacity-30 transition-transform active:scale-[0.98] cursor-pointer shadow-xs"
                >
                  Submit Answer
                </button>
              ) : (
                <div
                  className={`p-4 rounded-xl text-[13px] border ${
                    quizCorrect
                      ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                      : "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40"
                  }`}
                >
                  <p
                    className={`font-bold flex items-center gap-1.5 mb-1.5 ${
                      quizCorrect
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-500"
                    }`}
                  >
                    {quizCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" /> Not quite
                      </>
                    )}
                  </p>
                  <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {post.quiz.explanation}
                  </p>
                  {!quizCorrect && (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setSelectedAnswer(null);
                        setQuizCorrect(null);
                      }}
                      className="mt-3 px-3.5 py-1.5 bg-white dark:bg-zinc-950 text-rose-600 dark:text-rose-400 text-[11px] font-bold rounded-lg cursor-pointer border border-rose-200 dark:border-rose-900"
                    >
                      Try Again
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Article Dynamic Accordion FAQs (5-10 uniquely researched high-intent answers) */}
            <ArticleFaqAccordion faqs={post.faqs} />

            {matchingTool && (
              <ToolCta
                tool={matchingTool}
                onOpenTool={onOpenTool}
                variant="secondary"
              />
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-center">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                Toolora Sovereign Browser Suite
              </span>
              <button
                onClick={onBack}
                className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[12px] font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                ← Return to Guides
              </button>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1 space-y-4">
            <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/20 rounded-2xl space-y-3 border border-emerald-200/60 dark:border-emerald-900/30">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-[13px] font-bold text-emerald-800 dark:text-emerald-300">
                  Client-Side Guarantee
                </p>
              </div>
              <div className="space-y-2 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                {[
                  "Zero server file uploads",
                  "100% in-memory processing",
                  "GDPR & HIPAA compliant",
                  "No accounts or telemetry",
                  "Free with no watermarks",
                ].map((item) => (
                  <p key={item} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500" /> {item}
                  </p>
                ))}
              </div>
            </div>

            {post.relatedTools && post.relatedTools.length > 0 && (
              <div className="p-5 bg-white dark:bg-zinc-900/60 rounded-2xl space-y-3 border border-slate-200/80 dark:border-zinc-800">
                <Eyebrow variant="orange">Related Utilities</Eyebrow>
                {post.relatedTools.map((tid) => {
                  const t = TOOLS.find((x) => x.id === tid);
                  if (!t) return null;
                  return (
                    <button
                      key={tid}
                      onClick={() => onOpenTool(t.id)}
                      className="w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-slate-50 dark:bg-zinc-950 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors text-left cursor-pointer border border-slate-100 dark:border-zinc-800/60"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-zinc-900 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-zinc-800">
                        <LucideIcon
                          name={t.icon}
                          className="w-4 h-4 text-orange-600 dark:text-orange-400"
                        />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-700 dark:text-zinc-300 flex-1 text-left truncate">
                        {t.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            <MoreGuidesWidget
              currentId={post.id}
              onNavigate={onNavigateArticle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

const MoreGuidesWidget = memo(
  ({
    currentId,
    onNavigate,
  }: {
    currentId: string;
    onNavigate: (id: string) => void;
  }) => {
    const others = useMemo(
      () => ARTICLES.filter((a: BlogPost) => a.id !== currentId).slice(0, 5),
      [currentId],
    );

    return (
      <div className="p-5 bg-white dark:bg-zinc-900/60 rounded-2xl space-y-3 border border-slate-200/80 dark:border-zinc-800">
        <Eyebrow variant="orange">More Masterclasses</Eyebrow>
        {others.map((a) => (
          <button
            key={a.id}
            onClick={() => onNavigate(a.id)}
            className="w-full flex items-start gap-2.5 text-left group cursor-pointer"
          >
            <div
              className="w-12 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-800"
              style={{ aspectRatio: "6/5" }}
            >
              <img
                src={a.coverImage}
                alt={a.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <span className="text-[12px] font-medium text-slate-700 dark:text-zinc-300 leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
              {a.title}
            </span>
          </button>
        ))}
      </div>
    );
  },
);
MoreGuidesWidget.displayName = "MoreGuidesWidget";
