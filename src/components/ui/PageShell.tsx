import React from 'react';

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
  children,
}) => {
  return (
    <div className="w-full bg-[#FBF9F5] text-[#18181B]">
      {/* Page Header Hero: Editorial Light warm stone surface */}
      <section className="relative overflow-hidden border-b border-[#E4E0D7] bg-[#F4F1EA] py-12 sm:py-16">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            {/* Kicker & Status in zero-pill unboxed typography */}
            <div className="flex flex-wrap items-center gap-2 type-eyebrow text-[#E8590C]">
              <span>{kicker}</span>
              {statusBadge && (
                <>
                  <span className="text-[#A1A1AA]" aria-hidden="true">·</span>
                  <span className="text-[#52525B] font-medium normal-case tracking-normal font-sans">
                    {statusBadge}
                  </span>
                </>
              )}
            </div>

            {/* Display Title in Fraunces */}
            <h1 className="type-h1 text-[#18181B] font-display text-balance">
              {title}
            </h1>

            {/* Synopsis / Description */}
            <p className="type-body text-[#52525B] leading-relaxed text-balance">
              {description}
            </p>
          </div>
        </div>
      </section>

      {/* Main Page Body Container */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {children}
      </div>
    </div>
  );
};
