import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirebaseAdmin, sendConfirmationEmailForDoc } from './_lib/sendConfirmation.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure responses are typed as JSON and no CORS wildcard is exposed
  res.setHeader('Content-Type', 'application/json');

  // 9. Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse and validate input: { registrationId, ticketCode }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  // Strictly extract registrationId and ticketCode. Never accept an email address from the client.
  const registrationId = typeof body.registrationId === 'string' ? body.registrationId.trim() : '';
  const ticketCode = typeof body.ticketCode === 'string' ? body.ticketCode.trim() : '';

  if (!registrationId || !ticketCode) {
    return res.status(400).json({ error: 'Missing registrationId or ticketCode' });
  }

  // 1. Initialize Firestore Admin
  let db;
  try {
    const adminCtx = getFirebaseAdmin();
    db = adminCtx.db;
  } catch (initErr) {
    console.error('Firebase Admin init error:', initErr);
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // 2. Query registrations where registrationId == input, limit 1.
  let docSnap;
  try {
    const regQuery = await db
      .collection('registrations')
      .where('registrationId', '==', registrationId)
      .limit(1)
      .get();

    docSnap = regQuery.docs[0];

    // Fallback query matching 'id' in case older documents stored id instead of registrationId
    if (!docSnap) {
      const fallbackQuery = await db
        .collection('registrations')
        .where('id', '==', registrationId)
        .limit(1)
        .get();
      docSnap = fallbackQuery.docs[0];
    }
  } catch (queryErr) {
    console.error('Firestore query error:', queryErr);
    return res.status(500).json({ error: 'Database query error' });
  }

  // Not found or ticketCode mismatch -> 404 with a generic message
  if (!docSnap || !docSnap.exists) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  const regData = docSnap.data();

  if (!regData.ticketCode || regData.ticketCode !== ticketCode) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  // 3. If confirmationSentAt already exists -> 200 { status: 'already_sent' }
  if (regData.confirmationSentAt) {
    return res.status(200).json({ status: 'already_sent' });
  }

  // 8. Rate limit: max 5 calls per registrationId per hour using confirmationAttempts and confirmationLastAttemptAt
  const ONE_HOUR_MS = 60 * 60 * 1000;
  const nowMs = Date.now();

  let lastAttemptMs = 0;
  if (regData.confirmationLastAttemptAt) {
    if (typeof regData.confirmationLastAttemptAt.toMillis === 'function') {
      lastAttemptMs = regData.confirmationLastAttemptAt.toMillis();
    } else if (typeof regData.confirmationLastAttemptAt.toDate === 'function') {
      lastAttemptMs = regData.confirmationLastAttemptAt.toDate().getTime();
    } else if (typeof regData.confirmationLastAttemptAt.seconds === 'number') {
      lastAttemptMs = regData.confirmationLastAttemptAt.seconds * 1000;
    } else if (typeof regData.confirmationLastAttemptAt === 'string' || typeof regData.confirmationLastAttemptAt === 'number') {
      lastAttemptMs = new Date(regData.confirmationLastAttemptAt).getTime();
    }
  }

  const isWithinWindow = (nowMs - lastAttemptMs) < ONE_HOUR_MS;
  const currentAttempts = isWithinWindow && typeof regData.confirmationAttempts === 'number'
    ? regData.confirmationAttempts
    : 0;

  if (currentAttempts >= 5) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  // Record attempt count & timestamp on the doc
  try {
    await docSnap.ref.update({
      confirmationAttempts: currentAttempts + 1,
      confirmationLastAttemptAt: FieldValue.serverTimestamp(),
    });
  } catch (rateLimitUpdateErr) {
    console.error('Failed to update rate limit counters:', rateLimitUpdateErr);
  }

  // 4, 5, 6, 7. Build email, generate inline CID QR, send with Nodemailer, and update timestamp
  const sendResult = await sendConfirmationEmailForDoc(docSnap);

  if (!sendResult.success) {
    return res.status(sendResult.statusCode).json({ error: sendResult.error || 'Failed to send confirmation email' });
  }

  return res.status(200).json({ status: 'sent' });
}
