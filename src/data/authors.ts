import { AuthorProfile } from '../types';

export const AUTHORS: Record<string, AuthorProfile> = {
  'dr-marcus-vance': {
    id: 'dr-marcus-vance',
    name: 'Dr. Marcus Vance',
    role: 'Principal Cryptographic Systems Architect',
    credentials: 'Ph.D. in Computer Science (MIT), CISSP, ISO/IEC 27001 Lead Auditor',
    bio: 'Former security advisor to enterprise document infrastructures. Marcus specializes in client-side WebAssembly cryptography, Web Workers sandboxing, and zero-knowledge client architectures.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    verified: true,
    socials: {
      linkedin: 'https://linkedin.com/in/toolora-security',
      github: 'https://github.com/toolora-security',
      email: 'marcus.vance@toolora.dev',
      website: 'https://toolora.dev/authors/dr-marcus-vance'
    },
    specialties: ['Web Cryptography API', 'PDF 2.0 Security (ISO 32000-2)', 'Zero-Knowledge Client Compute', 'GDPR/HIPAA Compliance']
  },
  'elena-rostova': {
    id: 'elena-rostova',
    name: 'Elena Rostova',
    role: 'Lead Visual Design Systems Engineer',
    credentials: 'BFA Product Design (RISD), W3C WebGL Working Group Contributor',
    bio: 'Pioneer in browser-based 3D compositing and canvas displacement matrices. Elena builds GPU-accelerated rendering pipelines and zero-distortion mockup simulation engines.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    verified: true,
    socials: {
      linkedin: 'https://linkedin.com/in/elena-rostova-design',
      twitter: 'https://x.com/elena_pixels',
      website: 'https://toolora.dev/authors/elena-rostova'
    },
    specialties: ['Canvas 2D & WebGL 2.0', 'Colorimetry & ICC Profiles', 'Sub-pixel Anti-aliasing', 'Responsive Viewport Engines']
  },
  'sarah-lin-phd': {
    id: 'sarah-lin-phd',
    name: 'Sarah Lin, Ph.D.',
    role: 'Staff Machine Learning & Computer Vision Engineer',
    credentials: 'Ph.D. in Pattern Recognition (Stanford), IEEE Senior Member',
    bio: 'Sarah leads client-side neural inference research, focusing on WebAssembly Tesseract OCR pipelines, bilingual text isolation, and high-DPI document layout analysis.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    verified: true,
    socials: {
      linkedin: 'https://linkedin.com/in/sarah-lin-ml',
      github: 'https://github.com/sarah-lin-vision',
      email: 'sarah.lin@toolora.dev'
    },
    specialties: ['Wasm Neural OCR', 'Edge Image Pre-processing', 'Binarization & Dewarping', 'AEO Search Grounding']
  }
};
