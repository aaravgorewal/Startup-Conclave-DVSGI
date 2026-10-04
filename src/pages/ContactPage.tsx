import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';

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
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
              <Mail className="w-4 h-4" />
            </div>
            <h3 className="type-h4 text-[#18181B] font-display">General Queries</h3>
            <p className="text-xs text-[#52525B]">For registration, schedule, or delegate questions.</p>
            <a
              href={`mailto:${EVENT_DATA.inquiries.general}`}
              className="text-xs font-semibold text-[#E8590C] hover:text-[#C2410C] block truncate"
            >
              {EVENT_DATA.inquiries.general}
            </a>
          </div>

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <h3 className="type-h4 text-[#18181B] font-display">Pitch Arena Desk</h3>
            <p className="text-xs text-[#52525B]">For startup pitches, eligibility, or deck submissions.</p>
            <a
              href={`mailto:${EVENT_DATA.inquiries.pitch}`}
              className="text-xs font-semibold text-[#E8590C] hover:text-[#C2410C] block truncate"
            >
              {EVENT_DATA.inquiries.pitch}
            </a>
          </div>

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3 shadow-xs">
            <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
              <Phone className="w-4 h-4" />
            </div>
            <h3 className="type-h4 text-[#18181B] font-display">Campus Secretariat</h3>
            <p className="text-xs text-[#52525B]">DVSIET campus desk (10:00 AM – 5:00 PM IST).</p>
            <span className="text-xs font-semibold text-[#18181B] block">
              {EVENT_DATA.helplinePhone}
            </span>
          </div>
        </div>

        {/* Physical Office & Campus Card */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-[#E8590C] shrink-0 mt-1" />
            <div className="space-y-1">
              <h3 className="type-h3 text-[#18181B] font-display">Conclave Secretariat Address</h3>
              <p className="type-body text-[#18181B] font-semibold">{EVENT_DATA.venueName}</p>
              <p className="text-xs text-[#52525B]">{EVENT_DATA.venueAddress}</p>
            </div>
          </div>
        </div>

        {/* Message Inquiry Form Placeholder */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="border-b border-[#E4E0D7] pb-4">
            <h3 className="type-h3 text-[#18181B] font-display">
              Send an Inquiry to the Organizing Committee
            </h3>
            <p className="type-small text-[#71717A] mt-0.5">
              Direct communications routing desk at DVSIET Meerut.
            </p>
          </div>
          <div className="rounded-[2px] border border-[#E4E0D7] bg-[#FBF9F5] p-4 text-xs text-[#52525B] flex items-center justify-between">
            <span>Inquiry Routing: Active via direct committee mailboxes above</span>
            <span className="text-[#E8590C] font-mono text-[11px] font-semibold">DVSIET-SECRETARIAT-ACTIVE</span>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
