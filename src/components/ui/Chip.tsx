import React from 'react';

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  count?: number | string;
}

/**
 * Chip: Functional interactive button control for filter bars & segmented selectors.
 * (Allowed under frontend-design rules as an interactive filter button with click handler).
 */
export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  count,
  className = '',
  ...props
}) => {
  return (
    <button
      type="button"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium font-sans rounded-[3px] border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:ring-offset-1 select-none min-h-[32px] ${
        active
          ? 'bg-[#18181B] text-[#FBF9F5] border-[#18181B] shadow-xs'
          : 'bg-white text-[#52525B] border-[#E4E0D7] hover:border-[#18181B] hover:text-[#18181B]'
      } ${className}`}
      {...props}
    >
      <span>{children}</span>
      {count !== undefined && (
        <span
          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
            active
              ? 'bg-white/20 text-[#FBF9F5]'
              : 'bg-[#F4F1EA] text-[#71717A]'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};
