import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Lock, Heart } from 'lucide-react';
import { DandiyaLogo } from '../common/DandiyaLogo';
import { InstagramIcon } from '../common/InstagramIcon';

export function Footer() {
  return (
    <footer className="bg-[#050205] border-t border-[#D4AF37]/15 py-12 text-[#F5EFEB]/70 text-xs">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <DandiyaLogo className="w-8 h-8" />
              <span className="font-serif text-lg font-bold gold-gradient-text uppercase">
                Dandiya Night Katoria
              </span>
            </div>
            <p className="text-[#F5EFEB]/60 text-xs leading-relaxed font-light">
               Experience Dandiya Night 3.0 in Katoria on 19 October 2026 at Indira Garden, Katoria. Presented by Starlight Club and organised by Ankit Keshri & Team.
            </p>
            <div className="pt-1">
              <a
                href="https://instagram.com/dandiya_night_katoria"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-xs text-[#D4AF37] hover:text-[#F7E7A9] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>@dandiya_night_katoria</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Festival Experience
            </h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-[#D4AF37] transition-colors">About & Story</a></li>
              <li><a href="#highlights" className="hover:text-[#D4AF37] transition-colors">Event Highlights</a></li>
              <li><a href="#schedule" className="hover:text-[#D4AF37] transition-colors">Evening Schedule</a></li>
              <li><a href="#passes" className="hover:text-[#D4AF37] transition-colors">Ticket Passes (₹99 / ₹149)</a></li>
              <li><a href="#gallery" className="hover:text-[#D4AF37] transition-colors">Retrospective Gallery</a></li>
              <li><a href="#venue" className="hover:text-[#D4AF37] transition-colors">Indira Garden Venue</a></li>
              <li><a href="#faqs" className="hover:text-[#D4AF37] transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Participant & Staff Portals */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Attendee & Staff Portals
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-[#D4AF37] hover:underline font-medium">
                  Participant Dashboard (My Passes)
                </Link>
              </li>
              <li>
                <Link href="/admin/scanner" className="hover:text-white transition-colors">
                  Gate Staff QR Scanner Terminal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-white transition-colors">
                  Enterprise Admin Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Verification Note */}
          <div>
            <h4 className="font-serif text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Ticketing Security</span>
            </h4>
            <p className="text-xs text-[#F5EFEB]/60 leading-relaxed font-light mb-3">
              All digital passes are cryptographically secured with HMAC-SHA256 signatures to prevent unauthorized duplication and ensure safe, rapid gate admission.
            </p>
            <div className="flex items-center space-x-2 text-[10px] text-[#F5EFEB]/50">
              <Lock className="w-3 h-3 text-[#D4AF37]" />
              <span>256-Bit SSL Encrypted Transactions</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#F5EFEB]/50 space-y-4 sm:space-y-0">
          <div>
            © 2026 Dandiya Night Katoria | Ankit Keshri & Team. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-1">
            <span>Crafted with devotion by <Link href="https://instagram.com/ydv_rahul_1.0" className="text-[#D4AF37] hover:underline">Rahul Yadav</Link></span>
            <Heart className="w-3 h-3 text-[#8C0B21] fill-[#8C0B21]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
