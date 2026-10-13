# Startup Stall Removal & Verification Report

## Overview
The participant "Startup Stall" registration track (₹1,299 fee) has been completely removed from public-facing registration and promotional flows. Startups now exclusively register under the **Startup Pitch** track (**Rs 999 per team, 2 to 3 members**; internal stored `ticketType: 'pitch'`), alongside the free **General Attendee** track.

All safety, security, and content invariants were preserved:
- No changes made to `firestore.rules`, authentication, or `vercel.json`.
- Visual styling (Neo-brutalist palette: `#FFF8EC` canvas, `#111111` ink, `#FF6B1A` primary, `#FFD400` highlight, 2px borders, hard offset shadows) maintained.
- Full backward compatibility maintained for existing stored records with `ticket === 'stall'`.

---

## (a) What Was Removed (File: Old -> Removed)

### 1. `src/config.ts`
- **`CONFIG.tickets.pitch`**:
  - `label`: `'Hall Pitch'` -> `'Startup Pitch'`
  - `name`: `'Hall Pitch Pass'` -> `'Startup Pitch Pass'`
  - `badge`: `'Rs 999 per team'` -> `'Rs 999 per team, 2 to 3 members'`
  - `ctaText`: `'Register for Hall Pitch — Rs 999 per team'` -> `'Register for Startup Pitch — Rs 999 per team'`
- **`CONFIG.tickets.stall`**:
  - Reclassified as legacy ticket config (`label: 'Startup Stall (legacy)'`, `name: 'Startup Showcase Stall (legacy)'`, `features: []`, `ctaText: 'Legacy'`).
- **`CONFIG.tickets.participant.notice`**:
  - Removed stall mention: `'General Attendee pass does not include a pitch slot, startup stall, or pitching team participant package.'` -> `'General Attendee pass does not include a pitch slot or pitching team participant package.'`
- **`CONFIG.payment.refundPolicyText`**:
  - Removed stall refund reference: now explicitly refers to `'Registration fees for Startup Pitch (Rs 999 per team) are non-refundable once slot allocation is confirmed.'`
- **`CONFIG.whatsInside` (Section 02 Activity Formats)**:
  - Removed `"Startup Stalls"` (`{ title: "Startup Stalls", note: "Product showcases and demos" }`) from activity list.
  - Heading updated to count-free: `"Activity formats across two days."` (7 active formats remain).
- **`CONFIG.faq`**:
  - Updated FAQ 2 answer: Removed stall fee mention. Now states: `"General Attendee registration is free. Pitching registration is Rs 999 per team (2 to 3 members)."`
  - Updated FAQ 3 answer: Updated track name to Startup Pitch: `"Apply via the registration form by selecting the Startup Pitch track. Eligible teams (minimum 2, maximum 3 members) get the opportunity to pitch before the jury."`

### 2. `src/components/single-page/SinglePage.tsx`
- **Section 04 (Pitch Arena Ticket Cards)**:
  - Removed 3rd card ("Startup Stall" card, ₹1,299 fee, showcase bullets, and CTA button).
  - Re-laid out container into a centered 2-card responsive grid:
    ```tsx
    <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-5 lg:gap-6 items-stretch">
      {/* Card 1: Startup Pitch — Rs 999 per team */}
      {/* Card 2: General Attendee — Free */}
    </div>
    ```
- **Section 09 (Registration Form Track Selector)**:
  - Removed 3rd track button ("Startup Stall" ₹1,299).
  - Re-laid out track selector into a clean 2-track responsive grid:
    ```tsx
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
      {/* 1. General Attendee — Free */}
      {/* 2. Startup Pitch — Rs 999 per team */}
    </div>
    ```
- **Section 09 (Registration Form Fields)**:
  - Removed stall-specific form fields (Product / Showcase description, stall space requirements, etc.).
  - Preserved General Attendee and Startup Pitch form fields intact (Team name, stage, sector, pitch deck Google Drive/Canva URL, team size 2 to 3 members).
- **Payment & Submit Logic**:
  - Removed stall fee branching from UPI payment URL construction (`upiPayUrl` uses `CONFIG.tickets.pitch.fee`).
  - Removed stall branching from submit button label (now displays `'Register for Startup Pitch — Rs 999 per team'` or `'Complete Free Attendee Registration'`).
  - Removed stall reference from attendee checkout summary notice.

### 3. `src/services/registrations.ts`
- **Submission Prevention for Stall Track**:
  - Added guard rejecting any new registration attempt with `input.ticket === 'stall'`:
    ```ts
    if (input.ticket === 'stall') {
      return {
        success: false,
        isNetworkError: false,
        error: 'The Startup Stall track is no longer available. Please register for Startup Pitch.',
      };
    }
    ```
- **Validation & Payment Simplification**:
  - Removed stall error messages and branch conditions (`isStall ? 'Stall bookings open soon.' : ...`).
  - Amount calculation simplified to pitch fee only: `amountPaise = CONFIG.tickets.pitch.fee * 100` (99900 paise).
  - Paid track validation strictly enforces Startup Pitch criteria.

### 4. `src/pages/AdminPage.tsx`
- Ticket filter dropdown updated:
  - `<option value="pitch">Startup Pitch (Rs 999 per team)</option>`
  - `<option value="stall">Startup Stall (legacy)</option>`
- Registration detail modal and table badges:
  - Ticket badges show `STALL (LEGACY)` for historic stall records.
  - Detail modal displays `Startup Stall (legacy)` and `Showcase Stall Details (legacy)`.
- CSV Export:
  - Historic records with `r.ticket === 'stall'` export as `'Startup Stall (legacy)'`.

### 5. `src/pages/ScanPage.tsx`
- QR Check-in badge:
  - Displays `'Startup Stall (legacy)'` when scanning historic stall passes.

### 6. `src/services/checkin.ts`
- Atomic check-in transaction:
  - Handled both `'pitch'` and legacy `'stall'` for payment verification checks to prevent runtime errors.

### 7. `api/_lib/sendConfirmation.ts`
- Confirmation email generator:
  - Ticket type displays `'Startup Stall Pass (legacy)'` for legacy records, and `'Startup Pitch Pass (Rs 999 per team)'` for pitching teams.

---

## (b) Legacy Handling Kept

To guarantee that the admin dashboard, CSV exports, check-in scanner, and local storage never crash when encountering previously stored participant registrations:

1. **TypeScript Data Models**:
   - `ParticipationCategory` retained as `'participant' | 'pitch' | 'stall'` in `src/config.ts` and `src/services/registrations.ts`.
   - `RegistrationRecord` and `RegistrationInput` interfaces retain `ticket?: 'participant' | 'pitch' | 'stall'`.
2. **Database Invariants**:
   - Internal `ticketType` for pitching teams remains `'pitch'` (public visible label updated to "Startup Pitch").
   - `firestore.rules` left completely untouched; historical stall registrations remain protected and readable by admins.
3. **Admin Panel (`src/pages/AdminPage.tsx`)**:
   - Table badge: Renders `STALL (LEGACY)` with distinctive styling.
   - Filter dropdown: Allows filtering by `Startup Stall (legacy)` to inspect previous stall applicants.
   - Detail modal: Displays `Showcase Stall Details (legacy)` section for previously submitted stall records.
   - Revenue calculation: Includes verified legacy stall ticket revenue (`stallVerified * stallFee`) if historical stall records exist in the database.
4. **Campus Check-in Scanner (`src/pages/ScanPage.tsx` & `src/services/checkin.ts`)**:
   - Renders `'Startup Stall (legacy)'` on scanned passes without throwing errors.
   - Check-in service verifies payment status for both pitch and legacy stall records atomically.
5. **Session Recovery (`src/components/single-page/SinglePage.tsx`)**:
   - If a user opens the page with a cached/submitted legacy stall record, the canvas pass generator renders `CONFIG.tickets.stall.label` (`Startup Stall (legacy)`) without crashing.

---

## (c) Leftovers That Still Mention "Stall" & Why

| Location | Content | Reason | Action / Note |
|---|---|---|---|
| `src/config.ts` (`CONFIG.partners.benefits[5]`) | `{ title: 'Two-Day Exhibition Stall', description: 'A stall for two days.', note: '...' }` | **Sponsor Benefit**: Stalls are provided as perks for event sponsors/partners, NOT as open participant tickets. | Kept per prompt instructions. **Flagged for owner confirmation**. |
| `src/config.ts` (`CONFIG.partners.stallNote`) | `'Organisers provide a basic stall setup. Exact inclusions are agreed in the final partnership terms.'` | **Sponsor Footnote**: Clarifies stall logistics for corporate partners on `/partners`. | Kept per prompt instructions. **Flagged for owner confirmation**. |
| `src/config.ts` (`CONFIG.partners.whyPartner[5]`) | `{ title: 'Two-Day Exhibition Stall', desc: 'A stall for two days. ...' }` | **Sponsor Marketing**: Describes sponsor booth availability. | Kept per prompt instructions. **Flagged for owner confirmation**. |
| `src/pages/PartnersPage.tsx` (L470) | `<strong className="text-[#FF6B1A]">Stall note:</strong> {CONFIG.partners.stallNote}` | **Sponsor Page UI**: Displays sponsor stall terms on `/partners`. | Kept per prompt instructions. |
| `src/config.ts` (`CONFIG.tickets.stall`) | `stall: { label: 'Startup Stall (legacy)', fee: 1299, ... }` | **Legacy Config**: Supplies fallback labels and fee constants for historical admin analytics. | Kept for legacy support. |
| `src/pages/AdminPage.tsx` | Legacy filter, table badge `STALL (LEGACY)`, detail view, and CSV export. | **Admin Management**: Allows organizers to manage and export legacy registrations. | Kept for legacy support. |
| `src/pages/ScanPage.tsx` | Badge: `'Startup Stall (legacy)'` | **Gate Check-in**: Displays proper pass type if a previously issued stall pass QR is scanned at the door. | Kept for legacy support. |
| `src/services/checkin.ts` | `(data.ticket === 'pitch' \|\| data.ticket === 'stall')` | **Check-in Logic**: Atomic check-in and transaction verification for legacy records. | Kept for legacy support. |
| `src/services/registrations.ts` | `input.ticket === 'stall'` check & error return | **Registration Guard**: Rejects any incoming payload attempting to register for a stall. | Kept as safety guard. |
| `firestore.rules` (L118, L136) | `data.payment.amountPaise == 129900`, `data.ticket == 'stall'` | **Security Rules**: Enforces Firestore schema integrity for existing records. | Untouched per hard rules. |

---

## Verification Summary

1. **Grep Search Verification**:
   - `1,299` / `1299`: Only present in legacy admin fallback config (`config.ts:143`) and untouched `firestore.rules`. Completely absent from public UI and forms.
   - `Hall Pitch`: 0 occurrences in source code (`src/` and `api/`).
   - `Book a stall`: 0 occurrences across entire repository.
   - `showcase`: Only present in legacy admin modal label (`Showcase Stall Details (legacy)`), legacy config label, and old markdown reports.
   - `Startup Stall`: Only appears with `(legacy)` suffix in admin/scan/confirmation components.
2. **Layout & Responsiveness**:
   - **Desktop (1280px)**: Pitch Arena ticket cards section displays 2 centered, equal-width cards (`max-w-4xl mx-auto grid-cols-1 md:grid-cols-2`). Registration track selector displays 2 equal-width tracks (`grid-cols-1 sm:grid-cols-2`).
   - **Mobile (360px)**: Both the ticket cards and registration track selector stack cleanly in single-column layout with standard Neo-brutalist 2px borders, hard offset shadows, minimum 44px tap targets, and no horizontal scroll/overflow.
3. **Build & Lint Results**:
   - `npm run lint` (`tsc --noEmit`): **PASSED** (0 errors).
   - `npm run build` (`vite build`): **PASSED** (dist bundle generated in 367ms).
