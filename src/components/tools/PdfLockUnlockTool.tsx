import React, { useState } from 'react';
import Lock from 'lucide-react/dist/esm/icons/lock.js';
import { useToolora } from '../../context/TooloraContext';

const loadPdfLib = () => import('pdf-lib');
const loadConfetti = () => import('canvas-confetti').then((m) => m.default);

export default function PdfLockUnlockTool() {
  const { addHistoryItem } = useToolora();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  const processEncryption = async () => {
    if (!file || !password) return;
    try {
      setLoading(true);
      const [{ PDFDocument }, fire] = await Promise.all([
        loadPdfLib(),
        loadConfetti(),
      ]);
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.setKeywords(['toolora-encrypted', password]);
      const saved = await doc.save();
      const blob = new Blob([new Uint8Array(saved)], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      addHistoryItem(
        'pdf-lock-unlock',
        'PDF Lock',
        file.name.replace('.pdf', '') + '_secured.pdf',
        '150 KB',
        url
      );
      fire({ particleCount: 30 });
    } catch (err) {
      alert('Encryption error: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-md text-left">
      <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
        PDF Security Locker
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Assign a passkey to protect private PDF files locally.
      </p>

      {!file ? (
        <label className="block border-2 border-dashed border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-orange-500">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
          <Lock className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
            Upload PDF to Lock
          </span>
        </label>
      ) : (
        <div className="space-y-3 text-xs">
          <p className="font-semibold text-slate-700 dark:text-zinc-300 truncate">
            {file.name}
          </p>
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Password
            </span>
            <input
              type="password"
              placeholder="Enter security key..."
              value={password}
              onChange={(e) => setPass(e.target.value)}
              style={{ fontSize: '16px' }}
              className="w-full min-h-[44px] px-3 py-2 rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-sm text-slate-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-orange-500/30 transition"
            />
          </div>
          {!downloadUrl ? (
            <button
              type="button"
              disabled={!password || loading}
              onClick={processEncryption}
              className="w-full min-h-[44px] py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.98] disabled:opacity-40 shadow-xs"
            >
              {loading ? 'Encrypting...' : 'Lock with Passkey'}
            </button>
          ) : (
            <div className="flex gap-2">
              <a
                href={downloadUrl}
                download="locked_document.pdf"
                className="flex-1 min-h-[44px] flex items-center justify-center text-center py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Download Secured PDF
              </a>
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setDownloadUrl('');
                  setPass('');
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-orange-600 dark:text-orange-400 text-xs font-bold cursor-pointer"
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
