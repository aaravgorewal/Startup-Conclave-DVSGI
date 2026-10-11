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

    const pageTitle = 'Partner with Startup Conclave 1.0 | DVSIET Meerut';
    const pageDesc =
      'Partner with Startup Conclave 1.0 — a 2-day startup, entrepreneurship and innovation conclave at DVSIET, Meerut.';

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
  const [formData, setFormData] = useState<PartnerEnquiryInput>({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    partnershipType: 'Cash',
    contributionRange: '',
    message: '',
  });

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

    if (!formData.company.trim() || !formData.contactName.trim() || !formData.email.trim()) {
      setError('Please provide company name, contact person, and email.');
      return;
    }

    setSubmitting(true);
    setError('');
    setIsNetworkError(false);

    const res = await createPartnerEnquiry(formData);
    setSubmitting(false);

    if (res.success) {
      setIsNetworkError(false);
      setError('');
      recordBrowserSubmission('partner');
      setSuccess(true);
      setFormData({
        company: '',
        contactName: '',
        email: '',
        phone: '',
        partnershipType: 'Cash',
        contributionRange: '',
        message: '',
      });
      setHoneypot('');
    } else {
      setIsNetworkError(Boolean(res.isNetworkError));
      setError(res.error || 'Could not submit. Check your internet and try again.');
    }
  };

  // Chief guests filter (confirmed only, type 'chief-guest')
  const chiefGuests = (CONFIG.guests || []).filter(
    (g) => g.confirmed && g.type === 'chief-guest'
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
        {/* Hero Section */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-5 lg:space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-white bg-[#111111] px-2.5 py-1 border border-[#111111]">
              PARTNERSHIPS OPEN
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-1 border border-[#111111]">
              DVSIET, MEERUT
            </span>
          </div>

          <div className="space-y-3 sm:space-y-4 max-w-3xl">
            <h1 className="font-display font-black text-3xl sm:text-4xl lg:text-[clamp(2.25rem,3.2vw,3.25rem)] text-[#111111] tracking-tight leading-[1.08]">
              Partner with Startup Conclave 1.0
            </h1>
            <p className="font-sans text-base sm:text-lg lg:text-xl text-[#111111]/85 font-medium leading-relaxed">
              A 2-day startup, entrepreneurship and innovation conclave at DVSIET, Meerut.
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
        </section>

        {/* Why Partner With Us: 6 benefit cards */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
              Why partner with us
            </h2>
            <span className="font-mono text-xs text-[#111111]/70 font-bold uppercase tracking-wider">
              6 Core Advantages
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {CONFIG.partners.whyPartner.map((benefit) => (
              <div
                key={benefit.title}
                className="p-5 sm:p-6 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="font-mono text-[11px] font-bold text-[#FF6B1A] uppercase tracking-wider mb-1">
                    Advantage
                  </div>
                  <h3 className="font-display font-black text-lg sm:text-xl text-[#111111]">
                    {benefit.title}
                  </h3>
                  <p className="text-sm font-sans text-[#111111]/80 leading-relaxed font-medium mt-1">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Are Looking For */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
              What we are looking for
            </h2>
            <span className="font-mono text-xs text-[#111111]/70 font-bold uppercase tracking-wider">
              Sponsorship Needs
            </span>
          </div>

          {confirmedNeeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {confirmedNeeds.map((need, idx) => (
                <div
                  key={`${need.title}-${idx}`}
                  className="p-4 sm:p-5 lg:p-6 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <h3 className="font-display font-black text-lg sm:text-xl text-[#111111]">
                      {need.title}
                    </h3>
                    <p className="text-sm font-sans text-[#111111]/85 leading-relaxed font-medium">
                      {need.description}
                    </p>
                  </div>
                  {Boolean(need.amount && need.amount.trim()) && (
                    <div className="pt-2 border-t border-[#111111]/20">
                      <span className="font-mono text-xs sm:text-sm font-black text-[#FF6B1A]">
                        {need.amount?.trim()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-wider text-[#111111]/70 font-bold">
                Ways to partner
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {[
                  'Cash sponsorship',
                  'Technology credits',
                  'Food & beverage',
                  'Merchandise',
                  'Media partnership',
                  'Travel & hospitality',
                  'Other',
                ].map((chip) => (
                  <span
                    key={chip}
                    className="px-4 py-2.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-mono text-xs sm:text-sm font-bold text-[#111111]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Organised by and Supported by logos */}
        <section className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-6xl xl:max-w-7xl mx-auto border-b-2 border-[#111111] text-left space-y-6 lg:space-y-7">
          <div className="flex items-center justify-between border-b-2 border-[#111111] pb-2.5 sm:pb-3">
            <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-[clamp(1.75rem,2.5vw,2.5rem)] text-[#111111] uppercase tracking-tight">
              Organisers &amp; Ecosystem
            </h2>
            <span className="font-mono text-xs text-[#111111]/70 font-bold uppercase tracking-wider">
              Confirmed Units
            </span>
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

        {/* Chief Guests (confirmed only with type 'chief-guest', hidden if none) */}
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
                    {guest.photo ? (
                      <img
                        src={guest.photo}
                        loading="lazy"
                        width={80}
                        height={80}
                        alt={`${guest.name}, ${guest.organisation}`}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover border-2 border-[#111111] shadow-[2px_2px_0px_#111111] shrink-0 bg-[#FFF8EC]"
                      />
                    ) : (
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-[#FFD400] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center font-display font-black text-xl sm:text-2xl text-[#111111] shrink-0 select-none"
                        aria-label={guest.name}
                      >
                        {getGuestInitials(guest.name)}
                      </div>
                    )}

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

        {/* Partner Enquiry Form */}
        <section id="enquire" className="px-4 md:px-6 lg:px-10 py-12 md:py-14 lg:py-16 max-w-3xl lg:max-w-4xl mx-auto text-left space-y-5 lg:space-y-6">
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
                  Your inquiry has been stored. Our team will contact you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 px-4 py-2 border-2 border-[#111111] bg-white font-mono text-xs font-bold uppercase hover:bg-[#FFF8EC] cursor-pointer min-h-[44px]"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form id="partner-form" onSubmit={handleSubmit} className="space-y-4 font-sans text-sm">
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
                  <label htmlFor="partner_company" className="font-bold text-[#111111] block mb-1">Company / Organisation *</label>
                  <input
                    id="partner_company"
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Organisation or Company name"
                    className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="partner_contact" className="font-bold text-[#111111] block mb-1">Contact Name *</label>
                    <input
                      id="partner_contact"
                      type="text"
                      required
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Enter contact person name"
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="partner_phone" className="font-bold text-[#111111] block mb-1">Phone Number</label>
                    <input
                      id="partner_phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter 10-digit number"
                      className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="partner_email" className="font-bold text-[#111111] block mb-1">Business Email *</label>
                  <input
                    id="partner_email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@company.com"
                    className="w-full p-2.5 bg-white border-2 border-[#111111] min-h-[46px] text-base"
                  />
                </div>

                {/* Partnership Type & Contribution Range */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="partner_type" className="font-bold text-[#111111] block mb-1">Partnership Type *</label>
                    <select
                      id="partner_type"
                      value={formData.partnershipType}
                      onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
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
                      <label htmlFor="partner_range" className="font-bold text-[#111111] block mb-1">Contribution Range</label>
                      <select
                        id="partner_range"
                        value={formData.contributionRange}
                        onChange={(e) => setFormData({ ...formData, contributionRange: e.target.value })}
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
                  <label htmlFor="partner_message" className="font-bold text-[#111111] block mb-1">Partnership Interest / Message</label>
                  <textarea
                    id="partner_message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what track or format you'd like to support..."
                    className="w-full p-2.5 bg-white border-2 border-[#111111] text-base"
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
                      'Submit Partner Inquiry'
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
        <div className="max-w-6xl xl:max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm font-mono text-[#111111]/70">
          <div>
            <span>© {new Date().getFullYear()} {CONFIG.event.name.toUpperCase()} · DVSIET, Meerut</span>
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
