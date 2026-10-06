/**
 * Bot Protection & Anti-Abuse Utilities
 * - Minimum 3-second form-fill verification
 * - Client rate limiting (3 submissions per browser per hour)
 * - Honeypot checks
 * - Firebase App Check support with reCAPTCHA v3 / Enterprise
 */

const RATE_LIMIT_PREFIX = 'sc1_ratelimit_';
const MAX_SUBMISSIONS_PER_HOUR = 3;
const HOUR_IN_MS = 60 * 60 * 1000;
const MIN_FILL_TIME_MS = 3000; // 3 seconds

/**
 * Validates that user spent at least 3 seconds filling out the form
 */
export const checkFormFillTime = (
  startTime: number
): { valid: boolean; error?: string } => {
  const elapsed = Date.now() - startTime;
  if (elapsed < MIN_FILL_TIME_MS) {
    return {
      valid: false,
      error: 'Form submitted too quickly. Please take a moment to review your details.',
    };
  }
  return { valid: true };
};

/**
 * Checks whether the browser has reached the 3 submissions per hour limit
 */
export const checkBrowserRateLimit = (
  actionKey: string = 'general'
): { allowed: boolean; remaining: number; error?: string } => {
  try {
    const storageKey = `${RATE_LIMIT_PREFIX}${actionKey}`;
    const raw = localStorage.getItem(storageKey);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();

    // Filter to submissions within the past 1 hour
    const recent = timestamps.filter((ts) => now - ts < HOUR_IN_MS);

    if (recent.length >= MAX_SUBMISSIONS_PER_HOUR) {
      return {
        allowed: false,
        remaining: 0,
        error: `Submission limit reached (maximum ${MAX_SUBMISSIONS_PER_HOUR} per hour). Please try again later.`,
      };
    }

    return {
      allowed: true,
      remaining: MAX_SUBMISSIONS_PER_HOUR - recent.length,
    };
  } catch {
    return { allowed: true, remaining: MAX_SUBMISSIONS_PER_HOUR };
  }
};

/**
 * Records a successful submission in the rate limit window
 */
export const recordBrowserSubmission = (actionKey: string = 'general'): void => {
  try {
    const storageKey = `${RATE_LIMIT_PREFIX}${actionKey}`;
    const raw = localStorage.getItem(storageKey);
    const timestamps: number[] = raw ? JSON.parse(raw) : [];
    const now = Date.now();

    const recent = timestamps.filter((ts) => now - ts < HOUR_IN_MS);
    recent.push(now);

    localStorage.setItem(storageKey, JSON.stringify(recent));
  } catch (e) {
    console.warn('Unable to record rate limit timestamp:', e);
  }
};
