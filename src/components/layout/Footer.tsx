import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowRight, CheckCircle2, Instagram, Linkedin, Youtube } from 'lucide-react';
import { EVENT_DATA } from '../../data/content.ts';
import { Logo } from '../ui/Logo.tsx';

// Minimalist modern X (formerly Twitter) SVG
const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setStatus('loading');
    // Simulate brief client-side submission feedback
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 600);
  };

  return (
    <footer className="border-t border-[#E4E0D7] bg-[#F4F1EA] text-[#52525B] text-sm">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8 space-y-14">
        
        {/* Top Tier: Brand, Tagline, and "Get Notified" Capture Band */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-12 border-b border-[#E4E0D7] items-start">
          
          {/* Brand & Tagline */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <Logo size="lg" asLink={true} />
            
            <p className="type-h3 text-[#18181B] font-display text-balance">
              {EVENT_DATA.tagline}
            </p>

            <p className="type-small text-[#52525B] max-w-lg leading-relaxed">
              {EVENT_DATA.description}
            </p>

            {/* Prominent Institutional Trust Badge */}
            <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-[#18181B] font-sans">
              <span className="w-2 h-2 rounded-full bg-[#E8590C]" aria-hidden="true" />
              <span>Organised at DVSIET, Meerut</span>
              <span className="text-[#A1A1AA]">·</span>
              <span className="text-[#71717A] font-normal">Western Uttar Pradesh</span>
            </div>
          </div>

          {/* "Get Notified" Email Capture Box */}
          <div className="lg:col-span-6 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 shadow-xs text-left space-y-4">
            <div className="space-y-1">
              <span className="type-eyebrow text-[#E8590C] block">
                PRIORITY NOTIFICATIONS
              </span>
              <h3 className="type-h4 text-[#18181B] font-display">
                Get notified when registration & dates go live
              </h3>
              <p className="type-small text-[#71717A]">
                Receive instant priority alerts for early-bird tickets, speaker reveals, and Pitch Arena deadlines.
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-4 rounded-[2px] border border-emerald-200 bg-emerald-50 text-emerald-900 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs leading-relaxed space-y-0.5">
                  <p className="font-semibold text-emerald-950">You're on the priority notification list!</p>
                  <p className="text-emerald-800">We will notify you immediately once official dates and registration tickets launch.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <label htmlFor="footer-email-input" className="sr-only">
                      Email address for notifications
                    </label>
                    <input
                      id="footer-email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      placeholder="Enter your email address"
                      required
                      className="w-full rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] px-3.5 py-2.5 text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:border-[#E8590C] transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex items-center justify-center gap-1.5 rounded-[3px] bg-[#18181B] px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#FBF9F5] hover:bg-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] disabled:opacity-50 shrink-0"
                  >
                    <span>{status === 'loading' ? 'Subscribing...' : 'Notify Me'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {status === 'error' && (
                  <p className="text-xs text-red-600 font-sans" role="alert">
                    {errorMessage}
                  </p>
                )}

                <p className="text-[11px] text-[#71717A] pt-1">
                  Zero spam · Strictly conclave announcements and schedule milestones.
                </p>
              </form>
            )}
          </div>

        </div>

        {/* Middle Tier: Grouped Quick Links (Event / Participate / Info) & Contact */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-10 text-left">
          
          {/* Group 1: Event */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Event
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#52525B]">
              <li>
                <Link to="/about" className="hover:text-[#E8590C] transition-colors">
                  About Conclave
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
                <Link to="/venue" className="hover:text-[#E8590C] transition-colors">
                  Venue & Travel
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 2: Participate */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Participate
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#52525B]">
              <li>
                <Link to="/register" className="font-semibold text-[#E8590C] hover:underline">
                  Register Attendee Pass
                </Link>
              </li>
              <li>
                <Link to="/pitch" className="hover:text-[#E8590C] transition-colors">
                  Pitch Arena Application
                </Link>
              </li>
              <li>
                <Link to="/sponsors" className="hover:text-[#E8590C] transition-colors">
                  Become a Partner
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E8590C] transition-colors">
                  Speaker Submissions
                </Link>
              </li>
              <li>
                <Link to="/design-system" className="hover:text-[#E8590C] transition-colors text-[#71717A]">
                  Design System Specimen
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 3: Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Info & Logistics
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-[#52525B]">
              <li>
                <Link to="/faq" className="hover:text-[#E8590C] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/venue" className="hover:text-[#E8590C] transition-colors">
                  Campus Directions & RRTS
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#E8590C] transition-colors">
                  Contact Secretariat
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#E8590C] transition-colors">
                  Code of Conduct
                </Link>
              </li>
            </ul>
          </div>

          {/* Group 4: Secretariat Contacts & Socials */}
          <div className="col-span-2 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans">
              Secretariat Desk
            </h4>
            
            <div className="space-y-2 text-xs text-[#52525B]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                <a
                  href={`mailto:${EVENT_DATA.contactEmail}`}
                  className="hover:text-[#E8590C] transition-colors underline font-medium"
                >
                  {EVENT_DATA.contactEmail}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                <span>{EVENT_DATA.helplinePhone} (10 AM – 5 PM IST)</span>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#E8590C] shrink-0 mt-0.5" />
                <span>{EVENT_DATA.venueAddress}</span>
              </div>
            </div>

            {/* Social Icons (Instagram, LinkedIn, X, YouTube) */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#71717A] block mb-2 font-sans">
                Follow Ecosystem Updates
              </span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[2px] border border-[#E4E0D7] bg-white flex items-center justify-center text-[#52525B] hover:text-[#E8590C] hover:border-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                  aria-label="Instagram profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[2px] border border-[#E4E0D7] bg-white flex items-center justify-center text-[#52525B] hover:text-[#E8590C] hover:border-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                  aria-label="LinkedIn profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>

                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[2px] border border-[#E4E0D7] bg-white flex items-center justify-center text-[#52525B] hover:text-[#E8590C] hover:border-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                  aria-label="X (formerly Twitter) profile"
                >
                  <XIcon className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-[2px] border border-[#E4E0D7] bg-white flex items-center justify-center text-[#52525B] hover:text-[#E8590C] hover:border-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                  aria-label="YouTube channel"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Tier: Disclaimer & Legal notice */}
        <div className="pt-8 border-t border-[#E4E0D7] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#71717A]">
          <p className="text-center md:text-left leading-relaxed max-w-2xl">
            <span className="font-semibold text-[#18181B]">Notice:</span> Event dates, ticket fee structures, keynote schedule, and partnership allocations are undergoing ongoing institutional approvals and will be announced transparently.
          </p>
          <p className="shrink-0 text-center md:text-right text-[#71717A]">
            © {new Date().getFullYear()} Startup Conclave 1.0 · Dewan V.S. Institute of Engineering & Technology. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
