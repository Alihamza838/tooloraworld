import React, { useState, useRef, useEffect } from 'react';
import Image from 'lucide-react/dist/esm/icons/image.js';

const loadConfetti = () => import('canvas-confetti').then((m) => m.default);

export default function BackgroundRemoverTool() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tolerance, setTol] = useState(30);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDL] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImage(ev.target?.result as string);
      setDL('');
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleCanvasClick = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const ti = (y * canvas.width + x) * 4;
    const tR = data[ti],
      tG = data[ti + 1],
      tB = data[ti + 2];
    setLoading(true);
    for (let i = 0; i < data.length; i += 4) {
      const dist = Math.sqrt(
        (data[i] - tR) ** 2 +
          (data[i + 1] - tG) ** 2 +
          (data[i + 2] - tB) ** 2
      );
      if (dist < tolerance) data[i + 3] = 0;
    }
    ctx.putImageData(imgData, 0, 0);
    setDL(canvas.toDataURL());
    setLoading(false);
    const fire = await loadConfetti();
    fire({ particleCount: 30 });
  };

  useEffect(() => {
    if (image && canvasRef.current) {
      const img = new window.Image();
      img.src = image;
      img.onload = () => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        c.width = img.width;
        c.height = img.height;
        ctx.drawImage(img, 0, 0);
      };
    }
  }, [image]);

  return (
    <div className="space-y-4 max-w-2xl text-left">
      <h3 className="text-base font-black text-slate-900 dark:text-zinc-100">
        Backdrop Isolator (Background Remover)
      </h3>
      <p className="text-xs text-slate-500 dark:text-zinc-400">
        Click on any solid color in your image to erase it and export as a
        transparent PNG.
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
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
            <span className="font-semibold">Tolerance:</span>
            <input
              type="range"
              min="10"
              max="80"
              value={tolerance}
              onChange={(e) => setTol(parseInt(e.target.value))}
              className="accent-orange-600 w-32 cursor-pointer min-h-[44px]"
            />
            <span className="font-mono">{tolerance}</span>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="ml-auto min-h-[44px] text-rose-500 font-bold cursor-pointer"
            >
              Change Image
            </button>
          </div>
          <div
            className="border border-slate-200/80 dark:border-[#1E293B] bg-[#F8F9FA] dark:bg-[#0B0F19] rounded-xl p-2 flex justify-center items-center overflow-auto"
            style={{ minHeight: '200px', maxHeight: '380px' }}
          >
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="max-w-full h-auto cursor-crosshair border border-slate-100 dark:border-zinc-800 rounded-lg select-none"
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center font-mono uppercase tracking-wider">
            {loading ? 'Processing pixels...' : 'Click background colors above to make them transparent'}
          </p>
          {downloadUrl && (
            <a
              href={downloadUrl}
              download="transparent_isolate.png"
              className="block w-full min-h-[44px] leading-[44px] text-center bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
            >
              Download Transparent PNG
            </a>
          )}
        </div>
      )}
    </div>
  );
}
