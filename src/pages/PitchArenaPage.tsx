import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { PITCH_ARENA_STATUS } from '../data/content.ts';
import { Trophy, Presentation, ArrowRight, CheckCircle, Clock } from 'lucide-react';

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
          <div className="md:col-span-2 rounded-xl border border-slate-800 bg-[#0c121d] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Presentation className="w-4 h-4" />
              <span>{PITCH_ARENA_STATUS.badge}</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {PITCH_ARENA_STATUS.status}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              {PITCH_ARENA_STATUS.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                5 Min Pitch + 3 Min Live Jury Q&A
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                Physical Presentation at DVSIET Auditorium
              </span>
            </div>
          </div>

          {/* Prize pool honest placeholder */}
          <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div>
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-3">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Prize Pool & Grants
              </h3>
              <p className="mt-2 text-lg font-bold text-amber-400 font-display">
                {PITCH_ARENA_STATUS.prizePoolStatus}
              </p>
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                Cash prizes, incubation grants, and credits currently in pledge finalization with ecosystem partners.
              </p>
            </div>
            <div className="text-xs text-slate-500 pt-3 border-t border-amber-400/10">
              Honest disclosure · No fabricated numbers
            </div>
          </div>
        </div>

        {/* 3 Evaluation Stages */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white font-display">
            Competition Process & Evaluation Flow
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PITCH_ARENA_STATUS.stages.map((stage) => (
              <div key={stage.step} className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-2">
                <span className="text-xs font-mono text-amber-400">STAGE {stage.step}</span>
                <h4 className="text-base font-semibold text-white font-display">{stage.name}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{stage.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form Shell placeholder */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                Pitch Arena Application Form
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                The comprehensive startup entry questionnaire will activate once registrations go live.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400">
              <span>Form Shell Ready</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
