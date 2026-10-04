import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  asLink?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showMark?: boolean;
}

/**
 * Themeable Logo Slot for Startup Conclave 1.0
 * 
 * NOTE: The official branding & emblem are NOT yet final.
 * This component provides an adaptable slot rendering the official text wordmark
 * "STARTUP CONCLAVE 1.0" alongside a clean, geometric placeholder mark.
 */
export const Logo: React.FC<LogoProps> = ({
  asLink = true,
  size = 'md',
  className = '',
  showMark = true,
}) => {
  const sizeConfig = {
    sm: {
      mark: 'w-6 h-6',
      title: 'text-sm sm:text-base font-bold tracking-tight',
      sub: 'text-[9px] tracking-widest',
    },
    md: {
      mark: 'w-8 h-8',
      title: 'text-base sm:text-lg font-bold tracking-tight',
      sub: 'text-[10px] tracking-widest',
    },
    lg: {
      mark: 'w-10 h-10',
      title: 'text-xl sm:text-2xl font-bold tracking-tight',
      sub: 'text-xs tracking-widest',
    },
  };

  const currentSize = sizeConfig[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 group ${className}`}>
      {/* Clean Geometric Placeholder Mark (Apex / Intersecting Angle) */}
      {showMark && (
        <div
          className={`${currentSize.mark} shrink-0 bg-[#18181B] text-[#FBF9F5] flex items-center justify-center rounded-[3px] border border-[#E4E0D7] shadow-xs group-hover:bg-[#E8590C] transition-colors`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4/5 h-4/5"
          >
            {/* Minimalist 4-pillar geometric chevron/apex icon */}
            <path d="M12 3L4 19h16L12 3z" />
            <path d="M12 11v8" />
          </svg>
        </div>
      )}

      {/* Official Text Wordmark */}
      <div className="flex flex-col text-left">
        <span
          className={`${currentSize.title} text-[#18181B] font-display uppercase leading-tight group-hover:text-[#E8590C] transition-colors`}
        >
          STARTUP CONCLAVE 1.0
        </span>
        <span
          className={`${currentSize.sub} text-[#71717A] uppercase font-semibold font-sans leading-none mt-0.5`}
        >
          DVSIET Meerut · 2026
        </span>
      </div>
    </div>
  );

  if (asLink) {
    return (
      <Link
        to="/"
        className="inline-block focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:rounded-[2px] transition-opacity hover:opacity-90"
        aria-label="Startup Conclave 1.0 Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};
