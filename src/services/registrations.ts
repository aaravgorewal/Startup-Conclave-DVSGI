import { doc, setDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
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
  if (isEmailRegistered(emailClean)) {
    return {
      success: false,
      error: 'This email address is already registered for Startup Conclave 1.0.',
    };
  }

  if (isPhoneRegistered(phoneClean)) {
    return {
      success: false,
      error: 'This WhatsApp / phone number is already registered for Startup Conclave 1.0.',
    };
  }

  // 3. Generate ID and Record
  const registrationId = generateRegistrationId();
  const nowIso = new Date().toISOString();

  const record: RegistrationRecord = {
    id: registrationId,
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

  // 4. Store in Firestore database
  try {
    const docRef = doc(db, 'registrations', registrationId);
    await setDoc(docRef, {
      ...record,
      serverTimestamp: serverTimestamp(),
    });
  } catch (firestoreError: any) {
    console.warn('Firestore write notice:', firestoreError);
    // Even if client is offline or network fails, we gracefully continue with local storage
  }

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

  return { success: true, id: registrationId };
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

  const enquiryId = `PARTNER-${Date.now().toString(36).toUpperCase()}`;
  const nowIso = new Date().toISOString();

  const data = {
    id: enquiryId,
    company: input.company.trim(),
    contactName: input.contactName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || '',
    message: input.message?.trim() || '',
    status: 'new',
    createdAt: nowIso,
  };

  try {
    const docRef = doc(db, 'partnerEnquiries', enquiryId);
    await setDoc(docRef, {
      ...data,
      serverTimestamp: serverTimestamp(),
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
