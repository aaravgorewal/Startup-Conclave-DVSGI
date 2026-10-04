import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { INVESTORS_STATUS } from '../data/content.ts';
import { TrendingUp, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

export const InvestorsPage: React.FC = () => {
  return (
    <PageShell
      title="Investors & Jury: Coming Soon"
      kicker="Capital & Evaluation"
      statusBadge="Delegation In Finalization"
      description="The investor delegation and evaluation jury panel representing angel networks, venture funds, and institutional accelerators."
    >
      <div className="space-y-12">
        {/* Core Coming Soon Hero Box */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C]">
            <TrendingUp className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            <StatusBadge status="coming_soon" customLabel={INVESTORS_STATUS.badge} />
            <h2 className="type-h2 text-[#18181B] font-display">
              {INVESTORS_STATUS.title}
            </h2>
            <p className="type-body text-[#52525B] max-w-xl mx-auto leading-relaxed">
              {INVESTORS_STATUS.description}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#71717A]">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#E8590C]" />
              Confidential Curation in Progress
            </span>
            <span className="hidden sm:inline text-[#A1A1AA]">·</span>
            <span>Jury & Investor Roster to be Unveiled Prior to Pitch Rounds</span>
          </div>

          <div className="pt-4 border-t border-[#E4E0D7]">
            <p className="text-xs text-[#71717A] mb-3">
              Are you an institutional fund, angel investor, or micro-VC seeking early-stage pipeline access?
            </p>
            <Link to="/contact">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Mail className="w-3.5 h-3.5 text-[#E8590C]" />}
              >
                Connect with Investor Relations
              </Button>
            </Link>
          </div>
        </div>

        {/* Investor Categories Breakdown */}
        <div className="border-t border-[#E4E0D7] pt-8">
          <h3 className="type-h3 text-[#18181B] font-display mb-4">
            Investor Profiles Represented
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {INVESTORS_STATUS.categories.map((cat, i) => (
              <div key={cat} className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-2 shadow-xs">
                <span className="type-eyebrow text-[#E8590C]">SEGMENT 0{i + 1}</span>
                <h4 className="type-h4 text-[#18181B] font-display">{cat}</h4>
                <p className="text-xs text-[#52525B] leading-relaxed">
                  Focusing on pre-seed, seed, and proof-of-concept stages with active mentorship and syndication capacity.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};
