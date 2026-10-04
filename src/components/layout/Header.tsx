import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Handshake } from 'lucide-react';
import { Logo } from '../ui/Logo.tsx';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Scroll detection for compact header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll and trap focus when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      // Focus the close button when opened
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Escape key handler to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }

      // Focus trap inside mobile menu
      if (e.key === 'Tab' && mobileMenuOpen && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // The 9 Nav Links requested: About, Schedule, Speakers, Investors, Startups, Pitch, Partners, Venue, FAQ
  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Schedule", href: "/schedule" },
    { name: "Speakers", href: "/speakers" },
    { name: "Investors", href: "/investors" },
    { name: "Startups", href: "/startups" },
    { name: "Pitch", href: "/pitch" },
    { name: "Partners", href: "/sponsors" },
    { name: "Venue", href: "/venue" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 border-b border-[#E4E0D7] ${
          isScrolled
            ? 'h-14 sm:h-16 bg-[#FBF9F5]/92 backdrop-blur-md shadow-xs'
            : 'h-16 sm:h-20 bg-[#FBF9F5]/98 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo slot at left */}
          <div className="flex items-center shrink-0">
            <Logo size={isScrolled ? "sm" : "md"} asLink={true} />
          </div>

          {/* Desktop Nav Links (all 9 links) */}
          <nav
            aria-label="Primary navigation"
            className="hidden lg:flex items-center gap-3.5 xl:gap-5.5 text-xs xl:text-sm font-medium text-[#52525B]"
          >
            {navLinks.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`transition-colors py-1 hover:text-[#18181B] relative rounded-[2px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] whitespace-nowrap ${
                    isActive ? 'text-[#E8590C] font-semibold' : 'text-[#52525B]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-[#E8590C] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side: "Register Now" (primary) + "Become a Partner" (secondary) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/sponsors"
              className="hidden md:inline-flex items-center justify-center rounded-[3px] border border-[#E4E0D7] bg-white px-3.5 py-2 text-xs font-semibold text-[#18181B] hover:border-[#18181B] hover:bg-[#F4F1EA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] whitespace-nowrap shadow-2xs"
            >
              <Handshake className="w-3.5 h-3.5 mr-1.5 text-[#E8590C]" />
              <span>Become a Partner</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-[3px] bg-[#18181B] px-4 py-2 sm:px-4.5 sm:py-2 text-xs font-semibold text-[#FBF9F5] hover:bg-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:ring-offset-2 whitespace-nowrap active:scale-[0.98] shadow-xs"
            >
              <span>Register Now</span>
              <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
            </Link>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex lg:hidden items-center justify-center p-2 rounded-[3px] text-[#18181B] hover:bg-[#F4F1EA] border border-[#E4E0D7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px] min-w-[44px]"
              aria-label="Open navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

        </div>
      </header>

      {/* Full-Screen Mobile Drawer Menu with Focus Trap */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation Menu"
          className="fixed inset-0 z-50 bg-[#FBF9F5] flex flex-col justify-between lg:hidden animate-in fade-in duration-150"
        >
          {/* Top header of mobile overlay */}
          <div className="flex items-center justify-between px-5 h-16 border-b border-[#E4E0D7] bg-white shrink-0">
            <Logo size="sm" asLink={false} />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-[3px] text-[#18181B] hover:bg-[#F4F1EA] border border-[#E4E0D7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close menu (Press Escape)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation links with large tap targets */}
          <div className="flex-1 overflow-y-auto px-5 py-6 divide-y divide-[#E4E0D7]/70">
            <div className="type-eyebrow text-[#71717A] pb-3">
              NAVIGATION
            </div>
            {navLinks.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center justify-between py-4 text-lg font-display font-semibold transition-colors min-h-[50px] ${
                    isActive
                      ? 'text-[#E8590C] pl-2 border-l-3 border-[#E8590C]'
                      : 'text-[#18181B] hover:text-[#E8590C]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.name}</span>
                  <span className="text-xs font-mono text-[#A1A1AA]">0{navLinks.indexOf(item) + 1}</span>
                </Link>
              );
            })}

            <div className="pt-3">
              <Link
                to="/contact"
                className="flex items-center justify-between py-3 text-sm font-medium text-[#52525B] hover:text-[#18181B] min-h-[44px]"
              >
                <span>Contact Secretariat</span>
              </Link>
              <Link
                to="/design-system"
                className="flex items-center justify-between py-3 text-sm font-medium text-[#52525B] hover:text-[#18181B] min-h-[44px]"
              >
                <span>Design System Specimen</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#F4F1EA] text-[#71717A]">
                  Dev
                </span>
              </Link>
            </div>
          </div>

          {/* Pinned Bottom CTA Zone on Mobile */}
          <div className="sticky bottom-0 z-10 bg-white p-5 border-t border-[#E4E0D7] shadow-paper-lg space-y-2.5 shrink-0">
            <Link
              to="/register"
              className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-[#18181B] px-5 py-3.5 text-sm font-semibold text-[#FBF9F5] hover:bg-[#E8590C] active:scale-[0.99] transition-colors min-h-[48px] shadow-xs"
            >
              <span>Register Now</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>

            <Link
              to="/sponsors"
              className="flex w-full items-center justify-center gap-1.5 rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] px-4 py-2.5 text-xs font-semibold text-[#18181B] hover:bg-[#F4F1EA] transition-colors min-h-[42px]"
            >
              <Handshake className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>Become a Partner</span>
            </Link>

            <div className="pt-1 text-center">
              <span className="text-[11px] text-[#71717A]">
                Dewan V.S. Institute of Engineering & Technology · Meerut
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
