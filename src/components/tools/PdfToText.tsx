import React, { useState, useMemo } from 'react';
import {
  Upload,
  FileText,
  Copy,
  Check,
  Download,
  Search,
  BookOpen,
  Hash,
  Clock,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Layers,
  FileCode
} from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { useToolora } from '../../context/TooloraContext';

interface PageText {
  pageNumber: number;
  text: string;
  wordCount: number;
  charCount: number;
}

export default function PdfToText() {
  const { addHistoryItem } = useToolora();
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageText[]>([]);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [selectedPage, setSelectedPage] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Extract raw text streams from PDF array buffer safely in browser
  const extractTextFromPdfBuffer = async (buffer: ArrayBuffer): Promise<string[]> => {
    try {
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();
      const extractedPages: string[] = [];

      // Convert buffer to string bytes to search PDF text stream tokens (BT ... ET, Tj, TJ)
      const uint8 = new Uint8Array(buffer);
      const decoder = new TextDecoder('latin1');
      const rawPdfString = decoder.decode(uint8);

      // Extract streams
      const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
      let match;
      const textChunks: string[] = [];

      while ((match = streamRegex.exec(rawPdfString)) !== null) {
        const streamData = match[1];
        // Match string literals inside parentheses or hex inside angle brackets
        const textTokens = streamData.match(/\(([^)]+)\)\s*(?:Tj|'|")/g) || [];
        const tjArrayTokens = streamData.match(/\[([^\]]+)\]\s*TJ/g) || [];

        let streamText = '';
        for (const token of textTokens) {
          const clean = token.replace(/^\(/, '').replace(/\)\s*(?:Tj|'|")$/, '');
          // unescape standard PDF escapes
          const unescaped = clean
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\(/g, '(')
            .replace(/\\\)/g, ')')
            .replace(/\\\\/g, '\\');
          streamText += unescaped + ' ';
        }

        for (const arrayToken of tjArrayTokens) {
          const innerMatches = arrayToken.match(/\(([^)]+)\)/g) || [];
          for (const m of innerMatches) {
            const clean = m.slice(1, -1);
            streamText += clean + ' ';
          }
        }

        if (streamText.trim()) {
          textChunks.push(streamText.trim());
        }
      }

      // If streams yielded text, distribute roughly or map page by page
      if (textChunks.length > 0) {
        const chunkSize = Math.max(1, Math.ceil(textChunks.length / totalPages));
        for (let i = 0; i < totalPages; i++) {
          const slice = textChunks.slice(i * chunkSize, (i + 1) * chunkSize);
          const pageStr = slice.join('\n\n') || `[Page ${i + 1} — No direct text layer detected. Use OCR tool if this is a scanned graphic.]`;
          extractedPages.push(pageStr);
        }
      } else {
        // Fallback: search for general parenthesized text strings in document
        const allParentheses = rawPdfString.match(/\(([A-Za-z0-9 .,:;!?'"()_@#%&*+-]{3,})\)/g) || [];
        const cleanStrings = allParentheses
          .map((s) => s.slice(1, -1))
          .filter((s) => !s.startsWith('/Font') && !s.startsWith('Identity') && !s.includes('Adobe'));

        if (cleanStrings.length > 0) {
          const combined = cleanStrings.join(' ');
          extractedPages.push(combined);
        } else {
          for (let i = 0; i < totalPages; i++) {
            extractedPages.push(`[Page ${i + 1} text stream is encoded or rasterized. If this document was scanned from paper, please use Toolora's OCR Tool for optical recognition.]`);
          }
        }
      }

      return extractedPages;
    } catch (err) {
      console.error('PDF parsing error:', err);
      throw new Error('Could not parse PDF text streams. File might be protected or non-standard.');
    }
  };

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setErrorText('Please upload a valid PDF document (.pdf).');
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    setErrorText('');
    setProgressText('Decompiling PDF text objects in local memory...');

    try {
      const buffer = await selectedFile.arrayBuffer();
      const rawPages = await extractTextFromPdfBuffer(buffer);

      const parsed: PageText[] = rawPages.map((txt, idx) => {
        const words = txt.trim().split(/\s+/).filter(Boolean).length;
        const chars = txt.length;
        return {
          pageNumber: idx + 1,
          text: txt,
          wordCount: words,
          charCount: chars,
        };
      });

      setPages(parsed);
      setSelectedPage('all');

      addHistoryItem(
        'pdf-to-text',
        'PDF to Text',
        selectedFile.name,
        `${parsed.length} Pages`,
        ''
      );

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err: any) {
      setErrorText(err?.message || 'Failed to extract text from PDF.');
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  const totalWords = useMemo(() => pages.reduce((acc, p) => acc + p.wordCount, 0), [pages]);
  const totalChars = useMemo(() => pages.reduce((acc, p) => acc + p.charCount, 0), [pages]);
  const estReadMinutes = useMemo(() => Math.max(1, Math.ceil(totalWords / 200)), [totalWords]);

  const activeText = useMemo(() => {
    if (pages.length === 0) return '';
    if (selectedPage === 'all') {
      return pages
        .map((p) => `--- Page ${p.pageNumber} ---\n\n${p.text}`)
        .join('\n\n\n');
    }
    const target = pages.find((p) => p.pageNumber === selectedPage);
    return target ? target.text : '';
  }, [pages, selectedPage]);

  const highlightedText = useMemo(() => {
    if (!searchQuery.trim()) return activeText;
    const parts = activeText.split(new RegExp(`(${searchQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi'));
    return parts;
  }, [activeText, searchQuery]);

  const copyToClipboard = () => {
    if (!activeText) return;
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const downloadText = (format: 'txt' | 'md' | 'json') => {
    if (!file || pages.length === 0) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    let blob: Blob;
    let filename: string;

    if (format === 'txt') {
      blob = new Blob([activeText], { type: 'text/plain;charset=utf-8' });
      filename = `${baseName}_extracted.txt`;
    } else if (format === 'md') {
      const mdContent = `# Extracted Text: ${file.name}\n\n*Total Pages: ${pages.length} | Word Count: ${totalWords}*\n\n${activeText}`;
      blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8' });
      filename = `${baseName}_extracted.md`;
    } else {
      const jsonData = {
        sourceDocument: file.name,
        extractedAt: new Date().toISOString(),
        totalPages: pages.length,
        totalWords,
        totalChars,
        pages: pages.map((p) => ({
          pageNumber: p.pageNumber,
          wordCount: p.wordCount,
          characterCount: p.charCount,
          content: p.text,
        })),
      };
      blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8' });
      filename = `${baseName}_extracted.json`;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetAll = () => {
    setFile(null);
    setPages([]);
    setSelectedPage('all');
    setSearchQuery('');
    setErrorText('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 text-left">
      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#1E293B]">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
              <FileText className="w-5 h-5" />
            </span>
            <span>PDF to Text Decompiler</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Extract text streams, tables, and unformatted content directly in your browser without uploading files.
          </p>
        </div>

        {file && (
          <button
            onClick={resetAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset File</span>
          </button>
        )}
      </div>

      {/* ── ERROR BANNER ─────────────────────────────────────────────────── */}
      {errorText && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-medium">
          {errorText}
        </div>
      )}

      {/* ── UPLOAD DROPZONE ───────────────────────────────────────────────── */}
      {!file && (
        <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-400 rounded-2xl p-8 sm:p-12 text-center transition-all bg-slate-50/50 dark:bg-[#131B2E]/50">
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="pdf-to-text-input"
          />
          <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shadow-xs">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">
                Choose a PDF file or drag & drop here
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500 mt-1">
                Decompiles all document strings 100% inside client-side memory
              </p>
            </div>
            <span className="inline-block px-3.5 py-1.5 text-[11px] font-bold rounded-lg bg-orange-600 text-white shadow-xs">
              Select PDF Document
            </span>
          </div>
        </div>
      )}

      {/* ── LOADING STATE ─────────────────────────────────────────────────── */}
      {loading && (
        <div className="p-10 text-center rounded-2xl bg-slate-50 dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] space-y-3">
          <div className="w-8 h-8 rounded-full border-3 border-orange-600 dark:border-orange-400 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">{progressText}</p>
        </div>
      )}

      {/* ── MAIN CONTENT WORKSPACE ────────────────────────────────────────── */}
      {file && pages.length > 0 && (
        <div className="space-y-5">
          {/* ── STATS BAR ──────────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
              <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-xs">
                <Layers className="w-4 h-4 text-orange-500" />
                <span>Pages</span>
              </div>
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-1">
                {pages.length}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
              <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-xs">
                <BookOpen className="w-4 h-4 text-emerald-500" />
                <span>Total Words</span>
              </div>
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-1">
                {totalWords.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
              <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-xs">
                <Hash className="w-4 h-4 text-amber-500" />
                <span>Characters</span>
              </div>
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-1">
                {totalChars.toLocaleString()}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
              <div className="flex items-center gap-2 text-slate-400 dark:text-zinc-500 text-xs">
                <Clock className="w-4 h-4 text-purple-500" />
                <span>Read Time</span>
              </div>
              <p className="text-lg font-black text-slate-800 dark:text-zinc-100 mt-1">
                ~{estReadMinutes} min
              </p>
            </div>
          </div>

          {/* ── TOOLBAR CONTROLS ───────────────────────────────────────────── */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs">
            {/* Page Selector Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedPage('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  selectedPage === 'all'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                All Pages ({pages.length})
              </button>
              {pages.map((p) => (
                <button
                  key={p.pageNumber}
                  onClick={() => setSelectedPage(p.pageNumber)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    selectedPage === p.pageNumber
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  Page {p.pageNumber}
                </button>
              ))}
            </div>

            {/* Search filter */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search text in page..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8.5 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-zinc-200 focus:outline-hidden focus:border-orange-500"
              />
            </div>
          </div>

          {/* ── TEXT DISPLAY AREA ──────────────────────────────────────────── */}
          <div className="relative rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-[#1E293B]">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-zinc-400">
                {selectedPage === 'all' ? `All Pages View (${pages.length})` : `Viewing Page ${selectedPage}`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-zinc-300 hover:border-orange-500 transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-zinc-200 whitespace-pre-wrap selection:bg-orange-500/20">
              {typeof highlightedText === 'string' ? (
                highlightedText || <span className="text-slate-400 italic">No text found.</span>
              ) : (
                highlightedText.map((chunk, idx) =>
                  chunk.toLowerCase() === searchQuery.toLowerCase() ? (
                    <mark key={idx} className="bg-amber-300 dark:bg-amber-500/40 text-slate-900 dark:text-zinc-100 rounded-xs px-0.5 font-bold">
                      {chunk}
                    </mark>
                  ) : (
                    <span key={idx}>{chunk}</span>
                  )
                )
              )}
            </div>
          </div>

          {/* ── EXPORT BUTTONS ─────────────────────────────────────────────── */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                Export Decompiled Text
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Save directly to your local file system
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => downloadText('txt')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save .TXT</span>
              </button>

              <button
                onClick={() => downloadText('md')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                <FileCode className="w-4 h-4" />
                <span>Save Markdown</span>
              </button>

              <button
                onClick={() => downloadText('json')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-slate-700 transition-all active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Save JSON</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
