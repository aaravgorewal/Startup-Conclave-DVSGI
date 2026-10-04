import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { SPONSOR_TIERS, EVENT_DATA } from '../data/content.ts';
import { Mail, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

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
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-2 max-w-2xl">
            <StatusBadge status="coming_soon" customLabel="Partnership Status" />
            <h2 className="type-h3 text-[#18181B] font-display mt-2">
              Partners & Sponsors: Announcing Soon
            </h2>
            <p className="type-body text-[#52525B] leading-relaxed">
              We are actively conversing with ecosystem enablers, corporate partners, cloud providers, and institutional networks. Confirmed sponsors will be listed transparently upon agreement execution.
            </p>
          </div>
          <Link to="/contact">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Mail className="w-4 h-4" />}
            >
              Request Sponsorship Deck
            </Button>
          </Link>
        </div>

        {/* Partnership Tiers Overview */}
        <div className="space-y-4">
          <div className="border-b border-[#E4E0D7] pb-3">
            <h3 className="type-h3 text-[#18181B] font-display">Partnership Tiers</h3>
            <p className="type-small text-[#71717A]">Structured engagement formats tailored for enterprises, startups, and community builders.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SPONSOR_TIERS.map((tier) => (
              <div key={tier.tierName} className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 flex flex-col justify-between space-y-4 shadow-xs">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="type-h4 text-[#18181B] font-display">{tier.tierName}</h4>
                    <span className="text-xs font-mono text-[#E8590C]">{tier.status}</span>
                  </div>
                  <p className="text-xs text-[#52525B] leading-relaxed">
                    {tier.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-[#E4E0D7]">
                  <a
                    href={`mailto:${EVENT_DATA.inquiries.sponsorship}?subject=Inquiry: ${tier.tierName}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E8590C] hover:text-[#C2410C]"
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-[#E4E0D7] pt-8">
          {[
            { title: "Direct Access to 300-500+ Builders", desc: "Interact directly with high-caliber engineering students, student founders, and early product teams." },
            { title: "Brand Placement & Thought Leadership", desc: "Keynote, panel representation, and prominent digital and on-campus collateral visibility." },
            { title: "Mentorship & Pipeline Synergies", desc: "Access promising deals in Western Uttar Pradesh and foster tech entrepreneurship at the grassroots." }
          ].map((item) => (
            <div key={item.title} className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-5 space-y-2">
              <h4 className="type-h4 text-[#18181B] font-display">{item.title}</h4>
              <p className="text-xs text-[#52525B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
