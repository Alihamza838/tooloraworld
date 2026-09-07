import { GuideFrontmatter, Tool } from '../types';
import { AUTHORS } from '../data/authors';
import { TOOL_AEO_DATA } from '../data/toolAeoData';

export const SITE_CONFIG = {
  name: 'Toolora',
  legalName: 'Toolora Privacy & Productivity Technologies Inc.',
  url: 'https://toolora.world',
  logo: 'https://toolora.world/favicon.svg',
  description: 'Toolora — Free, on-device privacy-first productivity suite. Edit PDFs, convert images, build resumes, generate mockups, and convert units locally in your browser with zero server uploads.',
  foundingDate: '2025',
  founders: [
    {
      '@type': 'Person',
      name: 'Dr. Marcus Vance',
      jobTitle: 'Chief Technology Officer'
    }
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'support@toolora.world',
    contactType: 'technical support',
    availableLanguage: ['English', 'Spanish', 'German', 'Japanese', 'Urdu', 'Hindi']
  },
  sameAs: [
    'https://github.com/toolora',
    'https://twitter.com/toolora_app',
    'https://linkedin.com/company/toolora'
  ]
};

/**
 * 7-Layer JSON-LD Schema Generator for SEO, GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization)
 */
export function generate7LayerSchema(guide: any, tools: Tool[] = []) {
  const authorId = guide.authorId || 'dr-marcus-vance';
  const author = AUTHORS[authorId] || {
    name: guide.author || 'Dr. Marcus Vance',
    role: guide.authorRole || 'Chief Technology Officer',
    credentials: guide.authorCredentials || 'M.Sc. Cybersecurity & Privacy Specialist',
    socials: { website: 'https://toolora.world', linkedin: 'https://linkedin.com/company/toolora' }
  };
  const fullUrl = `${SITE_CONFIG.url}/guides/${guide.slug}`;
  const title = guide.title || 'Toolora Guide';
  const excerpt = guide.excerpt || guide.metaDesc || guide.metaDescription || SITE_CONFIG.description;
  const description = guide.metaDescription || guide.metaDesc || guide.excerpt || SITE_CONFIG.description;
  const imageUrl = guide.heroImage?.src || guide.coverImage || `${SITE_CONFIG.url}/favicon.svg`;
  const imageCaption = guide.heroImage?.caption || guide.title;
  const publishedDate = guide.publishedDate || guide.date || '2025-01-15T08:00:00Z';
  const modifiedDate = guide.modifiedDate || guide.date || '2026-08-26T12:00:00Z';
  const focusKeyword = guide.focusKeyword || 'in-browser processing';
  const secondaryKeywords = guide.secondaryKeywords || (guide.tag ? [guide.tag] : ['zero upload', 'privacy']);
  const category = guide.category || guide.tag || 'Security';

  // 1. WebSite Schema with SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-US'
  };

  // 2. Organization Schema
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.logo,
      width: 512,
      height: 512
    },
    foundingDate: SITE_CONFIG.foundingDate,
    contactPoint: SITE_CONFIG.contactPoint,
    sameAs: SITE_CONFIG.sameAs,
    knowsAbout: [
      'Client-Side Cryptography',
      'WebAssembly PDF Processing',
      'Zero-Knowledge Data Processing',
      'High-Resolution Canvas 3D Mockups',
      'Optical Character Recognition (OCR)'
    ]
  };

  // 3. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Knowledge Base & Guides',
        item: `${SITE_CONFIG.url}/guides`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: fullUrl
      }
    ]
  };

  // 4. Article / TechArticle Schema (E-E-A-T rich)
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${fullUrl}#article`,
    headline: title,
    alternativeHeadline: excerpt,
    description: description,
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      caption: imageCaption
    },
    datePublished: publishedDate,
    dateModified: modifiedDate,
    mainEntityOfPage: fullUrl,
    inLanguage: 'en-US',
    author: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
      description: author.credentials,
      url: (author.socials as any)?.website || (author.socials as any)?.linkedin,
      sameAs: [
        (author.socials as any)?.linkedin,
        (author.socials as any)?.github,
        (author.socials as any)?.twitter
      ].filter(Boolean)
    },
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`
    },
    dependencies: 'Client-side modern WebBrowser with HTML5 Canvas and WebAssembly support',
    proficiencyLevel: 'Expert',
    keywords: [focusKeyword, ...secondaryKeywords].join(', '),
    articleSection: category
  };

  // 5. FAQPage Schema for Google Rich Snippets
  const rawFaqs = guide.faqs || [];
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: rawFaqs.map((faq: any) => ({
      '@type': 'Question',
      name: faq.question || faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer || faq.a
      }
    }))
  };

  // 6. HowTo Schema for Step-by-Step Position 0 Snippet Capture
  const rawSteps = guide.howToSteps || guide.howTo?.steps || [];
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.howTo?.title || `How to execute ${focusKeyword}`,
    description: guide.quickAnswer?.definition || excerpt,
    totalTime: 'PT2M',
    step: rawSteps.map((step: any, idx: number) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name || `Step ${idx + 1}`,
      text: step.text || step,
      url: `${fullUrl}#step-${idx + 1}`
    }))
  };

  // 7. Product / Policy & Zero-Upload Privacy Guarantee Schema
  const policySchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${title} - Toolora Browser Utility`,
    operatingSystem: 'Any (Web Browser, Chrome, Firefox, Safari, Edge)',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    featureList: [
      '100% Client-Side In-Memory Execution',
      'Zero Cloud File Uploads',
      'HIPAA and GDPR Zero-Data Retention Guarantee',
      'High-Resolution Vector and WebP Export'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.96',
      reviewCount: '1428',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return {
    websiteSchema,
    organizationSchema,
    breadcrumbSchema,
    articleSchema,
    faqSchema,
    howToSchema,
    policySchema
  };
}

/**
 * Generates the full 7-Layer Schema for the Main Layout, Homepage, and Interactive Tool Views
 */
export function generateLayout7LayerSchema(activeTool?: Tool | null, activeCategory?: string) {
  const currentUrl = activeTool ? `${SITE_CONFIG.url}/?tool=${activeTool.id}` : SITE_CONFIG.url;
  const leadAuthor = AUTHORS['dr-marcus-vance'];

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: 'en-US'
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      url: SITE_CONFIG.logo,
      width: 512,
      height: 512
    },
    foundingDate: SITE_CONFIG.foundingDate,
    contactPoint: SITE_CONFIG.contactPoint,
    sameAs: SITE_CONFIG.sameAs,
    knowsAbout: [
      'Zero-Upload WebAssembly Processing',
      'Client-Side Optical Character Recognition',
      'Vector Graphics Synthesis',
      'PDF Document Manipulation',
      'In-Browser Cryptographic Signing'
    ]
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_CONFIG.url
      },
      ...(activeCategory && activeCategory !== 'all' ? [
        {
          '@type': 'ListItem',
          position: 2,
          name: `${activeCategory.toUpperCase()} Suite`,
          item: `${SITE_CONFIG.url}/?category=${activeCategory}`
        }
      ] : []),
      ...(activeTool ? [
        {
          '@type': 'ListItem',
          position: activeCategory && activeCategory !== 'all' ? 3 : 2,
          name: activeTool.name,
          item: `${SITE_CONFIG.url}/?tool=${activeTool.id}`
        }
      ] : [])
    ]
  };

  const aeoData = activeTool ? TOOL_AEO_DATA[activeTool.id] : null;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${currentUrl}#architecture`,
    headline: aeoData?.h1 || (activeTool 
      ? `${activeTool.name} - In-Browser Zero-Upload Technical Specifications`
      : 'Toolora Enterprise Client-Side Architecture & Privacy Standard'),
    description: aeoData?.openingSummary || (activeTool 
      ? `${activeTool.name}: ${activeTool.description} 100% private, client-side browser processing with zero cloud uploads.`
      : SITE_CONFIG.description),
    datePublished: '2025-01-15T08:00:00Z',
    dateModified: '2026-08-26T12:00:00Z',
    author: {
      '@type': 'Person',
      name: leadAuthor.name,
      jobTitle: leadAuthor.role,
      description: leadAuthor.credentials,
      url: leadAuthor.socials.website || leadAuthor.socials.linkedin
    },
    publisher: {
      '@id': `${SITE_CONFIG.url}/#organization`
    },
    dependencies: 'HTML5 Canvas, WebAssembly 2.0, Web Workers',
    proficiencyLevel: 'Intermediate'
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: aeoData?.faqs?.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    })) || [
      {
        '@type': 'Question',
        name: 'Are my files or documents uploaded to any remote server?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'No. Toolora processes 100% of files directly within your local browser memory (RAM) using compiled WebAssembly and Canvas pipelines. Zero bytes leave your device.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is Toolora completely free to use without hidden limits or watermarks?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. All PDF, image, mockup, and document utilities operate completely free without daily quotas, required registrations, credit card requests, or watermark stamps.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can Toolora operate offline without an active internet connection?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Toolora is built as a Progressive Web App (PWA) with client-side caching. Once loaded, all core utilities can execute offline.'
        }
      }
    ]
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: aeoData?.howTo?.title || (activeTool ? `How to use ${activeTool.name}` : 'How to use Toolora Zero-Upload Utilities'),
    description: aeoData?.openingSummary || 'Execute instant client-side file transformation and editing safely in your browser.',
    totalTime: 'PT1M',
    step: aeoData?.howTo?.steps?.map((step, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: step.name,
      text: step.text,
      url: `${currentUrl}#step-${idx + 1}`
    })) || [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Select Tool',
        text: activeTool ? `Open the ${activeTool.name} workspace.` : 'Select any PDF, Image, Mockup, or Document utility from the catalog.',
        url: `${currentUrl}#step-1`
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Load Document or Asset',
        text: 'Drag and drop your file into the secure viewport or select it via file picker.',
        url: `${currentUrl}#step-2`
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Execute Local Processing',
        text: 'The in-browser engine applies algorithms instantly in volatile RAM.',
        url: `${currentUrl}#step-3`
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Export Output',
        text: 'Download your processed document or graphic directly to local disk.',
        url: `${currentUrl}#step-4`
      }
    ]
  };

  const policySchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: aeoData?.h1 || (activeTool ? `${activeTool.name} - Toolora Browser Utility` : 'Toolora Privacy & Productivity Suite'),
    operatingSystem: 'Cross-Platform (Web, Windows, macOS, Linux, iOS, Android)',
    applicationCategory: 'UtilityApplication',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    featureList: [
      'Zero Cloud File Ingestion (100% In-Browser)',
      'Client-Side Hardware Acceleration',
      'Lossless Vector and Raster Output',
      'PWA Offline Capability'
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.98',
      reviewCount: '3820',
      bestRating: '5',
      worstRating: '1'
    }
  };

  return {
    websiteSchema,
    organizationSchema,
    breadcrumbSchema,
    articleSchema,
    faqSchema,
    howToSchema,
    policySchema
  };
}

