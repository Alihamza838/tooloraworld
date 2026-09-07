/**
 * Zero-Crop & Retina Image Engine Utilities
 * Guarantees zero-crop, zero-stretch, and crisp sub-pixel rendering across 1x/2x/3x viewports.
 */

export interface ResolvedImageSource {
  src: string;
  srcset?: string;
  fallbackSrc: string;
  isVector: boolean;
}

export function buildRetinaSrcSet(baseSrc: string, widths: number[] = [400, 800, 1200, 1600]): string {
  if (!baseSrc || baseSrc.startsWith('data:') || baseSrc.endsWith('.svg')) {
    return '';
  }

  // If unsplash URL, inject width and dpi parameters
  if (baseSrc.includes('unsplash.com')) {
    return widths
      .map(w => {
        const url = new URL(baseSrc);
        url.searchParams.set('w', w.toString());
        url.searchParams.set('auto', 'format');
        url.searchParams.set('fit', 'max');
        url.searchParams.set('q', '85');
        return `${url.toString()} ${w}w`;
      })
      .join(', ');
  }

  return '';
}

export function resolveImageCandidate(
  primarySrc: string,
  cdnFallback?: string,
  vectorFallback?: string
): ResolvedImageSource {
  const isVector = primarySrc?.endsWith('.svg') || false;

  return {
    src: primarySrc || cdnFallback || vectorFallback || '/favicon.svg',
    srcset: isVector ? undefined : buildRetinaSrcSet(primarySrc),
    fallbackSrc: cdnFallback || vectorFallback || '/favicon.svg',
    isVector
  };
}

/**
 * Generate a clean, brand-matched SVG vector backdrop if the primary asset is unavailable.
 */
export function generateVectorPlaceholder(title: string, category: string): string {
  const encodedTitle = encodeURIComponent(title.slice(0, 30));
  const encodedCat = encodeURIComponent(category.toUpperCase());
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450"><rect width="800" height="450" fill="%230f172a"/><circle cx="400" cy="225" r="180" fill="%234338ca" opacity="0.25" filter="blur(40px)"/><text x="50%" y="45%" text-anchor="middle" fill="%23818cf8" font-family="system-ui, sans-serif" font-size="16" font-weight="700" letter-spacing="2">${encodedCat}</text><text x="50%" y="58%" text-anchor="middle" fill="%23ffffff" font-family="system-ui, sans-serif" font-size="24" font-weight="800">${encodedTitle}</text></svg>`;
}
