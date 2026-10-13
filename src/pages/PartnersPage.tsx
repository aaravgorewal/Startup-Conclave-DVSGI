/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CONFIG } from '../config.ts';
import { LogoTile } from '../components/single-page/SinglePage.tsx';
import { createPartnerEnquiry, PartnerEnquiryInput } from '../services/registrations.ts';
import {
  checkBrowserRateLimit,
  recordBrowserSubmission,
  checkFormFillTime,
} from '../services/botProtection.ts';
import { AlertCircle, RotateCw, Check, Linkedin } from 'lucide-react';

export default function PartnersPage() {
  // Title, Meta description, Open Graph, and Canonical link management
  useEffect(() => {
    const prevTitle = document.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc ? metaDesc.getAttribute('content') : null;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    const prevOgTitle = ogTitle ? ogTitle.getAttribute('content') : null;

    const ogDesc = document.querySelector('meta[property="og:description"]');
    const prevOgDesc = ogDesc ? ogDesc.getAttribute('content') : null;

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const prevTwitterTitle = twitterTitle ? twitterTitle.getAttribute('content') : null;

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    const prevTwitterDesc = twitterDesc ? twitterDesc.getAttribute('content') : null;

    const ogUrl = document.querySelector('meta[property="og:url"]');
    const prevOgUrl = ogUrl ? ogUrl.getAttribute('content') : null;

    const pageTitle = 'Partner with Startup Conclave 1.0 | Dewan VS Group of Institutions, Meerut';
    const pageDesc =
      'Partner with Startup Conclave 1.0 — a 2-day startup, entrepreneurship and innovation conclave at Dewan VS Group of Institutions, Meerut.';

    document.title = pageTitle;
    if (metaDesc) metaDesc.setAttribute('content', pageDesc);
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);
    if (ogDesc) ogDesc.setAttribute('content', pageDesc);
    if (twitterTitle) twitterTitle.setAttribute('content', pageTitle);
    if (twitterDesc) twitterDesc.setAttribute('content', pageDesc);

    // Canonical link handling (only if VITE_SITE_URL is set)
    const rawSiteUrl = (import.meta.env.VITE_SITE_URL || '').trim();
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    let prevCanonicalHref: string | null = null;
    let createdCanonical = false;

    if (rawSiteUrl) {
      const siteBase = rawSiteUrl.replace(/\/+$/, '');
      const partnersCanonical = `${siteBase}/partners`;
      if (canonicalEl) {
        prevCanonicalHref = canonicalEl.getAttribute('href');
        canonicalEl.setAttribute('href', partnersCanonical);
      } else {
        canonicalEl = document.createElement('link');
        canonicalEl.setAttribute('rel', 'canonical');
        canonicalEl.setAttribute('href', partnersCanonical);
        document.head.appendChild(canonicalEl);
        createdCanonical = true;
      }
      if (ogUrl) {
        ogUrl.setAttribute('content', partnersCanonical);
      }
    }

    return () => {
      document.title = prevTitle;
      if (metaDesc && prevDesc !== null) metaDesc.setAttribute('content', prevDesc);
      if (ogTitle && prevOgTitle !== null) ogTitle.setAttribute('content', prevOgTitle);
      if (ogDesc && prevOgDesc !== null) ogDesc.setAttribute('content', prevOgDesc);
      if (twitterTitle && prevTwitterTitle !== null) twitterTitle.setAttribute('content', prevTwitterTitle);
      if (twitterDesc && prevTwitterDesc !== null) twitterDesc.setAttribute('content', prevTwitterDesc);
      if (ogUrl && prevOgUrl !== null) ogUrl.setAttribute('content', prevOgUrl);

      if (rawSiteUrl) {
        if (createdCanonical && canonicalEl && canonicalEl.parentNode) {
          canonicalEl.parentNode.removeChild(canonicalEl);
        } else if (canonicalEl && prevCanonicalHref !== null) {
          canonicalEl.setAttribute('href', prevCanonicalHref);
        }
      }
    };
  }, []);

  // Form state
  const [partnerCategory, setPartnerCategory] = useState<string>('Academic Partner');
  const [contributionType, setContributionType] = useState<string>('Cash');
  const [formData, setFormData] = useState<PartnerEnquiryInput>({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: 'Academic Partner (Cash)',
    contributionRange: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    company?: string;
    contactName?: string;
    email?: string;
    phone?: string;
  }>({});

  const [formStartTime] = useState<number>(() => Date.now());
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isNetworkError, setIsNetworkError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // 1. Honeypot check
    if (honeypot.trim() !== '') {
      return;
    }

    // 2. Minimum form fill duration
    const timeCheck = checkFormFillTime(formStartTime);
    if (!timeCheck.valid) {
      setError(timeCheck.error || 'Form submitted too quickly. Please take a moment to review your details.');
      return;
    }

    // 3. Browser rate limit check
    const rateCheck = checkBrowserRateLimit('partner');
    if (!rateCheck.allowed) {
      setError(rateCheck.error || 'Submission limit reached. Please try again later.');
      return;
    }

    const companyTrimmed = formData.company.trim();
    const contactNameTrimmed = formData.contactName.trim();
    const emailTrimmed = formData.email.trim();
    const phoneTrimmed = (formData.phone || '').trim();

    const errs: typeof fieldErrors = {};
    if (!companyTrimmed) {
      errs.company = 'Please enter your company or organisation name.';
    }
    if (!contactNameTrimmed) {
      errs.contactName = 'Please enter the contact person name.';
    }
    if (!emailTrimmed) {
      errs.email = 'Please enter your business email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (phoneTrimmed && !/^\d{10}$/.test(phoneTrimmed)) {
      errs.phone = 'Please enter a valid 10-digit Indian phone number.';
    }

    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      setError('Please resolve the highlighted fields below.');
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    setError('');
    setIsNetworkError(false);

    const submissionPayload: PartnerEnquiryInput = {
      ...formData,
      company: companyTrimmed,
      contactName: contactNameTrimmed,
      email: emailTrimmed,
      phone: phoneTrimmed,
      partnershipType: `${partnerCategory} (${contributionType})`,
      message: (formData.message || '').trim(),
    };

    const res = await createPartnerEnquiry(submissionPayload);
    setSubmitting(false);

    if (res.success) {
      setIsNetworkError(false);
      setError('');
      recordBrowserSubmission('partner');
      setSuccess(true);
      setPartnerCategory('Academic Partner');
      setContributionType('Cash');
      setFormData({
        company: '',
        contactName: '',
        email: '',
        phone: '',
        partnershipType: 'Academic Partner (Cash)',
        contributionRange: '',
        message: '',
      });
      setHoneypot('');
    } else {
      setIsNetworkError(Boolean(res.isNetworkError));
      setError(res.error || 'Could not submit enquiry. Check your connection and try again.');
    }
  };

  // Chief guests filter (confirmed only, visible true, type 'chief-guest')
  const chiefGuests = (CONFIG.guests || []).filter(
    (g) => g.confirmed && g.visible !== false && g.type === 'chief-guest'
  );

  const getGuestInitials = (name: string): string => {
    if (!name || !name.trim()) return '?';
    const withoutSuffix = name.split(',')[0].trim();
    const withoutHonorific = withoutSuffix
      .replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.|Sh\.)\s+/i, '')
      .trim();
    const parts = withoutHonorific.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper avatar with error fallback to initials for guests
  const GuestAvatar: React.FC<{
    photo?: string;
    name: string;
    organisation: string;
  }> = ({ photo, name, organisation }) => {
    const [imgFailed, setImgFailed] = useState(false);
    const initials = getGuestInitials(name);

    if (!photo || imgFailed) {
      return (
        <div
          className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F5EFE3] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex flex-col items-center justify-center shrink-0 select-none"
          aria-label={name}
        >
          <span className="font-mono text-sm sm:text-base font-black text-[#111111]">
            {initials}
          </span>
        </div>
      );
    }

    return (
      <img
        src={photo}
        loading="lazy"
        width={80}
        height={80}
        alt={`${name}, ${organisation}`}
        onError={() => setImgFailed(true)}
        className="w-16 h-16 sm:w-20 sm:h-20 object-cover border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 bg-[#FFF8EC]"
      />
    );
  };

  const confirmedNeeds = (CONFIG.sponsorNeeds || []).filter((n) => n.confirmed);
  const hasSponsorDeck = Boolean(
    CONFIG.sponsorDeckUrl && CONFIG.sponsorDeckUrl.startsWith('https://')
  );
  const sponsorContactEmail = (CONFIG.sponsorContactEmail || '').trim();

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#111111] flex flex-col font-sans selection:bg-[#FFD400] selection:text-[#111111]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FFF8EC] border-b-2 border-[#111111]">
        <div className="max-w-6xl xl:max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-3 flex items-center justify-between">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-[#111111] hover:text-[#FF6B1A] transition-colors min-h-[44px] cursor-pointer"
          >
            <span>← Back to home</span>
          </a>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111] shadow-[2px_2px_0px_#111111]">
              Partnerships
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Left Content & Right Facts Card */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5 lg:space-y-6">
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#111111] px-2.5 py-1 border border-[#111111]">
                  PARTNERSHIPS OPEN
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
                  DEWAN VS GROUP OF INSTITUTIONS, MEERUT
                </span>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-white px-2.5 py-1 border border-[#111111]">
                  {CONFIG.event.date}
                </span>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[clamp(2.25rem,3.2vw,3.25rem)] text-[#111111] tracking-tight leading-[1.08]">
                  Partner with Startup Conclave 1.0
                </h1>
                <p className="font-sans text-base sm:text-lg lg:text-xl text-[#111111]/85 font-medium leading-relaxed">
                  A 2-day startup, entrepreneurship and innovation conclave at Dewan VS Group of Institutions, Meerut on {CONFIG.event.date}.
                </p>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const target = document.getElementById('enquire');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="brutal-btn bg-[#FF6B1A] text-[#111111] px-6 py-3.5 font-display font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[46px] inline-flex items-center gap-2"
                >
                  <span>Partner with us</span>
                  <span aria-hidden="true">↓</span>
                </button>

                {hasSponsorDeck && (
                  <a
                    href={CONFIG.sponsorDeckUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-btn bg-white hover:bg-[#FFF8EC] text-[#111111] px-5 py-3.5 font-display font-bold text-sm uppercase tracking-wider rounded-[2px] cursor-pointer min-h-[46px] inline-flex items-center gap-1.5"
                  >
                    <span>Download sponsorship deck</span>
                    <span aria-hidden="true">↓</span>
                  </a>
                )}

                {Boolean(sponsorContactEmail) && (
                  <a
                    href={`mailto:${sponsorContactEmail}?subject=Sponsorship%20Inquiry%20-%20Startup%20Conclave%201.0`}
                    className="inline-flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-[#FF6B1A] hover:text-[#111111] underline transition-colors min-h-[44px] px-2"
                  >
                    <span>{sponsorContactEmail}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                )}
              </div>
            </div>

            {/* Right Side: Facts Card */}
            <div className="lg:col-span-5 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5">
                <h3 className="font-display font-black text-lg text-[#111111] uppercase tracking-wide">
                  Conclave Facts
                </h3>
                <span className="font-mono text-[11px] font-bold bg-[#FFD400] text-[#111111] px-2 py-0.5 border border-[#111111]">
                  QUICK SUMMARY
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#111111]/15 gap-1">
                  <span className="text-[#111111]/70 uppercase font-bold">Date</span>
                  <span className="text-[#111111] font-bold">{CONFIG.event.date}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#111111]/15 gap-1">
                  <span className="text-[#111111]/70 uppercase font-bold">Venue</span>
                  <span className="text-[#111111] font-bold sm:text-right">Dewan VS Group of Institutions, Meerut</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#111111]/15 gap-1">
                  <span className="text-[#111111]/70 uppercase font-bold">Expected participants</span>
                  <span className="text-[#FF6B1A] font-black text-sm">500+</span>
                </div>
                {(CONFIG.contactEmail || CONFIG.contact.email || CONFIG.contactPhone || CONFIG.contact.phone) && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-1">
                    <span className="text-[#111111]/70 uppercase font-bold">Contact</span>
                    <div className="text-[#111111] font-bold sm:text-right">
                      {CONFIG.contactEmail || CONFIG.contact.email ? (
                        <a href={`mailto:${CONFIG.contactEmail || CONFIG.contact.email}`} className="text-[#FF6B1A] underline block">
                          {CONFIG.contactEmail || CONFIG.contact.email}
                        </a>
                      ) : null}
                      {CONFIG.contactPhone || CONFIG.contact.phone ? (
                        <span className="block">{CONFIG.contactPhone || CONFIG.contact.phone}</span>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* What We Look For */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3 gap-2">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
                What we look for
              </h2>
              <p className="text-xs sm:text-sm font-mono text-[#111111]/70 mt-1">
                Cash and in-kind partnerships are both accepted.
              </p>
            </div>
            <span className="font-mono text-xs text-[#111111]/70 font-bold uppercase tracking-wider shrink-0">
              Partner Categories ({CONFIG.partners.categories.length})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {CONFIG.partners.categories.map((cat, idx) => (
              <div
                key={cat.category}
                className="p-5 sm:p-6 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="font-mono text-[11px] font-bold text-[#FF6B1A] uppercase tracking-wider mb-1">
                    Category 0{idx + 1}
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-[#111111]">
                    {cat.category}
                  </h3>
                  <p className="text-sm font-sans text-[#111111]/80 leading-relaxed font-medium mt-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What Partners May Receive */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
              What partners may receive
            </h2>
            <span className="font-mono text-xs text-[#111111]/70 font-bold uppercase tracking-wider">
              Opportunities &amp; Inclusions
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {CONFIG.partners.benefits.map((benefit, idx) => (
              <div
                key={benefit.title}
                className="p-5 sm:p-6 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="font-mono text-[11px] font-bold text-[#FF6B1A] uppercase tracking-wider mb-1">
                    Benefit 0{idx + 1}
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-[#111111]">
                    {benefit.title}
                  </h3>
                  <p className="text-sm font-sans text-[#111111]/80 leading-relaxed font-medium mt-1">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Stall note and footnote */}
          <div className="space-y-2.5 pt-2">
            <div className="p-3.5 bg-[#FFF2D6] border-2 border-[#111111] font-mono text-xs text-[#111111] shadow-[2px_2px_0px_#111111]">
              <strong>Stall note:</strong> {CONFIG.partners.stallNote}
            </div>
            <p className="font-mono text-xs text-[#111111]/75 italic">
              * {CONFIG.partners.footnote}
            </p>
          </div>
        </section>

        {/* Organised by and Supported by logos (Confirmed units label removed) */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
              Organisers &amp; Ecosystem
            </h2>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {CONFIG.organisers.some((o) => o.confirmed) && (
              <div className="space-y-3">
                <div className="font-mono text-xs font-bold uppercase tracking-widest text-[#111111]/70">
                  Organised by
                </div>
                <div className="flex flex-wrap items-stretch gap-3 sm:gap-4">
                  {CONFIG.organisers
                    .filter((o) => o.confirmed)
                    .map((o) => (
                      <LogoTile key={o.name} item={o} />
                    ))}
                </div>
              </div>
            )}

            {CONFIG.supporters.some((s) => s.confirmed) && (
              <div className="p-5 sm:p-6 bg-[#FFF2D6] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3">
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
          </div>
        </section>

        {/* Chief Guests with fallback to styled initials avatar */}
        {chiefGuests.length > 0 && (
          <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3">
              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
                Chief guests
              </h2>
              <span className="font-mono text-xs text-[#111111]/70 font-bold uppercase tracking-wider">
                Confirmed Dignitaries ({chiefGuests.length})
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {chiefGuests.map((guest, idx) => (
                <div
                  key={`${guest.name}-${idx}`}
                  className="p-4 sm:p-5 lg:p-6 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between gap-3 sm:gap-4 text-left min-w-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <GuestAvatar photo={guest.photo} name={guest.name} organisation={guest.organisation} />

                    {guest.linkedin && guest.linkedin.startsWith('https://') && (
                      <a
                        href={guest.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${guest.name} on LinkedIn`}
                        className="inline-flex items-center justify-center w-11 h-11 bg-white border-2 border-[#111111] hover:bg-[#FFD400] shadow-[2px_2px_0px_#111111] text-[#111111] transition-colors cursor-pointer shrink-0 min-h-[44px] min-w-[44px]"
                      >
                        <Linkedin className="w-5 h-5 text-[#111111]" />
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <h3 className="font-display font-black text-lg sm:text-xl text-[#111111] leading-tight break-words">
                      {guest.name}
                    </h3>
                    <p className="font-mono text-xs sm:text-sm font-bold text-[#FF6B1A] uppercase tracking-wide break-words">
                      {guest.designation}
                    </p>
                    <p className="font-sans text-sm text-[#111111]/90 font-bold break-words">
                      {guest.organisation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Partner Enquiry Form: Aligned with max-w-6xl xl:max-w-7xl and full width on mobile */}
        <section id="enquire" className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto text-left space-y-5 lg:space-y-6">
          <div className="space-y-1.5 sm:space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
              Get In Touch
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] tracking-tight">
              Partner Enquiry Form
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#111111]/80 font-medium">
              Submit your enquiry below and our partnership secretariat will get in touch with you.
            </p>
          </div>

          <div className="bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] p-6 sm:p-8">
            {success ? (
              <div className="p-8 bg-[#FFD400] border-2 border-[#111111] text-center space-y-3">
                <Check className="w-10 h-10 text-[#111111] mx-auto stroke-[3]" />
                <h3 className="font-display font-bold text-xl text-[#111111]">Thank You!</h3>
                <p className="text-sm sm:text-base font-sans text-[#111111] font-medium">
                  Your enquiry has been received. Our partnership secretariat will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-4 py-2 border-2 border-[#111111] bg-white font-mono text-xs font-bold uppercase hover:bg-[#FFF8EC] cursor-pointer min-h-[44px]"
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form id="partner-form" onSubmit={handleSubmit} noValidate className="space-y-4 font-sans text-sm">
                {/* Honeypot Field */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="partner_nickname">Do not fill this</label>
                  <input
                    id="partner_nickname"
                    type="text"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-100 border border-red-500 text-red-700 text-xs font-bold flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{error}</span>
                    </div>
                    {isNetworkError && (
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={(e) => handleSubmit(e)}
                        className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-mono text-[11px] font-bold uppercase border border-[#111111] shrink-0 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className={`w-3 h-3 ${submitting ? 'animate-spin' : ''}`} />
                        <span>Retry</span>
                      </button>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="partner_company" className="font-bold text-[#111111] block mb-1">
                    Company / Organisation *
                  </label>
                  <input
                    id="partner_company"
                    type="text"
                    required
                    autoComplete="organization"
                    aria-invalid={Boolean(fieldErrors.company)}
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (fieldErrors.company) setFieldErrors((prev) => ({ ...prev, company: undefined }));
                    }}
                    placeholder="Organisation or Company name"
                    className={`w-full p-2.5 bg-white border-2 ${
                      fieldErrors.company ? 'border-red-600' : 'border-[#111111]'
                    } min-h-[46px] text-base focus:outline-none`}
                  />
                  {fieldErrors.company && (
                    <p className="text-xs text-red-600 font-bold mt-1">{fieldErrors.company}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="partner_contact" className="font-bold text-[#111111] block mb-1">
                      Contact Name *
                    </label>
                    <input
                      id="partner_contact"
                      type="text"
                      required
                      autoComplete="name"
                      aria-invalid={Boolean(fieldErrors.contactName)}
                      value={formData.contactName}
                      onChange={(e) => {
                        setFormData({ ...formData, contactName: e.target.value });
                        if (fieldErrors.contactName) setFieldErrors((prev) => ({ ...prev, contactName: undefined }));
                      }}
                      placeholder="Enter contact person name"
                      className={`w-full p-2.5 bg-white border-2 ${
                        fieldErrors.contactName ? 'border-red-600' : 'border-[#111111]'
                      } min-h-[46px] text-base focus:outline-none`}
                    />
                    {fieldErrors.contactName && (
                      <p className="text-xs text-red-600 font-bold mt-1">{fieldErrors.contactName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="partner_phone" className="font-bold text-[#111111] block mb-1">
                      Phone Number (10 digits)
                    </label>
                    <input
                      id="partner_phone"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      maxLength={10}
                      aria-invalid={Boolean(fieldErrors.phone)}
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setFormData({ ...formData, phone: val });
                        if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: undefined }));
                      }}
                      placeholder="Enter 10-digit number"
                      className={`w-full p-2.5 bg-white border-2 ${
                        fieldErrors.phone ? 'border-red-600' : 'border-[#111111]'
                      } min-h-[46px] text-base font-mono focus:outline-none`}
                    />
                    {fieldErrors.phone && (
                      <p className="text-xs text-red-600 font-bold mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="partner_email" className="font-bold text-[#111111] block mb-1">
                    Business Email *
                  </label>
                  <input
                    id="partner_email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-invalid={Boolean(fieldErrors.email)}
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    placeholder="contact@company.com"
                    className={`w-full p-2.5 bg-white border-2 ${
                      fieldErrors.email ? 'border-red-600' : 'border-[#111111]'
                    } min-h-[46px] text-base focus:outline-none`}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-600 font-bold mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Partnership Category, Contribution Type & Contribution Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="partner_category" className="font-bold text-[#111111] block mb-1">
                      Partnership Category *
                    </label>
                    <select
                      id="partner_category"
                      value={partnerCategory}
                      onChange={(e) => setPartnerCategory(e.target.value)}
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base focus:outline-none cursor-pointer"
                    >
                      {CONFIG.partners.categories.map((cat) => (
                        <option key={cat.category} value={cat.category}>
                          {cat.category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contribution_type" className="font-bold text-[#111111] block mb-1">
                      Contribution Type *
                    </label>
                    <select
                      id="contribution_type"
                      value={contributionType}
                      onChange={(e) => setContributionType(e.target.value)}
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base focus:outline-none cursor-pointer"
                    >
                      {CONFIG.partners.contributionTypes.map((ct) => (
                        <option key={ct} value={ct}>
                          {ct}
                        </option>
                      ))}
                    </select>
                  </div>

                  {Boolean(CONFIG.partnerRanges && CONFIG.partnerRanges.length > 0) && (
                    <div>
                      <label htmlFor="partner_range" className="font-bold text-[#111111] block mb-1">
                        Contribution Range
                      </label>
                      <select
                        id="partner_range"
                        value={formData.contributionRange}
                        onChange={(e) => setFormData({ ...formData, contributionRange: e.target.value })}
                        className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base focus:outline-none cursor-pointer"
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
                  <label htmlFor="partner_message" className="font-bold text-[#111111] block mb-1">
                    Partnership Interest / Message
                  </label>
                  <textarea
                    id="partner_message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what track or format you'd like to support..."
                    className="w-full p-2.5 bg-white border-2 border-[#111111] text-base focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`brutal-btn bg-[#FF6B1A] text-[#111111] px-6 py-3 font-display font-extrabold text-sm uppercase tracking-wider min-h-[46px] ${
                      submitting ? 'opacity-60 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center gap-1.5">
                        <RotateCw className="w-4 h-4 animate-spin" />
                        <span>Submitting...</span>
                      </span>
                    ) : (
                      'Submit Partner Enquiry'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Minimal Footer Matching Site */}
      <footer className="border-t-2 border-[#111111] bg-[#FFF8EC] py-8 sm:py-10 px-4 md:px-6 lg:px-10">
        <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-mono text-[#111111]/75">
          <div>
            <span>© {new Date().getFullYear()} {CONFIG.event.name.toUpperCase()} · Dewan VS Group of Institutions, Meerut</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" className="text-[#FF6B1A] hover:text-[#111111] font-bold underline transition-colors">
              ← Back to home
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
