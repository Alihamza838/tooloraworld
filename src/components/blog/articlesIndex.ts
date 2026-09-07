// blog/articlesIndex.ts
// ─────────────────────────────────────────────────────────────────────────────
// Central registry of published in-depth tool & workflow articles.
// Each article exports a complete `BlogPost` data object compliant with
// ArticleShell.tsx, schema.org JSON-LD, and E-E-A-T guidelines.
// ─────────────────────────────────────────────────────────────────────────────

import type { BlogPost } from "./types";

// PDF Tools - Article Set 1 & 2
import PdfEditorGuide from "./articles/PdfEditorGuide";
import PdfEditorAnnotateGuide from "./articles/PdfEditorAnnotateGuide";
import CompressPdfGuide from "./articles/CompressPdfGuide";
import CompressPdfEmailGuide from "./articles/CompressPdfEmailGuide";
import MergePdfGuide from "./articles/MergePdfGuide";
import MergePdfBinderGuide from "./articles/MergePdfBinderGuide";
import SplitPdfGuide from "./articles/SplitPdfGuide";
import SplitPdfBatchGuide from "./articles/SplitPdfBatchGuide";
import PdfToImageGuide from "./articles/PdfToImageGuide";
import PdfToImageHighResGuide from "./articles/PdfToImageHighResGuide";
import ImageToPdfGuide from "./articles/ImageToPdfGuide";
import ImageToPdfScanGuide from "./articles/ImageToPdfScanGuide";
import PdfLockGuide from "./articles/PdfLockGuide";
import PdfSecurityGuide from "./articles/PdfSecurityGuide";
import PdfRotateGuide from "./articles/PdfRotateGuide";
import PdfRotateBatchGuide from "./articles/PdfRotateBatchGuide";
import PdfWatermarkGuide from "./articles/PdfWatermarkGuide";
import PdfWatermarkConfidentialGuide from "./articles/PdfWatermarkConfidentialGuide";
import PdfToTextGuide from "./articles/PdfToTextGuide";
import PdfToTextDataExtractionGuide from "./articles/PdfToTextDataExtractionGuide";

// Image Tools - Article Set 1 & 2
import ImageCompressorGuide from "./articles/ImageCompressorGuide";
import ImageCompressorWebOptimizationGuide from "./articles/ImageCompressorWebOptimizationGuide";
import ImageResizerGuide from "./articles/ImageResizerGuide";
import ImageResizerSocialMediaGuide from "./articles/ImageResizerSocialMediaGuide";
import ImageConverterGuide from "./articles/ImageConverterGuide";
import ImageConverterModernFormatsGuide from "./articles/ImageConverterModernFormatsGuide";
import OcrToolGuide from "./articles/OcrToolGuide";
import OcrReceiptScanGuide from "./articles/OcrReceiptScanGuide";
import ImageEditorGuide from "./articles/ImageEditorGuide";
import ImageEditorPhotoEnhanceGuide from "./articles/ImageEditorPhotoEnhanceGuide";
import PassportPhotoGuide from "./articles/PassportPhotoGuide";
import PassportPhotoComplianceGuide from "./articles/PassportPhotoComplianceGuide";
import BgRemoverGuide from "./articles/BgRemoverGuide";
import BgRemoverEcommerceGuide from "./articles/BgRemoverEcommerceGuide";

// Document & Generator Tools - Article Set 1 & 2
import InvoiceGuide from "./articles/InvoiceGuide";
import InvoiceFreelanceGuide from "./articles/InvoiceFreelanceGuide";
import MockupGeneratorGuide from "./articles/MockupGeneratorGuide";
import MockupApparelBrandingGuide from "./articles/MockupApparelBrandingGuide";
import ResumeGuide from "./articles/ResumeGuide";
import ResumeCvCoverLetterGuide from "./articles/ResumeCvCoverLetterGuide";
import QrGeneratorGuide from "./articles/QrGeneratorGuide";
import QrMarketingGuide from "./articles/QrMarketingGuide";
import SignatureGuide from "./articles/SignatureGuide";
import SignatureLegalGuide from "./articles/SignatureLegalGuide";
import BusinessCardGuide from "./articles/BusinessCardGuide";
import BusinessCardDesignTrendsGuide from "./articles/BusinessCardDesignTrendsGuide";
import CertificateGuide from "./articles/CertificateGuide";
import CertificateAwardTemplatesGuide from "./articles/CertificateAwardTemplatesGuide";
import BillFormGuide from "./articles/BillFormGuide";
import BillFormMedicalRepairGuide from "./articles/BillFormMedicalRepairGuide";

// Converters & Utilities - Article Set 1 & 2
import UnitConverterGuide from "./articles/UnitConverterGuide";
import UnitConverterMetricImperialGuide from "./articles/UnitConverterMetricImperialGuide";
import CurrencyConverterGuide from "./articles/CurrencyConverterGuide";
import CurrencyConverterTravelFinanceGuide from "./articles/CurrencyConverterTravelFinanceGuide";
import TextToolsGuide from "./articles/TextToolsGuide";
import TextToolsCaseFormatterGuide from "./articles/TextToolsCaseFormatterGuide";
import WebpConverterGuide from "./articles/WebpConverterGuide";
import WordToPdfGuide from "./articles/WordToPdfGuide";

export interface ArticlePreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  tag: string;
  readTime: string;
  date: string;
  author: string;
  focusKeyword: string;
  metaDesc: string;
  toolId?: string;
  coverImage?: string;
}

export const FULL_ARTICLES: BlogPost[] = [
  PdfEditorGuide,
  PdfEditorAnnotateGuide,
  CompressPdfGuide,
  CompressPdfEmailGuide,
  MergePdfGuide,
  MergePdfBinderGuide,
  SplitPdfGuide,
  SplitPdfBatchGuide,
  PdfToImageGuide,
  PdfToImageHighResGuide,
  ImageToPdfGuide,
  ImageToPdfScanGuide,
  PdfLockGuide,
  PdfSecurityGuide,
  PdfRotateGuide,
  PdfRotateBatchGuide,
  PdfWatermarkGuide,
  PdfWatermarkConfidentialGuide,
  PdfToTextGuide,
  PdfToTextDataExtractionGuide,

  ImageCompressorGuide,
  ImageCompressorWebOptimizationGuide,
  ImageResizerGuide,
  ImageResizerSocialMediaGuide,
  ImageConverterGuide,
  ImageConverterModernFormatsGuide,
  OcrToolGuide,
  OcrReceiptScanGuide,
  ImageEditorGuide,
  ImageEditorPhotoEnhanceGuide,
  PassportPhotoGuide,
  PassportPhotoComplianceGuide,
  BgRemoverGuide,
  BgRemoverEcommerceGuide,

  InvoiceGuide,
  InvoiceFreelanceGuide,
  MockupGeneratorGuide,
  MockupApparelBrandingGuide,
  ResumeGuide,
  ResumeCvCoverLetterGuide,
  QrGeneratorGuide,
  QrMarketingGuide,
  SignatureGuide,
  SignatureLegalGuide,
  BusinessCardGuide,
  BusinessCardDesignTrendsGuide,
  CertificateGuide,
  CertificateAwardTemplatesGuide,
  BillFormGuide,
  BillFormMedicalRepairGuide,

  UnitConverterGuide,
  UnitConverterMetricImperialGuide,
  CurrencyConverterGuide,
  CurrencyConverterTravelFinanceGuide,
  TextToolsGuide,
  TextToolsCaseFormatterGuide,
  WebpConverterGuide,
  WordToPdfGuide
];

// Compatibility export for components expecting ARTICLES
export const ARTICLES: ArticlePreview[] = FULL_ARTICLES.map((a) => ({
  id: a.id,
  title: a.title,
  slug: a.slug,
  excerpt: a.excerpt,
  tag: a.tag,
  readTime: a.readTime,
  date: a.date,
  author: a.author,
  focusKeyword: a.focusKeyword,
  metaDesc: a.metaDesc,
  toolId: a.toolId,
  coverImage: a.coverImage,
}));

export const ARTICLES_BY_ID: Record<string, BlogPost> = FULL_ARTICLES.reduce(
  (acc, article) => {
    acc[article.id] = article;
    if (article.slug) acc[article.slug] = article;
    return acc;
  },
  {} as Record<string, BlogPost>
);

export const ARTICLES_BY_TOOL: Record<string, BlogPost[]> = FULL_ARTICLES.reduce(
  (acc, article) => {
    if (article.toolId) {
      if (!acc[article.toolId]) acc[article.toolId] = [];
      if (!acc[article.toolId].some((a) => a.id === article.id)) {
        acc[article.toolId].push(article);
      }
    }
    if (article.relatedTools) {
      article.relatedTools.forEach((toolId) => {
        if (!acc[toolId]) acc[toolId] = [];
        if (!acc[toolId].some((a) => a.id === article.id)) {
          acc[toolId].push(article);
        }
      });
    }
    return acc;
  },
  {} as Record<string, BlogPost[]>
);

/**
 * Returns exactly `limit` (default 2) top matching long-form articles for a given tool.
 * Prioritizes direct toolId assignment, then relatedTools references, then category matches.
 */
export function getArticlesForTool(toolId: string, limit = 2): BlogPost[] {
  if (!toolId) return FULL_ARTICLES.slice(0, limit);

  // 1. Direct toolId matches
  const directMatches = FULL_ARTICLES.filter((a) => a.toolId === toolId);
  if (directMatches.length >= limit) {
    return directMatches.slice(0, limit);
  }

  // 2. Articles referencing this tool in relatedTools
  const relatedMatches = FULL_ARTICLES.filter(
    (a) => a.toolId !== toolId && a.relatedTools?.includes(toolId)
  );

  const combined = [...directMatches, ...relatedMatches];
  if (combined.length >= limit) {
    return combined.slice(0, limit);
  }

  // 3. Fallback general articles
  const otherArticles = FULL_ARTICLES.filter(
    (a) => !combined.some((c) => c.id === a.id)
  );

  return [...combined, ...otherArticles].slice(0, limit);
}

export default FULL_ARTICLES;
