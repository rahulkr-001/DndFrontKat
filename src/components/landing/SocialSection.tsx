'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { DandiyaLogo } from '../common/DandiyaLogo';
import { InstagramIcon } from '../common/InstagramIcon';

export function SocialSection() {
  const instaHandle = 'dandiya_night_katoria';
  const instaUrl = 'https://instagram.com/dandiya_night_katoria';

  const previewPhotos = [
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80',
  ];

  return (
    <section id="social" className="py-24 bg-[#0D0614] relative bg-jali-pattern overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Join the Community</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Follow the Festival
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Stay updated with behind-the-scenes rehearsals, artist reveals, gate announcements, and attendee photo tags on Instagram.
          </p>
        </div>

        {/* Instagram Profile Showcase Card */}
        <div className="bg-gradient-to-r from-[#1A0B2E]/95 via-[#120719] to-[#1A0B2E]/95 border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-10 shadow-2xl mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            {/* Profile Info */}
            <div className="flex items-center space-x-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] p-0.5 shrink-0 shadow-lg">
                <div className="w-full h-full rounded-full bg-[#090308] flex items-center justify-center">
                  <DandiyaLogo className="w-12 h-12" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2 justify-center sm:justify-start">
                  <h3 className="font-mono text-lg sm:text-xl font-bold text-white">
                    @{instaHandle}
                  </h3>
                  <span className="p-0.5 rounded-full bg-sky-500 text-white text-[10px]">✓</span>
                </div>
                <p className="text-xs text-[#D4AF37] font-medium mt-0.5">
                  Dandiya Night Katoria 
                </p>
                <p className="text-xs text-[#F5EFEB]/70 max-w-md font-light mt-1">
                  Dandiya Night 3.0 | Organised by Ankit Keshri & Team | Indira Garden, Katoria
                </p>
              </div>
            </div>

            {/* Follow Button */}
            <a
              href={instaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[#DD2A7B] to-[#8134AF] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#DD2A7B]/30 hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 shrink-0 cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Grid of 4 Photo Previews */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            {previewPhotos.map((photo, idx) => (
              <a
                key={idx}
                href={instaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative rounded-2xl overflow-hidden aspect-square border border-[#D4AF37]/25 hover:border-[#D4AF37]/70 transition-all shadow-md bg-[#090308]"
              >
                <img
                  src={photo}
                  alt={`Instagram highlight ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#090308]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-3 text-white">
                  <div className="flex items-center space-x-1 text-xs">
                    <Heart className="w-3.5 h-3.5 fill-[#DD2A7B] text-[#DD2A7B]" />
                    <span className="font-mono text-[11px]">Love</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs">
                    <InstagramIcon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Festive Hashtags Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className="px-3.5 py-1.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] font-mono">
            #DandiyaNightKatoria
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] font-mono">
            #NachegaKatoriaEkSath
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] font-mono">
            #IndiraGardenKatoria
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] font-mono">
            #StarlightClub
          </span>
        </div>
      </div>
    </section>
  );
}
