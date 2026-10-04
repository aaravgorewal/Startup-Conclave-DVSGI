import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { Link } from 'react-router-dom';
import { SPEAKERS_STATUS } from '../data/content.ts';
import { Mic, ArrowRight, UserCheck } from 'lucide-react';

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
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-5">
          <div className="mx-auto w-12 h-12 rounded-full border border-amber-400/30 bg-amber-400/10 flex items-center justify-center text-amber-400">
            <Mic className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <span className="text-xs uppercase font-semibold tracking-wider text-amber-400">
              {SPEAKERS_STATUS.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">
              {SPEAKERS_STATUS.status}
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              {SPEAKERS_STATUS.description}
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-amber-400" />
              100% Verified Industry Practitioners
            </span>
            <span className="hidden sm:inline text-slate-700">·</span>
            <span>Keynotes, Firesides & Masterclasses</span>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            <p className="text-xs text-slate-400 mb-3">{SPEAKERS_STATUS.callout}</p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 hover:border-slate-600 transition-colors"
            >
              <span>Submit Speaker Proposal</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Link>
          </div>
        </div>

        {/* Categories of Speakers in curation */}
        <div className="border-t border-slate-800 pt-8">
          <h3 className="text-lg font-bold text-white font-display mb-6">
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
              <div key={track.title} className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-5 space-y-2">
                <span className="text-xs font-mono text-amber-400">TRACK FOCUS</span>
                <h4 className="text-base font-semibold text-white font-display">{track.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};
