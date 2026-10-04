import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, MapPin, ShieldAlert } from 'lucide-react';
import { EVENT_DATA } from '../data/content.ts';
import { Hero } from '../components/sections/Hero.tsx';
import { Pillars } from '../components/sections/Pillars.tsx';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-[#FBF9F5] text-[#18181B]">
      {/* High-Impact Responsive Hero Component */}
      <Hero
        eyebrow="DVSIET MEERUT · INAUGURAL EDITION"
        primaryCta={{
          label: "Register Attendee Pass",
          href: "/register",
        }}
        ghostCta={{
          label: "Explore Pitch Arena",
          href: "/pitch",
        }}
      />

      {/* 4 Pillars of the Theme */}
      <section className="border-b border-[#E4E0D7] bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Pillars />
        </div>
      </section>

      {/* Structure Shell Overview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-[#E8590C] shrink-0 mt-1" />
            <div className="space-y-2">
              <h2 className="type-h3 text-[#18181B] font-display">Event Status & Announcements</h2>
              <p className="type-body text-[#52525B] leading-relaxed">
                Welcome to the official preview portal of Startup Conclave 1.0. Final event dates, ticket pricing, keynote speakers, investor jury, and sponsor commitments are currently undergoing official coordination. Navigate through the site sections to explore the program tracks, venue access, and registration readiness.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#71717A]">
                <span className="flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                  DVSIET Meerut, UP
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#E8590C]" />
                  2 Days (In-Person)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Route Directory Map */}
        <div className="space-y-4">
          <div className="border-b border-[#E4E0D7] pb-3">
            <h2 className="type-h2 text-[#18181B] font-display">Site Architecture & Navigation Routes</h2>
            <p className="type-small text-[#71717A]">Browse all multi-page routing destinations configured for this conclave.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { path: "/about", title: "About Conclave", note: "Mission, vision, DVSIET host profile, and theme breakdown." },
              { path: "/schedule", title: "2-Day Schedule", note: "Day 1 & Day 2 track structures, masterclasses, and timings." },
              { path: "/speakers", title: "Speakers", note: "Curated founder & mentor lineup (announcing soon)." },
              { path: "/investors", title: "Investors & Jury", note: "Venture jury and angel syndicate delegation." },
              { path: "/startups", title: "Startup Showcase", note: "Exhibitor floor guidelines and demo booth criteria." },
              { path: "/pitch", title: "Pitch Arena", note: "Application guidelines, pitching stages & prize pool." },
              { path: "/sponsors", title: "Partners & Sponsors", note: "Partnership tiers and prospectus inquiries." },
              { path: "/venue", title: "Venue & Travel", note: "DVSIET campus directions, expressway access, and RRTS." },
              { path: "/faq", title: "FAQ", note: "Attendee, founder, and student questions answered." },
              { path: "/register", title: "Registration", note: "Attendee ticket access and expression of interest." },
              { path: "/contact", title: "Contact", note: "Organizing committee and administrative contact." },
              { path: "/design-system", title: "Design System & UI Library", note: "Direction B Editorial Light component specimen and design tokens." },
            ].map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="group block rounded-[3px] border border-[#E4E0D7] bg-white p-5 hover:border-[#18181B] hover:shadow-xs transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#E8590C]">{route.path}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#A1A1AA] group-hover:text-[#18181B] transition-colors" />
                </div>
                <h3 className="mt-2 text-base font-semibold text-[#18181B] group-hover:text-[#E8590C] font-display transition-colors">
                  {route.title}
                </h3>
                <p className="mt-1 text-xs text-[#52525B] leading-relaxed">
                  {route.note}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
