import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, id, disabled, checked, className = '', onChange, ...props }, ref) => {
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`text-left space-y-1 ${className}`}>
        <label
          htmlFor={checkboxId}
          className={`flex items-start gap-3 cursor-pointer select-none ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              checked={checked}
              disabled={disabled}
              onChange={onChange}
              className="peer sr-only"
              {...props}
            />
            <div className="w-4 h-4 rounded-[2px] border border-[#E4E0D7] bg-white transition-colors peer-checked:bg-[#18181B] peer-checked:border-[#18181B] peer-focus-visible:ring-2 peer-focus-visible:ring-[#E8590C] peer-focus-visible:ring-offset-2 flex items-center justify-center">
              <Check className="w-3 h-3 text-[#FBF9F5] stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-medium text-[#18181B] font-sans leading-tight block">
              {label}
            </span>
            {description && (
              <span className="text-xs text-[#71717A] block leading-normal">
                {description}
              </span>
            )}
          </div>
        </label>

        {error && (
          <p className="text-xs text-red-600 font-sans pl-7" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
