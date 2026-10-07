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

export interface PitchCriteriaScores {
  problem?: number;        // weight: 10%
  solution?: number;       // weight: 15%
  market?: number;         // weight: 15%
  businessModel?: number;  // weight: 15%
  traction?: number;       // weight: 15%
  innovation?: number;     // weight: 10%
  team?: number;           // weight: 10%
  scalability?: number;    // weight: 10%
}

/**
 * Calculates weighted score out of 100 using criteria weights: 10/15/15/15/15/10/10/10
 */
export const calculateWeightedPitchScore = (scores?: PitchCriteriaScores): number => {
  if (!scores) return 0;
  const p = Number(scores.problem) || 0;
  const s = Number(scores.solution) || 0;
  const m = Number(scores.market) || 0;
  const bm = Number(scores.businessModel) || 0;
  const tr = Number(scores.traction) || 0;
  const inn = Number(scores.innovation) || 0;
  const tm = Number(scores.team) || 0;
  const sc = Number(scores.scalability) || 0;

  const total = (p * 10 + s * 15 + m * 15 + bm * 15 + tr * 15 + inn * 10 + tm * 10 + sc * 10) / 10;
  return Math.round(total * 10) / 10;
};

export interface AdminRegistration extends RegistrationRecord {
  pitchStatus?: 'Applied' | 'Shortlisted' | 'Finalist' | 'Rejected' | string;
  pitchScores?: PitchCriteriaScores;
  pitchTotalScore?: number;
  notes?: string;
  checkInTime?: string;
  docId?: string;
  updatedBy?: string;
  updatedAt?: string;
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
<<<<<<< HEAD
=======
  let fetched = false;
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)

  try {
    const q = query(collection(db, 'registrations'));
    const snapshot = await getDocs(q);
    snapshot.forEach((d) => {
      const data = d.data() as AdminRegistration;
      const displayId = data.registrationId || data.id || d.id;
      list.push({ ...data, id: displayId, docId: d.id });
    });
<<<<<<< HEAD
=======
    fetched = true;
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
  } catch (error) {
    console.warn('Firestore fetch notice (using cache):', error);
  }

<<<<<<< HEAD
  // Merge with local cache
=======
  // Firestore is the source of truth. Merging the browser cache here resurrected
  // records already deleted in the console (and polluted counts and CSV exports).
  if (fetched) {
    const fresh = list.sort(
      (a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
    );
    try { localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(fresh)); } catch {}
    return fresh;
  }

  // Offline fallback only
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
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
<<<<<<< HEAD
=======
  let fetched = false;
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)

  try {
    const q = query(collection(db, 'partnerEnquiries'));
    const snapshot = await getDocs(q);
    snapshot.forEach((d) => {
      const data = d.data() as AdminPartnerEnquiry;
      list.push({ ...data, id: d.id });
    });
<<<<<<< HEAD
=======
    fetched = true;
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
  } catch (error) {
    console.warn('Firestore partner fetch notice (using cache):', error);
  }

<<<<<<< HEAD
=======
  if (fetched) {
    const fresh = list.sort(
      (a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
    );
    try { localStorage.setItem(LOCAL_PARTNER_KEY, JSON.stringify(fresh)); } catch {}
    return fresh;
  }

>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
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
<<<<<<< HEAD
=======
    return false;
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
  }

  return true;
};

/**
 * Bulk update registrations status with audit trail
 */
export const bulkUpdateStatus = async (
  ids: string[],
  newStatus: string,
  updatedBy?: string
): Promise<boolean> => {
  const timestamp = new Date().toISOString();
  for (const id of ids) {
    await updateRegistration(id, {
      status: newStatus,
      updatedBy: updatedBy || 'admin',
      updatedAt: timestamp,
    });
  }
  return true;
};

/**
 * Delete a registration from Firestore and local cache
 */
export const deleteRegistration = async (id: string, docId?: string): Promise<boolean> => {
  let resolvedDocId = docId;

  // Remove from local cache
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const list: AdminRegistration[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((item) => item.id === id || item.docId === id);
    if (index !== -1) {
      resolvedDocId = resolvedDocId || list[index].docId;
      list.splice(index, 1);
      localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Cache delete notice:', e);
  }

  // Remove from Firestore
  try {
    const target = resolvedDocId || id;
    const ref = doc(db, 'registrations', target);
    await deleteDoc(ref);
  } catch (e) {
    console.warn('Firestore delete notice:', e);
  }

  return true;
};

/**
 * Delete a partner enquiry from Firestore and local cache
 */
export const deletePartnerEnquiry = async (id: string): Promise<boolean> => {
  try {
    const ref = doc(db, 'partnerEnquiries', id);
    await deleteDoc(ref);
  } catch (e) {
    console.warn('Firestore partner delete notice:', e);
  }

  try {
    const raw = localStorage.getItem(LOCAL_PARTNER_KEY);
    const list: AdminPartnerEnquiry[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_PARTNER_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Cache partner delete notice:', e);
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
<<<<<<< HEAD
=======
    return false;
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
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
<<<<<<< HEAD
    showCount: true,
=======
    showCount: false,
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
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
<<<<<<< HEAD
        showCount: data.showCount !== undefined ? Boolean(data.showCount) : true,
=======
        showCount: data.showCount === true,
>>>>>>> c89faf2 (feat: initialize Startup Conclave 1.0 application with configuration, admin services, and components)
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
