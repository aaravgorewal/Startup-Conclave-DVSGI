import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { SCHEDULE_PREVIEW } from '../data/content.ts';
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
        <div className="rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] p-4 sm:p-5 flex items-start gap-3">
          <Calendar className="w-5 h-5 text-[#E8590C] shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold text-[#9A3412]">Schedule in Curation: </span>
            <span className="text-[#52525B]">
              The finalized hour-by-hour agenda, confirmed session speakers, and hall allocations are being scheduled. The track structure below outlines the two-day itinerary flow.
            </span>
          </div>
        </div>

        {/* 2-Day Previews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {SCHEDULE_PREVIEW.map((day) => (
            <div key={day.dayNumber} className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 space-y-6 shadow-xs">
              <div className="border-b border-[#E4E0D7] pb-4">
                <div className="flex items-center justify-between text-xs text-[#E8590C] font-mono">
                  <span>DAY 0{day.dayNumber}</span>
                  <span className="text-[#71717A] font-sans">{day.status}</span>
                </div>
                <h2 className="mt-2 type-h3 text-[#18181B] font-display">
                  {day.dayTitle}
                </h2>
              </div>

              <div className="space-y-4">
                {day.tracks.map((track, i) => (
                  <div key={track.id} className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-4 space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#71717A]">
                      <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                      <span className="font-semibold text-[#18181B]">Track {i + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#71717A]">Details Announcing Soon</span>
                    </div>
                    <h3 className="type-h4 text-[#18181B] font-display">
                      {track.title}
                    </h3>
                    <p className="text-xs text-[#52525B] leading-relaxed">
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
