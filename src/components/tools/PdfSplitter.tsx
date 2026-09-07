import React, { useState } from 'react';
import { Upload, File, FileCode2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

export default function PdfSplitter() {
  const { addHistoryItem } = useToolora();
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [rangeStr, setRangeStr] = useState('1');
  const [outputName, setOutputName] = useState('split_document.pdf');
  const [success, setSuccess] = useState(false);
  const [lastDownloadUrl, setLastDownloadUrl] = useState('');
  const [errorText, setErrorText] = useState('');

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const f = e.target.files[0];
    if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) return;

    setLoading(true);
    setProgressText('Inspecting PDF page configurations...');
    setErrorText('');

    try {
      const arrayBuffer = await f.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setFile(f);
      setRangeStr(`1-${Math.min(count, 3)}`);
      setOutputName(f.name.replace('.pdf', '') + '_extracted.pdf');
    } catch (err) {
      console.error(err);
      setErrorText('Could not parse PDF. Password-protected or corrupted file.');
    } finally {
      setLoading(false);
      setProgressText('');
      setSuccess(false);
    }
  };

  const parseRanges = (str: string, maxPages: number): number[] => {
    const pages: Set<number> = new Set();
    const parts = str.split(',');

    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const min = Math.max(1, Math.min(start, end));
          const max = Math.min(maxPages, Math.max(start, end));
          for (let i = min; i <= max; i++) {
            pages.add(i);
          }
        }
      } else {
        const val = parseInt(trimmed, 10);
        if (!isNaN(val) && val >= 1 && val <= maxPages) {
          pages.add(val);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const executeSplit = async () => {
    if (!file || pageCount === 0) return;
    setErrorText('');

    const targetPages = parseRanges(rangeStr, pageCount);
    if (targetPages.length === 0) {
      setErrorText('Please specify a valid page range (e.g., "1-2" or "1, 3, 5") matching the page numbers available.');
      return;
    }

    try {
      setLoading(true);
      setProgressText(`Extracting ${targetPages.length} pages client-side...`);

      const srcBytes = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(srcBytes, { ignoreEncryption: true });
      const dstDoc = await PDFDocument.create();

      // pdf-lib page indices are 0-based, targetPages values are 1-based
      const indicesToCopy = targetPages.map(page => page - 1);
      const copiedPages = await dstDoc.copyPages(srcDoc, indicesToCopy);
      copiedPages.forEach(p => dstDoc.addPage(p));

      const splitBytes = await dstDoc.save();
      const blob = new Blob([splitBytes], { type: 'application/pdf' });
      const sizeStr = formatSize(blob.size);
      const url = URL.createObjectURL(blob);

      setLastDownloadUrl(url);
      setSuccess(true);
      addHistoryItem('pdf-splitter', 'PDF Splitter', outputName, sizeStr, url);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error(err);
      setErrorText('Failed to split document: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-3xl mx-auto shadow-xs">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">PDF Splitter & page Extractor</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Extract specific ranges or pages into a brand new standalone file instantly. Pure safe offline assembly.
        </p>
      </div>

      {!file ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-lg p-10 transition-colors text-center cursor-pointer relative">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-sans">
            Choose a PDF document to begin
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">File remains entirely on your local browser cache.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-100 dark:border-zinc-800 rounded-lg">
            <FileCode2 className="w-8 h-8 text-emerald-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate">{file.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Size: <span className="font-mono">{formatSize(file.size)}</span> • Pages: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{pageCount} total</span>
              </p>
            </div>
            <button
              onClick={() => {
                setFile(null);
                setSuccess(false);
              }}
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-500 underline"
            >
              Reset File
            </button>
          </div>

          {/* Range Configuration Drawer */}
          {!success && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-display">
                    Pages to Extract
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1-3, 5, 7"
                    value={rangeStr}
                    onChange={(e) => setRangeStr(e.target.value)}
                    className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-200 outline-hidden focus:border-emerald-500 focus:dark:border-emerald-550"
                  />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5 leading-relaxed">
                    Use commas and dash hyphen lines. Example: <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">1-4, 6</span> page sets. Max {pageCount}.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2 font-display">
                    Output Name
                  </label>
                  <input
                    type="text"
                    placeholder="split_document.pdf"
                    value={outputName}
                    onChange={(e) => setOutputName(e.target.value.endsWith('.pdf') ? e.target.value : e.target.value + '.pdf')}
                    className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-200 outline-hidden focus:border-emerald-500 focus:dark:border-emerald-550"
                  />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1.5">
                    Save location handles download.
                  </p>
                </div>
              </div>

              {errorText && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-lg flex items-center gap-2 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorText}</span>
                </div>
              )}

              <button
                disabled={loading}
                onClick={executeSplit}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-35 font-bold font-display text-white text-sm py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center"
              >
                {loading ? progressText : 'Split & Download PDF'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Drawer */}
      {success && (
        <div className="mt-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 animate-in fade-in-50 slide-in-from-bottom-2 duration-150">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="flex-1">
              <h5 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Successfully Extracted!</h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Extracted pages <strong className="font-bold">{rangeStr}</strong> merged into <strong className="font-bold">{outputName}</strong>. Safe offline save.
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href={lastDownloadUrl}
                  download={outputName}
                  className="bg-emerald-500 hover:bg-emerald-600 font-bold font-display text-white text-xs px-3.5 py-2 rounded-lg transition-colors inline-block text-center"
                >
                  Download File
                </a>
                <button
                  onClick={() => {
                    setFile(null);
                    setSuccess(false);
                    setErrorText('');
                  }}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 font-bold font-display text-zinc-700 dark:text-zinc-300 text-xs px-3.5 py-2 rounded-lg transition-colors"
                >
                  Split Another
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
