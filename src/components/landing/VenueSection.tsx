'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Car,
  ShieldAlert,
  Bus,
  ExternalLink,
  CheckCircle,
  Camera,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { proxyImageUrl } from '@/lib/utils/imageUrl';

interface VenuePhotoItem {
  id: string;
  imageUrl: string;
  title?: string | null;
  caption?: string | null;
  altText?: string | null;
  isFeatured?: boolean;
}

interface VenueSectionProps {
  venue: any;
}

const DEFAULT_VENUE_PHOTOS: VenuePhotoItem[] = [
  {
    id: 'vphoto-1',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    title: 'Indira Garden Festive Arena',
    caption: 'Lush open-air lawns illuminated under festive sky for grand Raas circles',
    altText: 'Indira Garden illuminated lawn venue',
    isFeatured: true,
  },
  {
    id: 'vphoto-2',
    imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80',
    title: 'High-Fidelity Stage & Lighting',
    caption: 'Concert-grade acoustics and synchronized lighting towers',
    altText: 'Festival stage and lighting setup',
  },
  {
    id: 'vphoto-3',
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80',
    title: 'Festive Food & Refreshment Promenade',
    caption: 'Dedicated dining stalls and mocktail stations for all attendees',
    altText: 'Food stalls and refreshments area',
  },
];

export function VenueSection({ venue }: VenueSectionProps) {
  const name = venue?.name || 'Indira Garden, Katoria';
  const address = venue?.address || 'Indira Garden, Deoghar Road';
  const city = venue?.city || 'Katoria';
  const state = venue?.state || 'Bihar';
  const postalCode = venue?.postalCode || '813106';
  const mapsUrl = venue?.googleMapsUrl || 'https://maps.app.goo.gl/4xC5t7wKmSytcK9w9?g_st=ac';

  // Use uploaded photos or graceful defaults
  const photos: VenuePhotoItem[] =
    venue?.photos && venue.photos.length > 0 ? venue.photos : DEFAULT_VENUE_PHOTOS;

  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const featuredPhoto = photos.find((p) => p.isFeatured) || photos[0];
  const galleryPhotos = photos.length > 1 ? photos : [];

  return (
    <section id="venue" className="py-24 bg-[#090308] relative overflow-hidden bg-radial-vignette">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <MapPin className="w-3.5 h-3.5" />
            <span>Venue & Navigation</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            {name}
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Conveniently located in Katoria, Bihar with dedicated parking, Secure CCTV surveillance, and lush open lawn under the starlit sky.
          </p>
        </div>

        {/* Venue Photo Showcase Gallery */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
              <Camera className="w-4 h-4" />
              <span>Official Venue Tour & Grounds ({photos.length} {photos.length === 1 ? 'Photo' : 'Photos'})</span>
            </div>
            {photos.length > 1 && (
              <span className="text-[11px] text-[#F5EFEB]/50">Click any photo to enlarge</span>
            )}
          </div>

          {/* Featured Hero Photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl group cursor-pointer ${
                galleryPhotos.length > 0 ? 'lg:col-span-8 h-[340px] sm:h-[440px]' : 'lg:col-span-12 h-[380px] sm:h-[480px]'
              }`}
              onClick={() => setActivePhotoIdx(photos.indexOf(featuredPhoto))}
            >
              <img
                src={proxyImageUrl(featuredPhoto.imageUrl)}
                alt={featuredPhoto.altText || featuredPhoto.title || name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  e.currentTarget.src = '/logo.svg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090308] via-black/30 to-transparent" />

              <div className="absolute top-4 left-4 bg-[#8C0B21]/90 backdrop-blur-md border border-[#D4AF37]/50 text-[#F7E7A9] px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                Featured Arena View
              </div>

              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                    {featuredPhoto.title || name}
                  </h3>
                  {featuredPhoto.caption && (
                    <p className="text-xs sm:text-sm text-[#F5EFEB]/80 max-w-xl font-light">
                      {featuredPhoto.caption}
                    </p>
                  )}
                </div>
                <div className="p-2.5 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </motion.div>

            {/* Thumbnail Grid for Additional Photos */}
            {galleryPhotos.length > 0 && (
              <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
                {photos
                  .filter((p) => p.id !== featuredPhoto.id)
                  .slice(0, 2)
                  .map((photo, idx) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * (idx + 1) }}
                      className="relative rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-lg group cursor-pointer h-[160px] sm:h-[210px]"
                      onClick={() => setActivePhotoIdx(photos.indexOf(photo))}
                    >
                      <img
                        src={proxyImageUrl(photo.imageUrl)}
                        alt={photo.altText || photo.title || name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/logo.svg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#090308]/90 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <span className="text-xs font-semibold text-white truncate pr-2">
                          {photo.title || 'Venue Grounds'}
                        </span>
                        <Maximize2 className="w-3.5 h-3.5 text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </div>

          {/* Extended Photos Bar if more than 3 photos exist */}
          {photos.length > 3 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {photos.slice(3).map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActivePhotoIdx(photos.indexOf(photo))}
                  className="relative rounded-xl overflow-hidden border border-white/10 hover:border-[#D4AF37]/50 h-28 group cursor-pointer transition-all shadow-md"
                >
                  <img
                    src={proxyImageUrl(photo.imageUrl)}
                    alt={photo.altText || photo.title || name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.src = '/logo.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 left-2 right-2 text-[11px] font-semibold text-white truncate">
                    {photo.title || 'Venue View'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        <AnimatePresence>
          {activePhotoIdx !== null && photos[activePhotoIdx] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
              onClick={() => setActivePhotoIdx(null)}
            >
              <button
                onClick={() => setActivePhotoIdx(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors z-50"
              >
                <X className="w-6 h-6" />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1));
                    }}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#8C0B21] hover:text-white transition-all cursor-pointer z-50"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivePhotoIdx((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0));
                    }}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#8C0B21] hover:text-white transition-all cursor-pointer z-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              <div
                className="max-w-4xl max-h-[85vh] flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={proxyImageUrl(photos[activePhotoIdx].imageUrl)}
                  alt={photos[activePhotoIdx].altText || photos[activePhotoIdx].title || name}
                  className="max-w-full max-h-[70vh] rounded-2xl object-contain border border-[#D4AF37]/30 shadow-2xl"
                  onError={(e) => {
                    e.currentTarget.src = '/logo.svg';
                  }}
                />
                <div className="mt-4 text-center max-w-xl">
                  <h4 className="font-serif text-lg font-bold text-white">
                    {photos[activePhotoIdx].title || name}
                  </h4>
                  {photos[activePhotoIdx].caption && (
                    <p className="text-xs text-[#F5EFEB]/70 mt-1">
                      {photos[activePhotoIdx].caption}
                    </p>
                  )}
                  <span className="text-[10px] text-[#D4AF37] block mt-2">
                    {activePhotoIdx + 1} of {photos.length}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing 3-Column Logistics & Guidelines */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Venue Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#120719] border border-[#D4AF37]/30 rounded-3xl p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#8C0B21]/50 border border-[#D4AF37]/40 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-white mb-2">
                {name}
              </h3>
              <p className="text-sm text-[#F5EFEB]/80 leading-relaxed mb-6 font-light">
                {address}, {city}, {state} - {postalCode}
              </p>

              <div className="space-y-4 text-xs text-[#F5EFEB]/70 mb-6 border-t border-white/10 pt-4">
                <div>
                  <span className="font-semibold text-white block mb-0.5">Capacity:</span>
                  <span>1,000+ Festive Attendees</span>
                </div>
                <div>
                  <span className="font-semibold text-white block mb-0.5">Arena Environment:</span>
                  <span>Open-air garden turf with high-fidelity acoustics and festival lighting</span>
                </div>
                <div>
                  <span className="font-semibold text-white block mb-0.5">Arena Surface:</span>
                  <span>Natural non-slip leveled turf with anti-dust treatment</span>
                </div>
                <div>
                  <span className="font-semibold text-white block mb-0.5">Dandiya Sticks:</span>
                  <span className="text-[#D4AF37] font-medium">Available inside the garden for all pass holders</span>
                </div>
              </div>
            </div>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-3.5 px-4 rounded-xl bg-[#1A0B2E] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#8C0B21] hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          {/* Column 2: Gates & Parking Logistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-[#120719] border border-[#D4AF37]/30 rounded-3xl p-7 space-y-6 shadow-xl"
          >
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 rounded-xl bg-[#580612] text-[#D4AF37]">
                  <Car className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">Parking Arrangement</h4>
              </div>
              <p className="text-xs text-[#F5EFEB]/70 leading-relaxed font-light">
                Dedicated parking space arranged near Indira Garden for bikes and four-wheelers with security volunteers and CCTV monitoring.
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2.5 rounded-xl bg-[#580612] text-[#D4AF37]">
                  <Bus className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">Transit & Connectivity</h4>
              </div>
              <p className="text-xs text-[#F5EFEB]/70 leading-relaxed font-light">
                2 minutes walking distance from Deoghar Road Katoria Bus Stand. Frequent bus services from Deoghar, Bhagalpur, and nearby towns. Auto-rickshaw and taxi stands available at the venue entrance.
              </p>
            </div>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-serif text-sm font-bold text-[#D4AF37] mb-2 uppercase tracking-wide">
                Main Entry Gate Protocols
              </h4>
              <div className="space-y-2 text-xs text-[#F5EFEB]/80">
                <div className="p-2.5 rounded-xl bg-[#1A0B2E]/60 border border-white/5 flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Instant Digital Check-In:</strong> Show your QR code pass on phone for immediate scan.</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#1A0B2E]/60 border border-white/5 flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                  <span><strong>Female Volunteers:</strong> Special support team for families and ladies at entry.</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Column 3: Rules & Code of Conduct */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-b from-[#1A0B2E]/90 to-[#120719] border border-[#D4AF37]/30 rounded-3xl p-7 flex flex-col justify-between shadow-xl"
          >
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#8C0B21] text-[#F7E7A9]">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="font-serif text-lg font-bold text-white">Event Guidelines</h4>
              </div>

              <div className="space-y-3 text-xs text-[#F5EFEB]/80">
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span><strong className="text-white">Strict Traditional Attire:</strong> Ethnic attire (Kurta/Chaniya Choli) adds to the festive spirit and contest entry.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span><strong className="text-white">Strict Alcohol & Tobacco Prohibition:</strong> Zero tolerance for alcohol, smoking, or misconduct.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span><strong className="text-white">Dandiya Sticks Provided:</strong> Standard wooden sticks available at the garden; dangerous or metallic items barred.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span><strong className="text-white">Security & Bag Checks:</strong> Entry subject to security verification to ensure a safe family environment.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span><strong className="text-white">Zero Tolerance for Sexual Harassment:</strong> Any form of sexual harassment and inappropriate behavior will not be tolerated and will lead to legal consequences. Passholders must adhere to the event&apos;s code of conduct.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-[#D4AF37] font-bold">•</span>
                  <span><strong className="text-white">ID Verification:</strong> Government-issued photo ID required matching passholder name and PDF registration confirmation.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3.5 rounded-xl bg-[#580612]/40 border border-[#8C0B21]/60 text-[11px] text-[#F5EFEB]/75">
              Organisers and security volunteers reserve the right of admission to maintain a joyful, family-friendly event.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
