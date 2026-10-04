import React, { useState, useEffect, useMemo } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
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
} from 'lucide-react';
import { auth } from '../services/firebase.ts';
import { ADMIN_EMAILS, CONFIG } from '../config.ts';
import {
  AdminRegistration,
  AdminPartnerEnquiry,
  fetchRegistrations,
  fetchPartnerEnquiries,
  updateRegistration,
  bulkUpdateStatus,
  updatePartnerEnquiry,
  exportToCSV,
} from '../services/admin.ts';

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
  const [authEmail, setAuthEmail] = useState('aaravgorewal@gmail.com');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [isNewAdminSetup, setIsNewAdminSetup] = useState(false);

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState<'registrations' | 'pitch' | 'partners' | 'settings'>('registrations');

  // Data State
  const [registrations, setRegistrations] = useState<AdminRegistration[]>([]);
  const [partnerEnquiries, setPartnerEnquiries] = useState<AdminPartnerEnquiry[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Search & Filter State (Registrations Table)
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [pitchFilter, setPitchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

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

  // Event Settings State (Config Overrides)
  const [regStatusSetting, setRegStatusSetting] = useState<'open' | 'closed'>(CONFIG.registration.status);
  const [showCountSetting, setShowCountSetting] = useState<boolean>(CONFIG.registration.showCount);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Monitor Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && ADMIN_EMAILS.includes(user.email || '')) {
        setCurrentUser(user);
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

  // Auth Submit Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const emailTrim = authEmail.trim().toLowerCase();
    if (!ADMIN_EMAILS.includes(emailTrim)) {
      setAuthError(`Access denied: "${emailTrim}" is not in the authorized ADMIN_EMAILS roster.`);
      return;
    }

    if (!authPassword || authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }

    setAuthSubmitting(true);

    try {
      if (isNewAdminSetup) {
        const cred = await createUserWithEmailAndPassword(auth, emailTrim, authPassword);
        setCurrentUser(cred.user);
      } else {
        const cred = await signInWithEmailAndPassword(auth, emailTrim, authPassword);
        setCurrentUser(cred.user);
      }
    } catch (err: any) {
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        // Auto-switch to create credentials if user doesn't exist yet
        try {
          const cred = await createUserWithEmailAndPassword(auth, emailTrim, authPassword);
          setCurrentUser(cred.user);
        } catch (createErr: any) {
          setAuthError(createErr.message || 'Authentication error.');
        }
      } else {
        setAuthError(err.message || 'Authentication error. Please check credentials.');
      }
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  // Status Update Handlers
  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateRegistration(id, { status: newStatus });
    setRegistrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (activeDetailItem?.id === id) {
      setActiveDetailItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handlePitchStatusChange = async (id: string, newPitchStatus: string) => {
    await updateRegistration(id, { pitchStatus: newPitchStatus });
    setRegistrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, pitchStatus: newPitchStatus } : item))
    );
    if (activeDetailItem?.id === id) {
      setActiveDetailItem((prev) => (prev ? { ...prev, pitchStatus: newPitchStatus } : null));
    }
  };

  const handlePartnerStatusChange = async (id: string, newStatus: string) => {
    await updatePartnerEnquiry(id, { status: newStatus });
    setPartnerEnquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleSaveNotes = async () => {
    if (!activeDetailItem) return;
    await updateRegistration(activeDetailItem.id, { notes: detailNotes });
    setRegistrations((prev) =>
      prev.map((item) => (item.id === activeDetailItem.id ? { ...item, notes: detailNotes } : item))
    );
    setActiveDetailItem((prev) => (prev ? { ...prev, notes: detailNotes } : null));
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

  const handleBulkStatus = async (status: string) => {
    await bulkUpdateStatus(selectedIds, status);
    setRegistrations((prev) =>
      prev.map((item) => (selectedIds.includes(item.id) ? { ...item, status } : item))
    );
    setSelectedIds([]);
  };

  // Settings Save
  const handleSaveSettings = () => {
    CONFIG.registration.status = regStatusSetting;
    CONFIG.registration.showCount = showCountSetting;
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 2500);
  };

  // Top Stat Cards Calculations
  const stats = useMemo(() => {
    const total = registrations.length;
    const students = registrations.filter((r) => r.role === 'Student').length;
    const founders = registrations.filter((r) => r.role === 'Founder').length;
    const others = total - (students + founders);
    const wantsToPitch = registrations.filter((r) => r.wantsToPitch).length;

    const todayStr = new Date().toISOString().slice(0, 10);
    const today = registrations.filter((r) => r.createdAt && r.createdAt.slice(0, 10) === todayStr).length;

    return { total, students, founders, others, wantsToPitch, today };
  }, [registrations]);

  // Filtered & Sorted Registrations
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter((r) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          r.name.toLowerCase().includes(query) ||
          r.email.toLowerCase().includes(query) ||
          r.phone.includes(query) ||
          r.college.toLowerCase().includes(query) ||
          r.id.toLowerCase().includes(query);

        const matchesRole = roleFilter === 'All' || r.role === roleFilter;
        const matchesPitch =
          pitchFilter === 'All' ||
          (pitchFilter === 'Yes' && r.wantsToPitch) ||
          (pitchFilter === 'No' && !r.wantsToPitch);
        const matchesStatus = statusFilter === 'All' || r.status === statusFilter;

        return matchesQuery && matchesRole && matchesPitch && matchesStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField] || '';
        let valB = b[sortField] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [registrations, searchQuery, roleFilter, pitchFilter, statusFilter, sortField, sortDirection]);

  // Paginated List
  const totalPages = Math.ceil(filteredRegistrations.length / pageSize) || 1;
  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRegistrations.slice(start, start + pageSize);
  }, [filteredRegistrations, currentPage]);

  // Pitch Applicants List
  const pitchApplicants = useMemo(() => {
    return registrations.filter((r) => r.wantsToPitch);
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
    const exportData = registrations.map((r) => ({
      'Registration ID': r.id,
      Name: r.name,
      Email: r.email,
      Phone: r.phone,
      College: r.college,
      Course: r.course || '',
      Year: r.year || '',
      Role: r.role,
      City: r.city,
      'Wants to Pitch': r.wantsToPitch ? 'Yes' : 'No',
      'Startup Name': r.startupName || '',
      'Startup Pitch': r.startupPitch || '',
      Status: r.status,
      'Pitch Status': r.pitchStatus || '',
      Notes: r.notes || '',
      'Registered At': r.createdAt,
    }));
    exportToCSV(exportData, 'StartupConclave-Registrations');
  };

  const handleExportPitch = () => {
    const exportData = pitchApplicants.map((r) => ({
      'Registration ID': r.id,
      'Startup Name': r.startupName || 'Untitled Venture',
      'One-Line Pitch': r.startupPitch || '',
      'Founder Name': r.name,
      Email: r.email,
      Phone: r.phone,
      College: r.college,
      Role: r.role,
      'Pitch Status': r.pitchStatus || 'Applied',
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
      Message: p.message || '',
      Status: p.status || 'New',
      'Inquiry Date': p.createdAt,
    }));
    exportToCSV(exportData, 'StartupConclave-PartnerEnquiries');
  };

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
              <span className="font-mono text-xs text-[#FF6B1A] font-bold">/admin</span>
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

          <form onSubmit={handleAuthSubmit} className="space-y-4 font-sans text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#111111] block">Admin Email Address *</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                placeholder="aaravgorewal@gmail.com"
                className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
              />
              <span className="text-[10px] font-mono text-[#111111]/60 block">
                Allowed: {ADMIN_EMAILS.join(', ')}
              </span>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#111111] block">Password *</label>
              <input
                type="password"
                required
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setIsNewAdminSetup(!isNewAdminSetup)}
                className="text-[11px] font-mono text-[#FF6B1A] hover:underline"
              >
                {isNewAdminSetup ? 'Switch to Sign In' : 'First Time Setup?'}
              </button>

              <button
                type="submit"
                disabled={authSubmitting}
                className="brutal-btn bg-[#FF6B1A] text-white px-5 py-2 font-display font-bold text-xs uppercase cursor-pointer"
              >
                {authSubmitting ? 'Authenticating...' : isNewAdminSetup ? 'Register Admin' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="pt-3 border-t-2 border-[#111111] text-[11px] font-mono text-[#111111]/60 text-center">
            Zero-Trust Firebase Authentication · DVSIET Meerut
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
        <nav className="flex items-center gap-1.5 font-mono text-xs font-bold">
          <button
            onClick={() => setActiveTab('registrations')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer ${
              activeTab === 'registrations' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Registrations ({registrations.length})
          </button>

          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer ${
              activeTab === 'pitch' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Pitch Applicants ({pitchApplicants.length})
          </button>

          <button
            onClick={() => setActiveTab('partners')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer ${
              activeTab === 'partners' ? 'bg-[#111111] text-[#FFD400]' : 'bg-white hover:bg-[#FFF2D6]'
            }`}
          >
            Partners ({partnerEnquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 border border-[#111111] transition-all cursor-pointer ${
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
        {/* STATS CARDS BAR                                                     */}
        {/* =================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-white brutal-border brutal-shadow-sm space-y-1">
            <span className="font-mono text-[11px] font-bold text-[#111111]/70 uppercase">
              Total Registrations
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
              {stats.total}
            </div>
            <span className="text-[10px] font-mono text-[#FF6B1A]">
              Live database count
            </span>
          </div>

          <div className="p-4 bg-white brutal-border brutal-shadow-sm space-y-1">
            <span className="font-mono text-[11px] font-bold text-[#111111]/70 uppercase">
              Students vs Founders
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
              {stats.students} <span className="text-base text-[#111111]/40">/</span> {stats.founders}
            </div>
            <span className="text-[10px] font-mono text-[#111111]/60">
              {stats.others} Professionals / Others
            </span>
          </div>

          <div className="p-4 bg-white brutal-border brutal-shadow-sm space-y-1">
            <span className="font-mono text-[11px] font-bold text-[#111111]/70 uppercase">
              Want to Pitch
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-[#FF6B1A]">
              {stats.wantsToPitch}
            </div>
            <span className="text-[10px] font-mono text-[#111111]/60">
              Mainstage aspirants
            </span>
          </div>

          <div className="p-4 bg-white brutal-border brutal-shadow-sm space-y-1">
            <span className="font-mono text-[11px] font-bold text-[#111111]/70 uppercase">
              Registered Today
            </span>
            <div className="font-display font-black text-2xl sm:text-3xl text-[#111111]">
              {stats.today}
            </div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              Active intake rate
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: REGISTRATIONS TABLE                                          */}
        {/* =================================================================== */}
        {activeTab === 'registrations' && (
          <div className="space-y-4">
            
            {/* Action Bar: Search, Filters & Export */}
            <div className="p-4 bg-white brutal-border brutal-shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
              
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search name, email, phone, college, ID..."
                  className="w-full p-2 pl-8 bg-[#FFF8EC] border border-[#111111] font-sans focus:outline-none focus:bg-white text-xs"
                />
                <Search className="w-3.5 h-3.5 text-[#111111]/60 absolute left-2.5 top-2.5" />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
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

                <select
                  value={pitchFilter}
                  onChange={(e) => {
                    setPitchFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                >
                  <option value="All">All Pitch Choices</option>
                  <option value="Yes">Wants to Pitch</option>
                  <option value="No">Spectators</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="p-2 bg-[#FFF8EC] border border-[#111111] font-mono text-[11px]"
                >
                  <option value="All">All Statuses</option>
                  <option value="registered">Registered</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="checked_in">Checked-in</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  onClick={handleExportRegistrations}
                  className="brutal-btn bg-[#FFD400] text-[#111111] px-3 py-2 font-mono text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleBulkStatus('confirmed')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-emerald-50 text-emerald-900"
                  >
                    Mark Confirmed
                  </button>
                  <button
                    onClick={() => handleBulkStatus('checked_in')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-blue-50 text-blue-900"
                  >
                    Mark Checked-in
                  </button>
                  <button
                    onClick={() => handleBulkStatus('cancelled')}
                    className="px-3 py-1 bg-white border border-[#111111] hover:bg-red-50 text-red-900"
                  >
                    Mark Cancelled
                  </button>
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-[#111111] underline ml-2"
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
                    <th className="p-3">College / Org</th>
                    <th className="p-3">Course / Year</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-center">Pitch</th>
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
                      <td className="p-3 text-[11px] max-w-[150px] truncate" title={reg.college}>
                        {reg.college}
                      </td>
                      <td className="p-3 text-[11px] text-[#111111]/70">
                        {reg.course ? `${reg.course} (${reg.year})` : '—'}
                      </td>
                      <td className="p-3">
                        <span className="font-mono text-[10px] px-1.5 py-0.5 border border-[#111111] bg-white">
                          {reg.role}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {reg.wantsToPitch ? (
                          <span className="font-mono text-[10px] font-bold text-white bg-[#FF6B1A] px-1.5 py-0.5">
                            PITCH
                          </span>
                        ) : (
                          <span className="text-[#111111]/40 text-xs">—</span>
                        )}
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
                              : reg.status === 'cancelled'
                              ? 'bg-red-100 text-red-900'
                              : 'bg-[#FFF8EC] text-[#111111]'
                          }`}
                        >
                          <option value="registered">Registered</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="checked_in">Checked-in</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-[#111111]/60 whitespace-nowrap">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setActiveDetailItem(reg);
                            setDetailNotes(reg.notes || '');
                          }}
                          className="px-2 py-1 border border-[#111111] bg-white hover:bg-[#FFD400] font-mono text-[10px] font-bold"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}

                  {paginatedRegistrations.length === 0 && (
                    <tr>
                      <td colSpan={11} className="p-8 text-center text-[#111111]/60 font-mono">
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

                  <div className="pt-1 text-xs font-mono grid grid-cols-2 gap-1 text-[#111111]/70 border-t border-[#111111]/10">
                    <div>Founder: <strong className="text-[#111111]">{applicant.name}</strong></div>
                    <div>Phone: <strong className="text-[#111111]">{applicant.phone}</strong></div>
                    <div>College: <span className="truncate block">{applicant.college}</span></div>
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
                    <th className="p-3">Inquiry Message</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Received At</th>
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
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}

                  {partnerEnquiries.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-[#111111]/60 font-mono">
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
                {(['registered', 'confirmed', 'checked_in', 'cancelled'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(activeDetailItem.id, st)}
                    className={`p-2 border border-[#111111] uppercase font-bold text-[11px] ${
                      activeDetailItem.status === st
                        ? 'bg-[#111111] text-[#FFD400]'
                        : 'bg-[#FFF8EC] hover:bg-white'
                    }`}
                  >
                    {st.replace('_', '-')}
                  </button>
                ))}
              </div>
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
                <span>{activeDetailItem.college}</span>
              </div>
              <div>Course: {activeDetailItem.course || '—'} ({activeDetailItem.year || '—'})</div>
              <div>Role: <strong>{activeDetailItem.role}</strong></div>
              <div>City: {activeDetailItem.city}</div>
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
                className="brutal-btn bg-[#111111] text-white px-4 py-2 font-mono text-xs font-bold uppercase"
              >
                Save Notes
              </button>
            </div>

            <div className="pt-4 border-t border-[#111111]/20 font-mono text-[10px] text-[#111111]/60">
              Registered on: {new Date(activeDetailItem.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
