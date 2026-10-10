'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

const DEFAULT_SCHEDULES = [
  {
    time: '06:00 PM',
    title: 'Gates Open & Welcome Raas',
    description: 'Check-in at Indira Garden gates with atomic QR scan; Dandiya sticks distribution.',
  },
  {
    time: '06:45 PM',
    title: 'Aarti & Diya Lighting Ceremony',
    description: 'Traditional auspicious lighting of lamps celebrating cultural heritage and positivity.',
  },
  {
    time: '07:15 PM',
    title: 'Traditional Garba Circle',
    description: 'Slow and rhythmic 2-taali and 3-taali Garba steps for everyone to warm up together.',
  },
  {
    time: '08:30 PM',
    title: 'High-Energy Bollywood Dandiya Raas',
    description: 'Live DJ transition to fast-paced Dandiya beats, vibrant sound, and synchronized steps.',
  },
  {
    time: '09:30 PM',
    title: 'Food, Refreshments & Contests',
    description: 'Enjoy delicious street food stalls while judges assess traditional attire and dancing.',
  },
  {
    time: '10:30 PM',
    title: 'Grand Finale & Prize Ceremony',
    description: 'Award ceremony for Best Dressed & Best Dancer followed by the celebratory grand circle.',
  },
];

interface ScheduleSectionProps {
  schedules?: any[];
}

export function ScheduleSection({ schedules }: ScheduleSectionProps) {
  const items = schedules && schedules.length > 0 ? schedules : DEFAULT_SCHEDULES;

  return (
    <section id="schedule" className="py-24 bg-[#090308] relative overflow-hidden bg-radial-vignette">
      {/* Decorative background effects */}
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5" />
            <span>Evening Itinerary</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Event Schedule & Flow
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Plan your evening of celebration from the opening lamp lighting to the electrifying midnight grand finale.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l-2 border-[#D4AF37]/30 ml-4 sm:ml-32 space-y-8 pl-6 sm:pl-10">
          {items.map((item: any, idx: number) => (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative group"
            >
              {/* Glowing Timeline Marker Dot */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-[#090308] border-2 border-[#D4AF37] flex items-center justify-center group-hover:scale-125 group-hover:border-[#F7E7A9] group-hover:bg-[#8C0B21] transition-all shadow-md">
                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              </div>

              {/* Time Label on Left for Desktop */}
              <div className="hidden sm:block absolute -left-36 top-1 text-right w-20">
                <span className="font-mono text-sm font-bold gold-gradient-text tracking-wider">
                  {item.time}
                </span>
              </div>

              {/* Schedule Item Content Card */}
              <div className="bg-gradient-to-r from-[#120719]/90 to-[#1A0B2E]/90 border border-[#D4AF37]/25 group-hover:border-[#D4AF37]/60 rounded-2xl p-5 sm:p-6 transition-all duration-300 shadow-lg group-hover:shadow-[#8C0B21]/20">
                <div className="sm:hidden mb-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#8C0B21]/50 border border-[#D4AF37]/30 font-mono text-xs font-bold text-[#F7E7A9]">
                    {item.time}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#F7E7A9] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#F5EFEB]/75 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
