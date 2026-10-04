import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'info' | 'success' | 'alert';

export interface ToastProps {
  type?: ToastType;
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className = '',
}) => {
  const configs: Record<
    ToastType,
    { icon: React.ReactNode; border: string; bg: string }
  > = {
    info: {
      icon: <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />,
      border: 'border-blue-200',
      bg: 'bg-white',
    },
    success: {
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      border: 'border-emerald-200',
      bg: 'bg-white',
    },
    alert: {
      icon: <AlertCircle className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />,
      border: 'border-[#FED7AA]',
      bg: 'bg-white',
    },
  };

  const current = configs[type];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`rounded-[3px] border ${current.border} ${current.bg} p-4 shadow-paper max-w-md flex items-start gap-3 text-left ${className}`}
    >
      {current.icon}
      <div className="flex-1 space-y-0.5">
        <h4 className="text-xs sm:text-sm font-semibold text-[#18181B] font-sans">
          {title}
        </h4>
        {message && (
          <p className="text-xs text-[#52525B] leading-relaxed">
            {message}
          </p>
        )}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-[#71717A] hover:text-[#18181B] p-1 rounded-[2px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
