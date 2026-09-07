import initSqlJs, { Database } from 'sql.js';
import fs from 'fs';
import path from 'path';

let dbInstance: Database | null = null;
const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'toolora.sqlite');

export interface CatalogItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  contentUrl: string;
  thumbnailUrl?: string;
  license: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  jsonLd: Record<string, any>;
  quickAnswer: string;
  faq: Array<{ q: string; a: string }>;
  markdown: string;
  relatedSlugs: string[];
  status: 'published' | 'draft' | 'archived';
  indexNowNotified: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export async function getSqliteDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    try {
      const fileBuffer = fs.readFileSync(DB_FILE);
      dbInstance = new SQL.Database(fileBuffer);
    } catch (err) {
      console.warn('Could not read existing SQLite file, creating fresh DB:', err);
      dbInstance = new SQL.Database();
    }
  } else {
    dbInstance = new SQL.Database();
  }

  // Initialize schema
  dbInstance.run(`
    CREATE TABLE IF NOT EXISTS catalog_items (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT,
      contentUrl TEXT NOT NULL,
      thumbnailUrl TEXT,
      license TEXT,
      metaTitle TEXT,
      metaDescription TEXT,
      canonicalUrl TEXT,
      jsonLd TEXT,
      quickAnswer TEXT,
      faq TEXT,
      markdown TEXT,
      relatedSlugs TEXT,
      status TEXT DEFAULT 'published',
      indexNowNotified INTEGER DEFAULT 0,
      publishedAt TEXT,
      createdAt TEXT,
      updatedAt TEXT
    );

    CREATE TABLE IF NOT EXISTS upload_jobs (
      id TEXT PRIMARY KEY,
      fileName TEXT,
      totalItems INTEGER,
      processedItems INTEGER,
      status TEXT,
      logs TEXT,
      createdAt TEXT,
      completedAt TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_slug ON catalog_items (slug);
    CREATE INDEX IF NOT EXISTS idx_category ON catalog_items (category);
    CREATE INDEX IF NOT EXISTS idx_status ON catalog_items (status);
  `);

  saveSqliteDb();
  return dbInstance;
}

export function saveSqliteDb(): void {
  if (!dbInstance) return;
  try {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_FILE, buffer);
  } catch (err) {
    console.error('Failed to save SQLite DB to disk:', err);
  }
}

// ── CRUD OPERATIONS ──────────────────────────────────────────────────────────

export async function checkSlugExists(slug: string): Promise<boolean> {
  const db = await getSqliteDb();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM catalog_items WHERE slug = :slug');
  stmt.bind({ ':slug': slug });
  let exists = false;
  if (stmt.step()) {
    const row = stmt.getAsObject();
    exists = Number(row.count) > 0;
  }
  stmt.free();
  return exists;
}

export async function insertOrUpdateCatalogItem(item: CatalogItem): Promise<void> {
  const db = await getSqliteDb();
  const stmt = db.prepare(`
    INSERT INTO catalog_items (
      id, slug, title, description, category, tags, contentUrl, thumbnailUrl,
      license, metaTitle, metaDescription, canonicalUrl, jsonLd, quickAnswer,
      faq, markdown, relatedSlugs, status, indexNowNotified, publishedAt, createdAt, updatedAt
    ) VALUES (
      :id, :slug, :title, :description, :category, :tags, :contentUrl, :thumbnailUrl,
      :license, :metaTitle, :metaDescription, :canonicalUrl, :jsonLd, :quickAnswer,
      :faq, :markdown, :relatedSlugs, :status, :indexNowNotified, :publishedAt, :createdAt, :updatedAt
    )
    ON CONFLICT(slug) DO UPDATE SET
      title = excluded.title,
      description = excluded.description,
      category = excluded.category,
      tags = excluded.tags,
      contentUrl = excluded.contentUrl,
      thumbnailUrl = excluded.thumbnailUrl,
      license = excluded.license,
      metaTitle = excluded.metaTitle,
      metaDescription = excluded.metaDescription,
      canonicalUrl = excluded.canonicalUrl,
      jsonLd = excluded.jsonLd,
      quickAnswer = excluded.quickAnswer,
      faq = excluded.faq,
      markdown = excluded.markdown,
      relatedSlugs = excluded.relatedSlugs,
      status = excluded.status,
      indexNowNotified = excluded.indexNowNotified,
      publishedAt = excluded.publishedAt,
      updatedAt = excluded.updatedAt
  `);

  stmt.run({
    ':id': item.id,
    ':slug': item.slug,
    ':title': item.title,
    ':description': item.description,
    ':category': item.category,
    ':tags': JSON.stringify(item.tags || []),
    ':contentUrl': item.contentUrl,
    ':thumbnailUrl': item.thumbnailUrl || '',
    ':license': item.license || 'https://creativecommons.org/licenses/by/4.0/',
    ':metaTitle': item.metaTitle,
    ':metaDescription': item.metaDescription,
    ':canonicalUrl': item.canonicalUrl,
    ':jsonLd': JSON.stringify(item.jsonLd || {}),
    ':quickAnswer': item.quickAnswer,
    ':faq': JSON.stringify(item.faq || []),
    ':markdown': item.markdown,
    ':relatedSlugs': JSON.stringify(item.relatedSlugs || []),
    ':status': item.status || 'published',
    ':indexNowNotified': item.indexNowNotified ? 1 : 0,
    ':publishedAt': item.publishedAt || new Date().toISOString(),
    ':createdAt': item.createdAt || new Date().toISOString(),
    ':updatedAt': new Date().toISOString(),
  });

  stmt.free();
  saveSqliteDb();
}

export async function getCatalogItemBySlug(slug: string): Promise<CatalogItem | null> {
  const db = await getSqliteDb();
  const stmt = db.prepare('SELECT * FROM catalog_items WHERE slug = :slug LIMIT 1');
  stmt.bind({ ':slug': slug });

  let item: CatalogItem | null = null;
  if (stmt.step()) {
    const row = stmt.getAsObject() as any;
    item = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags ? JSON.parse(row.tags) : [],
      contentUrl: row.contentUrl,
      thumbnailUrl: row.thumbnailUrl || undefined,
      license: row.license,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      canonicalUrl: row.canonicalUrl,
      jsonLd: row.jsonLd ? JSON.parse(row.jsonLd) : {},
      quickAnswer: row.quickAnswer,
      faq: row.faq ? JSON.parse(row.faq) : [],
      markdown: row.markdown,
      relatedSlugs: row.relatedSlugs ? JSON.parse(row.relatedSlugs) : [],
      status: row.status as any,
      indexNowNotified: Boolean(row.indexNowNotified),
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }
  stmt.free();
  return item;
}

export async function getAllCatalogItems(limit = 100, offset = 0): Promise<CatalogItem[]> {
  const db = await getSqliteDb();
  const stmt = db.prepare('SELECT * FROM catalog_items ORDER BY createdAt DESC LIMIT :limit OFFSET :offset');
  stmt.bind({ ':limit': limit, ':offset': offset });

  const items: CatalogItem[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as any;
    items.push({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags ? JSON.parse(row.tags) : [],
      contentUrl: row.contentUrl,
      thumbnailUrl: row.thumbnailUrl || undefined,
      license: row.license,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      canonicalUrl: row.canonicalUrl,
      jsonLd: row.jsonLd ? JSON.parse(row.jsonLd) : {},
      quickAnswer: row.quickAnswer,
      faq: row.faq ? JSON.parse(row.faq) : [],
      markdown: row.markdown,
      relatedSlugs: row.relatedSlugs ? JSON.parse(row.relatedSlugs) : [],
      status: row.status as any,
      indexNowNotified: Boolean(row.indexNowNotified),
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
  stmt.free();
  return items;
}

export async function getRelatedItems(category: string, currentSlug: string, limit = 4): Promise<CatalogItem[]> {
  const db = await getSqliteDb();
  const stmt = db.prepare(`
    SELECT * FROM catalog_items 
    WHERE category = :category AND slug != :currentSlug AND status = 'published'
    ORDER BY createdAt DESC LIMIT :limit
  `);
  stmt.bind({ ':category': category, ':currentSlug': currentSlug, ':limit': limit });

  const items: CatalogItem[] = [];
  while (stmt.step()) {
    const row = stmt.getAsObject() as any;
    items.push({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags ? JSON.parse(row.tags) : [],
      contentUrl: row.contentUrl,
      thumbnailUrl: row.thumbnailUrl || undefined,
      license: row.license,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      canonicalUrl: row.canonicalUrl,
      jsonLd: row.jsonLd ? JSON.parse(row.jsonLd) : {},
      quickAnswer: row.quickAnswer,
      faq: row.faq ? JSON.parse(row.faq) : [],
      markdown: row.markdown,
      relatedSlugs: row.relatedSlugs ? JSON.parse(row.relatedSlugs) : [],
      status: row.status as any,
      indexNowNotified: Boolean(row.indexNowNotified),
      publishedAt: row.publishedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
  stmt.free();
  return items;
}

export async function getCatalogCount(): Promise<number> {
  const db = await getSqliteDb();
  const stmt = db.prepare('SELECT COUNT(*) as count FROM catalog_items');
  let count = 0;
  if (stmt.step()) {
    const row = stmt.getAsObject();
    count = Number(row.count);
  }
  stmt.free();
  return count;
}
