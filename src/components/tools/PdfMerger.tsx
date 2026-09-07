import React, { useState } from 'react';
import { Upload, File, ArrowUp, ArrowDown, Trash2, Calendar, HardDrive, CheckCircle2 } from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: string;
  pages: number | string;
}

export default function PdfMerger() {
  const { addHistoryItem } = useToolora();
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [outputName, setOutputName] = useState('merged_document.pdf');
  const [success, setSuccess] = useState(false);
  const [lastDownloadUrl, setLastDownloadUrl] = useState('');
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
      return 1; // Fallback
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const rawFiles = Array.from(e.target.files) as File[];
    
    setLoading(true);
    setProgressText('Loading uploaded PDF documents...');
    
    const prepared: PDFFile[] = [];
    for (const f of rawFiles) {
      if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) continue;
      
      const pageCount = await inspectPdfPages(f);
      prepared.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: formatSize(f.size),
        pages: pageCount
      });
    }

    setFiles(prev => [...prev, ...prepared]);
    setLoading(false);
    setProgressText('');
    setSuccess(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;
    const rawFiles = Array.from(e.dataTransfer.files) as File[];
    
    setLoading(true);
    setProgressText('Scanning dropped PDF documents...');
    
    const prepared: PDFFile[] = [];
    for (const f of rawFiles) {
      if (f.type !== 'application/pdf' && !f.name.endsWith('.pdf')) continue;
      
      const pageCount = await inspectPdfPages(f);
      prepared.push({
        id: Math.random().toString(36).substring(2, 9),
        file: f,
        name: f.name,
        size: formatSize(f.size),
        pages: pageCount
      });
    }

    setFiles(prev => [...prev, ...prepared]);
    setLoading(false);
    setProgressText('');
    setSuccess(false);
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

  const mergePDFs = async () => {
    if (files.length < 2) return;
    try {
      setLoading(true);
      setProgressText('Merging documents client-side...');
      
      const mergedPdf = await PDFDocument.create();
      
      for (const pdfFile of files) {
        setProgressText(`Processing: ${pdfFile.name}...`);
        const fileBytes = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }
      
      setProgressText('Assembling final file components...');
      const mergedPdfBytes = await mergedPdf.save();
      
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const sizeStr = formatSize(blob.size);
      const url = URL.createObjectURL(blob);
      
      setLastDownloadUrl(url);
      setSuccess(true);
      
      // Auto register to global download logs
      addHistoryItem('pdf-merger', 'PDF Merger', outputName, sizeStr, url);
      
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch (err) {
      console.error(err);
      setError('Failed to merge documents: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-3xl mx-auto shadow-xs">
      {/* Header section info */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">PDF Merger</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Combine multiple PDF files into one clean document. Order them exactly as you need. Processing runs entirely in your browser.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/25 rounded-xl text-xs font-semibold flex justify-between items-center animate-in fade-in duration-200">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm hover:opacity-75 cursor-pointer px-1">✕</button>
        </div>
      )}

      {/* Main Drag-Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-lg p-8 transition-colors text-center cursor-pointer relative"
      >
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <Upload className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
          Drag and drop your PDF files here, or <span className="text-emerald-500">browse on device</span>
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Supports multiple file selections.</p>
      </div>

      {/* Files List & Controls */}
      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
              Added Files ({files.length})
            </h4>
            <button
              onClick={() => {
                setFiles([]);
                setSuccess(false);
              }}
              className="text-xs text-rose-500 hover:underline font-semibold font-display"
            >
              Remove All
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 group hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <File className="w-5 h-5 text-emerald-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate pr-4">{file.name}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                      <span className="flex items-center gap-1 font-mono">
                        <HardDrive className="w-3 h-3 text-zinc-400" /> {file.size}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" /> {file.pages} {file.pages === 1 ? 'page' : 'pages'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Rearrange + Delete buttons */}
                <div className="flex items-center gap-1">
                  <button
                    disabled={index === 0}
                    onClick={() => moveUp(index)}
                    className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={index === files.length - 1}
                    onClick={() => moveDown(index)}
                    className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent text-zinc-400"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500 ml-1 opacity-60 hover:opacity-100 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Trigger Form Sheet */}
          {!success && (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850/80 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5 font-display">
                  Output Filename
                </label>
                <input
                  type="text"
                  placeholder="merged_document.pdf"
                  value={outputName}
                  onChange={(e) => setOutputName(e.target.value.endsWith('.pdf') ? e.target.value : e.target.value + '.pdf')}
                  className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-200 outline-hidden hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-emerald-500 focus:dark:border-emerald-550"
                />
              </div>

              <button
                disabled={files.length < 2 || loading}
                onClick={mergePDFs}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-35 disabled:hover:bg-emerald-500 font-bold font-display text-white text-sm py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
              >
                {loading ? progressText : `Merge ${files.length} PDFs`}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success feedback state */}
      {success && (
        <div className="mt-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 animate-in fade-in-50 slide-in-from-bottom-3 duration-200">
          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div className="flex-1">
              <h5 className="font-semibold text-zinc-800 dark:text-zinc-200 text-sm">Successfully Merged!</h5>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                Your merged document <strong className="font-bold">{outputName}</strong> is ready for download. No pages were uploaded to any external server.
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
                    setFiles([]);
                    setSuccess(false);
                  }}
                  className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 font-bold font-display text-zinc-700 dark:text-zinc-300 text-xs px-3.5 py-2 rounded-lg transition-colors"
                >
                  Merge More
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
