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
 * Shared image URL map — points to public /blog/ directory placeholders with high-res Unsplash fallbacks.
 * The user can easily add custom images inside /public/blog/ (e.g. /blog/pdf-compress.jpg).
 */
export const IMG = {
  pdf_editor: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=1200&q=80&auto=format&fit=crop",
  pdf_compress: "https://images.unsplash.com/photo-1568952433726-3896e3881c65?w=1200&q=80&auto=format&fit=crop",
  pdf_compress_alt: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80&auto=format&fit=crop",
  pdf_merge: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80&auto=format&fit=crop",
  pdf_merge_alt: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&q=80&auto=format&fit=crop",
  pdf_split: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop",
  pdf_lock: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80&auto=format&fit=crop",
  pdf_lock_alt: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80&auto=format&fit=crop",
  pdf_watermark: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80&auto=format&fit=crop",
  pdf_to_img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
  img_to_pdf: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1200&q=80&auto=format&fit=crop",
  pdf_rotate: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop",
  pdf_text: "https://images.unsplash.com/photo-1516321165247-4aa89a48be16?w=1200&q=80&auto=format&fit=crop",
  
  bg_remove: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80&auto=format&fit=crop",
  bg_remove_alt: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop",
  img_compress: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
  img_compress_alt: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80&auto=format&fit=crop",
  img_resize: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80&auto=format&fit=crop",
  img_convert: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80&auto=format&fit=crop",
  img_edit: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop",
  passport: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80&auto=format&fit=crop",
  ocr: "https://images.unsplash.com/photo-1516321165247-4aa89a48be16?w=1200&q=80&auto=format&fit=crop",
  ocr_alt: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=1200&q=80&auto=format&fit=crop",

  invoice: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80&auto=format&fit=crop",
  invoice_alt: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80&auto=format&fit=crop",
  bill: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
  resume: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80&auto=format&fit=crop",
  resume_alt: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80&auto=format&fit=crop",
  qr_code: "https://images.unsplash.com/photo-1633259584604-afdc243122ea?w=1200&q=80&auto=format&fit=crop",
  qr_code_alt: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=1200&q=80&auto=format&fit=crop",
  signature: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop",
  signature_alt: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80&auto=format&fit=crop",
  business_card: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80&auto=format&fit=crop",
  certificate: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&q=80&auto=format&fit=crop",
  mockup: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?w=1200&q=80&auto=format&fit=crop",
  mockup_device: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=1200&q=80&auto=format&fit=crop",
  mockup_apparel: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200&q=80&auto=format&fit=crop",
  mockup_packaging: "https://images.unsplash.com/photo-1600857062241-98e5dba7f214?w=1200&q=80&auto=format&fit=crop",
  mockup_print: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80&auto=format&fit=crop",

  unit: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80&auto=format&fit=crop",
  unit_convert: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=80&auto=format&fit=crop",
  currency: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80&auto=format&fit=crop",
  currency_convert: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80&auto=format&fit=crop",
  text_tools: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&q=80&auto=format&fit=crop",
  webp: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1200&q=80&auto=format&fit=crop",
  word_pdf: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=1200&q=80&auto=format&fit=crop",
  pdf_edit: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=1200&q=80&auto=format&fit=crop",

  pdf_flow: "https://images.unsplash.com/photo-1544396821-4dd40b938ad3?w=1200&q=80&auto=format&fit=crop",
  pdf_security: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80&auto=format&fit=crop",
  pdf_to_txt: "https://images.unsplash.com/photo-1516321165247-4aa89a48be16?w=1200&q=80&auto=format&fit=crop",
  ocr_screen: "https://images.unsplash.com/photo-1516321165247-4aa89a48be16?w=1200&q=80&auto=format&fit=crop",
  passport_guideline: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=80&auto=format&fit=crop",
  qr: "https://images.unsplash.com/photo-1633259584604-afdc243122ea?w=1200&q=80&auto=format&fit=crop",
  qr_sheet: "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=1200&q=80&auto=format&fit=crop",
  resume_sheet: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=1200&q=80&auto=format&fit=crop",
  signature_pad: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1200&q=80&auto=format&fit=crop",

  bg_remover: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80&auto=format&fit=crop",
  bg_tool: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=1200&q=80&auto=format&fit=crop",
  invoice_sheet: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=1200&q=80&auto=format&fit=crop",
  biz_card: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80&auto=format&fit=crop",
  biz_card_stack: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&q=80&auto=format&fit=crop",
  cert_sheet: "https://images.unsplash.com/photo-1568667256549-094345857637?w=1200&q=80&auto=format&fit=crop",
  currency_sheet: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=1200&q=80&auto=format&fit=crop",
  img_compare: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop",
  img_editor: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop",
  img_edit_ui: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&q=80&auto=format&fit=crop",
} as Record<string, string>;
