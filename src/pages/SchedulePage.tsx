import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Filter,
  AlertCircle,
  CalendarPlus,
  Info,
  Check,
  Sparkles,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { SESSIONS, SessionItem, SessionType, EVENT_DATA } from '../data/content.ts';

// Type Badge styling configurations adhering to WCAG AA and Editorial Light
const sessionTypeBadges: Record<
  SessionType,
  { label: string; bg: string; text: string; border: string }
> = {
  Keynote: {
    label: 'Keynote',
    bg: 'bg-[#FFF7ED]',
    text: 'text-[#9A3412]',
    border: 'border-[#FED7AA]',
  },
  Fireside: {
    label: 'Fireside Chat',
    bg: 'bg-[#FEF3C7]',
    text: 'text-[#92400E]',
    border: 'border-[#FDE68A]',
  },
  Panel: {
    label: 'Panel Discussion',
    bg: 'bg-[#EEF2FF]',
    text: 'text-[#3730A3]',
    border: 'border-[#C7D2FE]',
  },
  Workshop: {
    label: 'Workshop / Masterclass',
    bg: 'bg-[#ECFDF5]',
    text: 'text-[#065F46]',
    border: 'border-[#A7F3D0]',
  },
  Networking: {
    label: 'Networking',
    bg: 'bg-[#F0FDFA]',
    text: 'text-[#115E59]',
    border: 'border-[#99F6E4]',
  },
  Ceremony: {
    label: 'Ceremony / Address',
    bg: 'bg-[#FAF5FF]',
    text: 'text-[#581C87]',
    border: 'border-[#E9D5FF]',
  },
  Pitch: {
    label: 'Pitch Arena',
    bg: 'bg-[#FFF1F2]',
    text: 'text-[#9F1239]',
    border: 'border-[#FECDD3]',
  },
};

export const SchedulePage: React.FC = () => {
  const [activeDay, setActiveDay] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [calendarTooltipVisible, setCalendarTooltipVisible] = useState(false);

  // Available filter options
  const filterOptions: (string | SessionType)[] = [
    'All',
    'Keynote',
    'Fireside',
    'Panel',
    'Workshop',
    'Networking',
    'Ceremony',
    'Pitch',
  ];

  // Filter sessions by active day and selected type
  const daySessions = useMemo(() => {
    return SESSIONS.filter((s) => s.day === activeDay);
  }, [activeDay]);

  const filteredSessions = useMemo(() => {
    if (selectedType === 'All') return daySessions;
    return daySessions.filter((s) => s.type === selectedType);
  }, [daySessions, selectedType]);

  // Counts for Day tabs
  const day1Count = useMemo(() => SESSIONS.filter((s) => s.day === 1).length, []);
  const day2Count = useMemo(() => SESSIONS.filter((s) => s.day === 2).length, []);

  // Compute count for each type in the active day
  const getTypeCount = (type: string) => {
    if (type === 'All') return daySessions.length;
    return daySessions.filter((s) => s.type === type).length;
  };

  return (
    <PageShell
      title="2-Day Conclave Schedule"
      kicker="TIMETABLE & CURATED SESSIONS"
      statusBadge="Official Dates Announcing Soon"
      description="An end-to-end itinerary across two dedicated program phases: Day 1 (Build & Connect) and Day 2 (Pitch & Scale) at DVSIET Meerut."
    >
      <div className="space-y-8 max-w-5xl mx-auto text-left">
        
        {/* Top Control Bar: Schedule Notice + Add to Calendar Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-[3px] border border-[#E4E0D7] bg-white shadow-xs">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#E8590C] shrink-0 mt-0.5" />
            <div className="space-y-0.5 text-xs text-[#52525B]">
              <span className="font-semibold text-[#18181B] block">
                Schedule Subject to Change
              </span>
              <p>
                Session sequences, timings, speaker assignments, and hall allocations are subject to ongoing curation and university timetable synchronization. Dates are to be announced.
              </p>
            </div>
          </div>

          {/* Add to Calendar Button with Tooltip */}
          <div className="relative shrink-0 w-full sm:w-auto">
            <button
              type="button"
              disabled
              onMouseEnter={() => setCalendarTooltipVisible(true)}
              onMouseLeave={() => setCalendarTooltipVisible(false)}
              onFocus={() => setCalendarTooltipVisible(true)}
              onBlur={() => setCalendarTooltipVisible(false)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] px-4 py-2 text-xs font-semibold text-[#71717A] cursor-not-allowed select-none min-h-[40px] focus-visible:outline-none"
              aria-describedby="calendar-tooltip"
            >
              <CalendarPlus className="w-4 h-4 text-[#A1A1AA]" />
              <span>Add to Calendar</span>
            </button>

            {/* Accessible Tooltip */}
            {calendarTooltipVisible && (
              <div
                id="calendar-tooltip"
                role="tooltip"
                className="absolute right-0 top-full mt-2 w-64 rounded-[3px] border border-[#E4E0D7] bg-[#18181B] p-2.5 text-[11px] text-[#FBF9F5] shadow-paper-lg z-50 animate-in fade-in duration-150"
              >
                <div className="flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>
                    Calendar export will automatically activate once the official conclave dates are finalized.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Day 1 / Day 2 Tabs Navigation */}
        <div className="sticky top-14 sm:top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-3 bg-[#FBF9F5]/96 backdrop-blur-md border-b border-[#E4E0D7] transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Day Selector segmented buttons */}
            <div
              role="tablist"
              aria-label="Conclave Day Selection"
              className="inline-flex rounded-[3px] border border-[#E4E0D7] bg-white p-1 shadow-xs w-full sm:w-auto"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeDay === 1}
                onClick={() => {
                  setActiveDay(1);
                  setSelectedType('All');
                }}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[2px] text-xs font-semibold font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px] ${
                  activeDay === 1
                    ? 'bg-[#18181B] text-[#FBF9F5] shadow-xs'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA]'
                }`}
              >
                <span>Day 1: "Build & Connect"</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] ${
                    activeDay === 1
                      ? 'bg-white/20 text-[#FBF9F5]'
                      : 'bg-[#F4F1EA] text-[#71717A]'
                  }`}
                >
                  {day1Count}
                </span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeDay === 2}
                onClick={() => {
                  setActiveDay(2);
                  setSelectedType('All');
                }}
                className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[2px] text-xs font-semibold font-sans transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] min-h-[44px] ${
                  activeDay === 2
                    ? 'bg-[#18181B] text-[#FBF9F5] shadow-xs'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA]'
                }`}
              >
                <span>Day 2: "Pitch & Scale"</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[2px] ${
                    activeDay === 2
                      ? 'bg-white/20 text-[#FBF9F5]'
                      : 'bg-[#F4F1EA] text-[#71717A]'
                  }`}
                >
                  {day2Count}
                </span>
              </button>
            </div>

            {/* Day Focus Tag */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-[#71717A]">
              <span>PHASE {activeDay === 1 ? '01' : '02'}</span>
              <span>·</span>
              <span className="font-semibold text-[#18181B]">
                {activeDay === 1 ? 'Ideation & Networking' : 'Venture Pitching & Awards'}
              </span>
            </div>
          </div>

          {/* Filter Chips by Session Type */}
          <div className="pt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold uppercase text-[#71717A] shrink-0 mr-1 hidden sm:inline">
              Filter:
            </span>
            {filterOptions.map((type) => {
              const count = getTypeCount(type);
              const isSelected = selectedType === type;

              // Hide chip if count is 0 in the active day (except for 'All')
              if (type !== 'All' && count === 0) return null;

              return (
                <Chip
                  key={type}
                  active={isSelected}
                  onClick={() => setSelectedType(type)}
                  count={count}
                  className="shrink-0"
                >
                  {type}
                </Chip>
              );
            })}
          </div>
        </div>

        {/* Active Day Description Banner */}
        <div className="p-4 sm:p-5 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <h2 className="type-h3 text-[#18181B] font-display">
              {activeDay === 1 ? 'Day 1: "Build & Connect"' : 'Day 2: "Pitch & Scale"'}
            </h2>
            <p className="text-xs text-[#52525B]">
              {activeDay === 1
                ? 'Workshops, masterclasses, founder stories, and the open startup showcase.'
                : 'Investor keynotes, venture capital panels, mentoring clinics, and the live Pitch Arena.'}
            </p>
          </div>
          <div className="text-xs font-mono text-[#E8590C] shrink-0 font-semibold">
            {filteredSessions.length} {filteredSessions.length === 1 ? 'Session' : 'Sessions'} displayed
          </div>
        </div>

        {/* Vertical Timeline of SessionCards */}
        <div className="relative pl-4 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E4E0D7]">
          {filteredSessions.map((session, index) => {
            const badge = sessionTypeBadges[session.type];
            const speakerLabel = session.speakerSlot || 'Speaker TBA';
            const isSpeakerEmpty = !session.speakerSlot;

            return (
              <div
                key={session.id}
                className="relative group transition-all"
              >
                {/* Timeline node marker */}
                <div
                  className="absolute -left-4 sm:-left-8 top-5 w-4 h-4 rounded-full border-2 border-white bg-[#18181B] group-hover:bg-[#E8590C] transition-colors shadow-xs z-10 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                {/* Session Card */}
                <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 sm:p-6 shadow-xs hover:border-[#18181B] hover:shadow-paper transition-all text-left space-y-3.5">
                  
                  {/* Top Header: Time + Session Type Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-[#EFECE6] pb-3">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-[#18181B]">
                      <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                      <span className="font-bold">{session.time}</span>
                    </div>

                    <span
                      className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-[2px] border ${badge.bg} ${badge.text} ${badge.border}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="type-h3 text-[#18181B] font-display">
                      {session.title}
                    </h3>
                    <p className="type-body text-[#52525B] leading-relaxed text-sm">
                      {session.description}
                    </p>
                  </div>

                  {/* Metadata Footer: Speaker Slot & Campus Location */}
                  <div className="pt-3 border-t border-[#EFECE6] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                    
                    {/* Speaker Slot with honest TBA handling */}
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
                      {isSpeakerEmpty ? (
                        <span className="font-mono text-[#71717A] bg-[#F4F1EA] px-2 py-0.5 rounded-[2px] text-[11px]">
                          Speaker TBA
                        </span>
                      ) : (
                        <span className="font-semibold text-[#18181B]">
                          {speakerLabel}
                        </span>
                      )}
                    </div>

                    {/* Venue Room */}
                    {session.location && (
                      <div className="flex items-center gap-1.5 text-[#71717A]">
                        <MapPin className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                        <span>{session.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No sessions found state */}
        {filteredSessions.length === 0 && (
          <div className="p-8 text-center rounded-[3px] border border-[#E4E0D7] bg-white space-y-2">
            <p className="type-h4 text-[#18181B] font-display">No sessions found for this filter</p>
            <p className="text-xs text-[#71717A]">
              There are no "{selectedType}" sessions in Day {activeDay}.
            </p>
            <button
              type="button"
              onClick={() => setSelectedType('All')}
              className="mt-2 text-xs font-semibold text-[#E8590C] hover:underline"
            >
              Reset to all sessions
            </button>
          </div>
        )}

        {/* Bottom Context Notice */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-5 text-center text-xs text-[#52525B] space-y-1">
          <p className="font-semibold text-[#18181B]">
            Want to deliver a masterclass or participate in the Pitch Arena?
          </p>
          <p>
            Speaker and startup applications are managed by the conclave secretariat.{' '}
            <a href="/contact" className="text-[#E8590C] font-semibold hover:underline">
              Contact Organizing Committee →
            </a>
          </p>
        </div>

      </div>
    </PageShell>
  );
};
