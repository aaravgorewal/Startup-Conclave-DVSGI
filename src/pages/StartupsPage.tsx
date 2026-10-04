import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { STARTUPS_STATUS } from '../data/content.ts';
import { Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StartupsPage: React.FC = () => {
  return (
    <PageShell
      title="Startup Showcase 1.0"
      kicker="Exhibitor Pavilion"
      statusBadge="Applications Opening Soon"
      description="A dedicated physical corridor at DVSIET Meerut for student ventures, research spin-offs, and early innovators to showcase functional prototypes."
    >
      <div className="space-y-12">
        {/* Core Showcase Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-amber-400">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-amber-400">{STARTUPS_STATUS.badge}</span>
                <h2 className="text-xl font-bold text-white font-display">{STARTUPS_STATUS.status}</h2>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
            >
              <span>Pre-register Showcase Interest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {STARTUPS_STATUS.description}
          </p>

          {/* Criteria Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Eligibility & Selection Criteria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STARTUPS_STATUS.criteria.map((item, idx) => (
                <div key={idx} className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-300 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* What Exhibitors Get */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              title: "Physical Demo Station",
              desc: "Dedicated table display space equipped with power, connectivity, and branding signage."
            },
            {
              title: "Direct Delegate Exposure",
              desc: "Interact face-to-face with visiting investors, enterprise mentors, and prospective early adopters."
            },
            {
              title: "Pitch Arena Fast-Track",
              desc: "Top showcase performers receive priority review for the main-stage Pitch Arena rounds."
            }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-800 bg-slate-900/30 p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white font-display">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
