import React, { useState } from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { FAQS } from '../data/content.ts';
import { ChevronDown, HelpCircle } from 'lucide-react';

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
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] divide-y divide-slate-800/80">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="p-5 sm:p-6 transition-colors">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-start justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-amber-400 focus-visible:rounded"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-white font-display">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-slate-300 leading-relaxed pr-6">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-5 text-center text-xs text-slate-400">
          <span>Still have a question? Contact the team at </span>
          <a href="mailto:conclave@dvsiet.ac.in" className="text-amber-400 hover:underline font-medium">
            conclave@dvsiet.ac.in
          </a>
        </div>
      </div>
    </PageShell>
  );
};
