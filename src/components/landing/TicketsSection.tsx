'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame, ShieldAlert, Sparkles, ArrowRight, Ticket, Heart, User } from 'lucide-react';

interface TicketsSectionProps {
  ticketTypes: any[];
  onSelectTier: (tierId: string) => void;
}

export function TicketsSection({ ticketTypes, onSelectTier }: TicketsSectionProps) {
  // Curated fallback if DB ticket types haven't finished loading
  const fallbackTicketTypes = [
    {
      id: 'default-single',
      name: 'Single Entry Pass',
      category: 'REGULAR',
      description: 'Individual entry pass for Dandiya Night 3.0 at Indira Garden, Katoria.',
      price: 99,
      currency: 'INR',
      remaining: 300,
      totalCapacity: 500,
      isSoldOut: false,
    },
    {
      id: 'default-couple',
      name: 'Couple Pass',
      category: 'COUPLE',
      description: 'Entry pass for two persons for Dandiya Night 3.0 at Indira Garden, Katoria.',
      price: 149,
      currency: 'INR',
      remaining: 190,
      totalCapacity: 500,
      isSoldOut: false,
    },
  ];

  const typesToRender = ticketTypes && ticketTypes.length > 0 ? ticketTypes : fallbackTicketTypes;

  return (
    <section id="passes" className="py-24 bg-[#090308] relative overflow-hidden bg-radial-vignette">
      {/* Decorative Golden Ambient Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Ticket className="w-3.5 h-3.5" />
            <span>Official Passes</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Select Your Dandiya Pass
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            All passes include complimentary decorative wooden Dandiya sticks, turnstile QR check-in, and full access to Indira Garden dancing circles. Limited capacity to ensure joyful celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {typesToRender.map((tier, idx) => {
            const isCouple = tier.category === 'COUPLE' || tier.name.toLowerCase().includes('couple');
            const isSoldOut = tier.isSoldOut;

            return (
              <motion.div
                key={tier.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 relative ${
                  isCouple
                    ? 'bg-gradient-to-b from-[#580612]/90 via-[#1A0B2E]/90 to-[#090308] border-2 border-[#D4AF37] shadow-2xl shadow-[#8C0B21]/40 -translate-y-1 sm:-translate-y-2'
                    : 'bg-[#120719]/90 border border-[#D4AF37]/35 hover:border-[#D4AF37]/70 hover:shadow-xl'
                }`}
              >
                {/* Popular / Best Value Ribbon for Couple Pass */}
                {isCouple && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#D4AF37] via-[#F7E7A9] to-[#D4AF37] text-[#580612] text-[10px] font-black uppercase px-4 py-1 rounded-full shadow-lg tracking-widest flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#580612]" />
                    <span>Best Value • 2 Persons</span>
                  </div>
                )}

                <div>
                  {/* Category & Icon Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase block mb-1">
                        {isCouple ? 'Couple Entry' : 'Single Person'}
                      </span>
                      <h3 className="font-serif text-2xl font-black text-white">
                        {tier.name}
                      </h3>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37]">
                      {isCouple ? <Heart className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Price Tag */}
                  <div className="mb-5 pb-5 border-b border-white/10">
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-sm text-[#D4AF37] font-semibold">₹</span>
                      <span className="font-mono text-4xl sm:text-5xl font-black text-white">
                        {tier.price}
                      </span>
                      <span className="text-xs text-[#F5EFEB]/60 font-light">
                        {isCouple ? '/ two persons' : '/ person'}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#F5EFEB]/50 block mt-1">
                      Includes entry, sticks, and security verification
                    </span>
                  </div>

                  {/* Inventory Remaining Live Indicator */}
                  <div className="mb-6">
                    {isSoldOut ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>PASSES SOLD OUT</span>
                      </span>
                    ) : tier.remaining < 50 ? (
                      <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-semibold">
                        <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <span>Fast Filling: {tier.remaining} Passes Left</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                        <span>Instant Passes Available</span>
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#F5EFEB]/75 leading-relaxed mb-6 font-light">
                    {tier.description}
                  </p>

                  {/* Pass Inclusions */}
                  <div className="space-y-2.5 mb-8 text-xs text-[#F5EFEB]/85">
                    <div className="flex items-center space-x-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Complimentary Wooden Dandiya Sticks at Venue</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Instant Laser QR Pass with Fast-Track Gate Entry</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Full Access to Indira Garden Dance Circles</span>
                    </div>
                    <div className="flex items-center space-x-2.5">
                      <Check className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      <span>Eligible for Grand Prizes & Best Dressed Contests</span>
                    </div>
                    {isCouple && (
                      <div className="flex items-center space-x-2.5 text-[#F7E7A9] font-medium">
                        <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0" />
                        <span>Eligible for Best Dressed Couple Grand Trophy</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Instant Action CTA */}
                <button
                  disabled={isSoldOut}
                  onClick={() => onSelectTier(tier.id)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                    isSoldOut
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700'
                      : isCouple
                      ? 'bg-gradient-to-r from-[#8C0B21] via-[#B81130] to-[#D4AF37] text-white hover:scale-105 shadow-xl shadow-[#8C0B21]/50 active:scale-95 border border-[#D4AF37]/50'
                      : 'bg-[#1A0B2E] text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#8C0B21] hover:text-white hover:border-[#8C0B21] hover:scale-105 active:scale-95'
                  }`}
                >
                  <span>{isSoldOut ? 'Sold Out' : `Book ${tier.name}`}</span>
                  {!isSoldOut && <ArrowRight className="w-4 h-4" />}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
