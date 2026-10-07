# Startup Conclave 1.0: project rules for the coding agent

## What this is
Single-page marketing + registration site for a 2-day startup conclave at DVSIET, Meerut. React + TypeScript + Vite + Tailwind v4. Backend is Firebase (Firestore + Auth) in the cloud. Hosted on Netlify. Owner is a student developer; keep changes small and explain them simply.

## Commands
- Install: `npm install`
- Dev server: `npm run dev` (http://localhost:3000)
- Type-check: `npm run lint` (tsc --noEmit)
- Build: `npm run build` (output in dist/)
Always run lint + build after code changes and report the result.

## Layout
- `src/config.ts`: ALL editable content (event text, FAQ, schedule, contacts, logos)
- `src/components/single-page/SinglePage.tsx`: the whole public page
- `src/pages/AdminPage.tsx`: hidden /admin console (Firebase Auth)
- `src/services/`: `firebase.ts`, `registrations.ts`, `admin.ts`, `botProtection.ts`
- `firestore.rules`: security rules (the real protection)
- `public/_redirects`, `public/robots.txt`: Netlify SPA + robots

## HARD CONTENT RULES (never break)
- Never invent names, photos, logos, stats, dates, fees, prizes, speakers, investors, sponsors, jury, phone numbers or emails. Unconfirmed things show "Coming soon" / "To be announced".
- Event date, fee, speakers and sponsors are NOT confirmed.
- MSME and StartInUP logos stay `confirmed:false` until the owner says written permission exists. The MSME logo contains the State Emblem of India.
- Contact email/phone come only from CONFIG and are hidden when empty.

## SECURITY RULES (never break)
- Public users may only CREATE registrations and partnerEnquiries. They must never read, update or delete anything.
- Admin authorisation is enforced in firestore.rules, not only in the client.
- No secrets in the repo. Local secrets go in `.env.local` (gitignored). `firebase-applet-config.json` holds public web config only.
- The mail collection must not be writable by the public.
- Do not add sign-up UI anywhere. Admin accounts are created manually in the console.

## SAFETY RULES FOR YOU
- DO NOT run: `git push`, `firebase deploy`, `netlify deploy`, `rm -rf` outside this repo, or any command that changes cloud data. Print the command for me to run instead.
- Ask before installing a new dependency, and say why it is needed.
- Make one logical change at a time. After each task: list files changed, run lint + build, and propose a git commit message. I commit myself.
- If a task needs a Firebase console action, list the exact clicks and stop.
- Use cross-platform commands (this may run on macOS or Windows).

## Style
- Neo-brutalist look: bg `#FFF8EC`, ink `#111111`, primary `#FF6B1A`, highlight `#FFD400`, 2px borders, hard offset shadows, no gradients. Do not introduce new colours.
- Fonts: Bricolage Grotesque / Space Grotesk (headings), Inter (body), JetBrains Mono (labels).
- Mobile first (360px), WCAG AA contrast, tap targets >= 44px.
- Explain code in short, plain language. Prefer small readable functions.

## Definition of done
lint passes, build passes, no console errors on `/` and `/admin`, no invented content, security invariants above still true, summary + commit message provided.
