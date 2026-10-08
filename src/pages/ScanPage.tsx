import React, { useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import jsQR from 'jsqr';
import {
  QrCode,
  Camera,
  LogOut,
  AlertTriangle,
  Search,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  XCircle,
  CheckCircle2,
} from 'lucide-react';
import { auth, db } from '../services/firebase.ts';
import { checkInByCode, CheckInResult } from '../services/checkin.ts';

type PageState = 'login' | 'scanner' | 'result';

export default function ScanPage() {
  // 1. Robots noindex meta management while mounted
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    const created = !meta;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    const prevContent = meta.content;
    meta.content = 'noindex, nofollow';

    return () => {
      if (created) {
        meta.remove();
      } else {
        meta.content = prevContent || 'index, follow';
      }
    };
  }, []);

  // 2. Component & Flow States
  const [pageState, setPageState] = useState<PageState>('login');
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Gate / check-in settings state
  const [checkinClosed, setCheckinClosed] = useState(false);
  const [checkingSettings, setCheckingSettings] = useState(false);

  // Scanner state
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualId, setManualId] = useState('');
  const [sessionCount, setSessionCount] = useState(0);

  // Active check-in result
  const [checkinResult, setCheckinResult] = useState<CheckInResult | null>(null);
  const [isProcessingCode, setIsProcessingCode] = useState(false);

  // Refs for media & debounce & timer
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanStreamRef = useRef<MediaStream | null>(null);
  const scanAnimationRef = useRef<number | null>(null);
  const autoReturnTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastScannedRef = useRef<{ raw: string; time: number } | null>(null);

  // 3. 30-Minute Idle Auto Sign-Out
  const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const lastActivityRef = useRef<number>(Date.now());

  useEffect(() => {
    if (pageState === 'login') return;

    const resetIdleTimer = () => {
      lastActivityRef.current = Date.now();
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((ev) => window.addEventListener(ev, resetIdleTimer, { passive: true }));

    const interval = setInterval(() => {
      if (Date.now() - lastActivityRef.current >= IDLE_TIMEOUT_MS) {
        handleLogout('Signed out automatically due to 30 minutes of inactivity.');
      }
    }, 15000);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetIdleTimer));
      clearInterval(interval);
    };
  }, [pageState]);

  // Stop video stream and cancel frame sampling
  const stopQRScanner = () => {
    if (scanAnimationRef.current) {
      cancelAnimationFrame(scanAnimationRef.current);
      scanAnimationRef.current = null;
    }
    if (scanStreamRef.current) {
      scanStreamRef.current.getTracks().forEach((track) => track.stop());
      scanStreamRef.current = null;
    }
  };

  // Safe frame sampling using jsQR
  const scanVideoFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code && code.data) {
          handleProcessCode(code.data);
          return;
        }
      }
    }
    scanAnimationRef.current = requestAnimationFrame(scanVideoFrame);
  };

  // Start rear-facing camera stream
  const startQRScanner = async () => {
    stopQRScanner();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware is not accessible on this device or browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
      });
      scanStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        scanAnimationRef.current = requestAnimationFrame(scanVideoFrame);
      }
    } catch (err: any) {
      console.warn('Volunteer camera start error:', err);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings or use manual input below.'
          : 'Unable to start rear camera. Please use manual registration ID entry.'
      );
    }
  };

  // Vibrate 100ms on ok and play a short beep via WebAudio
  const triggerOkFeedback = () => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(100);
      } catch {}
    }
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.12);
      }
    } catch {}
  };

  // Resume scanning from result view
  const handleResumeScanning = () => {
    if (autoReturnTimerRef.current) {
      clearTimeout(autoReturnTimerRef.current);
      autoReturnTimerRef.current = null;
    }
    setCheckinResult(null);
    setPageState('scanner');
  };

  // Process scanned QR code or manual input
  const handleProcessCode = async (raw: string) => {
    if (!raw || isProcessingCode) return;
    const clean = raw.trim();
    if (!clean) return;

    // Ignore the same raw code for 3s
    const now = Date.now();
    if (
      lastScannedRef.current &&
      lastScannedRef.current.raw === clean &&
      now - lastScannedRef.current.time < 3000
    ) {
      return;
    }
    lastScannedRef.current = { raw: clean, time: now };

    setIsProcessingCode(true);
    stopQRScanner();

    if (autoReturnTimerRef.current) {
      clearTimeout(autoReturnTimerRef.current);
      autoReturnTimerRef.current = null;
    }

    try {
      const result = await checkInByCode(clean, currentUser?.uid || '');
      setCheckinResult(result);
      setPageState('result');

      // Update the session counter only on 'ok'
      if (result.kind === 'ok') {
        setSessionCount((prev) => prev + 1);
        triggerOkFeedback();
      }

      // Auto-return to scanning after 2.5s
      autoReturnTimerRef.current = setTimeout(() => {
        handleResumeScanning();
      }, 2500);
    } catch (err: any) {
      setCheckinResult({ kind: 'error', message: err?.message });
      setPageState('result');
      autoReturnTimerRef.current = setTimeout(() => {
        handleResumeScanning();
      }, 2500);
    } finally {
      setIsProcessingCode(false);
    }
  };

  // Manual ID entry submission
  const handleManualSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanId = manualId.trim();
    if (!cleanId) return;

    setManualId('');
    handleProcessCode(cleanId);
  };

  // Check volunteer authorisation doc and settings/event
  const verifyVolunteerAndSettings = async (user: User): Promise<boolean> => {
    // 1. Check volunteers/{uid} (or Volunteers/{uid} in case of title-cased collection)
    try {
      let volSnap = await getDoc(doc(db, 'volunteers', user.uid));
      if (!volSnap.exists()) {
        volSnap = await getDoc(doc(db, 'Volunteers', user.uid));
      }

      if (!volSnap.exists()) {
        console.warn(`No volunteer document found for UID: ${user.uid} in 'volunteers' or 'Volunteers'`);
        await signOut(auth);
        setCurrentUser(null);
        setLoginError(
          `Not authorised: No volunteer doc found for UID "${user.uid}". Verify that the document ID in 'volunteers' matches your Firebase Auth UID.`
        );
        setPageState('login');
        return false;
      }
    } catch (err: any) {
      console.warn('Volunteer doc check failed:', err);
      await signOut(auth);
      setCurrentUser(null);
      const isPermDenied =
        err?.code === 'permission-denied' ||
        String(err?.message || '').includes('permission-denied') ||
        String(err?.message || '').includes('Missing or insufficient permissions');

      if (isPermDenied) {
        setLoginError(
          'Not authorised: Firestore rules denied access to the volunteers document. Please deploy or publish firestore.rules to Firebase.'
        );
      } else {
        setLoginError(`Not authorised: ${err?.message || 'Access denied'}`);
      }
      setPageState('login');
      return false;
    }

    // 2. Fetch settings/event
    try {
      const settingsRef = doc(db, 'settings', 'event');
      const settingsSnap = await getDoc(settingsRef);
      const data = settingsSnap.exists() ? settingsSnap.data() : null;
      const isOpen = data?.checkinOpen === true;

      setCheckinClosed(!isOpen);
      if (!isOpen) {
        stopQRScanner();
      }
      return true;
    } catch (err) {
      console.warn('Notice reading settings/event:', err);
      setCheckinClosed(false);
      return true;
    }
  };

  // Monitor auth state on initial mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthLoading(true);
      if (user) {
        setCurrentUser(user);
        const authorised = await verifyVolunteerAndSettings(user);
        if (authorised) {
          setPageState('scanner');
        }
      } else {
        setCurrentUser(null);
        setPageState('login');
      }
      setAuthLoading(false);
    });

    return () => {
      unsubscribe();
      stopQRScanner();
      if (autoReturnTimerRef.current) {
        clearTimeout(autoReturnTimerRef.current);
      }
    };
  }, []);

  // When scanner page is entered and checkin is open, start camera
  useEffect(() => {
    if (pageState === 'scanner' && !checkinClosed && !authLoading) {
      startQRScanner();
    } else {
      stopQRScanner();
    }
    return () => {
      stopQRScanner();
    };
  }, [pageState, checkinClosed, authLoading]);

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    setLoginLoading(true);
    setLoginError(null);

    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        loginEmail.trim(),
        loginPassword.trim()
      );
      const user = credential.user;
      setCurrentUser(user);

      // Verify volunteer role and event settings
      const authorised = await verifyVolunteerAndSettings(user);
      if (authorised) {
        setPageState('scanner');
      }
    } catch (err: any) {
      console.warn('Volunteer login failed:', err);
      setLoginError(
        err.code === 'auth/invalid-credential' ||
          err.code === 'auth/wrong-password' ||
          err.code === 'auth/user-not-found'
          ? 'Invalid email or password.'
          : err.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async (message?: string) => {
    stopQRScanner();
    if (autoReturnTimerRef.current) {
      clearTimeout(autoReturnTimerRef.current);
      autoReturnTimerRef.current = null;
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Sign out notice:', err);
    }
    setCurrentUser(null);
    setPageState('login');
    setLoginPassword('');
    setCheckinResult(null);
    if (message) {
      setLoginError(message);
    } else {
      setLoginError(null);
    }
  };

  // Re-check checkin status
  const handleRefreshSettings = async () => {
    if (!currentUser) return;
    setCheckingSettings(true);
    try {
      const settingsRef = doc(db, 'settings', 'event');
      const settingsSnap = await getDoc(settingsRef);
      const data = settingsSnap.exists() ? settingsSnap.data() : null;
      const isOpen = data?.checkinOpen === true;
      setCheckinClosed(!isOpen);
      if (isOpen) {
        startQRScanner();
      }
    } catch (err) {
      console.warn('Failed to refresh event settings:', err);
    } finally {
      setCheckingSettings(false);
    }
  };

  // 4. Loading Initial Auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-4">
        <div className="p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] text-center space-y-3 max-w-sm w-full">
          <div className="w-8 h-8 border-3 border-[#111111] border-t-[#FF6B1A] rounded-full animate-spin mx-auto" />
          <h1 className="font-display font-black text-lg text-[#111111]">
            Volunteer Check-In Terminal
          </h1>
          <p className="font-mono text-xs text-[#111111]/70">
            Verifying volunteer authorisation...
          </p>
        </div>
      </div>
    );
  }

  // 5. VIEW: LOGIN STATE (Strictly no sign-up, no password reset UI)
  if (pageState === 'login') {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center p-4 font-sans text-[#111111]">
        <div className="w-full max-w-md bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFD400] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] font-mono text-[10px] font-black uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#111111]" />
              Staff Check-In Portal
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#111111] pt-2">
              Volunteer Login
            </h1>
            <p className="text-xs font-mono text-[#111111]/70">
              Sign in with your assigned volunteer credentials to access the gate scanner terminal.
            </p>
          </div>

          {/* Login Error Banner */}
          {loginError && (
            <div
              role="alert"
              className="p-3.5 bg-rose-100 border-2 border-rose-600 shadow-[2px_2px_0px_#e11d48] text-xs font-mono text-rose-950 flex items-start gap-2.5"
            >
              <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
              <div className="font-bold flex-1">{loginError}</div>
            </div>
          )}

          {/* Login Form: email + password only */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="volunteer-email"
                className="block font-mono text-xs font-bold uppercase text-[#111111]"
              >
                Volunteer Email
              </label>
              <input
                id="volunteer-email"
                type="email"
                required
                autoComplete="email"
                autoCapitalize="none"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="volunteer@dvsiet.ac.in"
                className="w-full px-3.5 py-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-mono text-sm focus:outline-none focus:bg-white shadow-[2px_2px_0px_#111111] transition-all"
              />
            </div>

            <div className="space-y-1">
              <label
                htmlFor="volunteer-password"
                className="block font-mono text-xs font-bold uppercase text-[#111111]"
              >
                Password
              </label>
              <input
                id="volunteer-password"
                type="password"
                required
                autoComplete="current-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-mono text-sm focus:outline-none focus:bg-white shadow-[2px_2px_0px_#111111] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full brutal-btn bg-[#FF6B1A] text-white py-3 px-4 font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Open Scanner Terminal</span>
                  <ArrowRight className="w-4 h-4 stroke-[3]" />
                </>
              )}
            </button>
          </form>

          {/* Footer Notice */}
          <div className="pt-2 border-t border-[#111111]/20 text-[11px] font-mono text-[#111111]/60 text-center">
            Startup Conclave 1.0 · Gate Operations · DVSIET Meerut
          </div>
        </div>
      </div>
    );
  }

  // 6. VIEW: RESULT STATE
  // GREEN for ok, AMBER for already, RED for invalid, waitlist, payment_pending, closed, error
  if (pageState === 'result' && checkinResult) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex flex-col font-sans text-[#111111] p-3 sm:p-4">
        {/* Top Header */}
        <header className="max-w-md w-full mx-auto bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-3 flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="font-mono text-xs font-black uppercase text-[#111111]">
              Session: <span className="text-[#FF6B1A]">{sessionCount}</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleLogout()}
            className="px-2.5 py-1.5 bg-[#FFF8EC] hover:bg-rose-100 border-2 border-[#111111] font-mono text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[1px_1px_0px_#111111]"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-[#111111]" />
            <span>Logout</span>
          </button>
        </header>

        {/* Result Card Container */}
        <main className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center">
          {/* GREEN: Checked In OK */}
          {checkinResult.kind === 'ok' && (
            <div className="bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 space-y-6">
              {/* Header Banner */}
              <div className="p-4 bg-emerald-100 border-2 border-emerald-700 shadow-[3px_3px_0px_#047857] flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-800 shrink-0 stroke-[2.5]" />
                <div>
                  <span className="font-mono text-[10px] font-black uppercase text-emerald-900 tracking-wider block">
                    Admission Verified
                  </span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-emerald-950">
                    Checked In
                  </h2>
                </div>
              </div>

              {/* Attendee Info Card (never returns phone or email) */}
              <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 block">
                    Attendee Name
                  </span>
                  <div className="font-display font-black text-xl text-[#111111]">
                    {checkinResult.name || 'Participant'}
                  </div>
                </div>

                <div className="border-t border-[#111111]/20 pt-2 flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 block">
                      Registration ID
                    </span>
                    <div className="font-mono font-black text-lg text-[#FF6B1A]">
                      {checkinResult.id}
                    </div>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 block text-right">
                      Ticket
                    </span>
                    <span className="inline-block px-2.5 py-0.5 bg-[#FFD400] border border-[#111111] font-mono text-xs font-black uppercase text-[#111111]">
                      {checkinResult.ticket}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#111111]/20 pt-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 block">
                    College
                  </span>
                  <div className="font-sans font-bold text-sm text-[#111111]">
                    {checkinResult.college || '—'}
                  </div>
                </div>
              </div>

              {/* Progress & Return Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#111111]/70">
                  <span>Auto-returning in 2.5s</span>
                  <span className="font-bold">Ready</span>
                </div>
                <button
                  type="button"
                  onClick={handleResumeScanning}
                  className="w-full brutal-btn bg-[#FF6B1A] text-white py-3.5 px-4 font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#111111]"
                >
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                  <span>Scan Next Attendee</span>
                </button>
              </div>
            </div>
          )}

          {/* AMBER: Already Checked In */}
          {checkinResult.kind === 'already' && (
            <div className="bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 space-y-6">
              {/* Header Banner */}
              <div className="p-4 bg-amber-100 border-2 border-amber-600 shadow-[3px_3px_0px_#b45309] flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-amber-700 shrink-0 stroke-[2.5]" />
                <div>
                  <span className="font-mono text-[10px] font-black uppercase text-amber-900 tracking-wider block">
                    Duplicate Scan Warning
                  </span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-amber-950">
                    Already Checked In
                  </h2>
                </div>
              </div>

              {/* Already Checked in Details */}
              <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3">
                <div>
                  <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 block">
                    Checked In At
                  </span>
                  <div className="font-mono font-black text-lg text-[#111111]">
                    {checkinResult.at || 'Earlier Today'}
                  </div>
                </div>

                <div className="border-t border-[#111111]/20 pt-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-[#111111]/60 block">
                    Checked In By
                  </span>
                  <div className="font-mono text-xs text-[#111111]/80 break-all font-bold">
                    {checkinResult.by || 'Assigned Volunteer'}
                  </div>
                </div>
              </div>

              {/* Progress & Return Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#111111]/70">
                  <span>Auto-returning in 2.5s</span>
                  <span className="font-bold">Ready</span>
                </div>
                <button
                  type="button"
                  onClick={handleResumeScanning}
                  className="w-full brutal-btn bg-[#111111] text-[#FFD400] py-3.5 px-4 font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#111111]"
                >
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                  <span>Scan Next Attendee</span>
                </button>
              </div>
            </div>
          )}

          {/* RED: Invalid, Waitlist, Payment Pending, Closed, Error */}
          {(checkinResult.kind === 'invalid' ||
            checkinResult.kind === 'waitlist' ||
            checkinResult.kind === 'payment_pending' ||
            checkinResult.kind === 'closed' ||
            checkinResult.kind === 'error') && (
            <div className="bg-white border-2 border-[#111111] shadow-[6px_6px_0px_#111111] p-6 space-y-6">
              {/* Header Banner */}
              <div className="p-4 bg-rose-100 border-2 border-rose-600 shadow-[3px_3px_0px_#e11d48] flex items-center gap-3">
                <XCircle className="w-8 h-8 text-rose-700 shrink-0 stroke-[2.5]" />
                <div>
                  <span className="font-mono text-[10px] font-black uppercase text-rose-900 tracking-wider block">
                    Admission Not Permitted
                  </span>
                  <h2 className="font-display font-black text-xl sm:text-2xl text-rose-950">
                    {checkinResult.kind === 'invalid' && 'Invalid Pass'}
                    {checkinResult.kind === 'waitlist' && 'Waitlisted Registration'}
                    {checkinResult.kind === 'payment_pending' && 'Pitch Payment Unverified'}
                    {checkinResult.kind === 'closed' && 'Check-In Closed'}
                    {checkinResult.kind === 'error' && 'Verification Error'}
                  </h2>
                </div>
              </div>

              {/* Error Explanation */}
              <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-2 font-mono text-xs text-[#111111]">
                {checkinResult.kind === 'invalid' && (
                  <p>
                    Pass was not found or the scanned ticket code did not match the security record. Verify attendee ID manually.
                  </p>
                )}
                {checkinResult.kind === 'waitlist' && (
                  <p>
                    Attendee has status <strong>waitlist</strong>. Seat is not confirmed for gate entry.
                  </p>
                )}
                {checkinResult.kind === 'payment_pending' && (
                  <p>
                    Pitch Arena ticket payment has not been verified by an administrator. Please direct attendee to the registration desk.
                  </p>
                )}
                {checkinResult.kind === 'closed' && (
                  <p>
                    Check-in operations are closed in system settings. Passes cannot be admitted at this time.
                  </p>
                )}
                {checkinResult.kind === 'error' && (
                  <p className="text-rose-950 font-bold">
                    {checkinResult.message || 'Network error communicating with the database. Please try again.'}
                  </p>
                )}
              </div>

              {/* Progress & Return Action */}
              <div className="space-y-3">
                <div className="flex items-center justify-between font-mono text-[10px] text-[#111111]/70">
                  <span>Auto-returning in 2.5s</span>
                  <span className="font-bold">Ready</span>
                </div>
                <button
                  type="button"
                  onClick={handleResumeScanning}
                  className="w-full brutal-btn bg-[#111111] text-white py-3.5 px-4 font-display font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-[4px_4px_0px_#111111]"
                >
                  <Camera className="w-5 h-5 stroke-[2.5]" />
                  <span>Scan Next Attendee</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // 7. VIEW: SCANNER STATE (Full-screen rear camera, canvas frame sampling, manual fallback)
  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col font-sans text-[#111111]">
      {/* Hidden canvas for jsQR frame sampling */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />

      {/* Terminal Top Navigation Bar */}
      <header className="p-3 sm:p-4 bg-white border-b-2 border-[#111111] shadow-[0px_2px_0px_#111111] flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#FFD400] border-2 border-[#111111] shadow-[1px_1px_0px_#111111]">
            <QrCode className="w-4 h-4 text-[#111111]" />
          </div>
          <div>
            <h1 className="font-display font-black text-sm sm:text-base text-[#111111] leading-none">
              Gate Scanner
            </h1>
            <span className="font-mono text-[10px] text-[#111111]/70 block mt-0.5">
              DVSIET Meerut
            </span>
          </div>
        </div>

        {/* Session Count & Logout */}
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 bg-[#FFF8EC] border-2 border-[#111111] shadow-[1px_1px_0px_#111111] font-mono text-xs font-black text-[#111111]">
            Check-ins: <span className="text-[#FF6B1A]">{sessionCount}</span>
          </div>
          <button
            type="button"
            onClick={() => handleLogout()}
            className="p-1.5 sm:px-2.5 sm:py-1 bg-white hover:bg-rose-100 border-2 border-[#111111] shadow-[1px_1px_0px_#111111] font-mono text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 text-[#111111]" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Scanner Container */}
      <main className="flex-1 flex flex-col max-w-lg w-full mx-auto p-3 sm:p-4 space-y-4">
        {/* CHECK-IN CLOSED STATE */}
        {checkinClosed ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] text-center space-y-4">
            <div className="p-4 bg-amber-100 border-2 border-amber-600 rounded-full">
              <XCircle className="w-10 h-10 text-amber-700 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display font-black text-2xl text-[#111111]">
                Check-in is closed
              </h2>
              <p className="font-mono text-xs text-[#111111]/70 max-w-xs">
                The event administrator has closed check-in operations. The scanner camera remains inactive until opened.
              </p>
            </div>
            <button
              type="button"
              disabled={checkingSettings}
              onClick={handleRefreshSettings}
              className="brutal-btn bg-[#FFD400] text-[#111111] px-5 py-2.5 font-mono font-black text-xs uppercase flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checkingSettings ? 'animate-spin' : ''}`} />
              <span>{checkingSettings ? 'Checking...' : 'Refresh Status'}</span>
            </button>
          </div>
        ) : (
          <>
            {/* Camera Viewport Container */}
            <div className="relative bg-black border-2 border-[#111111] shadow-[4px_4px_0px_#111111] overflow-hidden min-h-[300px] sm:min-h-[360px] flex items-center justify-center">
              {/* Camera Video Stream */}
              <video
                ref={videoRef}
                playsInline
                muted
                autoPlay
                className="w-full h-full object-cover aspect-square"
              />

              {/* Viewfinder Target Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
                <div className="w-52 h-52 sm:w-60 sm:h-60 border-2 border-[#FFD400] relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
                  {/* Viewfinder Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#FF6B1A]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#FF6B1A]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#FF6B1A]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#FF6B1A]" />

                  {/* Pulsing Scan Line */}
                  <div className="absolute inset-x-0 h-0.5 bg-[#FFD400] animate-pulse top-1/2 -translate-y-1/2" />
                </div>
                <div className="mt-4 px-3 py-1 bg-[#111111]/85 text-[#FFD400] font-mono text-[11px] font-bold uppercase border border-[#FFD400]/40">
                  Align Gate Pass QR In Center
                </div>
              </div>

              {/* Processing Overlay */}
              {isProcessingCode && (
                <div className="absolute inset-0 bg-[#111111]/70 p-6 flex flex-col items-center justify-center text-center space-y-3 z-10">
                  <div className="w-8 h-8 border-3 border-white border-t-[#FF6B1A] rounded-full animate-spin" />
                  <p className="font-mono text-xs font-black uppercase text-white tracking-wider">
                    Verifying Pass...
                  </p>
                </div>
              )}

              {/* Camera Error Message */}
              {cameraError && (
                <div className="absolute inset-0 bg-[#FFF8EC] p-6 flex flex-col items-center justify-center text-center space-y-3 z-10">
                  <AlertTriangle className="w-8 h-8 text-amber-600 stroke-[2.5]" />
                  <p className="font-mono text-xs font-bold text-[#111111] max-w-xs">
                    {cameraError}
                  </p>
                  <button
                    type="button"
                    onClick={() => startQRScanner()}
                    className="brutal-btn bg-[#FFD400] text-[#111111] px-4 py-2 font-mono text-xs font-bold uppercase cursor-pointer"
                  >
                    Retry Camera
                  </button>
                </div>
              )}
            </div>

            {/* MANUAL FALLBACK INPUT SECTION */}
            <div className="bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] p-4 space-y-3">
              <div>
                <label
                  htmlFor="manual-reg-id"
                  className="block font-mono text-xs font-black uppercase text-[#111111]"
                >
                  Manual Pass Entry Fallback
                </label>
                <p className="font-mono text-[11px] text-[#111111]/60">
                  If attendee pass QR is damaged or camera fails, enter the sequential ID below.
                </p>
              </div>

              <form onSubmit={handleManualSubmit} className="flex items-stretch gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#111111]/50" />
                  <input
                    id="manual-reg-id"
                    type="text"
                    value={manualId}
                    onChange={(e) => setManualId(e.target.value)}
                    placeholder="e.g. SC1-00001"
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-mono text-sm uppercase font-bold focus:outline-none focus:bg-white shadow-[2px_2px_0px_#111111]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!manualId.trim() || isProcessingCode}
                  className="brutal-btn bg-[#FF6B1A] text-white px-4 py-2.5 font-display font-black text-xs uppercase tracking-wider shrink-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[2px_2px_0px_#111111]"
                >
                  {isProcessingCode ? 'Verifying...' : 'Verify ID'}
                </button>
              </form>
            </div>
          </>
        )}
      </main>

      {/* Terminal Footer info */}
      <footer className="p-2.5 text-center font-mono text-[10px] text-[#111111]/60 border-t border-[#111111]/15 bg-white">
        Startup Conclave 1.0 · Volunteer Gate Terminal · Auto-signout after 30 min idle
      </footer>
    </div>
  );
}
