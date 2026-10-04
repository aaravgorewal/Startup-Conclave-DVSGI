import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  Search,
  ExternalLink,
  QrCode,
  Laptop,
  Zap,
  Wifi,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building,
  Layers,
  Eye,
  EyeOff,
  Handshake,
  Tag,
  Monitor,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { Toast } from '../components/ui/Toast.tsx';
import {
  STARTUPS,
  StartupItem,
  StartupSector,
  STARTUPS_STATUS,
  EVENT_DATA,
} from '../data/content.ts';

// Sector filter list
const SECTOR_OPTIONS: (string | StartupSector)[] = [
  'All',
  'AI / SaaS',
  'AgriTech',
  'CleanTech / EV',
  'HealthTech',
  'EdTech',
  'FinTech',
  'Consumer / D2C',
  'DeepTech / Robotics',
];

// Single Startup Directory Card
const StartupCard: React.FC<{ startup: StartupItem }> = ({ startup }) => {
  const initials = startup.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 sm:p-6 shadow-xs hover:border-[#18181B] hover:shadow-paper transition-all text-left flex flex-col justify-between space-y-4">
      <div className="space-y-3.5">
        
        {/* Top Header: Logo / Monogram + Sector Tag */}
        <div className="flex items-start justify-between gap-3">
          <div className="w-12 h-12 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-[#18181B] font-display font-bold text-sm flex items-center justify-center shrink-0">
            {startup.logo ? (
              <img
                src={startup.logo}
                alt={startup.name}
                className="w-full h-full object-cover rounded-[3px]"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-[2px] bg-[#FBF9F5] text-[#E8590C] border border-[#FED7AA]">
            {startup.sector}
          </span>
        </div>

        {/* Identity & One-Liner */}
        <div>
          <h3 className="type-h3 text-[#18181B] font-display">
            {startup.name}
          </h3>
          <p className="mt-1 text-xs text-[#52525B] leading-relaxed line-clamp-3">
            {startup.oneLiner}
          </p>
        </div>

        {/* Founder note if available */}
        {startup.founders && (
          <p className="text-[11px] text-[#71717A] font-sans">
            <span className="font-semibold text-[#18181B]">Founders: </span>
            {startup.founders}
          </p>
        )}
      </div>

      {/* Footer: Booth + External Website link */}
      <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs">
        <span className="font-mono text-[11px] text-[#71717A]">
          {startup.boothNumber || 'Pavilion Corridor'}
        </span>

        {startup.website && (
          <a
            href={startup.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#E8590C] hover:underline"
          >
            <span>Visit Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
};

export const StartupsPage: React.FC = () => {
  // Modal & Toast state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Developer sandbox switch to preview populated state
  const [showDemoStartup, setShowDemoStartup] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    startupName: '',
    founder: '',
    email: '',
    phone: '',
    website: '',
    sector: 'AI / SaaS',
    productDescription: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Active startups dataset
  const activeStartups = useMemo(() => {
    return STARTUPS.filter((item) => {
      if (showDemoStartup && item.id === 'demo-startup-01') return true;
      return item.status === 'confirmed' || item.status === 'shortlisted';
    });
  }, [showDemoStartup]);

  // Filtered startups by search and sector
  const filteredStartups = useMemo(() => {
    return activeStartups.filter((item) => {
      const matchesSector =
        selectedSector === 'All' || item.sector === selectedSector;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.oneLiner.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSector && matchesSearch;
    });
  }, [activeStartups, selectedSector, searchQuery]);

  // Form submission handler
  const handleBoothSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startupName || !formData.founder || !formData.email || !formData.productDescription) {
      setFormError('Please fill in startup name, founder name, email, and product description.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setToastMessage('Booth application submitted! The secretariat will review your prototype.');
      setFormData({
        startupName: '',
        founder: '',
        email: '',
        phone: '',
        website: '',
        sector: 'AI / SaaS',
        productDescription: '',
      });
    }, 700);
  };

  return (
    <PageShell
      title="Startup Showcase 1.0"
      kicker="EXHIBITION PAVILION"
      statusBadge="Applications Opening Soon"
      description="A dedicated physical corridor at DVSIET Meerut for student ventures, research spin-offs, and early innovators to showcase functional prototypes."
    >
      <div className="space-y-16 max-w-6xl mx-auto text-left">
        
        {/* Developer Sandbox Switch: Toggle Demo Startup Card */}
        <div className="flex items-center justify-between p-3 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-xs text-[#52525B]">
          <span className="font-mono text-[11px]">
            Directory Status: {activeStartups.length} active exhibition booth(s) (Hidden demo excluded by default)
          </span>
          <button
            type="button"
            onClick={() => setShowDemoStartup(!showDemoStartup)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#E8590C] hover:text-[#C2410C] focus-visible:outline-none"
          >
            {showDemoStartup ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDemoStartup ? 'Return to Default Empty State' : 'Preview Populated Directory Layout'}</span>
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="mb-4">
            <Toast
              type="success"
              title="Exhibition Application Received"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* 1. Exhibition Overview & Stylized "Booth Card" Illustration         */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Narrative Column */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <span className="type-eyebrow text-[#E8590C]">
                PHYSICAL DEMO FLOOR
              </span>
              <h2 className="type-h2 text-[#18181B] font-display">
                Put Your Prototype Directly in Front of Investors & Builders
              </h2>
            </div>

            <p className="type-body text-[#52525B] leading-relaxed">
              Startup Showcase 1.0 is the physical exhibition heart of the conclave. Selected startups get a dedicated demo station equipped with high-visibility branding, a physical table space, high-speed power/Wi-Fi, and a dynamic QR code standee so delegates can test your app, join your waitlist, or review your deck instantly.
            </p>

            {/* Checklist of what an exhibitor receives */}
            <div className="space-y-2.5 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#18181B] font-sans block">
                Every Selected Exhibitor Receives:
              </span>
              <ul className="space-y-2 text-xs text-[#52525B] font-sans">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0" />
                  <span><strong>Dedicated Demo Station:</strong> Custom table space with your logo, one-liner, and product fascia.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0" />
                  <span><strong>Integrated QR Code:</strong> Direct scan-to-app, web prototype, or investor one-pager.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0" />
                  <span><strong>Founder Contact Placement:</strong> Highlighting founder details and direct outreach links.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0" />
                  <span><strong>Direct Delegate Footfall:</strong> Exposure to 300–500+ visiting students, angel jury, and enterprise peers.</span>
                </li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                rightIcon={<Rocket className="w-4 h-4" />}
              >
                Apply for a Booth
              </Button>
            </div>
          </div>

          {/* Stylized "Booth Card" Illustration */}
          <div className="lg:col-span-6">
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 shadow-paper text-left space-y-4 relative overflow-hidden">
              
              {/* Header Tab */}
              <div className="flex items-center justify-between border-b border-[#E4E0D7] pb-3">
                <div className="flex items-center gap-2 text-xs font-mono text-[#71717A]">
                  <Monitor className="w-4 h-4 text-[#E8590C]" />
                  <span>EXHIBITOR STATION SPECIMEN</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                  Pavilion Spec
                </span>
              </div>

              {/* Stylized Booth Diagram Box */}
              <div className="rounded-[3px] border-2 border-dashed border-[#E4E0D7] bg-[#FBF9F5] p-5 space-y-4">
                
                {/* 1. Header Fascia: Logo & Name */}
                <div className="rounded-[2px] border border-[#18181B] bg-[#18181B] text-[#FBF9F5] p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-[2px] bg-[#E8590C] text-white flex items-center justify-center font-bold text-xs">
                      SF
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider font-sans">
                        [STARTUP LOGO & FASCIA]
                      </div>
                      <div className="text-[10px] text-[#A1A1AA]">
                        Category: AI / SaaS · Table A-01
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#FED7AA]">2-DAY PASS</span>
                </div>

                {/* 2. Middle Row: Product Demo & Standee QR */}
                <div className="grid grid-cols-3 gap-3">
                  
                  {/* Left 2 Cols: Product Demo Screen */}
                  <div className="col-span-2 rounded-[2px] border border-[#E4E0D7] bg-white p-3 space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#18181B]">
                        <Laptop className="w-3.5 h-3.5 text-[#E8590C]" />
                        <span>Interactive Product Demo</span>
                      </div>
                      <p className="text-[10px] text-[#52525B] mt-1 leading-snug">
                        Tabletop space for laptop, prototype tablets, or hardware test bench.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#71717A] pt-1 border-t border-[#EFECE6]">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#E8590C]" /> 230V Socket
                      </span>
                      <span className="flex items-center gap-1">
                        <Wifi className="w-3 h-3 text-[#E8590C]" /> High-Speed Wi-Fi
                      </span>
                    </div>
                  </div>

                  {/* Right 1 Col: Standee QR Code */}
                  <div className="rounded-[2px] border border-[#E4E0D7] bg-[#FFF7ED] p-3 text-center flex flex-col items-center justify-center space-y-1.5">
                    <QrCode className="w-8 h-8 text-[#E8590C]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#9A3412] font-sans">
                      SCAN FOR PROTOTYPE
                    </span>
                    <span className="text-[8px] text-[#71717A]">
                      Direct scan standee
                    </span>
                  </div>
                </div>

                {/* 3. Bottom Row: Founder Credentials Card */}
                <div className="rounded-[2px] border border-[#E4E0D7] bg-white p-2.5 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-semibold text-[#18181B] block">Founder Details & Team Contact</span>
                    <span className="text-[10px] text-[#71717A]">Direct email, WhatsApp, and LinkedIn badges</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#E8590C]">DVSIET Pavilion</span>
                </div>

              </div>

              <div className="text-center text-xs text-[#71717A] pt-1">
                Visual specification · Ready for all selected student & early-stage ventures
              </div>
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* 2. Startup Directory Grid with Search & Sector Filters              */}
        {/* =================================================================== */}
        <div className="space-y-6">
          
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="type-eyebrow text-[#E8590C]">EXHIBITION DIRECTORY</div>
              <h2 className="type-h2 text-[#18181B] font-display">Selected Startups</h2>
              <p className="type-body text-[#52525B] max-w-xl mt-0.5">
                Browse student innovators and regional product teams exhibiting at Startup Conclave 1.0.
              </p>
            </div>

            {/* Search Input */}
            <div className="w-full md:w-72 relative">
              <label htmlFor="startup-search" className="sr-only">
                Search startups
              </label>
              <input
                id="startup-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search startups, keywords..."
                className="w-full rounded-[3px] border border-[#E4E0D7] bg-white pl-9 pr-3 py-2 text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
              />
              <Search className="w-4 h-4 text-[#71717A] absolute left-3 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Sector Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-[11px] font-semibold uppercase text-[#71717A] shrink-0 mr-1 hidden sm:inline">
              Sector:
            </span>
            {SECTOR_OPTIONS.map((sec) => (
              <Chip
                key={sec}
                active={selectedSector === sec}
                onClick={() => setSelectedSector(sec)}
                className="shrink-0"
              >
                {sec}
              </Chip>
            ))}
          </div>

          {/* Populated Directory Cards */}
          {filteredStartups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStartups.map((startup) => (
                <StartupCard key={startup.id} startup={startup} />
              ))}
            </div>
          )}

          {/* Empty State when no startups exist or match filters */}
          {filteredStartups.length === 0 && (
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C] mx-auto">
                <Rocket className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="type-h3 text-[#18181B] font-display">
                  Selected startups will be featured here.
                </h3>
                <p className="type-body text-[#52525B] max-w-md mx-auto text-xs sm:text-sm">
                  {searchQuery || selectedSector !== 'All'
                    ? 'No startups matched your current search or sector filter. Try adjusting your search term.'
                    : 'Showcase applications are currently being received and evaluated by the technical jury. Shortlisted teams will be listed here prior to the conclave.'}
                </p>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Apply for an Exhibition Booth
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* =================================================================== */}
        {/* 3. Note Linking Exhibitions to Sponsorship Opportunities           */}
        {/* =================================================================== */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-2xl">
            <div className="type-eyebrow text-[#E8590C] flex items-center gap-1.5">
              <Handshake className="w-3.5 h-3.5" />
              <span>SPONSORSHIP & BRAND PAVILION</span>
            </div>
            <h3 className="type-h3 text-[#18181B] font-display">
              Exhibitions Are Also a Prime Sponsorship Opportunity
            </h3>
            <p className="type-body text-[#52525B] text-xs sm:text-sm leading-relaxed">
              Are you an enterprise technology company, cloud provider, or regional brand looking to host an exclusive branded pavilion, sponsor student maker spaces, or conduct live hiring challenges?
            </p>
          </div>
          
          <Link to="/sponsors" className="shrink-0">
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4 text-[#E8590C]" />}
            >
              Explore Partner Tiers
            </Button>
          </Link>
        </div>

      </div>

      {/* =================================================================== */}
      {/* Modal Form: Apply for a Booth                                       */}
      {/* =================================================================== */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Apply for an Exhibition Booth"
        description="Showcase your venture, test your prototype, and meet prospective investors at Startup Conclave 1.0 (DVSIET Meerut)."
        footerActions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleBoothSubmit}
              isLoading={isSubmitting}
            >
              Submit Booth Application
            </Button>
          </>
        }
      >
        <form onSubmit={handleBoothSubmit} className="space-y-4 text-left">
          {formError && (
            <div className="p-3 rounded-[2px] border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Startup Name"
              placeholder="e.g. AgriSense Robotics"
              value={formData.startupName}
              onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
              required
            />

            <Input
              label="Founder / Co-Founders"
              placeholder="e.g. Tanya Singh & Rahul Dev"
              value={formData.founder}
              onChange={(e) => setFormData({ ...formData, founder: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Founder Email"
              type="email"
              placeholder="founder@agrisense.io"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Website or Prototype URL"
              type="url"
              placeholder="https://yourstartup.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              helperText="Optional if still in local prototype"
            />

            <Select
              label="Industry Sector"
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
              options={[
                { value: 'AI / SaaS', label: 'AI / SaaS' },
                { value: 'AgriTech', label: 'AgriTech' },
                { value: 'CleanTech / EV', label: 'CleanTech / EV' },
                { value: 'HealthTech', label: 'HealthTech' },
                { value: 'EdTech', label: 'EdTech' },
                { value: 'FinTech', label: 'FinTech' },
                { value: 'Consumer / D2C', label: 'Consumer / D2C' },
                { value: 'DeepTech / Robotics', label: 'DeepTech / Robotics' },
              ]}
            />
          </div>

          <Textarea
            label="Product Description & What You Plan to Demo"
            placeholder="Describe what your product does, current stage of MVP / traction, and what hardware/software you will exhibit at the booth..."
            value={formData.productDescription}
            onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
            required
            helperText="Include any specific power or table space requirements."
          />
        </form>
      </Modal>

    </PageShell>
  );
};
