import React, { useState, useEffect } from 'react';
import { Bookmark, X, Trash2, ExternalLink, BookOpen, Wrench, Shield } from 'lucide-react';
import { BookmarkItem } from '../../types';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGuide?: (slug: string) => void;
  onSelectTool?: (toolId: string) => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  onSelectGuide,
  onSelectTool
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const loadBookmarks = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('toolora_bookmarks') || '[]') as BookmarkItem[];
      setBookmarks(stored);
    } catch {
      setBookmarks([]);
    }
  };

  useEffect(() => {
    loadBookmarks();
    const handleUpdate = () => loadBookmarks();
    window.addEventListener('toolora_bookmarks_updated', handleUpdate);
    return () => window.removeEventListener('toolora_bookmarks_updated', handleUpdate);
  }, [isOpen]);

  const removeBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = bookmarks.filter(b => b.id !== id);
    localStorage.setItem('toolora_bookmarks', JSON.stringify(updated));
    setBookmarks(updated);
    window.dispatchEvent(new Event('toolora_bookmarks_updated'));
  };

  const clearAll = () => {
    localStorage.removeItem('toolora_bookmarks');
    setBookmarks([]);
    window.dispatchEvent(new Event('toolora_bookmarks_updated'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-orange-600 text-white">
                <Bookmark className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Saved Library & Bookmarks
                </h3>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'} stored in local browser memory
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {bookmarks.length > 0 && (
                <button
                  onClick={clearAll}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {bookmarks.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
                <Bookmark className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">No saved items yet</p>
                <p className="text-xs mt-1">Click "Save Guide" on any technical article or tool to bookmark it offline.</p>
              </div>
            ) : (
              bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  onClick={() => {
                    if (bm.type === 'guide' && onSelectGuide) {
                      onSelectGuide(bm.id);
                      onClose();
                    } else if (bm.type === 'tool' && onSelectTool) {
                      onSelectTool(bm.id);
                      onClose();
                    }
                  }}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 hover:border-orange-300 dark:hover:border-orange-700 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded">
                        {bm.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(bm.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2">
                      {bm.title}
                    </h4>
                  </div>

                  <button
                    onClick={(e) => removeBookmark(bm.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 rounded transition-opacity"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
