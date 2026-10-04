import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export interface CTABandProps {
  eyebrow?: string;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  note?: string;
  className?: string;
}

export const CTABand: React.FC<CTABandProps> = ({
  eyebrow = 'TAKE ACTION',
  title,
  description,
  primaryAction,
  secondaryAction,
  note,
  className = '',
}) => {
  return (
    <section
      className={`relative overflow-hidden rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-8 sm:p-12 text-left ${className}`}
    >
      <div className="relative z-10 max-w-3xl space-y-4">
        {eyebrow && (
          <div className="type-eyebrow">
            {eyebrow}
          </div>
        )}
        <h2 className="type-h2 text-[#18181B] font-display text-balance">
          {title}
        </h2>
        <p className="type-body text-[#52525B] leading-relaxed max-w-2xl text-balance">
          {description}
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          {primaryAction.href ? (
            <a
              href={primaryAction.href}
              className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#18181B] px-6 py-3 text-xs sm:text-sm font-semibold text-[#FBF9F5] hover:bg-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:ring-offset-2 min-h-[44px]"
            >
              <span>{primaryAction.label}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          ) : (
            <button
              type="button"
              onClick={primaryAction.onClick}
              className="inline-flex items-center justify-center gap-2 rounded-[3px] bg-[#18181B] px-6 py-3 text-xs sm:text-sm font-semibold text-[#FBF9F5] hover:bg-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:ring-offset-2 min-h-[44px]"
            >
              <span>{primaryAction.label}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}

          {secondaryAction &&
            (secondaryAction.href ? (
              <a
                href={secondaryAction.href}
                className="inline-flex items-center justify-center rounded-[3px] border border-[#E4E0D7] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-[#18181B] hover:border-[#18181B] hover:bg-[#FBF9F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px]"
              >
                {secondaryAction.label}
              </a>
            ) : (
              <button
                type="button"
                onClick={secondaryAction.onClick}
                className="inline-flex items-center justify-center rounded-[3px] border border-[#E4E0D7] bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-[#18181B] hover:border-[#18181B] hover:bg-[#FBF9F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px]"
              >
                {secondaryAction.label}
              </button>
            ))}
        </div>

        {note && (
          <p className="pt-2 text-xs text-[#71717A] font-sans">
            {note}
          </p>
        )}
      </div>
    </section>
  );
};
