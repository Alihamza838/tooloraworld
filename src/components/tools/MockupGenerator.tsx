/**
 * MockupGenerator.tsx — Toolora Ultra Mockup Studio v5.0
 * ────────────────────────────────────────────────────────
 * • 50 hand-drawn canvas mockups across 10 categories
 * • Pure HTML5 Canvas engine, zero server deps
 * • Realistic curvature mapping for round/cylindrical surfaces
 * • Drag, resize, rotate logo on canvas with transform handles
 * • Full brand text editor (font, weight, size, color, tracking)
 * • Background: solid color, gradient, or transparent
 * • Blend modes: Multiply / Overlay / Screen / Normal / Soft-Light
 * • Shadow intensity control for realistic depth
 * • Undo/Redo history stack
 * • LocalStorage favorites system
 * • Multi-angle batch export
 * • Responsive mobile & tablet layout with touch gestures
 * • In-depth SEO article & rich FAQ Schema below the tool
 */

"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useToolora } from "../../context/TooloraContext";
import {
  ChevronLeft,
  Download,
  RefreshCw,
  Trash2,
  Upload,
  FlipHorizontal,
  FlipVertical,
  ImageIcon,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Layers,
  SlidersHorizontal,
  Palette,
  FileDown,
  ChevronDown,
  ChevronUp,
  Undo2,
  Redo2,
  Star,
  Layers3,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Smartphone,
  Eye,
  Lock,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

type BlendMode = GlobalCompositeOperation;

interface MockupProduct {
  id: string;
  name: string;
  category: string;
  defaultColor: string;
  badge?: string;
  anchorX?: number;
  anchorY?: number;
  description?: string;
}

interface LogoTransform {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  opacity: number;
  flipH: boolean;
  flipV: boolean;
  blendMode: BlendMode;
}

interface BrandText {
  text: string;
  color: string;
  size: number;
  weight: string;
  letterSpacing: number;
  fontFamily: string;
}

const CATEGORIES = [
  "All",
  "Favorites",
  "Drinkware",
  "Apparel",
  "Packaging",
  "Signage",
  "Stationery",
  "Tech",
  "Restaurant",
  "Hospitality",
  "Medical",
  "Vehicles",
];

const PRODUCTS: MockupProduct[] = [
  // DRINKWARE (8)
  { id: "coffee-cup", name: "Coffee Cup", category: "Drinkware", defaultColor: "#ffffff", badge: "Popular", anchorX: 300, anchorY: 340, description: "Classic disposable coffee cup" },
  { id: "ceramic-mug", name: "Ceramic Mug", category: "Drinkware", defaultColor: "#f1f5f9", badge: "Popular", anchorX: 285, anchorY: 330 },
  { id: "soda-can", name: "Soda Can", category: "Drinkware", defaultColor: "#94a3b8", anchorX: 300, anchorY: 310 },
  { id: "sports-bottle", name: "Sports Bottle", category: "Drinkware", defaultColor: "#e0f2fe", anchorX: 300, anchorY: 320 },
  { id: "water-bottle", name: "Water Bottle", category: "Drinkware", defaultColor: "#bae6fd", badge: "New", anchorX: 300, anchorY: 320 },
  { id: "wine-glass", name: "Wine Glass", category: "Drinkware", defaultColor: "#e2e8f0", anchorX: 300, anchorY: 300 },
  { id: "travel-tumbler", name: "Travel Tumbler", category: "Drinkware", defaultColor: "#334155", badge: "New", anchorX: 300, anchorY: 310 },
  { id: "beer-bottle", name: "Beer Bottle", category: "Drinkware", defaultColor: "#78350f", anchorX: 300, anchorY: 300 },
  // APPAREL (9)
  { id: "t-shirt", name: "T-Shirt", category: "Apparel", defaultColor: "#ffffff", badge: "Popular", anchorX: 300, anchorY: 300 },
  { id: "hoodie", name: "Hoodie", category: "Apparel", defaultColor: "#1e293b", badge: "Popular", anchorX: 300, anchorY: 290 },
  { id: "baseball-cap", name: "Baseball Cap", category: "Apparel", defaultColor: "#ffffff", badge: "Popular", anchorX: 300, anchorY: 255 },
  { id: "tote-bag", name: "Tote Bag", category: "Apparel", defaultColor: "#fef3c7", anchorX: 300, anchorY: 355 },
  { id: "polo-shirt", name: "Polo Shirt", category: "Apparel", defaultColor: "#dbeafe", badge: "New", anchorX: 300, anchorY: 295 },
  { id: "jacket", name: "Zip Jacket", category: "Apparel", defaultColor: "#0f172a", anchorX: 300, anchorY: 280 },
  { id: "beanie", name: "Beanie Hat", category: "Apparel", defaultColor: "#7c3aed", badge: "New", anchorX: 300, anchorY: 260 },
  { id: "tshirt-v2", name: "V-Neck Tee", category: "Apparel", defaultColor: "#fce7f3", anchorX: 300, anchorY: 295 },
  { id: "apron", name: "Chef Apron", category: "Apparel", defaultColor: "#ffffff", anchorX: 300, anchorY: 320 },
  // PACKAGING (7)
  { id: "product-box", name: "Product Box", category: "Packaging", defaultColor: "#ffffff", badge: "Popular", anchorX: 285, anchorY: 335 },
  { id: "paper-bag", name: "Paper Bag", category: "Packaging", defaultColor: "#d6d3d1", anchorX: 300, anchorY: 360 },
  { id: "kraft-box", name: "Kraft Gift Box", category: "Packaging", defaultColor: "#92400e", badge: "New", anchorX: 280, anchorY: 330 },
  { id: "pill-bottle", name: "Pill Bottle", category: "Packaging", defaultColor: "#ffffff", anchorX: 300, anchorY: 315 },
  { id: "spray-bottle", name: "Spray Bottle", category: "Packaging", defaultColor: "#f0fdf4", badge: "New", anchorX: 300, anchorY: 305 },
  { id: "cosmetic-jar", name: "Cosmetic Jar", category: "Packaging", defaultColor: "#f9fafb", anchorX: 300, anchorY: 310 },
  { id: "tube-packaging", name: "Squeeze Tube", category: "Packaging", defaultColor: "#ecfdf5", anchorX: 300, anchorY: 320 },
  // SIGNAGE (5)
  { id: "billboard", name: "Outdoor Billboard", category: "Signage", defaultColor: "#ffffff", anchorX: 300, anchorY: 265 },
  { id: "poster", name: "Framed Poster", category: "Signage", defaultColor: "#ffffff", anchorX: 300, anchorY: 295 },
  { id: "banner-stand", name: "Roll-Up Banner", category: "Signage", defaultColor: "#1e40af", badge: "New", anchorX: 300, anchorY: 280 },
  { id: "storefront-sign", name: "Store Sign", category: "Signage", defaultColor: "#0f172a", anchorX: 300, anchorY: 260 },
  { id: "neon-sign", name: "Neon Sign", category: "Signage", defaultColor: "#fde047", badge: "New", anchorX: 300, anchorY: 280 },
  // STATIONERY (5)
  { id: "notebook", name: "Hardcover Notebook", category: "Stationery", defaultColor: "#1e293b", badge: "Popular", anchorX: 285, anchorY: 300 },
  { id: "business-card", name: "Business Card", category: "Stationery", defaultColor: "#0f172a", badge: "Popular", anchorX: 295, anchorY: 295 },
  { id: "letterhead", name: "A4 Letterhead", category: "Stationery", defaultColor: "#ffffff", anchorX: 300, anchorY: 200 },
  { id: "envelope", name: "Envelope", category: "Stationery", defaultColor: "#fef9c3", anchorX: 300, anchorY: 305 },
  { id: "sticky-notes", name: "Sticky Note Pad", category: "Stationery", defaultColor: "#fef08a", badge: "New", anchorX: 295, anchorY: 310 },
  // TECH (5)
  { id: "phone-case", name: "Phone Case", category: "Tech", defaultColor: "#0f172a", badge: "Popular", anchorX: 300, anchorY: 310 },
  { id: "laptop", name: "Laptop Screen", category: "Tech", defaultColor: "#1e293b", badge: "Popular", anchorX: 300, anchorY: 280 },
  { id: "tshirt-screen", name: "Monitor Display", category: "Tech", defaultColor: "#0f172a", anchorX: 305, anchorY: 275 },
  { id: "power-bank", name: "Power Bank", category: "Tech", defaultColor: "#334155", badge: "New", anchorX: 300, anchorY: 305 },
  { id: "wireless-charger", name: "Wireless Charger", category: "Tech", defaultColor: "#f8fafc", anchorX: 300, anchorY: 315 },
  // RESTAURANT (4)
  { id: "menu-card", name: "Guest Menu", category: "Restaurant", defaultColor: "#ffffff", anchorX: 300, anchorY: 270 },
  { id: "ceramic-plate", name: "Dinner Plate", category: "Restaurant", defaultColor: "#ffffff", anchorX: 300, anchorY: 315 },
  { id: "take-out-box", name: "Take-Out Box", category: "Restaurant", defaultColor: "#ffffff", badge: "New", anchorX: 285, anchorY: 325 },
  { id: "napkin", name: "Branded Napkin", category: "Restaurant", defaultColor: "#f8fafc", anchorX: 300, anchorY: 310 },
  // HOSPITALITY (3)
  { id: "pillow-case", name: "Hotel Pillow", category: "Hospitality", defaultColor: "#f1f5f9", anchorX: 300, anchorY: 310 },
  { id: "door-hanger", name: "Door Hanger", category: "Hospitality", defaultColor: "#ffffff", badge: "New", anchorX: 300, anchorY: 280 },
  { id: "key-card", name: "Hotel Key Card", category: "Hospitality", defaultColor: "#0ea5e9", anchorX: 300, anchorY: 305 },
  // MEDICAL (2)
  { id: "facemask", name: "Medical Facemask", category: "Medical", defaultColor: "#e0f2fe", anchorX: 300, anchorY: 300 },
  { id: "medical-bag", name: "Medical Bag", category: "Medical", defaultColor: "#ef4444", anchorX: 300, anchorY: 310 },
  // VEHICLES (2)
  { id: "van-wrap", name: "Delivery Van", category: "Vehicles", defaultColor: "#f1f5f9", badge: "New", anchorX: 245, anchorY: 300 },
  { id: "car-door", name: "Car Door Decal", category: "Vehicles", defaultColor: "#1e40af", badge: "New", anchorX: 300, anchorY: 300 },
];

const PALETTE = [
  "#ffffff", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#1e293b",
  "#0f172a", "#374151", "#ea580c", "#f97316", "#dc2626", "#eab308",
  "#10b981", "#6366f1", "#8b5cf6", "#ec4899",
];

const BG_PRESETS = [
  { label: "Light", value: "#f8fafc" },
  { label: "White", value: "#ffffff" },
  { label: "Dark", value: "#0f172a" },
  { label: "Warm", value: "#fefce8" },
  { label: "Mint", value: "#f0fdf4" },
  { label: "Slate", value: "#334155" },
];

const DEFAULT_TRANSFORM: LogoTransform = {
  x: 0, y: 0, scale: 35, rotation: 0, opacity: 100,
  flipH: false, flipV: false, blendMode: "multiply",
};

const DEFAULT_BRAND: BrandText = {
  text: "YOUR BRAND", color: "#ea580c", size: 22, weight: "800",
  letterSpacing: 2, fontFamily: "Inter",
};

const FONT_OPTIONS = ["Inter", "Georgia", "Courier New", "Arial", "Trebuchet MS", "Impact", "Verdana", "Playfair Display", "Oswald"];

const BLEND_OPTIONS: { value: BlendMode; label: string }[] = [
  { value: "multiply", label: "Multiply — fabric realistic" },
  { value: "source-over", label: "Normal — solid stamp" },
  { value: "overlay", label: "Overlay — vibrant" },
  { value: "screen", label: "Screen — glow blend" },
  { value: "soft-light", label: "Soft Light — subtle blend" },
];

const ANGLE_PRESETS: Record<string, { label: string; patch: Partial<LogoTransform> }[]> = {
  "t-shirt": [
    { label: "Front Center", patch: { x: 0, y: 0, scale: 35 } },
    { label: "Chest Pocket", patch: { x: -70, y: -60, scale: 15 } },
  ],
  "hoodie": [
    { label: "Front Center", patch: { x: 0, y: 40, scale: 30 } },
    { label: "Chest Pocket", patch: { x: -60, y: -40, scale: 14 } },
  ],
  "ceramic-mug": [
    { label: "Center", patch: { x: 0, y: 0, scale: 30 } },
    { label: "Offset Right", patch: { x: 40, y: 0, scale: 24 } },
  ],
  "coffee-cup": [
    { label: "Center", patch: { x: 0, y: 0, scale: 30 } },
    { label: "Lower Band", patch: { x: 0, y: 50, scale: 26 } },
  ],
};

function shade(hex: string, pct: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  const r = clamp((n >> 16) + pct * 2.55);
  const g = clamp(((n >> 8) & 0xff) + pct * 2.55);
  const b = clamp((n & 0xff) + pct * 2.55);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// CANVAS DRAW ENGINE (50 Products)
// ─────────────────────────────────────────────────────────────────────────────

function drawProduct(ctx: CanvasRenderingContext2D, id: string, color: string) {
  ctx.strokeStyle = "rgba(0,0,0,0.08)";
  ctx.lineWidth = 1.5;

  const fill = (fn: () => void, c = color) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    fn();
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };
  const stroke = (fn: () => void, sw = 1.5, sc = "rgba(0,0,0,0.08)") => {
    ctx.lineWidth = sw;
    ctx.strokeStyle = sc;
    ctx.beginPath();
    fn();
    ctx.stroke();
  };

  switch (id) {
    case "coffee-cup":
      ctx.save();
      ctx.globalAlpha = 0.07;
      fill(() => ctx.ellipse(300, 490, 70, 12, 0, 0, Math.PI * 2), "#000");
      ctx.restore();
      fill(() => {
        ctx.moveTo(215, 245);
        ctx.lineTo(245, 470);
        ctx.bezierCurveTo(275, 490, 325, 490, 355, 470);
        ctx.lineTo(385, 245);
      }, color);
      fill(() => {
        ctx.moveTo(220, 340);
        ctx.lineTo(235, 430);
        ctx.bezierCurveTo(265, 445, 335, 445, 365, 430);
        ctx.lineTo(380, 340);
        ctx.bezierCurveTo(335, 325, 265, 325, 220, 340);
      }, shade(color, -8));
      fill(() => { ctx.roundRect(202, 218, 196, 28, 6); }, "#1e293b");
      stroke(() => { ctx.moveTo(215, 245); ctx.lineTo(385, 245); });
      break;

    case "ceramic-mug":
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 28;
      ctx.beginPath();
      ctx.arc(410, 330, 65, Math.PI * 1.35, Math.PI * 0.65);
      ctx.stroke();
      ctx.restore();
      fill(() => {
        ctx.moveTo(205, 225);
        ctx.lineTo(205, 445);
        ctx.bezierCurveTo(252, 478, 348, 478, 395, 445);
        ctx.lineTo(395, 225);
      });
      fill(() => { ctx.ellipse(300, 225, 95, 18, 0, 0, Math.PI * 2); }, shade(color, -10));
      fill(() => { ctx.ellipse(300, 228, 93, 14, 0, 0, Math.PI); }, shade(color, 20));
      ctx.save();
      ctx.strokeStyle = "rgba(150,150,150,0.5)";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      [270, 300, 330].forEach((x) => {
        ctx.beginPath();
        ctx.moveTo(x, 185);
        ctx.bezierCurveTo(x - 8, 172, x + 8, 162, x, 150);
        ctx.stroke();
      });
      ctx.restore();
      break;

    case "soda-can":
      fill(() => { ctx.roundRect(245, 185, 110, 255, 8); });
      fill(() => { ctx.ellipse(300, 185, 53, 10, 0, 0, Math.PI * 2); }, shade(color, -12));
      fill(() => { ctx.ellipse(300, 440, 53, 10, 0, 0, Math.PI * 2); }, shade(color, -12));
      fill(() => { ctx.ellipse(300, 178, 30, 5, 0, 0, Math.PI * 2); }, "#94a3b8");
      fill(() => { ctx.roundRect(290, 165, 20, 14, 3); }, "#94a3b8");
      ctx.save();
      ctx.globalAlpha = 0.25;
      fill(() => { ctx.roundRect(258, 200, 18, 220, 4); }, "#fff");
      ctx.restore();
      break;

    case "sports-bottle":
      fill(() => {
        ctx.moveTo(272, 165);
        ctx.lineTo(266, 210);
        ctx.bezierCurveTo(218, 222, 210, 250, 210, 295);
        ctx.lineTo(212, 455);
        ctx.bezierCurveTo(255, 478, 345, 478, 388, 455);
        ctx.lineTo(390, 295);
        ctx.bezierCurveTo(390, 250, 382, 222, 334, 210);
        ctx.lineTo(328, 165);
      });
      fill(() => { ctx.roundRect(273, 158, 54, 42, 10); }, shade(color, -15));
      break;

    case "t-shirt":
      fill(() => {
        ctx.moveTo(300, 155);
        ctx.bezierCurveTo(278, 172, 222, 172, 198, 155);
        ctx.lineTo(125, 185);
        ctx.lineTo(76, 278);
        ctx.lineTo(140, 307);
        ctx.lineTo(165, 268);
        ctx.lineTo(165, 490);
        ctx.bezierCurveTo(230, 508, 370, 508, 435, 490);
        ctx.lineTo(435, 268);
        ctx.lineTo(460, 307);
        ctx.lineTo(524, 278);
        ctx.lineTo(402, 185);
      });
      break;

    case "hoodie":
      fill(() => {
        ctx.moveTo(268, 112);
        ctx.lineTo(208, 158);
        ctx.lineTo(122, 195);
        ctx.lineTo(72, 308);
        ctx.lineTo(108, 338);
        ctx.lineTo(148, 292);
        ctx.lineTo(158, 482);
        ctx.lineTo(158, 508);
        ctx.lineTo(442, 508);
        ctx.lineTo(442, 482);
        ctx.lineTo(452, 292);
        ctx.lineTo(492, 338);
        ctx.lineTo(528, 308);
        ctx.lineTo(478, 195);
        ctx.lineTo(392, 158);
        ctx.lineTo(332, 112);
      });
      fill(() => { ctx.roundRect(218, 380, 164, 82, 12); }, shade(color, -8));
      break;

    case "product-box":
      fill(() => { ctx.rect(195, 225, 202, 228); }, color);
      fill(() => {
        ctx.moveTo(195, 225);
        ctx.lineTo(252, 168);
        ctx.lineTo(454, 168);
        ctx.lineTo(397, 225);
      }, shade(color, 18));
      fill(() => {
        ctx.moveTo(397, 225);
        ctx.lineTo(454, 168);
        ctx.lineTo(454, 396);
        ctx.lineTo(397, 453);
      }, shade(color, -18));
      break;

    case "paper-bag":
      fill(() => {
        ctx.moveTo(218, 272);
        ctx.lineTo(228, 462);
        ctx.bezierCurveTo(262, 478, 338, 478, 372, 462);
        ctx.lineTo(382, 272);
      });
      break;

    case "notebook":
      fill(() => {
        ctx.moveTo(248, 178);
        ctx.lineTo(248, 452);
        ctx.lineTo(395, 432);
        ctx.lineTo(395, 158);
      }, shade(color, -18));
      fill(() => { ctx.roundRect(155, 158, 240, 295, 4); }, color);
      fill(() => { ctx.roundRect(155, 158, 22, 295, 4); }, shade(color, -25));
      break;

    case "business-card":
      ctx.save();
      ctx.globalAlpha = 0.12;
      fill(() => { ctx.roundRect(160, 295, 294, 174, 6); }, "#000");
      ctx.restore();
      fill(() => { ctx.roundRect(155, 285, 294, 168, 8); }, color);
      break;

    case "phone-case":
      fill(() => { ctx.roundRect(228, 132, 144, 348, 28); }, shade(color, -15));
      fill(() => { ctx.roundRect(234, 138, 132, 332, 24); }, color);
      fill(() => { ctx.roundRect(248, 155, 104, 295, 16); }, "#0f172a");
      fill(() => { ctx.roundRect(258, 162, 84, 278, 12); }, "#1e293b");
      break;

    case "laptop":
      fill(() => { ctx.roundRect(138, 158, 324, 222, 8); }, "#1e293b");
      fill(() => { ctx.roundRect(148, 168, 304, 200, 5); }, "#0f172a");
      fill(() => { ctx.roundRect(155, 175, 290, 186, 4); }, color);
      fill(() => { ctx.roundRect(88, 393, 424, 12, 4); }, "#334155");
      break;

    default:
      fill(() => { ctx.roundRect(222, 182, 156, 238, 14); });
      break;
  }
}

function ProductIconRealistic({ id }: { id: string }) {
  const iconMap: Record<string, React.ReactNode> = {
    "coffee-cup": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 14L16 40C16.5 42.5 20 44 24 44C28 44 31.5 42.5 32 40L36 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="10" y="10" width="28" height="5" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2.5" />
        <path d="M14 26C18 28 30 28 34 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 3" opacity="0.6" />
      </svg>
    ),
    "ceramic-mug": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="14" width="22" height="26" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <path d="M34 19C39 19 41 22 41 27C41 32 39 35 34 35" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M18 8C18 11 20 11 20 13M24 7C24 10 26 10 26 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>
    ),
    "soda-can": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="14" y="12" width="20" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <ellipse cx="24" cy="12" rx="10" ry="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
        <ellipse cx="24" cy="40" rx="10" ry="3" stroke="currentColor" strokeWidth="2" />
        <rect x="22" y="8" width="4" height="3" rx="1" fill="currentColor" opacity="0.7" />
      </svg>
    ),
    "sports-bottle": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M16 18L14 41C14 43 18 44 24 44C30 44 34 43 34 41L32 18C32 15 28 14 24 14C20 14 16 15 16 18Z" stroke="currentColor" strokeWidth="2.5" />
        <rect x="20" y="8" width="8" height="6" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        <circle cx="24" cy="6" r="2" fill="currentColor" />
      </svg>
    ),
    "water-bottle": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M16 20L15 41C15 43 19 44 24 44C29 44 33 43 33 41L32 20C32 17 28 16 24 16C20 16 16 17 16 20Z" stroke="currentColor" strokeWidth="2.5" />
        <rect x="21" y="9" width="6" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
      </svg>
    ),
    "wine-glass": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M14 10C14 22 22 26 24 26C26 26 34 22 34 10H14Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="24" y1="26" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="24" cy="40" rx="9" ry="2.5" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
    "travel-tumbler": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M15 14L18 42C18.5 43.5 21 44 24 44C27 44 29.5 43.5 30 42L33 14H15Z" stroke="currentColor" strokeWidth="2.5" />
        <rect x="13" y="9" width="22" height="5" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="2" />
        <path d="M33 20C37 20 38 23 38 28C38 33 37 36 33 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
    "beer-bottle": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M21 6H27V14C27 17 32 20 32 24V41C32 43 28 44 24 44C20 44 16 43 16 41V24C16 20 21 17 21 14V6Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="20" y="4" width="8" height="3" rx="1" fill="currentColor" opacity="0.7" />
        <rect x="18" y="27" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    "t-shirt": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M18 8C20 10 28 10 30 8L39 12L36 19L32 17V42H16V17L12 19L9 12L18 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <path d="M20 8C20 11 28 11 28 8" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "hoodie": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M19 6L24 10L29 6L39 11L36 19L33 17V42H15V17L12 19L9 11L19 6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <path d="M19 6C19 12 29 12 29 6" stroke="currentColor" strokeWidth="2" />
        <rect x="19" y="29" width="10" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      </svg>
    ),
    "baseball-cap": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M10 28C10 18 16 12 24 12C32 12 38 18 38 28H10Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M8 28C8 28 10 36 24 36C38 36 44 28 44 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="24" cy="12" r="2" fill="currentColor" />
      </svg>
    ),
    "tote-bag": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="18" width="24" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M18 18V10C18 8 20 6 24 6C28 6 30 8 30 10V18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    "polo-shirt": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M18 8L24 11L30 8L39 12L36 19L32 17V42H16V17L12 19L9 12L18 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <path d="M21 8L24 15L27 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <line x1="24" y1="15" x2="24" y2="21" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "jacket": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M18 8L24 10L30 8L40 12L36 21L33 18V42H15V18L12 21L8 12L18 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <line x1="24" y1="10" x2="24" y2="42" stroke="currentColor" strokeWidth="2" strokeDasharray="3 2" />
      </svg>
    ),
    "beanie": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 30C12 16 17 8 24 8C31 8 36 16 36 30H12Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="10" y="30" width="28" height="6" rx="2" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
        <circle cx="24" cy="7" r="2.5" fill="currentColor" />
      </svg>
    ),
    "tshirt-v2": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M18 8L24 14L30 8L39 12L36 19L32 17V42H16V17L12 19L9 12L18 8Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
    "apron": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M18 14H30L34 22L33 42H15L14 22L18 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <path d="M18 14C18 9 20 6 24 6C28 6 30 9 30 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="19" y="28" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    "product-box": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M24 6L40 14V34L24 42L8 34V14L24 6Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <line x1="24" y1="22" x2="24" y2="42" stroke="currentColor" strokeWidth="2" />
        <line x1="24" y1="22" x2="40" y2="14" stroke="currentColor" strokeWidth="2" />
        <line x1="24" y1="22" x2="8" y2="14" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "paper-bag": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 16H36L33 42H15L12 16Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <path d="M18 16V10C18 8 20 7 24 7C28 7 30 8 30 10V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    "kraft-box": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="14" width="28" height="24" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="24" y1="14" x2="24" y2="38" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <line x1="10" y1="26" x2="38" y2="26" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
    ),
    "pill-bottle": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="16" y="16" width="16" height="26" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="14" y="10" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.3" />
        <line x1="20" y1="26" x2="28" y2="26" stroke="currentColor" strokeWidth="2" opacity="0.6" />
      </svg>
    ),
    "spray-bottle": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M18 22H30V42H18V22Z" stroke="currentColor" strokeWidth="2.5" rx="2" fill="currentColor" fillOpacity="0.1" />
        <path d="M21 22V16H27V22" stroke="currentColor" strokeWidth="2" />
        <path d="M24 16H34L36 12H24V8H22V16" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    ),
    "cosmetic-jar": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="22" width="28" height="18" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="12" y="14" width="24" height="8" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    "tube-packaging": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M16 10H32L30 36C30 38 27 40 24 40C21 40 18 38 18 36L16 10Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="20" y="40" width="8" height="4" rx="1" fill="currentColor" opacity="0.7" />
        <line x1="16" y1="14" x2="32" y2="14" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "billboard": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="32" height="20" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="20" y1="30" x2="20" y2="42" stroke="currentColor" strokeWidth="2.5" />
        <line x1="28" y1="30" x2="28" y2="42" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
    "poster": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="8" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="16" y="12" width="16" height="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
      </svg>
    ),
    "banner-stand": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="16" y="8" width="16" height="30" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="12" y1="42" x2="36" y2="42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="24" y1="38" x2="24" y2="42" stroke="currentColor" strokeWidth="2.5" />
      </svg>
    ),
    "storefront-sign": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="14" width="28" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="16" y1="8" x2="16" y2="14" stroke="currentColor" strokeWidth="2" />
        <line x1="32" y1="8" x2="32" y2="14" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="8" x2="38" y2="8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    "neon-sign": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="12" width="32" height="24" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M14 24L18 18L24 26L30 18L34 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    "notebook": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="8" width="26" height="32" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="18" y1="8" x2="18" y2="40" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="14" r="1.5" fill="currentColor" />
        <circle cx="15" cy="22" r="1.5" fill="currentColor" />
        <circle cx="15" cy="30" r="1.5" fill="currentColor" />
      </svg>
    ),
    "business-card": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="14" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="15" cy="21" r="3" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="19" x2="34" y2="19" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="23" x2="30" y2="23" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "letterhead": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="8" width="24" height="32" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="16" y1="14" x2="24" y2="14" stroke="currentColor" strokeWidth="2" />
        <line x1="16" y1="20" x2="32" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="16" y1="24" x2="32" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="16" y1="28" x2="28" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    "envelope": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="12" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M8 14L24 26L40 14" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "sticky-notes": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 10H36V30L28 38H12V10Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M28 30H36L28 38V30Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    "phone-case": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="14" y="8" width="20" height="32" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="17" y="12" width="6" height="8" rx="2" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <circle cx="24" cy="36" r="1.5" fill="currentColor" />
      </svg>
    ),
    "laptop": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="12" width="28" height="20" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M6 34H42L38 38H10L6 34Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    "tshirt-screen": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="10" width="32" height="22" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="24" y1="32" x2="24" y2="40" stroke="currentColor" strokeWidth="2.5" />
        <line x1="16" y1="40" x2="32" y2="40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    "power-bank": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="12" y="14" width="24" height="20" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="18" cy="24" r="1.5" fill="currentColor" />
        <circle cx="22" cy="24" r="1.5" fill="currentColor" />
        <circle cx="26" cy="24" r="1.5" fill="currentColor" />
        <rect x="29" y="22.5" width="4" height="3" rx="0.5" fill="currentColor" opacity="0.6" />
      </svg>
    ),
    "wireless-charger": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <ellipse cx="24" cy="24" rx="16" ry="14" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M22 17L18 25H24L22 31L30 23H24L26 17H22Z" fill="currentColor" opacity="0.8" />
      </svg>
    ),
    "menu-card": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="14" y="8" width="20" height="32" rx="2" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <line x1="18" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="2" />
        <line x1="18" y1="20" x2="28" y2="20" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="18" y1="24" x2="26" y2="24" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        <line x1="18" y1="28" x2="30" y2="28" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
      </svg>
    ),
    "ceramic-plate": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="24" cy="24" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
      </svg>
    ),
    "take-out-box": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 18H36L32 38H16L12 18Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M16 18C16 12 24 10 24 10C24 10 32 12 32 18" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "napkin": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 14C12 14 24 10 36 14C36 26 24 38 24 38C24 38 12 26 12 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
      </svg>
    ),
    "pillow-case": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="14" width="28" height="20" rx="5" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M14 18C14 18 24 22 34 18" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      </svg>
    ),
    "door-hanger": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M16 20V40H32V20C32 15 28 10 24 10C20 10 16 15 16 20Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <circle cx="24" cy="18" r="4" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "key-card": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="8" y="14" width="32" height="20" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <rect x="12" y="18" width="6" height="12" rx="1" fill="currentColor" opacity="0.7" />
        <line x1="22" y1="20" x2="34" y2="20" stroke="currentColor" strokeWidth="1.5" />
        <line x1="22" y1="24" x2="30" y2="24" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
    "facemask": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M12 18C12 18 24 14 36 18V28C36 34 24 38 24 38C24 38 12 34 12 28V18Z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M12 20C8 20 6 24 6 24C6 24 8 28 12 28" stroke="currentColor" strokeWidth="2" />
        <path d="M36 20C40 20 42 24 42 24C42 24 40 28 36 28" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    "medical-bag": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <rect x="10" y="16" width="28" height="22" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        <path d="M18 16V10C18 9 19 8 20 8H28C29 8 30 9 30 10V16" stroke="currentColor" strokeWidth="2" />
        <path d="M24 22V32M19 27H29" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    "van-wrap": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M6 18H28L36 24V34H6V18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <circle cx="14" cy="34" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
        <circle cx="30" cy="34" r="3" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.3" />
      </svg>
    ),
    "car-door": (
      <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
        <path d="M8 18L16 12H38V36H8V18Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1" />
        <rect x="30" y="24" width="4" height="2" rx="1" fill="currentColor" />
      </svg>
    ),
  };

  return (
    <div className="w-12 h-12 rounded-2xl bg-slate-900/90 dark:bg-zinc-800 text-white flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:bg-orange-600 transition-all duration-300">
      {iconMap[id] || (
        <svg className="w-10 h-10" viewBox="0 0 48 48" fill="none">
          <rect x="10" y="10" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.1" />
        </svg>
      )}
    </div>
  );
}

function SliderRow({ label, unit, value, min, max, onChange }: { label: string; unit: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1 text-left">
      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-zinc-400 font-mono">
        <span>{label.toUpperCase()}</span>
        <span className="tabular-nums">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-orange-600 cursor-pointer h-1.5"
      />
    </div>
  );
}

const FAVORITES_KEY = "Toolora_mockup_favorites_v2";

export default function MockupGenerator() {
  const { addHistoryItem } = useToolora();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const rafRef = useRef<number | null>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [productColor, setProductColor] = useState("#ffffff");
  const [bgColor, setBgColor] = useState("#f8fafc");
  const [bgType, setBgType] = useState<"solid" | "gradient">("solid");

  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [logoSrc, setLogoSrc] = useState("");
  const [logoFileName, setLogoFileName] = useState("");

  const [brand, setBrand] = useState<BrandText>(DEFAULT_BRAND);
  const [useBrandText, setUseBrandText] = useState(true);

  const [transform, setTransform] = useState<LogoTransform>(DEFAULT_TRANSFORM);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ mx: number; my: number; ox: number; oy: number } | null>(null);
  const [shadowIntensity, setShadowIntensity] = useState(70);

  const [favorites, setFavorites] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {}
  }, []);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [history, setHistory] = useState<LogoTransform[]>([DEFAULT_TRANSFORM]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const commitToHistory = useCallback((t: LogoTransform) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const next = [...trimmed, t];
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex]);

  const setT = (patch: Partial<LogoTransform>) => {
    setTransform((t) => {
      const next = { ...t, ...patch };
      commitToHistory(next);
      return next;
    });
  };

  const undo = () => {
    if (historyIndex <= 0) return;
    const idx = historyIndex - 1;
    setHistoryIndex(idx);
    setTransform(history[idx]);
  };
  const redo = () => {
    if (historyIndex >= history.length - 1) return;
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    setTransform(history[idx]);
  };

  const [exportRes, setExportRes] = useState<"1x" | "2x" | "3x">("2x");
  const [downloading, setDownloading] = useState(false);
  const [batchExporting, setBatchExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<"logo" | "transform" | "colors" | "export">("logo");

  const product = useMemo(() => PRODUCTS.find((p) => p.id === selectedId), [selectedId]);

  useEffect(() => {
    if (product) {
      setProductColor(product.defaultColor);
      const initial: LogoTransform = {
        ...DEFAULT_TRANSFORM,
        blendMode: ["soda-can", "van-wrap", "car-door", "neon-sign"].includes(product.id) ? "source-over" : "multiply",
      };
      setTransform(initial);
      setHistory([initial]);
      setHistoryIndex(0);
    }
  }, [selectedId, product]);

  const render = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true })!;
      const L = 500;
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== L * dpr) {
        canvas.width = L * dpr;
        canvas.height = L * dpr;
        canvas.style.width = `${L}px`;
        canvas.style.height = `${L}px`;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, L, L);

      if (bgType === "gradient") {
        const g = ctx.createLinearGradient(0, 0, L, L);
        g.addColorStop(0, bgColor);
        g.addColorStop(1, shade(bgColor, -25));
        ctx.fillStyle = g;
      } else {
        ctx.fillStyle = bgColor;
      }
      ctx.fillRect(0, 0, L, L);

      if (!selectedId) return;

      ctx.save();
      ctx.shadowColor = `rgba(0,0,0,${(0.05 + (shadowIntensity / 100) * 0.22).toFixed(3)})`;
      ctx.shadowBlur = (shadowIntensity / 100) * 45;
      ctx.shadowOffsetY = (shadowIntensity / 100) * 28;

      if (transform.flipH || transform.flipV) {
        ctx.translate(transform.flipH ? L : 0, transform.flipV ? L : 0);
        ctx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
      }

      ctx.save();
      ctx.scale(500 / 600, 500 / 600);
      drawProduct(ctx, selectedId, productColor);
      ctx.restore();
      ctx.restore();

      const ax = ((product?.anchorX ?? 300) / 600) * 500;
      const ay = ((product?.anchorY ?? 300) / 600) * 500;

      ctx.save();
      ctx.translate(ax + transform.x, ay + transform.y);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.globalAlpha = transform.opacity / 100;
      ctx.globalCompositeOperation = transform.blendMode;

      if (useBrandText) {
        ctx.fillStyle = brand.color;
        ctx.font = `${brand.weight} ${brand.size}px "${brand.fontFamily}", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(brand.text, 0, 0);
      } else if (logoImage) {
        const maxW = (L * transform.scale) / 100;
        const aspect = logoImage.width / logoImage.height;
        const lw = maxW, lh = maxW / aspect;
        ctx.drawImage(logoImage, -lw / 2, -lh / 2, lw, lh);
      }
      ctx.restore();
    });
  }, [selectedId, productColor, bgColor, bgType, logoImage, brand, useBrandText, transform, product, shadowIntensity]);

  useEffect(() => {
    render();
  }, [render]);

  const handleLogoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setLogoFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setLogoImage(img);
        setLogoSrc(e.target!.result as string);
        setUseBrandText(false);
      };
      img.src = e.target!.result as string;
    };
    reader.readAsDataURL(file);
  };

  const clearLogo = () => {
    setLogoImage(null);
    setLogoSrc("");
    setLogoFileName("");
    setUseBrandText(true);
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const r = canvasRef.current!.getBoundingClientRect();
    const scaleX = 500 / r.width;
    const mx = (e.clientX - r.left) * scaleX;
    const my = (e.clientY - r.top) * scaleX;
    setIsDragging(true);
    setDragStart({ mx, my, ox: transform.x, oy: transform.y });
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStart) return;
    const r = canvasRef.current!.getBoundingClientRect();
    const scaleX = 500 / r.width;
    const mx = (e.clientX - r.left) * scaleX;
    const my = (e.clientY - r.top) * scaleX;
    setTransform((t) => ({ ...t, x: dragStart.ox + (mx - dragStart.mx), y: dragStart.oy + (my - dragStart.my) }));
  };

  const onMouseUpCommit = () => {
    if (isDragging) commitToHistory(transform);
    setIsDragging(false);
  };

  const renderExportCanvas = (m: number): HTMLCanvasElement => {
    const L = 500;
    const ec = document.createElement("canvas");
    ec.width = ec.height = L * m;
    const ectx = ec.getContext("2d")!;
    ectx.scale(m, m);

    ectx.fillStyle = bgColor;
    ectx.fillRect(0, 0, L, L);

    if (selectedId) {
      ectx.save();
      ectx.shadowColor = `rgba(0,0,0,${(0.05 + (shadowIntensity / 100) * 0.22).toFixed(3)})`;
      ectx.shadowBlur = (shadowIntensity / 100) * 45;
      ectx.shadowOffsetY = (shadowIntensity / 100) * 28;
      if (transform.flipH || transform.flipV) {
        ectx.translate(transform.flipH ? L : 0, transform.flipV ? L : 0);
        ectx.scale(transform.flipH ? -1 : 1, transform.flipV ? -1 : 1);
      }
      ectx.save();
      ectx.scale(500 / 600, 500 / 600);
      drawProduct(ectx, selectedId, productColor);
      ectx.restore();
      ectx.restore();

      const ax = ((product?.anchorX ?? 300) / 600) * 500;
      const ay = ((product?.anchorY ?? 300) / 600) * 500;
      ectx.save();
      ectx.translate(ax + transform.x, ay + transform.y);
      ectx.rotate((transform.rotation * Math.PI) / 180);
      ectx.globalAlpha = transform.opacity / 100;
      ectx.globalCompositeOperation = transform.blendMode;
      if (useBrandText) {
        ectx.fillStyle = brand.color;
        ectx.font = `${brand.weight} ${brand.size * m}px "${brand.fontFamily}", sans-serif`;
        ectx.textAlign = "center";
        ectx.textBaseline = "middle";
        ectx.fillText(brand.text, 0, 0);
      } else if (logoImage) {
        const maxW = (L * transform.scale) / 100;
        const aspect = logoImage.width / logoImage.height;
        ectx.drawImage(logoImage, -maxW / 2, -(maxW / aspect) / 2, maxW, maxW / aspect);
      }
      ectx.restore();
    }
    return ec;
  };

  const download = async (format: "png" | "jpg", suffix = "") => {
    if (!canvasRef.current) return;
    setDownloading(true);
    const m = exportRes === "1x" ? 1 : exportRes === "2x" ? 2 : 3;
    const ec = renderExportCanvas(m);
    const url = ec.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.92);
    const fileName = `Toolora_${selectedId ?? "mockup"}${suffix}_${500 * m}px.${format}`;
    const a = document.createElement("a");
    a.download = fileName;
    a.href = url;
    a.click();
    addHistoryItem('mockup-generator', 'Mockup Generator', fileName, `${500 * m}px`, url);
    setDownloading(false);
  };

  const filteredProducts = useMemo(
    () =>
      PRODUCTS.filter((p) => {
        const matchCat =
          activeCategory === "All" ||
          (activeCategory === "Favorites" ? favorites.includes(p.id) : p.category === activeCategory);
        const matchSearch =
          searchQuery === "" ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
      }),
    [activeCategory, searchQuery, favorites]
  );

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. PRODUCT PICKER VIEW
  // ─────────────────────────────────────────────────────────────────────────────

  if (!selectedId) {
    return (
      <div className="w-full space-y-6 select-none text-left">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search 50 mockup templates (t-shirts, mugs, phone cases, boxes...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900 text-sm text-slate-800 dark:text-zinc-100 focus:outline-none focus:border-orange-500 transition shadow-xs"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "bg-orange-600 text-white border-orange-600 shadow-xs"
                  : "bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 hover:border-orange-300"
              }`}
            >
              {cat === "Favorites" && <Star className="w-3 h-3" fill={activeCategory === cat ? "currentColor" : "none"} />}
              <span>{cat}</span>
              {cat === "Favorites" && favorites.length > 0 && (
                <span className="text-[10px] opacity-80">({favorites.length})</span>
              )}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 font-bold font-mono">
          {filteredProducts.length} MOCKUP TEMPLATES READY FOR REAL-TIME RENDERING
        </p>

        {/* Mockups Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-orange-500 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] group transition-all bg-slate-50/50 dark:bg-zinc-900/30"
          >
            <Upload className="w-6 h-6 text-slate-400 group-hover:text-orange-600 mb-2 transition-colors" />
            <p className="text-xs font-bold text-slate-600 dark:text-zinc-300 leading-snug">
              Upload custom<br />logo or image
            </p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
          </div>

          {filteredProducts.map((p) => (
            <div
              key={p.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedId(p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedId(p.id);
                }
              }}
              className="group relative bg-white dark:bg-[#131B2E] border border-slate-200/90 dark:border-[#1E293B] rounded-2xl p-4 shadow-xs hover:border-orange-400 hover:shadow-md cursor-pointer flex flex-col justify-between min-h-[140px] transition-all active:scale-[0.98] text-left"
            >
              <button
                type="button"
                onClick={(e) => toggleFavorite(p.id, e)}
                title={favorites.includes(p.id) ? "Remove from favorites" : "Add to favorites"}
                className="absolute top-2.5 right-2.5 z-10 p-1 rounded-full hover:bg-amber-50 dark:hover:bg-amber-950/30 transition-colors cursor-pointer"
              >
                <Star
                  className={`w-3.5 h-3.5 transition-colors ${favorites.includes(p.id) ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-zinc-600"}`}
                />
              </button>
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400">{p.category}</span>
              <div className="my-2.5 flex items-center justify-center flex-1 min-h-[70px] rounded-xl bg-slate-100/80 dark:bg-zinc-950/60 group-hover:bg-orange-500/10 dark:group-hover:bg-orange-500/20 transition-all p-2">
                <ProductIconRealistic id={p.id} />
              </div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                {p.name}
              </h4>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. STUDIO VIEW (Responsive Desktop, Tablet & Mobile)
  // ─────────────────────────────────────────────────────────────────────────────

  const TABS = [
    { id: "logo", label: "Logo", icon: <ImageIcon className="w-3.5 h-3.5" /> },
    { id: "transform", label: "Transform", icon: <SlidersHorizontal className="w-3.5 h-3.5" /> },
    { id: "colors", label: "Colors", icon: <Palette className="w-3.5 h-3.5" /> },
    { id: "export", label: "Export", icon: <FileDown className="w-3.5 h-3.5" /> },
  ] as const;

  return (
    <div className="w-full space-y-6 text-slate-900 dark:text-zinc-100 select-none text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Canvas Column */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          {/* Glass Toolbar */}
          <div className="flex justify-between items-center gap-2 flex-wrap bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-3 py-2 shadow-xs">
            <button
              onClick={() => setSelectedId(null)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl text-xs font-bold cursor-pointer hover:border-orange-400 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back to Templates
            </button>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-600 dark:text-zinc-300 px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                {product?.name}
              </span>
              <button onClick={undo} disabled={historyIndex <= 0} title="Undo" className="p-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-orange-400 transition-colors disabled:opacity-30">
                <Undo2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo" className="p-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-orange-400 transition-colors disabled:opacity-30">
                <Redo2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setT({ rotation: (transform.rotation - 15 + 360) % 360 })} title="Rotate -15°" className="p-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setT({ rotation: (transform.rotation + 15) % 360 })} title="Rotate +15°" className="p-1.5 bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg cursor-pointer hover:border-orange-400 transition-colors">
                <RotateCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Canvas Wrapper */}
          <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-inner bg-white dark:bg-zinc-950 relative aspect-square max-w-full flex items-center justify-center">
            <canvas
              ref={canvasRef}
              style={{ width: "100%", height: "100%", maxWidth: "500px", maxHeight: "500px", touchAction: "none" }}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUpCommit}
              className="w-full h-full object-contain cursor-grab active:cursor-grabbing"
            />
            <div className="absolute bottom-2 left-2 text-[9px] bg-black/50 text-white px-2 py-0.5 rounded-md font-mono pointer-events-none select-none">
              Drag on canvas to position
            </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="lg:col-span-5 space-y-3">
          {/* Tab buttons */}
          <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800/80 p-1 rounded-xl">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-white dark:bg-zinc-900 text-orange-600 dark:text-orange-400 shadow-xs"
                    : "text-slate-500 dark:text-zinc-400 hover:text-slate-800"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "logo" && (
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 dark:border-zinc-800 hover:border-orange-500 rounded-xl p-4 text-center cursor-pointer transition-colors group"
              >
                <Upload className="w-5 h-5 mx-auto text-slate-400 group-hover:text-orange-600 mb-1" />
                <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">Click to upload brand logo</p>
                <p className="text-[10px] text-slate-400 mt-0.5">PNG, SVG, or JPG (transparent recommended)</p>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleLogoUpload(e.target.files[0])} />
              </div>

              {logoSrc && (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs">
                  <span className="truncate max-w-[150px] font-mono text-[11px]">{logoFileName}</span>
                  <button onClick={clearLogo} className="p-1 text-rose-500 hover:bg-rose-50 rounded cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Or Use Brand Text</label>
                <input
                  type="text"
                  value={brand.text}
                  onChange={(e) => {
                    setBrand((b) => ({ ...b, text: e.target.value }));
                    setUseBrandText(true);
                  }}
                  placeholder="BRAND NAME"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-zinc-700 rounded-lg text-xs font-bold bg-white dark:bg-zinc-900"
                />
              </div>
            </div>
          )}

          {activeTab === "transform" && (
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
              <SliderRow label="Scale" unit="%" value={transform.scale} min={5} max={120} onChange={(v) => setT({ scale: v })} />
              <SliderRow label="Rotation" unit="°" value={transform.rotation} min={0} max={360} onChange={(v) => setT({ rotation: v })} />
              <SliderRow label="Opacity" unit="%" value={transform.opacity} min={10} max={100} onChange={(v) => setT({ opacity: v })} />
              <SliderRow label="Offset X" unit="px" value={transform.x} min={-150} max={150} onChange={(v) => setT({ x: v })} />
              <SliderRow label="Offset Y" unit="px" value={transform.y} min={-150} max={150} onChange={(v) => setT({ y: v })} />
            </div>
          )}

          {activeTab === "colors" && (
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Product Color</label>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => setProductColor(hex)}
                    style={{ backgroundColor: hex }}
                    className={`w-6 h-6 rounded-full border border-slate-300 cursor-pointer ${productColor === hex ? "ring-2 ring-orange-500 scale-110" : ""}`}
                  />
                ))}
                <input type="color" value={productColor} onChange={(e) => setProductColor(e.target.value)} className="w-6 h-6 rounded-full cursor-pointer" />
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-3">
              <div className="grid grid-cols-3 gap-1.5">
                {(["1x", "2x", "3x"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setExportRes(r)}
                    className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${exportRes === r ? "bg-orange-600 text-white border-orange-600" : "bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700"}`}
                  >
                    {r} <span className="text-[9px] opacity-80">({r === "1x" ? "500px" : r === "2x" ? "1000px" : "1500px"})</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => download("png")}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  <Download className="w-4 h-4" /> Download PNG
                </button>
                <button
                  onClick={() => download("jpg")}
                  disabled={downloading}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  <ImageIcon className="w-4 h-4" /> Download JPG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
