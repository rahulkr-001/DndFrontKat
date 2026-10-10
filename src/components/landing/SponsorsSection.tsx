'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Shield,
  Sparkles,
  Globe,
  ExternalLink,
} from 'lucide-react';
import { DandiyaLogo } from '../common/DandiyaLogo';
import { proxyImageUrl } from '@/lib/utils/imageUrl';


function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const DEFAULT_SPONSORS = [
  {
    id: 'sp-1',
    name: 'Starlight Club',
    tier: 'PRESENTED BY',
    description: 'Premier cultural association promoting traditional festivals in Katoria.',
    logoUrl: '/logo.svg',
    websiteUrl: 'https://starlightclub.in',
    socialLinks: {
      instagram: 'https://instagram.com/dandiya_night_katoria',
      facebook: 'https://facebook.com/dandiyanightkatoria',
      youtube: 'https://youtube.com',
      website: 'https://starlightclub.in',
    },
  },
  {
    id: 'sp-2',
    name: 'Katoria Youth Association',
    tier: 'COMMUNITY PARTNER',
    description: 'Dedicated youth community fostering art, sports and unity in Katoria.',
    logoUrl: '/logo.svg',
    websiteUrl: '#',
    socialLinks: {
      instagram: 'https://instagram.com/katoriayouth',
      facebook: 'https://facebook.com/katoriayouth',
    },
  },
  {
    id: 'sp-3',
    name: 'Indira Garden Hospitality',
    tier: 'VENUE PARTNER',
    description: 'Scenic outdoor event pavilion with lush festive ambiance and secure parking.',
    logoUrl: '/logo.svg',
    websiteUrl: '#',
    socialLinks: {
      website: 'https://indiragarden.com',
    },
  },
];

interface SponsorsSectionProps {
  sponsors?: any[];
}

function SponsorCard({ sp, idx }: { sp: any; idx: number }) {
  const [imgError, setImgError] = useState(false);
  const socialLinks = sp.socialLinks || {};

  const hasInstagram = !!socialLinks.instagram;
  const hasFacebook = !!socialLinks.facebook;
  const hasYoutube = !!socialLinks.youtube;
  const hasTwitter = !!(socialLinks.twitter || socialLinks.x);
  const hasLinkedin = !!socialLinks.linkedin;
  const website = socialLinks.website || (sp.websiteUrl && sp.websiteUrl !== '#' ? sp.websiteUrl : null);

  const hasAnySocial = hasInstagram || hasFacebook || hasYoutube || hasTwitter || hasLinkedin || !!website;

  return (
    <motion.div
      key={sp.id || idx}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      className="p-6 rounded-2xl bg-[#120719]/80 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all flex flex-col items-center justify-between text-center space-y-4 shadow-lg group hover:-translate-y-1"
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="w-16 h-16 rounded-2xl bg-[#1A0B2E] border border-[#D4AF37]/30 flex items-center justify-center p-2.5 shadow-inner">
          {sp.logoUrl && sp.logoUrl !== '/logo.svg' && !imgError ? (
            <img
              src={proxyImageUrl(sp.logoUrl)}
              alt={sp.name}
              onError={() => setImgError(true)}
              className="max-h-full max-w-full object-contain"
            />
          ) : (

            <DandiyaLogo className="w-10 h-10" />
          )}
        </div>

        <div>
          <span className="text-[10px] font-bold text-[#D4AF37] tracking-widest uppercase block mb-0.5">
            {sp.tier?.replace(/_/g, ' ') || 'OFFICIAL PARTNER'}
          </span>
          <h4 className="font-serif text-base font-bold text-white">
            {sp.name}
          </h4>
          {sp.description && (
            <p className="text-[11px] text-[#F5EFEB]/60 mt-1.5 max-w-xs line-clamp-2 font-light">
              {sp.description}
            </p>
          )}
        </div>
      </div>

      {/* Social Links Row */}
      {hasAnySocial && (
        <div className="flex items-center justify-center space-x-2 pt-3 border-t border-white/10 w-full">
          {hasInstagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 transition-colors"
              title={`${sp.name} on Instagram`}
              aria-label={`${sp.name} Instagram`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {hasFacebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-colors"
              title={`${sp.name} on Facebook`}
              aria-label={`${sp.name} Facebook`}
            >
              <FacebookIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {hasYoutube && (
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10 transition-colors"
              title={`${sp.name} on YouTube`}
              aria-label={`${sp.name} YouTube`}
            >
              <YoutubeIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {hasTwitter && (
            <a
              href={socialLinks.twitter || socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/40 hover:bg-[#1DA1F2]/10 transition-colors"
              title={`${sp.name} on Twitter/X`}
              aria-label={`${sp.name} Twitter`}
            >
              <TwitterIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {hasLinkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 transition-colors"
              title={`${sp.name} on LinkedIn`}
              aria-label={`${sp.name} LinkedIn`}
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
            </a>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#D4AF37] hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 transition-colors"
              title={`Visit ${sp.name} Website`}
              aria-label={`${sp.name} Website`}
            >
              <Globe className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}

export function SponsorsSection({ sponsors }: SponsorsSectionProps) {
  const items = sponsors && sponsors.length > 0 ? sponsors : DEFAULT_SPONSORS;

  return (
    <section id="partners" className="py-20 bg-[#090308] border-t border-b border-[#D4AF37]/15 relative overflow-hidden">
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Esteemed Associates</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
          Partners & Sponsors
        </h2>
        <p className="text-xs sm:text-sm text-[#F5EFEB]/60 max-w-xl mx-auto mb-12 font-light">
          Supported by trusted community institutions dedicated to cultural heritage in Katoria.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map((sp: any, idx: number) => (
            <SponsorCard key={sp.id || idx} sp={sp} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
