// blog/MarkdownText.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Dependency-free markdown renderer for blog article body content.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";

const LINK_CLASS =
  "text-orange-600 dark:text-orange-400 font-semibold underline underline-offset-2 decoration-orange-300 hover:text-orange-700 transition-colors";

interface MarkdownTextProps {
  content?: string;
  toolSlug?: string;
  className?: string;
  onInternalLinkClick?: (href: string) => void;
}

export default function MarkdownText({
  content,
  className = "",
  onInternalLinkClick,
}: MarkdownTextProps) {
  if (!content) return null;

  const blocks = content.split(/\n\s*\n/);

  const renderInline = (text: string, keyPrefix: string): React.ReactNode[] => {
    const nodes: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let idx = 0;

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        nodes.push(
          ...renderBoldItalic(
            text.slice(lastIndex, match.index),
            `${keyPrefix}-t${idx}`,
          ),
        );
      }

      const [, label, href] = match;
      const key = `${keyPrefix}-l${idx}`;

      if (/^https?:\/\//i.test(href)) {
        nodes.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {label}
          </a>,
        );
      } else if (onInternalLinkClick) {
        nodes.push(
          <button
            key={key}
            onClick={() => onInternalLinkClick(href)}
            className={LINK_CLASS}
          >
            {label}
          </button>,
        );
      } else {
        nodes.push(<strong key={key}>{label}</strong>);
      }
      lastIndex = match.index + match[0].length;
      idx++;
    }

    if (lastIndex < text.length) {
      nodes.push(
        ...renderBoldItalic(text.slice(lastIndex), `${keyPrefix}-tail`),
      );
    }
    return nodes.length > 0 ? nodes : [text];
  };

  const renderBoldItalic = (
    text: string,
    keyPrefix: string,
  ): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const complexRegex = /(`[^`]+`|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
    let lastIndex = 0;
    let match;

    while ((match = complexRegex.exec(text)) !== null) {
      if (match.index > lastIndex)
        parts.push(text.slice(lastIndex, match.index));

      const fullMatch = match[0];
      if (fullMatch.startsWith("`")) {
        parts.push(
          <code
            key={match.index}
            className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400"
          >
            {match[0].slice(1, -1)}
          </code>,
        );
      } else if (fullMatch.startsWith("**")) {
        parts.push(<strong key={match.index}>{match[2]}</strong>);
      } else {
        parts.push(<em key={match.index}>{match[3]}</em>);
      }
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) parts.push(text.slice(lastIndex));
    return parts;
  };

  return (
    <div className={`prose prose-orange max-w-none ${className}`}>
      {blocks.map((block, blockIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith("#")) {
          const level = trimmed.split(" ")[0].length;
          const Tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
          return (
            <Tag key={blockIdx} className="text-xl sm:text-2xl font-bold mt-6 mb-3 text-slate-900 dark:text-white">
              {trimmed.replace(/^#+\s/, "")}
            </Tag>
          );
        }

        if (trimmed.startsWith(">")) {
          return (
            <blockquote
              key={blockIdx}
              className="border-l-4 border-orange-500 pl-4 py-2 italic my-4 text-slate-700 dark:text-zinc-300 bg-orange-50/20 dark:bg-orange-950/10 rounded-r-xl"
            >
              {trimmed.replace(/^>\s/, "")}
            </blockquote>
          );
        }

        if (/^(-|\d+\.)\s/.test(trimmed)) {
          const lines = trimmed.split("\n");
          const ordered = /^\d+\./.test(lines[0]);
          const ListTag = ordered ? "ol" : "ul";
          return (
            <ListTag key={blockIdx} className="space-y-2 my-4 pl-6 list-disc text-slate-600 dark:text-zinc-300">
              {lines.map((l, i) => (
                <li key={i}>
                  {renderInline(
                    l.replace(/^(-|\d+\.)\s/, ""),
                    `${blockIdx}-${i}`,
                  )}
                </li>
              ))}
            </ListTag>
          );
        }

        return (
          <p key={blockIdx} className="leading-relaxed my-3 text-slate-600 dark:text-zinc-300">
            {renderInline(trimmed, `p${blockIdx}`)}
          </p>
        );
      })}
    </div>
  );
}
