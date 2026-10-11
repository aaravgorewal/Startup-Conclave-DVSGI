import type { VercelRequest, VercelResponse } from '@vercel/node';
import cloudinary from 'cloudinary';
import { getFirebaseAdmin } from './_lib/sendConfirmation.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 1. Verify Authorization header
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

  // 2. Check that the caller exists in the admins collection in the named Firestore database
  try {
    const adminSnap = await db.collection('admins').doc(decodedToken.uid).get();
    if (!adminSnap.exists) {
      return res.status(403).json({ error: 'Forbidden: Admin authorization required' });
    }
  } catch (adminCheckErr) {
    console.error('Admin authorization lookup error:', adminCheckErr);
    return res.status(500).json({ error: 'Authorization verification failed' });
  }

  // 3. Validate query parameter: publicId
  const publicId = typeof req.query.publicId === 'string' ? req.query.publicId.trim() : '';
  if (!publicId) {
    return res.status(400).json({ error: 'Missing publicId query parameter' });
  }

  // 4. Configure Cloudinary and generate short-lived signed delivery URL (10 minutes)
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Cloudinary environment configuration missing');
    return res.status(500).json({ error: 'Cloudinary server configuration error' });
  }

  cloudinary.v2.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  const expiresAt = Math.floor(Date.now() / 1000) + 600; // 10 minutes
  const format = publicId.includes('.') ? (publicId.split('.').pop() || 'jpg').toLowerCase() : 'jpg';
  const cleanPublicId = publicId.replace(/\.[^/.]+$/, '');

  const signedDeliveryUrl = cloudinary.v2.utils.private_download_url(cleanPublicId, format, {
    type: 'authenticated',
    expires_at: expiresAt,
  });

  return res.status(200).json({
    url: signedDeliveryUrl,
    expiresAt,
    publicId,
  });
}
