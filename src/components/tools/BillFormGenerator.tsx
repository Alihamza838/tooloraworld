/**
 * BillFormGenerator.tsx — Toolora Global Bill & Invoice Studio (v4.0)
 * ─────────────────────────────────────────────────────────────────────────
 * A completely local, client-side document engine for generating commercial
 * invoices (US / UK / India / Pakistan) and localized utility bills
 * (electricity, water, gas / Sui gas) with country-accurate tax structures.
 *
 * ZERO server calls. Every calculation, every render, every export happens
 * inside the browser's own memory — logos are base64-cached, signatures are
 * drawn on a local <canvas>, and templates are persisted to localStorage.
 * ─────────────────────────────────────────────────────────────────────────
 */

"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Building,
  Receipt,
  FileSignature,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Droplet,
  Flame,
  Globe,
  Upload,
  X,
  FileText,
  Briefcase,
  Sun,
  Moon,
  Save,
  FolderOpen,
  PenTool,
  Eraser,
  Type as TypeIcon,
  ArrowUp,
  ArrowDown,
  FileJson,
  Landmark,
  ShieldCheck,
  Search,
  HelpCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

// ═════════════════════════════════════════════════════════════════════════
// TYPES
// ═════════════════════════════════════════════════════════════════════════

interface EditableField {
  key: string;
  label: string;
  value: string;
  type?: "text" | "number" | "date" | "textarea";
  span?: boolean;
}

interface LineItem {
  id: string;
  description: string;
  hsn?: string; // HSN/SAC code (India), or generic reference code
  qty: number;
  rate: number;
  unit?: string;
}

type ChargeKind = "percent" | "flat";

interface Charge {
  key: string;
  label: string;
  kind: ChargeKind;
  value: number; // percentage points, or flat currency amount
  editable?: boolean; // shown as an adjustable chip in the Styling tab
}

type DocKind = "invoice" | "utility";

interface FormTemplate {
  id: string;
  name: string;
  country: "US" | "UK" | "IN" | "PK" | "INTL";
  countryLabel: string;
  category: string;
  docKind: DocKind;
  docLabel: string; // "TAX INVOICE", "ELECTRICITY BILL", etc.
  title: string;
  regLabel?: string; // GSTIN / VAT No. / NTN label shown near header
  headerIcon: React.ReactNode;
  accent: string;
  currency: string;
  defaultFields: EditableField[];
  hasLineItems?: boolean;
  defaultItems?: LineItem[];
  charges: Charge[];
}

interface Totals {
  subtotal: number;
  usageLabel: string;
  discountAmt: number;
  chargeLines: { label: string; amount: number }[];
  total: number;
}

interface SavedDocument {
  id: string;
  savedAt: number;
  templateId: string;
  name: string;
  formFields: Record<string, string>;
  lineItems: LineItem[];
  currency: string;
  discount: number;
  accentId: string;
  logoSrc: string | null;
  signatureSrc: string | null;
  signatureMode: "draw" | "type";
  signatureTyped: string;
}

// ═════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═════════════════════════════════════════════════════════════════════════

const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "PKR", symbol: "₨", label: "Pakistani Rupee" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "AED", symbol: "د.إ", label: "UAE Dirham" },
  { code: "CAD", symbol: "CA$", label: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", label: "Australian Dollar" },
];

const ACCENT_COLORS = [
  { id: "orange", label: "Toolora Amber", hex: "#ea580c", light: "#fff7ed", border: "#ffedd5", bgDark: "rgba(234, 88, 12, 0.1)", borderDark: "rgba(234, 88, 12, 0.2)" },
  { id: "emerald", label: "Emerald (LESCO)", hex: "#0f9d58", light: "#ecfdf5", border: "#a7f3d0", bgDark: "rgba(15, 157, 88, 0.1)", borderDark: "rgba(15, 157, 88, 0.2)" },
  { id: "sky", label: "Sky (British Gas)", hex: "#0284c7", light: "#f0f9ff", border: "#bae6fd", bgDark: "rgba(2, 132, 199, 0.1)", borderDark: "rgba(2, 132, 199, 0.2)" },
  { id: "amber", label: "Amber (Tata Power)", hex: "#d97706", light: "#fffbeb", border: "#fde68a", bgDark: "rgba(217, 119, 6, 0.1)", borderDark: "rgba(217, 119, 6, 0.2)" },
  { id: "rose", label: "Rose", hex: "#e11d48", light: "#fff1f2", border: "#fecdd3", bgDark: "rgba(225, 29, 72, 0.1)", borderDark: "rgba(225, 29, 72, 0.2)" },
  { id: "violet", label: "Violet", hex: "#7c3aed", light: "#f5f3ff", border: "#ddd6fe", bgDark: "rgba(124, 58, 237, 0.1)", borderDark: "rgba(124, 58, 237, 0.2)" },
  { id: "slate", label: "Corporate Slate", hex: "#475569", light: "#f8fafc", border: "#cbd5e1", bgDark: "rgba(71, 85, 105, 0.1)", borderDark: "rgba(71, 85, 105, 0.2)" },
];

const STORAGE_KEY = "toolora_bill_studio_v4";
const AUTOSAVE_KEY = "toolora_bill_studio_autosave_v4";

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function fmt(amount: number, sym: string) {
  const sign = amount < 0 ? "−" : "";
  return `${sign}${sym}${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

// ═════════════════════════════════════════════════════════════════════════
// TEMPLATE LIBRARY — 15 country-accurate document types
// ═════════════════════════════════════════════════════════════════════════

const FREELANCE_ITEMS: LineItem[] = [
  { id: uid(), description: "Brand Strategy & Identity Design", qty: 1, rate: 1500, unit: "project" },
  { id: uid(), description: "Website UX/UI Design Sprint", qty: 2, rate: 650, unit: "week" },
  { id: uid(), description: "Content Copywriting (Homepage + 3 pages)", qty: 4, rate: 90, unit: "page" },
];

const GST_ITEMS: LineItem[] = [
  { id: uid(), description: "Software Consulting Services", hsn: "998314", qty: 1, rate: 45000, unit: "engagement" },
  { id: uid(), description: "Cloud Infrastructure Setup", hsn: "998315", qty: 1, rate: 18000, unit: "project" },
  { id: uid(), description: "Annual Maintenance Support", hsn: "998313", qty: 3, rate: 5000, unit: "month" },
];

const FBR_ITEMS: LineItem[] = [
  { id: uid(), description: "IT Managed Services Retainer", hsn: "9815.6000", qty: 1, rate: 120000, unit: "month" },
  { id: uid(), description: "Custom ERP Module Development", hsn: "9815.9000", qty: 1, rate: 250000, unit: "project" },
];

const UK_ITEMS: LineItem[] = [
  { id: uid(), description: "Digital Marketing Retainer", qty: 1, rate: 1800, unit: "month" },
  { id: uid(), description: "Paid Media Campaign Management", qty: 1, rate: 950, unit: "campaign" },
  { id: uid(), description: "SEO Audit & Technical Fixes", qty: 12, rate: 65, unit: "hour" },
];

const TEMPLATES: FormTemplate[] = [
  // ── COMMERCIAL & TAX INVOICES ─────────────────────────────────────────
  {
    id: "us-commercial-invoice",
    name: "US Commercial Invoice",
    country: "US",
    countryLabel: "United States",
    category: "Invoices",
    docKind: "invoice",
    docLabel: "COMMERCIAL INVOICE",
    title: "Professional Services Invoice",
    accent: "orange",
    currency: "USD",
    headerIcon: <Briefcase className="w-4 h-4" />,
    hasLineItems: true,
    defaultItems: FREELANCE_ITEMS,
    defaultFields: [
      { key: "fromName", label: "Your Business Name", value: "Alex Rivera Creative Studio LLC" },
      { key: "fromEmail", label: "Your Email", value: "alex@riveracreative.com" },
      { key: "fromAddress", label: "Business Address", value: "1204 Design District, Austin, TX 78701" },
      { key: "invoiceNo", label: "Invoice Number", value: "INV-2026-0041" },
      { key: "invoiceDate", label: "Invoice Date", value: "2026-06-02", type: "date" },
      { key: "dueDate", label: "Due Date", value: "2026-06-16", type: "date" },
      { key: "clientName", label: "Bill To / Client", value: "Nexus Digital Solutions Inc." },
      { key: "clientEmail", label: "Client Email", value: "billing@nexusdigital.io" },
      { key: "clientAddress", label: "Client Address", value: "500 Tech Blvd, San Francisco, CA 94105" },
      { key: "paymentTerms", label: "Payment Terms", value: "Net 14 Days — ACH / Wire Transfer" },
      { key: "salesTaxRate", label: "State Sales Tax (%)", value: "8.25" },
      { key: "notes", label: "Notes / Payment Instructions", value: "Please reference the invoice number in your transfer memo. Bank: Chase · Routing: 021000021 · Acct: 4892-0021", type: "textarea", span: true },
    ],
    charges: [{ key: "salesTaxRate", label: "Sales Tax", kind: "percent", value: 8.25, editable: true }],
  },
  {
    id: "uk-vat-invoice",
    name: "UK VAT Invoice",
    country: "UK",
    countryLabel: "United Kingdom",
    category: "Invoices",
    docKind: "invoice",
    docLabel: "VAT INVOICE",
    title: "VAT-Registered Sales Invoice",
    regLabel: "VAT Registration No.",
    accent: "sky",
    currency: "GBP",
    headerIcon: <Landmark className="w-4 h-4" />,
    hasLineItems: true,
    defaultItems: UK_ITEMS,
    defaultFields: [
      { key: "fromName", label: "Supplier / Business Name", value: "Bright Path Marketing Ltd." },
      { key: "vatNo", label: "VAT Registration No.", value: "GB 123 4567 89" },
      { key: "companyNo", label: "Companies House No.", value: "09876543" },
      { key: "fromAddress", label: "Registered Address", value: "14 Baker Street, London, W1U 3BW" },
      { key: "invoiceNo", label: "Invoice Number", value: "UKINV-2026-0187" },
      { key: "invoiceDate", label: "Invoice Date", value: "2026-06-02", type: "date" },
      { key: "dueDate", label: "Payment Due", value: "2026-07-02", type: "date" },
      { key: "clientName", label: "Bill To", value: "Harrow & Vance Solicitors" },
      { key: "clientAddress", label: "Client Address", value: "88 Fleet Street, London, EC4Y 1AU" },
      { key: "paymentTerms", label: "Payment Terms", value: "Net 30 — BACS Transfer" },
      { key: "vatRate", label: "VAT Rate (%) — Standard 20 / Reduced 5 / Zero 0", value: "20" },
      { key: "notes", label: "Notes", value: "Sort Code: 20-00-00 · Account: 55667788 · Thank you for your business.", type: "textarea", span: true },
    ],
    charges: [{ key: "vatRate", label: "VAT", kind: "percent", value: 20, editable: true }],
  },
  {
    id: "india-gst-invoice",
    name: "India GST Tax Invoice",
    country: "IN",
    countryLabel: "India",
    category: "Invoices",
    docKind: "invoice",
    docLabel: "TAX INVOICE",
    title: "GST Tax Invoice",
    regLabel: "GSTIN",
    accent: "amber",
    currency: "INR",
    headerIcon: <Landmark className="w-4 h-4" />,
    hasLineItems: true,
    defaultItems: GST_ITEMS,
    defaultFields: [
      { key: "fromName", label: "Seller / Business Name", value: "Vertex Software Solutions Pvt. Ltd." },
      { key: "gstin", label: "GSTIN", value: "27ABCDE1234F1Z5" },
      { key: "fromAddress", label: "Registered Address", value: "Plot 22, Hinjewadi IT Park, Pune, MH 411057" },
      { key: "invoiceNo", label: "Invoice Number", value: "INV/2026-27/0412" },
      { key: "invoiceDate", label: "Invoice Date", value: "2026-06-02", type: "date" },
      { key: "placeOfSupply", label: "Place of Supply", value: "Maharashtra (27)" },
      { key: "clientName", label: "Buyer / Bill To", value: "Sundaram Retail Technologies Ltd." },
      { key: "clientGstin", label: "Buyer GSTIN", value: "29PQRSX5678K1Z2" },
      { key: "clientAddress", label: "Buyer Address", value: "MG Road, Bengaluru, KA 560001" },
      { key: "isInterState", label: "Supply Type (Intra=CGST+SGST / Inter=IGST)", value: "Inter-State" },
      { key: "cgstRate", label: "CGST Rate (%)", value: "9" },
      { key: "sgstRate", label: "SGST Rate (%)", value: "9" },
      { key: "igstRate", label: "IGST Rate (%)", value: "18" },
      { key: "notes", label: "Notes / Bank Details", value: "This is a computer-generated invoice. HSN/SAC codes as indicated above.", type: "textarea", span: true },
    ],
    charges: [
      { key: "igstRate", label: "IGST", kind: "percent", value: 18, editable: true },
    ],
  },
  {
    id: "pk-fbr-invoice",
    name: "Pakistan FBR Sales Tax Invoice",
    country: "PK",
    countryLabel: "Pakistan",
    category: "Invoices",
    docKind: "invoice",
    docLabel: "SALES TAX INVOICE",
    title: "FBR-Compliant Sales Tax Invoice",
    regLabel: "NTN / STRN",
    accent: "emerald",
    currency: "PKR",
    headerIcon: <Landmark className="w-4 h-4" />,
    hasLineItems: true,
    defaultItems: FBR_ITEMS,
    defaultFields: [
      { key: "fromName", label: "Seller / Business Name", value: "Zenith Technologies (Pvt.) Ltd." },
      { key: "ntn", label: "NTN", value: "1234567-8" },
      { key: "strn", label: "STRN (Sales Tax Reg. No.)", value: "03-00-1234-567-89" },
      { key: "fromAddress", label: "Registered Address", value: "Plot 45, Block 6, PECHS, Karachi" },
      { key: "invoiceNo", label: "Invoice Number", value: "ZT/2026/0093" },
      { key: "invoiceDate", label: "Invoice Date", value: "2026-06-02", type: "date" },
      { key: "clientName", label: "Buyer / Bill To", value: "Al-Rehman Enterprises" },
      { key: "clientNtn", label: "Buyer NTN", value: "7654321-0" },
      { key: "clientAddress", label: "Buyer Address", value: "Gulberg III, Lahore" },
      { key: "salesTaxRate", label: "Sales Tax (%) — Standard 18", value: "18" },
      { key: "provincialTaxLabel", label: "Provincial Tax Authority (PRA/SRB/KPRA)", value: "PRA — Punjab Revenue Authority" },
      { key: "provincialTaxRate", label: "Provincial Services Tax (%)", value: "16" },
      { key: "notes", label: "Notes / Bank Details", value: "This invoice is issued under FBR SRO regulations. Advance tax as applicable u/s 153.", type: "textarea", span: true },
    ],
    charges: [
      { key: "salesTaxRate", label: "Sales Tax", kind: "percent", value: 18, editable: true },
    ],
  },
  {
    id: "w9-m9-form",
    name: "M9 / W-9 Reference Form",
    country: "INTL",
    countryLabel: "US / UK",
    category: "Invoices",
    docKind: "invoice",
    docLabel: "TAXPAYER INFORMATION REFERENCE",
    title: "Contractor Tax Information Summary (M9 / W-9 Style)",
    accent: "slate",
    currency: "USD",
    headerIcon: <FileSignature className="w-4 h-4" />,
    defaultFields: [
      { key: "contractorName", label: "Contractor / Business Name", value: "Marcus Webb Consulting" },
      { key: "entityType", label: "Federal Tax Classification", value: "Sole Proprietor / Single-Member LLC" },
      { key: "taxId", label: "Taxpayer ID Number (TIN/SSN Ref.)", value: "XXX-XX-4821" },
      { key: "address", label: "Address", value: "77 Willow Creek Dr, Denver, CO 80202" },
      { key: "clientName", label: "Requester / Hiring Company", value: "BlueOak Media Group" },
      { key: "formNo", label: "Reference Number", value: "M9-REF-2026-0056" },
      { key: "issueDate", label: "Issue Date", value: "2026-06-02", type: "date" },
      { key: "signatureConfirm", label: "Certification Statement", value: "I certify that the information provided is correct to the best of my knowledge.", type: "textarea", span: true },
    ],
    charges: [],
  },

  // ── US UTILITY BILLS ──────────────────────────────────────────────────
  {
    id: "us-electricity-bill",
    name: "US Electricity Bill",
    country: "US",
    countryLabel: "United States",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "ELECTRICITY BILL",
    title: "Metro Power & Grid Co. — Electric Statement",
    accent: "amber",
    currency: "USD",
    headerIcon: <Zap className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Utility Company", value: "Metro Power & Grid Co." },
      { key: "customerName", label: "Customer Name", value: "Robert J. Andrews" },
      { key: "customerAddress", label: "Service Address", value: "44 Elm Street, Suite 2B, Chicago, IL" },
      { key: "accountNo", label: "Account Number", value: "MPG-993-228-10A" },
      { key: "billingPeriod", label: "Billing Period", value: "May 01, 2026 – May 31, 2026" },
      { key: "dueDate", label: "Due Date", value: "2026-06-15", type: "date" },
      { key: "meterPrevNo", label: "Previous Meter Read (kWh)", value: "14235" },
      { key: "meterCurrNo", label: "Current Meter Read (kWh)", value: "14680" },
      { key: "ratePerKwh", label: "Rate per kWh ($)", value: "0.145" },
      { key: "serviceCharge", label: "Grid Maintenance Fee ($)", value: "15.00" },
      { key: "taxRate", label: "State Utility Tax (%)", value: "6.5" },
    ],
    charges: [{ key: "taxRate", label: "State Utility Tax", kind: "percent", value: 6.5, editable: true }],
  },
  {
    id: "us-water-bill",
    name: "US Water / Sewer Bill",
    country: "US",
    countryLabel: "United States",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "WATER & SEWER BILL",
    title: "County Water & Sewer Authority — Statement",
    accent: "sky",
    currency: "USD",
    headerIcon: <Droplet className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Municipal Utility", value: "County Water & Sewer Authority" },
      { key: "customerName", label: "Customer Name", value: "Liam O'Connor" },
      { key: "customerAddress", label: "Property Address", value: "112 Riverside Road, Portland, OR" },
      { key: "meterId", label: "Water Meter ID", value: "WTR-MTR-98001" },
      { key: "billingPeriod", label: "Billing Period", value: "May 01 – May 31, 2026" },
      { key: "dueDate", label: "Due Date", value: "2026-06-22", type: "date" },
      { key: "usageCcf", label: "Consumption (CCF)", value: "12.5" },
      { key: "tierRate", label: "Rate per CCF ($)", value: "4.80" },
      { key: "sewerSurcharge", label: "Sewer & Sanitation Fee ($)", value: "22.50" },
      { key: "taxRate", label: "Tax Rate (%)", value: "0" },
    ],
    charges: [{ key: "taxRate", label: "Tax", kind: "percent", value: 0, editable: true }],
  },
  {
    id: "us-gas-bill",
    name: "US Natural Gas Bill",
    country: "US",
    countryLabel: "United States",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "NATURAL GAS BILL",
    title: "Continental Gas Networks — Volumetric Invoice",
    accent: "orange",
    currency: "USD",
    headerIcon: <Flame className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Gas Utility", value: "Continental Gas Networks" },
      { key: "customerName", label: "Customer Name", value: "Dr. Sarah Mitchell" },
      { key: "customerAddress", label: "Service Address", value: "722 Heatherwood Lane, Suite B" },
      { key: "accountNo", label: "Account Number", value: "GAS-449-301-88X" },
      { key: "dueDate", label: "Due Date", value: "2026-06-20", type: "date" },
      { key: "usageTherms", label: "Usage (Therms)", value: "68" },
      { key: "ratePerTherm", label: "Rate per Therm ($)", value: "1.32" },
      { key: "serviceCharge", label: "Distribution Fee ($)", value: "12.00" },
      { key: "environTax", label: "Carbon Offset Levy ($)", value: "8.40" },
      { key: "taxRate", label: "Tax Rate (%)", value: "5.0" },
    ],
    charges: [{ key: "taxRate", label: "Tax", kind: "percent", value: 5, editable: true }],
  },

  // ── UK UTILITY BILLS ──────────────────────────────────────────────────
  {
    id: "uk-energy-bill",
    name: "UK Energy Bill (Elec + Gas)",
    country: "UK",
    countryLabel: "United Kingdom",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "ENERGY STATEMENT",
    title: "BrightSpark Energy — Dual Fuel Statement",
    accent: "sky",
    currency: "GBP",
    headerIcon: <Zap className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Energy Supplier", value: "BrightSpark Energy Ltd." },
      { key: "customerName", label: "Account Holder", value: "Emily Hartley" },
      { key: "customerAddress", label: "Supply Address", value: "27 Kingsway, Manchester, M2 4FA" },
      { key: "accountNo", label: "Account Reference", value: "BSE-2026-88213" },
      { key: "billingPeriod", label: "Billing Period", value: "01 May – 31 May 2026" },
      { key: "dueDate", label: "Payment Due", value: "2026-06-14", type: "date" },
      { key: "usageKwh", label: "Electricity Usage (kWh)", value: "245" },
      { key: "unitRate", label: "Unit Rate (p/kWh)", value: "27.03" },
      { key: "standingCharge", label: "Standing Charge (p/day × 31)", value: "60.10" },
      { key: "vatRate", label: "VAT on Domestic Energy (%)", value: "5" },
    ],
    charges: [{ key: "vatRate", label: "VAT", kind: "percent", value: 5, editable: true }],
  },
  {
    id: "uk-water-bill",
    name: "UK Water Bill",
    country: "UK",
    countryLabel: "United Kingdom",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "WATER STATEMENT",
    title: "Thames Valley Water — Metered Charges Statement",
    accent: "sky",
    currency: "GBP",
    headerIcon: <Droplet className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Water Company", value: "Thames Valley Water" },
      { key: "customerName", label: "Account Holder", value: "James Whitfield" },
      { key: "customerAddress", label: "Property Address", value: "9 Mill Lane, Reading, RG1 2AB" },
      { key: "accountNo", label: "Account Number", value: "TVW-5521-90" },
      { key: "billingPeriod", label: "Billing Period", value: "01 Apr – 30 Sep 2026 (6 months)" },
      { key: "dueDate", label: "Payment Due", value: "2026-06-30", type: "date" },
      { key: "usageM3", label: "Metered Usage (m³)", value: "58" },
      { key: "ratePerM3", label: "Rate per m³ (£)", value: "1.92" },
      { key: "wasteWaterCharge", label: "Wastewater Standing Charge (£)", value: "34.20" },
      { key: "vatRate", label: "VAT (%) — Water is zero-rated", value: "0" },
    ],
    charges: [{ key: "vatRate", label: "VAT", kind: "percent", value: 0, editable: true }],
  },

  // ── INDIA UTILITY BILLS ────────────────────────────────────────────────
  {
    id: "in-electricity-bill",
    name: "India Electricity Bill",
    country: "IN",
    countryLabel: "India",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "ELECTRICITY BILL",
    title: "Tata Power — Consumer Electricity Bill",
    accent: "amber",
    currency: "INR",
    headerIcon: <Zap className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "DISCOM / Utility", value: "Tata Power Company Ltd." },
      { key: "customerName", label: "Consumer Name", value: "Anjali Deshmukh" },
      { key: "customerAddress", label: "Service Address", value: "Flat 12B, Andheri West, Mumbai 400058" },
      { key: "consumerNo", label: "Consumer Number", value: "TP-4477-2201" },
      { key: "billingPeriod", label: "Billing Period", value: "01 May – 31 May 2026" },
      { key: "dueDate", label: "Due Date", value: "2026-06-18", type: "date" },
      { key: "sanctionedLoad", label: "Sanctioned Load (kW)", value: "5" },
      { key: "unitsConsumed", label: "Units Consumed (kWh)", value: "320" },
      { key: "slabRate", label: "Average Slab Rate (₹/unit)", value: "8.20" },
      { key: "fixedCharge", label: "Fixed / Meter Rent (₹)", value: "120" },
      { key: "subsidyAdjustment", label: "State Subsidy Adjustment (₹, negative = credit)", value: "-150" },
      { key: "electricityDutyRate", label: "Electricity Duty (%)", value: "16" },
    ],
    charges: [{ key: "electricityDutyRate", label: "Electricity Duty", kind: "percent", value: 16, editable: true }],
  },
  {
    id: "in-water-bill",
    name: "India Water Bill",
    country: "IN",
    countryLabel: "India",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "WATER TAX BILL",
    title: "Municipal Corporation — Water Supply Bill",
    accent: "amber",
    currency: "INR",
    headerIcon: <Droplet className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Municipal Body", value: "Greater Municipal Corporation" },
      { key: "customerName", label: "Property Owner", value: "Ravi Kumar Sharma" },
      { key: "customerAddress", label: "Property Address", value: "H.No. 45, Sector 21, Chandigarh" },
      { key: "propertyId", label: "Property / Connection ID", value: "GMC-WS-88231" },
      { key: "billingPeriod", label: "Billing Period", value: "Q2 2026 (Apr–Jun)" },
      { key: "dueDate", label: "Due Date", value: "2026-06-25", type: "date" },
      { key: "usageKl", label: "Consumption (Kilolitres)", value: "18" },
      { key: "ratePerKl", label: "Rate per KL (₹)", value: "12.50" },
      { key: "sewerageCess", label: "Sewerage Cess (₹)", value: "80" },
      { key: "taxRate", label: "Municipal Water Tax (%)", value: "2" },
    ],
    charges: [{ key: "taxRate", label: "Water Tax", kind: "percent", value: 2, editable: true }],
  },

  // ── PAKISTAN UTILITY BILLS ─────────────────────────────────────────────
  {
    id: "pk-electricity-bill",
    name: "Pakistan Electricity Bill",
    country: "PK",
    countryLabel: "Pakistan",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "ELECTRICITY BILL",
    title: "LESCO — Lahore Electric Supply Company",
    accent: "emerald",
    currency: "PKR",
    headerIcon: <Zap className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "DISCO / Utility", value: "Lahore Electric Supply Co. (LESCO)" },
      { key: "customerName", label: "Consumer Name", value: "Muhammad Bilal Hussain" },
      { key: "customerAddress", label: "Service Address", value: "House 21, Model Town, Lahore" },
      { key: "referenceNo", label: "Reference Number", value: "LESCO-771-04-2261" },
      { key: "billingPeriod", label: "Billing Month", value: "June 2026" },
      { key: "dueDate", label: "Due Date", value: "2026-06-15", type: "date" },
      { key: "unitsConsumed", label: "Units Consumed (kWh)", value: "410" },
      { key: "slabRate", label: "Slab Rate (₨/unit)", value: "42.50" },
      { key: "fpaCharge", label: "Fuel Price Adjustment — FPA (₨)", value: "620" },
      { key: "njSurcharge", label: "N.J. Surcharge (₨)", value: "180" },
      { key: "tvFee", label: "PTV License Fee (₨)", value: "35" },
      { key: "gstRate", label: "GST on Electricity (%)", value: "17" },
    ],
    charges: [{ key: "gstRate", label: "GST", kind: "percent", value: 17, editable: true }],
  },
  {
    id: "pk-sui-gas-bill",
    name: "Pakistan Sui Gas Bill",
    country: "PK",
    countryLabel: "Pakistan",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "GAS BILL",
    title: "SNGPL — Sui Northern Gas Pipelines Ltd.",
    accent: "emerald",
    currency: "PKR",
    headerIcon: <Flame className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Gas Utility", value: "Sui Northern Gas Pipelines Ltd." },
      { key: "customerName", label: "Consumer Name", value: "Ayesha Farooq" },
      { key: "customerAddress", label: "Service Address", value: "Street 6, DHA Phase 2, Islamabad" },
      { key: "consumerNo", label: "Consumer Number", value: "SNGPL-08812-341" },
      { key: "billingPeriod", label: "Billing Month", value: "June 2026" },
      { key: "dueDate", label: "Due Date", value: "2026-06-20", type: "date" },
      { key: "usageMmbtu", label: "Consumption (MMBTU)", value: "3.8" },
      { key: "slabRate", label: "Slab Rate (₨/MMBTU)", value: "1650" },
      { key: "meterRent", label: "Meter Rent (₨)", value: "35" },
      { key: "gstRate", label: "GST on Gas (%)", value: "17" },
    ],
    charges: [{ key: "gstRate", label: "GST", kind: "percent", value: 17, editable: true }],
  },
  {
    id: "pk-water-bill",
    name: "Pakistan Water Bill (WASA/KWSB)",
    country: "PK",
    countryLabel: "Pakistan",
    category: "Utility Bills",
    docKind: "utility",
    docLabel: "WATER BILL",
    title: "WASA — Water & Sanitation Agency",
    accent: "emerald",
    currency: "PKR",
    headerIcon: <Droplet className="w-4 h-4" />,
    defaultFields: [
      { key: "companyName", label: "Water Agency", value: "Water & Sanitation Agency (WASA)" },
      { key: "customerName", label: "Consumer Name", value: "Tariq Mehmood" },
      { key: "customerAddress", label: "Property Address", value: "House 88, Johar Town, Lahore" },
      { key: "propertyId", label: "Property Code", value: "WASA-JT-4471" },
      { key: "billingPeriod", label: "Billing Month", value: "June 2026" },
      { key: "dueDate", label: "Due Date", value: "2026-06-15", type: "date" },
      { key: "flatRate", label: "Monthly Flat Rate (₨)", value: "850" },
      { key: "conservancyCharge", label: "Conservancy Charge (₨)", value: "150" },
      { key: "arrears", label: "Previous Arrears (₨)", value: "0" },
      { key: "taxRate", label: "Tax (%)", value: "0" },
    ],
    charges: [{ key: "taxRate", label: "Tax", kind: "percent", value: 0, editable: true }],
  },
];

// ═════════════════════════════════════════════════════════════════════════
// CALCULATION ENGINE
// ═════════════════════════════════════════════════════════════════════════

function num(v: string | undefined): number {
  if (!v) return 0;
  const n = parseFloat(v.toString().replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
}

function billSubtotal(templateId: string, fields: Record<string, string>): { amount: number; usageLabel: string } {
  switch (templateId) {
    case "us-electricity-bill": {
      const consumption = Math.max(0, num(fields.meterCurrNo) - num(fields.meterPrevNo));
      return { amount: consumption * num(fields.ratePerKwh) + num(fields.serviceCharge), usageLabel: `${consumption.toFixed(1)} kWh consumed` };
    }
    case "us-water-bill": {
      const u = num(fields.usageCcf);
      return { amount: u * num(fields.tierRate) + num(fields.sewerSurcharge), usageLabel: `${u} CCF consumed` };
    }
    case "us-gas-bill": {
      const u = num(fields.usageTherms);
      return { amount: u * num(fields.ratePerTherm) + num(fields.serviceCharge) + num(fields.environTax), usageLabel: `${u} therms consumed` };
    }
    case "uk-energy-bill": {
      const u = num(fields.usageKwh);
      const energyCost = (u * num(fields.unitRate)) / 100; // pence to pounds
      const standing = num(fields.standingCharge) / 100;
      return { amount: energyCost + standing, usageLabel: `${u} kWh consumed` };
    }
    case "uk-water-bill": {
      const u = num(fields.usageM3);
      return { amount: u * num(fields.ratePerM3) + num(fields.wasteWaterCharge), usageLabel: `${u} m³ consumed` };
    }
    case "in-electricity-bill": {
      const u = num(fields.unitsConsumed);
      return { amount: u * num(fields.slabRate) + num(fields.fixedCharge) + num(fields.subsidyAdjustment), usageLabel: `${u} units consumed` };
    }
    case "in-water-bill": {
      const u = num(fields.usageKl);
      return { amount: u * num(fields.ratePerKl) + num(fields.sewerageCess), usageLabel: `${u} KL consumed` };
    }
    case "pk-electricity-bill": {
      const u = num(fields.unitsConsumed);
      return {
        amount: u * num(fields.slabRate) + num(fields.fpaCharge) + num(fields.njSurcharge) + num(fields.tvFee),
        usageLabel: `${u} units consumed`,
      };
    }
    case "pk-sui-gas-bill": {
      const u = num(fields.usageMmbtu);
      return { amount: u * num(fields.slabRate) + num(fields.meterRent), usageLabel: `${u} MMBTU consumed` };
    }
    case "pk-water-bill": {
      return { amount: num(fields.flatRate) + num(fields.conservancyCharge) + num(fields.arrears), usageLabel: "Flat monthly rate" };
    }
    default:
      return { amount: 0, usageLabel: "" };
  }
}

function calculateTotals(
  template: FormTemplate,
  fields: Record<string, string>,
  lineItems: LineItem[],
  discount: number,
  chargeOverrides: Record<string, number>,
): Totals {
  let subtotal = 0;
  let usageLabel = "";

  if (template.hasLineItems) {
    subtotal = lineItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
    usageLabel = `${lineItems.length} line item${lineItems.length !== 1 ? "s" : ""}`;
  } else {
    const r = billSubtotal(template.id, fields);
    subtotal = r.amount;
    usageLabel = r.usageLabel;
  }

  const discountAmt = (subtotal * Math.min(Math.max(discount, 0), 100)) / 100;
  const taxableBase = Math.max(0, subtotal - discountAmt);

  const chargeLines = template.charges.map((c) => {
    const rate = chargeOverrides[c.key] ?? c.value;
    const amount = c.kind === "percent" ? (taxableBase * rate) / 100 : rate;
    return { label: `${c.label} (${c.kind === "percent" ? `${rate}%` : fmt(rate, "")})`, amount };
  });

  const total = taxableBase + chargeLines.reduce((s, c) => s + c.amount, 0);

  return { subtotal, usageLabel, discountAmt, chargeLines, total };
}

// ═════════════════════════════════════════════════════════════════════════
// SIGNATURE PAD
// ═════════════════════════════════════════════════════════════════════════

function SignaturePad({
  onChange,
  accentHex,
}: {
  onChange: (dataUrl: string | null) => void;
  accentHex: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const emptyRef = useRef(true);

  const getCtx = () => canvasRef.current?.getContext("2d") ?? null;

  const point = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const scaleX = canvas.width / rect.width / (window.devicePixelRatio || 1);
    const scaleY = canvas.height / rect.height / (window.devicePixelRatio || 1);
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = 400 * dpr;
    canvas.height = 150 * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2.2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#1e293b";
  }, []);

  const start = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    drawingRef.current = true;
    const { x, y } = point(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    e.preventDefault();
    const ctx = getCtx();
    if (!ctx) return;
    const { x, y } = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    emptyRef.current = false;
  };
  const end = () => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    if (!emptyRef.current && canvasRef.current) onChange(canvasRef.current.toDataURL("image/png"));
  };
  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = getCtx();
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    emptyRef.current = true;
    onChange(null);
  };

  return (
    <div className="space-y-2 text-left">
      <div
        className="rounded-xl border-2 border-dashed bg-white dark:bg-zinc-950"
        style={{ borderColor: accentHex + "55" }}
      >
        <canvas
          ref={canvasRef}
          style={{ width: "100%", height: "120px", touchAction: "none" }}
          className="cursor-crosshair rounded-xl bg-white dark:bg-zinc-950"
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={end}
        />
      </div>
      <button
        onClick={clear}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
      >
        <Eraser className="w-3.5 h-3.5" /> Clear signature
      </button>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═════════════════════════════════════════════════════════════════════════

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-3xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/40 backdrop-blur-md shadow-2xs space-y-4 text-left transition-colors">
      <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-mono border-b border-slate-100 dark:border-zinc-800/30 pb-2">
        {icon}
        {title}
      </h4>
      {children}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-extrabold transition-all duration-300 cursor-pointer ${
        active
          ? "bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-sm scale-[1.01]"
          : "text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
      }`}
    >
      {icon} {label}
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════

type TabId = "template" | "metadata" | "items" | "style";

export default function BillFormGenerator() {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  const [activeTemplateId, setActiveTemplateId] = useState("us-commercial-invoice");
  const [activeTab, setActiveTab] = useState<TabId>("template");
  const [previewDark, setPreviewDark] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [templateSearch, setTemplateSearch] = useState("");

  const activeTemplate = useMemo(
    () => TEMPLATES.find((t) => t.id === activeTemplateId) || TEMPLATES[0],
    [activeTemplateId],
  );

  const [formFields, setFormFields] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    TEMPLATES[0].defaultFields.forEach((f) => (init[f.key] = f.value));
    return init;
  });
  const [lineItems, setLineItems] = useState<LineItem[]>(TEMPLATES[0].defaultItems || []);
  const [currency, setCurrency] = useState(TEMPLATES[0].currency);
  const [discount, setDiscount] = useState(0);
  const [chargeOverrides, setChargeOverrides] = useState<Record<string, number>>({});
  const [accentId, setAccentId] = useState(TEMPLATES[0].accent);
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [signatureMode, setSignatureMode] = useState<"draw" | "type">("type");
  const [signatureTyped, setSignatureTyped] = useState("Alex Rivera");
  const [signatureDrawn, setSignatureDrawn] = useState<string | null>(null);

  const [savedDocs, setSavedDocs] = useState<SavedDocument[]>([]);
  const [savedName, setSavedName] = useState("");
  const [showLibrary, setShowLibrary] = useState(false);
  const [restoredNotice, setRestoredNotice] = useState(false);

  const accent = useMemo(() => ACCENT_COLORS.find((a) => a.id === accentId) || ACCENT_COLORS[0], [accentId]);
  const currencyObj = useMemo(() => CURRENCIES.find((c) => c.code === currency) || CURRENCIES[0], [currency]);

  const totals = useMemo(
    () => calculateTotals(activeTemplate, formFields, lineItems, discount, chargeOverrides),
    [activeTemplate, formFields, lineItems, discount, chargeOverrides],
  );

  // ── Load persisted library + autosave on first mount ─────────────────
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSavedDocs(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    try {
      const raw = localStorage.getItem(AUTOSAVE_KEY);
      if (raw) {
        const snap: SavedDocument = JSON.parse(raw);
        const tpl = TEMPLATES.find((t) => t.id === snap.templateId);
        if (tpl) {
          setActiveTemplateId(snap.templateId);
          setFormFields(snap.formFields);
          setLineItems(snap.lineItems);
          setCurrency(snap.currency);
          setDiscount(snap.discount);
          setAccentId(snap.accentId);
          setLogoSrc(snap.logoSrc);
          setSignatureDrawn(snap.signatureSrc);
          setSignatureMode(snap.signatureMode);
          setSignatureTyped(snap.signatureTyped);
          setRestoredNotice(true);
          setTimeout(() => setRestoredNotice(false), 4000);
        }
      }
    } catch {
      /* ignore corrupt autosave */
    }
  }, []);

  // ── Autosave (debounced via effect) ────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      const snap: SavedDocument = {
        id: "autosave",
        savedAt: Date.now(),
        templateId: activeTemplateId,
        name: "Autosave",
        formFields,
        lineItems,
        currency,
        discount,
        accentId,
        logoSrc,
        signatureSrc: signatureDrawn,
        signatureMode,
        signatureTyped,
      };
      try {
        localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(snap));
      } catch {
        /* storage full or unavailable */
      }
    }, 500);
    return () => clearTimeout(t);
  }, [activeTemplateId, formFields, lineItems, currency, discount, accentId, logoSrc, signatureDrawn, signatureMode, signatureTyped]);

  // ── Template swap ──────────────────────────────────────────────────────
  const handleTemplateSwap = useCallback((id: string) => {
    const tpl = TEMPLATES.find((t) => t.id === id) || TEMPLATES[0];
    setActiveTemplateId(id);
    const init: Record<string, string> = {};
    tpl.defaultFields.forEach((f) => (init[f.key] = f.value));
    setFormFields(init);
    setLineItems(tpl.defaultItems ? tpl.defaultItems.map((i) => ({ ...i, id: uid() })) : []);
    setAccentId(tpl.accent);
    setCurrency(tpl.currency);
    setDiscount(0);
    const overrides: Record<string, number> = {};
    tpl.charges.forEach((c) => (overrides[c.key] = c.value));
    setChargeOverrides(overrides);
    setActiveTab("metadata");
  }, []);

  useEffect(() => {
    const overrides: Record<string, number> = {};
    TEMPLATES[0].charges.forEach((c) => (overrides[c.key] = c.value));
    setChargeOverrides(overrides);
  }, []);

  const handleFieldChange = useCallback((key: string, val: string) => {
    setFormFields((prev) => ({ ...prev, [key]: val }));
  }, []);

  // ── Logo ────────────────────────────────────────────────────────────────
  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoSrc(ev.target!.result as string);
    reader.readAsDataURL(file);
  };

  // ── Line items ──────────────────────────────────────────────────────────
  const addLineItem = () =>
    setLineItems((p) => [...p, { id: uid(), description: "New Service Item", qty: 1, rate: 0, unit: "unit" }]);
  const removeLineItem = (id: string) => setLineItems((p) => p.filter((i) => i.id !== id));
  const updateLineItem = (id: string, key: keyof LineItem, val: string | number) =>
    setLineItems((p) => p.map((item) => (item.id === id ? { ...item, [key]: val } : item)));
  const moveLineItem = (id: string, dir: -1 | 1) =>
    setLineItems((p) => {
      const idx = p.findIndex((i) => i.id === id);
      const swapIdx = idx + dir;
      if (idx < 0 || swapIdx < 0 || swapIdx >= p.length) return p;
      const next = [...p];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });

  // ── Reference number, copy ────────────────────────────────────────────
  const referenceNumber =
    formFields.invoiceNo ||
    formFields.accountNo ||
    formFields.referenceNo ||
    formFields.consumerNo ||
    formFields.formNo ||
    formFields.propertyId ||
    `REF-${Date.now().toString().slice(-8)}`;

  const handleCopyRef = () => {
    navigator.clipboard.writeText(referenceNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Print ───────────────────────────────────────────────────────────────
  const handlePrint = () => {
    window.print();
    confetti({ particleCount: 35, spread: 60 });
  };

  // ── Save / Load / JSON export-import ──────────────────────────────────
  const persistLibrary = (docs: SavedDocument[]) => {
    setSavedDocs(docs);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
    } catch {
      /* storage unavailable */
    }
  };

  const saveCurrentDocument = () => {
    const doc: SavedDocument = {
      id: uid(),
      savedAt: Date.now(),
      templateId: activeTemplateId,
      name: savedName.trim() || `${activeTemplate.name} — ${new Date().toLocaleDateString()}`,
      formFields,
      lineItems,
      currency,
      discount,
      accentId,
      logoSrc,
      signatureSrc: signatureDrawn,
      signatureMode,
      signatureTyped,
    };
    persistLibrary([doc, ...savedDocs].slice(0, 30));
    setSavedName("");
  };

  const loadDocument = (doc: SavedDocument) => {
    setActiveTemplateId(doc.templateId);
    setFormFields(doc.formFields);
    setLineItems(doc.lineItems);
    setCurrency(doc.currency);
    setDiscount(doc.discount);
    setAccentId(doc.accentId);
    setLogoSrc(doc.logoSrc);
    setSignatureDrawn(doc.signatureSrc);
    setSignatureMode(doc.signatureMode);
    setSignatureTyped(doc.signatureTyped);
    setShowLibrary(false);
  };

  const deleteDocument = (id: string) => persistLibrary(savedDocs.filter((d) => d.id !== id));

  const exportJson = () => {
    const doc = {
      templateId: activeTemplateId,
      formFields,
      lineItems,
      currency,
      discount,
      accentId,
      logoSrc,
      signatureSrc: signatureDrawn,
      signatureMode,
      signatureTyped,
    };
    const blob = new Blob([JSON.stringify(doc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Toolora_${activeTemplateId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const doc = JSON.parse(e.target!.result as string);
        if (doc.templateId && TEMPLATES.some((t) => t.id === doc.templateId)) {
          setActiveTemplateId(doc.templateId);
          setFormFields(doc.formFields || {});
          setLineItems(doc.lineItems || []);
          setCurrency(doc.currency || "USD");
          setDiscount(doc.discount || 0);
          setAccentId(doc.accentId || "orange");
          setLogoSrc(doc.logoSrc || null);
          setSignatureDrawn(doc.signatureSrc || null);
          setSignatureMode(doc.signatureMode || "type");
          setSignatureTyped(doc.signatureTyped || "");
        }
      } catch {
        /* invalid file */
      }
    };
    reader.readAsText(file);
  };

  // ── Filters ─────────────────────────────────────────────────────────────
  const categories = useMemo(() => ["All", ...Array.from(new Set(TEMPLATES.map((t) => t.category)))], []);
  const filteredTemplates = useMemo(
    () =>
      TEMPLATES.filter((t) => {
        const matchCat = activeCategory === "All" || t.category === activeCategory;
        const matchSearch =
          templateSearch === "" ||
          t.name.toLowerCase().includes(templateSearch.toLowerCase()) ||
          t.countryLabel.toLowerCase().includes(templateSearch.toLowerCase());
        return matchCat && matchSearch;
      }),
    [activeCategory, templateSearch],
  );

  const excludedFromGrid = [
    "companyName", "storeName", "fromName", "clientName", "notes", "signatureConfirm",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto select-none text-slate-900 dark:text-zinc-100 font-sans" id="bill-form-generator-workspace">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Toolora Global Bill &amp; Invoice Studio
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-zinc-100 tracking-tight leading-none">Bill, Invoice &amp; Utility Statement Studio</h2>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
            Country-accurate commercial invoices and utility statements for US, UK, India &amp; Pakistan with live tax calculations,
            signature pad, and vector PDF exports. 100% private in-browser execution.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 shadow-3xs font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% CLIENT-SIDE
          </span>
          <button
            onClick={() => setPreviewDark(!previewDark)}
            className="p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-orange-300 dark:hover:border-orange-500 hover:shadow-xs transition-all cursor-pointer"
            title="Toggle preview theme"
          >
            {previewDark ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-500 dark:text-zinc-400" />}
          </button>
        </div>
      </div>

      {restoredNotice && (
        <div className="mb-4 text-[11px] font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 px-3 py-2 rounded-2xl flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" /> Restored your last unsaved document session from local browser storage.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ═══ LEFT: Multi-Tab Configuration Panel ═══════════════════════ */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 p-1.5 rounded-2xl border border-slate-200/50 dark:border-zinc-800/40 shadow-3xs">
            <TabButton active={activeTab === "template"} onClick={() => setActiveTab("template")} icon={<FileText className="w-3.5 h-3.5" />} label="Template" />
            <TabButton active={activeTab === "metadata"} onClick={() => setActiveTab("metadata")} icon={<Building className="w-3.5 h-3.5" />} label="Metadata" />
            <TabButton active={activeTab === "items"} onClick={() => setActiveTab("items")} icon={<Receipt className="w-3.5 h-3.5" />} label="Items" />
            <TabButton active={activeTab === "style"} onClick={() => setActiveTab("style")} icon={<PenTool className="w-3.5 h-3.5" />} label="Style" />
          </div>

          {/* ── TAB: TEMPLATE ─────────────────────────────────────────── */}
          {activeTab === "template" && (
            <div className="space-y-4">
              <Panel title="Search Global Library">
                <div className="relative mb-3">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Search by country or document type…"
                    className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-zinc-700/80 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black border transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider ${
                        activeCategory === cat
                          ? "bg-orange-600 text-white border-orange-600 shadow-sm"
                          : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-zinc-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </Panel>

              <Panel title="Choose Document Template">
                <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
                  {filteredTemplates.map((t) => {
                    const ac = ACCENT_COLORS.find((a) => a.id === t.accent) || ACCENT_COLORS[0];
                    const isActive = activeTemplateId === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleTemplateSwap(t.id)}
                        className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                          isActive 
                            ? "border-orange-500 ring-2 ring-orange-500/30 shadow-xs" 
                            : "border-slate-100 dark:border-zinc-800 hover:border-orange-200 dark:hover:border-zinc-700/50 bg-white dark:bg-zinc-900/10"
                        }`}
                        style={isActive ? { background: ac.light, borderColor: ac.border } : {}}
                      >
                        <span 
                          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors" 
                          style={{ 
                            background: isActive ? ac.hex + "20" : "rgba(100, 116, 139, 0.08)", 
                            color: isActive ? ac.hex : "rgba(100, 116, 139, 0.7)" 
                          }}
                        >
                          {t.headerIcon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className={`text-[12px] font-extrabold leading-tight ${isActive ? "text-slate-900" : "text-slate-800 dark:text-zinc-200"}`}>{t.name}</p>
                          <p className={`text-[9px] font-black uppercase tracking-widest font-mono mt-1 ${isActive ? "text-slate-600" : "text-slate-400 dark:text-zinc-500"}`}>
                            {t.countryLabel} · {t.docLabel}
                          </p>
                        </div>
                        <span 
                          className="text-[9px] font-black px-2.5 py-1 rounded-full shrink-0 font-mono" 
                          style={{ 
                            background: isActive ? ac.hex + "20" : "rgba(100, 116, 139, 0.08)", 
                            color: isActive ? ac.hex : "rgba(100, 116, 139, 0.7)" 
                          }}
                        >
                          {CURRENCIES.find((c) => c.code === t.currency)?.symbol}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Panel>

              <Panel title="Local Document Library" icon={<FolderOpen className="w-3.5 h-3.5" />}>
                <div className="flex gap-2">
                  <input
                    value={savedName}
                    onChange={(e) => setSavedName(e.target.value)}
                    placeholder="Name this document…"
                    className="flex-1 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                  <button
                    onClick={saveCurrentDocument}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                </div>
                <button
                  onClick={() => setShowLibrary(!showLibrary)}
                  className="w-full flex items-center justify-between text-[11px] font-extrabold text-slate-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer pt-2"
                >
                  <span>{savedDocs.length} saved document{savedDocs.length !== 1 ? "s" : ""} in this browser</span>
                  {showLibrary ? <ChevronUp className="w-3.5 h-3.5 text-orange-500" /> : <ChevronDown className="w-3.5 h-3.5 text-orange-500" />}
                </button>
                {showLibrary && (
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1 pt-1">
                    {savedDocs.length === 0 && <p className="text-[11px] text-slate-400 dark:text-zinc-500 text-center py-4 font-medium">Nothing saved yet.</p>}
                    {savedDocs.map((d) => (
                      <div key={d.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-800/80 bg-slate-50/60 dark:bg-zinc-950/30 hover:border-slate-200 dark:hover:border-zinc-700/60 transition-all">
                        <button onClick={() => loadDocument(d)} className="text-left flex-1 min-w-0 cursor-pointer">
                          <p className="text-[11px] font-extrabold truncate text-slate-700 dark:text-zinc-200">{d.name}</p>
                          <p className="text-[9px] text-slate-400 dark:text-zinc-500 font-mono mt-0.5">{new Date(d.savedAt).toLocaleString()}</p>
                        </button>
                        <button onClick={() => deleteDocument(d.id)} className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg cursor-pointer transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-zinc-800/40">
                  <button
                    onClick={exportJson}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-zinc-600 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer bg-white dark:bg-zinc-900/10 shadow-3xs"
                  >
                    <FileJson className="w-3.5 h-3.5 text-orange-500" /> Export JSON
                  </button>
                  <button
                    onClick={() => jsonInputRef.current?.click()}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 text-[11px] font-bold text-slate-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-zinc-600 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer bg-white dark:bg-zinc-900/10 shadow-3xs"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-500" /> Import JSON
                  </button>
                  <input ref={jsonInputRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
                </div>
              </Panel>
            </div>
          )}

          {/* ── TAB: METADATA ─────────────────────────────────────────── */}
          {activeTab === "metadata" && (
            <Panel title="Core Document Metadata">
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1 py-1">
                {activeTemplate.defaultFields.map((field) => (
                  <div key={field.key} className={field.span ? "col-span-2" : ""}>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 font-mono block mb-1.5">
                      {field.label}
                    </label>
                    {field.type === "textarea" ? (
                      <textarea
                        rows={3}
                        value={formFields[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 resize-none transition-all"
                      />
                    ) : (
                      <input
                        type={field.type || "text"}
                        value={formFields[field.key] || ""}
                        onChange={(e) => handleFieldChange(field.key, e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-100 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                      />
                    )}
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* ── TAB: ITEMS & TARIFFS ─────────────────────────────────── */}
          {activeTab === "items" && (
            <div className="space-y-4">
              {activeTemplate.hasLineItems && (
                <Panel title="Line Items">
                  <div className="space-y-3">
                    {lineItems.map((item, idx) => (
                      <div key={item.id} className="flex gap-2.5 items-start p-3 rounded-2xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20">
                        <div className="flex flex-col gap-1.5 pt-1">
                          <button onClick={() => moveLineItem(item.id, -1)} disabled={idx === 0} className="p-0.5 text-slate-400 hover:text-orange-500 disabled:opacity-20 cursor-pointer">
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveLineItem(item.id, 1)} disabled={idx === lineItems.length - 1} className="p-0.5 text-slate-400 hover:text-orange-500 disabled:opacity-20 cursor-pointer">
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex-1 space-y-2">
                          <input
                            value={item.description}
                            onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                            placeholder="Description"
                            className="w-full text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-950 outline-none focus:border-orange-400"
                          />
                          {activeTemplate.country === "IN" && (
                            <input
                              value={item.hsn || ""}
                              onChange={(e) => updateLineItem(item.id, "hsn", e.target.value)}
                              placeholder="HSN / SAC code"
                              className="w-full text-[10px] px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-950 outline-none focus:border-orange-400 font-mono"
                            />
                          )}
                          <div className="flex gap-1.5">
                            <input
                              type="number"
                              value={item.qty}
                              min={0}
                              onChange={(e) => updateLineItem(item.id, "qty", parseFloat(e.target.value) || 0)}
                              placeholder="Qty"
                              className="w-16 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-950 outline-none focus:border-orange-400 text-center"
                            />
                            <input
                              type="number"
                              value={item.rate}
                              min={0}
                              onChange={(e) => updateLineItem(item.id, "rate", parseFloat(e.target.value) || 0)}
                              placeholder="Rate"
                              className="flex-1 text-xs font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-950 outline-none focus:border-orange-400"
                            />
                            <span className="text-[10px] font-black text-slate-600 dark:text-zinc-300 py-1.5 px-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-zinc-800 shadow-3xs whitespace-nowrap min-w-[70px] text-right font-mono">
                              {fmt(item.qty * item.rate, currencyObj.symbol)}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeLineItem(item.id)} className="mt-1 p-1.5 rounded-xl text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/35 cursor-pointer transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addLineItem}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-orange-300 dark:border-orange-800/80 text-orange-600 dark:text-orange-400 text-[11px] font-black hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Line Item
                    </button>
                  </div>
                </Panel>
              )}

              {!activeTemplate.hasLineItems && (
                <Panel title="Tariff &amp; Consumption Fields">
                  <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                    This document type calculates its subtotal directly from the consumption and rate fields —
                    edit them in the <strong>Metadata</strong> tab and the live preview updates automatically.
                  </p>
                </Panel>
              )}

              <Panel title="Currency, Discount &amp; Tax Components">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-mono block mb-1">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 outline-none cursor-pointer"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.symbol} — {c.code} ({c.label})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-500 font-mono block mb-1">Discount (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discount}
                      onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 text-slate-800 dark:text-zinc-200 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all text-center"
                    />
                  </div>
                </div>
                {activeTemplate.charges.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-zinc-800/40">
                    {activeTemplate.charges.map((c) => (
                      <div key={c.key} className="flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-zinc-900/10 p-2 rounded-xl border border-slate-100 dark:border-zinc-800/50">
                        <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">{c.label} ({c.kind === "percent" ? "%" : currencyObj.symbol})</span>
                        <input
                          type="number"
                          value={chargeOverrides[c.key] ?? c.value}
                          onChange={(e) => setChargeOverrides((p) => ({ ...p, [c.key]: parseFloat(e.target.value) || 0 }))}
                          className="w-20 text-xs font-black px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700/80 bg-white dark:bg-zinc-950 outline-none focus:border-orange-500 text-right font-mono"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </Panel>
            </div>
          )}

          {/* ── TAB: STYLE & SIGN ─────────────────────────────────────── */}
          {activeTab === "style" && (
            <div className="space-y-4">
              <Panel title="Accent Color">
                <div className="flex flex-wrap gap-3">
                  {ACCENT_COLORS.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setAccentId(a.id)}
                      style={{ backgroundColor: a.hex }}
                      className={`w-8 h-8 rounded-full border-2 transition-all cursor-pointer ${accentId === a.id ? "border-white dark:border-zinc-900 scale-110 ring-2 ring-offset-1 ring-orange-500" : "border-transparent hover:scale-105"}`}
                      title={a.label}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">Matched to recognizable corporate and utility visual styles.</p>
              </Panel>

              <Panel title="Company / Utility Logo" icon={<Upload className="w-3.5 h-3.5" />}>
                {logoSrc ? (
                  <div className="flex items-center gap-2.5 p-2.5 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200 dark:border-zinc-800/80">
                    <img src={logoSrc} alt="Logo" className="w-9 h-9 object-contain rounded bg-white shadow-3xs" />
                    <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium flex-1">Logo uploaded — cached locally in base64</span>
                    <button onClick={() => setLogoSrc(null)} className="p-1.5 text-rose-400 hover:text-rose-600 cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => logoInputRef.current?.click()}
                    onDrop={(e) => { e.preventDefault(); e.dataTransfer.files?.[0] && handleLogoUpload(e.dataTransfer.files[0]); }}
                    onDragOver={(e) => e.preventDefault()}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-zinc-800 text-[11px] font-black text-slate-500 dark:text-zinc-400 hover:border-orange-400 dark:hover:border-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-all cursor-pointer bg-white/50 dark:bg-zinc-900/10 uppercase tracking-wider"
                  >
                    <Upload className="w-3.5 h-3.5 text-orange-500" /> Upload / Drop Logo (PNG, SVG, JPG)
                  </button>
                )}
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
              </Panel>

              <Panel title="Digital Signature" icon={<PenTool className="w-3.5 h-3.5" />}>
                <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-xl w-fit border border-slate-200/50 dark:border-zinc-800/40">
                  <button
                    onClick={() => setSignatureMode("type")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${signatureMode === "type" ? "bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-3xs" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    <TypeIcon className="w-3 h-3" /> Type
                  </button>
                  <button
                    onClick={() => setSignatureMode("draw")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${signatureMode === "draw" ? "bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-3xs" : "text-slate-500 hover:text-slate-700"}`}
                  >
                    <PenTool className="w-3 h-3" /> Draw
                  </button>
                </div>
                {signatureMode === "type" ? (
                  <div className="space-y-3">
                    <input
                      value={signatureTyped}
                      onChange={(e) => setSignatureTyped(e.target.value)}
                      placeholder="Type your name"
                      className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    />
                    <p className="mt-2 text-2xl px-3 py-4 text-center rounded-2xl bg-slate-50/50 dark:bg-zinc-950 border border-dashed border-slate-200 dark:border-zinc-800 select-text" style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}>
                      {signatureTyped || "Your Signature"}
                    </p>
                  </div>
                ) : (
                  <SignaturePad onChange={setSignatureDrawn} accentHex={accent.hex} />
                )}
              </Panel>
            </div>
          )}

          {/* ── Action Bar ────────────────────────────────────────────── */}
          <div className="space-y-2 pt-2 text-left">
            <button
              onClick={handlePrint}
              className="w-full flex items-center justify-between gap-2 px-5 py-3.5 rounded-2xl font-black text-sm text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: accent.hex }}
            >
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4" /> 
                <span>Print / Save as PDF</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-70" />
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleCopyRef}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-zinc-700 transition-colors cursor-pointer shadow-3xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0 text-orange-500" />}
                <span>{copied ? "Copied!" : "Copy Ref"}</span>
              </button>
              <button
                onClick={exportJson}
                className="flex items-center justify-center gap-1.5 py-2.5 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[11px] font-black uppercase tracking-wider text-slate-600 dark:text-zinc-400 hover:border-orange-300 dark:hover:border-zinc-700 transition-colors cursor-pointer shadow-3xs"
              >
                <FileJson className="w-3.5 h-3.5 shrink-0 text-orange-500" /> 
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* ═══ RIGHT: Live Paper-Style Preview ════════════════════════ */}
        <div className="lg:col-span-7">
          <div className={`p-3 sm:p-6 rounded-3xl border transition-colors duration-300 ${previewDark ? "bg-zinc-900/60 border-zinc-800/80" : "bg-slate-100/80 border-slate-200 dark:bg-zinc-950/50 dark:border-zinc-800"} flex justify-center`}>
            <div
              id="printable-receipt-card"
              className={`w-full max-w-[620px] aspect-[210/297] p-8 sm:p-10 rounded-2xl shadow-xl relative overflow-y-auto transition-colors duration-300 ${previewDark ? "bg-gray-950 text-white" : "bg-white text-zinc-900"}`}
              style={{ borderTop: `7px solid ${accent.hex}` }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-5 text-left">
                <div className="flex-1">
                  {logoSrc ? (
                    <img src={logoSrc} alt="Logo" className="h-11 w-auto object-contain mb-2.5 bg-white rounded p-0.5" />
                  ) : (
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5 text-white font-black text-base shadow-sm" style={{ backgroundColor: accent.hex }}>
                      {activeTemplate.headerIcon}
                    </div>
                  )}
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] font-mono" style={{ color: accent.hex }}>
                    Toolora Secure Document Engine
                  </p>
                  <h4 className={`text-base font-black mt-1 leading-tight tracking-tight ${previewDark ? "text-white" : "text-zinc-900"}`}>{activeTemplate.title}</h4>
                  <p className={`text-[9px] font-mono mt-1 ${previewDark ? "text-zinc-400" : "text-slate-400"}`}>Ref: {referenceNumber}</p>
                  {activeTemplate.regLabel && (
                    <p className={`text-[9px] font-mono ${previewDark ? "text-zinc-400" : "text-slate-400"}`}>
                      {activeTemplate.regLabel}: {formFields.vatNo || formFields.gstin || formFields.ntn || "—"}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-right space-y-2">
                  <div className="px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest font-mono" style={{ background: accent.light, color: accent.hex, border: `1px solid ${accent.border}` }}>
                    {activeTemplate.docLabel}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest">{activeTemplate.countryLabel}</p>
                </div>
              </div>

              <div className={`border-t border-dashed ${previewDark ? "border-zinc-800" : "border-slate-100"} mb-5`} />

              {/* Field grid */}
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 text-xs mb-5 text-left">
                {activeTemplate.defaultFields
                  .filter((f) => !excludedFromGrid.includes(f.key))
                  .map((field) => (
                    <div key={field.key} className={field.span ? "col-span-2" : ""}>
                      <span className={`text-[9px] font-black uppercase tracking-wider font-mono block mb-1 ${previewDark ? "text-zinc-500" : "text-slate-400"}`}>{field.label}</span>
                      <span className={`font-semibold break-words block text-[11px] ${previewDark ? "text-zinc-100" : "text-zinc-800"}`}>{formFields[field.key] || "—"}</span>
                    </div>
                  ))}
              </div>

              {(formFields.fromName || formFields.companyName) && (formFields.clientName) && (
                <div className="grid grid-cols-2 gap-5 text-xs mb-5 p-4 rounded-xl border border-dashed text-left" style={{ background: accent.light + "33", borderColor: accent.border + "55" }}>
                  <div>
                    <p className={`text-[9px] font-bold uppercase tracking-wider font-mono mb-1 ${previewDark ? "text-zinc-500" : "text-slate-400"}`}>From</p>
                    <p className={`font-black text-[11px] ${previewDark ? "text-white" : "text-zinc-900"}`}>{formFields.fromName || formFields.companyName}</p>
                  </div>
                  <div>
                    <p className={`text-[9px] font-bold uppercase tracking-wider font-mono mb-1 ${previewDark ? "text-zinc-500" : "text-slate-400"}`}>Bill To</p>
                    <p className={`font-black text-[11px] ${previewDark ? "text-white" : "text-zinc-900"}`}>{formFields.clientName}</p>
                  </div>
                </div>
              )}

              {/* Line items table */}
              {activeTemplate.hasLineItems && (
                <div className={`rounded-xl overflow-hidden border mb-5 text-left ${previewDark ? "border-zinc-800 bg-zinc-950/40" : "border-slate-100 bg-slate-50/20"}`}>
                  <div className={`grid ${activeTemplate.country === "IN" ? "grid-cols-12" : "grid-cols-12"} gap-1 px-3.5 py-2.5 text-[9px] font-black uppercase tracking-wider font-mono ${previewDark ? "bg-zinc-900 text-zinc-500" : "bg-slate-50 text-slate-500"}`}>
                    <span className={activeTemplate.country === "IN" ? "col-span-5" : "col-span-5"}>Description</span>
                    {activeTemplate.country === "IN" && <span className="col-span-2 text-right">HSN</span>}
                    <span className={activeTemplate.country === "IN" ? "col-span-1 text-right" : "col-span-2 text-right"}>Qty</span>
                    <span className="col-span-2 text-right">Rate</span>
                    <span className="col-span-3 text-right">Amount</span>
                  </div>
                  {lineItems.map((item) => (
                    <div key={item.id} className={`grid ${activeTemplate.country === "IN" ? "grid-cols-12" : "grid-cols-12"} gap-1 px-3.5 py-2.5 text-[11px] border-t ${previewDark ? "border-zinc-900 text-zinc-200" : "border-slate-100 text-zinc-700"}`}>
                      <span className={`font-semibold ${activeTemplate.country === "IN" ? "col-span-5" : "col-span-5"}`}>{item.description}</span>
                      {activeTemplate.country === "IN" && <span className="col-span-2 text-right font-mono text-[10px] text-slate-400 dark:text-zinc-500">{item.hsn || "—"}</span>}
                      <span className={`${activeTemplate.country === "IN" ? "col-span-1" : "col-span-2"} text-right font-mono font-medium`}>{item.qty}</span>
                      <span className="col-span-2 text-right font-mono font-medium">{fmt(item.rate, currencyObj.symbol)}</span>
                      <span className="col-span-3 text-right font-black font-mono">{fmt(item.qty * item.rate, currencyObj.symbol)}</span>
                    </div>
                  ))}
                </div>
              )}

              {formFields.notes && (
                <div className={`p-3.5 rounded-xl text-[10px] mb-5 text-left leading-relaxed ${previewDark ? "bg-zinc-900/60 text-zinc-400 border border-zinc-800/40" : "bg-slate-50 text-slate-500 border border-slate-100"}`}>
                  <span className="font-extrabold uppercase tracking-wider font-mono block mb-1 text-slate-400 dark:text-zinc-500">Notes &amp; Banking Details</span>
                  {formFields.notes}
                </div>
              )}

              <div className={`border-t border-dashed ${previewDark ? "border-zinc-800" : "border-slate-100"} mb-5`} />

              {/* Totals */}
              <div className="space-y-2 text-xs mb-6 text-left">
                <div className={`flex justify-between font-semibold ${previewDark ? "text-zinc-400" : "text-slate-500"}`}>
                  <span>Subtotal ({totals.usageLabel})</span>
                  <span className="font-mono">{fmt(totals.subtotal, currencyObj.symbol)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-bold text-emerald-600">
                    <span>Discount ({discount}%)</span>
                    <span className="font-mono">−{fmt(totals.discountAmt, currencyObj.symbol)}</span>
                  </div>
                )}
                {totals.chargeLines.map((c, i) => (
                  <div key={i} className={`flex justify-between font-semibold ${previewDark ? "text-zinc-400" : "text-slate-500"}`}>
                    <span>{c.label}</span>
                    <span className="font-mono">{fmt(c.amount, currencyObj.symbol)}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between items-center text-base font-black pt-2 rounded-xl px-4 py-3 mt-2 shadow-3xs"
                  style={{ background: accent.light, color: accent.hex, border: `1px solid ${accent.border}` }}
                >
                  <span className="text-[11px] font-black uppercase tracking-widest font-mono">TOTAL DUE</span>
                  <span className="font-mono tracking-tight">{fmt(totals.total, currencyObj.symbol)} {currency}</span>
                </div>
              </div>

              {/* Signature block */}
              <div className="flex items-end justify-between gap-4 mb-5 text-left">
                <div className={`flex-1 text-[8px] font-mono leading-relaxed ${previewDark ? "text-zinc-500" : "text-slate-400"}`}>
                  Generated {new Date().toLocaleDateString()} via Toolora Secure Document Engine.
                </div>
                <div className="text-center shrink-0 min-w-[120px]">
                  {signatureMode === "draw" && signatureDrawn ? (
                    <img src={signatureDrawn} alt="Signature" className="h-10 mx-auto" style={{ filter: previewDark ? "invert(1)" : "none" }} />
                  ) : (
                    <p className="text-xl px-2 h-10 flex items-center justify-center select-text" style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive", color: previewDark ? "#fff" : "#1e293b" }}>
                      {signatureTyped || "—"}
                    </p>
                  )}
                  <div className={`border-t mt-1.5 pt-1 text-[8px] font-mono uppercase tracking-[0.2em] ${previewDark ? "border-zinc-800 text-zinc-500" : "border-slate-200 text-slate-400"}`}>
                    Authorized Sign
                  </div>
                </div>
              </div>

              <div className={`pt-3 border-t border-slate-100 dark:border-zinc-900/60 text-center text-[8px] font-mono space-y-0.5 ${previewDark ? "text-zinc-600" : "text-slate-400"}`}>
                <p>Generated locally by Toolora — Zero server transmission, zero data retention</p>
                <p className="tracking-widest uppercase font-black text-orange-600/80 dark:text-orange-400/80 mt-1">✦ OFFLINE INTEGRITY VERIFIED ✦</p>
              </div>
            </div>
          </div>
          <p className={`text-[10px] font-mono uppercase tracking-widest text-center mt-3 font-semibold ${previewDark ? "text-zinc-600" : "text-slate-400"}`}>
            ✦ A4 print-ready preview — Ctrl+P / ⌘+P to save as PDF
          </p>
        </div>
      </div>

      {/* ── Print Styles ─────────────────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #printable-receipt-card, #printable-receipt-card * { visibility: visible !important; }
          #printable-receipt-card { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: auto !important; margin: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
}
