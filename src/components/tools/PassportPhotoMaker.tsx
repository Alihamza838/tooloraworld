import React, { useState, useRef, useEffect } from 'react';
import { useToolora } from '../../context/TooloraContext';
import { Upload, Printer, Download, Check, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

type PhotoSize = 'us' | 'eu' | 'visa';

export default function PassportPhotoMaker() {
  const { addHistoryItem } = useToolora();
  const [src, setSrc] = useState<string | null>(null);
  const [stampSize, setStampSize] = useState<PhotoSize>('us');
  const [gridCount, setGridCount] = useState<number>(6); // 4, 6 or 8 copies 
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [name, setName] = useState('passport_photo_grid');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    setName(file.name.substring(0, file.name.lastIndexOf('.')) + '_passport_grid');
    
    const reader = new FileReader();
    reader.onload = (ev) => {
      setSrc(ev.target?.result as string);
      setDownloadUrl('');
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (src && canvasRef.current) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Photo sizes definitions
        // Standard high-quality 4x6 photo sheet is 1200 x 1800 px at 300 dpi
        canvas.width = 1200;
        canvas.height = 1800;

        // Background color
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Aspect ratio for individual images
        // US 2x2 has 1:1 format. Visa of EU has 35mm x 45mm ➔ 3.5 : 4.5 
        let singleW = 400;
        let singleH = 400;
        if (stampSize === 'eu') {
          singleW = 350;
          singleH = 450;
        } else if (stampSize === 'visa') {
          singleW = 400;
          singleH = 500;
        }

        // Duplication loop
        const cols = 3;
        const rows = Math.ceil(gridCount / cols);
        const marginX = (canvas.width - (cols * singleW)) / (cols + 1);
        const marginY = (canvas.height - (rows * singleH)) / (rows + 1);

        // Draw portrait crops
        for (let i = 0; i < gridCount; i++) {
          const colIdx = i % cols;
          const rowIdx = Math.floor(i / cols);

          const posX = marginX + colIdx * (singleW + marginX);
          const posY = marginY + rowIdx * (singleH + marginY);

          // Render border placeholder lines
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.strokeRect(posX - 4, posY - 4, singleW + 8, singleH + 8);

          // Crop and scale matching coordinates
          const imgAspect = img.width / img.height;
          const targetAspect = singleW / singleH;
          
          let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
          if (imgAspect > targetAspect) {
            sWidth = img.height * targetAspect;
            sx = (img.width - sWidth) / 2;
          } else {
            sHeight = img.width / targetAspect;
            sy = (img.height - sHeight) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, posX, posY, singleW, singleH);
        }

        setDownloadUrl(canvas.toDataURL('image/png'));
      };
    }
  }, [src, stampSize, gridCount]);

  const handlePrint = () => {
    window.print();
    confetti({ particleCount: 30 });
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs max-w-4xl mx-auto space-y-4 text-left print:bg-white print:p-0 print:border-none print:shadow-none">
      <div className="flex justify-between items-start print:hidden">
        <div>
          <h3 className="text-lg font-bold font-display">Biometric Photo Grid Maker</h3>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Conform portraits to official US 2x2\" and EU biometric layouts, duplicated for printable grid sheets.</p>
        </div>
        <div className="text-xs bg-emerald-500/10 text-emerald-600 font-bold px-3 py-1 border rounded-full font-display">
          🔒 Strict client side processing
        </div>
      </div>

      {!src ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-805 p-12 text-center relative rounded-xl hover:border-emerald-500 transition-colors print:hidden">
          <input type="file" accept="image/*" onChange={handleFile} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <span className="text-xs font-semibold text-zinc-650 block">Upload portrait shot image</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-600 print:grid-cols-1">
          {/* Controls column */}
          <div className="space-y-4 p-4 border rounded-xl bg-zinc-50/10 print:hidden text-zinc-600 dark:text-zinc-450">
            <h4 className="font-bold text-zinc-800 dark:text-zinc-200 uppercase font-display tracking-widest text-[10px]">Photo Standards</h4>
            <div className="space-y-2">
              {[
                { id: 'us', label: 'United States (2x2 Inches)', desc: 'Square passport size' },
                { id: 'eu', label: 'European & Schengen (35x45 mm)', desc: 'Official biometric ratio' },
                { id: 'visa', label: 'Universal Visa (40x50 mm)', desc: 'International visa size' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => { setStampSize(opt.id as PhotoSize); setDownloadUrl(''); }}
                  className={`w-full p-2.5 border rounded-lg text-left transition-all ${stampSize === opt.id ? 'bg-emerald-50/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 font-bold' : 'border-zinc-200'}`}
                >
                  <p className="text-xs leading-none">{opt.label}</p>
                  <span className="text-[10px] text-zinc-400 font-semibold">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div>
              <span className="block mb-2 font-bold text-zinc-800 dark:text-zinc-200">Grid Prints count ({gridCount})</span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                {[4, 6, 8].map((c) => (
                  <button
                    key={c}
                    onClick={() => { setGridCount(c); setDownloadUrl(''); }}
                    className={`py-1.5 border rounded-lg font-bold font-sans ${gridCount === c ? 'bg-emerald-50 text-emerald-600 border-emerald-500/50' : 'border-zinc-200'}`}
                  >
                    {c} PHOTOS
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setSrc(null)} className="w-full text-center text-rose-500 border border-rose-100 hover:bg-rose-50 p-2 rounded-lg font-bold">
              Unload image
            </button>
          </div>

          {/* Canvas column */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 border rounded-xl bg-zinc-50 dark:bg-zinc-950/40 print:p-0 print:border-none print:bg-white text-center">
            <div className="p-3 bg-white border rounded-xl shadow-md max-w-[320px] mx-auto print:max-w-none print:shadow-none print:border-none print:p-0">
              <canvas ref={canvasRef} className="max-w-full h-auto border pointer-events-none rounded select-none shadow-sm print:shadow-none print:border-none" />
            </div>

            <div className="pt-4 border-t w-full flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
              <span className="font-mono text-[9px] uppercase text-zinc-400">Pre-configured 10x15cm (4x6\") Print card layout</span>
              
              <div className="flex gap-2">
                <button onClick={handlePrint} className="px-4 py-1.5 border text-xs font-bold font-display rounded-lg inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                  <Printer className="w-3.5 h-3.5" /> Direct Print Grid
                </button>
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={`${name}.png`}
                    onClick={() => {
                      addHistoryItem('passport-photo-maker', 'Portrait Photos Print card', `${name}.png`, '420 KB', downloadUrl);
                      confetti({ particleCount: 30 });
                    }}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display rounded-lg text-xs"
                  >
                    Save JPG Card
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
