import React, { useState, useEffect, useRef } from 'react';
import {
  Presentation,
  Clock,
  Award,
  Users,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  FileText,
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Trophy,
  HelpCircle,
  Flame,
  BarChart3,
  Calendar,
  Layers,
  Building,
  Target,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Checkbox } from '../components/ui/Checkbox.tsx';
import { Toast } from '../components/ui/Toast.tsx';
import { EVENT_DATA } from '../data/content.ts';

// 8 Evaluation Criteria totalling 100%
const EVALUATION_CRITERIA = [
  {
    name: 'Problem',
    weight: 10,
    description: 'Depth, urgency, and severity of the customer pain point.',
    benchmark: 'Clear validation from real users; not an imagined problem.',
  },
  {
    name: 'Solution',
    weight: 15,
    description: 'Product defensibility, architectural uniqueness, and feasibility.',
    benchmark: 'Functional prototype or MVP; defensible competitive moat.',
  },
  {
    name: 'Market',
    weight: 15,
    description: 'Total Addressable Market (TAM), serviceable market, and growth tailwinds.',
    benchmark: 'Realistic bottom-up market sizing with favorable macro trends.',
  },
  {
    name: 'Business Model',
    weight: 15,
    description: 'Monetization mechanics, pricing strategy, and unit economics visibility.',
    benchmark: 'Sensible margins, LTV/CAC logic, and clear revenue pathways.',
  },
  {
    name: 'Traction',
    weight: 15,
    description: 'Pilots, letters of intent (LOIs), active users, revenue, or test feedback.',
    benchmark: 'Measurable proof that target users care about the product.',
  },
  {
    name: 'Innovation',
    weight: 10,
    description: 'Originality of intellectual property, engineering, or distribution model.',
    benchmark: 'Distinct technological edge over incumbent methods.',
  },
  {
    name: 'Team',
    weight: 10,
    description: 'Founder-market fit, technical competency, and execution hustle.',
    benchmark: 'Relevant domain knowledge, complementary co-founder skills.',
  },
  {
    name: 'Scalability',
    weight: 10,
    description: 'Potential to scale across geographies or sectors with operational leverage.',
    benchmark: 'Non-linear growth model with controllable marginal costs.',
  },
];

// Award categories (strictly the 6 requested)
const AWARD_CATEGORIES = [
  {
    title: 'Best Startup (Overall Winner)',
    badge: 'Champion',
    description: 'Highest aggregate jury score across problem, unit economics, traction, and stage pitch delivery.',
  },
  {
    title: 'Runner-Up',
    badge: 'Silver Honour',
    description: 'Second-highest ranked startup demonstrating superior market readiness and defensibility.',
  },
  {
    title: 'Second Runner-Up',
    badge: 'Bronze Honour',
    description: 'Third-place finalist recognized for exceptional commercial viability and prototype execution.',
  },
  {
    title: 'Best Student Startup',
    badge: 'Student Category',
    description: 'Top-performing venture built by active undergraduate or postgraduate college students.',
  },
  {
    title: 'Most Innovative Startup',
    badge: 'Deep Tech & IP',
    description: 'Recognizing breakthrough proprietary engineering, artificial intelligence, or hardware innovation.',
  },
  {
    title: 'Best Social Impact Startup',
    badge: 'Impact & Sustainability',
    description: 'Addressing grassroots challenges in healthcare, education, clean energy, or agricultural resilience.',
  },
];

// Process Stepper Data
const PROCESS_STEPS = [
  { num: '01', title: 'Applications', desc: 'Open intake of online pitch decks & product summaries.' },
  { num: '02', title: 'Shortlisting', desc: 'Rigorous screening by academic & technical jury.' },
  { num: '03', title: 'Finalists', desc: 'Top 10 selected startups notified and published.' },
  { num: '04', title: 'Live Pitch', desc: '5-minute timed mainstage presentation on Day 2.' },
  { num: '05', title: 'Jury Evaluation', desc: '5-minute live investor Q&A and rubric scoring.' },
  { num: '06', title: 'Winner', desc: 'Valedictory awards and cash grant distributions.' },
];

interface FormDataState {
  // Step 1: Startup
  startupName: string;
  sector: string;
  stage: string;
  website: string;
  isStudentStartup: string;

  // Step 2: Founders
  founderName: string;
  email: string;
  phone: string;
  linkedin: string;
  teamSize: string;

  // Step 3: Business
  problem: string;
  solution: string;
  market: string;
  businessModel: string;
  traction: string;
  revenue: string;
  fundingRequirement: string;

  // Step 4: Pitch deck & consent
  deckFileName: string;
  deckFileSize: number;
  consentAgreed: boolean;
}

const INITIAL_FORM_STATE: FormDataState = {
  startupName: '',
  sector: 'AI / SaaS',
  stage: 'Working MVP',
  website: '',
  isStudentStartup: 'Yes',

  founderName: '',
  email: '',
  phone: '',
  linkedin: '',
  teamSize: '2-4 Co-Founders',

  problem: '',
  solution: '',
  market: '',
  businessModel: '',
  traction: '',
  revenue: '',
  fundingRequirement: '',

  deckFileName: '',
  deckFileSize: 0,
  consentAgreed: false,
};

export const PitchPage: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-step State (1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // File Upload State
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load draft from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pitch_arena_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Save draft to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem('pitch_arena_draft', JSON.stringify(formData));
    } catch {
      // Ignore storage errors
    }
  }, [formData]);

  // Smooth scroll to form
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Step Validations
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.startupName.trim()) errs.startupName = 'Startup name is required.';
      if (!formData.sector) errs.sector = 'Please select an industry sector.';
      if (!formData.stage) errs.stage = 'Please select your current venture stage.';
    }

    if (step === 2) {
      if (!formData.founderName.trim()) errs.founderName = 'Primary founder name is required.';
      if (!formData.email.trim() || !formData.email.includes('@')) {
        errs.email = 'Valid email address is required.';
      }
      if (!formData.phone.trim()) errs.phone = 'Contact phone number is required.';
    }

    if (step === 3) {
      if (!formData.problem.trim() || formData.problem.length < 20) {
        errs.problem = 'Please summarize the core problem (min. 20 characters).';
      }
      if (!formData.solution.trim() || formData.solution.length < 20) {
        errs.solution = 'Please summarize your solution (min. 20 characters).';
      }
      if (!formData.market.trim()) errs.market = 'Please estimate your target market size.';
      if (!formData.businessModel.trim()) errs.businessModel = 'Please explain how you make revenue.';
    }

    if (step === 4) {
      if (!formData.deckFileName) {
        errs.deck = 'Please upload your pitch deck PDF (max 10 MB).';
      }
      if (!formData.consentAgreed) {
        errs.consent = 'You must confirm accuracy and agreement to in-person participation.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: formRef.current?.offsetTop ? formRef.current.offsetTop - 80 : 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: formRef.current?.offsetTop ? formRef.current.offsetTop - 80 : 0, behavior: 'smooth' });
  };

  // PDF File Handler
  const handleFile = (file: File) => {
    setFileError(null);

    // Validate PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setFileError('Invalid file format. Please upload a PDF file.');
      return;
    }

    // Validate size (max 10 MB = 10 * 1024 * 1024 bytes)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setFileError('File exceeds 10 MB limit. Please compress your PDF and try again.');
      return;
    }

    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p === null || p >= 100) {
          clearInterval(interval);
          setFormData((prev) => ({
            ...prev,
            deckFileName: file.name,
            deckFileSize: file.size,
          }));
          return null;
        }
        return p + 30;
      });
    }, 120);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({
      ...prev,
      deckFileName: '',
      deckFileSize: 0,
    }));
    setUploadProgress(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const generatedId = `SC1-PITCH-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedAppId(generatedId);
      setIsSubmitting(false);
      localStorage.removeItem('pitch_arena_draft');
      setToastMessage('Application submitted successfully to the Pitch Arena Jury!');
    }, 900);
  };

  const handleResetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentStep(1);
    setSubmittedAppId(null);
    localStorage.removeItem('pitch_arena_draft');
  };

  return (
    <PageShell
      title="Startup Pitch Arena 1.0"
      kicker="DVSIET MEERUT · MAINSTAGE COMPETITION"
      statusBadge="Applications Opening Soon"
      description="Where Ideas Meet Capital. Pitch your venture live to accredited angel investors, venture funds, and ecosystem jury on the conclave mainstage."
    >
      <div className="space-y-20 max-w-6xl mx-auto text-left">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-4">
            <Toast
              type="success"
              title="Pitch Arena Submission"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* 1. HERO SECTION                                                     */}
        {/* =================================================================== */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-8 sm:p-14 lg:p-16 relative overflow-hidden shadow-xs">
          <div className="max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-2 type-eyebrow text-[#E8590C]">
              <span>FLAGSHIP VENTURE SHOWCASE</span>
              <span className="text-[#A1A1AA]">·</span>
              <span className="text-[#52525B] font-sans font-medium normal-case">
                Day 2 Central Auditorium
              </span>
              <span className="text-[#A1A1AA]">·</span>
              <StatusBadge status="coming_soon" size="sm" customLabel="Applications Opening Soon" />
            </div>

            <h1 className="type-display text-[#18181B] font-display text-balance leading-[1.08]">
              Pitch Live to an{' '}
              <span className="text-[#E8590C] italic font-normal">Expert Venture Jury</span>.
            </h1>

            <p className="type-body text-[#52525B] leading-relaxed text-base sm:text-lg">
              The high-stakes focal point of Startup Conclave 1.0. The top 10 rigorously shortlisted student and regional startups will pitch directly to institutional venture capitalists, angel network scouts, and enterprise operators.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={scrollToForm}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Apply to Pitch
              </Button>
              <a href="#evaluation-criteria">
                <Button
                  variant="ghost"
                  size="lg"
                  className="w-full sm:w-auto border border-[#E4E0D7] bg-white text-[#18181B] hover:border-[#18181B]"
                >
                  View Evaluation Criteria
                </Button>
              </a>
            </div>

            {/* Trust Disclosures */}
            <div className="pt-4 border-t border-[#E4E0D7] flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#71717A] font-sans">
              <span><strong>10 Finalist Slots</strong> (Curated Selection)</span>
              <span className="text-[#A1A1AA] hidden sm:inline">·</span>
              <span><strong>2 Hours Total</strong> (Day 2 Afternoon)</span>
              <span className="text-[#A1A1AA] hidden sm:inline">·</span>
              <span>Cash Grants & Trophies (Subject to Final Sponsorship)</span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. PROCESS STEPPER                                                  */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4">
            <span className="type-eyebrow text-[#E8590C]">ROADMAP TO THE MAINSTAGE</span>
            <h2 className="type-h2 text-[#18181B] font-display">Six-Stage Competition Flow</h2>
            <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
              From open digital intake to the live valedictory awards ceremony on the DVSIET campus.
            </p>
          </div>

          {/* Stepper Grid (Horizontal on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {PROCESS_STEPS.map((step, idx) => (
              <div
                key={step.num}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 space-y-2.5 shadow-xs relative flex flex-col justify-between hover:border-[#18181B] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E8590C]">
                      {step.num}
                    </span>
                    {idx < PROCESS_STEPS.length - 1 && (
                      <span className="hidden lg:inline text-[#A1A1AA] font-mono text-xs">→</span>
                    )}
                  </div>

                  <h3 className="type-h4 text-[#18181B] font-display mt-1">
                    {step.title}
                  </h3>

                  <p className="text-xs text-[#52525B] leading-relaxed pt-1 font-sans">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#EFECE6] text-[10px] font-mono text-[#71717A]">
                  Stage {step.num}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. FORMAT CARD & WHAT YOU GET                                       */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Format Card */}
          <div className="lg:col-span-6 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 shadow-paper space-y-6">
            <div className="border-b border-[#E4E0D7] pb-3 space-y-1">
              <span className="type-eyebrow text-[#E8590C]">TIMED STAGE DISCIPLINE</span>
              <h3 className="type-h3 text-[#18181B] font-display">Live Pitch Arena Format</h3>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-[2px] border border-[#FED7AA] bg-[#FFF7ED]">
                <div className="font-mono text-2xl font-bold text-[#E8590C]">5 Min</div>
                <div className="text-[11px] font-semibold text-[#18181B] mt-0.5">Live Pitch</div>
                <div className="text-[10px] text-[#71717A] mt-0.5">Strict countdown timer</div>
              </div>

              <div className="p-3.5 rounded-[2px] border border-[#C7D2FE] bg-[#EEF2FF]">
                <div className="font-mono text-2xl font-bold text-[#3730A3]">5 Min</div>
                <div className="text-[11px] font-semibold text-[#18181B] mt-0.5">Jury Q&A</div>
                <div className="text-[10px] text-[#71717A] mt-0.5">Investor cross-examination</div>
              </div>

              <div className="p-3.5 rounded-[2px] border border-[#E4E0D7] bg-[#F4F1EA]">
                <div className="font-mono text-2xl font-bold text-[#18181B]">2 Min</div>
                <div className="text-[11px] font-semibold text-[#18181B] mt-0.5">Transition</div>
                <div className="text-[10px] text-[#71717A] mt-0.5">Deck setup & scoring</div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#52525B] font-sans">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                <span><strong>Cohort Size:</strong> Strictly capped at approximately 10 vetted startups.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                <span><strong>Total Duration:</strong> Roughly 2 hours dedicated block on Day 2.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
                <span><strong>AV Infrastructure:</strong> Dual presentation screens, presenter clicker, stage monitor.</span>
              </div>
            </div>
          </div>

          {/* What You Get Card */}
          <div className="lg:col-span-6 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 shadow-xs space-y-5">
            <div className="border-b border-[#E4E0D7] pb-3 space-y-1">
              <span className="type-eyebrow text-[#E8590C]">FINALIST ADVANTAGES</span>
              <h3 className="type-h3 text-[#18181B] font-display">What Every Finalist Receives</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Jury Exposure</span>
                </div>
                <p className="text-[#52525B]">Direct access to institutional VCs, angel networks, and venture scouts actively deploying capital.</p>
              </div>

              <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>1-on-1 Mentorship</span>
                </div>
                <p className="text-[#52525B]">Dedicated deck refinement and pitch clinic coaching on Day 2 morning prior to stage presentations.</p>
              </div>

              <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Exhibition Booth</span>
                </div>
                <p className="text-[#52525B]">Complimentary demo station in the Startup Showcase corridor to exhibit prototypes across both days.</p>
              </div>

              <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
                <div className="font-bold text-[#18181B] flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-[#E8590C]" />
                  <span>Awards & Cash Grants</span>
                </div>
                <p className="text-[#52525B]">Opportunity to win official trophies and non-dilutive grant funds awarded at the valedictory ceremony.</p>
              </div>
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* 4. EVALUATION CRITERIA: BAR CHART + COMPARISON TABLE                */}
        {/* =================================================================== */}
        <div id="evaluation-criteria" className="space-y-8 scroll-mt-24">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="type-eyebrow text-[#E8590C]">OBJECTIVE RUBRIC</span>
              <h2 className="type-h2 text-[#18181B] font-display">Evaluation Criteria (100% Total)</h2>
              <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
                Every judge scores independently across 8 weighted criteria to ensure meritocratic, objective shortlisting.
              </p>
            </div>
            <div className="text-xs font-mono text-[#E8590C] font-bold shrink-0">
              8 Vector Rubric
            </div>
          </div>

          {/* Horizontal Bar Chart Representation */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 shadow-paper space-y-5">
            <h3 className="type-h4 text-[#18181B] font-display border-b border-[#EFECE6] pb-3">
              Weighted Criteria Distribution
            </h3>

            <div className="space-y-3.5">
              {EVALUATION_CRITERIA.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#18181B] font-sans">
                      {item.name}
                    </span>
                    <span className="font-mono font-bold text-[#E8590C]">
                      {item.weight}%
                    </span>
                  </div>

                  {/* Accessible horizontal progress bar */}
                  <div className="h-2.5 w-full rounded-[2px] bg-[#F4F1EA] overflow-hidden border border-[#E4E0D7]">
                    <div
                      className="h-full bg-[#E8590C] rounded-[1px] transition-all duration-300"
                      style={{ width: `${item.weight * 5}%` }} // Scaled visually for 10-15% range
                      role="progressbar"
                      aria-valuenow={item.weight}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right font-mono text-xs text-[#71717A]">
              Total Weight: <span className="font-bold text-[#18181B]">100%</span>
            </div>
          </div>

          {/* Formatted Criteria Table */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#E4E0D7] bg-[#F4F1EA] text-[#18181B] font-sans uppercase font-bold text-[11px]">
                  <tr>
                    <th scope="col" className="px-5 py-3.5">Criterion</th>
                    <th scope="col" className="px-4 py-3.5 font-mono">Weight</th>
                    <th scope="col" className="px-5 py-3.5">Evaluation Focus</th>
                    <th scope="col" className="px-5 py-3.5">Jury Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE6] text-[#52525B]">
                  {EVALUATION_CRITERIA.map((row) => (
                    <tr key={row.name} className="hover:bg-[#FBF9F5] transition-colors">
                      <td className="px-5 py-3.5 font-bold text-[#18181B] font-sans">
                        {row.name}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-[#E8590C]">
                        {row.weight}%
                      </td>
                      <td className="px-5 py-3.5 leading-relaxed">
                        {row.description}
                      </td>
                      <td className="px-5 py-3.5 text-[#18181B] leading-relaxed">
                        {row.benchmark}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 5. AWARDS PREVIEW (6 CATEGORIES) & HONEST STATUS DISCLOSURES         */}
        {/* =================================================================== */}
        <div className="space-y-8">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="type-eyebrow text-[#E8590C]">RECOGNITION</span>
              <h2 className="type-h2 text-[#18181B] font-display">Six Official Award Categories</h2>
              <p className="type-body text-[#52525B] max-w-2xl mt-0.5">
                Valedictory mementos and prizes awarded at the closing ceremony on the DVSIET campus.
              </p>
            </div>
            <span className="text-xs font-mono text-[#71717A]">6 Honours</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {AWARD_CATEGORIES.map((cat, idx) => (
              <div
                key={cat.title}
                className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs flex flex-col justify-between space-y-4 text-left hover:border-[#18181B] transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-[#E8590C]">0{idx + 1}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F1EA] text-[#18181B] border border-[#E4E0D7]">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="type-h4 text-[#18181B] font-display">
                    {cat.title}
                  </h3>

                  <p className="text-xs text-[#52525B] leading-relaxed font-sans pt-1">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                  <span>Pitch Arena 1.0</span>
                  <span className="text-[#E8590C]">Trophy & Grant</span>
                </div>
              </div>
            ))}
          </div>

          {/* Key Dates & Prize Pool Transparent Disclosures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#18181B] font-sans">
                <Calendar className="w-4 h-4 text-[#E8590C]" />
                <span>Key Competition Milestones</span>
              </div>
              <ul className="text-xs text-[#52525B] space-y-1.5 font-sans pt-1">
                <li className="flex justify-between">
                  <span>Applications Open:</span>
                  <span className="font-semibold text-[#18181B]">Announcing Soon</span>
                </li>
                <li className="flex justify-between">
                  <span>Applications Deadline:</span>
                  <span className="font-semibold text-[#18181B]">TBA</span>
                </li>
                <li className="flex justify-between">
                  <span>Finalists Announced:</span>
                  <span className="font-semibold text-[#18181B]">TBA</span>
                </li>
                <li className="flex justify-between">
                  <span>Live Pitch Arena:</span>
                  <span className="font-semibold text-[#E8590C]">Day 2 of Conclave</span>
                </li>
              </ul>
            </div>

            <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#18181B] font-sans">
                <Award className="w-4 h-4 text-[#E8590C]" />
                <span>Prize Pool Commitment</span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed font-sans pt-1">
                The non-dilutive cash grant pool and sponsor bounty allocations are undergoing institutional partner finalization. The exact grant amount per award category will be published transparently prior to application close.
              </p>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 6. FINALISTS SECTION: EMPTY STATE                                   */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4">
            <span className="type-eyebrow text-[#E8590C]">COMPETITION COHORT</span>
            <h2 className="type-h2 text-[#18181B] font-display">Pitch Arena Finalists</h2>
          </div>

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C] mx-auto">
              <Presentation className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="type-h3 text-[#18181B] font-display">
                Finalists announced after shortlisting
              </h3>
              <p className="type-body text-[#52525B] text-xs sm:text-sm max-w-md mx-auto">
                The top 10 finalist startups selected by the technical committee will be officially featured on this leaderboard following Phase 01 review.
              </p>
            </div>

            <div className="pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={scrollToForm}
              >
                Submit Your Pitch Deck
              </Button>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 7. MULTI-STEP APPLICATION FORM                                      */}
        {/* =================================================================== */}
        <div
          ref={formRef}
          id="application-form"
          className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 lg:p-12 shadow-paper space-y-8 scroll-mt-20"
        >
          {/* Form Header */}
          <div className="border-b border-[#E4E0D7] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="type-eyebrow text-[#E8590C]">PITCH ARENA APPLICATION</span>
                <span className="text-[11px] font-mono text-[#71717A] bg-[#F4F1EA] px-2 py-0.5 rounded">
                  Draft Auto-Saved
                </span>
              </div>
              <h2 className="type-h2 text-[#18181B] font-display mt-1">
                Pitch Deck & Application Portal
              </h2>
            </div>

            <button
              type="button"
              onClick={handleResetForm}
              className="text-xs font-mono text-[#71717A] hover:text-[#18181B] flex items-center gap-1 focus-visible:outline-none"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Draft</span>
            </button>
          </div>

          {/* If already submitted, show Success Screen */}
          {submittedAppId ? (
            <div className="p-8 sm:p-12 rounded-[3px] border border-emerald-300 bg-emerald-50 text-center space-y-5 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
                  APPLICATION SUBMITTED SUCCESSFULLY
                </span>
                <h3 className="type-h2 text-emerald-950 font-display">
                  You're in the Running for Pitch Arena 1.0!
                </h3>
                <p className="type-body text-emerald-900 max-w-lg mx-auto text-sm leading-relaxed">
                  Your application and pitch deck have been securely logged in the secretariat database. Our technical evaluation jury will review your submission during Stage 01 screening.
                </p>
              </div>

              <div className="p-4 rounded-[2px] border border-emerald-300 bg-white max-w-md mx-auto text-left space-y-1 font-mono text-xs text-emerald-950">
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Application ID:</span>
                  <span className="font-bold text-[#18181B]">{submittedAppId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Startup Name:</span>
                  <span className="font-semibold text-[#18181B]">{formData.startupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Primary Contact:</span>
                  <span>{formData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#71717A]">Deck File:</span>
                  <span className="truncate max-w-[200px]">{formData.deckFileName}</span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <Button variant="primary" size="md" onClick={handleResetForm}>
                  Submit Another Application
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Progress Stepper Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-[#E8590C]">
                    STEP 0{currentStep} OF 05
                  </span>
                  <span className="text-[#71717A]">
                    {currentStep === 1 && 'Startup Information'}
                    {currentStep === 2 && 'Founders & Team'}
                    {currentStep === 3 && 'Business & Metrics'}
                    {currentStep === 4 && 'Pitch Deck & Consent'}
                    {currentStep === 5 && 'Review & Final Submit'}
                  </span>
                </div>

                <div className="h-1.5 w-full bg-[#F4F1EA] rounded-full overflow-hidden border border-[#E4E0D7]">
                  <div
                    className="h-full bg-[#18181B] transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              {/* ----------------------------------------------------------- */}
              {/* STEP 1: Startup Information                                 */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-[#EFECE6] pb-2">
                    <h3 className="type-h3 text-[#18181B] font-display">Step 1: Startup Profile</h3>
                    <p className="type-small text-[#71717A]">Basic identity and product sector.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Startup / Venture Name"
                      placeholder="e.g. AeroDynamics Labs"
                      value={formData.startupName}
                      onChange={(e) => setFormData({ ...formData, startupName: e.target.value })}
                      error={errors.startupName}
                      required
                    />

                    <Select
                      label="Industry Sector"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      error={errors.sector}
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Select
                      label="Current Venture Stage"
                      value={formData.stage}
                      onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                      options={[
                        { value: 'Idea / Conceptual', label: 'Idea / Conceptual' },
                        { value: 'Working Prototype / Lab Demo', label: 'Working Prototype / Lab Demo' },
                        { value: 'Working MVP / Pilot Testing', label: 'Working MVP / Pilot Testing' },
                        { value: 'Early Revenue / Commercial', label: 'Early Revenue / Commercial' },
                      ]}
                    />

                    <Select
                      label="Is this a Student-Led Startup?"
                      value={formData.isStudentStartup}
                      onChange={(e) => setFormData({ ...formData, isStudentStartup: e.target.value })}
                      options={[
                        { value: 'Yes', label: 'Yes (Undergraduate / Postgraduate)' },
                        { value: 'No', label: 'No (Independent Early Founders)' },
                      ]}
                      helperText="Eligible for Best Student Startup category"
                    />

                    <Input
                      label="Website or Prototype Link"
                      placeholder="https://yourstartup.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      helperText="Optional if still in stealth"
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 2: Founders & Team                                     */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-[#EFECE6] pb-2">
                    <h3 className="type-h3 text-[#18181B] font-display">Step 2: Founders & Team</h3>
                    <p className="type-small text-[#71717A]">Primary contact for Pitch Arena coordination.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Primary Founder Name"
                      placeholder="e.g. Ishaan Mehra"
                      value={formData.founderName}
                      onChange={(e) => setFormData({ ...formData, founderName: e.target.value })}
                      error={errors.founderName}
                      required
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="ishaan@aerodynamics.io"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Phone Number"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      error={errors.phone}
                      required
                    />

                    <Input
                      label="LinkedIn Profile URL"
                      placeholder="https://linkedin.com/in/..."
                      value={formData.linkedin}
                      onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    />

                    <Select
                      label="Total Team Size"
                      value={formData.teamSize}
                      onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                      options={[
                        { value: 'Solo Founder', label: 'Solo Founder' },
                        { value: '2-4 Co-Founders', label: '2-4 Co-Founders' },
                        { value: '5-10 Members', label: '5-10 Members' },
                        { value: '10+ Members', label: '10+ Members' },
                      ]}
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 3: Business & Metrics                                  */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-in fade-in">
                  <div className="border-b border-[#EFECE6] pb-2">
                    <h3 className="type-h3 text-[#18181B] font-display">Step 3: Business & Metrics</h3>
                    <p className="type-small text-[#71717A]">The core problem, unit economics, and market scope.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Textarea
                      label="Problem Statement"
                      placeholder="What severe friction or pain point are you solving? Who suffers from it?"
                      value={formData.problem}
                      onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                      error={errors.problem}
                      required
                    />

                    <Textarea
                      label="Proposed Solution & Defensibility"
                      placeholder="How does your product solve this uniquely? What is your proprietary moat?"
                      value={formData.solution}
                      onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                      error={errors.solution}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Target Market Size (TAM / SAM)"
                      placeholder="e.g. $1.2B in India, growing at 22% CAGR"
                      value={formData.market}
                      onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                      error={errors.market}
                      required
                    />

                    <Input
                      label="Business / Monetization Model"
                      placeholder="e.g. B2B SaaS $150/mo + usage fee"
                      value={formData.businessModel}
                      onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                      error={errors.businessModel}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input
                      label="Current Traction & Pilot Users"
                      placeholder="e.g. 5 LOIs, 3 active enterprise pilots"
                      value={formData.traction}
                      onChange={(e) => setFormData({ ...formData, traction: e.target.value })}
                    />

                    <Input
                      label="Current Annual / Monthly Revenue"
                      placeholder="e.g. Pre-Revenue or ₹2.5 Lakhs ARR"
                      value={formData.revenue}
                      onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                    />

                    <Input
                      label="Target Funding Requirement"
                      placeholder="e.g. ₹50 Lakhs Seed or Pre-Seed"
                      value={formData.fundingRequirement}
                      onChange={(e) => setFormData({ ...formData, fundingRequirement: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 4: Pitch Deck & Consent                                */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-[#EFECE6] pb-2">
                    <h3 className="type-h3 text-[#18181B] font-display">Step 4: Pitch Deck Upload</h3>
                    <p className="type-small text-[#71717A]">PDF format only · Maximum 10 MB file size limit.</p>
                  </div>

                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="deck-file-input"
                  />

                  {/* Drag and drop zone */}
                  {!formData.deckFileName ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`rounded-[3px] border-2 border-dashed p-8 sm:p-12 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-[#E8590C] bg-[#FFF7ED]'
                          : 'border-[#E4E0D7] bg-[#FBF9F5] hover:border-[#18181B]'
                      }`}
                    >
                      <UploadCloud className="w-10 h-10 text-[#E8590C] mx-auto mb-3" />
                      <div className="space-y-1">
                        <span className="text-sm font-semibold text-[#18181B] block font-sans">
                          Click to upload or drag & drop your Pitch Deck
                        </span>
                        <p className="text-xs text-[#71717A]">
                          PDF format only · Up to 10 MB maximum
                        </p>
                      </div>

                      {uploadProgress !== null && (
                        <div className="mt-4 max-w-xs mx-auto space-y-1">
                          <div className="flex justify-between text-[11px] font-mono">
                            <span>Uploading...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-[#E4E0D7] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#E8590C] transition-all"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Attached file card */
                    <div className="rounded-[3px] border border-emerald-300 bg-emerald-50 p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-[2px] bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="overflow-hidden text-xs">
                          <div className="font-semibold text-emerald-950 truncate font-sans">
                            {formData.deckFileName}
                          </div>
                          <div className="text-emerald-800 font-mono text-[11px]">
                            {(formData.deckFileSize / (1024 * 1024)).toFixed(2)} MB · PDF Document
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 px-3 py-1.5 rounded border border-red-200 bg-white"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Replace File</span>
                      </button>
                    </div>
                  )}

                  {fileError && (
                    <div className="p-3 rounded-[2px] border border-red-200 bg-red-50 text-red-700 text-xs font-medium">
                      {fileError}
                    </div>
                  )}

                  {errors.deck && (
                    <p className="text-xs text-red-600 font-sans">{errors.deck}</p>
                  )}

                  {/* Consent checkbox */}
                  <div className="pt-2 border-t border-[#EFECE6]">
                    <Checkbox
                      checked={formData.consentAgreed}
                      onChange={(e) => setFormData({ ...formData, consentAgreed: e.target.checked })}
                      label="I hereby declare that all venture information provided is accurate and original. If shortlisted among the top 10 finalists, our founding team commits to presenting in-person at DVSIET Meerut."
                      error={errors.consent}
                    />
                  </div>
                </div>
              )}

              {/* ----------------------------------------------------------- */}
              {/* STEP 5: Review & Submit                                     */}
              {/* ----------------------------------------------------------- */}
              {currentStep === 5 && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="border-b border-[#EFECE6] pb-2">
                    <h3 className="type-h3 text-[#18181B] font-display">Step 5: Review Application</h3>
                    <p className="type-small text-[#71717A]">Please review your submission details before sending to the jury.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-[#52525B]">
                    {/* Startup Summary */}
                    <div className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 font-bold text-[#18181B]">
                        <span>Startup Profile</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="text-[#E8590C] hover:underline font-mono text-[11px]"
                        >
                          Edit
                        </button>
                      </div>
                      <p><strong>Name:</strong> {formData.startupName}</p>
                      <p><strong>Sector:</strong> {formData.sector}</p>
                      <p><strong>Stage:</strong> {formData.stage}</p>
                      <p><strong>Student Venture:</strong> {formData.isStudentStartup}</p>
                      {formData.website && <p><strong>Website:</strong> {formData.website}</p>}
                    </div>

                    {/* Founders Summary */}
                    <div className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-4 space-y-2">
                      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 font-bold text-[#18181B]">
                        <span>Founders & Contact</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="text-[#E8590C] hover:underline font-mono text-[11px]"
                        >
                          Edit
                        </button>
                      </div>
                      <p><strong>Founder:</strong> {formData.founderName}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>Phone:</strong> {formData.phone}</p>
                      <p><strong>Team Size:</strong> {formData.teamSize}</p>
                    </div>

                    {/* Business Summary */}
                    <div className="rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] p-4 space-y-2 col-span-1 md:col-span-2">
                      <div className="flex items-center justify-between border-b border-[#EFECE6] pb-2 font-bold text-[#18181B]">
                        <span>Business & Pitch Deck</span>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="text-[#E8590C] hover:underline font-mono text-[11px]"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <p className="font-semibold text-[#18181B]">Problem:</p>
                          <p className="text-xs text-[#52525B] line-clamp-2">{formData.problem}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#18181B]">Solution:</p>
                          <p className="text-xs text-[#52525B] line-clamp-2">{formData.solution}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#18181B]">Market & Model:</p>
                          <p className="text-xs text-[#52525B]">{formData.market} · {formData.businessModel}</p>
                        </div>
                        <div>
                          <p className="font-semibold text-[#18181B]">Deck Attachment:</p>
                          <p className="text-xs text-emerald-700 font-semibold">{formData.deckFileName || 'No file attached'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Action Buttons */}
              <div className="pt-6 border-t border-[#E4E0D7] flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <Button
                    variant="ghost"
                    size="md"
                    onClick={handleBack}
                    leftIcon={<ArrowLeft className="w-4 h-4" />}
                  >
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleNext}
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    Continue to Step 0{currentStep + 1}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleFinalSubmit}
                    isLoading={isSubmitting}
                    rightIcon={<CheckCircle2 className="w-4 h-4" />}
                  >
                    Submit Pitch Arena Application
                  </Button>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </PageShell>
  );
};
