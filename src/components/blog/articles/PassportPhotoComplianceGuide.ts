// blog/articles/PassportPhotoComplianceGuide.ts
import type { BlogPost } from "../types";
import { IMG } from "../utils";

const PassportPhotoComplianceGuide: BlogPost = {
  id: "us-uk-schengen-visa-passport-photo-requirements-compliance-guide",
  title: "US, UK, Schengen & International Visa Photo Rules: Dimensions, Background & Lighting Checklist",
  slug: "us-uk-schengen-visa-passport-photo-requirements-compliance-guide",
  excerpt: "Avoid rejected visa and passport applications. Master official 2x2 inch and 35x45mm biometric facial standards, head height ratios, plain white backgrounds, and 4x6 print sheet layouts.",
  date: "August 28, 2026",
  readTime: "12 min read",
  tag: "Image Tools",
  author: "Ali Hamza",
  authorRole: "Senior Visual Designer & Biometric Imaging Consultant",
  authorCredentials: "ICAO Doc 9303 Compliance Specialist · 10+ years government identity photo processing",
  focusKeyword: "us uk schengen passport photo size requirements",
  metaDesc: "The complete 2026 international passport and visa photo guide: US 2x2 inch, UK & Schengen 35x45mm, head dimension ratios, white background rules, and printable 4x6 grid generator.",
  toolId: "passport-photo-maker",
  relatedTools: [
    "bg-remover",
    "image-editor",
    "image-resizer",
    "image-compressor",
    "pdf-to-image"
  ],
  coverImage: IMG.passport,
  quote: "Over 40% of online visa rejections stem from improper photo dimensions, shadows, or tilted head alignment. Meeting ICAO standards is a precise science.",
  takeaways: [
    "US Passports mandate 2 × 2 inches (51 × 51 mm) with head height between 1.0 and 1.375 inches from chin to crown.",
    "UK, Schengen, and Canadian visas require 35 × 45 mm with the face occupying 70% to 80% of vertical height.",
    "Backgrounds must be plain white or off-white with zero shadows, patterns, or objects behind the subject.",
    "Toolora Passport Photo Maker generates both single digital crop files and multi-copy 4×6 inch printable photo grid sheets."
  ],
  howTo: {
    title: "How to Create an Approved Passport Photo at Home",
    totalTimeMinutes: 3,
    steps: [
      { name: "Take a well-lit photo", text: "Stand 4 feet from a neutral wall under even front lighting with a neutral facial expression." },
      { name: "Open Passport Photo Maker", text: "Launch Toolora's Passport Photo Maker in your browser." },
      { name: "Select country standard", text: "Choose 'United States (2x2 in)', 'Schengen / UK (35x45 mm)', or 'Custom Size'." },
      { name: "Align biometric face guide", text: "Position the head and chin within the on-screen oval calibration template." },
      { name: "Set background to pure white", text: "Ensure the background is clean white with no harsh head shadows." },
      { name: "Download 4x6 print grid or digital file", text: "Save a single digital submission file or a 4×6 inch grid containing 6 photos for cheap printing at local pharmacies." }
    ]
  },
  sections: [
    {
      id: "international-standards-table",
      heading: "International Passport & Visa Photo Specifications (2026 Master Guide)",
      image: IMG.passport_guideline,
      content: `Here are the official government standards by region:`,
      table: {
        caption: "Biometric Passport Photo Dimensions Across Major Jurisdictions",
        headers: ["Country / Region", "Physical Size", "Digital Pixel Size (300 DPI)", "Head Height %", "Background Color"],
        highlightColIndex: 1,
        rows: [
          ["United States (US State Dept)", "2 × 2 inches (51 × 51 mm)", "600 × 600 px", "50% - 69% (1\" - 1.375\")", "Plain White / Off-White"],
          ["United Kingdom (UK HMPO)", "35 × 45 mm", "413 × 531 px", "70% - 80% (29 - 34 mm)", "Light Gray / Cream / White"],
          ["Schengen Area (EU Visas)", "35 × 45 mm", "413 × 531 px", "70% - 80% (32 - 36 mm)", "Light Gray or White"],
          ["Canada (Passport Program)", "50 × 70 mm", "590 × 826 px", "31 - 36 mm", "Plain White or Light"],
          ["India (Passport / OCI)", "2 × 2 inches (51 × 51 mm)", "600 × 600 px", "70% - 80%", "Plain Light / White"],
          ["Australia (Passport Office)", "35 × 45 mm", "413 × 531 px", "32 - 36 mm", "Plain White or Light Gray"]
        ]
      }
    },
    {
      id: "avoid-common-rejections",
      heading: "Top Reasons Passport Photos Get Rejected and How to Avoid Them",
      content: `* **Eyeglasses Reflection:** Most countries (including the US) now strictly prohibit eyeglasses in passport photos.
* **Open Mouth / Smiles:** Maintain a relaxed, neutral expression with both eyes open and mouth closed.
* **Harsh Head Shadows:** Position two light sources in front of you, or take your photo facing a bright window.`
    }
  ],
  quiz: {
    question: "What is the official size requirement for a US Passport photo?",
    options: [
      "35 × 45 mm",
      "2 × 2 inches (51 × 51 mm)",
      "4 × 6 inches"
    ],
    correctIndex: 1,
    explanation: "US passport regulations mandate exact 2 × 2 inch (51 × 51 mm) square dimensions with the head centered."
  },
  faqs: [
    { q: "Can I print the 4x6 inch sheet at standard pharmacies (CVS, Walgreens, Walmart) for under $0.50?", a: "Yes! Printing Toolora's 4x6 grid as a standard photo print costs around $0.35, saving you $15+ compared to in-store passport photo services." },
    { q: "Does Toolora support both 2x2 inch and 35x45mm international sizes?", a: "Yes. You can toggle between US 2x2 inch, UK/Schengen 35x45mm, Canadian 50x70mm, and custom dimensions." },
    { q: "Can I remove or whiten the background of my photo?", a: "Yes. You can use Toolora's Background Remover in tandem to replace any messy room background with pure official white." },
    { q: "Are eyeglasses allowed in US passport photos?", a: "No. The US State Department strictly prohibits eyeglasses in passport photos unless you have a signed medical certificate." },
    { q: "How should I position my head in the photo?", a: "Look directly at the camera with a neutral expression, head upright, and both ears and facial contours unobstructed." },
    { q: "Are my passport photos uploaded or stored on any server?", a: "No. All cropping, biometric oval alignment, and grid generation execute 100% locally within your device's browser memory." },
    { q: "Can I take the photo using my smartphone camera?", a: "Yes. Have a friend take a photo of you from 4-5 feet away, then load it into Toolora for instant biometric alignment." },
    { q: "What resolution does Toolora export passport photos at?", a: "All passport photos and 4x6 print sheets are exported at crystal-clear 300 DPI print resolution." },
    { q: "Can I create passport photos for babies and toddlers?", a: "Yes. Lay the child on a plain white sheet and use Toolora's head alignment guides to crop the face properly." },
    { q: "Is Toolora Passport Photo Maker completely free with no watermarks?", a: "Yes. It is 100% free with zero watermarks or subscriptions forever." }
  ]
};

export default PassportPhotoComplianceGuide;
