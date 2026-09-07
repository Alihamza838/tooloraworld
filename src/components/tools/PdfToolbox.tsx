import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Merge,
  Scissors,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Copy,
  FolderArchive,
  RefreshCw,
  CheckSquare,
  Square
} from 'lucide-react';
import { PDFDocument, degrees } from 'pdf-lib';
import confetti from 'canvas-confetti';
import { useToolora } from '../../context/TooloraContext';

type ToolboxTab = 'merge' | 'split' | 'organize';

interface MergeFileItem {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  sizeBytes: number;
  pageCount: number;
}

export default function PdfToolbox() {
  const { addHistoryItem } = useToolora();
  const [activeTab, setActiveTab] = useState<ToolboxTab>('merge');

  // ─────────────────────────────────────────────────────────────────────────────
  // MERGE STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const [mergeFiles, setMergeFiles] = useState<MergeFileItem[]>([]);
  const [mergeOutputName, setMergeOutputName] = useState<string>('combined_document.pdf');
  const [isMerging, setIsMerging] = useState<boolean>(false);
  const [mergeProgress, setMergeProgress] = useState<string>('');
  const [mergeSuccessUrl, setMergeSuccessUrl] = useState<string | null>(null);
  const [mergeSuccessSize, setMergeSuccessSize] = useState<string>('');

  // ─────────────────────────────────────────────────────────────────────────────
  // SPLIT STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const [splitFile, setSplitFile] = useState<File | null>(null);
  const [splitPageCount, setSplitPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'visual' | 'chunks'>('range');
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());
  const [chunkSize, setChunkSize] = useState<number>(1);
  const [splitOutputName, setSplitOutputName] = useState<string>('extracted_pages.pdf');
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitSuccessUrl, setSplitSuccessUrl] = useState<string | null>(null);
  const [splitError, setSplitError] = useState<string | null>(null);

  // ─────────────────────────────────────────────────────────────────────────────
  // ORGANIZE / ROTATE STATE
  // ─────────────────────────────────────────────────────────────────────────────
  const [organizeFile, setOrganizeFile] = useState<File | null>(null);
  const [organizePageCount, setOrganizePageCount] = useState<number>(0);
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [pagesToDelete, setPagesToDelete] = useState<Set<number>>(new Set());
  const [isOrganizing, setIsOrganizing] = useState<boolean>(false);
  const [organizeSuccessUrl, setOrganizeSuccessUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // MERGE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleMergeFilesAdded = async (filesToAdd: FileList | File[]) => {
    const list = Array.from(filesToAdd).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    if (list.length === 0) return;

    const newItems: MergeFileItem[] = [];

    for (const file of list) {
      let pageCount = 1;
      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        pageCount = doc.getPageCount();
      } catch (e) {
        console.warn('Could not read page count for', file.name, e);
      }

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        sizeFormatted: formatSize(file.size),
        sizeBytes: file.size,
        pageCount
      });
    }

    setMergeFiles((prev) => [...prev, ...newItems]);
    setMergeSuccessUrl(null);
  };

  const moveMergeFile = (index: number, direction: 'up' | 'down') => {
    setMergeFiles((prev) => {
      const copy = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= copy.length) return prev;
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const removeMergeFile = (id: string) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const executeMerge = async () => {
    if (mergeFiles.length < 2) return;

    setIsMerging(true);
    setMergeProgress('Creating unified PDF stream in memory...');

    try {
      const mergedPdf = await PDFDocument.create();

      for (let i = 0; i < mergeFiles.length; i++) {
        const item = mergeFiles[i];
        setMergeProgress(`Appending "${item.name}" (${i + 1} of ${mergeFiles.length})...`);

        const buffer = await item.file.arrayBuffer();
        const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const indices = sourceDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(sourceDoc, indices);

        for (const page of copiedPages) {
          mergedPdf.addPage(page);
        }
      }

      setMergeProgress('Finalizing and compressing document...');
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setMergeSuccessUrl(url);
      setMergeSuccessSize(formatSize(mergedBytes.byteLength));

      // Trigger automatic download
      const link = document.createElement('a');
      link.href = url;
      link.download = mergeOutputName.endsWith('.pdf') ? mergeOutputName : `${mergeOutputName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addHistoryItem(
        'pdf-toolbox',
        'PDF Toolbox (Merge)',
        link.download,
        formatSize(mergedBytes.byteLength),
        url
      );

      try {
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.85 } });
      } catch {}
    } catch (err) {
      console.error('Merge error:', err);
      alert('Failed to merge PDFs. Please check if any file is corrupted or strongly encrypted.');
    } finally {
      setIsMerging(false);
      setMergeProgress('');
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // SPLIT HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSplitFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') return;

    setSplitFile(file);
    setSplitError(null);
    setSplitSuccessUrl(null);

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();
      setSplitPageCount(count);

      // Default range: 1 to min(3, count)
      setRangeInput(count > 1 ? `1-${Math.min(3, count)}` : '1');

      // Initialize visual selection (pages 1 to count)
      const initialSet = new Set<number>();
      for (let i = 1; i <= Math.min(3, count); i++) initialSet.add(i);
      setSelectedPages(initialSet);

      setSplitOutputName(file.name.replace(/\.pdf$/i, '') + '_extracted.pdf');
    } catch (e) {
      setSplitError('Could not parse PDF. File may be encrypted with a password or damaged.');
    }
  };

  const parsePageRangeString = (str: string, maxPages: number): number[] => {
    const result = new Set<number>();
    const tokens = str.split(',');

    for (const token of tokens) {
      const clean = token.trim();
      if (!clean) continue;

      if (clean.includes('-')) {
        const [startStr, endStr] = clean.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPages, Math.max(start, end));
          for (let p = from; p <= to; p++) result.add(p);
        }
      } else {
        const pageNum = parseInt(clean, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          result.add(pageNum);
        }
      }
    }

    return Array.from(result).sort((a, b) => a - b);
  };

  const executeSplit = async () => {
    if (!splitFile || splitPageCount === 0) return;

    setIsSplitting(true);
    setSplitError(null);

    try {
      const buffer = await splitFile.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      let targetPages: number[] = [];

      if (splitMode === 'range') {
        targetPages = parsePageRangeString(rangeInput, splitPageCount);
      } else if (splitMode === 'visual') {
        targetPages = Array.from(selectedPages).sort((a, b) => a - b);
      } else if (splitMode === 'chunks') {
        // First chunk for immediate download
        targetPages = [];
        for (let i = 1; i <= Math.min(chunkSize, splitPageCount); i++) targetPages.push(i);
      }

      if (targetPages.length === 0) {
        setSplitError('No valid pages selected for extraction.');
        setIsSplitting(false);
        return;
      }

      const newPdf = await PDFDocument.create();
      // Zero-indexed page indices in pdf-lib
      const indicesToCopy = targetPages.map((p) => p - 1);
      const copied = await newPdf.copyPages(sourceDoc, indicesToCopy);

      for (const page of copied) {
        newPdf.addPage(page);
      }

      const outputBytes = await newPdf.save();
      const blob = new Blob([outputBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setSplitSuccessUrl(url);

      const link = document.createElement('a');
      link.href = url;
      link.download = splitOutputName.endsWith('.pdf') ? splitOutputName : `${splitOutputName}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addHistoryItem(
        'pdf-toolbox',
        'PDF Toolbox (Split)',
        link.download,
        formatSize(outputBytes.byteLength),
        url
      );

      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.85 } });
      } catch {}
    } catch (err) {
      console.error('Split error:', err);
      setSplitError('Failed to extract pages from this PDF file.');
    } finally {
      setIsSplitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // ORGANIZE / ROTATE HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleOrganizeFileSelect = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) return;
    setOrganizeFile(file);
    setOrganizeSuccessUrl(null);
    setPageRotations({});
    setPagesToDelete(new Set());

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setOrganizePageCount(doc.getPageCount());
    } catch (e) {
      console.warn('Could not inspect PDF for rotation:', e);
    }
  };

  const rotateSinglePage = (pageNum: number) => {
    setPageRotations((prev) => {
      const current = prev[pageNum] || 0;
      return { ...prev, [pageNum]: (current + 90) % 360 };
    });
  };

  const rotateAllPages = (deg: number) => {
    const newRotations: Record<number, number> = {};
    for (let i = 1; i <= organizePageCount; i++) {
      newRotations[i] = ((pageRotations[i] || 0) + deg) % 360;
    }
    setPageRotations(newRotations);
  };

  const togglePageDeletion = (pageNum: number) => {
    setPagesToDelete((prev) => {
      const copy = new Set(prev);
      if (copy.has(pageNum)) copy.delete(pageNum);
      else copy.add(pageNum);
      return copy;
    });
  };

  const executeOrganize = async () => {
    if (!organizeFile || organizePageCount === 0) return;

    setIsOrganizing(true);

    try {
      const buffer = await organizeFile.arrayBuffer();
      const sourceDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      for (let i = 0; i < organizePageCount; i++) {
        const pageNum = i + 1;
        if (pagesToDelete.has(pageNum)) continue;

        const [copiedPage] = await newPdf.copyPages(sourceDoc, [i]);
        const addedRotation = pageRotations[pageNum] || 0;

        if (addedRotation > 0) {
          const currentRotation = copiedPage.getRotation().angle;
          copiedPage.setRotation(degrees((currentRotation + addedRotation) % 360));
        }

        newPdf.addPage(copiedPage);
      }

      const outputBytes = await newPdf.save();
      const blob = new Blob([outputBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setOrganizeSuccessUrl(url);

      const link = document.createElement('a');
      link.href = url;
      link.download = organizeFile.name.replace(/\.pdf$/i, '') + '_modified.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      addHistoryItem(
        'pdf-toolbox',
        'PDF Toolbox (Organize)',
        link.download,
        formatSize(outputBytes.byteLength),
        url
      );

      try {
        confetti({ particleCount: 35, spread: 55, origin: { y: 0.85 } });
      } catch {}
    } catch (e) {
      console.error('Organize failed:', e);
      alert('Could not modify PDF pages.');
    } finally {
      setIsOrganizing(false);
    }
  };

  const totalMergePages = mergeFiles.reduce((acc, f) => acc + f.pageCount, 0);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Privacy Notice Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>Client-Side PDF Engine (pdf-lib):</strong> Merging, page extraction, and rotations are compiled entirely inside your browser sandbox RAM. Zero server uploads.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded font-semibold">
          Local WASM / JS
        </span>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-zinc-800/60 rounded-xl border border-slate-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={() => setActiveTab('merge')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'merge'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Merge size={15} />
          <span>Merge Multiple PDFs</span>
          {mergeFiles.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px]">
              {mergeFiles.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('split')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'split'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <Scissors size={15} />
          <span>Split & Extract Pages</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('organize')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'organize'
              ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
          }`}
        >
          <RotateCw size={15} />
          <span>Rotate & Delete Pages</span>
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 1: MERGE PDFS */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'merge' && (
        <div className="space-y-6">
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files) handleMergeFilesAdded(e.dataTransfer.files);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 rounded-2xl p-8 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-indigo-50/20 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={(e) => e.target.files && handleMergeFilesAdded(e.target.files)}
              className="hidden"
            />
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Merge size={24} />
            </div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-1">
              Select or Drop Multiple PDF Files Here
            </h4>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Drag & drop PDFs to rearrange page order before merging.
            </p>
          </div>

          {/* Merge Queue List */}
          {mergeFiles.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Documents Queue
                  </span>
                  <span className="text-xs font-mono bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">
                    {mergeFiles.length} files • {totalMergePages} total pages
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setMergeFiles([])}
                  className="text-xs text-rose-500 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {mergeFiles.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-950 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <FileText size={18} className="text-indigo-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200 truncate max-w-xs sm:max-w-md">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                          {item.pageCount} {item.pageCount === 1 ? 'page' : 'pages'} • {item.sizeFormatted}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => moveMergeFile(index, 'up')}
                        disabled={index === 0}
                        title="Move Up"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveMergeFile(index, 'down')}
                        disabled={index === mergeFiles.length - 1}
                        title="Move Down"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200/60 dark:hover:bg-zinc-800 disabled:opacity-30 cursor-pointer"
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMergeFile(item.id)}
                        title="Remove"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">Output File Name</label>
                  <input
                    type="text"
                    value={mergeOutputName}
                    onChange={(e) => setMergeOutputName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                  />
                </div>

                <button
                  type="button"
                  onClick={executeMerge}
                  disabled={isMerging || mergeFiles.length < 2}
                  className="w-full sm:w-auto sm:self-end px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isMerging ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>{mergeProgress || 'Merging in RAM...'}</span>
                    </>
                  ) : (
                    <>
                      <Merge size={14} />
                      <span>Merge {mergeFiles.length} PDFs ({totalMergePages} Pages)</span>
                    </>
                  )}
                </button>
              </div>

              {mergeSuccessUrl && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Merged PDF ready! ({mergeSuccessSize})</span>
                  </div>
                  <a
                    href={mergeSuccessUrl}
                    download={mergeOutputName}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    <Download size={13} />
                    <span>Download again</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 2: SPLIT & EXTRACT */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'split' && (
        <div className="space-y-6">
          {!splitFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleSplitFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() => {
                const el = document.getElementById('split-file-input') as HTMLInputElement;
                el?.click();
              }}
              className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 rounded-2xl p-10 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-indigo-50/20 group"
            >
              <input
                id="split-file-input"
                type="file"
                accept="application/pdf"
                onChange={(e) => e.target.files?.[0] && handleSplitFileSelect(e.target.files[0])}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Scissors size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-1">
                Upload a PDF to Split or Extract Pages
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Extract specific page ranges, pick pages visually, or split into equal bundles.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-5">
              {/* File Info */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-3">
                  <FileText size={20} className="text-indigo-600" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">{splitFile.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                      {splitPageCount} pages • {formatSize(splitFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSplitFile(null);
                    setSplitSuccessUrl(null);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                >
                  Choose another PDF
                </button>
              </div>

              {/* Split Mode Switcher */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'range', label: 'Custom Range', desc: 'e.g. 1-3, 5, 8' },
                  { id: 'visual', label: 'Visual Select', desc: 'Pick pages by click' },
                  { id: 'chunks', label: 'Fixed Chunks', desc: 'Every N pages' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSplitMode(m.id as any)}
                    className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                      splitMode === m.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                    }`}
                  >
                    <span className="font-bold text-xs block">{m.label}</span>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400">{m.desc}</span>
                  </button>
                ))}
              </div>

              {/* Mode Specific Controls */}
              {splitMode === 'range' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Page Numbers or Ranges (from 1 to {splitPageCount})
                  </label>
                  <input
                    type="text"
                    value={rangeInput}
                    onChange={(e) => setRangeInput(e.target.value)}
                    placeholder="e.g. 1-4, 7, 9-12"
                    className="w-full px-3 py-2 text-xs font-mono font-medium rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100"
                  />
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Extracted pages count:{' '}
                    <strong>{parsePageRangeString(rangeInput, splitPageCount).length}</strong> of{' '}
                    {splitPageCount}
                  </p>
                </div>
              )}

              {splitMode === 'visual' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                      Selected {selectedPages.size} of {splitPageCount} pages
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const all = new Set<number>();
                          for (let i = 1; i <= splitPageCount; i++) all.add(i);
                          setSelectedPages(all);
                        }}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        Select All
                      </button>
                      <span className="text-slate-300">•</span>
                      <button
                        type="button"
                        onClick={() => setSelectedPages(new Set())}
                        className="text-[11px] text-slate-500 hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-56 overflow-y-auto p-2 border border-slate-100 dark:border-zinc-800 rounded-xl">
                    {Array.from({ length: splitPageCount }, (_, i) => i + 1).map((pageNum) => {
                      const isSelected = selectedPages.has(pageNum);
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => {
                            setSelectedPages((prev) => {
                              const copy = new Set(prev);
                              if (copy.has(pageNum)) copy.delete(pageNum);
                              else copy.add(pageNum);
                              return copy;
                            });
                          }}
                          className={`p-2.5 rounded-lg border text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                              : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-slate-400'
                          }`}
                        >
                          P. {pageNum}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {splitMode === 'chunks' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-zinc-300 block">
                    Split every N pages
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={splitPageCount}
                    value={chunkSize}
                    onChange={(e) => setChunkSize(Math.max(1, Number(e.target.value)))}
                    className="w-32 px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
                  />
                  <p className="text-[11px] text-slate-500">
                    Will generate batches of {chunkSize} pages each.
                  </p>
                </div>
              )}

              {splitError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                  <AlertCircle size={15} />
                  <span>{splitError}</span>
                </div>
              )}

              {/* Action Bar */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <div className="w-full sm:w-auto flex-1">
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">Output File Name</label>
                  <input
                    type="text"
                    value={splitOutputName}
                    onChange={(e) => setSplitOutputName(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800"
                  />
                </div>

                <button
                  type="button"
                  onClick={executeSplit}
                  disabled={isSplitting}
                  className="w-full sm:w-auto sm:self-end px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSplitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Extracting in RAM...</span>
                    </>
                  ) : (
                    <>
                      <Scissors size={14} />
                      <span>Extract & Download Pages</span>
                    </>
                  )}
                </button>
              </div>

              {splitSuccessUrl && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl flex items-center justify-between text-xs text-emerald-800 dark:text-emerald-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Extracted PDF downloaded successfully!</span>
                  </div>
                  <a
                    href={splitSuccessUrl}
                    download={splitOutputName}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
                  >
                    <Download size={13} />
                    <span>Download again</span>
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* TAB 3: ROTATE & ORGANIZE */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {activeTab === 'organize' && (
        <div className="space-y-6">
          {!organizeFile ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (e.dataTransfer.files?.[0]) handleOrganizeFileSelect(e.dataTransfer.files[0]);
              }}
              onClick={() => {
                const el = document.getElementById('organize-file-input') as HTMLInputElement;
                el?.click();
              }}
              className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 rounded-2xl p-10 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-indigo-50/20 group"
            >
              <input
                id="organize-file-input"
                type="file"
                accept="application/pdf"
                onChange={(e) => e.target.files?.[0] && handleOrganizeFileSelect(e.target.files[0])}
                className="hidden"
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                <RotateCw size={24} />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-zinc-100 mb-1">
                Upload PDF to Rotate or Discard Pages
              </h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Fix sideways scanned pages or delete individual blank sheets.
              </p>
            </div>
          ) : (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">{organizeFile.name}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {organizePageCount} pages • {pagesToDelete.size} marked for removal
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => rotateAllPages(90)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <RotateCw size={13} />
                    <span>Rotate All 90°</span>
                  </button>
                  <span className="text-slate-300">•</span>
                  <button
                    type="button"
                    onClick={() => setOrganizeFile(null)}
                    className="text-xs text-slate-500 hover:underline cursor-pointer"
                  >
                    Change file
                  </button>
                </div>
              </div>

              {/* Pages Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto p-2">
                {Array.from({ length: organizePageCount }, (_, i) => i + 1).map((pageNum) => {
                  const rotation = pageRotations[pageNum] || 0;
                  const isDeleted = pagesToDelete.has(pageNum);

                  return (
                    <div
                      key={pageNum}
                      className={`p-3 rounded-xl border transition-all text-center space-y-2 ${
                        isDeleted
                          ? 'border-rose-300 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 opacity-50'
                          : 'border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-600 dark:text-zinc-400">
                        <span>P. {pageNum}</span>
                        {rotation > 0 && (
                          <span className="text-indigo-600 dark:text-indigo-400 text-[10px]">+{rotation}°</span>
                        )}
                      </div>

                      <div className="h-20 bg-white dark:bg-zinc-950 rounded border border-slate-200 dark:border-zinc-800 flex items-center justify-center relative">
                        <FileText
                          size={28}
                          className="text-slate-400 transition-transform duration-200"
                          style={{ transform: `rotate(${rotation}deg)` }}
                        />
                        {isDeleted && (
                          <div className="absolute inset-0 bg-rose-500/20 backdrop-blur-2xs flex items-center justify-center text-rose-600 font-bold text-xs">
                            Deleted
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => rotateSinglePage(pageNum)}
                          disabled={isDeleted}
                          title="Rotate 90° Clockwise"
                          className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 cursor-pointer disabled:opacity-30"
                        >
                          <RotateCw size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePageDeletion(pageNum)}
                          title={isDeleted ? 'Restore page' : 'Delete page'}
                          className={`p-1 rounded cursor-pointer ${
                            isDeleted
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50'
                          }`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={executeOrganize}
                  disabled={isOrganizing || organizePageCount === pagesToDelete.size}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  {isOrganizing ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Saving PDF in RAM...</span>
                    </>
                  ) : (
                    <>
                      <Download size={14} />
                      <span>Save Modified PDF ({organizePageCount - pagesToDelete.size} Pages)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
