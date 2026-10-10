'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Music,
  Users,
  Sparkles,
  Award,
  Camera,
  Utensils,
  Car,
  ShieldCheck,
  HeartHandshake,
  Trophy,
  Flame,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Music,
  Users,
  Sparkles,
  Award,
  Camera,
  Utensils,
  Car,
  ShieldCheck,
  HeartHandshake,
  Trophy,
  Flame,
};

const DEFAULT_HIGHLIGHTS = [
  {
    iconName: 'Sparkles',
    badge: 'Available at Venue',
    title: 'Dandiya Sticks at Garden',
    description:
      'Traditional decorative wooden sticks available right inside Indira Garden for all attendees.',
  },
  {
    iconName: 'Music',
    badge: 'Live Beats',
    title: 'High-Energy Live DJ & Dhol',
    description:
      'Non-stop Garba, Bollywood remixes & Gujarati folk beats curated for the grand dancing circle.',
  },
  {
    iconName: 'Utensils',
    badge: 'Food Fiesta',
    title: 'Festive Food & Beverage Stalls',
    description:
      'Delicious festive delicacies, refreshing mocktails, and live street food counters throughout the venue.',
  },
  {
    iconName: 'Camera',
    badge: 'Memories',
    title: 'Festive Selfie & 360° Photo Booths',
    description:
      'Capture traditional ethnic portraits with royal festive backdrop installations and lighting.',
  },
  {
    iconName: 'Trophy',
    badge: 'Win Big',
    title: 'Grand Prizes & Contests',
    description:
      'Exciting awards for Best Dressed Couple, Best Dancer, and Best Traditional Attire.',
  },
  {
    iconName: 'Car',
    badge: 'Safe & Secure',
    title: 'Secure Parking & CCTV Surveillance',
    description:
      'Spacious dedicated vehicle parking with full CCTV surveillance and security volunteers.',
  },
  {
    iconName: 'HeartHandshake',
    badge: 'Dedicated Support',
    title: 'Girls Volunteers & Family Support',
    description:
      'Dedicated female volunteers and assistance teams ensuring comfortable and respectful celebration.',
  },
  {
    iconName: 'Award',
    badge: 'Cultural Spirit',
    title: 'Midnight Diya & Maha Aarti',
    description:
      'Experience the spiritually uplifting collective Diya lighting ceremony under the open sky.',
  },
];

interface HighlightsSectionProps {
  highlights?: any[];
}

export function HighlightsSection({ highlights }: HighlightsSectionProps) {
  const displayItems = highlights && highlights.length > 0 ? highlights : DEFAULT_HIGHLIGHTS;

  return (
    <section id="highlights" className="py-24 bg-[#0D0614] relative overflow-hidden bg-jali-pattern">
      {/* Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#8C0B21]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Katoria Festive Experience</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Highlights of Dandiya Night 3.0
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Crafted for pure cultural reverence and celebratory joy. Every detail at Indira Garden is designed to give you an unforgettable festive evening.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayItems.map((h: any, idx: number) => {
            const Icon = ICON_MAP[h.iconName] || Sparkles;
            return (
              <motion.div
                key={h.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (idx % 4) * 0.1 }}
                className="bg-gradient-to-br from-[#1A0B2E]/90 to-[#090308]/90 border border-[#D4AF37]/25 hover:border-[#D4AF37]/70 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#8C0B21]/20 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8C0B21] to-[#580612] border border-[#D4AF37]/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                      <Icon className="w-6 h-6 text-[#F7E7A9]" />
                    </div>
                    {h.badge && (
                      <span className="text-[10px] font-semibold text-[#D4AF37] bg-[#120719] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/25 uppercase tracking-wider">
                        {h.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {h.title}
                  </h3>
                  <p className="text-xs text-[#F5EFEB]/70 leading-relaxed font-light">
                    {h.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
