import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Editorial Light Button Primitive
 * Complies with Direction B specifications:
 * - Primary: Solid Carbon Ink (#18181B) with Terracotta (#E8590C) hover
 * - Secondary: Bordered crisp paper surface with ink text
 * - Ghost: Clean text with subtle warm hover
 * - Corner radius: rounded-xs (2px-3px)
 * - Mobile-first touch target >= 44px on md/lg or 36px on sm
 * - High contrast WCAG AA and focus-visible rings
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold font-sans rounded-[3px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.99] whitespace-nowrap';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3.5 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-xs sm:text-sm px-5 py-2.5 min-h-[44px] gap-2',
      lg: 'text-sm sm:text-base px-6 py-3.5 min-h-[48px] gap-2.5',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#18181B] text-[#FBF9F5] hover:bg-[#E8590C] shadow-xs active:bg-[#C2410C]',
      secondary:
        'bg-white text-[#18181B] border border-[#E4E0D7] hover:border-[#18181B] hover:bg-[#F4F1EA] shadow-xs',
      ghost:
        'bg-transparent text-[#18181B] hover:bg-[#F4F1EA] hover:text-[#E8590C]',
    };

    const isButtonDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isButtonDisabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin shrink-0 text-current" />
        )}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
