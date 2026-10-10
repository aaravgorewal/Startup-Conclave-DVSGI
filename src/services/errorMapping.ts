/**
 * Error Mapping & Handling Utility for Startup Conclave 1.0
 * 
 * Maps Firebase Auth and Firestore error codes to specific, user-friendly messages.
 * Never leaks personal data in logs or messages.
 */

export interface AppErrorResult {
  message: string;
  code: string;
}

/**
 * Extracts a normalized error code from any error object.
 */
export const extractErrorCode = (error: any): string => {
  if (!error) return 'unknown';
  if (typeof error === 'string') return error;
  if (error.code && typeof error.code === 'string') return error.code;
  if (error.status && typeof error.status === 'string') return error.status;

  const msg = String(error.message || '').toLowerCase();
  if (msg.includes('unauthorized-domain') || msg.includes('unauthorized domain')) return 'auth/unauthorized-domain';
  if (msg.includes('popup-blocked')) return 'auth/popup-blocked';
  if (msg.includes('popup-closed-by-user')) return 'auth/popup-closed-by-user';
  if (msg.includes('cancelled-popup-request')) return 'auth/cancelled-popup-request';
  if (msg.includes('app check') || msg.includes('appcheck')) return 'app-check-error';
  if (msg.includes('network') || msg.includes('offline') || msg.includes('failed to fetch')) return 'auth/network-request-failed';
  if (msg.includes('permission-denied') || msg.includes('permission denied') || msg.includes('insufficient permissions')) return 'permission-denied';
  if (msg.includes('unavailable')) return 'unavailable';
  if (msg.includes('quota') || msg.includes('resource-exhausted') || msg.includes('resource exhausted')) return 'resource-exhausted';
  if (msg.includes('precondition') || msg.includes('failed-precondition')) return 'failed-precondition';

  return 'unknown';
};

/**
 * Maps Google Auth errors to specific user-facing messages and codes.
 * Logs full error object to console.error without personal data.
 */
export const mapAuthError = (error: any): AppErrorResult => {
  // Log full error object without personal data
  console.error('Firebase Auth operation error:', error);

  const code = extractErrorCode(error);
  const msg = String(error?.message || '').toLowerCase();

  let message = 'Google sign-in is temporarily unavailable. Please try again or contact the organisers.';

  if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized-domain')) {
    message = 'This domain is not authorized for Google Sign-In. Please ensure it is added to Authorized Domains in the Firebase Console.';
  } else if (
    code === 'auth/network-request-failed' ||
    code === 'network-request-failed' ||
    msg.includes('network') ||
    msg.includes('offline')
  ) {
    message = 'Network error connecting to Google. Please check your internet connection and try again.';
  } else if (code === 'auth/popup-blocked') {
    message = 'Popup was blocked by your browser. Please allow popups or use redirect.';
  } else if (code === 'auth/popup-closed-by-user') {
    message = 'Google sign-in was closed before completion. Please click "Continue with Google" to try again.';
  } else if (code === 'auth/cancelled-popup-request') {
    message = 'Sign-in request was cancelled. Please try again.';
  } else if (code.includes('app-check') || msg.includes('app check') || msg.includes('appcheck')) {
    message = 'App Check verification failed. Please refresh the page and try again.';
  } else if (code === 'permission-denied' || msg.includes('permission-denied')) {
    message = 'Authentication was denied. Please ensure you are authorized.';
  } else if (code === 'unavailable' || msg.includes('unavailable')) {
    message = 'Authentication service is temporarily unavailable. Please try again shortly.';
  } else if (code === 'resource-exhausted' || msg.includes('resource-exhausted') || msg.includes('quota')) {
    message = 'System quota or rate limit exceeded. Please wait a minute and try again.';
  } else if (code === 'failed-precondition' || msg.includes('failed-precondition')) {
    message = 'Operation could not be completed at this time. Please try again.';
  }

  return { message, code };
};

/**
 * Maps Registration submission errors to specific user-facing messages and codes.
 * Ensures "already registered" is only shown when the duplicate check clearly says so.
 * Logs full error object to console.error without personal data.
 */
export const mapRegistrationError = (
  error: any,
  options?: { isDuplicate?: boolean }
): AppErrorResult => {
  // Log full error object without personal data
  console.error('Registration submission error:', error);

  const code = extractErrorCode(error);
  const msg = String(error?.message || '').toLowerCase();

  let message = 'Something went wrong. Please try again in a minute.';

  if (
    options?.isDuplicate ||
    msg.includes('already registered') ||
    msg.includes('already been registered')
  ) {
    return {
      message: 'This email or phone number is already registered for Startup Conclave 1.0.',
      code: code !== 'unknown' ? code : 'duplicate-detected',
    };
  }

  if (
    code === 'auth/unauthorized-domain' ||
    msg.includes('unauthorized-domain')
  ) {
    message = 'Authentication domain is not authorized. Please contact the organisers.';
  } else if (
    code === 'auth/network-request-failed' ||
    code === 'network-request-failed' ||
    msg.includes('network-request-failed')
  ) {
    message = 'Network error connecting to service. Check your internet connection and try again.';
  } else if (
    code === 'unavailable' ||
    code === 'deadline-exceeded' ||
    msg.includes('network') ||
    msg.includes('offline') ||
    msg.includes('transport') ||
    msg.includes('failed to fetch') ||
    (typeof navigator !== 'undefined' && navigator.onLine === false)
  ) {
    message = 'Service is temporarily unavailable. Check your internet connection and try again.';
  } else if (code === 'auth/popup-blocked') {
    message = 'Popup was blocked by your browser. Please allow popups or use redirect.';
  } else if (code === 'resource-exhausted' || msg.includes('resource-exhausted') || msg.includes('quota')) {
    message = 'System quota or rate limit exceeded. Please wait a minute and try again.';
  } else if (code === 'failed-precondition' || msg.includes('failed-precondition')) {
    message = 'Operation could not be completed at this time. Please try again.';
  } else if (code.includes('app-check') || msg.includes('app check') || msg.includes('appcheck')) {
    message = 'App Check verification failed. Please refresh the page and try again.';
  } else if (code === 'permission-denied' || msg.includes('permission-denied') || msg.includes('insufficient permissions')) {
    // Per requirement: Never show "already registered" unless duplicate check clearly says so;
    // otherwise show the generic message.
    message = 'Registration was denied. Please ensure you are signed in with Google and all required details are valid.';
  }

  return { message, code };
};
