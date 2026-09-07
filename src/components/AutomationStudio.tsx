import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Database,
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Search,
  Code2,
  FileText,
  Tag,
  Zap,
  Globe,
  Radio,
  Layers,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WorkerStep {
  step: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed' | 'skipped' | 'failed';
  details: string;
  timestamp?: string;
}

interface CatalogItem {
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
  status: string;
  indexNowNotified: boolean;
  publishedAt: string;
  createdAt: string;
}

export default function AutomationStudio() {
  const [activeTab, setActiveTab] = useState<'upload' | 'csv' | 'catalog' | 'logs'>('upload');
  const [loading, setLoading] = useState(false);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Graphics & Assets');
  const [tags, setTags] = useState('glassmorphism, 3d-icons, ui-kit');
  const [imageUrl, setImageUrl] = useState('');
  const [license, setLicense] = useState('https://creativecommons.org/licenses/by/4.0/');

  // CSV State
  const [csvText, setCsvText] = useState(
    `Title,Category,Description,Tags,ImageUrl\n` +
    `Abstract Holographic Glass Spheres 4K,Graphics & Assets,Futuristic floating iridescent glass orbs with refraction effects,"holographic, 3d, abstract",https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80\n` +
    `Modern Scandinavian Brand Stationery Mockup,Branding & Identity,Clean linen textures and foil stamped business card mockups,"branding, stationery, mockup",https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1600&q=80\n` +
    `Minimalist Dark Gradient Wallpaper Pack,Backgrounds & Textures,Ultra HD organic slate dark fluid wallpapers for OLED displays,"wallpaper, dark, gradient",https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1600&q=80`
  );

  // Database Items
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<CatalogItem | null>(null);

  // Real-time 10-Step Worker Progress
  const [pipelineSteps, setPipelineSteps] = useState<WorkerStep[]>([
    { step: 1, name: 'Slug generate + collision check in SQLite', status: 'pending', details: 'Awaiting execution' },
    { step: 2, name: 'Image resize (WebP/AVIF/thumbnail) + R2 upload', status: 'pending', details: 'Awaiting execution' },
    { step: 3, name: 'Meta title/description fill (SEO 60ch/160ch)', status: 'pending', details: 'Awaiting execution' },
    { step: 4, name: 'JSON-LD structured data generate (SEO + AEO)', status: 'pending', details: 'Awaiting execution' },
    { step: 5, name: 'Quick-answer + mini-FAQ block generate (AEO)', status: 'pending', details: 'Awaiting execution' },
    { step: 6, name: 'Markdown content generate as SQLite DB field (GEO)', status: 'pending', details: 'Awaiting execution' },
    { step: 7, name: 'Page revalidate/publish (Zero redeploy)', status: 'pending', details: 'Awaiting execution' },
    { step: 8, name: 'Sitemap dynamic inclusion in /sitemap.xml', status: 'pending', details: 'Awaiting execution' },
    { step: 9, name: 'IndexNow ping — search engines instant notification', status: 'pending', details: 'Awaiting execution' },
    { step: 10, name: 'Related-images linking automatically from SQLite', status: 'pending', details: 'Awaiting execution' },
  ]);

  const fetchCatalog = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/catalog?limit=50');
      const data = await res.json();
      if (data.success) {
        setCatalogItems(data.items || []);
        setTotalCount(data.total || 0);
        if (!selectedItem && data.items?.length > 0) {
          setSelectedItem(data.items[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch catalog from SQLite:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const runSimulatedProgress = async (finalLogs: any[]) => {
    // Step by step visual ticker
    for (let i = 0; i < 10; i++) {
      setPipelineSteps((prev) =>
        prev.map((step, idx) => {
          if (idx < i) return { ...step, status: 'completed' };
          if (idx === i) return { ...step, status: 'in-progress', details: finalLogs[i]?.details || 'Processing...' };
          return { ...step, status: 'pending' };
        })
      );
      await new Promise((r) => setTimeout(r, 140));
    }
    setPipelineSteps((prev) =>
      prev.map((step, idx) => ({
        ...step,
        status: 'completed',
        details: finalLogs[idx]?.details || step.details,
      }))
    );
  };

  const handleSingleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setPipelineRunning(true);
    setPipelineSteps((prev) => prev.map((s) => ({ ...s, status: 'pending', details: 'Executing pipeline...' })));

    try {
      const res = await fetch('/api/catalog/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          tags: tags.split(',').map((t) => t.trim()),
          imageUrl: imageUrl.trim() || undefined,
          license,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        await runSimulatedProgress(data.result.logs || []);
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        fetchCatalog();
        setSelectedItem(data.result.item);
        setTitle('');
        setDescription('');
        setImageUrl('');
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setPipelineRunning(false);
    }
  };

  const handleCsvBulkUpload = async () => {
    if (!csvText.trim()) return;
    setPipelineRunning(true);

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length <= 1) return;

      const items: any[] = [];
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Simple CSV quote-aware splitter
        const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
        const matches: string[] = [];
        let match;
        while ((match = regex.exec(line)) !== null && matches.length < 5) {
          let val = match[1] || '';
          if (val.startsWith('"') && val.endsWith('"')) {
            val = val.slice(1, -1).replace(/""/g, '"');
          }
          matches.push(val);
          if (regex.lastIndex >= line.length) break;
        }

        const itemTitle = matches[0] || `Catalog Item ${i}`;
        const itemCategory = matches[1] || 'Graphics & Assets';
        const itemDesc = matches[2] || 'High quality design asset generated by Toolora automated worker.';
        const itemTags = (matches[3] || 'assets, tools, design').split(',').map((t) => t.trim());
        const itemImg = matches[4] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80';

        items.push({
          title: itemTitle,
          category: itemCategory,
          description: itemDesc,
          tags: itemTags,
          imageUrl: itemImg,
        });
      }

      const res = await fetch('/api/catalog/upload-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (data.success) {
        confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
        fetchCatalog();
        setActiveTab('catalog');
      }
    } catch (err) {
      console.error('CSV batch upload failed:', err);
    } finally {
      setPipelineRunning(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredItems = catalogItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-orange-500/30 rounded-2xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-orange-400" />
                SQLite Engine Active
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold rounded-full flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                10/10 Automation Steps Active
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Poora Automation Engine (SEO + AEO + GEO)
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-3xl">
              Jab aap CSV ya item upload karte hain, background worker automatically bina kisi manual step ke:
              slug generation, WebP/AVIF scaling, meta tags, Schema JSON-LD, direct AEO answers, dynamic Markdown twin, instant page revalidation, dynamic sitemap injection, IndexNow ping, aur related assets linking complete karta hy.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto bg-slate-800/80 border border-slate-700/60 rounded-xl p-4">
            <div className="text-center px-3 border-r border-slate-700">
              <div className="text-2xl font-bold text-orange-400">{totalCount}</div>
              <div className="text-xs text-slate-400 font-medium">SQLite Items</div>
            </div>
            <div className="text-center px-3">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Zero-Upload</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          Single Item Automation
        </button>

        <button
          onClick={() => setActiveTab('csv')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'csv'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          Batch CSV Ingestion
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          SQLite Catalog Database ({catalogItems.length})
        </button>
      </div>

      {/* TAB 1: Single Upload Pipeline */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Upload New Asset / Content
              </h2>
              <span className="text-xs text-slate-500 font-mono">SQLite Pipeline</span>
            </div>

            <form onSubmit={handleSingleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 3D Isometric Neon Hologram Vector Pack"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Graphics & Assets">Graphics & Assets</option>
                    <option value="Branding & Identity">Branding & Identity</option>
                    <option value="Backgrounds & Textures">Backgrounds & Textures</option>
                    <option value="Product Mockups">Product Mockups</option>
                    <option value="Vector Icons">Vector Icons</option>
                    <option value="UI & Wireframes">UI & Wireframes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="3d, neon, glass, vector"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detailed description of the asset with specifications, resolution, and usage permissions..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Image or Content URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or leave empty for smart vector fallback"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setTitle('Raytraced 3D Glass UI Badges Kit');
                    setDescription('Complete translucent glassmorphic icon set with layered normal maps and editable SVGs for web design.');
                    setCategory('Graphics & Assets');
                    setTags('glassmorphism, 3d, badges, icons');
                    setImageUrl('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80');
                  }}
                  className="text-xs text-orange-600 dark:text-orange-400 hover:underline font-medium"
                >
                  ⚡ Fill Sample Data
                </button>

                <button
                  type="submit"
                  disabled={pipelineRunning}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-2"
                >
                  {pipelineRunning ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Executing Pipeline...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Run 10-Step Automation
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live 10-Step Progress Tracker */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Live Background Worker Tracker
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">SQLite Pipeline Status</span>
            </div>

            <div className="space-y-2.5">
              {pipelineSteps.map((step) => (
                <div
                  key={step.step}
                  className={`p-3 rounded-xl border transition-all text-xs flex items-start gap-3 ${
                    step.status === 'completed'
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-300'
                      : step.status === 'in-progress'
                      ? 'bg-orange-500/10 border-orange-500/40 text-orange-900 dark:text-orange-200 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {step.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : step.status === 'in-progress' ? (
                      <RefreshCw className="w-4 h-4 text-orange-500 animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-400">
                        {step.step}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>
                        Step {step.step}: {step.name}
                      </span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 mt-0.5 text-[11px] truncate">
                      {step.details}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Batch CSV Ingestion */}
      {activeTab === 'csv' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-orange-500" />
              Batch CSV Automation Ingestion
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Paste your CSV data with headers (<code>Title,Category,Description,Tags,ImageUrl</code>). Background worker will automatically loop through every row, generating unique slugs, schemas, direct answers, markdown twins, and inserting into SQLite!
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              CSV Content
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              className="w-full p-4 font-mono text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Estimated rows: {Math.max(0, csvText.trim().split('\n').length - 1)} items
            </span>

            <button
              onClick={handleCsvBulkUpload}
              disabled={pipelineRunning}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              {pipelineRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Batch in Worker...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Run Automated Batch Ingest to SQLite
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SQLite Catalog Explorer & Inspector */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search SQLite catalog..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              onClick={fetchCatalog}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Reload SQLite Table
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Catalog List */}
            <div className="lg:col-span-5 space-y-3">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                  <Database className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">No items found in SQLite</p>
                  <p className="text-xs text-slate-500 mt-1">Upload a single asset or batch CSV to seed the database.</p>
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-orange-50 dark:bg-orange-950/40 border-orange-500/50 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[10px] font-semibold">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Live in SQLite
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">
                      <span>/{item.slug}</span>
                      <span>•</span>
                      <span>{item.relatedSlugs?.length || 0} Related Items</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Selected Item Detailed Inspector */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
              {selectedItem ? (
                <>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="px-2.5 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-xs font-semibold">
                        {selectedItem.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                        {selectedItem.title}
                      </h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">
                        Canonical Slug: /{selectedItem.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`/item/${selectedItem.slug}.md`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        .md Twin
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  {/* AEO Direct Quick Answer Block */}
                  <div className="bg-orange-50/50 dark:bg-orange-950/20 border border-orange-500/20 rounded-xl p-4 space-y-2">
                    <div className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      AEO Direct Quick-Answer (Zero-Click Output)
                    </div>
                    <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">
                      {selectedItem.quickAnswer}
                    </p>
                  </div>

                  {/* Frequently Asked Questions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Automated Mini-FAQ Block
                    </h4>
                    <div className="space-y-2">
                      {selectedItem.faq.map((faq, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs">
                          <div className="font-semibold text-slate-900 dark:text-white">Q: {faq.q}</div>
                          <div className="text-slate-600 dark:text-slate-400 mt-1">A: {faq.a}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Slugs */}
                  {selectedItem.relatedSlugs && selectedItem.relatedSlugs.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Auto-Linked Related Slugs (SQLite Category Match)
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedItem.relatedSlugs.map((slug) => (
                          <span
                            key={slug}
                            className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded text-xs font-mono"
                          >
                            /{slug}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Markdown Twin Preview */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        Dynamic Markdown Twin Output (Stored in SQLite)
                      </h4>
                      <button
                        onClick={() => handleCopy(selectedItem.markdown, 'md-code')}
                        className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:underline"
                      >
                        {copiedId === 'md-code' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        {copiedId === 'md-code' ? 'Copied' : 'Copy Markdown'}
                      </button>
                    </div>
                    <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl text-xs font-mono overflow-x-auto max-h-60 border border-slate-800">
                      {selectedItem.markdown}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-slate-400 text-sm">
                  Select an item from the left to inspect its SEO + AEO + GEO payload.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
