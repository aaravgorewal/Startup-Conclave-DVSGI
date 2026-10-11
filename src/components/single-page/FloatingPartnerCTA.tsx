/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, X } from 'lucide-react';

interface FloatingPartnerCTAProps {
  isModalOpen?: boolean;
}

const STORAGE_KEY = 'sc1_partner_cta_dismissed';

export const FloatingPartnerCTA: React.FC<FloatingPartnerCTAProps> = ({ isModalOpen = false }) => {
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [registerInView, setRegisterInView] = useState(false);

  // Scroll detection past hero (~600px)
  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(window.scrollY > 600);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to hide when registration form (#register) is in view
  useEffect(() => {
    const regSection = document.getElementById('register');
    if (!regSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((entry) => entry.isIntersecting);
        setRegisterInView(isVisible);
      },
      {
        threshold: 0.05,
        rootMargin: '40px 0px 40px 0px',
      }
    );

    observer.observe(regSection);
    return () => observer.disconnect();
  }, []);

  const handleDismiss = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDismissed(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // Storage unavailable or blocked; fail silently
    }
  }, []);

  // Should CTA be visible?
  const isVisible = scrolledPastHero && !registerInView && !isModalOpen && !dismissed;

  return (
    <aside
      aria-label="Partnership opportunity"
      className={`fixed z-30 transition-all duration-300 ease-out right-4 ${
        // Above mobile sticky bottom bar (64px) on small screens, standard 16px on desktop
        'bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))]'
      } ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="partner-cta-pill group flex items-center bg-[#FF6B1A] border-2 border-[#111111] shadow-[4px_4px_0px_#111111] rounded-full pl-3.5 pr-1.5 py-1 min-h-[44px]">
        {/* Main Link */}
        <a
          href="/partners"
          aria-label="Become a partner of Startup Conclave 1.0"
          className="flex items-center gap-2 font-display font-black text-xs uppercase tracking-wider text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] focus-visible:ring-offset-2 rounded-full min-h-[44px] py-2 pr-1"
        >
          <span className="hidden min-[400px]:inline select-none">Partner with us</span>
          <span className="min-[400px]:hidden select-none">Partner</span>
          <ArrowRight
            className="w-4 h-4 stroke-[3] text-[#111111] transition-transform duration-200 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </a>

        {/* Small Dismiss Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss partner announcement"
          className="ml-1 p-1.5 rounded-full text-[#111111] hover:bg-black/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#111111] min-w-[32px] min-h-[32px] flex items-center justify-center cursor-pointer transition-colors"
        >
          <X className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
        </button>
      </div>

      <style>{`
        /* Attention wiggle & shadow pulse every ~8s for 2s */
        @keyframes partnerWiggle {
          0%, 25%, 100% {
            transform: translate(0, 0);
            box-shadow: 4px 4px 0px #111111;
          }
          4% {
            transform: translate(-2px, -2px) rotate(-1deg);
            box-shadow: 6px 6px 0px #111111;
          }
          8% {
            transform: translate(1px, -1px) rotate(1.5deg);
            box-shadow: 5px 5px 0px #111111;
          }
          12% {
            transform: translate(-2px, -2px) rotate(-1deg);
            box-shadow: 6px 6px 0px #111111;
          }
          16% {
            transform: translate(1px, -1px) rotate(0.5deg);
            box-shadow: 5px 5px 0px #111111;
          }
          20% {
            transform: translate(0, 0);
            box-shadow: 4px 4px 0px #111111;
          }
        }

        .partner-cta-pill {
          animation: partnerWiggle 8s ease-in-out infinite;
          transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
        }

        .partner-cta-pill:hover,
        .partner-cta-pill:focus-within {
          animation-play-state: paused;
          transform: translate(-2px, -2px);
          box-shadow: 6px 6px 0px #111111;
        }

        .partner-cta-pill:active {
          transform: translate(2px, 2px);
          box-shadow: 2px 2px 0px #111111;
        }

        @media (prefers-reduced-motion: reduce) {
          .partner-cta-pill {
            animation: none !important;
            transition: none !important;
            transform: none !important;
          }
          .partner-cta-pill:hover,
          .partner-cta-pill:focus-within,
          .partner-cta-pill:active {
            transform: none !important;
            box-shadow: 4px 4px 0px #111111 !important;
          }
        }
      `}</style>
    </aside>
  );
};
