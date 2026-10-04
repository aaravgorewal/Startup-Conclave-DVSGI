import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverable = false,
  selected = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`rounded-[3px] border bg-white p-5 sm:p-6 shadow-xs text-left transition-all ${
        selected
          ? 'border-[#E8590C] ring-1 ring-[#E8590C]'
          : 'border-[#E4E0D7]'
      } ${
        hoverable
          ? 'hover:border-[#18181B] hover:shadow-sm cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`border-b border-[#E4E0D7] pb-3 mb-4 space-y-1 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`type-h3 text-[#18181B] font-display ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`type-small text-[#71717A] leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`space-y-3 ${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`mt-5 pt-4 border-t border-[#E4E0D7] flex items-center justify-between text-xs text-[#71717A] ${className}`} {...props}>
    {children}
  </div>
);
