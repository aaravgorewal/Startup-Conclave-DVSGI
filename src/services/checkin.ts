import {
  collection,
  query,
  where,
  limit,
  getDocs,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase.ts';

export type CheckInResult =
  | { kind: 'ok'; name: string; id: string; ticket: string; college: string }
  | { kind: 'already'; at?: string; by?: string }
  | { kind: 'waitlist' }
  | { kind: 'payment_pending' }
  | { kind: 'invalid' }
  | { kind: 'closed' }
  | { kind: 'error'; message?: string };

/**
 * Helper to safely format timestamp or date to HH:MM string
 */
const formatTime = (ts: any): string => {
  if (!ts) return '';
  try {
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (ts instanceof Date) {
      return ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    if (typeof ts === 'string') {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return ts;
    }
  } catch {}
  return '';
};

/**
 * Validate and perform atomic attendee check-in
 *
 * Security & privacy invariants:
 * - Requires authenticated volunteer or admin
 * - Never returns phone or email
 * - Enforces ticketCode verification when code exists on document
 */
export async function checkInByCode(raw: string, uid: string): Promise<CheckInResult> {
  if (!raw || typeof raw !== 'string') {
    return { kind: 'invalid' };
  }

  const cleanRaw = raw.trim();
  let id = '';
  let t: string | null = null;

  // 1. Parse raw as JSON {id, t}. If parsing fails treat raw as a plain registration ID (legacy)
  try {
    const parsed = JSON.parse(cleanRaw);
    if (parsed && typeof parsed === 'object') {
      if (parsed.id !== undefined && parsed.id !== null) {
        id = String(parsed.id).trim();
      }
      if (parsed.t !== undefined && parsed.t !== null) {
        t = String(parsed.t).trim();
      }
    }
  } catch {
    // Plain ID or non-JSON input fallback
  }

  if (!id) {
    const idMatch = cleanRaw.match(/(SC1-\d{5}|SC1-[A-Za-z0-9]+)/i);
    id = idMatch ? idMatch[1] : cleanRaw;
  }

  if (!id) {
    return { kind: 'invalid' };
  }

  // 2. Query registrations where registrationId == id, limit(1)
  let snap;
  try {
    const q = query(
      collection(db, 'registrations'),
      where('registrationId', '==', id),
      limit(1)
    );
    snap = await getDocs(q);
  } catch (err: any) {
    const errCode = String(err?.code || '');
    const errMsg = String(err?.message || '');
    if (
      errCode.includes('permission-denied') ||
      errMsg.includes('permission-denied') ||
      errMsg.includes('Missing or insufficient permissions')
    ) {
      return { kind: 'closed' };
    }
    return { kind: 'error', message: err?.message };
  }

  // Not found -> invalid
  if (!snap || snap.empty) {
    return { kind: 'invalid' };
  }

  const docSnap = snap.docs[0];
  const data = docSnap.data();

  // 3. Ticket code verification:
  // If a ticketCode exists on the doc and t does not match -> {kind:'invalid'}
  // If no t was provided and the doc has a ticketCode -> {kind:'invalid'}
  const docTicketCode = data.ticketCode ? String(data.ticketCode) : null;
  if (docTicketCode) {
    if (!t || t !== docTicketCode) {
      return { kind: 'invalid' };
    }
  }

  // 4. Status checks
  // If status === 'waitlist' -> {kind:'waitlist'}
  if (data.status === 'waitlist') {
    return { kind: 'waitlist' };
  }

  // If ticket==='pitch' and payment.status !== 'verified' (only when these fields exist) -> {kind:'payment_pending'}
  if (
    data.ticket === 'pitch' &&
    data.payment &&
    typeof data.payment === 'object' &&
    data.payment.status !== undefined &&
    data.payment.status !== 'verified'
  ) {
    return { kind: 'payment_pending' };
  }

  // 5. Already checked in check:
  // If status === 'checked_in' -> {kind:'already', at, by}
  if (data.status === 'checked_in') {
    const at = formatTime(data.checkedInAt);
    const by = data.checkedInBy ? String(data.checkedInBy) : undefined;
    return { kind: 'already', at: at || undefined, by };
  }

  // 6. Atomic check-in transaction:
  // Re-read doc, verify status still 'registered', update { status:'checked_in', checkedInAt: serverTimestamp(), checkedInBy: uid }
  try {
    const result = await runTransaction(db, async (transaction) => {
      const freshSnap = await transaction.get(docSnap.ref);
      if (!freshSnap.exists()) {
        return { kind: 'invalid' as const };
      }
      const freshData = freshSnap.data();

      // Verify ticketCode again in transaction if present
      const freshTicketCode = freshData.ticketCode ? String(freshData.ticketCode) : null;
      if (freshTicketCode) {
        if (!t || t !== freshTicketCode) {
          return { kind: 'invalid' as const };
        }
      }

      if (freshData.status === 'checked_in') {
        const at = formatTime(freshData.checkedInAt);
        const by = freshData.checkedInBy ? String(freshData.checkedInBy) : undefined;
        return { kind: 'already' as const, at: at || undefined, by };
      }

      if (freshData.status === 'waitlist') {
        return { kind: 'waitlist' as const };
      }

      if (
        freshData.ticket === 'pitch' &&
        freshData.payment &&
        typeof freshData.payment === 'object' &&
        freshData.payment.status !== undefined &&
        freshData.payment.status !== 'verified'
      ) {
        return { kind: 'payment_pending' as const };
      }

      if (freshData.status !== 'registered') {
        return { kind: 'invalid' as const };
      }

      transaction.update(docSnap.ref, {
        status: 'checked_in',
        checkedInAt: serverTimestamp(),
        checkedInBy: uid,
      });

      const collegeName =
        typeof freshData.college === 'object' && freshData.college?.name
          ? String(freshData.college.name)
          : String(freshData.college || '');

      return {
        kind: 'ok' as const,
        name: String(freshData.name || ''),
        id: String(freshData.registrationId || freshData.id || id),
        ticket: String(freshData.ticket || 'participant'),
        college: collegeName,
      };
    });

    return result;
  } catch (err: any) {
    const errCode = String(err?.code || '');
    const errMsg = String(err?.message || '');
    if (
      errCode.includes('permission-denied') ||
      errMsg.includes('permission-denied') ||
      errMsg.includes('Missing or insufficient permissions')
    ) {
      return { kind: 'closed' };
    }
    return { kind: 'error', message: err?.message };
  }
}
