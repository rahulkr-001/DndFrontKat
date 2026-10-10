'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

const DEFAULT_FAQS = [
  {
    question: 'When and where is Dandiya Night 3.0 taking place?',
    answer:
      'Dandiya Night 3.0 is scheduled for 19 October 2026, starting at 6:00 PM onwards at Indira Garden, Katoria (Bihar). Gates open right at 6:00 PM for fast check-in.',
  },
  {
    question: 'Will Dandiya sticks be available at the venue?',
    answer:
      'Yes! Complimentary decorative wooden Dandiya sticks will be available right inside Indira Garden for attendees so everyone can join the Raas circles seamlessly.',
  },
  {
    question: 'What are the pass categories and prices?',
    answer:
      'We offer Single Entry Pass at ₹99 (for one person) and Couple Pass at ₹149 (for two persons). Both include full entry, Dandiya sticks, and contest eligibility.',
  },
  {
    question: 'How do I receive my pass after booking?',
    answer:
      'Your digital pass with an encrypted laser QR code is generated instantly upon payment. You can access it immediately on your phone, download the PDF, or view it anytime in the Participant Dashboard.',
  },
  {
    question: 'What is the recommended dress code?',
    answer:
      'Traditional festive ethnic attire (such as Chaniya Choli, Lehenga, Kurta Pajama, or Kediyu) is enthusiastically encouraged to celebrate the spirit of Navratri and qualify for Best Dressed awards!',
  },
  {
    question: 'Is food and beverage available inside Indira Garden?',
    answer:
      'Yes, delicious festive street food counters, vegetarian snacks, and refreshing beverage stalls will be operating throughout the event inside the venue.',
  },
  {
    question: 'Is parking available at the venue?',
    answer:
      'Yes, dedicated two-wheeler and four-wheeler parking spaces are arranged near Indira Garden with CCTV surveillance and security volunteers.',
  },
  {
    question: 'Can I purchase tickets offline at the gate?',
    answer:
      'Due to strict venue capacity caps (1,000 attendees maximum), offline gate sales may not be guaranteed if quotas fill up. We strongly advise booking your pass online in advance.',
  },
];

interface FaqSectionProps {
  faqs?: any[];
}

export function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-24 bg-[#090308] relative overflow-hidden bg-radial-vignette">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Everything you need to know about timings, entry protocol, Dandiya sticks, passes, and venue facilities.
          </p>
        </div>

        <div className="space-y-4">
          {items.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={faq.id || idx}
                className="rounded-2xl bg-[#120719]/90 border border-[#D4AF37]/25 overflow-hidden transition-all duration-200 hover:border-[#D4AF37]/50"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-white pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#D4AF37] shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-[#F5EFEB]/80 leading-relaxed font-light border-t border-white/5">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
