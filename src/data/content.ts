/**
 * Central Content Store for Startup Conclave 1.0
 * 
 * Non-developer editable configuration file.
 * NOTE: Event dates, fees, speakers, investors, judges, sponsors, and prize pool
 * are NOT yet confirmed. Do NOT invent names, logos, or fake stats.
 */

export interface NavItem {
  name: string;
  href: string;
  highlight?: boolean;
}

export interface EventConfig {
  name: string;
  edition: string;
  tagline: string;
  theme: string[];
  description: string;
  venueName: string;
  venueInstitution: string;
  venueCity: string;
  venueState: string;
  venueCountry: string;
  venueAddress: string;
  dates: {
    confirmed: boolean;
    display: string;
    note: string;
  };
  registrationFee: {
    confirmed: boolean;
    display: string;
    note: string;
  };
  capacityTarget: string;
  contactEmail: string;
  helplinePhone: string;
  inquiries: {
    general: string;
    pitch: string;
    sponsorship: string;
  };
  socials: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface TrackPlaceholder {
  id: string;
  title: string;
  description: string;
}

export interface DaySchedulePlaceholder {
  dayNumber: number;
  dayTitle: string;
  status: string;
  tracks: TrackPlaceholder[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'registration' | 'pitch' | 'sponsorship' | 'venue';
}

export interface TierInfo {
  tierName: string;
  description: string;
  status: string;
}

export const EVENT_DATA: EventConfig = {
  name: "Startup Conclave 1.0",
  edition: "1.0",
  tagline: "Where Ideas Meet Capital. Where Innovation Meets Opportunity.",
  theme: ["BUILD", "CONNECT", "PITCH", "SCALE"],
  description: "A two-day startup, entrepreneurship and innovation conclave bringing together students, founders, investors, mentors and industry leaders.",
  venueName: "Dewan V.S. Institute of Engineering & Technology (DVSIET)",
  venueInstitution: "DVSIET Meerut",
  venueCity: "Meerut",
  venueState: "Uttar Pradesh",
  venueCountry: "India",
  venueAddress: "NH-58, Bypass Road, Partapur, Meerut, Uttar Pradesh 250103, India",
  dates: {
    confirmed: false,
    display: "Dates Announcing Soon",
    note: "2-Day In-Person Conclave · Official schedule announcement pending institutional approvals."
  },
  registrationFee: {
    confirmed: false,
    display: "To be announced",
    note: "Early bird access and student passes will be made available upon launch."
  },
  capacityTarget: "Aiming for 300–500+ attendees",
  contactEmail: "conclave@dvsiet.ac.in",
  helplinePhone: "+91 121 244 0495",
  inquiries: {
    general: "conclave@dvsiet.ac.in",
    pitch: "pitch@dvsiet.ac.in",
    sponsorship: "partnerships@dvsiet.ac.in"
  },
  socials: {
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    instagram: "https://instagram.com"
  }
};

export const NAV_LINKS: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Schedule", href: "/schedule" },
  { name: "Speakers", href: "/speakers" },
  { name: "Investors", href: "/investors" },
  { name: "Startups", href: "/startups" },
  { name: "Pitch Arena", href: "/pitch" },
  { name: "Partners", href: "/sponsors" },
  { name: "Venue", href: "/venue" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" }
];

export const PRIMARY_CTA: NavItem = {
  name: "Register",
  href: "/register",
  highlight: true
};

export const SCHEDULE_PREVIEW: DaySchedulePlaceholder[] = [
  {
    dayNumber: 1,
    dayTitle: "Day 1: Ideation, Workshops & Founder Stories",
    status: "Detailed timetable announcing soon",
    tracks: [
      {
        id: "d1-t1",
        title: "Keynotes & Vision Talks",
        description: "Inaugural address and talks by respected ecosystem architects."
      },
      {
        id: "d1-t2",
        title: "Hands-on Masterclasses",
        description: "Pragmatic technical & go-to-market bootcamps for student builders and early teams."
      },
      {
        id: "d1-t3",
        title: "Founder Fireside Sessions",
        description: "Candid breakdowns of building from Tier-2 & Tier-3 hubs to global markets."
      }
    ]
  },
  {
    dayNumber: 2,
    dayTitle: "Day 2: Pitch Arena, Investor Jury & Showcase",
    status: "Detailed timetable announcing soon",
    tracks: [
      {
        id: "d2-t1",
        title: "Pitch Arena Live Rounds",
        description: "Shortlisted student & early-stage startup pitches before the venture jury."
      },
      {
        id: "d2-t2",
        title: "Startup Showcase & Demo Tables",
        description: "Interactive floor open for hands-on demos, client feedback, and hiring conversations."
      },
      {
        id: "d2-t3",
        title: "Ecosystem Mixer & Valedictory",
        description: "Fireside reflections, closing recognitions, and structured networking mixer."
      }
    ]
  }
];

export const SPEAKERS_STATUS = {
  status: "Speaker Lineup Announcing Soon",
  badge: "Curating Industry Voices",
  description: "We are currently curating visionary founders, ecosystem leaders, and angel operators for keynotes, fireside chats, and panel tracks. The confirmed lineup will be revealed in batches.",
  callout: "Interested in delivering a session or joining a panel?",
  calloutLink: "/contact"
};

export type SpeakerCategory =
  | 'Founders'
  | 'Investors'
  | 'Industry'
  | 'Government & Ecosystem'
  | 'Academic'
  | 'Mentors';

export type SpeakerStatus = 'confirmed' | 'invited' | 'hidden';

export interface SpeakerItem {
  id: string;
  name: string;
  role: string;
  organisation: string;
  category: SpeakerCategory;
  linkedSession?: string;
  photo?: string;
  linkedin?: string;
  status: SpeakerStatus;
  bio?: string;
}

export const SPEAKERS: SpeakerItem[] = [
  // 1 clearly-labelled DEMO item hidden by default (only "confirmed" or "invited" display)
  {
    id: "demo-speaker-01",
    name: "Aakash Verma (Demo Sample)",
    role: "Founding Partner & Venture Scout",
    organisation: "Grassroots Capital Partners",
    category: "Investors",
    linkedSession: 'Investor Keynote: "How Investors Think"',
    linkedin: "https://linkedin.com",
    status: "hidden", // Strictly hidden by default as instructed
    bio: "Sample demo speaker showing layout readiness for when official confirmations occur."
  }
];

export const INVESTORS_STATUS = {
  title: "Investors & Jury: Coming Soon",
  badge: "Venture & Angel Jury",
  description: "The investor delegation and evaluation jury panel representing angel networks, venture funds, and institutional accelerators is currently being finalized under non-disclosure. Profiles will be revealed prior to Pitch Arena shortlisting.",
  categories: [
    "Early-stage Venture Funds",
    "Angel Syndicates & High-Net-Worth Mentors",
    "Academic Incubation Heads & Ecosystem Enablers"
  ]
};

export type InvestorRole = 'Investor' | 'Jury' | 'Investor & Jury';
export type InvestorStatus = 'confirmed' | 'invited' | 'hidden';

export interface InvestorItem {
  id: string;
  name: string;
  fund: string;
  role: InvestorRole;
  status: InvestorStatus;
  focus?: string;
  linkedin?: string;
}

export const INVESTORS: InvestorItem[] = [
  // 1 clearly-labelled DEMO item hidden by default (shown only when status is confirmed)
  {
    id: "demo-investor-01",
    name: "Rohan Singhal (Demo Sample)",
    fund: "Regional Seed Ventures",
    role: "Jury",
    status: "hidden", // Strictly hidden by default as instructed
    focus: "Pre-seed & Early Consumer Tech"
  }
];

export const STARTUPS_STATUS = {
  title: "Startup Showcase 1.0",
  badge: "Exhibitor Pavilion",
  status: "Showcase Applications Opening Soon",
  description: "A physical exhibition corridor at DVSIET Meerut for student ventures, research spin-offs, and early-stage innovators to exhibit live prototypes to delegates and mentors.",
  criteria: [
    "Working prototype or minimum viable product (software, hardware, or hybrid)",
    "Student-led or early-stage team (< 3 years incorporated)",
    "Commitment to booth presence across both days of the conclave"
  ]
};

export type StartupSector =
  | 'AI / SaaS'
  | 'AgriTech'
  | 'CleanTech / EV'
  | 'HealthTech'
  | 'EdTech'
  | 'FinTech'
  | 'Consumer / D2C'
  | 'DeepTech / Robotics';

export type StartupStatus = 'confirmed' | 'shortlisted' | 'hidden';

export interface StartupItem {
  id: string;
  name: string;
  oneLiner: string;
  sector: StartupSector;
  website?: string;
  logo?: string;
  founders?: string;
  status: StartupStatus;
  boothNumber?: string;
}

export const STARTUPS: StartupItem[] = [
  // 1 clearly-labelled DEMO item hidden by default (shown only when confirmed or previewed)
  {
    id: "demo-startup-01",
    name: "KrishiFlow Technologies (Demo Sample)",
    oneLiner: "Automated precision sensor arrays and water irrigation intelligence for smallholder sugarcane farms.",
    sector: "AgriTech",
    website: "https://example.com",
    founders: "Aarav Sharma & Priya Verma",
    status: "hidden", // Strictly hidden by default as instructed
    boothNumber: "Booth A-04"
  }
];

export const PITCH_ARENA_STATUS = {
  title: "Pitch Arena 1.0",
  badge: "Flagship Competition",
  status: "Applications Opening Soon",
  prizePoolStatus: "Prize pool & grant commitments to be announced",
  description: "The competitive heart of Startup Conclave 1.0 where vetted startups take the stage to present their traction, unit economics, and growth roadmap before investors.",
  stages: [
    { step: "01", name: "Executive Summary Screening", detail: "Thorough review of deck, traction data, and team composition." },
    { step: "02", name: "Jury Shortlisting", detail: "Top selected startups advance to live presentation rounds." },
    { step: "03", name: "Main Stage Live Pitch", detail: "5-minute pitch followed by 3-minute hard Q&A with venture judges." }
  ]
};

export const SPONSOR_TIERS: TierInfo[] = [
  { tierName: "Title Partner", description: "Exclusive headline branding, keynote stage naming, and premier booth.", status: "Inquire for availability" },
  { tierName: "Associate Partner", description: "Co-branding across tracks, badge lanyards, and premium showcase presence.", status: "Inquire for availability" },
  { tierName: "Track & Ecosystem Partner", description: "Specific track patronage (e.g. Pitch Arena, Student Hack Track) and mentorship credits.", status: "Inquire for availability" }
];

export const FAQS: FaqItem[] = [
  {
    id: "f1",
    category: "general",
    question: "What is Startup Conclave 1.0?",
    answer: "Startup Conclave 1.0 is a 2-day in-person startup, entrepreneurship, and innovation conclave hosted at Dewan V.S. Institute of Engineering & Technology (DVSIET), Meerut. It convenes students, innovators, early-stage founders, investors, and industry mentors."
  },
  {
    id: "f2",
    category: "general",
    question: "When and where will the conclave take place?",
    answer: "The event will take place physically at the DVSIET campus in Meerut, Uttar Pradesh, India. The exact dates are currently being finalized with institutional authorities and will be formally announced shortly."
  },
  {
    id: "f3",
    category: "registration",
    question: "What is the registration fee for attendees?",
    answer: "The registration fee structure is currently to be announced. Subsidized passes for student attendees and early-bird tickets will be detailed as soon as registration officially opens."
  },
  {
    id: "f4",
    category: "pitch",
    question: "Who is eligible to apply for the Pitch Arena?",
    answer: "Early-stage startups, student entrepreneurs, and innovative product teams with a working prototype or established early traction are eligible. Detailed application requirements will be released with the open call."
  },
  {
    id: "f5",
    category: "sponsorship",
    question: "How can my organization partner with or sponsor Startup Conclave 1.0?",
    answer: "We offer curated partnership tiers for corporate sponsors, venture capital firms, developer tools, and regional industry associations. Reach out via our Partners page or contact partnerships@dvsiet.ac.in."
  },
  {
    id: "f6",
    category: "venue",
    question: "How do I reach DVSIET Meerut?",
    answer: "DVSIET is conveniently situated on the NH-58 Bypass Road, Partapur, Meerut. It is accessible via the Delhi-Meerut Expressway, Rapid Rail Transit System (RRTS/Namo Bharat), and Meerut City railway station."
  }
];

export type SessionType =
  | 'Keynote'
  | 'Fireside'
  | 'Panel'
  | 'Workshop'
  | 'Networking'
  | 'Ceremony'
  | 'Pitch';

export interface SessionItem {
  id: string;
  day: 1 | 2;
  time: string;
  title: string;
  type: SessionType;
  description: string;
  speakerSlot?: string;
  location?: string;
}

export const SESSIONS: SessionItem[] = [
  // ==========================================
  // DAY 1: "Build & Connect"
  // ==========================================
  {
    id: "d1-01",
    day: 1,
    time: "09:00 AM – 10:00 AM (TBA)",
    title: "Registration & Networking",
    type: "Networking",
    description: "Delegate credential check-in, registration badge pickup, morning welcome refreshments, and open ecosystem mingling across the central atrium.",
    speakerSlot: "",
    location: "Main Reception & Central Atrium"
  },
  {
    id: "d1-02",
    day: 1,
    time: "10:00 AM – 10:45 AM (TBA)",
    title: "Inauguration Ceremony",
    type: "Ceremony",
    description: "Welcome address, traditional lamp lighting ceremony, institutional vision address by DVSIET leadership, chief guest address, distinguished guest introductions, and official conclave launch.",
    speakerSlot: "DVSIET Leadership, Chief Guest & Dignitaries (TBA)",
    location: "Central Auditorium"
  },
  {
    id: "d1-03",
    day: 1,
    time: "10:45 AM – 11:30 AM (TBA)",
    title: 'Keynote: "Building the Next Generation of Startups"',
    type: "Keynote",
    description: "A visionary opening address addressing contemporary technological inflection points, finding early product-market fit, and building enduring enterprises from regional campuses.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d1-04",
    day: 1,
    time: "11:30 AM – 12:15 PM (TBA)",
    title: 'Founder Fireside Chat: "From College Idea to Startup"',
    type: "Fireside",
    description: "An unscripted, candid fireside conversation breaking down how student founders navigated initial campus prototypes, found early believers, and turned side-projects into funded ventures.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d1-05",
    day: 1,
    time: "12:15 PM – 01:15 PM (TBA)",
    title: 'Panel: "India\'s Startup Ecosystem: What\'s Next?"',
    type: "Panel",
    description: "Industry leaders, startup founders, and ecosystem builders discuss the rise of Tier-2 and Tier-3 innovation corridors, national market expansion, and shifting venture landscapes.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d1-06",
    day: 1,
    time: "01:15 PM – 02:15 PM (TBA)",
    title: "Lunch & Networking",
    type: "Networking",
    description: "Structured networking lunch break bringing together student delegates, registered founders, mentors, venture observers, and faculty.",
    speakerSlot: "",
    location: "Campus Lawn & Dining Pavilion"
  },
  {
    id: "d1-07",
    day: 1,
    time: "02:15 PM – 03:15 PM (TBA)",
    title: 'Workshop: "Building Your First MVP"',
    type: "Workshop",
    description: "A pragmatic technical masterclass focused on rapid MVP scoping, customer discovery loops, no-code/low-code architectural stacks, and validating hypotheses before writing excess code.",
    speakerSlot: "",
    location: "Technical Seminar Complex Hall A"
  },
  {
    id: "d1-08",
    day: 1,
    time: "03:15 PM – 04:00 PM (TBA)",
    title: 'Panel: "AI, Technology & the Future of Entrepreneurship"',
    type: "Panel",
    description: "Engineering and founder experts analyze applied AI integrations, defensive moats, software distribution velocity, and hardware innovations driving modern ventures.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d1-09",
    day: 1,
    time: "04:00 PM – 04:45 PM (TBA)",
    title: "Founder Stories: Lessons from the Trenches",
    type: "Fireside",
    description: "Direct lightning accounts from 3–4 early-stage founders sharing practical real-world triumphs, early hiring mistakes, customer acquisition pivots, and resilience tactics.",
    speakerSlot: "3–4 Startup Founders (TBA)",
    location: "Central Auditorium"
  },
  {
    id: "d1-10",
    day: 1,
    time: "04:45 PM – 05:30 PM (TBA)",
    title: "Startup Showcase & Exhibition Walkthrough",
    type: "Workshop",
    description: "Curated open-floor walkthrough of student and regional startup exhibition booths. Interactive product trials, live prototype demonstrations, and feedback exchanges.",
    speakerSlot: "Exhibitor Teams (TBA)",
    location: "Startup Exhibition Corridor"
  },
  {
    id: "d1-11",
    day: 1,
    time: "05:30 PM – 06:15 PM (TBA)",
    title: "Ecosystem Networking Session",
    type: "Networking",
    description: "Facilitated cluster networking connecting founders, technical developers, designers, potential co-founders, and institutional enablers.",
    speakerSlot: "",
    location: "Innovation Lounge"
  },
  {
    id: "d1-12",
    day: 1,
    time: "06:15 PM – 06:30 PM (TBA)",
    title: "Day 1 Closing & Day 2 Briefing",
    type: "Ceremony",
    description: "Summary recap of Day 1 learnings, official announcement of Pitch Arena Stage 02 finalists, and schedule briefing for Day 2.",
    speakerSlot: "Organising Committee (TBA)",
    location: "Central Auditorium"
  },

  // ==========================================
  // DAY 2: "Pitch & Scale"
  // ==========================================
  {
    id: "d2-01",
    day: 2,
    time: "09:30 AM – 10:30 AM (TBA)",
    title: 'Investor Keynote: "How Investors Think"',
    type: "Keynote",
    description: "An insider breakdown from seasoned venture capitalists on investment theses, founder evaluation criteria, dilution economics, and red flags during early fund raises.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d2-02",
    day: 2,
    time: "10:30 AM – 11:30 AM (TBA)",
    title: 'Investor Panel: "VC vs Angel Investment: How Startups Get Funded"',
    type: "Panel",
    description: "Venture capitalists and angel syndicates dissect the differences between early angels vs institutional venture funds, term sheets, convertible notes, and funding lifecycles.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d2-03",
    day: 2,
    time: "11:30 AM – 12:30 PM (TBA)",
    title: 'Session: "What Makes a Startup Investable?"',
    type: "Workshop",
    description: "In-depth interactive breakdown across the 7 critical investment pillars: addressable market size, defensible product moats, measurable traction, unit revenue, team chemistry, business model, and long-term scalability.",
    speakerSlot: "",
    location: "Central Auditorium"
  },
  {
    id: "d2-04",
    day: 2,
    time: "12:30 PM – 01:45 PM (TBA)",
    title: "Startup Mentorship & Pitch Clinics",
    type: "Workshop",
    description: "Dedicated round-table mentorship pods where shortlisted startup teams receive hands-on pitch deck reviews, financial model stress-testing, and narrative coaching prior to the mainstage rounds.",
    speakerSlot: "Mentors & Angel Advisors (TBA)",
    location: "Mentorship Pods & Seminar Hall B"
  },
  {
    id: "d2-05",
    day: 2,
    time: "02:30 PM – 05:00 PM (TBA)",
    title: "Startup Pitch Arena 1.0 (Live Final Rounds)",
    type: "Pitch",
    description: "The flagship conclave competition: vetted early-stage startups present their 5-minute pitches on the mainstage, followed by 3 minutes of rigorous scrutiny from the accredited venture jury.",
    speakerSlot: "Shortlisted Startups & Venture Jury (TBA)",
    location: "Central Auditorium Mainstage"
  },
  {
    id: "d2-06",
    day: 2,
    time: "05:15 PM – 06:15 PM (TBA)",
    title: "Closing Ceremony & Awards Presentation",
    type: "Ceremony",
    description: "Valedictory address, announcement of Pitch Arena 1.0 winners, cash grant distribution, mementos to ecosystem partners and jury, institutional vote of thanks, and conclave conclusion.",
    speakerSlot: "DVSIET Leadership, Venture Jury & Guests (TBA)",
    location: "Central Auditorium"
  }
];

