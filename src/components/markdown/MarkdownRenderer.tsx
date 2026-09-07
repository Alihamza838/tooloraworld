import React from 'react';
import { tokenizeMarkdown, MarkdownToken } from '../../lib/markdownParser';
import { GuideImage } from '../images/GuideImage';
import { Lightbulb, AlertTriangle, Info, CheckCircle2, Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const tokens = tokenizeMarkdown(content);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none space-y-5 text-slate-700 dark:text-slate-300">
      {tokens.map((token, idx) => {
        switch (token.type) {
          case 'heading': {
            const headingClasses = 
              token.level === 2
                ? 'text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white pt-6 pb-2 border-b border-slate-100 dark:border-slate-800'
                : token.level === 3
                ? 'text-lg sm:text-xl font-bold text-slate-900 dark:text-white pt-4 pb-1'
                : 'text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 pt-3';

            if (token.level === 1) {
              return <h1 key={idx} id={token.id} className={headingClasses}>{token.text}</h1>;
            }
            if (token.level === 3) {
              return <h3 key={idx} id={token.id} className={headingClasses}>{token.text}</h3>;
            }
            if (token.level === 4) {
              return <h4 key={idx} id={token.id} className={headingClasses}>{token.text}</h4>;
            }
            return (
              <h2 key={idx} id={token.id} className={headingClasses}>
                {token.text}
              </h2>
            );
          }

          case 'paragraph': {
            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed font-sans font-normal text-slate-700 dark:text-slate-300">
                {token.text}
              </p>
            );
          }

          case 'list': {
            return (
              <ul key={idx} className="space-y-2 pl-2 my-4">
                {token.items?.map((item, iIdx) => (
                  <li key={iIdx} className="flex items-start gap-2 text-sm sm:text-base text-slate-700 dark:text-slate-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-600 dark:bg-orange-400 shrink-0 mt-2.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }

          case 'callout': {
            const isTip = token.calloutType === 'tip';
            const isWarning = token.calloutType === 'warning';
            const isFact = token.calloutType === 'fact';

            const bgClass = isTip
              ? 'bg-emerald-50/80 border-emerald-300 dark:bg-emerald-950/30 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
              : isWarning
              ? 'bg-amber-50/80 border-amber-300 dark:bg-amber-950/30 dark:border-amber-800 text-amber-900 dark:text-amber-200'
              : isFact
              ? 'bg-orange-50/80 border-orange-300 dark:bg-orange-950/30 dark:border-orange-800 text-orange-900 dark:text-orange-200'
              : 'bg-slate-50/80 border-slate-300 dark:bg-slate-800/50 dark:border-slate-700 text-slate-900 dark:text-slate-200';

            const Icon = isTip ? CheckCircle2 : isWarning ? AlertTriangle : isFact ? Lightbulb : Info;

            return (
              <div key={idx} className={`my-5 rounded-2xl border p-4 sm:p-5 flex items-start gap-3.5 shadow-xs ${bgClass}`}>
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider font-mono">
                    {token.calloutTitle}
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed font-sans">
                    {token.text}
                  </p>
                </div>
              </div>
            );
          }

          case 'table': {
            return (
              <div key={idx} className="my-6 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      {token.tableHeaders?.map((header, hIdx) => (
                        <th key={hIdx} className="px-4 py-3 whitespace-nowrap">
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {token.tableRows?.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case 'code': {
            return (
              <div key={idx} className="my-5 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 shadow-lg">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                  <span>{token.lang}</span>
                  <button
                    onClick={() => copyCode(token.text || '', idx)}
                    className="flex items-center gap-1 hover:text-white transition-colors"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-amber-300">
                  <code>{token.text}</code>
                </pre>
              </div>
            );
          }

          case 'image': {
            return (
              <GuideImage
                key={idx}
                src={token.imgSrc || ''}
                alt={token.imgAlt || ''}
                caption={token.imgCaption}
              />
            );
          }

          case 'hr': {
            return <hr key={idx} className="my-6 border-slate-200 dark:border-slate-800" />;
          }

          default:
            return null;
        }
      })}
    </div>
  );
};
