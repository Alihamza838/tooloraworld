import React, { useState, useRef, useEffect } from 'react';
import { useToolora } from '../../context/TooloraContext';
import { Upload, Download, Check, Expand } from 'lucide-react';
import confetti from 'canvas-confetti';

type PresetRatio = 'custom' | '1:1' | '4:3' | '16:9' | '3:2';

export default function ImageResizer() {
  const { addHistoryItem } = useToolora();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [height, setHeight] = useState<number>(600);
  const [aspectRatio, setAspectRatio] = useState<PresetRatio>('custom');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orgRatio, setOrgRatio] = useState<number>(1.33);
  const [name, setName] = useState('resized_image');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setName(file.name.substring(0, file.name.lastIndexOf('.')));
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      const src = ev.target?.result as string;
      setImageSrc(src);
      
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
        const r = img.width / img.height;
        setOrgRatio(r);
        setDownloadUrl('');
      };
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect) {
      setHeight(Math.round(val / orgRatio));
    }
    setDownloadUrl('');
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect) {
      setWidth(Math.round(val * orgRatio));
    }
    setDownloadUrl('');
  };

  const selectRatioPreset = (preset: PresetRatio) => {
    setAspectRatio(preset);
    if (preset === '1:1') {
      setHeight(width);
      setOrgRatio(1.0);
    } else if (preset === '4:3') {
      setHeight(Math.round(width * 0.75));
      setOrgRatio(4/3);
    } else if (preset === '16:9') {
      setHeight(Math.round(width * 0.5625));
      setOrgRatio(16/9);
    } else if (preset === '3:2') {
      setHeight(Math.round(width * 0.6667));
      setOrgRatio(3/2);
    }
    setDownloadUrl('');
  };

  const processResize = () => {
    if (!imageSrc) return;
    setLoading(true);

    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const urlStr = canvas.toDataURL('image/png');
        setDownloadUrl(urlStr);
        addHistoryItem('image-resizer', 'Image Rescale', `${name}_resized_${width}x${height}.png`, '180 KB', urlStr);
        confetti({ particleCount: 30 });
      }
      setLoading(false);
    };
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs max-w-2xl mx-auto space-y-4 text-left">
      <div>
        <h3 className="text-lg font-bold font-display">Client Image Resizer</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Resize visual graphics to exact widths, heights, or proportional templates natively.</p>
      </div>

      {!imageSrc ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-805 p-10 text-center relative rounded-xl hover:border-emerald-500 transition-colors">
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <span className="text-xs font-semibold text-zinc-650 block">Upload Graphic File</span>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-950/20 p-2 border rounded-xl">
            <span className="truncate pr-4 font-bold">{name}</span>
            <button onClick={() => { setImageSrc(null); setDownloadUrl(''); }} className="text-rose-500 font-bold">Clear</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span>Target Width (px)</span>
              <input
                type="number"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border rounded-lg bg-transparent text-sm font-semibold"
              />
            </div>
            <div className="space-y-1">
              <span>Target Height (px)</span>
              <input
                type="number"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-1.5 border rounded-lg bg-transparent text-sm font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="keep-aspect"
              checked={maintainAspect}
              onChange={(e) => setMaintainAspect(e.target.checked)}
              className="accent-brand-500"
            />
            <label htmlFor="keep-aspect" className="font-semibold text-zinc-600 dark:text-zinc-400">Lock Aspect Ratio Proportions</label>
          </div>

          <div className="space-y-2">
            <span>Aspect Ratio Quick Presets</span>
            <div className="grid grid-cols-5 gap-1.5 font-mono text-[10px]">
              {['custom', '1:1', '4:3', '16:9', '3:2'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => selectRatioPreset(ratio as PresetRatio)}
                  className={`py-1.5 border font-bold rounded-lg uppercase ${aspectRatio === ratio ? 'bg-emerald-50 text-emerald-600 border-emerald-500/30' : 'border-zinc-200'}`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {!downloadUrl ? (
            <button
              onClick={processResize}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display py-2.5 rounded-lg"
            >
              Apply Resize Calculations
            </button>
          ) : (
            <div className="flex gap-2">
              <a href={downloadUrl} download={`${name}_resized.png`} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display py-2.5 rounded-lg text-center font-bold">
                Download Resized Image
              </a>
              <button onClick={() => { setImageSrc(null); setDownloadUrl(''); }} className="p-2.5 border rounded-lg text-xs font-bold">Rescale New</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
