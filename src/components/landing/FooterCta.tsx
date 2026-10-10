'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, ArrowRight, Sparkles, Heart } from 'lucide-react';

interface FooterCtaProps {
  onOpenBooking: () => void;
}

export function FooterCta({ onOpenBooking }: FooterCtaProps) {
  return (
    <section className="py-24 bg-gradient-to-t from-[#090308] via-[#1A0B2E] to-[#0D0614] border-t border-[#D4AF37]/25 relative overflow-hidden">
      <div className="absolute inset-0 bg-jali-pattern opacity-25" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34rem] h-[34rem] bg-[#8C0B21]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8C0B21]/70 border border-[#D4AF37]/40 mb-6 shadow-lg shadow-[#8C0B21]/20">
          <Sparkles className="w-3.5 h-3.5 text-[#F7E7A9]" />
          <span className="text-xs font-semibold tracking-wider uppercase text-[#F7E7A9]">
            Dandiya Night 3.0 • Katoria
          </span>
        </div>

        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
          नाचेगा KATORIA एक साथ!
        </h2>
        <p className="text-[#F5EFEB]/80 text-sm sm:text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          19 October 2026 at Indira Garden. Single Pass ₹99, Couple Pass ₹149. Get your sticks at the venue and dance under the starlit sky.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenBooking}
            className="animate-shimmer w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#8C0B21] via-[#B81130] to-[#D4AF37] text-white text-base font-bold tracking-wider uppercase shadow-2xl shadow-[#8C0B21]/60 border border-[#D4AF37]/60 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center space-x-3"
          >
            <Ticket className="w-5 h-5 text-[#F7E7A9]" />
            <span>Book Official Passes Now</span>
            <ArrowRight className="w-5 h-5 text-[#F7E7A9]" />
          </button>
          <a
            href="https://instagram.com/dandiya_night_katoria"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#1A0B2E]/90 text-[#D4AF37] border border-[#D4AF37]/40 text-sm font-semibold hover:border-[#D4AF37] hover:bg-[#1A0B2E] transition-all"
          >
            Follow @dandiya_night_katoria
          </a>
        </div>
      </div>
    </section>
  );
}
