import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GUIDES } from './src/data/guidesData';
import { TOOLS, CATEGORIES } from './src/data';
import { FULL_ARTICLES, ARTICLES_BY_ID } from './src/components/blog/articlesIndex';
import { generateAllMarkdownAndLLMs } from './scripts/generate-markdown-and-llms';
import { generateDynamicLlmsTxt, generateDynamicLlmsFullTxt } from './src/lib/dynamic-llms-generator';
import {
  generateSEOPackage,
  generateUniqueSlug,
  notifyIndexNow,
  generateSitemapXML,
  generateSitemapIndex,
  ROBOTS_TXT_TEMPLATE,
  LLMS_TXT_TEMPLATE,
} from './src/lib/universal-seo-aeo-geo';
import {
  getSqliteDb,
  getAllCatalogItems,
  getCatalogItemBySlug,
  checkSlugExists,
  getCatalogCount,
  saveSqliteDb,
  insertOrUpdateCatalogItem,
} from './src/lib/sqlite-db';
import {
  executeAutomationPipeline,
  executeBatchCsvPipeline,
  UploadItemPayload,
} from './src/lib/automation-worker';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const SITE_URL = process.env.APP_URL || 'https://toolora.world';

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Initialize SQLite Database & initial seeds
  try {
    await getSqliteDb();
    const count = await getCatalogCount();
    if (count === 0) {
      console.log('🌱 Seeding initial catalog items in SQLite database...');
      // Seed some starter high-value items across image/brand categories
      const initialSeeds: UploadItemPayload[] = [
        {
          title: '3D Isometric Glassmorphism UI Icon Pack',
          description: 'High-resolution 3D translucent vector glass icons rendered with raytraced specular highlights and alpha transparency.',
          category: 'Graphics & Assets',
          tags: ['3d-icons', 'glassmorphism', 'ui-design', 'vector', 'transparent'],
          contentUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=85&auto=format&fit=crop',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          title: 'Minimalist Monoline Brand Identity Kit',
          description: 'Enterprise branding mockups, stationery vectors, vector glyphs, and high-contrast typography pairing guidelines.',
          category: 'Branding & Identity',
          tags: ['branding', 'identity', 'mockups', 'stationery', 'monoline'],
          contentUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1600&q=85&auto=format&fit=crop',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          title: 'Cyberpunk Neon Gradient Textures 8K',
          description: 'Ultrawide 8K abstract dark luminescent gradients optimized for hero banners and backdrop blending.',
          category: 'Backgrounds & Textures',
          tags: ['textures', 'gradients', 'neon', '8k-backgrounds', 'luminescent'],
          contentUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=85&auto=format&fit=crop',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        },
        {
          title: 'E-Commerce Clean Product Mockup Studio',
          description: 'Zero-artifact clean shadow studio stage mockups with customizable angles for modern digital storefronts.',
          category: 'Product Mockups',
          tags: ['mockups', 'ecommerce', 'product-photo', 'studio-stage'],
          contentUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1600&q=85&auto=format&fit=crop',
          license: 'https://creativecommons.org/licenses/by/4.0/',
        }
      ];

      for (const seed of initialSeeds) {
        await executeAutomationPipeline({ ...seed, siteUrl: SITE_URL, siteName: 'Toolora' });
      }
      console.log(`✅ Seeded ${initialSeeds.length} initial items in SQLite.`);
    }
  } catch (err) {
    console.error('SQLite initialization error:', err);
  }

  // Automatically ensure Markdown documentation and LLMS.txt are up to date on boot
  try {
    generateAllMarkdownAndLLMs();
  } catch (err) {
    console.warn('Docs generator init warning:', err);
  }

  // ── 1. Health API Route ───────────────────────────────────────────────────
  app.get('/api/health', async (req, res) => {
    const catalogCount = await getCatalogCount();
    res.json({
      status: 'ok',
      service: 'Toolora World Enterprise Engine',
      domain: 'toolora.world',
      version: '3.3.0',
      database: 'SQLite (sql.js persistent engine)',
      itemsInDb: catalogCount,
      timestamp: new Date().toISOString(),
      architecture: 'Zero-Upload Client Core + SQLite Automation Worker Pipeline',
    });
  });

  // ── 2. Automation Worker & Catalog Endpoints ──────────────────────────────

  // A. Execute complete 10-Step Pipeline for Single Upload
  app.post('/api/catalog/upload', async (req, res) => {
    try {
      const payload: UploadItemPayload = req.body;
      if (!payload || !payload.title || !payload.description) {
        return res.status(400).json({ error: 'Title and description are required for automated pipeline' });
      }

      const result = await executeAutomationPipeline({
        ...payload,
        siteUrl: payload.siteUrl || SITE_URL,
        siteName: payload.siteName || 'Toolora',
      });

      res.json({
        success: true,
        message: 'Successfully executed 10-step automation pipeline & stored in SQLite',
        result,
      });
    } catch (err: any) {
      console.error('Automation pipeline execution error:', err);
      res.status(500).json({ error: err?.message || 'Automation pipeline failed' });
    }
  });

  // B. Batch CSV Upload / Processing
  app.post('/api/catalog/upload-csv', async (req, res) => {
    try {
      const { items } = req.body;
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Array of items is required' });
      }

      const results = await executeBatchCsvPipeline(
        items.map((it) => ({
          ...it,
          siteUrl: it.siteUrl || SITE_URL,
          siteName: it.siteName || 'Toolora',
        }))
      );

      res.json({
        success: true,
        totalSubmitted: items.length,
        totalProcessed: results.length,
        results,
      });
    } catch (err: any) {
      console.error('Batch CSV execution error:', err);
      res.status(500).json({ error: err?.message || 'Batch CSV automation failed' });
    }
  });

  // C. Query SQLite Catalog
  app.get('/api/catalog', async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 50;
      const offset = Number(req.query.offset) || 0;
      const items = await getAllCatalogItems(limit, offset);
      const total = await getCatalogCount();
      res.json({ success: true, total, count: items.length, items });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to query SQLite catalog' });
    }
  });

  // D. Query Single Catalog Item by Slug
  app.get('/api/catalog/:slug', async (req, res) => {
    try {
      const item = await getCatalogItemBySlug(req.params.slug);
      if (!item) {
        return res.status(404).json({ error: 'Item not found in SQLite database' });
      }
      res.json({ success: true, item });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to query catalog item' });
    }
  });

  // ── 3. Universal SEO + AEO + GEO Helper Endpoints ─────────────────────────
  app.post('/api/seo/package', (req, res) => {
    try {
      const { item, slug } = req.body;
      if (!item || !item.title || !item.description) {
        return res.status(400).json({ error: 'Missing required item fields: title and description' });
      }
      const pkg = generateSEOPackage(
        {
          ...item,
          siteUrl: item.siteUrl || SITE_URL,
          siteName: item.siteName || 'Toolora',
        },
        slug
      );
      res.json({ success: true, package: pkg });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to generate SEO package' });
    }
  });

  app.post('/api/seo/slug', async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required' });
      }
      const slug = await generateUniqueSlug(title, async (s) => {
        const inDb = await checkSlugExists(s);
        const inTools = TOOLS.some((t) => t.id === s);
        return inDb || inTools;
      });
      res.json({ success: true, slug });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'Failed to generate slug' });
    }
  });

  app.post('/api/seo/indexnow', async (req, res) => {
    try {
      const { urls, key, host } = req.body;
      if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: 'Array of URLs is required' });
      }
      const targetHost = host || new URL(SITE_URL).hostname;
      const indexNowKey = key || process.env.INDEXNOW_KEY || 'toolora-indexnow-key';

      const success = await notifyIndexNow({
        host: targetHost,
        key: indexNowKey,
        urls,
      });

      res.json({ success, host: targetHost, urlsNotified: urls.length });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || 'IndexNow ping failed' });
    }
  });

  // ── 4. Standardized LLMS.txt Routes (GEO standard) ────────────────────────
  app.get('/llms.txt', async (req, res) => {
    try {
      const items = await getAllCatalogItems();
      const content = generateDynamicLlmsTxt({
        siteName: 'Toolora',
        siteUrl: SITE_URL,
        catalogItems: items.map((i) => ({
          title: i.title,
          slug: i.slug,
          description: i.description,
          category: i.category,
        })),
      });
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      return res.send(content);
    } catch {
      const publicPath = path.join(process.cwd(), 'public', 'llms.txt');
      if (fs.existsSync(publicPath)) {
        res.header('Content-Type', 'text/markdown; charset=utf-8');
        return res.sendFile(publicPath);
      }
      const content = generateDynamicLlmsTxt({ siteName: 'Toolora', siteUrl: SITE_URL });
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      res.send(content);
    }
  });

  app.get('/llms-full.txt', async (req, res) => {
    try {
      const content = generateDynamicLlmsFullTxt({
        siteName: 'Toolora',
        siteUrl: SITE_URL,
      });
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      res.header('Cache-Control', 'public, max-age=3600');
      return res.send(content);
    } catch {
      const publicPath = path.join(process.cwd(), 'public', 'llms-full.txt');
      if (fs.existsSync(publicPath)) {
        res.header('Content-Type', 'text/markdown; charset=utf-8');
        return res.sendFile(publicPath);
      }
      res.redirect('/llms.txt');
    }
  });

  // ── 5. Dynamic Markdown Twin Serving (.md Routes for AI Agents & GEO) ────
  // Catalog Items Markdown Twin: /item/:slug.md or /catalog/:slug.md
  app.get(['/item/:slug.md', '/catalog/:slug.md'], async (req, res) => {
    const slug = req.params.slug;
    const item = await getCatalogItemBySlug(slug);
    if (item && item.markdown) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.send(item.markdown);
    }
    res.status(404).send('# 404 - Catalog Item Markdown Not Found');
  });

  // Tools Markdown Twin: /tools/:id.md
  app.get('/tools/:id.md', (req, res) => {
    const toolId = req.params.id;
    const docPath = path.join(process.cwd(), 'docs', 'tools', `${toolId}.md`);
    if (fs.existsSync(docPath)) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.sendFile(docPath);
    }

    const tool = TOOLS.find((t) => t.id === toolId);
    if (!tool) {
      return res.status(404).send('# 404 - Tool Not Found');
    }

    const pkg = generateSEOPackage(
      {
        title: `${tool.name} — Free In-Browser Zero-Upload Tool`,
        description: tool.description,
        tags: [tool.category, 'client-side', 'zero-upload', 'privacy-first', 'webassembly'],
        category: tool.category,
        contentUrl: `${SITE_URL}/tools/${tool.id}`,
        siteUrl: SITE_URL,
        siteName: 'Toolora',
      },
      `tools/${tool.id}`
    );

    res.header('Content-Type', 'text/markdown; charset=utf-8');
    res.send(pkg.markdown);
  });

  // Guides Markdown Twin: /guides/:slug.md
  app.get('/guides/:slug.md', (req, res) => {
    const slug = req.params.slug;
    const docPath = path.join(process.cwd(), 'docs', 'guides', `${slug}.md`);
    if (fs.existsSync(docPath)) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.sendFile(docPath);
    }
    res.status(404).send('# 404 - Guide Not Found');
  });

  // Blog Article Markdown Twin: /blog/:slug.md
  app.get('/blog/:slug.md', (req, res) => {
    const slug = req.params.slug;
    const docPath = path.join(process.cwd(), 'docs', 'blog', `${slug}.md`);
    if (fs.existsSync(docPath)) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.sendFile(docPath);
    }

    const article = ARTICLES_BY_ID[slug];
    if (article) {
      const pkg = generateSEOPackage(
        {
          title: article.title,
          description: article.metaDesc || article.excerpt,
          tags: [article.tag, article.focusKeyword, 'toolora', 'client-side'],
          category: article.tag,
          contentUrl: `${SITE_URL}/blog/${slug}`,
          siteUrl: SITE_URL,
          siteName: 'Toolora',
        },
        `blog/${slug}`
      );
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.send(pkg.markdown);
    }

    res.status(404).send('# 404 - Article Not Found');
  });

  // Generic Markdown Twin: /:slug.md (Checks SQLite items, tools, guides, blog)
  app.get('/:slug.md', async (req, res) => {
    const slug = req.params.slug;

    // 1. Check SQLite Catalog Items first
    const catalogItem = await getCatalogItemBySlug(slug);
    if (catalogItem && catalogItem.markdown) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.send(catalogItem.markdown);
    }

    // 2. Check tools
    const toolDoc = path.join(process.cwd(), 'docs', 'tools', `${slug}.md`);
    if (fs.existsSync(toolDoc)) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.sendFile(toolDoc);
    }

    // 3. Check guides
    const guideDoc = path.join(process.cwd(), 'docs', 'guides', `${slug}.md`);
    if (fs.existsSync(guideDoc)) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.sendFile(guideDoc);
    }

    // 4. Check blog
    const blogDoc = path.join(process.cwd(), 'docs', 'blog', `${slug}.md`);
    if (fs.existsSync(blogDoc)) {
      res.header('Content-Type', 'text/markdown; charset=utf-8');
      return res.sendFile(blogDoc);
    }

    res.status(404).send('# 404 - Document Not Found');
  });

  // ── 6. Dynamic Sitemaps & Sitemap Index (Included SQLite catalog items) ────
  app.get('/sitemap-index.xml', (req, res) => {
    const xml = generateSitemapIndex([
      `${SITE_URL}/sitemap.xml`,
      `${SITE_URL}/sitemap-tools.xml`,
      `${SITE_URL}/sitemap-guides.xml`,
      `${SITE_URL}/sitemap-blog.xml`,
      `${SITE_URL}/sitemap-catalog.xml`,
    ]);
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(xml);
  });

  app.get('/sitemap-catalog.xml', async (req, res) => {
    const items = await getAllCatalogItems(5000);
    const today = new Date().toISOString().split('T')[0];
    const entries = items.flatMap((item) => [
      { url: `${SITE_URL}/item/${item.slug}`, lastmod: item.updatedAt.split('T')[0] || today },
      { url: `${SITE_URL}/item/${item.slug}.md`, lastmod: item.updatedAt.split('T')[0] || today },
    ]);
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(generateSitemapXML(entries));
  });

  app.get('/sitemap-tools.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const entries = TOOLS.flatMap((t) => [
      { url: `${SITE_URL}/?tool=${t.id}`, lastmod: today },
      { url: `${SITE_URL}/tools/${t.id}`, lastmod: today },
      { url: `${SITE_URL}/tools/${t.id}.md`, lastmod: today },
    ]);
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(generateSitemapXML(entries));
  });

  app.get('/sitemap-guides.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const entries = GUIDES.flatMap((g) => {
      const modDate = g.frontmatter.modifiedDate?.split('T')[0] || today;
      return [
        { url: `${SITE_URL}/guides/${g.frontmatter.slug}`, lastmod: modDate },
        { url: `${SITE_URL}/guides/${g.frontmatter.slug}.md`, lastmod: modDate },
      ];
    });
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(generateSitemapXML(entries));
  });

  app.get('/sitemap-blog.xml', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const entries = FULL_ARTICLES.flatMap((a) => {
      const slug = a.slug || a.id;
      return [
        { url: `${SITE_URL}/blog/${slug}`, lastmod: today },
        { url: `${SITE_URL}/blog/${slug}.md`, lastmod: today },
      ];
    });
    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(generateSitemapXML(entries));
  });

  // Dynamic Root Combined Sitemap (Injects tools + guides + blog + SQLite items)
  app.get('/sitemap.xml', async (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const sqliteItems = await getAllCatalogItems(1000);

    const entries = [
      { url: `${SITE_URL}/`, lastmod: today },
      ...TOOLS.map((t) => ({ url: `${SITE_URL}/tools/${t.id}`, lastmod: today })),
      ...GUIDES.map((g) => ({ url: `${SITE_URL}/guides/${g.frontmatter.slug}`, lastmod: today })),
      ...FULL_ARTICLES.map((a) => ({ url: `${SITE_URL}/blog/${a.slug || a.id}`, lastmod: today })),
      ...sqliteItems.map((it) => ({ url: `${SITE_URL}/item/${it.slug}`, lastmod: it.updatedAt.split('T')[0] || today })),
    ];

    res.header('Content-Type', 'application/xml; charset=utf-8');
    res.send(generateSitemapXML(entries));
  });

  // ── 7. Dynamic robots.txt Route (AI Crawlers Explicitly Allowed) ─────────
  app.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain; charset=utf-8');
    res.send(ROBOTS_TXT_TEMPLATE(SITE_URL));
  });

  // ── 8. Vite middleware for development vs static build in production ─────
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Toolora Enterprise Server active on http://0.0.0.0:${PORT} (Domain: ${SITE_URL})`);
  });
}

startServer();
