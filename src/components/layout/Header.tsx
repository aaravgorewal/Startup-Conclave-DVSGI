import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { EVENT_DATA, NAV_LINKS, PRIMARY_CTA } from '../../data/content.ts';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Primary desktop nav subset (to keep 4-6 links in Zone 2 without crowding)
  const primaryDesktopLinks = [
    { name: "About", href: "/about" },
    { name: "Schedule", href: "/schedule" },
    { name: "Pitch Arena", href: "/pitch" },
    { name: "Speakers", href: "/speakers" },
    { name: "Venue", href: "/venue" },
  ];

  const secondaryDesktopLinks = [
    { name: "Investors & Jury", href: "/investors" },
    { name: "Startup Showcase", href: "/startups" },
    { name: "Partners", href: "/sponsors" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact", href: "/contact" }
  ];

  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#080c14]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center">
          <Link
            to="/"
            className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 font-display"
          >
            {EVENT_DATA.name}
          </Link>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          {primaryDesktopLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors py-1 hover:text-white relative focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 ${
                  isActive ? 'text-amber-400 font-semibold' : 'text-slate-300'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
                )}
              </Link>
            );
          })}

          {/* More Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopDropdownOpen(true)}
            onMouseLeave={() => setDesktopDropdownOpen(false)}
          >
            <button
              onClick={() => setDesktopDropdownOpen(!desktopDropdownOpen)}
              className="flex items-center gap-1 py-1 text-slate-300 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
              aria-expanded={desktopDropdownOpen}
              aria-haspopup="true"
            >
              <span>Explore</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${desktopDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {desktopDropdownOpen && (
              <div className="absolute right-0 top-full pt-2 w-52 z-50">
                <div className="rounded-lg border border-slate-800 bg-[#0d131f] p-2 shadow-xl shadow-black/50">
                  {secondaryDesktopLinks.map((subItem) => {
                    const isActive = location.pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={`block rounded-md px-3 py-2 text-xs transition-colors ${
                          isActive
                            ? 'bg-slate-800 text-amber-400 font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                        }`}
                      >
                        {subItem.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <Link
            to={PRIMARY_CTA.href}
            className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-amber-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 whitespace-nowrap active:scale-[0.98]"
          >
            <span>{PRIMARY_CTA.name}</span>
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex lg:hidden items-center justify-center p-2 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 min-h-[44px] min-w-[44px]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-[#080c14]/98 backdrop-blur-xl border-t border-slate-800 overflow-y-auto p-5 lg:hidden flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold px-3 py-2">
              Navigation
            </div>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-amber-400/10 text-amber-400 font-semibold border-l-2 border-amber-400'
                      : 'text-slate-200 hover:bg-slate-800/50 hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="text-xs font-semibold text-amber-400">Featured</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
            <div className="text-xs text-slate-400">
              <p className="font-medium text-slate-300">{EVENT_DATA.venueName}</p>
              <p>{EVENT_DATA.venueCity}, {EVENT_DATA.venueState}</p>
              <p className="text-amber-400 mt-1">{EVENT_DATA.dates.display}</p>
            </div>
            <Link
              to={PRIMARY_CTA.href}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-amber-300 transition-colors min-h-[44px]"
            >
              <span>{PRIMARY_CTA.name}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
