import {
  collection,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { RegistrationRecord } from './registrations.ts';

export interface EventSettings {
  registrationCap: number;
  registrationStatus: 'open' | 'closed';
  showCount: boolean;
  status: 'open' | 'closed';
  updatedAt?: any;
}

export interface AdminRegistration extends RegistrationRecord {
  pitchStatus?: 'Applied' | 'Shortlisted' | 'Finalist' | 'Rejected' | string;
  notes?: string;
  checkInTime?: string;
  docId?: string;
}

export interface AdminPartnerEnquiry {
  id: string;
  company: string;
  contactName: string;
  email: string;
  phone?: string;
  message?: string;
  status?: 'New' | 'Contacted' | 'Done' | string;
  notes?: string;
  createdAt: string;
}

const LOCAL_REGISTRATIONS_KEY = 'sc1_registrations_cache';
const LOCAL_PARTNER_KEY = 'sc1_partner_enquiries';

// Initial empty lists — only real registrations and enquiries are stored and displayed
const INITIAL_DEMO_REGISTRATIONS: AdminRegistration[] = [];

const INITIAL_DEMO_PARTNERS: AdminPartnerEnquiry[] = [];

/**
 * Fetch all registrations from Firestore, merging with local cache
 */
export const fetchRegistrations = async (): Promise<AdminRegistration[]> => {
  let list: AdminRegistration[] = [];

  try {
    const q = query(collection(db, 'registrations'));
    const snapshot = await getDocs(q);
    snapshot.forEach((d) => {
      const data = d.data() as AdminRegistration;
      const displayId = data.registrationId || data.id || d.id;
      list.push({ ...data, id: displayId, docId: d.id });
    });
  } catch (error) {
    console.warn('Firestore fetch notice (using cache):', error);
  }

  // Merge with local cache
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const cached: AdminRegistration[] = raw ? JSON.parse(raw) : [];
    
    // Combine and deduplicate by id
    const map = new Map<string, AdminRegistration>();
    INITIAL_DEMO_REGISTRATIONS.forEach((item) => map.set(item.id, item));
    cached.forEach((item) => map.set(item.id, item));
    list.forEach((item) => map.set(item.id, item));

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Save combined list to local cache for persistence
    localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return list.length ? list : INITIAL_DEMO_REGISTRATIONS;
  }
};

/**
 * Fetch all partner enquiries
 */
export const fetchPartnerEnquiries = async (): Promise<AdminPartnerEnquiry[]> => {
  let list: AdminPartnerEnquiry[] = [];

  try {
    const q = query(collection(db, 'partnerEnquiries'));
    const snapshot = await getDocs(q);
    snapshot.forEach((d) => {
      const data = d.data() as AdminPartnerEnquiry;
      list.push({ ...data, id: d.id });
    });
  } catch (error) {
    console.warn('Firestore partner fetch notice (using cache):', error);
  }

  try {
    const raw = localStorage.getItem(LOCAL_PARTNER_KEY);
    const cached: AdminPartnerEnquiry[] = raw ? JSON.parse(raw) : [];

    const map = new Map<string, AdminPartnerEnquiry>();
    INITIAL_DEMO_PARTNERS.forEach((item) => map.set(item.id, item));
    cached.forEach((item) => map.set(item.id, item));
    list.forEach((item) => map.set(item.id, item));

    const merged = Array.from(map.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    localStorage.setItem(LOCAL_PARTNER_KEY, JSON.stringify(merged));
    return merged;
  } catch {
    return list.length ? list : INITIAL_DEMO_PARTNERS;
  }
};

/**
 * Update single registration status and notes
 */
export const updateRegistration = async (
  id: string,
  updates: Partial<AdminRegistration>,
  docId?: string
): Promise<boolean> => {
  let resolvedDocId = docId;

  // Update in local cache
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const list: AdminRegistration[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((item) => item.id === id || item.docId === id);
    if (index !== -1) {
      resolvedDocId = resolvedDocId || list[index].docId;
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Cache update notice:', e);
  }

  // Update in Firestore
  try {
    const target = resolvedDocId || id;
    const ref = doc(db, 'registrations', target);
    await updateDoc(ref, updates);
  } catch (e) {
    console.warn('Firestore update notice:', e);
  }

  return true;
};

/**
 * Bulk update registrations status
 */
export const bulkUpdateStatus = async (
  ids: string[],
  newStatus: string
): Promise<boolean> => {
  for (const id of ids) {
    await updateRegistration(id, { status: newStatus });
  }
  return true;
};

/**
 * Update partner enquiry status and notes
 */
export const updatePartnerEnquiry = async (
  id: string,
  updates: Partial<AdminPartnerEnquiry>
): Promise<boolean> => {
  try {
    const ref = doc(db, 'partnerEnquiries', id);
    await updateDoc(ref, updates);
  } catch (e) {
    console.warn('Firestore partner update notice:', e);
  }

  try {
    const raw = localStorage.getItem(LOCAL_PARTNER_KEY);
    const list: AdminPartnerEnquiry[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(LOCAL_PARTNER_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Cache partner update notice:', e);
  }

  return true;
};

/**
 * Export data array to CSV file
 */
export const exportToCSV = (data: Record<string, any>[], filename: string) => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((header) => {
        const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',')
  );

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Retrieve event settings from Firestore settings/event
 */
export const getEventSettings = async (): Promise<EventSettings> => {
  const defaultSettings: EventSettings = {
    registrationCap: 500,
    registrationStatus: 'open',
    showCount: true,
    status: 'open',
  };

  try {
    const docRef = doc(db, 'settings', 'event');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        registrationCap: typeof data.registrationCap === 'number' ? data.registrationCap : 500,
        registrationStatus: data.registrationStatus === 'closed' || data.status === 'closed' ? 'closed' : 'open',
        showCount: data.showCount !== undefined ? Boolean(data.showCount) : true,
        status: data.status === 'closed' || data.registrationStatus === 'closed' ? 'closed' : 'open',
      };
    }
  } catch (err) {
    console.warn('Notice reading settings/event from Firestore:', err);
  }

  try {
    const raw = localStorage.getItem('sc1_event_settings');
    if (raw) return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {}

  return defaultSettings;
};

/**
 * Save event settings to Firestore settings/event
 */
export const saveEventSettings = async (settings: Partial<EventSettings>): Promise<boolean> => {
  const current = await getEventSettings();
  const cap = typeof settings.registrationCap === 'number' ? settings.registrationCap : current.registrationCap;
  const regStatus = settings.registrationStatus || settings.status || current.registrationStatus;
  const showCount = settings.showCount !== undefined ? settings.showCount : current.showCount;

  const payload: EventSettings = {
    registrationCap: cap,
    registrationStatus: regStatus,
    showCount: showCount,
    status: regStatus,
  };

  try {
    const docRef = doc(db, 'settings', 'event');
    await setDoc(docRef, {
      ...payload,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Notice writing settings/event to Firestore:', err);
  }

  try {
    localStorage.setItem('sc1_event_settings', JSON.stringify(payload));
  } catch {}

  return true;
};
