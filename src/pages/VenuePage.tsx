import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { MapPin, Navigation, Train, Bus, Car } from 'lucide-react';

export const VenuePage: React.FC = () => {
  return (
    <PageShell
      title="Venue & Campus Logistics"
      kicker="DVSIET Meerut"
      statusBadge="In-Person Campus"
      description="Hosted across the state-of-the-art academic and auditorium facilities at Dewan V.S. Institute of Engineering & Technology, Meerut, UP."
    >
      <div className="space-y-12">
        {/* Campus Overview & Address */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 rounded-xl border border-slate-800 bg-[#0c121d] p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <MapPin className="w-4 h-4" />
              <span>Campus Location</span>
            </div>
            <h2 className="text-2xl font-bold text-white font-display">
              {EVENT_DATA.venueName}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Dewan V.S. Institute of Engineering & Technology (DVSIET) is a premier engineering institution situated strategically along the Delhi-Meerut highway corridor. With auditoriums, seminar halls, and incubation corridors, DVSIET offers modern infrastructure for Startup Conclave 1.0.
            </p>
            <div className="pt-2 text-xs text-slate-400 border-t border-slate-800 space-y-1">
              <p className="text-slate-200 font-medium">Postal Address:</p>
              <p>{EVENT_DATA.venueAddress}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-base font-semibold text-white font-display">
              Venue Quick Reference
            </h3>
            <ul className="text-xs text-slate-300 space-y-2.5">
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Institution:</span>
                <span className="font-medium text-white">{EVENT_DATA.venueInstitution}</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">City / State:</span>
                <span className="font-medium text-white">{EVENT_DATA.venueCity}, {EVENT_DATA.venueState}</span>
              </li>
              <li className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Country:</span>
                <span className="font-medium text-white">{EVENT_DATA.venueCountry}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-slate-500">Event Mode:</span>
                <span className="font-medium text-amber-400">Physical / On-Campus</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transit & Commute Guide */}
        <div className="space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white font-display">How to Reach DVSIET</h3>
            <p className="text-xs text-slate-400">Accessible through highway expressways and regional rail networks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <div className="w-8 h-8 rounded bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white font-display">By Road / Expressway</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Seamlessly connected from Delhi NCR via Delhi-Meerut Expressway (NE-3). DVSIET is located right off NH-58 Bypass Road at Partapur.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <div className="w-8 h-8 rounded bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Train className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white font-display">By Rapid Rail (RRTS) / Train</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Rapid transit connectivity via Namo Bharat (Delhi-Meerut RRTS corridor) to Meerut South station, followed by brief local commute. Meerut City Railway Station is also well connected.
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3">
              <div className="w-8 h-8 rounded bg-amber-400/10 text-amber-400 flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-semibold text-white font-display">Intercity Bus Transit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Regular direct interstate and UP State Roadways buses halt at Bhainsali Bus Stand and Partapur intersection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
