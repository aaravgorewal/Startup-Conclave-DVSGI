import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import firebaseConfig from '../../firebase-applet-config.json';

// Read authDomain from VITE_FIREBASE_AUTH_DOMAIN (falling back to firebase-applet-config.json)
const resolvedAuthDomain =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN) ||
  firebaseConfig.authDomain;

const config = {
  ...firebaseConfig,
  authDomain: resolvedAuthDomain,
};

const app = !getApps().length ? initializeApp(config) : getApp();

export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const storage = getStorage(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firebase App Check with reCAPTCHA v3 or Enterprise if site key is configured
export let appCheck: any = null;
if (typeof window !== 'undefined') {
  const recaptchaKey = (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY;
  if (recaptchaKey && typeof recaptchaKey === 'string' && recaptchaKey.trim() !== '') {
    try {
      appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaV3Provider(recaptchaKey.trim()),
        isTokenAutoRefreshEnabled: true,
      });
    } catch (err) {
      console.warn('Firebase App Check initialization notice:', err);
    }
  }
}

export default app;
