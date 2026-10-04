import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { SPONSOR_TIERS, EVENT_DATA } from '../data/content.ts';
import { Briefcase, Mail, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SponsorsPage: React.FC = () => {
  return (
    <PageShell
      title="Partners & Sponsors"
      kicker="Ecosystem Collaboration"
      statusBadge="Partnerships Open"
      description="Collaborate with Startup Conclave 1.0 to champion grassroots innovation, connect with technical talent, and access early-stage ventures."
    >
      <div className="space-y-12">
        {/* Honest Disclosure Card */}
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Shield className="w-4 h-4" />
              <span>Partnership Status</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Partners & Sponsors: Announcing Soon
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We are actively conversing with ecosystem enablers, corporate partners, cloud providers, and institutional networks. Confirmed sponsors will be listed transparently upon agreement execution.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-amber-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition-colors"
          >
            <Mail className="w-4 h-4" />
            <span>Request Sponsorship Deck</span>
          </Link>
        </div>

        {/* Partnership Tiers Overview */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white font-display">Partnership Tiers</h3>
            <p className="text-xs text-slate-400">Structured engagement formats tailored for enterprises, startups, and community builders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPONSOR_TIERS.map((tier) => (
              <div key={tier.tierName} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white font-display">{tier.tierName}</h4>
                    <span className="text-xs font-mono text-amber-400">{tier.status}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {tier.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-800/80">
                  <a
                    href={`mailto:${EVENT_DATA.inquiries.sponsorship}?subject=Inquiry: ${tier.tierName}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300"
                  >
                    <span>Inquire for {tier.tierName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition for Sponsors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-slate-800 pt-8">
          {[
            { title: "Direct Access to 300-500+ Builders", desc: "Interact directly with high-caliber engineering students, student founders, and early product teams." },
            { title: "Brand Placement & Thought Leadership", desc: "Keynote, panel representation, and prominent digital and on-campus collateral visibility." },
            { title: "Mentorship & Pipeline Synergies", desc: "Access promising deals in Western Uttar Pradesh and foster tech entrepreneurship at the grassroots." }
          ].map((item) => (
            <div key={item.title} className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-5 space-y-2">
              <h4 className="text-sm font-semibold text-white font-display">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
