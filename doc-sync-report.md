# Startup Conclave 1.0 — Document Synchronisation Report

This report documents the synchronisation between the website codebase and the final event document (**SOURCE OF TRUTH**).

---

## (a) Changes Made (`file: old -> new`)

### `src/config.ts`
- **Organisers**:
  - `CONFIG.organisers[0].name`: `"Dewan VS Institute of Engineering & Technology"` -> `"Dewan Innovation and Incubation Forum"`
- **About / Intro Text**:
  - `CONFIG.about.introText`: `"A 2-day in-person conclave bringing together 500+ student founders..."` -> `"500+ attendees expected. Organised by Dewan Innovation and Incubation Forum, under the guidance of Dewan V.S. Institute of Engineering and Technology, Meerut."`
- **What's Inside (Activities)**:
  - Replaced the 6 generic highlights with the 8 activities from the source document:
    1. Entrepreneurial awareness and keynote sessions
    2. Expert talks on government schemes and startup funding
    3. Panel discussions with industry experts and startup founders
    4. Startup pitching competition
    5. Startup stalls and showcases
    6. Investor meetings and networking (specifically for startup participants)
    7. Jury evaluation, awards and recognition
    8. Guest interaction and closing ceremonies
- **Schedule**:
  - Made data-driven (`Day 1` and `Day 2` arrays with `{ time, title }` items)
  - `Day 1` title: `"Entrepreneurial Awareness & Inspiration"` with exact sessions:
    - `9:30-10:30 AM`: Registration, welcome and networking
    - `10:30-11:00 AM`: Inaugural ceremony
    - `11:00 AM-12:00 PM`: Keynote: Startup ecosystem in India, opportunities and challenges
    - `12:00-1:00 PM`: Expert talk: Government schemes and startup funding support
    - `1:00-2:00 PM`: Lunch break
    - `2:00-3:30 PM`: Panel discussion: startup founders share real-life journeys
    - `3:30-4:00 PM`: Interactive Q&A with speakers
    - `4:00-4:30 PM`: Networking, feedback and day closing
  - `Day 2` title: `"Pitching & Recognition"` with exact sessions:
    - `10:00-11:00 AM`: Final pitch preparation
    - `11:00 AM-1:30 PM`: Startup pitching competition
    - `1:30-2:30 PM`: Lunch break
    - `2:30-3:30 PM`: Jury deliberation and special talk: investor perspective
    - `3:30-4:30 PM`: Valedictory ceremony, awards and certificates
    - `4:30 PM`: Closing remarks and vote of thanks
  - Removed hall names from schedule.
  - Added subnote: `"Two panel discussions run each day. Final speakers and timings will be announced."`
- **Pitch Arena & Tickets**:
  - `CONFIG.tickets.pitch.badge`: `'₹999'` -> `'Rs 999 per team'`
  - `CONFIG.tickets.pitch.ctaText`: `'Register for Hall Pitch — ₹999'` -> `'Register for Hall Pitch — Rs 999 per team'`
  - `CONFIG.payment.refundPolicyText`: updated to reference `'Rs 999 per team'`.
  - Added `prizes` structure:
    - First: `Rs 1,00,000 worth`
    - Second: `Rs 75,000 worth`
    - Third: `Rs 50,000 worth`
    - Fourth, Fifth and Sixth: Consolation prize `worth Rs 20,000 each`
    - Footnote: `"Prize package details will be announced."`
  - Added `opportunities` block (muted, non-guaranteed wording):
    - Startup incubation opportunities
    - Grant opportunities of up to Rs 15 lakh
    - Incubation support worth up to Rs 1 lakh
    - Patent-related support worth Rs 1 lakh
    - Subtitle: `"Opportunities being arranged"`
    - Disclaimer: `"Subject to partner confirmation, eligibility and terms."` (no words like "win", "guaranteed" or "get")
  - Added `participantPackage` list:
    - Event kit
    - Certificate
    - Networking opportunities
    - Investor meeting and networking session for startups
    - Opportunity to pitch before the jury (eligible teams)
    - Access to relevant sessions and programme activities
    - Eligibility for announced prizes under final competition rules
  - `CONFIG.pitchArena.facts`: updated team size to `"2 to 3 members"`, fee to `"Rs 999 per team"`, audience to `"Teams pitch before the jury"`.
- **Guests**:
  - Added `visible: boolean` property to `Guest` interface.
  - `Sumit Rajesh Mahajan, IAS`: `visible: true`
  - `Mahip Singh`: `visible: true`, organisation updated to `"Incubation Hub, AKTU"`
  - `Vivek Kumar`: `visible: true`, designation updated from `"Operations Head"` to `"Head of Operations"`
  - Added `Prof. Sangeeta Shukla`: `visible: false`, designation `"Vice Chancellor"`, organisation `"CCSU"`, fallback to initials avatar
  - Added `Sunil Kumar Sharma`: `visible: false`, designation `"Minister of IT & Electronics"`, organisation `"Uttar Pradesh"`, fallback to initials avatar
- **Partners / Sponsorship**:
  - Added `categories` array (Academic Partner, Media Partner, Program Partner, Logistics Partner, Food & Beverage Partner, Community Partner, Branding & Printing Partner, IT Partner, Other) with exact source descriptions.
  - Added `contributionTypes`: `['Cash', 'In-kind', 'Both']`.
  - Replaced advantage cards with 9 `benefits` matching document copy.
  - Added `footnote`: `"Benefits depend on the partnership category, contribution and final agreement, and are subject to institutional approval."`
  - Added `stallNote`: `"Organisers provide a basic stall setup. Exact inclusions are agreed in the final partnership terms."`
  - Cleaned `whyPartner` of talent/hiring/recruitment/thought leadership claims.
- **Team**:
  - `Aarav Saini`: `["Student Convenor", "Head of Sponsorship"]` -> `["Overall Student Head & Sponsorships"]`
  - `Mayank Sharma`: `["Head of Technology", "Operations"]` -> `["Operations"]`
  - `Vani Sharma`: `["Head of Media & PR", "Social Media"]` -> `["Social Media"]`
  - `Kartik Gupta`: `["Head of Pitch Arena", "Speaker Relations"]` -> `["Speaker & Guest Relations, and Pitching & Competition"]`
  - `Gagan Kumar`: `["Marketing & PR Lead"]` -> `["Marketing & PR"]`
  - `Yash Mishra`: `["Marketing & Outreach Lead"]` -> `["Marketing & PR"]`
  - `Hetisha Bhardwaj`: `["Branding & Creative Lead"]` -> `["Branding & Creative"]`
  - `Mahima Chaudhary`: `["Hospitality & Protocol Lead"]` -> `["Hospitality"]`
  - `Kunal Dhama`: `["Finance & Budgeting Lead"]` -> `["Finance & Procurement"]`
  - `Aaditya Chaudhary`: `["Technical & Operations Lead"]` -> `["Technical & AV"]` (kept site's "Aaditya" spelling)
  - `Arpita Rajput`: `["Stage & Anchoring Lead"]` -> `["Anchoring & Stage Host"]`
  - `Nitika`: name changed to `"Nitika Ruhela"`, roles `["Startup & Investor Relations Lead"]` -> `["Startup & Investor Relations"]`
  - `Shiva Maitray`: `["Security & Logistics Lead"]` -> `["Security & Safety"]`
- **FAQ**:
  - Replaced answers with exact source facts:
    - Who can attend: `"Students, startup founders, and aspiring entrepreneurs."`
    - Registration fee: `"General Attendee registration is free as it is on the site today. Pitching registration is Rs 999 per team (2 to 3 members)."`
    - How to pitch: `"Apply via the registration form by selecting the Hall Pitch track. Eligible teams (minimum 2, maximum 3 members) get the opportunity to pitch before the jury."`
    - Venue and dates: `"Startup Conclave 1.0 will take place on 30-31 October 2026 at Dewan VS Group of Institutions, Meerut, UP."`
    - What happens after registering: `"Your registration is saved immediately. You will receive your official pass with an entry QR code to present at campus check-in. Detailed schedule updates and instructions will follow via email."`
    - Whether investors will attend: `"Investor meetings and networking are planned for startup participants."` (no investor names)

---

### `src/components/single-page/SinglePage.tsx`
- **Schedule Component**:
  - Migrated to data-driven mapping over `CONFIG.schedule.day1.sessions` and `CONFIG.schedule.day2.sessions`.
  - Added notice card beneath schedule: `"Two panel discussions run each day. Final speakers and timings will be announced."`
  - Removed hall name chips.
- **Pitch Arena Section**:
  - Updated Hall Pitch card badge to `'Rs 999 per team'` and button to `'Register for Hall Pitch — Rs 999 per team'`.
  - Added podium-style **Prizes** card block (1st: Rs 1,00,000 worth, 2nd: Rs 75,000 worth, 3rd: Rs 50,000 worth, Consolation 4th/5th/6th: Rs 20,000 worth each) with footnote `"Prize package details will be announced."`
  - Added **Opportunities being arranged** block (muted background, disclaimer `"Subject to partner confirmation, eligibility and terms."`, neutral non-guarantee phrasing).
  - Added **Participant package (pitching teams)** block listing all 7 official inclusions.
  - Filtered guests display with `guest.visible && guest.confirmed`.
- **Registration Form**:
  - Team size validation error message: `'Team size must be exactly 2 or 3 members for paid registrations.'` -> `'A team needs 2 to 3 members'`
  - Ticket card badge: `'₹999'` -> `'Rs 999 per team'`
  - Ticket card description: updated to `"Event kit, certificate, networking & pitch before jury."`
  - Free attendee checkout note: `"Notice: General Attendee pass does not include pitch slots, startup stalls, event kits, goodies or lunch."` -> `"Notice: General Attendee pass does not include pitch slots, startup stalls or pitching team participant package."`
  - Paid checkout headers & QR text: updated fee label to `'Rs 999 per team'` for pitch track.
  - Submit button: `'Register for Hall Pitch — ₹999'` -> `'Register for Hall Pitch — Rs 999 per team'`.
  - Privacy modal header: `"Startup Conclave 1.0 · Dewan V.S. Institute of Engineering & Technology, Meerut"` -> `"Startup Conclave 1.0 · Dewan VS Group of Institutions, Meerut"`.

---

### `src/pages/PartnersPage.tsx`
- **Partner Categories ("What we look for")**:
  - Replaced "Sponsorship Needs" (and target amounts) and "Ways to partner" chips with 9 data-driven category cards from `CONFIG.partners.categories`.
  - Added subtitle: `"Cash and in-kind partnerships are both accepted."`
  - Ensured no target funding amounts are shown publicly.
- **"What partners may receive"**:
  - Replaced the 6 advantage cards with 9 cards from `CONFIG.partners.benefits`.
  - Added Stall note: `"Organisers provide a basic stall setup. Exact inclusions are agreed in the final partnership terms."`
  - Added Footnote: `"* Benefits depend on the partnership category, contribution and final agreement, and are subject to institutional approval."`
- **Partnership Form**:
  - Replaced Partnership Type select options with the 9 partner categories (`Academic Partner`, `Media Partner`, etc.).
  - Added Contribution Type select (`Cash`, `In-kind`, `Both`).
  - Preserved optional Contribution Range select.
  - Form submission payload formats `partnershipType` as `${partnerCategory} (${contributionType})`, preserving `firestore.rules` schema compatibility without backend changes.
- **Chief Guests Filter**:
  - Filtered by `g.confirmed && g.visible !== false && g.type === 'chief-guest'` (hiding unconfirmed/invisible guests).

---

### `src/pages/AdminPage.tsx`
- Ticket dropdown filter: `<option value="pitch">Hall Pitch (₹999)</option>` -> `<option value="pitch">Hall Pitch (Rs 999 per team)</option>`
- Detail modal ticket display: `'Hall Pitch (₹999)'` -> `'Hall Pitch (Rs 999 per team)'`

---

### `src/services/registrations.ts`
- Line 402 validation error: `'Team size must be exactly 2 or 3 members for paid registrations.'` -> `'A team needs 2 to 3 members'`

---

### `api/_lib/sendConfirmation.ts`
- Line 98 ticket display label: `'Hall Pitch Pass'` -> `'Hall Pitch Pass (Rs 999 per team)'`

---

### `index.html` & `metadata.json`
- Meta description: Removed second tagline `" Where Innovation Meets Opportunity."`, leaving only the single official tagline: `"A 2-day in-person startup, entrepreneurship and innovation conclave at Dewan VS Group of Institutions, Meerut. Where Ideas Meet Capital."`

---

## (b) Items On Site Not In Document Left Untouched

1. **Startup Stall Track & Fee (₹1,299)**:
   - Present on the site in `CONFIG.tickets.stall`, registration form track selection, payment QR code, admin filter, and confirmation email.
   - Left untouched per instructions ("DO NOT delete or guess. Leave it, and list it in doc-sync-report.md under 'Needs owner decision'").
2. **"Hall Pitch" Track Label**:
   - The document refers to "startup pitching competition" / "pitching teams". The site uses "Hall Pitch" for ticket naming and internal keys (`ticket === 'pitch'`). This naming has been retained to avoid breaking form logic, DB schemas, and existing tickets.
3. **Optional Contribution Range Field on Partner Form**:
   - The ranges `['Under ₹25,000', '₹25,000 - ₹50,000', '₹50,000 - ₹1,00,000', '₹1,00,000+']` remain as an optional dropdown in the private partner enquiry form. No public target figures are displayed.
4. **General Attendee Pass (Free)**:
   - Retained as the default entry pass track.

---

## (c) Items Needing Owner's Decision

1. **Startup Stall Track Confirmation**:
   - Does the owner want to keep the "Startup Stall" booking track (₹1,299) active for public registration, or disable/hide it until stalls are officially confirmed?
2. **"Aaditya Chaudhary" Spelling**:
   - The event document writes "Aditya Chaudhary". The site currently spells his name "Aaditya Chaudhary" (and the photo asset is `aaditya-chaudhary.png`). Per instructions, the site's spelling was retained. Does the owner prefer "Aditya" or "Aaditya"?
3. **Visibility of Dignitaries**:
   - `Prof. Sangeeta Shukla` (Vice Chancellor, CCSU) and `Sunil Kumar Sharma` (Minister of IT & Electronics, Uttar Pradesh) are configured with initials-avatar fallback and set to `visible: false`. The owner can enable them at any time by setting `visible: true` in `src/config.ts`.
4. **Partner Submission Schema**:
   - In the enquiry form, Partnership Category and Contribution Type are joined into `partnershipType: "${category} (${contributionType})"` (e.g., `"Academic Partner (Cash)"`) to conform to `firestore.rules` `hasOnly(...)` field restrictions. If the owner updates `firestore.rules` in the future to allow a standalone `contributionType` string field, the form can submit it separately.
