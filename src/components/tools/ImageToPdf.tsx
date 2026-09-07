import React, { useState } from 'react';
import { useToolora } from '../../context/TooloraContext';
import { Upload, File, HelpCircle, Download, CheckCircle, Trash2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import confetti from 'canvas-confetti';

interface SelectedImage {
  id: string;
  name: string;
  url: string;
  type: string;
}

export default function ImageToPdf() {
  const { addHistoryItem } = useToolora();
  const [images, setImages] = useState<SelectedImage[]>([]);
  const [pdfName, setPdfName] = useState('images_compiled.pdf');
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState<'a4' | 'letter' | 'original'>('a4');
  const [progressText, setProgressText] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files) as File[];
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages(prev => [...prev, {
          id: Math.random().toString(),
          name: file.name,
          url: ev.target?.result as string,
          type: file.type
        }]);
        setDownloadUrl('');
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id: string) => {
    setImages(images.filter(x => x.id !== id));
    setDownloadUrl('');
  };

  const compilePdf = async () => {
    if (!images.length) return;
    try {
      setLoading(true);
      setProgressText('Initializing PDF layout compilation structures...');
      
      const pdfDoc = await PDFDocument.create();
      
      for (let i = 0; i < images.length; i++) {
        setProgressText(`Embedding graphics asset stream ${i + 1} of ${images.length}...`);
        const item = images[i];
        
        // Fetch raw image bytes
        const response = await fetch(item.url);
        const imgBytes = await response.arrayBuffer();
        
        let embeddedImg;
        if (item.type === 'image/png') {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } else {
          // Default to JPG for jpeg, webp or bmp
          embeddedImg = await pdfDoc.embedJpg(imgBytes);
        }
        
        // Set dimensions
        const { width, height } = embeddedImg.scale(1.0);
        
        let pageW = width;
        let pageH = height;
        
        if (pageSize === 'a4') {
          pageW = 595.27; // A4 width
          pageH = 841.89; // A4 height
        } else if (pageSize === 'letter') {
          pageW = 612.0; // Letter width
          pageH = 792.0; // Letter height
        }
        
        const page = pdfDoc.addPage([pageW, pageH]);
        
        // Fit graphics proportionally within margins
        const margin = 30;
        const fitW = pageW - margin * 2;
        const fitH = pageH - margin * 2;
        
        const scaleFactor = Math.min(fitW / width, fitH / height, 1.0);
        const finalW = width * scaleFactor;
        const finalH = height * scaleFactor;
        
        // Center the cropped or downscaled images
        const posX = (pageW - finalW) / 2;
        const posY = (pageH - finalH) / 2;
        
        page.drawImage(embeddedImg, {
          x: posX,
          y: posY,
          width: finalW,
          height: finalH
        });
      }
      
      setProgressText('Compiling final byte signatures...');
      const finalBytes = await pdfDoc.save();
      const blob = new Blob([finalBytes], { type: 'application/pdf' });
      const sizeStr = (blob.size / (1024 * 1024)).toFixed(2) + ' MB';
      const urlStr = URL.createObjectURL(blob);
      
      setDownloadUrl(urlStr);
      addHistoryItem('image-to-pdf', 'Image to PDF Compiler', pdfName, sizeStr, urlStr);
      confetti({ particleCount: 35 });
    } catch (err) {
      console.error(err);
      alert('PDF compilation layers failed: ' + (err as Error).message);
    } finally {
      setLoading(false);
      setProgressText('');
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-xs max-w-2xl mx-auto space-y-4 text-left">
      <div>
        <h3 className="text-lg font-bold font-display">Conform Images to PDF Pages</h3>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-1">Convert multiple graphics cards (JPEG, PNG, WebP) into organized, layered PDF files.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs text-zinc-600 dark:text-zinc-400">
        <div className="space-y-1">
          <span>Target Page format</span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(e.target.value as any)}
            className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-90 w-full text-zinc-800 dark:text-zinc-200"
          >
            <option value="a4">Standard A4 Canvas</option>
            <option value="letter">American Corporate Letter</option>
            <option value="original">Prism Native Resolution</option>
          </select>
        </div>
        <div className="space-y-1">
          <span>Output File Name</span>
          <input
            type="text"
            value={pdfName}
            onChange={(e) => setPdfName(e.target.value)}
            className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100"
          />
        </div>
      </div>

      {images.length === 0 ? (
        <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 p-10 text-center relative rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500/50 transition-colors">
          <input type="file" multiple accept="image/*" onChange={handleFiles} className="absolute inset-0 opacity-0 cursor-pointer" />
          <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Select or Drag Images to Compile</p>
          <span className="text-[10px] text-zinc-450 block mt-1">PNG, JPG, JPEG, WebP assets supported</span>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs text-zinc-500">
            <span>Selected Files queue ({images.length})</span>
            <button onClick={() => setImages([])} className="text-rose-500 hover:underline">Clear all</button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[220px] overflow-y-auto p-1.5 border border-zinc-100 dark:border-zinc-850 rounded-xl bg-zinc-50/10">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-zinc-200/50 bg-white dark:bg-zinc-950/20 aspect-video p-1 flex flex-col justify-between">
                <img src={img.url} alt={`Thumbnail preview for ${img.name}`} className="w-full h-10 object-cover rounded" />
                <span className="text-[9px] text-zinc-500 truncate block mt-1">{img.name}</span>
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer scale-75"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-2">
            {!downloadUrl ? (
              <button
                disabled={loading}
                onClick={compilePdf}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display py-2.5 rounded-lg text-xs"
              >
                {loading ? (progressText || 'Compiling...') : 'Compile Images to PDF'}
              </button>
            ) : (
              <div className="flex gap-2">
                <a
                  href={downloadUrl}
                  download={pdfName}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold font-display text-center py-2.5 rounded-lg text-xs"
                >
                  Download Compiled PDF
                </a>
                <button onClick={() => { setImages([]); setDownloadUrl(''); }} className="p-2.5 border rounded-lg text-xs font-bold">
                  Compile New
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
