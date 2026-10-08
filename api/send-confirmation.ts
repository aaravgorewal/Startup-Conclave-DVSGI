import type { VercelRequest, VercelResponse } from '@vercel/node';
import QRCode from 'qrcode';
import nodemailer from 'nodemailer';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

/**
 * Escapes HTML characters to prevent XSS injection in email clients.
 */
function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Returns singleton Firestore instance connected to named database if provided.
 */
function getDatabase() {
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountRaw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT environment variable is not configured');
  }

  const serviceAccount = JSON.parse(serviceAccountRaw);

  const app = getApps().length === 0
    ? initializeApp({
        credential: cert(serviceAccount),
      })
    : getApps()[0];

  const databaseId = process.env.FIREBASE_DATABASE_ID?.trim();
  return databaseId ? getFirestore(app, databaseId) : getFirestore(app);
}

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
    db = getDatabase();
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
    // Proceed despite rate limit counter update glitch to avoid blocking legitimate user pass
  }

  // 4. Build the email: send ONLY to the email stored on that registration doc
  const recipientEmail = typeof regData.email === 'string' ? regData.email.trim() : '';
  if (!recipientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail)) {
    return res.status(400).json({ error: 'Registration has no valid email address' });
  }

  const attendeeName = regData.name || regData.fullName || 'Attendee';
  const attendeeId = regData.id || regData.registrationId || registrationId;
  const isPitch = regData.ticket === 'pitch' || regData.wantsToPitch === true;
  const ticketTypeDisplay = isPitch ? 'Startup Pitch Pass' : 'Participant Pass';

  let collegeDisplay = '';
  if (typeof regData.college === 'string') {
    collegeDisplay = regData.college.trim();
  } else if (regData.college && typeof regData.college === 'object' && typeof regData.college.name === 'string') {
    collegeDisplay = regData.college.name.trim();
  }
  if (!collegeDisplay && typeof regData.organization === 'string') {
    collegeDisplay = regData.organization.trim();
  }
  if (!collegeDisplay) {
    collegeDisplay = 'N/A';
  }

  // Optional event details from server-side env vars only
  const eventDate = process.env.EVENT_DATE?.trim();
  const eventVenue = process.env.EVENT_VENUE?.trim();
  const eventTime = process.env.EVENT_TIME?.trim();

  // Optional contact details from env vars
  const contactEmail = process.env.CONTACT_EMAIL?.trim();
  const contactPhone = process.env.CONTACT_PHONE?.trim();

  // Payment status check for pitch tickets
  const paymentStatus = regData.payment?.status || regData.paymentStatus;
  const isPaymentPending = isPitch && paymentStatus !== 'verified';

  // 5. QR Code generation: qrcode.toBuffer(JSON.stringify({id, t: ticketCode}), {width: 400, margin: 2})
  let qrBuffer: Buffer;
  try {
    const qrPayload = JSON.stringify({ id: attendeeId, t: ticketCode });
    qrBuffer = await QRCode.toBuffer(qrPayload, {
      width: 400,
      margin: 2,
      type: 'png',
    });
  } catch (qrErr) {
    console.error('QR generation error:', qrErr);
    return res.status(500).json({ error: 'Failed to generate ticket QR code' });
  }

  // Build HTML email with escaped values and Neo-brutalist styling
  let optionalEventRowsHtml = '';
  if (eventDate) {
    optionalEventRowsHtml += `<tr>
      <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; font-family: monospace;">EVENT DATE</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111;">${escapeHtml(eventDate)}</td>
    </tr>`;
  }
  if (eventVenue) {
    optionalEventRowsHtml += `<tr>
      <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; font-family: monospace;">VENUE</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111;">${escapeHtml(eventVenue)}</td>
    </tr>`;
  }
  if (eventTime) {
    optionalEventRowsHtml += `<tr>
      <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; font-family: monospace;">TIME</td>
      <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111;">${escapeHtml(eventTime)}</td>
    </tr>`;
  }

  let contactSectionHtml = '';
  if (contactEmail || contactPhone) {
    contactSectionHtml += `<div style="margin-top: 24px; padding-top: 16px; border-top: 2px dashed #111111; font-size: 13px; color: #333333;">
      <p style="margin: 0 0 6px 0; font-weight: bold; color: #111111;">Questions? Contact the organizers:</p>`;
    if (contactEmail) {
      contactSectionHtml += `<p style="margin: 2px 0;">Email: <a href="mailto:${escapeHtml(contactEmail)}" style="color: #FF6B1A; font-weight: bold; text-decoration: underline;">${escapeHtml(contactEmail)}</a></p>`;
    }
    if (contactPhone) {
      contactSectionHtml += `<p style="margin: 2px 0;">Phone: <a href="tel:${escapeHtml(contactPhone)}" style="color: #FF6B1A; font-weight: bold; text-decoration: underline;">${escapeHtml(contactPhone)}</a></p>`;
    }
    contactSectionHtml += `</div>`;
  }

  const paymentPendingBanner = isPaymentPending
    ? `<div style="background-color: #FFF3CD; border: 2px solid #111111; padding: 12px 16px; margin: 16px 0; font-weight: bold; color: #856404; box-shadow: 3px 3px 0px #111111;">
        ⚠️ Payment verification pending: Your payment reference (UTR) is under review. Your pass will be fully validated once verification is complete.
      </div>`
    : '';

  const emailHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Startup Conclave 1.0 pass</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #FFF8EC; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #111111;">
  <div style="max-width: 560px; margin: 0 auto; background-color: #FFFFFF; border: 2px solid #111111; box-shadow: 6px 6px 0px #111111; padding: 28px;">
    
    <!-- Header -->
    <div style="border-bottom: 2px solid #111111; padding-bottom: 16px; margin-bottom: 20px;">
      <div style="display: inline-block; background-color: #FF6B1A; color: #FFFFFF; font-weight: bold; font-size: 12px; letter-spacing: 1px; padding: 4px 8px; border: 2px solid #111111; margin-bottom: 8px;">
        OFFICIAL PASS
      </div>
      <h1 style="margin: 8px 0 4px 0; font-size: 24px; font-weight: 800; color: #111111; letter-spacing: -0.5px;">
        Startup Conclave 1.0
      </h1>
      <p style="margin: 0; font-size: 14px; color: #555555;">DVSIET, Meerut</p>
    </div>

    ${paymentPendingBanner}

    <!-- Attendee greeting -->
    <p style="font-size: 16px; margin: 0 0 16px 0;">
      Hello <strong>${escapeHtml(attendeeName)}</strong>,
    </p>
    <p style="font-size: 14px; line-height: 1.5; margin: 0 0 20px 0; color: #333333;">
      Here is your entry pass for <strong>Startup Conclave 1.0</strong>. Please keep this email safe and present the QR code at the check-in desk for entry.
    </p>

    <!-- QR Code Container -->
    <div style="background-color: #FFF8EC; border: 2px solid #111111; padding: 20px; text-align: center; margin: 20px 0; box-shadow: 4px 4px 0px #111111;">
      <img src="cid:ticket-qr" alt="Ticket QR Code" width="220" height="220" style="display: block; margin: 0 auto; border: 2px solid #111111; background-color: #FFFFFF;" />
      <div style="margin-top: 12px; font-family: monospace; font-size: 14px; font-weight: bold; color: #111111;">
        ID: <span style="color: #FF6B1A;">${escapeHtml(attendeeId)}</span>
      </div>
      <div style="margin-top: 4px; font-family: monospace; font-size: 12px; color: #555555;">
        SECURITY CODE: ${escapeHtml(ticketCode)}
      </div>
    </div>

    <!-- Pass details table -->
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 2px solid #111111; font-size: 14px;">
      <tbody>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; width: 38%; font-family: monospace;">ATTENDEE</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111;">${escapeHtml(attendeeName)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; font-family: monospace;">REGISTRATION ID</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111; font-weight: bold;">${escapeHtml(attendeeId)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; font-family: monospace;">TICKET TYPE</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111;">${escapeHtml(ticketTypeDisplay)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #111111; color: #111111; font-family: monospace;">COLLEGE / ORG</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #111111; color: #111111;">${escapeHtml(collegeDisplay)}</td>
        </tr>
        ${optionalEventRowsHtml}
      </tbody>
    </table>

    ${contactSectionHtml}

    <div style="margin-top: 24px; text-align: center; font-size: 12px; color: #777777;">
      Startup Conclave 1.0 • DVSIET, Meerut
    </div>
  </div>
</body>
</html>`;

  // Plain text version fallback
  let plainText = `Startup Conclave 1.0 - Pass Details\n\n`;
  plainText += `Attendee: ${attendeeName}\n`;
  plainText += `Registration ID: ${attendeeId}\n`;
  plainText += `Ticket Type: ${ticketTypeDisplay}\n`;
  plainText += `College / Organisation: ${collegeDisplay}\n`;
  plainText += `Security Code: ${ticketCode}\n`;
  if (isPaymentPending) {
    plainText += `\nPayment Status: Payment verification pending (under review)\n`;
  }
  if (eventDate) plainText += `Event Date: ${eventDate}\n`;
  if (eventVenue) plainText += `Venue: ${eventVenue}\n`;
  if (eventTime) plainText += `Time: ${eventTime}\n`;
  if (contactEmail) plainText += `Contact Email: ${contactEmail}\n`;
  if (contactPhone) plainText += `Contact Phone: ${contactPhone}\n`;

  // 6. Send with nodemailer using env SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM
  const smtpHost = process.env.SMTP_HOST?.trim();
  const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();
  const mailFrom = process.env.MAIL_FROM?.trim();

  if (!smtpHost || !smtpUser || !smtpPass || !mailFrom) {
    console.error('SMTP configuration missing: check SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM');
    return res.status(500).json({ error: 'Email service configuration error' });
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  try {
    await transporter.sendMail({
      from: mailFrom,
      to: recipientEmail,
      subject: 'Your Startup Conclave 1.0 pass',
      text: plainText,
      html: emailHtml,
      attachments: [
        {
          filename: 'ticket-qr.png',
          content: qrBuffer,
          cid: 'ticket-qr',
          contentType: 'image/png',
        },
      ],
    });
  } catch (smtpErr) {
    console.error('SMTP error sending confirmation:', smtpErr);
    // 7. On SMTP failure return 502 and do not set the flag
    return res.status(502).json({ error: 'Failed to deliver confirmation email' });
  }

  // 7. On success set confirmationSentAt (serverTimestamp)
  try {
    await docSnap.ref.update({
      confirmationSentAt: FieldValue.serverTimestamp(),
    });
  } catch (updateErr) {
    console.error('Failed to update confirmationSentAt timestamp:', updateErr);
  }

  return res.status(200).json({ status: 'sent' });
}
