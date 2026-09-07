import React, { useState } from 'react';

export default function TextToolsSuite() {
  const [text, setText] = useState(
    'Toolora provides safe, sovereign in-browser utilities engineered for privacy, speed, and precision.'
  );
  const [copied, setCopied] = useState(false);

  const applyCase = (type: string) => {
    if (type === 'upper') setText(text.toUpperCase());
    if (type === 'lower') setText(text.toLowerCase());
    if (type === 'title') {
      setText(
        text.replace(
          /\w\S*/g,
          (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()
        )
      );
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className="space-y-4 max-w-2xl text-left">
      <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
        Advanced Text Suite
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Transform casing, count words/characters, and format text instantly.
      </p>
      <textarea
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ fontSize: '16px' }}
        className="w-full p-3.5 font-mono border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] rounded-xl text-sm text-slate-800 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-orange-500/30 resize-none transition"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex gap-4 text-[11px] uppercase font-mono text-slate-400">
          <span>
            Words:{' '}
            <span className="font-bold text-slate-700 dark:text-zinc-300 font-mono">
              {wordCount}
            </span>
          </span>
          <span>
            Chars:{' '}
            <span className="font-bold text-slate-700 dark:text-zinc-300 font-mono">
              {text.length}
            </span>
          </span>
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {[
            ['upper', 'UPPERCASE'],
            ['lower', 'lowercase'],
            ['title', 'Title Case'],
          ].map(([t, l]) => (
            <button
              key={t}
              type="button"
              onClick={() => applyCase(t)}
              className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-orange-600 dark:text-orange-400 hover:border-orange-500 active:scale-95 shadow-xs"
            >
              {l}
            </button>
          ))}
          <button
            type="button"
            onClick={handleCopy}
            className={`min-h-[44px] px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all text-white active:scale-95 shadow-xs ${
              copied ? 'bg-emerald-600' : 'bg-orange-600 hover:bg-orange-500'
            }`}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
