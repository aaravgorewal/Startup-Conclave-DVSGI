import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { MapPin, Train, Bus, Car } from 'lucide-react';

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
          <div className="lg:col-span-2 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="type-eyebrow text-[#E8590C] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>Campus Location</span>
            </div>
            <h2 className="type-h2 text-[#18181B] font-display">
              {EVENT_DATA.venueName}
            </h2>
            <p className="type-body text-[#52525B] leading-relaxed">
              Dewan V.S. Institute of Engineering & Technology (DVSIET) is a premier engineering institution situated strategically along the Delhi-Meerut highway corridor. With auditoriums, seminar halls, and incubation corridors, DVSIET offers modern infrastructure for Startup Conclave 1.0.
            </p>
            <div className="pt-2 text-xs text-[#71717A] border-t border-[#E4E0D7] space-y-1">
              <p className="text-[#18181B] font-semibold">Postal Address:</p>
              <p>{EVENT_DATA.venueAddress}</p>
            </div>
          </div>

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-4 shadow-xs">
            <h3 className="type-h4 text-[#18181B] font-display">
              Venue Quick Reference
            </h3>
            <ul className="text-xs text-[#52525B] space-y-2.5">
              <li className="flex justify-between border-b border-[#E4E0D7] pb-2">
                <span className="text-[#71717A]">Institution:</span>
                <span className="font-semibold text-[#18181B]">{EVENT_DATA.venueInstitution}</span>
              </li>
              <li className="flex justify-between border-b border-[#E4E0D7] pb-2">
                <span className="text-[#71717A]">City / State:</span>
                <span className="font-semibold text-[#18181B]">{EVENT_DATA.venueCity}, {EVENT_DATA.venueState}</span>
              </li>
              <li className="flex justify-between border-b border-[#E4E0D7] pb-2">
                <span className="text-[#71717A]">Country:</span>
                <span className="font-semibold text-[#18181B]">{EVENT_DATA.venueCountry}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#71717A]">Event Mode:</span>
                <span className="font-semibold text-[#E8590C]">Physical / On-Campus</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Transit & Commute Guide */}
        <div className="space-y-4">
          <div className="border-b border-[#E4E0D7] pb-3">
            <h3 className="type-h3 text-[#18181B] font-display">How to Reach DVSIET</h3>
            <p className="type-small text-[#71717A]">Accessible through highway expressways and regional rail networks.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-[2px] bg-[#FFF7ED] text-[#E8590C] flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <h4 className="type-h4 text-[#18181B] font-display">By Road / Expressway</h4>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Seamlessly connected from Delhi NCR via Delhi-Meerut Expressway (NE-3). DVSIET is located right off NH-58 Bypass Road at Partapur.
              </p>
            </div>

            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-[2px] bg-[#FFF7ED] text-[#E8590C] flex items-center justify-center">
                <Train className="w-4 h-4" />
              </div>
              <h4 className="type-h4 text-[#18181B] font-display">By Rapid Rail (RRTS) / Train</h4>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Rapid transit connectivity via Namo Bharat (Delhi-Meerut RRTS corridor) to Meerut South station, followed by brief local commute. Meerut City Railway Station is also well connected.
              </p>
            </div>

            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-[2px] bg-[#FFF7ED] text-[#E8590C] flex items-center justify-center">
                <Bus className="w-4 h-4" />
              </div>
              <h4 className="type-h4 text-[#18181B] font-display">Intercity Bus Transit</h4>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Regular direct interstate and UP State Roadways buses halt at Bhainsali Bus Stand and Partapur intersection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
