import { doc, getDoc, setDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { db } from './firebase.ts';
import { CONFIG } from '../config.ts';

export interface RegistrationInput {
  name: string;
  email: string;
  phone: string;
  college: string;
  course?: string;
  year?: string;
  role: 'Student' | 'Founder' | 'Professional' | 'Other' | string;
  city?: string;
  wantsToPitch: boolean;
  startupName?: string;
  startupPitch?: string;
  sector?: string;
  stage?: 'Idea' | 'Prototype' | 'Launched' | 'Revenue' | string;
  pitchDeckLink?: string;
  teamSize?: string | number;
}

export interface RegistrationRecord {
  id: string;
  registrationId?: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  year: string;
  role: string;
  city: string;
  wantsToPitch: boolean;
  startupName: string;
  startupPitch: string;
  sector?: string;
  stage?: string;
  pitchDeckLink?: string;
  teamSize?: string;
  status: string;
  createdAt: string;
}

export interface PartnerEnquiryInput {
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  message?: string;
}

// Local cache keys for instant client deduplication and offline fallback
const LOCAL_REGISTRATIONS_KEY = 'sc1_registrations_cache';
const LOCAL_REGISTERED_EMAILS_KEY = 'sc1_registered_emails';
const LOCAL_REGISTERED_PHONES_KEY = 'sc1_registered_phones';

/**
 * Deterministic SHA-256 hash helper (produces 64-char lowercase hex string)
 */
export const hashString = async (input: string): Promise<string> => {
  const normalized = input.trim().toLowerCase();
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(normalized);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Deterministic fallback if crypto.subtle is unavailable
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(16, '0');
};

/**
 * Clean phone number to 10 digits
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/\D/g, '').slice(-10);
};

/**
 * Validate 10-digit Indian phone number
 * Indian mobile numbers start with 6, 7, 8, or 9 and are exactly 10 digits.
 */
export const isValidIndianPhone = (phone: string): boolean => {
  const digits = cleanPhoneNumber(phone);
  return /^[6-9]\d{9}$/.test(digits);
};

/**
 * Validate email address
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase());
};

/**
 * Validate pitch deck URL: Must be Google Drive or Canva URL if provided
 */
export const isValidPitchDeckUrl = (url?: string): boolean => {
  if (!url || !url.trim()) return true;
  try {
    const raw = url.trim();
    const formatted = raw.startsWith('http://') || raw.startsWith('https://') ? raw : `https://${raw}`;
    const parsed = new URL(formatted);
    const host = parsed.hostname.toLowerCase();
    const isDrive =
      host === 'drive.google.com' ||
      host === 'docs.google.com' ||
      host.endsWith('.drive.google.com') ||
      host.endsWith('.docs.google.com');
    const isCanva = host === 'canva.com' || host.endsWith('.canva.com');
    return isDrive || isCanva;
  } catch {
    return false;
  }
};

/**
 * Check if email is already registered locally
 */
export const isEmailRegistered = (email: string): boolean => {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTERED_EMAILS_KEY);
    const emails: string[] = raw ? JSON.parse(raw) : [];
    return emails.includes(email.trim().toLowerCase());
  } catch {
    return false;
  }
};

/**
 * Check if phone is already registered locally
 */
export const isPhoneRegistered = (phone: string): boolean => {
  try {
    const digits = cleanPhoneNumber(phone);
    const raw = localStorage.getItem(LOCAL_REGISTERED_PHONES_KEY);
    const phones: string[] = raw ? JSON.parse(raw) : [];
    return phones.includes(digits);
  } catch {
    return false;
  }
};

/**
 * Real public registration count (counters/registrations is publicly readable).
 * Returns 0 when nothing is registered yet or the read fails. Never inflated.
 */
export const fetchPublicRegistrationCount = async (): Promise<number> => {
  try {
    const snap = await getDoc(doc(db, 'counters', 'registrations'));
    if (!snap.exists()) return 0;
    const n = snap.data()?.currentCount;
    return typeof n === 'number' && n > 0 ? n : 0;
  } catch {
    return 0;
  }
};

/**
 * Create a new attendee registration in Firestore & Local Cache
 * Honest flow: success screen ONLY after Firestore confirms the transaction.
 */
export const createRegistration = async (
  input: RegistrationInput
): Promise<{ success: boolean; id?: string; status?: 'registered' | 'waitlist'; error?: string; isNetworkError?: boolean }> => {
  const emailClean = input.email.trim().toLowerCase();
  const phoneClean = cleanPhoneNumber(input.phone);

  // 1. Validation
  if (!isValidEmail(emailClean)) {
    return { success: false, error: 'Please provide a valid email address.' };
  }

  if (!isValidIndianPhone(phoneClean)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).',
    };
  }

  // Pitch deck link validation
  if (input.wantsToPitch && input.pitchDeckLink && !isValidPitchDeckUrl(input.pitchDeckLink)) {
    return {
      success: false,
      error: 'Pitch deck link must be a Google Drive (drive.google.com) or Canva (canva.com) URL.',
    };
  }

  if (!input.name.trim()) {
    return { success: false, error: 'Please provide your full legal name.' };
  }

  if (!input.college.trim()) {
    return { success: false, error: 'Please provide your college or organisation name.' };
  }

  if (input.role === 'Student' && (!input.course?.trim() || !input.year?.trim())) {
    return { success: false, error: 'Course name and year are required for student delegates.' };
  }

  // 2. Client-side internet connectivity check
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      success: false,
      isNetworkError: true,
      error: 'Could not submit. Check your internet and try again.',
    };
  }

  // 3. Local quick-duplicate check
  if (isEmailRegistered(emailClean) || isPhoneRegistered(phoneClean)) {
    return {
      success: false,
      isNetworkError: false,
      error: 'This email or phone may already be registered. If you are sure you have not registered, contact the organisers.',
    };
  }

  // 4. Compute deterministic hashes for email and phone
  const emailHash = await hashString(emailClean);
  const phoneHash = await hashString(phoneClean);
  const nowIso = new Date().toISOString();

  const record: RegistrationRecord = {
    id: emailHash,
    name: input.name.trim(),
    email: emailClean,
    phone: phoneClean,
    college: input.college.trim(),
    course: input.course?.trim() || '',
    year: input.year?.trim() || '',
    role: input.role,
    city: input.city?.trim() || 'Meerut',
    wantsToPitch: Boolean(input.wantsToPitch),
    startupName: input.wantsToPitch ? (input.startupName?.trim() || '') : '',
    startupPitch: input.wantsToPitch ? (input.startupPitch?.trim() || '') : '',
    sector: input.wantsToPitch ? (input.sector?.trim() || '') : '',
    stage: input.wantsToPitch ? (input.stage?.trim() || '') : '',
    pitchDeckLink: input.wantsToPitch ? (input.pitchDeckLink?.trim() || '') : '',
    teamSize: input.wantsToPitch ? (input.teamSize ? String(input.teamSize).trim() : '') : '',
    status: 'registered',
    createdAt: nowIso,
  };

  // 5. Store in Firestore database using an atomic transaction on counter document.
  // The success screen is ONLY shown after Firestore confirms the transaction.
  let assignedId = '';
  let finalStatus: 'registered' | 'waitlist' = 'registered';

  try {
    const counterRef = doc(db, 'counters', 'registrations');
    const regDocRef = doc(db, 'registrations', emailHash);
    const phoneDocRef = doc(db, 'phoneIndex', phoneHash);
    const settingsRef = doc(db, 'settings', 'event');

    const result = await runTransaction(db, async (transaction) => {
      // 5a. Read atomic counter
      const counterSnap = await transaction.get(counterRef);
      let nextCount = 1;
      if (counterSnap.exists()) {
        const data = counterSnap.data();
        const current = typeof data?.currentCount === 'number' ? data.currentCount : 0;
        nextCount = current + 1;
      }
      const idCode = `SC1-${nextCount.toString().padStart(5, '0')}`;

      // 5b. Read settings/event for registration capacity cap (default 500)
      const settingsSnap = await transaction.get(settingsRef);
      let registrationCap = 500;
      if (settingsSnap.exists()) {
        const sData = settingsSnap.data();
        if (typeof sData?.registrationCap === 'number') {
          registrationCap = sData.registrationCap;
        }
      }

      // 5c. When registration count reaches the cap, assign status "waitlist"
      const assignedStatus: 'registered' | 'waitlist' =
        nextCount > registrationCap ? 'waitlist' : 'registered';

      transaction.set(counterRef, {
        currentCount: nextCount,
        lastEmailHash: emailHash,
        updatedAt: serverTimestamp(),
      });

      transaction.set(regDocRef, {
        id: idCode,
        registrationId: idCode,
        sequenceNumber: nextCount,
        emailHash: emailHash,
        name: record.name,
        email: record.email,
        phone: record.phone,
        college: record.college,
        course: record.course,
        year: record.year,
        role: record.role,
        city: record.city,
        wantsToPitch: record.wantsToPitch,
        startupName: record.startupName,
        startupPitch: record.startupPitch,
        sector: record.sector || '',
        stage: record.stage || '',
        pitchDeckLink: record.pitchDeckLink || '',
        teamSize: record.teamSize || '',
        status: assignedStatus,
        createdAt: serverTimestamp(),
      });

      transaction.set(phoneDocRef, {
        registrationId: idCode,
        emailHash: emailHash,
        phoneHash: phoneHash,
        createdAt: serverTimestamp(),
      });

      return { idCode, status: assignedStatus };
    });

    assignedId = result.idCode;
    finalStatus = result.status;
  } catch (firestoreError: any) {
    const code = firestoreError?.code || '';
    const msg = (firestoreError?.message || '').toLowerCase();

    // Check for network errors (failed-precondition is NOT a network error per P4)
    const isNetwork =
      (typeof navigator !== 'undefined' && navigator.onLine === false) ||
      code === 'unavailable' ||
      code === 'deadline-exceeded' ||
      code === 'network-request-failed' ||
      msg.includes('offline') ||
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('transport') ||
      msg.includes('could not reach') ||
      msg.includes('client is offline');

    if (isNetwork) {
      return {
        success: false,
        isNetworkError: true,
        error: 'Could not submit. Check your internet and try again.',
      };
    }

    if (code === 'permission-denied') {
      return {
        success: false,
        isNetworkError: false,
        error:
          'This email or phone may already be registered. If you are sure you have not registered, contact the organisers.',
      };
    }

    if (code === 'failed-precondition') {
      return {
        success: false,
        isNetworkError: false,
        error: 'Something went wrong. Please try again in a minute.',
      };
    }

    // Anything else → generic message and console.error (no personal data in logs)
    console.error('Registration failed with error code:', code);
    return {
      success: false,
      isNetworkError: false,
      error: 'Something went wrong. Please try again in a minute.',
    };
  }

  record.id = assignedId;
  record.status = finalStatus;

  // 6. Security (P2): Direct client writes to /mail are disabled in firestore.rules.
  // Confirmation emails are dispatched server-side via Cloud Functions on document creation.
  // Registration succeeds immediately and safely even when email services are unavailable.

  // 7. Update local cache ONLY after verified successful Firestore confirmation
  try {
    const rawList = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const list: any[] = rawList ? JSON.parse(rawList) : [];
    list.push(record);
    localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));

    const rawEmails = localStorage.getItem(LOCAL_REGISTERED_EMAILS_KEY);
    const emails: string[] = rawEmails ? JSON.parse(rawEmails) : [];
    emails.push(emailClean);
    localStorage.setItem(LOCAL_REGISTERED_EMAILS_KEY, JSON.stringify(emails));

    const rawPhones = localStorage.getItem(LOCAL_REGISTERED_PHONES_KEY);
    const phones: string[] = rawPhones ? JSON.parse(rawPhones) : [];
    phones.push(phoneClean);
    localStorage.setItem(LOCAL_REGISTERED_PHONES_KEY, JSON.stringify(phones));
  } catch (storageError) {
    console.warn('Local storage cache write notice:', storageError);
  }

  return { success: true, id: assignedId, status: finalStatus };
};

/**
 * Create a new partner inquiry in Firestore & Local Cache
 * Honest flow: success ONLY after Firestore confirms the write.
 */
export const createPartnerEnquiry = async (
  input: PartnerEnquiryInput
): Promise<{ success: boolean; id?: string; error?: string; isNetworkError?: boolean }> => {
  if (!input.company.trim() || !input.contactName.trim() || !input.email.trim()) {
    return { success: false, error: 'Please fill in company, contact name, and email.' };
  }

  const cleanedPhone = input.phone?.trim() ? cleanPhoneNumber(input.phone) : '';
  if (cleanedPhone && !/^[0-9]{10}$/.test(cleanedPhone)) {
    return {
      success: false,
      error: 'Please enter a valid 10-digit phone number or leave it blank.',
    };
  }

  // Network check
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return {
      success: false,
      isNetworkError: true,
      error: 'Could not submit. Check your internet and try again.',
    };
  }

  const enquiryId = `PARTNER-${Date.now().toString(36).toUpperCase()}`;
  const nowIso = new Date().toISOString();

  try {
    const docRef = doc(db, 'partnerEnquiries', enquiryId);
    await setDoc(docRef, {
      id: enquiryId,
      company: input.company.trim(),
      contactName: input.contactName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: cleanedPhone,
      message: (input.message || '').trim().slice(0, 500),
      status: 'new',
      createdAt: serverTimestamp(),
    });
  } catch (firestoreError: any) {
    const code = firestoreError?.code || '';
    const msg = (firestoreError?.message || '').toLowerCase();
    const isNetwork =
      (typeof navigator !== 'undefined' && navigator.onLine === false) ||
      code === 'unavailable' ||
      code === 'deadline-exceeded' ||
      code === 'network-request-failed' ||
      msg.includes('offline') ||
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('transport') ||
      msg.includes('could not reach') ||
      msg.includes('client is offline');

    if (isNetwork) {
      return {
        success: false,
        isNetworkError: true,
        error: 'Could not submit. Check your internet and try again.',
      };
    }

    if (code === 'failed-precondition') {
      return {
        success: false,
        isNetworkError: false,
        error: 'Something went wrong. Please try again in a minute.',
      };
    }

    if (code === 'permission-denied') {
      return {
        success: false,
        isNetworkError: false,
        error: 'Submission not allowed. Please contact the organisers directly.',
      };
    }

    console.error('Partner enquiry submission failed with error code:', code);
    return {
      success: false,
      isNetworkError: false,
      error: 'Something went wrong. Please try again in a minute.',
    };
  }

  // Save to local cache ONLY after verified successful Firestore write
  try {
    const raw = localStorage.getItem('sc1_partner_enquiries');
    const list: any[] = raw ? JSON.parse(raw) : [];
    list.push({
      id: enquiryId,
      company: input.company.trim(),
      contactName: input.contactName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: cleanedPhone,
      message: input.message?.trim() || '',
      status: 'new',
      createdAt: nowIso,
    });
    localStorage.setItem('sc1_partner_enquiries', JSON.stringify(list));
  } catch (storageError) {
    console.warn('Local storage partner cache notice:', storageError);
  }

  return { success: true, id: enquiryId };
};
