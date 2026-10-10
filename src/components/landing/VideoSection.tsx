'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Film, Sparkles, Volume2 } from 'lucide-react';

interface VideoSectionProps {
  videos?: any[];
}

export function VideoSection({ videos }: VideoSectionProps) {
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);

  const defaultVideos = [
    {
      id: 'v-1',
      title: 'Dandiya Night 3.0 Official Promo',
      description: 'Experience the electric energy, joyful Garba circles, and festive vibes of Katoria.',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1',
      rawUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const videoList = videos && videos.length > 0 ? videos : defaultVideos;
  const featured = videoList[0];

  // Helper to get embed url
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1`;
    }
    return url;
  };

  const handlePlay = (url: string) => {
    setActiveVideoUrl(getEmbedUrl(url));
  };

  return (
    <section id="promo" className="py-24 bg-[#0D0614] relative overflow-hidden bg-radial-vignette">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Cinematic Teaser</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Feel the Goosebumps of Dandiya Night
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Glimpses of high-voltage sound, celebratory Raas circles, and royal lighting that await you at Indira Garden, Katoria.
          </p>
        </div>

        {/* Featured Video Card */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/35 shadow-2xl shadow-[#8C0B21]/30 group cursor-pointer aspect-video bg-[#090308]"
            onClick={() => handlePlay(featured.videoUrl || featured.rawUrl)}
          >
            <img
              src={featured.thumbnailUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80'}
              alt={featured.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090308] via-[#090308]/40 to-transparent" />

            {/* Glowing Centered Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[#8C0B21] to-[#D4AF37] p-1 shadow-2xl shadow-[#8C0B21]/80 group-hover:scale-110 transition-all duration-300 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#090308]/80 backdrop-blur-md flex items-center justify-center group-hover:bg-[#090308]/60 transition-colors">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 text-[#F7E7A9] fill-[#F7E7A9] ml-1" />
                </div>
              </div>
            </div>

            {/* Video Info Overlay at bottom */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-[#8C0B21]/80 backdrop-blur-md text-[#F7E7A9] text-[11px] font-semibold uppercase tracking-wider mb-2 border border-[#D4AF37]/40">
                  Official Teaser
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                  {featured.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F5EFEB]/75 max-w-xl font-light">
                  {featured.description}
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-xs text-[#D4AF37] font-medium bg-[#1A0B2E]/90 px-3 py-1.5 rounded-full border border-[#D4AF37]/30">
                <Volume2 className="w-3.5 h-3.5" />
                <span>Watch Promo Reel</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {activeVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideoUrl(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setActiveVideoUrl(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-[#1A0B2E] text-[#D4AF37] border border-[#D4AF37]/40 hover:bg-[#8C0B21] hover:text-white transition-all z-50"
              aria-label="Close video player"
            >
              <X className="w-6 h-6" />
            </button>

            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border-2 border-[#D4AF37]/40 shadow-2xl bg-black"
            >
              <iframe
                src={activeVideoUrl}
                title="Dandiya Night Video"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
