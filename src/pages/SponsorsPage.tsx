import React, { useState, useMemo } from 'react';
import {
  Handshake,
  Download,
  Users,
  Compass,
  TrendingUp,
  Building,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Zap,
  Coffee,
  Printer,
  Shirt,
  GraduationCap,
  Globe,
  Radio,
  Eye,
  EyeOff,
  Briefcase,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Toast } from '../components/ui/Toast.tsx';
import {
  SPONSORS,
  SponsorItem,
  SponsorCategory,
  SPONSORS_CONFIG,
  EVENT_DATA,
} from '../data/content.ts';

// 12 Sponsorship Category Definitions
const SPONSOR_CATEGORIES_DATA: {
  category: SponsorCategory;
  tag: string;
  scope: string;
  icon: React.ReactNode;
}[] = [
  {
    category: 'Title Partner',
    tag: 'Principal Brand',
    scope: 'Exclusive naming rights ("Startup Conclave 1.0 Presented by [Brand]"), keynote opening address, central stage branding, and premier double booth in the Startup Pavilion.',
    icon: <Award className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Powered By Partner',
    tag: 'Co-Host Presence',
    scope: 'Secondary headline billing across all print, stage backdrops, and media banners. Keynote panel seat and prime exhibition pavilion placement.',
    icon: <Zap className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Gold',
    tag: 'Tier 01 Partner',
    scope: 'High-visibility hall branding, sponsored breakout masterclass, demo table, delegate kit inclusions, and priority student recruiting access.',
    icon: <Sparkles className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Silver',
    tag: 'Tier 02 Partner',
    scope: 'Logo inclusion across official digital assets, certificates, branded lanyard distribution, and demo kiosk.',
    icon: <Building className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Technology',
    tag: 'Cloud & Tooling',
    scope: 'Provide developer cloud credits, API access, or engineering toolkits for student builders and exhibition startups with dedicated workshop tracks.',
    icon: <Globe className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Banking/FinTech',
    tag: 'Financial Infrastructure',
    scope: 'Host the investor checkout and startup banking masterclass; evaluate venture billing mechanics and credit facilitation.',
    icon: <TrendingUp className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Education',
    tag: 'Academic Linkage',
    scope: 'Sponsor delegate scholarships for tier-2/3 student innovators, curriculum masterclasses, and research transition tables.',
    icon: <GraduationCap className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Community',
    tag: 'Grassroots Ecosystem',
    scope: 'Regional entrepreneurship cells, developer meetups, and regional startup hubs amplifying delegate outreach.',
    icon: <Users className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Media',
    tag: 'Press & Coverage',
    scope: 'Exclusive media partner covering founder interviews, fireside recaps, press room broadcasting, and post-conclave reports.',
    icon: <Radio className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Food',
    tag: 'Hospitality Partner',
    scope: 'Sponsoring networking luncheons, VIP investor dinners, and artisanal campus coffee stations across the two days.',
    icon: <Coffee className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Printing',
    tag: 'Print & Signage',
    scope: 'Exclusive print partner for stage vinyl backdrops, delegate badges, exhibition directory guides, and attendee certificates.',
    icon: <Printer className="w-5 h-5 text-[#E8590C]" />,
  },
  {
    category: 'Swag',
    tag: 'Merchandise Partner',
    scope: 'Curate attendee delegate bags, official conclave T-shirts, notebooks, and founder survival kits.',
    icon: <Shirt className="w-5 h-5 text-[#E8590C]" />,
  },
];

// Matrix benefits list
const MATRIX_BENEFITS = [
  'Logo on website',
  'Stage branding',
  'Event backdrop',
  'Social media promotion',
  'Speaker opportunity',
  'Workshop opportunity',
  'Exhibition booth',
  'Product showcase',
  'Branding on certificates',
  'Attendee kits and T-shirts',
  'Networking access',
  'Recruitment access',
  'Startup ecosystem access',
];

export const SponsorsPage: React.FC = () => {
  // Developer sandbox switch to test populated state
  const [showDemoSponsor, setShowDemoSponsor] = useState(false);

  // Enquiry Form State
  const [formData, setFormData] = useState({
    company: '',
    contactName: '',
    role: '',
    email: '',
    phone: '',
    categoryOfInterest: 'Title Partner',
    budgetRange: '',
    inKindOffer: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirmed sponsors
  const activeSponsors = useMemo(() => {
    return SPONSORS.filter((s) => {
      if (showDemoSponsor && s.id === 'demo-sponsor-01') return true;
      return s.status === 'confirmed';
    });
  }, [showDemoSponsor]);

  const handleSubmitEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.contactName || !formData.email) {
      setFormError('Please fill in your company, contact name, and business email.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage('Partnership inquiry submitted! Our secretariat desk will reach out within 24 hours.');
      setFormData({
        company: '',
        contactName: '',
        role: '',
        email: '',
        phone: '',
        categoryOfInterest: 'Title Partner',
        budgetRange: '',
        inKindOffer: '',
        message: '',
      });
    }, 750);
  };

  return (
    <PageShell
      title="Partners & Sponsors"
      kicker="CORPORATE & ECOSYSTEM ENGAGEMENT"
      statusBadge="Prospectus Available on Request"
      description="Collaborate with Startup Conclave 1.0 at DVSIET Meerut. Position your organization at the intersection of capital, engineering talent, and regional venture scale."
    >
      <div className="space-y-20 max-w-6xl mx-auto text-left">
        
        {/* Developer Sandbox Switch: Toggle Demo Partner Card */}
        <div className="flex items-center justify-between p-3 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-xs text-[#52525B]">
          <span className="font-mono text-[11px]">
            Sponsor Database Status: {activeSponsors.length} confirmed partner(s) visible (Never uses fake logos)
          </span>
          <button
            type="button"
            onClick={() => setShowDemoSponsor(!showDemoSponsor)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#E8590C] hover:text-[#C2410C] focus-visible:outline-none"
          >
            {showDemoSponsor ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDemoSponsor ? 'Return to Default Empty State' : 'Preview Populated Partner Grid'}</span>
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-4">
            <Toast
              type="success"
              title="Partnership Inquiry Received"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* 1. WHY PARTNER SECTION (With target language strictly enforced)    */}
        {/* =================================================================== */}
        <div className="space-y-8">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="type-eyebrow text-[#E8590C]">WHY PARTNER</span>
              <h2 className="type-h2 text-[#18181B] font-display">
                Four Strategic Growth Multipliers
              </h2>
              <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
                Every partnership tier is tailored to deliver measurable brand positioning, pipeline access, and corporate visibility.
              </p>
            </div>

            {/* Target Language Callout */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] px-3.5 py-2 text-xs font-sans text-[#18181B] shrink-0 space-y-0.5">
              <span className="font-mono text-[10px] text-[#71717A] block uppercase tracking-wider">
                Audience Projection
              </span>
              <span className="font-bold text-[#E8590C]">Aiming for 300–500+ attendees</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Value 1 */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3.5 shadow-xs hover:border-[#18181B] transition-colors">
              <div className="w-10 h-10 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="type-h4 text-[#18181B] font-display">
                Access to Young Talent
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Engage directly with hundreds of high-caliber engineering, design, and computer science students from DVSIET and regional universities eager for internships and core roles.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] text-[11px] font-mono text-[#71717A]">
                Recruitment Pipelines
              </div>
            </div>

            {/* Value 2 */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3.5 shadow-xs hover:border-[#18181B] transition-colors">
              <div className="w-10 h-10 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="type-h4 text-[#18181B] font-display">
                Startup Ecosystem Access
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Direct conduit into early-stage student prototypes, patent-ready research spin-offs, and emerging commercial ventures across Western Uttar Pradesh.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] text-[11px] font-mono text-[#71717A]">
                Grassroots Innovation
              </div>
            </div>

            {/* Value 3 */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3.5 shadow-xs hover:border-[#18181B] transition-colors">
              <div className="w-10 h-10 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="type-h4 text-[#18181B] font-display">
                Investor & Founder Networking
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Unrushed, high-density face-to-face interaction with venture capitalists, angel syndicates, veteran founders, and campus faculty in the VIP lounge.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] text-[11px] font-mono text-[#71717A]">
                Executive Relationships
              </div>
            </div>

            {/* Value 4 */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3.5 shadow-xs hover:border-[#18181B] transition-colors">
              <div className="w-10 h-10 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="type-h4 text-[#18181B] font-display">
                Regional Brand Visibility
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                Extensive physical and digital branding across stage backdrops, attendee kits, certificates, and multi-channel regional press coverage.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] text-[11px] font-mono text-[#71717A]">
                Brand Eminence
              </div>
            </div>

          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. SPONSORSHIP CATEGORIES (12 Cards)                                */}
        {/* =================================================================== */}
        <div className="space-y-8">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="type-eyebrow text-[#E8590C]">CURATED TIERS</span>
              <h2 className="type-h2 text-[#18181B] font-display">Twelve Partnership Categories</h2>
              <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
                From title sponsorship to focused in-kind tracks, select the tier that aligns with your strategic objectives.
              </p>
            </div>

            {/* Download Sponsorship Deck Button (Disabled with tooltip) */}
            <div className="relative shrink-0">
              <button
                type="button"
                disabled={!SPONSORS_CONFIG.deckUrl}
                className={`inline-flex items-center gap-2 rounded-[3px] px-4 py-2 text-xs font-semibold font-sans transition-all focus-visible:outline-none ${
                  SPONSORS_CONFIG.deckUrl
                    ? 'bg-[#18181B] text-white hover:bg-[#E8590C]'
                    : 'border border-[#E4E0D7] bg-[#F4F1EA] text-[#71717A] cursor-not-allowed'
                }`}
                title={SPONSORS_CONFIG.deckUrl ? 'Download full PDF deck' : 'Official sponsorship prospectus coming soon'}
              >
                <Download className="w-3.5 h-3.5" />
                <span>
                  {SPONSORS_CONFIG.deckUrl ? 'Download Sponsorship Deck' : 'Deck Coming Soon'}
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SPONSOR_CATEGORIES_DATA.map((tier) => (
              <div
                key={tier.category}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 text-left hover:border-[#18181B] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
                    <span className="text-[10px] font-mono uppercase font-bold text-[#E8590C] tracking-wider">
                      {tier.tag}
                    </span>
                    <div className="w-7 h-7 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
                      {tier.icon}
                    </div>
                  </div>

                  <h3 className="type-h3 text-[#18181B] font-display">
                    {tier.category}
                  </h3>

                  <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                    {tier.scope}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#71717A]">Availability: Limited</span>
                  <a href="#enquiry-form" className="font-semibold text-[#E8590C] hover:underline">
                    Inquire Tier →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. BENEFITS MATRIX TABLE (Sticky first col, Horizontal scroll)      */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4">
            <span className="type-eyebrow text-[#E8590C]">DELIVERABLES MATRIX</span>
            <h2 className="type-h2 text-[#18181B] font-display">Sponsorship Benefits Matrix</h2>
            <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
              Compare deliverable allocations across primary tiers. Final custom allocations are finalized during contract alignment.
            </p>
          </div>

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white overflow-hidden shadow-paper">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="border-b border-[#E4E0D7] bg-[#F4F1EA] text-[#18181B] font-sans uppercase font-bold text-[11px]">
                  <tr>
                    {/* Sticky first column */}
                    <th
                      scope="col"
                      className="sticky left-0 bg-[#F4F1EA] px-5 py-4 z-10 border-r border-[#E4E0D7] min-w-[200px]"
                    >
                      Benefit / Deliverable
                    </th>
                    <th scope="col" className="px-4 py-4 text-center min-w-[120px]">Title Partner</th>
                    <th scope="col" className="px-4 py-4 text-center min-w-[120px]">Powered By</th>
                    <th scope="col" className="px-4 py-4 text-center min-w-[110px]">Gold</th>
                    <th scope="col" className="px-4 py-4 text-center min-w-[110px]">Silver</th>
                    <th scope="col" className="px-4 py-4 text-center min-w-[140px]">In-Kind / Category</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#EFECE6] text-[#52525B]">
                  {MATRIX_BENEFITS.map((benefit, idx) => (
                    <tr
                      key={benefit}
                      className={idx % 2 === 0 ? 'bg-white' : 'bg-[#FBF9F5]'}
                    >
                      {/* Sticky first cell in row */}
                      <td
                        className={`sticky left-0 px-5 py-3 font-semibold text-[#18181B] border-r border-[#E4E0D7] z-10 ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-[#FBF9F5]'
                        }`}
                      >
                        {benefit}
                      </td>

                      {/* Cell values placeholder "TBD" */}
                      <td className="px-4 py-3 text-center font-mono text-[11px] font-bold text-[#E8590C]">
                        TBD
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-[11px] font-bold text-[#18181B]">
                        TBD
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-[11px] text-[#52525B]">
                        TBD
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-[11px] text-[#71717A]">
                        TBD
                      </td>
                      <td className="px-4 py-3 text-center font-mono text-[11px] text-[#71717A]">
                        TBD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 border-t border-[#EFECE6] bg-[#FBF9F5] text-right text-[11px] text-[#71717A] font-mono">
              Swipe horizontally to view all tier columns · Specific tier commitments confirmed in partnership contract
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 4. PARTNER LOGO GRID (Empty State with no fake logos)               */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4 flex items-center justify-between">
            <div>
              <span className="type-eyebrow text-[#E8590C]">CONFIRMED PARTNERS</span>
              <h2 className="type-h2 text-[#18181B] font-display">Our Ecosystem Partners</h2>
            </div>
            <StatusBadge status="coming_soon" customLabel="Partners Announcing Soon" />
          </div>

          {activeSponsors.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {activeSponsors.map((partner) => (
                <div
                  key={partner.id}
                  className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 text-center space-y-2 shadow-xs"
                >
                  <div className="w-12 h-12 rounded-[2px] bg-[#F4F1EA] flex items-center justify-center font-bold text-[#18181B] mx-auto">
                    {partner.name[0]}
                  </div>
                  <div className="font-semibold text-xs text-[#18181B] font-display">
                    {partner.name}
                  </div>
                  <span className="text-[10px] font-mono text-[#E8590C]">
                    {partner.category}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-10 sm:p-14 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
              <div className="w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C] mx-auto">
                <Handshake className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h3 className="type-h3 text-[#18181B] font-display">
                  Partners announcing soon
                </h3>
                <p className="type-body text-[#52525B] text-xs sm:text-sm max-w-md mx-auto">
                  Corporate sponsorships, technology cloud grants, and community associations are undergoing administrative review. Confirmed partner logos will be published in official batches.
                </p>
              </div>

              <div className="pt-2">
                <a href="#enquiry-form">
                  <Button variant="secondary" size="sm">
                    Inquire to Join as a Partner
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 5. ENQUIRY FORM                                                     */}
        {/* =================================================================== */}
        <div
          id="enquiry-form"
          className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 shadow-paper space-y-6 scroll-mt-20"
        >
          <div className="border-b border-[#E4E0D7] pb-4">
            <span className="type-eyebrow text-[#E8590C]">DIRECT ENQUIRY</span>
            <h2 className="type-h2 text-[#18181B] font-display">Sponsorship & Partnership Inquiry</h2>
            <p className="type-body text-[#52525B] max-w-xl mt-1">
              Submit your expression of interest. The conclave secretariat will contact your team with custom deliverable options and invoice schedules.
            </p>
          </div>

          <form onSubmit={handleSubmitEnquiry} className="space-y-5">
            {formError && (
              <div className="p-3 rounded-[2px] border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company / Organisation Name"
                placeholder="e.g. Acme Cloud Corporation"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                required
              />

              <Input
                label="Contact Person Name"
                placeholder="e.g. Shalini Roy"
                value={formData.contactName}
                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Designation / Role"
                placeholder="e.g. Head of Ecosystem Partnerships"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />

              <Input
                label="Business Email Address"
                type="email"
                placeholder="shalini@acme.com"
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

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Category of Interest"
                value={formData.categoryOfInterest}
                onChange={(e) => setFormData({ ...formData, categoryOfInterest: e.target.value })}
                options={[
                  { value: 'Title Partner', label: 'Title Partner' },
                  { value: 'Powered By Partner', label: 'Powered By Partner' },
                  { value: 'Gold', label: 'Gold Partner' },
                  { value: 'Silver', label: 'Silver Partner' },
                  { value: 'Technology', label: 'Technology / Cloud Credits' },
                  { value: 'Banking/FinTech', label: 'Banking / FinTech' },
                  { value: 'Education', label: 'Education / Scholarship' },
                  { value: 'Community', label: 'Community Ecosystem' },
                  { value: 'Media', label: 'Media & Coverage' },
                  { value: 'Food', label: 'Food & Hospitality' },
                  { value: 'Printing', label: 'Printing & Signage' },
                  { value: 'Swag', label: 'Swag & Merchandising' },
                  { value: 'Custom Package', label: 'Custom Combination' },
                ]}
              />

              <Input
                label="Budget Range (Optional)"
                placeholder="e.g. ₹1 - ₹5 Lakhs"
                value={formData.budgetRange}
                onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                helperText="To recommend appropriate tier"
              />

              <Input
                label="In-Kind Contribution (Optional)"
                placeholder="e.g. Cloud credits, catering, merchandise"
                value={formData.inKindOffer}
                onChange={(e) => setFormData({ ...formData, inKindOffer: e.target.value })}
                helperText="Products or services offered"
              />
            </div>

            <Textarea
              label="Partnership Goals & Specific Requests"
              placeholder="Tell us about your brand objectives, stage presence preferences, or workshop tracks..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              helperText="Strictly confidential inquiry sent to DVSIET Conclave Steering Committee."
            />

            <div className="pt-3 border-t border-[#EFECE6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <span className="text-xs text-[#71717A]">
                Have immediate questions? Contact <a href={`mailto:${EVENT_DATA.contactEmail}`} className="text-[#E8590C] underline font-medium">{EVENT_DATA.contactEmail}</a>
              </span>

              <Button
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isSubmitting}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Submit Partnership Inquiry
              </Button>
            </div>
          </form>
        </div>

      </div>
    </PageShell>
  );
};
