export type ToolCategory = 'pdf' | 'image' | 'document' | 'other';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  icon: string; // Dynamic icon identifier from Lucide
  popular: boolean;
  premium?: boolean; // Label for premium-like feeling
}

export interface DownloadHistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  fileName: string;
  fileSize: string; // e.g., "1.2 MB"
  timestamp: string; // ISO string
  blobUrl: string; // Client-side download link
}

export interface FeedbackItem {
  toolId: string;
  rating: number; // 1 to 5
  comment: string;
  email?: string;
  timestamp: string;
}

// ==========================================
// E-E-A-T, SEO & GEO ARCHITECTURE TYPES
// ==========================================

export interface AuthorProfile {
  id: string;
  name: string;
  role: string;
  credentials: string; // e.g. "M.Sc. Cybersecurity, CISSP, ISO/IEC 27001 Auditor"
  bio: string;
  avatar: string;
  verified: boolean;
  socials: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    email?: string;
    website?: string;
  };
  specialties: string[];
}

export interface SourceCitation {
  id: string;
  title: string;
  publisher: string;
  url: string;
  accessedDate: string;
  reliabilityScore: number; // e.g. 98%
  doiOrStandard?: string; // e.g. "RFC 7932", "ISO 32000-2"
}

export interface ChangelogEntry {
  version: string;
  date: string;
  editor: string;
  summary: string;
  type: 'major' | 'minor' | 'security' | 'fact-check';
}

export interface KeyFactItem {
  label: string;
  value: string;
  metric?: string;
  sourceNote?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  acceptedBy?: string;
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
  image?: string;
}

export interface GuideFrontmatter {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  metaDescription: string;
  focusKeyword: string;
  secondaryKeywords: string[];
  canonicalUrl: string;
  category: string;
  publishedDate: string;
  modifiedDate: string;
  readTime: string;
  authorId: string;
  reviewerId?: string;
  quickAnswer: {
    definition: string;
    summaryBullets: string[];
    confidenceScore: string;
  };
  keyFacts: KeyFactItem[];
  factTable: {
    caption: string;
    headers: string[];
    rows: string[][];
  };
  sources: SourceCitation[];
  changelog: ChangelogEntry[];
  faqs: FAQItem[];
  howToSteps: HowToStep[];
  heroImage: {
    src: string;
    alt: string;
    caption: string;
    aspectRatio?: string;
  };
  toolId?: string;
}

export interface BookmarkItem {
  id: string;
  title: string;
  category: string;
  savedAt: string;
  type: 'tool' | 'guide' | 'policy';
  url: string;
}

