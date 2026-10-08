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

export interface TicketConfig {
  label: string;
  fee: number; // INR, whole rupees
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

export interface StatItem {
  label: string;
  value: string;
  subtext?: string;
}

export const CONFIG = {
  tickets: {
    participant: { label: 'Participant', fee: 0 },
    pitch: { label: 'Pitch your startup', fee: 999 },
  } as Record<'participant' | 'pitch', TicketConfig>,

  payment: {
    upiId: '9286153090@upi',
    payeeName: 'Aarav Saini',
    refundPolicyText: '',
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
    // Core benefits for participating startups
    whatStartupsGet: [
      {
        title: "Pitch + Q&A Slot",
        desc: "5 minutes on-stage live pitch followed by 5 minutes of dedicated Q&A before attendees.",
      },
      {
        title: "Actionable Feedback",
        desc: "Constructive feedback on product validation, business model, and deck presentation.",
      },
      {
        title: "Ecosystem Visibility",
        desc: "Direct spotlight in front of attendee founders, student builders, and collegiate networks.",
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

  partners: {
    sectionNum: "06",
    headline: "For Partners",
    tagline: "Partner with Western UP's premier campus entrepreneurship conclave.",
    subline:
      "Support student entrepreneurs, engage top regional engineering talent, and establish leadership at DVSIET, Meerut.",
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
    email: 'aarav@dewaninstitutes.org',
    phone: '9286153090',
    campus: "Dewan V.S. Institute of Engineering & Technology (DVSIET)",
    city: "Meerut, Uttar Pradesh, India",
    socials: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
  },
};
