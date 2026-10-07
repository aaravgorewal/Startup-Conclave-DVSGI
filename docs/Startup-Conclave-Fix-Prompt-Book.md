# Startup Conclave 1.0: Fix Prompt Book (code review ke hisaab se)

Ye book tumhare zip ke review (`Review-Findings.md`) par based hai. Order mein chalao: **Part A (Firebase console, manual) → Part B (AI Studio prompts) → Part C (launch check)**.

**Do routes (ek chuno):**
- **Route 1:** Patched zip (`startup-conclave-1.0-patched.zip`) ko apne project mein lo (AI Studio import / GitHub), phir sirf Part B ke wo prompts chalao jo "baaki" hain (P1 se P8). Logos aur fake-data wale fixes zip mein pehle se hain.
- **Route 2:** Agar AI Studio ka purana project hi chala rahe ho, to **P0** se shuru karo, wo logos aur fake-data fixes bhi laga dega.

Har prompt ke baad: preview + mobile test, phir version save. Console ke steps AI Studio nahi kar sakta, wo tumhe khud karne hain.

---

# PART A: Firebase console (manual, pehle karo)

## A1. Sign-up band karo (sabse zaroori)
Firebase console → Authentication → **Settings → User actions** → **"Enable create (sign-up)"** ko **OFF** karo.
Phir Authentication → **Users** dekho. Jo emails tumhare nahi hain (jaise `admin@dvsiet.ac.in`, `conclave@dvsiet.ac.in` agar tumne nahi banaye), unhe delete karo.

## A2. Admin UID allowlist banao (P1 se pehle)
1. Authentication → Users mein apne admin account ka **User UID** copy karo (har admin ka).
2. Firestore Database → **Start collection** → ID: `admins`.
3. Document ID = us admin ka UID. Field: `role` (string) = `admin`. Har admin ke liye ek document.
(Console se likhne par rules lagu nahi hote, to ye safe hai.)

## A3. API key restrict karo
Google Cloud console → APIs & Services → Credentials → apni Browser key → **Application restrictions: Websites** → add karo: tumhari Netlify URL, final domain, `localhost`. Save.

## A4. App Check chalu karo
1. Google reCAPTCHA admin console mein **reCAPTCHA v3** site banao (domains: Netlify URL + final domain + localhost). Site key copy karo.
2. Firebase console → App Check → apna web app **Register** → reCAPTCHA v3 provider → secret key daalo.
3. **Netlify** → Site settings → Environment variables → `VITE_RECAPTCHA_SITE_KEY` = site key. Redeploy.
4. App Check → Firestore → pehle **Monitor** mode mein kuch din dekho, phir **Enforce**.

## A5. Demo data saaf karo
Firestore se purane test records delete karo: `registrations`, `phoneIndex`, `partnerEnquiries`, aur `counters/registrations` ko **delete** karo agar real registrations shuru nahi hui (taaki ID SC1-00001 se start ho). `mail` collection ke docs bhi delete karo.

---

# PART B: AI Studio prompts

## P0 (sirf Route 2): Logos + fake data cleanup

```
Make these changes and list every file you touched.

1) LOGOS. Files are in src/assets: dewan-vs-group.png, diif.jpeg, iic.webp,
msme.jpeg, startinup.jpeg. In src/config.ts add two arrays of {name, logo, url?,
confirmed}: organisers = Dewan VS Group of Institutions, Dewan Innovation &
Incubation Forum, Institution's Innovation Council (all confirmed:true);
supporters = Ministry of MSME and StartInUP (both confirmed:false).
- Add a slim "ORGANISED BY" strip directly below the hero and above the black
  marquee: logos in equal-height white tiles with 2px #111111 border and hard
  offset shadow, wrapping on mobile.
- In the Partners section add a "SUPPORTED BY" block that renders ONLY if at
  least one supporter has confirmed:true.
- In the footer add a compact "Organised by" row (40px tiles).
- Nothing in the header. No wording like "in association with" for
  unconfirmed supporters. Hide a tile if its image fails to load.

2) FAKE DATA. Remove every hardcoded contact fallback ('conclave@dvsiet.ac.in',
'+91 98765 43210'): contact details must come only from CONFIG and be hidden
when empty (success screen, confirmation pass canvas, privacy modal,
confirmation email). Remove the fake "Math.max(list.length, 38)" counter and
the unused generateRegistrationId. The public counter must read the real
counters/registrations document and stay hidden unless settings.showCount is
true (default false). Remove "offers" (price 0 / InStock) from the JSON-LD,
because the fee is not announced. HTML-escape name and college in the
confirmation email.

3) ADMIN DATA. In the admin service, when Firestore returns successfully, use
ONLY the Firestore list (do not merge the browser localStorage cache); use the
cache only when Firestore fails. Apply to registrations and partner enquiries.

4) NETLIFY. Add public/_redirects with "/*    /index.html   200" and
public/robots.txt disallowing /admin.
```

## P1: Admin auth ko UID allowlist par shift karo (Critical)

Pehle **A2** karo, warna tum khud lock out ho jaoge.

```
Harden admin authorisation:
1) In firestore.rules replace isAdmin() with a check on an admins collection:
   function isAdmin() {
     return request.auth != null
       && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
   }
   Add: match /admins/{uid} { allow read: if request.auth != null &&
   request.auth.uid == uid; allow write: if false; }
   Remove the hardcoded email list from the rules.
2) In the admin page, after signInWithEmailAndPassword and in
   onAuthStateChanged, confirm admin access by reading admins/{uid}. If the
   document does not exist, signOut immediately and show "Access denied".
3) Delete ADMIN_EMAILS from src/config.ts and every usage. Keep the client
   check for UI only; the rules are the real protection.
4) Keep: generic "Invalid credentials" message, 5-attempt/60s lockout, noindex,
   no sign-up UI, and no visible admin email list anywhere.
Show me the final rules and tell me exactly which Firebase console steps are
still manual.
```

## P2: Public `mail` collection band karo (Critical)

```
Close the email relay hole. In firestore.rules change the /mail/{mailId} rule
to: allow create: if false; allow read, update, delete: if isAdmin();
Remove isValidMail() because it is no longer used.
In src/services/registrations.ts remove the client-side write to the "mail"
collection entirely. Keep the success screen features: Copy ID, Download
confirmation image, and the line "Take a screenshot of your Registration ID".
Do not break the registration flow if email is unavailable.
```

**Baad mein (Blaze plan ho to):** confirmation email Cloud Function se bhejo:

```
Implement a Firebase Cloud Function (2nd gen) onDocumentCreated for
registrations/{id} that queues ONE confirmation email using a fixed server-side
template (registration ID, event name, venue "DVSIET, Meerut", the line "Date
and entry details will be shared by email and WhatsApp.", organiser contact
from a config document only if non-empty). The recipient must be the email
stored in that registration document. HTML-escape all dynamic values. The
client must never write to the mail collection. Give me deployment steps.
```

## P3: Counter abuse roka (Critical)

```
Counter abuse hardening. Currently anyone can increment counters/registrations
directly. Change firestore.rules so a counter update is allowed only if the SAME
batch/transaction also creates a new registration document:
- Add a field lastEmailHash to the counter document (string, max 128).
- Allow update only if isValidCounter AND
  !exists(registrations/$(incoming.lastEmailHash)) AND
  existsAfter(registrations/$(incoming.lastEmailHash)) AND
  getAfter(registrations/$(incoming.lastEmailHash)).data.sequenceNumber ==
  incoming.currentCount.
- Update runTransaction in registrations.ts to write lastEmailHash.
- Registration status must equal "waitlist" only if sequenceNumber >
  registrationCap, otherwise "registered": enforce this in the rules by
  reading settings/event with get().
Explain each rule line, and give me test cases to run in the Firebase Rules
Playground (normal registration, bump counter only, duplicate email, over-cap).
Also confirm that App Check initialises when VITE_RECAPTCHA_SITE_KEY is set.
```

Test case **zaroor** Rules Playground mein chalao, kyunki rules ki galti se saari registration band ho sakti hai.

## P4: Sahi error messages

```
Fix error handling in createRegistration and createPartnerEnquiry:
- Do not map every Firestore error to "This email or phone is already
  registered".
- unavailable / deadline-exceeded / network errors → "Could not submit. Check
  your internet and try again." with a Retry button.
- permission-denied → "This email or phone may already be registered. If you
  are sure you have not registered, contact the organisers." (public users
  cannot read registrations, so a duplicate cannot be told apart from a rules
  denial).
- failed-precondition is NOT a network error: show "Something went wrong. Please
  try again in a minute."
- Anything else → generic message and console.error (no personal data in logs).
- Keep the form values on every error and disable the submit button while
  submitting.
```

## P5: Admin UI sach dikhaye

```
In the admin page, check the boolean returned by updateRegistration,
updatePartnerEnquiry, bulkUpdateStatus and delete functions. If a write fails,
show an error toast "Could not save. Check your connection or permissions" and
roll back the optimistic UI change. Show a success toast only after Firestore
confirms. For bulk actions report "X of Y updated".
```

## P6: Pitch ke extra fields form mein lao

```
The registration form state already has pitchSector, pitchStage, pitchDeckLink
and pitchTeamSize but no inputs, and they are not sent on submit. When "I also
want to pitch my startup" is ticked, show these optional fields in the existing
neo-brutalist style: Sector (dropdown: AgriTech, FinTech, EdTech, HealthTech,
AI/ML, SaaS, E-commerce, Social Impact, Other), Stage (Idea / Prototype /
Launched / Revenue), Pitch deck link (Google Drive or Canva URL, validated with
isValidPitchDeckUrl), Team size (1 to 10 dropdown). Pass them in inputData
to createRegistration, include them in the success summary, and show them in
the admin Pitch Applicants cards and CSV export. Keep the firestore.rules
field limits unchanged.
```

## P7: Contact, social, OG, favicon

```
In src/config.ts I will fill contactEmail, contactPhone, instagramUrl,
linkedinUrl, xUrl. Make sure every place that shows them hides itself when
empty. Add to index.html: favicon (use src/assets or public/favicon.svg with the
orange rotated square from the header logo), og:image (public/og.jpg,
1200x630) with og:url, og:site_name, theme-color #FF6B1A, canonical link, and
twitter:image. Generate a simple neo-brutalist public/og.svg fallback card
with "STARTUP CONCLAVE 1.0 · DVSIET, Meerut · Where Ideas Meet Capital."
(no date, no speakers, no claims).
```
**Manual:** WhatsApp preview ke liye `og.jpg` (1200×630 JPG/PNG) khud export karke `public/` mein daalo.

## P8: Privacy text aur retention (college se approve karwao)

```
Review the Privacy Notice modal. Remove specific commitments I have not
confirmed (for example "purged within 90 days" and "Response within 48 hours")
and replace them with "Retention period will be confirmed by the organisers."
Keep: what data is collected, why, who can see it, and the contact email
(hidden if empty). Keep the "Draft: review with the college before launch"
label until I remove it.
```

---

# PART C: Launch check

## Final QA prompt
```
Run a final QA pass and report pass/fail with evidence for each:
1) No hardcoded emails/phones/names/claims anywhere (search the code).
2) Registration: success, same email twice, same phone twice, invalid phone,
   offline, closed, waitlist.
3) /admin: wrong password, non-admin account → Access denied, admin account
   works, no sign-up UI, logout.
4) Rules: public can only create registrations and partnerEnquiries; cannot
   read, update, delete or write to mail/admins/settings.
5) Logos: organisers visible; supporters hidden while confirmed:false.
6) Console has no errors on / and /admin.
7) 360px and 1440px layouts have no horizontal scroll.
8) Direct open of /admin and /privacy works (Netlify redirects).
Fix everything that fails.
```

## Manual checklist (launch se pehle)
- [ ] A1 sign-up OFF, anjaan users delete
- [ ] A2 `admins` collection + P1
- [ ] P2 mail rule band
- [ ] A3 API key restrict, A4 App Check (Monitor → Enforce)
- [ ] A5 demo/test data delete
- [ ] `config.ts` mein real contact email, phone, social links
- [ ] MSME/StartInUP: written permission mile bina `confirmed:true` mat karo (MSME logo mein Ashoka Emblem hai)
- [ ] Privacy text college se approve
- [ ] Netlify env: `VITE_RECAPTCHA_SITE_KEY`, redeploy
- [ ] Live site pe 1 test registration, admin mein check, phir delete

## Fix prompts (jab kuch toote)
```
[FEATURE] broke after the last change: [describe]. Find the root cause and fix
only that, without touching unrelated code. Explain in two sentences.
```
```
Console/build error: [paste]. Fix the cause, not by hiding the error.
```
```
Rules change locked me out of [admin/registration]. Show the exact rule that
denies it and the smallest safe fix.
```

## Order at a glance
**A1 → A2 → P1 → P2 → A3 → A4 → P3 → A5 → P4 → P5 → P6 → P7 → P8 → Final QA**
(Route 2 mein sabse pehle P0.)
