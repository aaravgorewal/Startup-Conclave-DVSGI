import React from 'react';

export interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  action?: React.ReactNode;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  action,
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div
      className={`w-full flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E4E0D7] ${
        isCenter ? 'text-center md:flex-col md:items-center' : 'text-left'
      } ${className}`}
    >
      <div className={`space-y-2 max-w-3xl ${isCenter ? 'mx-auto' : ''}`}>
        {eyebrow && (
          <div className="type-eyebrow">
            {eyebrow}
          </div>
        )}
        <h2 className="type-h2 text-[#18181B] font-display text-balance">
          {title}
        </h2>
        {description && (
          <p className="type-body text-[#52525B] leading-relaxed text-balance">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0 mt-2 md:mt-0">{action}</div>}
    </div>
  );
};
