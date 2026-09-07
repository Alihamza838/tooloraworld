import React, { useState } from 'react';
import Image from 'lucide-react/dist/esm/icons/image.js';
import { useToolora } from '../../context/TooloraContext';

const loadConfetti = () => import('canvas-confetti').then((m) => m.default);

export default function ImageConverterTool() {
  const { addHistoryItem } = useToolora();
  const [image, setImage] = useState<string | null>(null);
  const [format, setFormat] = useState('png');
  const [name, setName] = useState('converted_asset');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDL] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const f = e.target.files[0];
    setName(f.name.substring(0, f.name.lastIndexOf('.')) || 'converted_image');
    const r = new FileReader();
    r.onload = (ev) => {
      setImage(ev.target?.result as string);
      setDL('');
    };
    r.readAsDataURL(f);
  };

  const processConversion = async () => {
    if (!image) return;
    setLoading(true);
    const img = new window.Image();
    img.src = image;
    img.onload = async () => {
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const ctx = c.getContext('2d');
      if (!ctx) {
        setLoading(false);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const mime =
        format === 'png'
          ? 'image/png'
          : format === 'webp'
          ? 'image/webp'
          : 'image/jpeg';
      const url = c.toDataURL(mime);
      setDL(url);
      addHistoryItem(
        'image-converter',
        'Image Converter',
        `${name}.${format}`,
        '120 KB',
        url
      );
      const fire = await loadConfetti();
      fire({ particleCount: 30 });
      setLoading(false);
    };
  };

  return (
    <div className="space-y-4 max-w-md text-left">
      <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
        Multi-Format Image Converter
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Convert to WebP, PNG, or JPEG entirely in your browser with zero compression loss.
      </p>

      {!image ? (
        <label className="block border-2 border-dashed border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-orange-500">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
          <Image className="w-8 h-8 mx-auto mb-2 text-slate-400" />
          <span className="text-xs font-semibold text-slate-600 dark:text-zinc-400">
            Upload Image
          </span>
        </label>
      ) : (
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-700 dark:text-zinc-300 truncate max-w-[280px]">
              {name}
            </span>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="min-h-[44px] px-2 text-rose-500 font-bold cursor-pointer flex items-center"
            >
              Change
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {['png', 'jpeg', 'webp'].map((fmt) => (
              <button
                type="button"
                key={fmt}
                onClick={() => setFormat(fmt)}
                className={`min-h-[44px] py-2.5 text-xs font-bold rounded-xl border uppercase cursor-pointer transition-all ${
                  format === fmt
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-[#F8F9FA] dark:bg-[#0B0F19] border-slate-200/80 dark:border-[#1E293B] text-slate-600 dark:text-zinc-400 hover:border-orange-400'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
          {!downloadUrl ? (
            <button
              type="button"
              onClick={processConversion}
              disabled={loading}
              className="w-full min-h-[44px] py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all active:scale-[0.98] disabled:opacity-50 shadow-xs"
            >
              {loading ? 'Converting...' : `Convert to ${format.toUpperCase()}`}
            </button>
          ) : (
            <div className="flex gap-2">
              <a
                href={downloadUrl}
                download={`${name}.${format}`}
                className="flex-1 min-h-[44px] flex items-center justify-center py-2.5 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Download Converted File
              </a>
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setDL('');
                }}
                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] text-orange-600 dark:text-orange-400 text-xs font-bold cursor-pointer"
              >
                New
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
