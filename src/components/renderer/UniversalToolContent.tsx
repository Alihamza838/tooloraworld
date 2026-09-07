// src/components/renderer/UniversalToolContent.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  FileText, 
  Zap, 
  Lock, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { TOOLS } from '../../data';
import { TOOL_AEO_DATA } from '../../data/toolAeoData';

interface UniversalToolContentProps {
  toolId: string;
}

interface ToolContentData {
  title: string;
  badge: string;
  description: string;
  sections: {
    title: string;
    description: string;
    points?: string[];
  }[];
  specifications: {
    label: string;
    value: string;
  }[];
  privacyComparison: {
    feature: string;
    toolora: string;
    traditional: string;
  }[];
  faqs: {
    q: string;
    a: string;
  }[];
}

const UNIVERSAL_TOOL_DATA: Record<string, ToolContentData> = {
  'mockup-gen': {
    title: 'Client-Side 3D & Vector Product Mockup Studio',
    badge: '3D Vector & Canvas Apparel Engine',
    description: 'Design photorealistic apparel, merchandise, packaging boxes, bottles, billboards, and stationery mockups directly in your browser with zero remote rendering queues.',
    sections: [
      {
        title: 'GPU Canvas Raytracing & Mesh Texture Mapping',
        description: 'Toolora Mockup Studio uses HTML5 dynamic canvas matrices with displacement and blend mode algorithms (Multiply, Screen, Overlay, Normal). Your uploaded brand logos, vector SVGs, and decals deform naturally around garment folds and surface curvature at 60 frames per second.',
        points: [
          'Live interactive decal repositioning, scaling (5% to 120%), rotation (0-360°), and opacity control.',
          'Custom brand hex palette generator with instant apparel and container tinting.',
          'Support for transparent PNGs, SVG vector marks, and crisp typography rendering.'
        ]
      },
      {
        title: 'Complete Commercial Product Catalog',
        description: 'Choose from 20+ pre-calibrated product categories including crewneck t-shirts, oversized streetwear hoodies, tote bags, snapback caps, ceramic mugs, aluminum soda cans, cosmetic jars, kraft boxes, delivery paper bags, and street billboards.',
        points: [
          'High-resolution multi-tier export presets: Web (500px), Print (1000px), and Ultra-HD Press (1500px).',
          'Instant lossless JPG and transparent PNG packaging downloads.',
          '100% royalty-free commercial usage rights for ecommerce stores, Shopify, and Amazon listings.'
        ]
      }
    ],
    specifications: [
      { label: 'Rendering Engine', value: 'HTML5 2D/3D Canvas Context' },
      { label: 'Supported Asset Formats', value: 'PNG, SVG, JPG, WebP' },
      { label: 'Max Canvas Resolution', value: '1500 x 1500 px (Press Grade)' },
      { label: 'Processing Speed', value: 'Real-time (<16ms frame render)' },
      { label: 'Telemetry & Cloud Transfer', value: '0 KB (100% Device RAM)' }
    ],
    privacyComparison: [
      { feature: 'File Transmission', toolora: '0 KB (Local RAM Sandbox)', traditional: 'Uploaded to cloud servers' },
      { feature: 'Subscription / Watermarks', toolora: '100% Free & Unwatermarked', traditional: 'Paywalls & watermark restrictions' },
      { feature: 'Export Render Queue', toolora: 'Instant client compilation', traditional: '30-90s remote server queue' },
      { feature: 'Asset Confidentiality', toolora: 'Zero leaks guaranteed', traditional: 'Stored on 3rd party databases' }
    ],
    faqs: [
      {
        q: 'Can I use mockups created here for my commercial ecommerce store?',
        a: 'Yes. All mockups generated via Toolora are 100% royalty-free with no attribution required. You can freely use them on Shopify, Etsy, Amazon, WooCommerce, or print-on-demand platforms.'
      },
      {
        q: 'Are my brand logos or unreleased designs uploaded to any server?',
        a: 'Never. Toolora runs entirely within your browser client environment. Your brand assets never leave your computer or smartphone RAM.'
      },
      {
        q: 'How do I achieve the most realistic print look on apparel?',
        a: 'Set the Blend Mode to Multiply when placing dark logos on light fabrics, and adjust the opacity slider to 90-95% to allow fabric texture subtleties to shine through.'
      }
    ]
  },
  'pdf-editor': {
    title: 'The Sovereign Browser PDF Studio & Form Editor',
    badge: 'Confidential Multi-Page PDF Engine',
    description: 'Annotate, draw signatures, insert form fields, redact private details, and assemble multi-page PDF documents locally with zero cloud telemetry.',
    sections: [
      {
        title: 'Multi-Layer Document Model & Vector Annotation',
        description: 'Using a high-performance dual-buffer architecture, Toolora separates background PDF page rendering from interactive annotation vectors. Type rich notes, draw freehand pen signatures, insert geometric shapes, and highlight crucial text without re-rasterizing the document.',
        points: [
          'High-DPI multi-page PDF rendering powered by WebAssembly and pdfjs-dist.',
          'Solid redaction blocks to securely mask confidential financial and medical numbers.',
          'Official rubber stamps: APPROVED, CONFIDENTIAL, DRAFT, SIGNATURE, VOID, and COPY.'
        ]
      },
      {
        title: 'Multi-Page Assembly & Document Compilation',
        description: 'Combine existing PDF pages with newly added blank sheets (A4, US Letter, Legal, Wide), duplicate contracts, reorder pages, and re-export the unified document at Press (300 DPI) quality using pdf-lib.',
        points: [
          'Batch image import: turn entire sets of receipts or scans into organized pages.',
          'Custom diagonal security watermarks with adjustable angle and opacity.',
          'Keyboard navigation with undo/redo (Ctrl+Z / Ctrl+Y) and item deletion.'
        ]
      }
    ],
    specifications: [
      { label: 'PDF Architecture', value: 'PDF-Lib + PDF.js WASM Pipeline' },
      { label: 'Page Formats Supported', value: 'A4, US Letter, Legal, Wide, Custom' },
      { label: 'Export Resolution', value: '1x (Web), 2x (Print ~200 DPI), 3x (300 DPI)' },
      { label: 'Security Verification', value: '100% Zero Remote Storage' }
    ],
    privacyComparison: [
      { feature: 'Document Data Privacy', toolora: '0 KB uploaded (Device RAM only)', traditional: 'Stored on remote document servers' },
      { feature: 'Multi-page Features', toolora: 'Unrestricted unlimited pages', traditional: 'Limited to 3-5 pages on free plans' },
      { feature: 'Compliance', toolora: 'GDPR, HIPAA, and NDA Safe', traditional: 'Potential compliance exposure' }
    ],
    faqs: [
      {
        q: 'Are my tax returns or legal contracts uploaded anywhere?',
        a: 'No. All editing, rendering, and PDF synthesis occur strictly in your local device memory.'
      },
      {
        q: 'Can I sign a contract and save it as a legally recognized PDF?',
        a: 'Yes. You can draw your signature, position it precisely on the signature line, and download the flattened PDF ready for email delivery.'
      }
    ]
  },
  'pdf-merger': {
    title: 'Client-Side PDF Document Merger & Binder',
    badge: 'Multi-Document Assembly Engine',
    description: 'Combine multiple PDF files, reports, and invoices into a single organized document in seconds without file size limits.',
    sections: [
      {
        title: 'Binary Stream Concatenation Without Quality Loss',
        description: 'Toolora reads and stitches PDF cross-reference tables and content streams directly in memory. Vector fonts, embedded graphics, and hyperlinks remain preserved.',
        points: [
          'Drag-and-drop visual page sequencing and multi-file reorganization.',
          'Preserves original color profiles and high-resolution typography.',
          'Runs entirely offline once loaded in your browser cache.'
        ]
      }
    ],
    specifications: [
      { label: 'Engine', value: 'PDF-Lib Binary Assembler' },
      { label: 'File Size Limit', value: 'Unlimited (Device RAM dependent)' },
      { label: 'File Output', value: 'Standard PDF 1.7 / A-1b compliant' }
    ],
    privacyComparison: [
      { feature: 'File Security', toolora: 'Never leaves device', traditional: 'Uploaded to third-party servers' },
      { feature: 'Daily Merge Limits', toolora: 'Unlimited', traditional: '2-3 files per day limit' }
    ],
    faqs: [
      {
        q: 'Is there a limit on how many PDFs I can merge at once?',
        a: 'No. You can merge as many documents as your device RAM can hold smoothly.'
      }
    ]
  },
  'pdf-compressor': {
    title: 'Smart PDF Stream & Image Stream Compressor',
    badge: 'Lossless & High-Efficiency Compression',
    description: 'Reduce heavy PDF file sizes for email attachments and portal uploads while maintaining crystal-clear text readability.',
    sections: [
      {
        title: 'Intelligent PDF Object Optimization',
        description: 'Compress embedded raster photography and strip redundant metadata dictionaries without blurring vector typography or form fields.',
        points: [
          'Configurable compression levels: Low (Preserve DPI), Medium (Balanced), High (Maximum Reduction).',
          'Eliminates duplicate fonts and unreferenced stream objects.',
          'Real-time before-and-after file size preview.'
        ]
      }
    ],
    specifications: [
      { label: 'Compression Method', value: 'Bilinear Canvas Resampling + Stream Flate' },
      { label: 'Target Size Reduction', value: 'Up to 80% on scanned documents' }
    ],
    privacyComparison: [
      { feature: 'Document Retention', toolora: 'Zero retention (instant RAM wipe)', traditional: 'Saved for 1-24 hours in cloud' }
    ],
    faqs: [
      {
        q: 'Will compressing my PDF make the text blurry?',
        a: 'No. Vector text remains mathematically crisp. Only embedded high-resolution photo scans are re-encoded to optimal web DPI.'
      }
    ]
  },
  'image-compressor': {
    title: 'Lossless & Perceptual Image Optimizer',
    badge: 'Bilinear Canvas Compression Suite',
    description: 'Compress PNG, JPG, and WebP images up to 90% without visible loss of sharpness for web optimization and fast page speed.',
    sections: [
      {
        title: 'Perceptual Quality Tuning & Metadata Stripping',
        description: 'Toolora dynamically optimizes color tables and removes heavy EXIF GPS metadata, giving you clean, featherweight images ready for web deployment.',
        points: [
          'Live visual side-by-side quality comparison.',
          'Lossless compression mode for crisp UI screenshots and icons.',
          'Batch processing capability with instant ZIP downloads.'
        ]
      }
    ],
    specifications: [
      { label: 'Supported Formats', value: 'JPG, PNG, WebP, GIF, BMP' },
      { label: 'Algorithm', value: 'Perceptual Quantization + Lanczos Resampling' }
    ],
    privacyComparison: [
      { feature: 'Privacy', toolora: '100% In-Browser Execution', traditional: 'Remote server compression APIs' }
    ],
    faqs: [
      {
        q: 'How much file size can I expect to save?',
        a: 'Most smartphone camera photos reduce by 60% to 85% at a quality setting of 80% without noticeable difference.'
      }
    ]
  },
  'resume-cv-builder': {
    title: 'ATS-Optimized Resume & CV Studio — 2026 Hiring Standard',
    badge: 'Applicant Tracking System (ATS) Compliant Engine',
    description: 'Craft high-impact tech, executive, academic, and creative resumes designed with live ATS keyword compatibility scoring, 10 industry layouts, and 100% private browser rendering.',
    sections: [
      {
        title: 'Single-Column Semantic Typography & ATS Compatibility',
        description: 'Over 75% of resumes submitted to Fortune 500 companies are filtered out by Applicant Tracking Systems (Workday, Greenhouse, Taleo, Lever, iCIMS) before reaching human recruiters. Toolora implements semantic document structures, standardized heading hierarchies, and machine-parsable bullet points that pass automated parsers with 100% fidelity.',
        points: [
          'Live ATS keyword compatibility scanner analyzing action verbs, quantifiable metrics, and skill density.',
          'Structured sections for Professional Summary, Experience, Education, Technical Skills, Projects, Certifications, Languages, and Awards.',
          'Instant reordering of sections (up/down) to tailor emphasis for entry-level, career-changer, or senior executive profiles.',
          'AI-assisted bullet optimizer applying the proven Action Verb + Context + Quantifiable Result formula.'
        ]
      },
      {
        title: '10 Handcrafted Multi-Industry Templates & Print Precision',
        description: 'Switch effortlessly between 10 specialized design templates: Minimal Ink (pure single-column ATS), Executive Classic (formal corporate serif), Tech Terminal (developer-focused monospace accents), Modern Split (balanced visual hierarchy), Luxury Dark, Academic Scholar, Creative Flow, Bold Sidebar, Editorial, and Timeline.',
        points: [
          'Multi-lingual dictionary support with localized headers in 8 languages (EN, ES, FR, DE, IT, TR, UR, AR).',
          'Export options include standard vector PDF print output and structured JSON backup for instant reloading.',
          'Customizable accent palettes, typography pairings (Inter, Playfair Display, Space Grotesk, JetBrains Mono), and line spacing controls.',
          'Optional photo upload with toggleable circular/rounded frame for international CV standards.'
        ]
      }
    ],
    specifications: [
      { label: 'ATS Parsing Standard', value: '100% Machine-Readable Vector Text' },
      { label: 'Available Templates', value: '10 Industry Presets (Tech, Executive, Modern, etc.)' },
      { label: 'Export Options', value: 'Vector PDF (Print Engine) + Structured JSON' },
      { label: 'Supported Languages', value: 'English, Spanish, French, German, Italian, Turkish, Urdu, Arabic' },
      { label: 'Telemetry & Cloud Transfer', value: '0 KB (Local RAM Sandbox)' }
    ],
    privacyComparison: [
      { feature: 'Personal Contact & Salary Data', toolora: 'Stored 100% in local device memory', traditional: 'Sold or scraped into recruiter lead databases' },
      { feature: 'Subscription & Watermarks', toolora: '100% Free Forever with Zero Watermarks', traditional: '$20–$40/month recurring paywalls for PDF download' },
      { feature: 'Data Portability', toolora: 'Instant JSON Import/Export backup', traditional: 'Proprietary lock-in without raw export' },
      { feature: 'Account Requirement', toolora: 'No signup or login required', traditional: 'Mandatory email collection and spam newsletters' }
    ],
    faqs: [
      {
        q: 'Why does Toolora focus heavily on ATS-friendly single-column formatting?',
        a: 'Applicant Tracking Systems frequently choke on multi-column tables, floating text boxes, and complex vector graphics, misplacing candidate names, job titles, and graduation dates. Toolora builds a clean linear typographic hierarchy that machine parsers and human recruiters can read flawlessly.'
      },
      {
        q: 'How does the live ATS Compatibility Score work?',
        a: 'The real-time evaluator analyzes your bullet points for strong action verbs (e.g., spearheaded, architected, delivered), verifies quantified metrics (percentages, dollar amounts, team sizes), checks summary completeness, and evaluates skill group distribution.'
      },
      {
        q: 'Is my confidential career history or phone number sent to any server?',
        a: 'Never. Toolora runs 100% locally in your web browser. When you close the tab or clear your session, data stays exclusively on your machine unless you export a JSON backup file.'
      },
      {
        q: 'How do I download my resume as a clean PDF without headers or footers?',
        a: 'Click the "Download PDF" button in the preview toolbar. In the browser print dialog, ensure "Save as PDF" is selected, and uncheck "Headers and footers" under More Settings for a pristine, professional document.'
      },
      {
        q: 'Can I save my resume and edit it later on another computer?',
        a: 'Yes! Click "Export JSON" to download your complete resume data as a lightweight file. On your other computer, simply click "Import JSON" in Toolora to restore your exact work instantly.'
      }
    ]
  },
  'invoice-generator': {
    title: 'Professional Freelance & Business Invoice Builder',
    badge: 'Automated Accounting & Billing Suite',
    description: 'Generate itemized, tax-compliant invoices and receipts with automatic total calculations and instant vector PDF downloads.',
    sections: [
      {
        title: 'Itemized Billing & Tax Breakdown Matrix',
        description: 'Easily configure line items, hourly rates, project quantities, discounts, and regional sales tax (VAT / GST). Download crisp, professional billing documents in seconds.',
        points: [
          'Automatic mathematical summation with floating-point precision guards.',
          'Custom brand logo upload and corporate color theme selection.',
          'Includes payment terms, bank details, and client notes sections.'
        ]
      }
    ],
    specifications: [
      { label: 'Calculation Matrix', value: 'Subtotal, Tax Rate, Discount, Grand Total' },
      { label: 'Export Standards', value: 'High-Resolution Vector PDF' }
    ],
    privacyComparison: [
      { feature: 'Financial Data Security', toolora: 'Zero logging of rates or bank accounts', traditional: 'Financial records stored on third-party SaaS' }
    ],
    faqs: [
      {
        q: 'Can I add my business logo and payment instructions?',
        a: 'Yes. You can upload your business logo, specify payment details (IBAN, PayPal, Stripe), and configure custom payment terms.'
      }
    ]
  },
  'bill-form-gen': {
    title: 'Global Bill, Commercial Invoice & Utility Statement Studio',
    badge: 'Multi-Country Tax & Ledger Engine',
    description: 'Generate country-accurate utility statements (electricity, gas, water) and commercial tax invoices for US, UK, India, and Pakistan with automated tariffs, local signature canvas, and vector PDF exports.',
    sections: [
      {
        title: 'Country-Accurate Utility Tariffs & Tax Engines',
        description: 'Pre-calibrated tariff calculations for US CCF/Therms, UK dual-fuel kWh/pennies, India DISCOM slabs with duty cess, and Pakistan LESCO/SNGPL FPA & GST formulas.',
        points: [
          'Live calculation of consumption tiers, standing charges, meter rent, and government surcharges.',
          'Support for US Sales Tax, UK VAT (Standard/Reduced/Zero), India GST (CGST/SGST/IGST), and Pakistan FBR/PRA Sales Tax.',
          'Built-in digital signature pad: draw directly on touchscreen or type cursive name.'
        ]
      },
      {
        title: 'Local Document Library & JSON Portability',
        description: 'Save up to 30 documents securely in your browser localStorage sandbox. Export and import entire ledger configurations as JSON backups without creating an account.',
        points: [
          'Automatic session recovery restores your latest unsaved document if you accidentally close the tab.',
          'Custom brand logo upload cached locally in base64 without cloud uploads.',
          'Print-optimized styling formatted to exact A4 dimensions with zero margin clipping.'
        ]
      }
    ],
    specifications: [
      { label: 'Supported Jurisdictions', value: 'US, UK, India, Pakistan, Global' },
      { label: 'Tax Calculations', value: 'GST, VAT, Sales Tax, Duty, Surcharges' },
      { label: 'Persistence', value: 'Local Storage Sandbox + JSON Export' },
      { label: 'Export Format', value: 'Vector A4 Print / PDF' }
    ],
    privacyComparison: [
      { feature: 'Customer Records & Rates', toolora: 'Stored 100% locally in browser', traditional: 'Logged on cloud accounting servers' },
      { feature: 'Subscription & Watermarks', toolora: '100% Free Forever, Zero Watermark', traditional: '$15-30/mo subscription required' }
    ],
    faqs: [
      {
        q: 'Can I create a utility bill for address verification or proof of residence backup?',
        a: 'Yes. The generator produces clean, mathematically accurate statements for educational, demonstration, accounting, and record-keeping purposes.'
      },
      {
        q: 'How do I save my invoices so I can edit them later?',
        a: 'Click "Save" in the Local Document Library tab or click "Export JSON" to download a backup file that you can re-import on any device at any time.'
      }
    ]
  },
  'certificate-maker': {
    title: 'Online Certificate & Award Designer',
    badge: 'Vector Award Typography Engine',
    description: 'Design professional certificates of completion, appreciation, attendance, and excellence with ornate borders, gold badges, and signature stamps.',
    sections: [
      {
        title: 'Classic & Modern Certificate Layouts',
        description: 'Choose from academic, executive, corporate, and minimalist certificate frameworks with customizable borders, guilloche corner ornaments, and embossed gold seal accents.',
        points: [
          'Live dual-line signature stamps for instructors and institutional directors.',
          'Support for custom institutional crest and organization logo placement.',
          'Export high-resolution 300 DPI vector PDF or transparent PNG award assets.'
        ]
      }
    ],
    specifications: [
      { label: 'Aspect Ratio', value: 'Standard Landscape A4 / Letter' },
      { label: 'Border Ornaments', value: 'Guilloche Vector Patterns' }
    ],
    privacyComparison: [
      { feature: 'Recipient Names & Data', toolora: 'Processed only in browser memory', traditional: 'Stored on remote marketing servers' }
    ],
    faqs: [
      {
        q: 'Can I print certificates on heavy cardstock?',
        a: 'Yes. The exported PDF uses vector rendering so typography and borders print razor-sharp on any standard home or commercial laser printer.'
      }
    ]
  },
  'signature-maker': {
    title: 'Digital Signature Studio & Vector Ink Pad',
    badge: 'Smooth Bezier Stroke Engine',
    description: 'Create smooth digital signatures with realistic fountain pen physics, customized stroke widths, transparent backgrounds, and one-click PNG downloads.',
    sections: [
      {
        title: 'Natural Calligraphy & Smooth Bezier Curves',
        description: 'Draw freehand signatures using mouse, trackpad, or stylus. Intelligent velocity-sensitive curve smoothing eliminates jagged lines and delivers a natural pen-on-paper look.',
        points: [
          'Instant transparent PNG download ready to paste into PDF contracts and documents.',
          'Multiple ink colors: classic fountain blue, executive black, and crimson red.',
          'Typographic cursive mode for automated stylish digital signing.'
        ]
      }
    ],
    specifications: [
      { label: 'Canvas Interpolation', value: 'Quadratic Bezier Smooth Curves' },
      { label: 'Output Format', value: 'Transparent Alpha PNG' }
    ],
    privacyComparison: [
      { feature: 'Signature Biometrics', toolora: '100% Isolated in RAM (0 KB sent)', traditional: 'Transmitted to cloud e-sign vendors' }
    ],
    faqs: [
      {
        q: 'Is my digital signature saved on your servers?',
        a: 'Never. Toolora is completely client-side. Your signature is rendered directly on your device canvas and vanishes when you clear it.'
      }
    ]
  },
  'qr-generator': {
    title: 'Custom Vector QR Code Generator with Logo',
    badge: 'Reed-Solomon Error Correction',
    description: 'Generate high-density, scannable QR codes for URLs, Wi-Fi networks, vCards, phone numbers, and plain text with custom color gradients and embedded logos.',
    sections: [
      {
        title: 'Customizable Patterns & Logo Placement',
        description: 'Configure dot styles, eye shapes, and background palettes. Embed your company logo directly into the center of the code without breaking scannability.',
        points: [
          'Four levels of Reed-Solomon error correction (L 7%, M 15%, Q 25%, H 30%).',
          'Export as scalable SVG vectors or high-resolution print PNGs.',
          'Permanent static QR codes that never expire and require no redirect subscription.'
        ]
      }
    ],
    specifications: [
      { label: 'Standard', value: 'ISO/IEC 18004 QR Code' },
      { label: 'Error Correction', value: 'Level H (Up to 30% Damage Recovery)' }
    ],
    privacyComparison: [
      { feature: 'QR Redirection Limits', toolora: 'Direct static encoding (Never expires)', traditional: 'Dynamic URLs that expire or show ads' }
    ],
    faqs: [
      {
        q: 'Will these QR codes stop working after a while?',
        a: 'No. They are 100% static QR codes encoding your direct data. They will work forever without monthly fees or scan limits.'
      }
    ]
  },
  'business-card-gen': {
    title: 'Interactive 3.5" x 2" Business Card Designer',
    badge: 'Standard Print Bleed Canvas',
    description: 'Design sleek, modern business cards with front and back layouts, QR code integrations, typography pairings, and print-ready exports.',
    sections: [
      {
        title: 'Standard International Business Card Stock',
        description: 'Formatted to standard 3.5 x 2 inch (89 x 51 mm) card dimensions with safe zones, bleed margins, and crisp vector typography.',
        points: [
          'Flip between Front and Back card faces in real time.',
          'Custom brand color accents, phone, email, and social handles.',
          'Instant print layout preview.'
        ]
      }
    ],
    specifications: [
      { label: 'Dimensions', value: '3.5" x 2" (Standard CR80)' },
      { label: 'Color Space', value: 'sRGB / Print Ready Matrix' }
    ],
    privacyComparison: [
      { feature: 'Contact Information', toolora: 'Local memory only', traditional: 'Collected for marketing' }
    ],
    faqs: [
      {
        q: 'What size should I print these cards on?',
        a: 'The design is calibrated for standard 3.5 x 2 inch cardstock available at any standard print shop.'
      }
    ]
  },
  'ocr-tool': {
    title: 'Client-Side Neural Optical Character Recognition (OCR)',
    badge: 'WebAssembly Tesseract Scanner',
    description: 'Extract searchable, editable text from scanned documents, receipts, book pages, and images without uploading photos to external servers.',
    sections: [
      {
        title: 'Local Neural Pattern Text Recognition',
        description: 'Toolora executes OCR models locally inside Web Workers, preventing browser UI freezes while maintaining total confidentiality of scanned documents.',
        points: [
          'High accuracy character segmentation and layout analysis.',
          'One-click plain text copy or text file download.',
          'Zero cloud API billing or token usage.'
        ]
      }
    ],
    specifications: [
      { label: 'Engine', value: 'WASM Multi-Threaded OCR' },
      { label: 'Supported Inputs', value: 'PNG, JPG, WebP, Scanned Documents' }
    ],
    privacyComparison: [
      { feature: 'Document Privacy', toolora: '100% on-device optical processing', traditional: 'Sent to cloud OCR vendors' }
    ],
    faqs: [
      {
        q: 'What type of images work best for OCR?',
        a: 'High-contrast, evenly lit images with straight horizontal text lines yield accuracy rates over 98%.'
      }
    ]
  },
  'pdf-splitter': {
    title: 'Precision PDF Page Splitter & Extraction Engine',
    badge: 'In-Memory Page Demuxer',
    description: 'Extract specific pages or page ranges from multi-page PDFs, or split entire documents into individual standalone files instantly.',
    sections: [
      {
        title: 'Lossless Page Extraction',
        description: 'Extract specific chapters, signed receipt pages, or custom page sequences (e.g. 1-3, 7, 10-12) without re-encoding text or degrading vector artwork.',
        points: [
          'Visual thumbnail selector with single-click page extraction.',
          'Custom page range parser with syntax error validation.',
          'Download extracted pages as standalone PDF or bundle as ZIP.'
        ]
      }
    ],
    specifications: [
      { label: 'Processing Speed', value: '< 250ms for 50-page document' },
      { label: 'Data Encryption', value: 'Private In-RAM stream only' }
    ],
    privacyComparison: [
      { feature: 'Confidential PDF Split', toolora: 'Zero byte outbound transmission', traditional: 'Uploaded to third-party servers' }
    ],
    faqs: [
      {
        q: 'Can I extract multiple non-consecutive pages?',
        a: 'Yes. You can specify custom ranges like "1-3, 5, 8-10" to extract only the necessary pages into a new combined PDF.'
      }
    ]
  },
  'pdf-to-image': {
    title: 'High-DPI PDF to PNG / JPG Converter',
    badge: 'Vector Rasterizer Canvas',
    description: 'Convert PDF document pages into high-resolution PNG or JPG image files with selectable rendering scales (1x, 2x, 3x) and zero server queues.',
    sections: [
      {
        title: 'High-Resolution Page Rasterization',
        description: 'Render complex vector documents, charts, CAD schematics, and presentation slides into crisp 300 DPI image assets ready for web or slide presentations.',
        points: [
          'Selectable output format: Lossless transparent PNG or compressed JPEG.',
          'Individual page download or one-click batch ZIP extraction.',
          'Runs entirely client-side using HTML5 canvas hardware rasterizers.'
        ]
      }
    ],
    specifications: [
      { label: 'Render Resolutions', value: '150 DPI, 300 DPI, Ultra HD' },
      { label: 'Image Encoders', value: 'Lossless PNG / Web-optimized JPEG' }
    ],
    privacyComparison: [
      { feature: 'Image Conversion Privacy', toolora: 'Rendered in local GPU context', traditional: 'Stored on cloud conversion servers' }
    ],
    faqs: [
      {
        q: 'What resolution are the extracted images?',
        a: 'Images are rendered at native vector resolution up to 300 DPI, making them crisp for print presentations or digital displays.'
      }
    ]
  },
  'image-to-pdf': {
    title: 'Batch Image to PDF Document Assembler',
    badge: 'Lossless Image Stitcher',
    description: 'Combine multiple JPG, PNG, and WebP images into a single structured PDF document with custom page dimensions, orientation, and margin settings.',
    sections: [
      {
        title: 'Intelligent Margin & Page Sizing',
        description: 'Automatically size pages to A4, US Letter, or fit-to-image dimensions. Reorder pages with intuitive drag-and-drop sequencing before compilation.',
        points: [
          'Support for mixed image formats (PNG, JPG, WebP) in a single document.',
          'Selectable orientation: Portrait, Landscape, or Auto-detect.',
          'Instant PDF compilation in browser memory.'
        ]
      }
    ],
    specifications: [
      { label: 'Input Formats', value: 'JPG, PNG, WebP, GIF, BMP' },
      { label: 'Output Standards', value: 'Standard ISO PDF 1.7' }
    ],
    privacyComparison: [
      { feature: 'Personal Scans & Receipts', toolora: 'Never leaves device memory', traditional: 'Uploaded and cached in cloud' }
    ],
    faqs: [
      {
        q: 'Can I combine multiple receipts into one PDF?',
        a: 'Yes. Upload all receipt photos, drag them into chronological order, and click Create PDF to generate an organized report.'
      }
    ]
  },
  'passport-photo-maker': {
    title: 'Biometric Passport & Visa Photo Creator',
    badge: 'International Biometric Sizing Suite',
    description: 'Create standardized biometric passport, visa, and ID photos for US (2x2"), UK, Schengen, Canada, India, and 50+ countries with printable multi-photo sheets.',
    sections: [
      {
        title: 'Official Biometric Aspect Ratios & Backgrounds',
        description: 'Conforms to official international passport specifications with face-centering guides, custom background replacement (white, light gray, blue), and 4x6" print sheet layouts.',
        points: [
          'Pre-calibrated presets for US Passport, UK/EU Biometric, Schengen Visa, India OCI/Passport, and Canadian PR.',
          'Generate multi-photo 4x6 inch (10x15 cm) print grids ready for pharmacy photo printing kiosks.',
          '100% private biometric processing: zero facial scans are ever uploaded or analyzed on remote servers.'
        ]
      }
    ],
    specifications: [
      { label: 'Supported Country Standards', value: 'US (2x2"), UK/EU (35x45mm), India (35x35mm), Canada, Global' },
      { label: 'Print Grid', value: 'Standard 4x6" (6-photo sheet)' }
    ],
    privacyComparison: [
      { feature: 'Biometric Facial Data', toolora: '100% Zero-Cloud Guarantee (Local RAM only)', traditional: 'Facial data uploaded and indexed on cloud' }
    ],
    faqs: [
      {
        q: 'Will these passport photos pass official acceptance checks?',
        a: 'Yes. As long as you provide a well-lit photo with neutral facial expression, the tool aligns your photo to the exact official dimensional standards.'
      }
    ]
  },
  'bg-remover': {
    title: 'Smart Color & Chromakey Background Eraser',
    badge: 'Client-Side Canvas Color Keying',
    description: 'Remove solid and studio backgrounds from logos, headshots, and product photos with interactive color picking, tolerance sliders, and transparent PNG exports.',
    sections: [
      {
        title: 'Hardware-Accelerated Alpha Channel Extraction',
        description: 'Sample any background hue with a single click and adjust similarity tolerance and edge softness to achieve clean transparent cutouts in real time.',
        points: [
          'Eyedropper tool with real-time RGB color keying.',
          'Tolerance, feathering, and edge smoothing sliders.',
          'Instant lossless transparent PNG download.'
        ]
      }
    ],
    specifications: [
      { label: 'Algorithm', value: 'Canvas RGBA Euclidian Distance Filtering' },
      { label: 'Output', value: 'Alpha Channel 32-bit PNG' }
    ],
    privacyComparison: [
      { feature: 'Private Headshots', toolora: 'Local GPU sandbox execution', traditional: 'Processed via cloud AI APIs' }
    ],
    faqs: [
      {
        q: 'What types of backgrounds work best?',
        a: 'Evenly lit, solid color backdrops (such as studio white, green screen, or flat backgrounds) erase with the highest precision.'
      }
    ]
  },
  'unit-converter': {
    title: 'Universal Multi-Unit Measurement Converter',
    badge: 'High-Precision Scientific Matrix',
    description: 'Convert length, mass, temperature, volume, digital storage, speed, pressure, and energy with floating-point precision guards and instant live updates.',
    sections: [
      {
        title: 'Comprehensive Physical & Digital Dimensions',
        description: 'Seamlessly switch between Metric (SI), Imperial, and US Customary measurement systems with simultaneous conversions across all related units.',
        points: [
          'High precision calculations with scientific notation support.',
          'Categories include Length, Weight, Temperature, Area, Volume, Speed, and Data Bytes.',
          'Instant bidirectional calculations as you type.'
        ]
      }
    ],
    specifications: [
      { label: 'Precision', value: 'IEEE 754 Double Precision Floating Point' },
      { label: 'Categories', value: 'Length, Mass, Volume, Temperature, Data, Speed' }
    ],
    privacyComparison: [
      { feature: 'Telemetry & Tracking', toolora: 'Zero network traffic (100% offline)', traditional: 'Ad-heavy converters with tracking' }
    ],
    faqs: [
      {
        q: 'Does this work completely offline without an internet connection?',
        a: 'Yes. All unit formulas are compiled directly into the application JavaScript and execute instantaneously offline.'
      }
    ]
  },
  'currency-converter': {
    title: 'Global Currency & Exchange Rate Calculator',
    badge: 'Multi-Currency Calculation Engine',
    description: 'Convert between 160+ world currencies, crypto assets, and commodities with live benchmark exchange rates and zero ads or paywalls.',
    sections: [
      {
        title: 'Accurate Multi-Currency Matrix',
        description: 'Calculate international money conversions across USD, EUR, GBP, JPY, INR, PKR, CAD, AUD, and 150+ national currencies with instant inverse rates.',
        points: [
          'Quick swap button for bidirectional currency conversion.',
          'Live benchmark rates with local decimal formatting.',
          'Zero intrusive advertisements or financial subscription prompts.'
        ]
      }
    ],
    specifications: [
      { label: 'Supported Currencies', value: '160+ Global Fiat & Regional Currencies' },
      { label: 'Calculation Latency', value: '< 1ms Instant Client Compute' }
    ],
    privacyComparison: [
      { feature: 'Financial Inquiries', toolora: 'Zero logging of converted amounts', traditional: 'Financial behavior tracked for ad targeting' }
    ],
    faqs: [
      {
        q: 'How often are exchange rates updated?',
        a: 'Benchmark rates are synced against international currency indexes to ensure reliable conversion estimates for travel and commerce.'
      }
    ]
  },
  'text-tools': {
    title: 'Advanced Text Suite & Typographic Formatter',
    badge: 'Regex & Lexical Analysis Suite',
    description: 'Transform letter casing, clean duplicate whitespace, count words and characters, calculate reading time, and analyze typography in real time.',
    sections: [
      {
        title: 'Comprehensive Text Transformations',
        description: 'Switch between UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case with one click. Clean messy clipboard formatting effortlessly.',
        points: [
          'Live lexical metrics: word count, character count (with/without spaces), sentence count, and reading duration.',
          'Deduplicate whitespace, trim extra lines, and remove special characters.',
          'One-click clipboard copy and plain text download.'
        ]
      }
    ],
    specifications: [
      { label: 'Character Limits', value: 'Unlimited (Client Memory Dependent)' },
      { label: 'Analysis Engine', value: 'Client Lexical Tokenizer' }
    ],
    privacyComparison: [
      { feature: 'Confidential Notes & Text', toolora: 'Kept 100% in RAM (never logged)', traditional: 'Transmitted to cloud text processors' }
    ],
    faqs: [
      {
        q: 'Is there a character limit when pasting large articles or manuscripts?',
        a: 'No. You can paste full book chapters or code files and analyze them instantaneously in your browser memory.'
      }
    ]
  },
  'pdf-lock-unlock': {
    title: 'Client-Side PDF Encryption & Password Security Studio',
    badge: 'AES-128 / AES-256 In-Memory Cryptography',
    description: 'Protect sensitive PDF documents with secure user and owner passwords or decrypt authorized files without uploading files to remote servers.',
    sections: [
      {
        title: 'Cryptographic Security & Zero-Upload Guarantee',
        description: 'Toolora performs PDF encryption and decryption entirely in your local browser sandbox memory using WebAssembly. Your confidential financial reports, legal agreements, and personal tax returns never leave your device.',
        points: [
          'Military-grade standard PDF encryption for confidential document sharing.',
          'Set custom user access passwords and owner permissions.',
          'Decrypt previously secured files when valid credentials are provided.',
          'Zero byte outbound telemetry ensures total privacy compliance with GDPR and HIPAA.'
        ]
      }
    ],
    specifications: [
      { label: 'Encryption Standard', value: 'Standard PDF Security Protocol' },
      { label: 'Execution Environment', value: '100% Client-Side WebAssembly' },
      { label: 'File Retention', value: '0 Seconds (Volatile Device RAM)' }
    ],
    privacyComparison: [
      { feature: 'Password & File Security', toolora: 'Encrypted on-device (zero telemetry)', traditional: 'Passwords sent over internet to cloud servers' },
      { feature: 'Subscription Paywalls', toolora: '100% Free with unlimited documents', traditional: 'Limited to 1-2 free operations per day' }
    ],
    faqs: [
      {
        q: 'Are my passwords or PDF contents sent over the internet?',
        a: 'No. All cryptographic operations run inside your browser. No passwords or file data are ever transmitted to Toolora or any third parties.'
      },
      {
        q: 'Can I remove passwords from a PDF I own?',
        a: 'Yes. If you know the authorized password, you can unlock and export a clean unencrypted copy for archival purposes.'
      }
    ]
  },
  'pdf-rotate': {
    title: 'Precision PDF Page Orientation & Rotation Studio',
    badge: 'Lossless Page Matrix Transformation',
    description: 'Correct orientation of upside-down or sideways PDF scans and documents with instant 90°, 180°, and 270° lossless rotation.',
    sections: [
      {
        title: 'Lossless Vector Page Transformation',
        description: 'Rotate individual pages or entire documents without re-rasterizing text layers or compressing embedded graphics. The resulting PDF maintains full vector clarity and searchable text streams.',
        points: [
          'Rotate single pages, selected page ranges, or all pages simultaneously.',
          'Instant 90° clockwise, 90° counter-clockwise, and 180° flip controls.',
          'Live visual thumbnail inspection before saving changes.',
          'Instant in-browser compilation with zero quality degradation.'
        ]
      }
    ],
    specifications: [
      { label: 'Rotation Angles', value: '90°, 180°, 270° (Clockwise / Counter-Clockwise)' },
      { label: 'Quality Retention', value: '100% Lossless (Zero Re-compression)' }
    ],
    privacyComparison: [
      { feature: 'Document Processing', toolora: 'Processed in browser memory sandbox', traditional: 'Uploaded to third-party PDF cloud engines' }
    ],
    faqs: [
      {
        q: 'Does rotating pages reduce the quality of my PDF?',
        a: 'No. Toolora modifies the internal page rotation matrix without touching image streams or re-rendering text vectors.'
      },
      {
        q: 'Can I rotate just one page in a 20-page document?',
        a: 'Yes. You can select specific pages to rotate while leaving the rest of the document untouched.'
      }
    ]
  },
  'pdf-watermark': {
    title: 'Confidential PDF Security Watermark & Stamp Engine',
    badge: 'High-DPI Vector Watermark Layering',
    description: 'Stamp custom confidentiality notices, draft labels, copyright markers, or image logos across PDF pages with adjustable opacity and rotation angles.',
    sections: [
      {
        title: 'Customizable Security & Copyright Watermarks',
        description: 'Protect intellectual property by applying diagonal or horizontal text stamps (CONFIDENTIAL, DRAFT, DO NOT COPY, SAMPLE) or custom corporate logos directly onto PDF documents.',
        points: [
          'Custom text or vector image watermark stamping.',
          'Adjustable opacity, rotation angle (0° to 360°), font size, and color.',
          'Layer placement controls (over content or under text).',
          'Instant high-speed batch stamping across all document pages.'
        ]
      }
    ],
    specifications: [
      { label: 'Watermark Types', value: 'Custom Text & Transparent Image Logos' },
      { label: 'Angle & Opacity', value: 'Full 360° Rotation + 1-100% Transparency' }
    ],
    privacyComparison: [
      { feature: 'Proprietary Documents', toolora: 'Processed locally (zero leaks)', traditional: 'Transmitted to cloud conversion servers' }
    ],
    faqs: [
      {
        q: 'Will the watermark obscure the text beneath it?',
        a: 'You can adjust the opacity slider (typically 15% to 30%) so the watermark is clearly visible while keeping the underlying text fully readable.'
      },
      {
        q: 'Can I apply watermarks to specific pages only?',
        a: 'Yes. You can apply watermarks to all pages, odd pages, even pages, or specific custom page ranges.'
      }
    ]
  },
  'pdf-to-text': {
    title: 'Lossless PDF Text Stream Decompiler & Extractor',
    badge: 'CFF / TrueType Unicode Decompilation',
    description: 'Extract raw selectable text, structured paragraphs, and metadata from PDF files into clean, readable plain text without server uploads.',
    sections: [
      {
        title: 'High-Fidelity Unicode Text Stream Extraction',
        description: 'Toolora parses PDF Content Streams, font encoding tables, and ToUnicode mappings to extract character data with preserved whitespace and paragraph line-breaks.',
        points: [
          'Decompiles native PDF text streams instantly in browser memory.',
          'Preserves paragraph boundaries, numbered lists, and layout flow.',
          'One-click copy to clipboard or plain text (.txt) download.',
          'For scanned or image-only documents, easily route to our OCR Engine.'
        ]
      }
    ],
    specifications: [
      { label: 'Extraction Engine', value: 'WASM PDF Stream Decoder' },
      { label: 'Output Format', value: 'Clean UTF-8 Plain Text (.txt)' }
    ],
    privacyComparison: [
      { feature: 'Confidential Notes', toolora: '100% Client-side sandbox compute', traditional: 'Stored and analyzed in cloud databases' }
    ],
    faqs: [
      {
        q: 'Why does a scanned PDF return empty text?',
        a: 'Scanned PDFs contain raster photos of text rather than digital text streams. For scanned files, use Toolora’s Image to Text (OCR) tool which uses optical character recognition.'
      }
    ]
  },
  'image-resizer': {
    title: 'Pixel-Perfect Image Resizer & Aspect Ratio Scaler',
    badge: 'Bicubic & Lanczos Canvas Resampling',
    description: 'Resize images to exact pixel dimensions, percentages, or standard aspect ratios (16:9, 4:3, 1:1, 9:16) with aspect ratio locking and zero cloud uploads.',
    sections: [
      {
        title: 'Precision Dimension Scaling & Aspect Ratio Locking',
        description: 'Resize photos for website banners, social media profiles, email newsletters, and mobile apps with crisp bicubic interpolation.',
        points: [
          'Resize by exact Width/Height pixels or percentage scaling (10% to 500%).',
          'Lock aspect ratio to prevent stretching and distortion.',
          'Preset shortcuts for Instagram, YouTube thumbnails, Twitter headers, and Open Graph cards.',
          'Instant download in original format or web-optimized WebP.'
        ]
      }
    ],
    specifications: [
      { label: 'Resampling Algorithm', value: 'High-Quality Bicubic Canvas Filtering' },
      { label: 'Supported Inputs', value: 'PNG, JPG, WebP, GIF, SVG, BMP' }
    ],
    privacyComparison: [
      { feature: 'Image Privacy', toolora: 'Local GPU / Canvas rendering', traditional: 'Uploaded to cloud resizing endpoints' }
    ],
    faqs: [
      {
        q: 'Will resizing an image make it blurry?',
        a: 'Downscaling reduces file dimensions while keeping images sharp. Upscaling smaller images will interpolate pixels cleanly using hardware-accelerated bicubic smoothing.'
      }
    ]
  },
  'image-converter': {
    title: 'Universal High-Speed Image Format Converter',
    badge: 'Multi-Format Lossless Canvas Transcoder',
    description: 'Convert images between WebP, PNG, JPG, GIF, and BMP formats instantly with adjustable quality levels and zero server queues.',
    sections: [
      {
        title: 'Lossless Transcoding & Alpha Transparency Support',
        description: 'Convert heavy PNGs to lightweight WebPs for faster web load times, or convert WebPs to universal JPEGs for legacy compatibility without compromising visual fidelity.',
        points: [
          'Convert between JPG, PNG, WebP, GIF, and BMP formats.',
          'Preserves alpha transparency channels when converting to PNG or WebP.',
          'Batch conversion workflow with one-click download.',
          '100% offline-ready in-browser processing.'
        ]
      }
    ],
    specifications: [
      { label: 'Supported Encoders', value: 'WebP, PNG (Lossless 32-bit), JPG (sRGB), BMP' },
      { label: 'Processing Latency', value: '< 50ms per image' }
    ],
    privacyComparison: [
      { feature: 'Image File Uploads', toolora: '0 bytes transferred over internet', traditional: 'Stored on cloud conversion servers' }
    ],
    faqs: [
      {
        q: 'Why should I convert my images to WebP?',
        a: 'WebP provides superior lossless and lossy compression, resulting in file sizes 25% to 35% smaller than JPEG and PNG with equivalent visual clarity.'
      }
    ]
  },
  'image-editor': {
    title: 'Prism Creative Image Editor & Filter Studio',
    badge: 'Real-Time GPU Canvas FX & Adjustment Matrix',
    description: 'Fine-tune image brightness, contrast, saturation, sharpness, vignette, and vintage photo filters with interactive live previews and crop tools.',
    sections: [
      {
        title: 'Real-Time Color Matrix & Filter Adjustments',
        description: 'Apply professional photo adjustments including exposure, contrast, vibrance, warmth, blur, and vintage film grain directly in your browser with 60 FPS real-time rendering.',
        points: [
          'Interactive crop tool with standard aspect ratio presets (1:1, 4:3, 16:9).',
          'Fine-tune brightness, contrast, saturation, sepia, hue-rotate, and blur.',
          'One-click vintage and cinematic filter presets.',
          'Instant lossless PNG or high-quality JPEG download.'
        ]
      }
    ],
    specifications: [
      { label: 'Rendering Pipeline', value: 'HTML5 2D Canvas Color Filter Matrix' },
      { label: 'Performance', value: '60 FPS Hardware-Accelerated Rendering' }
    ],
    privacyComparison: [
      { feature: 'Personal Photos', toolora: 'Rendered in local browser RAM only', traditional: 'Uploaded to cloud photo processing servers' }
    ],
    faqs: [
      {
        q: 'Are edits permanent or can I reset them?',
        a: 'You can adjust sliders back and forth in real time, or click Reset to revert to the original unedited image at any time.'
      }
    ]
  }
};

export default function UniversalToolContent({ toolId }: UniversalToolContentProps) {
  const currentTool = TOOLS.find((t) => t.id === toolId);
  const aeo = TOOL_AEO_DATA[toolId];
  const bespoke = UNIVERSAL_TOOL_DATA[toolId];

  // Merge AEO FAQs (4-6 verified items) with any existing bespoke FAQs
  const combinedFaqs = aeo?.faqs 
    ? aeo.faqs.map(f => ({ q: f.question, a: f.answer }))
    : (bespoke?.faqs || [
        {
          q: `Is ${currentTool?.name || 'this tool'} completely free to use?`,
          a: 'Yes. All features are 100% free with no hidden charges, subscriptions, or watermarks.'
        },
        {
          q: 'Are my files uploaded or saved anywhere?',
          a: 'No. All operations run directly in your browser memory and are cleared when you close the tab.'
        }
      ]);

  const data = {
    title: aeo?.h1 || bespoke?.title || `Comprehensive Guide & Specifications: ${currentTool?.name || 'Tool'}`,
    badge: bespoke?.badge || 'Decentralized Sovereign Utility',
    description: aeo?.openingSummary || bespoke?.description || `Professional, browser-isolated solution for ${currentTool?.name || 'this workflow'} with zero server uploads and instant hardware performance.`,
    sections: bespoke?.sections || [
      {
        title: '100% Client-Side In-Memory Execution',
        description: `This application compiles and processes all files directly inside your browser's virtual sandbox memory. No external server uploads, no cookies, and no tracking scripts are ever utilized.`,
        points: [
          'High-performance client execution with instant response times.',
          'Zero risk of data breaches or confidential document leaks.',
          'Completely free and unmetered with unlimited usage.'
        ]
      },
      {
        title: 'Designed for High-Precision Productivity',
        description: `Built to streamline everyday digital tasks for developers, designers, students, and businesses without unnecessary software bloat or paywalls.`,
        points: [
          'Clean, distraction-free interface optimized for desktop and mobile.',
          'Export high-quality outputs with zero intrusive watermarks.',
          'Instant lossless processing powered by modern web standards.'
        ]
      }
    ],
    specifications: bespoke?.specifications || [
      { label: 'Architecture', value: 'Client-Side WebAssembly / Canvas' },
      { label: 'Data Transmission', value: '0 KB (Local Device RAM)' },
      { label: 'Account Required', value: 'No (100% Free Forever)' },
      { label: 'License', value: 'Commercial & Personal Free Use' }
    ],
    privacyComparison: bespoke?.privacyComparison || [
      { feature: 'Data Storage', toolora: 'Zero storage (Device RAM only)', traditional: 'Cloud servers & log databases' },
      { feature: 'Pricing / Paywalls', toolora: '100% Free Forever', traditional: 'Subscriptions and credit limits' },
      { feature: 'Privacy Guarantee', toolora: 'Mathematically guaranteed', traditional: 'Subject to privacy policy changes' }
    ],
    faqs: combinedFaqs
  };

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="mt-8 pt-8 border-t border-slate-200/80 dark:border-[#1E293B] space-y-8 text-left">
      {/* Header Segment */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 text-[10px] font-black uppercase tracking-wider font-mono border border-orange-200/70 dark:border-orange-900/40">
          <Sparkles className="w-3 h-3" /> {data.badge}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 font-display tracking-tight">
          {data.title}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          {data.description}
        </p>
      </div>

      {/* Structured Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.sections.map((section, idx) => (
          <div 
            key={idx}
            className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] space-y-3 shadow-xs"
          >
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-black shrink-0">
                {idx + 1}
              </span>
              {section.title}
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              {section.description}
            </p>
            {section.points && (
              <ul className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-zinc-800/80">
                {section.points.map((pt, pIdx) => (
                  <li key={pIdx} className="text-[11px] text-slate-600 dark:text-zinc-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Technical Specifications Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            Technical Architecture &amp; Performance Specifications
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.specifications.map((spec, sIdx) => (
            <div key={sIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-150 dark:border-zinc-800 space-y-1">
              <span className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                {spec.label}
              </span>
              <p className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Architecture Comparison Matrix */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            Why Toolora is Secure: Privacy Architecture Comparison
          </h3>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-zinc-800">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white">
                <th className="p-3 font-bold">Standard Metric</th>
                <th className="p-3 font-bold bg-orange-600">Toolora Engine</th>
                <th className="p-3 font-bold">Standard Cloud SaaS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-slate-600 dark:text-zinc-400">
              {data.privacyComparison.map((row, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 0 ? "bg-white dark:bg-[#131B2E]" : "bg-slate-50/50 dark:bg-zinc-900/40"}>
                  <td className="p-3 font-semibold text-slate-800 dark:text-zinc-200">{row.feature}</td>
                  <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">{row.toolora}</td>
                  <td className="p-3 text-rose-500">{row.traditional}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive FAQ Accordion */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200/80 dark:border-[#1E293B] space-y-4 shadow-xs">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-orange-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            Frequently Asked Questions
          </h3>
        </div>
        <div className="space-y-2.5">
          {data.faqs.map((faq, fIdx) => (
            <div 
              key={fIdx}
              className="border border-slate-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-zinc-900/40"
            >
              <button
                onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                className="w-full flex items-center justify-between p-3.5 text-left text-xs font-bold text-slate-800 dark:text-zinc-200 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === fIdx ? 'rotate-180 text-orange-500' : 'text-slate-400'}`} />
              </button>
              {openFaq === fIdx && (
                <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-zinc-400 leading-relaxed border-t border-slate-200/60 dark:border-zinc-800/80 pt-2.5">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
