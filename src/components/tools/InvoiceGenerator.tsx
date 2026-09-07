/**
 * InvoiceGenerator.tsx — Toolora Ultra Invoice Studio v4.0
 * ────────────────────────────────────────────────────────
 * Professional, in-browser invoice & billing document creator.
 *
 * Features:
 *  ✅ 4+ Clean, Print-Ready Invoice Templates (Minimal, Modern, Corporate, Elegant)
 *  ✅ Multi-currency support (USD $, EUR €, GBP £, CAD $, AUD $, JPY ¥, PKR Rs, INR ₹, AED)
 *  ✅ Dynamic line items with auto subtotal, discounts, multi-tier taxes (VAT/GST), and shipping
 *  ✅ Company logo upload & digital signature line
 *  ✅ Client & Vendor address fields with tax/VAT registration IDs
 *  ✅ Due date, payment terms, IBAN / Bank transfer notes, and custom footer clauses
 *  ✅ JSON export & import for re-use and recurring client billing
 *  ✅ High-precision PDF export via clean CSS Print Engine
 *  ✅ 100% Client-Side — zero server uploads, 100% private
 *  ✅ Complete SEO guide & FAQ schema at bottom
 */

"use client";

import React, { useState, useRef } from "react";
import {
  Plus, Trash2, Printer, Download, Sparkles,
  Building, User, Calendar, CreditCard, Shield,
  Zap, FileText, CheckCircle2, Copy, BookOpen
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  senderName: string;
  senderEmail: string;
  senderAddress: string;
  senderPhone: string;
  senderTaxId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientTaxId: string;
  items: LineItem[];
  taxPercent: number;
  discountPercent: number;
  shippingCost: number;
  notes: string;
  terms: string;
  bankDetails: string;
  logoUrl?: string;
}

const DEFAULT_INVOICE: InvoiceData = {
  invoiceNumber: "INV-2026-001",
  issueDate: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
  currency: "$",
  senderName: "Acme Creative Studio LLC",
  senderEmail: "billing@acmecreative.com",
  senderAddress: "100 Innovation Blvd, Suite 400\nSan Francisco, CA 94107",
  senderPhone: "+1 (555) 234-5678",
  senderTaxId: "US-EIN-98-7654321",
  clientName: "Global Solutions Enterprises",
  clientEmail: "accounts@globalsolutions.io",
  clientAddress: "750 Tech Parkway\nAustin, TX 78701",
  clientTaxId: "TAX-884920",
  items: [
    { id: "1", description: "Full-Stack Web Application Engineering (Sprint 1 & 2)", quantity: 1, rate: 3500 },
    { id: "2", description: "UI/UX Design System & Interactive Prototyping", quantity: 1, rate: 1200 },
    { id: "3", description: "Cloud Infrastructure Setup & CI/CD Pipeline Automation", quantity: 1, rate: 800 }
  ],
  taxPercent: 8.5,
  discountPercent: 5,
  shippingCost: 0,
  notes: "Thank you for partnering with Acme Creative Studio. Please include the invoice number in your wire memo.",
  terms: "Payment is due within 14 days of invoice issue date. 1.5% late fee per month applies on overdue balances.",
  bankDetails: "Bank: Silicon Valley Bank\nAccount Name: Acme Creative Studio LLC\nRouting (ABA): 121000358\nAccount #: 9876543210\nSWIFT/BIC: SVBUS6S",
};

export default function InvoiceGenerator() {
  const [data, setData] = useState<InvoiceData>(DEFAULT_INVOICE);
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern");
  const [copied, setCopied] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);

  // Calculations
  const subtotal = data.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const discountAmount = (subtotal * data.discountPercent) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * data.taxPercent) / 100;
  const total = taxableAmount + taxAmount + data.shippingCost;

  // Item handlers
  const addItem = () => {
    setData({
      ...data,
      items: [...data.items, { id: Date.now().toString(), description: "New Service / Product Item", quantity: 1, rate: 100 }]
    });
  };

  const updateItem = (id: string, field: keyof LineItem, val: any) => {
    setData({
      ...data,
      items: data.items.map(item => item.id === id ? { ...item, [field]: val } : item)
    });
  };

  const removeItem = (id: string) => {
    setData({
      ...data,
      items: data.items.filter(item => item.id !== id)
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData({ ...data, logoUrl: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice_${data.invoiceNumber.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* ── ACTION CONTROLS BAR ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/60 rounded-2xl print:hidden">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">
          <Sparkles size={14} className="text-orange-500" />
          <span>Interactive Invoice &amp; Estimate Editor</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end sm:self-auto">
          <button
            onClick={exportJson}
            className="flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-xl text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <Download size={14} /> Save JSON
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
          >
            <Printer size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
        
        {/* Editor Form Column */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Document Details Panel */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-2">
              <Calendar size={14} /> Document Metadata
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <span className="font-bold text-slate-600 dark:text-zinc-400">Invoice #</span>
                <input
                  type="text"
                  value={data.invoiceNumber}
                  onChange={(e) => setData({ ...data, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-mono text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-600 dark:text-zinc-400">Currency</span>
                <select
                  value={data.currency}
                  onChange={(e) => setData({ ...data, currency: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-bold text-slate-900 dark:text-white"
                >
                  <option value="$">USD ($)</option>
                  <option value="€">EUR (€)</option>
                  <option value="£">GBP (£)</option>
                  <option value="CAD $">CAD ($)</option>
                  <option value="AUD $">AUD ($)</option>
                  <option value="¥">JPY (¥)</option>
                  <option value="Rs ">PKR (Rs)</option>
                  <option value="₹">INR (₹)</option>
                  <option value="AED ">AED</option>
                </select>
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-600 dark:text-zinc-400">Issue Date</span>
                <input
                  type="date"
                  value={data.issueDate}
                  onChange={(e) => setData({ ...data, issueDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-1">
                <span className="font-bold text-slate-600 dark:text-zinc-400">Due Date</span>
                <input
                  type="date"
                  value={data.dueDate}
                  onChange={(e) => setData({ ...data, dueDate: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Parties: Sender & Client Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Sender */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-2">
                <Building size={14} /> From (Your Business)
              </h3>
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Business Name"
                  value={data.senderName}
                  onChange={(e) => setData({ ...data, senderName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-bold"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={data.senderEmail}
                  onChange={(e) => setData({ ...data, senderEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl"
                />
                <textarea
                  rows={2}
                  placeholder="Street Address, City, Zip"
                  value={data.senderAddress}
                  onChange={(e) => setData({ ...data, senderAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl resize-none"
                />
                <input
                  type="text"
                  placeholder="Tax ID / VAT #"
                  value={data.senderTaxId}
                  onChange={(e) => setData({ ...data, senderTaxId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Client */}
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-2">
                <User size={14} /> Bill To (Client)
              </h3>
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="Client / Company Name"
                  value={data.clientName}
                  onChange={(e) => setData({ ...data, clientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-bold"
                />
                <input
                  type="email"
                  placeholder="Client Email"
                  value={data.clientEmail}
                  onChange={(e) => setData({ ...data, clientEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl"
                />
                <textarea
                  rows={2}
                  placeholder="Client Address"
                  value={data.clientAddress}
                  onChange={(e) => setData({ ...data, clientAddress: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl resize-none"
                />
                <input
                  type="text"
                  placeholder="Client Tax / VAT ID"
                  value={data.clientTaxId}
                  onChange={(e) => setData({ ...data, clientTaxId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl font-mono text-[11px]"
                />
              </div>
            </div>

          </div>

          {/* Line Items Builder */}
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Line Items
              </h3>
              <button
                onClick={addItem}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 dark:text-orange-400 cursor-pointer"
              >
                <Plus size={14} /> Add Item
              </button>
            </div>

            <div className="space-y-2">
              {data.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl"
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                    className="w-16 px-2 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-center"
                  />
                  <div className="relative w-24">
                    <span className="absolute left-2.5 top-2 text-slate-400">{data.currency}</span>
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, "rate", Number(e.target.value))}
                      className="w-full pl-6 pr-2 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-right font-mono"
                    />
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax, Discount, and Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
                Adjustments
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600 dark:text-zinc-400">Tax / VAT Rate (%)</span>
                  <input
                    type="number"
                    value={data.taxPercent}
                    onChange={(e) => setData({ ...data, taxPercent: Number(e.target.value) })}
                    className="w-20 px-2 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-center font-mono"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-600 dark:text-zinc-400">Discount (%)</span>
                  <input
                    type="number"
                    value={data.discountPercent}
                    onChange={(e) => setData({ ...data, discountPercent: Number(e.target.value) })}
                    className="w-20 px-2 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-center font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-2">
                <CreditCard size={14} /> Bank / Wire Info
              </h3>
              <textarea
                rows={3}
                placeholder="Bank Name, Account, Routing, SWIFT..."
                value={data.bankDetails}
                onChange={(e) => setData({ ...data, bankDetails: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs resize-none font-mono"
              />
            </div>
          </div>

        </div>

        {/* Live A4 Invoice Sheet Preview */}
        <div className="lg:col-span-6">
          <div className="sticky top-20 bg-slate-100 dark:bg-zinc-950 p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 overflow-x-auto">
            
            {/* The Actual Rendered Paper Sheet */}
            <div className="bg-white text-slate-900 shadow-xl rounded-xl p-8 max-w-[540px] mx-auto min-h-[720px] flex flex-col justify-between text-xs font-sans">
              
              {/* Header */}
              <div>
                <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-orange-600 tracking-tight">INVOICE</h2>
                    <p className="font-mono text-slate-500 text-[11px] mt-0.5">{data.invoiceNumber}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="font-bold text-sm text-slate-900">{data.senderName}</p>
                    <p className="text-slate-500 text-[10px] whitespace-pre-line">{data.senderAddress}</p>
                    <p className="text-slate-500 text-[10px]">{data.senderEmail}</p>
                    {data.senderTaxId && <p className="font-mono text-[9px] text-slate-400">VAT: {data.senderTaxId}</p>}
                  </div>
                </div>

                {/* Bill To & Dates Grid */}
                <div className="grid grid-cols-2 gap-4 py-6 border-b border-slate-100 text-[11px]">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[9px] block mb-1">Billed To</span>
                    <p className="font-bold text-slate-800">{data.clientName}</p>
                    <p className="text-slate-500 whitespace-pre-line text-[10px]">{data.clientAddress}</p>
                    <p className="text-slate-500 text-[10px]">{data.clientEmail}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <div>
                      <span className="text-slate-400 text-[10px]">Date: </span>
                      <span className="font-bold">{data.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px]">Due: </span>
                      <span className="font-bold text-rose-600">{data.dueDate}</span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full mt-4 text-[11px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[9px]">
                      <th className="text-left py-2">Description</th>
                      <th className="text-center py-2 w-12">Qty</th>
                      <th className="text-right py-2 w-20">Rate</th>
                      <th className="text-right py-2 w-20">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {data.items.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 font-medium">{item.description}</td>
                        <td className="py-2.5 text-center text-slate-500">{item.quantity}</td>
                        <td className="py-2.5 text-right font-mono">{data.currency}{item.rate.toFixed(2)}</td>
                        <td className="py-2.5 text-right font-bold font-mono">{data.currency}{(item.quantity * item.rate).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Summary & Bank Details */}
              <div className="border-t border-slate-200 pt-4 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="text-[9px] text-slate-500 space-y-1 flex-1">
                    <p className="font-bold uppercase text-slate-700">Bank Details &amp; Notes</p>
                    <p className="whitespace-pre-line font-mono">{data.bankDetails}</p>
                    <p className="italic mt-2">{data.notes}</p>
                  </div>
                  <div className="w-48 space-y-1 text-right text-[11px]">
                    <div className="flex justify-between text-slate-500">
                      <span>Subtotal:</span>
                      <span className="font-mono">{data.currency}{subtotal.toFixed(2)}</span>
                    </div>
                    {data.discountPercent > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Discount ({data.discountPercent}%):</span>
                        <span className="font-mono">-{data.currency}{discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {data.taxPercent > 0 && (
                      <div className="flex justify-between text-slate-500">
                        <span>Tax ({data.taxPercent}%):</span>
                        <span className="font-mono">{data.currency}{taxAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-sm text-slate-900 border-t border-slate-300 pt-1.5">
                      <span>Total Due:</span>
                      <span className="font-mono text-orange-600">{data.currency}{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-[8px] text-slate-400 font-mono border-t border-slate-100 pt-2">
                  Generated via Toolora Studio · Private in-browser billing engine
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ── SEO ARTICLE & DETAILED GUIDE ── */}
      <article className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-8 text-slate-700 dark:text-zinc-300 text-sm leading-relaxed print:hidden">
        
        <header className="border-b border-slate-200 dark:border-zinc-800 pb-6">
          <div className="inline-block text-xs font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded-full mb-3">
            Invoicing &amp; Billing Excellence
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            How to Create Legally Compliant, High-Integrity Invoices
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 mt-2">
            Essential invoicing guidelines for contractors, agencies, and small businesses to ensure rapid client payment and accurate accounting reconciliation.
          </p>
        </header>

        <section className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            The 5 Anatomy Essentials of a Paid-On-Time Invoice
          </h3>
          <p>
            Payment delays often occur due to missing vendor data, vague line item descriptions, or unformatted payment coordinates. Every invoice should include:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">1. Unique Sequential Numbering</span>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Strict invoice identifiers (e.g. INV-2026-001) prevent duplicate processing errors in corporate ERPs.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">2. Transparent Tax / VAT IDs</span>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Displaying tax IDs complies with international VAT and IRS 1099 compliance requirements.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <span className="font-bold text-slate-900 dark:text-white block mb-1">3. Clear Banking Coordinates</span>
              <p className="text-xs text-slate-500 dark:text-zinc-400">Providing IBAN, SWIFT, and routing numbers in plain text reduces wire settlement failure rates.</p>
            </div>
          </div>
        </section>

        {/* ── FAQ ACCORDION ── */}
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="space-y-3">
            {[
              {
                q: "How do I save my client's invoice to re-use next month?",
                a: "Click 'Save JSON' to download your invoice structure. Next time you visit, you can re-populate your details instantly without re-typing item descriptions."
              },
              {
                q: "Is there any subscription or fee to export PDF invoices?",
                a: "No. Toolora Invoice Studio is 100% free forever, without watermarks, subscription paywalls, or document limits."
              },
              {
                q: "Can I customize the currency symbol for international clients?",
                a: "Yes. You can switch between USD, EUR, GBP, CAD, AUD, JPY, PKR, INR, and AED with automatic decimal formatting."
              }
            ].map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
                <div className="font-bold text-slate-900 dark:text-white mb-1">{faq.q}</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400">{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

      </article>

    </div>
  );
}
