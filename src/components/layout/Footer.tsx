import React from 'react';
import { Link } from 'react-router-dom';
import { EVENT_DATA } from '../../data/content.ts';
import { Logo } from '../ui/Logo.tsx';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E4E0D7] bg-[#F4F1EA] text-[#52525B] text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" asLink={true} />
            <p className="type-eyebrow text-[#E8590C]">
              {EVENT_DATA.theme.join(' · ')}
            </p>
            <p className="text-xs sm:text-sm text-[#52525B] max-w-md leading-relaxed">
              {EVENT_DATA.description}
            </p>
            <div className="pt-2 text-xs text-[#71717A] space-y-1">
              <p className="text-[#18181B] font-semibold">{EVENT_DATA.venueName}</p>
              <p>{EVENT_DATA.venueAddress}</p>
              <p className="text-[#E8590C] font-medium pt-1">
                Status: {EVENT_DATA.dates.display}
              </p>
            </div>
          </div>

          {/* Quick links: Program */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Conclave
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-[#E8590C] transition-colors">
                  About Event
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-[#E8590C] transition-colors">
                  2-Day Schedule
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="hover:text-[#E8590C] transition-colors">
                  Speakers Lineup
                </Link>
              </li>
              <li>
                <Link to="/venue" className="hover:text-[#E8590C] transition-colors">
                  Venue & Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links: Opportunities */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Opportunities
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/pitch" className="hover:text-[#E8590C] transition-colors">
                  Pitch Arena
                </Link>
              </li>
              <li>
                <Link to="/investors" className="hover:text-[#E8590C] transition-colors">
                  Investors & Jury
                </Link>
              </li>
              <li>
                <Link to="/startups" className="hover:text-[#E8590C] transition-colors">
                  Startup Showcase
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="hover:text-[#E8590C] transition-colors">
                  Partner / Sponsor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links: Support & Participation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Participate
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/register" className="text-[#E8590C] font-semibold hover:underline">
                  Attendee Registration
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#E8590C] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E8590C] transition-colors">
                  Contact Committee
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-[#E8590C] transition-colors font-medium">
                  Design System Specimen
                </Link>
              </li>
              <li className="pt-2 text-[#71717A]">
                <span>Inquiries: </span>
                <a href={`mailto:${EVENT_DATA.contactEmail}`} className="text-[#18181B] hover:text-[#E8590C] underline">
                  {EVENT_DATA.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Legal note */}
        <div className="mt-10 pt-6 border-t border-[#E4E0D7] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p className="text-center md:text-left leading-relaxed">
            <span className="font-semibold text-[#18181B]">Notice:</span> Event dates, registration fees, speaker schedule, and partner commitments are subject to ongoing curation and formal university scheduling.
          </p>
          <p className="shrink-0 text-[#71717A]">
            © {new Date().getFullYear()} {EVENT_DATA.name} · DVSIET Meerut. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
