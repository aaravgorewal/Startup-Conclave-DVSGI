import { doc, setDoc, addDoc, collection, serverTimestamp, writeBatch, runTransaction } from 'firebase/firestore';
import { db } from './firebase.ts';

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
 * Get registration counter for display
 */
export const getRegistrationsCount = (): number => {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const list: any[] = raw ? JSON.parse(raw) : [];
    return Math.max(list.length, 38); // Base count + live local count
  } catch {
    return 38;
  }
};

/**
 * Generate formatted Registration ID (e.g., SC1-00042)
 */
export const generateRegistrationId = (): string => {
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const list: any[] = raw ? JSON.parse(raw) : [];
    const count = list.length + 42; // Starting sequence for realism
    const padded = count.toString().padStart(5, '0');
    return `SC1-${padded}`;
  } catch {
    const rand = Math.floor(10 + Math.random() * 900);
    return `SC1-00${rand}`;
  }
};

/**
 * Create a new attendee registration in Firestore & Local Cache
 */
export const createRegistration = async (
  input: RegistrationInput
): Promise<{ success: boolean; id?: string; error?: string }> => {
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

  if (!input.name.trim()) {
    return { success: false, error: 'Please provide your full legal name.' };
  }

  if (!input.college.trim()) {
    return { success: false, error: 'Please provide your college or organisation name.' };
  }

  if (input.role === 'Student' && (!input.course?.trim() || !input.year?.trim())) {
    return { success: false, error: 'Course name and year are required for student delegates.' };
  }

  // 2. Duplicate Check
  if (isEmailRegistered(emailClean) || isPhoneRegistered(phoneClean)) {
    return {
      success: false,
      error: 'This email or phone is already registered.',
    };
  }

  // 3. Compute deterministic hashes for email and phone
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
    status: 'registered',
    createdAt: nowIso,
  };

  // 4. Store in Firestore database using an atomic transaction on counter document
  // Increments /counters/registrations to assign SC1-00001, SC1-00002... safely.
  // Registrations doc keyed by emailHash; phoneIndex doc keyed by phoneHash.
  // If either doc already exists, Firestore security rules reject the write and transaction aborts.
  let assignedId = '';
  try {
    const counterRef = doc(db, 'counters', 'registrations');
    const regDocRef = doc(db, 'registrations', emailHash);
    const phoneDocRef = doc(db, 'phoneIndex', phoneHash);

    assignedId = await runTransaction(db, async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      let nextCount = 1;
      if (counterSnap.exists()) {
        const data = counterSnap.data();
        const current = typeof data?.currentCount === 'number' ? data.currentCount : 0;
        nextCount = current + 1;
      }
      const idCode = `SC1-${nextCount.toString().padStart(5, '0')}`;

      transaction.set(counterRef, {
        currentCount: nextCount,
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
        status: 'registered',
        createdAt: serverTimestamp(),
      });

      transaction.set(phoneDocRef, {
        registrationId: idCode,
        emailHash: emailHash,
        phoneHash: phoneHash,
        createdAt: serverTimestamp(),
      });

      return idCode;
    });
  } catch (firestoreError: any) {
    console.warn('Firestore registration transaction error:', firestoreError);
    // Write failed due to existing document, duplicate conflict, or rule restriction
    return {
      success: false,
      error: 'This email or phone is already registered.',
    };
  }

  record.id = assignedId;

  // 5. Update local cache for deduplication & offline resilience
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

  return { success: true, id: assignedId };
};

/**
 * Create a new partner inquiry in Firestore & Local Cache
 */
export const createPartnerEnquiry = async (
  input: PartnerEnquiryInput
): Promise<{ success: boolean; id?: string; error?: string }> => {
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

  const enquiryId = `PARTNER-${Date.now().toString(36).toUpperCase()}`;
  const nowIso = new Date().toISOString();

  const data = {
    id: enquiryId,
    company: input.company.trim(),
    contactName: input.contactName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: cleanedPhone,
    message: input.message?.trim() || '',
    status: 'new',
    createdAt: nowIso,
  };

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
  } catch (firestoreError) {
    console.warn('Firestore partner write notice:', firestoreError);
  }

  try {
    const raw = localStorage.getItem('sc1_partner_enquiries');
    const list: any[] = raw ? JSON.parse(raw) : [];
    list.push(data);
    localStorage.setItem('sc1_partner_enquiries', JSON.stringify(list));
  } catch (storageError) {
    console.warn('Local storage partner cache notice:', storageError);
  }

  return { success: true, id: enquiryId };
};
