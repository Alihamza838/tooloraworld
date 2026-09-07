import React, { useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useToolora } from '../context/TooloraContext';

// Deep ESM path imports
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left.js';
import Heart from 'lucide-react/dist/esm/icons/heart.js';
import Lock from 'lucide-react/dist/esm/icons/lock.js';

import { TOOLS } from '../data';
import { ARTICLES } from './blog/articlesIndex';
import ToolContainer from './renderer/ToolContainer';
import { ToolGuide } from './renderer/ToolGuideCard';
import { ToolWorkspaceSkeleton } from './ui/Skeleton';

// ─── Code-split lazy tool components (All 28 Dedicated Tools) ────────────────
const PdfEditor = React.lazy(() => import('./tools/PdfEditor'));
const PdfMerger = React.lazy(() => import('./tools/PdfMerger'));
const PdfSplitter = React.lazy(() => import('./tools/PdfSplitter'));
const PdfCompressor = React.lazy(() => import('./tools/PdfCompressor'));
const PdfToImage = React.lazy(() => import('./tools/PdfToImage'));
const ImageToPdf = React.lazy(() => import('./tools/ImageToPdf'));
const PdfLockUnlockTool = React.lazy(() => import('./tools/PdfLockUnlockTool'));
const PdfRotateTool = React.lazy(() => import('./tools/PdfRotateTool'));
const PdfWatermarkText = React.lazy(() => import('./tools/PdfWatermarkText'));
const PdfToText = React.lazy(() => import('./tools/PdfToText'));
const PdfToolbox = React.lazy(() => import('./tools/PdfToolbox'));

const ImageCompressor = React.lazy(() => import('./tools/ImageCompressor'));
const ImageResizer = React.lazy(() => import('./tools/ImageResizer'));
const ImageConverterTool = React.lazy(() => import('./tools/ImageConverterTool'));
const ImageOptimizer = React.lazy(() => import('./tools/ImageOptimizer'));
const OcrTool = React.lazy(() => import('./tools/OcrTool'));
const ImageEditor = React.lazy(() => import('./tools/ImageEditor'));
const PassportPhotoMaker = React.lazy(() => import('./tools/PassportPhotoMaker'));
const BackgroundRemoverTool = React.lazy(() => import('./tools/BackgroundRemoverTool'));

const InvoiceGenerator = React.lazy(() => import('./tools/InvoiceGenerator'));
const ResumeBuilder = React.lazy(() => import('./tools/ResumeBuilder'));
const QrCodeGenerator = React.lazy(() => import('./tools/QrCodeGenerator'));
const SignatureMaker = React.lazy(() => import('./tools/SignatureMaker'));
const BusinessCardDesigner = React.lazy(() => import('./tools/BusinessCardDesigner'));
const CertificateMaker = React.lazy(() => import('./tools/CertificateMaker'));
const MockupGenerator = React.lazy(() => import('./tools/MockupGenerator'));
const BillFormGenerator = React.lazy(() => import('./tools/BillFormGenerator'));

const UnitConverter = React.lazy(() => import('./tools/UnitConverter'));
const CurrencyConverter = React.lazy(() => import('./tools/CurrencyConverter'));
const TextToolsSuite = React.lazy(() => import('./tools/TextToolsSuite'));

// ─────────────────────────────────────────────────────────────────────────────
// TOOL GUIDES DATA
// ─────────────────────────────────────────────────────────────────────────────

const TOOL_GUIDES: Record<string, ToolGuide> = {
  'pdf-editor': {
    title: 'How to Edit PDF Text & Stamp Signatures in Browser',
    steps: [
      'Upload any PDF file. It loads directly into private sandbox RAM.',
      'Click anywhere on the pages to add text notes, checkmarks, stamps, or draw freehand vectors.',
      'Click Save & Export to download your customized PDF instantly.'
    ],
    tips: 'All layer annotations are flattened on-device without raster quality loss.'
  },
  'pdf-merger': {
    title: 'How to Merge PDF Files Online',
    steps: [
      'Drop two or more PDFs into the panel, or click to browse.',
      'Drag the thumbnails into the order you want the final document to read.',
      'Hit Merge and your combined PDF downloads in seconds.'
    ],
    tips: 'Great for stitching invoices, contracts, or lecture notes into one tidy file. Everything runs in your browser.'
  },
  'pdf-splitter': {
    title: 'How to Split a PDF Into Separate Pages',
    steps: [
      'Upload the PDF you need to break apart.',
      'Type in the page numbers or ranges you want (for example: 1-3, or just page 7).',
      'Click Extract and download each piece individually, or grab them all at once.'
    ],
    tips: 'Handy when someone only needs a single chapter, receipt, or signed page instead of the whole document.'
  },
  'pdf-compressor': {
    title: 'How to Compress a PDF Without Losing Quality',
    steps: [
      'Add the PDF that is too large for an email or upload form.',
      'Pick a compression level: light if quality matters most, stronger if size is the priority.',
      'Download the smaller file and confirm it still reads clearly.'
    ],
    tips: 'Useful for squeezing scanned application forms or annual reports under 5MB or 10MB upload limits.'
  },
  'pdf-to-image': {
    title: 'How to Turn PDF Pages Into Images',
    steps: [
      'Choose the PDF you want to convert.',
      'Pick PNG for crisp lossless detail or JPEG for smaller files.',
      'Download each page individually, or grab everything as one ZIP.'
    ],
    tips: 'A quick way to pull diagrams or presentation slides out of a PDF into high-res images.'
  },
  'image-to-pdf': {
    title: 'How to Convert Images to PDF',
    steps: [
      'Add one photo or several (JPG, PNG, and WebP all work).',
      'Drag to reorder them, then choose a page size like A4 or Letter.',
      'Click Create PDF to combine everything into a single document.'
    ],
    tips: 'Perfect for turning phone-scanned receipts or homework pages into one emailable PDF.'
  },
  'image-compressor': {
    title: 'How to Compress an Image Without Losing Quality',
    steps: [
      'Upload the photo or graphic you want to shrink.',
      'Slide the quality setting until the preview looks sharp (most photos hold up fine around 80%).',
      'Download the smaller version, ready for your website or an upload form.'
    ],
    tips: 'Smaller images load faster on every device and quietly strip out hidden metadata.'
  },
  'image-resizer': {
    title: 'How to Resize an Image to Exact Dimensions',
    steps: [
      'Upload the image you need to resize.',
      'Enter the exact width and height, or lock the aspect ratio and set just one side.',
      'Preview the result and download.'
    ],
    tips: 'Useful for matching exact pixel dimensions for app store listings, social banners, or print shops.'
  },
  'image-editor': {
    title: 'How to Crop and Edit a Photo Online',
    steps: [
      'Upload the photo you want to touch up.',
      'Crop to the area you need, then adjust brightness, contrast, or saturation.',
      'Save your changes and download the edited file.'
    ],
    tips: 'Everything updates live as you adjust sliders, so you see exactly what you are getting.'
  },
  'passport-photo-maker': {
    title: 'How to Make a Passport or Visa Photo at Home',
    steps: [
      'Upload a clear, front-facing photo (natural daylight works best).',
      'Pick your country format (US 2x2in, UK, Schengen, and more are built in).',
      'Adjust the crop and background, then download a print-ready sheet.'
    ],
    tips: 'The output is sized for standard 4x6 photo paper for easy printing at home or photo kiosks.'
  },
  'resume-cv-builder': {
    title: 'How to Build an ATS-Friendly Resume',
    steps: [
      'Fill in your work history, education, and skills in the structured fields.',
      'Pick a clean layout: minimalist or compact depending on content volume.',
      'Download your resume as a polished PDF.'
    ],
    tips: 'A single-column layout helps your resume parse accurately through automated applicant tracking systems.'
  },
  'certificate-maker': {
    title: 'How to Design a Certificate Online',
    steps: [
      'Choose a template: academic, corporate, or general achievement.',
      'Add the recipient name, reason for the award, date, and signature line.',
      'Export as a print-ready PDF or PNG.'
    ],
    tips: 'Great for course completions, hackathons, employee recognition, or team awards.'
  },
  'currency-converter': {
    title: 'How to Convert Currency Online',
    steps: [
      'Enter the amount you are converting.',
      'Pick your starting currency and target currency.',
      'Read off the converted amount instantly with accurate exchange rates.'
    ],
    tips: 'Calculated locally with floating-point precision guarding against rounding errors.'
  },
  'ocr-tool': {
    title: 'How to Extract Text From an Image (OCR)',
    steps: [
      'Upload a photo of a document, receipt, or handwritten note.',
      'Let the neural engine scan and extract the recognized text.',
      'Copy the result or download it as a text file.'
    ],
    tips: 'Works best on high-contrast, well-lit photos. Straight angles yield highest accuracy.'
  },
  'qr-generator': {
    title: 'How to Make a QR Code With a Logo',
    steps: [
      'Choose what the code should open: link, plain text, Wi-Fi details, or contact card.',
      'Upload your logo if you want it centered on the code.',
      'Adjust the colors and download as PNG or SVG vector.'
    ],
    tips: 'Always test-scan the generated QR code on a smartphone screen before final printing.'
  },
  'signature-maker': {
    title: 'How to Create a Digital Signature',
    steps: [
      'Draw your signature with mouse, finger, or stylus, or type it in cursive.',
      'Adjust the stroke thickness and ink color.',
      'Download it as a transparent PNG you can drop into contracts.'
    ],
    tips: 'The transparent PNG format fits seamlessly over any document signature line.'
  },
  'invoice-generator': {
    title: 'How to Create a Professional Invoice',
    steps: [
      'Add your business details and client billing information.',
      'List the line items, quantities, and rates (totals calculate automatically).',
      'Add tax if applicable, then download the invoice as a PDF.'
    ],
    tips: 'Consistent invoice numbering makes tax filing and client bookkeeping painless.'
  },
  'unit-converter': {
    title: 'How to Convert Units of Measurement',
    steps: [
      'Pick a category: length, weight, temperature, volume, data storage, or speed.',
      'Enter your starting value.',
      'See it converted across all related units simultaneously.'
    ],
    tips: 'Ideal for recipe adjustments, DIY construction, scientific calculations, and travel.'
  },
  'pdf-rotate': {
    title: 'How to Rotate Pages in a PDF',
    steps: [
      'Upload the PDF with pages facing sideways or upside down.',
      'Choose 90°, 180°, or 270° orientation.',
      'Download the corrected PDF file.'
    ],
    tips: 'Instant fix for scanned multi-page documents that came out rotated.'
  },
  'pdf-lock-unlock': {
    title: 'How to Password Protect a PDF',
    steps: [
      'Upload the document you want to secure.',
      'Set a secure passkey.',
      'Download the encrypted copy.'
    ],
    tips: 'Essential before emailing personal tax files, contracts, or bank statements.'
  },
  'bg-remover': {
    title: 'How to Remove a Background From a Photo',
    steps: [
      'Upload the photo with the background you want removed.',
      'Click on any background color to make it transparent (adjust tolerance as needed).',
      'Download the result as a transparent PNG.'
    ],
    tips: 'Solid, evenly lit backgrounds isolate in a single click.'
  },
  'image-converter': {
    title: 'How to Convert Image Formats (JPG, PNG, WebP)',
    steps: [
      'Upload your image.',
      'Choose target format: WebP for smaller web assets, PNG for transparency, JPG for photos.',
      'Download the converted file.'
    ],
    tips: 'WebP files are typically 25-35% lighter than JPGs at equivalent visual fidelity.'
  },
  'text-tools': {
    title: 'How to Quickly Format and Count Text',
    steps: [
      'Paste or type your text into the editor.',
      'Switch between UPPERCASE, lowercase, or Title Case.',
      'Inspect live word and character metrics and copy the cleaned text.'
    ],
    tips: 'Saves time when cleaning up pasted formatting from emails and documents.'
  },
  'business-card-gen': {
    title: 'How to Design a Business Card Online',
    steps: [
      'Enter your name, job title, company, email, and phone number.',
      'Watch the live 3.5" x 2" card preview update in real time.',
      'Print directly from your browser or save the design.'
    ],
    tips: 'Sized to standard 3.5 x 2 inch card stock with clear typographic hierarchy.'
  },
  'mockup-gen': {
    title: 'How to Create a Product Mockup Online',
    steps: [
      'Pick a product: t-shirt, hoodie, coffee mug, soda can, bottle, or packaging box.',
      'Upload your brand logo or decal.',
      'Adjust size, position, and blend mode, then download high-resolution render.'
    ],
    tips: 'GPU canvas acceleration allows interactive 60fps real-time adjustment.'
  },
  'bill-form-gen': {
    title: 'How to Create a Bill or Statement',
    steps: [
      'Choose a template: electricity, water, gas, retail receipt, or shipping bill.',
      'Fill in customer info, meter readings, or item charges.',
      'Preview layout and download as PDF.'
    ],
    tips: 'Useful for generating standardized billing receipts and record keeping.'
  },
  'pdf-watermark': {
    title: 'How to Add a Watermark to a PDF',
    steps: [
      'Upload the PDF to watermark.',
      'Type watermark text, adjust font, opacity, and rotation angle.',
      'Apply and download stamped PDF.'
    ],
    tips: 'A diagonal semi-transparent watermark deters unauthorized distribution without obscuring readability.'
  },
  'pdf-to-text': {
    title: 'How to Extract Text From a PDF',
    steps: [
      'Upload the PDF containing text.',
      'The engine decompiles text streams automatically.',
      'Copy the extracted plain text or save as a file.'
    ],
    tips: 'For scanned non-searchable PDFs, use our OCR tool for optical recognition.'
  },
  'pdf-toolbox': {
    title: 'How to Merge, Split, and Organize PDFs in Browser',
    steps: [
      'Choose your desired mode: Merge PDFs, Split Pages, or Rotate & Delete.',
      'Drop your PDF files into the secure browser RAM workspace.',
      'Arrange order, specify page extraction ranges, or rotate orientation.',
      'Download your finalized PDF document directly to your device.'
    ],
    tips: 'Powered by pdf-lib. All operations execute inside your browser sandbox with zero file uploads.'
  },
  'image-optimizer': {
    title: 'How to Resize, Compress, and Convert Images via Canvas',
    steps: [
      'Select or drop your image into the workspace.',
      'Choose target format (WebP, PNG, or JPEG) and adjust quality.',
      'Specify dimensions or select a social preset (Instagram, YouTube, X).',
      'Preview real-time bandwidth savings and download your optimized image.'
    ],
    tips: 'WebP provides the greatest bandwidth savings while maintaining transparent alpha channels.'
  }
};

const TOOL_TO_ARTICLE_MAP: Record<
  string,
  { id: string; title: string; excerpt: string; tag: string }
> = {
  'pdf-merger': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'pdf-splitter': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'pdf-compressor': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'pdf-to-image': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'image-to-pdf': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'pdf-lock-unlock': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'pdf-rotate': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'image-compressor': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'image-resizer': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'image-converter': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'image-optimizer': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'pdf-toolbox': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'image-editor': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'bg-remover': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'ocr-tool': {
    id: '5',
    title: 'Optical Character Recognition',
    excerpt: 'Running client-side machine learning OCR templates inside multi-worker threads.',
    tag: 'Local OCR'
  },
  'passport-photo-maker': {
    id: '7',
    title: 'Biometric Portrait Layout',
    excerpt: 'Guidelines for standard US passport dimensions and EU crop grids.',
    tag: 'Image Processing'
  },
  'signature-maker': {
    id: '2',
    title: 'Digital Signature Compliance',
    excerpt: 'How hand-drawn canvas curves comply with ESIGN and eIDAS acts.',
    tag: 'Security'
  },
  'invoice-generator': {
    id: '6',
    title: 'Recruiter-Compliant Templates',
    excerpt: 'Designing resumes for ATS parsers and invoice structures for ERP accounting.',
    tag: 'Business'
  },
  'resume-cv-builder': {
    id: '6',
    title: 'Recruiter-Compliant Templates',
    excerpt: 'Designing resumes for ATS parsers and invoice structures for ERP accounting.',
    tag: 'Business'
  },
  'qr-generator': {
    id: '1',
    title: 'The Sovereign Browser',
    excerpt: 'Why safe file compilation inside sandbox buffers protects your identity.',
    tag: 'Privacy'
  },
  'business-card-gen': {
    id: '4',
    title: 'Lossless Pixel Optimization',
    excerpt: 'The mathematics of image compression curves and bilinear grid scaling matrices.',
    tag: 'Image Processing'
  },
  'certificate-maker': {
    id: '6',
    title: 'Recruiter-Compliant Templates',
    excerpt: 'Designing resumes for ATS parsers and invoice structures for ERP accounting.',
    tag: 'Business'
  },
  'currency-converter': {
    id: '8',
    title: 'Financial Matrix Math',
    excerpt: 'Preventing double-precision rounding bugs in multi-decimal calculation modules.',
    tag: 'Math Engine'
  },
  'unit-converter': {
    id: '8',
    title: 'Financial Matrix Math',
    excerpt: 'Preventing double-precision rounding bugs in multi-decimal calculation modules.',
    tag: 'Math Engine'
  },
  'text-tools': {
    id: '1',
    title: 'The Sovereign Browser',
    excerpt: 'Why safe file compilation inside sandbox buffers protects your identity.',
    tag: 'Privacy'
  },
  'mockup-gen': {
    id: 'elvorro-premium-mockups',
    title: 'Designing Ultra-Level 3D Product Mockups',
    excerpt: 'Discover how modern web technologies enable photorealistic 3D apparel and merchandise mockup builders.',
    tag: 'Sovereign Business'
  },
  'bill-form-gen': {
    id: '6',
    title: 'Recruiter-Compliant Templates',
    excerpt: 'Designing resumes for ATS parsers and invoice structures for ERP accounting.',
    tag: 'Business'
  },
  'pdf-watermark': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  },
  'pdf-to-text': {
    id: '3',
    title: 'PDF Buffer Engineering',
    excerpt: 'Deep dive into PDF object trees, merging, splitting, and dictionary structures.',
    tag: 'PDF Tech'
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

interface ToolRendererProps {
  toolId?: string;
}

export default function ToolRenderer({ toolId: propToolId }: ToolRendererProps = {}) {
  const params = useParams<{ toolId: string }>();
  const navigate = useNavigate();
  const { activeToolId: contextToolId, favorites, toggleFavorite } = useToolora();

  // Helper to extract tool from URL if all else fails
  const getUrlToolId = () => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    const q = urlParams.get('tool');
    if (q) return q;
    const path = window.location.pathname;
    if (path.startsWith('/tools/')) {
      return path.replace('/tools/', '').split('/')[0].split('?')[0];
    }
    return null;
  };

  // Normalize aliases
  const normalizeToolId = (id: string | null | undefined): string | null => {
    if (!id) return null;
    if (id === 'mockup-generator') return 'mockup-gen';
    if (id === 'resume-builder') return 'resume-cv-builder';
    if (id === 'ocr') return 'ocr-tool';
    if (id === 'bill-form' || id === 'bill-form-generator') return 'bill-form-gen';
    if (id === 'business-card' || id === 'business-card-designer') return 'business-card-gen';
    return id;
  };

  const rawToolId = propToolId || params.toolId || contextToolId || getUrlToolId();
  const activeToolId = normalizeToolId(rawToolId);

  const currentTool = useMemo(() => TOOLS.find((t) => t.id === activeToolId), [activeToolId]);

  const related6Tools = useMemo(() => {
    if (!activeToolId) return [];
    const current = TOOLS.find((t) => t.id === activeToolId);
    const category = current?.category || 'all';
    const same = TOOLS.filter(
      (t) => t.category === category && t.id !== activeToolId
    ).slice(0, 6);
    const extra = TOOLS.filter(
      (t) => t.id !== activeToolId && !same.some((s) => s.id === t.id)
    )
      .sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0))
      .slice(0, 6 - same.length);
    return [...same, ...extra];
  }, [activeToolId]);

  const final3Articles = useMemo(() => {
    if (!activeToolId) return ARTICLES.slice(0, 3);
    const stub = TOOL_TO_ARTICLE_MAP[activeToolId];
    const main = stub
      ? ARTICLES.find((a) => a.id === stub.id || a.slug === stub.id)
      : undefined;
    if (!main) return ARTICLES.slice(0, 3);
    return [main, ...ARTICLES.filter((a) => a.id !== main.id).slice(0, 2)];
  }, [activeToolId]);

  const guide = useMemo(
    () => (activeToolId ? TOOL_GUIDES[activeToolId] : undefined),
    [activeToolId]
  );

  if (!activeToolId) {
    return (
      <div className="py-16 text-center space-y-3">
        <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          No tool selected
        </p>
        <p className="text-xs text-slate-500 dark:text-zinc-400">
          Please select one of the available tools from the catalog.
        </p>
      </div>
    );
  }

  const isFav = favorites.includes(activeToolId);

  const renderTool = () => {
    switch (activeToolId) {
      // ── PDF Tools ──
      case 'pdf-editor':
        return <PdfEditor />;
      case 'pdf-merger':
        return <PdfMerger />;
      case 'pdf-splitter':
        return <PdfSplitter />;
      case 'pdf-compressor':
        return <PdfCompressor />;
      case 'pdf-to-image':
        return <PdfToImage />;
      case 'image-to-pdf':
        return <ImageToPdf />;
      case 'pdf-lock-unlock':
        return <PdfLockUnlockTool />;
      case 'pdf-rotate':
        return <PdfRotateTool />;
      case 'pdf-watermark':
        return <PdfWatermarkText />;
      case 'pdf-to-text':
        return <PdfToText />;
      case 'pdf-toolbox':
      case 'pdftoolbox':
      case 'pdf-tools':
        return <PdfToolbox />;

      // ── Image Tools ──
      case 'image-optimizer':
      case 'imageoptimizer':
        return <ImageOptimizer />;
      case 'image-compressor':
        return <ImageCompressor />;
      case 'image-resizer':
        return <ImageResizer />;
      case 'image-converter':
        return <ImageConverterTool />;
      case 'ocr-tool':
      case 'ocr':
        return <OcrTool />;
      case 'image-editor':
        return <ImageEditor />;
      case 'passport-photo-maker':
        return <PassportPhotoMaker />;
      case 'bg-remover':
        return <BackgroundRemoverTool />;

      // ── Document & Generator Tools ──
      case 'invoice-generator':
        return <InvoiceGenerator />;
      case 'resume-cv-builder':
      case 'resume-builder':
        return <ResumeBuilder />;
      case 'qr-generator':
        return <QrCodeGenerator />;
      case 'signature-maker':
        return <SignatureMaker />;
      case 'business-card-gen':
      case 'business-card-designer':
      case 'business-card':
        return <BusinessCardDesigner />;
      case 'certificate-maker':
        return <CertificateMaker />;
      case 'mockup-gen':
      case 'mockup-generator':
        return <MockupGenerator />;
      case 'bill-form-gen':
      case 'bill-form-generator':
      case 'bill-form':
        return <BillFormGenerator />;

      // ── Converters & Text Utilities ──
      case 'unit-converter':
        return <UnitConverter />;
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'text-tools':
        return <TextToolsSuite />;

      default:
        return (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
              Tool "{activeToolId}" is being prepared
            </p>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Please select one of the available tools from the catalog.
            </p>
          </div>
        );
    }
  };

  // Fallback dummy tool if not found in catalog
  const resolvedTool: (typeof TOOLS)[0] = currentTool || {
    id: activeToolId,
    name: activeToolId,
    description: '100% Client-Side WebAssembly Utility',
    category: 'other',
    icon: 'wrench',
    popular: false,
    premium: false,
  };

  return (
    <ToolContainer
      tool={resolvedTool}
      guide={guide}
      relatedTools={related6Tools}
      relatedArticles={final3Articles}
    >
      <React.Suspense
        fallback={
          <ToolWorkspaceSkeleton
            toolName={currentTool?.name || activeToolId || undefined}
          />
        }
      >
        {renderTool()}
      </React.Suspense>
    </ToolContainer>
  );
}
