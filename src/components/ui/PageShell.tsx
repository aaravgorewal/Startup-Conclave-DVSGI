import React from 'react';
import { Link } from 'react-router-dom';

interface PageShellProps {
  title: string;
  kicker?: string;
  description: string;
  statusBadge?: string;
  children?: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  title,
  kicker = "Startup Conclave 1.0",
  description,
  statusBadge,
  children
}) => {
  return (
    <div className="w-full">
      {/* Page Header Hero */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-[#0e1626] to-[#080c14] py-14 sm:py-20">
        {/* Subtle geometric background grid (SVG pattern, no fake imagery) */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            {/* Kicker & Status in zero-pill unboxed typography */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
              <span>{kicker}</span>
              {statusBadge && (
                <>
                  <span className="text-slate-600" aria-hidden="true">·</span>
                  <span className="text-slate-400 font-medium normal-case tracking-normal">{statusBadge}</span>
                </>
              )}
            </div>

            {/* Display Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white font-display text-balance">
              {title}
            </h1>

            {/* Synopsis / Description */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Page Body Container */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {children}
      </div>
    </div>
  );
};
