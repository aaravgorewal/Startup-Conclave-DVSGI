import React from 'react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { EVENT_DATA } from '../data/content.ts';
import { MapPin, Target, Sparkles, Building2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <PageShell
      title="About Startup Conclave 1.0"
      kicker="The Initiative"
      statusBadge="In-Person Conclave"
      description="Where Ideas Meet Capital. Where Innovation Meets Opportunity. A premier 2-day entrepreneurial congregation anchored at DVSIET Meerut."
    >
      <div className="space-y-12">
        {/* Core Narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white font-display">
              Catalyzing the Regional Innovation Ecosystem
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm">
              Startup Conclave 1.0 is engineered as a transformative regional bridge connecting Tier-2 and Tier-3 student innovators, technical problem solvers, and early-stage founders with venture capital networks, experienced operators, and academic incubators.
            </p>
            <p className="text-slate-400 leading-relaxed text-sm">
              Hosted at the campus of Dewan V.S. Institute of Engineering & Technology (DVSIET) in Meerut, this two-day gathering creates direct, friction-free access to mentors, capital allocators, and industry leaders.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <h3 className="text-base font-semibold text-white font-display flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Host Institution
            </h3>
            <div className="text-sm text-slate-300 space-y-1">
              <p className="font-medium text-white">{EVENT_DATA.venueName}</p>
              <p className="text-slate-400">{EVENT_DATA.venueAddress}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800">
              A pioneering technical and engineering institution in Western Uttar Pradesh dedicated to technical excellence, entrepreneurship, and hands-on skill development.
            </p>
          </div>
        </div>

        {/* 4 Pillars detail */}
        <div className="space-y-4 pt-4 border-t border-slate-800">
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-white font-display">Our Guiding Pillars</h2>
            <p className="text-xs text-slate-400 mt-1">Four interconnected focal areas shaping the two-day experience.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "BUILD", desc: "Equipping student makers and developers with practical toolkits to build defensible products from scratch." },
              { title: "CONNECT", desc: "Creating meaningful, high-density networks between founders, technical peers, advisors, and policy drivers." },
              { title: "PITCH", desc: "A rigorous stage for vetted startups to showcase market traction and business models directly to venture jury." },
              { title: "SCALE", desc: "Deep-dive workshops on go-to-market mechanics, regulatory compliance, and early-stage revenue acceleration." }
            ].map((pillar) => (
              <div key={pillar.title} className="rounded-lg border border-slate-800/80 bg-slate-900/30 p-5">
                <span className="text-xs font-semibold text-amber-400 tracking-wider">PILLAR</span>
                <h3 className="text-lg font-bold text-white font-display mt-1">{pillar.title}</h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Participant scope */}
        <div className="rounded-xl border border-slate-800/60 bg-[#0c121d] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white font-display">Who Attends</h3>
            <p className="text-sm text-slate-400">
              Targeted for 300–500+ attendees including student developers, campus founders, angel investors, venture funds, corporate partners, and university faculty.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block uppercase">Format</span>
              <span className="text-sm font-semibold text-amber-400">In-Person at DVSIET</span>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
