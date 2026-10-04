import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, MapPin, Calendar, Users, Sparkles } from 'lucide-react';
import { EVENT_DATA } from '../../data/content.ts';
import { Button } from '../ui/Button.tsx';
import { StatusBadge } from '../ui/StatusBadge.tsx';

export interface HeroProps {
  eyebrow?: string;
  headline?: React.ReactNode;
  subheadline?: string;
  primaryCta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  ghostCta?: {
    label: string;
    href: string;
    onClick?: () => void;
  };
  statusNote?: string;
  showPillars?: boolean;
  className?: string;
}

/**
 * Editorial Light Hero Section Primitive
 * 
 * High-impact, responsive hero section adhering to Direction B specifications:
 * - Warm alabaster / subdued stone background with bookbinding hairline border
 * - Expressive Fraunces display typography with italicized serif emphasis
 * - High-contrast carbon ink text (#18181B) & terracotta highlights (#E8590C)
 * - Zero-pill unboxed metadata with typographic separators (·)
 * - Mobile-first layout (360px+ ready) with accessible 44px+ touch targets
 * - Two CTAs: Primary (Solid Carbon Ink) and Ghost
 */
export const Hero: React.FC<HeroProps> = ({
  eyebrow = "DVSIET MEERUT · INAUGURAL EDITION",
  headline,
  subheadline = EVENT_DATA.description,
  primaryCta = {
    label: "Register Attendee Pass",
    href: "/register",
  },
  ghostCta = {
    label: "Explore Pitch Arena",
    href: "/pitch",
  },
  statusNote = EVENT_DATA.dates.display,
  showPillars = true,
  className = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden border-b border-[#E4E0D7] bg-[#F4F1EA] py-14 sm:py-20 lg:py-28 ${className}`}
    >
      {/* Editorial Watermark / Subtle Texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#18181B 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Main Hero Column */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            {/* Unboxed Metadata Eyebrow */}
            <div className="flex flex-wrap items-center gap-2 type-eyebrow text-[#E8590C]">
              <span>{eyebrow}</span>
              <span className="text-[#A1A1AA]" aria-hidden="true">·</span>
              <span className="text-[#52525B] font-medium normal-case tracking-normal font-sans">
                2-Day In-Person Conclave
              </span>
              <span className="text-[#A1A1AA]" aria-hidden="true">·</span>
              <StatusBadge status="coming_soon" customLabel={statusNote} size="sm" />
            </div>

            {/* Compelling Display Headline */}
            <h1 className="type-display text-[#18181B] font-display text-balance leading-[1.06]">
              {headline || (
                <>
                  Where Ideas Meet{' '}
                  <span className="text-[#E8590C] italic font-normal">Capital</span>.
                  <br className="hidden sm:inline" />
                  Where Innovation Meets{' '}
                  <span className="italic font-normal">Opportunity</span>.
                </>
              )}
            </h1>

            {/* Compelling Subheadline */}
            <p className="type-body text-[#52525B] max-w-2xl leading-relaxed text-balance text-base sm:text-lg">
              {subheadline}
            </p>

            {/* Target Audience / Scope note */}
            <div className="flex items-center gap-2 text-xs text-[#71717A] pt-1 font-sans">
              <Users className="w-4 h-4 text-[#E8590C] shrink-0" />
              <span>{EVENT_DATA.capacityTarget} · Students, Early Founders, Venture Jury & Mentors</span>
            </div>

            {/* Two Action Buttons: Primary & Ghost */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Link to={primaryCta.href} onClick={primaryCta.onClick}>
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowUpRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  {primaryCta.label}
                </Button>
              </Link>

              <Link to={ghostCta.href} onClick={ghostCta.onClick}>
                <Button
                  variant="ghost"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4 text-[#E8590C]" />}
                  className="w-full sm:w-auto border border-transparent hover:border-[#E4E0D7]"
                >
                  {ghostCta.label}
                </Button>
              </Link>
            </div>

            {/* Trust Disclosures */}
            <div className="pt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#71717A] font-sans">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                {EVENT_DATA.venueName}, Meerut
              </span>
              <span className="text-[#A1A1AA] hidden sm:inline" aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E8590C]" />
                Registration Fee: {EVENT_DATA.registrationFee.display}
              </span>
            </div>
          </div>

          {/* Editorial Highlight Feature Card */}
          <div className="lg:col-span-4">
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 space-y-5 shadow-paper text-left">
              <div className="border-b border-[#E4E0D7] pb-4 space-y-1">
                <div className="type-eyebrow text-[#E8590C]">
                  THE CONCLAVE ARCHITECTURE
                </div>
                <h3 className="type-h3 text-[#18181B] font-display">
                  Four Pillars of Scale
                </h3>
              </div>

              <div className="space-y-3.5 text-xs text-[#52525B]">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#E8590C] shrink-0 mt-0.5">01</span>
                  <div>
                    <strong className="text-[#18181B] block font-sans">BUILD</strong>
                    Practical toolkits for student engineers and makers.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#E8590C] shrink-0 mt-0.5">02</span>
                  <div>
                    <strong className="text-[#18181B] block font-sans">CONNECT</strong>
                    Direct networking across regional founders and mentors.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#E8590C] shrink-0 mt-0.5">03</span>
                  <div>
                    <strong className="text-[#18181B] block font-sans">PITCH</strong>
                    Mainstage investor jury presentation rounds.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-[#E8590C] shrink-0 mt-0.5">04</span>
                  <div>
                    <strong className="text-[#18181B] block font-sans">SCALE</strong>
                    Go-to-market strategies and venture syndication.
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E4E0D7] flex items-center justify-between text-xs">
                <span className="text-[#71717A]">Curated at DVSIET</span>
                <Link
                  to="/about"
                  className="font-semibold text-[#E8590C] hover:text-[#C2410C] inline-flex items-center gap-1"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
