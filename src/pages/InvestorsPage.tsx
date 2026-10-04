import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { INVESTORS_STATUS } from '../data/content.ts';
import { TrendingUp, ShieldCheck, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6">
          <div className="mx-auto w-12 h-12 rounded-full border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-6 h-6" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-400">
              {INVESTORS_STATUS.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {INVESTORS_STATUS.title}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {INVESTORS_STATUS.description}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Confidential Curation in Progress
            </span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>Jury & Investor Roster to be Unveiled Prior to Pitch Rounds</span>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3">
              Are you an institutional fund, angel investor, or micro-VC seeking early-stage pipeline access?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 hover:border-slate-600 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Connect with Investor Relations</span>
            </Link>
          </div>
        </div>

        {/* Investor Categories Breakdown */}
        <div className="border-t border-slate-800 pt-8">
          <h3 className="text-lg font-bold text-white font-display mb-4">
            Investor Profiles Represented
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {INVESTORS_STATUS.categories.map((cat, i) => (
              <div key={cat} className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-5 space-y-2">
                <span className="text-xs font-mono text-amber-400">SEGMENT 0{i + 1}</span>
                <h4 className="text-base font-semibold text-white font-display">{cat}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
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
