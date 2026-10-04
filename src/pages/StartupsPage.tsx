import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { STARTUPS_STATUS } from '../data/content.ts';
import { Rocket, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

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
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4E0D7] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C]">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <StatusBadge status="coming_soon" customLabel={STARTUPS_STATUS.badge} size="sm" />
                <h2 className="type-h3 text-[#18181B] font-display mt-1">{STARTUPS_STATUS.status}</h2>
              </div>
            </div>
            <Link to="/contact">
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Pre-register Showcase Interest
              </Button>
            </Link>
          </div>

          <p className="type-body text-[#52525B] leading-relaxed">
            {STARTUPS_STATUS.description}
          </p>

          {/* Criteria Checklist */}
          <div className="space-y-3 pt-2">
            <h3 className="type-eyebrow text-[#71717A]">
              Eligibility & Selection Criteria
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STARTUPS_STATUS.criteria.map((item, idx) => (
                <div key={idx} className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#18181B] leading-relaxed">{item}</p>
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
            <div key={item.title} className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-2 shadow-xs">
              <h4 className="type-h4 text-[#18181B] font-display">{item.title}</h4>
              <p className="text-xs text-[#52525B] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
