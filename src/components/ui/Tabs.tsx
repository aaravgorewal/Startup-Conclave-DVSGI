import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'segmented' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  className = '',
}) => {
  if (variant === 'underline') {
    return (
      <div
        role="tablist"
        className={`flex items-center gap-6 border-b border-[#E4E0D7] overflow-x-auto ${className}`}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-xs sm:text-sm font-semibold transition-colors relative whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] ${
                isActive
                  ? 'text-[#18181B]'
                  : 'text-[#71717A] hover:text-[#18181B]'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="ml-2 text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[#F4F1EA] text-[#52525B]">
                  {tab.badge}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E8590C]" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      role="tablist"
      className={`inline-flex items-center gap-1 p-1 bg-[#F4F1EA] rounded-[4px] border border-[#E4E0D7] overflow-x-auto ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-[3px] transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] ${
              isActive
                ? 'bg-white text-[#18181B] shadow-xs'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-[2px] ${
                  isActive ? 'bg-[#F4F1EA] text-[#18181B]' : 'text-[#71717A]'
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
