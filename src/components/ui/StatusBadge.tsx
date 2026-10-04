import React from 'react';

export type StatusVariant = 'confirmed' | 'invited' | 'coming_soon';

interface StatusBadgeProps {
  status: StatusVariant;
  customLabel?: string;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * StatusBadge Component
 * Variants: Confirmed, Invited, Coming Soon
 * Strictly compliant with WCAG AA contrast and zero-pill discipline.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customLabel,
  size = 'md',
  className = '',
}) => {
  const configs: Record<
    StatusVariant,
    { label: string; dot: string; container: string }
  > = {
    confirmed: {
      label: customLabel || 'Confirmed',
      dot: 'bg-emerald-600',
      container:
        'bg-emerald-50 text-emerald-900 border-emerald-200/80',
    },
    invited: {
      label: customLabel || 'Invited',
      dot: 'bg-blue-600',
      container:
        'bg-blue-50 text-blue-900 border-blue-200/80',
    },
    coming_soon: {
      label: customLabel || 'Coming Soon',
      dot: 'bg-[#E8590C]',
      container:
        'bg-[#FFF7ED] text-[#9A3412] border-[#FED7AA]',
    },
  };

  const current = configs[status];
  const sizeStyles =
    size === 'sm'
      ? 'text-[11px] px-2 py-0.5 gap-1.5'
      : 'text-xs px-2.5 py-1 gap-2';

  return (
    <span
      className={`inline-flex items-center font-medium font-sans border rounded-[3px] tracking-normal ${sizeStyles} ${current.container} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`}
        aria-hidden="true"
      />
      <span>{current.label}</span>
    </span>
  );
};
