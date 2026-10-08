import type { VercelRequest, VercelResponse } from '@vercel/node';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirebaseAdmin, sendConfirmationEmailForDoc } from './_lib/sendConfirmation.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ensure responses are typed as JSON and no CORS wildcard is exposed
  res.setHeader('Content-Type', 'application/json');

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify Authorization header with Firebase ID Token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Authorization header' });
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();
  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized: Token is missing' });
  }

  let db;
  let auth;
  try {
    const adminCtx = getFirebaseAdmin();
    db = adminCtx.db;
    auth = adminCtx.auth;
  } catch (initErr) {
    console.error('Firebase Admin init error:', initErr);
    return res.status(500).json({ error: 'Server configuration error' });
  }

  let decodedToken;
  try {
    decodedToken = await auth.verifyIdToken(idToken);
  } catch (tokenErr) {
    console.error('Admin token verification error:', tokenErr);
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }

  // 2. Confirm admins/{uid} exists in the named Firestore database
  try {
    const adminSnap = await db.collection('admins').doc(decodedToken.uid).get();
    if (!adminSnap.exists) {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }
  } catch (adminCheckErr) {
    console.error('Admin authorization lookup error:', adminCheckErr);
    return res.status(500).json({ error: 'Authorization verification failed' });
  }

  // 3. Parse input: { registrationId }
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const registrationId = typeof body?.registrationId === 'string' ? body.registrationId.trim() : '';
  if (!registrationId) {
    return res.status(400).json({ error: 'Missing registrationId' });
  }

  // 4. Query registrations where registrationId == input, limit 1
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

  if (!docSnap || !docSnap.exists) {
    return res.status(404).json({ error: 'Registration not found' });
  }

  // 5. Clear confirmationSentAt for that registrationId
  try {
    await docSnap.ref.update({
      confirmationSentAt: FieldValue.delete(),
    });
  } catch (clearErr) {
    console.error('Failed to clear confirmationSentAt:', clearErr);
    return res.status(500).json({ error: 'Failed to reset confirmation status' });
  }

  // 6. Run the same send logic
  const sendResult = await sendConfirmationEmailForDoc(docSnap);

  if (!sendResult.success) {
    return res.status(sendResult.statusCode).json({
      error: sendResult.error || 'Failed to resend confirmation email',
    });
  }

  return res.status(200).json({
    status: 'sent',
    message: 'Confirmation email resent successfully',
    recipientEmail: sendResult.recipientEmail,
  });
}
