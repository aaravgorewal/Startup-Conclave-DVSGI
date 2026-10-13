# Homepage Cleanup Report

This report documents the cleanup of redundant and unverified content across the home page and site configuration.

---

## (a) What Was Removed (`file: old text -> removed`)

### 1. `src/config.ts`
- **Hero Chip**:
  - `CONFIG.event.badgeSticker`: `"2 DAYS • 1 STAGE"` -> `"2 DAYS"`
- **Pitch Arena Description**:
  - `CONFIG.pitchArena.description`: `"Pitch your startup live in front of the jury and audience. Pitch format: 5-minute pitch followed by 5-minute Q&A. Teams pitch before the jury."` -> `"Pitch your startup live on stage directly before the jury. Teams pitch before the jury."`
- **Pitch Arena Key Facts Strip Data**:
  - `CONFIG.pitchArena.facts`:
    ```ts
    facts: [
      { label: "Pitch Format", value: "5 min pitch + 5 min Q&A" },
      { label: "Hall Pitch Fee", value: "Rs 999 per team (2 to 3 members)" },
      { label: "Startup Stall Fee", value: "₹1,299 (Showcase stall space)" },
      { label: "General Attendee", value: "Free (Audience access)" },
    ]
    ```
    -> Removed completely (ticket cards already display this).
- **Pitch Arena "What Startups Get" Trio Data**:
  - `CONFIG.pitchArena.whatStartupsGet`:
    ```ts
    whatStartupsGet: [
      {
        title: "5m Pitch + 5m Q&A",
        desc: "Strict 5-minute pitch followed by 5 minutes of focused jury and attendee Q&A.",
      },
      {
        title: "Team Registration",
        desc: "Rs 999 per team for 2 to 3 members, including event kit, certificates, and lunch.",
      },
      {
        title: "Investor & Ecosystem Access",
        desc: "Investor meetings and networking sessions planned specifically for startup participants.",
      },
    ]
    ```
    -> Removed completely (covered by the Participant package block).
- **Hall Pitch Ticket Card Features & Description**:
  - `CONFIG.tickets.pitch.description`:
    - Old: `'Present your startup live on stage with a dedicated 5-minute pitch followed by 5-minute Q&A before the jury.'`
    - New: `'Present your startup live on stage directly before the jury. Teams pitch before the jury.'`
  - `CONFIG.tickets.pitch.features`:
    - Old:
      ```ts
      features: [
        '5-minute live pitch + 5-minute jury & attendee Q&A',
        'Pitch before the jury (eligible teams)',
        'Team registration (2 to 3 members)',
        'Event kit, certificate, networking & lunch included',
      ]
      ```
    - New (trimmed to 3 short non-repetitive lines):
      ```ts
      features: [
        'Opportunity to pitch before the jury (eligible teams)',
        'Team registration (minimum 2, maximum 3 members)',
        'Access to relevant conclave sessions & activities',
      ]
      ```
- **General Attendee Notice**:
  - `CONFIG.tickets.participant.notice`:
    - Old: `'General Attendee pass does not include a pitch slot, startup stall, event kit, goodies, or lunch.'`
    - New: `'General Attendee pass does not include a pitch slot, startup stall, or pitching team participant package.'`
- **Team Leadership Note**:
  - `CONFIG.team.note`: `"Faculty and student leadership will be announced soon."` -> Removed completely.

---

### 2. `src/components/single-page/SinglePage.tsx`
- **Pitch Arena Card Subtitle**:
  - Old: `<p className="font-mono text-xs font-bold text-[#FF6B1A] mt-0.5">5m Pitch + 5m Q&A · 2 to 3 Members</p>`
  - New: `<p className="font-mono text-xs font-bold text-[#FF6B1A] mt-0.5">Pitch before the jury · 2 to 3 Members</p>`
- **Hall Pitch Card Feature Bullets**:
  - Removed bullets mentioning `"5-minute live pitch followed by 5-minute Q&A"` and `"Event kit, certificate, networking & lunch included"`.
  - Replaced with 3 concise bullets focusing on stage opportunity, team registration, and session access, leaving all package inclusions exclusively in the Participant package block.
- **General Attendee Card Notice**:
  - Old: `<strong>Notice:</strong> General Attendee pass does not include a pitch slot, startup stall, event kit, goodies, or lunch.`
  - New: `<strong>Notice:</strong> General Attendee pass does not include a pitch slot, startup stall, or pitching team participant package.`
- **Tag Strip Under Ticket Cards**:
  - Removed markup rendering `CONFIG.pitchArena.facts.map(...)` tag strip (`"Pitch Format: 5 min pitch + 5 min Q&A"`, `"Hall Pitch Fee..."`, `"Startup Stall Fee..."`, `"General Attendee: Free"`).
- **Leadership Placeholder Note in "Behind the event"**:
  - Removed `{showPlaceholdersNote && ( <p ...>Faculty and student leadership will be announced soon.</p> )}` markup.
- **Registration Section Number**:
  - Corrected section badge number from `07` to `06` to maintain sequential numbering (`01 About`, `02 What's Inside`, `03 Schedule`, `04 Pitch Arena`, `05 Guests`, `Behind the event`, `06 Registration`).
- **Footer Duplicate Logo Row**:
  - Removed duplicate `{CONFIG.organisers.some((o) => o.confirmed) && ( <div className="py-6 border-b-2 border-[#111111] flex flex-wrap items-center gap-3">...</div> )}` in footer. Logo row remains prominently in the hero section.

---

## (b) What Was Hidden and the Flag Name

### "Opportunities Being Arranged" Block
- **Config Flag**: `CONFIG.showOpportunities = false` (added to `src/config.ts`).
- **Render Condition in `SinglePage.tsx`**:
  ```tsx
  {Boolean(CONFIG.showOpportunities) && (
    <div className="p-5 sm:p-6 lg:p-7 bg-[#FFF8EC] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-left space-y-4">
      {/* Ecosystem Support: Opportunities being arranged */}
    </div>
  )}
  ```
- **Verification**: Verified that while `CONFIG.showOpportunities` is `false`, no other section on the home page, FAQ answers, confirmation emails, or metadata mention `"Rs 15 lakh"`, `"grant"`, `"incubation support"`, or `"patent"`.

---

## (c) Anything Else on the Home Page That Looks Redundant or Unverified (Left Untouched)

The following items exist on the home page and were left untouched per instructions (listed for owner review):

1. **Startup Stall Track (₹1,299)**:
   - Present as Card 2 in the Pitch Arena and as a selection track in the registration form.
   - The event document mentions "startup stalls and showcases" among event activities, but does not confirm a separate public booking fee of ₹1,299.
2. **"Startup Stalls" in Schedule vs Activity**:
   - The schedule does not specify a separate stall setup / exhibition hour slot, though "Startup stalls and showcases" is listed as an activity.
3. **Pillars Strip in Section 01 About ("BUILD • CONNECT • PITCH • SCALE")**:
   - Marketing pillars (`BUILD`, `CONNECT`, `PITCH`, `SCALE`) with short descriptions. These are marketing copy from the original template rather than facts from the event document.
4. **Hero Marquee Bar ("BUILD • CONNECT • PITCH • SCALE • ")**:
   - Animated brutalist text marquee bar underneath the hero section.
5. **Registration Counter ("X students registered")**:
   - Controlled by `CONFIG.showRegistrationCounter` (currently `false` in config, so hidden).
6. **"Logged to Central Conclave Database" badge in Registration**:
   - Status text displayed after submitting a pass.
7. **"No third-party forms" footer notice**:
   - Text under the registration form: `"Dewan VS Group of Institutions, Meerut · No third-party forms"`.
