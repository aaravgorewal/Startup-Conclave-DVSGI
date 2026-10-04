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

export type FaqCategory =
  | 'General'
  | 'Registration'
  | 'Pitch Arena'
  | 'Sponsors'
  | 'Venue & Logistics';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: FaqCategory;
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

export type RegistrationStatusMode = 'open' | 'waitlist' | 'closed';

export interface RegistrationConfig {
  mode: RegistrationStatusMode;
  enablePaymentStep: boolean; // Controls whether payment checkout step is visible
  maxCapacity: number;
}

export const REGISTRATION_CONFIG: RegistrationConfig = {
  mode: 'open',
  enablePaymentStep: false, // Payment step exists in code but hidden behind flag
  maxCapacity: 500,
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

export type SponsorCategory =
  | 'Title Partner'
  | 'Powered By Partner'
  | 'Gold'
  | 'Silver'
  | 'Technology'
  | 'Banking/FinTech'
  | 'Education'
  | 'Community'
  | 'Media'
  | 'Food'
  | 'Printing'
  | 'Swag';

export type SponsorStatus = 'confirmed' | 'in_discussion' | 'hidden';

export interface SponsorItem {
  id: string;
  name: string;
  category: SponsorCategory;
  logo?: string;
  website?: string;
  status: SponsorStatus;
}

export const SPONSORS_CONFIG = {
  deckUrl: null as string | null, // Set to URL when deck is published; null triggers disabled "Deck coming soon"
  statusMessage: "Partners announcing soon",
};

export const SPONSORS: SponsorItem[] = [
  // 1 clearly-labelled DEMO item hidden by default (shown only when confirmed or previewed)
  {
    id: "demo-sponsor-01",
    name: "Enterprise Cloud Systems (Demo Sample)",
    category: "Technology",
    website: "https://example.com",
    status: "hidden", // Strictly hidden by default as instructed
  }
];

export const FAQS: FaqItem[] = [
  {
    id: "who-can-attend",
    category: "General",
    question: "Who can attend Startup Conclave 1.0?",
    answer: "The conclave is open to all: undergraduate and postgraduate students from any discipline, aspiring campus founders, early-stage startup teams, university researchers, angel investors, venture capitalists, and industry professionals. Whether you have an active startup or simply want to learn how ventures are built, there is a dedicated track for you."
  },
  {
    id: "registration-fee",
    category: "Registration",
    question: "Is there a registration fee to attend?",
    answer: "Registration fees are to be announced. Subsidized delegate passes for students, standard founder passes, and early-bird discount structures are undergoing final institutional approvals and will be published transparently as soon as ticket bookings open."
  },
  {
    id: "single-day-pass",
    category: "Registration",
    question: "Can I attend for only one of the two days?",
    answer: "Delegate passes are primarily designed for the complete two-day immersion (Day 1: Build & Connect; Day 2: Pitch & Scale). Single-day pass availability is to be announced closer to the event depending on hall capacity."
  },
  {
    id: "how-to-register",
    category: "Registration",
    question: "How do I register for the conclave?",
    answer: "You can express your interest today via the Registration page by submitting your basic contact details. Pre-registered attendees will receive priority alerts and early-bird reservation windows before public pass sales commence."
  },
  {
    id: "apply-to-pitch",
    category: "Pitch Arena",
    question: "How do I apply to pitch in the Pitch Arena?",
    answer: "Founders can apply directly via our online Pitch Arena portal on the Pitch page. The application requires details about your startup, problem statement, unit economics, and an uploaded PDF pitch deck (max 10 MB)."
  },
  {
    id: "how-startups-selected",
    category: "Pitch Arena",
    question: "How are startups selected for the live Pitch Arena rounds?",
    answer: "All applications undergo thorough Stage 01 evaluation by our technical screening committee. Submissions are scored across 8 weighted criteria: Problem (10%), Solution (15%), Market (15%), Business Model (15%), Traction (15%), Innovation (10%), Team (10%), and Scalability (10%). The top 10 finalists advance to the mainstage on Day 2."
  },
  {
    id: "need-prototype",
    category: "Pitch Arena",
    question: "Do I need a working prototype to apply for the Pitch Arena?",
    answer: "Yes, having a working prototype, minimum viable product (MVP), or demonstrable proof-of-concept is strongly prioritized for the mainstage Pitch Arena. Early conceptual ideas are encouraged to participate in our open workshops and exhibition demo tables to gather feedback."
  },
  {
    id: "certificates-provided",
    category: "General",
    question: "Will certificates of participation be provided?",
    answer: "Yes. All registered student delegates who attend the scheduled sessions and workshops across both days will receive an official Certificate of Participation endorsed by DVSIET Meerut and conclave ecosystem partners."
  },
  {
    id: "food-provided",
    category: "Venue & Logistics",
    question: "Is food and lunch provided during the event?",
    answer: "Yes. All registered delegate passes include access to the on-campus networking luncheon, as well as morning and evening tea, coffee, and refreshments served across the central atrium during session intervals."
  },
  {
    id: "accommodation",
    category: "Venue & Logistics",
    question: "Is accommodation provided for outstation attendees?",
    answer: "Campus hostel guest rooms are strictly limited and prioritized for invited keynote speakers and jury delegates. For general outstation attendees, the secretariat has partnered with business hotels along the Partapur / Delhi Road corridor to offer negotiated discount codes. Specific booking assistance will be shared upon ticket confirmation."
  },
  {
    id: "how-sponsors-join",
    category: "Sponsors",
    question: "How can corporate brands and sponsors partner with the conclave?",
    answer: "We offer 12 curated sponsorship categories ranging from Title Partner and Powered By Partner to Technology, Education, and Swag partners. Organizations can review the deliverables matrix on the Partners page and submit an inquiry or email partnerships@dvsiet.ac.in directly."
  },
  {
    id: "can-i-speak",
    category: "General",
    question: "Can I speak or conduct a masterclass workshop?",
    answer: "Yes! We welcome seasoned founders, angel operators, technical architects, and policy champions. If you would like to deliver a keynote or lead a technical workshop, please submit your proposal through our Contact Secretariat page."
  },
  {
    id: "who-to-contact",
    category: "Venue & Logistics",
    question: "Who can I contact for urgent queries or student delegations?",
    answer: "You can reach the organizing secretariat desk by emailing conclave@dvsiet.ac.in or calling our helpline at +91 121 244 0495 (available 10:00 AM – 5:00 PM IST, Monday to Saturday). For faculty delegations and college bus parking, early coordination is recommended."
  },
  {
    id: "engineering-only",
    category: "General",
    question: "Is Startup Conclave 1.0 only for engineering students?",
    answer: "No. Interdisciplinary collaboration is fundamental to building enduring businesses. Students and faculty from management (BBA/MBA), commerce, pure sciences, computer applications (BCA/MCA), design, and arts are actively encouraged to attend, network, and form co-founding teams."
  },
  {
    id: "after-registering",
    category: "Registration",
    question: "What happens after I register my expression of interest?",
    answer: "Once you submit your interest, you will receive an immediate confirmation on-screen. When official event dates, speaker announcements, and ticketing passes launch, you will receive priority email notifications and direct reservation links before public booking goes live."
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

