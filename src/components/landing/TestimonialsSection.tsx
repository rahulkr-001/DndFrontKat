'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, MessageSquareHeart, CheckCircle } from 'lucide-react';
import { proxyImageUrl } from '@/lib/utils/imageUrl';


const DEFAULT_TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Vikash Keshri',
    role: 'Katoria Resident',
    quote:
      'Dandiya Night in Katoria has completely changed how our town celebrates festivals. The lighting, decor, and family atmosphere at Indira Garden is simply unmatched!',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't-2',
    name: 'Pooja & Amit',
    role: 'Couple Pass Attendees',
    quote:
      'The couple entry was super smooth. We got our sticks at the gate, danced for 4 hours non-stop, and the food stalls were fantastic. Can’t wait for 3.0!',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 't-3',
    name: 'Sneha Baranwal',
    role: 'Student & Cultural Enthusiast',
    quote:
      'Best festive night of the year! The DJ playlist was incredible and the security arrangements made everyone feel completely safe.',
    rating: 5,
    avatarUrl:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];

interface TestimonialsSectionProps {
  testimonials?: any[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const items =
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_TESTIMONIALS;

  return (
    <section id="testimonials" className="py-24 bg-[#090308] relative overflow-hidden bg-radial-vignette">
      {/* Decorative ambient glowing circles */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>Community Voices</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            What Katoria Says
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Loved by families, youth, and festival-goers from across Katoria, Deoghar, and Banka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((t: any, idx: number) => (
            <motion.div
              key={t.id || idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-gradient-to-br from-[#120719]/90 to-[#1A0B2E]/90 border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#8C0B21]/20 relative group"
            >
              {/* Gold Quote Icon */}
              <Quote className="w-8 h-8 text-[#D4AF37]/30 group-hover:text-[#D4AF37]/60 transition-colors mb-4" />

              <div>
                {/* 5-star rating */}
                <div className="flex items-center space-x-1 mb-4">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]"
                    />
                  ))}
                </div>

                <p className="text-sm text-[#F5EFEB]/85 leading-relaxed font-light italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Attendee Avatar & Credentials */}
              <div className="flex items-center space-x-3 pt-4 border-t border-white/10">
                <img
                  src={proxyImageUrl(t.avatarUrl, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80')}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover border border-[#D4AF37]/40"
                  loading="lazy"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-1.5">
                    <h4 className="font-serif text-sm font-bold text-white">
                      {t.name}
                    </h4>
                    {t.isVerified && (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                        <CheckCircle className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-[#D4AF37] font-medium block">
                    {t.role}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
