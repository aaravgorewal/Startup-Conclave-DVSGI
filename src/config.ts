// STARTUP CONCLAVE 1.0 — CENTRAL CONFIGURATION FILE
// All editable text, dates, venue, schedule bullets, FAQs, and status flags live here.

export const ADMIN_EMAILS: string[] = [
  'aaravgorewal@gmail.com',
  'admin@dvsiet.ac.in',
  'conclave@dvsiet.ac.in',
];

export interface SpeakerItem {
  id: string;
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  status: 'confirmed' | 'pending' | string;
}

export const CONFIG = {
  // Contact details & Social URLs (all initially empty strings)
  contactEmail: "",
  contactPhone: "",
  instagramUrl: "",
  linkedinUrl: "",
  xUrl: "",

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
      "Bringing together students, early-stage founders, and mentors on one campus.",
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
        desc: "Present live to an expert jury.",
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
      { title: "Building & Scale Sessions", note: "Practical discussions on early-stage building" },
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
        "Keynote Session",
        "Funding & Capital Discussion",
        "Building an Investable Business",
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
    headline: "Speakers, Investors & Jury: Coming Soon",
    badge: "ANNOUNCING SOON",
    description: "We will announce our lineup once confirmations are in.",
    speakers: [] as SpeakerItem[],
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
      a: "To be announced.",
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
    email: "",
    phone: "",
    campus: "Dewan V.S. Institute of Engineering & Technology (DVSIET)",
    city: "Meerut, Uttar Pradesh, India",
    socials: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
  },
};
