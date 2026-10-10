'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ticket, User, Sparkles, Menu, X, ArrowRight } from 'lucide-react';
import { DandiyaLogo } from '../common/DandiyaLogo';

interface NavbarProps {
  onOpenBooking: () => void;
}

export function Navbar({ onOpenBooking }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090308]/95 backdrop-blur-md border-b border-[#D4AF37]/20 py-3 shadow-2xl'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Royal Emblem */}
        <Link href="/" className="flex items-center space-x-3 group">
          <DandiyaLogo className="w-15 h-15 group-hover:scale-105 transition-transform" />
          <div>
            <span className="block font-serif text-lg sm:text-xl font-bold tracking-wider gold-gradient-text uppercase">
              Dandiya Night Katoria
            </span>
            <span className="block text-[10px] tracking-widest text-[#F5EFEB]/70 uppercase font-sans -mt-1">
              Katoria's Ultimate Dandiya Utsav
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-6 text-xs sm:text-sm font-medium text-[#F5EFEB]/80">
          <a href="#about" className="hover:text-[#D4AF37] transition-colors">
            About
          </a>
          <a href="#highlights" className="hover:text-[#D4AF37] transition-colors">
            Highlights
          </a>
          <a href="#schedule" className="hover:text-[#D4AF37] transition-colors">
            Schedule
          </a>
          <a href="#passes" className="hover:text-[#D4AF37] transition-colors">
            Passes (₹99 / ₹149)
          </a>
          <a href="#gallery" className="hover:text-[#D4AF37] transition-colors">
            Gallery
          </a>
          <a href="#venue" className="hover:text-[#D4AF37] transition-colors">
            Venue
          </a>
          <a href="#faqs" className="hover:text-[#D4AF37] transition-colors">
            FAQs
          </a>
        </nav>

        {/* Actions */}
        <div className="hidden sm:flex items-center space-x-4">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 text-xs font-semibold px-3 py-2 rounded-xl bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] hover:bg-[#1A0B2E]/80 transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>{user.name || 'My Passes'}</span>
            </Link>
          ) : (
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 text-xs font-medium text-[#F5EFEB]/75 hover:text-[#D4AF37] transition-colors"
            >
              <Ticket className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>My Passes</span>
            </Link>
          )}

          <button
            onClick={onOpenBooking}
            className="animate-shimmer flex items-center space-x-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#8C0B21] via-[#A8102B] to-[#D4AF37] text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg shadow-[#8C0B21]/40 border border-[#D4AF37]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span>Book Passes</span>
            <ArrowRight className="w-4 h-4 text-[#F7E7A9]" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex lg:hidden items-center space-x-2">
          <button
            onClick={onOpenBooking}
            className="px-3.5 py-1.5 rounded-full bg-[#8C0B21] text-[#FFF] text-xs font-bold border border-[#D4AF37]/40 cursor-pointer shadow-md"
          >
            Book
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#D4AF37] hover:text-white cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0D0614]/98 border-b border-[#D4AF37]/25 px-6 py-5 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              About Dandiya Night Katoria
            </a>
            <a
              href="#highlights"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              Event Highlights
            </a>
            <a
              href="#schedule"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              Evening Schedule
            </a>
            <a
              href="#passes"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              Passes & Pricing (₹99 / ₹149)
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              Festival Gallery
            </a>
            <a
              href="#venue"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              Indira Garden Venue
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#F5EFEB]/90 hover:text-[#D4AF37]"
            >
              Frequently Asked Questions
            </a>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D4AF37] font-semibold pt-2 border-t border-white/10"
            >
              Participant Dashboard & Passes →
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#F5EFEB]/50 hover:text-white"
            >
              Staff & Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
