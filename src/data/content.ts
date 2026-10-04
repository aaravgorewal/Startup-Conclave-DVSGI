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
