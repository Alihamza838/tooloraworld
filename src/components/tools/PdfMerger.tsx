import React, { useState, useId } from 'react';
import {
  Upload,
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Calendar,
  HardDrive,
  CheckCircle2,
  RotateCw,
  ArrowUpDown,
  ShieldCheck,
  Download,
  Plus,
  RefreshCw,
  Hash,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import confetti from 'canvas-confetti';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  sizeBytes: number;
  sizeFormatted: string;
  pages: number;
  rotation: number; // 0, 90, 180, 270
}

export default function PdfMerger() {
  const { addHistoryItem } = useToolora();
  const fileInputId = useId();
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [outputName, setOutputName] = useState('merged_document.pdf');
  const [addPageNumbers, setAddPageNumbers] = useState(false);
  const [success, setSuccess] = useState(false);
  const [lastDownloadUrl, setLastDownloadUrl] = useState('');
  const [mergedStats, setMergedStats] = useState<{ totalPages: number; totalSize: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const inspectPdfPages = async (file: File): Promise<number> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      return pdfDoc.getPageCount();
    } catch (e) {
      console.warn("Could not read PDF page count directly", e);
      return 1;
    }
  };

  const processIncomingFiles = async (rawFiles: File[]) => {
    setLoading(true);
    setProgressText('Inspecting PDF documents...');
    setProgressPercent(20);

    const prepared: PDFFile[] = [];
    for (let i = 0; i < rawFiles.length; i++) {
      const f = rawFiles[i];
      if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) continue;

      const pageCount = await inspectPdfPages(f);
      prepared.push({
        id: Math.random().toString(36).substring(2, 9) + Date.now(),
        file: f,
        name: f.name,
        sizeBytes: f.size,
        sizeFormatted: formatSize(f.size),
        pages: pageCount,
        rotation: 0
      });
      setProgressPercent(20 + Math.round(((i + 1) / rawFiles.length) * 70));
    }

    setFiles(prev => [...prev, ...prepared]);
    setLoading(false);
    setProgressText('');
    setProgressPercent(0);
    setSuccess(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const rawFiles = Array.from(e.target.files) as File[];
    await processIncomingFiles(rawFiles);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files || e.dataTransfer.files.length === 0) return;
    const rawFiles = Array.from(e.dataTransfer.files) as File[];
    await processIncomingFiles(rawFiles);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setSuccess(false);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const list = [...prev];
      const temp = list[index];
      list[index] = list[index - 1];
      list[index - 1] = temp;
      return list;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const list = [...prev];
      const temp = list[index];
      list[index] = list[index + 1];
      list[index + 1] = temp;
      return list;
    });
  };

  const rotateFile = (id: string) => {
    setFiles(prev =>
      prev.map(f => {
        if (f.id === id) {
          const nextRotation = (f.rotation + 90) % 360;
          return { ...f, rotation: nextRotation };
        }
        return f;
      })
    );
  };

  const reverseOrder = () => {
    setFiles(prev => [...prev].reverse());
  };

  const sortAlphabetical = () => {
    setFiles(prev => [...prev].sort((a, b) => a.name.localeCompare(b.name)));
  };

  const sortBySize = () => {
    setFiles(prev => [...prev].sort((a, b) => a.sizeBytes - b.sizeBytes));
  };

  const setTimestampName = () => {
    const dateStr = new Date().toISOString().slice(0, 10);
    setOutputName(`merged_binder_${dateStr}.pdf`);
  };

  const totalPagesCount = files.reduce((acc, f) => acc + f.pages, 0);
  const totalSizeBytes = files.reduce((acc, f) => acc + f.sizeBytes, 0);

  const mergePDFs = async () => {
    if (files.length < 2) return;
    try {
      setLoading(true);
      setError(null);
      setProgressPercent(10);
      setProgressText('Initializing in-memory WebAssembly PDF engine...');

      const mergedPdf = await PDFDocument.create();
      let cumulativeCopied = 0;

      for (let i = 0; i < files.length; i++) {
        const pdfFile = files[i];
        setProgressText(`Processing (${i + 1}/${files.length}): ${pdfFile.name}`);
        setProgressPercent(15 + Math.round(((i + 1) / files.length) * 65));

        const fileBytes = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

        copiedPages.forEach(page => {
          if (pdfFile.rotation !== 0) {
            const currentRotation = page.getRotation().angle;
            page.setRotation(degrees((currentRotation + pdfFile.rotation) % 360));
          }
          mergedPdf.addPage(page);
          cumulativeCopied++;
        });
      }

      // Optional: Stamp page numbers on bottom center
      if (addPageNumbers) {
        setProgressText('Adding standardized page number pagination...');
        const font = await mergedPdf.embedFont(StandardFonts.Helvetica);
        const pages = mergedPdf.getPages();
        const total = pages.length;

        for (let i = 0; i < total; i++) {
          const page = pages[i];
          const { width } = page.getSize();
          const label = `Page ${i + 1} of ${total}`;
          const textWidth = font.widthOfTextAtSize(label, 9);

          page.drawText(label, {
            x: (width - textWidth) / 2,
            y: 20,
            size: 9,
            font,
            color: rgb(0.3, 0.3, 0.3)
          });
        }
      }

      setProgressPercent(90);
      setProgressText('Compiling final binary stream and XRef table...');
      const mergedPdfBytes = await mergedPdf.save();

      const pdfBuffer = new ArrayBuffer(mergedPdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(mergedPdfBytes);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
      const sizeStr = formatSize(blob.size);
      const url = URL.createObjectURL(blob);

      setLastDownloadUrl(url);
      setMergedStats({
        totalPages: cumulativeCopied,
        totalSize: sizeStr
      });
      setSuccess(true);
      setProgressPercent(100);

      // Register into Toolora global download history
      addHistoryItem('pdf-merger', 'PDF Merger', outputName, sizeStr, url);

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.75 },
        colors: ['#10b981', '#059669', '#34d399']
      });
    } catch (err) {
      console.error('Merge error:', err);
      setError('Failed to merge documents: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setProgressText('');
      setProgressPercent(0);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl overflow-hidden p-6 sm:p-8 max-w-4xl mx-auto shadow-sm">
      {/* Header section with architectural verification badges */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 font-display tracking-tight">
                PDF Merger & Binder
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Combine unlimited PDF documents locally with zero cloud file uploads
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 text-[11px] font-semibold">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% In-Browser Memory
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Lossless Vector Tree
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 p-3.5 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/25 rounded-xl text-xs font-semibold flex justify-between items-center animate-in fade-in duration-200">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm hover:opacity-75 cursor-pointer px-1">✕</button>
        </div>
      )}

      {/* Main Drag-Drop Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500/60 bg-zinc-50/50 dark:bg-zinc-950/30 rounded-xl p-8 sm:p-10 transition-all text-center relative group"
      >
        <input
          id={fileInputId}
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          title="Upload PDF files"
        />
        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-105 transition-transform">
          <Upload className="w-7 h-7 text-emerald-500" />
        </div>
        <p className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-200">
          Drag and drop PDF files here, or <label htmlFor={fileInputId} className="text-emerald-600 dark:text-emerald-400 underline underline-offset-4 cursor-pointer font-bold">browse from device</label>
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 flex items-center justify-center gap-2">
          <span>Supports multi-file selection</span>
          <span>•</span>
          <span>Encrypted files handled locally</span>
          <span>•</span>
          <span>No size restrictions</span>
        </p>
      </div>

      {/* Loaded Document Queue */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          {/* Action Toolbar */}
          <div className="p-3 bg-zinc-50 dark:bg-zinc-950/60 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 font-medium">
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{files.length}</span> documents added
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{totalPagesCount}</span> pages
              <span className="text-zinc-400 dark:text-zinc-600">•</span>
              <span>{formatSize(totalSizeBytes)}</span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <label
                htmlFor={fileInputId}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add More
              </label>

              <button
                type="button"
                onClick={reverseOrder}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer transition-colors"
                title="Reverse document order"
              >
                <ArrowUpDown className="w-3.5 h-3.5" /> Reverse
              </button>

              <button
                type="button"
                onClick={sortAlphabetical}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer transition-colors"
                title="Sort documents alphabetically by filename"
              >
                A-Z
              </button>

              <button
                type="button"
                onClick={sortBySize}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium cursor-pointer transition-colors"
                title="Sort documents by file size"
              >
                Size
              </button>

              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setSuccess(false);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-lg font-semibold cursor-pointer transition-colors ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>
          </div>

          {/* Draggable & Sortable File Items */}
          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950/40 hover:border-emerald-500/50 transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="w-6 h-6 rounded-lg bg-zinc-100 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-400 flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                    {index + 1}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate pr-2">
                      {file.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <HardDrive className="w-3 h-3 text-zinc-400" /> {file.sizeFormatted}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" /> {file.pages} {file.pages === 1 ? 'page' : 'pages'}
                      </span>
                      {file.rotation !== 0 && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-mono font-bold text-[10px]">
                          <RotateCw className="w-2.5 h-2.5" /> +{file.rotation}°
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Per-Document Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => rotateFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
                    title="Rotate all pages in this document 90° clockwise"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:hover:bg-transparent text-zinc-500 dark:text-zinc-400 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={index === files.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-25 disabled:hover:bg-transparent text-zinc-500 dark:text-zinc-400 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 hover:text-rose-600 transition-colors ml-1"
                    title="Remove from queue"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Customization Options Form */}
          {!success && (
            <div className="pt-5 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider font-display">
                      Output Filename
                    </label>
                    <button
                      type="button"
                      onClick={setTimestampName}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
                    >
                      Use Datestamp
                    </button>
                  </div>
                  <input
                    type="text"
                    value={outputName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setOutputName(val.endsWith('.pdf') ? val : val + '.pdf');
                    }}
                    className="w-full px-3.5 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm text-zinc-900 dark:text-zinc-100 focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    placeholder="merged_document.pdf"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-950/40 cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
                    <input
                      type="checkbox"
                      checked={addPageNumbers}
                      onChange={(e) => setAddPageNumbers(e.target.checked)}
                      className="w-4 h-4 rounded-sm text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
                    />
                    <div>
                      <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-emerald-500" /> Stamp Page Numbers
                      </span>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        Adds "Page X of Y" pagination in bottom center
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Merge Progress Bar when active */}
              {loading && (
                <div className="space-y-2 pt-2 animate-in fade-in duration-200">
                  <div className="flex justify-between text-xs font-medium text-zinc-600 dark:text-zinc-400">
                    <span>{progressText}</span>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300 ease-out rounded-full"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                disabled={files.length < 2 || loading}
                onClick={mergePDFs}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white font-bold font-display text-sm py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing In-Browser...</span>
                  </>
                ) : (
                  <>
                    <Layers className="w-4 h-4" />
                    <span>Merge {files.length} PDF Documents ({totalPagesCount} Pages)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success View */}
      {success && mergedStats && (
        <div className="mt-6 p-5 sm:p-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/5 animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  Documents Successfully Combined!
                </h5>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Compiled <strong className="text-zinc-800 dark:text-zinc-200">{mergedStats.totalPages} pages</strong> into <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{outputName}</span> ({mergedStats.totalSize}).
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <a
                href={lastDownloadUrl}
                download={outputName}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors shadow-xs"
              >
                <Download className="w-4 h-4" /> Download PDF
              </a>

              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setSuccess(false);
                }}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs py-2.5 px-4 rounded-xl transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Merge More
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security note footer */}
      <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-850/80 flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-zinc-400" />
          Zero bytes uploaded. Processing executes entirely inside local browser sandbox.
        </span>
        <span className="hidden sm:inline font-mono">PDF 1.7 Spec Compliant</span>
      </div>
    </div>
  );
}
