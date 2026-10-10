'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Music2, ShieldCheck, Flame } from 'lucide-react';
import { proxyImageUrl } from '@/lib/utils/imageUrl';

interface AboutSectionProps {
  story?: any;
}

export function AboutSection({ story }: AboutSectionProps) {
  const badge = story?.badge || 'THE CULTURAL PHENOMENON';
  const heading = story?.heading || "Katoria's Grandest Festive Celebration Returns";
  const bodyText =
    story?.story ||
    'Dandiya Night 3.0 brings together the spirit of Navratri, the rhythmic pulse of traditional Raas, and high-energy Bollywood music at the scenic Indira Garden in Katoria. Presented by Starlight Club and organized by Ankit Keshri & Team, this festival unites friends, families, and youth for an unforgettable evening under the starlit sky.';

  const highlightOne = story?.highlightOne || 'Authentic Live Dhol & Bollywood Dandiya Beats';
  const highlightTwo = story?.highlightTwo || 'Grand Raas Circle under the Stars';

  const imageOne =
    story?.imageOneUrl ||
    'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80';
  const imageTwo =
    story?.imageTwoUrl ||
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80';

  return (
    <section id="about" className="py-24 bg-[#090308] relative overflow-hidden bg-radial-vignette">
      {/* Decorative ambient radial glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Collage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative"
          >
            {/* Primary Large Image */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl shadow-[#8C0B21]/30 aspect-[4/5] group">
              <img
                src={proxyImageUrl(imageOne)}
                alt="Dandiya Night Celebration in Katoria"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090308] via-transparent to-transparent opacity-70" />
              <div className="absolute bottom-5 left-5 right-5">
                <span className="inline-block px-3 py-1 rounded-full bg-[#8C0B21]/80 backdrop-blur-md text-[#F7E7A9] text-xs font-semibold uppercase tracking-wider mb-2 border border-[#D4AF37]/40">
                  Indira Garden • Katoria
                </span>
                <p className="font-serif text-lg text-white font-bold">
                  नाचेगा KATORIA एक साथ
                </p>
              </div>
            </div>

            {/* Overlapping Floating Small Image */}
            <div className="hidden sm:block absolute -bottom-8 -right-8 w-56 h-56 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-2xl shadow-black z-20">
              <img
                src={proxyImageUrl(imageTwo)}
                alt="Festive Dandiya crowd"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#1A0B2E]/30" />
            </div>

            {/* Floating Experience Badge */}
            <div className="absolute -top-4 -left-4 sm:top-6 sm:-left-8 bg-gradient-to-br from-[#1A0B2E] to-[#090308] border border-[#D4AF37]/60 rounded-2xl p-4 shadow-xl z-20 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#8C0B21] flex items-center justify-center text-[#F7E7A9]">
                <Flame className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="block font-mono text-xl font-black gold-gradient-text">Edition 3.0</span>
                <span className="text-[10px] text-[#F5EFEB]/70 uppercase tracking-widest block">Biggest Yet</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Narrative */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 space-y-6"
          >
            {/* Super Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>

            {/* Main Heading */}
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              {heading}
            </h2>

            {/* Story Paragraphs */}
            <p className="text-base text-[#F5EFEB]/80 leading-relaxed font-light">
              {bodyText}
            </p>

            {/* Two Key Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#120719]/90 border border-[#D4AF37]/20 flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#8C0B21]/40 text-[#D4AF37] shrink-0 mt-0.5">
                  <Music2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white mb-1">
                    {highlightOne}
                  </h4>
                  <p className="text-xs text-[#F5EFEB]/60 font-light">
                    Curated DJ tracks, traditional Garba rhythm & live Dhol players.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#120719]/90 border border-[#D4AF37]/20 flex items-start space-x-3">
                <div className="p-2 rounded-xl bg-[#8C0B21]/40 text-[#D4AF37] shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-white mb-1">
                    {highlightTwo}
                  </h4>
                  <p className="text-xs text-[#F5EFEB]/60 font-light">
                    Spacious garden lawn with safe family environment & girls volunteers.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Festival Metrics Pill Strip */}
            <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-[#1A0B2E]/50 border border-white/5">
                <span className="font-mono text-2xl font-black text-white block">1000+</span>
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block mt-0.5">Attendees</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1A0B2E]/50 border border-white/5">
                <span className="font-mono text-2xl font-black text-[#F7E7A9] block">₹99</span>
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block mt-0.5">Pass Starts At</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1A0B2E]/50 border border-white/5">
                <span className="font-mono text-2xl font-black text-white block">4+ Hrs</span>
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block mt-0.5">Live Raas</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1A0B2E]/50 border border-white/5">
                <span className="font-mono text-2xl font-black text-[#F7E7A9] block">100%</span>
                <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider block mt-0.5">Family Safe</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
