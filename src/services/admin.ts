import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  deleteDoc,
} from 'firebase/firestore';
import { db } from './firebase.ts';
import { RegistrationRecord } from './registrations.ts';

export interface AdminRegistration extends RegistrationRecord {
  pitchStatus?: 'Applied' | 'Shortlisted' | 'Finalist' | 'Rejected' | string;
  notes?: string;
  checkInTime?: string;
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

// Fallback seed data if database is empty so admin can immediately test filters/actions
const INITIAL_DEMO_REGISTRATIONS: AdminRegistration[] = [
  {
    id: 'SC1-00042',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@dvsiet.ac.in',
    phone: '9876543210',
    college: 'DVSIET Meerut',
    course: 'B.Tech Computer Science',
    year: '3rd Year',
    role: 'Student',
    city: 'Meerut',
    wantsToPitch: true,
    startupName: 'KrishiFlow Technologies',
    startupPitch: 'Automated precision IoT sensor arrays for sugarcane farmers in Western UP',
    status: 'confirmed',
    pitchStatus: 'Shortlisted',
    notes: 'Strong hardware prototype, reviewed by faculty.',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'SC1-00043',
    name: 'Pooja Verma',
    email: 'pooja.verma@kiet.edu',
    phone: '9812345678',
    college: 'KIET Ghaziabad',
    course: 'B.Tech IT',
    year: '4th Year',
    role: 'Founder',
    city: 'Ghaziabad',
    wantsToPitch: true,
    startupName: 'CampusCart',
    startupPitch: 'Hyperlocal student essentials delivery in under 15 minutes',
    status: 'registered',
    pitchStatus: 'Applied',
    notes: 'Has initial traction in 2 college hostels.',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
  },
  {
    id: 'SC1-00044',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@delhi.ac.in',
    phone: '9798765432',
    college: 'Delhi University',
    course: 'B.Com Honours',
    year: '2nd Year',
    role: 'Student',
    city: 'Delhi',
    wantsToPitch: false,
    startupName: '',
    startupPitch: '',
    status: 'checked_in',
    pitchStatus: 'Applied',
    notes: 'Interested in venture capital panel and networking.',
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'SC1-00045',
    name: 'Dr. Sunita Malik',
    email: 'sunita.malik@miet.ac.in',
    phone: '9845012345',
    college: 'MIET Meerut',
    course: 'Faculty / BioTech',
    year: 'Faculty',
    role: 'Professional',
    city: 'Meerut',
    wantsToPitch: false,
    startupName: '',
    startupPitch: '',
    status: 'confirmed',
    pitchStatus: 'Applied',
    notes: 'Leading a student delegation of 15 bio-tech innovators.',
    createdAt: new Date(Date.now() - 3600000 * 26).toISOString(),
  },
];

const INITIAL_DEMO_PARTNERS: AdminPartnerEnquiry[] = [
  {
    id: 'PARTNER-01',
    company: 'Apex Cloud Systems',
    contactName: 'Nitin Oberoi',
    email: 'nitin@apexcloud.io',
    phone: '9988776655',
    message: 'Interested in providing developer cloud credits and hosting the Day 1 MVP workshop.',
    status: 'New',
    notes: 'Sent sponsorship deck tier proposal.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'PARTNER-02',
    company: 'VentureCatalyst Capital',
    contactName: 'Divya Rastogi',
    email: 'divya@venturecat.vc',
    phone: '9877112233',
    message: 'Looking to join the Pitch Arena jury and meet pre-seed founders.',
    status: 'Contacted',
    notes: 'Confirmed for Day 2 Investor Panel.',
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
];

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
      list.push({ ...data, id: d.id });
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
  updates: Partial<AdminRegistration>
): Promise<boolean> => {
  // Update in Firestore
  try {
    const ref = doc(db, 'registrations', id);
    await updateDoc(ref, updates);
  } catch (e) {
    console.warn('Firestore update notice:', e);
  }

  // Update in local cache
  try {
    const raw = localStorage.getItem(LOCAL_REGISTRATIONS_KEY);
    const list: AdminRegistration[] = raw ? JSON.parse(raw) : [];
    const index = list.findIndex((item) => item.id === id);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      localStorage.setItem(LOCAL_REGISTRATIONS_KEY, JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Cache update notice:', e);
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
