import React, { useState } from 'react';
import { resolveImageCandidate, generateVectorPlaceholder } from '../../lib/imageUtils';
import { Maximize2, ExternalLink, X, Image as ImageIcon } from 'lucide-react';

interface GuideImageProps {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: string; // default "16/9"
  category?: string;
}

export const GuideImage: React.FC<GuideImageProps> = ({
  src,
  alt,
  caption,
  aspectRatio = '16/9',
  category = 'Technology'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const candidate = resolveImageCandidate(
    src,
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    generateVectorPlaceholder(alt, category)
  );

  const activeSrc = hasError ? candidate.fallbackSrc : candidate.src;

  return (
    <>
      <figure className="my-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-900 group">
        {/* Image Container with Ambient Blurred Backdrop */}
        <div 
          className="relative w-full overflow-hidden flex items-center justify-center bg-slate-950"
          style={{ aspectRatio }}
        >
          {/* Ambient blurred backdrop so any aspect ratio looks beautiful without cropping */}
          {!candidate.isVector && (
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-2xl opacity-40 scale-125 transform pointer-events-none transition-opacity duration-700"
              style={{ backgroundImage: `url(${activeSrc})` }}
            />
          )}

          {/* Skeleton loading pulse */}
          {!isLoaded && !hasError && (
            <div className="absolute inset-0 bg-slate-800 animate-pulse flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-slate-600 animate-bounce" />
            </div>
          )}

          {/* Foreground zero-crop image */}
          <img
            src={activeSrc}
            srcSet={candidate.srcset}
            alt={alt}
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`relative z-10 max-h-full max-w-full object-contain [image-rendering:-webkit-optimize-contrast] transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-98'
            }`}
            loading="lazy"
          />

          {/* Hover Full-Res Preview Trigger */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-transform hover:scale-105"
              title="View Full Resolution"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Res</span>
            </button>
          </div>
        </div>

        {/* Caption */}
        {caption && (
          <figcaption className="bg-slate-50 dark:bg-slate-900/80 px-4 py-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 font-sans text-center">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Full-Res Lightbox Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between text-white pb-3 border-b border-white/10 mb-3">
              <div className="text-sm font-semibold truncate max-w-md">{alt}</div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={activeSrc}
              alt={alt}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-2xl [image-rendering:-webkit-optimize-contrast]"
            />
            {caption && (
              <p className="text-white/80 text-xs text-center mt-3 max-w-2xl">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
