import React from 'react';

export type BadgeVariant = 'neutral' | 'accent' | 'outline' | 'subtle';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    neutral: 'bg-[#F4F1EA] text-[#18181B] border-[#E4E0D7]',
    accent: 'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
    outline: 'bg-white text-[#52525B] border-[#E4E0D7]',
    subtle: 'bg-transparent text-[#71717A] border-transparent',
  };

  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium font-sans px-2 py-0.5 rounded-[2px] border ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};
