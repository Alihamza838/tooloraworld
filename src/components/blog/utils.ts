// blog/utils.ts
// ─────────────────────────────────────────────────────────────────────────────
// Pure utility functions shared by the blog system.
// Contains tag class styles, string helpers, slug generators, and image maps.
// ─────────────────────────────────────────────────────────────────────────────

const TAG_CLASS: Record<string, string> = {
  "PDF Tools":
    "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  "PDF Tech":
    "bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30",
  "Image Tools":
    "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30",
  "Image Processing":
    "bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/30",
  "Career Tools":
    "bg-violet-50 text-violet-600 border-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-900/30",
  "Legal Tech":
    "bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/30",
  Security:
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
  Privacy:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
  Productivity:
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
  "Business Tools":
    "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/30",
  "Sovereign Business":
    "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/30",
  "Writing Tools":
    "bg-slate-50 text-slate-600 border-slate-200 dark:bg-zinc-900 dark:text-slate-400 dark:border-zinc-800",
  "Design Tools":
    "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/30",
  "Local OCR":
    "bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/30",
  "Converters":
    "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30",
};

export function tagClass(tag: string): string {
  return (
    TAG_CLASS[tag] ||
    "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
  );
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0]!.toUpperCase())
    .join("")
    .slice(0, 2);
}

export function firstName(name: string): string {
  return name.split(" ")[0] ?? name;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Shared image URL map - each entry features an authentic, unique high-resolution
 * Unsplash photography asset specifically matched to its technical domain, optimized
 * with width, quality, format, and fit attributes for Google Image SEO.
 */
export const IMG = {
  // PDF Document Suites & Workflows
  pdf_editor: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=1200&q=85&auto=format&fit=crop", // digital document markup
  pdf_edit: "https://images.unsplash.com/photo-1583521214690-73421a1829a9?w=1200&q=85&auto=format&fit=crop", // document annotation
  pdf_flow: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=1200&q=85&auto=format&fit=crop", // office workflow paperwork
  pdf_compress: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=1200&q=85&auto=format&fit=crop", // hardware storage compression
  pdf_compress_alt: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&q=85&auto=format&fit=crop", // server data transfer metrics
  pdf_merge: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=85&auto=format&fit=crop", // multi-sheet binder collation
  pdf_merge_alt: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&q=85&auto=format&fit=crop", // archival documents
  pdf_split: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&auto=format&fit=crop", // extracted sheets on desk
  pdf_lock: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=85&auto=format&fit=crop", // cyber encryption padlock
  pdf_lock_alt: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=85&auto=format&fit=crop", // terminal security authentication
  pdf_security: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=85&auto=format&fit=crop", // cybersecurity network protection
  pdf_rotate: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=85&auto=format&fit=crop", // blueprints and rotational compass
  pdf_watermark: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=85&auto=format&fit=crop", // official notary seal & legal gavel
  pdf_to_img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=85&auto=format&fit=crop", // photography studio camera
  img_to_pdf: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1200&q=85&auto=format&fit=crop", // laptop scanning print photos
  pdf_text: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=85&auto=format&fit=crop", // code editor text stream
  pdf_to_txt: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&q=85&auto=format&fit=crop", // textbook indexing and data extraction

  // Image Optimization, Editing & Graphics
  img_compress: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=85&auto=format&fit=crop", // graphic design display
  img_compress_alt: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85&auto=format&fit=crop", // agile dev workstation
  img_compare: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&q=85&auto=format&fit=crop", // high-fidelity comparison monitor
  img_resize: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=85&auto=format&fit=crop", // canvas aspect ratio grid
  img_convert: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=1200&q=85&auto=format&fit=crop", // digital vector file conversion
  img_edit: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=1200&q=85&auto=format&fit=crop", // photo color correction grading
  img_editor: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=85&auto=format&fit=crop", // vibrant digital paint canvas
  img_edit_ui: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1200&q=85&auto=format&fit=crop", // creative director editing desk
  bg_remove: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=85&auto=format&fit=crop", // 3D product cutout on gradient
  bg_remove_alt: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&q=85&auto=format&fit=crop", // clean isolated portrait silhouette
  bg_remover: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&q=85&auto=format&fit=crop", // background bokeh isolation
  bg_tool: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&q=85&auto=format&fit=crop", // design team reviewing cutouts
  passport: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85&auto=format&fit=crop", // passport booklet & biometric portrait
  passport_guideline: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=85&auto=format&fit=crop", // headshot lighting & framing

  // OCR, Text Recognition & Computer Vision
  ocr: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=85&auto=format&fit=crop", // scanning commercial invoice text
  ocr_alt: "https://images.unsplash.com/photo-1450133064473-71024230f91b?w=1200&q=85&auto=format&fit=crop", // precision optical scan lens
  ocr_screen: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=85&auto=format&fit=crop", // character data analytics screen

  // Business, Invoicing, Legal & HR
  invoice: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=85&auto=format&fit=crop", // accounting ledger calculator & invoice
  invoice_alt: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop", // financial statement dashboard
  invoice_sheet: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=1200&q=85&auto=format&fit=crop", // tax compliance balance sheet
  bill: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&q=85&auto=format&fit=crop", // itemized POS retail receipt
  resume: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=85&auto=format&fit=crop", // clean executive resume typography
  resume_alt: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=85&auto=format&fit=crop", // strategic career hiring meeting
  resume_sheet: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=85&auto=format&fit=crop", // drafting cover letter on laptop
  qr: "https://images.unsplash.com/photo-1633259584604-afdc243122ea?w=1200&q=85&auto=format&fit=crop", // smartphone scanning vector QR
  qr_code: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=1200&q=85&auto=format&fit=crop", // retail store QR checkout counter
  qr_code_alt: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=85&auto=format&fit=crop", // futuristic digital connectivity matrix
  qr_sheet: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=1200&q=85&auto=format&fit=crop", // mobile marketing collateral
  signature: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=85&auto=format&fit=crop", // luxury fountain pen signing parchment
  signature_alt: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=85&auto=format&fit=crop", // executive handshake agreement
  signature_pad: "https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?w=1200&q=85&auto=format&fit=crop", // digital stylus signing on glass tablet
  business_card: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=85&auto=format&fit=crop", // matte black foil embossed business cards
  biz_card: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=1200&q=85&auto=format&fit=crop", // creative branding stationery mockup
  biz_card_stack: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=1200&q=85&auto=format&fit=crop", // premium brand identity card stack
  certificate: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&q=85&auto=format&fit=crop", // graduation diploma and commencement
  cert_sheet: "https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1200&q=85&auto=format&fit=crop", // professional accreditation gold seal

  // Mockups & 3D Generators
  mockup: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200&q=85&auto=format&fit=crop", // 3D product showcase stage
  mockup_device: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=85&auto=format&fit=crop", // MacBook and iPhone responsive mockup
  mockup_apparel: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=85&auto=format&fit=crop", // premium streetwear t-shirt mockup
  mockup_packaging: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=1200&q=85&auto=format&fit=crop", // luxury embossed retail box packaging
  mockup_print: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1200&q=85&auto=format&fit=crop", // hardbound book & magazine mockup

  // Converters, Math & Typography
  unit: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&q=85&auto=format&fit=crop", // engineering vernier calipers
  unit_convert: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=1200&q=85&auto=format&fit=crop", // architectural blueprints and scales
  currency: "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1200&q=85&auto=format&fit=crop", // multi-nation foreign currency notes
  currency_convert: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=85&auto=format&fit=crop", // forex exchange market trading terminal
  currency_sheet: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&q=85&auto=format&fit=crop", // international currency exchange desk
  currency_travel: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=85&auto=format&fit=crop", // passport boarding pass and world travel
  text_tools: "https://images.unsplash.com/photo-1526554850534-7c78330d5f90?w=1200&q=85&auto=format&fit=crop", // vintage mechanical typewriter font keys
  text_case: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=1200&q=85&auto=format&fit=crop", // computer code editor casing
  webp: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85&auto=format&fit=crop", // core web vitals performance speed
  word_pdf: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=85&auto=format&fit=crop", // editorial layout and word processing

  // Medical, Repair & Specialized Forms
  bill_medical: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=1200&q=85&auto=format&fit=crop", // stethoscope and healthcare billing ledger
  bill_repair: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=1200&q=85&auto=format&fit=crop", // automotive mechanic workshop estimate
  invoice_freelance: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=1200&q=85&auto=format&fit=crop", // creative freelancer working in coffee shop

  // Design, Mockups & Apparel
  mockup_brand: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=85&auto=format&fit=crop", // retail fashion boutique apparel
  card_trends: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85&auto=format&fit=crop", // architectural minimalist studio
  cert_award: "https://images.unsplash.com/photo-1576267423445-b2e0074d68a4?w=1200&q=85&auto=format&fit=crop", // corporate award ceremony stage

  // Social Media & Web Optimization
  social_media: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=1200&q=85&auto=format&fit=crop", // social network smartphone apps
  ecom_product: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&q=85&auto=format&fit=crop", // white studio luxury watch product photography
  qr_marketing: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&q=85&auto=format&fit=crop", // marketing agency brainstorm board
  signature_legal: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1200&q=85&auto=format&fit=crop" // corporate executive signing legally binding contract
} as Record<string, string>;
