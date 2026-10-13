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
  visible: boolean;
}

export interface ScheduleItem {
  time: string;
  title: string;
}

export interface PartnerCategoryItem {
  category: string;
  description: string;
}

export interface PartnerBenefitItem {
  title: string;
  description: string;
  note?: string;
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
  showOpportunities: false,
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
      notice: 'General Attendee pass does not include a pitch slot or pitching team participant package.',
    },
    pitch: {
      label: 'Startup Pitch',
      name: 'Startup Pitch Pass',
      fee: 999,
      badge: 'Rs 999 per team, 2 to 3 members',
      description: 'Present your startup live on stage directly before the jury. Teams pitch before the jury.',
      features: [
        'Opportunity to pitch before the jury (eligible teams)',
        'Team registration (minimum 2, maximum 3 members)',
        'Access to relevant conclave sessions & activities',
      ],
      ctaText: 'Register for Startup Pitch — Rs 999 per team',
      notice: 'Pitch slots are subject to published venue capacity and eligibility verification.',
    },
    stall: {
      label: 'Startup Stall (legacy)',
      name: 'Startup Showcase Stall (legacy)',
      fee: 1299,
      badge: 'Legacy',
      description: 'Legacy ticket type kept for backward-compatibility with past registrations.',
      features: [],
      ctaText: 'Legacy',
      notice: 'This ticket type is no longer available for new registrations.',
    },
  } as Record<ParticipationCategory, TicketConfig>,

  payment: {
    upiId: '',
    payeeName: 'Dewan',
    refundPolicyText: 'Registration fees for Startup Pitch (Rs 999 per team) are non-refundable once slot allocation is confirmed. If a submission cannot be accommodated due to capacity limits, cancellation terms will apply.',
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
        'Top-billing naming rights across event branding and stages',
        'Main-stage panel discussions and speaking opportunities',
        'Prime on-ground experiential pavilion and demo space',
        'Brand visibility at the venue, on the website and on social media',
      ],
    },
    {
      id: 'innovation',
      name: 'Innovation Partner',
      price: '',
      benefits: [
        'Co-branding of the Startup Pitch Arena and innovation tracks',
        'Main-stage panel discussions and workshop opportunities',
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
        'Brand visibility at the venue, on the website and on social media',
        'Social media and digital acknowledgement',
      ],
    },
    {
      id: 'supporting',
      name: 'Supporting Partner',
      price: '',
      benefits: [
        'Official partner logo placement on website and event deck',
        'Exhibition table in the networking mixer arena',
        'Opportunities to meet student talent, founders and mentors',
        'Recognition during conclave closing ceremony',
      ],
    },
  ] as PartnerTier[],
  // Organisers: the college's own units.
  organisers: [
    { name: 'Dewan VS Group of Institutions, Meerut', logo: dewanVsLogo, confirmed: true, width: 241, height: 303 },
    { name: 'Dewan Innovation and Incubation Forum', logo: diifLogo, confirmed: true, width: 200, height: 200 },
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
      "Dewan VS Group of Institutions, Meerut, NH-58, By-Pass Road, Partapur, Meerut, Uttar Pradesh 250103",
    locationCity: "Meerut, Uttar Pradesh, India",
    date: "30-31 October 2026",
    dateConfirmed: true,
    startDate: "2026-10-30",
    endDate: "2026-10-31",
    duration: "2 Days",
    mode: "In-Person",
    badgeSticker: "2 DAYS",
    marqueeText: "BUILD • CONNECT • PITCH • SCALE • ",
  },

  about: {
    sectionNum: "01",
    headline: "A 2-day startup conclave at Dewan VS Group of Institutions, Meerut.",
    introText:
      "500+ attendees expected. Organised by Dewan Innovation and Incubation Forum, under the guidance of Dewan V.S. Institute of Engineering and Technology, Meerut.",
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
    headline: "Activity formats across two days.",
    introText: "Everything happening on campus during the conclave.",
    items: [
      { title: "Keynote Sessions", note: "Entrepreneurial awareness and inspiration" },
      { title: "Expert Talks", note: "Government schemes and startup funding support" },
      { title: "Panel Discussions", note: "Industry experts and startup founders share real journeys" },
      { title: "Startup Pitching", note: "Competition before the jury" },
      { title: "Investor Meetings", note: "Networking sessions specifically for startup participants" },
      { title: "Awards & Recognition", note: "Jury evaluation, certificates and awards" },
      { title: "Closing Ceremonies", note: "Guest interaction and valedictory" },
    ],
  },

  schedule: {
    sectionNum: "03",
    headline: "Schedule overview.",
    introText: "Two focused days of learning, building, and pitching.",
    note: "30-31 October 2026. All sessions in-person at Dewan VS Group of Institutions, Meerut.",
    subnote: "Two panel discussions run each day. Final speakers and timings will be announced.",
    day1: {
      title: 'Day 1: "Entrepreneurial Awareness & Inspiration"',
      date: '30 October 2026',
      items: [
        { time: '9:30-10:30 AM', title: 'Registration, welcome and networking' },
        { time: '10:30-11:00 AM', title: 'Inaugural ceremony' },
        { time: '11:00 AM-12:00 PM', title: 'Keynote: Startup ecosystem in India, opportunities and challenges' },
        { time: '12:00-1:00 PM', title: 'Expert talk: Government schemes and startup funding support' },
        { time: '1:00-2:00 PM', title: 'Lunch break' },
        { time: '2:00-3:30 PM', title: 'Panel discussion: startup founders share real-life journeys' },
        { time: '3:30-4:00 PM', title: 'Interactive Q&A with speakers' },
        { time: '4:00-4:30 PM', title: 'Networking, feedback and day closing' },
      ],
    },
    day2: {
      title: 'Day 2: "Pitching & Recognition"',
      date: '31 October 2026',
      items: [
        { time: '10:00-11:00 AM', title: 'Final pitch preparation' },
        { time: '11:00 AM-1:30 PM', title: 'Startup pitching competition' },
        { time: '1:30-2:30 PM', title: 'Lunch break' },
        { time: '2:30-3:30 PM', title: 'Jury deliberation and special talk: investor perspective' },
        { time: '3:30-4:30 PM', title: 'Valedictory ceremony, awards and certificates' },
        { time: '4:30 PM', title: 'Closing remarks and vote of thanks' },
      ],
    },
  },

  pitchArena: {
    sectionNum: "04",
    headline: "Startup Pitch Arena",
    tagline: "Where Ideas Meet Capital.",
    description:
      "Pitch your startup live on stage directly before the jury. Teams pitch before the jury.",
    prizes: {
      headline: "Prizes",
      footnote: "Prize package details will be announced.",
      items: [
        { rank: "1st Prize", amount: "Rs 1,00,000 worth", label: "First Place", highlight: true },
        { rank: "2nd Prize", amount: "Rs 75,000 worth", label: "Second Place" },
        { rank: "3rd Prize", amount: "Rs 50,000 worth", label: "Third Place" },
        { rank: "4th, 5th & 6th", amount: "Consolation prize worth Rs 20,000 each", label: "Consolation" },
      ],
    },
    opportunities: {
      title: "Opportunities being arranged",
      disclaimer: "Subject to partner confirmation, eligibility and terms.",
      items: [
        "Startup incubation opportunities",
        "Grant opportunities of up to Rs 15 lakh",
        "Incubation support worth up to Rs 1 lakh",
        "Patent-related support worth Rs 1 lakh",
      ],
    },
    participantPackage: [
      "Event kit",
      "Certificate",
      "Networking opportunities",
      "Investor meeting and networking session for startups",
      "Opportunity to pitch before the jury (eligible teams)",
      "Access to relevant sessions and programme activities",
      "Eligibility for announced prizes under final competition rules",
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
      name: "Sumit Rajesh Mahajan, IAS",
      designation: "CEO",
      organisation: "Uttar Pradesh Startup Mission",
      photo: "sumit-rajesh-mahajan.jpg",
      type: "chief-guest",
      confirmed: true,
      visible: true,
    },
    {
      name: "Mahip Singh",
      designation: "CEO",
      organisation: "Incubation Hub, AKTU",
      photo: "mahip-singh.jpg",
      type: "chief-guest",
      confirmed: true,
      visible: true,
    },
    {
      name: "Vivek Kumar",
      designation: "Head of Operations",
      organisation: "Country Delight",
      photo: "",
      type: "chief-guest",
      confirmed: true,
      visible: true,
    },
    {
      name: "Prof. Sangeeta Shukla",
      designation: "Vice Chancellor",
      organisation: "CCSU",
      photo: "",
      type: "chief-guest",
      confirmed: true,
      visible: false,
    },
    {
      name: "Sunil Kumar Sharma",
      designation: "Minister of IT & Electronics",
      organisation: "Uttar Pradesh",
      photo: "",
      type: "chief-guest",
      confirmed: true,
      visible: false,
    },
  ] as Guest[],

  partners: {
    sectionNum: "06",
    headline: "For Partners",
    tagline: "Partner with Western UP's premier campus entrepreneurship conclave.",
    subline:
      "Support student entrepreneurs and early-stage founders at Dewan VS Group of Institutions, Meerut.",
    badge: "PARTNERSHIPS OPEN",
    tiersPreview: [
      "Academic Partner",
      "Media Partner",
      "Program Partner",
      "Logistics Partner",
      "Food & Beverage Partner",
      "Community Partner",
      "Branding & Printing Partner",
      "IT Partner",
      "Other",
    ],
    categories: [
      { category: 'Academic Partner', description: 'Financial support or agreed academic ecosystem resources.' },
      { category: 'Media Partner', description: 'Event coverage, interviews, press releases, media outreach and agreed publicity.' },
      { category: 'Program Partner', description: 'Financial or programme support such as sessions, competition or startup ecosystem resources.' },
      { category: 'Logistics Partner', description: 'Cars, taxis, guest transport or other approved logistics services.' },
      { category: 'Food & Beverage Partner', description: 'Meals, refreshments, drinking water or other agreed support.' },
      { category: 'Community Partner', description: 'Products, gifts, merchandise, vouchers or other in-kind resources.' },
      { category: 'Branding & Printing Partner', description: 'Banners, standees, posters, certificates, signage or other agreed materials.' },
      { category: 'IT Partner', description: 'Internet, AV equipment, technical support, registration technology or other approved IT resources.' },
    ] as PartnerCategoryItem[],
    categoryOptions: [
      'Academic Partner',
      'Media Partner',
      'Program Partner',
      'Logistics Partner',
      'Food & Beverage Partner',
      'Community Partner',
      'Branding & Printing Partner',
      'IT Partner',
      'Other',
    ] as string[],
    contributionTypes: ['Cash', 'In-kind', 'Both'] as const,
    benefits: [
      { title: 'Stage & Venue Branding', description: 'Branding on stage backdrops, banners, entry areas and standees.' },
      { title: 'Official Website Presence', description: 'Logo on the official website.' },
      { title: 'Social Media Promotion', description: 'Social media promotion and publicity.' },
      { title: 'Event Materials & Certificates', description: 'Logo on approved event materials and certificates.' },
      { title: 'Announcements & Acknowledgements', description: 'Event announcements and sponsor acknowledgements.' },
      { title: 'Two-Day Exhibition Stall', description: 'A stall for two days.', note: 'Organisers provide a basic stall setup. Exact inclusions are agreed in the final partnership terms.' },
      { title: 'Representative Hospitality', description: 'Meals for up to three sponsor representatives.' },
      { title: 'Networking Opportunities', description: 'Networking and promotional opportunities.' },
      { title: 'Engagement Access', description: 'Access to relevant startup and attendee engagement opportunities, subject to event rules.' },
    ] as PartnerBenefitItem[],
    footnote: 'Benefits depend on the partnership category, contribution and final agreement, and are subject to institutional approval.',
    stallNote: 'Organisers provide a basic stall setup. Exact inclusions are agreed in the final partnership terms.',
    whyPartner: [
      {
        title: "Stage & Venue Branding",
        desc: "Branding on stage backdrops, banners, entry areas and standees.",
      },
      {
        title: "Official Website Presence",
        desc: "Logo on the official website.",
      },
      {
        title: "Social Media Promotion",
        desc: "Social media promotion and publicity.",
      },
      {
        title: "Event Materials & Certificates",
        desc: "Logo on approved event materials and certificates.",
      },
      {
        title: "Announcements & Acknowledgements",
        desc: "Event announcements and sponsor acknowledgements.",
      },
      {
        title: "Two-Day Exhibition Stall",
        desc: "A stall for two days. Basic stall setup provided by organisers; exact inclusions agreed in final terms.",
      },
      {
        title: "Representative Hospitality",
        desc: "Meals for up to three sponsor representatives.",
      },
      {
        title: "Networking Opportunities",
        desc: "Networking and promotional opportunities with participants and guests.",
      },
      {
        title: "Engagement Access",
        desc: "Access to relevant startup and attendee engagement opportunities, subject to event rules.",
      },
    ],
  },

  // Behind the event: Faculty and Student leadership
  faculty: [] as TeamMember[],
  students: [
    {
      name: "Aarav Saini",
      roles: ["Overall Student Head & Sponsorships"],
      linkedin: "https://www.linkedin.com/in/aaravgorewal/",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Mayank Sharma",
      roles: ["Operations"],
      linkedin: "https://www.linkedin.com/in/mayank-sharma-878516311/",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Vani Sharma",
      roles: ["Social Media"],
      linkedin: "https://www.linkedin.com/in/vani-sharma-798273404",
      confirmed: true,
      tier: "core",
    },
    {
      name: "Kartik Gupta",
      roles: ["Speaker & Guest Relations, and Pitching & Competition"],
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
      roles: ["Marketing & PR"],
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
      roles: ["Finance & Procurement"],
      photo: "kunal-dhama.jpeg",
      linkedin: "https://www.linkedin.com/in/kunal-dhama-325755319/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Aaditya Chaudhary",
      roles: ["Technical & AV"],
      photo: "aaditya-chaudhary.png",
      linkedin: "https://www.linkedin.com/in/aaditya-chaudhary-/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Arpita Rajput",
      roles: ["Anchoring & Stage Host"],
      photo: "arpita-rajput.jpeg",
      linkedin: "https://www.linkedin.com/in/arpita-rajput-8477b2434/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Nitika Ruhela",
      roles: ["Startup & Investor Relations"],
      photo: "nitika.jpeg",
      linkedin: "https://www.linkedin.com/in/nitika-ruhela-29078b3a9/",
      confirmed: true,
      tier: "lead",
    },
    {
      name: "Shiva Maitray",
      roles: ["Security & Safety"],
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
    faculty: [] as TeamMember[],
    students: [
      {
        name: "Aarav Saini",
        roles: ["Overall Student Head & Sponsorships"],
        linkedin: "https://www.linkedin.com/in/aaravgorewal/",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Mayank Sharma",
        roles: ["Operations"],
        linkedin: "https://www.linkedin.com/in/mayank-sharma-878516311/",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Vani Sharma",
        roles: ["Social Media"],
        linkedin: "https://www.linkedin.com/in/vani-sharma-798273404",
        confirmed: true,
        tier: "core",
      },
      {
        name: "Kartik Gupta",
        roles: ["Speaker & Guest Relations, and Pitching & Competition"],
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
        roles: ["Marketing & PR"],
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
        name: "Vishesh Saini",
        roles: ["Finance & Procurement"],
        photo: "",
        linkedin: "https://www.linkedin.com/in/kunal-dhama-325755319/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Aaditya Chaudhary",
        roles: ["Technical & AV"],
        photo: "aaditya-chaudhary.png",
        linkedin: "https://www.linkedin.com/in/aaditya-chaudhary-/",
        confirmed: true,
        tier: "lead",
      },
      {
        name: "Arpita Rajput",
        roles: ["Anchoring & Stage Host"],
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
        roles: ["Security & Safety"],
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
      a: "Students, startup founders, and aspiring entrepreneurs.",
    },
    {
      q: "Is there a registration fee to attend?",
      a: "General Attendee registration is free. Pitching registration is Rs 999 per team (2 to 3 members).",
    },
    {
      q: "How do I pitch my startup?",
      a: "Apply via the registration form by selecting the Startup Pitch track. Eligible teams (minimum 2, maximum 3 members) get the opportunity to pitch before the jury.",
    },
    {
      q: "Where is the venue located and what are the dates?",
      a: "Startup Conclave 1.0 will take place on 30-31 October 2026 at Dewan VS Group of Institutions, Meerut, UP.",
    },
    {
      q: "What happens after I register?",
      a: "Your registration is saved immediately. You will receive your official pass with an entry QR code to present at campus check-in. Detailed schedule updates and instructions will follow via email.",
    },
    {
      q: "Will investors attend the event?",
      a: "Investor meetings and networking are planned for startup participants.",
    },
  ],

  contact: {
    email: 'event@dewaninstitutes.org',
    phone: '',
    campus: "Dewan VS Group of Institutions, Meerut",
    city: "Meerut, Uttar Pradesh, India",
    socials: {
      linkedin: "",
      twitter: "",
      instagram: "",
    },
  },
};
