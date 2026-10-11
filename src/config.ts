// STARTUP CONCLAVE 1.0 — CENTRAL CONFIGURATION FILE
// All editable text, dates, venue, schedule bullets, FAQs, and status flags live here.

import dewanVsLogo from './assets/dewan-vs-group.png';
import diifLogo from './assets/diif.jpeg';
import iicLogo from './assets/iic.webp';
import msmeLogo from './assets/msme.jpeg';
import startInUpLogo from './assets/startinup.jpeg';

export interface LogoItem {
  name: string;
  logo: string;
  url?: string;
  /** Supporters render ONLY when confirmed === true (needs written approval first). */
  confirmed: boolean;
  width?: number;
  height?: number;
}

export interface SpeakerItem {
  id: string;
  name: string;
  title: string;
  bio?: string;
  photoUrl?: string;
  status: 'confirmed' | 'pending' | string;
}

export interface Guest {
  name: string;
  designation: string;
  organisation: string;
  topic?: string;
  photo?: string;
  linkedin?: string;
  type: 'speaker' | 'investor' | 'jury' | 'mentor' | 'chief-guest';
  confirmed: boolean;
}

export interface TeamMember {
  name: string;
  roles: string[];
  photo?: string;
  linkedin?: string;
  confirmed: boolean;
  tier: 'core' | 'lead';
}

export type ParticipationCategory = 'participant' | 'pitch' | 'stall';

export interface TicketConfig {
  label: string;
  name?: string;
  fee: number; // INR, whole rupees
  badge?: string;
  description?: string;
  features?: string[];
  ctaText?: string;
  notice?: string;
}

/** Converts whole rupees to paise integer */
export const toPaise = (rupees: number): number => Math.round(rupees * 100);

export interface PaymentConfig {
  upiId: string;
  payeeName: string;
  refundPolicyText: string;
}

export interface PartnerTier {
  id: string;
  name: string;
  price?: string; // empty string shows "Contact us for details"
  benefits: string[];
}

export interface SponsorNeed {
  title: string;
  description: string;
  amount?: string;
  confirmed: boolean;
}

export interface StatItem {
  label: string;
  value: string;
  subtext?: string;
}

export const CONFIG = {
  tickets: {
    participant: {
      label: 'General Attendee',
      name: 'General Attendee Pass',
      fee: 0,
      badge: 'FREE',
      description: 'Participate as an audience delegate. Attend keynote sessions, panel discussions, and stage viewing.',
      features: [
        'Full 2-day attendee access to all open sessions',
        'Audience access to the Startup Pitch Arena',
        'Campus entrepreneurship & peer networking',
        'Official attendee digital entry pass',
      ],
      ctaText: 'Register as an Attendee — Free',
      notice: 'General Attendee pass does not include a pitch slot, startup stall, event kit, goodies, or lunch.',
    },
    pitch: {
      label: 'Hall Pitch',
      name: 'Hall Pitch Pass',
      fee: 999,
      badge: '₹999',
      description: 'Present your startup live on stage with a dedicated 5-minute pitch followed by 5-minute Q&A.',
      features: [
        '5-minute live pitch + 5-minute jury & attendee Q&A',
        'Official conclave event kit & goodies included',
        'Complimentary lunch for delegate',
        'Actionable jury feedback on validation & presentation',
      ],
      ctaText: 'Register for Hall Pitch — ₹999',
      notice: 'Pitch slots are subject to published venue capacity and eligibility verification.',
    },
    stall: {
      label: 'Startup Stall',
      name: 'Startup Showcase Stall',
      fee: 1299,
      badge: '₹1,299',
      description: 'Dedicated exhibition stall to showcase your startup, demo prototypes, and engage attendees.',
      features: [
        'Dedicated startup / product showcase stall space',
        'Display prototypes, software demos & products',
        'Direct footfall from attendees, mentors & guests',
        'Founder showcase passes for team entry',
      ],
      ctaText: 'Book a Startup Stall — ₹1,299',
      notice: 'Stall availability, setup details, dimensions, included facilities and timings will be communicated after registration.',
    },
  } as Record<ParticipationCategory, TicketConfig>,

  payment: {
    upiId: '9286153090@upi',
    payeeName: 'Aarav Saini',
    refundPolicyText: 'Registration fees for Hall Pitch (₹999) and Startup Stall (₹1,299) are non-refundable once slot allocation is confirmed. If a submission cannot be accommodated due to capacity limits, cancellation terms will apply.',
  } as PaymentConfig,

  // Stats strip: render only when non-empty, labelled "Targets"
  stats: [] as StatItem[],

  // Partnership contribution ranges (hide dropdown if empty)
  partnerRanges: [
    'Under ₹25,000',
    '₹25,000 – ₹50,000',
    '₹50,000 – ₹1,00,000',
    '₹1,00,000 – ₹2,50,000',
    '₹2,50,000+',
    'In-kind / Non-monetary support',
  ] as string[],

  // Partnership Tier Options (hide whole grid if empty)
  partnerTiers: [
    {
      id: 'title',
      name: 'Title Partner',
      price: '', // Empty shows "Contact us for details"
      benefits: [
        'Top-billing naming rights across all event marketing and stages',
        'Exclusive keynote address and panel participation',
        'Prime on-ground experiential pavilion and demo space',
        'Prominent logo placement on all conclave collateral and kits',
      ],
    },
    {
      id: 'innovation',
      name: 'Innovation Partner',
      price: '',
      benefits: [
        'Co-branding of the Startup Pitch Arena and innovation tracks',
        'Main-stage panel slot and workshop hosting opportunities',
        'Dedicated demo kiosk in the startup exhibition zone',
        'Featured logo presence across event communications',
      ],
    },
    {
      id: 'gold',
      name: 'Gold Partner',
      price: '',
      benefits: [
        'Prominent brand presence across on-ground event signage',
        'Dedicated exhibition booth for product and developer outreach',
        'Branded merchandise inclusion in attendee welcome kits',
        'Social media and digital acknowledgment',
      ],
    },
    {
      id: 'supporting',
      name: 'Supporting Partner',
      price: '',
      benefits: [
        'Official partner logo placement on website and event deck',
        'Exhibition table in the networking mixer arena',
        'Direct engagement with student innovators and faculties',
        'Recognition during conclave closing ceremony',
      ],
    },
  ] as PartnerTier[],
  // Organisers: the college's own units.
  organisers: [
    { name: 'Dewan VS Group of Institutions', logo: dewanVsLogo, confirmed: true, width: 241, height: 303 },
    { name: 'Dewan Innovation & Incubation Forum', logo: diifLogo, confirmed: true, width: 200, height: 200 },
    { name: "Institution's Innovation Council", logo: iicLogo, confirmed: true, width: 400, height: 173 },
  ] as LogoItem[],

  // Supporters: government / ecosystem logos. Keep confirmed:false until written approval is granted.
  supporters: [
    { name: 'Ministry of MSME', logo: msmeLogo, confirmed: false, width: 250, height: 194 },
    { name: 'StartInUP', logo: startInUpLogo, confirmed: false, width: 200, height: 200 },
  ] as LogoItem[],

  // Sponsorship needs & deck
  sponsorNeeds: [] as SponsorNeed[],
  sponsorDeckUrl: '',
  sponsorContactEmail: '',

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
      "A 2-day startup and entrepreneurship event at Dewan VS Group of Institutions, Meerut.",
    venue: "Dewan VS Group of Institutions, Meerut",
    venueFull:
      "Dewan VS Group of Institutions (DVSGI), NH-58, By-Pass Road, Partapur, Meerut, Uttar Pradesh 250103",
    locationCity: "Meerut, Uttar Pradesh, India",
    date: "30–31 October 2026",
    dateConfirmed: true,
    startDate: "2026-10-30",
    endDate: "2026-10-31",
    duration: "2 Days",
    mode: "In-Person",
    badgeSticker: "2 DAYS • 1 STAGE",
    marqueeText: "BUILD • CONNECT • PITCH • SCALE • ",
  },

  about: {
    sectionNum: "01",
    headline: "A 2-day startup conclave at Dewan VS Group of Institutions, Meerut.",
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
    note: "30 & 31 October 2026. All sessions in-person at Dewan VS Group of Institutions, Meerut.",
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
    tagline: "Where Ideas Meet Capital.",
    description:
      "Pitch your startup live in front of the jury and audience. Pitch format: 5-minute pitch followed by 5-minute Q&A.",
    facts: [
      { label: "Pitch Format", value: "5 min pitch + 5 min Q&A" },
      { label: "Hall Pitch Fee", value: "₹999 (Includes kit, goodies & lunch)" },
      { label: "Startup Stall Fee", value: "₹1,299 (Showcase stall space)" },
      { label: "General Attendee", value: "Free (Audience access)" },
    ],
    // Core benefits for participating startups
    whatStartupsGet: [
      {
        title: "5m Pitch + 5m Q&A",
        desc: "Strict 5-minute pitch followed by 5 minutes of focused jury and attendee Q&A.",
      },
      {
        title: "Kit, Goodies & Lunch",
        desc: "All Hall Pitch registrations receive the complete conclave delegate kit, event goodies, and lunch.",
      },
      {
        title: "Ecosystem Visibility",
        desc: "Spotlight your product in front of regional founders, operators, and engineering talent.",
      },
    ],
    // Confirmation flags for Pitch Arena (unconfirmed items remain hidden)
    juryConfirmed: false,
    investorsConfirmed: false,
    awardsConfirmed: false,
  },

  speakersInvestors: {
    sectionNum: "05",
    headline: "Speakers, Investors & Jury: Coming Soon",
    badge: "ANNOUNCING SOON",
    description: "We will announce our lineup once confirmations are in.",
    speakers: [] as SpeakerItem[],
  },

  guests: [
    {
      name: "Mr. Mahip Singh",
      designation: "CEO",
      organisation: "Innovation Hub, AKTU",
      photo: "mahip-singh.jpg",
      type: "chief-guest",
      confirmed: true,
    },
    {
      name: "Sumit Rajesh Mahajan, IAS",
      designation: "CEO",
      organisation: "Uttar Pradesh Startup Mission",
      photo: "sumit-rajesh-mahajan.jpg",
      type: "chief-guest",
      confirmed: true,
    },
    {
      name: "Mr. Vivek Kumar",
      designation: "Operations Head",
      organisation: "Country Delight",
      photo: "",
      type: "chief-guest",
      confirmed: true,
    },
  ] as Guest[],

  partners: {
    sectionNum: "06",
    headline: "For Partners",
    tagline: "Partner with Western UP's premier campus entrepreneurship conclave.",
    subline:
      "Support student entrepreneurs, engage top regional engineering talent, and establish leadership at Dewan VS Group of Institutions, Meerut.",
    badge: "PARTNERSHIPS OPEN",
    tiersPreview: [
      "Title Partner",
      "Innovation Partner",
      "Gold Partner",
      "Supporting Partner",
    ],
    whyPartner: [
      {
        title: "Brand visibility",
        desc: "Prominent brand exposure across conclave stages, banners, digital media, and delegate kits.",
      },
      {
        title: "Talent access",
        desc: "Direct access to ambitious student engineers, designers, and innovators across regional campuses.",
      },
      {
        title: "Startup ecosystem",
        desc: "Meaningful engagement with high-potential campus founders, student ventures, and incubation leadership.",
      },
      {
        title: "Thought leadership",
        desc: "Keynote addresses, panel debates, and technical workshop hosting opportunities on the main stage.",
      },
      {
        title: "On-ground activation",
        desc: "Dedicated physical footprint for product demonstrations, hands-on kiosks, and attendee interaction.",
      },
      {
        title: "Recruitment",
        desc: "Curated pipeline for student hiring, resume reviews, fast-track internships, and project demos.",
      },
    ],
  },

  // Behind the event: Faculty and Student leadership
  faculty: [] as TeamMember[],
  students: [
    {
      name: "Aarav Saini",
      roles: ["Overall Student Head", "Sponsorship"],
      linkedin: "https://www.linkedin.com/in/aaravgorewal/",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Mayank Sharma",
      roles: ["Technical Head", "Operations"],
      linkedin: "https://www.linkedin.com/in/mayank-sharma-878516311/",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Vani Sharma",
      roles: ["Media Head", "Social Media"],
      linkedin: "https://www.linkedin.com/in/vani-sharma-798273404",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Kartik Gupta",
      roles: ["Pitching Competition Head", "Speaker Relationship"],
      linkedin: "https://www.linkedin.com/in/kartik-gupta-553859366/",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Gagan Kumar",
      roles: ["Marketing & PR"],
      photo: "gagan-kumar.jpeg",
      linkedin: "",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Yash Mishra",
      roles: ["Marketing"],
      photo: "yash-mishra.png",
      linkedin: "https://www.linkedin.com/in/yash-mishra-650b20267/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Hetisha Bhardwaj",
      roles: ["Branding & Creative"],
      photo: "hetisha-bhardwaj.jpeg",
      linkedin: "https://www.linkedin.com/in/hetisha-bhardwaj-64a286384/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Mahima Chaudhary",
      roles: ["Hospitality"],
      photo: "mahima-chaudhary.png",
      linkedin: "https://www.linkedin.com/in/mahima-chaudhary-981b43340/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Kunal Dhama",
      roles: ["Finance"],
      photo: "kunal-dhama.jpeg",
      linkedin: "https://www.linkedin.com/in/kunal-dhama-325755319/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Aaditya Chaudhary",
      roles: ["Technical"],
      photo: "aaditya-chaudhary.png",
      linkedin: "https://www.linkedin.com/in/aaditya-chaudhary-/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Arpita Rajput",
      roles: ["Anchoring"],
      photo: "arpita-rajput.jpeg",
      linkedin: "https://www.linkedin.com/in/arpita-rajput-8477b2434/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Nitika",
      roles: ["Startup & Investor Relations"],
      photo: "nitika.jpeg",
      linkedin: "https://www.linkedin.com/in/nitika-ruhela-29078b3a9/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Shiva Maitray",
      roles: ["Security"],
      photo: "shiva-maitray.png",
      linkedin: "https://www.linkedin.com/in/shiva-maitray-581558325/",
      confirmed: true,
      tier: "lead",
    },
  ] as TeamMember[],
  volunteerFormUrl: '',
  // photo: filename in src/assets/team/ (or auto-matched by name slug if omitted; initials shown on fallback).
  // linkedin: URL starting with https://www.linkedin.com/ to display profile icon, or left empty/omitted.
  team: {
    headline: "Behind the event",
    note: "Faculty and student leadership will be announced soon.",
    faculty: [] as TeamMember[],
    students: [
      {
        name: "Aarav Saini",
        roles: ["Overall Student Head", "Sponsorship"],
        linkedin: "https://www.linkedin.com/in/aaravgorewal/",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Mayank Sharma",
        roles: ["Technical Head", "Operations"],
        linkedin: "https://www.linkedin.com/in/mayank-sharma-878516311/",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Vani Sharma",
        roles: ["Media Head", "Social Media"],
        linkedin: "https://www.linkedin.com/in/vani-sharma-798273404",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Kartik Gupta",
        roles: ["Pitching Competition Head", "Speaker Relations"],
        linkedin: "https://www.linkedin.com/in/kartik-gupta-553859366/",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Gagan Kumar",
        roles: ["Marketing & PR"],
        photo: "gagan-kumar.jpeg",
        linkedin: "",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Yash Mishra",
        roles: ["Marketing"],
        photo: "yash-mishra.png",
        linkedin: "https://www.linkedin.com/in/yash-mishra-650b20267/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Hetisha Bhardwaj",
        roles: ["Branding & Creative"],
        photo: "hetisha-bhardwaj.jpeg",
        linkedin: "https://www.linkedin.com/in/hetisha-bhardwaj-64a286384/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Mahima Chaudhary",
        roles: ["Hospitality"],
        photo: "mahima-chaudhary.png",
        linkedin: "https://www.linkedin.com/in/mahima-chaudhary-981b43340/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Kunal Dhama",
        roles: ["Finance"],
        photo: "kunal-dhama.jpeg",
        linkedin: "https://www.linkedin.com/in/kunal-dhama-325755319/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Aaditya Chaudhary",
        roles: ["Technical"],
        photo: "aaditya-chaudhary.png",
        linkedin: "https://www.linkedin.com/in/aaditya-chaudhary-/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Arpita Rajput",
        roles: ["Anchoring"],
        photo: "arpita-rajput.jpeg",
        linkedin: "https://www.linkedin.com/in/arpita-rajput-8477b2434/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Nitika",
        roles: ["Startup & Investor Relations"],
        photo: "nitika.jpeg",
        linkedin: "https://www.linkedin.com/in/nitika-ruhela-29078b3a9/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Shiva Maitray",
        roles: ["Security"],
        photo: "shiva-maitray.png",
        linkedin: "https://www.linkedin.com/in/shiva-maitray-581558325/",
        confirmed: true,
        tier: "lead",
      },
    ] as TeamMember[],
    volunteerFormUrl: '',
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
      a: "The event is planned for two full days (30 and 31 October 2026). Single-day pass availability is to be announced.",
    },
    {
      q: "How do I pitch my startup?",
      a: "Apply via the registration form below by ticking 'I also want to pitch my startup'.",
    },
    {
      q: "Where is the venue located and how do I get there?",
      a: "At Dewan VS Group of Institutions (DVSGI), NH-58, Partapur, Meerut.",
    },
    {
      q: "What happens after I register?",
      a: "Your registration is saved immediately. Event date is 30–31 October 2026 at Dewan VS Group of Institutions, Meerut. Entry details will be shared on your email/WhatsApp.",
    },
  ],

  contact: {
    email: 'event@dewaninstitutes.org',
    phone: '',
    campus: "Dewan VS Group of Institutions (DVSGI)",
    city: "Meerut, Uttar Pradesh, India",
    socials: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
  },
};
