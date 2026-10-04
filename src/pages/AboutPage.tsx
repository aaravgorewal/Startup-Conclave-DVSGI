import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Network,
  Rocket,
  Presentation,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  UserCheck,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { Pillars } from '../components/sections/Pillars.tsx';
import { CTABand } from '../components/ui/CTABand.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { EVENT_DATA } from '../data/content.ts';

export const AboutPage: React.FC = () => {
  // 6 Condensed Core Objectives of the Conclave
  const whyPoints = [
    {
      num: "01",
      title: "Promote Entrepreneurship Among Students",
      desc: "Demystify venture creation and transform campus engineering projects into sustainable, defensible commercial enterprises.",
      icon: <GraduationCap className="w-5 h-5 text-[#E8590C]" />,
    },
    {
      num: "02",
      title: "Connect Aspiring Founders with Experienced Operators",
      desc: "Provide early builders direct, candid face-to-face mentorship with founders who have successfully navigated 0-to-1 scale.",
      icon: <Users className="w-5 h-5 text-[#E8590C]" />,
    },
    {
      num: "03",
      title: "Create High-Density Networking with Investors",
      desc: "Bridge regional student founders with institutional seed funds, angel networks, and venture scouts actively deploying capital.",
      icon: <Network className="w-5 h-5 text-[#E8590C]" />,
    },
    {
      num: "04",
      title: "Provide Mainstage Pitching for Selected Startups",
      desc: "Give rigorously screened student and regional startups a high-visibility live platform to pitch in front of an accredited jury.",
      icon: <Presentation className="w-5 h-5 text-[#E8590C]" />,
    },
    {
      num: "05",
      title: "Introduce Students to India's Broader Startup Ecosystem",
      desc: "Expose tier-2 and tier-3 students to nationwide incubators, government grant schemes, legal frameworks, and cloud credits.",
      icon: <Compass className="w-5 h-5 text-[#E8590C]" />,
    },
    {
      num: "06",
      title: "Build Industry-Academia Bridges & Talent Access",
      desc: "Enable growing companies, corporate partners, and technology firms to scout high-caliber technical and operational young talent.",
      icon: <Briefcase className="w-5 h-5 text-[#E8590C]" />,
    },
  ];

  // 4 Target Audiences
  const audiences = [
    {
      title: "Students",
      subtitle: "Undergraduate & Postgraduate Builders",
      desc: "For aspiring entrepreneurs, engineers, and designers looking to discover startup pathways, build practical MVPs, and connect with technical co-founders.",
      deliverables: ["Keynote masterclasses", "Hack exhibition floor", "Subsidized delegate passes", "Certificate of participation"],
      tag: "Primary Audience",
    },
    {
      title: "Startup Community",
      subtitle: "Early-Stage Founders & Innovators",
      desc: "For active builders with prototypes or early market traction seeking customer discovery, investor access, and Pitch Arena competition grants.",
      deliverables: ["Pitch Arena entry", "Exhibitor demo booth", "Venture office hours", "Peer founder mixers"],
      tag: "Builders Track",
    },
    {
      title: "Ecosystem Partners",
      subtitle: "Investors, Incubators & Mentors",
      desc: "For angel syndicates, venture funds, startup incubators, and corporate mentors seeking undiscovered grassroots deal flow in Western UP.",
      deliverables: ["Curated deal pipeline", "Jury panel seating", "Lounge networking", "Academic incubation linkages"],
      tag: "Capital & Advisory",
    },
    {
      title: "Corporates & Industry",
      subtitle: "Enterprises, Cloud Providers & Brands",
      desc: "For organizations seeking strategic engagement, technical recruitment access to young engineers, and ecosystem leadership presence.",
      deliverables: ["Sponsorship branding", "Campus recruiting access", "Workshop sponsorship", "Executive panel inclusion"],
      tag: "Industry Synergies",
    },
  ];

  // Organising Committee (13 roles, names strictly "To be announced")
  const committeeRoles = [
    { role: "Event Director", dept: "Leadership & Steering", scope: "Overall conclave vision, institutional governance, and execution oversight." },
    { role: "Faculty Coordinator", dept: "Academic Secretariat", scope: "University liaison, institutional compliance, and faculty coordination." },
    { role: "Operations", dept: "Campus Execution", scope: "Hall logistics, venue management, schedule sequencing, and stage coordination." },
    { role: "Partnerships & Sponsorship", dept: "Ecosystem Growth", scope: "Corporate outreach, sponsor tier stewardship, and prospectus negotiations." },
    { role: "Speaker Relations", dept: "Program Curation", scope: "Keynote guest hospitality, agenda briefing, and fireside management." },
    { role: "Startup & Investor Relations", dept: "Venture Relations", scope: "Investor delegation coordination, angel outreach, and syndicate liaison." },
    { role: "Pitching", dept: "Pitch Arena Desk", scope: "Application intake, rubric screening, jury scoring, and timer management." },
    { role: "Marketing", dept: "Growth & Outreach", scope: "Delegate ticket acquisition, inter-college campus campaigns, and PR." },
    { role: "Social Media", dept: "Digital Communications", scope: "Live session coverage, speaker quote graphics, and digital engagement." },
    { role: "Creative & Branding", dept: "Design Secretariat", scope: "Visual collateral, stage backdrops, print signage, and brand identity." },
    { role: "Hospitality", dept: "Guest & Delegate Care", scope: "VIP reception, travel transfers, attendee registration desks, and catering." },
    { role: "Technical", dept: "AV & Digital Systems", scope: "Audio-visual production, live streaming, portal uptime, and campus Wi-Fi." },
    { role: "Finance", dept: "Accounts & Compliance", scope: "Budget allocations, invoicing, auditor accounting, and ticket ticketing ledger." },
  ];

  return (
    <PageShell
      title="About Startup Conclave 1.0"
      kicker="THE MISSION & VISION"
      statusBadge="In-Person Conclave · DVSIET Meerut"
      description="Where Ideas Meet Capital. Where Innovation Meets Opportunity. A transformative 2-day entrepreneurial congregation anchored at Dewan V.S. Institute of Engineering & Technology."
    >
      <div className="space-y-16 sm:space-y-24 text-left">
        
        {/* 1. Short Intro to the Conclave */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-4">
            <div className="type-eyebrow text-[#E8590C]">
              CATALYZING REGIONAL VENTURES
            </div>
            <h2 className="type-h2 text-[#18181B] font-display text-balance">
              Connecting Tier-2 & Tier-3 Builders to Real-World Capital and Operators
            </h2>
            <p className="type-body text-[#52525B] leading-relaxed">
              Startup Conclave 1.0 is engineered as an unapologetically practical regional bridge. 
              While metropolitan hubs dominate startup headlines, a vast reservoir of technical intelligence, problem-solving ingenuity, and hustle thrives across universities and regional towns.
            </p>
            <p className="type-body text-[#52525B] leading-relaxed">
              Hosted over two days at the campus of Dewan V.S. Institute of Engineering & Technology (DVSIET) in Meerut, this gathering breaks down institutional silos. It creates direct, friction-free access between campus inventors, scale-stage founders, angel networks, and enterprise enablers.
            </p>
          </div>

          <div className="lg:col-span-5 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 space-y-5 shadow-xs">
            <div className="border-b border-[#E4E0D7] pb-3 space-y-1">
              <span className="type-eyebrow text-[#E8590C]">AT A GLANCE</span>
              <h3 className="type-h4 text-[#18181B] font-display">Conclave Snapshot</h3>
            </div>
            
            <ul className="text-xs space-y-3 font-sans">
              <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                <span className="text-[#71717A]">Event Format:</span>
                <span className="font-semibold text-[#18181B]">2 Days (In-Person On-Campus)</span>
              </li>
              <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                <span className="text-[#71717A]">Target Delegation:</span>
                <span className="font-semibold text-[#18181B]">{EVENT_DATA.capacityTarget}</span>
              </li>
              <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                <span className="text-[#71717A]">Host Institution:</span>
                <span className="font-semibold text-[#18181B]">{EVENT_DATA.venueName}</span>
              </li>
              <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                <span className="text-[#71717A]">Location:</span>
                <span className="font-semibold text-[#18181B]">{EVENT_DATA.venueCity}, {EVENT_DATA.venueState}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#71717A]">Key Tracks:</span>
                <span className="font-semibold text-[#E8590C]">Keynotes, Pitch Arena, Expo, Workshops</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. Highlighted USP Pull-Quote */}
        <section className="relative overflow-hidden rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-8 sm:p-14 lg:p-16 text-center">
          <div className="max-w-4xl mx-auto space-y-4">
            <span className="type-eyebrow text-[#E8590C]">
              THE CORE DISTINCTION
            </span>
            <blockquote className="type-h2 sm:text-3xl lg:text-4xl text-[#18181B] font-display leading-[1.2] text-balance">
              “Startup Conclave 1.0 isn't just a conference. It is a platform connecting the next generation of entrepreneurs with the people, knowledge, capital and networks required to build real businesses.”
            </blockquote>
            <p className="type-small text-[#71717A] pt-2 font-sans uppercase tracking-wider text-xs">
              Startup Conclave 1.0 · Founding Charter · DVSIET Meerut
            </p>
          </div>
        </section>

        {/* 3. The Four Pillars (Reused Component) */}
        <section>
          <Pillars
            title="The Four Foundational Pillars"
            eyebrow="METHODOLOGY"
            description="Our program is structured around four interlocking phases of venture growth, ensuring every delegate leaves with actionable momentum."
          />
        </section>

        {/* 4. Why This Conclave: 6 Clear Points */}
        <section className="space-y-8">
          <div className="border-b border-[#E4E0D7] pb-4">
            <div className="type-eyebrow text-[#E8590C]">PURPOSE & IMPACT</div>
            <h2 className="type-h2 text-[#18181B] font-display">Why This Conclave</h2>
            <p className="type-body text-[#52525B] max-w-2xl mt-1">
              Six deliberate ecosystem mandates driving every session, panel, and workshop across the two days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyPoints.map((item) => (
              <div
                key={item.num}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3.5 shadow-xs hover:border-[#18181B] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E8590C]">{item.num}</span>
                    <div className="w-8 h-8 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="type-h4 text-[#18181B] font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#EFECE6] text-[11px] font-mono text-[#71717A]">
                  Mandate {item.num}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Who It Is For: 4 Audiences */}
        <section className="space-y-8">
          <div className="border-b border-[#E4E0D7] pb-4">
            <div className="type-eyebrow text-[#E8590C]">STAKEHOLDERS</div>
            <h2 className="type-h2 text-[#18181B] font-display">Who It Is For</h2>
            <p className="type-body text-[#52525B] max-w-2xl mt-1">
              Tailored learning paths, curated interaction formats, and dedicated zones for every stakeholder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {audiences.map((aud) => (
              <div
                key={aud.title}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 space-y-4 shadow-xs hover:border-[#18181B] transition-colors"
              >
                <div className="flex items-center justify-between border-b border-[#E4E0D7] pb-3">
                  <div>
                    <h3 className="type-h3 text-[#18181B] font-display">{aud.title}</h3>
                    <p className="text-xs text-[#71717A] font-sans mt-0.5">{aud.subtitle}</p>
                  </div>
                  <span className="text-[11px] font-mono font-semibold px-2.5 py-1 bg-[#F4F1EA] text-[#18181B] border border-[#E4E0D7] rounded-[2px]">
                    {aud.tag}
                  </span>
                </div>

                <p className="type-small text-[#52525B] leading-relaxed">
                  {aud.desc}
                </p>

                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] block font-sans">
                    Key Delegate Takeaways
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#18181B]">
                    {aud.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. About DVSIET Block (Generic with placeholders to verify) */}
        <section className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#E4E0D7] pb-5">
            <div className="space-y-1">
              <div className="type-eyebrow text-[#E8590C] flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>HOST INSTITUTION PROFILE</span>
              </div>
              <h2 className="type-h2 text-[#18181B] font-display">
                Dewan V.S. Institute of Engineering & Technology (DVSIET)
              </h2>
              <p className="text-xs text-[#71717A] font-sans">
                By-Pass Road, Partapur, Meerut, Uttar Pradesh 250103, India
              </p>
            </div>
            <span className="text-xs font-mono px-3 py-1.5 rounded-[2px] bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA] shrink-0">
              Host Campus
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-3.5 type-body text-[#52525B]">
              <p>
                Dewan V.S. Institute of Engineering & Technology (DVSIET) is a premier higher education technical institution in Western Uttar Pradesh, functioning under the aegis of the Dewan VS Group of Institutions. DVSIET has built a reputation for academic rigor, technical training, and fostering research initiatives.
              </p>
              <p>
                Situated along the Delhi-Meerut Expressway corridor at Partapur, the campus provides modern auditoriums, departmental seminar complexes, high-speed compute labs, and dedicated innovation corridors. It is strategically positioned to anchor regional startup incubation between the NCR economy and Western Uttar Pradesh builders.
              </p>
              <div className="p-3.5 rounded-[2px] border border-[#FED7AA] bg-[#FFF7ED] text-xs text-[#9A3412] leading-relaxed">
                <strong>Notice:</strong> Detailed campus statistics, department rosters, and accreditation figures are undergoing administrative synchronization and will be finalized prior to conclave commencement.
              </div>
            </div>

            <div className="lg:col-span-4 rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-5 space-y-3 text-xs text-[#52525B]">
              <h3 className="type-h4 text-[#18181B] font-display border-b border-[#E4E0D7] pb-2">
                Campus Highlights
              </h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Central Auditorium with 500+ capacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Multiple parallel workshop seminar halls</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Physical Startup Demo Pavilion floor</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Direct Rapid Rail (RRTS) & Expressway access</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-[#E4E0D7]">
                <Link to="/venue" className="text-[#E8590C] font-semibold hover:underline flex items-center gap-1">
                  <span>Explore campus venue & travel guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 7. Organising Committee Section with Role Cards */}
        <section className="space-y-8">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="type-eyebrow text-[#E8590C]">SECRETARIAT & STEERING</div>
              <h2 className="type-h2 text-[#18181B] font-display">Organising Committee</h2>
              <p className="type-body text-[#52525B] max-w-2xl mt-1">
                The multi-functional operational committee dedicated to the planning, speaker stewardship, and execution of Startup Conclave 1.0.
              </p>
            </div>
            <div className="shrink-0">
              <StatusBadge status="coming_soon" customLabel="Names Announcing Soon" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {committeeRoles.map((item) => (
              <div
                key={item.role}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-3 shadow-xs text-left flex flex-col justify-between hover:border-[#18181B] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase text-[#71717A] tracking-wider">
                      {item.dept}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#E8590C]" aria-hidden="true" />
                  </div>

                  <h3 className="type-h4 text-[#18181B] font-display">
                    {item.role}
                  </h3>

                  <div className="p-2 bg-[#FBF9F5] border border-[#E4E0D7] rounded-[2px] text-xs font-semibold text-[#71717A] flex items-center gap-1.5 font-sans">
                    <UserCheck className="w-3.5 h-3.5 text-[#E8590C]" />
                    <span>To be announced</span>
                  </div>

                  <p className="text-xs text-[#52525B] leading-relaxed pt-1">
                    {item.scope}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFECE6] text-[10px] text-[#71717A] font-mono">
                  Committee Roster
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-xs text-[#52525B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span>
              Interested in joining the conclave volunteer or student coordination cohort?
            </span>
            <Link
              to="/contact"
              className="text-[#E8590C] font-semibold hover:underline shrink-0"
            >
              Contact Organizing Secretariat →
            </Link>
          </div>
        </section>

        {/* 8. Closing CTA Band */}
        <section>
          <CTABand
            eyebrow="JOIN THE CONCLAVE"
            title="Be Part of Western UP's Defining Startup Gathering"
            description="Whether you are an aspiring student inventor, an early-stage venture founder, or an institutional investor, Startup Conclave 1.0 is engineered for you."
            primaryAction={{
              label: "Register Attendee Pass",
              href: "/register",
            }}
            secondaryAction={{
              label: "Become an Ecosystem Partner",
              href: "/sponsors",
            }}
            note="Dates & registration passes opening soon · In-person at DVSIET Meerut"
          />
        </section>

      </div>
    </PageShell>
  );
};
