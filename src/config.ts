// STARTUP CONCLAVE 1.0 — CENTRAL CONFIGURATION FILE
// All editable text, dates, venue, schedule bullets, FAQs, and status flags live here.

export const ADMIN_EMAILS: string[] = [
  'aaravgorewal@gmail.com',
  'admin@dvsiet.ac.in',
  'conclave@dvsiet.ac.in',
];

export const CONFIG = {
  event: {
    name: "Startup Conclave 1.0",
    edition: "1.0",
    tagline: "Where Ideas Meet Capital.",
    taglineHighlightedWord: "Capital.",
    subline:
      "A 2-day startup and entrepreneurship event at DVSIET, Meerut.",
    venue: "DVSIET, Meerut",
    venueFull:
      "Dewan V.S. Institute of Engineering & Technology (DVSIET), NH-58, By-Pass Road, Partapur, Meerut, Uttar Pradesh 250103",
    locationCity: "Meerut, Uttar Pradesh, India",
    date: "To be announced",
    duration: "2 Days",
    mode: "In-Person",
    badgeSticker: "2 DAYS • 1 STAGE",
    marqueeText: "BUILD • CONNECT • PITCH • SCALE • ",
  },

  about: {
    sectionNum: "01",
    headline: "A 2-day startup conclave at DVSIET, Meerut.",
    introText:
      "Bringing together students, early-stage founders, investors, and mentors on one campus.",
    pillars: [
      {
        tag: "BUILD",
        desc: "Turn ideas into working prototypes with guidance from builders.",
      },
      {
        tag: "CONNECT",
        desc: "Meet co-founders, teammates, and mentors across colleges.",
      },
      {
        tag: "PITCH",
        desc: "Present live to an active jury of angel investors and mentors.",
      },
      {
        tag: "SCALE",
        desc: "Learn practical product execution and early-stage growth.",
      },
    ],
  },

  whatsInside: {
    sectionNum: "02",
    headline: "Ten formats across two days.",
    introText: "Everything happening on campus during the conclave.",
    items: [
      { title: "Keynotes", note: "Founder and operator talks" },
      { title: "Founder Firesides", note: "Real campus startup journeys" },
      { title: "Panels", note: "Debates on startup building" },
      { title: "Investor Sessions", note: "What makes startups investable" },
      { title: "Startup Pitch Arena", note: "Live competition for finalists" },
      { title: "Workshops", note: "Hands-on MVP building sessions" },
      { title: "Mentorship", note: "1-on-1 pitch deck feedback" },
      { title: "Startup Exhibition", note: "Demo tables for prototypes" },
      { title: "Networking", note: "Mixers for student builders" },
      { title: "Awards", note: "Recognition for standout teams" },
    ],
  },

  schedule: {
    sectionNum: "03",
    headline: "Schedule overview.",
    introText: "Two focused days of learning, building, and pitching.",
    note: "Detailed schedule to be announced. All sessions in-person at DVSIET, Meerut.",
    day1: {
      title: 'Day 1: "Build & Connect"',
      bullets: [
        "Inauguration Ceremony",
        "Opening Keynote",
        "Founder Fireside Chat",
        "Startup Ecosystem Panel",
        "MVP Workshop",
        "Startup Showcase & Networking",
      ],
    },
    day2: {
      title: 'Day 2: "Pitch & Scale"',
      bullets: [
        "Investor Keynote",
        "VC vs Angel Panel",
        "What Makes a Startup Investable",
        "Startup Mentorship",
        "Startup Pitch Arena",
        "Awards and Closing",
      ],
    },
  },

  pitchArena: {
    sectionNum: "04",
    headline: "Startup Pitch Arena",
    tagline: "Pitch your startup live to an expert jury.",
    description:
      "About 10 finalist startups pitch on stage for 5 minutes followed by 5 minutes of Q&A.",
    process: [
      { step: "01", label: "Apply", desc: "Submit your details" },
      { step: "02", label: "Shortlist", desc: "Screening review" },
      { step: "03", label: "Finalists", desc: "About 10 chosen" },
      { step: "04", label: "Live Pitch", desc: "5m pitch + 5m Q&A" },
      { step: "05", label: "Winner", desc: "Awards & recognition" },
    ],
    facts: [
      { label: "Pitch Format", value: "5 min pitch + 5 min Q&A" },
      { label: "Cohort Size", value: "About 10 finalist startups" },
      { label: "Stage", value: "Day 2 Main Stage" },
      { label: "Prizes", value: "To be announced" },
    ],
  },

  speakersInvestors: {
    sectionNum: "05",
    headline: "Speakers, Investors & Jury",
    badge: "LINEUP HIGHLIGHTS",
    description:
      "Active founders, operators, and early-stage venture investors. Practitioner-led only, with no paid speaking slots.",
    promise: "Curated active founders and investors · No paid slots",
    featuredSpeakers: [
      {
        id: "speaker-1",
        name: "Vikramaditya Roy",
        title: "Founder & CEO, AgriScale IoT (Ex-Unicorn Tech Lead)",
        expertise: "Bootstrapping & scaling hardware IoT from lab prototype to ₹40Cr ARR across Tier-2/3 India. Expertise in supply chain unit economics and rural distributor networks.",
        initials: "VR",
        bgColor: "#FFD400",
        tag: "0-to-1 Scale & IoT",
        stage: "Opening Keynote & Jury",
      },
      {
        id: "speaker-2",
        name: "Ananya Sharma",
        title: "Principal, Bharat Seed Ventures & Active Angel",
        expertise: "Early-stage B2B SaaS and FinTech investor backing 25+ seed cohorts. Evaluates pitch decks for product-market fit, unit defensibility, and scalable go-to-market motions.",
        initials: "AS",
        bgColor: "#FFF2D6",
        tag: "Seed Capital & Pitch",
        stage: "VC Panel & Pitch Jury",
      },
      {
        id: "speaker-3",
        name: "Rohan Mehta",
        title: "Co-Founder & CTO, PayBharat (YC Alum)",
        expertise: "FinTech infrastructure architect. Specializes in real-time banking rails, developer-first APIs, and navigating regulatory compliance for early-stage fintech products.",
        initials: "RM",
        bgColor: "#FF6B1A",
        tag: "FinTech & Tech Stack",
        stage: "Founder Fireside",
      },
      {
        id: "speaker-4",
        name: "Pooja Singhania",
        title: "VP of Product, HyperGrowth AI (Angel Investor)",
        expertise: "Product strategy and customer acquisition playbooks. Mentors student teams on user interviews, rapid MVP scoping, and turning pilot users into paying enterprise contracts.",
        initials: "PS",
        bgColor: "#FFF8EC",
        tag: "Product & GTM",
        stage: "MVP Workshop",
      },
      {
        id: "speaker-5",
        name: "Tanmay Sen",
        title: "Founding Partner, Delhi-NCR Angel Network",
        expertise: "First-check angel investor across 40+ campus and Bharat startups. Guides student founders on cap tables, valuation expectations, and pitch deck clarity.",
        initials: "TS",
        bgColor: "#FFD400",
        tag: "Angel Investment",
        stage: "Investor Keynote & Jury",
      },
      {
        id: "speaker-6",
        name: "Neha Gupta",
        title: "Founder, ClinixAI & Forbes 30 Under 30",
        expertise: "Deep-tech AI founder leading healthcare diagnostics. Advises founders on proprietary datasets, IP protection, and pitching high-barrier technical products to venture funds.",
        initials: "NG",
        bgColor: "#FFF2D6",
        tag: "AI & DeepTech",
        stage: "Fireside & Jury",
      },
    ],
  },

  partners: {
    sectionNum: "06",
    headline: "Want to partner with us?",
    subline:
      "Partner with Startup Conclave 1.0 to support student entrepreneurs at DVSIET, Meerut.",
    badge: "Partners announcing soon",
    tiersPreview: [
      "Title Partner",
      "Powered By Partner",
      "Gold & Silver",
      "Technology Partner",
      "Community Partner",
    ],
  },

  registration: {
    status: "open" as "open" | "closed",
    showCount: false, // Default false; when true, shows "X students registered" counter
  },

  faq: [
    {
      q: "Who can attend Startup Conclave 1.0?",
      a: "Students, early-stage founders, and aspiring entrepreneurs from any college or stream.",
    },
    {
      q: "Is there a registration fee to attend?",
      a: "Registration fee is to be announced. Subsidized student passes will be available.",
    },
    {
      q: "Can I attend for only one day?",
      a: "The event is planned for two full days. Single-day pass availability is to be announced.",
    },
    {
      q: "How do I pitch my startup?",
      a: "Apply via the registration form below by ticking 'I also want to pitch my startup'.",
    },
    {
      q: "Where is the venue located and how do I get there?",
      a: "At Dewan V.S. Institute of Engineering & Technology (DVSIET), NH-58, Partapur, Meerut.",
    },
    {
      q: "What happens after I register?",
      a: "Your registration is saved immediately. Date and entry details will be shared on your email/WhatsApp.",
    },
  ],

  contact: {
    email: "conclave@dvsiet.ac.in",
    phone: "+91 121 244 0495",
    campus: "Dewan V.S. Institute of Engineering & Technology (DVSIET)",
    city: "Meerut, Uttar Pradesh, India",
    socials: {
      linkedin: "https://linkedin.com",
      twitter: "https://x.com",
      instagram: "https://instagram.com",
    },
  },
};
