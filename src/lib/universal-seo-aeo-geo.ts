/**
 * UNIVERSAL SEO + AEO + GEO AUTOMATION MODULE
 * ---------------------------------------------
 * Framework-agnostic. Works with any database (MongoDB, Postgres, etc.)
 * and any frontend (Next.js, plain Node/Express, React SPA, etc.)
 *
 * Drop this into any content/image/product upload pipeline.
 * Call generateSEOPackage(item, slug) once per item at publish time.
 * It returns everything you need - you just save the result to your DB
 * and serve two routes (HTML + .md) from it.
 */

export interface SEOItemInput {
  title: string;
  description: string;
  tags?: string[];
  category?: string;
  contentUrl?: string;
  license?: string;
  siteUrl: string;
  siteName?: string;
  schemaType?: string;
  faqs?: Array<{ question: string; answer: string }>;
  extraData?: Record<string, any>;
}

export interface SEOPackageResult {
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl: string;
    slug: string;
  };
  jsonLd: Record<string, any>;
  aeo: {
    quickAnswer: string;
    faq: Array<{ q: string; a: string }>;
  };
  markdown: string;
  pageUrl: string;
}

export interface SitemapEntry {
  url: string;
  lastmod: string;
}

export interface IndexNowParams {
  host: string;
  key: string;
  urls: string[];
}

export interface LlmsTxtParams {
  siteName: string;
  siteUrl: string;
  description: string;
  sections?: Array<{ title: string; items: Array<{ title: string; url: string; description?: string }> }>;
}

// ---------- 1. SLUG GENERATION ----------
export function generateSlug(title: string): string {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

// checkExists(slug) => Promise<boolean> | boolean - tied to your DB or in-memory map
export async function generateUniqueSlug(
  title: string,
  checkExists: (slug: string) => Promise<boolean> | boolean
): Promise<string> {
  const base = generateSlug(title);
  let slug = base;
  let counter = 2;
  while (await checkExists(slug)) {
    slug = `${base}-${counter}`;
    counter++;
  }
  return slug;
}

// ---------- 2. CORE SEO + AEO + GEO PACKAGE GENERATOR ----------
/**
 * @param item - { title, description, tags[], category, contentUrl, license, siteUrl, siteName, schemaType }
 * @param slug - unique page slug
 * @returns full SEO/AEO/GEO package to store alongside the item
 */
export function generateSEOPackage(item: SEOItemInput, slug?: string): SEOPackageResult {
  const finalSlug = slug || generateSlug(item.title);
  const cleanSiteUrl = item.siteUrl.replace(/\/+$/, '');
  const pageUrl = `${cleanSiteUrl}/${finalSlug}`;

  const seo = {
    metaTitle: truncate(`${item.title} | ${item.siteName || 'Free Download & Tool'}`, 60),
    metaDescription: truncate(item.description, 160),
    canonicalUrl: pageUrl,
    slug: finalSlug,
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': item.schemaType || 'WebApplication',
    name: item.title,
    description: item.description,
    url: pageUrl,
    ...(item.contentUrl ? { contentUrl: item.contentUrl } : {}),
    keywords: (item.tags || []).join(', '),
    license: item.license || 'https://creativecommons.org/licenses/by/4.0/',
    publisher: {
      '@type': 'Organization',
      name: item.siteName || 'Toolora',
      url: cleanSiteUrl,
    },
  };

  // AEO: direct-answer + mini FAQ block, templated (no AI call needed)
  const defaultFaqs = [
    {
      q: `Is "${item.title}" free to use?`,
      a: `Yes, this ${item.category || 'tool/item'} is 100% free to use with zero cost and no subscription.`,
    },
    {
      q: `What category does this belong to?`,
      a: `This item is listed under ${item.category || 'general'}.`,
    },
    {
      q: `Are my files or data uploaded to a server?`,
      a: `No. All operations run 100% client-side in your local browser memory for complete privacy.`,
    },
  ];

  const customFaqs = item.faqs
    ? item.faqs.map((f) => ({ q: f.question, a: f.answer }))
    : [];

  const aeo = {
    quickAnswer: `${item.title} - ${item.description}`,
    faq: customFaqs.length > 0 ? customFaqs : defaultFaqs,
  };

  // GEO: markdown text stored as a DB field, NOT a physical file (can be served dynamically as a .md twin)
  const tagsList = (item.tags || []).join(', ');
  const markdown = `---
title: "${item.title}"
slug: "${finalSlug}"
tags: [${tagsList}]
category: "${item.category || ''}"
license: "${item.license || 'Free / Open Web'}"
canonical: "${pageUrl}"
---

# ${item.title}

${item.description}

**Tags:** ${tagsList || 'utilities'}
**Category:** ${item.category || 'General'}
**Direct link:** ${item.contentUrl || pageUrl}

## Machine-Readable Direct Answer (AEO)
${aeo.quickAnswer}

## Frequently Asked Questions
${aeo.faq.map((f) => `### ${f.q}\n${f.a}`).join('\n\n')}
`;

  return { seo, jsonLd, aeo, markdown, pageUrl };
}

export function truncate(str: string, max: number): string {
  if (!str) return '';
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

// ---------- 3. INDEXNOW PING (instant search engine notification) ----------
export async function notifyIndexNow({ host, key, urls }: IndexNowParams): Promise<boolean> {
  if (!host || !key || !urls || urls.length === 0) {
    console.warn('IndexNow ping skipped: missing host, key, or URLs');
    return false;
  }
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ host, key, urlList: urls }),
    });
    return res.ok;
  } catch (err: any) {
    console.error('IndexNow ping failed:', err?.message || err);
    return false;
  }
}

// ---------- 4. SITEMAP CHUNK GENERATOR (call with any array of {url, lastmod}) ----------
export function generateSitemapXML(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
  </url>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

// Split into 50,000-URL chunks (Google's per-sitemap limit) + build an index file
export function generateSitemapIndex(sitemapUrls: string[]): string {
  const sitemaps = sitemapUrls
    .map((url) => `  <sitemap><loc>${url}</loc></sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

// ---------- 5. robots.txt TEMPLATE (AI crawlers explicitly allowed = GEO requirement) ----------
export const ROBOTS_TXT_TEMPLATE = (siteUrl: string): string => {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  return `
User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${cleanSiteUrl}/sitemap-index.xml
Sitemap: ${cleanSiteUrl}/sitemap.xml
`.trim();
};

// ---------- 6. llms.txt TEMPLATE (site-wide map for AI agents - GEO requirement) ----------
export const LLMS_TXT_TEMPLATE = ({ siteName, siteUrl, description, sections }: LlmsTxtParams): string => {
  const cleanSiteUrl = siteUrl.replace(/\/+$/, '');
  let content = `
# ${siteName}

> ${description}

## Key sections
- Sitemap Index: ${cleanSiteUrl}/sitemap-index.xml
- Sitemap: ${cleanSiteUrl}/sitemap.xml
- Markdown version of any page: append ".md" to any page URL (e.g. ${cleanSiteUrl}/tools/[tool-id].md or ${cleanSiteUrl}/blog/[article-slug].md)
`.trim();

  if (sections && sections.length > 0) {
    for (const section of sections) {
      content += `\n\n## ${section.title}\n`;
      for (const item of section.items) {
        content += `- [${item.title}](${item.url})${item.description ? `: ${item.description}` : ''}\n`;
      }
    }
  }

  return content.trim();
};
