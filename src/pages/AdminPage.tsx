import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  Users,
  Rocket,
  Calendar,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Settings,
  Handshake,
  ArrowUpDown,
  Check,
  X,
  FileText,
  Phone,
  Mail,
  Building,
  Edit3,
  Sliders,
  AlertCircle,
  Eye,
  Lock,
  Layers,
  Sparkles,
  RotateCcw,
  Trash2,
  HelpCircle,
  ShieldCheck,
  QrCode,
  Camera,
  UserCheck,
  AlertTriangle,
  Volume2,
  RefreshCw,
  ScanLine,
  CheckCheck,
  BarChart3,
  GraduationCap,
  ExternalLink,
  Info,
} from 'lucide-react';
import jsQR from 'jsqr';
import { QRCodeSVG } from 'qrcode.react';
import { auth } from '../services/firebase.ts';
import { CONFIG } from '../config.ts';
import {
  AdminRegistration,
  AdminPartnerEnquiry,
  fetchRegistrations,
  fetchPartnerEnquiries,
  updateRegistration,
  bulkUpdateStatus,
  deleteRegistration,
  deletePartnerEnquiry,
  updatePartnerEnquiry,
  updatePaymentStatus,
  exportToCSV,
  getEventSettings,
  saveEventSettings,
  setCheckinOpen,
  checkIsAdmin,
  toIso,
} from '../services/admin.ts';
import { CollegeInfo } from '../services/registrations.ts';

const getCollegeName = (col: CollegeInfo | string | undefined | null): string => {
  if (!col) return '';
  if (typeof col === 'object') return col.name || '';
  return String(col);
};

const getCollegeState = (col: CollegeInfo | string | undefined | null): string => {
  if (!col || typeof col !== 'object') return '';
  return col.state || '';
};

/**
 * Safely extracts YYYY-MM-DD from an ISO string, Timestamp, Date, or unknown value.
 * Never throws; returns empty string if missing or unparseable.
 */
const safeDatePrefix = (val: unknown): string => {
  if (!val) return '';
  if (typeof val === 'string') {
    if (val.length >= 10 && val.includes('-')) {
      return val.slice(0, 10);
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }
  const iso = toIso(val);
  if (iso && iso.length >= 10) return iso.slice(0, 10);
  return '';
};

/**
 * Safely formats date for display (e.g. DD/MM/YYYY or locale format).
 */
const safeFormatDate = (val: unknown, fallback = '—'): string => {
  if (!val) return fallback;
  const iso = typeof val === 'string' ? val : toIso(val);
  if (!iso) return fallback;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? fallback : d.toLocaleDateString();
};

/**
 * Safely formats date & time for display.
 */
const safeFormatDateTime = (val: unknown, fallback = '—'): string => {
  if (!val) return fallback;
  const iso = typeof val === 'string' ? val : toIso(val);
  if (!iso) return fallback;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? fallback : d.toLocaleString();
};

/**
 * Safely formats time for display (e.g. 10:30 AM).
 */
const safeFormatTime = (val: unknown, fallback = '—'): string => {
  if (!val) return fallback;
  const iso = typeof val === 'string' ? val : toIso(val);
  if (!iso) return fallback;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? fallback : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const AdminPage: React.FC = () => {
  // Inject noindex meta tag on mount
  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
    }
    meta.content = 'noindex, nofollow';

    return () => {
      if (meta) {
        meta.content = 'index, follow';
      }
    };
  }, []);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Client-Side Rate-Limiting & Lockout State (5 failed attempts -> 60s lockout)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Countdown timer for lockout
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'registrations' | 'checkin' | 'pitch' | 'partners' | 'settings'>('registrations');

  // Data State
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [partnerEnquiries, setPartnerEnquiries] = useState<AdminPartnerEnquiry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Search & Filter State (Registrations Table)
  const [searchQuery, setSearchQuery] = useState('');
  const [collegeSearchQuery, setCollegeSearchQuery] = useState('');
  const [ticketFilter, setTicketFilter] = useState<'All' | 'participant' | 'pitch'>('All');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('All');
  const [verifiedFilter, setVerifiedFilter] = useState<'All' | 'verified' | 'unverified'>('All');
  const [stateFilter, setStateFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [pitchFilter, setPitchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [actionInProgressId, setActionInProgressId] = useState<string | null>(null);

  // Sorting
  const [sortField, setSortField] = useState<keyof AdminRegistration>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected Rows (for Bulk Actions)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Side Details Panel State
  const [activeDetailItem, setActiveDetailItem] = useState<AdminRegistration | null>(null);
  const [detailNotes, setDetailNotes] = useState('');

  // Confirmation Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'primary';
    onConfirm: () => void | Promise<void>;
  } | null>(null);

  // 5-Second Undo Toast State for Single Status Changes
  const [undoToast, setUndoToast] = useState<{
    id: string;
    name: string;
    previousStatus: string;
    newStatus: string;
    secondsRemaining: number;
  } | null>(null);

  // Countdown timer for 5-second Undo Toast
  useEffect(() => {
    if (!undoToast) return;
    if (undoToast.secondsRemaining <= 0) {
      setUndoToast(null);
      return;
    }
    const timer = setTimeout(() => {
      setUndoToast((prev) =>
        prev ? { ...prev, secondsRemaining: prev.secondsRemaining - 1 } : null
      );
    }, 1000);
    return () => clearTimeout(timer);
  }, [undoToast?.secondsRemaining]);

  // Keyboard accessibility: ESC key closes modal dialogs and side drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (confirmDialog?.isOpen) {
          setConfirmDialog(null);
        } else if (activeDetailItem) {
          setActiveDetailItem(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [confirmDialog, activeDetailItem]);

  // Action Error Toast State for Failed Admin Operations (P5)
  const [adminActionError, setAdminActionError] = useState<string | null>(null);

  useEffect(() => {
    if (!adminActionError) return;
    const timer = setTimeout(() => setAdminActionError(null), 5000);
    return () => clearTimeout(timer);
  }, [adminActionError]);

  // Action Success Toast State for Confirmed Admin Operations (P5)
  const [adminSuccessToast, setAdminSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (!adminSuccessToast) return;
    const timer = setTimeout(() => setAdminSuccessToast(null), 4000);
    return () => clearTimeout(timer);
  }, [adminSuccessToast]);

  // Event Settings State (Config Overrides & Firestore settings/event)
  const [registrationCapSetting, setRegistrationCapSetting] = useState<number>(500);
  const [regStatusSetting, setRegStatusSetting] = useState<'open' | 'closed'>(CONFIG.registration.status);
  const [showCountSetting, setShowCountSetting] = useState<boolean>(CONFIG.registration.showCount);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);
  const [checkinOpen, setCheckinOpenState] = useState<boolean>(false);
  const [isUpdatingCheckinOpen, setIsUpdatingCheckinOpen] = useState<boolean>(false);
  const [checkinOpenErrorToast, setCheckinOpenErrorToast] = useState<string | null>(null);

  // =========================================================================
  // Check-in Desk State (Optimised for Mobile & Gate Volunteers)
  // =========================================================================
  const [checkinQuery, setCheckinQuery] = useState('');
  const [checkinFilter, setCheckinFilter] = useState<'all' | 'pending' | 'checked_in'>('all');
  const [selectedCheckinId, setSelectedCheckinId] = useState<string | null>(null);
  const [isScanningQR, setIsScanningQR] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanSuccessNotice, setScanSuccessNotice] = useState<string | null>(null);
  const [scanLegacyWarning, setScanLegacyWarning] = useState<string | null>(null);
  const [justCheckedInRecord, setJustCheckedInRecord] = useState<AdminRegistration | null>(null);
  const [checkinDoubleWarning, setCheckinDoubleWarning] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scanStreamRef = useRef<MediaStream | null>(null);
  const scanAnimationRef = useRef<number | null>(null);

  // Load Firestore settings/event on mount
  useEffect(() => {
    getEventSettings().then((s) => {
      if (s) {
        setRegistrationCapSetting(s.registrationCap || 500);
        setRegStatusSetting(s.registrationStatus || s.status || 'open');
        setShowCountSetting(s.showCount !== undefined ? s.showCount : true);
        setCheckinOpenState(Boolean(s.checkinOpen));
      }
    }).catch((err) => console.warn('Notice loading settings/event:', err));
  }, []);

  const handleToggleCheckinOpen = async () => {
    const nextState = !checkinOpen;
    setIsUpdatingCheckinOpen(true);
    setCheckinOpenErrorToast(null);
    const success = await setCheckinOpen(nextState);
    setIsUpdatingCheckinOpen(false);
    if (success) {
      setCheckinOpenState(nextState);
    } else {
      setCheckinOpenErrorToast('Failed to update Check-in status in Firestore. Please try again.');
    }
  };

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const isAdmin = await checkIsAdmin(user.uid);
        if (isAdmin) {
          setCurrentUser(user);
        } else {
          // If signed in user does not have an admin document in Firestore, sign out immediately and show "Not authorised"
          await signOut(auth);
          setCurrentUser(null);
          setAuthError('Not authorised');
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load Database Records
  const loadData = async () => {
    setDataLoading(true);
    const regs = await fetchRegistrations();
    const parts = await fetchPartnerEnquiries();
    setRegistrations(regs);
    setPartnerEnquiries(parts);
    setDataLoading(false);
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);

  // Record failed login attempt and trigger 60s lockout if >= 5 attempts
  const registerFailedAttempt = () => {
    const next = failedAttempts + 1;
    if (next >= 5) {
      setFailedAttempts(0);
      setLockoutSeconds(60);
      setAuthError('Invalid credentials');
    } else {
      setFailedAttempts(next);
      setAuthError('Invalid credentials');
    }
  };

  // Auth Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) {
      return;
    }
    setAuthError('');

    const emailTrim = authEmail.trim().toLowerCase();
    if (!emailTrim || !authPassword) {
      registerFailedAttempt();
      return;
    }

    setAuthSubmitting(true);

    try {
      const cred = await signInWithEmailAndPassword(auth, emailTrim, authPassword);
      const isAdmin = await checkIsAdmin(cred.user.uid);
      
      // Verify user has an active admin document in Firestore (/admins/{uid})
      if (isAdmin) {
        setCurrentUser(cred.user);
        setFailedAttempts(0);
        setLockoutSeconds(0);
      } else {
        // If the user does not have an admin document in Firestore, sign out immediately and show "Not authorised"
        await signOut(auth);
        setCurrentUser(null);
        setAuthError('Not authorised');
      }
    } catch {
      registerFailedAttempt();
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Status Update Handlers with Confirmation on Cancel & 5-Second Undo Toast
  const executeStatusChange = async (id: string, newStatus: string) => {
    const target = registrations.find((r) => r.id === id);
    const oldStatus = target?.status || 'registered';
    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
    const timestamp = new Date().toISOString();

    const ok = await updateRegistration(id, {
      status: newStatus,
      updatedBy: adminEmail,
      updatedAt: timestamp,
    });

    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      return;
    }

    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, updatedBy: adminEmail, updatedAt: timestamp }
          : item
      )
    );

    if (activeDetailItem?.id === id) {
      setActiveDetailItem((prev) =>
        prev
          ? { ...prev, status: newStatus, updatedBy: adminEmail, updatedAt: timestamp }
          : null
      );
    }

    // Requirement: Add an "Undo" toast for single status changes for 5 seconds
    setUndoToast({
      id,
      name: target?.name || id,
      previousStatus: oldStatus,
      newStatus,
      secondsRemaining: 5,
    });
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const target = registrations.find((r) => r.id === id);
    if (!target) return;

    // Requirement: Add confirmation dialog for cancelling a registration
    if (newStatus === 'cancelled') {
      setConfirmDialog({
        isOpen: true,
        title: 'Cancel Registration?',
        message: `Are you sure you want to cancel the registration for ${target.name} (${target.id})? This will mark their delegate ticket as cancelled.`,
        confirmLabel: 'Yes, Cancel Registration',
        cancelLabel: 'Keep Registration',
        variant: 'danger',
        onConfirm: async () => {
          setConfirmDialog(null);
          await executeStatusChange(id, 'cancelled');
        },
      });
      return;
    }

    await executeStatusChange(id, newStatus);
  };

  // Revert single status change on Undo click
  const handleUndoStatusChange = async () => {
    if (!undoToast) return;
    const { id, previousStatus } = undoToast;
    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
    const timestamp = new Date().toISOString();

    const ok = await updateRegistration(id, {
      status: previousStatus,
      updatedBy: adminEmail,
      updatedAt: timestamp,
    });

    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      return;
    }

    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: previousStatus, updatedBy: adminEmail, updatedAt: timestamp }
          : item
      )
    );

    if (activeDetailItem?.id === id) {
      setActiveDetailItem((prev) =>
        prev
          ? { ...prev, status: previousStatus, updatedBy: adminEmail, updatedAt: timestamp }
          : null
      );
    }

    setUndoToast(null);
  };

  const handlePitchStatusChange = async (id: string, newPitchStatus: string) => {
    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
    const timestamp = new Date().toISOString();
    const ok = await updateRegistration(id, {
      pitchStatus: newPitchStatus,
      updatedBy: adminEmail,
      updatedAt: timestamp,
    });
    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      return;
    }
    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, pitchStatus: newPitchStatus, updatedBy: adminEmail, updatedAt: timestamp }
          : item
      )
    );
    if (activeDetailItem?.id === id) {
      setActiveDetailItem((prev) =>
        prev
          ? { ...prev, pitchStatus: newPitchStatus, updatedBy: adminEmail, updatedAt: timestamp }
          : null
      );
    }
  };

  const handlePartnerStatusChange = async (id: string, newStatus: string) => {
    const ok = await updatePartnerEnquiry(id, { status: newStatus });
    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      return;
    }
    setPartnerEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleSaveNotes = async () => {
    if (!activeDetailItem) return;
    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
    const timestamp = new Date().toISOString();
    const ok = await updateRegistration(activeDetailItem.id, {
      notes: detailNotes,
      updatedBy: adminEmail,
      updatedAt: timestamp,
    });
    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      return;
    }
    setRegistrations((prev) =>
      prev.map((item) =>
        item.id === activeDetailItem.id
          ? { ...item, notes: detailNotes, updatedBy: adminEmail, updatedAt: timestamp }
          : item
      )
    );
    setActiveDetailItem((prev) =>
      prev
        ? { ...prev, notes: detailNotes, updatedBy: adminEmail, updatedAt: timestamp }
        : null
    );
  };

  // Handler for Mark Verified / Reject payment buttons (Admin verified only)
  const handleMarkPayment = async (
    reg: AdminRegistration,
    newStatus: 'verified' | 'rejected'
  ) => {
    if (!currentUser) {
      setAdminActionError('Not authenticated as admin');
      return;
    }
    const isAdmin = await checkIsAdmin(currentUser.uid);
    if (!isAdmin) {
      setAdminActionError('Not authorised. Admin privileges required.');
      return;
    }

    setActionInProgressId(reg.id);
    try {
      const adminEmail = currentUser.email || 'admin@dvsiet.ac.in';
      const timestamp = new Date().toISOString();
      const isVerified = newStatus === 'verified';

      const ok = await updatePaymentStatus(
        reg.id,
        newStatus,
        adminEmail,
        reg.docId,
        reg.payment
      );

      if (ok) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === reg.id
              ? {
                  ...r,
                  paymentStatus: newStatus,
                  paymentVerifiedBy: isVerified ? adminEmail : null,
                  paymentVerifiedAt: isVerified ? timestamp : null,
                  verifiedAt: isVerified ? timestamp : r.verifiedAt,
                  payment: {
                    ...(r.payment || {}),
                    required: r.payment?.required ?? true,
                    status: newStatus,
                    amountPaise: r.payment?.amountPaise ?? 99900,
                  },
                  updatedAt: timestamp,
                  updatedBy: adminEmail,
                }
              : r
          )
        );
        if (activeDetailItem?.id === reg.id) {
          setActiveDetailItem((prev) =>
            prev
              ? {
                  ...prev,
                  paymentStatus: newStatus,
                  paymentVerifiedBy: isVerified ? adminEmail : null,
                  paymentVerifiedAt: isVerified ? timestamp : null,
                  verifiedAt: isVerified ? timestamp : prev.verifiedAt,
                  payment: {
                    ...(prev.payment || {}),
                    required: prev.payment?.required ?? true,
                    status: newStatus,
                    amountPaise: prev.payment?.amountPaise ?? 99900,
                  },
                  updatedAt: timestamp,
                  updatedBy: adminEmail,
                }
              : null
          );
        }
        setAdminSuccessToast(
          isVerified
            ? `Marked payment as VERIFIED for ${reg.name} (${reg.id})`
            : `Payment REJECTED for ${reg.name} (${reg.id})`
        );
      } else {
        setAdminActionError(`Failed to update payment status for ${reg.id}. Check permissions.`);
      }
    } catch (err: any) {
      console.error('Error updating payment status:', err);
      setAdminActionError(err?.message || 'Error updating payment status');
    } finally {
      setActionInProgressId(null);
    }
  };

  // Resend confirmation email via /api/admin-resend
  const [resendingRegId, setResendingRegId] = useState<string | null>(null);

  const handleAdminResend = async (reg: AdminRegistration) => {
    if (resendingRegId) return;
    setResendingRegId(reg.id);
    setAdminActionError(null);

    try {
      const user = currentUser || auth.currentUser;
      if (!user) {
        setAdminActionError('Authentication expired. Please sign in again.');
        setResendingRegId(null);
        return;
      }
      const token = await user.getIdToken();

      const resp = await fetch('/api/admin-resend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationId: reg.registrationId || reg.id,
        }),
      });

      const data = await resp.json().catch(() => ({}));
      if (resp.ok) {
        setAdminSuccessToast(`Confirmation email sent to ${reg.email} (${reg.id})`);
      } else {
        setAdminActionError(data.error || `Failed to resend confirmation (HTTP ${resp.status})`);
      }
    } catch (err: any) {
      console.error('Error resending confirmation:', err);
      setAdminActionError(err?.message || 'Network error while attempting to resend confirmation email');
    } finally {
      setResendingRegId(null);
    }
  };

  // Requirement: Add confirmation dialog for any delete
  const handleDeleteRegistration = (reg: AdminRegistration) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Permanently Delete Registration?',
      message: `Are you sure you want to delete ${reg.name} (${reg.id})? This will permanently remove their document from Firestore. This action cannot be undone.`,
      confirmLabel: 'Permanently Delete',
      cancelLabel: 'Keep Record',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(null);
        const ok = await deleteRegistration(reg.id, reg.docId);
        if (!ok) {
          setAdminActionError('Could not save. Check your connection or permissions');
          return;
        }
        setRegistrations((prev) => prev.filter((item) => item.id !== reg.id));
        if (activeDetailItem?.id === reg.id) {
          setActiveDetailItem(null);
        }
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setConfirmDialog({
      isOpen: true,
      title: `Permanently Delete ${count} Registrations?`,
      message: `Are you sure you want to permanently delete ${count} selected attendee registration${count > 1 ? 's' : ''} from Firestore? This action cannot be undone.`,
      confirmLabel: `Delete ${count} Records`,
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(null);
        let succeededCount = 0;
        const totalCount = selectedIds.length;
        const deletedIds: string[] = [];
        for (const id of selectedIds) {
          const ok = await deleteRegistration(id);
          if (ok) {
            succeededCount++;
            deletedIds.push(id);
          }
        }
        if (deletedIds.length > 0) {
          setRegistrations((prev) => prev.filter((item) => !deletedIds.includes(item.id)));
          setSelectedIds([]);
        }
        if (succeededCount === totalCount) {
          setAdminSuccessToast(`${succeededCount} of ${totalCount} updated`);
        } else {
          setAdminActionError(`${succeededCount} of ${totalCount} updated. Check your connection or permissions`);
        }
      },
    });
  };

  const handleDeletePartnerEnquiry = (enquiry: AdminPartnerEnquiry) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Delete Partnership Inquiry?',
      message: `Are you sure you want to delete the enquiry from ${enquiry.company} (${enquiry.contactName})? This cannot be undone.`,
      confirmLabel: 'Delete Inquiry',
      cancelLabel: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        setConfirmDialog(null);
        const ok = await deletePartnerEnquiry(enquiry.id);
        if (!ok) {
          setAdminActionError('Could not save. Check your connection or permissions');
          return;
        }
        setPartnerEnquiries((prev) => prev.filter((item) => item.id !== enquiry.id));
      },
    });
  };

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredRegistrations.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeBulkStatus = async (status: string) => {
    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
    const timestamp = new Date().toISOString();
    let succeededCount = 0;
    const totalCount = selectedIds.length;
    const successfulIds: string[] = [];

    for (const id of selectedIds) {
      const ok = await updateRegistration(id, {
        status,
        updatedBy: adminEmail,
        updatedAt: timestamp,
      });
      if (ok) {
        succeededCount++;
        successfulIds.push(id);
      }
    }

    if (successfulIds.length > 0) {
      setRegistrations((prev) =>
        prev.map((item) =>
          successfulIds.includes(item.id)
            ? { ...item, status, updatedBy: adminEmail, updatedAt: timestamp }
            : item
        )
      );
      setSelectedIds([]);
    }

    if (succeededCount === totalCount) {
      setAdminSuccessToast(`${succeededCount} of ${totalCount} updated`);
    } else {
      setAdminActionError(`${succeededCount} of ${totalCount} updated. Check your connection or permissions`);
    }
  };

  // Requirement: Add confirmation dialog for bulk status changes
  const handleBulkStatus = (status: string) => {
    if (selectedIds.length === 0) return;

    const count = selectedIds.length;
    const isCancel = status === 'cancelled';
    const formattedStatus = status.replace('_', ' ').toUpperCase();

    setConfirmDialog({
      isOpen: true,
      title: isCancel ? `Cancel ${count} Registrations?` : `Bulk Update to ${formattedStatus}?`,
      message: `You have selected ${count} attendee record${count > 1 ? 's' : ''}. Are you sure you want to change their status to "${status}"? This will update all selected records.`,
      confirmLabel: isCancel ? `Cancel ${count} Registrations` : `Update ${count} Registrations`,
      cancelLabel: 'Dismiss',
      variant: isCancel ? 'danger' : 'primary',
      onConfirm: async () => {
        setConfirmDialog(null);
        await executeBulkStatus(status);
      },
    });
  };

  // Settings Save to Firestore "settings/event"
  const handleSaveSettings = async () => {
    CONFIG.registration.status = regStatusSetting;
    CONFIG.registration.showCount = showCountSetting;
    const ok = await saveEventSettings({
      registrationCap: registrationCapSetting,
      registrationStatus: regStatusSetting,
      showCount: showCountSetting,
      status: regStatusSetting,
    });
    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      return;
    }
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  // Top Stat Cards Calculations (Registrations Tab Only)
  const stats = useMemo(() => {
    const total = registrations.length;
    const participants = registrations.filter(
      (r) => r.ticket === 'participant' || (!r.ticket && !r.wantsToPitch)
    ).length;
    const pitch = registrations.filter(
      (r) => r.ticket === 'pitch' || r.wantsToPitch
    ).length;

    const pitchVerified = registrations.filter((r) => {
      const isPitch = r.ticket === 'pitch' || r.wantsToPitch;
      const pStatus = r.payment?.status || r.paymentStatus;
      return isPitch && pStatus === 'verified';
    }).length;

    const pitchPending = registrations.filter((r) => {
      const isPitch = r.ticket === 'pitch' || r.wantsToPitch;
      const pStatus = r.payment?.status || r.paymentStatus || 'pending';
      return isPitch && pStatus === 'pending';
    }).length;

    const pitchFee = CONFIG.tickets.pitch.fee;
    const expectedRevenue = pitchVerified * pitchFee;

    const confirmed = registrations.filter((r) => r.status === 'confirmed').length;
    const registered = registrations.filter((r) => r.status === 'registered').length;
    const checkedIn = registrations.filter((r) => r.status === 'checked_in').length;
    const cancelled = registrations.filter((r) => r.status === 'cancelled').length;
    const waitlist = registrations.filter((r) => r.status === 'waitlist').length;
    const wantsToPitch = pitch;
    const students = registrations.filter((r) => r.role === 'Student').length;
    const founders = registrations.filter((r) => r.role === 'Founder').length;
    const others = total - (students + founders);

    const todayStr = new Date().toISOString().slice(0, 10);
    const today = registrations.filter((r) => safeDatePrefix(r.createdAt) === todayStr).length;

    return {
      total,
      participants,
      pitch,
      pitchVerified,
      pitchPending,
      pitchFee,
      expectedRevenue,
      confirmed,
      registered,
      checkedIn,
      cancelled,
      waitlist,
      wantsToPitch,
      students,
      founders,
      others,
      today,
    };
  }, [registrations]);

  // Available States from Registrations for State Filter
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    registrations.forEach((r) => {
      const st = typeof r.college === 'object' && r.college ? r.college.state : '';
      if (st && st.trim()) {
        set.add(st.trim());
      }
    });
    return Array.from(set).sort();
  }, [registrations]);

  // Daily Registrations for Small Bar Chart
  const dailyRegistrations = useMemo(() => {
    const map: Record<string, number> = {};
    registrations.forEach((r) => {
      const dateStr = safeDatePrefix(r.createdAt);
      if (!dateStr) return;
      map[dateStr] = (map[dateStr] || 0) + 1;
    });

    const sortedDates = Object.keys(map).sort();
    if (sortedDates.length === 0) {
      const today = new Date().toISOString().slice(0, 10);
      return [{ date: today, label: 'Today', count: 0 }];
    }

    // Return the last 7 recorded days
    const recentDates = sortedDates.slice(-7);
    return recentDates.map((dateStr) => {
      const parts = dateStr.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const label = `${monthNames[m] || ''} ${d || ''}`.trim() || dateStr;
      return {
        date: dateStr,
        label,
        count: map[dateStr] || 0,
      };
    });
  }, [registrations]);

  // Top 5 Colleges Breakdown
  const topColleges = useMemo(() => {
    const map: Record<string, number> = {};
    registrations.forEach((r) => {
      const col = getCollegeName(r.college).trim();
      if (!col) return;
      map[col] = (map[col] || 0) + 1;
    });

    return Object.entries(map)
      .map(([college, count]) => ({ college, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [registrations]);

  // Filtered & Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((r) => {
        // 1. General search query (Name, Email, Phone, Reg ID, UTR)
        const query = searchQuery.toLowerCase().trim();
        const pUtr = (r.payment?.utr || r.paymentUtr || '').toLowerCase();
        const matchesQuery =
          !query ||
          r.name.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.phone.includes(query) ||
          r.id.toLowerCase().includes(query) ||
          pUtr.includes(query);

        // 2. Dedicated college search
        const cQuery = collegeSearchQuery.toLowerCase().trim();
        const colName = getCollegeName(r.college).toLowerCase();
        const matchesCollege = !cQuery || colName.includes(cQuery);

        // 3. Ticket filter
        const isPitch = r.ticket === 'pitch' || r.wantsToPitch;
        const matchesTicket =
          ticketFilter === 'All' ||
          (ticketFilter === 'pitch' && isPitch) ||
          (ticketFilter === 'participant' && !isPitch);

        // 4. Payment status filter
        const pStatus = r.payment?.status || r.paymentStatus || (isPitch ? 'pending' : 'not_required');
        const matchesPayment =
          paymentStatusFilter === 'All' || pStatus === paymentStatusFilter;

        // 5. Email verified filter
        const matchesVerified =
          verifiedFilter === 'All' ||
          (verifiedFilter === 'verified' && Boolean(r.emailVerified)) ||
          (verifiedFilter === 'unverified' && !r.emailVerified);

        // 6. State filter
        const rState = (typeof r.college === 'object' && r.college ? r.college.state || '' : '').trim();
        const matchesState =
          stateFilter === 'All' || rState.toLowerCase() === stateFilter.toLowerCase();

        // 7. Role and status filters
        const matchesRole = roleFilter === 'All' || r.role === roleFilter;
        const matchesPitch =
          pitchFilter === 'All' ||
          (pitchFilter === 'Yes' && isPitch) ||
          (pitchFilter === 'No' && !isPitch);
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

        return (
          matchesQuery &&
          matchesCollege &&
          matchesTicket &&
          matchesPayment &&
          matchesVerified &&
          matchesState &&
          matchesRole &&
          matchesPitch &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        if (sortField === 'createdAt') {
          const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          const numA = isNaN(tA) ? 0 : tA;
          const numB = isNaN(tB) ? 0 : tB;
          if (numA < numB) return sortDirection === 'asc' ? -1 : 1;
          if (numA > numB) return sortDirection === 'asc' ? 1 : -1;
          return 0;
        }
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [
    registrations,
    searchQuery,
    collegeSearchQuery,
    ticketFilter,
    paymentStatusFilter,
    verifiedFilter,
    stateFilter,
    roleFilter,
    pitchFilter,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  // Paginated List
  const totalPages = Math.ceil(filteredRegistrations.length / pageSize) || 1;
  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRegistrations.slice(start, start + pageSize);
  }, [filteredRegistrations, currentPage]);

  // Pitch Applicants List
  const pitchApplicants = useMemo(() => {
    return registrations.filter((r) => r.ticket === 'pitch' || r.wantsToPitch);
  }, [registrations]);

  // Column Sort Handler
  const handleSort = (field: keyof AdminRegistration) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // CSV Exporters
  const handleExportRegistrations = () => {
    const exportData = registrations.map((r) => {
      const pStatus = r.payment?.status || r.paymentStatus || (r.ticket === 'pitch' ? 'pending' : 'not_required');
      const pAmount = r.payment ? Math.round(r.payment.amountPaise / 100) : (r.paymentAmount ?? 0);
      const pUtr = r.payment?.utr || r.paymentUtr || '';
      return {
        'Registration ID': r.id,
        'Ticket Code': r.ticketCode || '',
        Ticket: r.ticket || (r.wantsToPitch ? 'pitch' : 'participant'),
        Name: r.name,
        Email: r.email,
        'Email Verified': r.emailVerified ? 'Yes' : 'No',
        'Verified At': r.verifiedAt || '',
        Phone: r.phone,
        College: getCollegeName(r.college),
        'College State': typeof r.college === 'object' && r.college ? (r.college.state || '') : '',
        'College City': typeof r.college === 'object' && r.college ? (r.college.city || '') : '',
        'College Type': typeof r.college === 'object' && r.college ? (r.college.type || '') : '',
        'College Listed': typeof r.college === 'object' && r.college ? (r.college.listed ? 'Yes' : 'No') : '',
        Course: r.course || '',
        Year: r.year || '',
        Role: r.role,
        City: r.city,
        'Wants to Pitch': r.ticket === 'pitch' || r.wantsToPitch ? 'Yes' : 'No',
        'Startup Name': r.startupName || '',
        'Startup Pitch': r.startupPitch || '',
        Sector: r.sector || '',
        Stage: r.stage || '',
        'Pitch Deck Link': r.pitchDeckLink || '',
        'Team Size': r.teamSize || '',
        Status: r.status,
        'Pitch Status': r.pitchStatus || '',
        'Payment Status': pStatus.toUpperCase(),
        'Payment Required': (r.payment?.required ?? (r.ticket === 'pitch')) ? 'Yes' : 'No',
        'Payment Amount (INR)': pAmount,
        'Payment Amount (Paise)': r.payment?.amountPaise ?? (pAmount * 100),
        'Payment UTR': pUtr,
        'Payment Method': r.payment?.method || (pUtr ? 'upi' : ''),
        'Payment Verified By': r.paymentVerifiedBy || '',
        'Payment Verified At': r.paymentVerifiedAt || '',
        Notes: r.notes || '',
        'Registered At': r.createdAt,
      };
    });
    exportToCSV(exportData, 'StartupConclave-Registrations');
  };

  const handleExportPitch = () => {
    const exportData = pitchApplicants.map((r) => ({
      'Registration ID': r.id,
      'Ticket Code': r.ticketCode || '',
      'Startup Name': r.startupName || 'Untitled Venture',
      'One-Line Pitch': r.startupPitch || '',
      Sector: r.sector || '',
      Stage: r.stage || '',
      'Pitch Deck Link': r.pitchDeckLink || '',
      'Team Size': r.teamSize || '',
      'Founder Name': r.name,
      Email: r.email,
      Phone: r.phone,
      College: getCollegeName(r.college),
      Role: r.role,
      'Pitch Status': r.pitchStatus || 'Applied',
      'Payment Status': (r.payment?.status || r.paymentStatus || 'pending').toUpperCase(),
      'Payment UTR': r.payment?.utr || r.paymentUtr || '',
      Notes: r.notes || '',
      'Applied At': r.createdAt,
    }));
    exportToCSV(exportData, 'StartupConclave-PitchApplicants');
  };

  const handleExportPartners = () => {
    const exportData = partnerEnquiries.map((p) => ({
      ID: p.id,
      Company: p.company,
      'Contact Person': p.contactName,
      Email: p.email,
      Phone: p.phone || '',
      'Partnership Type': p.partnershipType || '',
      'Contribution Range': p.contributionRange || '',
      Message: p.message || '',
      Status: p.status || 'New',
      'Inquiry Date': p.createdAt,
    }));
    exportToCSV(exportData, 'StartupConclave-PartnerEnquiries');
  };

  // =========================================================================
  // CHECK-IN DESK LOGIC & HANDLERS (Mobile Optimised & Double Check-in Proof)
  // =========================================================================

  // Audio & Haptic feedback
  const triggerCheckinFeedback = (type: 'success' | 'warning' | 'error') => {
    try {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        if (type === 'success') navigator.vibrate([80, 40, 80]);
        else if (type === 'warning') navigator.vibrate([180, 80, 180]);
        else navigator.vibrate([250]);
      }
    } catch {
      // ignore
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === 'success') {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.22);
        osc.start();
        osc.stop(ctx.currentTime + 0.22);
      } else if (type === 'warning') {
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // ignore
    }
  };

  // Stop camera video stream & QR frame loop
  const stopQRScanner = () => {
    if (scanAnimationRef.current) {
      cancelAnimationFrame(scanAnimationRef.current);
      scanAnimationRef.current = null;
    }
    if (scanStreamRef.current) {
      scanStreamRef.current.getTracks().forEach((track) => track.stop());
      scanStreamRef.current = null;
    }
    setIsScanningQR(false);
  };

  // Scan video frame using jsQR
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
          handleScannedResult(code.data);
          return;
        }
      }
    }
    scanAnimationRef.current = requestAnimationFrame(scanVideoFrame);
  };

  // Start camera video stream
  const startQRScanner = async (facing: 'environment' | 'user' = cameraFacingMode) => {
    stopQRScanner();
    setCameraError(null);
    setIsScanningQR(true);
    setScanSuccessNotice(null);
    setScanLegacyWarning(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera is not supported on this device/browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: facing } },
      });
      scanStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        scanAnimationRef.current = requestAnimationFrame(scanVideoFrame);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setIsScanningQR(false);
      setCameraError(
        err?.name === 'NotAllowedError'
          ? 'Camera permission denied. Please allow camera access in browser settings, or enter the Registration ID / Phone manually.'
          : 'Camera unavailable. Please enter the Registration ID or Phone number manually.'
      );
    }
  };

  // Handle scanned QR payload (supports secure JSON {"id": "...", "t": "..."} and legacy plain ID)
  const handleScannedResult = (raw: string) => {
    if (!raw) return;
    const clean = raw.trim();

    let scannedId = '';
    let scannedTicketCode: string | null = null;

    // 1. Try structured JSON QR payload: {"id": registrationId, "t": ticketCode}
    try {
      const parsed = JSON.parse(clean);
      if (parsed && typeof parsed === 'object') {
        if (parsed.id) {
          scannedId = String(parsed.id).trim();
        }
        if (parsed.t) {
          scannedTicketCode = String(parsed.t).trim();
        }
      }
    } catch {
      // Not JSON
    }

    // 2. If not structured JSON, extract ID from URL or regex pattern (legacy pass support)
    if (!scannedId) {
      const idMatch = clean.match(/(SC1-\d{5}|SC1-[A-Za-z0-9]+)/i);
      if (idMatch) {
        scannedId = idMatch[1];
      } else {
        try {
          const parsedUrl = new URL(clean);
          const paramId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('regId');
          if (paramId) scannedId = paramId;
        } catch {
          // Not URL
        }
      }
      if (!scannedId) {
        scannedId = clean;
      }
    }

    const found = registrations.find(
      (r) =>
        r.id.toLowerCase() === scannedId.toLowerCase() ||
        (r.registrationId && r.registrationId.toLowerCase() === scannedId.toLowerCase()) ||
        r.docId === scannedId ||
        r.phone === clean
    );

    stopQRScanner();
    setCheckinQuery(scannedId);

    if (found) {
      setSelectedCheckinId(found.id);

      // Verify whether this pass has a ticketCode or is a legacy pass without ticketCode
      if (found.ticketCode) {
        if (scannedTicketCode) {
          if (scannedTicketCode === found.ticketCode) {
            triggerCheckinFeedback('success');
            setScanLegacyWarning(null);
            setScanSuccessNotice(`Verified Secure Pass: ${found.name} (${found.id})`);
          } else {
            // Mismatch between scanned ticket code and registered code
            triggerCheckinFeedback('error');
            setScanLegacyWarning(`SECURITY ALERT: Scanned ticket code does not match registered security code for ${found.id}. Verify attendee identity.`);
            setScanSuccessNotice(`Security Mismatch: ${found.name} (${found.id})`);
          }
        } else {
          // Registration has ticketCode, but the scanned QR did not supply one (legacy pass format scanned)
          triggerCheckinFeedback('warning');
          setScanLegacyWarning(`Legacy pass warning: Scanned pass without ticket code for ${found.id}. Matched by ID only.`);
          setScanSuccessNotice(`Identified Pass: ${found.name} (${found.id}) [Legacy Pass Warning]`);
        }
      } else {
        // Requirement 3: Old registrations without ticketCode: scanner falls back to ID-only match and shows a "legacy pass" warning.
        triggerCheckinFeedback('warning');
        setScanLegacyWarning(`Legacy pass warning: Registration ${found.id} was created prior to ticket codes. Matched by ID only.`);
        setScanSuccessNotice(`Identified Pass: ${found.name} (${found.id}) [Legacy Pass]`);
      }
    } else {
      triggerCheckinFeedback('warning');
      setScanLegacyWarning(null);
      setScanSuccessNotice(`Scanned "${scannedId}". No matching registration record found.`);
    }
  };

  // Clean up camera on tab change
  useEffect(() => {
    if (activeTab !== 'checkin') {
      stopQRScanner();
    }
    return () => {
      stopQRScanner();
    };
  }, [activeTab]);

  // Execute Check-in with strict double check-in prevention
  const handlePerformCheckIn = async (target: AdminRegistration) => {
    // REQUIREMENT: Prevent double check-in with a clear warning
    if (target.status === 'checked_in') {
      triggerCheckinFeedback('warning');
      const timeStr = target.checkInTime || target.checkedInAt || target.updatedAt
        ? safeFormatTime(target.checkInTime || target.checkedInAt || target.updatedAt)
        : 'earlier';
      setCheckinDoubleWarning(
        `DOUBLE CHECK-IN WARNING: ${target.name} (${target.id}) was ALREADY checked in at ${timeStr} by ${target.updatedBy || 'organizer'}.`
      );
      return;
    }

    if (target.status === 'cancelled') {
      triggerCheckinFeedback('error');
      setCheckinDoubleWarning(
        `CANNOT CHECK IN: Registration for ${target.name} (${target.id}) is CANCELLED.`
      );
      return;
    }

    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
    const timestamp = new Date().toISOString();

    const updates = {
      status: 'checked_in',
      checkInTime: timestamp,
      updatedAt: timestamp,
      updatedBy: adminEmail,
    };

    const ok = await updateRegistration(target.id, updates, target.docId);
    if (!ok) {
      setAdminActionError('Could not save. Check your connection or permissions');
      triggerCheckinFeedback('error');
      return;
    }

    const updatedRecord: AdminRegistration = {
      ...target,
      ...updates,
    };

    setRegistrations((prev) =>
      prev.map((item) => (item.id === target.id ? updatedRecord : item))
    );

    setJustCheckedInRecord(updatedRecord);
    setCheckinDoubleWarning(null);
    triggerCheckinFeedback('success');

    // 5-second undo toast
    setUndoToast({
      id: target.id,
      name: target.name,
      previousStatus: target.status,
      newStatus: 'checked_in',
      secondsRemaining: 5,
    });
  };

  // Revert check-in if made in error
  const handleRevertCheckIn = (target: AdminRegistration) => {
    setConfirmDialog({
      isOpen: true,
      title: `Revert Check-in for ${target.name}?`,
      message: `Are you sure you want to revert ${target.name} (${target.id}) back to "registered"? This will reset their checked-in entry status.`,
      confirmLabel: 'Revert to Registered',
      cancelLabel: 'Keep Checked-in',
      variant: 'warning',
      onConfirm: async () => {
        setConfirmDialog(null);
        const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
        const timestamp = new Date().toISOString();
        const updates = {
          status: 'registered',
          checkInTime: undefined,
          updatedAt: timestamp,
          updatedBy: adminEmail,
        };
        const ok = await updateRegistration(target.id, updates, target.docId);
        if (!ok) {
          setAdminActionError('Could not save. Check your connection or permissions');
          return;
        }
        setRegistrations((prev) =>
          prev.map((item) => (item.id === target.id ? { ...item, ...updates } : item))
        );
        if (justCheckedInRecord?.id === target.id) {
          setJustCheckedInRecord(null);
        }
      },
    });
  };

  // Check-in search results (by registration ID, phone, or name)
  const checkinSearchResults = useMemo(() => {
    const q = checkinQuery.trim().toLowerCase();
    const phoneDigits = checkinQuery.replace(/\D/g, '');

    return registrations.filter((r) => {
      if (checkinFilter === 'pending' && r.status === 'checked_in') return false;
      if (checkinFilter === 'checked_in' && r.status !== 'checked_in') return false;

      if (!q) return true;

      const idMatch =
        r.id.toLowerCase().includes(q) ||
        (r.registrationId && r.registrationId.toLowerCase().includes(q));
      const nameMatch = r.name.toLowerCase().includes(q);
      const emailMatch = r.email.toLowerCase().includes(q);
      const collegeMatch = getCollegeName(r.college).toLowerCase().includes(q);
      const phoneMatch = phoneDigits.length >= 3 && r.phone.replace(/\D/g, '').includes(phoneDigits);

      return idMatch || nameMatch || emailMatch || collegeMatch || phoneMatch;
    });
  }, [registrations, checkinQuery, checkinFilter]);

  // Primary active attendee for the big Result Card
  const activeCheckinAttendee = useMemo(() => {
    if (selectedCheckinId) {
      const found = registrations.find((r) => r.id === selectedCheckinId);
      if (found) return found;
    }
    if (checkinQuery.trim() && checkinSearchResults.length > 0) {
      return checkinSearchResults[0];
    }
    return null;
  }, [selectedCheckinId, registrations, checkinSearchResults, checkinQuery]);

  // Recent Check-ins timeline
  const recentCheckins = useMemo(() => {
    return registrations
      .filter((r) => r.status === 'checked_in')
      .sort((a, b) => {
        const getTs = (item: AdminRegistration) => {
          const val = item.checkInTime || item.checkedInAt || item.updatedAt || item.createdAt;
          if (!val) return 0;
          const t = new Date(val).getTime();
          return isNaN(t) ? 0 : t;
        };
        return getTs(b) - getTs(a);
      })
      .slice(0, 8);
  }, [registrations]);

  // =========================================================================
  // VIEW A: AUTH LOGIN / ACCESS GATE
  // =========================================================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] text-[#111111] flex items-center justify-center font-mono text-sm">
        <div className="p-4 bg-white brutal-border brutal-shadow flex items-center gap-3">
          <Clock className="w-5 h-5 text-[#FF6B1A] animate-spin" />
          <span>Verifying Administrator Session...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] text-[#111111] font-sans flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white brutal-border brutal-shadow-lg p-6 sm:p-8 space-y-6 text-left">
          
          <div className="border-b-2 border-[#111111] pb-4 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase bg-[#FFD400] px-2 py-0.5 border border-[#111111]">
                ADMIN GATEWAY
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl text-[#111111] pt-1">
              Secretariat Portal
            </h1>
            <p className="text-xs text-[#111111]/70">
              Restricted to authorized conclave administrators.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {lockoutSeconds > 0 && (
            <div className="p-3 bg-[#FFD400]/30 border-2 border-[#111111] text-[#111111] text-xs font-mono font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#FF6B1A] shrink-0" />
              <span>Too many failed attempts. Form locked for {lockoutSeconds}s.</span>
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4 font-sans text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#111111] block">Admin Email Address *</label>
              <input
                type="email"
                required
                disabled={lockoutSeconds > 0 || authSubmitting}
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#111111] block">Password *</label>
              <input
                type="password"
                required
                disabled={lockoutSeconds > 0 || authSubmitting}
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={lockoutSeconds > 0 || authSubmitting}
                className="w-full brutal-btn bg-[#FF6B1A] text-white px-5 py-2.5 font-display font-bold text-xs uppercase cursor-pointer flex items-center justify-center min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {lockoutSeconds > 0
                  ? `Locked (${lockoutSeconds}s)`
                  : authSubmitting
                  ? 'Authenticating...'
                  : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="pt-3 border-t-2 border-[#111111] text-[11px] font-mono text-[#111111]/60 text-center">
            Startup Conclave 1.0 · DVSIET Meerut
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#111111] font-sans text-left">
      
      {/* Top Navbar */}
      <header className="bg-white border-b-2 border-[#111111] px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <a href="/" className="font-display font-extrabold text-base sm:text-lg text-[#111111] hover:text-[#FF6B1A]">
            STARTUP CONCLAVE 1.0
          </a>
          <span className="font-mono text-xs font-black bg-[#FFD400] text-[#111111] px-2 py-0.5 border border-[#111111]">
            ADMIN CONSOLE
          </span>
        </div>

        {/* Tab Switchers */}
        <nav className="flex items-center gap-1.5 font-mono text-xs font-bold overflow-x-auto max-w-full py-1">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'registrations' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Registrations ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('checkin')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'checkin'
                ? 'bg-[#FF6B1A] text-white shadow-[2px_2px_0px_#111111]'
                : 'bg-white hover:bg-[#FFF2D6] text-[#111111]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Check-in ({stats.checkedIn}/{stats.total})</span>
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'pitch' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Pitch Applicants ({pitchApplicants.length})
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'partners' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Partners ({partnerEnquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'settings' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Settings
          </button>
        </nav>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="hidden sm:inline text-[#111111]/70">{currentUser.email}</span>
          <button
            onClick={handleLogout}
            className="p-1.5 border border-[#111111] bg-white hover:bg-red-50 text-red-600 flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* =================================================================== */}
        {/* TAB 1: REGISTRATIONS TABLE                                          */}
        {/* =================================================================== */}
        {activeTab === 'registrations' && (
          <div className="space-y-6">

            {/* STATS CARDS BAR (Rendered ONLY on Registrations Tab) */}
            <div className="space-y-4">
              
              {/* Row 1: The 6 Key Stat Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                
                {/* 1. Total */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#111111]/75 uppercase tracking-wide">
                      Total
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#111111]" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
                    {stats.total}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-[#FF6B1A] truncate">
                    {stats.waitlist > 0 ? `${stats.waitlist} on waitlist` : `Cap: ${registrationCapSetting}`}
                  </div>
                </div>

                {/* 2. Participants */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#111111]/75 uppercase tracking-wide">
                      Participants
                    </span>
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-blue-900">
                    {stats.participants}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-[#111111]/70 truncate">
                    Standard attendee
                  </div>
                </div>

                {/* 3. Pitch */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#111111]/75 uppercase tracking-wide">
                      Pitch
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#FF6B1A]">
                    {stats.pitch}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-[#111111]/70 truncate">
                    Pitch applicants
                  </div>
                </div>

                {/* 4. Pitch Payments Verified */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#111111]/75 uppercase tracking-wide">
                      Pitch Verified
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-emerald-700">
                    {stats.pitchVerified}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-emerald-800 truncate">
                    Confirmed payments
                  </div>
                </div>

                {/* 5. Pitch Payments Pending */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#111111]/75 uppercase tracking-wide">
                      Pitch Pending
                    </span>
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-amber-700">
                    {stats.pitchPending}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-amber-900 truncate">
                    Awaiting verification
                  </div>
                </div>

                {/* 6. Expected Revenue = verified x fee */}
                <div className="p-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] sm:text-[11px] font-black text-[#111111]/75 uppercase tracking-wide">
                      Expected Revenue
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#FFD400]" />
                  </div>
                  <div className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
                    ₹{stats.expectedRevenue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] font-mono font-bold text-[#FF6B1A] truncate" title={`${stats.pitchVerified} verified × ₹${stats.pitchFee}`}>
                    {stats.pitchVerified} verified × ₹{stats.pitchFee}
                  </div>
                </div>

              </div>

              {/* Row 2: Registrations Per Day (Small Bar Chart) + Top 5 Colleges */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                
                {/* Registrations Per Day (Small Bar Chart) */}
                <div className="lg:col-span-7 p-4 sm:p-5 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-[#111111]/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-[#FF6B1A]" />
                      <h4 className="font-display font-black text-xs sm:text-sm uppercase text-[#111111] tracking-wide">
                        Registrations Per Day
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#111111] bg-[#FFD400] px-2 py-0.5 border border-[#111111]">
                      Today: {stats.today}
                    </span>
                  </div>

                  {/* Chart Canvas Area */}
                  <div className="pt-2">
                    <div className="h-32 sm:h-36 flex items-end justify-between gap-2 px-1 pb-1 border-b-2 border-[#111111]">
                      {dailyRegistrations.map((item, idx) => {
                        const maxCount = Math.max(...dailyRegistrations.map((d) => d.count), 1);
                        const heightPercent = Math.max(
                          Math.round((item.count / maxCount) * 100),
                          item.count > 0 ? 14 : 4
                        );
                        return (
                          <div
                            key={item.date || idx}
                            className="flex-1 flex flex-col items-center h-full justify-end group cursor-default"
                          >
                            {/* Value label on top of bar */}
                            <span className="font-mono text-[11px] font-black text-[#111111] mb-1 group-hover:scale-110 transition-transform">
                              {item.count}
                            </span>
                            {/* Bar */}
                            <div
                              className="w-full max-w-[42px] bg-[#FFD400] group-hover:bg-[#FF6B1A] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] transition-all duration-200"
                              style={{ height: `${heightPercent}%` }}
                              title={`${item.date}: ${item.count} registrations`}
                            />
                            {/* Date Label */}
                            <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#111111]/80 mt-2 truncate max-w-full text-center">
                              {item.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between pt-2 text-[11px] font-mono text-[#111111]/70">
                      <span>Recent daily intake breakdown</span>
                      <span className="font-bold text-[#111111]">
                        Peak: {Math.max(...dailyRegistrations.map((d) => d.count), 0)} / day
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top 5 Colleges */}
                <div className="lg:col-span-5 p-4 sm:p-5 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex flex-col justify-between space-y-3">
                  <div className="flex items-center justify-between border-b border-[#111111]/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#FF6B1A]" />
                      <h4 className="font-display font-black text-xs sm:text-sm uppercase text-[#111111] tracking-wide">
                        Top 5 Colleges
                      </h4>
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#111111]/70 bg-[#FFF2D6] px-2 py-0.5 border border-[#111111]">
                      {topColleges.length} Active
                    </span>
                  </div>

                  {/* List of Colleges */}
                  {topColleges.length === 0 ? (
                    <div className="py-8 text-center font-mono text-xs text-[#111111]/60">
                      No college data registered yet.
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {topColleges.map((item, index) => {
                        const percent = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                        const rankStyles = [
                          'bg-[#FFD400] text-[#111111]', // #1
                          'bg-[#FF6B1A] text-white',     // #2
                          'bg-[#111111] text-[#FFD400]', // #3
                          'bg-[#FFF2D6] text-[#111111]', // #4
                          'bg-white text-[#111111]',      // #5
                        ];
                        return (
                          <div key={item.college} className="space-y-1">
                            <div className="flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2 truncate">
                                <span
                                  className={`font-mono text-[10px] font-black px-1.5 py-0.5 border border-[#111111] shrink-0 shadow-[1px_1px_0px_#111111] ${
                                    rankStyles[index] || 'bg-white text-[#111111]'
                                  }`}
                                >
                                  #{index + 1}
                                </span>
                                <span
                                  className="font-bold text-[#111111] truncate"
                                  title={item.college}
                                >
                                  {item.college}
                                </span>
                              </div>
                              <span className="font-mono font-black text-xs text-[#111111] shrink-0">
                                {item.count}{' '}
                                <span className="font-normal text-[10px] text-[#111111]/60">
                                  ({percent}%)
                                </span>
                              </span>
                            </div>
                            {/* Horizontal visual indicator */}
                            <div className="w-full bg-[#FFF2D6] h-2 border border-[#111111] overflow-hidden">
                              <div
                                className="bg-[#111111] h-full"
                                style={{ width: `${Math.min(100, percent)}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-1 text-[11px] font-mono text-[#111111]/70 border-t border-[#111111]/10 flex items-center justify-between">
                    <span>Ranked by verified registrant volume</span>
                  </div>
                </div>

              </div>

            </div>
            
            {/* Action Bar: Search, Filters & Export */}
            <div className="p-4 bg-white brutal-border brutal-shadow-sm flex flex-col gap-3 text-xs">
              
              {/* Row 1: Search Inputs (General & College Search) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search name, email, phone, ID, UTR..."
                    className="w-full p-2 pl-8 bg-[#FFF8EC] border border-[#111111] font-sans focus:outline-none focus:bg-white text-xs"
                  />
                  <Search className="w-3.5 h-3.5 text-[#111111]/60 absolute left-2.5 top-2.5" />
                </div>

                <div className="relative flex-1 sm:max-w-xs">
                  <input
                    type="text"
                    value={collegeSearchQuery}
                    onChange={(e) => {
                      setCollegeSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search college name..."
                    className="w-full p-2 pl-8 bg-[#FFF8EC] border border-[#111111] font-sans focus:outline-none focus:bg-white text-xs"
                  />
                  <GraduationCap className="w-3.5 h-3.5 text-[#111111]/60 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Row 2: Select Filters & Export CSV */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#111111]/10">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Ticket Filter */}
                  <select
                    value={ticketFilter}
                    onChange={(e) => {
                      setTicketFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                  >
                    <option value="All">All Tickets</option>
                    <option value="participant">Participant</option>
                    <option value="pitch">Pitch</option>
                  </select>

                  {/* Payment Status Filter */}
                  <select
                    value={paymentStatusFilter}
                    onChange={(e) => {
                      setPaymentStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                  >
                    <option value="All">All Payments</option>
                    <option value="not_required">Not Required</option>
                    <option value="pending">Pending</option>
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>

                  {/* Verified Filter */}
                  <select
                    value={verifiedFilter}
                    onChange={(e) => {
                      setVerifiedFilter(e.target.value as any);
                      setCurrentPage(1);
                    }}
                    className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                  >
                    <option value="All">All Verification</option>
                    <option value="verified">Verified</option>
                    <option value="unverified">Unverified</option>
                  </select>

                  {/* State Filter */}
                  <select
                    value={stateFilter}
                    onChange={(e) => {
                      setStateFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                  >
                    <option value="All">All States ({availableStates.length})</option>
                    {availableStates.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  {/* Role Filter */}
                  <select
                    value={roleFilter}
                    onChange={(e) => {
                      setRoleFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                  >
                    <option value="All">All Roles</option>
                    <option value="Student">Students</option>
                    <option value="Founder">Founders</option>
                    <option value="Professional">Professionals</option>
                    <option value="Other">Others</option>
                  </select>

                  {/* Registration Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                  >
                    <option value="All">All Statuses ({registrations.length})</option>
                    <option value="registered">Registered</option>
                    <option value="waitlist">Waitlist ({stats.waitlist})</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="checked_in">Checked-in</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Export CSV Button */}
                <button
                  onClick={handleExportRegistrations}
                  className="brutal-btn bg-[#FFD400] text-[#111111] px-3 py-2 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>

            </div>

            {/* Bulk Actions Banner (When items are selected) */}
            {selectedIds.length > 0 && (
              <div className="p-3 bg-[#FFD400] border-2 border-[#111111] flex flex-wrap items-center justify-between gap-3 text-xs font-mono font-bold animate-in fade-in">
                <span>Selected: {selectedIds.length} registration(s)</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleBulkStatus('confirmed')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-emerald-50 text-emerald-900 cursor-pointer"
                  >
                    Mark Confirmed
                  </button>
                  <button
                    onClick={() => handleBulkStatus('waitlist')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-amber-50 text-amber-950 font-bold cursor-pointer"
                  >
                    Mark Waitlist
                  </button>
                  <button
                    onClick={() => handleBulkStatus('checked_in')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-blue-50 text-blue-900 cursor-pointer"
                  >
                    Mark Checked-in
                  </button>
                  <button
                    onClick={() => handleBulkStatus('cancelled')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-red-50 text-red-900 cursor-pointer"
                  >
                    Mark Cancelled
                  </button>
                  <button
                    onClick={handleBulkDelete}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 border border-[#111111] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-[#111111] underline ml-2 cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="bg-white brutal-border brutal-shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead className="bg-[#FFF2D6] border-b-2 border-[#111111] font-mono text-[11px] uppercase text-[#111111]">
                  <tr>
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={selectedIds.length > 0 && selectedIds.length === filteredRegistrations.length}
                        onChange={handleSelectAll}
                        className="w-3.5 h-3.5 accent-[#FF6B1A]"
                      />
                    </th>
                    <th onClick={() => handleSort('id')} className="p-3 cursor-pointer hover:bg-[#FFD400]/50">
                      <div className="flex items-center gap-1">
                        <span>Reg ID</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th onClick={() => handleSort('name')} className="p-3 cursor-pointer hover:bg-[#FFD400]/50">
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3 text-center">Ticket</th>
                    <th className="p-3 text-center">Verified</th>
                    <th className="p-3">College (+ state)</th>
                    <th className="p-3 text-center">Payment status</th>
                    <th className="p-3">UTR</th>
                    <th className="p-3">Status</th>
                    <th onClick={() => handleSort('createdAt')} className="p-3 cursor-pointer hover:bg-[#FFD400]/50">
                      <div className="flex items-center gap-1">
                        <span>Date</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#111111]/10">
                  {paginatedRegistrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="hover:bg-[#FFF8EC] transition-colors cursor-pointer"
                      onClick={() => {
                        setActiveDetailItem(reg);
                        setDetailNotes(reg.notes || '');
                      }}
                    >
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(reg.id)}
                          onChange={() => handleSelectRow(reg.id)}
                          className="w-3.5 h-3.5 accent-[#FF6B1A]"
                        />
                      </td>
                      <td className="p-3 font-mono font-bold text-[#FF6B1A]">
                        {reg.id}
                      </td>
                      <td className="p-3 font-bold text-[#111111]">
                        {reg.name}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#111111]/80">
                        <div>{reg.email}</div>
                        <div className="text-[10px] text-[#111111]/60">{reg.phone}</div>
                      </td>
                      <td className="p-3 text-center">
                        {reg.ticket === 'pitch' || reg.wantsToPitch ? (
                          <span className="font-mono text-[10px] font-bold text-white bg-[#FF6B1A] px-1.5 py-0.5 border border-[#111111]">
                            PITCH
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-[#111111] bg-[#FFD400] px-1.5 py-0.5 border border-[#111111]">
                            PARTICIPANT
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {reg.emailVerified ? (
                          <span className="font-mono text-[10px] font-bold text-emerald-950 bg-emerald-100 px-1.5 py-0.5 border border-emerald-600 inline-flex items-center gap-1" title={reg.verifiedAt ? `Verified: ${safeFormatDateTime(reg.verifiedAt)}` : 'Verified'}>
                            <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                            <span>YES</span>
                          </span>
                        ) : (
                          <span className="font-mono text-[10px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 border border-stone-300">
                            NO
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-[11px] max-w-[180px]">
                        <div className="font-bold text-[#111111] truncate" title={getCollegeName(reg.college)}>
                          {getCollegeName(reg.college) || '—'}
                        </div>
                        {getCollegeState(reg.college) ? (
                          <div className="text-[10px] font-mono text-[#111111]/60 truncate">
                            {getCollegeState(reg.college)}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {(() => {
                          const isPitch = reg.ticket === 'pitch' || reg.wantsToPitch;
                          const pStatus = reg.payment?.status || reg.paymentStatus || (isPitch ? 'pending' : 'not_required');
                          const isPendingPitch = isPitch && pStatus === 'pending';

                          return (
                            <div className="flex flex-col items-center gap-1">
                              <span
                                className={`font-mono text-[10px] font-bold px-1.5 py-0.5 border border-[#111111] uppercase ${
                                  pStatus === 'verified'
                                    ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                                    : pStatus === 'pending'
                                    ? 'bg-amber-100 text-amber-950 border-amber-600'
                                    : pStatus === 'rejected'
                                    ? 'bg-red-100 text-red-900 border-red-600'
                                    : 'bg-stone-100 text-[#111111]/70'
                                }`}
                              >
                                {pStatus === 'not_required' ? 'NOT REQUIRED' : pStatus}
                              </span>
                              {isPendingPitch && (
                                <div className="flex items-center gap-1 mt-0.5">
                                  <button
                                    type="button"
                                    disabled={actionInProgressId === reg.id}
                                    onClick={() => handleMarkPayment(reg, 'verified')}
                                    className="px-1.5 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold border border-[#111111] text-[9px] uppercase cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-[1px_1px_0px_#111111]"
                                    title="Mark Verified"
                                  >
                                    {actionInProgressId === reg.id ? '...' : 'Mark verified'}
                                  </button>
                                  <button
                                    type="button"
                                    disabled={actionInProgressId === reg.id}
                                    onClick={() => handleMarkPayment(reg, 'rejected')}
                                    className="px-1.5 py-0.5 bg-red-100 hover:bg-red-200 text-red-950 font-bold border border-[#111111] text-[9px] uppercase cursor-pointer disabled:opacity-50 whitespace-nowrap shadow-[1px_1px_0px_#111111]"
                                    title="Reject Payment"
                                  >
                                    {actionInProgressId === reg.id ? '...' : 'Reject'}
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#111111]">
                        {(() => {
                          const utr = reg.payment?.utr || reg.paymentUtr;
                          return utr ? (
                            <span className="font-bold tracking-wider select-all" title={utr}>
                              {utr}
                            </span>
                          ) : (
                            <span className="text-[#111111]/40">—</span>
                          );
                        })()}
                      </td>
                      <td className="p-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={reg.status || 'registered'}
                          onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                          className={`font-mono text-[10px] font-bold p-1 border border-[#111111] uppercase rounded-none ${
                            reg.status === 'confirmed'
                              ? 'bg-emerald-100 text-emerald-900'
                              : reg.status === 'checked_in'
                              ? 'bg-blue-100 text-blue-900'
                              : reg.status === 'waitlist'
                              ? 'bg-amber-200 text-amber-950 font-black'
                              : reg.status === 'cancelled'
                              ? 'bg-red-100 text-red-900'
                              : 'bg-[#FFF8EC] text-[#111111]'
                          }`}
                        >
                          <option value="registered">Registered</option>
                          <option value="waitlist">Waitlist</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked-in</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#111111]/60 whitespace-nowrap">
                        {safeFormatDate(reg.createdAt)}
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={resendingRegId === reg.id}
                            onClick={() => handleAdminResend(reg)}
                            className="px-2 py-1 border border-[#111111] bg-white hover:bg-[#FFF8EC] font-mono text-[10px] font-bold cursor-pointer flex items-center gap-1 disabled:opacity-50"
                            title={`Resend confirmation email to ${reg.email}`}
                          >
                            <Mail className="w-3 h-3 text-[#FF6B1A]" />
                            <span>{resendingRegId === reg.id ? 'Sending...' : 'Resend'}</span>
                          </button>
                          <button
                            onClick={() => {
                              setActiveDetailItem(reg);
                              setDetailNotes(reg.notes || '');
                            }}
                            className="px-2 py-1 border border-[#111111] bg-white hover:bg-[#FFD400] font-mono text-[10px] font-bold cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => handleDeleteRegistration(reg)}
                            className="p-1 border border-[#111111] bg-white hover:bg-red-50 text-red-600 font-mono text-[10px] font-bold cursor-pointer transition-colors"
                            title="Delete registration"
                            aria-label={`Delete registration for ${reg.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={12} className="p-8 text-center text-[#111111]/60 font-mono">
                        No registrations match the selected filters or query.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between font-mono text-xs text-[#111111]/70 pt-1">
              <span>
                Showing {Math.min(filteredRegistrations.length, (currentPage - 1) * pageSize + 1)} to{' '}
                {Math.min(filteredRegistrations.length, currentPage * pageSize)} of {filteredRegistrations.length}
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="p-1.5 border border-[#111111] bg-white disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 font-bold">
                  {currentPage} / {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="p-1.5 border border-[#111111] bg-white disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB: CHECK-IN DESK (Optimised for Mobile & Venue Gate Verification) */}
        {/* =================================================================== */}
        {activeTab === 'checkin' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            {/* 1. COUNTER BANNER: "Checked in: X / Y" */}
            <div className="p-4 sm:p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="font-mono text-xs font-black uppercase text-[#111111] tracking-wider">
                      Gate Check-in Desk · DVSIET Meerut
                    </span>
                  </div>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-[#111111] leading-tight">
                    Attendee Check-in
                  </h2>
                </div>

                {/* Counter Pill */}
                <div className="p-3 sm:p-4 bg-[#FFD400] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-left sm:text-right">
                  <div className="font-mono text-[10px] sm:text-xs font-black uppercase text-[#111111]/80">
                    Live Venue Admission
                  </div>
                  <div className="font-mono font-black text-2xl sm:text-3xl text-[#111111]">
                    Checked in: <span className="text-[#FF6B1A]">{stats.checkedIn}</span> / {stats.total}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Sub-stats */}
              <div className="space-y-1.5">
                <div className="w-full bg-[#FFF2D6] h-3.5 border-2 border-[#111111] overflow-hidden">
                  <div
                    className="bg-[#FF6B1A] h-full transition-all duration-300"
                    style={{
                      width: `${stats.total > 0 ? Math.min(100, Math.round((stats.checkedIn / stats.total) * 100)) : 0}%`,
                    }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-bold text-[#111111]">
                  <span>
                    Turnout:{' '}
                    <strong className="text-[#FF6B1A]">
                      {stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0}%
                    </strong>
                  </span>
                  <span>Admitted: {stats.checkedIn}</span>
                  <span>Pending Entry: {Math.max(0, stats.total - stats.checkedIn)}</span>
                  <span>Waitlist: {stats.waitlist}</span>
                </div>
              </div>
            </div>

            {/* Check-in Open Error Toast */}
            {checkinOpenErrorToast && (
              <div
                role="alert"
                className="p-3 bg-rose-100 border-2 border-rose-600 shadow-[2px_2px_0px_#e11d48] text-xs font-mono text-rose-950 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 stroke-[2.5]" />
                  <span className="font-bold">{checkinOpenErrorToast}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCheckinOpenErrorToast(null)}
                  className="p-1 hover:bg-rose-200 cursor-pointer"
                  aria-label="Dismiss error"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Check-in Open Toggle Card */}
            <div className="p-4 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-base sm:text-lg text-[#111111]">
                      Check-in open
                    </span>
                    <span
                      className={`font-mono text-[10px] font-bold px-2 py-0.5 border border-[#111111] ${
                        checkinOpen
                          ? 'bg-emerald-300 text-emerald-950 shadow-[1px_1px_0px_#111111]'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      {checkinOpen ? 'OPEN' : 'CLOSED'}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-[#111111]/70">
                    Controls whether volunteer scanners can verify and check in attendees.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={checkinOpen}
                    disabled={isUpdatingCheckinOpen}
                    onClick={handleToggleCheckinOpen}
                    className={`px-4 py-2 border-2 border-[#111111] font-mono font-black text-xs uppercase cursor-pointer transition-all ${
                      checkinOpen
                        ? 'bg-[#FFD400] text-[#111111] shadow-[2px_2px_0px_#111111] hover:bg-[#ffe033]'
                        : 'bg-white text-[#111111]/60 shadow-[2px_2px_0px_#111111] hover:bg-[#FFF2D6]'
                    } ${isUpdatingCheckinOpen ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    {isUpdatingCheckinOpen ? 'Updating...' : checkinOpen ? 'Check-in open (ON)' : 'Check-in open (OFF)'}
                  </button>
                </div>
              </div>

              {/* Volunteer setup help note */}
              <div className="p-2.5 bg-[#FFF8EC] border border-[#111111]/30 font-mono text-xs text-[#111111]/80 flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF6B1A] shrink-0" />
                <span>
                  Volunteers: create user in Firebase Auth, then add volunteers/{'{uid}'} doc.
                </span>
              </div>
            </div>

            {/* 2. BIG SEARCH BOX & QR SCAN TOGGLE (Optimised for Mobile) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                {/* Big Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-[#111111]/60" />
                  <input
                    type="text"
                    value={checkinQuery}
                    onChange={(e) => {
                      setCheckinQuery(e.target.value);
                      setSelectedCheckinId(null);
                      setCheckinDoubleWarning(null);
                    }}
                    placeholder="Search by ID (SC1-00001), phone, or name..."
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    className="w-full pl-12 pr-12 py-3.5 sm:py-4 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-base sm:text-lg font-mono font-bold text-[#111111] placeholder:font-sans placeholder:font-normal placeholder:text-[#111111]/50 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]"
                  />
                  {checkinQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setCheckinQuery('');
                        setSelectedCheckinId(null);
                        setCheckinDoubleWarning(null);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 bg-[#FFF2D6] hover:bg-[#FFD400] border border-[#111111] cursor-pointer"
                      title="Clear Search"
                    >
                      <X className="w-4 h-4 text-[#111111]" />
                    </button>
                  )}
                </div>

                {/* QR Scanner Toggle Button */}
                <button
                  type="button"
                  onClick={() => {
                    if (isScanningQR) {
                      stopQRScanner();
                    } else {
                      startQRScanner();
                    }
                  }}
                  className={`px-5 py-3.5 border-2 border-[#111111] shadow-[3px_3px_0px_#111111] font-display font-black text-sm sm:text-base uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:translate-x-0.5 active:translate-y-0.5 ${
                    isScanningQR
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-[#111111] text-[#FFD400] hover:bg-[#222222]'
                  }`}
                >
                  {isScanningQR ? (
                    <>
                      <X className="w-5 h-5" />
                      <span>Stop Camera</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5 text-[#FFD400]" />
                      <span>Scan Ticket QR</span>
                    </>
                  )}
                </button>
              </div>

              {/* Filter Chips */}
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
                <span className="text-[#111111]/70 mr-1">Filter list:</span>
                <button
                  type="button"
                  onClick={() => setCheckinFilter('all')}
                  className={`px-3 py-1 border border-[#111111] cursor-pointer ${
                    checkinFilter === 'all'
                      ? 'bg-[#111111] text-[#FFD400]'
                      : 'bg-white hover:bg-[#FFF2D6]'
                  }`}
                >
                  All ({registrations.length})
                </button>
                <button
                  type="button"
                  onClick={() => setCheckinFilter('pending')}
                  className={`px-3 py-1 border border-[#111111] cursor-pointer ${
                    checkinFilter === 'pending'
                      ? 'bg-[#111111] text-[#FFD400]'
                      : 'bg-white hover:bg-[#FFF2D6]'
                  }`}
                >
                  Pending Entry ({registrations.filter((r) => r.status !== 'checked_in').length})
                </button>
                <button
                  type="button"
                  onClick={() => setCheckinFilter('checked_in')}
                  className={`px-3 py-1 border border-[#111111] cursor-pointer ${
                    checkinFilter === 'checked_in'
                      ? 'bg-[#111111] text-[#FFD400]'
                      : 'bg-white hover:bg-[#FFF2D6]'
                  }`}
                >
                  Checked In ({stats.checkedIn})
                </button>
              </div>
            </div>

            {/* 3. OPTIONAL QR SCANNER VIEWPORT (Device Camera) */}
            {isScanningQR && (
              <div className="p-4 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-3">
                <div className="flex items-center justify-between border-b border-[#111111]/20 pb-2">
                  <div className="flex items-center gap-2 font-display font-black text-sm text-[#111111]">
                    <Camera className="w-4 h-4 text-[#FF6B1A]" />
                    <span>Device Camera QR Scanner Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const nextFacing = cameraFacingMode === 'environment' ? 'user' : 'environment';
                        setCameraFacingMode(nextFacing);
                        startQRScanner(nextFacing);
                      }}
                      className="px-2 py-1 text-xs font-mono font-bold border border-[#111111] bg-[#FFF2D6] hover:bg-[#FFD400] flex items-center gap-1 cursor-pointer"
                      title="Flip camera"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Flip</span>
                    </button>
                    <button
                      type="button"
                      onClick={stopQRScanner}
                      className="p-1 border border-[#111111] hover:bg-red-100 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Video Viewport with Targeting Overlay */}
                <div className="relative rounded bg-black overflow-hidden aspect-4/3 max-h-72 mx-auto flex items-center justify-center">
                  <video
                    ref={videoRef}
                    playsInline
                    muted
                    autoPlay
                    className="w-full h-full object-cover"
                  />
                  {/* Hidden canvas for jsQR frame sampling */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Targeting Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-[#FFD400] relative shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]">
                      {/* Reticle corner accents */}
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-[#FF6B1A]" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-[#FF6B1A]" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-[#FF6B1A]" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-[#FF6B1A]" />
                      {/* Scanning Line */}
                      <div className="w-full h-0.5 bg-red-500 shadow-[0_0_8px_red] animate-pulse absolute top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
                    <span className="px-3 py-1 bg-black/80 text-[#FFD400] font-mono text-xs font-bold rounded">
                      Align pass QR code within box
                    </span>
                  </div>
                </div>

                <p className="text-xs font-mono text-[#111111]/70 text-center">
                  The scanner automatically reads Registration ID passes issued to attendees.
                </p>
              </div>
            )}

            {/* Camera Error Banner */}
            {cameraError && (
              <div className="p-4 bg-amber-50 border-2 border-amber-600 shadow-[3px_3px_0px_#b45309] text-xs font-mono text-amber-950 flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <strong className="block font-black uppercase">Camera Notice</strong>
                  <span>{cameraError}</span>
                </div>
              </div>
            )}

            {/* Scan Success Notice */}
            {scanSuccessNotice && (
              <div className="p-3 bg-emerald-50 border-2 border-emerald-600 shadow-[2px_2px_0px_#059669] text-xs font-mono text-emerald-950 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span className="font-bold">{scanSuccessNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanSuccessNotice(null)}
                  className="p-1 hover:bg-emerald-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Scan Legacy Pass Warning Banner */}
            {scanLegacyWarning && (
              <div className="p-3 bg-amber-100 border-2 border-amber-600 shadow-[2px_2px_0px_#b45309] text-xs font-mono text-amber-950 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 stroke-[2.5]" />
                  <span className="font-bold">{scanLegacyWarning}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setScanLegacyWarning(null)}
                  className="p-1 hover:bg-amber-200 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Top Double Check-in Warning Alert (if triggered) */}
            {checkinDoubleWarning && (
              <div className="p-4 bg-amber-100 border-2 border-amber-600 shadow-[3px_3px_0px_#b45309] space-y-1.5 text-left">
                <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                  <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 stroke-[2.5]" />
                  <span>PREVENT DOUBLE CHECK-IN</span>
                </div>
                <p className="text-xs sm:text-sm font-sans font-semibold text-amber-900">
                  {checkinDoubleWarning}
                </p>
              </div>
            )}

            {/* 4. RESULT CARD (Optimised for Mobile) */}
            {activeCheckinAttendee ? (
              <div className="p-5 sm:p-6 bg-white border-2 border-[#111111] shadow-[4px_4px_0px_#111111] space-y-5 text-left">
                
                {/* Result Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b-2 border-[#111111] pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#111111]/70">
                        ATTENDEE RECORD
                      </span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FFF2D6] border border-[#111111]">
                        {activeCheckinAttendee.role}
                      </span>
                      {activeCheckinAttendee.wantsToPitch && (
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#FF6B1A] text-white border border-[#111111]">
                          🎤 Pitch Applicant
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-black text-2xl sm:text-3xl text-[#111111] leading-tight">
                      {activeCheckinAttendee.name}
                    </h3>
                  </div>

                  {/* Prominent ID Badge & Live Pass QR Display */}
                  <div className="shrink-0 flex items-center gap-3">
                    <div className="p-2 sm:p-3 bg-[#FFD400] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] text-center space-y-1">
                      <span className="font-mono text-[10px] block font-bold text-[#111111]/75">REGISTRATION ID</span>
                      <span className="font-mono font-black text-lg sm:text-xl text-[#111111]">
                        {activeCheckinAttendee.id}
                      </span>
                      {activeCheckinAttendee.ticketCode ? (
                        <div className="border-t border-[#111111]/30 pt-1 font-mono text-[10px] font-bold text-[#FF6B1A]">
                          CODE: {activeCheckinAttendee.ticketCode}
                        </div>
                      ) : (
                        <div className="border-t border-[#111111]/30 pt-1 font-mono text-[9px] font-bold text-amber-900 bg-amber-200/70 px-1">
                          LEGACY PASS
                        </div>
                      )}
                    </div>
                    {/* Live Pass QR Display */}
                    <div className="hidden sm:block p-1.5 bg-white border-2 border-[#111111] shadow-[2px_2px_0px_#111111]" title="Gate Pass QR Preview">
                      <QRCodeSVG
                        value={JSON.stringify(
                          activeCheckinAttendee.ticketCode
                            ? { id: activeCheckinAttendee.id, t: activeCheckinAttendee.ticketCode }
                            : { id: activeCheckinAttendee.id }
                        )}
                        size={64}
                        level="M"
                      />
                    </div>
                  </div>
                </div>

                {/* Attendee Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm font-sans">
                  <div className="p-3 bg-[#FFF8EC] border border-[#111111] space-y-1">
                    <div className="font-mono text-[11px] font-bold text-[#111111]/70">COLLEGE / INSTITUTION</div>
                    <div className="font-bold text-[#111111] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <span>{getCollegeName(activeCheckinAttendee.college)}</span>
                    </div>
                    {(activeCheckinAttendee.course || activeCheckinAttendee.year) && (
                      <div className="text-xs text-[#111111]/80">
                        {activeCheckinAttendee.course} {activeCheckinAttendee.year ? `· ${activeCheckinAttendee.year}` : ''}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-[#FFF8EC] border border-[#111111] space-y-1">
                    <div className="font-mono text-[11px] font-bold text-[#111111]/70">CONTACT & CITY</div>
                    <div className="flex items-center gap-1.5 font-mono font-bold text-[#111111]">
                      <Phone className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <a href={`tel:${activeCheckinAttendee.phone}`} className="underline hover:text-[#FF6B1A]">
                        {activeCheckinAttendee.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs text-[#111111]/80 truncate">
                      <Mail className="w-3.5 h-3.5 text-[#FF6B1A] shrink-0" />
                      <span className="truncate">{activeCheckinAttendee.email}</span>
                    </div>
                  </div>
                </div>

                {/* Pitch Details (if applicable) */}
                {activeCheckinAttendee.wantsToPitch && activeCheckinAttendee.startupName && (
                  <div className="p-3 bg-[#FFF2D6] border border-[#111111] text-xs font-sans space-y-1">
                    <div className="font-mono font-bold text-[#FF6B1A]">🎤 STARTUP PITCH SUBMISSION:</div>
                    <strong className="text-sm text-[#111111]">{activeCheckinAttendee.startupName}</strong>
                    {activeCheckinAttendee.startupPitch && (
                      <p className="text-xs text-[#111111]/80 italic">"{activeCheckinAttendee.startupPitch}"</p>
                    )}
                  </div>
                )}

                {/* ========================================================= */}
                {/* PREVENT DOUBLE CHECK-IN WITH A CLEAR WARNING              */}
                {/* ========================================================= */}
                {activeCheckinAttendee.status === 'checked_in' ? (
                  <div className="space-y-3 pt-2">
                    {/* Clear Warning Banner */}
                    <div className="p-4 sm:p-5 bg-amber-100 border-3 border-amber-600 shadow-[3px_3px_0px_#b45309] space-y-2">
                      <div className="flex items-center gap-2 text-amber-950 font-black text-base sm:text-lg uppercase">
                        <AlertTriangle className="w-6 h-6 text-amber-700 shrink-0 stroke-[2.5]" />
                        <span>WARNING: ATTENDEE ALREADY CHECKED IN</span>
                      </div>
                      <p className="font-sans text-xs sm:text-sm text-amber-900 leading-relaxed font-semibold">
                        This delegate was already checked in and issued entry clearance at{' '}
                        <span className="font-mono underline text-amber-950 font-black">
                          {safeFormatTime(activeCheckinAttendee.checkInTime || activeCheckinAttendee.checkedInAt || activeCheckinAttendee.updatedAt, 'earlier today')}
                        </span>
                        {activeCheckinAttendee.updatedBy && (
                          <> by <span className="font-mono font-bold">{activeCheckinAttendee.updatedBy}</span></>
                        )}.
                      </p>
                      <div className="p-2.5 bg-white/70 border border-amber-400 font-mono text-[11px] text-amber-950 font-bold">
                        ⚠️ DO NOT ISSUE DUPLICATE ENTRY WRISTBAND / BADGE.
                        If the attendee left and is re-entering, verify their stamped hand or wristband.
                      </div>
                    </div>

                    {/* Disabled Check-in Button */}
                    <button
                      type="button"
                      disabled
                      className="w-full min-h-[58px] p-4 bg-emerald-100 text-emerald-950 border-2 border-emerald-600 font-display font-black text-base sm:text-lg uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed shadow-[2px_2px_0px_#059669]"
                    >
                      <CheckCircle2 className="w-6 h-6 text-emerald-700 stroke-[2.5]" />
                      <span>✓ Already Checked In — Cannot Check In Twice</span>
                    </button>

                    {/* Revert Action */}
                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => handleRevertCheckIn(activeCheckinAttendee)}
                        className="text-xs font-mono text-red-700 hover:text-red-900 underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Revert Check-in (Mark as Un-checked)</span>
                      </button>
                    </div>
                  </div>
                ) : activeCheckinAttendee.status === 'cancelled' ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-4 bg-red-100 border-2 border-red-600 shadow-[3px_3px_0px_#dc2626] text-xs sm:text-sm font-sans text-red-950 font-bold space-y-1">
                      <div className="flex items-center gap-2 text-red-900 font-black text-base uppercase">
                        <XCircle className="w-5 h-5 text-red-700 shrink-0" />
                        <span>REGISTRATION CANCELLED — DO NOT ADMIT</span>
                      </div>
                      <p>This registration has been marked cancelled by event administration. Please refer attendee to Helpdesk.</p>
                    </div>

                    <button
                      type="button"
                      disabled
                      className="w-full min-h-[56px] p-3.5 bg-gray-200 text-gray-600 border-2 border-gray-400 font-display font-bold text-sm uppercase flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Ticket Cancelled (Entry Disallowed)</span>
                    </button>
                  </div>
                ) : activeCheckinAttendee.status === 'waitlist' ? (
                  <div className="space-y-3 pt-2">
                    <div className="p-4 bg-amber-50 border-2 border-amber-600 shadow-[3px_3px_0px_#b45309] text-xs sm:text-sm font-sans text-amber-950 font-semibold space-y-1">
                      <div className="flex items-center gap-2 text-amber-900 font-black text-base uppercase">
                        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                        <span>WAITLIST DELEGATE</span>
                      </div>
                      <p>Attendee is on the event waitlist. Only admit if auditorium seats remain available.</p>
                    </div>

                    {/* Admit Waitlist Button */}
                    <button
                      type="button"
                      onClick={() => handlePerformCheckIn(activeCheckinAttendee)}
                      className="w-full min-h-[58px] p-4 bg-amber-400 hover:bg-amber-500 text-[#111111] font-display font-black text-lg sm:text-xl uppercase tracking-wider border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center justify-center gap-3 cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      <UserCheck className="w-6 h-6 stroke-[3]" />
                      <span>[ Admit & Check In (Confirm Waitlist) ]</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 pt-2">
                    {/* LARGE [Check in] BUTTON */}
                    <button
                      type="button"
                      onClick={() => handlePerformCheckIn(activeCheckinAttendee)}
                      className="w-full min-h-[60px] p-4 bg-[#FF6B1A] hover:bg-[#e0560a] text-white font-display font-black text-lg sm:text-2xl uppercase tracking-wider border-2 border-[#111111] shadow-[4px_4px_0px_#111111] flex items-center justify-center gap-3 cursor-pointer active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                    >
                      <UserCheck className="w-7 h-7 stroke-[3]" />
                      <span>[ Check in Attendee ]</span>
                    </button>
                    <p className="text-center font-mono text-xs text-[#111111]/70">
                      Sets status to "checked_in" with an official gate timestamp and admin log.
                    </p>
                  </div>
                )}

              </div>
            ) : checkinQuery.trim() ? (
              <div className="p-8 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] text-center space-y-3">
                <HelpCircle className="w-10 h-10 text-[#FF6B1A] mx-auto" />
                <h3 className="font-display font-bold text-lg text-[#111111]">
                  No Attendee Found matching "{checkinQuery}"
                </h3>
                <p className="text-xs font-mono text-[#111111]/70 max-w-md mx-auto">
                  Try typing their 10-digit phone number, exact Registration ID (e.g. SC1-00001), or full name.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCheckinQuery('');
                    setSelectedCheckinId(null);
                  }}
                  className="px-4 py-2 bg-[#FFD400] text-[#111111] font-mono text-xs font-bold border border-[#111111] cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : null}

            {/* 5. MULTIPLE SEARCH MATCHES LIST (If query matches > 1 attendee) */}
            {checkinQuery.trim() && checkinSearchResults.length > 1 && (
              <div className="p-4 sm:p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3 text-left">
                <div className="flex items-center justify-between border-b border-[#111111]/20 pb-2">
                  <span className="font-mono text-xs font-bold text-[#111111]">
                    Matching Attendees ({checkinSearchResults.length})
                  </span>
                  <span className="text-[11px] font-mono text-[#111111]/70">
                    Tap any attendee to review or check in
                  </span>
                </div>

                <div className="divide-y divide-[#111111]/15">
                  {checkinSearchResults.map((reg) => (
                    <div
                      key={reg.id}
                      className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-colors ${
                        activeCheckinAttendee?.id === reg.id ? 'bg-[#FFF8EC] -mx-2 px-2' : ''
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#FF6B1A]">
                            {reg.id}
                          </span>
                          <strong className="text-sm font-bold text-[#111111]">{reg.name}</strong>
                          <span className="text-[11px] font-mono text-[#111111]/60">· {reg.phone}</span>
                        </div>
                        <div className="text-xs text-[#111111]/75 truncate max-w-md">
                          {getCollegeName(reg.college)} · {reg.role}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {reg.status === 'checked_in' ? (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold border border-emerald-600">
                            ✓ Checked In
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handlePerformCheckIn(reg)}
                            className="px-3.5 py-1.5 bg-[#FF6B1A] hover:bg-[#e0560a] text-white font-mono text-xs font-bold border border-[#111111] shadow-[1px_1px_0px_#111111] cursor-pointer"
                          >
                            Check in
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCheckinId(reg.id);
                            window.scrollTo({ top: 150, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1.5 bg-white hover:bg-[#FFF2D6] font-mono text-xs font-bold border border-[#111111] cursor-pointer"
                        >
                          View Card
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. RECENT CHECK-INS TIMELINE (Gate verification history) */}
            <div className="p-4 sm:p-5 bg-white border-2 border-[#111111] shadow-[3px_3px_0px_#111111] space-y-3 text-left">
              <div className="flex items-center justify-between border-b border-[#111111]/20 pb-2">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-display font-black text-sm uppercase text-[#111111]">
                    Recently Admitted Delegates ({recentCheckins.length})
                  </h4>
                </div>
                <span className="font-mono text-[11px] text-[#111111]/70">
                  Last 8 entries
                </span>
              </div>

              {recentCheckins.length === 0 ? (
                <p className="text-xs font-mono text-[#111111]/60 py-3 text-center">
                  No attendees checked in yet. Start scanning passes or searching by ID above.
                </p>
              ) : (
                <div className="divide-y divide-[#111111]/10">
                  {recentCheckins.map((item) => (
                    <div
                      key={item.id}
                      className="py-2.5 flex items-center justify-between gap-2 text-xs font-mono"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold text-[#FF6B1A]">{item.id}</span>
                        <span className="font-bold text-[#111111] truncate">{item.name}</span>
                        <span className="hidden sm:inline text-[#111111]/60 truncate">({getCollegeName(item.college)})</span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-[#111111]/70">
                          {safeFormatTime(item.checkInTime || item.checkedInAt || item.updatedAt, 'Just now')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCheckinId(item.id);
                            window.scrollTo({ top: 150, behavior: 'smooth' });
                          }}
                          className="px-2 py-0.5 bg-[#FFF2D6] hover:bg-[#FFD400] border border-[#111111] text-[11px] font-bold cursor-pointer"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: PITCH APPLICANTS                                             */}
        {/* =================================================================== */}
        {activeTab === 'pitch' && (
          <div className="space-y-4">
            <div className="p-4 bg-white brutal-border brutal-shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#111111]">
                  Pitch Arena Applicants ({pitchApplicants.length})
                </h3>
                <p className="text-xs text-[#111111]/70 font-sans">
                  Startup founders and student innovators who applied for the live stage pitch.
                </p>
              </div>

              <button
                onClick={handleExportPitch}
                className="brutal-btn bg-[#FFD400] text-[#111111] px-3 py-2 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Pitch CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pitchApplicants.map((applicant) => (
                <div
                  key={applicant.id}
                  className="p-5 bg-white brutal-border brutal-shadow-sm space-y-3 text-left hover:border-[#FF6B1A] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 border-b border-[#111111]/10 pb-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-[#FF6B1A]">
                        {applicant.id}
                      </span>
                      <h4 className="font-display font-black text-lg text-[#111111]">
                        {applicant.startupName || 'Untitled Venture'}
                      </h4>
                    </div>

                    <select
                      value={applicant.pitchStatus || 'Applied'}
                      onChange={(e) => handlePitchStatusChange(applicant.id, e.target.value)}
                      className={`font-mono text-xs font-bold p-1 border-2 border-[#111111] uppercase ${
                        applicant.pitchStatus === 'Finalist'
                          ? 'bg-[#FFD400] text-[#111111]'
                          : applicant.pitchStatus === 'Shortlisted'
                          ? 'bg-blue-100 text-blue-900'
                          : applicant.pitchStatus === 'Rejected'
                          ? 'bg-red-100 text-red-900'
                          : 'bg-[#FFF8EC] text-[#111111]'
                      }`}
                    >
                      <option value="Applied">Applied</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Finalist">Finalist</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>

                  <p className="text-xs font-sans text-[#111111]/85 italic">
                    "{applicant.startupPitch || 'No pitch summary provided.'}"
                  </p>

                  {(applicant.sector || applicant.stage || applicant.teamSize || applicant.pitchDeckLink) && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] font-mono">
                      {applicant.sector && (
                        <span className="px-2 py-0.5 bg-[#FFF8EC] border border-[#111111] font-semibold text-[#111111]">
                          📁 {applicant.sector}
                        </span>
                      )}
                      {applicant.stage && (
                        <span className="px-2 py-0.5 bg-white border border-[#111111] font-semibold text-[#111111]">
                          🚀 {applicant.stage}
                        </span>
                      )}
                      {applicant.teamSize && (
                        <span className="px-2 py-0.5 bg-white border border-[#111111] font-semibold text-[#111111]">
                          👥 Team: {applicant.teamSize}
                        </span>
                      )}
                      {applicant.pitchDeckLink && (
                        <a
                          href={applicant.pitchDeckLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FF6B1A] text-white border border-[#111111] font-bold hover:bg-[#111111] transition-colors"
                        >
                          Deck <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  <div className="pt-1 text-xs font-mono grid grid-cols-2 gap-1 text-[#111111]/70 border-t border-[#111111]/10">
                    <div>Founder: <strong className="text-[#111111]">{applicant.name}</strong></div>
                    <div>Phone: <strong className="text-[#111111]">{applicant.phone}</strong></div>
                    <div>College: <span className="truncate block">{getCollegeName(applicant.college)}</span></div>
                    <div>Email: <span className="truncate block">{applicant.email}</span></div>
                  </div>

                  {applicant.notes && (
                    <div className="p-2 bg-[#FFF8EC] border border-[#111111] text-[11px] font-sans">
                      <strong>Jury Notes:</strong> {applicant.notes}
                    </div>
                  )}
                </div>
              ))}

              {pitchApplicants.length === 0 && (
                <div className="col-span-2 p-10 bg-white brutal-border text-center font-mono text-sm text-[#111111]/60">
                  No pitch applicants registered yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: PARTNER ENQUIRIES                                            */}
        {/* =================================================================== */}
        {activeTab === 'partners' && (
          <div className="space-y-4">
            <div className="p-4 bg-white brutal-border brutal-shadow-sm flex items-center justify-between">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#111111]">
                  Corporate & Ecosystem Enquiries ({partnerEnquiries.length})
                </h3>
                <p className="text-xs text-[#111111]/70 font-sans">
                  Organizations requesting sponsor decks or exhibition booths.
                </p>
              </div>

              <button
                onClick={handleExportPartners}
                className="brutal-btn bg-[#FFD400] text-[#111111] px-3 py-2 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Partners CSV</span>
              </button>
            </div>

            <div className="bg-white brutal-border brutal-shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead className="bg-[#FFF2D6] border-b-2 border-[#111111] font-mono text-[11px] uppercase text-[#111111]">
                  <tr>
                    <th className="p-3">Company</th>
                    <th className="p-3">Contact Person</th>
                    <th className="p-3">Email & Phone</th>
                    <th className="p-3">Type & Range</th>
                    <th className="p-3">Inquiry Message</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Received At</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#111111]/10">
                  {partnerEnquiries.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FFF8EC]">
                      <td className="p-3 font-display font-bold text-sm text-[#111111]">
                        {p.company}
                      </td>
                      <td className="p-3 font-semibold">{p.contactName}</td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{p.email}</div>
                        <div className="text-[#111111]/60">{p.phone || '—'}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">
                        <div className="font-bold text-[#FF6B1A]">{p.partnershipType || 'General'}</div>
                        <div className="text-[#111111]/70">{p.contributionRange || '—'}</div>
                      </td>
                      <td className="p-3 max-w-sm text-xs text-[#111111]/80">
                        {p.message || 'General inquiry'}
                      </td>
                      <td className="p-3">
                        <select
                          value={p.status || 'New'}
                          onChange={(e) => handlePartnerStatusChange(p.id, e.target.value)}
                          className={`font-mono text-[11px] font-bold p-1 border border-[#111111] uppercase ${
                            p.status === 'Done'
                              ? 'bg-emerald-100 text-emerald-900'
                              : p.status === 'Contacted'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-[#FFD400] text-[#111111]'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Done">Done</option>
                        </select>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#111111]/60 whitespace-nowrap">
                        {safeFormatDate(p.createdAt)}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeletePartnerEnquiry(p)}
                          className="p-1 border border-[#111111] bg-white hover:bg-red-50 text-red-600 font-mono text-[10px] font-bold cursor-pointer transition-colors"
                          title="Delete inquiry"
                          aria-label={`Delete inquiry from ${p.company}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {partnerEnquiries.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-[#111111]/60 font-mono">
                        No partner enquiries received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: EVENT SETTINGS                                               */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl bg-white brutal-border brutal-shadow-lg p-6 sm:p-8 space-y-6">
            <div className="border-b-2 border-[#111111] pb-3">
              <h3 className="font-display font-black text-xl text-[#111111]">
                Conclave Runtime Controls
              </h3>
              <p className="text-xs text-[#111111]/70 font-sans mt-0.5">
                Toggle intake states without needing code redeployment.
              </p>
            </div>

            {settingsSavedToast && (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-600 text-emerald-900 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Runtime settings updated successfully!</span>
              </div>
            )}

            <div className="space-y-4 font-sans text-xs">
              
              {/* Toggle: Registration Open / Closed */}
              <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] flex items-center justify-between gap-4">
                <div>
                  <strong className="text-sm font-display block text-[#111111]">
                    Registration Intake Status
                  </strong>
                  <span className="text-[#111111]/70 text-xs">
                    Controls whether public attendees can submit registrations or see the closed banner.
                  </span>
                </div>

                <div className="inline-flex border-2 border-[#111111] bg-white p-0.5 font-mono text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setRegStatusSetting('open')}
                    className={`px-3 py-1.5 transition-colors ${
                      regStatusSetting === 'open' ? 'bg-[#FF6B1A] text-white' : 'text-[#111111]'
                    }`}
                  >
                    OPEN
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegStatusSetting('closed')}
                    className={`px-3 py-1.5 transition-colors ${
                      regStatusSetting === 'closed' ? 'bg-[#111111] text-white' : 'text-[#111111]'
                    }`}
                  >
                    CLOSED
                  </button>
                </div>
              </div>

              {/* Toggle: Show Registered Count */}
              <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] flex items-center justify-between gap-4">
                <div>
                  <strong className="text-sm font-display block text-[#111111]">
                    Public Registration Counter
                  </strong>
                  <span className="text-[#111111]/70 text-xs">
                    Displays "X students registered" sticker badge above the registration section.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCountSetting(!showCountSetting)}
                  className={`px-4 py-2 border-2 border-[#111111] font-mono font-bold text-xs ${
                    showCountSetting ? 'bg-[#FFD400] text-[#111111]' : 'bg-white text-[#111111]/50'
                  }`}
                >
                  {showCountSetting ? 'VISIBLE (ON)' : 'HIDDEN (OFF)'}
                </button>
              </div>

              {/* Capacity Setting: Registration Cap in Firestore settings/event */}
              <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <strong className="text-sm font-display block text-[#111111]">
                      Registration Capacity Cap (registrationCap)
                    </strong>
                    <span className="text-[#111111]/70 text-xs block">
                      Stored in Firestore "settings/event". When registration count reaches this cap, new sign-ups are automatically assigned status "waitlist".
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      min={1}
                      max={50000}
                      value={registrationCapSetting}
                      onChange={(e) => setRegistrationCapSetting(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-28 p-2 bg-white border-2 border-[#111111] font-mono text-sm font-black text-center"
                    />
                    <span className="font-mono text-xs text-[#111111] font-bold">seats</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSaveSettings}
                  className="brutal-btn bg-[#FF6B1A] text-white px-6 py-2.5 font-display font-bold text-sm uppercase cursor-pointer"
                >
                  Save Runtime Settings
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* =================================================================== */}
      {/* SIDE DETAILS DRAWER (Full details & notes)                          */}
      {/* =================================================================== */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 bg-[#111111]/50 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-full max-w-md bg-white brutal-border border-r-0 h-full p-6 sm:p-8 overflow-y-auto space-y-6 text-left shadow-2xl">
            
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
              <div>
                <span className="font-mono text-xs font-bold text-[#FF6B1A]">
                  {activeDetailItem.id}
                </span>
                <h3 className="font-display font-black text-xl text-[#111111]">
                  {activeDetailItem.name}
                </h3>
              </div>

              <button
                onClick={() => setActiveDetailItem(null)}
                className="p-1.5 border border-[#111111] hover:bg-[#FFD400]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-bold text-[#111111] block">
                Current Status:
              </label>
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                {(['registered', 'waitlist', 'confirmed', 'checked_in', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeDetailItem.id, st)}
                    className={`p-2 border border-[#111111] uppercase font-bold text-[11px] cursor-pointer transition-colors ${
                      activeDetailItem.status === st
                        ? 'bg-[#111111] text-[#FFD400]'
                        : st === 'waitlist'
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-950'
                        : 'bg-[#FFF8EC] hover:bg-white'
                    }`}
                  >
                    {st.replace('_', '-')}
                  </button>
                ))}
              </div>
            </div>

            {/* Requirement: Show who changed a status and when (updatedBy, updatedAt) in the details drawer */}
            <div className="p-3.5 bg-[#FFF2D6] border-2 border-[#111111] space-y-2 text-xs font-mono shadow-[2px_2px_0px_#111111]">
              <div className="flex items-center gap-1.5 font-black uppercase text-[#111111] border-b border-[#111111]/20 pb-1">
                <Clock className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>Status Change Audit Trail</span>
              </div>
              {activeDetailItem.updatedAt || activeDetailItem.updatedBy ? (
                <div className="space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#111111]/70">Updated By:</span>
                    <strong className="text-[#111111] text-right truncate max-w-[220px]">
                      {activeDetailItem.updatedBy || 'admin'}
                    </strong>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[#111111]/70">Updated At:</span>
                    <strong className="text-[#111111] text-right">
                      {safeFormatDateTime(activeDetailItem.updatedAt, 'Recently')}
                    </strong>
                  </div>
                </div>
              ) : (
                <p className="text-[#111111]/75 italic text-[11px]">
                  No status updates recorded yet. Created on {safeFormatDate(activeDetailItem.createdAt)}.
                </p>
              )}
            </div>

            {/* Contact Details */}
            <div className="p-4 bg-[#FFF8EC] border-2 border-[#111111] space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <a href={`mailto:${activeDetailItem.email}`} className="underline">
                  {activeDetailItem.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <a href={`tel:${activeDetailItem.phone}`} className="underline">
                  {activeDetailItem.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#FF6B1A]" />
                <span>{getCollegeName(activeDetailItem.college)}</span>
              </div>
              {typeof activeDetailItem.college === 'object' && activeDetailItem.college && (
                <div className="text-[11px] text-[#111111]/70 pl-5.5 space-y-0.5">
                  <div>City / State: {[activeDetailItem.college.city, activeDetailItem.college.state].filter(Boolean).join(', ') || '—'}</div>
                  <div>Type: {activeDetailItem.college.type || '—'} {activeDetailItem.college.listed ? '(Listed)' : ''}</div>
                </div>
              )}
              <div>Ticket: <strong>{activeDetailItem.ticket ? (activeDetailItem.ticket === 'pitch' ? 'Pitch Your Startup' : 'Participant') : (activeDetailItem.wantsToPitch ? 'Pitch' : 'Participant')}</strong></div>
              <div>Email Verified: <strong>{activeDetailItem.emailVerified ? 'Yes' : 'No'}</strong></div>
              <div>Course: {activeDetailItem.course || '—'} ({activeDetailItem.year || '—'})</div>
              <div>Role: <strong>{activeDetailItem.role}</strong></div>
              <div>City: {activeDetailItem.city}</div>
            </div>

            {/* Resend Confirmation Pass Email */}
            <button
              type="button"
              disabled={resendingRegId === activeDetailItem.id}
              onClick={() => handleAdminResend(activeDetailItem)}
              className="w-full py-2.5 px-3 bg-white hover:bg-[#FFF8EC] text-[#111111] font-mono font-bold text-xs border-2 border-[#111111] shadow-[2px_2px_0px_#111111] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              title={`Resend confirmation email to ${activeDetailItem.email}`}
            >
              <Mail className="w-4 h-4 text-[#FF6B1A]" />
              <span>
                {resendingRegId === activeDetailItem.id
                  ? 'Sending confirmation email...'
                  : 'Resend Confirmation Email'}
              </span>
            </button>

            {/* Payment & Fee Details */}
            <div className="p-4 bg-[#FFF2D6] border-2 border-[#111111] shadow-[2px_2px_0px_#111111] space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between border-b border-[#111111]/20 pb-1.5">
                <span className="font-bold uppercase tracking-wider text-[#111111]">
                  Payment & Fee Verification
                </span>
                {(() => {
                  const pStatus = activeDetailItem.payment?.status || activeDetailItem.paymentStatus || (activeDetailItem.ticket === 'pitch' ? 'pending' : 'not_required');
                  return (
                    <span
                      className={`px-2 py-0.5 border border-[#111111] font-bold uppercase text-[10px] ${
                        pStatus === 'verified'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-600'
                          : pStatus === 'pending'
                          ? 'bg-amber-100 text-amber-950 border-amber-600'
                          : pStatus === 'rejected'
                          ? 'bg-red-100 text-red-900 border-red-600'
                          : 'bg-white text-[#111111]/70'
                      }`}
                    >
                      {pStatus === 'not_required' ? 'NOT REQUIRED' : pStatus}
                    </span>
                  );
                })()}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[#111111]/70 text-[11px] block">Amount:</span>
                  <strong>₹{activeDetailItem.payment ? Math.round(activeDetailItem.payment.amountPaise / 100) : (activeDetailItem.paymentAmount ?? 0)}</strong>
                </div>
                <div>
                  <span className="text-[#111111]/70 text-[11px] block">12-Digit UTR:</span>
                  <span className="font-bold select-all bg-white px-1.5 py-0.5 border border-[#111111] inline-block truncate max-w-full">
                    {activeDetailItem.payment?.utr || activeDetailItem.paymentUtr || 'None'}
                  </span>
                </div>
              </div>

              {activeDetailItem.paymentVerifiedBy && (
                <div className="text-[11px] text-[#111111]/80 border-t border-[#111111]/20 pt-1.5 space-y-0.5">
                  <div>Verified By: <strong>{activeDetailItem.paymentVerifiedBy}</strong></div>
                  {activeDetailItem.paymentVerifiedAt && (
                    <div>Verified On: <span>{safeFormatDateTime(activeDetailItem.paymentVerifiedAt)}</span></div>
                  )}
                </div>
              )}

              {/* Quick Payment Action Buttons */}
              <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-[#111111]/20">
                <button
                  type="button"
                  onClick={async () => {
                    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
                    const ok = await updatePaymentStatus(activeDetailItem.id, 'verified', adminEmail, activeDetailItem.docId, activeDetailItem.payment);
                    if (ok) {
                      setRegistrations((prev) =>
                        prev.map((r) =>
                          r.id === activeDetailItem.id
                            ? {
                                ...r,
                                paymentStatus: 'verified',
                                paymentVerifiedBy: adminEmail,
                                paymentVerifiedAt: new Date().toISOString(),
                                payment: {
                                  ...(r.payment || {}),
                                  required: r.payment?.required ?? true,
                                  status: 'verified',
                                  amountPaise: r.payment?.amountPaise ?? 99900,
                                },
                              }
                            : r
                        )
                      );
                      setActiveDetailItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              paymentStatus: 'verified',
                              paymentVerifiedBy: adminEmail,
                              paymentVerifiedAt: new Date().toISOString(),
                              payment: {
                                ...(prev.payment || {}),
                                required: prev.payment?.required ?? true,
                                status: 'verified',
                                amountPaise: prev.payment?.amountPaise ?? 99900,
                              },
                            }
                          : null
                      );
                      setAdminSuccessToast(`Marked ${activeDetailItem.id} as VERIFIED`);
                    } else {
                      setAdminActionError('Could not update payment status');
                    }
                  }}
                  className="px-2 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-950 font-bold border border-[#111111] text-[10px] uppercase cursor-pointer text-center"
                >
                  Mark Verified
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
                    const ok = await updatePaymentStatus(activeDetailItem.id, 'rejected', adminEmail, activeDetailItem.docId, activeDetailItem.payment);
                    if (ok) {
                      setRegistrations((prev) =>
                        prev.map((r) =>
                          r.id === activeDetailItem.id
                            ? {
                                ...r,
                                paymentStatus: 'rejected',
                                paymentVerifiedBy: adminEmail,
                                payment: {
                                  ...(r.payment || {}),
                                  required: r.payment?.required ?? true,
                                  status: 'rejected',
                                  amountPaise: r.payment?.amountPaise ?? 99900,
                                },
                              }
                            : r
                        )
                      );
                      setActiveDetailItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              paymentStatus: 'rejected',
                              paymentVerifiedBy: adminEmail,
                              payment: {
                                ...(prev.payment || {}),
                                required: prev.payment?.required ?? true,
                                status: 'rejected',
                                amountPaise: prev.payment?.amountPaise ?? 99900,
                              },
                            }
                          : null
                      );
                      setAdminSuccessToast(`Payment marked as REJECTED for ${activeDetailItem.id}`);
                    } else {
                      setAdminActionError('Could not update payment status');
                    }
                  }}
                  className="px-2 py-1.5 bg-red-100 hover:bg-red-200 text-red-950 font-bold border border-[#111111] text-[10px] uppercase cursor-pointer text-center"
                >
                  Reject
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const adminEmail = currentUser?.email || 'admin@dvsiet.ac.in';
                    const ok = await updatePaymentStatus(activeDetailItem.id, 'pending', adminEmail, activeDetailItem.docId, activeDetailItem.payment);
                    if (ok) {
                      setRegistrations((prev) =>
                        prev.map((r) =>
                          r.id === activeDetailItem.id
                            ? {
                                ...r,
                                paymentStatus: 'pending',
                                paymentVerifiedBy: null,
                                paymentVerifiedAt: null,
                                payment: {
                                  ...(r.payment || {}),
                                  required: r.payment?.required ?? true,
                                  status: 'pending',
                                  amountPaise: r.payment?.amountPaise ?? 99900,
                                },
                              }
                            : r
                        )
                      );
                      setActiveDetailItem((prev) =>
                        prev
                          ? {
                              ...prev,
                              paymentStatus: 'pending',
                              paymentVerifiedBy: null,
                              paymentVerifiedAt: null,
                              payment: {
                                ...(prev.payment || {}),
                                required: prev.payment?.required ?? true,
                                status: 'pending',
                                amountPaise: prev.payment?.amountPaise ?? 99900,
                              },
                            }
                          : null
                      );
                      setAdminSuccessToast(`Payment reset to PENDING for ${activeDetailItem.id}`);
                    } else {
                      setAdminActionError('Could not update payment status');
                    }
                  }}
                  className="px-2 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold border border-[#111111] text-[10px] uppercase cursor-pointer text-center"
                >
                  Pending
                </button>
              </div>
            </div>

            {/* Pitch Information (If applied) */}
            {activeDetailItem.wantsToPitch && (
              <div className="p-4 bg-[#FFD400]/40 border-2 border-[#111111] space-y-2 text-xs">
                <span className="font-mono text-[10px] font-black uppercase text-[#FF6B1A] block">
                  Pitch Arena Application
                </span>
                <div className="font-display font-bold text-base text-[#111111]">
                  {activeDetailItem.startupName || 'Untitled Venture'}
                </div>
                <p className="text-xs text-[#111111]/85 italic">
                  "{activeDetailItem.startupPitch || 'No pitch summary'}"
                </p>

                {(activeDetailItem.sector || activeDetailItem.stage || activeDetailItem.teamSize || activeDetailItem.pitchDeckLink) && (
                  <div className="pt-2 pb-1 border-t border-[#111111]/15 space-y-1 font-mono text-xs">
                    {activeDetailItem.sector && (
                      <div>Sector: <strong className="text-[#111111]">{activeDetailItem.sector}</strong></div>
                    )}
                    {activeDetailItem.stage && (
                      <div>Stage: <strong className="text-[#111111]">{activeDetailItem.stage}</strong></div>
                    )}
                    {activeDetailItem.teamSize && (
                      <div>Team Size: <strong className="text-[#111111]">{activeDetailItem.teamSize}</strong></div>
                    )}
                    {activeDetailItem.pitchDeckLink && (
                      <div className="pt-1">
                        <a
                          href={activeDetailItem.pitchDeckLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#111111] text-white font-mono text-xs font-bold hover:bg-[#FF6B1A] transition-colors"
                        >
                          View Pitch Deck <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <label className="font-mono text-[10px] block font-bold mb-1">Pitch Jury Status:</label>
                  <select
                    value={activeDetailItem.pitchStatus || 'Applied'}
                    onChange={(e) => handlePitchStatusChange(activeDetailItem.id, e.target.value)}
                    className="w-full p-1.5 bg-white border border-[#111111] font-mono text-xs font-bold"
                  >
                    <option value="Applied">Applied</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Finalist">Finalist</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            )}

            {/* Internal Secretariat Notes */}
            <div className="space-y-2">
              <label className="font-mono text-xs font-bold text-[#111111] block">
                Internal Secretariat Notes:
              </label>
              <textarea
                rows={4}
                value={detailNotes}
                onChange={(e) => setDetailNotes(e.target.value)}
                placeholder="Add private evaluation notes, check-in badges, dietary requirements..."
                className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] text-xs font-sans focus:outline-none focus:bg-white"
              />
              <button
                onClick={handleSaveNotes}
                className="brutal-btn bg-[#111111] text-white px-4 py-2 font-mono text-xs font-bold uppercase cursor-pointer"
              >
                Save Notes
              </button>
            </div>

            {/* Drawer Footer with Delete Action */}
            <div className="pt-4 border-t-2 border-[#111111] flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-[#111111]/60">
                Registered: {safeFormatDate(activeDetailItem.createdAt)}
              </span>
              <button
                type="button"
                onClick={() => handleDeleteRegistration(activeDetailItem)}
                className="px-3 py-1.5 bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-600 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-[2px_2px_0px_#dc2626]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* CONFIRMATION DIALOG MODAL (Bulk status, Cancel reg, Any delete)     */}
      {/* =================================================================== */}
      {confirmDialog && confirmDialog.isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmDialog(null);
          }}
        >
          <div className="bg-[#FFF8EC] brutal-border brutal-shadow-lg p-6 max-w-md w-full text-left space-y-4 animate-brutal-pop">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 border-2 border-[#111111] shrink-0 ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-red-600 text-white'
                    : 'bg-[#FFD400] text-[#111111]'
                }`}
              >
                {confirmDialog.variant === 'danger' ? (
                  <AlertCircle className="w-6 h-6 stroke-[2.5]" />
                ) : (
                  <HelpCircle className="w-6 h-6 stroke-[2.5]" />
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-black text-xl text-[#111111]">
                  {confirmDialog.title}
                </h3>
                <p className="font-sans text-sm text-[#111111]/85 font-medium leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t-2 border-[#111111] flex items-center justify-end gap-3 font-mono text-xs font-bold">
              <button
                type="button"
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 border-2 border-[#111111] bg-white hover:bg-[#FFF2D6] text-[#111111] cursor-pointer min-h-[40px]"
              >
                {confirmDialog.cancelLabel || 'Cancel'}
              </button>
              <button
                type="button"
                onClick={confirmDialog.onConfirm}
                className={`brutal-btn px-4 py-2 text-xs uppercase tracking-wider font-bold cursor-pointer min-h-[40px] ${
                  confirmDialog.variant === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-[#111111] hover:bg-[#222222] text-[#FFD400]'
                }`}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5-SECOND UNDO TOAST FOR SINGLE STATUS CHANGES                       */}
      {/* =================================================================== */}
      {undoToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-[#111111] text-white border-2 border-[#FFD400] shadow-[4px_4px_0px_#FFD400] p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#FFD400] shrink-0" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FFD400]">
                Status Updated
              </span>
            </div>
            <p className="font-sans text-xs text-white/90">
              Changed <strong>{undoToast.name}</strong> to{' '}
              <span className="font-mono font-bold text-[#FFD400] uppercase">{undoToast.newStatus}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-xs font-bold">
            <button
              type="button"
              onClick={handleUndoStatusChange}
              className="bg-[#FFD400] hover:bg-white text-[#111111] px-3 py-1.5 border border-[#111111] flex items-center gap-1.5 cursor-pointer transition-colors shadow-[2px_2px_0px_#000]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo ({undoToast.secondsRemaining}s)</span>
            </button>
            <button
              type="button"
              onClick={() => setUndoToast(null)}
              className="text-white/60 hover:text-white p-1 cursor-pointer"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 5-SECOND ERROR TOAST FOR FAILED ADMIN MUTATIONS (P5)               */}
      {/* =================================================================== */}
      {adminActionError && (
        <div
          role="alert"
          aria-live="assertive"
          className="fixed bottom-6 left-6 z-50 max-w-md w-full bg-[#111111] text-white border-2 border-[#FF6B1A] shadow-[4px_4px_0px_#FF6B1A] p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5"
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FF6B1A] shrink-0" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#FF6B1A]">
                Action Failed
              </span>
            </div>
            <p className="font-sans text-xs text-white/90">
              {adminActionError}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAdminActionError(null)}
            className="text-white/60 hover:text-white p-1 cursor-pointer shrink-0"
            aria-label="Dismiss error notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 4-SECOND SUCCESS TOAST FOR BULK / CONFIRMED ADMIN MUTATIONS (P5)    */}
      {/* =================================================================== */}
      {adminSuccessToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-[#111111] text-white border-2 border-[#FFD400] shadow-[4px_4px_0px_#FFD400] p-4 flex items-center justify-between gap-4 animate-in slide-in-from-bottom-5"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FFD400] shrink-0" />
            <p className="font-sans text-xs text-white/90">
              {adminSuccessToast}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAdminSuccessToast(null)}
            className="text-white/60 hover:text-white p-1 cursor-pointer shrink-0"
            aria-label="Dismiss success notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminPage;

