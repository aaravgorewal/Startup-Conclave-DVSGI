import React, { useState, useEffect } from 'react';
import {
  Ticket,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
  Share2,
  CalendarPlus,
  Info,
  Copy,
  Check,
  RotateCcw,
  Users,
  Eye,
  Lock,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Checkbox } from '../components/ui/Checkbox.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { Toast } from '../components/ui/Toast.tsx';
import {
  EVENT_DATA,
  REGISTRATION_CONFIG,
  RegistrationStatusMode,
} from '../data/content.ts';

// Pre-defined Interest areas for multi-select
const INTEREST_OPTIONS = [
  'Keynotes & Founder Stories',
  'Pitch Arena Spectator',
  'AI & DeepTech Workshops',
  'Networking & Hiring',
  'Investor Insights',
  'Product Design & MVP',
];

export const RegisterPage: React.FC = () => {
  // Feature flag override for sandbox inspection ('open' | 'waitlist' | 'closed')
  const [activeMode, setActiveMode] = useState<RegistrationStatusMode>(
    REGISTRATION_CONFIG.mode
  );

  // Hidden payment step flag (demonstrated but disabled by default)
  const [showPaymentStep, setShowPaymentStep] = useState(
    REGISTRATION_CONFIG.enablePaymentStep
  );

  // Form Field State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [attendeeType, setAttendeeType] = useState<string>('Student');
  const [organisation, setOrganisation] = useState('');
  const [courseAndYear, setCourseAndYear] = useState('');
  const [city, setCity] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Keynotes & Founder Stories',
    'Pitch Arena Spectator',
  ]);
  const [heardAbout, setHeardAbout] = useState('College Faculty / Notice Board');
  const [consentAgreed, setConsentAgreed] = useState(false);

  // Anti-bot honeypot field (hidden from legitimate users)
  const [honeypot, setHoneypot] = useState('');

  // Form Lifecycle State ('idle' | 'validating' | 'submitting' | 'success' | 'error')
  const [formStatus, setFormStatus] = useState<
    'idle' | 'validating' | 'submitting' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  // Success UI State
  const [copiedLink, setCopiedLink] = useState(false);
  const [calendarTooltip, setCalendarTooltip] = useState(false);

  // Duplicate email detection list (cached in localStorage)
  const [registeredEmails, setRegisteredEmails] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('registered_emails');
      if (stored) {
        setRegisteredEmails(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Toggle Interest Multi-Select
  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  // Field validation
  const validateForm = (): boolean => {
    setFormStatus('validating');
    const newErrors: Record<string, string> = {};

    // Check honeypot
    if (honeypot.trim() !== '') {
      // Silent rejection of bot
      setFormStatus('idle');
      return false;
    }

    if (!fullName.trim()) newErrors.fullName = 'Full name is required.';

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'A valid email address is required.';
    } else if (registeredEmails.includes(email.trim().toLowerCase())) {
      // Duplicate Email Detection
      newErrors.email =
        'This email address has already been registered for Startup Conclave 1.0.';
    }

    if (!whatsapp.trim() || whatsapp.length < 8) {
      newErrors.whatsapp = 'Valid WhatsApp contact number is required.';
    }

    if (!organisation.trim()) {
      newErrors.organisation =
        attendeeType === 'Student'
          ? 'College or institution name is required.'
          : 'Company or organisation is required.';
    }

    if (attendeeType === 'Student' && !courseAndYear.trim()) {
      newErrors.courseAndYear = 'Course & current academic year are required.';
    }

    if (!city.trim()) newErrors.city = 'City of residence is required.';

    if (!consentAgreed) {
      newErrors.consent = 'You must confirm intent to attend and receive alerts.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setFormStatus('error');
      setErrorMessage('Please resolve the highlighted fields below.');
      return false;
    }

    return true;
  };

  // Form submission handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setFormStatus('submitting');
    setErrorMessage('');

    setTimeout(() => {
      // Generate registration ID
      const prefix = activeMode === 'waitlist' ? 'SC1-WAIT' : 'SC1-REG';
      const regId = `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Save email to prevent duplicates
      const updated = [...registeredEmails, email.trim().toLowerCase()];
      setRegisteredEmails(updated);
      try {
        localStorage.setItem('registered_emails', JSON.stringify(updated));
      } catch {
        // Ignore storage errors
      }

      setSubmittedId(regId);
      setFormStatus('success');
    }, 800);
  };

  const handleReset = () => {
    setFormStatus('idle');
    setFullName('');
    setEmail('');
    setWhatsapp('');
    setCourseAndYear('');
    setCity('');
    setConsentAgreed(false);
    setSubmittedId(null);
    setErrors({});
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <PageShell
      title="Attendee Registration"
      kicker="JOIN THE CONCLAVE"
      statusBadge="In-Person at DVSIET Meerut"
      description="Reserve your delegate seat for Western Uttar Pradesh's defining startup and entrepreneurship congregation."
    >
      <div className="space-y-12 max-w-6xl mx-auto text-left">
        
        {/* Sandbox Switcher: Mode and Payment Flag */}
        <div className="p-3 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-xs text-[#52525B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-[#18181B]">
              Preview Registration State:
            </span>
            <div className="inline-flex rounded border border-[#E4E0D7] bg-white p-0.5">
              {(['open', 'waitlist', 'closed'] as RegistrationStatusMode[]).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    setActiveMode(mode);
                    setFormStatus('idle');
                  }}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded capitalize transition-colors ${
                    activeMode === mode
                      ? 'bg-[#18181B] text-white font-bold'
                      : 'text-[#71717A] hover:text-[#18181B]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span>Payment Step:</span>
            <button
              type="button"
              onClick={() => setShowPaymentStep(!showPaymentStep)}
              className="text-[#E8590C] hover:underline font-bold"
            >
              {showPaymentStep ? 'Enabled (Testing)' : 'Hidden Behind Flag'}
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SPLIT LAYOUT CONTAINER                                              */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ================================================================= */}
          {/* LEFT COLUMN: EVENT SUMMARY CARD, WHAT'S INCLUDED & TRUST CUES     */}
          {/* ================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Event Summary Card */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 shadow-paper space-y-5">
              <div className="border-b border-[#E4E0D7] pb-3 space-y-1">
                <span className="type-eyebrow text-[#E8590C]">
                  CONCLAVE ESSENTIALS
                </span>
                <h2 className="type-h3 text-[#18181B] font-display">
                  Startup Conclave 1.0
                </h2>
              </div>

              {/* Data specifications as requested */}
              <ul className="text-xs space-y-3 font-sans">
                <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#71717A] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#E8590C]" />
                    Date:
                  </span>
                  <span className="font-semibold text-[#18181B]">
                    To be announced
                  </span>
                </li>

                <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#71717A] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#E8590C]" />
                    Venue:
                  </span>
                  <span className="font-semibold text-[#18181B]">
                    DVSIET, Meerut
                  </span>
                </li>

                <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#71717A] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E8590C]" />
                    Duration:
                  </span>
                  <span className="font-semibold text-[#18181B]">
                    2 Days (Full Itinerary)
                  </span>
                </li>

                <li className="flex justify-between border-b border-[#EFECE6] pb-2">
                  <span className="text-[#71717A] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#E8590C]" />
                    Format:
                  </span>
                  <span className="font-semibold text-[#E8590C]">
                    In-person On-Campus
                  </span>
                </li>

                <li className="flex justify-between">
                  <span className="text-[#71717A] flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-[#E8590C]" />
                    Registration Fee:
                  </span>
                  <span className="font-bold text-[#18181B]">
                    To be announced
                  </span>
                </li>
              </ul>
            </div>

            {/* What's Included Card */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <h3 className="type-h4 text-[#18181B] font-display border-b border-[#EFECE6] pb-2">
                What's Included With Your Pass
              </h3>

              <ul className="text-xs space-y-2.5 text-[#52525B] font-sans">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>Access to all Keynotes, Fireside chats, and technical panels.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>Full entry to the Startup Showcase physical exhibition floor.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>Networking Luncheon & continuous campus tea/coffee intervals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>Official Certificate of Participation (endorsed for students).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>Official delegate badge & welcome orientation kit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                  <span>Spectator seating for the live Startup Pitch Arena finals.</span>
                </li>
              </ul>
            </div>

            {/* Trust Cues */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-5 space-y-2.5 text-xs text-[#52525B]">
              <span className="font-bold text-[#18181B] font-sans flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#E8590C]" />
                <span>Secretariat Commitment</span>
              </span>
              <ul className="space-y-1.5 text-[11px] text-[#71717A]">
                <li>• Zero spam guarantee: communications strictly limited to conclave updates.</li>
                <li>• Pre-registered delegates receive priority seat reservations before public launch.</li>
                <li>• Managed directly by Dewan V.S. Institute of Engineering & Technology, Meerut.</li>
              </ul>
            </div>

          </div>

          {/* ================================================================= */}
          {/* RIGHT COLUMN: REGISTRATION FORM / WAITLIST / CLOSED / SUCCESS     */}
          {/* ================================================================= */}
          <div className="lg:col-span-7">
            
            {/* --------------------------------------------------------------- */}
            {/* VARIANT A: REGISTRATION CLOSED STATE                            */}
            {/* --------------------------------------------------------------- */}
            {activeMode === 'closed' && (
              <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-8 sm:p-12 text-center space-y-4 shadow-paper">
                <div className="w-12 h-12 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] flex items-center justify-center text-[#71717A] mx-auto">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="type-h3 text-[#18181B] font-display">
                  Registration Currently Closed
                </h3>
                <p className="type-body text-[#52525B] max-w-md mx-auto text-xs sm:text-sm">
                  Delegate registration for Startup Conclave 1.0 is currently paused for administrative review. Please check back shortly or contact our secretariat.
                </p>
                <div className="pt-2">
                  <a href="/contact">
                    <Button variant="secondary" size="sm">
                      Contact Secretariat Desk
                    </Button>
                  </a>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* VARIANT B: SUCCESS CONFIRMATION SCREEN                           */}
            {/* --------------------------------------------------------------- */}
            {activeMode !== 'closed' && formStatus === 'success' && (
              <div className="rounded-[3px] border border-emerald-300 bg-white p-8 sm:p-12 shadow-paper space-y-6 text-center animate-in fade-in">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                    {activeMode === 'waitlist' ? 'WAITLIST CONFIRMED' : 'EXPRESSION OF INTEREST LOGGED'}
                  </span>
                  <h2 className="type-h2 text-[#18181B] font-display">
                    {activeMode === 'waitlist'
                      ? "You're on the Official Waitlist!"
                      : 'You Are On the Priority Roster!'}
                  </h2>
                  <p className="type-body text-[#52525B] max-w-md mx-auto text-xs sm:text-sm">
                    {activeMode === 'waitlist'
                      ? 'The auditorium has reached capacity targets. If additional seats or cancellations open up, you will be notified in priority queue order.'
                      : 'Thank you for registering. You will receive priority notifications when the final dates and official ticketing passes launch.'}
                  </p>
                </div>

                {/* Registration ID Badge */}
                <div className="p-4 rounded-[2px] border border-[#E4E0D7] bg-[#FBF9F5] max-w-sm mx-auto space-y-1 font-mono text-xs">
                  <span className="text-[#71717A] text-[10px] block uppercase">Your Reference Code</span>
                  <span className="text-base font-bold text-[#E8590C] tracking-wide block">
                    {submittedId}
                  </span>
                  <span className="text-[11px] text-[#71717A]">
                    Registered for: {fullName} ({email})
                  </span>
                </div>

                {/* Action Buttons: Share & Disabled Add to Calendar */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={copyShareLink}
                    rightIcon={copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  >
                    {copiedLink ? 'Link Copied!' : 'Share with Peers'}
                  </Button>

                  {/* Add to calendar disabled until date exists */}
                  <div className="relative">
                    <button
                      type="button"
                      disabled
                      onMouseEnter={() => setCalendarTooltip(true)}
                      onMouseLeave={() => setCalendarTooltip(false)}
                      className="inline-flex items-center gap-2 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] px-4 py-2 text-xs font-semibold text-[#71717A] cursor-not-allowed select-none min-h-[38px]"
                    >
                      <CalendarPlus className="w-4 h-4 text-[#A1A1AA]" />
                      <span>Add to Calendar</span>
                    </button>

                    {calendarTooltip && (
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 rounded bg-[#18181B] text-white p-2 text-[10px] z-50 text-center shadow-lg">
                        Calendar invites activate once final conclave dates are published.
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EFECE6]">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-xs text-[#E8590C] hover:underline font-semibold"
                  >
                    Register another attendee
                  </button>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* VARIANT C: ACTIVE REGISTRATION / WAITLIST FORM                  */}
            {/* --------------------------------------------------------------- */}
            {activeMode !== 'closed' && formStatus !== 'success' && (
              <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 shadow-paper space-y-6">
                
                {/* Form Header */}
                <div className="border-b border-[#E4E0D7] pb-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="type-eyebrow text-[#E8590C]">
                      {activeMode === 'waitlist' ? 'CAPACITY WAITLIST' : 'ONLINE PASS ROSTER'}
                    </span>
                    <span className="text-[10px] font-mono text-[#71717A]">
                      Step 1 of 1
                    </span>
                  </div>

                  <h3 className="type-h3 text-[#18181B] font-display">
                    {activeMode === 'waitlist'
                      ? 'Event at Target Capacity: Join Waitlist'
                      : 'Reserve Your Delegate Priority Pass'}
                  </h3>

                  <p className="type-small text-[#52525B]">
                    {activeMode === 'waitlist'
                      ? 'The main auditorium is currently at projection capacity. Register below to be next in line when pass batches release.'
                      : 'Please provide your details below. Pass confirmation details will be sent via email and WhatsApp.'}
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-[2px] border border-red-200 bg-red-50 text-red-700 text-xs font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4.5">
                  
                  {/* Anti-Bot Honeypot Field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">Leave this field blank</label>
                    <input
                      id="website_hp"
                      type="text"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* 1. Full Name */}
                  <Input
                    label="Full Legal Name"
                    placeholder="e.g. Vikram Malhotra"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    error={errors.fullName}
                    required
                  />

                  {/* 2. Email & WhatsApp in 2 Columns */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="vikram@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                      required
                      helperText="For ticket voucher & orientation emails"
                    />

                    <Input
                      label="WhatsApp Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      error={errors.whatsapp}
                      required
                      helperText="For real-time schedule announcements"
                    />
                  </div>

                  {/* 3. Attendee Type & City */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      label="Attendee Type"
                      value={attendeeType}
                      onChange={(e) => setAttendeeType(e.target.value)}
                      options={[
                        { value: 'Student', label: 'Student (Undergraduate / Postgraduate)' },
                        { value: 'Founder', label: 'Startup Founder / Co-Founder' },
                        { value: 'Investor', label: 'Angel Investor / VC Scout' },
                        { value: 'Professional', label: 'Working Professional' },
                        { value: 'Other', label: 'Other' },
                      ]}
                    />

                    <Input
                      label="Current City"
                      placeholder="e.g. Meerut, Noida, Delhi, Lucknow"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      error={errors.city}
                      required
                    />
                  </div>

                  {/* 4. College / Organisation */}
                  <Input
                    label={
                      attendeeType === 'Student'
                        ? 'College / University Name'
                        : 'Company / Startup / Organisation'
                    }
                    placeholder={
                      attendeeType === 'Student'
                        ? 'e.g. Dewan V.S. Institute of Engineering & Technology (DVSIET)'
                        : 'e.g. InnovateX Labs'
                    }
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    error={errors.organisation}
                    required
                  />

                  {/* 5. Course and Year (ONLY SHOWN FOR STUDENTS) */}
                  {attendeeType === 'Student' && (
                    <div className="p-3.5 rounded-[2px] border border-[#E4E0D7] bg-[#FBF9F5] space-y-2 animate-in fade-in">
                      <Input
                        label="Course & Academic Year"
                        placeholder="e.g. B.Tech Computer Science, 3rd Year"
                        value={courseAndYear}
                        onChange={(e) => setCourseAndYear(e.target.value)}
                        error={errors.courseAndYear}
                        required
                        helperText="Required for student delegate pass accreditation"
                      />
                    </div>
                  )}

                  {/* 6. Interest Areas (Multi-select chips) */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-semibold text-[#18181B] font-sans block">
                      Select Topics & Tracks of Interest
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map((item) => {
                        const isSelected = selectedInterests.includes(item);
                        return (
                          <Chip
                            key={item}
                            active={isSelected}
                            onClick={() => toggleInterest(item)}
                          >
                            {item}
                          </Chip>
                        );
                      })}
                    </div>
                  </div>

                  {/* 7. How you heard about us */}
                  <Select
                    label="How Did You Hear About Startup Conclave 1.0?"
                    value={heardAbout}
                    onChange={(e) => setHeardAbout(e.target.value)}
                    options={[
                      { value: 'College Faculty / Notice Board', label: 'College Faculty / Notice Board' },
                      { value: 'WhatsApp / Telegram Communities', label: 'WhatsApp / Telegram Communities' },
                      { value: 'LinkedIn / Social Media', label: 'LinkedIn / Social Media' },
                      { value: 'Friend / Peer Recommendation', label: 'Friend / Peer Recommendation' },
                      { value: 'Other', label: 'Other' },
                    ]}
                  />

                  {/* 8. Optional Payment Step (Hidden behind flag) */}
                  {showPaymentStep && (
                    <div className="p-4 rounded-[2px] border border-blue-200 bg-blue-50 text-xs text-blue-900 space-y-2">
                      <span className="font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Payment Processing (Preview Mode Active)</span>
                      </span>
                      <p>
                        Fee will be calculated upon ticket tier launch. Razorpay/UPI gateway integration activates upon formal pass sales announcement.
                      </p>
                    </div>
                  )}

                  {/* 9. Consent Checkbox */}
                  <div className="pt-2 border-t border-[#EFECE6]">
                    <Checkbox
                      checked={consentAgreed}
                      onChange={(e) => setConsentAgreed(e.target.checked)}
                      label="I agree to receive official conclave alerts via email/WhatsApp, and confirm my intention to attend in person at DVSIET Meerut."
                      error={errors.consent}
                    />
                  </div>

                  {/* Submit Button (In-flow on desktop, sticky bar on mobile) */}
                  <div className="pt-4 border-t border-[#E4E0D7] sm:static fixed bottom-0 left-0 right-0 p-3 sm:p-0 bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t sm:border-t-0 border-[#E4E0D7] z-20 flex items-center justify-between gap-4">
                    <span className="hidden sm:inline text-xs text-[#71717A] font-mono">
                      {activeMode === 'waitlist' ? 'Queue: Next Available' : 'Passes: Priority Queue'}
                    </span>

                    <Button
                      variant="primary"
                      size="lg"
                      type="submit"
                      isLoading={formStatus === 'submitting'}
                      className="w-full sm:w-auto"
                      rightIcon={<Send className="w-4 h-4" />}
                    >
                      {activeMode === 'waitlist'
                        ? 'Join Waitlist Queue'
                        : 'Submit Priority Registration'}
                    </Button>
                  </div>
                </form>

              </div>
            )}

          </div>

        </div>

      </div>
    </PageShell>
  );
};
