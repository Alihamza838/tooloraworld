import React, { useState, useRef, useEffect } from 'react';
import { useToolora } from '../../context/TooloraContext';
import { Upload, Download, RefreshCw, Sliders, Play, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FilterPreset {
  id: string;
  name: string;
  grayscale: number;
  sepia: number;
  invert: number;
  blur: number;
  contrast: number;
  brightness: number;
}

const PRESETS: FilterPreset[] = [
  { id: 'normal', name: 'Original', grayscale: 0, sepia: 0, invert: 0, blur: 0, contrast: 100, brightness: 100 },
  { id: 'vintage', name: 'Vintage Sepia', grayscale: 0, sepia: 80, invert: 0, blur: 0, contrast: 110, brightness: 90 },
  { id: 'grayscale', name: 'Slate Gray', grayscale: 100, sepia: 0, invert: 0, blur: 0, contrast: 120, brightness: 100 },
  { id: 'invert', name: 'High Invert', grayscale: 0, sepia: 0, invert: 100, blur: 0, contrast: 100, brightness: 100 },
  { id: 'cinematic', name: 'Cinematic Contrast', grayscale: 10, sepia: 10, invert: 0, blur: 0, contrast: 150, brightness: 95 }
];

export default function ImageEditor() {
  const { addHistoryItem } = useToolora();
  const [src, setSrc] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [blur, setBlur] = useState(0);
  const [gray, setGray] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [invert, setInvert] = useState(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [name, setName] = useState('prism_edited');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setName(file.name.substring(0, file.name.lastIndexOf('.')) + '_prism');
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSrc(ev.target?.result as string);
      setDownloadUrl('');
      // reset filters
      applyPreset(PRESETS[0]);
    };
    reader.readAsDataURL(file);
  };

  const applyPreset = (preset: FilterPreset) => {
    setBrightness(preset.brightness);
    setContrast(preset.contrast);
    setBlur(preset.blur);
    setGray(preset.grayscale);
    setSepia(preset.sepia);
    setInvert(preset.invert);
    setDownloadUrl('');
  };

  // Re-draw and apply filter rules
  useEffect(() => {
    if (src && canvasRef.current) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Define canvas filter expression 
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${gray}%) sepia(${sepia}%) invert(${invert}%) blur(${blur}px)`;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Export DataURL
        setDownloadUrl(canvas.toDataURL('image/png'));
      };
    }
  }, [src, brightness, contrast, blur, gray, sepia, invert]);

  const handleDownload = () => {
    if (!downloadUrl) return;
    addHistoryItem('image-editor', 'Prism Filter Rendering', `${name}.png`, '240 KB', downloadUrl);
    confetti({ particleCount: 30 });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs max-w-4xl mx-auto space-y-4 text-left">
      <div>
        <h3 className="text-lg font-bold font-display">Prism Image Filter Editor</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Fine-tune exposure contrast profiles and inject exquisite vintage filters offline.</p>
      </div>

      {!src ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-805 p-12 text-center relative rounded-xl hover:border-emerald-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <span className="text-xs font-semibold text-zinc-650 block">Select Graphic to Load</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-650">
          {/* Controls Column */}
          <div className="space-y-4 p-4 border rounded-xl bg-zinc-50/10">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase font-display tracking-widest text-[10px]">Filter Profiles</h4>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p)}
                  className="p-2 border rounded-lg hover:border-emerald-500 text-center font-semibold text-[11px] cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-3 border-t">
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase font-display tracking-widest text-[10px]">Manual Adjustments</h4>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Exposure Brightness</span>
                  <span className="font-mono font-bold text-emerald-600">{brightness}%</span>
                </div>
                <input type="range" min="30" max="200" value={brightness} onChange={(e) => { setBrightness(parseInt(e.target.value)); setDownloadUrl(''); }} className="w-full accent-emerald-500" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Contrast Depth</span>
                  <span className="font-mono font-bold text-emerald-600">{contrast}%</span>
                </div>
                <input type="range" min="30" max="200" value={contrast} onChange={(e) => { setContrast(parseInt(e.target.value)); setDownloadUrl(''); }} className="w-full accent-emerald-500" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Focus Blur</span>
                  <span className="font-mono font-bold text-emerald-600">{blur}px</span>
                </div>
                <input type="range" min="0" max="15" value={blur} onChange={(e) => { setBlur(parseInt(e.target.value)); setDownloadUrl(''); }} className="w-full accent-emerald-500" />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Monochrome Grayscale</span>
                  <span className="font-mono font-bold text-emerald-600">{gray}%</span>
                </div>
                <input type="range" min="0" max="100" value={gray} onChange={(e) => { setGray(parseInt(e.target.value)); setDownloadUrl(''); }} className="w-full accent-emerald-500" />
              </div>
            </div>

            <button onClick={() => setSrc(null)} className="w-full text-center text-rose-500 py-1.5 border border-rose-500/10 hover:bg-rose-50 rounded-lg font-bold">
              Unload File
            </button>
          </div>

          {/* Interactive Live Canvas Rendering column */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-950/40 min-h-[300px]">
            <div className="text-center w-full flex-grow flex items-center justify-center max-h-[400px] overflow-auto border border-zinc-200/40 rounded-xl bg-white p-3 shadow-xs">
              <canvas ref={canvasRef} className="max-w-full h-auto rounded-lg select-none" />
            </div>

            <div className="pt-4 border-t w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-zinc-400 uppercase">Interactive Dynamic Vector Shader</span>
              
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`${name}.png`}
                  onClick={handleDownload}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display rounded-lg text-xs"
                >
                  Download Master copy
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
