import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Award,
  Users,
  Briefcase,
  Coffee,
  CheckCircle2,
  Mail,
  Phone,
  Building,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Modal } from '../components/ui/Modal.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Toast } from '../components/ui/Toast.tsx';
import {
  INVESTORS,
  InvestorItem,
  INVESTORS_STATUS,
  EVENT_DATA,
} from '../data/content.ts';

// Populated Investor / Jury Card
const InvestorCard: React.FC<{ investor: InvestorItem }> = ({ investor }) => {
  return (
    <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs hover:border-[#18181B] hover:shadow-paper transition-all text-left flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2 border-b border-[#EFECE6] pb-3">
          <span className="text-[11px] font-mono uppercase font-bold text-[#E8590C] tracking-wider">
            {investor.role}
          </span>
          <StatusBadge status="confirmed" size="sm" customLabel="Confirmed" />
        </div>

        <div>
          <h3 className="type-h3 text-[#18181B] font-display">
            {investor.name}
          </h3>
          <p className="text-xs font-semibold text-[#52525B] font-sans flex items-center gap-1.5 mt-1">
            <Building className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
            <span>{investor.fund}</span>
          </p>
        </div>

        {investor.focus && (
          <p className="text-xs text-[#71717A] font-sans leading-relaxed pt-1">
            <span className="font-semibold text-[#18181B]">Focus: </span>
            {investor.focus}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
        <span>Accredited Delegate</span>
        <span className="text-[#E8590C]">Stage 02 Access</span>
      </div>
    </div>
  );
};

export const InvestorsPage: React.FC = () => {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    fund: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Developer preview switch to test populated state
  const [showDemoInvestor, setShowDemoInvestor] = useState(false);

  // Confirmed investors rule: shown only when status is confirmed
  const confirmedInvestors = useMemo(() => {
    return INVESTORS.filter((item) => {
      if (showDemoInvestor && item.id === 'demo-investor-01') return true;
      return item.status === 'confirmed';
    });
  }, [showDemoInvestor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.fund || !formData.email) {
      setFormError('Please fill in your name, fund/organisation, and email.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    setTimeout(() => {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setToastMessage('Thank you! Your interest has been submitted to the Conclave Secretariat.');
      setFormData({
        name: '',
        fund: '',
        email: '',
        phone: '',
        message: '',
      });
    }, 700);
  };

  // Three "How investors will engage" cards
  const engagementCards = [
    {
      num: "01",
      icon: <Award className="w-5 h-5 text-[#E8590C]" />,
      title: "Pitch Arena Venture Jury",
      subtitle: "Live Mainstage Evaluation",
      description:
        "Evaluate the top 20 vetted early-stage startups on the main stage. Participate in live 5-minute pitches, 3-minute Q&A rounds, proprietary evaluation rubrics, and determine cash grant allocations.",
      deliverable: "Stage 02 Jury Seating",
    },
    {
      num: "02",
      icon: <Coffee className="w-5 h-5 text-[#E8590C]" />,
      title: "Investor Lounge & VIP Deal Flow",
      subtitle: "Curated Startup Access",
      description:
        "Access the dedicated, confidential investor lounge away from main hall traffic. Receive pre-screened deal books, executive summaries, traction data, and priority 1-on-1 breakout tables with founders.",
      deliverable: "Private Deal Flow Directory",
    },
    {
      num: "03",
      icon: <Users className="w-5 h-5 text-[#E8590C]" />,
      title: "Founder Mentorship & Keynotes",
      subtitle: "Thought Leadership & Roundtable Clinics",
      description:
        "Lead discussions on Day 2 investor tracks ('How Investors Think', 'VC vs Angel Investment') and host closed-door round-table clinics to mentor promising student innovators and first-time founders.",
      deliverable: "Speaker & Panel Inclusion",
    },
  ];

  return (
    <PageShell
      title="Investors & Jury: Coming Soon"
      kicker="CAPITAL & JURY CORRIDOR"
      statusBadge="Delegation In Finalization"
      description="Connecting venture capital funds, angel syndicates, and experienced operators with high-potential regional builders at DVSIET Meerut."
    >
      <div className="space-y-14 max-w-6xl mx-auto text-left">
        
        {/* Developer Sandbox Switch: Toggle Demo Populated View */}
        <div className="flex items-center justify-between p-3 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-xs text-[#52525B]">
          <span className="font-mono text-[11px]">
            Data Source Status: {confirmedInvestors.length} confirmed investor(s) visible (Strictly no speculative fund lists)
          </span>
          <button
            type="button"
            onClick={() => setShowDemoInvestor(!showDemoInvestor)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#E8590C] hover:text-[#C2410C] focus-visible:outline-none"
          >
            {showDemoInvestor ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDemoInvestor ? 'Return to Default Empty State' : 'Preview Populated Investor Layout'}</span>
          </button>
        </div>

        {/* Success Toast */}
        {toastMessage && (
          <div className="mb-4">
            <Toast
              type="success"
              title="Expression of Interest Received"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* CASE A: POPULATED VARIANT (Shown when status is confirmed)          */}
        {/* =================================================================== */}
        {confirmedInvestors.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-[#E4E0D7] pb-3 flex items-center justify-between">
              <div>
                <h3 className="type-h3 text-[#18181B] font-display">
                  Confirmed Investor & Jury Delegation
                </h3>
                <p className="type-small text-[#71717A]">
                  Verified partners participating in Pitch Arena evaluation and deal-flow sessions.
                </p>
              </div>
              <span className="text-xs font-mono text-[#E8590C] font-semibold">
                {confirmedInvestors.length} Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {confirmedInvestors.map((investor) => (
                <InvestorCard key={investor.id} investor={investor} />
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* CASE B: DEFAULT STATE (Headline "Investors & Jury: Coming Soon")    */}
        {/* =================================================================== */}
        {confirmedInvestors.length === 0 && (
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 shadow-paper">
            <div className="mx-auto w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C]">
              <TrendingUp className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <StatusBadge status="coming_soon" customLabel={INVESTORS_STATUS.badge} />
              <h2 className="type-h2 text-[#18181B] font-display mt-2">
                Investors & Jury: Coming Soon
              </h2>
              <p className="type-body text-[#52525B] max-w-xl mx-auto leading-relaxed">
                The accredited investor delegation and evaluation jury panel representing angel networks, venture funds, and institutional accelerators is currently being finalized under confidentiality. Full profiles will be unveiled prior to the Pitch Arena competition.
              </p>
            </div>

            {/* Explanation of how investors engage */}
            <div className="p-4 rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] text-xs text-[#52525B] max-w-xl mx-auto space-y-2 text-left">
              <span className="font-semibold text-[#18181B] block font-sans">
                How Investors Engage at Startup Conclave 1.0:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-[#52525B]">
                <li><strong className="text-[#18181B]">Investor Sessions:</strong> Morning keynotes and venture panels on Day 2.</li>
                <li><strong className="text-[#18181B]">Pitch Arena Jury:</strong> Live evaluation and scoring of the top shortlisted startup pitches.</li>
                <li><strong className="text-[#18181B]">Networking Lounge:</strong> Private lounge access and direct founder introductions.</li>
                <li><strong className="text-[#18181B]">Startup Mentorship:</strong> Direct 1-on-1 feedback clinics for regional innovators.</li>
              </ul>
            </div>

            {/* Express Interest Action Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => setIsModalOpen(true)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Express Interest as an Investor
              </Button>
            </div>

            {/* Confidentiality Hard Content Rule Disclosure */}
            <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-center gap-2 text-xs text-[#71717A] font-sans">
              <Lock className="w-3.5 h-3.5 text-[#E8590C]" />
              <span>Strict Confidentiality · No speculative or unconfirmed fund names displayed</span>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Three "How Investors Will Engage" Cards                            */}
        {/* ------------------------------------------------------------------ */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="type-eyebrow text-[#E8590C]">ENGAGEMENT ARCHITECTURE</div>
              <h2 className="type-h2 text-[#18181B] font-display">How Investors Will Engage</h2>
              <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
                Structured interaction formats designed for high-signal deal discovery, mentorship, and transparent evaluation.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
            >
              Express Interest as an Investor
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {engagementCards.map((card) => (
              <div
                key={card.num}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 text-left hover:border-[#18181B] transition-colors"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E8590C]">{card.num}</span>
                    <div className="w-8 h-8 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
                      {card.icon}
                    </div>
                  </div>

                  <div>
                    <h3 className="type-h3 text-[#18181B] font-display">
                      {card.title}
                    </h3>
                    <span className="text-xs font-semibold text-[#71717A] font-sans block mt-0.5">
                      {card.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                    {card.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Deliverable</span>
                  <span className="text-[#E8590C] font-sans font-medium">{card.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Institutional Contact Bar */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 max-w-xl">
            <span className="type-eyebrow text-[#E8590C]">INVESTOR RELATIONS SECRETARIAT</span>
            <h3 className="type-h3 text-[#18181B] font-display">
              Seeking Priority Deal Flow or Custom Syndication?
            </h3>
            <p className="type-body text-[#52525B] text-xs sm:text-sm">
              Connect directly with our startup relations desk to request the Pitch Arena cohort prospectus and discuss institutional delegation access.
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={() => setIsModalOpen(true)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Express Interest as an Investor
            </Button>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Short Modal Form: Express Interest as an Investor                   */}
      {/* ------------------------------------------------------------------ */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Express Interest as an Investor"
        description="Connect with the Startup Conclave 1.0 Investor Relations secretariat. We will share the confidential deal flow prospectus and jury guidelines."
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
              onClick={handleSubmit}
              isLoading={isSubmitting}
            >
              Submit Expression of Interest
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {formError && (
            <div className="p-3 rounded-[2px] border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
              {formError}
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="e.g. Vikram Malhotra"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <Input
            label="Fund / Angel Network / Organisation"
            placeholder="e.g. Bharat Seed Ventures / Angel Investor"
            value={formData.fund}
            onChange={(e) => setFormData({ ...formData, fund: e.target.value })}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="vikram@fund.com"
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

          <Textarea
            label="Interest Area / Message (Optional)"
            placeholder="Tell us about your investment stage focus (e.g., pre-seed tech, hardware, consumer) or interest in Pitch Arena jury evaluation..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            helperText="Confidential communication with DVSIET Conclave Secretariat."
          />
        </form>
      </Modal>

    </PageShell>
  );
};
