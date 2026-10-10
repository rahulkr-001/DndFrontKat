'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Phone, Mail, Users, Sparkles } from 'lucide-react';
import { InstagramIcon } from '../common/InstagramIcon';
import { proxyImageUrl } from '@/lib/utils/imageUrl';


interface OrganisersSectionProps {
  organizer?: any;
  teamMembers?: any[];
}

export function OrganisersSection({ organizer, teamMembers }: OrganisersSectionProps) {
  const defaultTeam = [
    {
      id: 'team-1',
      name: 'Ankit Keshri',
      role: 'Event Director & Lead Organiser',
      bio: 'Leading cultural initiatives with Starlight Club to bring grand festival productions to Katoria.',
      imageUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'team-2',
      name: 'Starlight Club Committee',
      role: 'Operations & Volunteer Coordinators',
      bio: 'A committed youth committee managing security, audio-visuals, stage coordination, and crowd safety.',
      imageUrl:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const team = teamMembers && teamMembers.length > 0 ? teamMembers : defaultTeam;

  const phone = organizer?.phone || '7004980474';
  const email = organizer?.email || 'starlightclub@gmail.com';
  const insta = organizer?.socialLinks?.instagram || 'https://instagram.com/dandiya_night_katoria';

  return (
    <section id="organisers" className="py-24 bg-[#0D0614] relative bg-jali-pattern overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-[#8C0B21]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#1A0B2E] border border-[#D4AF37]/35 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Organising Committee</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Presented by Starlight Club
          </h2>
          <p className="text-[#F5EFEB]/70 text-sm sm:text-base leading-relaxed font-light">
            Organised by Ankit Keshri & Team with dedicated volunteers committed to seamless festive celebrations in Katoria.
          </p>
        </div>

        {/* Foundation & Leadership Card */}
        <div className="bg-gradient-to-r from-[#1A0B2E]/95 via-[#120719] to-[#1A0B2E]/95 border border-[#D4AF37]/35 rounded-3xl p-8 sm:p-12 shadow-2xl mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Foundation Profile */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#580612] text-[#F7E7A9] text-xs font-semibold border border-[#D4AF37]/30">
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Dandiya Night 3.0</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Starlight Club & Ankit Keshri Team
              </h3>

              <p className="text-sm text-[#F5EFEB]/80 leading-relaxed font-light">
                {organizer?.description ||
                  'Starlight Club And Ankit Keshri & Team Present Dandiya Night 3.0 in Katoria, bringing together high-octane music, traditional Dandiya, entertainment, food, beverages, and community celebration at Indira Garden.'}
              </p>

              {/* Direct Helplines & Links */}
              <div className="flex flex-wrap gap-3 pt-2 text-xs text-[#F5EFEB]/80">
                <a
                  href={`tel:${phone}`}
                  className="flex items-center space-x-2 bg-[#090308] px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#D4AF37] text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>+91 {phone}</span>
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center space-x-2 bg-[#090308] px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#D4AF37] text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{email}</span>
                </a>
                <a
                  href={insta}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-[#090308] px-4 py-2.5 rounded-xl border border-white/10 hover:border-[#D4AF37] text-[#F7E7A9] transition-colors"
                >
                  <InstagramIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>@dandiya_night_katoria</span>
                </a>
              </div>
            </div>

            {/* Right: Key Trust Pillars */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#090308]/80 border border-[#D4AF37]/20 text-center">
                <span className="block font-mono text-3xl font-black gold-gradient-text">3rd</span>
                <span className="text-[11px] text-[#F5EFEB]/70 uppercase tracking-wider block mt-1">
                  Grand Edition
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#090308]/80 border border-[#D4AF37]/20 text-center">
                <span className="block font-mono text-3xl font-black text-[#F7E7A9]">100%</span>
                <span className="text-[11px] text-[#F5EFEB]/70 uppercase tracking-wider block mt-1">
                  Family Safe
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#090308]/80 border border-[#D4AF37]/20 text-center">
                <span className="block font-mono text-3xl font-black text-white">1000+</span>
                <span className="text-[11px] text-[#F5EFEB]/70 uppercase tracking-wider block mt-1">
                  Expected Attendees
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-[#090308]/80 border border-[#D4AF37]/20 text-center">
                <span className="block font-mono text-3xl font-black gold-gradient-text">Live DJ</span>
                <span className="text-[11px] text-[#F5EFEB]/70 uppercase tracking-wider block mt-1">
                  & Dhol Beats
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Leadership Showcase Cards */}
        {team.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member: any, idx: number) => (
              <motion.div
                key={member.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-[#120719]/90 border border-[#D4AF37]/25 rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left"
              >
                <img
                  src={proxyImageUrl(member.imageUrl, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80')}
                  alt={member.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4AF37]/40 shrink-0"
                  loading="lazy"
                />

                <div>
                  <h4 className="font-serif text-lg font-bold text-white mb-1">
                    {member.name}
                  </h4>
                  <span className="text-xs text-[#D4AF37] font-semibold uppercase tracking-wider block mb-2">
                    {member.role}
                  </span>
                  <p className="text-xs text-[#F5EFEB]/70 font-light leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
