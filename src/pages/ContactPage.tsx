import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  return (
    <PageShell
      title="Contact & Support"
      kicker="Get In Touch"
      statusBadge="Secretariat Desk"
      description="Connect directly with the Startup Conclave 1.0 organizing committee for participation queries, pitch inquiries, and sponsorship partnerships."
    >
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Contact Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">General Queries</h3>
            <p className="text-xs text-slate-400">For registration, schedule, or delegate questions.</p>
            <a
              href={`mailto:${EVENT_DATA.inquiries.general}`}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 block truncate"
            >
              {EVENT_DATA.inquiries.general}
            </a>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">Pitch Arena Desk</h3>
            <p className="text-xs text-slate-400">For startup pitches, eligibility, or deck submissions.</p>
            <a
              href={`mailto:${EVENT_DATA.inquiries.pitch}`}
              className="text-xs font-semibold text-amber-400 hover:text-amber-300 block truncate"
            >
              {EVENT_DATA.inquiries.pitch}
            </a>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white font-display">Campus Secretariat</h3>
            <p className="text-xs text-slate-400">DVSIET campus desk (10:00 AM – 5:00 PM IST).</p>
            <span className="text-xs font-semibold text-slate-200 block">
              {EVENT_DATA.helplinePhone}
            </span>
          </div>
        </div>

        {/* Physical Office & Campus Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-display">Conclave Secretariat Address</h3>
              <p className="text-sm text-slate-300">{EVENT_DATA.venueName}</p>
              <p className="text-xs text-slate-400">{EVENT_DATA.venueAddress}</p>
            </div>
          </div>
        </div>

        {/* Message Inquiry Form Placeholder */}
        <div className="rounded-xl border border-slate-800 bg-[#0c121d] p-6 sm:p-8 space-y-4">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-semibold text-white font-display">
              Send an Inquiry to the Organizing Committee
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              General inquiries form shell ready for dispatch to the DVSIET organizing team.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800/80 bg-slate-950/40 p-4 text-xs text-slate-400 flex items-center justify-between">
            <span>Inquiry Routing: Active via direct committee mailboxes above</span>
            <span className="text-amber-400 font-mono text-[11px]">DVSIET-CONCLAVE-DESK</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
