import React, { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Check } from 'lucide-react';
import { BookmarkItem } from '../../types';

interface SavePolicyButtonProps {
  item: {
    id: string;
    title: string;
    category: string;
    type: 'tool' | 'guide' | 'policy';
    url: string;
  };
}

export const SavePolicyButton: React.FC<SavePolicyButtonProps> = ({ item }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('toolora_bookmarks') || '[]') as BookmarkItem[];
      setIsSaved(stored.some(b => b.id === item.id));
    } catch {
      setIsSaved(false);
    }
  }, [item.id]);

  const toggleSave = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('toolora_bookmarks') || '[]') as BookmarkItem[];
      let updated: BookmarkItem[];

      if (isSaved) {
        updated = stored.filter(b => b.id !== item.id);
        setIsSaved(false);
      } else {
        const newItem: BookmarkItem = {
          ...item,
          savedAt: new Date().toISOString()
        };
        updated = [newItem, ...stored];
        setIsSaved(true);
      }

      localStorage.setItem('toolora_bookmarks', JSON.stringify(updated));
      window.dispatchEvent(new Event('toolora_bookmarks_updated'));
    } catch (e) {
      console.error('Failed to update bookmarks', e);
    }
  };

  return (
    <button
      onClick={toggleSave}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-xs cursor-pointer border ${
        isSaved
          ? 'bg-orange-600 text-white border-orange-700 hover:bg-orange-700 shadow-orange-500/20'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
      }`}
      title={isSaved ? 'Remove from Saved' : 'Save Guide for Later'}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="w-3.5 h-3.5" />
          <span>Saved to Library</span>
        </>
      ) : (
        <>
          <Bookmark className="w-3.5 h-3.5 text-slate-400" />
          <span>Save Guide</span>
        </>
      )}
    </button>
  );
};
