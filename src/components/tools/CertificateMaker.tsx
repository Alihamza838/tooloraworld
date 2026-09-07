import React, { useState, useRef, useEffect } from 'react';
import { useToolora } from '../../context/TooloraContext';
import { 
  Upload, 
  Printer, 
  Download, 
  Award, 
  Check, 
  Settings, 
  Users, 
  FileText, 
  QrCode, 
  Sliders, 
  Type, 
  Sparkles, 
  Plus, 
  Trash2, 
  User, 
  Bookmark, 
  PenTool, 
  FileCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';

type CertStyle = 'gold' | 'navy' | 'modern' | 'vintage' | 'artdeco';
type FontTheme = 'serif' | 'sans' | 'mono' | 'luxurious';
type SealType = 'star' | 'laurel' | 'shield' | 'none';
type SignatureInk = 'blue' | 'black' | 'gold';

export default function CertificateMaker() {
  const { addHistoryItem } = useToolora();

  // Tab state: 'content' | 'design' | 'security' | 'bulk'
  const [activeTab, setActiveTab ] = useState<'content' | 'design' | 'security' | 'bulk'>('content');

  // Certificate text data
  const [recipient, setRecipient] = useState('Alexander Reed');
  const [awardTitle, setAwardTitle] = useState('OFFLINE SYSTEMS EXCELLENCE');
  const [desc, setDesc] = useState('In recognition of outstanding technical contribution towards designing secure, 100% offline, privacy-first client software utilities.');
  const [presentedBy, setPresentedBy] = useState('Toolora Architecture Group');
  const [presentedTitle, setPresentedTitle] = useState('Principal Security Director');
  const [secondSignee, setSecondSignee] = useState('Eleanor Vance');
  const [secondSigneeTitle, setSecondSigneeTitle] = useState('Chief Systems Architect');
  const [dateStr, setDateStr] = useState('June 1, 2026');
  const [verificationId, setVerificationId] = useState('CERT-72VT-A482X');

  // Styling properties
  const [certStyle, setCertStyle] = useState<CertStyle>('gold');
  const [fontTheme, setFontTheme] = useState<FontTheme>('serif');
  const [sealType, setSealType] = useState<SealType>('laurel');
  const [signatureInk, setSignatureInk] = useState<SignatureInk>('blue');
  const [showCornerRibbon, setShowCornerRibbon] = useState(true);
  const [ribbonText, setRibbonText] = useState('EXCELLENCE');
  const [showWatermark, setShowWatermark] = useState(true);
  const [customWatermark, setCustomWatermark] = useState('SECURE CERTIFIED');
  const [customPrimaryColor, setCustomPrimaryColor] = useState(''); // Allows total color override if set
  
  // Bulk state roster
  const [bulkList, setBulkList] = useState<string[]>([
    'Alexander Reed',
    'Sophia Sterling',
    'Marcus Vance',
    'Zara Kaelen',
    'David Miller'
  ]);
  const [newBulkName, setNewBulkName] = useState('');
  const [selectedBulkIndex, setSelectedBulkIndex] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState('');

  // Handle selecting a name from the bulk list
  const handleSelectBulkUser = (index: number) => {
    setSelectedBulkIndex(index);
    setRecipient(bulkList[index]);
    // Generate subtle confetti of verification
    confetti({ particleCount: 15, colors: ['#4f46e5', '#312e81', '#fbbf24'] });
  };

  // Add name to bulk list
  const handleAddBulkName = () => {
    if (!newBulkName.trim()) return;
    const updated = [...bulkList, newBulkName.trim()];
    setBulkList(updated);
    setRecipient(newBulkName.trim());
    setSelectedBulkIndex(updated.length - 1);
    setNewBulkName('');
  };

  // Remove name from bulk list
  const handleRemoveBulkName = (index: number) => {
    const updated = bulkList.filter((_, i) => i !== index);
    if (updated.length === 0) {
      updated.push('Recipient Name');
    }
    setBulkList(updated);
    const newIndex = Math.min(selectedBulkIndex, updated.length - 1);
    setSelectedBulkIndex(newIndex);
    setRecipient(updated[newIndex]);
  };

  // Random Verification ID generation
  const handleGenerateId = () => {
    const randStr = 'CERT-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    setVerificationId(randStr);
  };

  // Generate dynamic font pairings
  const getFonts = (type: 'title' | 'recipient' | 'body') => {
    if (type === 'title') {
      if (fontTheme === 'serif') return "bold 26px 'Playfair Display', 'Times New Roman', serif";
      if (fontTheme === 'sans') return "bold 24px 'Space Grotesk', 'Outfit', sans-serif";
      if (fontTheme === 'mono') return "bold 20px 'Fira Code', 'JetBrains Mono', monospace";
      return "italic bold 32px 'Playfair Display', serif"; 
    }
    if (type === 'recipient') {
      if (fontTheme === 'serif') return "bold 44px 'Playfair Display', 'Times New Roman', serif";
      if (fontTheme === 'sans') return "extrabold 48px 'Outfit', 'Inter', sans-serif";
      if (fontTheme === 'mono') return "normal 40px 'JetBrains Mono', monospace";
      return "italic bold 52px 'Playfair Display', serif";
    }
    // Body layout fonts
    if (fontTheme === 'mono') return "15px 'JetBrains Mono', monospace";
    return "16px 'Inter', sans-serif";
  };

  // Canvas drawing effect loop
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Landscape high-resolution printing proportion A4 1414 x 1000
      canvas.width = 1414;
      canvas.height = 1000;

      // Color paletting matching structural choices
      let primaryColor = '#d97706'; // Amber Gold
      let accentColor = '#1e3a8a';  // Prussian Navy
      let bgColor = '#FAF8F4';      // High cream hue
      let textColor = '#1e293b';     // Dark neutral
      let shadowColor = 'rgba(217, 119, 6, 0.1)';

      if (certStyle === 'navy') {
        primaryColor = '#1e3a8a';   // Prussian Navy
        accentColor = '#f59e0b';    // Bright Gold
        bgColor = '#F5F7FA';        // Soft Cool Slate
        textColor = '#0f172a';
        shadowColor = 'rgba(30, 58, 138, 0.1)';
      } else if (certStyle === 'modern') {
        primaryColor = '#10b981';   // Emerald Tech
        accentColor = '#3f3f46';    // Charcoal zinc
        bgColor = '#FAFAFA';        // Crisp Pearl White
        textColor = '#09090b';
        shadowColor = 'rgba(16, 185, 129, 0.15)';
      } else if (certStyle === 'vintage') {
        primaryColor = '#991b1b';   // Crimson Royal
        accentColor = '#b45309';    // Bronze Walnut
        bgColor = '#F9F5EA';        // Antique Amber Parchment
        textColor = '#27272a';
        shadowColor = 'rgba(153, 27, 27, 0.12)';
      } else if (certStyle === 'artdeco') {
        primaryColor = '#fbbf24';   // Bright luxurious gold
        accentColor = '#22d3ee';    // High teal contrast line
        bgColor = '#090d16';        // Deep Space basalt dark page
        textColor = '#f8fafc';      // Ghostly clean pure whites
        shadowColor = 'rgba(251, 191, 36, 0.15)';
      }

      // If custom user color exists, override primary
      if (customPrimaryColor) {
        primaryColor = customPrimaryColor;
      }

      // 1. Draw solid background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw watermark background text if active
      if (showWatermark && customWatermark) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-25 * Math.PI / 180);
        ctx.textAlign = 'center';
        ctx.fillStyle = certStyle === 'artdeco' ? 'rgba(251, 191, 36, 0.04)' : 'rgba(15, 23, 42, 0.03)';
        ctx.font = "bold 64px 'Space Grotesk', 'Inter', sans-serif";
        // Paint repeated lines of watermark
        for (let row = -3; row <= 3; row++) {
          ctx.fillText((customWatermark + '   ').repeat(3), 0, row * 110);
        }
        ctx.restore();
      }

      // 3. Dual decorative outer borders
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = certStyle === 'artdeco' ? 14 : 22;
      ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

      // Fine inner accessory lines
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(52, 52, canvas.width - 104, canvas.height - 104);

      if (certStyle === 'vintage' || certStyle === 'gold') {
        // Double inside hairline standard to antique high security certs
        ctx.strokeStyle = primaryColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
      }

      // 4. Heavy solid corner anchors or ornate flares
      const drawCornerAnchor = (x: number, y: number, w: number, h: number) => {
        ctx.fillStyle = primaryColor;
        ctx.fillRect(x, y, w, h);
        
        ctx.fillStyle = accentColor;
        if (x < canvas.width / 2) {
          ctx.fillRect(x + w, y, 4, h);
        } else {
          ctx.fillRect(x - 4, y, 4, h);
        }
      };

      if (certStyle === 'artdeco') {
        // Sophisticated Art Deco geometric corner designs
        const drawDecoCorner = (ox: number, oy: number, dirX: number, dirY: number) => {
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(ox + dirX * 60, oy);
          ctx.lineTo(ox + dirX * 60, oy + dirY * 60);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(ox + dirX * 15, oy + dirY * 15);
          ctx.lineTo(ox + dirX * 45, oy + dirY * 15);
          ctx.lineTo(ox + dirX * 45, oy + dirY * 45);
          ctx.stroke();
        };
        drawDecoCorner(52, 52, 1, 1);
        drawDecoCorner(canvas.width - 52, 52, -1, 1);
        drawDecoCorner(52, canvas.height - 52, 1, -1);
        drawDecoCorner(canvas.width - 52, canvas.height - 52, -1, -1);
      } else {
        // Standard high corporate corner shields
        drawCornerAnchor(52, 52, 45, 45);
        drawCornerAnchor(canvas.width - 97, 52, 45, 45);
        drawCornerAnchor(52, canvas.height - 97, 45, 45);
        drawCornerAnchor(canvas.width - 97, canvas.height - 97, 45, 45);
      }

      // 5. Diagonal Excellence Ribbon block on corner If active
      if (showCornerRibbon && ribbonText) {
        ctx.save();
        ctx.translate(115, 115);
        ctx.rotate(-45 * Math.PI / 180);
        ctx.fillStyle = primaryColor;
        ctx.fillRect(-120, -18, 240, 36);
        
        // Ribbon highlights
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(-120, -18, 240, 36);
        
        ctx.fillStyle = certStyle === 'artdeco' ? '#090d16' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.font = "bold 13px 'Space Grotesk', 'Inter', sans-serif";
        ctx.fillText(ribbonText.toUpperCase(), 0, 5);
        ctx.restore();
      }

      // 6. Header Emblem / Medal visual placeholder on core paper
      ctx.textAlign = 'center';
      ctx.fillStyle = primaryColor;
      ctx.font = "32px 'Inter'";
      ctx.fillText('❖', canvas.width / 2, 160);

      // 7. Core Header Title Typographies
      ctx.fillStyle = textColor;
      ctx.font = getFonts('title');
      ctx.fillText('CERTIFICATE OF RECOGNITION & OUTSTANDING MERIT', canvas.width / 2, 220);

      // Fine elegant vintage separator rules
      ctx.strokeStyle = certStyle === 'artdeco' ? 'rgba(251,191,36,0.25)' : 'rgba(15,23,42,0.1)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 250, 260);
      ctx.lineTo(canvas.width / 2 + 250, 260);
      ctx.stroke();

      // Certificate subtitle block 1
      ctx.fillStyle = certStyle === 'artdeco' ? '#94a3b8' : '#475569';
      ctx.font = "italic 16px 'Inter', sans-serif";
      ctx.fillText('This technical honor and academic title is officially bestowed upon', canvas.width / 2, 311);

      // 8. Recipient Name display (Main Focal point)
      ctx.fillStyle = certStyle === 'artdeco' ? primaryColor : accentColor;
      ctx.font = getFonts('recipient');
      ctx.fillText(recipient.toUpperCase(), canvas.width / 2, 400);

      // Subtitle block 2
      ctx.fillStyle = certStyle === 'artdeco' ? '#94a3b8' : '#475569';
      ctx.font = "normal 14px 'Inter', sans-serif";
      ctx.fillText('IN COMMEMORATION OF MAGNIFICENT DILIGENCE AND CONTEMPORANEOUS INSIGHT REGARDING', canvas.width / 2, 470);

      // 9. Core Award / Achievement Title Block
      ctx.fillStyle = primaryColor;
      ctx.font = "bold 30px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillText(awardTitle, canvas.width / 2, 532);

      // 10. Statement Body Detail block wrapper with auto line wrapping
      ctx.fillStyle = certStyle === 'artdeco' ? '#cbd5e1' : '#334155';
      ctx.font = getFonts('body');
      
      const words = desc.split(' ');
      let line = '';
      let yPos = 590;
      const maxWidth = 960;
      const lineHeight = 28;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, canvas.width / 2, yPos);
          line = words[n] + ' ';
          yPos += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, canvas.width / 2, yPos);

      // 11. Security Authentication Metadata Block Stamp (Left margins bottom border)
      const authY = yPos + 60;
      ctx.textAlign = 'left';
      ctx.fillStyle = certStyle === 'artdeco' ? 'rgba(255,255,255,0.45)' : '#64748b';
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.fillText(`VERIFICATION SECURE ID: [ ${verificationId} ]`, 110, authY + 120);
      ctx.fillText('VALIDITY ROSTER: ACTIVE ON-CHAIN MEMORY', 110, authY + 135);
      ctx.fillText('AUTHENTICATION: 100% PRIVATE SECURE SANDBOX', 110, authY + 150);

      // Draw virtual QR security code shape representation
      ctx.fillStyle = certStyle === 'artdeco' ? 'rgba(251,191,36,0.2)' : 'rgba(15,23,42,0.06)';
      ctx.fillRect(110, authY + 25, 80, 80);
      ctx.strokeStyle = certStyle === 'artdeco' ? primaryColor : accentColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(110, authY + 25, 80, 80);
      
      // QR dots simulator highlights
      ctx.fillStyle = certStyle === 'artdeco' ? primaryColor : accentColor;
      ctx.fillRect(115, authY + 30, 20, 20); // Top-left anchor
      ctx.fillRect(165, authY + 30, 20, 20); // Top-right anchor
      ctx.fillRect(115, authY + 80, 20, 20); // Bottom-left anchor
      ctx.fillRect(145, authY + 55, 15, 15); // Center block
      ctx.fillRect(138, authY + 80, 10, 10);
      ctx.fillRect(165, authY + 70, 12, 12);
      ctx.fillRect(150, authY + 35, 8, 8);

      // 12. Center physical Gold/Navy Stamp Wax Embossed seal
      ctx.textAlign = 'center';
      if (sealType !== 'none') {
        const sealX = canvas.width / 2;
        const sealYPos = authY + 55;

        // Draw ribbon tails behind seal if laurel or star is present
        if (sealType === 'laurel' || sealType === 'star') {
          ctx.fillStyle = primaryColor;
          ctx.beginPath();
          ctx.moveTo(sealX - 25, sealYPos);
          ctx.lineTo(sealX - 45, sealYPos + 90);
          ctx.lineTo(sealX - 15, sealYPos + 80);
          ctx.lineTo(sealX, sealYPos);
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(sealX, sealYPos);
          ctx.lineTo(sealX + 15, sealYPos + 80);
          ctx.lineTo(sealX + 45, sealYPos + 90);
          ctx.lineTo(sealX + 25, sealYPos);
          ctx.fill();
        }

        // Draw circular seal bases
        ctx.fillStyle = primaryColor;
        ctx.beginPath();
        ctx.arc(sealX, sealYPos, 48, 0, 2 * Math.PI);
        ctx.fill();

        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(sealX, sealYPos, 42, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = certStyle === 'artdeco' ? '#090d16' : '#ffffff';
        if (sealType === 'star') {
          ctx.font = "26px 'Inter'";
          ctx.fillText('★', sealX, sealYPos + 9);
        } else if (sealType === 'laurel') {
          ctx.font = "16px 'Inter'";
          ctx.fillText('𝌆', sealX, sealYPos - 2);
          ctx.font = "bold 9px 'Inter', sans-serif";
          ctx.fillText('OFFICIAL', sealX, sealYPos + 12);
        } else if (sealType === 'shield') {
          ctx.font = "bold 13px 'Inter'";
          ctx.fillText('🛡', sealX, sealYPos + 6);
        }
      }

      // 13. Double ink handwriting simulated biological signatures
      const signatureY = authY + 45;
      const signColor = signatureInk === 'blue' ? '#1d4ed8' : signatureInk === 'gold' ? '#eab308' : '#18181b';

      // Primary Presenter Sign Line (Right Bottom)
      ctx.strokeStyle = certStyle === 'artdeco' ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(850, signatureY + 45);
      ctx.lineTo(1050, signatureY + 45);
      ctx.stroke();

      // Procedural signature ink sketch lines 1
      ctx.strokeStyle = signColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(860, signatureY + 40);
      ctx.bezierCurveTo(890, signatureY - 10, 895, signatureY + 65, 915, signatureY + 15);
      ctx.bezierCurveTo(930, signatureY - 15, 940, signatureY + 50, 960, signatureY + 30);
      ctx.bezierCurveTo(975, signatureY + 15, 990, signatureY + 45, 1025, signatureY + 25);
      ctx.stroke();

      // Signee Titles 
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.fillText(presentedBy, 950, signatureY + 68);
      ctx.fillStyle = certStyle === 'artdeco' ? '#64748b' : '#64748b';
      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillText(presentedTitle, 950, signatureY + 86);

      // Secondary Authorized Sign Line (Far Right Bottom)
      ctx.strokeStyle = certStyle === 'artdeco' ? 'rgba(255,255,255,0.2)' : 'rgba(15,23,42,0.15)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(1100, signatureY + 45);
      ctx.lineTo(1300, signatureY + 45);
      ctx.stroke();

      // Procedural signature ink sketch lines 2
      ctx.beginPath();
      ctx.moveTo(1110, signatureY + 35);
      ctx.bezierCurveTo(1135, signatureY - 20, 1145, signatureY + 70, 1165, signatureY + 20);
      ctx.bezierCurveTo(1185, signatureY - 5, 1195, signatureY + 50, 1215, signatureY + 28);
      ctx.bezierCurveTo(1230, signatureY + 10, 1255, signatureY + 40, 1285, signatureY + 20);
      ctx.stroke();

      ctx.fillStyle = textColor;
      ctx.font = "bold 13px 'Inter', sans-serif";
      ctx.fillText(secondSignee, 1200, signatureY + 68);
      ctx.fillStyle = certStyle === 'artdeco' ? '#64748b' : '#64748b';
      ctx.font = "11px 'Inter', sans-serif";
      ctx.fillText(secondSigneeTitle, 1200, signatureY + 86);

      // Date Rulings underneath Stamp Seal
      ctx.fillStyle = certStyle === 'artdeco' ? '#94a3b8' : '#64748b';
      ctx.font = "bold 12px 'Space Grotesk', 'Inter', sans-serif";
      ctx.fillText(dateStr, canvas.width / 2, signatureY + 120);
      ctx.fillStyle = certStyle === 'artdeco' ? '#475569' : '#94a3b8';
      ctx.font = "10px 'Inter', sans-serif";
      ctx.fillText('DATE OF CERTIFICATION', canvas.width / 2, signatureY + 138);

      // Final update downloadable picture context
      setDownloadUrl(canvas.toDataURL('image/png'));
    }
  }, [
    recipient, 
    awardTitle, 
    desc, 
    presentedBy, 
    presentedTitle, 
    secondSignee, 
    secondSigneeTitle, 
    dateStr, 
    verificationId, 
    certStyle, 
    fontTheme, 
    sealType, 
    signatureInk, 
    showCornerRibbon, 
    ribbonText, 
    showWatermark, 
    customWatermark,
    customPrimaryColor
  ]);

  const handlePrint = () => {
    window.print();
    confetti({ particleCount: 50, spread: 60 });
  };

  return (
    <div className="bg-slate-50 dark:bg-zinc-900/40 rounded-2xl p-0.5 space-y-6 max-w-5xl mx-auto block">
      
      {/* 1. Header Hero Panel with premium badge details */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden" id="certificate-architect-hero">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-orange-50 dark:bg-zinc-800 rounded-lg text-orange-600 dark:text-orange-400">
              <Award className="w-5 h-5 animate-bounce" />
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-zinc-100 font-display tracking-tight">
              Certificate & Awards Architect Pro
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans max-w-2xl">
            Design highly authoritative credentials dynamically. Includes robust customization tools for multiple presets, watermark generators, procedural signature inks, validation stamps, and bulk batch generation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={handlePrint} 
            className="bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 text-white font-bold font-sans text-xs px-4.5 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" /> 
            <span>Print Current Certificate</span>
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Interactive Work Bench Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="certificate-maker-workspace">
        
        {/* Left Side: Sophisticated Config Control Panel with Category Tabs */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-805 rounded-2xl shadow-sm overflow-hidden print:hidden">
          
          {/* Inner Tab bar selector */}
          <div className="flex border-b border-slate-100 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-950/20 text-xs text-slate-500">
            <button 
              onClick={() => setActiveTab('content')}
              className={`flex-1 py-3 text-center border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'content' ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900' : 'border-transparent hover:text-slate-800 dark:hover:text-zinc-300'}`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Info Text</span>
            </button>
            <button 
              onClick={() => setActiveTab('design')}
              className={`flex-1 py-3 text-center border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'design' ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900' : 'border-transparent hover:text-slate-800 dark:hover:text-zinc-300'}`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Design</span>
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`flex-1 py-3 text-center border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'security' ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900' : 'border-transparent hover:text-slate-800 dark:hover:text-zinc-300'}`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Badges</span>
            </button>
            <button 
              onClick={() => setActiveTab('bulk')}
              className={`flex-1 py-3 text-center border-b-2 font-semibold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'bulk' ? 'border-orange-600 text-orange-600 dark:text-orange-400 bg-white dark:bg-zinc-900' : 'border-transparent hover:text-slate-800 dark:hover:text-zinc-300'}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Bulk List</span>
            </button>
          </div>

          <div className="p-5 space-y-4 max-h-[640px] overflow-y-auto custom-scrollbar">
            
            {/* TAB CONTENT: Content Texts */}
            {activeTab === 'content' && (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Recipient Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={recipient} 
                      onChange={(e) => setRecipient(e.target.value)} 
                      className="w-full text-xs font-sans px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white"
                      placeholder="e.g. Dr. Alexander Reed"
                    />
                    <span className="absolute right-2.5 top-2 text-orange-500/50">
                      <User className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Award / Title of Achievement</label>
                  <input 
                    type="text" 
                    value={awardTitle} 
                    onChange={(e) => setAwardTitle(e.target.value)} 
                    className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white font-semibold"
                    placeholder="e.g. FELLOW OF MATHEMATICAL COMPUTING"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Statement Body Description</label>
                  <textarea 
                    rows={4} 
                    value={desc} 
                    onChange={(e) => setDesc(e.target.value)} 
                    className="w-full text-xs p-3 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 leading-relaxed resize-none dark:text-white"
                    placeholder="Enter precise citation details here..."
                  />
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3" />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Authorized Signee 1</label>
                    <input 
                      type="text" 
                      value={presentedBy} 
                      onChange={(e) => setPresentedBy(e.target.value)} 
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Signee 1 Title</label>
                    <input 
                      type="text" 
                      value={presentedTitle} 
                      onChange={(e) => setPresentedTitle(e.target.value)} 
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Authorized Signee 2</label>
                    <input 
                      type="text" 
                      value={secondSignee} 
                      onChange={(e) => setSecondSignee(e.target.value)} 
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Signee 2 Title</label>
                    <input 
                      type="text" 
                      value={secondSigneeTitle} 
                      onChange={(e) => setSecondSigneeTitle(e.target.value)} 
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white text-slate-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Issue / Certification Date</label>
                    <input 
                      type="text" 
                      value={dateStr} 
                      onChange={(e) => setDateStr(e.target.value)} 
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none focus:ring-1.5 focus:ring-orange-500 dark:text-white cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Design Presets & Fine Styling */}
            {activeTab === 'design' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Preset Premium Themes</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'gold', label: 'Amber Gold Classic', color: 'bg-amber-100 border-amber-400 text-amber-800' },
                      { id: 'navy', label: 'Royal Prussian Navy', color: 'bg-blue-100 border-blue-400 text-blue-900' },
                      { id: 'modern', label: 'Emerald Mint Tech', color: 'bg-emerald-100 border-emerald-400 text-emerald-900' },
                      { id: 'vintage', label: 'Crimson Antiquity', color: 'bg-red-100 border-red-400 text-red-900' },
                      { id: 'artdeco', label: 'Midnight Gold Deco', color: 'bg-slate-900 border-slate-800 text-yellow-400' }
                    ].map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setCertStyle(theme.id as CertStyle);
                          confetti({ particleCount: 10, colors: ['#ea580c', '#fbbf24'] });
                        }}
                        className={`p-2.5 rounded-xl border text-[11px] font-sans font-bold text-left transition-all ${theme.color} ${certStyle === theme.id ? 'ring-2 ring-orange-500 scale-[1.02] shadow-sm' : 'opacity-85 hover:opacity-100'}`}
                      >
                        {theme.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Typography Pairings</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'serif', label: 'Formal High-Serif' },
                      { id: 'sans', label: 'Modern Aesthetic Sans' },
                      { id: 'mono', label: 'High-Tech Monospace' },
                      { id: 'luxurious', label: 'Luxurious Italic Script' }
                    ].map((font) => (
                      <button
                        key={font.id}
                        onClick={() => setFontTheme(font.id as FontTheme)}
                        className={`p-2 rounded-xl text-center border font-sans text-xs ${fontTheme === font.id ? 'bg-orange-600 text-white border-orange-600' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-800'}`}
                      >
                        {font.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3" />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Top-Left Decorative Ribbon</label>
                    <input 
                      type="checkbox" 
                      checked={showCornerRibbon} 
                      onChange={(e) => setShowCornerRibbon(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-600 accent-orange-600"
                    />
                  </div>
                  {showCornerRibbon && (
                    <input 
                      type="text" 
                      value={ribbonText} 
                      onChange={(e) => setRibbonText(e.target.value)} 
                      placeholder="e.g. HONORS LIST"
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none dark:text-white"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custom Border Color Override</label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      value={customPrimaryColor || '#4f46e5'} 
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="w-9 h-9 p-0.5 rounded-lg border border-slate-200/50 cursor-pointer"
                    />
                    <input 
                      type="text" 
                      placeholder="hex override e.g. #4f46e5" 
                      value={customPrimaryColor}
                      onChange={(e) => setCustomPrimaryColor(e.target.value)}
                      className="flex-1 text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none dark:text-white"
                    />
                    {customPrimaryColor && (
                      <button 
                        onClick={() => setCustomPrimaryColor('')} 
                        className="text-[10px] bg-slate-100 dark:bg-zinc-800 px-2 rounded-lg text-rose-500"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: Security features & Stamp / ink Seal / watermarks */}
            {activeTab === 'security' && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Center Seal Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'laurel', label: 'Circular Laurel Seal' },
                      { id: 'star', label: 'Ebenezer Gold Star' },
                      { id: 'shield', label: 'Shield of Integrity' },
                      { id: 'none', label: 'No Center Seal' }
                    ].map((seal) => (
                      <button
                        key={seal.id}
                        onClick={() => setSealType(seal.id as SealType)}
                        className={`p-2 border rounded-xl text-center font-sans ${sealType === seal.id ? 'bg-orange-600 text-white border-orange-600 shadow' : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-200 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-800'}`}
                      >
                        {seal.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Simulated Signature Ink</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'blue', label: 'Royal Blue Ink', color: 'bg-blue-600 text-white' },
                      { id: 'black', label: 'Charcoal Black', color: 'bg-zinc-900 text-white' },
                      { id: 'gold', label: 'Gilded Gold', color: 'bg-amber-500 text-zinc-950 font-bold' }
                    ].map((ink) => (
                      <button
                        key={ink.id}
                        onClick={() => setSignatureInk(ink.id as SignatureInk)}
                        className={`p-1.5 border rounded-lg text-center text-[10px] ${ink.color} ${signatureInk === ink.id ? 'ring-2 ring-orange-500' : 'opacity-80'}`}
                      >
                        {ink.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3" />

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security Background Watermark</label>
                    <input 
                      type="checkbox" 
                      checked={showWatermark} 
                      onChange={(e) => setShowWatermark(e.target.checked)}
                      className="w-4 h-4 rounded text-orange-600 accent-orange-600"
                    />
                  </div>
                  {showWatermark && (
                    <input 
                      type="text" 
                      value={customWatermark} 
                      onChange={(e) => setCustomWatermark(e.target.value.toUpperCase())} 
                      placeholder="e.g. SECURE CERTIFIED"
                      className="w-full text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none dark:text-white font-mono"
                    />
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Unique Validation Stamp Code</label>
                    <button 
                      onClick={handleGenerateId} 
                      className="text-[10px] text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Generate New Code</span>
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={verificationId} 
                    onChange={(e) => setVerificationId(e.target.value.toUpperCase())} 
                    className="w-full text-xs px-3 py-2 font-mono border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: Bulk generation layout panel */}
            {activeTab === 'bulk' && (
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recipient Batch Roster</span>
                    <span className="text-[10px] bg-orange-50 dark:bg-zinc-800 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full font-bold font-sans">
                      {bulkList.length} Names Loaded
                    </span>
                  </div>
                  
                  {/* Dynamic interactive list */}
                  <div className="space-y-1 max-h-48 overflow-y-auto border border-slate-100 dark:border-zinc-800/80 rounded-xl p-2 bg-slate-55/40 dark:bg-zinc-950/20 custom-scrollbar">
                    {bulkList.map((name, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-sans transition-all cursor-pointer ${selectedBulkIndex === i ? 'bg-orange-50 text-orange-700 dark:bg-zinc-800 dark:text-orange-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-zinc-800/50 text-slate-700 dark:text-zinc-350'}`}
                        onClick={() => handleSelectBulkUser(i)}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <Check className={`w-3.5 h-3.5 shrink-0 ${selectedBulkIndex === i ? 'text-orange-600 dark:text-orange-400' : 'opacity-0'}`} />
                          <span className="truncate">{name}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBulkName(i);
                          }} 
                          className="p-1 hover:text-rose-500 dark:hover:text-rose-400 text-slate-400 transition-colors"
                          title="Remove name"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-800/60 pt-3" />

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quick Add New Recipient</label>
                  <div className="flex gap-1.5">
                    <input 
                      type="text" 
                      placeholder="e.g. Liam Sterling" 
                      value={newBulkName} 
                      onChange={(e) => setNewBulkName(e.target.value)}
                      onKeyDown={(e) => { if(e.key === 'Enter') handleAddBulkName(); }}
                      className="flex-1 text-xs px-3 py-2 border border-slate-200 dark:border-zinc-800 rounded-xl bg-transparent focus:outline-none dark:text-white"
                    />
                    <button 
                      onClick={handleAddBulkName} 
                      className="p-2.5 bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 text-white rounded-xl active:scale-95 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-800/20 p-3 rounded-xl border border-slate-150/40 dark:border-zinc-800 text-[10.5px] leading-relaxed text-slate-500 dark:text-zinc-400">
                  <div className="font-semibold text-slate-700 dark:text-zinc-300 mb-1">💡 What is the Batch Roster?</div>
                  Paste names sequentially or import multi-student databases. Simply click any list item to hot-swap individual details. The layout adjusts dimensions instantly!
                </div>
              </div>
            )}

          </div>

          <div className="border-t border-slate-100 dark:border-zinc-800/60 p-4 bg-slate-50/50 dark:bg-zinc-950/20 text-center select-none">
            <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              Toolora Secure Workspace Systems
            </span>
          </div>

        </div>

        {/* Right Side: High-Fidelity Printable Canvas Viewport and Details */}
        <div className="lg:col-span-8 flex flex-col items-center gap-4 text-center">
          
          <div className="w-full bg-white dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-805 rounded-2xl p-4 sm:p-6 shadow-sm overflow-hidden" id="tool-renderer-box">
            
            {/* Context meta label */}
            <div className="flex items-center justify-between border-b pb-3.5 mb-5 select-none print:hidden">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10.5px] font-semibold text-slate-500 dark:text-zinc-400 font-sans tracking-wide uppercase">
                  Active Canvas Document Pre-Render Layout
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-450 font-mono text-[10px]">
                <span>1414 x 1000 PX</span>
                <span>•</span>
                <span>LANDSCAPE</span>
              </div>
            </div>

            {/* Interactive Preview Canvas Frame */}
            <div className="p-1 sm:p-2.5 bg-slate-100/50 dark:bg-zinc-950/80 border border-slate-200/40 dark:border-zinc-850/80 rounded-xl shadow-inner max-w-full print:border-none print:shadow-none print:p-0 relative group">
              <canvas 
                ref={canvasRef} 
                className="max-w-full h-auto rounded-lg select-none border border-slate-200/60 dark:border-zinc-800 print:border-none shadow-md transition-all group-hover:shadow-lg" 
              />
            </div>

            {/* Quick Action Operations */}
            <div className="pt-5 border-t border-slate-100 dark:border-zinc-800/60 mt-5 w-full flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
              <span className="font-mono text-[9.5px] text-slate-400 dark:text-zinc-500 uppercase select-none">
                Conformed perfectly to landscape standard printable media templates
              </span>
              
              {downloadUrl && (
                <a
                  href={downloadUrl}
                  download={`Certificate_${recipient.replace(/\s+/g, '_')}.png`}
                  onClick={() => {
                    addHistoryItem('certificate-maker', 'Certificate Exported', `Certificate_${recipient.replace(/\s+/g, '_')}.png`, '450 KB', downloadUrl);
                    confetti({ particleCount: 40, spread: 50, origin: { y: 0.8 } });
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-sans rounded-xl text-xs transition-transform active:scale-95 shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Accolade Image</span>
                </a>
              )}
            </div>

          </div>

          {/* HTML Printable Document Mock - matches CSS selector targeting for printing accuracy */}
          <div id="print-sheet" className="hidden printable-certificate font-sans text-slate-900 border-none bg-white w-[1414px] h-[1000px] absolute left-[-9999px] top-[-9999px] uppercase tracking-wide">
            {/* The printable layout renders natively during ctrl+p */}
            <div className="p-16 w-full h-full border-[22px] border-amber-600 relative flex flex-col justify-between" style={{ borderColor: customPrimaryColor || (certStyle === 'navy' ? '#1e3a8a' : certStyle === 'modern' ? '#10b981' : certStyle === 'vintage' ? '#991b1b' : certStyle === 'artdeco' ? '#fbbf24' : '#d97706') }}>
              <div className="absolute inset-[18px] border-4 border-slate-800" style={{ borderColor: certStyle === 'navy' ? '#f59e0b' : certStyle === 'modern' ? '#3f3f46' : certStyle === 'vintage' ? '#b45309' : certStyle === 'artdeco' ? '#22d3ee' : '#1e3a8a' }} />
              
              <div className="text-center pt-8">
                <span className="text-4xl">❖</span>
                <h1 className="text-3xl font-extrabold tracking-widest mt-4">CERTIFICATE OF RECOGNITION</h1>
                <div className="h-0.5 w-[500px] bg-slate-200 mx-auto my-6" />
                <p className="italic text-base text-slate-600">This technical honor and academic title is officially bestowed upon</p>
                <h2 className="text-5xl font-extrabold my-8 text-orange-950 dark:text-zinc-100" style={{ color: certStyle === 'artdeco' ? '#fbbf24' : '#1e3a8a' }}>{recipient}</h2>
                <p className="text-xs text-slate-500 tracking-wider">FOR DILIGENCE AND CONTEMPORANEOUS INSIGHT REGARDING</p>
                <h3 className="text-2xl font-bold mt-4 text-amber-600" style={{ color: customPrimaryColor || '#d97706' }}>{awardTitle}</h3>
                <p className="text-sm text-slate-600 max-w-[900px] mx-auto mt-6 leading-relaxed normal-case">{desc}</p>
              </div>

              <div className="flex justify-between items-end pb-8 px-12">
                <div className="text-center w-64">
                  <div className="h-0.5 bg-slate-300 w-full mb-3" />
                  <p className="font-bold text-xs">{presentedBy}</p>
                  <p className="text-[10px] text-slate-500">{presentedTitle}</p>
                </div>
                <div className="text-center w-32 border-2 p-2 rounded-full border-amber-500" style={{ borderColor: customPrimaryColor || '#d97706' }}>
                  <span className="text-xs font-bold">APPROVED SEAL</span>
                </div>
                <div className="text-center w-64">
                  <div className="h-0.5 bg-slate-300 w-full mb-3" />
                  <p className="font-bold text-xs">{secondSignee}</p>
                  <p className="text-[10px] text-slate-500">{secondSigneeTitle}</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
