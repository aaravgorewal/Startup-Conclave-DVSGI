import React, { useState } from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { FAQS } from '../data/content.ts';
import { ChevronDown } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <PageShell
      title="Frequently Asked Questions"
      kicker="Clarity & Information"
      statusBadge="Verified Answers"
      description="Everything you need to know about Startup Conclave 1.0, event logistics, participation eligibility, and key timelines."
    >
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white divide-y divide-[#E4E0D7] shadow-xs">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="p-5 sm:p-6 transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-start justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] rounded-[2px]"
                  aria-expanded={isOpen}
                >
                  <span className="type-h4 text-[#18181B] font-display">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#71717A] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#E8590C]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-[#52525B] leading-relaxed pr-6 border-t border-[#EFECE6] pt-3">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-5 text-center text-xs text-[#52525B]">
          <span>Still have a question? Contact the team at </span>
          <a href="mailto:conclave@dvsiet.ac.in" className="text-[#E8590C] hover:underline font-semibold">
            conclave@dvsiet.ac.in
          </a>
        </div>
      </div>
    </PageShell>
  );
};
