import type { VercelRequest, VercelResponse } from '@vercel/node';
import cloudinary from 'cloudinary';

// In-memory rate limiting map (IP -> { count, resetAt })
const ipRateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 signing requests per minute per IP

function isAllowedOrigin(origin: string, host: string): boolean {
  if (!origin) return true; // Direct/same-origin
  try {
    const parsed = new URL(origin);
    if (parsed.host === host) return true;
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') return true;
    if (parsed.hostname.endsWith('.vercel.app')) return true;
    return false;
  } catch {
    return false;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');

  const origin = (req.headers.origin as string) || '';
  const host = (req.headers.host as string) || '';

  // 1. CORS check (only allow our own domain and local dev)
  if (origin) {
    if (isAllowedOrigin(origin, host)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    } else {
      return res.status(403).json({ error: 'Forbidden: Origin not allowed' });
    }
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. In-memory IP rate limiting
  const forwarded = req.headers['x-forwarded-for'];
  const clientIp = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket.remoteAddress || 'unknown';

  const now = Date.now();
  const rateRecord = ipRateMap.get(clientIp);
  if (rateRecord && rateRecord.resetAt > now) {
    if (rateRecord.count >= MAX_REQUESTS_PER_WINDOW) {
      return res.status(429).json({ error: 'Too many requests. Please wait before retrying.' });
    }
    rateRecord.count++;
  } else {
    ipRateMap.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
  }

  // 3. Verify Cloudinary environment variables
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Cloudinary environment configuration missing');
    return res.status(500).json({ error: 'Cloudinary server configuration error' });
  }

  // 4. Generate signed params
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'payment-proofs';
  const type = 'authenticated';
  const allowed_formats = 'jpg,jpeg,png,webp';

  const paramsToSign = {
    allowed_formats,
    folder,
    timestamp,
    type,
  };

  const signature = cloudinary.v2.utils.api_sign_request(paramsToSign, apiSecret);

  return res.status(200).json({
    cloudName,
    apiKey,
    timestamp,
    signature,
    folder,
    type,
    allowed_formats,
  });
}
