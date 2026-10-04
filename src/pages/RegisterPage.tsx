import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { Ticket, Mail } from 'lucide-react';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';

export const RegisterPage: React.FC = () => {
  return (
    <PageShell
      title="Attendee Registration"
      kicker="Join the Conclave"
      statusBadge="Registration Opening Soon"
      description="Reserve your presence at DVSIET Meerut for 2 days of keynotes, pitch arena sessions, masterclasses, and startup networking."
    >
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Registration Fee & Status Card */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E4E0D7] pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[3px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <StatusBadge status="coming_soon" customLabel="Delegate Passes" size="sm" />
                <h2 className="type-h3 text-[#18181B] font-display mt-1">Pass Details: {EVENT_DATA.registrationFee.display}</h2>
              </div>
            </div>
            <div className="text-xs text-[#71717A]">
              <span className="font-semibold text-[#E8590C]">Status: </span>
              {EVENT_DATA.registrationFee.note}
            </div>
          </div>

          <p className="type-body text-[#52525B] leading-relaxed">
            Startup Conclave 1.0 will provide dedicated ticket categories for undergraduate & postgraduate students, early-stage startup founders, ecosystem professionals, and academic attendees.
          </p>

          {/* Attendee Passes Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              {
                type: "Student Delegate",
                desc: "Subsidized access for college students with valid campus ID. Includes all mainstage talks, open exhibition, and hack workshops.",
                fee: "Subsidized · Announcing Soon"
              },
              {
                type: "Founder / Innovator",
                desc: "Access to all masterclasses, founder mixer, demo floor, and Pitch Arena observer seating.",
                fee: "Announcing Soon"
              },
              {
                type: "Professional / Ecosystem",
                desc: "Full 2-day pass with priority networking lounge access, delegate directory, and ecosystem mixer.",
                fee: "Announcing Soon"
              }
            ].map((pass) => (
              <div key={pass.type} className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-5 space-y-3">
                <h3 className="type-h4 text-[#18181B] font-display">{pass.type}</h3>
                <p className="text-xs text-[#52525B] leading-relaxed">{pass.desc}</p>
                <div className="pt-2 border-t border-[#E4E0D7] text-xs font-semibold text-[#E8590C]">
                  {pass.fee}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-registration / Notify Waitlist Shell */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-[#E8590C] shrink-0" />
            <div>
              <h3 className="type-h4 text-[#18181B] font-display">
                Priority Notification Waitlist
              </h3>
              <p className="type-small text-[#71717A]">
                Receive an immediate ping the moment passes go live and the date schedule is finalized.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-[3px] border border-[#E4E0D7] bg-white text-xs text-[#52525B] flex items-center justify-between">
            <span>Registration intake module configured · Awaiting date and pass launch</span>
            <span className="text-[#E8590C] font-semibold">Priority Queue</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
