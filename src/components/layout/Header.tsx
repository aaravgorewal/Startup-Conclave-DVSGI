import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { EVENT_DATA, NAV_LINKS, PRIMARY_CTA } from '../../data/content.ts';
import { Logo } from '../ui/Logo.tsx';

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

  // Primary desktop nav subset
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
    { name: "Contact", href: "/contact" },
    { name: "Design System", href: "/design-system" }
  ];

  const [desktopDropdownOpen, setDesktopDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E4E0D7] bg-[#FBF9F5]/95 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Themeable Logo Slot */}
        <div className="flex items-center">
          <Logo size="sm" asLink={true} />
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#52525B]">
          {primaryDesktopLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors py-1 hover:text-[#18181B] relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] rounded-[2px] ${
                  isActive ? 'text-[#E8590C] font-semibold' : 'text-[#52525B]'
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8590C] rounded-full" />
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
              className="flex items-center gap-1 py-1 text-[#52525B] hover:text-[#18181B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] rounded-[2px]"
              aria-expanded={desktopDropdownOpen}
              aria-haspopup="true"
            >
              <span>Explore</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${desktopDropdownOpen ? 'rotate-180 text-[#E8590C]' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {desktopDropdownOpen && (
              <div className="absolute right-0 top-full pt-2 w-52 z-50">
                <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-2 shadow-paper">
                  {secondaryDesktopLinks.map((subItem) => {
                    const isActive = location.pathname === subItem.href;
                    return (
                      <Link
                        key={subItem.href}
                        to={subItem.href}
                        className={`block rounded-[2px] px-3 py-2 text-xs transition-colors ${
                          isActive
                            ? 'bg-[#FFF7ED] text-[#E8590C] font-semibold'
                            : 'text-[#52525B] hover:bg-[#F4F1EA] hover:text-[#18181B]'
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
            className="inline-flex items-center justify-center rounded-[3px] bg-[#18181B] px-4 py-2 text-xs font-semibold text-[#FBF9F5] transition-colors hover:bg-[#E8590C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:ring-offset-2 whitespace-nowrap active:scale-[0.98] shadow-xs"
          >
            <span>{PRIMARY_CTA.name}</span>
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex lg:hidden items-center justify-center p-2 rounded-[3px] text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px] min-w-[44px]"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 bg-[#FBF9F5] border-t border-[#E4E0D7] overflow-y-auto p-5 lg:hidden flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-xs uppercase tracking-wider text-[#71717A] font-semibold px-3 py-2">
              Navigation
            </div>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`flex items-center justify-between rounded-[3px] px-3 py-3 text-base font-medium transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-[#FFF7ED] text-[#E8590C] font-semibold border-l-2 border-[#E8590C]'
                      : 'text-[#18181B] hover:bg-[#F4F1EA]'
                  }`}
                >
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="text-xs font-semibold text-[#E8590C]">Featured</span>
                  )}
                </Link>
              );
            })}
            <Link
              to="/design-system"
              className="flex items-center justify-between rounded-[3px] px-3 py-3 text-base font-medium text-[#18181B] hover:bg-[#F4F1EA] min-h-[44px]"
            >
              <span>Design System</span>
              <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-[#F4F1EA] text-[#52525B]">Specimen</span>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E4E0D7] space-y-4">
            <div className="text-xs text-[#52525B]">
              <p className="font-semibold text-[#18181B]">{EVENT_DATA.venueName}</p>
              <p>{EVENT_DATA.venueCity}, {EVENT_DATA.venueState}</p>
              <p className="text-[#E8590C] font-medium mt-1">{EVENT_DATA.dates.display}</p>
            </div>
            <Link
              to={PRIMARY_CTA.href}
              className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-[#18181B] px-4 py-3 text-sm font-semibold text-[#FBF9F5] hover:bg-[#E8590C] transition-colors min-h-[44px]"
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
