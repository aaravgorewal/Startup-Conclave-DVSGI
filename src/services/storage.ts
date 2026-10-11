/**
 * Payment Screenshot Storage Service
 * Handles client-side compression and secure Cloudinary upload via XMLHttpRequest.
 * No Firebase Storage dependencies.
 */

export interface CloudinaryUploadResult {
  success: boolean;
  publicId?: string;
  error?: string;
  errorCode?: string;
}

export interface CompressionResult {
  blob: Blob;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export interface ResumableUploadOptions {
  onProgress?: (percent: number) => void;
  timeoutMs?: number; // default 30000 ms
}

export const MAX_SCREENSHOT_SIZE_BYTES = 10 * 1024 * 1024; // Accept up to 10 MB raw files before client compression

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/jpg',
];

export const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Validates a payment screenshot file for type and maximum size.
 */
export const validatePaymentScreenshotFile = (
  file: File
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'Please select a payment screenshot.' };
  }

  const type = (file.type || '').toLowerCase();
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  const validExts = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
  const isAllowedType =
    type.startsWith('image/') ||
    ALLOWED_IMAGE_TYPES.includes(type) ||
    validExts.includes(ext);

  if (!isAllowedType) {
    return {
      valid: false,
      error: 'Please upload a JPG or PNG screenshot.',
    };
  }

  if (file.size > MAX_SCREENSHOT_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Maximum allowed size is 10 MB.`,
    };
  }

  return { valid: true };
};

/**
 * Compresses an image on the client:
 * - Accepts jpg/png/webp/heic
 * - Decodes via createImageBitmap or <img>
 * - Scales to max side 1400px
 * - Exports JPEG quality 0.7 (target under 400 KB)
 * - Returns clean error "Please upload a JPG or PNG screenshot" if decoding fails (e.g. unsupported HEIC)
 */
export const compressScreenshot = async (
  file: File
): Promise<{ success: true; data: CompressionResult } | { success: false; error: string }> => {
  const check = validatePaymentScreenshotFile(file);
  if (!check.valid) {
    return { success: false, error: check.error || 'Please upload a JPG or PNG screenshot.' };
  }

  let imageSource: ImageBitmap | HTMLImageElement | null = null;
  let sourceWidth = 0;
  let sourceHeight = 0;

  // 1. Try decoding via createImageBitmap
  if (typeof window !== 'undefined' && typeof window.createImageBitmap === 'function') {
    try {
      const bitmap = await window.createImageBitmap(file);
      imageSource = bitmap;
      sourceWidth = bitmap.width;
      sourceHeight = bitmap.height;
    } catch {
      // Fall through to <img> element fallback
    }
  }

  // 2. Fallback to <img> with object URL
  if (!imageSource) {
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const objectUrl = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(objectUrl);
          resolve(image);
        };
        image.onerror = (err) => {
          URL.revokeObjectURL(objectUrl);
          reject(err);
        };
        image.src = objectUrl;
      });
      imageSource = img;
      sourceWidth = img.naturalWidth || img.width;
      sourceHeight = img.naturalHeight || img.height;
    } catch {
      return {
        success: false,
        error: 'Please upload a JPG or PNG screenshot.',
      };
    }
  }

  if (!imageSource || sourceWidth <= 0 || sourceHeight <= 0) {
    return {
      success: false,
      error: 'Please upload a JPG or PNG screenshot.',
    };
  }

  // 3. Scale down so max side is 1400px
  const maxSide = 1400;
  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;

  if (Math.max(sourceWidth, sourceHeight) > maxSide) {
    const scale = maxSide / Math.max(sourceWidth, sourceHeight);
    targetWidth = Math.round(sourceWidth * scale);
    targetHeight = Math.round(sourceHeight * scale);
  }

  // 4. Render onto canvas with white background
  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      success: false,
      error: 'Failed to initialize canvas for image compression.',
    };
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  ctx.drawImage(imageSource, 0, 0, targetWidth, targetHeight);

  if ('close' in imageSource && typeof (imageSource as any).close === 'function') {
    try {
      (imageSource as any).close();
    } catch {}
  }

  // 5. Export as JPEG with 0.7 quality (target under 400 KB)
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.7);
  });

  if (!blob) {
    return {
      success: false,
      error: 'Failed to encode compressed screenshot.',
    };
  }

  const previewUrl = URL.createObjectURL(blob);

  return {
    success: true,
    data: {
      blob,
      previewUrl,
      originalSize: file.size,
      compressedSize: blob.size,
      width: targetWidth,
      height: targetHeight,
    },
  };
};

/**
 * Uploads payment proof directly to Cloudinary using XMLHttpRequest:
 * 1. Fetches signature from /api/sign-upload
 * 2. Uploads via XMLHttpRequest to https://api.cloudinary.com/v1_1/{cloudName}/image/upload
 * 3. Supports real progress percentage, 30s timeout, and cancellation
 */
export const uploadPaymentProof = (
  blob: Blob,
  options?: ResumableUploadOptions
): {
  promise: Promise<CloudinaryUploadResult>;
  cancel: () => void;
} => {
  let isSettled = false;
  let xhr: XMLHttpRequest | null = null;

  const cancel = () => {
    if (!isSettled) {
      isSettled = true;
      if (xhr) {
        try {
          xhr.abort();
        } catch {}
      }
    }
  };

  const promise = new Promise<CloudinaryUploadResult>(async (resolve) => {
    try {
      // 1. Obtain signature from serverless endpoint
      const signResp = await fetch('/api/sign-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!signResp.ok) {
        let errMsg = 'Failed to get upload signature.';
        try {
          const errData = await signResp.json();
          if (errData?.error) errMsg = errData.error;
        } catch {}
        isSettled = true;
        return resolve({
          success: false,
          error: errMsg,
          errorCode: `sign/${signResp.status}`,
        });
      }

      const signData = await signResp.json();
      const { cloudName, apiKey, timestamp, signature, folder, type, allowed_formats } = signData;

      if (!cloudName || !apiKey || !signature) {
        isSettled = true;
        return resolve({
          success: false,
          error: 'Incomplete signature parameters from server.',
          errorCode: 'sign/invalid-response',
        });
      }

      if (isSettled) return;

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append('file', blob, 'proof.jpg');
      formData.append('api_key', apiKey);
      formData.append('timestamp', String(timestamp));
      formData.append('signature', signature);
      formData.append('folder', folder || 'payment-proofs');
      formData.append('type', type || 'authenticated');
      formData.append('allowed_formats', allowed_formats || 'jpg,jpeg,png,webp');

      // 3. Initiate XMLHttpRequest for real-time progress
      xhr = new XMLHttpRequest();
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      xhr.open('POST', uploadUrl, true);
      xhr.timeout = options?.timeoutMs ?? 30000; // 30-second timeout

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && event.total > 0 && options?.onProgress) {
          const percent = Math.min(99, Math.round((event.loaded / event.total) * 100));
          options.onProgress(percent);
        }
      };

      xhr.ontimeout = () => {
        if (!isSettled) {
          isSettled = true;
          resolve({
            success: false,
            error: 'Upload timed out after 30 seconds. Please check your connection and tap Retry.',
            errorCode: 'timeout',
          });
        }
      };

      xhr.onerror = () => {
        if (!isSettled) {
          isSettled = true;
          resolve({
            success: false,
            error: 'Network error occurred during upload. Please tap Retry.',
            errorCode: 'network-error',
          });
        }
      };

      xhr.onabort = () => {
        if (!isSettled) {
          isSettled = true;
          resolve({
            success: false,
            error: 'Upload was cancelled.',
            errorCode: 'cancelled',
          });
        }
      };

      xhr.onload = () => {
        if (isSettled) return;
        isSettled = true;
        if (options?.onProgress) options.onProgress(100);

        try {
          const responseJson = JSON.parse(xhr!.responseText);
          if (xhr!.status >= 200 && xhr!.status < 300 && responseJson.public_id) {
            resolve({
              success: true,
              publicId: responseJson.public_id,
            });
          } else {
            const message = responseJson?.error?.message || `Upload failed (Status ${xhr!.status})`;
            resolve({
              success: false,
              error: message,
              errorCode: `cloudinary/${xhr!.status}`,
            });
          }
        } catch {
          resolve({
            success: false,
            error: `Server responded with HTTP ${xhr!.status}`,
            errorCode: `http/${xhr!.status}`,
          });
        }
      };

      xhr.send(formData);
    } catch (err: any) {
      if (!isSettled) {
        isSettled = true;
        resolve({
          success: false,
          error: err?.message || 'Screenshot upload failed. Please try again.',
          errorCode: 'upload-error',
        });
      }
    }
  });

  return { promise, cancel };
};

/**
 * Fetches a short-lived authenticated delivery URL for an image from /api/proof-url.
 * Requires admin authorization token.
 */
export const fetchProofUrl = async (
  publicId: string,
  idToken: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    const res = await fetch(`/api/proof-url?publicId=${encodeURIComponent(publicId)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });

    if (!res.ok) {
      let errMsg = `Failed to retrieve proof image (${res.status})`;
      try {
        const data = await res.json();
        if (data?.error) errMsg = data.error;
      } catch {}
      return { success: false, error: errMsg };
    }

    const data = await res.json();
    return { success: true, url: data.url };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error retrieving proof image',
    };
  }
};
