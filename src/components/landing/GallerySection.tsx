'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, X, ChevronLeft, ChevronRight, Camera, Sparkles } from 'lucide-react';
import { proxyImageUrl } from '@/lib/utils/imageUrl';

const DEFAULT_GALLERY_IMAGES = [
  {
    id: 'g-1',
    imageUrl:
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    caption: 'Electrifying Garba circle under the night illumination in Katoria',
    altText: 'Traditional Dandiya Raas celebration',
  },
  {
    id: 'g-2',
    imageUrl:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-energy DJ beats and synchronized wooden Dandiya strikes',
    altText: 'Youth celebrating with colorful Dandiya sticks',
  },
  {
    id: 'g-3',
    imageUrl:
      'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    caption: 'Grand stage lighting and festive decor at Indira Garden',
    altText: 'Festival lighting and crowd atmosphere',
  },
  {
    id: 'g-4',
    imageUrl:
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    caption: 'Best Dressed Contestants in royal ethnic traditional attire',
    altText: 'Traditional ethnic Chaniya Choli and Kediyu attire',
  },
  {
    id: 'g-5',
    imageUrl:
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Auspicious evening Diya lighting and collective Aarti',
    altText: 'Diya ceremony at Dandiya Night',
  },
  {
    id: 'g-6',
    imageUrl:
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    caption: 'Celebratory midnight Raas finale with hundreds of dancing attendees',
    altText: 'Midnight finale celebration',
  },
];

interface GallerySectionProps {
  gallery?: any;
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const images =
    gallery?.images && gallery.images.length > 0 ? gallery.images : DEFAULT_GALLERY_IMAGES;
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setSelectedIdx(idx);
  const closeLightbox = () => setSelectedIdx(null);

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + images.length) % images.length);
    }
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % images.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (selectedIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, images.length]);

  return (
    <section id="gallery" className="py-24 bg-[#0D0614] relative bg-jali-pattern overflow-hidden">
      {/* Decorative ambient lighting */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Memories & Moments</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Festival Gallery
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Relive the magic of past editions of Dandiya Night in Katoria. Color, rhythm, culture, and pure celebratory joy.
          </p>
        </div>

        {/* Masonry / Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img: any, idx: number) => (
            <motion.div
              key={img.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (idx % 3) * 0.1 }}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-[#D4AF37]/25 hover:border-[#D4AF37]/70 transition-all duration-300 shadow-xl hover:shadow-[#8C0B21]/30 aspect-[4/3] bg-[#1A0B2E]"
            >
              <img
                src={proxyImageUrl(img.imageUrl)}
                alt={img.altText || img.caption || 'Dandiya festival moment'}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090308]/90 via-[#090308]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              {/* Hover Overlay with Caption */}
              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <p className="text-xs sm:text-sm font-medium text-[#F5EFEB] line-clamp-2 mb-1 group-hover:text-[#F7E7A9] transition-colors">
                  {img.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-[#D4AF37]">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Dandiya Night Katoria</span>
                  </span>
                  <Maximize2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-[#090308]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1A0B2E] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#8C0B21] hover:text-white transition-all z-50 cursor-pointer"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Prev Image */}
            <button
              onClick={prevImage}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1A0B2E]/80 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#8C0B21] hover:text-white transition-all z-50 cursor-pointer"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Image */}
            <button
              onClick={nextImage}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-[#1A0B2E]/80 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#8C0B21] hover:text-white transition-all z-50 cursor-pointer"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Content */}
            <div
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl max-h-[85vh] flex flex-col items-center"
            >
              <img
                src={images[selectedIdx]?.imageUrl}
                alt={images[selectedIdx]?.altText || 'Expanded festival visual'}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                className="max-h-[70vh] w-auto object-contain rounded-xl border border-[#D4AF37]/40 shadow-2xl"
                onError={(e) => {
                  const target = e.currentTarget;
                  const currentSrc = images[selectedIdx]?.imageUrl;
                  if (!target.dataset.triedProxy && currentSrc) {
                    target.dataset.triedProxy = 'true';
                    target.src = `/api/image-proxy?url=${encodeURIComponent(currentSrc)}`;
                  }
                }}
              />
              <div className="mt-4 text-center max-w-2xl px-4">
                <p className="text-sm sm:text-base text-[#F5EFEB] font-medium">
                  {images[selectedIdx]?.caption}
                </p>
                <span className="text-xs text-[#D4AF37] block mt-1 font-mono">
                  {selectedIdx + 1} of {images.length}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
