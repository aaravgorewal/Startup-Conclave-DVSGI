import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Menu,
  X,
  ChevronDown,
  Mail,
  Phone,
  Rocket,
  Handshake,
  Check,
  Lock,
} from 'lucide-react';
import { CONFIG } from '../../config.ts';
import {
  createRegistration,
  createPartnerEnquiry,
  isEmailRegistered,
  isPhoneRegistered,
  isValidEmail,
  isValidIndianPhone,
  getRegistrationsCount,
  RegistrationInput,
} from '../../services/registrations.ts';
import {
  checkFormFillTime,
  checkBrowserRateLimit,
  recordBrowserSubmission,
} from '../../services/botProtection.ts';

// Custom Vector-Style Neo-Brutalist Illustration representing 'Building, Connecting, Pitching, and Scaling'
const HeroVectorIllustration: React.FC = () => {
  return (
    <div className="w-full bg-white brutal-border brutal-shadow-lg p-4 sm:p-5 relative select-none">
      {/* Schematic Header Bar */}
      <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-[#FF6B1A] border border-[#111111] inline-block" />
          <span className="font-bold text-[#111111] tracking-wider uppercase">
            Conclave Flywheel
          </span>
        </div>
        <span className="font-bold bg-[#FFD400] text-[#111111] px-2 py-0.5 border border-[#111111] text-[11px] uppercase tracking-wider">
          Fig. 1.0 // 4 Pillars
        </span>
      </div>

      {/* Custom Vector SVG */}
      <svg
        viewBox="0 0 460 380"
        className="w-full h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Vector illustration representing Building, Connecting, Pitching, and Scaling"
      >
        <defs>
          {/* Dot matrix grid */}
          <pattern id="brutalDots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.2" fill="#111111" fillOpacity="0.15" />
          </pattern>
          {/* Arrow marker for flow vectors */}
          <marker
            id="vectorArrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 9 5 L 0 9 z" fill="#111111" />
          </marker>
        </defs>

        {/* Blueprint background grid */}
        <rect width="100%" height="100%" fill="url(#brutalDots)" />

        {/* Decorative alignment axes */}
        <line x1="230" y1="20" x2="230" y2="360" stroke="#111111" strokeOpacity="0.1" strokeDasharray="4 4" />
        <line x1="20" y1="190" x2="440" y2="190" stroke="#111111" strokeOpacity="0.1" strokeDasharray="4 4" />

        {/* Connecting circular vector flow loops */}
        {/* Flow: Build -> Connect */}
        <path
          d="M 155 75 Q 230 40 305 75"
          stroke="#111111"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          markerEnd="url(#vectorArrow)"
        />
        {/* Flow: Connect -> Scale */}
        <path
          d="M 385 145 Q 420 220 385 245"
          stroke="#111111"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          markerEnd="url(#vectorArrow)"
        />
        {/* Flow: Scale -> Pitch */}
        <path
          d="M 305 325 Q 230 355 155 325"
          stroke="#111111"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          markerEnd="url(#vectorArrow)"
        />
        {/* Flow: Pitch -> Build */}
        <path
          d="M 75 245 Q 40 160 75 135"
          stroke="#111111"
          strokeWidth="2.5"
          strokeDasharray="5 4"
          markerEnd="url(#vectorArrow)"
        />

        {/* ============================================================ */}
        {/* 1. BUILD: Interlocking Triangles & Foundations               */}
        {/* ============================================================ */}
        <g id="pillar-build">
          {/* Hard Offset Shadows */}
          <polygon points="58,138 108,48 158,138" fill="#111111" />
          <polygon points="54,134 104,44 154,134" fill="#FF6B1A" stroke="#111111" strokeWidth="3" />
          
          {/* Inner nested inverted triangle */}
          <polygon points="79,94 129,94 104,134" fill="#FFD400" stroke="#111111" strokeWidth="2.5" />
          
          {/* Triangular drafting marks */}
          <line x1="104" y1="44" x2="104" y2="94" stroke="#111111" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Foundation circular anchor bearings */}
          <circle cx="70" cy="148" r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="70" cy="148" r="3" fill="#111111" />
          <circle cx="138" cy="148" r="8" fill="#FFFFFF" stroke="#111111" strokeWidth="2.5" />
          <circle cx="138" cy="148" r="3" fill="#111111" />

          {/* Label Badge */}
          <rect x="64" y="162" width="80" height="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
          <text x="104" y="177" textAnchor="middle" fill="#111111" fontFamily="monospace" fontSize="11" fontWeight="bold">
            ▲ BUILD
          </text>
        </g>

        {/* ============================================================ */}
        {/* 2. CONNECT: Intersecting Circles & Network Nodes             */}
        {/* ============================================================ */}
        <g id="pillar-connect">
          {/* Primary Offset Circle */}
          <circle cx="334" cy="94" r="36" fill="#111111" />
          <circle cx="330" cy="90" r="36" fill="#FFD400" stroke="#111111" strokeWidth="3" />

          {/* Intersecting Partner Circle */}
          <circle cx="384" cy="94" r="36" fill="#111111" />
          <circle cx="380" cy="90" r="36" fill="#FFF8EC" stroke="#111111" strokeWidth="3" />

          {/* Concentric Tangent Link */}
          <circle cx="355" cy="90" r="14" fill="#111111" stroke="#FFFFFF" strokeWidth="2" />
          <circle cx="355" cy="90" r="5" fill="#FF6B1A" />

          {/* Satellite network nodes */}
          <line x1="330" y1="54" x2="310" y2="35" stroke="#111111" strokeWidth="2.5" />
          <circle cx="310" cy="35" r="9" fill="#FF6B1A" stroke="#111111" strokeWidth="2" />
          
          <line x1="380" y1="126" x2="400" y2="145" stroke="#111111" strokeWidth="2.5" />
          <circle cx="400" cy="145" r="8" fill="#FFD400" stroke="#111111" strokeWidth="2" />

          {/* Label Badge */}
          <rect x="310" y="162" width="90" height="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
          <text x="355" y="177" textAnchor="middle" fill="#111111" fontFamily="monospace" fontSize="11" fontWeight="bold">
            ● CONNECT
          </text>
        </g>

        {/* ============================================================ */}
        {/* 3. PITCH: Spotlight Triangle & Acoustic Circles              */}
        {/* ============================================================ */}
        <g id="pillar-pitch">
          {/* Spotlight Beam Cone (Triangle) */}
          <polygon points="54,314 134,264 144,324" fill="#111111" />
          <polygon points="50,310 130,260 140,320" fill="#111111" stroke="#111111" strokeWidth="2" />
          <polygon points="52,310 126,264 134,316" fill="#FF6B1A" stroke="#111111" strokeWidth="2.5" />

          {/* Core Spotlight Bulb (Circle) */}
          <circle cx="68" cy="302" r="18" fill="#FFD400" stroke="#111111" strokeWidth="3" />
          <circle cx="68" cy="302" r="7" fill="#111111" />

          {/* Radiating soundwave arcs */}
          <path d="M 148 270 A 30 30 0 0 1 154 315" stroke="#111111" strokeWidth="3" fill="none" />
          <path d="M 160 258 A 48 48 0 0 1 170 328" stroke="#FF6B1A" strokeWidth="3" strokeDasharray="4 4" fill="none" />
          <path d="M 174 246 A 65 65 0 0 1 186 340" stroke="#FFD400" strokeWidth="3" fill="none" />

          {/* Target Reticle Crosshair */}
          <circle cx="130" cy="290" r="4" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />

          {/* Label Badge */}
          <rect x="64" y="340" width="80" height="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
          <text x="104" y="355" textAnchor="middle" fill="#111111" fontFamily="monospace" fontSize="11" fontWeight="bold">
            ▲ PITCH
          </text>
        </g>

        {/* ============================================================ */}
        {/* 4. SCALE: Ascending Triangles & Compounding Orbitals         */}
        {/* ============================================================ */}
        <g id="pillar-scale">
          {/* Base Stepped Baseline */}
          <line x1="290" y1="324" x2="430" y2="324" stroke="#111111" strokeWidth="3" />

          {/* Step 1: Small Triangle */}
          <polygon points="296,324 314,288 332,324" fill="#111111" />
          <polygon points="293,322 311,286 329,322" fill="#FFF8EC" stroke="#111111" strokeWidth="2.5" />

          {/* Step 2: Medium Triangle */}
          <polygon points="334,324 358,258 382,324" fill="#111111" />
          <polygon points="331,322 355,256 379,322" fill="#FFD400" stroke="#111111" strokeWidth="2.5" />

          {/* Step 3: Peak Triangle */}
          <polygon points="380,324 412,218 444,324" fill="#111111" />
          <polygon points="377,322 409,216 441,322" fill="#FF6B1A" stroke="#111111" strokeWidth="3" />

          {/* Trajectory Launch Vector Curve */}
          <path
            d="M 295 315 Q 350 290 410 206"
            stroke="#111111"
            strokeWidth="3"
            strokeDasharray="4 3"
          />

          {/* Apex Milestone Orbitals (Circles) */}
          <circle cx="410" cy="205" r="22" stroke="#FF6B1A" strokeWidth="2" strokeDasharray="3 3" fill="none" />
          <circle cx="410" cy="205" r="14" fill="#FFD400" stroke="#111111" strokeWidth="3" />
          <circle cx="410" cy="205" r="5" fill="#111111" />

          {/* Label Badge */}
          <rect x="315" y="340" width="80" height="22" fill="#FFFFFF" stroke="#111111" strokeWidth="2" />
          <text x="355" y="355" textAnchor="middle" fill="#111111" fontFamily="monospace" fontSize="11" fontWeight="bold">
            ● SCALE
          </text>
        </g>

        {/* ============================================================ */}
        {/* CENTER FLYWHEEL CORE HUB                                     */}
        {/* ============================================================ */}
        <g id="center-hub">
          {/* Shadow Circle */}
          <circle cx="233" cy="193" r="32" fill="#111111" />
          {/* Main Circle */}
          <circle cx="230" cy="190" r="32" fill="#FFFFFF" stroke="#111111" strokeWidth="3" />
          {/* Inner 4-Point Rotor / Cross */}
          <polygon
            points="230,166 235,185 254,190 235,195 230,214 225,195 206,190 225,185"
            fill="#FF6B1A"
            stroke="#111111"
            strokeWidth="1.5"
          />
          {/* Center Pin */}
          <circle cx="230" cy="190" r="6" fill="#FFD400" stroke="#111111" strokeWidth="2" />
        </g>
      </svg>

      {/* Schematic Footer Legend */}
      <div className="pt-3 border-t-2 border-[#111111] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs font-bold text-center">
        <div className="bg-[#FFF8EC] border border-[#111111] py-1 px-2 flex items-center justify-center gap-1.5">
          <span className="text-[#FF6B1A]">▲</span>
          <span>Build</span>
        </div>
        <div className="bg-[#FFF8EC] border border-[#111111] py-1 px-2 flex items-center justify-center gap-1.5">
          <span className="text-[#FFD400] text-sm leading-none">●</span>
          <span>Connect</span>
        </div>
        <div className="bg-[#FFF8EC] border border-[#111111] py-1 px-2 flex items-center justify-center gap-1.5">
          <span className="text-[#111111]">▲</span>
          <span>Pitch</span>
        </div>
        <div className="bg-[#FFF8EC] border border-[#111111] py-1 px-2 flex items-center justify-center gap-1.5">
          <span className="text-[#FF6B1A] text-sm leading-none">●</span>
          <span>Scale</span>
        </div>
      </div>
    </div>
  );
};

export const SinglePage: React.FC = () => {
  // Scroll progress percentage (0 - 100)
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Schema.org Structured Data (JSON-LD) for FAQ & Conclave Event Details
  const structuredData = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const canonicalUrl = `${origin}${currentPath}`;

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Event',
          '@id': `${canonicalUrl}#event`,
          name: CONFIG.event.name,
          description: `${CONFIG.event.subline} ${CONFIG.event.tagline}`,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: 'Dewan V.S. Institute of Engineering & Technology (DVSIET)',
            address: {
              '@type': 'PostalAddress',
              streetAddress: 'NH-58, By-Pass Road, Partapur',
              addressLocality: 'Meerut',
              addressRegion: 'Uttar Pradesh',
              postalCode: '250103',
              addressCountry: 'IN',
            },
          },
          organizer: {
            '@type': 'Organization',
            name: 'Dewan V.S. Institute of Engineering & Technology (DVSIET)',
            url: canonicalUrl,
          },
          offers: {
            '@type': 'Offer',
            url: `${canonicalUrl}#register`,
            availability: 'https://schema.org/InStock',
            price: '0',
            priceCurrency: 'INR',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${canonicalUrl}#faq`,
          mainEntity: CONFIG.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.a,
            },
          })),
        },
      ],
    };
  }, []);

  // Inject or update JSON-LD structured data in document head
  useEffect(() => {
    const scriptId = 'conclave-faq-event-jsonld';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(structuredData);

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [structuredData]);

  // Mobile navigation drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Registration Status & Counter Settings from config
  const [regStatus, setRegStatus] = useState<'open' | 'closed'>(CONFIG.registration.status);
  const [showCounter, setShowCounter] = useState<boolean>(CONFIG.registration.showCount);
  const [registrationCount, setRegistrationCount] = useState<number>(() => getRegistrationsCount());

  useEffect(() => {
    setRegistrationCount(getRegistrationsCount());
  }, []);

  // Partner Modal State
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerData, setPartnerData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerError, setPartnerError] = useState('');

  // Registration Form State (id="register")
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('');
  const [role, setRole] = useState<'Student' | 'Founder' | 'Professional' | 'Other'>('Student');
  const [city, setCity] = useState('');
  const [wantsToPitch, setWantsToPitch] = useState(false);
  const [startupName, setStartupName] = useState('');
  const [startupPitch, setStartupPitch] = useState('');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Form Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    role: string;
    city: string;
    wantsToPitch: boolean;
    startupName?: string;
    startupPitch?: string;
  } | null>(null);

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Schedule Active Tab (Day 1 vs Day 2)
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // Smooth scroll handler for nav anchors with guaranteed mobile menu auto-close
  const handleNavClick = (anchor: string) => {
    setMobileMenuOpen(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        const element = document.getElementById(anchor);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 40);
    });
  };

  // Anti-Bot Protection & Honeypot states
  const [regFormStartTime, setRegFormStartTime] = useState<number>(() => Date.now());
  const [partnerFormStartTime, setPartnerFormStartTime] = useState<number>(() => Date.now());
  const [partnerHoneypot, setPartnerHoneypot] = useState('');

  // Partner Form Submit Handler
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot Check (Silently reject bot submissions)
    if (partnerHoneypot.trim() !== '') {
      return;
    }

    // 2. Minimum 3-second form-fill time check
    const timeCheck = checkFormFillTime(partnerFormStartTime);
    if (!timeCheck.valid) {
      setPartnerError(timeCheck.error || 'Form submitted too quickly. Please take a moment to review your details.');
      return;
    }

    // 3. Browser rate limit check (3 submissions per hour)
    const rateCheck = checkBrowserRateLimit('partner');
    if (!rateCheck.allowed) {
      setPartnerError(rateCheck.error || 'Submission limit reached. Please try again later.');
      return;
    }

    if (!partnerData.company.trim() || !partnerData.contactName.trim() || !partnerData.email.trim()) {
      setPartnerError('Please provide company name, contact person, and email.');
      return;
    }

    setPartnerSubmitting(true);
    setPartnerError('');

    const res = await createPartnerEnquiry(partnerData);
    setPartnerSubmitting(false);

    if (res.success) {
      // Record rate limit timestamp
      recordBrowserSubmission('partner');
      setPartnerSuccess(true);
      setTimeout(() => {
        setPartnerModalOpen(false);
        setPartnerSuccess(false);
        setPartnerData({
          company: '',
          contactName: '',
          email: '',
          phone: '',
          message: '',
        });
        setPartnerHoneypot('');
      }, 2000);
    } else {
      setPartnerError(res.error || 'Failed to submit partner inquiry. Please retry.');
    }
  };

  // Registration Form Submit Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Honeypot Check (Silently reject bot submissions)
    if (honeypot.trim() !== '') {
      return;
    }

    // 2. Minimum 3-second form-fill time check
    const timeCheck = checkFormFillTime(regFormStartTime);
    if (!timeCheck.valid) {
      setErrors({ form: timeCheck.error || 'Form submitted too quickly. Please take a moment to review your details.' });
      return;
    }

    // 3. Browser rate limit check (3 submissions per hour)
    const rateCheck = checkBrowserRateLimit('registration');
    if (!rateCheck.allowed) {
      setErrors({ form: rateCheck.error || 'Submission limit reached (maximum 3 per hour). Please try again later.' });
      return;
    }

    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailTrim = email.trim().toLowerCase();
    if (!emailTrim || !isValidEmail(emailTrim)) {
      newErrors.email = 'Please provide a valid email address.';
    } else if (isEmailRegistered(emailTrim)) {
      newErrors.email = 'This email or phone is already registered.';
    }

    const phoneTrim = phone.replace(/\D/g, '').slice(-10);
    if (!phoneTrim || !isValidIndianPhone(phoneTrim)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    } else if (isPhoneRegistered(phoneTrim)) {
      newErrors.phone = 'This email or phone is already registered.';
    }

    if (!college.trim()) {
      newErrors.college = role === 'Student' ? 'College name is required.' : 'Organisation name is required.';
    }

    if (role === 'Student') {
      if (!course.trim()) newErrors.course = 'Degree/course is required.';
      if (!year.trim()) newErrors.year = 'Current year is required.';
    }

    if (!consentAgreed) {
      newErrors.consent = 'You must agree to be contacted about this event.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const inputData: RegistrationInput = {
      name: fullName.trim(),
      email: emailTrim,
      phone: phoneTrim,
      college: college.trim(),
      course: course.trim(),
      year: year.trim(),
      role,
      city: city.trim() || 'Meerut',
      wantsToPitch,
      startupName: wantsToPitch ? startupName.trim() : undefined,
      startupPitch: wantsToPitch ? startupPitch.trim() : undefined,
    };

    const res = await createRegistration(inputData);
    setIsSubmitting(false);

    if (res.success && res.id) {
      // Record rate limit timestamp
      recordBrowserSubmission('registration');
      setSubmittedRecord({
        id: res.id,
        name: fullName.trim(),
        email: emailTrim,
        phone: phoneTrim,
        college: college.trim(),
        role,
        city: city.trim() || 'Meerut',
        wantsToPitch,
        startupName: startupName.trim(),
        startupPitch: startupPitch.trim(),
      });
      setRegistrationCount((prev) => prev + 1);
    } else {
      setErrors({ form: res.error || 'This email or phone is already registered.' });
    }
  };

  const handleResetRegistration = () => {
    setSubmittedRecord(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setCollege('');
    setCourse('');
    setYear('');
    setCity('');
    setWantsToPitch(false);
    setStartupName('');
    setStartupPitch('');
    setConsentAgreed(false);
    setErrors({});
    setRegFormStartTime(Date.now());
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#111111] font-sans selection:bg-[#FF6B1A] selection:text-white pb-20 md:pb-0 overflow-x-clip text-base">
      
      {/* Subtle Scroll Progress Bar at the very top of the page */}
      <div
        className="fixed top-0 left-0 right-0 z-50 h-[3.5px] bg-[#111111]/10 pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading scroll progress"
      >
        <div
          className="h-full bg-[#FF6B1A] transition-[width] duration-75 ease-out shadow-[0_1px_3px_rgba(255,107,26,0.35)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* =================================================================== */}
      {/* 1. STICKY TOP BAR                                                   */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFF8EC] border-b-2 border-[#111111] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#111111] hover:text-[#FF6B1A] transition-colors"
        >
          <span className="w-3.5 h-3.5 bg-[#FF6B1A] border-2 border-[#111111] inline-block -rotate-12 shrink-0" />
          <span className="truncate">{CONFIG.event.name.toUpperCase()}</span>
        </a>

        {/* Desktop Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-sm font-bold uppercase tracking-wider">
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('inside')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Formats
          </button>
          <button
            onClick={() => handleNavClick('schedule')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Schedule
          </button>
          <button
            onClick={() => handleNavClick('pitch')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Pitch
          </button>
          <button
            onClick={() => handleNavClick('partners')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Partners
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Desktop Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleNavClick('register')}
            className="hidden sm:inline-flex brutal-btn bg-[#FF6B1A] text-white px-5 py-2.5 font-display font-bold text-sm uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[44px] items-center"
          >
            Register Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden px-3 py-1.5 brutal-border bg-white rounded-[2px] text-[#111111] min-h-[44px] flex items-center gap-1.5 cursor-pointer font-mono font-bold text-xs uppercase"
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <>
                <span>Close</span>
                <X className="w-5 h-5 stroke-[2.5]" />
              </>
            ) : (
              <>
                <span>Menu</span>
                <Menu className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-[#111111] bg-[#FFD400] p-4 sm:p-5 space-y-3 font-mono text-base font-bold uppercase tracking-wider animate-in fade-in shadow-[0_6px_0px_#111111]">
          
          {/* Drawer Top Header with Explicit Close Button */}
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#111111]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#FF6B1A] border border-[#111111] inline-block" />
              <span className="text-xs font-black tracking-widest text-[#111111]">
                NAVIGATION DIRECTORY
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn bg-white text-[#111111] px-3 py-1 text-xs font-mono font-black uppercase flex items-center gap-1.5 min-h-[38px] cursor-pointer hover:bg-[#111111] hover:text-white"
              aria-label="Close navigation menu"
            >
              <span>Close</span>
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

          {/* Navigation Links (all auto-close menu & scroll smoothly) */}
          <div className="space-y-1 py-1">
            <button
              type="button"
              onClick={() => handleNavClick('about')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>01 • About</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('inside')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>02 • Formats</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('schedule')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>03 • Schedule</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('pitch')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>04 • Pitch Arena</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('speakers')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>05 • Speakers</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('partners')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>06 • Partners</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('register')}
              className="w-full text-left py-2 px-3 bg-white brutal-border font-black text-[#FF6B1A] min-h-[44px] flex items-center justify-between shadow-[2px_2px_0px_#111111] cursor-pointer"
            >
              <span>07 • Register</span>
              <span className="text-xs">↗</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('faq')}
              className="w-full text-left py-2 px-2 hover:bg-white/40 min-h-[44px] flex items-center justify-between group transition-colors cursor-pointer"
            >
              <span>FAQ</span>
              <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>
          </div>

          {/* Drawer Bottom Close Action Bar */}
          <div className="pt-3 border-t-2 border-[#111111] flex items-center justify-between">
            <span className="font-mono text-xs text-[#111111]/75">DVSIET, Meerut</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="brutal-btn bg-white text-[#111111] px-4 py-2 font-mono text-xs font-black uppercase flex items-center gap-1.5 min-h-[42px] cursor-pointer hover:bg-[#111111] hover:text-white"
              aria-label="Close navigation menu"
            >
              <span>Close Menu</span>
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>
      )}

      {/* =================================================================== */}
      {/* 2. HERO SECTION                                                     */}
      {/* =================================================================== */}
      <section className="relative px-4 sm:px-8 pt-10 sm:pt-16 pb-14 sm:pb-20 max-w-6xl mx-auto text-left">
        
        {/* Floating Sticker Badge */}
        <div className="inline-block mb-4 sm:mb-6">
          <div className="bg-[#FFD400] text-[#111111] font-mono text-sm font-black px-3.5 py-1 brutal-border brutal-shadow-sm -rotate-2 uppercase tracking-wide">
            {CONFIG.event.badgeSticker}
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Column (7 cols): Headline, Subtitle, Info Strip, Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[1.02] sm:leading-[0.95] text-[#111111]">
              Where Ideas Meet{' '}
              <span className="highlight-yellow font-black whitespace-nowrap">
                {CONFIG.event.taglineHighlightedWord}
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-[#111111] font-sans font-medium max-w-2xl leading-snug">
              {CONFIG.event.subline}
            </p>

            {/* Quick Info Strip */}
            <div className="p-2.5 sm:p-3.5 lg:px-3 lg:py-2.5 xl:p-3.5 bg-white brutal-border brutal-shadow-sm flex flex-wrap md:flex-nowrap items-center gap-x-2 sm:gap-x-3 lg:gap-x-2 xl:gap-x-3 gap-y-2 font-mono text-xs sm:text-[13px] xl:text-sm font-bold text-[#111111] w-full max-w-full">
              <span className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B1A] shrink-0" />
                <span>Date: {CONFIG.event.date}</span>
              </span>
              <span className="text-[#111111]/30 hidden md:inline shrink-0">|</span>
              <span className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B1A] shrink-0" />
                <span>{CONFIG.event.venue}</span>
              </span>
              <span className="text-[#111111]/30 hidden md:inline shrink-0">|</span>
              <span className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B1A] shrink-0" />
                <span>{CONFIG.event.duration}</span>
              </span>
              <span className="text-[#111111]/30 hidden md:inline shrink-0">|</span>
              <span className="bg-[#FFD400] px-2 py-0.5 sm:px-2.5 sm:py-1 border border-[#111111] text-[11px] sm:text-xs uppercase font-black shrink-0 whitespace-nowrap">
                {CONFIG.event.mode}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => handleNavClick('register')}
                className="brutal-btn bg-[#FF6B1A] text-white px-8 py-4 font-display font-bold text-lg uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
              >
                <span>Register Now</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  setWantsToPitch(true);
                  handleNavClick('register');
                }}
                className="brutal-btn bg-[#FFD400] text-[#111111] px-8 py-4 font-display font-bold text-lg uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
              >
                <span>Apply to Pitch</span>
                <Rocket className="w-5 h-5 text-[#111111]" />
              </button>
            </div>
          </div>

          {/* Right Column (5 cols): Custom Vector Illustration */}
          <div className="lg:col-span-5 w-full mt-4 lg:mt-0">
            <HeroVectorIllustration />
          </div>

        </div>
      </section>

      {/* Marquee Ticker Strip directly under hero */}
      <div className="w-full bg-[#111111] text-[#FFD400] border-y-2 border-[#111111] py-3.5 overflow-hidden font-display font-black text-sm sm:text-base tracking-widest uppercase select-none">
        <div className="animate-marquee whitespace-nowrap">
          <span>{CONFIG.event.marqueeText.repeat(10)}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. ABOUT (01) — 1-LINE INTRO                                        */}
      {/* =================================================================== */}
      <section id="about" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.about.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
            About The Conclave
          </span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#111111] max-w-4xl">
          {CONFIG.about.headline}
        </h2>

        {/* 1-Line Intro */}
        <p className="mt-4 text-base sm:text-lg text-[#111111]/85 font-sans font-medium max-w-3xl">
          {CONFIG.about.introText}
        </p>

        {/* Four Pillars as 1 Line Each */}
        <div className="mt-8 space-y-3 font-sans">
          {CONFIG.about.pillars.map((pillar) => (
            <div
              key={pillar.tag}
              className="p-4 sm:p-5 bg-white brutal-border brutal-shadow-sm flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-[#FFF2D6] transition-colors"
            >
              <span className="font-mono font-black text-sm sm:text-base px-3.5 py-1 bg-[#111111] text-[#FFD400] border border-[#111111] shrink-0 self-start sm:self-center tracking-widest">
                {pillar.tag}
              </span>
              <p className="text-base font-semibold text-[#111111]">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. WHAT'S INSIDE (02) — 3-4 WORDS PER ITEM                         */}
      {/* =================================================================== */}
      <section id="inside" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.whatsInside.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
            Program Formats
          </span>
        </div>

        <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#111111]">
          {CONFIG.whatsInside.headline}
        </h2>
        
        {/* 1-Line Intro */}
        <p className="mt-2 text-base text-[#111111]/80 font-sans font-medium">
          {CONFIG.whatsInside.introText}
        </p>

        {/* Compact Grid of Formats (3-4 words each) */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 font-sans">
          {CONFIG.whatsInside.items.map((item, idx) => (
            <div
              key={item.title}
              className="p-4 bg-white brutal-border brutal-shadow-sm flex items-start gap-3.5 hover:translate-x-0.5 transition-transform"
            >
              <span className="font-mono text-sm font-black text-[#FF6B1A] shrink-0 mt-0.5">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#111111]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#111111]/85 mt-0.5 font-medium">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. SCHEDULE (03) — ONLY SESSION TITLES, NO TIMES, NO DESCRIPTIONS   */}
      {/* =================================================================== */}
      <section id="schedule" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
              {CONFIG.schedule.sectionNum}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
              Schedule
            </span>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-4 py-2 brutal-border cursor-pointer transition-all min-h-[44px] flex items-center ${
                activeDay === 1
                  ? 'bg-[#111111] text-[#FFD400] brutal-shadow-sm'
                  : 'bg-white text-[#111111]'
              }`}
            >
              DAY 01
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-4 py-2 brutal-border cursor-pointer transition-all min-h-[44px] flex items-center ${
                activeDay === 2
                  ? 'bg-[#111111] text-[#FFD400] brutal-shadow-sm'
                  : 'bg-white text-[#111111]'
              }`}
            >
              DAY 02
            </button>
          </div>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#111111]">
          {CONFIG.schedule.headline}
        </h2>
        
        {/* 1-Line Intro Note */}
        <p className="mt-2 text-sm font-mono text-[#FF6B1A] font-bold">
          {CONFIG.schedule.note}
        </p>

        {/* Schedule Display: ONLY TITLES */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Day 1 Column */}
          <div
            className={`p-6 sm:p-8 bg-white brutal-border brutal-shadow space-y-4 ${
              activeDay === 1 ? 'ring-2 ring-[#FF6B1A]' : 'opacity-85 hidden lg:block'
            }`}
          >
            <div className="border-b-2 border-[#111111] pb-3">
              <span className="font-mono text-xs font-black text-[#FF6B1A] uppercase tracking-wider block">
                DAY ONE
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#111111]">
                {CONFIG.schedule.day1.title}
              </h3>
            </div>

            {/* ONLY SESSION TITLES */}
            <ul className="space-y-3.5 font-sans text-sm sm:text-base">
              {CONFIG.schedule.day1.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-[#FF6B1A] border-2 border-[#111111] shrink-0" />
                  <span className="font-bold text-[#111111]">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day 2 Column */}
          <div
            className={`p-6 sm:p-8 bg-white brutal-border brutal-shadow space-y-4 ${
              activeDay === 2 ? 'ring-2 ring-[#FF6B1A]' : 'opacity-85 hidden lg:block'
            }`}
          >
            <div className="border-b-2 border-[#111111] pb-3">
              <span className="font-mono text-xs font-black text-[#FF6B1A] uppercase tracking-wider block">
                DAY TWO
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#111111]">
                {CONFIG.schedule.day2.title}
              </h3>
            </div>

            {/* ONLY SESSION TITLES */}
            <ul className="space-y-3.5 font-sans text-sm sm:text-base">
              {CONFIG.schedule.day2.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 bg-[#FFD400] border-2 border-[#111111] shrink-0" />
                  <span className="font-bold text-[#111111]">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. PITCH ARENA (04) — 1-LINE INTRO                                  */}
      {/* =================================================================== */}
      <section id="pitch" className="bg-[#FF6B1A] text-[#111111] border-b-2 border-[#111111] py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-left space-y-7">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border-2 border-[#111111]">
              {CONFIG.pitchArena.sectionNum}
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-wider bg-white text-[#111111] px-2.5 py-1 border-2 border-[#111111] -rotate-1">
              Live Stage Pitch
            </span>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#111111]">
              {CONFIG.pitchArena.headline}
            </h2>
            <p className="font-display text-xl sm:text-2xl text-white font-extrabold">
              {CONFIG.pitchArena.tagline}
            </p>
            {/* 1-Line Intro */}
            <p className="text-base font-sans text-[#111111] font-medium leading-relaxed">
              {CONFIG.pitchArena.description}
            </p>
          </div>

          {/* Process in One Row */}
          <div className="p-4 sm:p-6 bg-white brutal-border brutal-shadow">
            <span className="text-xs font-mono font-black uppercase text-[#111111] tracking-wider block mb-3">
              Competition Flow
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-sans">
              {CONFIG.pitchArena.process.map((p, idx) => (
                <div key={p.step} className="p-3 bg-[#FFF8EC] border-2 border-[#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#FF6B1A]">{p.step}</span>
                    {idx < 4 && <span className="font-mono text-xs text-[#111111]/40 hidden sm:inline">→</span>}
                  </div>
                  <div className="font-display font-black text-base text-[#111111]">{p.label}</div>
                  <div className="text-xs text-[#111111]/70">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Facts & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-1">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm font-bold text-[#111111]">
              {CONFIG.pitchArena.facts.map((fact) => (
                <span key={fact.label} className="bg-white px-3.5 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                  <strong>{fact.label}:</strong> {fact.value}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                setWantsToPitch(true);
                handleNavClick('register');
              }}
              className="brutal-btn bg-[#FFD400] text-[#111111] px-6 py-3.5 font-display font-extrabold text-base uppercase tracking-wider rounded-[2px] cursor-pointer self-start sm:self-auto shrink-0 min-h-[46px]"
            >
              Apply to Pitch →
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. SPEAKERS & INVESTORS (05)                                        */}
      {/* =================================================================== */}
      <section id="speakers" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.speakersInvestors.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
            Lineup
          </span>
        </div>

        {/* Bold Coming Soon Block */}
        <div className="p-7 sm:p-12 bg-white brutal-border brutal-shadow-lg space-y-5 text-left">
          <div className="inline-block">
            <span className="bg-[#FF6B1A] text-white font-mono text-xs font-black px-3.5 py-1 border-2 border-[#111111] -rotate-1 uppercase tracking-wider inline-block">
              {CONFIG.speakersInvestors.badge}
            </span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-[#111111] leading-tight tracking-tight">
            {CONFIG.speakersInvestors.headline}
          </h2>

          <p className="text-base sm:text-lg font-sans text-[#111111]/85 max-w-2xl font-medium leading-relaxed">
            {CONFIG.speakersInvestors.description}
          </p>

          {Boolean((CONFIG.contactEmail || CONFIG.contact?.email)?.trim()) && (
            <div className="pt-2 border-t-2 border-[#111111]">
              <a
                href={`mailto:${(CONFIG.contactEmail || CONFIG.contact.email).trim()}?subject=Speaking%20Inquiry%20-%20Startup%20Conclave%201.0`}
                className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-bold text-[#FF6B1A] hover:text-[#111111] underline hover:no-underline cursor-pointer min-h-[44px]"
              >
                <span>Interested in speaking? Contact us</span>
                <span aria-hidden="true">→</span>
              </a>
            </div>
          )}

          {/* If speakers array in src/config.ts is non-empty, only items with status "confirmed" may render */}
          {(() => {
            const confirmedSpeakers = (CONFIG.speakersInvestors.speakers || []).filter(
              (s) => s.status === 'confirmed'
            );
            if (confirmedSpeakers.length === 0) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t-2 border-[#111111]">
                {confirmedSpeakers.map((speaker) => (
                  <div
                    key={speaker.id}
                    className="p-5 bg-white brutal-border brutal-shadow space-y-2 text-left"
                  >
                    <h3 className="font-display font-black text-xl text-[#111111]">
                      {speaker.name}
                    </h3>
                    <p className="font-mono text-xs font-bold text-[#FF6B1A] uppercase tracking-wide">
                      {speaker.title}
                    </p>
                    {speaker.bio && (
                      <p className="text-sm font-sans text-[#111111]/85 font-medium leading-relaxed">
                        {speaker.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. PARTNERS (06) — 1-LINE INTRO                                     */}
      {/* =================================================================== */}
      <section id="partners" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.partners.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
            Partnerships
          </span>
        </div>

        <div className="p-7 sm:p-10 bg-[#FFF2D6] brutal-border brutal-shadow space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111]">
                {CONFIG.partners.headline}
              </h2>
              {/* 1-Line Intro */}
              <p className="text-base font-sans text-[#111111]/85 mt-1 max-w-2xl font-medium">
                {CONFIG.partners.subline}
              </p>
            </div>

            <button
              onClick={() => {
                setPartnerFormStartTime(Date.now());
                setPartnerHoneypot('');
                setPartnerError('');
                setPartnerModalOpen(true);
              }}
              className="brutal-btn bg-[#111111] text-[#FFD400] px-6 py-3 font-display font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2px] cursor-pointer shrink-0 min-h-[46px]"
            >
              Become a Partner
            </button>
          </div>

          <div className="pt-4 border-t-2 border-[#111111] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono">
            <span className="text-[#FF6B1A] font-bold">
              {CONFIG.partners.badge}
            </span>
            <div className="flex flex-wrap gap-2 text-[#111111]/80">
              {CONFIG.partners.tiersPreview.map((tier) => (
                <span key={tier} className="bg-white px-2.5 py-1 border border-[#111111] text-xs">
                  {tier}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 9. REGISTRATION (07) — MAIN FORM SECTION (id="register")            */}
      {/* =================================================================== */}
      <section id="register" className="px-4 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto text-left border-b-2 border-[#111111] scroll-mt-16">
        
        {/* Section Header with live counter if enabled */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
              07
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
              Registration
            </span>
          </div>

          {/* Visible counter if showCount is true */}
          {showCounter && (
            <div className="inline-flex items-center gap-2 bg-[#FFD400] border-2 border-[#111111] px-3 py-1 font-mono text-xs font-bold text-[#111111] shadow-[2px_2px_0px_#111111]">
              <Users className="w-4 h-4 text-[#FF6B1A]" />
              <span>{registrationCount} students registered</span>
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* CASE A: REGISTRATIONS CLOSED VARIANT                              */}
        {/* ================================================================= */}
        {regStatus === 'closed' ? (
          <div className="p-8 sm:p-14 bg-white brutal-border brutal-shadow-lg text-center space-y-4">
            <div className="w-12 h-12 bg-[#FFF2D6] border-2 border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
              <Lock className="w-6 h-6 text-[#FF6B1A]" />
            </div>
            <h3 className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
              Registrations Closed
            </h3>
            <p className="text-base font-sans text-[#111111]/80 max-w-md mx-auto">
              Delegate registrations for Startup Conclave 1.0 are currently closed. For inquiries, please reach out to the secretariat.
            </p>
            {Boolean((CONFIG.contactEmail || CONFIG.contact?.email)?.trim()) && (
              <div className="pt-2">
                <a
                  href={`mailto:${(CONFIG.contactEmail || CONFIG.contact.email).trim()}`}
                  className="brutal-btn bg-[#FFD400] text-[#111111] px-5 py-3 font-mono text-sm font-bold uppercase inline-block min-h-[46px] flex items-center justify-center mx-auto"
                >
                  Contact Secretariat ({(CONFIG.contactEmail || CONFIG.contact.email).trim()})
                </a>
              </div>
            )}
          </div>
        ) : submittedRecord ? (
          /* =============================================================== */
          /* CASE B: SUCCESS CONFIRMATION SCREEN                             */
          /* =============================================================== */
          <div className="p-6 sm:p-10 bg-white brutal-border brutal-shadow-lg space-y-6 text-left animate-brutal-pop">
            
            {/* Top Confirmed Header with Checkmark Micro-Interaction */}
            <div className="p-5 bg-[#FFD400] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex items-start sm:items-center gap-4 relative overflow-hidden">
              
              {/* Animated Neo-Brutalist Checkmark Box */}
              <div className="w-12 h-12 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center shrink-0 relative transition-transform duration-300">
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-[#111111]"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M 4.5 12.5 L 9.5 17.5 L 19.5 6.5"
                    stroke="#111111"
                    strokeWidth="3.5"
                    strokeLinecap="square"
                    strokeLinejoin="miter"
                    className="animate-check-draw"
                  />
                </svg>
              </div>

              {/* Status and ID */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-black uppercase tracking-wider text-[#FF6B1A] bg-white px-2 py-0.5 border border-[#111111]">
                    REGISTRATION CONFIRMED
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#111111] bg-[#FFF2D6] px-2 py-0.5 border border-[#111111]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-sync-glow shrink-0" />
                    <span>Saved to Firebase</span>
                  </span>
                </div>

                <h3 className="font-display font-extrabold text-2xl text-[#111111] leading-tight">
                  You're registered for the conclave.
                </h3>
                
                <p className="text-sm font-mono font-bold text-[#111111]">
                  Registration ID: <span className="text-[#FF6B1A] text-base">{submittedRecord.id}</span>
                </p>
              </div>
            </div>

            {/* Mandatory Entry Line */}
            <div className="p-4 bg-[#FFF2D6] border-2 border-[#111111] font-sans font-bold text-sm sm:text-base text-[#111111] flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#FF6B1A] shrink-0" />
              <span>Date and entry details will be shared on your email/WhatsApp.</span>
            </div>

            {/* Summary of what they entered */}
            <div className="p-5 bg-[#FFF8EC] border-2 border-[#111111] space-y-3 font-sans text-sm">
              <span className="font-mono font-black text-xs uppercase tracking-wider text-[#111111] block border-b border-[#111111]/20 pb-2">
                Registration Summary
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-[#111111]/70 text-xs block">Full Name:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.name}</span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">Email Address:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.email}</span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">WhatsApp Phone:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.phone}</span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">College / Organisation:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.college}</span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">Category:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.role} · {submittedRecord.city}</span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">Pitch Arena Aspirant:</span>
                  <span className="font-bold text-[#FF6B1A]">
                    {submittedRecord.wantsToPitch ? 'Yes (Applying to Pitch)' : 'Spectator Attendee'}
                  </span>
                </div>
              </div>

              {submittedRecord.wantsToPitch && submittedRecord.startupName && (
                <div className="pt-2 border-t border-[#111111]/20">
                  <span className="text-[#111111]/70 text-xs block">Startup Pitch Deck Entry:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.startupName}</span>
                  {submittedRecord.startupPitch && (
                    <p className="text-sm text-[#111111]/80 mt-0.5 italic">"{submittedRecord.startupPitch}"</p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between border-t-2 border-[#111111]">
              <span className="text-xs font-mono text-[#111111]/70">
                Logged to Central Conclave Database
              </span>
              <button
                type="button"
                onClick={handleResetRegistration}
                className="text-xs font-mono font-bold text-[#FF6B1A] underline hover:text-[#111111] min-h-[44px] flex items-center cursor-pointer"
              >
                Register another person →
              </button>
            </div>
          </div>
        ) : (
          /* =============================================================== */
          /* CASE C: ACTIVE REGISTRATION FORM (Stored in Firestore & Cache)   */
          /* =============================================================== */
          <div className="p-6 sm:p-10 bg-white brutal-border brutal-shadow-lg space-y-6">
            
            <div className="border-b-2 border-[#111111] pb-4 space-y-1">
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111]">
                Register for Startup Conclave 1.0
              </h2>
              {/* 1-Line Intro */}
              <p className="text-sm sm:text-base font-sans text-[#111111]/80 font-medium">
                Registration happens on this site. Date and entry details will be shared on email and WhatsApp.
              </p>
            </div>

            {errors.form && (
              <div className="p-3.5 bg-red-100 border-2 border-red-500 text-red-700 text-sm font-bold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans text-sm">
              
              {/* Anti-Bot Honeypot Field (Hidden from humans) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="user_nickname">Do not fill this</label>
                <input
                  id="user_nickname"
                  type="text"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {/* 1. Full Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#111111] block">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors({ ...errors, fullName: '' });
                  }}
                  placeholder="e.g. Aryan Sharma"
                  className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white min-h-[46px] text-base"
                />
                {errors.fullName && <p className="text-xs text-red-600 font-bold">{errors.fullName}</p>}
              </div>

              {/* 2. Email & WhatsApp (10-digit Indian Number) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#111111] block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    placeholder="aryan@example.com"
                    className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white min-h-[46px] text-base"
                  />
                  {errors.email && <p className="text-xs text-red-600 font-bold">{errors.email}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#111111] block">Phone / WhatsApp (10 digits) *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setPhone(val);
                      if (errors.phone) setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="10-digit number"
                    className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white font-mono min-h-[46px] text-base"
                  />
                  {errors.phone && <p className="text-xs text-red-600 font-bold">{errors.phone}</p>}
                </div>
              </div>

              {/* 3. Role & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-bold text-[#111111] block">I am a *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white font-medium min-h-[46px] text-base"
                  >
                    <option value="Student">Student</option>
                    <option value="Founder">Founder</option>
                    <option value="Professional">Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[#111111] block">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Meerut, Delhi, Noida"
                    className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white min-h-[46px] text-base"
                  />
                </div>
              </div>

              {/* 4. College / Organisation */}
              <div className="space-y-1.5">
                <label className="font-bold text-[#111111] block">
                  {role === 'Student' ? 'College / University Name *' : 'Organisation Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => {
                    setCollege(e.target.value);
                    if (errors.college) setErrors({ ...errors, college: '' });
                  }}
                  placeholder={role === 'Student' ? 'e.g. DVSIET Meerut' : 'e.g. Acme Labs'}
                  className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white min-h-[46px] text-base"
                />
                {errors.college && <p className="text-xs text-red-600 font-bold">{errors.college}</p>}
              </div>

              {/* 5. Course and Year (Required ONLY for Students) */}
              {role === 'Student' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FFF2D6] border-2 border-[#111111]">
                  <div className="space-y-1.5">
                    <label className="font-bold text-[#111111] block">Degree / Course *</label>
                    <input
                      type="text"
                      required
                      value={course}
                      onChange={(e) => {
                        setCourse(e.target.value);
                        if (errors.course) setErrors({ ...errors, course: '' });
                      }}
                      placeholder="e.g. B.Tech CS, BCA, MBA"
                      className="w-full p-2.5 bg-white border-2 border-[#111111] font-sans min-h-[44px] text-base"
                    />
                    {errors.course && <p className="text-xs text-red-600 font-bold">{errors.course}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-[#111111] block">Current Year *</label>
                    <input
                      type="text"
                      required
                      value={year}
                      onChange={(e) => {
                        setYear(e.target.value);
                        if (errors.year) setErrors({ ...errors, year: '' });
                      }}
                      placeholder="e.g. 2nd Year / 3rd Year"
                      className="w-full p-2.5 bg-white border-2 border-[#111111] font-sans min-h-[44px] text-base"
                    />
                    {errors.year && <p className="text-xs text-red-600 font-bold">{errors.year}</p>}
                  </div>
                </div>
              )}

              {/* 6. Pitch Arena Checkbox & Conditional Fields */}
              <div className="p-4 bg-white border-2 border-[#111111] space-y-3">
                <div className="flex items-center gap-3 min-h-[44px]">
                  <input
                    type="checkbox"
                    id="wantsToPitchCheck"
                    checked={wantsToPitch}
                    onChange={(e) => setWantsToPitch(e.target.checked)}
                    className="w-5 h-5 accent-[#FF6B1A] border-2 border-[#111111] rounded-none cursor-pointer"
                  />
                  <label htmlFor="wantsToPitchCheck" className="font-bold text-[#111111] cursor-pointer text-sm sm:text-base">
                    I also want to pitch my startup
                  </label>
                </div>

                {/* Extra two optional fields if checked */}
                {wantsToPitch && (
                  <div className="pt-3 border-t-2 border-[#111111] space-y-3 animate-in fade-in">
                    <div className="space-y-1.5">
                      <label className="font-bold text-[#111111] block text-xs sm:text-sm">
                        Startup Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={startupName}
                        onChange={(e) => setStartupName(e.target.value)}
                        placeholder="e.g. KisanAI"
                        className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans min-h-[44px] text-base"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-bold text-[#111111] block text-xs sm:text-sm">
                        One-Line Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={startupPitch}
                        onChange={(e) => setStartupPitch(e.target.value)}
                        placeholder="e.g. Automated sensors for farmers in Western UP"
                        className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans min-h-[44px] text-base"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* 7. Consent Checkbox */}
              <div className="pt-2">
                <div className="flex items-center gap-3 min-h-[44px]">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    required
                    checked={consentAgreed}
                    onChange={(e) => {
                      setConsentAgreed(e.target.checked);
                      if (errors.consent) setErrors({ ...errors, consent: '' });
                    }}
                    className="w-5 h-5 accent-[#FF6B1A] border-2 border-[#111111] rounded-none cursor-pointer shrink-0"
                  />
                  <label htmlFor="consentCheck" className="text-xs sm:text-sm font-semibold text-[#111111] cursor-pointer">
                    I agree to be contacted about this event.
                  </label>
                </div>
                {errors.consent && <p className="text-xs text-red-600 font-bold mt-1">{errors.consent}</p>}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full brutal-btn bg-[#FF6B1A] text-white p-4 font-display font-black text-base sm:text-lg uppercase tracking-wider rounded-[2px] cursor-pointer flex items-center justify-center gap-2 min-h-[50px]"
                >
                  {isSubmitting ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Register for Startup Conclave 1.0</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center font-mono text-xs text-[#111111]/70">
                DVSIET Meerut · No third-party forms
              </div>
            </form>

          </div>
        )}

      </section>

      {/* =================================================================== */}
      {/* 10. FAQ ACCORDION (6 Questions)                                     */}
      {/* =================================================================== */}
      <section id="faq" className="px-4 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto text-left border-b-2 border-[#111111]">
        {/* In-page Schema.org JSON-LD for Search Engine FAQ Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
            Clear Answers
          </span>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#111111] mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3.5">
          {CONFIG.faq.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white brutal-border brutal-shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-display font-bold text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer min-h-[50px]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF6B1A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-sm sm:text-base font-sans text-[#111111]/85 border-t border-[#111111]/15 leading-relaxed font-medium">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 11. FOOTER                                                          */}
      {/* =================================================================== */}
      <footer className="px-4 sm:px-8 py-12 sm:py-16 max-w-6xl mx-auto text-left font-sans text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b-2 border-[#111111]">
          
          <div className="space-y-2">
            <div className="font-display font-black text-xl text-[#111111]">
              {CONFIG.event.name.toUpperCase()}
            </div>
            <p className="text-xs sm:text-sm text-[#111111]/70 font-mono">
              {CONFIG.event.tagline}
            </p>
            <div className="font-bold text-[#FF6B1A] pt-1">
              Organised at DVSIET, Meerut
            </div>
          </div>

          <div className="space-y-2 font-mono text-xs sm:text-sm">
            <span className="font-black text-[#111111] uppercase block mb-1">Secretariat Desk</span>
            {(() => {
              const email = (CONFIG.contactEmail || CONFIG.contact?.email || '').trim();
              const phone = (CONFIG.contactPhone || CONFIG.contact?.phone || '').trim();

              return (
                <>
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                      <a href={`mailto:${email}`} className="hover:underline">
                        {email}
                      </a>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                      <a href={`tel:${phone}`} className="hover:underline">
                        {phone}
                      </a>
                    </div>
                  )}
                  {CONFIG.contact?.city && (
                    <div className="text-[#111111]/70 pt-1">
                      {CONFIG.contact.city}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <div className="space-y-2">
            <span className="font-mono font-black text-[#111111] uppercase block text-xs sm:text-sm">Social & Community</span>
            {(() => {
              const linkedin = (CONFIG.linkedinUrl || CONFIG.contact?.socials?.linkedin || '').trim();
              const xTwitter = (CONFIG.xUrl || CONFIG.contact?.socials?.twitter || '').trim();
              const instagram = (CONFIG.instagramUrl || CONFIG.contact?.socials?.instagram || '').trim();

              if (!linkedin && !xTwitter && !instagram) {
                return (
                  <span className="font-mono text-xs text-[#111111]/60 block pt-1">
                    Announcing soon
                  </span>
                );
              }

              return (
                <div className="flex flex-wrap items-center gap-3">
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 brutal-border bg-white hover:bg-[#FFD400] transition-colors min-h-[44px] flex items-center text-xs font-mono font-bold"
                      aria-label="LinkedIn"
                    >
                      LinkedIn
                    </a>
                  )}
                  {xTwitter && (
                    <a
                      href={xTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 brutal-border bg-white hover:bg-[#FFD400] transition-colors min-h-[44px] flex items-center text-xs font-mono font-bold"
                      aria-label="X (Twitter)"
                    >
                      X (Twitter)
                    </a>
                  )}
                  {instagram && (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 brutal-border bg-white hover:bg-[#FFD400] transition-colors min-h-[44px] flex items-center text-xs font-mono font-bold"
                      aria-label="Instagram"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              );
            })()}
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono text-[#111111]/70">
          <span>© {new Date().getFullYear()} Startup Conclave 1.0. All rights reserved.</span>
          <span>Dewan V.S. Institute of Engineering & Technology, Meerut.</span>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* STICKY BOTTOM BAR ON MOBILE                                         */}
      {/* =================================================================== */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFF8EC] border-t-2 border-[#111111] px-4 py-2.5 flex items-center justify-between shadow-[0_-4px_0px_#111111]">
        <div className="space-y-0.5">
          <div className="font-display font-extrabold text-xs text-[#111111] truncate max-w-[170px]">
            STARTUP CONCLAVE 1.0
          </div>
          <div className="font-mono text-xs text-[#FF6B1A] font-bold">
            DVSIET Meerut · 2 Days
          </div>
        </div>

        <button
          onClick={() => handleNavClick('register')}
          className="brutal-btn bg-[#FF6B1A] text-white px-4 py-2.5 font-display font-black text-xs uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[44px] flex items-center gap-1.5"
        >
          <span>Register Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* =================================================================== */}
      {/* PARTNER MODAL FORM                                                  */}
      {/* =================================================================== */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF8EC] brutal-border brutal-shadow-lg p-6 sm:p-8 max-w-lg w-full text-left space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
              <h3 className="font-display font-black text-xl text-[#111111]">
                Partner With Startup Conclave 1.0
              </h3>
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="p-1 brutal-border bg-white hover:bg-[#FFD400] min-h-[38px] min-w-[38px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {partnerSuccess ? (
              <div className="p-6 bg-[#FFD400] border-2 border-[#111111] text-center space-y-2">
                <Check className="w-8 h-8 text-[#111111] mx-auto stroke-[3]" />
                <h4 className="font-display font-bold text-lg">Thank You!</h4>
                <p className="text-sm font-sans">
                  Your inquiry has been stored. Our team will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-3 font-sans text-sm">
                {/* Anti-Bot Honeypot Field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="partner_nickname">Do not fill this</label>
                  <input
                    id="partner_nickname"
                    type="text"
                    value={partnerHoneypot}
                    onChange={(e) => setPartnerHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {partnerError && (
                  <div className="p-2.5 bg-red-100 border border-red-500 text-red-700 text-xs font-bold">
                    {partnerError}
                  </div>
                )}

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Company / Organisation *</label>
                  <input
                    type="text"
                    required
                    value={partnerData.company}
                    onChange={(e) => setPartnerData({ ...partnerData, company: e.target.value })}
                    placeholder="e.g. Acme Tech"
                    className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#111111] block mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={partnerData.contactName}
                      onChange={(e) => setPartnerData({ ...partnerData, contactName: e.target.value })}
                      placeholder="e.g. Rahul Dev"
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#111111] block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={partnerData.phone}
                      onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })}
                      placeholder="Enter 10-digit number"
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={partnerData.email}
                    onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                    placeholder="partner@acme.com"
                    className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Partnership Interest / Message</label>
                  <textarea
                    rows={3}
                    value={partnerData.message}
                    onChange={(e) => setPartnerData({ ...partnerData, message: e.target.value })}
                    placeholder="Tell us what track or format you'd like to support..."
                    className="w-full p-2.5 bg-white border-2 border-[#111111] text-base"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPartnerModalOpen(false)}
                    className="px-4 py-2 border-2 border-[#111111] font-bold text-xs min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={partnerSubmitting}
                    className="brutal-btn bg-[#FF6B1A] text-white px-5 py-2 font-display font-bold text-xs uppercase min-h-[44px]"
                  >
                    {partnerSubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
