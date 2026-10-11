import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.ts';

export interface StorageUploadResult {
  success: boolean;
  url?: string;
  storagePath?: string;
  error?: string;
}

export const MAX_SCREENSHOT_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
];

/**
 * Validates a payment screenshot file for type and maximum size (5 MB).
 */
export const validatePaymentScreenshotFile = (
  file: File
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'Please select a payment screenshot.' };
  }

  const type = (file.type || '').toLowerCase();
  // Support file.type check and filename extension fallback
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const isAllowedType =
    ALLOWED_IMAGE_TYPES.includes(type) ||
    ['jpg', 'jpeg', 'png', 'webp'].includes(ext);

  if (!isAllowedType) {
    return {
      valid: false,
      error: 'Invalid file format. Only JPG, JPEG, PNG, and WebP images are supported.',
    };
  }

  if (file.size > MAX_SCREENSHOT_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed size is 5 MB.`,
    };
  }

  return { valid: true };
};

/**
 * Uploads a payment screenshot to Firebase Storage.
 * Saves path under payment-screenshots/{timestamp}_{identifier}.{ext}
 */
export const uploadPaymentScreenshot = async (
  file: File,
  identifier: string
): Promise<StorageUploadResult> => {
  const check = validatePaymentScreenshotFile(file);
  if (!check.valid) {
    return { success: false, error: check.error };
  }

  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const cleanId = (identifier || 'applicant')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 32);
    const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const storagePath = `payment-screenshots/${cleanId}-${uniqueSuffix}.${ext}`;
    const storageRef = ref(storage, storagePath);

    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type || `image/${ext === 'jpg' ? 'jpeg' : ext}`,
      customMetadata: {
        originalName: file.name.slice(0, 100),
        uploadedAt: new Date().toISOString(),
      },
    });

    const url = await getDownloadURL(snapshot.ref);
    return {
      success: true,
      url,
      storagePath,
    };
  } catch (err: any) {
    console.error('Firebase storage upload failed:', err);
    return {
      success: false,
      error:
        err?.message ||
        'Failed to upload payment screenshot. Please verify your connection and try again.',
    };
  }
};
