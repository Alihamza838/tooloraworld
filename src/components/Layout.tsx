import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useToolora } from '../context/TooloraContext';
import { TOOLS, CATEGORIES } from '../data';
import LucideIcon from './LucideIcon';
import TooloraLogo from './TooloraLogo';
import SearchBox from './SearchBox';
import ToolRenderer from './ToolRenderer';
import BlogSection from './BlogSection';
import AboutSection from './AboutSection';
import ContactSection from './ContactSection';
import PrivacySection from './PrivacySection';
import TermsSection from './TermsSection';
import Header from './Header';
import HeroSection from './HeroSection';
import FeaturedMainTools from './FeaturedMainTools';
import MockupStudioBanner from './MockupStudioBanner';
import FaqSection from './FaqSection';
import Footer from './Footer';
import LazyCard from './LazyCard';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Sun, 
  Moon, 
  Heart, 
  Clock, 
  Download, 
  ChevronRight, 
  ChevronLeft,
  Sparkles, 
  CheckCircle2, 
  LayoutGrid, 
  File, 
  Image as ImageIcon, 
  PenTool, 
  SlidersHorizontal,
  Zap,
  Activity,
  BookOpen,
  Search,
  ShieldCheck,
  Mail,
  Maximize2,
  Bookmark,
  X
} from 'lucide-react';
import { BookmarksDrawer } from './interactive/BookmarksDrawer';
import { JsonLdHead } from './seo/JsonLdHead';
import CookieBanner from './CookieBanner';
import confetti from 'canvas-confetti';
import HomeRecommendedArticles from './home/HomeRecommendedArticles';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    theme,
    toggleTheme,
    favorites,
    recents,
    history,
    clearHistory,
    activeToolId,
    setActiveToolId,
    selectedCategory,
    setSelectedCategory,
    addRecent,
    showBlog,
    setShowBlog,
    setActiveArticleId,
    showAbout,
    setShowAbout,
    showContact,
    setShowContact,
    showPrivacy,
    setShowPrivacy,
    showTerms,
    setShowTerms
  } = useToolora();

  const activeTool = activeToolId ? TOOLS.find(t => t.id === activeToolId) || null : null;
  const [installing, setInstalling] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(() => {
    try {
      return localStorage.getItem('toolora_pwa_dismissed') !== 'true';
    } catch {
      return true;
    }
  });
  const [showHero, setShowHero] = useState(() => {
    try {
      return localStorage.getItem('hide_home_hero') !== 'true';
    } catch {
      return true;
    }
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookmarksOpen, setBookmarksOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Sync state with URL path
  useEffect(() => {
    const rawPath = location.pathname;
    // Normalize trailing slash (e.g. /about/ -> /about) except for root "/"
    const path = rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;

    if (path === '/about') {
      setShowAbout(true);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolId(null);
    } else if (path === '/contact') {
      setShowAbout(false);
      setShowContact(true);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolId(null);
    } else if (path === '/privacy') {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(true);
      setShowTerms(false);
      setActiveToolId(null);
    } else if (path === '/terms') {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(true);
      setActiveToolId(null);
    } else if (path.startsWith('/blog') || path.startsWith('/guides')) {
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(true);
      setShowPrivacy(false);
      setShowTerms(false);
      setActiveToolId(null);
      const cleanSlug = path.replace('/blog/', '').replace('/guides/', '').replace('/blog', '').replace('/guides', '').split('?')[0].trim();
      if (cleanSlug) {
        setActiveArticleId(cleanSlug);
      } else {
        setActiveArticleId(null);
      }
    } else if (path.startsWith('/tools/')) {
      const toolId = path.replace('/tools/', '').split('/')[0].split('?')[0];
      if (toolId && toolId !== 'all') {
        const normalized = toolId === 'mockup-generator' ? 'mockup-gen' : (toolId === 'resume-builder' ? 'resume-cv-builder' : toolId);
        setActiveToolId(normalized);
        setShowAbout(false);
        setShowContact(false);
        setShowBlog(false);
        setShowPrivacy(false);
        setShowTerms(false);
      } else {
        setActiveToolId(null);
        setShowAbout(false);
        setShowContact(false);
        setShowBlog(false);
        setShowPrivacy(false);
        setShowTerms(false);
      }
    } else if (path === '/' || path === '/tools') {
      const urlParams = new URLSearchParams(location.search);
      const queryTool = urlParams.get('tool');
      if (queryTool) {
        const normalized = queryTool === 'mockup-generator' ? 'mockup-gen' : (queryTool === 'resume-builder' ? 'resume-cv-builder' : queryTool);
        setActiveToolId(normalized);
        setShowAbout(false);
        setShowContact(false);
        setShowBlog(false);
        setShowPrivacy(false);
        setShowTerms(false);
      } else {
        setActiveToolId(null);
        setShowAbout(false);
        setShowContact(false);
        setShowBlog(false);
        setShowPrivacy(false);
        setShowTerms(false);
      }
    } else {
      setActiveToolId(null);
      setShowAbout(false);
      setShowContact(false);
      setShowBlog(false);
      setShowPrivacy(false);
      setShowTerms(false);
    }
  }, [location.pathname, location.search, setActiveToolId, setShowAbout, setShowBlog, setShowContact, setShowPrivacy, setShowTerms, setActiveArticleId]);

  useEffect(() => {
    const handleBeforeInstallEvent = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallEvent);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallEvent);
    };
  }, []);

  const handleSelectTool = (toolId: string) => {
    const normalizedId = toolId === 'mockup-generator' ? 'mockup-gen' : (toolId === 'resume-builder' ? 'resume-cv-builder' : toolId);
    addRecent(normalizedId);
    setActiveToolId(normalizedId);
    setShowBlog(false);
    setShowAbout(false);
    setShowContact(false);
    setShowPrivacy(false);
    setShowTerms(false);
    navigate(`/tools/${normalizedId}?tool=${normalizedId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDismissInstall = () => {
    setShowInstallPrompt(false);
    try {
      localStorage.setItem('toolora_pwa_dismissed', 'true');
    } catch {}
  };

  const handleSimulateInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          handleDismissInstall();
          setTimeout(() => setInstallSuccess(false), 2000);
        }
      } catch (err) {
        console.error('PWA installation prompt errored:', err);
      }
      setDeferredPrompt(null);
    } else {
      setInstalling(true);
      setTimeout(() => {
        setInstalling(false);
        setInstallSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 }
        });
        handleDismissInstall();
        setTimeout(() => setInstallSuccess(false), 2000);
      }, 1200);
    }
  };

  const [toolPage, setToolPage] = useState(1);
  const TOOLS_PER_PAGE = 12;

  // Reset tool pagination on category switch
  useEffect(() => {
    setToolPage(1);
  }, [selectedCategory]);

  // Get matching tools for active filter
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesCategory;
  });

  const totalToolPages = Math.ceil(filteredTools.length / TOOLS_PER_PAGE);
  const paginatedTools = filteredTools.slice((toolPage - 1) * TOOLS_PER_PAGE, toolPage * TOOLS_PER_PAGE);

  // Render list of icons and tags for sliding marquee
  const renderMarqueeItems = (dupeSuffix = '') => {
    return TOOLS.map((tool) => {
      return (
        <div
          key={`${tool.id}-marquee${dupeSuffix}`}
          onClick={() => handleSelectTool(tool.id)}
          className="inline-flex items-center gap-2 px-3.5 py-2 sm:px-4.5 sm:py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-slate-200/95 dark:border-zinc-800 shadow-3xs cursor-pointer hover:border-orange-500 hover:shadow-2xs hover:scale-105 active:scale-95 transition-all select-none whitespace-nowrap"
        >
          <span className={`w-6 h-6 sm:w-6.5 sm:h-6.5 rounded-lg flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 ${getToolThemeClasses(tool)}`}>
            <LucideIcon name={tool.icon} className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs sm:text-[13px] font-extrabold text-slate-700 dark:text-zinc-200 font-sans tracking-tight">
            {tool.name}
          </span>
        </div>
      );
    });
  };

  const activeCategoryDetail = CATEGORIES.find(c => c.id === selectedCategory);

  // Mapped category navigation icons
  const getCategoryIcon = (catId: string) => {
    switch (catId) {
      case 'all':
        return <LayoutGrid className="w-4 h-4" />;
      case 'pdf':
        return <File className="w-4 h-4" />;
      case 'image':
        return <ImageIcon className="w-4 h-4" />;
      case 'document':
        return <PenTool className="w-4 h-4" />;
      default:
        return <SlidersHorizontal className="w-4 h-4" />;
    }
  };

  // Mapped tool card icon background and color classes
  const getToolThemeClasses = (tool: any) => {
    switch (tool.category) {
      case 'pdf':
        return 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100/50 dark:border-red-900/20';
      case 'image':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/20';
      case 'document':
        return 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border border-orange-100/50 dark:border-orange-900/20';
      default:
        return 'bg-slate-50 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-350 border border-slate-100/50 dark:border-zinc-700/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#09090b] text-slate-900 dark:text-zinc-100 transition-colors grid-bg flex flex-col font-sans">
      {/* 7-Layer Enterprise JSON-LD Schema Head Controller */}
      <JsonLdHead activeTool={activeTool} activeCategory={selectedCategory} />

      {/* 1. HIGH-ESTHETIC TOOLMANY GLOBAL HEADER */}
      <Header
        isSidebarOpen={bookmarksOpen}
        setIsSidebarOpen={setBookmarksOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setShowPrivacy={setShowPrivacy}
        setShowTerms={setShowTerms}
      />

      {/* 1.5 FULL-WIDTH HERO HEADER SECTION */}
      {!activeToolId && !showBlog && !showAbout && !showContact && !showPrivacy && !showTerms && showHero && (
        <HeroSection onDismiss={() => setShowHero(false)} />
      )}

      {/* 1.6 INFINITE SCROLLING TICKER (Directly below hero header section) */}
      {!activeToolId && !showBlog && !showAbout && !showContact && showHero && (
        <div className="w-full border-y border-slate-200/60 dark:border-zinc-850/60 bg-white/40 dark:bg-zinc-950/20 py-4 overflow-hidden select-none relative mb-2">
          {/* Section subtitle tracker */}
          <div className="text-center text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-3.5 font-mono flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 dark:bg-orange-400 animate-ping" />
            <span>{TOOLS.length} Free High-Performance Utilities &amp; Counting</span>
          </div>
          
          {/* Ambient left & right overlay gradients to blur out edges elegantly */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-r from-[#F8FAFC] dark:from-[#09090b] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-36 bg-gradient-to-l from-[#F8FAFC] dark:from-[#09090b] to-transparent z-10 pointer-events-none" />

          {/* Symmetrical Crawling Track */}
          <div className="flex overflow-hidden relative">
            <div className="animate-marquee flex gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4">
              {renderMarqueeItems()}
            </div>
            <div className="animate-marquee flex gap-3 sm:gap-4 shrink-0 pr-3 sm:pr-4" aria-hidden="true">
              {renderMarqueeItems('-dupe')}
            </div>
          </div>
        </div>
      )}

      {/* 2. MAIN HUB CONTAINER */}
      <main className="max-w-[1270px] w-full mx-auto px-3 sm:px-4 pt-4 sm:pt-8 flex flex-col flex-1">
        <section className="w-full space-y-6 sm:space-y-8 flex flex-col flex-1" id="layout-view-panel">
          
          {activeToolId ? (
            /* ACTIVE TOOL BLOCK RENDERING */
            <div className="flex-1">
              <ToolRenderer toolId={activeToolId || undefined} />
            </div>
          ) : showAbout ? (
            /* SPECIAL ABOUT US PAGE */
            <div className="flex-1">
              <AboutSection />
            </div>
          ) : showContact ? (
            /* SECURE CONTACT US FORM PAGE */
            <div className="flex-1">
              <ContactSection />
            </div>
          ) : showPrivacy ? (
            /* PRIVACY POLICY PAGE */
            <div className="flex-1">
              <PrivacySection />
            </div>
          ) : showTerms ? (
            /* TERMS OF SERVICE PAGE */
            <div className="flex-1">
              <TermsSection />
            </div>
          ) : showBlog ? (
            /* SPECIAL KNOWLEDGE & BLOGS BLOCK */
            <div className="flex-1">
              <BlogSection />
            </div>
          ) : (
            /* HOME INDEX CATALOG OF TOOLS */
            <div className="space-y-8 animate-in fade-in-50 duration-202 flex-1">
              
              {!showHero && (
                /* Compact recovery bar when welcome block is off */
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white dark:bg-[#0c0c0e]/80 border border-slate-205 dark:border-zinc-850 shadow-3xs animate-in fade-in duration-200">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-semibold font-sans text-slate-555 dark:text-zinc-400">
                      Private browser memory active. Processing completely on-device.
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setShowHero(true);
                      try {
                        localStorage.setItem('hide_home_hero', 'false');
                      } catch (e) {}
                    }}
                    className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline cursor-pointer flex items-center gap-1 font-display"
                  >
                    Restore Welcome Message <Sparkles className="w-3" />
                  </button>
                </div>
              )}

              {/* 1.8 CORE FLAGSHIP 4 MAIN TOOLS SHOWCASE */}
              <FeaturedMainTools />

              {/* SLEEK MOCK SAFARI BROWSER WRAPPER CONTAINER */}
              <div 
                id="tools-browser-frame"
                className="border border-slate-200/90 dark:border-zinc-850/80 rounded-2xl bg-white dark:bg-[#0c0c0e]/80 shadow-lg overflow-hidden backdrop-blur-3xs animate-in fade-in duration-300 relative"
              >
                {/* Visual subtle glow inside browser mock header */}
                <div className="absolute top-0 right-0 w-[240px] h-[60px] bg-gradient-to-l from-orange-500/[0.03] to-transparent pointer-events-none" />
                
                {/* Browser Header Bar */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/80 dark:border-zinc-850 bg-slate-50/55 dark:bg-zinc-950/40 select-none">
                  {/* Window Controls (Red, Yellow, Green mock macOS dots) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-3 h-3 rounded-full bg-rose-500/85 border border-rose-600/10 shadow-3xs" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/85 border border-amber-500/10 shadow-3xs" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/85 border border-emerald-600/10 shadow-3xs" />
                  </div>
                  
                  {/* Secure Lock & Mock URL Address Bar */}
                  <div className="bg-white/95 dark:bg-zinc-900 border border-slate-205/50 dark:border-zinc-800/70 py-1.5 px-4.5 rounded-xl flex items-center gap-1.5 text-[10px] font-medium text-slate-500 dark:text-zinc-400 font-sans tracking-tight shadow-3xs max-w-[150px] xs:max-w-xs sm:max-w-sm shrink-0 truncate w-full justify-center">
                    <span className="text-emerald-500 text-xs shrink-0 select-none font-bold">🔒</span>
                    <span className="font-mono text-[9px] text-orange-600 dark:text-orange-400 font-bold shrink-0">toolora.com</span>
                    <span className="text-slate-400 dark:text-zinc-655 font-normal font-mono truncate">/tools/{selectedCategory}</span>
                  </div>
                  
                  {/* Balanced spacer on the right side */}
                  <div className="w-12 hidden sm:block shrink-0" />
                </div>

                {/* Browser Interactive Body */}
                <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                  {/* Title of the active category with details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-855 pb-4">
                    <div>
                      <h3 className="text-xl font-black font-display text-slate-900 dark:text-zinc-50 flex items-center gap-1.5">
                        <span>{activeCategoryDetail?.name || 'All Tools'}</span>
                        <span className="text-xs font-mono font-bold text-orange-505 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-2.5 py-0.5 rounded-md border border-orange-100/40 dark:border-orange-900/10">
                          {filteredTools.length} {filteredTools.length === 1 ? 'utility' : 'utilities'}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-505 dark:text-zinc-400 mt-1 font-normal leading-relaxed">{activeCategoryDetail?.description}</p>
                    </div>

                    {/* Integrated Quick Filter Reset button */}
                    {selectedCategory !== 'all' && (
                      <button
                        onClick={() => setSelectedCategory('all')}
                        className="text-xs font-bold text-orange-650 dark:text-orange-400 hover:underline cursor-pointer text-left self-start sm:self-center shrink-0"
                      >
                        Reset to all tools
                      </button>
                    )}
                  </div>

                  {/* Horizontal Category Selector with tactile responsive buttons inside Safari frame */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none" id="horizontal-tabs-selector">
                    {CATEGORIES.map((cat) => {
                      const isSelected = selectedCategory === cat.id && !activeToolId && !showBlog;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id);
                            setActiveToolId(null);
                            setShowBlog(false);
                          }}
                          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold font-sans transition-all whitespace-nowrap shrink-0 border cursor-pointer active:scale-95 ${
                            isSelected
                              ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100 dark:shadow-none dark:bg-orange-650 dark:border-orange-600'
                              : 'bg-slate-50/50 border-slate-200/85 text-slate-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:hover:bg-zinc-855'
                          }`}
                        >
                          <span className={isSelected ? 'text-white' : 'text-slate-450 dark:text-zinc-500'}>
                            {getCategoryIcon(cat.id)}
                          </span>
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                    {/* Knowledge base guides quick tab inside folder frame */}
                    <button
                      onClick={() => {
                        setShowBlog(true);
                        setActiveToolId(null);
                        setActiveArticleId(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold font-sans transition-all whitespace-nowrap shrink-0 border cursor-pointer active:scale-95 ${
                        showBlog
                          ? 'bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100 dark:shadow-none dark:bg-orange-650 dark:border-orange-600'
                          : 'bg-slate-50/50 border-slate-205 text-slate-600 dark:bg-zinc-900 dark:border-zinc-805 dark:text-zinc-400 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 dark:hover:bg-zinc-855'
                      }`}
                    >
                      <span className={showBlog ? 'text-white' : 'text-slate-450 dark:text-zinc-500'}>
                        <BookOpen className="w-4 h-4" />
                      </span>
                      <span>Guides & FAQ</span>
                    </button>
                  </div>

                  {/* Ultimate bento grid of sandbox tools inside web container */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" id="tools-library-grid">
                    {paginatedTools.map((tool) => {
                      const catLabel = tool.category === 'pdf' ? 'PDF' : tool.category === 'image' ? 'Image' : tool.category === 'document' ? 'Documents' : 'Generators';
                      return (
                        <LazyCard key={tool.id}>
                          <div
                            onClick={() => handleSelectTool(tool.id)}
                            className="group bg-white dark:bg-zinc-900/40 border border-[#eef1f6] dark:border-zinc-805 rounded-[22px] p-6 lg:p-7 shadow-[0_6px_20px_rgba(0,0,0,0.012)] hover:shadow-[0_12px_35px_rgba(99,102,241,0.06)] hover:border-orange-400 dark:hover:border-orange-505/30 cursor-pointer transition-all duration-300 flex flex-col justify-between min-h-[190px] md:min-h-[210px] active:scale-[0.985] relative overflow-hidden"
                          >
                            {/* Subtle internal visual hover glow backdrop */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-orange-500/[0.015] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                            <div>
                              {/* Header Card Row with Rounded Icon & Soft Pill Badge */}
                              <div className="flex justify-between items-center mb-5.5">
                                {/* Rounded Box Icon matched perfectly to design specs */}
                                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all ${getToolThemeClasses(tool)}`}>
                                  <LucideIcon name={tool.icon} className="w-5 h-5" />
                                </div>
                                
                                {/* Static category metadata tag */}
                                <span className="text-[10px] md:text-[11px] font-bold text-slate-505 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800/60 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-800/40 select-none uppercase tracking-wide">
                                  {catLabel}
                                </span>
                              </div>
                              
                              {/* Dynamic Text Stack - Title and Beautiful High-Legibility description */}
                              <h4 className="font-bold text-slate-900 dark:text-zinc-50 tracking-tight text-[16px] sm:text-[17px] font-display group-hover:text-orange-600 dark:group-hover:text-orange-450 transition-colors">
                                {tool.name}
                              </h4>
                              
                              <p className="text-xs sm:text-[13px] text-slate-500 dark:text-zinc-400 mt-2 leading-relaxed font-normal font-sans">
                                {tool.description}
                              </p>
                            </div>

                            {/* Pristine Interactive Bottom Link Row (matching user request precisely) */}
                            <div className="mt-5.5 flex items-center justify-between text-xs sm:text-sm font-semibold select-none">
                              <span className="inline-flex items-center gap-1.5 text-orange-600 dark:text-orange-400 group-hover:text-orange-700 dark:group-hover:text-orange-300 transition-all font-sans">
                                <span>Open tool</span>
                                <span className="transform transition-transform duration-200 group-hover:translate-x-1 font-semibold text-sm">➔</span>
                              </span>

                              {/* Popular or New state indicators */}
                              <div className="flex gap-1.5">
                                {tool.popular && (
                                  <span className="text-[8.5px] font-black uppercase bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-400 px-2 py-0.5 rounded-md border border-emerald-100/30">
                                    POPULAR
                                  </span>
                                )}
                                {tool.premium && (
                                  <span className="text-[8.5px] font-black uppercase bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 px-2 py-0.5 rounded-md border border-purple-100/30">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </LazyCard>
                      );
                    })}
                  </div>

                  {/* Responsive Tool Catalog Pagination Controls (12 tools per page) */}
                  {totalToolPages > 1 && (
                    <div className="mt-8 pt-6 border-t border-slate-200/70 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 font-mono text-center sm:text-left">
                        Showing <span className="text-slate-900 dark:text-zinc-200 font-bold">{(toolPage - 1) * TOOLS_PER_PAGE + 1}</span>–<span className="text-slate-900 dark:text-zinc-200 font-bold">{Math.min(toolPage * TOOLS_PER_PAGE, filteredTools.length)}</span> of <span className="text-slate-900 dark:text-zinc-200 font-bold">{filteredTools.length}</span> tools
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setToolPage(p => Math.max(1, p - 1));
                            const el = document.getElementById('layout-view-panel');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          disabled={toolPage === 1}
                          className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-xs text-slate-700 dark:text-zinc-300"
                        >
                          <ChevronLeft className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span>Previous</span>
                        </button>

                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalToolPages }, (_, idx) => idx + 1).map((pageNum) => (
                            <button
                              key={pageNum}
                              onClick={() => {
                                setToolPage(pageNum);
                                const el = document.getElementById('layout-view-panel');
                                if (el) el.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className={`w-9 h-9 text-xs font-black rounded-xl transition-all cursor-pointer font-mono flex items-center justify-center ${
                                toolPage === pageNum
                                  ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                                  : 'bg-white hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 border border-slate-200/80 dark:border-zinc-800'
                              }`}
                            >
                              {pageNum}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setToolPage(p => Math.min(totalToolPages, p + 1));
                            const el = document.getElementById('layout-view-panel');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          disabled={toolPage === totalToolPages}
                          className="px-3.5 py-2 text-xs font-bold bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer shadow-xs text-slate-700 dark:text-zinc-300"
                        >
                          <span>Next</span>
                          <ChevronRight className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* WORLD-CLASS DEDICATED 3D MOCKUP STUDIO SHOWCASE SECTION */}
              <MockupStudioBanner />

              {/* RECOMMENDED IN-DEPTH GUIDES WITH VISUAL SEPARATOR */}
              <HomeRecommendedArticles />

            </div>
          )}
        </section>

      </main>

      {/* 2.5 WORLD-CLASS FAQ SECTION (10 TOP RANKING KEYWORDS & RICH SNIPPETS) - Main Page Only */}
      {!activeToolId && !showBlog && !showAbout && !showContact && !showPrivacy && !showTerms && (
        <FaqSection />
      )}

      {/* 3. TOOLMANY SITE FOOTER */}
      <Footer />


      {/* 4. PREMIUM FLOATING PWA INSTALL PROMPT */}
      <AnimatePresence>
        {showInstallPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-40 max-w-md bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 p-4 rounded-xl shadow-xl flex gap-3.5 items-start justify-between"
          >
            <div className="w-9 h-9 bg-orange-50 dark:bg-orange-950/40 text-orange-605 dark:text-orange-400 flex items-center justify-center rounded-lg shrink-0">
              <Download className="w-4 h-4" />
            </div>
            
            <div className="flex-1 space-y-1 text-left">
              <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-150 font-display">Install Toolora App</h4>
              <p className="text-[11px] text-slate-500 dark:text-zinc-450 leading-relaxed">
                Add Toolora to your home screen or bookmarks bar for rapid physical launching, offline storage capability, and private sandboxed speed.
              </p>
              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={handleSimulateInstall}
                  className="px-3 py-1.5 bg-orange-650 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-505 text-white text-[10px] font-black rounded-lg cursor-pointer transition-colors shadow-3xs"
                >
                  Install Now
                </button>
                <button
                  onClick={handleDismissInstall}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-650 dark:text-zinc-350 text-[10px] font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Maybe Later
                </button>
              </div>
            </div>

            <button
              onClick={handleDismissInstall}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-zinc-350 transition-colors cursor-pointer shrink-0"
              title="Close Prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sliding Mobile Drawer Navigation (Right side) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Dimmer with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 md:hidden"
            />

            {/* Right Side sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="fixed top-0 right-0 h-full w-[290px] sm:w-[330px] bg-white dark:bg-[#09090b] border-l border-slate-200/90 dark:border-zinc-850 z-50 shadow-2xl flex flex-col md:hidden text-left overflow-hidden"
            >
              {/* Subtle visual radial glow in drawer */}
              <div className="absolute top-0 right-0 w-[180px] h-[180px] bg-orange-500/[0.03] dark:bg-orange-550/[0.01] rounded-full blur-2xl pointer-events-none" />

              {/* Drawer Header */}
              <div className="p-4.5 border-b border-slate-150 dark:border-zinc-855 bg-slate-50/50 dark:bg-zinc-950/25 flex items-center justify-between relative z-10">
                <div className="space-y-0.5">
                  <span className="font-extrabold text-[11px] uppercase tracking-widest text-orange-655 dark:text-orange-400 font-display block">Toolora Suite</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">RAM Secure Link</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900 text-slate-505 hover:text-slate-700 dark:text-zinc-400 transition-colors cursor-pointer active:scale-95 flex items-center justify-center bg-white dark:bg-zinc-950"
                  title="Close Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-4.5 space-y-6 relative z-10 scrollbar-none">
                
                {/* 1. Global Navigation Section */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-widest px-2 font-mono block">MAIN DIRECTORY</span>
                  
                  <nav className="space-y-1">
                    <button
                      onClick={() => {
                        navigate('/');
                        setActiveToolId(null);
                        setShowBlog(false);
                        setShowAbout(false);
                        setShowContact(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${!activeToolId && !showBlog && !showAbout && !showContact ? 'bg-orange-50/70 text-orange-700 border-orange-150/50 dark:bg-zinc-900 dark:text-orange-405 dark:border-zinc-800' : 'text-slate-600 dark:text-zinc-400 border-transparent hover:bg-slate-50 dark:hover:bg-zinc-950/20'}`}
                    >
                      <SlidersHorizontal className="w-4 h-4 text-orange-550 hover:text-orange-600 shrink-0" />
                      <span className="flex-1 font-sans">Home Utilities Catalog</span>
                      {!activeToolId && !showBlog && !showAbout && !showContact && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                    </button>

                    <button
                      onClick={() => {
                        setActiveToolId(null);
                        setShowBlog(true);
                        setShowAbout(false);
                        setShowContact(false);
                        setActiveArticleId(null);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${showBlog && !activeToolId && !showAbout && !showContact ? 'bg-orange-50/70 text-orange-700 border-orange-150/50 dark:bg-zinc-900 dark:text-orange-405 dark:border-zinc-800' : 'text-slate-600 dark:text-zinc-400 border-transparent hover:bg-slate-50 dark:hover:bg-zinc-950/20'}`}
                    >
                      <BookOpen className="w-4 h-4 text-orange-550 shrink-0" />
                      <span className="flex-1 font-sans">Knowledge & Guides</span>
                      {showBlog && !activeToolId && !showAbout && !showContact && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                    </button>

                    <button
                      onClick={() => {
                        setActiveToolId(null);
                        setShowBlog(false);
                        setShowAbout(true);
                        setShowContact(false);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${showAbout ? 'bg-orange-50/70 text-orange-700 border-orange-150/50 dark:bg-zinc-900 dark:text-orange-405 dark:border-zinc-800' : 'text-slate-655 dark:text-zinc-400 border-transparent hover:bg-slate-50 dark:hover:bg-zinc-950/20'}`}
                    >
                      <ShieldCheck className="w-4 h-4 text-orange-550 shrink-0" />
                      <span className="flex-1 font-sans">About Us (Ethics)</span>
                      {showAbout && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                    </button>

                    <button
                      onClick={() => {
                        setActiveToolId(null);
                        setShowBlog(false);
                        setShowAbout(false);
                        setShowContact(true);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer border ${showContact ? 'bg-orange-50/70 text-orange-700 border-orange-150/50 dark:bg-zinc-900 dark:text-orange-405 dark:border-zinc-800' : 'text-slate-655 dark:text-zinc-400 border-transparent hover:bg-slate-100/10'}`}
                    >
                      <Mail className="w-4 h-4 text-orange-550 shrink-0" />
                      <span className="flex-1 font-sans">Contact Support Form</span>
                      {showContact && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                    </button>
                  </nav>
                </div>

                {/* Divider Line */}
                <div className="border-t border-slate-100 dark:border-zinc-850/80" />

                {/* 2. List of tools divided by category */}
                <div className="space-y-4">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-555 uppercase tracking-widest px-2 font-mono block">UTILITY TOOLBOX</span>
                  
                  {CATEGORIES.map((cat) => {
                    const catTools = TOOLS.filter(t => t.category === cat.id);
                    return (
                      <div key={cat.id} className="space-y-2">
                        <div className="flex items-center gap-1.5 px-2 text-[9.5px] font-black text-orange-650 dark:text-orange-405 uppercase tracking-wider font-mono">
                          {getCategoryIcon(cat.id)}
                          <span className="text-[10px] ml-1">{cat.name}</span>
                        </div>
                        <div className="space-y-1 border-l border-slate-100 dark:border-zinc-850 ml-4.5 pl-2.5 pb-1">
                          {catTools.map((tool) => {
                            const isCurrentlyActive = activeToolId === tool.id;
                            return (
                              <button
                                key={tool.id}
                                onClick={() => {
                                  handleSelectTool(tool.id);
                                  setMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-xs transition-colors text-left font-semibold cursor-pointer ${isCurrentlyActive ? 'bg-orange-600 text-white font-black shadow-xs' : 'text-slate-600 hover:text-orange-600 dark:text-zinc-350 dark:hover:text-orange-400 hover:bg-slate-50/60 dark:hover:bg-zinc-950/20'}`}
                              >
                                <div className="shrink-0">
                                  <LucideIcon name={tool.icon} className={`w-3.5 h-3.5 ${isCurrentlyActive ? 'text-white' : 'text-slate-450 dark:text-zinc-500'}`} />
                                </div>
                                <span className="truncate flex-1 font-sans">{tool.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Footer Smart Diagnostic Status block */}
              <div className="p-4 bg-slate-50 dark:bg-zinc-950/80 border-t border-slate-150 dark:border-zinc-850/80 text-[10px] text-slate-505 dark:text-zinc-400 font-mono space-y-1 text-center select-none">
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-slate-705 dark:text-zinc-305">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>100% On-Device Active Sandbox</span>
                </div>
                <div className="text-[9.2px] text-zinc-400 dark:text-zinc-500 leading-normal font-sans px-1">
                  All security tasks render locally inside secure CPU buffers.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Enterprise Bookmarks Drawer */}
      <BookmarksDrawer
        isOpen={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Global Cookie & Consent Banner */}
      <CookieBanner />
    </div>
  );
}

