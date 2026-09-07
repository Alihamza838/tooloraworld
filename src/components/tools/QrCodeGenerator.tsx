import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Download, RefreshCw, KeyRound, Wifi, Text, Link, Check, AlertCircle, Upload, Trash2 } from 'lucide-react';
import { useToolora } from '../../context/TooloraContext';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

type QRType = 'url' | 'text' | 'wifi' | 'vcard';

export default function QrCodeGenerator() {
  const { addHistoryItem } = useToolora();
  const [activeType, setActiveType] = useState<QRType>('url');
  
  // Input fields state
  const [url, setUrl] = useState('https://toolora.com');
  const [rawText, setRawText] = useState('Welcome to Toolora, Privacy-First Offline Tools.');
  const [wifiSsid, setWifiSsid] = useState('Home_Network');
  const [wifiPass, setWifiPass] = useState('securePass123');
  const [wifiEncrypt, setWifiEncrypt] = useState('WPA');
  
  // vCard fields
  const [vcName, setVcName] = useState('Alexander Reed');
  const [vcOrg, setVcOrg] = useState('Toolora Inc.');
  const [vcPhone, setVcPhone] = useState('+1 (555) 123-4567');
  const [vcEmail, setVcEmail] = useState('alex@toolora.com');
  
  // Customization
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [svgBgColor, setSvgBgColor] = useState('#ffffff');
  const [svgBgOpacity, setSvgBgOpacity] = useState(100); // 0 = fully transparent, 100 = fully opaque
  const [qrSize, setQrSize] = useState(300);

  // Logo uploads Customization State
  const [logoImage, setLogoImage] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(20); // Scale percentage, 10% - 30%
  const [logoPadding, setLogoPadding] = useState(true); // White background under logo
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  // Auto compile and redraw QR when inputs change
  useEffect(() => {
    generateQR();
  }, [activeType, url, rawText, wifiSsid, wifiPass, wifiEncrypt, vcName, vcOrg, vcPhone, vcEmail, fgColor, bgColor, qrSize, logoImage, logoScale, logoPadding]);

  const generateQR = async () => {
    let payload = '';

    switch (activeType) {
      case 'url':
        payload = url.startsWith('http') ? url : `https://${url}`;
        break;
      case 'text':
        payload = rawText;
        break;
      case 'wifi':
        // WIFI:S:SSID;T:WPA;P:PASSWORD;;
        payload = `WIFI:S:${wifiSsid};T:${wifiEncrypt};P:${wifiPass};;`;
        break;
      case 'vcard':
        payload = `BEGIN:VCARD
VERSION:3.0
N:${vcName}
FN:${vcName}
ORG:${vcOrg}
TEL:${vcPhone}
EMAIL:${vcEmail}
END:VCARD`;
        break;
    }

    if (!payload.trim() || !canvasRef.current) return;

    try {
      await QRCode.toCanvas(canvasRef.current, payload, {
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      });

      // Overlay the company logo onto the canvas in the direct center
      if (logoImage && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          const img = new Image();
          img.src = logoImage;
          await new Promise<void>((resolve) => {
            img.onload = () => {
              const size = qrSize;
              const logoSize = size * (logoScale / 100);
              const x = (size - logoSize) / 2;
              const y = (size - logoSize) / 2;

              if (logoPadding) {
                // Background card container
                ctx.fillStyle = bgColor;
                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                  ctx.roundRect(x - 4, y - 4, logoSize + 8, logoSize + 8, 6);
                } else {
                  ctx.rect(x - 4, y - 4, logoSize + 8, logoSize + 8);
                }
                ctx.fill();
              }

              // Draw logo
              ctx.drawImage(img, x, y, logoSize, logoSize);
              resolve();
            };
            img.onerror = () => {
              resolve();
            };
          });
        }
      }

      // Export canvas to downloadable DataURL
      const urlStr = canvasRef.current.toDataURL('image/png');
      setDownloadUrl(urlStr);
    } catch (err) {
      console.error("QR Code rendering error", err);
    }
  };

  const generateSVGString = async () => {
    let payload = '';

    switch (activeType) {
      case 'url':
        payload = url.startsWith('http') ? url : `https://${url}`;
        break;
      case 'text':
        payload = rawText;
        break;
      case 'wifi':
        payload = `WIFI:S:${wifiSsid};T:${wifiEncrypt};P:${wifiPass};;`;
        break;
      case 'vcard':
        payload = `BEGIN:VCARD
VERSION:3.0
N:${vcName}
FN:${vcName}
ORG:${vcOrg}
TEL:${vcPhone}
EMAIL:${vcEmail}
END:VCARD`;
        break;
    }

    if (!payload.trim()) return '';

    try {
      // Calculate 2-digit hex alpha from opacity (0 - 100)
      const alphaVal = Math.round((svgBgOpacity / 100) * 255);
      const alphaHex = alphaVal.toString(16).padStart(2, '0');
      // Append transparency to selected background color
      const lightWithOpacity = svgBgColor + alphaHex;

      let svg = await QRCode.toString(payload, {
        type: 'svg',
        width: qrSize,
        margin: 2,
        color: {
          dark: fgColor,
          light: lightWithOpacity,
        },
      });

      if (logoImage) {
        const logoSize = qrSize * (logoScale / 100);
        const x = (qrSize - logoSize) / 2;
        const y = (qrSize - logoSize) / 2;
        
        let logoSvgElement = '';
        if (logoPadding) {
          logoSvgElement += `<rect x="${x - 4}" y="${y - 4}" width="${logoSize + 8}" height="${logoSize + 8}" rx="6" ry="6" fill="${bgColor}" />`;
        }
        logoSvgElement += `<image href="${logoImage}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" />`;
        
        svg = svg.replace('</svg>', `${logoSvgElement}</svg>`);
      }
      return svg;
    } catch (err) {
      console.error("SVG generation failed", err);
      return '';
    }
  };

  const handleDownloadSVG = async () => {
    const svgStr = await generateSVGString();
    if (!svgStr) return;

    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const sizeStr = (blob.size / 1024).toFixed(1) + ' KB';
    const urlStr = URL.createObjectURL(blob);

    const outputName = `qr_code_${activeType}.svg`;
    addHistoryItem('qr-generator', 'QR Code Generator', outputName, sizeStr, urlStr);

    const dLink = document.createElement('a');
    dLink.href = urlStr;
    dLink.download = outputName;
    document.body.appendChild(dLink);
    dLink.click();
    document.body.removeChild(dLink);
  };

  const handleDownload = () => {
    if (!downloadUrl) return;

    // Save download metrics to local app logs
    const outputName = `qr_code_${activeType}.png`;
    addHistoryItem('qr-generator', 'QR Code Generator', outputName, '240 KB', downloadUrl);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden p-6 max-w-4xl mx-auto shadow-xs">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-display">Sleek QR Code Creator</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Build responsive vector QR stamps for websites, wireless networks, contacts, and custom text payloads.
          </p>
        </div>
        <div className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-full border border-emerald-500/20 inline-flex items-center gap-1 shrink-0 font-display">
          ⚡ Private Client Rendering
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Step 1: Payload Selection Type */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
            1. Payload Type
          </h4>
          <div className="flex flex-col gap-1">
            {[
              { id: 'url', label: 'Web Address (URL)', icon: Link },
              { id: 'text', label: 'Plain Text/Memo', icon: Text },
              { id: 'wifi', label: 'Wireless Hotspot (WiFi)', icon: Wifi },
              { id: 'vcard', label: 'Contact Card (vCard)', icon: QrCode },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveType(item.id as QRType)}
                  className={`flex items-center gap-3 p-3 text-xs font-semibold rounded-lg text-left border transition-all ${activeType === item.id ? 'bg-zinc-150 dark:bg-zinc-800/80 border-semibold border-zinc-250 dark:border-zinc-700 text-zinc-850 dark:text-zinc-100' : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100/50 dark:hover:bg-zinc-850/50'}`}
                >
                  <Icon className="w-4 h-4 text-emerald-500" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Color pickers */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850/80 space-y-4">
            <div className="flex items-center justify-between">
              <h5 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-display">QR Aesthetics</h5>
              <span className="text-[9px] text-zinc-400 font-mono">PNG Canvas</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="space-y-1">
                <span>Foreground</span>
                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-6 h-6 border-none bg-transparent cursor-pointer rounded-md overflow-hidden"
                  />
                  <span className="font-mono text-[10px] uppercase text-zinc-800 dark:text-zinc-200">{fgColor}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span>Background</span>
                <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-6 h-6 border-none bg-transparent cursor-pointer rounded-md overflow-hidden"
                  />
                  <span className="font-mono text-[10px] uppercase text-zinc-800 dark:text-zinc-200">{bgColor}</span>
                </div>
              </div>
            </div>

            {/* Separate SVG Background section with color and transparency controls */}
            <div className="pt-3 border-t border-dashed border-zinc-200 dark:border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider font-display">SVG Vector Exclusives</h5>
                <span className="text-[9px] text-zinc-400 font-mono">Print Media</span>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1">
                  <span>SVG File Background Color</span>
                  <div className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 p-1.5 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20">
                    <input
                      type="color"
                      value={svgBgColor}
                      onChange={(e) => setSvgBgColor(e.target.value)}
                      className="w-6 h-6 border-none bg-transparent cursor-pointer rounded-md overflow-hidden"
                    />
                    <span className="font-mono text-[10px] uppercase text-zinc-800 dark:text-zinc-200">{svgBgColor}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-medium">SVG Background Transparency</span>
                    <span className="font-mono text-emerald-500 font-bold">{100 - svgBgOpacity}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={100 - svgBgOpacity}
                      onChange={(e) => setSvgBgOpacity(100 - Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>
                  <p className="text-[10px] text-zinc-400 dark:text-zinc-500 leading-tight pt-1">
                    Allows you to export fully transparent and customizable vectors matching any packaging color or brand paper style.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Content Inputs Column */}
        <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 space-y-4">
          <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display">
            2. Configure Payload
          </h4>

          {/* Render inputs based on payload category */}
          {activeType === 'url' && (
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="space-y-1">
                <span>Destination URL</span>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {activeType === 'text' && (
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="space-y-1">
                <span>Message text</span>
                <textarea
                  rows={4}
                  placeholder="Enter custom text content..."
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500 resize-none"
                />
              </div>
            </div>
          )}

          {activeType === 'wifi' && (
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="space-y-1">
                <span>SSID (WiFi Name)</span>
                <input
                  type="text"
                  placeholder="Home_Wifi_2G"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span>Hostspot Password</span>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="WPA key password"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-3" />
                </div>
              </div>
              <div className="space-y-1">
                <span>Encryption Standard</span>
                <select
                  value={wifiEncrypt}
                  onChange={(e) => setWifiEncrypt(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden"
                >
                  <option value="WPA">WPA / WPA2 (Highly Secure)</option>
                  <option value="WEP">WEP (Vintage Standard)</option>
                  <option value="nopass">Unencrypted (Open Network)</option>
                </select>
              </div>
            </div>
          )}

          {activeType === 'vcard' && (
            <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400">
              <div className="space-y-1">
                <span>Full Name</span>
                <input
                  type="text"
                  placeholder="Alexander Reed"
                  value={vcName}
                  onChange={(e) => setVcName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden focus:border-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <span>Organization Co</span>
                <input
                  type="text"
                  placeholder="Toolora Design"
                  value={vcOrg}
                  onChange={(e) => setVcOrg(e.target.value)}
                  className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <span>Phone Number</span>
                <input
                  type="text"
                  placeholder="+1 (123) 456-7890"
                  value={vcPhone}
                  onChange={(e) => setVcPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden"
                />
              </div>
              <div className="space-y-1">
                <span>Contact Email</span>
                <input
                  type="text"
                  placeholder="name@company.com"
                  value={vcEmail}
                  onChange={(e) => setVcEmail(e.target.value)}
                  className="w-full px-3 py-1.5 bg-transparent border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-900 dark:text-zinc-250 outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Centered Logo Brand Stamp overlay */}
          <div className="pt-4 mt-4 border-t border-zinc-150 dark:border-zinc-800/60 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-zinc-400 dark:text-zinc-650 uppercase tracking-widest font-display">
                ✦ Company Logo (Optional)
              </span>
              {logoImage && (
                <button
                  type="button"
                  onClick={() => setLogoImage(null)}
                  className="text-[10px] text-rose-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Remove Logo
                </button>
              )}
            </div>

            {!logoImage ? (
              <div className="border border-dashed border-zinc-250 dark:border-zinc-800 rounded-xl p-4 text-center relative hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-all">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/svg+xml"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) setLogoImage(ev.target.result as string);
                      };
                      reader.readAsDataURL(e.target.files[0]);
                    }
                  }}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-4 h-4 text-zinc-400 dark:text-zinc-600 mx-auto mb-1.5" />
                <span className="text-[10.5px] font-bold text-zinc-550 dark:text-zinc-400 block">
                  Upload Custom Logo
                </span>
                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block mt-0.5">
                  PNG, JPG, SVG up to 1 MB rendered locally
                </span>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs bg-slate-50/60 dark:bg-zinc-950/20 p-3 rounded-lg border border-slate-100 dark:border-zinc-850/40">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-md bg-white border border-slate-205 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
                    <img src={logoImage} className="max-w-full max-h-full object-contain" alt="Current brand logo" referrerPolicy="no-referrer" />
                  </div>
                  <div className="text-[11px] leading-tight flex-1">
                    <span className="font-semibold text-zinc-750 dark:text-zinc-300 block">Logo Uploaded</span>
                    <span className="text-zinc-405 uppercase text-[9px] font-mono block text-emerald-500">Offline local active</span>
                  </div>
                </div>

                {/* Scale selection slide */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[11px] text-zinc-505 dark:text-zinc-400">
                    <span>Logo scale inside QR</span>
                    <span className="font-mono text-emerald-500 font-bold">{logoScale}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="30"
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="w-full h-1 bg-zinc-200 dark:bg-zinc-850 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Safe cushion toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none text-[11px] text-zinc-650 dark:text-zinc-450 pt-0.5">
                  <input
                    type="checkbox"
                    checked={logoPadding}
                    onChange={(e) => setLogoPadding(e.target.checked)}
                    className="rounded border-zinc-250 dark:border-zinc-850 text-emerald-500 focus:ring-0 w-3.5 h-3.5 accent-emerald-500"
                  />
                  <span>Add safety backup cushion</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Step 3: QR Code Visual Preview & Export */}
        <div className="flex flex-col items-center justify-between p-4 rounded-xl border border-zinc-150 dark:border-zinc-800">
          <div className="text-center w-full">
            <h4 className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider font-display mb-4">
              3. Dynamic Layout File
            </h4>

            <h3 id="generated-qr-stamp-header" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 font-display mb-2">
              Generated QR Stamp
            </h3>

            {/* QR Canvas Container */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-950/20 border border-zinc-200 dark:border-zinc-850 rounded-xl flex items-center justify-center max-w-[240px] mx-auto shadow-xs">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto aspect-square rounded-md overflow-hidden"
              />
            </div>
          </div>

          <div className="w-full pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
            <a
              href={downloadUrl}
              download={`qr_code_${activeType}.png`}
              onClick={handleDownload}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold font-display text-white text-xs py-2 px-4 rounded-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download QR Code PNG
            </a>
            
            <button
              id="qr-download-btn"
              onClick={handleDownloadSVG}
              className="w-full bg-emerald-500 hover:bg-emerald-600 font-bold font-display text-white text-xs py-2 px-4 rounded-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download SVG Vector
            </button>

            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center uppercase tracking-wider">
              SVG vector is zoom-scalable and pixel-perfect for professional printing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
