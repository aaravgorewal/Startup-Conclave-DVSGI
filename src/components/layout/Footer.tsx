import React from 'react';
import { Link } from 'react-router-dom';
import { EVENT_DATA } from '../../data/content.ts';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800 bg-[#06090f] text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand & Mission column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-white font-display hover:text-amber-400 transition-colors">
              {EVENT_DATA.name}
            </Link>
            <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
              {EVENT_DATA.theme.join(' · ')}
            </p>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              {EVENT_DATA.description}
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="text-slate-300 font-medium">{EVENT_DATA.venueName}</p>
              <p>{EVENT_DATA.venueAddress}</p>
              <p className="text-amber-400/90 font-medium pt-1">
                Status: {EVENT_DATA.dates.display}
              </p>
            </div>
          </div>

          {/* Quick links: Program */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Conclave
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors">
                  About Event
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="hover:text-amber-400 transition-colors">
                  2-Day Schedule
                </Link>
              </li>
              <li>
                <Link to="/speakers" className="hover:text-amber-400 transition-colors">
                  Speakers Lineup
                </Link>
              </li>
              <li>
                <Link to="/venue" className="hover:text-amber-400 transition-colors">
                  Venue & Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links: Opportunities */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Opportunities
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/pitch" className="hover:text-amber-400 transition-colors">
                  Pitch Arena
                </Link>
              </li>
              <li>
                <Link to="/investors" className="hover:text-amber-400 transition-colors">
                  Investors & Jury
                </Link>
              </li>
              <li>
                <Link to="/startups" className="hover:text-amber-400 transition-colors">
                  Startup Showcase
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="hover:text-amber-400 transition-colors">
                  Partner / Sponsor
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick links: Support & Participation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Participate
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs">
              <li>
                <Link to="/register" className="text-amber-400 font-medium hover:underline">
                  Attendee Registration
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-amber-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">
                  Contact Committee
                </Link>
              </li>
              <li className="pt-2 text-slate-400">
                <span>Inquiries: </span>
                <a href={`mailto:${EVENT_DATA.contactEmail}`} className="text-slate-300 hover:text-white underline">
                  {EVENT_DATA.contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Legal note */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center md:text-left leading-relaxed">
            <span className="font-semibold text-slate-300">Notice:</span> Event dates, registration fees, speaker schedule, and partner commitments are subject to ongoing curation and formal university scheduling.
          </p>
          <p className="shrink-0 text-slate-400">
            © {new Date().getFullYear()} {EVENT_DATA.name} · DVSIET Meerut. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
