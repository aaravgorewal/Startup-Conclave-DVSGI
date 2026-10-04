import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, MapPin, Users, Presentation, ShieldAlert } from 'lucide-react';
import { EVENT_DATA } from '../data/content.ts';

export const HomePage: React.FC = () => {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0e1626] via-[#090e18] to-[#080c14] py-16 sm:py-24 lg:py-28">
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            
            {/* Unboxed Metadata Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <span>{EVENT_DATA.venueInstitution}</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-slate-300 font-medium normal-case tracking-normal">2-Day In-Person Conclave</span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-amber-400/90 font-medium normal-case tracking-normal">{EVENT_DATA.dates.display}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white font-display text-balance leading-[1.08]">
              {EVENT_DATA.name}
            </h1>

            {/* Tagline */}
            <p className="text-xl sm:text-2xl text-amber-300/90 font-medium max-w-2xl text-balance">
              {EVENT_DATA.tagline}
            </p>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {EVENT_DATA.description}
            </p>

            {/* Target Audience / Scope note */}
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Users className="w-4 h-4 text-amber-400" />
              <span>{EVENT_DATA.capacityTarget} (Students, Founders, Investors, Mentors)</span>
            </div>

            {/* Primary Action Zone */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-6 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-amber-300 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400"
              >
                <span>Register Interest</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/pitch"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900/60 px-6 py-3.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 min-h-[44px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400"
              >
                <span>Pitch Arena Details</span>
                <Presentation className="h-4 w-4 text-amber-400" />
              </Link>
              <Link
                to="/sponsors"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-3.5 text-sm font-medium text-slate-300 transition-colors hover:text-white min-h-[44px]"
              >
                <span>Partner Inquiries</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Pillars of the Theme */}
      <section className="border-b border-slate-800 bg-[#090d16] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {EVENT_DATA.theme.map((pillar, idx) => (
              <div key={pillar} className="border border-slate-800/80 bg-slate-900/40 p-5 rounded-lg">
                <span className="text-xs font-mono text-amber-400 block mb-1">0{idx + 1}</span>
                <span className="text-lg sm:text-xl font-bold font-display text-white">{pillar}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Structure Shell Overview */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldAlert className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
            <div className="space-y-2">
              <h2 className="text-lg font-bold text-white font-display">Event Status & Announcements</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Welcome to the official preview portal of Startup Conclave 1.0. Final event dates, ticket pricing, keynote speakers, investor jury, and sponsor commitments are currently undergoing official coordination. Navigate through the site sections to explore the program tracks, venue access, and registration readiness.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  DVSIET Meerut, UP
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  2 Days (In-Person)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Route Directory Map */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-xl font-bold text-white font-display">Site Architecture & Navigation Routes</h2>
            <p className="text-sm text-slate-400">Browse all 12 multi-page routing destinations configured for this conclave.</p>
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
            ].map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="group block rounded-lg border border-slate-800/80 bg-slate-900/40 p-5 hover:border-amber-400/50 hover:bg-slate-850 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-400">{route.path}</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <h3 className="mt-2 text-base font-semibold text-white group-hover:text-amber-300 font-display">
                  {route.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
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
