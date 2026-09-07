import React, { useState } from 'react';
import Upload from 'lucide-react/dist/esm/icons/upload.js';
import X from 'lucide-react/dist/esm/icons/x.js';
import { useToolora } from '../../context/TooloraContext';

const loadPdfLib = () => import('pdf-lib');
const loadConfetti = () => import('canvas-confetti').then((m) => m.default);

export default function PdfRotateTool() {
  const { addHistoryItem } = useToolora();
  const [file, setFile] = useState<File | null>(null);
  const [pagesCount, setPagesCount] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(90);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const f = e.target.files[0];
    try {
      setLoading(true);
      const { PDFDocument } = await loadPdfLib();
      const bytes = await f.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      setPagesCount(doc.getPageCount());
      setFile(f);
    } catch {
      alert('Failed parsing PDF components.');
    } finally {
      setLoading(false);
    }
  };

  const processRotation = async () => {
    if (!file) return;
    try {
      setLoading(true);
      const [{ PDFDocument, degrees }, fire] = await Promise.all([
        loadPdfLib(),
        loadConfetti(),
      ]);
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.getPages().forEach((p) => {
        const cur = p.getRotation()?.angle || 0;
        p.setRotation(degrees((cur + rotation) % 360));
      });
      const rotated = await doc.save();
      const blob = new Blob([new Uint8Array(rotated)], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      addHistoryItem(
        'pdf-rotate',
        'Rotate PDF',
        file.name.replace('.pdf', '') + '_rotated.pdf',
        '320 KB',
        url
      );
      fire({ particleCount: 30 });
    } catch {
      alert('Error updating rotation layers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 text-left">
      <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
        Rotate PDF Documents
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Rotate entire document pages and download the corrected format.
      </p>

      {!file ? (
        <label className="block border-2 border-dashed border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-orange-500">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
            Select PDF Document
          </span>
        </label>
      ) : (
        <div className="space-y-3">
          <div className="p-3 rounded-xl text-xs flex justify-between items-center bg-[#F8F9FA] dark:bg-[#0B0F19] border border-slate-200/80 dark:border-[#1E293B] text-orange-600 dark:text-orange-400">
            <span className="text-slate-700 dark:text-zinc-300 font-semibold truncate max-w-[280px]">
              {file.name} — {pagesCount} Pages
            </span>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-rose-500 font-bold cursor-pointer min-h-[44px] px-2 flex items-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[90, 180, 270].map((deg) => (
              <button
                type="button"
                key={deg}
                onClick={() => setRotation(deg)}
                className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl border cursor-pointer transition-all ${
                  rotation === deg
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-[#F8F9FA] dark:bg-[#0B0F19] border-slate-200/80 dark:border-[#1E293B] text-slate-600 dark:text-zinc-400 hover:border-orange-400'
                }`}
              >
                +{deg}°
              </button>
            ))}
          </div>
          {!downloadUrl ? (
            <button
              type="button"
              disabled={loading}
              onClick={processRotation}
              className="w-full min-h-[44px] py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 shadow-xs"
            >
              {loading ? 'Processing...' : 'Apply Rotation'}
            </button>
          ) : (
            <div className="flex gap-2">
              <a
                href={downloadUrl}
                download="rotated_document.pdf"
                className="flex-1 min-h-[44px] flex items-center justify-center py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Download Rotated PDF
              </a>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setDownloadUrl('');
                }}
                className="min-h-[44px] px-4 py-2.5 text-xs font-bold rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-orange-600 dark:text-orange-400 cursor-pointer"
              >
                Reset
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
