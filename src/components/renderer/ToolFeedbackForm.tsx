import React, { useState } from 'react';
import CheckCircle2 from 'lucide-react/dist/esm/icons/check-circle-2.js';

const loadConfetti = () => import('canvas-confetti').then((m) => m.default);

export default function ToolFeedbackForm() {
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    const fire = await loadConfetti();
    fire({ particleCount: 36, spread: 44, origin: { y: 0.9 } });
  };

  return (
    <div className="rounded-2xl p-5 sm:p-7 bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs text-left min-h-[260px]">
      <h3 className="text-base font-black text-slate-800 dark:text-zinc-100 mb-1">
        How was your experience?
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4">
        Help us optimize this client-side utility with your feedback.
      </p>

      {!feedbackSent ? (
        <form onSubmit={handleFeedback} className="space-y-4 max-w-sm">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setFeedbackRating(n)}
                className={`text-3xl min-h-[44px] min-w-[44px] flex items-center justify-center transition-transform active:scale-90 cursor-pointer ${
                  feedbackRating >= n
                    ? 'text-amber-400 scale-105'
                    : 'text-slate-200 dark:text-zinc-700 hover:text-amber-300'
                }`}
                aria-label={`Rate ${n} stars`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Share your thoughts or feature suggestions..."
            style={{ fontSize: '16px' }}
            className="w-full h-24 p-3.5 rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-sm text-slate-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-orange-500/30 resize-none transition"
            required
          />
          <button
            type="submit"
            className="w-full min-h-[44px] py-3 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-orange-600 hover:bg-orange-500 transition-all active:scale-[0.98] cursor-pointer shadow-xs"
          >
            Submit Feedback
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            Thank you for your feedback!
          </p>
          <p className="text-xs text-slate-400">
            Your review helps keep Toolora fast, private, and 100% free.
          </p>
        </div>
      )}
    </div>
  );
}
