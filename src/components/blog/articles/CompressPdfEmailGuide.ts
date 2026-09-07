// blog/articles/CompressPdfEmailGuide.ts
import type { BlogPost } from "../types";
import { IMG } from "../utils";

const CompressPdfEmailGuide: BlogPost = {
  id: "how-to-reduce-pdf-size-under-5mb-for-email-and-portals",
  title: "How to Reduce PDF File Size Under 5MB for Email, Court Filings & Job Applications",
  slug: "how-to-reduce-pdf-size-under-5mb-for-email-and-portals",
  excerpt: "Overcome strict 5MB, 10MB, or 25MB file size limits on Gmail, Outlook, government portals, and legal filing systems without compromising text sharpness or document readability.",
  date: "August 14, 2026",
  readTime: "11 min read",
  tag: "PDF Tools",
  author: "Hamza Tariq",
  authorRole: "Principal Document Systems Engineer",
  authorCredentials: "ISO 32000 Standards Specialist · 12+ years document compression & workflow automation",
  focusKeyword: "reduce pdf file size under 5mb for email",
  metaDesc: "Step-by-step guide to shrinking bulky PDF documents under 5MB for email attachments, court e-filing, and university portals without losing vector text clarity.",
  toolId: "pdf-compressor",
  relatedTools: [
    "pdf-editor",
    "pdf-splitter",
    "pdf-merger",
    "image-compressor",
    "pdf-to-image"
  ],
  coverImage: IMG.pdf_compress,
  quote: "Document compression is not about destroying image pixels; it is about eliminating redundant embedded fonts, uncompressed stream objects, and duplicate metadata.",
  takeaways: [
    "Most email servers (Gmail, Outlook, Yahoo) enforce 20MB to 25MB attachment limits, while legal filing systems often cap uploads at 5MB to 10MB.",
    "Embedded uncompressed scan images and redundant font subsets account for up to 92% of bloated PDF file weight.",
    "Toolora's client-side compressor uses smart DCT stream re-quantization and Deflate compression without uploading files to third-party servers.",
    "Text streams remain pure vector data, ensuring searchable, crisp typography at any zoom level."
  ],
  howTo: {
    title: "How to Compress a Large PDF to Under 5MB in Seconds",
    totalTimeMinutes: 2,
    steps: [
      { name: "Open PDF Compressor", text: "Navigate to Toolora's PDF Compressor in your browser." },
      { name: "Import oversized PDF", text: "Drag your file (even 50MB+ scanned bundles) into the private processing box." },
      { name: "Select target compression level", text: "Choose 'Standard Compression' for general email or 'Extreme Compression' for strict government portals." },
      { name: "Review estimated reduction", text: "View the real-time calculated target size and savings percentage." },
      { name: "Download optimized PDF", text: "Click Compress & Download to save the lightweight, email-ready file instantly." }
    ]
  },
  sections: [
    {
      id: "why-pdfs-get-large",
      heading: "Why Do PDF Files Get So Huge? Understanding PDF Bloat",
      image: IMG.pdf_flow,
      content: `A PDF that should be a few pages long can easily inflate to 40MB or larger due to three main causes:

1. **Raw Uncompressed Scans:** Office scanners frequently insert 600 DPI uncompressed TIFF/BMP raster streams rather than compressed JPEG or WebP images.
2. **Duplicate Embedded Fonts:** Every time a document is re-saved across different word processors, entire font families (TrueType/OpenType) can be embedded multiple times.
3. **Hidden Revision History:** PDF incremental updates often append changes to the end of the file rather than removing deleted content.`
    },
    {
      id: "portal-limits-guide",
      heading: "Portal Upload Limits by Industry (2026 Reference Table)",
      content: `Keep these standard upload thresholds in mind when preparing your documents.`,
      table: {
        caption: "Standard PDF Upload Limits by Industry & Platform",
        headers: ["Platform / System", "Max File Size", "Recommended Setting", "Accepts Multiple Files"],
        highlightColIndex: 1,
        rows: [
          ["Gmail / Google Workspace", "25 MB", "Standard (75% quality)", "Yes"],
          ["Microsoft Outlook / Exchange", "20 MB - 33 MB", "Standard (75% quality)", "Yes"],
          ["US Federal PACER (Court E-Filing)", "10 MB - 35 MB", "Extreme (60% quality)", "Yes"],
          ["State Court Filing Portals", "5 MB - 10 MB", "Extreme (50% quality)", "Varies"],
          ["USCIS Immigration Uploads", "6 MB - 12 MB", "Standard / Extreme", "No (single PDFs)"],
          ["Workday / ATS Job Portals", "5 MB", "Standard (75% quality)", "Yes"]
        ]
      }
    }
  ],
  quiz: {
    question: "What is usually the biggest contributor to bloated PDF file sizes?",
    options: [
      "Vector text formatting",
      "Embedded uncompressed scan images and redundant embedded fonts",
      "The page count number in headers"
    ],
    correctIndex: 1,
    explanation: "Embedded high-resolution uncompressed scan images and redundant font packages account for over 90% of excess PDF file size."
  },
  faqs: [
    { q: "How can I reduce a 30MB PDF to under 5MB for email?", a: "Load the file into Toolora's PDF Compressor, choose Standard or High compression mode, and download the optimized PDF in under 5 seconds." },
    { q: "Will reducing the PDF file size make text blurry?", a: "No. Vector text characters and font glyphs remain mathematically defined vectors and retain 100% razor-sharp clarity at all zoom levels." },
    { q: "What happens to the images inside the compressed PDF?", a: "Embedded images are downsampled to an optimal screen/print DPI (typically 150 DPI) and re-encoded with efficient JPEG/Deflate quantization." },
    { q: "Is there a limit on how many pages I can compress?", a: "Toolora's browser engine handles documents with hundreds of pages without artificial limits or paywalls." },
    { q: "Can I compress password-protected PDFs?", a: "Unlock the document first with Toolora's PDF Lock & Unlock tool, then run it through the compressor." },
    { q: "Are my sensitive financial or legal PDFs sent to your server?", a: "No. All decompression, stream filtering, and re-compression occur 100% client-side inside your browser sandbox." },
    { q: "Does compression remove interactive form fields or hyperlinks?", a: "No. Standard interactive links, bookmarks, form fields, and table of contents trees remain fully operational." },
    { q: "Why did my PDF only shrink by 5%?", a: "If a PDF consists solely of raw vector text and already-optimized JPEG images, it has little redundant data to strip. Try our PDF Splitter if you need to divide pages." },
    { q: "What is the maximum file size I can upload for compression?", a: "Because execution is client-side, files up to 250MB+ can be compressed smoothly depending on your local computer memory." },
    { q: "Can I compress multiple PDF files simultaneously?", a: "Yes, you can drop multiple PDF files into Toolora's batch queue to compress entire portfolios in one pass." }
  ]
};

export default CompressPdfEmailGuide;
