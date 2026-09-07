import React, { useState } from 'react';
import { Upload, ImageIcon, Sliders, CheckCircle2, ChevronRight } from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import confetti from 'canvas-confetti';

export default function ImageCompressor() {
  const { addHistoryItem } = useToolora();
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('image/jpeg');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [quality, setQuality] = useState<number>(75);
  const [scale, setScale] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) return;

    setOriginalSize(file.size);
    setFileName(file.name);
    setFileType(file.type);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setSrcImage(event.target.result as string);
        setSuccess(false);
        setDownloadUrl('');
      }
    };
    reader.readAsDataURL(file);
  };

  const executeCompression = () => {
    if (!srcImage) return;
    setLoading(true);

    const img = new Image();
    img.src = srcImage;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        setLoading(false);
        return;
      }

      // Calculate new scaled sizes
      const width = img.width * (scale / 100);
      const height = img.height * (scale / 100);

      canvas.width = width;
      canvas.height = height;

      // Draw and process
      ctx.drawImage(img, 0, 0, width, height);

      // Extract raw compressed data string
      const outputFormat = fileType === 'image/png' ? 'image/png' : 'image/jpeg';
      const compressionRatio = quality / 100;

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCompressedSize(blob.size);
            const url = URL.createObjectURL(blob);
            setDownloadUrl(url);
            setSuccess(true);
            setLoading(false);

            const fileExt = outputFormat === 'image/png' ? '.png' : '.jpg';
            const finalName = fileName.substring(0, fileName.lastIndexOf('.')) + '_optimized' + fileExt;

            addHistoryItem('image-compressor', 'Image Compressor', finalName, formatSize(blob.size), url);

            confetti({
              particleCount: 50,
              spread: 40,
              origin: { y: 0.85 }
            });
          }
        },
        outputFormat,
        outputFormat === 'image/png' ? undefined : compressionRatio
      );
    };
    img.onerror = () => {
      setLoading(false);
      setError('Could not draw or process selected image.');
    };
  };

  const savingsPercent = originalSize > 0 && compressedSize > 0
    ? Math.max(0, Math.round(((originalSize - compressedSize) / originalSize) * 100))
    : 0;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-3xl mx-auto shadow-xs">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">Image Compressor</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Reduce the file size of your JPEG, WebP, or PNG graphics in milliseconds without sacrificing digital aesthetics.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/25 rounded-xl text-xs font-semibold flex justify-between items-center animate-in fade-in duration-200">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-sm hover:opacity-75 cursor-pointer px-1">✕</button>
        </div>
      )}

      {!srcImage ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500/50 rounded-lg p-10 transition-colors text-center cursor-pointer relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <Upload className="w-10 h-10 text-zinc-400 dark:text-zinc-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 font-sans">
            Choose an image to optimize
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">Supports PNG, JPG, JPEG, WebP assets.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Real Preview Section */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
              Original Asset
            </h4>
            <div className="rounded-lg border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 p-2 text-center flex items-center justify-center min-h-64">
              <img
                src={srcImage}
                alt="Source preview"
                className="max-h-60 max-w-full rounded-md object-contain font-semibold border border-zinc-250 dark:border-zinc-700"
              />
            </div>
            <div className="flex items-center justify-between text-xs px-1 text-zinc-500">
              <span className="truncate max-w-28 font-mono">{fileName}</span>
              <span className="font-semibold bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded font-mono">
                {formatSize(originalSize)}
              </span>
            </div>
          </div>

          {/* Compress Controls Section */}
          <div className="flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-zinc-400" /> Compression Settings
              </h4>

              {/* Quality Bar */}
              {fileType !== 'image/png' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>Target Quality</span>
                    <span className="text-emerald-500 font-mono">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                    Lower compression results in smaller files but minor image noise.
                  </p>
                </div>
              )}

              {/* Scaling Slider */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Downscale Dimensions</span>
                  <span className="text-emerald-500 font-mono">{scale}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={scale}
                  onChange={(e) => setScale(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                />
                <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
                  Reduce the width and height dimensions of your image grid canvas.
                </p>
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
                  Output Format
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setFileType('image/jpeg')}
                    className={`py-2 rounded-lg border font-bold ${fileType === 'image/jpeg' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                  >
                    JPEG / JPG
                  </button>
                  <button
                    onClick={() => setFileType('image/png')}
                    className={`py-2 rounded-lg border font-bold ${fileType === 'image/png' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'}`}
                  >
                    PNG (No-Loss)
                  </button>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-6 space-y-4">
              {!success ? (
                <button
                  disabled={loading}
                  onClick={executeCompression}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-35 font-bold font-display text-white text-sm py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  {loading ? 'Optimizing...' : 'Compress Image'}
                </button>
              ) : (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs space-y-3">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                    <span>Compression complete!</span>
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-950/40 p-2.5 rounded-lg space-y-1.5 font-mono text-[10px] text-zinc-500">
                    <div className="flex justify-between">
                      <span>Before:</span>
                      <span>{formatSize(originalSize)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-zinc-850 dark:text-zinc-200">
                      <span>After:</span>
                      <span>{formatSize(compressedSize)}</span>
                    </div>
                    {savingsPercent > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-500 font-bold">
                        <span>Shrunk by:</span>
                        <span>-{savingsPercent}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={downloadUrl}
                      download={fileName.substring(0, fileName.lastIndexOf('.')) + '_optimized' + (fileType === 'image/png' ? '.png' : '.jpg')}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display inline-block text-center rounded-lg px-3 py-1.5 text-xs flex-1 transition-colors"
                    >
                      Download Compressed
                    </a>
                    <button
                      onClick={() => setSrcImage(null)}
                      className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-300 font-bold font-display rounded-lg px-3 py-1.5 text-xs transition-colors"
                    >
                      Optimize New
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
