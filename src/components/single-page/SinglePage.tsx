import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  RotateCw,
  Shield,
  FileText,
  Copy,
  Camera,
  Download,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase.ts';
import { CONFIG, type LogoItem } from '../../config.ts';
import {
  createRegistration,
  createPartnerEnquiry,
  isEmailRegistered,
  isPhoneRegistered,
  isValidEmail,
  isValidIndianPhone,
  isValidPitchDeckUrl,
  isValidUtr,
  fetchPublicRegistrationCount,
  RegistrationInput,
} from '../../services/registrations.ts';
import { getEventSettings } from '../../services/admin.ts';
import {
  checkFormFillTime,
  checkBrowserRateLimit,
  recordBrowserSubmission,
} from '../../services/botProtection.ts';

// Crisp Google Brand Icon
const GoogleIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

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
        width="460"
        height="380"
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

// Logo tile: equal-height white box with 2px #111111 border and hard offset shadow
const LogoTile: React.FC<{
  item: LogoItem;
  heightClass?: string;
  tileClass?: string;
  loading?: 'lazy' | 'eager';
}> = ({
  item,
  heightClass = 'h-12 sm:h-14',
  tileClass = 'p-2.5 sm:p-3 min-h-[56px] sm:min-h-[64px]',
  loading = 'lazy',
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null; // hide tile if image fails to load
  const img = (
    <img
      src={item.logo}
      alt={item.name}
      width={item.width || 200}
      height={item.height || 200}
      loading={loading}
      decoding="async"
      onError={() => setFailed(true)}
      className={`${heightClass} w-auto max-w-[180px] sm:max-w-[220px] object-contain`}
    />
  );
  return (
    <div className={`bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center ${tileClass}`}>
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={item.name}>
          {img}
        </a>
      ) : (
        img
      )}
    </div>
  );
};

// Accessible Focus Trap & Escape Handler Hook for Modals and Drawers
const useFocusTrap = ({
  isOpen,
  containerRef,
  onClose,
  triggerRef,
}: {
  isOpen: boolean;
  containerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLElement | null>;
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const returnTarget = triggerRef?.current;
    const container = containerRef.current;
    if (!container) return;

    const focusableSelector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const focusable = container.querySelectorAll<HTMLElement>(focusableSelector);
    if (focusable.length > 0) {
      focusable[0].focus();
    } else {
      container.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const elements = container.querySelectorAll<HTMLElement>(focusableSelector);
        if (elements.length === 0) {
          e.preventDefault();
          return;
        }
        const first = elements[0];
        const last = elements[elements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first || !container.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !container.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      returnTarget?.focus?.();
    };
  }, [isOpen, containerRef, onClose, triggerRef]);
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
    const configuredBase = typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL.trim()
      ? import.meta.env.VITE_SITE_URL.trim().replace(/\/$/, '')
      : '';
    const origin = configuredBase || (typeof window !== 'undefined' ? window.location.origin : '');
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const canonicalUrl = `${origin}${currentPath}`;

    const eventNode: any = {
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
    };

    // HARD RULE: never include price, date or speakers unless present in CONFIG with confirmed values
    const eventConfig = CONFIG.event as any;
    if (eventConfig?.dateConfirmed && eventConfig?.startDate && eventConfig.startDate !== 'To be announced') {
      eventNode.startDate = eventConfig.startDate;
      if (eventConfig.endDate) {
        eventNode.endDate = eventConfig.endDate;
      }
    }

    if ((CONFIG as any).ticketsConfirmed && CONFIG.tickets?.participant?.fee !== undefined) {
      eventNode.offers = [
        {
          '@type': 'Offer',
          name: CONFIG.tickets.participant.label,
          price: CONFIG.tickets.participant.fee,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url: canonicalUrl,
        },
      ];
    }

    const confirmedSpeakers = (CONFIG.speakersInvestors?.speakers || []).filter(
      (s: any) => s.status === 'confirmed' && s.name
    );
    if (confirmedSpeakers.length > 0) {
      eventNode.performer = confirmedSpeakers.map((s: any) => ({
        '@type': 'Person',
        name: s.name,
        jobTitle: s.title || undefined,
      }));
    }

    return {
      '@context': 'https://schema.org',
      '@graph': [
        eventNode,
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

    // Sync canonical link in head if VITE_SITE_URL is provided
    const configuredBase = typeof import.meta.env.VITE_SITE_URL === 'string' && import.meta.env.VITE_SITE_URL.trim()
      ? import.meta.env.VITE_SITE_URL.trim()
      : '';
    if (configuredBase && typeof document !== 'undefined') {
      let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!canonicalEl) {
        canonicalEl = document.createElement('link');
        canonicalEl.rel = 'canonical';
        document.head.appendChild(canonicalEl);
      }
      canonicalEl.href = configuredBase.endsWith('/') ? configuredBase : `${configuredBase}/`;
    }

    return () => {
      const el = document.getElementById(scriptId);
      if (el) {
        el.remove();
      }
    };
  }, [structuredData]);

  // Mobile navigation drawer state & keyboard refs
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Partner Modal State & keyboard refs
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const partnerTriggerRef = useRef<HTMLElement | null>(null);
  const partnerModalRef = useRef<HTMLDivElement>(null);

  // Privacy Notice Modal State (/privacy or #privacy) & keyboard refs
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const privacyTriggerRef = useRef<HTMLElement | null>(null);
  const privacyModalRef = useRef<HTMLDivElement>(null);

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
    mobileMenuToggleRef.current?.focus();
  };

  const handleOpenPartnerModal = (e?: React.MouseEvent) => {
    if (e?.currentTarget) {
      partnerTriggerRef.current = e.currentTarget as HTMLElement;
    }
    setPartnerModalOpen(true);
  };

  const handleOpenPrivacyModal = (e?: React.MouseEvent) => {
    if (e?.currentTarget) {
      privacyTriggerRef.current = e.currentTarget as HTMLElement;
    }
    setPrivacyModalOpen(true);
    if (typeof window !== 'undefined' && window.location.hash !== '#privacy' && window.location.pathname !== '/privacy') {
      window.history.pushState(null, '', '#privacy');
    }
  };

  const handleClosePrivacyModal = () => {
    setPrivacyModalOpen(false);
    if (typeof window !== 'undefined') {
      if (window.location.hash === '#privacy') {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      } else if (window.location.pathname === '/privacy') {
        window.history.replaceState(null, '', '/');
      }
    }
    privacyTriggerRef.current?.focus();
  };

  // Keyboard accessibility & focus traps for nav drawer and dialog modals
  useFocusTrap({
    isOpen: mobileMenuOpen,
    containerRef: mobileMenuRef,
    onClose: handleCloseMobileMenu,
    triggerRef: mobileMenuToggleRef,
  });

  useFocusTrap({
    isOpen: partnerModalOpen,
    containerRef: partnerModalRef,
    onClose: () => {
      setPartnerModalOpen(false);
      partnerTriggerRef.current?.focus();
    },
    triggerRef: partnerTriggerRef,
  });

  useFocusTrap({
    isOpen: privacyModalOpen,
    containerRef: privacyModalRef,
    onClose: handleClosePrivacyModal,
    triggerRef: privacyTriggerRef,
  });

  // Registration Status & Counter Settings from config & Firestore settings/event
  const [regStatus, setRegStatus] = useState<'open' | 'closed'>(CONFIG.registration.status);
  const [showCounter, setShowCounter] = useState<boolean>(CONFIG.registration.showCount);
  const [registrationCount, setRegistrationCount] = useState<number>(0);

  useEffect(() => {
    fetchPublicRegistrationCount().then(setRegistrationCount).catch(() => {});
    getEventSettings().then((s) => {
      if (s) {
        setRegStatus(s.registrationStatus || s.status || CONFIG.registration.status);
        setShowCounter(typeof s.showCount === 'boolean' ? s.showCount : CONFIG.registration.showCount);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleLocation = () => {
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#privacy' || window.location.pathname === '/privacy') {
          setPrivacyModalOpen(true);
        }
      }
    };
    handleLocation();
    window.addEventListener('hashchange', handleLocation);
    window.addEventListener('popstate', handleLocation);
    return () => {
      window.removeEventListener('hashchange', handleLocation);
      window.removeEventListener('popstate', handleLocation);
    };
  }, []);
  const [partnerData, setPartnerData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: 'Cash',
    contributionRange: '',
    message: '',
  });
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [partnerError, setPartnerError] = useState('');

  // Registration Form State (id="register")
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);
  const [googleAuthError, setGoogleAuthError] = useState('');
  const [ticket, setTicket] = useState<'participant' | 'pitch'>('participant');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [courseSelect, setCourseSelect] = useState('');
  const [customCourse, setCustomCourse] = useState('');
  const [year, setYear] = useState('');
  const [yearSelect, setYearSelect] = useState('');
  const [customYear, setCustomYear] = useState('');
  const [role, setRole] = useState<'Student' | 'Founder' | 'Professional' | 'Other'>('Student');
  const [professionalRole, setProfessionalRole] = useState('');
  const [city, setCity] = useState('');
  const [wantsToPitch, setWantsToPitch] = useState(false);
  const [startupName, setStartupName] = useState('');
  const [startupPitch, setStartupPitch] = useState('');
  const [pitchSector, setPitchSector] = useState('');
  const [pitchStage, setPitchStage] = useState<'Idea' | 'Prototype' | 'Launched' | 'Revenue' | ''>('');
  const [pitchDeckLink, setPitchDeckLink] = useState('');
  const [pitchTeamSize, setPitchTeamSize] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  // Pitch ticket is open only when both upiId and payeeName are configured
  const isPitchOpen = Boolean(CONFIG.payment.upiId?.trim() && CONFIG.payment.payeeName?.trim());

  // Memoized client-side UPI payment deep-link URL (upi://pay?pa=&pn=&am=999&cu=INR)
  const upiPayUrl = useMemo(() => {
    const upiId = CONFIG.payment.upiId?.trim();
    const payee = CONFIG.payment.payeeName?.trim();
    if (!upiId || !payee) return '';
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payee)}&am=${CONFIG.tickets.pitch.fee}&cu=INR`;
  }, []);

  // Form Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRecord, setSubmittedRecord] = useState<{
    id: string;
    ticketCode?: string;
    ticket?: 'participant' | 'pitch';
    name: string;
    email: string;
    phone: string;
    college: string | { name: string; state?: string; city?: string; type?: string; listed: boolean };
    role: string;
    city: string;
    wantsToPitch: boolean;
    startupName?: string;
    startupPitch?: string;
    sector?: string;
    stage?: string;
    pitchDeckLink?: string;
    teamSize?: string;
    paymentStatus?: string;
    paymentAmount?: number;
    paymentUtr?: string;
    status?: string;
  } | null>(null);

  if (import.meta.env.DEV && typeof window !== 'undefined') {
    (window as any).__setTestSubmittedRecord = setSubmittedRecord;
  }

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Schedule Active Tab (Day 1 vs Day 2)
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // In-app browser detection (Instagram, WhatsApp, Facebook, LinkedIn)
  const isInAppBrowser = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Instagram|WhatsApp|FBAN|FBAV|LinkedInApp/i.test(navigator.userAgent);
  }, []);

  // Friendly error message mapper for Google Auth (logs technical error to console only)
  const getFriendlyAuthErrorMessage = (error: any): string => {
    console.error('Google Auth technical error:', error);

    const code = error?.code || '';
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return 'Google sign-in was closed. Please click "Continue with Google" to try again.';
    }
    if (code === 'auth/popup-blocked') {
      return 'Popup was blocked by your browser. Please allow popups or use redirect.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Network error connecting to Google. Please check your internet connection and try again.';
    }
    if (code === 'auth/unauthorized-domain') {
      return 'Sign-in is temporarily unavailable, please contact the organisers.';
    }
    return 'Sign-in is temporarily unavailable, please contact the organisers.';
  };

  // Google Sign-In with popup + redirect fallback for mobile
  const handleGoogleSignIn = async () => {
    setIsGoogleSigningIn(true);
    setGoogleAuthError('');

    // Detect mobile browsers where popups are frequently blocked or restricted
    const isMobile =
      typeof navigator !== 'undefined' &&
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        await signInWithRedirect(auth, googleProvider);
        return;
      } catch (redirectErr: any) {
        console.warn('Mobile signInWithRedirect failed, attempting popup fallback:', redirectErr);
      }
    }

    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        setAuthUser(result.user);
        if (result.user.email) {
          setEmail(result.user.email.toLowerCase());
          setFullName((prev) => prev.trim() || result.user.displayName || '');
        }
        setGoogleAuthError('');
      }
    } catch (err: any) {
      const code = err?.code || '';
      // Automatic fallback to redirect if popup was blocked by browser
      if (code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr: any) {
          const friendly = getFriendlyAuthErrorMessage(redirectErr);
          setGoogleAuthError(friendly);
        }
      } else {
        const friendly = getFriendlyAuthErrorMessage(err);
        setGoogleAuthError(friendly);
      }
    } finally {
      setIsGoogleSigningIn(false);
    }
  };

  // Google Sign-Out
  const handleGoogleSignOut = async () => {
    try {
      await signOut(auth);
      setAuthUser(null);
      setEmail('');
      setGoogleAuthError('');
    } catch (err) {
      console.error('Sign-out error:', err);
    }
  };

  // Auth state listener and redirect result handler
  useEffect(() => {
    // 1. Process result from mobile redirect sign-in if returning from Google
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          setAuthUser(result.user);
          if (result.user.email) {
            setEmail(result.user.email.toLowerCase());
            setFullName((prev) => prev.trim() || result.user.displayName || '');
          }
          setGoogleAuthError('');
        }
      })
      .catch((err) => {
        const friendly = getFriendlyAuthErrorMessage(err);
        setGoogleAuthError(friendly);
      });

    // 2. Continuous auth state observer
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      if (user?.email) {
        setEmail(user.email.toLowerCase());
        setFullName((prev) => prev.trim() || user.displayName || '');
      }
    });

    return () => unsubscribe();
  }, []);

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
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [partnerNetworkError, setPartnerNetworkError] = useState(false);

  // Partner Form Submit Handler
  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (partnerSubmitting) return;

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
    setPartnerNetworkError(false);

    const res = await createPartnerEnquiry(partnerData);
    setPartnerSubmitting(false);

    if (res.success) {
      setPartnerNetworkError(false);
      setPartnerError('');
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
          partnershipType: 'Cash',
          contributionRange: '',
          message: '',
        });
        setPartnerHoneypot('');
      }, 2000);
    } else {
      setPartnerNetworkError(Boolean(res.isNetworkError));
      setPartnerError(res.error || 'Could not submit. Check your internet and try again.');
    }
  };

  // Registration Form Submit Handler
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // 1. Honeypot Check (Silently reject bot submissions)
    if (honeypot.trim() !== '') {
      return;
    }

    const newErrors: Record<string, string> = {};

    // Google Sign-in Verification Enforcement (rules require request.auth.token.email_verified == true)
    if (!authUser || !authUser.email) {
      setGoogleAuthError('Please sign in with Google to verify your email before submitting.');
      return;
    }

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required.';
    }

    const emailTrim = email.trim().toLowerCase();
    const userEmailLower = authUser.email.trim().toLowerCase();
    if (emailTrim !== userEmailLower) {
      newErrors.email = `Registration email (${emailTrim}) must match your signed-in Google account (${userEmailLower}).`;
    } else if (!emailTrim || !isValidEmail(emailTrim)) {
      newErrors.email = 'Please provide a valid email address.';
    } else if (isEmailRegistered(emailTrim)) {
      newErrors.email = 'This email or phone is already registered.';
    }

    const phoneTrim = phone.replace(/\D/g, '').slice(0, 10);
    if (!phoneTrim || !isValidIndianPhone(phoneTrim)) {
      newErrors.phone = 'Please enter a valid 10-digit Indian phone number.';
    } else if (isPhoneRegistered(phoneTrim)) {
      newErrors.phone = 'This email or phone is already registered.';
    }

    if (!college.trim()) {
      newErrors.college = role === 'Student' ? 'College / University name is required.' : 'Organisation name is required.';
    }

    let effectiveCourse = '';
    let effectiveYear = '';

    if (role === 'Student') {
      if (!courseSelect) {
        newErrors.course = 'Please select your degree/course.';
      } else if (courseSelect === 'Other') {
        if (!customCourse.trim()) {
          newErrors.course = 'Please specify your degree/course.';
        } else {
          effectiveCourse = customCourse.trim();
        }
      } else {
        effectiveCourse = courseSelect.trim();
      }

      if (!yearSelect) {
        newErrors.year = 'Please select your current year.';
      } else if (yearSelect === 'Other') {
        if (!customYear.trim()) {
          newErrors.year = 'Please specify your current year.';
        } else {
          effectiveYear = customYear.trim();
        }
      } else {
        effectiveYear = yearSelect.trim();
      }
    } else {
      if (!professionalRole.trim()) {
        newErrors.professionalRole = 'Role / designation is required.';
      } else {
        effectiveCourse = professionalRole.trim();
        effectiveYear = '';
      }
    }

    const isPitch = ticket === 'pitch' || wantsToPitch;

    if (isPitch) {
      if (!startupName.trim()) {
        newErrors.startupName = 'Startup name is required for pitch registrations.';
      }
      if (!pitchSector) {
        newErrors.pitchSector = 'Please select a sector.';
      }
      if (!pitchStage) {
        newErrors.pitchStage = 'Please select a stage.';
      }
      if (!startupPitch.trim()) {
        newErrors.startupPitch = 'Startup pitch description is required for pitch registrations.';
      }
      if (!pitchDeckLink.trim()) {
        newErrors.pitchDeckLink = 'Pitch deck link is required for pitch registrations.';
      } else if (!isValidPitchDeckUrl(pitchDeckLink.trim())) {
        newErrors.pitchDeckLink = 'Pitch deck link must be a Google Drive (drive.google.com) or Canva (canva.com) URL.';
      }
      if (!pitchTeamSize) {
        newErrors.pitchTeamSize = 'Please select your team size.';
      }

      // Block pitch registration if UPI ID or payeeName is not configured (no fake UPI)
      if (!isPitchOpen) {
        newErrors.form = 'Pitch registrations open soon.';
      } else {
        const cleanUtr = paymentUtr.trim();
        if (!cleanUtr) {
          newErrors.paymentUtr = '12-digit UPI Reference Number (UTR) is required.';
        } else if (!/^\d{12}$/.test(cleanUtr)) {
          newErrors.paymentUtr = 'Please enter a valid 12-digit numeric UPI Reference Number (UTR).';
        }
      }
    }

    if (!consentAgreed) {
      newErrors.consent = 'You must agree to be contacted about this event.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);

      // Focus first invalid field and scroll into view
      const fieldOrder = [
        { key: 'fullName', id: 'reg-fullName' },
        { key: 'email', id: 'reg-email' },
        { key: 'phone', id: 'reg-phone' },
        { key: 'college', id: 'reg-college' },
        { key: 'professionalRole', id: 'reg-professionalRole' },
        { key: 'course', id: courseSelect === 'Other' ? 'reg-customCourse' : 'reg-courseSelect' },
        { key: 'year', id: yearSelect === 'Other' ? 'reg-customYear' : 'reg-yearSelect' },
        { key: 'startupName', id: 'reg-startupName' },
        { key: 'pitchSector', id: 'reg-pitchSector' },
        { key: 'pitchStage', id: 'reg-pitchStage' },
        { key: 'startupPitch', id: 'reg-startupPitch' },
        { key: 'pitchDeckLink', id: 'reg-pitchDeckLink' },
        { key: 'pitchTeamSize', id: 'reg-pitchTeamSize' },
        { key: 'paymentUtr', id: 'reg-paymentUtr' },
        { key: 'consent', id: 'reg-consentCheck' },
      ];

      const firstError = fieldOrder.find((item) => Boolean(newErrors[item.key]));
      if (firstError) {
        setTimeout(() => {
          const el = document.getElementById(firstError.id);
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 50);
      }
      return;
    }

    // 2. Minimum 3-second form-fill time check (only for non-empty submissions)
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

    setIsSubmitting(true);
    setIsNetworkError(false);

    const inputData: RegistrationInput = {
      name: fullName.trim(),
      email: emailTrim,
      phone: phoneTrim,
      ticket: isPitch ? 'pitch' : 'participant',
      college: college.trim(),
      course: effectiveCourse.slice(0, 100),
      year: effectiveYear.slice(0, 50),
      role,
      city: city.trim() || 'Meerut',
      wantsToPitch: isPitch,
      startupName: isPitch ? startupName.trim() : undefined,
      startupPitch: isPitch ? startupPitch.trim() : undefined,
      sector: isPitch ? pitchSector : undefined,
      stage: isPitch ? pitchStage : undefined,
      pitchDeckLink: isPitch ? pitchDeckLink.trim() : undefined,
      teamSize: isPitch ? pitchTeamSize : undefined,
      paymentUtr: isPitch && paymentUtr.trim() ? paymentUtr.trim() : undefined,
      emailVerified: true,
    };

    const res = await createRegistration(inputData);
    setIsSubmitting(false);

    if (res.success && res.id) {
      // Record rate limit timestamp
      recordBrowserSubmission('registration');
      setIsNetworkError(false);
      setErrors({});
      setSubmittedRecord({
        id: res.id,
        ticketCode: res.ticketCode,
        ticket: isPitch ? 'pitch' : 'participant',
        name: fullName.trim(),
        email: emailTrim,
        phone: phoneTrim,
        college: college.trim(),
        role,
        city: city.trim() || 'Meerut',
        wantsToPitch: isPitch,
        startupName: isPitch ? startupName.trim() : undefined,
        startupPitch: isPitch ? startupPitch.trim() : undefined,
        sector: isPitch ? pitchSector : undefined,
        stage: isPitch ? pitchStage : undefined,
        pitchDeckLink: isPitch ? pitchDeckLink.trim() : undefined,
        teamSize: isPitch ? pitchTeamSize : undefined,
        paymentStatus: isPitch ? 'pending' : 'not_required',
        paymentAmount: isPitch ? CONFIG.tickets.pitch.fee : 0,
        paymentUtr: isPitch ? paymentUtr.trim() : undefined,
        status: res.status || 'registered',
      });
      setRegistrationCount((prev) => prev + 1);
    } else {
      // Keep all form data intact and surface clear error message with Retry option
      const isNet = Boolean(res.isNetworkError || res.error?.includes('internet') || res.error?.includes('network'));
      setIsNetworkError(isNet);
      setErrors({ form: res.error || (isNet ? 'Could not submit due to network error. Your details have been preserved. Please check your internet connection and retry.' : 'This email or phone may already be registered. If you are sure you have not registered, contact the organisers.') });
    }
  };

  const handleResetRegistration = () => {
    setSubmittedRecord(null);
    setTicket('participant');
    setFullName('');
    setEmail(authUser?.email ? authUser.email.toLowerCase() : '');
    setPhone('');
    setPaymentUtr('');
    setCollege('');
    setCourse('');
    setCourseSelect('');
    setCustomCourse('');
    setYear('');
    setYearSelect('');
    setCustomYear('');
    setProfessionalRole('');
    setCity('');
    setWantsToPitch(false);
    setStartupName('');
    setStartupPitch('');
    setPitchSector('');
    setPitchStage('');
    setPitchDeckLink('');
    setPitchTeamSize('');
    setConsentAgreed(false);
    setErrors({});
    setGoogleAuthError('');
    setIsNetworkError(false);
    setRegFormStartTime(Date.now());
    setCopiedId(false);
  };

  // Copy ID State & Feedback
  const [copiedId, setCopiedId] = useState(false);
  const [isDownloadingPass, setIsDownloadingPass] = useState(false);

  const handleCopyId = async () => {
    if (!submittedRecord?.id) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(submittedRecord.id);
        } catch {
          const textarea = document.createElement('textarea');
          textarea.value = submittedRecord.id;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = submittedRecord.id;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    } catch (e) {
      console.warn('Copy notice:', e);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handleDownloadConfirmation = () => {
    if (!submittedRecord) return;
    setIsDownloadingPass(true);

    try {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 800;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        window.print();
        setIsDownloadingPass(false);
        return;
      }

      // Background
      ctx.fillStyle = '#FFF8EC';
      ctx.fillRect(0, 0, width, height);

      // Card Shadow
      ctx.fillStyle = '#111111';
      ctx.fillRect(40, 40, width - 60, height - 60);

      // Main Card Surface
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(30, 30, width - 70, height - 70);
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#111111';
      ctx.strokeRect(30, 30, width - 70, height - 70);

      // Header Banner
      ctx.fillStyle = '#111111';
      ctx.fillRect(30, 30, width - 70, 110);

      ctx.fillStyle = '#FFD400';
      ctx.font = '900 36px sans-serif';
      ctx.fillText('STARTUP CONCLAVE 1.0', 70, 95);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 16px monospace';
      ctx.fillText('OFFICIAL REGISTRATION CONFIRMATION PASS', 70, 122);

      // Registration ID Callout Box
      ctx.fillStyle = '#FFD400';
      ctx.fillRect(70, 170, width - 150, 100);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#111111';
      ctx.strokeRect(70, 170, width - 150, 100);

      ctx.fillStyle = '#111111';
      ctx.font = '700 14px monospace';
      ctx.fillText('OFFICIAL REGISTRATION ID', 95, 202);

      ctx.font = '900 40px monospace';
      ctx.fillText(submittedRecord.id, 95, 248);

      const isPitchPending = submittedRecord.ticket === 'pitch' && submittedRecord.paymentStatus !== 'verified';
      const statusBadge = submittedRecord.status === 'waitlist'
        ? 'STATUS: WAITLIST'
        : isPitchPending
        ? 'STATUS: PAYMENT PENDING'
        : 'STATUS: CONFIRMED';
      ctx.fillStyle = submittedRecord.status === 'waitlist'
        ? '#78350F'
        : isPitchPending
        ? '#92400E'
        : '#065F46';
      ctx.font = '800 16px monospace';
      ctx.fillText(statusBadge, width - 340, 230);

      // Attendee Details
      ctx.fillStyle = '#111111';
      ctx.font = '700 22px sans-serif';
      ctx.fillText(`Attendee: ${submittedRecord.name}`, 70, 315);

      const colName = typeof submittedRecord.college === 'object' && submittedRecord.college ? (submittedRecord.college as any).name : submittedRecord.college;
      const ticketLabel = submittedRecord.ticket === 'pitch' ? CONFIG.tickets.pitch.label : CONFIG.tickets.participant.label;

      ctx.font = '500 17px sans-serif';
      ctx.fillText(`Pass / Ticket: ${ticketLabel}   |   College: ${colName}`, 70, 350);
      ctx.fillText(`Phone: ${submittedRecord.phone}   |   Email: ${submittedRecord.email}`, 70, 385);
      const paymentInfoStr = submittedRecord.paymentStatus === 'not_required'
        ? 'Payment: Not Required (Free)'
        : `Payment: ${(submittedRecord.paymentStatus || 'pending').toUpperCase()} (₹${submittedRecord.paymentAmount ?? CONFIG.tickets.pitch.fee})`;
      ctx.fillText(`Category: ${submittedRecord.role} · ${submittedRecord.city}   |   ${paymentInfoStr}`, 70, 420);

      // Security ticket code display if present
      if (submittedRecord.ticketCode) {
        ctx.font = '700 13px monospace';
        ctx.fillStyle = '#111111';
        ctx.fillText(`Pass Security Code: ${submittedRecord.ticketCode}`, 70, 452);
      }

      // Draw locally generated entry QR code if canvas element exists
      const qrCanvas = document.getElementById('pass-qr-canvas') as HTMLCanvasElement | null;
      if (qrCanvas) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(945, 290, 175, 175);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#111111';
        ctx.strokeRect(945, 290, 175, 175);

        ctx.drawImage(qrCanvas, 952, 297, 160, 160);

        ctx.fillStyle = '#111111';
        ctx.font = '700 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GATE ENTRY QR', 1032, 480);
        ctx.textAlign = 'left';
      }

      // Mandatory Venue & Entry Line Box
      ctx.fillStyle = '#FFF2D6';
      ctx.fillRect(70, 480, width - 150, 120);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#111111';
      ctx.strokeRect(70, 480, width - 150, 120);

      ctx.fillStyle = '#FF6B1A';
      ctx.font = '900 20px sans-serif';
      ctx.fillText('Venue: DVSIET, Meerut', 95, 518);

      ctx.fillStyle = '#111111';
      ctx.font = '700 17px sans-serif';
      ctx.fillText('Date and entry details will be shared by email and WhatsApp.', 95, 555);

      ctx.font = '500 14px monospace';
      ctx.fillStyle = '#444444';
      ctx.fillText('Dewan V.S. Institute of Engineering & Technology, NH-58, Meerut, UP', 95, 582);

      // Organiser Contact
      const contactEmail = (CONFIG.contactEmail || CONFIG.contact?.email || '').trim();
      const contactPhone = (CONFIG.contactPhone || CONFIG.contact?.phone || '').trim();

      const contactParts = [contactEmail, contactPhone].filter(Boolean);
      if (contactParts.length > 0) {
        ctx.fillStyle = '#111111';
        ctx.font = '600 15px monospace';
        ctx.fillText(`Organiser Contact: ${contactParts.join('   |   ')}`, 70, 650);
      }

      ctx.font = 'italic 13px sans-serif';
      ctx.fillStyle = '#666666';
      ctx.fillText('Take a screenshot of your Registration ID or carry this confirmation pass for venue entry.', 70, 680);

      ctx.font = '500 12px monospace';
      ctx.fillText(`Issued: ${new Date().toLocaleDateString()} · Startup Conclave 1.0`, 70, 715);

      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloadingPass(false);
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `StartupConclave-Confirmation-${submittedRecord.id}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        setIsDownloadingPass(false);
      }, 'image/png');
    } catch (err) {
      console.warn('Canvas pass error:', err);
      window.print();
      setIsDownloadingPass(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#111111] font-sans selection:bg-[#FF6B1A] selection:text-[#111111] pb-20 md:pb-0 overflow-x-clip text-base">
      
      {/* Skip to Content Link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#FFD400] focus:text-[#111111] focus:border-2 focus:border-[#111111] focus:shadow-[3px_3px_0px_#111111] focus:font-mono focus:font-bold focus:text-xs focus:uppercase focus:tracking-wider focus:outline-none"
      >
        Skip to content
      </a>

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
            className="hidden sm:inline-flex brutal-btn bg-[#FF6B1A] text-[#111111] px-5 py-2.5 font-display font-bold text-sm uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[44px] items-center"
          >
            Register Now
          </button>

          <button
            ref={mobileMenuToggleRef}
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
        <div
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation Directory"
          tabIndex={-1}
          className="md:hidden border-b-2 border-[#111111] bg-[#FFD400] p-4 sm:p-5 space-y-3 font-mono text-base font-bold uppercase tracking-wider animate-in fade-in shadow-[0_6px_0px_#111111]"
        >
          
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
              onClick={handleCloseMobileMenu}
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
              onClick={handleCloseMobileMenu}
              className="brutal-btn bg-white text-[#111111] px-4 py-2 font-mono text-xs font-black uppercase flex items-center gap-1.5 min-h-[42px] cursor-pointer hover:bg-[#111111] hover:text-white"
              aria-label="Close navigation menu"
            >
              <span>Close Menu</span>
              <X className="w-4 h-4 stroke-[3]" />
            </button>
          </div>

        </div>
      )}

      {/* Main Landmark for Content Accessibility */}
      <main id="main-content">

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
                className="brutal-btn bg-[#FF6B1A] text-[#111111] px-8 py-4 font-display font-bold text-lg uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 cursor-pointer min-h-[50px]"
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

      {/* ORGANISED BY strip: college units only (confirmed) */}
      {CONFIG.organisers.some((o) => o.confirmed) && (
        <section aria-label="Organised by" className="px-4 sm:px-8 pb-10 max-w-6xl mx-auto">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111]/70 mb-3">
            Organised by
          </div>
          <div className="flex flex-wrap items-stretch gap-3 sm:gap-4">
            {CONFIG.organisers
              .filter((o) => o.confirmed)
              .map((o) => (
                <LogoTile key={o.name} item={o} />
              ))}
          </div>
        </section>
      )}
      {/* Marquee Ticker Strip directly under hero */}
      <div className="w-full bg-[#111111] text-[#FFD400] border-y-2 border-[#111111] py-3.5 overflow-hidden font-display font-black text-sm sm:text-base tracking-widest uppercase select-none">
        <div className="animate-marquee whitespace-nowrap">
          <span>{CONFIG.event.marqueeText.repeat(10)}</span>
        </div>
      </div>

      {/* Targets Strip — only renders if CONFIG.stats has values */}
      {Boolean(CONFIG.stats && CONFIG.stats.length > 0) && (
        <section className="bg-[#FFF8EC] border-b-2 border-[#111111] px-4 sm:px-8 py-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
                Targets
              </span>
              <span className="font-mono text-xs text-[#111111]/70">
                Event goals &amp; benchmarks
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {CONFIG.stats.map((st, sIdx) => (
                <div key={sIdx} className="p-4 sm:p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111]">
                  <div className="font-display font-black text-2xl sm:text-4xl text-[#FF6B1A]">
                    {st.value}
                  </div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] mt-1">
                    {st.label}
                  </div>
                  {st.subtext && (
                    <div className="text-xs text-[#111111]/70 font-sans mt-0.5">
                      {st.subtext}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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
            <p className="font-display text-xl sm:text-2xl text-[#111111] font-extrabold">
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
                    {idx < 4 && <span className="font-mono text-xs text-[#111111]/70 hidden sm:inline">→</span>}
                  </div>
                  <div className="font-display font-black text-base text-[#111111]">{p.label}</div>
                  <div className="text-xs text-[#111111]/70">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* What Startups Get */}
          <div className="p-4 sm:p-6 bg-white brutal-border brutal-shadow space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black uppercase text-[#111111] tracking-wider block">
                What Startups Get
              </span>
              <span className="font-mono text-[11px] font-bold text-[#FF6B1A] uppercase">
                Stage Privileges
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              {CONFIG.pitchArena.whatStartupsGet.map((perk) => (
                <div key={perk.title} className="p-3.5 bg-[#FFF8EC] border-2 border-[#111111] space-y-1">
                  <div className="font-display font-black text-base text-[#111111]">
                    {perk.title}
                  </div>
                  <div className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    {perk.desc}
                  </div>
                </div>
              ))}
              {CONFIG.pitchArena.juryConfirmed && (
                <div className="p-3.5 bg-[#FFF8EC] border-2 border-[#111111] space-y-1">
                  <div className="font-display font-black text-base text-[#111111]">
                    Jury Evaluation
                  </div>
                  <div className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    Direct live scoring and review by confirmed industry jury members.
                  </div>
                </div>
              )}
              {CONFIG.pitchArena.investorsConfirmed && (
                <div className="p-3.5 bg-[#FFF8EC] border-2 border-[#111111] space-y-1">
                  <div className="font-display font-black text-base text-[#111111]">
                    Investor Access
                  </div>
                  <div className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    Direct interaction opportunities with confirmed institutional investors and angels.
                  </div>
                </div>
              )}
              {CONFIG.pitchArena.awardsConfirmed && (
                <div className="p-3.5 bg-[#FFF8EC] border-2 border-[#111111] space-y-1">
                  <div className="font-display font-black text-base text-[#111111]">
                    Awards &amp; Recognition
                  </div>
                  <div className="text-xs text-[#111111]/80 leading-relaxed font-medium">
                    Conclave trophies, official certificates, and stage recognition for winning teams.
                  </div>
                </div>
              )}
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
            <span className="bg-[#FF6B1A] text-[#111111] font-mono text-xs font-black px-3.5 py-1 border-2 border-[#111111] -rotate-1 uppercase tracking-wider inline-block">
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
                href={`mailto:${(CONFIG.contactEmail || CONFIG.contact?.email || '').trim()}?subject=Speaking%20Inquiry%20-%20Startup%20Conclave%201.0`}
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
      {/* =================================================================== */}
      {/* 8. FOR PARTNERS (06)                                                */}
      {/* =================================================================== */}
      <section id="partners" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111] space-y-12">
        
        {/* Header & Intro */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
              {CONFIG.partners.sectionNum}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
              Partnerships
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#111111] px-2.5 py-1 border border-[#111111]">
              {CONFIG.partners.badge}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#111111]">
                {CONFIG.partners.headline}
              </h2>
              <p className="font-display text-lg sm:text-xl text-[#FF6B1A] font-extrabold">
                {CONFIG.partners.tagline}
              </p>
              <p className="text-base font-sans text-[#111111]/85 font-medium leading-relaxed">
                {CONFIG.partners.subline}
              </p>
            </div>

            <button
              onClick={(e) => {
                setPartnerFormStartTime(Date.now());
                setPartnerHoneypot('');
                setPartnerError('');
                handleOpenPartnerModal(e);
              }}
              className="brutal-btn bg-[#FFD400] text-[#111111] px-6 py-3.5 font-display font-extrabold text-base uppercase tracking-wider rounded-[2px] cursor-pointer shrink-0 min-h-[46px] self-start sm:self-auto"
            >
              Become a Partner →
            </button>
          </div>
        </div>

        {/* 1. WHY PARTNER WITH US: 6 benefit cards (one line each, benefit-only wording) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
            <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111] uppercase tracking-tight">
              Why Partner With Us
            </h3>
            <span className="font-mono text-xs text-[#111111]/70 font-bold">
              6 Core Advantages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONFIG.partners.whyPartner.map((benefit) => (
              <div
                key={benefit.title}
                className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono text-[11px] font-bold text-[#FF6B1A] uppercase tracking-wider mb-1">
                    Partner Advantage
                  </div>
                  <h4 className="font-display font-black text-lg text-[#111111]">
                    {benefit.title}
                  </h4>
                  <p className="text-sm font-sans text-[#111111]/80 leading-relaxed font-medium mt-1">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. PARTNERSHIP OPTIONS: Title / Innovation / Gold / Supporting (hidden if empty) */}
        {Boolean(CONFIG.partnerTiers && CONFIG.partnerTiers.length > 0) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2">
              <h3 className="font-display font-black text-xl sm:text-2xl text-[#111111] uppercase tracking-tight">
                Partnership Options
              </h3>
              <span className="font-mono text-xs text-[#111111]/70 font-bold">
                Tailored Engagement Tiers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONFIG.partnerTiers.map((tier) => (
                <div
                  key={tier.id}
                  className="p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="inline-block bg-[#FFD400] text-[#111111] font-mono font-bold text-xs px-2.5 py-0.5 border border-[#111111] uppercase tracking-wider">
                      {tier.name}
                    </div>

                    <div className="p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-mono">
                      <span className="text-[#111111]/80 block text-[10px] uppercase font-bold tracking-wider">
                        Commitment
                      </span>
                      <span className="text-xs sm:text-sm font-black text-[#111111]">
                        {tier.price && tier.price.trim() ? tier.price.trim() : 'Contact us for details'}
                      </span>
                    </div>

                    <ul className="space-y-2 text-xs font-sans text-[#111111]/85 pt-2 border-t border-[#111111]/20">
                      {tier.benefits.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5 font-medium leading-relaxed">
                          <span className="text-[#FF6B1A] font-bold shrink-0">■</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t-2 border-[#111111]">
                    <button
                      type="button"
                      onClick={(e) => {
                        setPartnerData((prev) => ({
                          ...prev,
                          message: prev.message || `Inquiring about ${tier.name} tier.`,
                        }));
                        setPartnerFormStartTime(Date.now());
                        setPartnerHoneypot('');
                        setPartnerError('');
                        handleOpenPartnerModal(e);
                      }}
                      className="w-full brutal-btn bg-[#111111] hover:bg-[#FF6B1A] text-white hover:text-[#111111] py-2 px-3 font-display font-bold text-xs uppercase tracking-wider text-center cursor-pointer min-h-[40px]"
                    >
                      Enquire for {tier.name.split(' ')[0]} →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUPPORTED BY: renders only for supporters with written confirmation */}
        {CONFIG.supporters.some((s) => s.confirmed) && (
          <div className="p-6 bg-[#FFF2D6] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3">
            <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111]/70">
              Supported by
            </div>
            <div className="flex flex-wrap items-stretch gap-3 sm:gap-4">
              {CONFIG.supporters
                .filter((s) => s.confirmed)
                .map((s) => (
                  <LogoTile key={s.name} item={s} />
                ))}
            </div>
          </div>
        )}

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
            <h2 className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
              Registrations Closed
            </h2>
            <p className="text-base font-sans text-[#111111]/80 max-w-md mx-auto">
              Delegate registrations for Startup Conclave 1.0 are currently closed. For inquiries, please reach out to the secretariat.
            </p>
            {Boolean((CONFIG.contactEmail || CONFIG.contact?.email)?.trim()) && (
              <div className="pt-2">
                <a
                  href={`mailto:${(CONFIG.contactEmail || CONFIG.contact?.email || '').trim()}`}
                  className="brutal-btn bg-[#FFD400] text-[#111111] px-5 py-3 font-mono text-sm font-bold uppercase inline-block min-h-[46px] flex items-center justify-center mx-auto"
                >
                  Contact Secretariat ({(CONFIG.contactEmail || CONFIG.contact?.email || '').trim()})
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
                  <span className={`font-mono text-xs font-black uppercase tracking-wider px-2 py-0.5 border border-[#111111] ${
                    submittedRecord.status === 'waitlist'
                      ? 'bg-amber-300 text-amber-950'
                      : submittedRecord.ticket === 'pitch' && submittedRecord.paymentStatus !== 'verified'
                      ? 'bg-[#FFD400] text-[#111111]'
                      : 'bg-white text-[#FF6B1A]'
                  }`}>
                    {submittedRecord.status === 'waitlist'
                      ? 'WAITLIST ENTRY'
                      : submittedRecord.ticket === 'pitch' && submittedRecord.paymentStatus !== 'verified'
                      ? 'PAYMENT VERIFICATION PENDING'
                      : 'REGISTRATION CONFIRMED'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#111111] bg-[#FFF2D6] px-2 py-0.5 border border-[#111111]">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 animate-sync-glow shrink-0" />
                    <span>Saved to Firebase</span>
                  </span>
                </div>

                <h2 className="font-display font-extrabold text-2xl text-[#111111] leading-tight">
                  {submittedRecord.status === 'waitlist'
                    ? 'You are on the waitlist.'
                    : submittedRecord.ticket === 'pitch' && submittedRecord.paymentStatus !== 'verified'
                    ? 'Registration received. Payment verification pending'
                    : "You're registered for the conclave."}
                </h2>
                
                <p className="text-sm font-mono font-bold text-[#111111]">
                  Registration ID: <span className="text-[#FF6B1A] text-base">{submittedRecord.id}</span>
                </p>
              </div>
            </div>

            {/* Ticket QR Code Gate Pass Preview (Locally Generated, Zero Third-Party Requests) */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-left">
              <div className="p-1.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0">
                <QRCodeCanvas
                  id="pass-qr-canvas"
                  value={JSON.stringify(
                    submittedRecord.ticketCode
                      ? { id: submittedRecord.id, t: submittedRecord.ticketCode }
                      : { id: submittedRecord.id }
                  )}
                  size={160}
                  level="M"
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase text-[#FF6B1A]">
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Official Entry Pass QR</span>
                  {submittedRecord.ticketCode && (
                    <span className="font-mono text-[10px] text-[#111111]/70 bg-[#FFF8EC] px-1.5 py-0.5 border border-[#111111] ml-auto">
                      SECURE PASS
                    </span>
                  )}
                </div>
                <div className="font-display font-black text-base sm:text-lg text-[#111111]">
                  Scan at DVSIET Gate Check-in
                </div>
                <p className="text-xs font-sans text-[#111111]/80 leading-relaxed">
                  Present this QR code or your Registration ID (<span className="font-mono font-bold">{submittedRecord.id}</span>) on your screen at the registration desk for instant venue admission.
                </p>
                {submittedRecord.ticketCode && (
                  <div className="font-mono text-[11px] text-[#111111]/80 pt-1">
                    Pass Security Code: <span className="font-bold text-[#FF6B1A]">{submittedRecord.ticketCode}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Prominent On-Screen Instruction & Action Row */}
            <div className="p-5 bg-[#FFD400] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3 text-left">
              <div className="flex items-center gap-2.5">
                <Camera className="w-5 h-5 text-[#111111] shrink-0" />
                <h3 className="font-display font-black text-base sm:text-lg text-[#111111] uppercase tracking-wide">
                  Take a screenshot of your Registration ID
                </h3>
              </div>
              <p className="font-sans text-xs sm:text-sm text-[#111111] font-semibold leading-relaxed">
                Save your Registration ID (<span className="font-mono font-bold text-base">{submittedRecord.id}</span>) now. You must present it along with your college or government ID at the registration desk for venue access.
              </p>

              {/* Action Buttons: Copy ID & Download Confirmation */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Copy ID Button */}
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="brutal-btn bg-white hover:bg-[#FFF8EC] text-[#111111] px-4 py-2.5 font-mono text-xs sm:text-sm font-bold border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-2 cursor-pointer transition-all min-h-[44px]"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                      <span className="text-emerald-800 font-black">Copied ({submittedRecord.id})</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#FF6B1A]" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>

                {/* Download confirmation (PDF or image) Button */}
                <button
                  type="button"
                  onClick={handleDownloadConfirmation}
                  disabled={isDownloadingPass}
                  className="brutal-btn bg-[#111111] hover:bg-[#222222] text-[#FFD400] px-4 py-2.5 font-display font-bold text-xs sm:text-sm uppercase tracking-wider border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-2 cursor-pointer transition-all min-h-[44px] disabled:opacity-60"
                >
                  <Download className="w-4 h-4 text-[#FFD400]" />
                  <span>{isDownloadingPass ? 'Generating...' : 'Download confirmation (PDF or image)'}</span>
                </button>
              </div>
            </div>

            {/* Mandatory Venue and Entry Notice Line */}
            <div className="p-4 sm:p-5 bg-[#FFF2D6] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] space-y-2.5 text-left font-sans">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#111111]/20 pb-2">
                <div className="flex items-center gap-2 font-display font-black text-sm sm:text-base text-[#111111]">
                  <MapPin className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                  <span>Venue: DVSIET, Meerut</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#111111]/70 bg-white px-2 py-0.5 border border-[#111111]">
                  Startup Conclave 1.0
                </span>
              </div>

              <div className="font-sans font-bold text-sm sm:text-base text-[#111111] flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-[#FF6B1A] shrink-0" />
                <span>Date and entry details will be shared by email and WhatsApp.</span>
              </div>

              <div className="font-mono text-xs text-[#111111]/85 pt-1.5 border-t border-[#111111]/20 flex flex-wrap items-center gap-x-4 gap-y-1">
                {(() => {
                  const e = (CONFIG.contactEmail || CONFIG.contact?.email || '').trim();
                  const ph = (CONFIG.contactPhone || CONFIG.contact?.phone || '').trim();
                  return (
                    <>
                      {(e || ph) && <span className="font-black text-[#111111]">Organiser Contact:</span>}
                      {e && (
                        <a href={`mailto:${e}`} className="underline font-bold text-[#FF6B1A] hover:text-[#111111]">
                          {e}
                        </a>
                      )}
                      {e && ph && <span>•</span>}
                      {ph && (
                        <a href={`tel:${ph}`} className="underline font-bold text-[#111111] hover:text-[#FF6B1A]">
                          {ph}
                        </a>
                      )}
                      {(e || ph) && <span>•</span>}
                      <span className="text-[#111111]/70">Dewan V.S. Institute of Engineering & Technology, Meerut</span>
                    </>
                  );
                })()}
              </div>
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
                  <span className="text-[#111111]/70 text-xs block">Ticket / Pass:</span>
                  <span className="font-bold text-[#111111]">
                    {submittedRecord.ticket === 'pitch' ? CONFIG.tickets.pitch.label : CONFIG.tickets.participant.label}
                  </span>
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
                  <span className="font-bold text-[#111111]">
                    {typeof submittedRecord.college === 'object' && submittedRecord.college
                      ? (submittedRecord.college as any).name
                      : submittedRecord.college}
                  </span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">Category:</span>
                  <span className="font-bold text-[#111111]">{submittedRecord.role} · {submittedRecord.city}</span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">Status:</span>
                  <span className={`font-bold ${
                    submittedRecord.status === 'waitlist'
                      ? 'text-amber-800'
                      : submittedRecord.ticket === 'pitch' && submittedRecord.paymentStatus !== 'verified'
                      ? 'text-amber-800'
                      : 'text-emerald-800'
                  }`}>
                    {submittedRecord.status === 'waitlist'
                      ? 'Waitlist (Capacity reached)'
                      : submittedRecord.ticket === 'pitch' && submittedRecord.paymentStatus !== 'verified'
                      ? 'Payment Verification Pending'
                      : 'Registered'}
                  </span>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-xs block">Payment Status:</span>
                  <span className={`font-bold font-mono text-xs ${
                    submittedRecord.paymentStatus === 'not_required'
                      ? 'text-stone-700'
                      : submittedRecord.paymentStatus === 'verified'
                      ? 'text-emerald-700'
                      : submittedRecord.paymentStatus === 'rejected'
                      ? 'text-red-700'
                      : 'text-amber-800'
                  }`}>
                    {submittedRecord.paymentStatus === 'not_required'
                      ? 'Not Required (Free)'
                      : submittedRecord.paymentStatus === 'verified'
                      ? 'Verified'
                      : submittedRecord.paymentStatus === 'rejected'
                      ? 'Rejected'
                      : `Pending Verification ${submittedRecord.paymentUtr ? `(UTR: ${submittedRecord.paymentUtr})` : ''}`}
                  </span>
                </div>
              </div>

              {submittedRecord.wantsToPitch && (
                <div className="pt-3 border-t border-[#111111]/20 space-y-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#FF6B1A]">
                      🎤 Pitch Arena Application
                    </span>
                    {submittedRecord.stage && (
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-[#FFF8EC] border border-[#111111]">
                        {submittedRecord.stage} Stage
                      </span>
                    )}
                  </div>

                  {submittedRecord.startupName && (
                    <div>
                      <span className="text-[#111111]/70 text-xs block">Startup Name:</span>
                      <span className="font-bold text-base text-[#111111]">{submittedRecord.startupName}</span>
                    </div>
                  )}

                  {submittedRecord.startupPitch && (
                    <div>
                      <span className="text-[#111111]/70 text-xs block">Pitch Summary:</span>
                      <p className="text-sm text-[#111111]/80 italic">"{submittedRecord.startupPitch}"</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
                    {submittedRecord.sector && (
                      <div className="p-2 bg-[#FFF8EC] border border-[#111111]">
                        <span className="text-[#111111]/80 block text-[10px]">SECTOR</span>
                        <strong className="text-[#111111]">{submittedRecord.sector}</strong>
                      </div>
                    )}
                    {submittedRecord.teamSize && (
                      <div className="p-2 bg-[#FFF8EC] border border-[#111111]">
                        <span className="text-[#111111]/80 block text-[10px]">TEAM SIZE</span>
                        <strong className="text-[#111111]">{submittedRecord.teamSize} {submittedRecord.teamSize === '1' ? 'Founder' : 'Members'}</strong>
                      </div>
                    )}
                    {submittedRecord.pitchDeckLink && (
                      <div className="p-2 bg-[#FFF8EC] border border-[#111111] col-span-2 sm:col-span-1">
                        <span className="text-[#111111]/80 block text-[10px]">PITCH DECK</span>
                        <a
                          href={submittedRecord.pitchDeckLink.startsWith('http') ? submittedRecord.pitchDeckLink : `https://${submittedRecord.pitchDeckLink}`}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="font-bold text-[#FF6B1A] underline hover:text-[#111111] inline-flex items-center gap-1"
                        >
                          <span>Open Deck</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
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
              <div className="p-3.5 sm:p-4 bg-red-100 border-2 border-red-500 text-red-800 text-sm font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{errors.form}</span>
                </div>
                {isNetworkError && (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={(e) => handleRegisterSubmit(e)}
                    className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-mono font-bold text-xs uppercase tracking-wider border border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 self-start sm:self-auto cursor-pointer flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                    <span>Retry</span>
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-4 font-sans text-sm">
              
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

              {/* Ticket Type Selection */}
              <div className="space-y-2">
                <label className="font-bold text-[#111111] block">Select Ticket / Pass *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setTicket('participant');
                      setWantsToPitch(false);
                    }}
                    className={`p-3.5 border-2 border-[#111111] text-left transition-all cursor-pointer ${
                      ticket === 'participant'
                        ? 'bg-[#FFD400] shadow-[3px_3px_0px_#111111]'
                        : 'bg-white hover:bg-[#FFF8EC] shadow-[1px_1px_0px_#111111]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base text-[#111111]">
                        {CONFIG.tickets.participant.label}
                      </span>
                      <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 border border-[#111111] bg-white">
                        {CONFIG.tickets.participant.fee === 0 ? 'FREE' : `₹${CONFIG.tickets.participant.fee}`}
                      </span>
                    </div>
                    <p className="text-xs text-[#111111]/70 mt-1">
                      Full 2-day attendee delegate pass
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isPitchOpen) {
                        setErrors((prev) => ({ ...prev, form: 'Pitch registrations open soon.' }));
                        return;
                      }
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.form;
                        return next;
                      });
                      setTicket('pitch');
                      setWantsToPitch(true);
                    }}
                    className={`p-3.5 border-2 border-[#111111] text-left transition-all ${
                      !isPitchOpen
                        ? 'opacity-80 bg-[#F4EFE6] cursor-not-allowed shadow-[1px_1px_0px_#111111]'
                        : ticket === 'pitch'
                        ? 'bg-[#FF6B1A] text-[#111111] shadow-[3px_3px_0px_#111111] cursor-pointer'
                        : 'bg-white hover:bg-[#FFF8EC] shadow-[1px_1px_0px_#111111] cursor-pointer'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm sm:text-base text-[#111111]">
                        {CONFIG.tickets.pitch.label}
                      </span>
                      <span className="font-mono text-xs font-bold uppercase px-2 py-0.5 border border-[#111111] bg-[#FFD400] text-[#111111]">
                        {!isPitchOpen ? 'OPENS SOON' : `₹${CONFIG.tickets.pitch.fee}`}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${ticket === 'pitch' && isPitchOpen ? 'text-[#111111]/85 font-medium' : 'text-[#111111]/70'}`}>
                      {!isPitchOpen
                        ? 'Pitch registrations open soon'
                        : 'Pitch your startup to jury & investors + delegate entry'}
                    </p>
                  </button>
                </div>
              </div>

              {/* Google Sign-In Card */}
              <div className="bg-white border-2 border-[#111111] p-4 sm:p-5 shadow-[3px_3px_0px_#111111] space-y-3">
                {authUser ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 border-2 border-[#111111] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display font-black text-sm uppercase text-[#111111]">
                            Verified Google Account
                          </span>
                          <span className="bg-[#FFD400] text-[#111111] border border-[#111111] font-mono text-[10px] font-bold px-1.5 py-0.5">
                            LOCKED
                          </span>
                        </div>
                        <p className="font-mono text-xs text-[#111111] font-bold mt-0.5 break-all">
                          {authUser.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignOut}
                      className="font-mono text-xs font-bold text-[#FF6B1A] underline hover:text-[#111111] cursor-pointer min-h-[44px] flex items-center self-start sm:self-auto"
                    >
                      Change account
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-display font-black text-sm uppercase text-[#111111]">
                        <Shield className="w-4 h-4 text-[#FF6B1A]" />
                        <span>Sign In with Google</span>
                      </div>
                      <p className="text-xs text-[#111111]/80 font-sans">
                        Sign in with Google to verify your email. We use it only for your ticket and event updates.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleSigningIn}
                      className="brutal-btn bg-[#FFD400] hover:bg-[#FFE55B] text-[#111111] border-2 border-[#111111] px-5 py-2.5 font-display font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer shadow-[2px_2px_0px_#111111] min-h-[44px] shrink-0 transition-all disabled:opacity-60"
                    >
                      {isGoogleSigningIn ? (
                        <>
                          <RotateCw className="w-4 h-4 animate-spin text-[#111111]" />
                          <span>Connecting...</span>
                        </>
                      ) : (
                        <>
                          <GoogleIcon className="w-4 h-4 shrink-0" />
                          <span>Continue with Google</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* In-app browser notice */}
                {isInAppBrowser && !authUser && (
                  <div className="p-3 bg-[#FFF2D6] border-2 border-[#111111] text-[#111111] text-xs font-mono flex items-start gap-2 shadow-[2px_2px_0px_#111111]">
                    <AlertCircle className="w-4 h-4 text-[#FF6B1A] shrink-0 mt-0.5" />
                    <div className="space-y-0.5 leading-relaxed">
                      <span className="font-bold uppercase block text-[#111111]">In-App Browser Detected</span>
                      <span>Google sign-in may not work inside Instagram, WhatsApp, or LinkedIn. For the best experience, tap <strong>⋮</strong> or <strong>⋯</strong> and select <strong>"Open in Chrome"</strong> or <strong>"Open in Safari"</strong>.</span>
                    </div>
                  </div>
                )}

                {/* Error message displayed once, directly below button */}
                {googleAuthError && (
                  <div className="p-2.5 bg-red-100 border-2 border-red-800 text-red-900 font-mono text-xs flex items-center justify-between gap-2 shadow-[1px_1px_0px_#111111]">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-700" />
                      <span>{googleAuthError}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      className="font-bold underline uppercase text-red-900 hover:text-black cursor-pointer shrink-0 text-[11px]"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>

              {/* Form locked banner when not signed in */}
              {!authUser && (
                <div className="p-3.5 bg-[#FFF8EC] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-2.5 font-mono text-xs text-[#111111]">
                  <Lock className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                  <span>
                    <strong>Form locked:</strong> Sign in with Google above to unlock the registration form.
                  </span>
                </div>
              )}

              {/* Form Fields: Disabled until authenticated */}
              <fieldset disabled={!authUser} className={`space-y-4 border-0 p-0 m-0 ${!authUser ? 'opacity-50 cursor-not-allowed select-none' : ''}`}>

              {/* 1. Full Name */}
              <div className="space-y-1.5">
                <label htmlFor="reg-fullName" className="font-bold text-[#111111] block cursor-pointer">
                  Full Name *
                </label>
                <input
                  id="reg-fullName"
                  type="text"
                  autoComplete="name"
                  required
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                  }}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'reg-fullName-error' : undefined}
                  className={`w-full p-3 bg-[#FFF8EC] border-2 ${errors.fullName ? 'border-red-600' : 'border-[#111111]'} font-sans focus:outline-none focus:bg-white min-h-[46px] text-base`}
                />
                {errors.fullName && (
                  <p id="reg-fullName-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* 2. Email & Phone (10-digit Indian Number) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="reg-email" className="font-bold text-[#111111] block cursor-pointer">
                      Email Address *
                    </label>
                    {authUser ? (
                      <span className="font-mono text-[10px] font-black uppercase text-green-800 bg-green-100 px-1.5 py-0.5 border border-green-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-700" />
                        Verified
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 bg-[#EFE9DC] px-1.5 py-0.5 border border-[#111111]">
                        Locked
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      id="reg-email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      readOnly
                      value={email}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'reg-email-error' : undefined}
                      placeholder="Sign in with Google above to unlock"
                      className="w-full p-3 bg-[#EFE9DC] border-2 border-[#111111] font-sans font-bold text-[#111111] cursor-not-allowed min-h-[46px] text-base pr-20"
                      title={authUser ? 'Locked to your verified Google account' : 'Sign in with Google above to unlock'}
                    />
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-mono font-bold text-[#111111]/70 pointer-events-none">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Locked</span>
                    </div>
                  </div>
                  {errors.email && (
                    <p id="reg-email-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-phone" className="font-bold text-[#111111] block cursor-pointer">
                    Phone / WhatsApp (10 digits) *
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPhone(val);
                      if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                    }}
                    placeholder="10-digit number"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                    className={`w-full p-3 bg-[#FFF8EC] border-2 ${errors.phone ? 'border-red-600' : 'border-[#111111]'} font-sans focus:outline-none focus:bg-white font-mono min-h-[46px] text-base`}
                  />
                  {errors.phone && (
                    <p id="reg-phone-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Role & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="reg-role" className="font-bold text-[#111111] block cursor-pointer">
                    I am a *
                  </label>
                  <select
                    id="reg-role"
                    value={role}
                    onChange={(e) => {
                      const newRole = e.target.value as any;
                      setRole(newRole);
                      setErrors((prev) => {
                        const next = { ...prev };
                        delete next.college;
                        delete next.course;
                        delete next.year;
                        delete next.professionalRole;
                        return next;
                      });
                    }}
                    className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white font-medium min-h-[46px] text-base cursor-pointer"
                  >
                    <option value="Student">Student</option>
                    <option value="Founder">Founder</option>
                    <option value="Professional">Professional</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="reg-city" className="font-bold text-[#111111] block cursor-pointer">
                    City
                  </label>
                  <input
                    id="reg-city"
                    type="text"
                    autoComplete="address-level2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Meerut, Delhi, Noida"
                    className="w-full p-3 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white min-h-[46px] text-base"
                  />
                </div>
              </div>

              {/* 4. College & Education (Students) OR Organisation & Role (Non-Students) */}
              {role === 'Student' ? (
                <>
                  {/* College / University Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-college" className="font-bold text-[#111111] block cursor-pointer">
                      College / University Name *
                    </label>
                    <input
                      id="reg-college"
                      type="text"
                      autoComplete="organization"
                      required
                      value={college}
                      onChange={(e) => {
                        setCollege(e.target.value);
                        if (errors.college) setErrors((prev) => ({ ...prev, college: '' }));
                      }}
                      placeholder="e.g. DVSIET Meerut"
                      aria-invalid={Boolean(errors.college)}
                      aria-describedby={errors.college ? 'reg-college-error' : undefined}
                      className={`w-full p-3 bg-[#FFF8EC] border-2 ${errors.college ? 'border-red-600' : 'border-[#111111]'} font-sans focus:outline-none focus:bg-white min-h-[46px] text-base`}
                    />
                    {errors.college && (
                      <p id="reg-college-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                        {errors.college}
                      </p>
                    )}
                  </div>

                  {/* Degree / Course & Current Year Selects */}
                  <div className="p-4 bg-[#FFF2D6] border-2 border-[#111111] space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Degree / Course Select */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-courseSelect" className="font-bold text-[#111111] block cursor-pointer">
                          Degree / Course *
                        </label>
                        <select
                          id="reg-courseSelect"
                          required
                          value={courseSelect}
                          onChange={(e) => {
                            setCourseSelect(e.target.value);
                            if (errors.course) setErrors((prev) => ({ ...prev, course: '' }));
                          }}
                          aria-invalid={Boolean(errors.course)}
                          aria-describedby={errors.course ? 'reg-course-error' : undefined}
                          className={`w-full p-2.5 bg-white border-2 ${errors.course ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base cursor-pointer`}
                        >
                          <option value="">Select Degree / Course</option>
                          <option value="B.Tech / B.E.">B.Tech / B.E.</option>
                          <option value="BCA">BCA</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="BBA">BBA</option>
                          <option value="B.Com">B.Com</option>
                          <option value="BA">BA</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="MCA">MCA</option>
                          <option value="MBA">MBA</option>
                          <option value="M.Sc">M.Sc</option>
                          <option value="Diploma / Polytechnic">Diploma / Polytechnic</option>
                          <option value="PhD / Research Scholar">PhD / Research Scholar</option>
                          <option value="Other">Other (Please specify)</option>
                        </select>
                        {courseSelect === 'Other' && (
                          <div className="pt-2">
                            <label htmlFor="reg-customCourse" className="sr-only">
                              Specify Degree / Course
                            </label>
                            <input
                              id="reg-customCourse"
                              type="text"
                              required
                              value={customCourse}
                              onChange={(e) => {
                                setCustomCourse(e.target.value);
                                if (errors.course) setErrors((prev) => ({ ...prev, course: '' }));
                              }}
                              placeholder="Specify your degree / course"
                              aria-invalid={Boolean(errors.course)}
                              aria-describedby={errors.course ? 'reg-course-error' : undefined}
                              className={`w-full p-2.5 bg-white border-2 ${errors.course ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base`}
                            />
                          </div>
                        )}
                        {errors.course && (
                          <p id="reg-course-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                            {errors.course}
                          </p>
                        )}
                      </div>

                      {/* Current Year Select */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-yearSelect" className="font-bold text-[#111111] block cursor-pointer">
                          Current Year *
                        </label>
                        <select
                          id="reg-yearSelect"
                          required
                          value={yearSelect}
                          onChange={(e) => {
                            setYearSelect(e.target.value);
                            if (errors.year) setErrors((prev) => ({ ...prev, year: '' }));
                          }}
                          aria-invalid={Boolean(errors.year)}
                          aria-describedby={errors.year ? 'reg-year-error' : undefined}
                          className={`w-full p-2.5 bg-white border-2 ${errors.year ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base cursor-pointer`}
                        >
                          <option value="">Select Current Year</option>
                          <option value="1st Year">1st Year</option>
                          <option value="2nd Year">2nd Year</option>
                          <option value="3rd Year">3rd Year</option>
                          <option value="4th Year">4th Year</option>
                          <option value="5th Year">5th Year</option>
                          <option value="Passed out">Passed out / Alumni</option>
                          <option value="Other">Other (Please specify)</option>
                        </select>
                        {yearSelect === 'Other' && (
                          <div className="pt-2">
                            <label htmlFor="reg-customYear" className="sr-only">
                              Specify Current Year
                            </label>
                            <input
                              id="reg-customYear"
                              type="text"
                              required
                              value={customYear}
                              onChange={(e) => {
                                setCustomYear(e.target.value);
                                if (errors.year) setErrors((prev) => ({ ...prev, year: '' }));
                              }}
                              placeholder="Specify your current year"
                              aria-invalid={Boolean(errors.year)}
                              aria-describedby={errors.year ? 'reg-year-error' : undefined}
                              className={`w-full p-2.5 bg-white border-2 ${errors.year ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base`}
                            />
                          </div>
                        )}
                        {errors.year && (
                          <p id="reg-year-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                            {errors.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                /* Non-Student Delegates: Organisation & Role */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="reg-college" className="font-bold text-[#111111] block cursor-pointer">
                      Organisation Name *
                    </label>
                    <input
                      id="reg-college"
                      type="text"
                      autoComplete="organization"
                      required
                      value={college}
                      onChange={(e) => {
                        setCollege(e.target.value);
                        if (errors.college) setErrors((prev) => ({ ...prev, college: '' }));
                      }}
                      placeholder="e.g. Acme Labs, Startup India"
                      aria-invalid={Boolean(errors.college)}
                      aria-describedby={errors.college ? 'reg-college-error' : undefined}
                      className={`w-full p-3 bg-[#FFF8EC] border-2 ${errors.college ? 'border-red-600' : 'border-[#111111]'} font-sans focus:outline-none focus:bg-white min-h-[46px] text-base`}
                    />
                    {errors.college && (
                      <p id="reg-college-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                        {errors.college}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="reg-professionalRole" className="font-bold text-[#111111] block cursor-pointer">
                      Role / Designation *
                    </label>
                    <input
                      id="reg-professionalRole"
                      type="text"
                      autoComplete="organization-title"
                      required
                      value={professionalRole}
                      onChange={(e) => {
                        setProfessionalRole(e.target.value);
                        if (errors.professionalRole) setErrors((prev) => ({ ...prev, professionalRole: '' }));
                      }}
                      placeholder="e.g. Founder, Software Engineer, PM"
                      aria-invalid={Boolean(errors.professionalRole)}
                      aria-describedby={errors.professionalRole ? 'reg-professionalRole-error' : undefined}
                      className={`w-full p-3 bg-[#FFF8EC] border-2 ${errors.professionalRole ? 'border-red-600' : 'border-[#111111]'} font-sans focus:outline-none focus:bg-white min-h-[46px] text-base`}
                    />
                    {errors.professionalRole && (
                      <p id="reg-professionalRole-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                        {errors.professionalRole}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Pitch Arena Section */}
              {ticket === 'pitch' && (
                <div className="p-4 bg-[#FFF2D6] border-2 border-[#111111] space-y-3.5 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-[#111111]/20 pb-2">
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-[#FF6B1A]" />
                      <span className="font-bold text-[#111111] uppercase tracking-wide text-xs sm:text-sm">
                        Pitch Arena Application Details
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTicket('participant');
                        setWantsToPitch(false);
                      }}
                      className="text-[11px] font-mono underline text-[#111111]/70 hover:text-[#FF6B1A] cursor-pointer"
                    >
                      Switch to Attendee pass
                    </button>
                  </div>

                  {/* 1. Startup Name */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-startupName" className="font-bold text-[#111111] block text-xs sm:text-sm cursor-pointer">
                      Startup Name *
                    </label>
                    <input
                      id="reg-startupName"
                      type="text"
                      autoComplete="organization"
                      required
                      value={startupName}
                      onChange={(e) => {
                        setStartupName(e.target.value);
                        if (errors.startupName) setErrors((prev) => ({ ...prev, startupName: '' }));
                      }}
                      placeholder="e.g. KisanAI"
                      aria-invalid={Boolean(errors.startupName)}
                      aria-describedby={errors.startupName ? 'reg-startupName-error' : undefined}
                      className={`w-full p-2.5 bg-white border-2 ${errors.startupName ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base`}
                    />
                    {errors.startupName && (
                      <p id="reg-startupName-error" role="alert" className="text-xs text-red-600 font-bold mt-1">{errors.startupName}</p>
                    )}
                  </div>

                  {/* 2. Sector & Stage */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Sector Dropdown */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-pitchSector" className="font-bold text-[#111111] block text-xs sm:text-sm cursor-pointer">
                        Sector *
                      </label>
                      <select
                        id="reg-pitchSector"
                        value={pitchSector}
                        onChange={(e) => {
                          setPitchSector(e.target.value);
                          if (errors.pitchSector) setErrors((prev) => ({ ...prev, pitchSector: '' }));
                        }}
                        aria-invalid={Boolean(errors.pitchSector)}
                        aria-describedby={errors.pitchSector ? 'reg-pitchSector-error' : undefined}
                        className={`w-full p-2.5 bg-white border-2 ${errors.pitchSector ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base cursor-pointer`}
                      >
                        <option value="">Select Sector</option>
                        <option value="AgriTech">AgriTech</option>
                        <option value="FinTech">FinTech</option>
                        <option value="EdTech">EdTech</option>
                        <option value="HealthTech">HealthTech</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="SaaS">SaaS</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Social Impact">Social Impact</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.pitchSector && (
                        <p id="reg-pitchSector-error" role="alert" className="text-xs text-red-600 font-bold mt-1">{errors.pitchSector}</p>
                      )}
                    </div>

                    {/* Stage Dropdown */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-pitchStage" className="font-bold text-[#111111] block text-xs sm:text-sm cursor-pointer">
                        Stage *
                      </label>
                      <select
                        id="reg-pitchStage"
                        value={pitchStage}
                        onChange={(e) => {
                          setPitchStage(e.target.value as any);
                          if (errors.pitchStage) setErrors((prev) => ({ ...prev, pitchStage: '' }));
                        }}
                        aria-invalid={Boolean(errors.pitchStage)}
                        aria-describedby={errors.pitchStage ? 'reg-pitchStage-error' : undefined}
                        className={`w-full p-2.5 bg-white border-2 ${errors.pitchStage ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base cursor-pointer`}
                      >
                        <option value="">Select Stage</option>
                        <option value="Idea">Idea</option>
                        <option value="Prototype">Prototype</option>
                        <option value="Launched">Launched</option>
                        <option value="Revenue">Revenue</option>
                      </select>
                      {errors.pitchStage && (
                        <p id="reg-pitchStage-error" role="alert" className="text-xs text-red-600 font-bold mt-1">{errors.pitchStage}</p>
                      )}
                    </div>
                  </div>

                  {/* 3. One-Liner Description / Startup Pitch */}
                  <div className="space-y-1.5">
                    <label htmlFor="reg-startupPitch" className="font-bold text-[#111111] block text-xs sm:text-sm cursor-pointer">
                      One-Line Description / Startup Pitch *
                    </label>
                    <input
                      id="reg-startupPitch"
                      type="text"
                      required
                      value={startupPitch}
                      onChange={(e) => {
                        setStartupPitch(e.target.value);
                        if (errors.startupPitch) setErrors((prev) => ({ ...prev, startupPitch: '' }));
                      }}
                      placeholder="e.g. Automated sensors for farmers in Western UP"
                      aria-invalid={Boolean(errors.startupPitch)}
                      aria-describedby={errors.startupPitch ? 'reg-startupPitch-error' : undefined}
                      className={`w-full p-2.5 bg-white border-2 ${errors.startupPitch ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base`}
                    />
                    {errors.startupPitch && (
                      <p id="reg-startupPitch-error" role="alert" className="text-xs text-red-600 font-bold mt-1">{errors.startupPitch}</p>
                    )}
                  </div>

                  {/* 4. Pitch Deck Link & Team Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Pitch Deck Link */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-pitchDeckLink" className="font-bold text-[#111111] block text-xs sm:text-sm cursor-pointer">
                        Pitch Deck Link *
                      </label>
                      <input
                        id="reg-pitchDeckLink"
                        type="url"
                        inputMode="url"
                        autoComplete="url"
                        required
                        value={pitchDeckLink}
                        onChange={(e) => {
                          setPitchDeckLink(e.target.value);
                          if (errors.pitchDeckLink) setErrors((prev) => ({ ...prev, pitchDeckLink: '' }));
                        }}
                        placeholder="Google Drive or Canva link"
                        aria-invalid={Boolean(errors.pitchDeckLink)}
                        aria-describedby={errors.pitchDeckLink ? 'reg-pitchDeckLink-error' : undefined}
                        className={`w-full p-2.5 bg-white border-2 ${errors.pitchDeckLink ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base`}
                      />
                      {errors.pitchDeckLink && (
                        <p id="reg-pitchDeckLink-error" role="alert" className="text-xs text-red-600 font-bold mt-1">{errors.pitchDeckLink}</p>
                      )}
                    </div>

                    {/* Team Size Dropdown */}
                    <div className="space-y-1.5">
                      <label htmlFor="reg-pitchTeamSize" className="font-bold text-[#111111] block text-xs sm:text-sm cursor-pointer">
                        Team Size *
                      </label>
                      <select
                        id="reg-pitchTeamSize"
                        value={pitchTeamSize}
                        onChange={(e) => {
                          setPitchTeamSize(e.target.value);
                          if (errors.pitchTeamSize) setErrors((prev) => ({ ...prev, pitchTeamSize: '' }));
                        }}
                        aria-invalid={Boolean(errors.pitchTeamSize)}
                        aria-describedby={errors.pitchTeamSize ? 'reg-pitchTeamSize-error' : undefined}
                        className={`w-full p-2.5 bg-white border-2 ${errors.pitchTeamSize ? 'border-red-600' : 'border-[#111111]'} font-sans min-h-[46px] text-base cursor-pointer`}
                      >
                        <option value="">Select Team Size</option>
                        <option value="1">1 (Solo Founder)</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </select>
                      {errors.pitchTeamSize && (
                        <p id="reg-pitchTeamSize-error" role="alert" className="text-xs text-red-600 font-bold mt-1">{errors.pitchTeamSize}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 5.5 UPI Fee Payment Block (Rendered for Pitch pass) */}
              {ticket === 'pitch' && (
                !isPitchOpen ? (
                  <div className="p-4 sm:p-5 bg-[#FFF2D6] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3">
                    <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5">
                      <div>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider bg-[#FF6B1A] text-[#111111] px-2 py-0.5 border border-[#111111]">
                          {CONFIG.tickets.pitch.label.toUpperCase()}
                        </span>
                        <h3 className="font-display font-black text-xl text-[#111111] mt-1">
                          ₹{CONFIG.tickets.pitch.fee} <span className="text-xs font-mono font-normal text-[#111111]/70">/ Startup Pitch Pass</span>
                        </h3>
                      </div>
                      <span className="font-mono text-xs font-bold uppercase px-2 py-1 bg-[#FFD400] text-[#111111] border border-[#111111]">
                        OPENS SOON
                      </span>
                    </div>
                    <div className="p-3.5 bg-white border-2 border-[#111111] space-y-1">
                      <p className="font-bold text-[#111111] text-sm">Pitch registrations open soon</p>
                      <p className="text-xs text-[#111111]/70">
                        Pitch ticket UPI payment details will be published once pitch slots are unlocked. In the meantime, you can register with a free Attendee Delegate pass.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setTicket('participant');
                        setWantsToPitch(false);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#FFD400] hover:bg-[#FF6B1A] hover:text-[#111111] border-2 border-[#111111] font-mono text-xs font-bold text-[#111111] shadow-[2px_2px_0px_#111111] transition-colors cursor-pointer min-h-[44px]"
                    >
                      Switch to Attendee Delegate (Free)
                    </button>
                  </div>
                ) : (
                  <div className="p-4 sm:p-5 bg-[#FFF2D6] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-4">
                    <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5">
                      <div>
                        <span className="font-mono text-[11px] font-bold uppercase tracking-wider bg-[#FF6B1A] text-[#111111] px-2 py-0.5 border border-[#111111]">
                          {CONFIG.tickets.pitch.label.toUpperCase()} FEE
                        </span>
                        <h3 className="font-display font-black text-xl text-[#111111] mt-1">
                          ₹{CONFIG.tickets.pitch.fee} <span className="text-xs font-mono font-normal text-[#111111]/70">/ Startup Pitch Pass</span>
                        </h3>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#111111]/70 block">Payee</span>
                        <span className="font-mono text-xs font-bold text-[#111111]">
                          {CONFIG.payment.payeeName.trim() || CONFIG.event.name}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* UPI ID with Copy button */}
                      <div className="space-y-1">
                        <label className="font-mono text-xs font-bold text-[#111111] block">
                          UPI ID:
                        </label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 p-2.5 bg-white border-2 border-[#111111] font-mono text-xs sm:text-sm font-bold text-[#111111] select-all truncate">
                            {CONFIG.payment.upiId}
                          </code>
                          <button
                            type="button"
                            onClick={() => {
                              if (navigator.clipboard) {
                                navigator.clipboard.writeText(CONFIG.payment.upiId);
                                setCopiedUpi(true);
                                setTimeout(() => setCopiedUpi(false), 2000);
                              }
                            }}
                            className="px-3 py-2.5 bg-white hover:bg-[#FFD400] border-2 border-[#111111] font-mono text-xs font-bold text-[#111111] shadow-[2px_2px_0px_#111111] transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                          >
                            {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedUpi ? 'Copied' : 'Copy UPI'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Client-side QR Code and Deep Link Button */}
                      <div className="p-3.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col sm:flex-row items-center gap-4">
                        <div className="p-2.5 bg-[#FFF8EC] border-2 border-[#111111] shrink-0 flex items-center justify-center">
                          <QRCodeSVG
                            value={upiPayUrl}
                            size={144}
                            level="M"
                            className="w-[144px] h-[144px]"
                          />
                        </div>
                        <div className="space-y-3 text-center sm:text-left flex-1">
                          <div>
                            <span className="font-bold text-sm text-[#111111] block">
                              Scan QR Code to Pay ₹{CONFIG.tickets.pitch.fee}
                            </span>
                            <p className="text-xs text-[#111111]/70 mt-0.5">
                              Scan with Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                            </p>
                          </div>
                          <div>
                            <a
                              href={upiPayUrl}
                              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#FFD400] hover:bg-[#FF6B1A] hover:text-[#111111] border-2 border-[#111111] font-mono text-xs sm:text-sm font-bold text-[#111111] shadow-[2px_2px_0px_#111111] transition-all cursor-pointer min-h-[44px]"
                            >
                              <ExternalLink className="w-4 h-4" />
                              <span>Open UPI app</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* 12-digit UTR Input */}
                      <div className="space-y-1.5">
                        <label htmlFor="reg-paymentUtr" className="font-bold text-[#111111] block cursor-pointer">
                          12-Digit UPI Reference Number (UTR / Txn ID) *
                        </label>
                        <input
                          id="reg-paymentUtr"
                          type="text"
                          required
                          inputMode="numeric"
                          maxLength={12}
                          value={paymentUtr}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                            setPaymentUtr(val);
                            if (errors.paymentUtr) setErrors((prev) => ({ ...prev, paymentUtr: '' }));
                          }}
                          placeholder="e.g. 428901234567"
                          aria-invalid={Boolean(errors.paymentUtr)}
                          aria-describedby={errors.paymentUtr ? 'reg-paymentUtr-error' : undefined}
                          className={`w-full p-2.5 bg-white border-2 ${errors.paymentUtr ? 'border-red-600' : 'border-[#111111]'} font-mono text-base font-bold tracking-wider min-h-[46px]`}
                        />
                        {errors.paymentUtr && (
                          <p id="reg-paymentUtr-error" role="alert" className="text-xs text-red-600 font-bold">{errors.paymentUtr}</p>
                        )}
                        <p className="text-[11px] font-mono text-[#111111]/70">
                          Enter the 12-digit numeric reference shown in your UPI app payment receipt after paying.
                        </p>
                      </div>

                      {CONFIG.payment.refundPolicyText && (
                        <p className="text-[11px] font-sans text-[#111111]/60 italic border-t border-[#111111]/20 pt-2">
                          Refund Policy: {CONFIG.payment.refundPolicyText}
                        </p>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* 6. Consent Checkbox with Privacy Notice Link */}
              <div className="pt-2">
                <div className="flex items-start sm:items-center gap-3 min-h-[46px]">
                  <input
                    type="checkbox"
                    id="reg-consentCheck"
                    required
                    checked={consentAgreed}
                    onChange={(e) => {
                      setConsentAgreed(e.target.checked);
                      if (errors.consent) setErrors((prev) => ({ ...prev, consent: '' }));
                    }}
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? 'reg-consent-error' : undefined}
                    className="w-5 h-5 accent-[#FF6B1A] border-2 border-[#111111] rounded-none cursor-pointer shrink-0 mt-0.5 sm:mt-0"
                  />
                  <label htmlFor="reg-consentCheck" className="text-xs sm:text-sm font-semibold text-[#111111] cursor-pointer leading-normal select-none">
                    <span>I agree to be contacted about this event.</span>{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleOpenPrivacyModal();
                      }}
                      className="text-[#FF6B1A] underline hover:text-[#111111] font-bold cursor-pointer inline transition-colors"
                    >
                      See Privacy Notice
                    </button>
                  </label>
                </div>
                {errors.consent && (
                  <p id="reg-consent-error" role="alert" className="text-xs text-red-600 font-bold mt-1">
                    {errors.consent}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!authUser || isSubmitting || (ticket === 'pitch' && !isPitchOpen)}
                  className={`w-full brutal-btn text-[#111111] p-4 font-display font-black text-base sm:text-lg uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 min-h-[50px] ${
                    !authUser
                      ? 'bg-neutral-400 text-neutral-800 opacity-60 cursor-not-allowed shadow-none border-2 border-[#111111]'
                      : ticket === 'pitch' && !isPitchOpen
                      ? 'bg-neutral-400 text-neutral-800 opacity-70 cursor-not-allowed shadow-none border-2 border-[#111111]'
                      : isSubmitting
                      ? 'bg-[#FF6B1A] opacity-60 cursor-not-allowed pointer-events-none'
                      : 'bg-[#FF6B1A] cursor-pointer hover:bg-[#E05307]'
                  }`}
                >
                  {!authUser ? (
                    <span className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      <span>Sign in with Google above to unlock</span>
                    </span>
                  ) : ticket === 'pitch' && !isPitchOpen ? (
                    <span>Pitch registrations open soon</span>
                  ) : isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RotateCw className="w-5 h-5 animate-spin" />
                      <span>Submitting registration...</span>
                    </span>
                  ) : (
                    <>
                      <span>{ticket === 'pitch' ? 'Submit Pitch Registration' : 'Register for Startup Conclave 1.0'}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              </fieldset>

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
      </main>

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

          {(() => {
            const email = (CONFIG.contactEmail || CONFIG.contact?.email || '').trim();
            const phone = (CONFIG.contactPhone || CONFIG.contact?.phone || '').trim();

            if (!email && !phone) return null;

            return (
              <div className="space-y-2 font-mono text-xs sm:text-sm">
                <span className="font-black text-[#111111] uppercase block mb-1">Secretariat Desk</span>
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
              </div>
            );
          })()}

          {(() => {
            const linkedin = (CONFIG.linkedinUrl || CONFIG.contact?.socials?.linkedin || '').trim();
            const xTwitter = (CONFIG.xUrl || CONFIG.contact?.socials?.twitter || '').trim();
            const instagram = (CONFIG.instagramUrl || CONFIG.contact?.socials?.instagram || '').trim();

            if (!linkedin && !xTwitter && !instagram) return null;

            return (
              <div className="space-y-2">
                <span className="font-mono font-black text-[#111111] uppercase block text-xs sm:text-sm">Social & Community</span>
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
              </div>
            );
          })()}

        </div>

        {CONFIG.organisers.some((o) => o.confirmed) && (
          <div className="py-6 border-b-2 border-[#111111] flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111]/70 mr-1">
              Organised by
            </span>
            {CONFIG.organisers
              .filter((o) => o.confirmed)
              .map((o) => (
                <LogoTile key={o.name} item={o} heightClass="h-6 sm:h-7" tileClass="h-10 px-3" />
              ))}
          </div>
        )}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono text-[#111111]/70">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>© {new Date().getFullYear()} Startup Conclave 1.0. All rights reserved.</span>
            <button
              type="button"
              onClick={(e) => handleOpenPrivacyModal(e)}
              className="text-[#FF6B1A] hover:text-[#111111] underline font-bold cursor-pointer transition-colors"
            >
              Privacy Notice
            </button>
          </div>
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
          className="brutal-btn bg-[#FF6B1A] text-[#111111] px-4 py-2.5 font-display font-black text-xs uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[44px] flex items-center gap-1.5"
        >
          <span>Register Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* =================================================================== */}
      {/* PARTNER MODAL FORM                                                  */}
      {/* =================================================================== */}
      {partnerModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="partner-modal-title"
          className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPartnerModalOpen(false);
          }}
        >
          <div
            ref={partnerModalRef}
            tabIndex={-1}
            className="bg-[#FFF8EC] brutal-border brutal-shadow-lg p-6 sm:p-8 max-w-lg w-full text-left space-y-4 max-h-[90vh] overflow-y-auto"
          >
            
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
              <h2 id="partner-modal-title" className="font-display font-black text-xl text-[#111111]">
                Partner With Startup Conclave 1.0
              </h2>
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="p-1 brutal-border bg-white hover:bg-[#FFD400] min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                aria-label="Close Partner Inquiry dialog"
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
                  <div className="p-3 bg-red-100 border border-red-500 text-red-700 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{partnerError}</span>
                    </div>
                    {partnerNetworkError && (
                      <button
                        type="button"
                        disabled={partnerSubmitting}
                        onClick={(e) => handlePartnerSubmit(e)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-bold uppercase border border-[#111111] shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className={`w-3 h-3 ${partnerSubmitting ? 'animate-spin' : ''}`} />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Company / Organisation *</label>
                  <input
                    type="text"
                    required
                    value={partnerData.company}
                    onChange={(e) => setPartnerData({ ...partnerData, company: e.target.value })}
                    placeholder="Organisation or Company name"
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
                      placeholder="Enter contact person name"
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
                    placeholder="contact@company.com"
                    className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                  />
                </div>

                {/* Partnership Type & Contribution Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#111111] block mb-1">Partnership Type *</label>
                    <select
                      value={partnerData.partnershipType}
                      onChange={(e) => setPartnerData({ ...partnerData, partnershipType: e.target.value })}
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                    >
                      <option value="Cash">Cash Sponsorship</option>
                      <option value="Technology credits">Technology credits</option>
                      <option value="Food & beverage">Food &amp; beverage</option>
                      <option value="Merchandise">Merchandise</option>
                      <option value="Media">Media</option>
                      <option value="Travel/hospitality">Travel/hospitality</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {Boolean(CONFIG.partnerRanges && CONFIG.partnerRanges.length > 0) && (
                    <div>
                      <label className="font-bold text-[#111111] block mb-1">Contribution Range</label>
                      <select
                        value={partnerData.contributionRange}
                        onChange={(e) => setPartnerData({ ...partnerData, contributionRange: e.target.value })}
                        className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                      >
                        <option value="">Select range (optional)</option>
                        {CONFIG.partnerRanges.map((range) => (
                          <option key={range} value={range}>
                            {range}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
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
                    className={`brutal-btn bg-[#FF6B1A] text-[#111111] px-5 py-2 font-display font-bold text-xs uppercase min-h-[44px] ${
                      partnerSubmitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                    }`}
                  >
                    {partnerSubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      'Submit Inquiry'
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Anchored Section Target for /privacy or #privacy navigation */}
      <div id="privacy" className="sr-only" aria-hidden="true" />

      {/* =================================================================== */}
      {/* PRIVACY NOTICE MODAL (/privacy or #privacy)                          */}
      {/* =================================================================== */}
      {privacyModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="privacy-modal-title"
          className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClosePrivacyModal();
          }}
        >
          <div
            ref={privacyModalRef}
            tabIndex={-1}
            className="bg-[#FFF8EC] brutal-border brutal-shadow-lg p-5 sm:p-8 max-w-2xl w-full text-left space-y-5 max-h-[90vh] overflow-y-auto animate-brutal-pop"
          >
            
            {/* Draft Notice Banner */}
            <div className="p-3 bg-[#FFD400] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-[#111111] shrink-0" />
              <div className="font-mono text-xs font-black uppercase tracking-wider text-[#111111]">
                Draft: review with the college before launch
              </div>
            </div>

            {/* Modal Header */}
            <div className="flex items-start justify-between border-b-2 border-[#111111] pb-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#FF6B1A]" />
                  <span className="font-mono text-xs font-bold text-[#FF6B1A] uppercase tracking-wider">
                    Privacy Notice
                  </span>
                </div>
                <h2 id="privacy-modal-title" className="font-display font-black text-2xl sm:text-3xl text-[#111111] tracking-tight">
                  Attendee Privacy & Data Usage
                </h2>
                <p className="font-sans text-xs sm:text-sm text-[#111111]/80 font-medium">
                  Startup Conclave 1.0 · Dewan V.S. Institute of Engineering & Technology, Meerut
                </p>
              </div>

              <button
                type="button"
                onClick={handleClosePrivacyModal}
                aria-label="Close Privacy Notice"
                className="p-1.5 brutal-border bg-white hover:bg-[#FFD400] transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Plain-Language Sections */}
            <div className="space-y-4 font-sans text-sm text-[#111111] leading-relaxed">
              
              {/* Section 1: What Data Is Collected */}
              <div className="p-4 bg-white border-2 border-[#111111] space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-base text-[#111111]">
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#FFF2D6] border border-[#111111] text-[#FF6B1A]">01</span>
                  <h4>What Data Is Collected</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#111111]/85">
                  When you register or submit an inquiry for Startup Conclave 1.0, we collect the following limited details:
                </p>
                <ul className="list-disc pl-5 text-xs sm:text-sm space-y-1 font-medium text-[#111111]">
                  <li><strong>Full Name:</strong> To print physical badges, issue accreditation, and maintain attendee lists.</li>
                  <li><strong>Email Address:</strong> To deliver registration confirmation codes, venue access instructions, and schedule alerts.</li>
                  <li><strong>Phone / WhatsApp Number (10 digits):</strong> To send urgent entry instructions and prevent duplicate bookings.</li>
                  <li><strong>College / Organisation Name:</strong> To classify institutional contingents and verify student/founder affiliations.</li>
                  <li><strong>Degree / Course & Year (students only):</strong> To verify valid student enrolment and student ticket passes.</li>
                  <li><strong>City of Residence:</strong> To coordinate regional transport logistics and arrival planning.</li>
                  <li><strong>Pitch Details (optional):</strong> Startup name and one-line summary if applying to the Pitch Arena.</li>
                </ul>
              </div>

              {/* Section 2: Why It Is Collected (Purpose) */}
              <div className="p-4 bg-white border-2 border-[#111111] space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-base text-[#111111]">
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#FFF2D6] border border-[#111111] text-[#FF6B1A]">02</span>
                  <h4>Why We Collect It (Purpose)</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#111111]/85">
                  <strong>Event communication only:</strong> We process your details exclusively to communicate critical event updates with you. This includes sending your official Registration ID, gate pass information, speaker schedules, track rooms, waitlist status, and certificates of attendance. We do not engage in spam, telemarketing, or third-party marketing.
                </p>
              </div>

              {/* Section 3: Who Can See It (Access) */}
              <div className="p-4 bg-white border-2 border-[#111111] space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-base text-[#111111]">
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#FFF2D6] border border-[#111111] text-[#FF6B1A]">03</span>
                  <h4>Who Can See It (Access)</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#111111]/85">
                  <strong>Organisers only:</strong> Your personal information is accessible only to the authorized Startup Conclave 1.0 Secretariat and designated faculty coordinators at DVSIET Meerut. Your information will <em>never</em> be sold, rented, monetized, or shared with external commercial marketing agencies or unrelated third parties.
                </p>
              </div>

              {/* Section 4: How Long It Is Kept (Retention) */}
              <div className="p-4 bg-white border-2 border-[#111111] space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-base text-[#111111]">
                  <span className="font-mono text-xs px-2 py-0.5 bg-[#FFF2D6] border border-[#111111] text-[#FF6B1A]">04</span>
                  <h4>How Long It Is Kept (Retention)</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#111111]/85">
                  Retention period will be confirmed by the organisers.
                </p>
              </div>

              {/* Section 5: Contact Email for Deletion Requests */}
              <div className="p-4 bg-[#FFF2D6] border-2 border-[#111111] space-y-2">
                <div className="flex items-center gap-2 font-display font-black text-base text-[#111111]">
                  <span className="font-mono text-xs px-2 py-0.5 bg-white border border-[#111111] text-[#FF6B1A]">05</span>
                  <h4>Data Deletion & Contact Email</h4>
                </div>
                <p className="text-xs sm:text-sm text-[#111111]/85">
                  You retain full control over your submitted information. If you wish to update your details, request a copy of your information, or have your registration permanently erased from our records at any time, please contact the organising committee:
                </p>
                {Boolean((CONFIG.contactEmail || CONFIG.contact?.email || '').trim()) && (
                  <div className="p-3 bg-white border border-[#111111] font-mono text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                      <a
                        href={`mailto:${(CONFIG.contactEmail || CONFIG.contact?.email || '').trim()}?subject=Privacy%20Data%20Deletion%20Request`}
                        className="font-bold text-[#FF6B1A] hover:underline"
                      >
                        {(CONFIG.contactEmail || CONFIG.contact?.email || '').trim()}
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t-2 border-[#111111] flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="font-mono text-xs text-[#111111]/70">
                Last updated: October 2026 · Startup Conclave 1.0
              </span>
              <button
                type="button"
                onClick={handleClosePrivacyModal}
                className="w-full sm:w-auto brutal-btn bg-[#111111] text-[#FFD400] px-6 py-2.5 font-display font-bold text-xs uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[44px]"
              >
                I Understand & Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
