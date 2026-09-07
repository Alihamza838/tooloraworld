import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Copy,
  Sliders,
  Maximize2,
  Lock,
  Unlock,
  Sparkles,
  ArrowRight,
  HardDrive,
  Info,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import confetti from 'canvas-confetti';

type TargetFormat = 'webp' | 'png' | 'jpeg';
type SmoothingLevel = 'high' | 'medium' | 'low';

interface DimensionPreset {
  name: string;
  width: number;
  height: number;
  label: string;
}

const DIMENSION_PRESETS: DimensionPreset[] = [
  { name: 'Instagram Square', width: 1080, height: 1080, label: '1080 × 1080 (1:1)' },
  { name: 'Instagram Story / Reel', width: 1080, height: 1920, label: '1080 × 1920 (9:16)' },
  { name: 'Twitter / X Post', width: 1200, height: 675, label: '1200 × 675 (16:9)' },
  { name: 'YouTube Thumbnail', width: 1280, height: 720, label: '1280 × 720 (16:9)' },
  { name: 'Full HD Web Banner', width: 1920, height: 1080, label: '1920 × 1080 (16:9)' },
  { name: 'App Icon / Favicon', width: 512, height: 512, label: '512 × 512 (1:1)' },
  { name: 'Compact Thumbnail', width: 400, height: 300, label: '400 × 300 (4:3)' }
];

export default function ImageOptimizer() {
  const { addHistoryItem } = useToolora();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>('');
  const [originalFormat, setOriginalFormat] = useState<string>('PNG');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);

  // Optimization parameters
  const [targetFormat, setTargetFormat] = useState<TargetFormat>('webp');
  const [quality, setQuality] = useState<number>(85); // 10 - 100
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState<boolean>(true);
  const [smoothingQuality, setSmoothingQuality] = useState<SmoothingLevel>('high');
  const [backgroundColor, setBackgroundColor] = useState<string>('white'); // for jpeg conversion of transparent images

  // Output state
  const [optimizedBlob, setOptimizedBlob] = useState<Blob | null>(null);
  const [optimizedUrl, setOptimizedUrl] = useState<string | null>(null);
  const [optimizedSize, setOptimizedSize] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'compare'>('preview');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const calculateRatio = (w: number, h: number) => {
    return h === 0 ? 1 : w / h;
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) return;

    setOriginalName(file.name.substring(0, file.name.lastIndexOf('.')) || 'optimized_image');
    setOriginalSize(file.size);

    const ext = file.name.split('.').pop()?.toUpperCase() || 'IMAGE';
    setOriginalFormat(ext);

    // Auto default to WebP if uploaded file is PNG/JPEG
    if (ext === 'PNG' || ext === 'JPG' || ext === 'JPEG') {
      setTargetFormat('webp');
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);

      const img = new Image();
      img.onload = () => {
        setOriginalWidth(img.width);
        setOriginalHeight(img.height);
        setTargetWidth(img.width);
        setTargetHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleWidthChange = (val: number) => {
    const newWidth = Math.max(1, Math.min(16000, val));
    setTargetWidth(newWidth);
    if (maintainAspect && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetHeight(Math.round(newWidth / ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const newHeight = Math.max(1, Math.min(16000, val));
    setTargetHeight(newHeight);
    if (maintainAspect && originalWidth > 0 && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(newHeight * ratio));
    }
  };

  const applyScalePercentage = (pct: number) => {
    if (!originalWidth || !originalHeight) return;
    const factor = pct / 100;
    setTargetWidth(Math.round(originalWidth * factor));
    setTargetHeight(Math.round(originalHeight * factor));
  };

  const applyPreset = (preset: DimensionPreset) => {
    setTargetWidth(preset.width);
    setTargetHeight(preset.height);
    setMaintainAspect(false);
  };

  // Perform Canvas-based optimization and format conversion
  const executeOptimization = useCallback(async () => {
    if (!imageSrc || targetWidth <= 0 || targetHeight <= 0) return;

    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image buffer'));
        img.src = imageSrc;
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context unavailable');
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = smoothingQuality;

      // When target is JPEG, fill background with chosen color to prevent black transparency artifacts
      if (targetFormat === 'jpeg') {
        ctx.fillStyle = backgroundColor === 'black' ? '#000000' : backgroundColor === 'gray' ? '#f1f5f9' : '#ffffff';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else if (backgroundColor !== 'transparent' && targetFormat !== 'png') {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // Render resized image to canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Select target mime type
      const mimeType =
        targetFormat === 'webp'
          ? 'image/webp'
          : targetFormat === 'png'
          ? 'image/png'
          : 'image/jpeg';

      const qualityRatio = targetFormat === 'png' ? 1.0 : quality / 100;

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setIsProcessing(false);
            return;
          }

          if (optimizedUrl) {
            URL.revokeObjectURL(optimizedUrl);
          }

          const newUrl = URL.createObjectURL(blob);
          setOptimizedBlob(blob);
          setOptimizedUrl(newUrl);
          setOptimizedSize(blob.size);
          setIsProcessing(false);
        },
        mimeType,
        qualityRatio
      );
    } catch (err) {
      console.error('Image optimization error:', err);
      setIsProcessing(false);
    }
  }, [imageSrc, targetWidth, targetHeight, targetFormat, quality, smoothingQuality, backgroundColor]);

  // Debounced auto-recompile when parameters change
  useEffect(() => {
    if (!imageSrc) return;
    const timer = setTimeout(() => {
      executeOptimization();
    }, 180);
    return () => clearTimeout(timer);
  }, [executeOptimization, imageSrc]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (optimizedUrl) {
        URL.revokeObjectURL(optimizedUrl);
      }
    };
  }, [optimizedUrl]);

  const handleDownload = () => {
    if (!optimizedUrl || !optimizedBlob) return;

    const ext = targetFormat.toLowerCase();
    const downloadFileName = `${originalName}_optimized.${ext}`;

    const link = document.createElement('a');
    link.href = optimizedUrl;
    link.download = downloadFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addHistoryItem(
      'image-optimizer',
      'Image Optimizer',
      downloadFileName,
      formatBytes(optimizedSize),
      optimizedUrl
    );

    try {
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.85 } });
    } catch {}
  };

  const handleCopyToClipboard = async () => {
    if (!optimizedBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        // PNG is widely supported by ClipboardItem
        if (targetFormat === 'png') {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': optimizedBlob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          // If WebP/JPEG, convert temporary canvas snapshot to PNG for clipboard compatibility
          const img = new Image();
          img.src = optimizedUrl!;
          await new Promise((resolve) => (img.onload = resolve));
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob(async (blob) => {
            if (blob) {
              await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }
          }, 'image/png');
        }
      }
    } catch (e) {
      console.warn('Clipboard copy failed:', e);
    }
  };

  const savingsPercent =
    originalSize > 0 && optimizedSize > 0
      ? Math.round(((originalSize - optimizedSize) / originalSize) * 100)
      : 0;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Privacy Notice Banner */}
      <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>
            <strong>100% In-Browser Hardware Acceleration:</strong> Resizing and format conversions execute locally in your browser memory via the HTML5 Canvas API. Zero images are ever uploaded.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded font-semibold">
          RAM Sandbox
        </span>
      </div>

      {!imageSrc ? (
        /* Upload Area */
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-12 text-center cursor-pointer transition-all bg-slate-50/50 dark:bg-zinc-900/50 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/10 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <Upload size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 mb-1">
            Drop an image here to resize, compress, or convert
          </h3>
          <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4">
            Supports PNG, JPEG, WebP, GIF, SVG, and BMP. Fast zero-loss processing.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors">
            <ImageIcon size={14} />
            <span>Select Image File</span>
          </div>
        </div>
      ) : (
        /* Active Workspace */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (Left) */}
          <div className="lg:col-span-5 space-y-5">
            {/* File Info Card */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Source Image
                </span>
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setOptimizedBlob(null);
                    setOptimizedUrl(null);
                  }}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  Change image
                </button>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-zinc-300">
                <span className="truncate max-w-[200px] font-medium" title={originalName}>
                  {originalName}.{originalFormat.toLowerCase()}
                </span>
                <span className="font-mono bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-slate-600 dark:text-zinc-400">
                  {formatBytes(originalSize)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                <span>Original Dimensions:</span>
                <span className="font-mono font-medium">
                  {originalWidth} × {originalHeight} px
                </span>
              </div>
            </div>

            {/* Target Format Selector */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                Target Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'webp', label: 'WebP', desc: 'Modern & Compact' },
                  { id: 'png', label: 'PNG', desc: 'Lossless / Alpha' },
                  { id: 'jpeg', label: 'JPEG', desc: 'Universal Photo' }
                ].map((fmt) => (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setTargetFormat(fmt.id as TargetFormat)}
                    className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                      targetFormat === fmt.id
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{fmt.label}</span>
                      {targetFormat === fmt.id && <Check size={13} className="text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 block mt-0.5">
                      {fmt.desc}
                    </span>
                  </button>
                ))}
              </div>

              {targetFormat === 'webp' && (
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                  <Info size={12} /> WebP offers 25–35% smaller file size than JPEG with equal fidelity.
                </p>
              )}
            </div>

            {/* Quality / Compression Slider (for lossy formats) */}
            {targetFormat !== 'png' && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    Compression Quality
                  </span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Aggressive (Small File)</span>
                  <span>Balanced (80-85%)</span>
                  <span>High Fidelity</span>
                </div>
              </div>
            )}

            {/* Resize & Dimensions */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                  Resize Dimensions
                </span>
                <button
                  type="button"
                  onClick={() => setMaintainAspect(!maintainAspect)}
                  className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    maintainAspect
                      ? 'border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-slate-200 dark:border-zinc-700 text-slate-500'
                  }`}
                >
                  {maintainAspect ? <Lock size={12} /> : <Unlock size={12} />}
                  <span>{maintainAspect ? 'Locked Ratio' : 'Free Ratio'}</span>
                </button>
              </div>

              {/* Width & Height Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">Width (px)</label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={targetWidth || ''}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">Height (px)</label>
                  <input
                    type="number"
                    min="10"
                    max="10000"
                    value={targetHeight || ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-900 dark:text-zinc-100 focus:outline-indigo-600"
                  />
                </div>
              </div>

              {/* Percentage Scaling Quick Pills */}
              <div>
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1.5">Scale Percentage</span>
                <div className="flex flex-wrap gap-1.5">
                  {[25, 50, 75, 100, 150].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => applyScalePercentage(pct)}
                      className="px-2.5 py-1 text-[11px] font-mono font-medium rounded-md border border-slate-200 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-500 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                    >
                      {pct}%
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setTargetWidth(originalWidth);
                      setTargetHeight(originalHeight);
                    }}
                    className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Popular Dimensions Dropdown */}
              <div>
                <label className="text-[11px] text-slate-500 dark:text-zinc-400 block mb-1">Social & Web Presets</label>
                <select
                  onChange={(e) => {
                    const found = DIMENSION_PRESETS.find((p) => p.name === e.target.value);
                    if (found) applyPreset(found);
                  }}
                  defaultValue=""
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200"
                >
                  <option value="" disabled>
                    Select dimension preset...
                  </option>
                  {DIMENSION_PRESETS.map((p) => (
                    <option key={p.name} value={p.name}>
                      {p.name} ({p.label})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Background Fill for JPEG (prevents black background on transparent PNGs) */}
            {targetFormat === 'jpeg' && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 shadow-xs space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400 block">
                  Transparency Fill (JPEG Background)
                </label>
                <div className="flex gap-3">
                  {[
                    { id: 'white', label: 'White' },
                    { id: 'black', label: 'Black' },
                    { id: 'gray', label: 'Off-White' }
                  ].map((bg) => (
                    <label key={bg.id} className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300 cursor-pointer">
                      <input
                        type="radio"
                        name="bgFill"
                        checked={backgroundColor === bg.id}
                        onChange={() => setBackgroundColor(bg.id)}
                        className="accent-indigo-600"
                      />
                      <span>{bg.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Preview & Actions Column (Right) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Output Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Original Size</span>
                <span className="text-sm font-bold font-mono text-slate-700 dark:text-zinc-300">
                  {formatBytes(originalSize)}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Optimized Size</span>
                <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  {isProcessing ? 'Computing...' : formatBytes(optimizedSize)}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Bandwidth Savings</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    savingsPercent > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {savingsPercent > 0 ? `-${savingsPercent}%` : '0%'}
                </span>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/70">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Output</span>
                <span className="text-sm font-bold font-mono uppercase text-slate-800 dark:text-zinc-200">
                  {targetFormat}
                </span>
              </div>
            </div>

            {/* Visual Canvas Display Frame */}
            <div className="rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-950 p-4 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
              {isProcessing && (
                <div className="absolute inset-0 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200">
                    <RefreshCw size={14} className="animate-spin text-indigo-600" />
                    <span>Processing in Canvas...</span>
                  </div>
                </div>
              )}

              {optimizedUrl ? (
                <div className="relative max-w-full max-h-[440px] flex items-center justify-center">
                  <img
                    src={optimizedUrl}
                    alt="Optimized preview"
                    className="max-h-[400px] max-w-full object-contain rounded-lg shadow-sm border border-slate-200 dark:border-zinc-800"
                  />
                  <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-black/75 text-white font-mono text-[11px] backdrop-blur-xs">
                    {targetWidth} × {targetHeight} px
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Preparing preview...</p>
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!optimizedUrl || isProcessing}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-bold shadow-sm transition-all cursor-pointer"
              >
                <Download size={16} />
                <span>Download Optimized {targetFormat.toUpperCase()}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyToClipboard}
                disabled={!optimizedBlob || isProcessing}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-semibold transition-colors cursor-pointer"
                title="Copy raster pixels to clipboard"
              >
                {copied ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Copy size={16} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                type="button"
                onClick={() => executeOptimization()}
                className="p-3 rounded-xl border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 text-xs transition-colors cursor-pointer"
                title="Re-run Canvas rendering"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
