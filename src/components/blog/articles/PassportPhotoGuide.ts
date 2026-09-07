// blog/articles/PassportPhotoGuide.ts
import type { BlogPost } from "../types";
import { IMG } from "../utils";

const PassportPhotoGuide: BlogPost = {
  id: "passport-photo-maker-online-free-2x2-print",
  title: "Passport Photo Maker Online Free — 2x2 Inch & 35x45mm Printable Grid Sheets (2026)",
  slug: "passport-photo-maker-online-free-2x2-print-sheet",
  excerpt: "Create official 2x2 inch (US Visa / Passport) and 35x45mm (Schengen / UK) compliant biometric photo sheets ready to print on standard 4x6 inch photo paper for pennies at local pharmacy kiosks.",
  date: "June 22, 2026",
  readTime: "16 min read",
  tag: "Image Tools",
  author: "Ali Hamza",
  authorRole: "Product & Brand Visualization Designer",
  authorCredentials: "Adobe Certified Expert · 9+ years brand identity & mockup production · 300+ client projects delivered",
  focusKeyword: "passport photo maker online free",
  metaDesc: "Create passport and visa photos online free. Standardize 2x2 inch and 35x45mm biometric sizes with printable 4x6 grid sheets. 100% private in-browser tool with zero server uploads.",
  toolId: "passport-photo-maker",
  relatedTools: ["bg-remover", "image-resizer", "image-editor", "image-compressor"],
  coverImage: IMG.passport,
  quote: "Why pay $15 at a retail pharmacy for two passport photos when you can generate a 6-photo print sheet for pennies on-device?",
  takeaways: [
    "US Passport & Visa standards require a 2x2 inch photo with head height between 1 inch and 1 3/8 inches on a plain white background.",
    "European Schengen and UK passports mandate a 35x45mm format with 70–80% head coverage.",
    "Toolora compiles a standard 4x6 inch printable grid sheet containing 6 identical cut-out photos ready for CVS/Walgreens printing.",
    "Zero file uploads ensure your personal identification photos never leave your device."
  ],
  howTo: {
    title: "How to Make Printable Passport Photos at Home",
    totalTimeMinutes: 2,
    steps: [
      { name: "Upload Portrait", text: "Drag a clear headshot with good lighting into the Passport Photo Maker." },
      { name: "Position Biometric Guides", text: "Align the facial oval guides with your eyes, chin, and top of head." },
      { name: "Download Printable Sheet", text: "Download the single 2x2 photo or the full 4x6 inch 6-photo printable sheet." }
    ]
  },
  sections: [
    {
      id: "biometric-rules",
      heading: "Official Biometric Government Photo Guidelines",
      content: `* **Lighting:** Even lighting without harsh shadows across the face or behind the head.
* **Expression:** Neutral facial expression with both eyes open and looking directly at the camera.
* **Attire:** Everyday clothing (no uniforms, no white shirts that blend with the background, no hats or dark glasses).`
    }
  ],
  quiz: {
    question: "What is the standard photo size for US Passport and Visa applications?",
    options: [
      "5x7 inches.",
      "2x2 inches (51x51 mm).",
      "1x1 centimeter."
    ],
    correctIndex: 1,
    explanation: "The US State Department mandates exact 2x2 inch dimensions with proper biometric head ratios."
  },
  faqs: [
    { q: "Is the Passport Photo Maker free?", a: "Yes, 100% free with unlimited photo sheet generation." },
    { q: "Can I print the 4x6 sheet at CVS, Walgreens, or Walmart?", a: "Yes, print the 4x6 inch sheet as a standard 4x6 photo print for under $0.40." },
    { q: "Which passport standards are supported?", a: "US (2x2 in), Schengen/UK (35x45 mm), India, Canada, and custom dimensions." },
    { q: "Are my photos uploaded to a server?", a: "No. Everything processes strictly in your browser memory." },
    { q: "How do I change the background to white?", a: "Use our Smart Backdrop Eraser tool to remove backgrounds first, then load the photo here." },
    { q: "Can I use a selfie?", a: "Yes, as long as it is taken straight-on at eye level with good lighting." },
    { q: "Does Toolora add watermarks?", a: "Never. All exported print sheets are clean." },
    { q: "Does it work on mobile phones?", a: "Yes, take a portrait with your phone and generate the sheet immediately." },
    { q: "What resolution is the print sheet?", a: "300 DPI high-resolution for crystal-clear laboratory photo printing." },
    { q: "Can I cut out the photos with scissors?", a: "Yes, subtle guide lines indicate exact cut boundaries." }
  ]
};

export default PassportPhotoGuide;
