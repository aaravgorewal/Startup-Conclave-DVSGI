import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { PITCH_ARENA_STATUS } from '../data/content.ts';
import { Trophy, Presentation, CheckCircle, Clock } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

export const PitchArenaPage: React.FC = () => {
  return (
    <PageShell
      title="Pitch Arena 1.0"
      kicker="Flagship Startup Competition"
      statusBadge="Applications Opening Soon"
      description="Where high-potential ventures take the main stage before institutional investors and angel juries to compete, pitch, and secure capital access."
    >
      <div className="space-y-12">
        {/* Prize Pool & Status Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <StatusBadge status="coming_soon" customLabel={PITCH_ARENA_STATUS.badge} />
            <h2 className="type-h2 text-[#18181B] font-display">
              {PITCH_ARENA_STATUS.status}
            </h2>
            <p className="type-body text-[#52525B] leading-relaxed">
              {PITCH_ARENA_STATUS.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#71717A]">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                5 Min Pitch + 3 Min Live Jury Q&A
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle className="w-3.5 h-3.5 text-[#E8590C]" />
                Physical Presentation at DVSIET Auditorium
              </span>
            </div>
          </div>

          {/* Prize pool honest placeholder */}
          <div className="rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xs">
            <div>
              <div className="w-10 h-10 rounded-[3px] bg-white border border-[#FED7AA] flex items-center justify-center text-[#E8590C] mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="type-eyebrow text-[#9A3412]">
                Prize Pool & Grants
              </h3>
              <p className="mt-2 text-lg font-bold text-[#9A3412] font-display">
                {PITCH_ARENA_STATUS.prizePoolStatus}
              </p>
              <p className="mt-1 text-xs text-[#71717A] leading-relaxed">
                Cash prizes, incubation grants, and credits currently in pledge finalization with ecosystem partners.
              </p>
            </div>
            <div className="text-xs text-[#71717A] pt-3 border-t border-[#FED7AA]/50 font-sans">
              Honest disclosure · No fabricated numbers
            </div>
          </div>
        </div>

        {/* 3 Evaluation Stages */}
        <div className="space-y-4">
          <h3 className="type-h3 text-[#18181B] font-display">
            Competition Process & Evaluation Flow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PITCH_ARENA_STATUS.stages.map((stage) => (
              <div key={stage.step} className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-2 shadow-xs">
                <span className="text-xs font-mono text-[#E8590C]">STAGE {stage.step}</span>
                <h4 className="type-h4 text-[#18181B] font-display">{stage.name}</h4>
                <p className="text-xs text-[#52525B] leading-relaxed">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form Shell placeholder */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="type-h4 text-[#18181B] font-display">
                Pitch Arena Application Form
              </h3>
              <p className="text-xs text-[#52525B] mt-0.5">
                The comprehensive startup entry questionnaire will activate once registrations go live.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#E8590C]">
              <span>Form Shell Ready</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
