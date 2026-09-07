import React, { useRef, useState, useEffect } from 'react';
import { Palette, Trash2, RotateCcw, PenTool, Type, Download, CheckCircle2 } from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import confetti from 'canvas-confetti';

type SigMode = 'draw' | 'type';

export default function SignatureMaker() {
  const { addHistoryItem } = useToolora();
  const [activeMode, setActiveMode] = useState<SigMode>('draw');
  
  // Draw State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(3);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [historyStates, setHistoryStates] = useState<string[]>([]);
  
  // Type State
  const [typedName, setTypedName] = useState('Alexander Reed');
  const [fontFamily, setFontFamily] = useState('font-signature-1');
  const [typeColor, setTypeColor] = useState('#1d4ed8'); // Classic dark banking blue

  // Preset Typographical cursive styles
  const cursiveFonts = [
    { id: 'font-signature-1', name: 'Elegant Calligraphy', style: { fontFamily: "'Playfair Display', cursive, serif", fontStyle: 'italic' } },
    { id: 'font-signature-2', name: 'Sleek Signature', style: { fontFamily: "'Dancing Script', cursive, sans-serif" } },
    { id: 'font-signature-3', name: 'Artisan Signature', style: { fontFamily: "'Pacifico', cursive, sans-serif" } },
    { id: 'font-signature-4', name: 'Executive Script', style: { fontFamily: "'Great Vibes', cursive, sans-serif" } }
  ];

  useEffect(() => {
    // Inject required creative cursive script fonts for signature typewriter mode
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;700&family=Great+Vibes&family=Pacifico&family=Playfair+Display:ital,wght@1,500;1,700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Initialize black background reset canvas
  useEffect(() => {
    if (activeMode === 'draw') {
      resetCanvas();
    }
  }, [activeMode]);

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    // Set brush settings
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;

    setHasDrawn(false);
    setHistoryStates([]);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | any) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Canvas Stroke listeners
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save previous canvas state in undo history before new strokes
    setHistoryStates(prev => [...prev, canvas.toDataURL()]);

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const undoLast = () => {
    const canvas = canvasRef.current;
    if (!canvas || historyStates.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousStateUrl = historyStates[historyStates.length - 1];
    setHistoryStates(prev => prev.slice(0, -1));

    const img = new Image();
    img.src = previousStateUrl;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
    };
  };

  // Extract signatures to high quality transparent PNG blobs
  const generateSignatureFile = () => {
    let finalUrl = '';
    const outputName = `e_signature_${Math.random().toString(36).substring(3, 7)}.png`;

    if (activeMode === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas || !hasDrawn) return;
      finalUrl = canvas.toDataURL('image/png');
    } else {
      // For typed signatures, draw text in a temp offscreen canvas to export transparent PNG
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 600;
      tempCanvas.height = 200;
      const tCtx = tempCanvas.getContext('2d');
      if (!tCtx) return;

      // Fill transparent backdrop implicit
      tCtx.fillStyle = 'rgba(0,0,0,0)';
      tCtx.fillRect(0, 0, 600, 200);

      // Extract fonts specific style
      const activeFont = cursiveFonts.find(f => f.id === fontFamily);
      const fontName = activeFont?.style.fontFamily || 'cursive';
      tCtx.font = `italic 54px ${fontName}`;
      tCtx.fillStyle = typeColor;
      tCtx.textAlign = 'center';
      tCtx.textBaseline = 'middle';
      tCtx.fillText(typedName, 300, 100);

      finalUrl = tempCanvas.toDataURL('image/png');
    }

    if (!finalUrl) return;

    // Track download history locally
    addHistoryItem('signature-maker', 'Signature Studio', outputName, '45 KB', finalUrl);

    // Trigger instant browser click
    const dLink = document.createElement('a');
    dLink.href = finalUrl;
    dLink.download = outputName;
    document.body.appendChild(dLink);
    dLink.click();
    document.body.removeChild(dLink);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-3xl mx-auto shadow-xs">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">Signature Studio</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Draw online with touch pen or type beautiful cursive text patterns. Outputs transparent vector PNG files.
          </p>
        </div>
        
        {/* Toggle Mode Button */}
        <div className="flex bg-zinc-100 dark:bg-zinc-800/80 p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveMode('draw')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-display transition-colors cursor-pointer ${activeMode === 'draw' ? 'bg-white dark:bg-zinc-900 shadow-xs text-zinc-850 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <PenTool className="w-3.5 h-3.5" /> Draw
          </button>
          <button
            onClick={() => setActiveMode('type')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold font-display transition-colors cursor-pointer ${activeMode === 'type' ? 'bg-white dark:bg-zinc-900 shadow-xs text-zinc-850 dark:text-zinc-100' : 'text-zinc-500 hover:text-zinc-700'}`}
          >
            <Type className="w-3.5 h-3.5" /> Type Script
          </button>
        </div>
      </div>

      {activeMode === 'draw' ? (
        <div className="space-y-4">
          {/* Controls Bar for Draw */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 border border-zinc-150 dark:border-zinc-800/80 rounded-xl bg-zinc-50/50 dark:bg-zinc-950/20">
            <div className="flex items-center gap-4 text-xs font-display">
              {/* Stroke Colors preset */}
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-400 font-medium">Color:</span>
                <div className="flex gap-1.5">
                  {['#000000', '#1d4ed8', '#dc2626', '#16a34a'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setPenColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-5 h-5 rounded-full border border-white dark:border-zinc-900 transition-transform ${penColor === c ? 'scale-115 ring-2 ring-emerald-500' : 'opacity-80 hover:opacity-100'}`}
                    />
                  ))}
                </div>
              </div>

              {/* Stroke Width */}
              <div className="flex items-center gap-2 border-l border-zinc-200 dark:border-zinc-750 pl-4">
                <span className="text-zinc-400 font-medium">Thickness:</span>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={penWidth}
                  onChange={(e) => setPenWidth(parseInt(e.target.value))}
                  className="w-16 h-1 accent-emerald-500 cursor-pointer bg-zinc-200 dark:bg-zinc-800 rounded-lg"
                />
                <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1.5 rounded">{penWidth}px</span>
              </div>
            </div>

            {/* Editing Undo/Reset Actions */}
            <div className="flex gap-1.5">
              <button
                disabled={historyStates.length === 0}
                onClick={undoLast}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 disabled:opacity-30 inline-flex items-center gap-1 text-xs cursor-pointer"
                title="Undo last Stroke"
              >
                <RotateCcw className="w-3.5 h-3.5" /> <span className="hidden sm:inline font-display">Undo</span>
              </button>
              <button
                onClick={resetCanvas}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 inline-flex items-center gap-1 text-xs cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" /> <span className="hidden sm:inline font-display text-rose-500">Reset</span>
              </button>
            </div>
          </div>

          {/* Interactive DRAWING Canvas inside a slate box */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden relative cursor-crosshair bg-stone-50 dark:bg-zinc-950/20">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-64 touch-none block"
            />
            {!hasDrawn && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 select-none pointer-events-none font-display text-xs">
                ✍️ Draw your clean signature inside this frame
              </div>
            )}
          </div>

          <button
            disabled={!hasDrawn}
            onClick={generateSignatureFile}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-35 font-bold font-display text-white text-sm py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Save drew signature (.png)
          </button>
        </div>
      ) : (
        /* Type script view mode */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
                Enter your Name / Initials
              </label>
              <input
                type="text"
                placeholder="Alexander Reed"
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                className="w-full px-4 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
                Ink Color Preset
              </label>
              <div className="flex gap-2">
                {[
                  { value: '#000000', label: 'Ebony Black' },
                  { value: '#1d4ed8', label: 'Treasury Blue' },
                  { value: '#1e3a8a', label: 'Navy Banking' },
                ].map((ink) => (
                  <button
                    key={ink.value}
                    onClick={() => setTypeColor(ink.value)}
                    className={`flex-1 py-2 text-xs rounded-lg border font-medium font-sans ${typeColor === ink.value ? 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-300 dark:border-zinc-700 font-bold text-zinc-900 dark:text-zinc-150' : 'bg-transparent border-zinc-150 dark:border-zinc-850 text-zinc-500'}`}
                  >
                    {ink.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
              Choose Signature Font Style
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {cursiveFonts.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setFontFamily(font.id)}
                  style={font.style}
                  className={`flex flex-col p-4 rounded-xl border text-left cursor-pointer transition-all ${fontFamily === font.id ? 'bg-emerald-500/[0.04] border-emerald-500/40 text-emerald-600 dark:text-emerald-400' : 'bg-transparent border-zinc-150 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850/50'}`}
                >
                  <span className="text-[10px] text-zinc-400 uppercase tracking-wider block font-sans font-medium mb-1.5">
                    {font.name}
                  </span>
                  <div
                    style={{ color: typeColor, ...font.style }}
                    className="text-2xl font-light py-1 truncate"
                  >
                    {typedName || 'Alexander'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={typedName.trim() === ''}
            onClick={generateSignatureFile}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-35 font-bold font-display text-white text-sm py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" /> Save typed signature (.png)
          </button>
        </div>
      )}
    </div>
  );
}
