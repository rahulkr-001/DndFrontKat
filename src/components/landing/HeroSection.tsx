'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ShieldCheck, Sparkles, ChevronDown, Ticket, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  event: any;
}

export function HeroSection({ onOpenBooking, event }: HeroSectionProps) {
  // Animated Countdown Timer to event date: 19 October 2026 6:00 PM IST
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isCompleted: false,
  });

  useEffect(() => {
    // 19 October 2026 18:00:00 IST
    const targetDate = event?.startDate
      ? new Date(event.startDate).getTime()
      : new Date(2026, 9, 19, 18, 0, 0).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          isCompleted: false,
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-[#090308]">
      {/* Cinematic Ambient Atmosphere Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div
          className="w-full h-full bg-cover bg-center opacity-30 transform scale-105 transition-transform duration-10000 ease-out"
          style={{
            backgroundImage: `url(${event?.heroImageUrl || 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=80'})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090308] via-[#090308]/75 to-[#1A0B2E]/70" />
        <div className="absolute inset-0 bg-jali-pattern opacity-25" />
      </div>

      {/* Decorative Golden & Crimson Glow Orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-[#8C0B21]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#580612]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Presenter & Organiser Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#8C0B21]/70 border border-[#D4AF37]/40 backdrop-blur-md mb-6 shadow-lg shadow-[#8C0B21]/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F7E7A9]" />
          <span className="text-xs font-semibold tracking-widest uppercase text-[#F7E7A9]">
            Starlight Club Presents • Organised by Ankit Keshri & Team
          </span>
        </motion.div>

        {/* Grand Headline with Hindi Tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-3 leading-tight"
        >
          <span className="gold-gradient-text">
            {event?.title || 'Dandiya Night 3.0'}
          </span>
        </motion.h1>

        {/* Hindi Tagline Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 inline-block"
        >
          <span className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#F7E7A9] tracking-wider drop-shadow-[0_2px_10px_rgba(212,175,55,0.4)]">
            "नाचेगा KATORIA एक साथ"
          </span>
        </motion.div>

        {/* Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25 }}
          className="text-base sm:text-lg text-[#F5EFEB]/90 max-w-2xl mb-8 font-light tracking-wide leading-relaxed"
        >
          Celebrate Katoria's grandest Dandiya Utsav with high-energy Bollywood Garba beats, live DJ, authentic wooden Dandiya sticks, exciting prizes, and delicious street food.
        </motion.p>

        {/* Key Venue & Date Logistics Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#F5EFEB]/90 mb-10"
        >
          <div className="flex items-center space-x-2 bg-[#1A0B2E]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/35 shadow-md">
            <Calendar className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-semibold">19 October 2026</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#1A0B2E]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/35 shadow-md">
            <Clock className="w-4 h-4 text-[#D4AF37]" />
            <span>6:00 PM Onwards</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#1A0B2E]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[#D4AF37]/35 shadow-md">
            <MapPin className="w-4 h-4 text-[#D4AF37]" />
            <span className="font-semibold">Indira Garden, Katoria (Bihar)</span>
          </div>
        </motion.div>

        {/* Live Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-gradient-to-r from-[#580612]/80 via-[#1A0B2E]/90 to-[#580612]/80 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl p-5 mb-8 shadow-2xl shadow-[#8C0B21]/20 w-full max-w-xl"
        >
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
              Gates Open In
            </span>
            <span className="text-[10px] text-[#F7E7A9] font-medium bg-[#8C0B21]/60 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/30">
              Passes: Single ₹99 • Couple ₹149
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center">
            <div className="bg-[#090308]/70 p-3 rounded-xl border border-[#D4AF37]/25">
              <span className="block font-mono text-2xl sm:text-3xl font-black text-white">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#F5EFEB]/60 uppercase tracking-wider">Days</span>
            </div>
            <div className="bg-[#090308]/70 p-3 rounded-xl border border-[#D4AF37]/25">
              <span className="block font-mono text-2xl sm:text-3xl font-black text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#F5EFEB]/60 uppercase tracking-wider">Hours</span>
            </div>
            <div className="bg-[#090308]/70 p-3 rounded-xl border border-[#D4AF37]/25">
              <span className="block font-mono text-2xl sm:text-3xl font-black text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#F5EFEB]/60 uppercase tracking-wider">Minutes</span>
            </div>
            <div className="bg-[#090308]/70 p-3 rounded-xl border border-[#D4AF37]/25">
              <span className="block font-mono text-2xl sm:text-3xl font-black text-[#F7E7A9]">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] text-[#F5EFEB]/60 uppercase tracking-wider">Seconds</span>
            </div>
          </div>
        </motion.div>

        {/* Primary Booking Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            onClick={onOpenBooking}
            className="animate-shimmer w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#8C0B21] via-[#B81130] to-[#D4AF37] text-white text-base font-bold tracking-wider uppercase shadow-xl shadow-[#8C0B21]/50 border border-[#D4AF37]/60 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Ticket className="w-5 h-5 text-[#F7E7A9]" />
            <span>Book Passes Now</span>
            <ArrowRight className="w-4 h-4 text-[#F7E7A9]" />
          </button>
          <a
            href="#passes"
            className="w-full sm:w-auto px-7 py-4 rounded-full bg-[#1A0B2E]/90 text-[#D4AF37] text-sm font-semibold tracking-wide border border-[#D4AF37]/40 hover:border-[#D4AF37] hover:bg-[#1A0B2E] transition-all flex items-center justify-center"
          >
            View Pass Tiers (₹99 / ₹149)
          </a>
        </motion.div>

        {/* Security & Authenticity Trust Tag */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-[#F5EFEB]/60"
        >
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Instant Digital QR Passes</span>
          </div>
          <span>•</span>
          <span>Dandiya Sticks Available at Venue</span>
          <span>•</span>
          <span>Secure Indira Garden Entry</span>
        </motion.div>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors flex flex-col items-center space-y-1"
        aria-label="Scroll to about festival"
      >
        <span className="text-[10px] uppercase tracking-widest">Explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </a>
    </section>
  );
}
