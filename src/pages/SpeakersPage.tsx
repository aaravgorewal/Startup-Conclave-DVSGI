import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { Link } from 'react-router-dom';
import { SPEAKERS_STATUS } from '../data/content.ts';
import { Mic, ArrowRight, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

export const SpeakersPage: React.FC = () => {
  return (
    <PageShell
      title="Speakers & Mentors"
      kicker="Curated Lineup"
      statusBadge="Announcing Soon"
      description="Bringing together battle-tested startup founders, venture partners, technical innovators, and ecosystem leaders to DVSIET Meerut."
    >
      <div className="space-y-12">
        {/* Placeholder announcement card */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5 shadow-xs">
          <div className="mx-auto w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C]">
            <Mic className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <StatusBadge status="coming_soon" customLabel={SPEAKERS_STATUS.badge} />
            <h2 className="type-h2 text-[#18181B] font-display mt-2">
              {SPEAKERS_STATUS.status}
            </h2>
            <p className="type-body text-[#52525B] max-w-xl mx-auto leading-relaxed">
              {SPEAKERS_STATUS.description}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-[#71717A]">
            <span className="flex items-center gap-1.5 font-medium">
              <UserCheck className="w-4 h-4 text-[#E8590C]" />
              100% Verified Industry Practitioners
            </span>
            <span className="hidden sm:inline text-[#A1A1AA]">·</span>
            <span>Keynotes, Firesides & Masterclasses</span>
          </div>

          <div className="pt-4 border-t border-[#E4E0D7]">
            <p className="text-xs text-[#71717A] mb-3">{SPEAKERS_STATUS.callout}</p>
            <Link to="/contact">
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5 text-[#E8590C]" />}
              >
                Submit Speaker Proposal
              </Button>
            </Link>
          </div>
        </div>

        {/* Categories of Speakers in curation */}
        <div className="border-t border-[#E4E0D7] pt-8">
          <h3 className="type-h3 text-[#18181B] font-display mb-6">
            Speaker Tracks Under Curation
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                title: "Scale Founders",
                desc: "Builders who crossed 0 to 1 and scaled sustainable businesses from regional hubs."
              },
              {
                title: "Venture & Angel Investors",
                desc: "Fund managers and angel syndicates actively deploying capital across early-stage rounds."
              },
              {
                title: "Deep Tech & Product Leads",
                desc: "Engineers and product architects guiding AI, infrastructure, and hardware innovation."
              }
            ].map((track) => (
              <div key={track.title} className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-2 shadow-xs">
                <span className="type-eyebrow text-[#E8590C]">TRACK FOCUS</span>
                <h4 className="type-h4 text-[#18181B] font-display">{track.title}</h4>
                <p className="text-xs text-[#52525B] leading-relaxed">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};
