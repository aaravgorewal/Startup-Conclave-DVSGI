import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { Ticket, Clock, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

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
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-semibold text-amber-400">Delegate Passes</span>
                <h2 className="text-xl font-bold text-white font-display">Pass Details: {EVENT_DATA.registrationFee.display}</h2>
              </div>
            </div>
            <div className="text-xs text-slate-400">
              <span className="font-semibold text-amber-400">Status: </span>
              {EVENT_DATA.registrationFee.note}
            </div>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
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
              <div key={pass.type} className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-5 space-y-3">
                <h3 className="text-base font-bold text-white font-display">{pass.type}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{pass.desc}</p>
                <div className="pt-2 border-t border-slate-800/80 text-xs font-semibold text-amber-400">
                  {pass.fee}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-registration / Notify Waitlist Shell */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-white font-display">
                Priority Notification Waitlist
              </h3>
              <p className="text-xs text-slate-400">
                Receive an immediate ping the moment passes go live and the date schedule is finalized.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 text-xs text-slate-400 flex items-center justify-between">
            <span>Registration intake module configured · Awaiting date and pass launch</span>
            <span className="text-amber-400 font-semibold">Priority Queue</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
