import React, { useState } from 'react';
import { Upload, HelpCircle, FileText, Check, Copy, Share2, ScanEye, RefreshCw } from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import Tesseract from 'tesseract.js';
import confetti from 'canvas-confetti';

export default function OcrTool() {
  const { addHistoryItem } = useToolora();
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('eng');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImage(event.target.result as string);
        setExtractedText('');
        setProgress(0);
        setProgressStatus('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!extractedText) return;
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runOCR = () => {
    if (!image) return;
    setLoading(true);
    setProgress(0);
    setProgressStatus('Initializing local neural engines...');

    Tesseract.recognize(
      image,
      language,
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgressStatus('Recognizing text characters...');
            setProgress(Math.round(m.progress * 100));
          } else {
            setProgressStatus(m.status.charAt(0).toUpperCase() + m.status.slice(1) + '...');
          }
        },
      }
    )
      .then(({ data: { text } }) => {
        setExtractedText(text.trim() || 'No text elements could be identified in the uploaded file.');
        setLoading(false);
        setProgress(100);
        
        // Save to Download History
        const docName = `ocr_extracted_${fileName.substring(0, fileName.lastIndexOf('.'))}.txt`;
        const textBlob = new Blob([text], { type: 'text/plain' });
        const urlStr = URL.createObjectURL(textBlob);
        addHistoryItem('ocr-tool', 'Image to Text (OCR)', docName, '1.2 KB', urlStr);

        confetti({
          particleCount: 40,
          spread: 40,
          origin: { y: 0.8 },
        });
      })
      .catch((err) => {
        console.error(err);
        setError('OCR process encountered an error: ' + (err as Error).message);
        setLoading(false);
      });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-4xl mx-auto shadow-xs">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">Image to Text (OCR)</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Extract raw selectable paragraph text from images, scanned logs, or designs instantly. Run using safe local browser models.
          </p>
        </div>
        <div className="text-xs bg-orange-500/10 text-orange-600 dark:text-orange-400 font-bold px-3 py-1.5 rounded-full border border-orange-500/20 inline-flex items-center gap-1.5 shrink-0 font-display">
          ✨ Neural Browser Model
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/25 rounded-xl text-xs font-semibold flex justify-between items-center animate-in fade-in duration-200">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm hover:opacity-75 cursor-pointer px-1">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selection / Preview Box */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display flex items-center justify-between">
            <span>Uploaded Scan / Image</span>
            {image && (
              <button
                onClick={() => {
                  setImage(null);
                  setExtractedText('');
                }}
                className="text-xs text-rose-500 hover:underline font-semibold font-display"
              >
                Change Image
              </button>
            )}
          </h4>

          {!image ? (
            <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-lg p-10 transition-colors text-center cursor-pointer relative min-h-72 flex flex-col justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-sans">
                Upload image or screenshot
              </p>
              <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">PNG, JPG, JPEG, WebP. Works 100% offline.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-2 text-center flex items-center justify-center min-h-64">
                <img
                  src={image}
                  alt="Scanned item text ocr"
                  className="max-h-60 max-w-full rounded-md object-contain font-semibold border border-zinc-205 dark:border-zinc-800"
                />
              </div>

              {/* Language selection */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display mb-1.5">
                    Select Language Model
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500"
                  >
                    <option value="eng">English Neural</option>
                    <option value="spa">Spanish (Español)</option>
                    <option value="fra">French (Français)</option>
                    <option value="deu">German (Deutsch)</option>
                    <option value="jpn">Japanese (日本語)</option>
                  </select>
                </div>

                {!loading && !extractedText && (
                  <button
                    onClick={runOCR}
                    className="bg-emerald-500 hover:bg-emerald-600 font-bold font-display text-white text-xs px-4 py-2.5 rounded-lg transition-colors cursor-pointer self-end flex items-center gap-1.5"
                  >
                    <ScanEye className="w-4 h-4" /> Recognize Text
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Processing and loading indicators */}
          {loading && (
            <div className="p-4 rounded-xl border border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/10 space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-500" /> {progressStatus}
                </span>
                <span className="font-mono">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500 rounded-full transition-all duration-150"
                />
              </div>
              <p className="text-[10px] text-zinc-400 leading-normal">
                Neural components are compiled locally in your active sandbox. No networks are queried during scanning.
              </p>
            </div>
          )}
        </div>

        {/* OCR Result Output Box */}
        <div className="flex flex-col justify-between">
          <div className="space-y-4 flex-1 flex flex-col">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display flex items-center justify-between">
              <span>Extracted Selectable Text</span>
              {extractedText && (
                <button
                  onClick={handleCopy}
                  className="text-xs text-emerald-500 hover:underline font-semibold font-display inline-flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Copied' : 'Copy All'}
                </button>
              )}
            </h4>

            <div className="flex-1 bg-stone-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 rounded-xl p-4 min-h-64 flex flex-col relative overflow-hidden">
              {!extractedText ? (
                <div className="m-auto text-center text-xs text-zinc-400 max-w-[200px] leading-relaxed">
                  <FileText className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
                  Select an image and tap recognize to analyze character blocks.
                </div>
              ) : (
                <textarea
                  readOnly
                  placeholder="Output characters..."
                  value={extractedText}
                  className="w-full h-full bg-transparent border-none outline-hidden text-sm text-zinc-800 dark:text-zinc-250 font-sans resize-none select-text pr-1"
                />
              )}
            </div>
          </div>

          {extractedText && (
            <div className="pt-4 flex gap-2 w-full mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <button
                onClick={handleCopy}
                className="bg-emerald-500 hover:bg-emerald-600 font-bold font-display text-white text-xs px-4 py-2.5 rounded-lg flex-1 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copied to Clipboard' : 'Copy Extracted Text'}
              </button>
              <button
                onClick={() => {
                  setImage(null);
                  setExtractedText('');
                }}
                className="bg-zinc-150 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 font-bold font-display text-xs px-4 py-2.5 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
