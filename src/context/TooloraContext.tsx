import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'motion/react';
import { Sparkles, X } from 'lucide-react';
import { DownloadHistoryItem, Tool } from '../types';
import { TOOLS, CATEGORIES } from '../data';
import { ARTICLES } from '../components/blog/articlesIndex';
import { SITE_CONFIG, generate7LayerSchema, generateLayout7LayerSchema } from '../lib/seo-schemas';

interface TooloraContextProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  recents: string[];
  addRecent: (toolId: string) => void;
  history: DownloadHistoryItem[];
  addHistoryItem: (toolId: string, toolName: string, fileName: string, fileSize: string, blobUrl: string) => void;
  clearHistory: () => void;
  triggerHappyMoment: (title: string, subtitle?: string) => void;
  activeToolId: string | null;
  setActiveToolId: (id: string | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  handleSelectTool: (toolId: string | null) => void;
  installing: boolean;
  isAppInstalled: boolean;
  executeNativePWAInstall: () => Promise<void>;
  showBlog: boolean;
  setShowBlog: (show: boolean) => void;
  activeArticleId: string | null;
  setActiveArticleId: (id: string | null) => void;
  showAbout: boolean;
  setShowAbout: (show: boolean) => void;
  showContact: boolean;
  setShowContact: (show: boolean) => void;
  showPrivacy: boolean;
  setShowPrivacy: (show: boolean) => void;
  showTerms: boolean;
  setShowTerms: (show: boolean) => void;
}

const TooloraContext = createContext<TooloraContextProps | undefined>(undefined);

export function TooloraProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Safe parsing from LocalStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolora-theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'light';
    }
    return 'light';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolora-favorites');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [recents, setRecents] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolora-recents');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [history, setHistory] = useState<DownloadHistoryItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolora-history');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const normalizeToolId = (id: string | null | undefined): string | null => {
    if (!id) return null;
    if (id === 'mockup-generator') return 'mockup-gen';
    if (id === 'resume-builder') return 'resume-cv-builder';
    if (id === 'ocr') return 'ocr-tool';
    if (id === 'bill-form' || id === 'bill-form-generator') return 'bill-form-gen';
    if (id === 'business-card' || id === 'business-card-designer') return 'business-card-gen';
    return id;
  };

  const [activeToolId, setActiveToolIdInternal] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const queryTool = urlParams.get('tool');
      if (queryTool) return normalizeToolId(queryTool);

      const pathname = window.location.pathname;
      if (pathname.startsWith('/tools/')) {
        const pathTool = pathname.replace('/tools/', '').split('/')[0].split('?')[0];
        if (pathTool) return normalizeToolId(pathTool);
      }
    }
    return null;
  });

  const [showBlog, setShowBlog] = useState<boolean>(false);
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showContact, setShowContact] = useState<boolean>(false);
  const [showPrivacy, setShowPrivacy] = useState<boolean>(false);
  const [showTerms, setShowTerms] = useState<boolean>(false);
  const [installing, setInstalling] = useState<boolean>(false);
  const [isAppInstalled, setIsAppInstalled] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Sync state with router location changes
  useEffect(() => {
    const path = location.pathname;
    const searchParams = new URLSearchParams(location.search);
    const queryTool = searchParams.get('tool');

    if (path === '/about') {
      setShowAbout(true);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolIdInternal(null);
    } else if (path === '/contact') {
      setShowAbout(false);
      setShowContact(true);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolIdInternal(null);
    } else if (path === '/privacy') {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(true);
      setShowTerms(false);
      setActiveToolIdInternal(null);
    } else if (path === '/terms') {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(true);
      setActiveToolIdInternal(null);
    } else if (path.startsWith('/blog') || path.startsWith('/guides')) {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(true);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolIdInternal(null);
      const cleanSlug = path
        .replace('/blog/', '')
        .replace('/guides/', '')
        .replace('/blog', '')
        .replace('/guides', '')
        .split('?')[0]
        .trim();
      setActiveArticleId(cleanSlug || null);
    } else if (path.startsWith('/tools/')) {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
      const rawTool = path.replace('/tools/', '').split('/')[0].split('?')[0];
      const norm = normalizeToolId(rawTool);
      if (norm && TOOLS.some((t) => t.id === norm)) {
        setActiveToolIdInternal(norm);
      } else {
        const cat = CATEGORIES.find((c) => c.id === rawTool);
        if (cat) {
          setSelectedCategory(cat.id);
          setActiveToolIdInternal(null);
        } else {
          setActiveToolIdInternal(null);
        }
      }
    } else if (queryTool) {
      const norm = normalizeToolId(queryTool);
      if (norm) {
        setActiveToolIdInternal(norm);
        setShowBlog(false);
        setShowAbout(false);
        setShowContact(false);
        setShowPrivacy(false);
        setShowTerms(false);
      }
    } else if (path === '/') {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolIdInternal(null);
    }
  }, [location.pathname, location.search]);

  // PWA Prompt Listeners
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    const handleAppInstalled = () => {
      setIsAppInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const executeNativePWAInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsAppInstalled(true);
        }
      } catch (err) {
        console.error('PWA install failed:', err);
      }
      setDeferredPrompt(null);
    } else {
      setInstalling(true);
      setTimeout(() => {
        setInstalling(false);
        setIsAppInstalled(true);
      }, 1200);
    }
  };

  const handleSelectTool = (toolId: string | null) => {
    if (!toolId) {
      setActiveToolIdInternal(null);
      return;
    }
    const normalizedId = normalizeToolId(toolId);
    if (!normalizedId) return;
    addRecent(normalizedId);
    setActiveToolIdInternal(normalizedId);
    setShowBlog(false);
    setShowAbout(false);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
  };

  const setActiveToolId = (id: string | null) => {
    const normalizedId = normalizeToolId(id);
    setActiveToolIdInternal(normalizedId);
  };

  // Synchronize browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      let t = urlParams.get('tool');
      if (!t && window.location.pathname.startsWith('/tools/')) {
        t = window.location.pathname.replace('/tools/', '').split('/')[0].split('?')[0];
      }
      setActiveToolIdInternal(normalizeToolId(t));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initial theme setup on DOM mount
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('toolora-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('toolora-recents', JSON.stringify(recents));
  }, [recents]);

  useEffect(() => {
    localStorage.setItem('toolora-history', JSON.stringify(history));
  }, [history]);

  // ── THEME TRANSITION STATE WITH FAST HARDWARE-ACCELERATED LASER BEAM ──
  const [themeTransitionDirection, setThemeTransitionDirection] = useState<'ltr' | 'rtl' | null>(null);
  const isTransitioningRef = useRef<boolean>(false);
  const currentThemeRef = useRef<'light' | 'dark'>(theme);
  const queuedTogglesRef = useRef<number>(0);
  const timerIdsRef = useRef<NodeJS.Timeout[]>([]);

  // ── LEFT-SIDE 2-SECOND HAPPY MOMENT CELEBRATION STATE ──
  const [happyMoment, setHappyMoment] = useState<{
    id: string;
    title: string;
    subtitle: string;
  } | null>(null);
  const happyMomentTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    currentThemeRef.current = theme;
  }, [theme]);

  // Clean up transition timers on unmount
  useEffect(() => {
    return () => {
      timerIdsRef.current.forEach(clearTimeout);
      timerIdsRef.current = [];
      if (happyMomentTimerRef.current) {
        clearTimeout(happyMomentTimerRef.current);
      }
    };
  }, []);

  const triggerHappyMoment = (title: string, subtitle?: string) => {
    if (typeof window === 'undefined') return;

    if (happyMomentTimerRef.current) {
      clearTimeout(happyMomentTimerRef.current);
      happyMomentTimerRef.current = null;
    }

    const id = Math.random().toString(36).substring(2, 9);
    setHappyMoment({
      id,
      title: title || 'Kaam Ho Gaya! ✨',
      subtitle: subtitle || 'File downloaded & processed in RAM.',
    });

    // Snappy celebration confetti originating from the LEFT side, completing in ~2s
    try {
      confetti({
        particleCount: 42,
        angle: 60,
        spread: 60,
        origin: { x: 0.1, y: 0.85 },
        ticks: 85,
        decay: 0.92,
        gravity: 1.25,
        scalar: 0.9,
        colors: ['#EA580C', '#F97316', '#FBBF24', '#10B981', '#3B82F6'],
      });
    } catch {}

    // Auto dismiss after EXACTLY 2 seconds (2000ms) as requested by user
    happyMomentTimerRef.current = setTimeout(() => {
      setHappyMoment(null);
      happyMomentTimerRef.current = null;
    }, 2000);
  };

  const runThemeTransition = (targetTheme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return;
    const root = window.document.documentElement;
    const direction = targetTheme === 'dark' ? 'ltr' : 'rtl';

    // 1. Instantly apply theme to DOM & state with zero latency
    if (targetTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setTheme(targetTheme);
    currentThemeRef.current = targetTheme;
    try {
      localStorage.setItem('toolora-theme', targetTheme);
    } catch {}

    // 2. Trigger high-speed 0.22s laser sweep
    isTransitioningRef.current = true;
    setThemeTransitionDirection(direction);

    // 3. Clean up transition beam in 220ms
    const t = setTimeout(() => {
      setThemeTransitionDirection(null);
      isTransitioningRef.current = false;

      // If rapid clicks occurred during animation, execute queued transition
      if (queuedTogglesRef.current > 0) {
        queuedTogglesRef.current = 0;
        const nextQueuedTheme = currentThemeRef.current === 'light' ? 'dark' : 'light';
        runThemeTransition(nextQueuedTheme);
      }
    }, 220);

    timerIdsRef.current.push(t);
  };

  const toggleTheme = () => {
    if (isTransitioningRef.current) {
      queuedTogglesRef.current = (queuedTogglesRef.current + 1) % 2;
      return;
    }

    const nextTheme = theme === 'light' ? 'dark' : 'light';
    runThemeTransition(nextTheme);
  };

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId) 
        : [...prev, toolId]
    );
  };

  const addRecent = (toolId: string) => {
    setRecents(prev => {
      const filtered = prev.filter(id => id !== toolId);
      return [toolId, ...filtered].slice(0, 5);
    });
  };

  const addHistoryItem = (
    toolId: string,
    toolName: string,
    fileName: string,
    fileSize: string,
    blobUrl: string
  ) => {
    const newItem: DownloadHistoryItem = {
      id: Math.random().toString(36).substring(2, 9),
      toolId,
      toolName,
      fileName,
      fileSize,
      timestamp: new Date().toISOString(),
      blobUrl
    };
    setHistory(prev => [newItem, ...prev].slice(0, 30));

    // Instantly trigger the 2-second happy moment celebration from the left!
    triggerHappyMoment(`${toolName} Ready! ✨`, fileName);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // ── AUDIT & STANDARDIZE SEO, AEO, AND GEO METADATA & SCHEMA MARKUP ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const currentTool = activeToolId ? TOOLS.find((t) => t.id === activeToolId) || null : null;
    const currentArticle = (showBlog && activeArticleId) 
      ? ARTICLES.find((a) => a.slug === activeArticleId) || null 
      : null;

    let pageTitle = SITE_CONFIG.name + ' - Free In-Browser Zero-Upload Privacy Tools';
    let pageDesc = SITE_CONFIG.description;
    let canonicalUrl = SITE_CONFIG.url;
    let markdownUrl = `${SITE_CONFIG.url}/public/llms.txt`;
    let ogType = 'website';
    let ogImage = `${SITE_CONFIG.url}/favicon.svg`;

    if (currentTool) {
      pageTitle = `${currentTool.name} - Free In-Browser Zero-Upload Tool | Toolora`;
      pageDesc = `${currentTool.name}: ${currentTool.description} 100% private, client-side browser processing with zero cloud uploads.`;
      canonicalUrl = `${SITE_CONFIG.url}/tools/${currentTool.id}`;
      markdownUrl = `${SITE_CONFIG.url}/docs/tools/${currentTool.id}.md`;
      ogType = 'website';
    } else if (currentArticle) {
      const art = currentArticle as any;
      pageTitle = `${art.title} | Toolora Blog`;
      pageDesc = art.metaDescription || art.metaDesc || art.excerpt || SITE_CONFIG.description;
      canonicalUrl = `${SITE_CONFIG.url}/guides/${art.slug}`;
      markdownUrl = `${SITE_CONFIG.url}/docs/blog/${art.slug}.md`;
      ogType = 'article';
      if (art.coverImage || art.heroImage?.src) {
        ogImage = art.coverImage || art.heroImage?.src;
      }
    } else if (showBlog) {
      pageTitle = 'Privacy & Web Security Guides | Toolora Blog';
      pageDesc = 'In-depth engineering tutorials and security benchmarks covering client-side WebAssembly, Canvas rendering, and zero-knowledge data sovereignty.';
      canonicalUrl = `${SITE_CONFIG.url}/guides`;
      markdownUrl = `${SITE_CONFIG.url}/public/llms-full.txt`;
    } else if (showAbout) {
      pageTitle = 'About Us & Privacy Manifesto | Toolora';
      pageDesc = 'Learn how Toolora builds sovereign, zero-cloud web utilities that process data exclusively on your device RAM.';
      canonicalUrl = `${SITE_CONFIG.url}/about`;
    } else if (showContact) {
      pageTitle = 'Contact Support & Feedback | Toolora';
      pageDesc = 'Get in touch with the Toolora engineering team for support, feature requests, and security disclosures.';
      canonicalUrl = `${SITE_CONFIG.url}/contact`;
    } else if (showPrivacy) {
      pageTitle = 'Privacy Policy & Zero-Telemetry Guarantee | Toolora';
      pageDesc = 'Toolora operates under a strict zero-knowledge architecture. No tracking cookies, no server uploads, and no data telemetry.';
      canonicalUrl = `${SITE_CONFIG.url}/privacy`;
    } else if (showTerms) {
      pageTitle = 'Terms of Service | Toolora';
      pageDesc = 'Review the terms and conditions for using Toolora in-browser productivity tools.';
      canonicalUrl = `${SITE_CONFIG.url}/terms`;
    } else if (selectedCategory && selectedCategory !== 'all') {
      const cat = CATEGORIES.find((c) => c.id === selectedCategory);
      if (cat) {
        pageTitle = `${cat.name} - Free In-Browser Zero-Upload Tools | Toolora`;
        pageDesc = `${cat.description} 100% private, on-device execution.`;
        canonicalUrl = `${SITE_CONFIG.url}/tools/${cat.id}`;
      }
    }

    // 1. Update Document Title
    document.title = pageTitle;

    // 2. Safe Helper to Update or Create Meta Tags
    const setMetaTag = (nameAttr: 'name' | 'property', attrValue: string, content: string) => {
      let tag = document.querySelector(`meta[${nameAttr}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameAttr, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'Toolora');
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', ogImage);

    // 3. Update Canonical Tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // 4. Update Markdown Alternate Link for AI / Crawlers (AEO / GEO)
    let linkMarkdown = document.querySelector('link[rel="alternate"][type="text/markdown"]');
    if (!linkMarkdown) {
      linkMarkdown = document.createElement('link');
      linkMarkdown.setAttribute('rel', 'alternate');
      linkMarkdown.setAttribute('type', 'text/markdown');
      document.head.appendChild(linkMarkdown);
    }
    linkMarkdown.setAttribute('href', markdownUrl);
    linkMarkdown.setAttribute('title', `${pageTitle} Markdown Documentation`);

    // 5. Standardized Unified 7-Layer JSON-LD Schema
    const scriptId = 'toolora-unified-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = scriptId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (currentArticle) {
      const schemas = generate7LayerSchema(currentArticle, TOOLS);
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          schemas.websiteSchema,
          schemas.organizationSchema,
          schemas.breadcrumbSchema,
          schemas.articleSchema,
          schemas.faqSchema,
          schemas.howToSchema,
          schemas.policySchema
        ]
      });
    } else {
      const layoutSchemas = generateLayout7LayerSchema(currentTool, selectedCategory);
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          layoutSchemas.websiteSchema,
          layoutSchemas.organizationSchema,
          layoutSchemas.breadcrumbSchema,
          layoutSchemas.articleSchema,
          layoutSchemas.faqSchema,
          layoutSchemas.howToSchema,
          layoutSchemas.policySchema
        ]
      });
    }
  }, [
    activeToolId,
    activeArticleId,
    showBlog,
    showAbout,
    showContact,
    showPrivacy,
    showTerms,
    selectedCategory,
    location.pathname,
    location.search
  ]);

  return (
    <TooloraContext.Provider
      value={{
        theme,
        toggleTheme,
        favorites,
        toggleFavorite,
        recents,
        addRecent,
        history,
        addHistoryItem,
        clearHistory,
        activeToolId,
        setActiveToolId,
        selectedCategory,
        setSelectedCategory,
        handleSelectTool,
        installing,
        isAppInstalled,
        executeNativePWAInstall,
        showBlog,
        setShowBlog,
        activeArticleId,
        setActiveArticleId,
        showAbout,
        setShowAbout,
        showContact,
        setShowContact,
        showPrivacy,
        setShowPrivacy,
        showTerms,
        setShowTerms,
        triggerHappyMoment,
      }}
    >
      {children}

      {/* ── LEFT-SIDE 2-SECOND HAPPY MOMENT / SUCCESS NOTIFICATION ── */}
      <AnimatePresence>
        {happyMoment && (
          <motion.div
            key={happyMoment.id}
            initial={{ opacity: 0, x: -90, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -70, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 340 }}
            className="fixed bottom-6 left-6 z-[999999] max-w-sm bg-white dark:bg-[#0c0c0e] border border-emerald-500/40 dark:border-emerald-500/30 rounded-2xl shadow-2xl shadow-emerald-500/10 dark:shadow-emerald-950/30 p-3.5 pr-4 flex items-center gap-3 backdrop-blur-md overflow-hidden text-left pointer-events-auto"
          >
            {/* Celebration Icon with emerald badge */}
            <div className="relative shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>

            {/* Content info */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-zinc-100 font-display truncate">
                  {happyMoment.title}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase">
                  Done
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate mt-0.5 font-medium">
                {happyMoment.subtitle}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setHappyMoment(null)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* 2-Second Linear Depletion Progress Bar at bottom */}
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 2, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-orange-500"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HIGH-TECH SCREEN SCAN LASER SWEEP TRANSITION OVERLAY ── */}
      {themeTransitionDirection && (
        <div className="theme-sweep-overlay" aria-hidden="true">
          <div
            className={
              themeTransitionDirection === 'ltr'
                ? 'theme-sweep-beam-ltr'
                : 'theme-sweep-beam-rtl'
            }
          />
        </div>
      )}
    </TooloraContext.Provider>
  );
}

export function useToolora() {
  const context = useContext(TooloraContext);
  if (context === undefined) {
    throw new Error('useToolora must be used within a TooloraProvider');
  }
  return context;
}
