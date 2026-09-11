/**
 * Automated Markdown Documentation & LLMS.txt Generator for Toolora.world
 * ─────────────────────────────────────────────────────────────────────────────
 * Automatically generates:
 * 1. Rich structured .md files with YAML frontmatter for all 28 interactive tools in /docs/tools/
 * 2. Complete .md files with full E-E-A-T metadata for all knowledge guides in /docs/guides/
 * 3. Complete .md files for all 58 published articles in /docs/blog/
 * 4. /public/llms.txt (Standardized AI/LLM index file following llmstxt.org specification)
 * 5. /public/llms-full.txt (Full comprehensive knowledge base for AI search engines)
 * 6. /public/robots.txt & Sitemaps (/public/sitemap-index.xml, /public/sitemap.xml)
 */

import fs from 'fs';
import path from 'path';
import { TOOLS, CATEGORIES } from '../src/data';
import { GUIDES } from '../src/data/guidesData';
import { AUTHORS } from '../src/data/authors';
import { FULL_ARTICLES } from '../src/components/blog/articlesIndex';
import {
  generateSEOPackage,
  generateSitemapXML,
  generateSitemapIndex,
  ROBOTS_TXT_TEMPLATE,
} from '../src/lib/universal-seo-aeo-geo';
import { generateDynamicLlmsTxt, generateDynamicLlmsFullTxt } from '../src/lib/dynamic-llms-generator';

const SITE_URL = 'https://toolora.world';
const SITE_NAME = 'Toolora';
const DOCS_DIR = path.join(process.cwd(), 'docs');
const TOOLS_DOCS_DIR = path.join(DOCS_DIR, 'tools');
const GUIDES_DOCS_DIR = path.join(DOCS_DIR, 'guides');
const BLOG_DOCS_DIR = path.join(DOCS_DIR, 'blog');
const PUBLIC_DIR = path.join(process.cwd(), 'public');

function ensureDirectories() {
  if (!fs.existsSync(DOCS_DIR)) fs.mkdirSync(DOCS_DIR, { recursive: true });
  if (!fs.existsSync(TOOLS_DOCS_DIR)) fs.mkdirSync(TOOLS_DOCS_DIR, { recursive: true });
  if (!fs.existsSync(GUIDES_DOCS_DIR)) fs.mkdirSync(GUIDES_DOCS_DIR, { recursive: true });
  if (!fs.existsSync(BLOG_DOCS_DIR)) fs.mkdirSync(BLOG_DOCS_DIR, { recursive: true });
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

export function generateAllMarkdownAndLLMs() {
  ensureDirectories();
  console.log('📝 Generating Universal SEO + AEO + GEO Markdown Documentation & LLMs.txt for Toolora.world...\n');

  // ── 1. GENERATE TOOL .MD FILES (Universal GEO Twin) ────────────────────────
  for (const tool of TOOLS) {
    const pkg = generateSEOPackage(
      {
        title: `${tool.name} - Free In-Browser Zero-Upload Tool`,
        description: tool.description,
        tags: [tool.category, 'client-side', 'zero-upload', 'privacy-first', 'webassembly', 'toolora'],
        category: tool.category,
        contentUrl: `${SITE_URL}/tools/${tool.id}`,
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
        schemaType: 'WebApplication',
        faqs: [
          {
            question: `Is ${tool.name} free to use?`,
            answer: `Yes, ${tool.name} is 100% free with unlimited local browser operations and no watermarks.`,
          },
          {
            question: `Does ${tool.name} upload my files to a server?`,
            answer: `No. ${tool.name} processes files entirely in your browser memory using WebAssembly. Zero bytes leave your device.`,
          },
          {
            question: `What formats are supported by ${tool.name}?`,
            answer: `It supports all standard modern formats relevant to ${tool.category} workflows.`,
          },
        ],
      },
      `tools/${tool.id}`
    );

    const fullToolMd = `---
id: "${tool.id}"
title: "${tool.name} - Free In-Browser Zero-Upload Tool"
slug: "${tool.id}"
category: "${tool.category}"
description: "${tool.description}"
tags:
  - "${tool.category}"
  - "client-side"
  - "zero-upload"
  - "privacy-first"
  - "webassembly"
  - "toolora"
popular: ${tool.popular ? 'true' : 'false'}
premium: ${tool.premium ? 'true' : 'false'}
canonicalUrl: "${SITE_URL}/?tool=${tool.id}"
directUrl: "${SITE_URL}/tools/${tool.id}"
markdownTwin: "${SITE_URL}/tools/${tool.id}.md"
computeLocation: "100% Client-Side WebAssembly / HTML5 Canvas"
dataTransmission: "0 Bytes sent to cloud servers"
compliance:
  - "GDPR Article 25 (Privacy by Design)"
  - "HIPAA Compliant (Zero PHI Inflow)"
  - "CCPA / CPRA"
  - "FERPA"
---

# ${tool.name}

> ${tool.description}

## Quick Answer (AEO)
${pkg.aeo.quickAnswer}

## Overview
The **${tool.name}** is an enterprise-grade, browser-compiled utility provided by [${SITE_NAME}](${SITE_URL}). It executes 100% inside your local device's memory using modern WebAssembly, Web Workers, and HTML5 Canvas Level 2 APIs. No files, documents, images, or metadata are ever transmitted to external cloud servers.

## Key Features
- **Zero Cloud Uploads**: Your files never leave your computer or smartphone.
- **Hardware Acceleration**: High-performance local computation with multi-threaded SIMD support.
- **Complete Confidentiality**: Volatile memory buffer is instantly wiped upon closing the tab.
- **Universal Compatibility**: Works seamlessly on Chrome, Safari, Firefox, Edge, iOS, and Android.
- **100% Free & Unlimited**: No paywalls, subscriptions, or watermarks.

## How to Use ${tool.name}
1. **Open Tool**: Navigate to [${SITE_URL}/?tool=${tool.id}](${SITE_URL}/?tool=${tool.id}) or [${SITE_URL}/tools/${tool.id}](${SITE_URL}/tools/${tool.id}).
2. **Select or Upload File**: Drag and drop your file into the sovereign sandbox panel.
3. **Configure Settings**: Adjust parameters, rotation, compression levels, crop matrices, or text formatting.
4. **Compile & Download**: Click the download action to save the processed file directly to your device storage.

## Frequently Asked Questions
${pkg.aeo.faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

## Privacy & Security Guarantees
All operations are executed within a client-side isolated sandbox. There are no backend API routes that process user files.

---
*Machine-Readable Documentation maintained for ${SITE_NAME} (${SITE_URL}).*
`;

    fs.writeFileSync(path.join(TOOLS_DOCS_DIR, `${tool.id}.md`), fullToolMd, 'utf-8');
  }
  console.log(`✅ Generated ${TOOLS.length} Tool Markdown files in /docs/tools/`);

  // ── 2. GENERATE GUIDE .MD FILES ────────────────────────────────────────────
  for (const guide of GUIDES) {
    const fm = guide.frontmatter;
    const author = AUTHORS[fm.authorId] || { name: 'Toolora Research Team', role: 'Security Architect' };
    const reviewer = fm.reviewerId ? AUTHORS[fm.reviewerId] : null;

    const mdContent = `---
id: "${fm.id}"
title: "${fm.title}"
slug: "${fm.slug}"
category: "${fm.category}"
excerpt: "${fm.excerpt}"
metaDescription: "${fm.metaDescription}"
focusKeyword: "${fm.focusKeyword}"
secondaryKeywords:
${fm.secondaryKeywords.map((k) => `  - "${k}"`).join('\n')}
publishedDate: "${fm.publishedDate}"
modifiedDate: "${fm.modifiedDate}"
readTime: "${fm.readTime}"
canonicalUrl: "${SITE_URL}/guides/${fm.slug}"
markdownTwin: "${SITE_URL}/guides/${fm.slug}.md"
author:
  id: "${fm.authorId}"
  name: "${author.name}"
  role: "${author.role}"
${reviewer ? `reviewer:\n  id: "${fm.reviewerId}"\n  name: "${reviewer.name}"\n  role: "${reviewer.role}"` : ''}
${fm.toolId ? `associatedToolId: "${fm.toolId}"` : ''}
---

# ${fm.title}

*Published on ${fm.publishedDate.split('T')[0]} | ${fm.readTime} | By ${author.name} (${author.role})*

## Executive Summary (Quick Answer)

**Definition:** ${fm.quickAnswer.definition}

**Key Takeaways:**
${fm.quickAnswer.summaryBullets.map((b) => `- ${b}`).join('\n')}

**Verification:** ${fm.quickAnswer.confidenceScore}

## Key Technical Specifications

| Specification | Value | Metric / Benchmark |
| :--- | :--- | :--- |
${fm.keyFacts.map((f) => `| **${f.label}** | ${f.value} | ${f.metric} |`).join('\n')}

## Comparative Benchmark

| ${fm.factTable.headers.join(' | ')} |
| ${fm.factTable.headers.map(() => ':---').join(' | ')} |
${fm.factTable.rows.map((row) => `| ${row.join(' | ')} |`).join('\n')}

${guide.content}

## Frequently Asked Questions

${fm.faqs.map((faq) => `### ${faq.question}\n\n${faq.answer}\n\n*Verified by: ${faq.acceptedBy}*\n`).join('\n')}

## Step-by-Step Implementation

${fm.howToSteps.map((step, idx) => `${idx + 1}. **${step.name}**: ${step.text}`).join('\n')}

## Peer-Reviewed Standards & Sources

${fm.sources.map((s) => `- [${s.title}](${s.url}) - Published by ${s.publisher} (${s.doiOrStandard || 'Standard'}), Reliability: ${s.reliabilityScore}%`).join('\n')}
`;

    fs.writeFileSync(path.join(GUIDES_DOCS_DIR, `${fm.slug}.md`), mdContent, 'utf-8');
  }
  console.log(`✅ Generated ${GUIDES.length} Knowledge Guide Markdown files in /docs/guides/`);

  // ── 3. GENERATE BLOG ARTICLE .MD FILES (All 58 Guides) ──────────────────────
  for (const article of FULL_ARTICLES) {
    const slug = article.slug || article.id;
    const pkg = generateSEOPackage(
      {
        title: article.title,
        description: article.metaDesc || article.excerpt,
        tags: [article.tag, article.focusKeyword, 'client-side', 'toolora', 'guide'],
        category: article.tag,
        contentUrl: `${SITE_URL}/blog/${slug}`,
        siteUrl: SITE_URL,
        siteName: SITE_NAME,
        schemaType: 'TechArticle',
        faqs: article.faqs?.map((f) => ({ question: f.q, answer: f.a })),
      },
      `blog/${slug}`
    );

    const blogMd = `---
id: "${article.id}"
title: "${article.title}"
slug: "${slug}"
category: "${article.tag}"
readTime: "${article.readTime}"
publishedDate: "${article.date}"
author: "${article.author}"
focusKeyword: "${article.focusKeyword}"
canonicalUrl: "${SITE_URL}/blog/${slug}"
markdownTwin: "${SITE_URL}/blog/${slug}.md"
${article.toolId ? `toolId: "${article.toolId}"` : ''}
---

# ${article.title}

*Published on ${article.date} | ${article.readTime} | Author: ${article.author}*

## Summary
${article.excerpt}

${article.sections
  .map(
    (sec) => `## ${sec.heading}

${sec.content}
`
  )
  .join('\n')}

## Frequently Asked Questions
${pkg.aeo.faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}

---
*Direct link: [${SITE_URL}/blog/${slug}](${SITE_URL}/blog/${slug})*
`;

    fs.writeFileSync(path.join(BLOG_DOCS_DIR, `${slug}.md`), blogMd, 'utf-8');
  }
  console.log(`✅ Generated ${FULL_ARTICLES.length} Blog Article Markdown files in /docs/blog/`);

  // ── 4. GENERATE /public/robots.txt (AI Crawlers Explicitly Allowed) ─────────
  const robotsTxtContent = ROBOTS_TXT_TEMPLATE(SITE_URL);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxtContent, 'utf-8');
  console.log('✅ Generated /public/robots.txt (AI & Standard Crawlers Permitted)');

  // ── 5. GENERATE SITEMAPS & SITEMAP INDEX ────────────────────────────────────
  const today = new Date().toISOString().split('T')[0];

  // Tool Sitemap
  const toolSitemapEntries = TOOLS.flatMap((t) => [
    { url: `${SITE_URL}/?tool=${t.id}`, lastmod: today },
    { url: `${SITE_URL}/tools/${t.id}`, lastmod: today },
    { url: `${SITE_URL}/tools/${t.id}.md`, lastmod: today },
  ]);
  const toolSitemapXml = generateSitemapXML(toolSitemapEntries);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tools.xml'), toolSitemapXml, 'utf-8');

  // Guides Sitemap
  const guidesSitemapEntries = GUIDES.flatMap((g) => {
    const modDate = g.frontmatter.modifiedDate?.split('T')[0] || today;
    return [
      { url: `${SITE_URL}/guides/${g.frontmatter.slug}`, lastmod: modDate },
      { url: `${SITE_URL}/guides/${g.frontmatter.slug}.md`, lastmod: modDate },
    ];
  });
  const guidesSitemapXml = generateSitemapXML(guidesSitemapEntries);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-guides.xml'), guidesSitemapXml, 'utf-8');

  // Blog Articles Sitemap
  const blogSitemapEntries = FULL_ARTICLES.flatMap((a) => {
    const slug = a.slug || a.id;
    return [
      { url: `${SITE_URL}/blog/${slug}`, lastmod: today },
      { url: `${SITE_URL}/blog/${slug}.md`, lastmod: today },
    ];
  });
  const blogSitemapXml = generateSitemapXML(blogSitemapEntries);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-blog.xml'), blogSitemapXml, 'utf-8');

  // Main Root Combined Sitemap
  const staticCoreRoutes = [
    { url: `${SITE_URL}/`, lastmod: today },
    { url: `${SITE_URL}/about`, lastmod: today },
    { url: `${SITE_URL}/contact`, lastmod: today },
    { url: `${SITE_URL}/privacy`, lastmod: today },
    { url: `${SITE_URL}/terms`, lastmod: today },
    { url: `${SITE_URL}/blog`, lastmod: today },
    { url: `${SITE_URL}/guides`, lastmod: today },
  ];

  const rootSitemapEntries = [
    ...staticCoreRoutes,
    ...toolSitemapEntries,
    ...guidesSitemapEntries,
    ...blogSitemapEntries,
  ];
  const rootSitemapXml = generateSitemapXML(rootSitemapEntries);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), rootSitemapXml, 'utf-8');

  // Sitemap Index
  const sitemapIndexXml = generateSitemapIndex([
    `${SITE_URL}/sitemap.xml`,
    `${SITE_URL}/sitemap-tools.xml`,
    `${SITE_URL}/sitemap-guides.xml`,
    `${SITE_URL}/sitemap-blog.xml`,
  ]);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-index.xml'), sitemapIndexXml, 'utf-8');
  console.log('✅ Generated Sitemaps: /public/sitemap.xml, /public/sitemap-index.xml, & segmented maps');

  // ── 6. GENERATE /public/llms.txt (Standardized LLM Index) ───────────────────
  const llmsTxtContent = generateDynamicLlmsTxt({
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxtContent, 'utf-8');
  console.log('✅ Generated /public/llms.txt (Standardized Dynamic LLM Index)');

  // ── 7. GENERATE /public/llms-full.txt ──────────────────────────────────────
  const llmsFullContent = generateDynamicLlmsFullTxt({
    siteName: SITE_NAME,
    siteUrl: SITE_URL,
  });
  fs.writeFileSync(path.join(PUBLIC_DIR, 'llms-full.txt'), llmsFullContent, 'utf-8');
  console.log('✅ Generated /public/llms-full.txt (Full Technical Knowledge Base)');
}

// Run immediately if invoked directly
if (process.argv[1]?.endsWith('generate-markdown-and-llms.ts') || process.env.RUN_DOCS_GEN) {
  generateAllMarkdownAndLLMs();
}
