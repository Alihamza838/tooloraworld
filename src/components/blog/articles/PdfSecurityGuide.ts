// blog/articles/PdfSecurityGuide.ts
import type { BlogPost } from "../types";
import { IMG } from "../utils";

const PdfSecurityGuide: BlogPost = {
  id: "pdf-security-explained-owner-vs-user-passwords-permission-flags",
  title: "PDF Security Explained: Owner vs User Passwords, Printing Restrictions & Permission Flags",
  slug: "pdf-security-explained-owner-vs-user-passwords-permission-flags",
  excerpt: "Understand AES-256 PDF encryption, the critical distinction between User (Open) and Owner (Permissions) passwords, and how to protect sensitive corporate documents.",
  date: "August 19, 2026",
  readTime: "12 min read",
  tag: "PDF Tools",
  author: "Hamza Tariq",
  authorRole: "Principal Document Systems Engineer",
  authorCredentials: "ISO 32000 PDF Standards Contributor · Certified Information Privacy Professional (CIPP/E)",
  focusKeyword: "pdf encryption user vs owner password permissions",
  metaDesc: "Comprehensive guide to PDF security: AES-256 encryption, User open passwords, Owner permissions, printing restrictions, and secure in-browser decryption.",
  toolId: "pdf-lock-unlock",
  relatedTools: [
    "pdf-editor",
    "pdf-watermark",
    "pdf-compressor",
    "pdf-merger",
    "signature-maker"
  ],
  coverImage: IMG.pdf_lock,
  quote: "Document security is only as strong as its cryptographic implementation. True privacy means zero keys or plaintexts ever leave the client boundary.",
  takeaways: [
    "User (Open) Passwords cryptographically encrypt the entire document payload using AES-256 or RC4, preventing unauthorized opening.",
    "Owner (Permissions) Passwords set behavioral restriction flags for printing, text copying, and modification.",
    "Modern PDF viewers enforce standard cryptographic padding to prevent dictionary and rainbow table attacks.",
    "Toolora performs all encryption and decryption operations locally using client-side WebAssembly crypto libraries."
  ],
  howTo: {
    title: "How to Password-Protect and Encrypt a PDF Document",
    totalTimeMinutes: 2,
    steps: [
      { name: "Open PDF Lock & Unlock", text: "Navigate to Toolora's PDF Lock & Unlock tool in your browser." },
      { name: "Load PDF document", text: "Drag your sensitive PDF file into the secure sandbox." },
      { name: "Select 'Lock with Password'", text: "Choose the encryption mode from the control panel." },
      { name: "Set strong passphrase", text: "Enter a robust alphanumeric password with special characters." },
      { name: "Set permission flags", text: "Optionally restrict high-resolution printing or content copying." },
      { name: "Download encrypted PDF", text: "Click 'Encrypt & Download' to generate your AES-256 secured document." }
    ]
  },
  sections: [
    {
      id: "owner-vs-user-passwords",
      heading: "User Passwords vs Owner Passwords: What Is the Difference?",
      image: IMG.pdf_security,
      content: `The PDF specification (ISO 32000) defines two distinct password mechanisms:

1. **User (Open) Password:** Directly encrypts the document's binary stream objects. Without this password, no viewer can decompile or display the pages.
2. **Owner (Permissions) Password:** Restricts specific user actions—such as disabling the Print button, preventing text selection/copying, or blocking page extraction—while allowing anyone to view the document.`
    },
    {
      id: "encryption-standards-table",
      heading: "PDF Encryption Standards Comparison",
      content: `Here is a breakdown of cryptographic algorithms used in PDF documents:`,
      table: {
        caption: "PDF Encryption Algorithms & Security Ratings",
        headers: ["Standard", "Algorithm", "Key Length", "Security Level (2026)", "Recommended Use"],
        highlightColIndex: 3,
        rows: [
          ["PDF 1.4 / Acrobat 5", "RC4", "40-bit", "Insecure (Deprecated)", "Never"],
          ["PDF 1.6 / Acrobat 7", "AES", "128-bit", "Moderate", "Legacy compatibility"],
          ["PDF 1.7 / Acrobat 9+", "AES", "256-bit", "Enterprise Military-Grade", "Standard default"],
          ["PDF 2.0 (ISO 32000-2)", "AES-GCM", "256-bit", "Highest State-of-the-Art", "High-security filings"]
        ]
      }
    }
  ],
  quiz: {
    question: "Which PDF password type is required to prevent unauthorized users from even viewing or opening the document?",
    options: [
      "Owner Password",
      "User (Open) Password",
      "Printer Permission Password"
    ],
    correctIndex: 1,
    explanation: "A User (Open) Password cryptographically encrypts the PDF streams so the document cannot be rendered or opened without entering the password."
  },
  faqs: [
    { q: "How strong is AES-256 PDF encryption?", a: "AES-256 is an enterprise military-grade standard approved by international security agencies; it cannot be brute-forced with modern computing hardware." },
    { q: "Can I remove a password from a PDF if I know the password?", a: "Yes. Load the encrypted file into Toolora, type the existing password, and click 'Unlock & Remove Password' to save a clean decrypted file." },
    { q: "Can Toolora crack a PDF password if I forgot it?", a: "No. Because Toolora respects cryptographic security and processes files locally without illegal backdoors, you must know the password to decrypt AES-256 files." },
    { q: "Can I prevent people from copying text out of my PDF?", a: "Yes. Setting an Owner Password with the 'Disable Text Copying' permission flag prevents viewers from highlighting and copying text." },
    { q: "Does password protection prevent someone from taking a screenshot of the screen?", a: "Operating system-level screenshots cannot be cryptographically blocked by any PDF file, though high-res printing and text extraction can be restricted." },
    { q: "Is my document password sent to any remote server?", a: "No. All key derivation, hash computation, and AES decryption happen 100% locally inside your browser." },
    { q: "Will my encrypted PDF open on smartphones and tablets?", a: "Yes. Standard PDF readers on iOS, iPadOS, Android, macOS, and Windows prompt for the password upon opening." },
    { q: "Can I encrypt multiple PDF files in batch mode?", a: "Yes. You can queue multiple documents to apply the same secure password across all files in one click." },
    { q: "What happens if I combine an encrypted PDF with other files?", a: "You must first decrypt the secured file using Toolora before merging it with other documents in our PDF Merger." },
    { q: "Is there any fee or watermark added when securing files?", a: "No. Toolora is 100% free with zero watermarks, limits, or hidden fees." }
  ]
};

export default PdfSecurityGuide;
