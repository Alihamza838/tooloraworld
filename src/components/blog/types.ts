// blog/types.ts
// ─────────────────────────────────────────────────────────────────────────────
// Shared type contracts for the entire blog system.
// Supports rich interactive elements: FAQs, Comparison Tables, Bar Charts,
// Quizzes, HowTo schemas, and dynamic internal tool linking.
// ─────────────────────────────────────────────────────────────────────────────

export interface ArticleFAQ {
  q: string;
  a: string;
}

/** Structured comparison table - rendered as a real styled <table>, never as raw markdown pipes. */
export interface ComparisonTableData {
  headers: string[];
  rows: string[][];
  /** Zero-based column index to visually highlight (usually the "Toolora" column). */
  highlightColIndex?: number;
  caption?: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

/** Structured stat-chart - rendered as a real horizontal bar chart component. */
export interface ChartData {
  title: string;
  unit?: string;
  data: ChartDataPoint[];
  caption?: string;
}

export interface ArticleSection {
  id: string;
  heading: string;
  content: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  /** Optional structured comparison table shown after this section's text. */
  table?: ComparisonTableData;
  /** Optional structured chart shown after this section's text. */
  chart?: ChartData;
  /** Optional real tool-id - renders a small functional "Try {tool}" chip wired to onOpenTool(). */
  relatedToolId?: string;
}

export interface ArticleQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  sections: ArticleSection[];
  date: string;
  readTime: string;
  tag: string;
  author: string;
  authorRole: string;
  authorCredentials: string;
  quote?: string;
  takeaways: string[];
  focusKeyword: string;
  metaDesc: string;
  toolId?: string;
  relatedTools?: string[];
  coverImage: string;
  coverImageAlt?: string;
  quiz: ArticleQuiz;
  faqs: ArticleFAQ[];
  /**
   * Optional structured "how to" steps. Injects Schema.org HowTo JSON-LD block
   * alongside FAQPage + BlogPosting for rich snippets and AI search citations.
   */
  howTo?: {
    title: string;
    totalTimeMinutes?: number;
    steps: HowToStep[];
  };
}

export interface ArticleComponentProps {
  onBack: () => void;
  onOpenTool: (toolId: string) => void;
  onNavigateArticle?: (articleId: string) => void;
}
