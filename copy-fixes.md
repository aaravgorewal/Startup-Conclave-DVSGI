# Startup Conclave 1.0 — Copy and Polish Audit Log

This document records the copy, grammar, accessibility, and visual polish changes made across the site.

---

### 1. `src/config.ts`
- **Date Standardization (hyphen format: "30-31 October 2026")**:
  - `event.date`: `"30–31 October 2026"` -> `"30-31 October 2026"`
  - `schedule.note`: `"30 & 31 October 2026. All sessions in-person at Dewan VS Group of Institutions, Meerut."` -> `"30-31 October 2026. All sessions in-person at Dewan VS Group of Institutions, Meerut."`
  - `faq[2].a`: `"The event is planned for two full days (30 and 31 October 2026)..."` -> `"The event is planned for two days (30-31 October 2026)..."`
  - `faq[5].a`: `"Event date is 30–31 October 2026 at Dewan VS Group of Institutions, Meerut..."` -> `"Event date is 30-31 October 2026 at Dewan VS Group of Institutions, Meerut..."`

- **College Name Consistency ("Dewan VS Group of Institutions, Meerut")**:
  - `organisers[0].name`: `'Dewan VS Group of Institutions'` -> `'Dewan VS Group of Institutions, Meerut'`
  - `event.venueFull`: `"Dewan VS Group of Institutions (DVSGI), NH-58, By-Pass Road, Partapur, Meerut..."` -> `"Dewan VS Group of Institutions, Meerut, NH-58, By-Pass Road, Partapur, Meerut..."`
  - `faq[4].a`: `"At Dewan VS Group of Institutions (DVSGI), NH-58, Partapur, Meerut."` -> `"At Dewan VS Group of Institutions, Meerut, NH-58, Partapur, Meerut."`
  - `contact.campus`: `"Dewan VS Group of Institutions (DVSGI)"` -> `"Dewan VS Group of Institutions, Meerut"`

- **Role Title Consistency**:
  - `students[0].roles`: `["Students Convenor", "Head of Sponsorship"]` -> `["Student Convenor", "Head of Sponsorship"]`

- **Softened Unapproved Promises (Neutral Professional Copy)**:
  - `partnerTiers[0].benefits[1]`: `'Exclusive keynote address and panel participation'` -> `'Main-stage panel discussions and speaking opportunities'`
  - `partnerTiers[0].benefits[3]`: `'Prominent logo placement on all conclave collateral and kits'` -> `'Brand visibility at the venue, on the website and on social media'`
  - `partnerTiers[1].benefits[1]`: `'Main-stage panel slot and workshop hosting opportunities'` -> `'Main-stage panel discussions and workshop opportunities'`
  - `partnerTiers[2].benefits[2]`: `'Branded merchandise inclusion in attendee welcome kits'` -> `'Brand visibility at the venue, on the website and on social media'`
  - `partnerTiers[2].benefits[3]`: `'Social media and digital acknowledgment'` -> `'Social media and digital acknowledgement'` (British/Indian spelling)
  - `partnerTiers[3].benefits[2]`: `'Direct engagement with student innovators and faculties'` -> `'Opportunities to meet student talent, founders and mentors'`
  - `partners.whyPartner[0].desc`: `'Prominent brand exposure across conclave stages, banners, digital media, and delegate kits.'` -> `'Brand visibility at the venue, on the website and on social media.'`
  - `partners.whyPartner[3].desc`: `'Keynote addresses, panel debates, and technical workshop hosting opportunities on the main stage.'` -> `'Main-stage panel discussions and workshop hosting opportunities.'`
  - `partners.whyPartner[5].desc`: `'Curated pipeline for student hiring, resume reviews, fast-track internships, and project demos.'` -> `'Opportunities to meet student talent, review projects and explore hiring.'`

- **FAQ Clarification**:
  - `faq[1].a`: `"To be announced."` -> `"General attendee passes are free. Startup pitch and exhibition stalls have designated registration fees as listed on the registration form."`
  - `faq[3].a`: `"Apply via the registration form below by ticking 'I also want to pitch my startup'."` -> `"Apply via the registration form below by selecting the Hall Pitch track."`

---

### 2. `src/pages/PartnersPage.tsx`
- **Layout & Structure**:
  - Hero right column: Added quick facts card (Date: "30-31 October 2026", Venue: "Dewan VS Group of Institutions, Meerut", Expected participants: "500+", Contact info only rendered if configured).
  - Organisers section: Removed `"Confirmed Units"` badge; kept `"Organised by"`.
  - Enquiry form container: Changed from `max-w-3xl lg:max-w-4xl` to `max-w-6xl xl:max-w-7xl mx-auto` to match the exact left edge and grid width of all other sections. Form remains full width on mobile.

- **Form Validation & Accessibility**:
  - Added field-level error messages (`fieldErrors.company`, `fieldErrors.contactName`, `fieldErrors.email`, `fieldErrors.phone`).
  - Added 10-digit Indian phone clamp (`replace(/\D/g, '').slice(0, 10)`) and regex check (`/^\d{10}$/`).
  - Added `autocomplete` attributes (`organization`, `name`, `tel`, `email`).
  - Added `aria-invalid` attributes on invalid fields.
  - Trimmed all inputs before submission payload.
  - Disabled submit button while submitting with spinning status text.
  - Consistent required asterisks (`*`) on mandatory fields.
  - Success message copy updated: `"Your inquiry has been stored..."` -> `"Your enquiry has been received. Our partnership secretariat will contact you shortly."`

- **Image Fallback (Chief Guests)**:
  - Replaced raw image tag with `GuestAvatar` containing `onError={() => setImgFailed(true)}`.
  - Prevents broken alt text frames; renders clean styled initials avatar if image fails to load.

---

### 3. `src/components/single-page/SinglePage.tsx`
- **Image Fallback (`TeamAvatar`)**:
  - Implemented `TeamAvatar` with `onError` fallback to styled initials avatar (neutral background `#F5EFE3`, 2px border `#111111`, JetBrains Mono initials).
  - Applied to Chief Guests, Core Student Leadership, and Department Leads.
  - Added `width`, `height`, and `loading="lazy"` across all avatars.
  - No broken image frames or raw alt text shown when image URLs fail.

- **College Name Consistency ("Dewan VS Group of Institutions, Meerut")**:
  - JSON-LD Event location: `'Dewan VS Group of Institutions (DVSGI)'` -> `'Dewan VS Group of Institutions, Meerut'`
  - JSON-LD Event organizer: `'Dewan VS Group of Institutions (DVSGI)'` -> `'Dewan VS Group of Institutions, Meerut'`
  - Pass instructions text: `'Scan at DVSGI Gate Check-in'` -> `'Scan at Dewan VS Group of Institutions, Meerut Gate Check-in'`
  - Notice text: `'DVSGI Meerut · No third-party forms'` -> `'Dewan VS Group of Institutions, Meerut · No third-party forms'`
  - Sticky banner label: `'DVSGI Meerut · 2 Days'` -> `'Dewan VS Group of Institutions, Meerut · 2 Days'`

---

### 4. `src/pages/AdminPage.tsx`
- **College Name Consistency**:
  - Login footer: `'Startup Conclave 1.0 · DVSGI Meerut'` -> `'Startup Conclave 1.0 · Dewan VS Group of Institutions, Meerut'`
  - Check-in terminal title: `'Gate Check-in Desk · DVSGI Meerut'` -> `'Gate Check-in Desk · Dewan VS Group of Institutions, Meerut'`

- **British/Indian Spelling**:
  - Double check-in log: `'by organizer'` -> `'by organiser'`
  - Partner enquiries description: `'Organizations requesting sponsor decks...'` -> `'Organisations requesting sponsor decks...'`

---

### 5. `src/pages/ScanPage.tsx`
- **College Name Consistency**:
  - Login footer: `'Startup Conclave 1.0 · Gate Operations · DVSGI Meerut'` -> `'Startup Conclave 1.0 · Gate Operations · Dewan VS Group of Institutions, Meerut'`
  - Text contrast: Increased footer opacity from `#111111/60` to `#111111/75` for WCAG AA compliance on `#FFF8EC`.

---

### 6. `api/_lib/sendConfirmation.ts`
- **Spelling**:
  - Email footer: `"Questions? Contact the organizers:"` -> `"Questions? Contact the organisers:"`

---

### 7. `public/` & `index.html`
- **Assets & Open Graph**:
  - Generated `public/og-image.png` (1200x630) from `public/og.svg` so `og:image` and `twitter:image` resolve correctly.
  - Generated `public/apple-touch-icon.png` (180x180) from `public/favicon.svg`.
