'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/navigation/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { HighlightsSection } from '@/components/landing/HighlightsSection';
import { ScheduleSection } from '@/components/landing/ScheduleSection';
import { TicketsSection } from '@/components/landing/TicketsSection';
import { VideoSection } from '@/components/landing/VideoSection';
import { GallerySection } from '@/components/landing/GallerySection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { OrganisersSection } from '@/components/landing/OrganisersSection';
import { SponsorsSection } from '@/components/landing/SponsorsSection';
import { VenueSection } from '@/components/landing/VenueSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { SocialSection } from '@/components/landing/SocialSection';
import { FooterCta } from '@/components/landing/FooterCta';
import { Footer } from '@/components/landing/Footer';
import { BookingModal } from '@/components/checkout/BookingModal';
import { apiFetch } from '@/lib/api';

export default function HomePage() {
  const [eventData, setEventData] = useState<any>(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  useEffect(() => {
   apiFetch('/api/public/event')
  .then(async (res) => {
    if (!res.ok) {
      throw new Error(`Event API failed with status ${res.status}`);
    }

    return res.json();
  })
  .then((data) => {
    if (data.event) {
      setEventData(data.event);
    }
  })
  .catch(() => {
    console.error('Unable to load event data.');
  });


  }, []);

  const handleOpenBooking = () => {
    setSelectedTierId(null);
    setBookingOpen(true);
  };

  const handleSelectTier = (tierId: string) => {
    setSelectedTierId(tierId);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen bg-[#090308] text-[#F5EFEB] flex flex-col selection:bg-[#8C0B21] selection:text-[#F7E7A9]">
      {/* Sticky Festive Navigation */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* Cinematic Hero Section with Countdown & Lighting */}
      <HeroSection onOpenBooking={handleOpenBooking} event={eventData} />

      {/* Editorial Storytelling: What is Dandiya Night 3.0 & Katoria Spirit */}
      <AboutSection story={eventData?.story} />

      {/* Authentic Cultural Highlights */}
      <HighlightsSection highlights={eventData?.highlights} />

      {/* Evening Timeline & Flow */}
      <ScheduleSection schedules={eventData?.schedules} />

      {/* Passes & Real-time Quotas (Single ₹99 / Couple ₹149) */}
      <TicketsSection
        ticketTypes={eventData?.ticketTypes || []}
        onSelectTier={handleSelectTier}
      />

      {/* Teaser & Promo Showcase */}
      <VideoSection videos={eventData?.videos} />

      {/* Retrospective Gallery with Fullscreen Lightbox */}
      <GallerySection gallery={eventData?.gallery} />

      {/* Attendee Testimonials & Community Voices */}
      <TestimonialsSection testimonials={eventData?.testimonials} />

      {/* Organisers & Committee (Starlight Club | Ankit Keshri & Team) */}
      <OrganisersSection
        organizer={eventData?.organizer}
        teamMembers={eventData?.teamMembers}
      />

      {/* Official Partners & Sponsors */}
      <SponsorsSection sponsors={eventData?.sponsors} />

      {/* Indira Garden Venue, Map & Gate Protocols */}
      <VenueSection venue={eventData?.venue} />

      {/* Frequently Asked Questions */}
      <FaqSection faqs={eventData?.faqs || []} />

      {/* Instagram Community Showcase */}
      <SocialSection />

      {/* Final Booking Call to Action */}
      <FooterCta onOpenBooking={handleOpenBooking} />

      {/* Footer */}
      <Footer />

      {/* Distraction-Free Booking Funnel Modal */}
      <BookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        event={eventData}
        preselectedTierId={selectedTierId}
      />
    </main>
  );
}
