import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftElement,
      rightElement,
      id,
      disabled,
      className = '',
      required,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full text-left space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold text-[#18181B] font-sans"
          >
            {label}
            {required && <span className="text-[#E8590C] ml-0.5">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {leftElement && (
            <div className="absolute left-3 flex items-center pointer-events-none text-[#71717A]">
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={`w-full rounded-[3px] border bg-white px-3.5 py-2.5 text-sm text-[#18181B] placeholder:text-[#A1A1AA] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] focus-visible:border-[#E8590C] disabled:bg-[#F4F1EA] disabled:text-[#A1A1AA] disabled:cursor-not-allowed ${
              leftElement ? 'pl-9' : ''
            } ${rightElement ? 'pr-9' : ''} ${
              error
                ? 'border-red-500 focus-visible:ring-red-500'
                : 'border-[#E4E0D7] hover:border-[#18181B]'
            } ${className}`}
            {...props}
          />

          {rightElement && (
            <div className="absolute right-3 flex items-center text-[#71717A]">
              {rightElement}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-red-600 font-sans mt-1" role="alert">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-[#71717A] font-sans mt-1">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
