import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { SCHEDULE_PREVIEW, EVENT_DATA } from '../data/content.ts';
import { Clock, Calendar } from 'lucide-react';

export const SchedulePage: React.FC = () => {
  return (
    <PageShell
      title="2-Day Conclave Schedule"
      kicker="Program Flow"
      statusBadge="Timetable Announcing Soon"
      description="An outline of the two-day immersive schedule combining keynote tracks, technical workshops, live pitch rounds, and ecosystem networking."
    >
      <div className="space-y-10">
        {/* Notice Card */}
        <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 p-4 sm:p-5 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-amber-300">Schedule in Curation: </span>
            <span className="text-slate-300">
              The finalized hour-by-hour agenda, confirmed session speakers, and hall allocations are being scheduled. The track structure below outlines the two-day itinerary flow.
            </span>
          </div>
        </div>

        {/* 2-Day Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SCHEDULE_PREVIEW.map((day) => (
            <div key={day.dayNumber} className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                  <span>DAY 0{day.dayNumber}</span>
                  <span className="text-slate-500 font-sans">{day.status}</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-white font-display">
                  {day.dayTitle}
                </h2>
              </div>

              <div className="space-y-4">
                {day.tracks.map((track, i) => (
                  <div key={track.id} className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Track {i + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-500">Details Announcing Soon</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-100 font-display">
                      {track.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {track.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};
