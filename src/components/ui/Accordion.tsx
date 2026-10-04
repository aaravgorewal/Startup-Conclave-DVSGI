import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenId,
  allowMultiple = false,
  className = '',
}) => {
  const [openIds, setOpenIds] = useState<string[]>(
    defaultOpenId ? [defaultOpenId] : []
  );

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div
      className={`rounded-[3px] border border-[#E4E0D7] bg-white divide-y divide-[#E4E0D7] ${className}`}
    >
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const buttonId = `accordion-btn-${item.id}`;
        const panelId = `accordion-panel-${item.id}`;

        return (
          <div key={item.id} className="transition-colors">
            <button
              id={buttonId}
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left transition-colors hover:bg-[#F4F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
            >
              <span className="type-h4 text-[#18181B] font-display">
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#71717A] shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-[#E8590C]' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 text-sm text-[#52525B] leading-relaxed border-t border-[#EFECE6] bg-[#FBF9F5]/40"
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
