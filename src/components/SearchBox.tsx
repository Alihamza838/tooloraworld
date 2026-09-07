import React, { useState, useEffect, useRef } from 'react';
// @ts-ignore
import * as reactWindow from 'react-window';
import { Search, Sparkles, Command, X, Heart, Clock, Download, Trash2, Star, FileDown, FolderOpen } from 'lucide-react';

function List({ height, itemCount, itemSize, children, className }: any) {
  const ListComp = (reactWindow as any).FixedSizeList || (reactWindow as any).default?.FixedSizeList || (reactWindow as any).default;
  const isComponentValid = typeof ListComp === 'function' || (ListComp && typeof ListComp.render === 'function');

  if (isComponentValid) {
    const ReactWindowList = ListComp;
    return (
      <ReactWindowList
        height={height}
        itemCount={itemCount}
        itemSize={itemSize}
        width="100%"
        className={className}
      >
        {children}
      </ReactWindowList>
    );
  }

  return (
    <div className={`overflow-y-auto pr-1 ${className || ''}`} style={{ maxHeight: height }}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} style={{ height: itemSize }}>
          {children({ index, style: {} })}
        </div>
      ))}
    </div>
  );
}
import { TOOLS, SUGGESTED_SEARCHES } from '../data';
import { useToolora } from '../context/TooloraContext';
import { useNavigate } from 'react-router-dom';
import { Tool } from '../types';
import TooloraLogo from './TooloraLogo';

export default function SearchBox() {
  const navigate = useNavigate();
  const { setActiveToolId, addRecent, favorites, recents, history, clearHistory } = useToolora();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Tool[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Monitor shortcut Cmd+K or Ctrl+K to open Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update query results live
  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }
    const cleanQuery = query.toLowerCase();
    const filtered = TOOLS.filter(
      tool => 
        tool.name.toLowerCase().includes(cleanQuery) || 
        tool.description.toLowerCase().includes(cleanQuery) ||
        tool.category.toLowerCase().includes(cleanQuery)
    );
    setResults(filtered);
  }, [query]);

  // Autofocus when open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('mousedown', handleOutsideClick);
    }
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelectTool = (toolId: string) => {
    addRecent(toolId);
    setActiveToolId(toolId);
    setIsOpen(false);
    setQuery('');
    navigate(`/tools/${toolId}?tool=${toolId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      {/* Visual Input Trigger - Premium Inline Input Container */}
      <div
        className={`flex items-center gap-2 px-3 py-2 w-10 xs:w-44 sm:w-52 md:w-full md:max-w-sm h-10 rounded-xl bg-slate-50 dark:bg-[#0c0c0e] border ${
          isOpen
            ? 'border-orange-500 dark:border-orange-550 ring-2 ring-orange-500/10'
            : 'border-slate-200 dark:border-zinc-805/85 hover:border-slate-300 dark:hover:border-zinc-750'
        } transition-all justify-center xs:justify-start group active:scale-[0.99] shadow-3xs cursor-text`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
        id="search-trigger-container"
      >
        <Search className="w-4 h-4 text-slate-450 group-hover:text-orange-505 dark:text-zinc-550 transition-colors shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search sandbox tools..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className="text-xs font-semibold bg-transparent border-0 outline-hidden focus:outline-hidden focus:ring-0 text-slate-800 dark:text-zinc-200 placeholder-slate-450 dark:placeholder-zinc-500 flex-1 hidden xs:inline truncate cursor-text"
        />

        {query && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-900 text-slate-450 dark:text-zinc-550 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="hidden lg:flex items-center gap-1 bg-slate-250/60 dark:bg-zinc-800/80 px-1.5 py-0.5 rounded-md text-[9px] text-slate-500 dark:text-zinc-400 font-mono font-bold shrink-0 border border-slate-300/30 dark:border-zinc-700/35 select-none">
          <Command className="w-2.5 h-2.5" />
          <span>K</span>
        </div>
      </div>

      {/* Floating Command Results - Sits right below the header without hiding navbar */}
      {isOpen && (
        <div 
          className="fixed xs:absolute top-[64px] xs:top-full left-4 right-4 xs:left-0 xs:right-auto mt-2 w-[calc(100vw-32px)] xs:w-[400px] sm:w-[480px] md:w-[520px] max-w-[95vw] md:max-w-xl bg-white dark:bg-[#0c0c0e] border border-slate-200 dark:border-zinc-850 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden max-h-[75vh] animate-in fade-in slide-in-from-top-1 duration-150"
          id="search-palette-modal"
        >
          {/* Mobile input header inside float to simplify touch cases */}
          <div className="xs:hidden flex items-center gap-2.5 px-3 py-3 border-b border-slate-150 dark:border-zinc-900 bg-white dark:bg-[#0c0c0e]">
            <Search className="w-4 h-4 text-orange-500" />
            <input
              type="text"
              placeholder="Search sandbox tools..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-hidden text-slate-805 dark:text-zinc-100 text-xs pl-0 py-0"
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results or Suggestions List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-white dark:bg-[#0c0c0e]">
            {query.trim() === '' ? (
              <>
                {/* 1. CUSTOM FAVORITES PANEL */}
                {favorites && favorites.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-display font-mono">
                      <Heart className="w-3.5 h-3.5 fill-current" /> Favorited Tools ({favorites.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {favorites.map(id => {
                        const tool = TOOLS.find(t => t.id === id);
                        if (!tool) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => handleSelectTool(tool.id)}
                            className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-850 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-rose-400 dark:hover:border-rose-900 text-left transition-all cursor-pointer group/fav"
                          >
                            <div className="w-6.5 h-6.5 items-center justify-center flex rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-500 text-[10px] shrink-0 border border-rose-100/10">
                              <Heart className="w-3 h-3 fill-current" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-extrabold text-slate-750 dark:text-zinc-200 group-hover/fav:text-rose-500 transition-colors line-clamp-1">{tool.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. RECENT TOOLS PANEL */}
                {recents && recents.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-display font-mono">
                      <Clock className="w-3.5 h-3.5" /> Recent Sessions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recents.slice(0, 4).map(id => {
                        const tool = TOOLS.find(t => t.id === id);
                        if (!tool) return null;
                        return (
                          <button
                            key={id}
                            onClick={() => handleSelectTool(tool.id)}
                            className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/60 dark:border-zinc-850 bg-slate-50/20 dark:bg-zinc-900/10 hover:border-orange-400 dark:hover:border-orange-905 text-left transition-all cursor-pointer group/rec"
                          >
                            <div className="w-6.5 h-6.5 items-center justify-center flex rounded-lg bg-orange-50 dark:bg-orange-950/45 text-orange-550 dark:text-orange-400 text-[10px] shrink-0">
                              <Clock className="w-3 h-3" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-extrabold text-slate-755 dark:text-zinc-200 group-hover/rec:text-orange-505 transition-colors line-clamp-1">{tool.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 3. DOWNLOAD HISTORY PANEL */}
                {history && history.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5 font-display font-mono">
                        <FileDown className="w-3.5 h-3.5" /> Client Download Log ({history.length})
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          clearHistory();
                        }}
                        className="text-[9px] font-bold uppercase text-rose-500 hover:underline flex items-center gap-1 font-mono tracking-wider cursor-pointer"
                        title="Flush sandbox traces"
                      >
                        <Trash2 className="w-3 h-3" /> Purge Logs
                      </button>
                    </div>
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                      {history.slice(0, 5).map(item => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-2 rounded-xl border border-slate-150 dark:border-zinc-850/80 bg-slate-50/40 dark:bg-zinc-900/20 text-left text-[11px]"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-slate-805 dark:text-zinc-150 truncate block max-w-[200px]" title={item.fileName}>
                                {item.fileName}
                              </span>
                              <span className="text-[8px] font-mono px-1 py-0.2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded border border-emerald-100/10">
                                {item.fileSize}
                              </span>
                            </div>
                            <span className="text-[8.5px] text-slate-400 dark:text-zinc-550 font-mono">
                              compiled via {item.toolName} • {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <a
                            href={item.blobUrl}
                            download={item.fileName}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 bg-emerald-550 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white rounded-lg cursor-pointer flex items-center justify-center transition-colors shadow-3xs"
                            title="Re-download local file buffer"
                          >
                            <Download className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. DEFAULT SUGGESTED SEARCHES SEARCH TILES */}
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-display font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500 fill-current" /> Suggested Searches
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SEARCHES.map((search) => (
                      <button
                        key={search}
                        onClick={() => {
                          setQuery(search);
                          inputRef.current?.focus();
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-zinc-900 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:text-orange-650 dark:hover:text-orange-400 border border-slate-200/60 dark:border-zinc-850 text-slate-650 dark:text-zinc-350 transition-all cursor-pointer shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. DEFAULT POPULAR REALTIME UTILITIES */}
                <div className="pt-1">
                  <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider mb-2.5 font-display font-mono">
                    Popular Realtime Utilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {TOOLS.filter(t => t.popular).slice(0, 6).map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleSelectTool(tool.id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-200/50 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 hover:border-orange-400 dark:hover:border-orange-900/60 hover:bg-slate-50/50 dark:hover:bg-zinc-900/10 text-left transition-all cursor-pointer group/item"
                      >
                        <div className="w-6 h-6 items-center justify-center flex rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-black shrink-0 border border-orange-100/10 dark:border-orange-900/10">
                          ⚡
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-extrabold text-slate-750 dark:text-zinc-200 group-hover/item:text-orange-650 dark:group-hover/item:text-orange-405 transition-colors line-clamp-1">{tool.name}</p>
                          <p className="text-[8px] font-mono font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider leading-none mt-0.5">{tool.category}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Filtered Results */
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-zinc-550 uppercase tracking-wider mb-2 font-display font-mono">
                  Matches found ({results.length})
                </h4>

                {results.length > 0 ? (
                  <div className="w-full">
                    <List
                      height={Math.min(results.length * 72, 300)}
                      itemCount={results.length}
                      itemSize={72}
                      width="100%"
                      className="scrollbar-none pr-1"
                    >
                      {({ index, style }) => {
                        const tool = results[index];
                        if (!tool) return null;
                        return (
                          <div style={style} className="pb-1.5">
                            <button
                              onClick={() => handleSelectTool(tool.id)}
                              className="flex items-center justify-between w-full h-[64px] px-3 rounded-lg border border-slate-150/50 dark:border-zinc-850 bg-white dark:bg-zinc-900/40 hover:border-orange-400 dark:hover:border-orange-500/50 hover:bg-orange-50/20 dark:hover:bg-zinc-900 text-left transition-all group pointer-events-auto cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <div className="w-7 h-7 items-center justify-center flex rounded-lg bg-slate-50 dark:bg-zinc-900 group-hover:bg-orange-500/15 group-hover:text-orange-600 dark:group-hover:text-orange-400 text-slate-500 dark:text-zinc-400 shrink-0 transition-colors border border-slate-150/40 dark:border-zinc-800">
                                  ⚡
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <p className="text-[11px] font-extrabold text-slate-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{tool.name}</p>
                                    <span className="text-[7px] font-mono font-bold uppercase px-1 py-0.2 rounded bg-slate-100 dark:bg-zinc-800 text-slate-450 dark:text-zinc-550 tracking-wider">
                                      {tool.category}
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-450 dark:text-zinc-500 truncate pr-4 leading-normal">{tool.description}</p>
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0 shrink-0 flex items-center gap-0.5 font-display">
                                Launch ➔
                              </span>
                            </button>
                          </div>
                        );
                      }}
                    </List>
                  </div>
                ) : (
                  <div className="py-12 text-center bg-slate-50/50 dark:bg-zinc-900/20 rounded-xl border border-dashed border-slate-200/50 dark:border-zinc-850">
                    <p className="text-xs mb-1 font-bold font-display text-slate-800 dark:text-zinc-200">No sandbox tools match your query.</p>
                    <p className="text-[10px] text-zinc-500">Try general tags like 'PDF', 'compress', 'invoice', or 'OCR'.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Instruction Footer with intuitive mobile and privacy statements */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#0c0c0e] border-t border-slate-150 dark:border-zinc-900 flex justify-between items-center text-[9px] text-slate-450 dark:text-zinc-500">
            <span className="hidden sm:inline font-mono">ESC or click outside to dismiss</span>
            <button
              onClick={() => setIsOpen(false)}
              className="font-bold text-orange-650 dark:text-orange-400 hover:underline px-2 py-0.5"
            >
              Close
            </button>
            <span className="font-mono flex items-center gap-1 text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider">
              🛡️ On-Device Local Sandbox
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
