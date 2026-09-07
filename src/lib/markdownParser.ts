/**
 * Lightweight, zero-dependency YAML Frontmatter & Markdown AST Tokenizer
 * Parses rich markdown files into clean structured React node tokens.
 */

export interface MarkdownToken {
  type: 'heading' | 'paragraph' | 'list' | 'code' | 'callout' | 'table' | 'image' | 'hr';
  level?: number;
  id?: string;
  text?: string;
  lang?: string;
  items?: string[];
  calloutType?: 'tip' | 'warning' | 'info' | 'fact';
  calloutTitle?: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  imgSrc?: string;
  imgAlt?: string;
  imgCaption?: string;
}

export function parseFrontmatter(rawContent: string): { frontmatter: Record<string, any>; body: string } {
  const normalized = rawContent.trim();
  if (!normalized.startsWith('---')) {
    return { frontmatter: {}, body: normalized };
  }

  const endIndex = normalized.indexOf('---', 3);
  if (endIndex === -1) {
    return { frontmatter: {}, body: normalized };
  }

  const rawYaml = normalized.slice(3, endIndex).trim();
  const body = normalized.slice(endIndex + 3).trim();
  const frontmatter: Record<string, any> = {};

  const lines = rawYaml.split('\n');
  let currentKey = '';
  let isArray = false;
  let arrayItems: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (trimmed.startsWith('- ') && isArray && currentKey) {
      arrayItems.push(trimmed.slice(2).replace(/^['"]|['"]$/g, ''));
      continue;
    }

    if (isArray && currentKey && !trimmed.startsWith('- ')) {
      frontmatter[currentKey] = arrayItems;
      isArray = false;
      arrayItems = [];
    }

    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1) {
      const key = trimmed.slice(0, colonIndex).trim();
      const val = trimmed.slice(colonIndex + 1).trim();

      if (val === '') {
        currentKey = key;
        isArray = true;
        arrayItems = [];
      } else {
        frontmatter[key] = val.replace(/^['"]|['"]$/g, '');
      }
    }
  }

  if (isArray && currentKey) {
    frontmatter[currentKey] = arrayItems;
  }

  return { frontmatter, body };
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tokenizeMarkdown(content: string): MarkdownToken[] {
  const lines = content.split('\n');
  const tokens: MarkdownToken[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Callouts :::tip / :::warning / :::info / :::fact
    if (trimmed.startsWith(':::')) {
      const parts = trimmed.slice(3).trim().split(' ');
      const calloutType = (parts[0] || 'info') as 'tip' | 'warning' | 'info' | 'fact';
      const calloutTitle = parts.slice(1).join(' ') || (calloutType.toUpperCase());
      const bodyLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith(':::')) {
        bodyLines.push(lines[i]);
        i++;
      }
      i++; // skip closing :::

      tokens.push({
        type: 'callout',
        calloutType,
        calloutTitle,
        text: bodyLines.join('\n').trim()
      });
      continue;
    }

    // Code blocks
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const codeLines: string[] = [];
      i++;

      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++;

      tokens.push({
        type: 'code',
        lang: lang || 'text',
        text: codeLines.join('\n')
      });
      continue;
    }

    // Tables
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        tableLines.push(lines[i].trim());
        i++;
      }

      if (tableLines.length >= 2) {
        const headers = tableLines[0]
          .split('|')
          .slice(1, -1)
          .map(h => h.trim());
        
        // tableLines[1] is divider |---|---|
        const rows = tableLines.slice(2).map(rowLine =>
          rowLine
            .split('|')
            .slice(1, -1)
            .map(cell => cell.trim())
        );

        tokens.push({
          type: 'table',
          tableHeaders: headers,
          tableRows: rows
        });
      }
      continue;
    }

    // Headings
    if (trimmed.startsWith('#')) {
      const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        tokens.push({
          type: 'heading',
          level,
          text,
          id: slugify(text)
        });
        i++;
        continue;
      }
    }

    // Unordered or Ordered Lists
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      const items: string[] = [];
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') ||
          lines[i].trim().startsWith('* ') ||
          /^\d+\.\s/.test(lines[i].trim()))
      ) {
        items.push(lines[i].trim().replace(/^[-*]\s+|\d+\.\s+/, ''));
        i++;
      }
      tokens.push({
        type: 'list',
        items
      });
      continue;
    }

    // Images ![alt](src "caption")
    const imgMatch = trimmed.match(/^!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)$/);
    if (imgMatch) {
      tokens.push({
        type: 'image',
        imgAlt: imgMatch[1],
        imgSrc: imgMatch[2],
        imgCaption: imgMatch[3] || imgMatch[1]
      });
      i++;
      continue;
    }

    // Divider
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      tokens.push({ type: 'hr' });
      i++;
      continue;
    }

    // Regular Paragraph
    tokens.push({
      type: 'paragraph',
      text: trimmed
    });
    i++;
  }

  return tokens;
}
