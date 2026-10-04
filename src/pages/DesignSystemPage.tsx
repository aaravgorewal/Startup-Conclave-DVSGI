import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Copy,
  Check,
  Mail,
  Search,
  Calendar,
  AlertCircle,
  Layers,
  Terminal,
} from 'lucide-react';
import { Logo } from '../components/ui/Logo.tsx';
import { StatusBadge, StatusVariant } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Checkbox } from '../components/ui/Checkbox.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { Badge } from '../components/ui/Badge.tsx';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '../components/ui/Card.tsx';
import { Accordion } from '../components/ui/Accordion.tsx';
import { Tabs } from '../components/ui/Tabs.tsx';
import { Toast, ToastType } from '../components/ui/Toast.tsx';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';
import { CTABand } from '../components/ui/CTABand.tsx';
import { Modal } from '../components/ui/Modal.tsx';

export const DesignSystemPage: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeChip, setActiveChip] = useState('all');
  const [segmentedTab, setSegmentedTab] = useState('overview');
  const [underlineTab, setUnderlineTab] = useState('tab-1');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{
    type: ToastType;
    title: string;
    message: string;
  } | null>(null);
  const [checkboxState, setCheckboxState] = useState(true);

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const colorTokens = [
    { name: 'Canvas Background', role: '--color-canvas', hex: '#FBF9F5', textCol: '#18181B', borderCol: '#E4E0D7' },
    { name: 'Surface Paper', role: '--color-surface', hex: '#FFFFFF', textCol: '#18181B', borderCol: '#E4E0D7' },
    { name: 'Surface Subdued', role: '--color-surface-subdued', hex: '#F4F1EA', textCol: '#18181B', borderCol: '#E4E0D7' },
    { name: 'Primary Ink', role: '--color-primary', hex: '#18181B', textCol: '#FFFFFF' },
    { name: 'Accent Terracotta', role: '--color-accent', hex: '#E8590C', textCol: '#FFFFFF' },
    { name: 'Accent Subtle Tint', role: '--color-accent-subtle', hex: '#FFF7ED', textCol: '#9A3412', borderCol: '#FED7AA' },
    { name: 'Text Primary', role: '--color-text', hex: '#18181B', textCol: '#FFFFFF' },
    { name: 'Text Muted', role: '--color-text-muted', hex: '#52525B', textCol: '#FFFFFF' },
    { name: 'Text Subtle', role: '--color-text-subtle', hex: '#71717A', textCol: '#FFFFFF' },
    { name: 'Border Hairline', role: '--color-border', hex: '#E4E0D7', textCol: '#18181B', borderCol: '#D4CEBF' },
    { name: 'Border Strong', role: '--color-border-strong', hex: '#D4CEBF', textCol: '#18181B' },
  ];

  return (
    <div className="w-full bg-[#FBF9F5] text-[#18181B] min-h-screen py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Introduction */}
        <div className="border-b border-[#E4E0D7] pb-8 space-y-3">
          <div className="type-eyebrow">
            DIRECTION B: EDITORIAL LIGHT DESIGN SYSTEM
          </div>
          <h1 className="type-display text-[#18181B]">
            Design System & Component Library
          </h1>
          <p className="type-body text-[#52525B] max-w-3xl">
            A comprehensive, production-grade design system engineered for Startup Conclave 1.0. 
            All tokens (color, typography, spacing, radius, shadows, and motion) are declared as CSS variables in <code className="text-xs bg-[#F4F1EA] px-1.5 py-0.5 rounded border border-[#E4E0D7]">src/index.css</code> for single-file brand updates. 
            Full WCAG AA contrast compliance and visible keyboard focus rings are enforced throughout.
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* 1. COLOR SYSTEM */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="01. COLOR SYSTEM"
            title="Design Tokens & Color Palette"
            description="Warm alabaster canvas with carbon ink typography, terracotta accents, and soft paper surfaces. Click any swatch to copy its hex value."
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {colorTokens.map((swatch) => (
              <button
                key={swatch.hex + swatch.name}
                type="button"
                onClick={() => copyToClipboard(swatch.hex)}
                className="group text-left p-3.5 border border-[#E4E0D7] bg-white rounded-[3px] hover:border-[#18181B] transition-colors shadow-xs"
              >
                <div
                  className="w-full h-10 border rounded-[2px] mb-2 flex items-center justify-end px-2"
                  style={{
                    backgroundColor: swatch.hex,
                    borderColor: swatch.borderCol || 'rgba(0,0,0,0.08)',
                  }}
                >
                  {copiedHex === swatch.hex && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-black text-white rounded-[2px]">
                      COPIED
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-[#18181B] tracking-tight">
                  {swatch.name}
                </div>
                <div className="text-[11px] font-mono text-[#E8590C] group-hover:underline flex items-center justify-between mt-0.5">
                  <span>{swatch.hex}</span>
                  <Copy className="w-3 h-3 text-[#71717A] group-hover:text-[#E8590C]" />
                </div>
                <div className="text-[10px] font-mono text-[#71717A] mt-1 truncate">
                  {swatch.role}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 2. TYPOGRAPHY SCALE */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="02. TYPOGRAPHY"
            title="Type Scale (Mobile & Desktop Specimen)"
            description="Fraunces serif display face paired with Plus Jakarta Sans body. Responsive type scale with balanced line-heights and measure constraints."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-6 shadow-xs divide-y divide-[#E4E0D7]">
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                Display · 36px mobile / 56px–68px desktop · Fraunces Bold
              </span>
              <p className="type-display text-[#18181B]">
                BUILD. CONNECT. PITCH. SCALE.
              </p>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                H1 · 30px mobile / 40px desktop · Fraunces Bold
              </span>
              <h1 className="type-h1 text-[#18181B]">
                Where Ideas Meet Capital. Where Innovation Meets Opportunity.
              </h1>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                H2 · 24px mobile / 32px desktop · Fraunces Bold
              </span>
              <h2 className="type-h2 text-[#18181B]">
                A 2-Day Regional Innovation Congregation at DVSIET Meerut
              </h2>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                H3 · 20px mobile / 24px desktop · Fraunces SemiBold
              </span>
              <h3 className="type-h3 text-[#18181B]">
                Pitch Arena 1.0 & Venture Jury Evaluation Rounds
              </h3>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                H4 · 18px mobile / 20px desktop · Fraunces SemiBold
              </span>
              <h4 className="type-h4 text-[#18181B]">
                Track 01: Pre-seed Unit Economics & Traction Masterclasses
              </h4>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                Body Prose · 15px mobile / 16px desktop · Plus Jakarta Sans Regular 400
              </span>
              <p className="type-body text-[#18181B] max-w-3xl leading-relaxed">
                Startup Conclave 1.0 brings together student developers, ambitious founders, angels, venture capital networks, and institutional mentors onto one shared campus floor. Designed with zero fluff, focusing purely on building defensible products and scaling sustainably from Tier-2 and Tier-3 hubs.
              </p>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                Small Text / Caption · 13px · Plus Jakarta Sans
              </span>
              <p className="type-small text-[#52525B]">
                Official event dates and attendee ticket pricing are undergoing final institutional coordination and will be published upon scheduling completion.
              </p>
            </div>

            <div className="pt-5 space-y-1">
              <span className="text-[11px] font-mono text-[#71717A] uppercase block">
                Eyebrow / Kicker · 12px uppercase font-semibold
              </span>
              <div className="type-eyebrow">
                OFFICIAL CONCLAVE SCHEDULE · 2026 EDITION
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 3. LOGO SLOT */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="03. BRAND IDENTITY"
            title="Themeable Logo Slot"
            description="The official logo is not final. This themeable slot renders the wordmark 'STARTUP CONCLAVE 1.0' alongside an adaptable geometric placeholder mark in multiple scale options."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="p-4 border border-[#E4E0D7] rounded-[3px] bg-[#FBF9F5] space-y-2">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Size: Small (Header / Compact)</span>
                <Logo size="sm" asLink={false} />
              </div>

              <div className="p-4 border border-[#E4E0D7] rounded-[3px] bg-[#FBF9F5] space-y-2">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Size: Medium (Standard)</span>
                <Logo size="md" asLink={false} />
              </div>

              <div className="p-4 border border-[#E4E0D7] rounded-[3px] bg-[#FBF9F5] space-y-2">
                <span className="text-[10px] font-mono text-[#71717A] uppercase block">Size: Large (Hero / Footer)</span>
                <Logo size="lg" asLink={false} />
              </div>
            </div>

            <div className="p-4 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] text-xs text-[#9A3412] leading-relaxed">
              <strong>Brand Slot Implementation:</strong> Changing the official emblem or wordmark across the entire application takes just one edit inside <code className="font-mono bg-white px-1 py-0.5 rounded border border-[#FED7AA]">src/components/ui/Logo.tsx</code>.
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 4. STATUS BADGES */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="04. STATUS BADGE"
            title="StatusBadge (Confirmed, Invited, Coming Soon)"
            description="Zero-pill discipline status indicators with distinct visual and accessible text state representation."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">Medium Variant (Default)</span>
              <div className="flex flex-wrap items-center gap-4">
                <StatusBadge status="confirmed" />
                <StatusBadge status="invited" />
                <StatusBadge status="coming_soon" />
                <StatusBadge status="coming_soon" customLabel="Dates Announcing Soon" />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E0D7] space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">Small Variant (Tables / Cards)</span>
              <div className="flex flex-wrap items-center gap-4">
                <StatusBadge status="confirmed" size="sm" />
                <StatusBadge status="invited" size="sm" />
                <StatusBadge status="coming_soon" size="sm" />
                <StatusBadge status="confirmed" size="sm" customLabel="Pass Active" />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 5. BUTTONS */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="05. BUTTON PRIMITIVE"
            title="Button (Variants, Sizes & States)"
            description="Solid carbon ink primary, bordered crisp paper secondary, and ghost variants. Includes loading spinner and disabled states."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Primary, Secondary, Ghost */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">Variants</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="ghost">Ghost Button</Button>
                <Button variant="primary" rightIcon={<ArrowUpRight className="w-4 h-4" />}>
                  With Right Icon
                </Button>
                <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4" />}>
                  With Left Icon
                </Button>
              </div>
            </div>

            {/* Sizes */}
            <div className="pt-4 border-t border-[#E4E0D7] space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">Sizes (sm, md, lg)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small (36px min)</Button>
                <Button size="md">Medium (44px min)</Button>
                <Button size="lg">Large (48px min)</Button>
              </div>
            </div>

            {/* Loading & Disabled */}
            <div className="pt-4 border-t border-[#E4E0D7] space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">States (Loading, Disabled)</span>
              <div className="flex flex-wrap items-center gap-3">
                <Button isLoading>Submitting Data</Button>
                <Button disabled>Disabled Primary</Button>
                <Button variant="secondary" disabled>Disabled Secondary</Button>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 6. FORM CONTROLS */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="06. FORM CONTROLS"
            title="Input, Textarea, Select & Checkbox"
            description="Accessible input controls with explicit label association, error states, helper texts, and focus-visible rings."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-8 shadow-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Full Name"
                placeholder="e.g. Aarav Sharma"
                helperText="Enter your official name for delegate certification."
                required
              />

              <Input
                label="Email Address"
                placeholder="founder@startup.com"
                type="email"
                leftElement={<Mail className="w-4 h-4" />}
                required
              />

              <Input
                label="Error State Demonstration"
                placeholder="Invalid entry"
                defaultValue="invalid-email-format"
                error="Please enter a valid institutional or personal email address."
              />

              <Input
                label="Disabled Input"
                placeholder="Cannot edit"
                defaultValue="Registration locked until announcement"
                disabled
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#E4E0D7]">
              <Select
                label="Delegate Track"
                options={[
                  { value: 'student', label: 'Student Delegate (Undergraduate / Postgraduate)' },
                  { value: 'founder', label: 'Startup Founder / Early Builder' },
                  { value: 'investor', label: 'Investor / Venture Capital Delegate' },
                  { value: 'mentor', label: 'Academic Faculty / Industry Mentor' },
                ]}
                helperText="Select your primary participation role."
              />

              <Select
                label="Select Error State"
                options={[
                  { value: '', label: 'Select a category...' },
                  { value: '1', label: 'Category 01' },
                ]}
                error="Selection is required to proceed with registration."
              />
            </div>

            <div className="pt-4 border-t border-[#E4E0D7]">
              <Textarea
                label="Executive Summary / Startup Overview"
                placeholder="Briefly describe your venture, current prototype status, and target problem statement..."
                helperText="Max 300 words. Used by the Pitch Arena screening committee."
              />
            </div>

            <div className="pt-4 border-t border-[#E4E0D7] space-y-4">
              <span className="text-xs font-semibold text-[#18181B] block">Checkbox Controls</span>
              <Checkbox
                label="I agree to the attendee code of conduct and safety guidelines"
                description="Required for all physical on-campus delegates at DVSIET Meerut."
                checked={checkboxState}
                onChange={(e) => setCheckboxState(e.target.checked)}
              />

              <Checkbox
                label="Pitch Arena Evaluation Consent"
                description="I confirm our startup team has a functional prototype ready for live demonstration."
                checked={false}
              />

              <Checkbox
                label="Disabled & Checked Example"
                description="Pre-checked institutional waiver."
                checked={true}
                disabled
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 7. CHIPS & BADGES */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="07. CONTROLS & TAGS"
            title="Chips (Interactive) & Badges (Metadata)"
            description="Functional filter controls vs quiet metadata indicators."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">
                Interactive Filter Chips (Clickable)
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <Chip
                  active={activeChip === 'all'}
                  onClick={() => setActiveChip('all')}
                  count={12}
                >
                  All Sessions
                </Chip>
                <Chip
                  active={activeChip === 'keynote'}
                  onClick={() => setActiveChip('keynote')}
                  count={3}
                >
                  Keynotes
                </Chip>
                <Chip
                  active={activeChip === 'pitch'}
                  onClick={() => setActiveChip('pitch')}
                  count={5}
                >
                  Pitch Arena
                </Chip>
                <Chip
                  active={activeChip === 'masterclass'}
                  onClick={() => setActiveChip('masterclass')}
                  count={4}
                >
                  Masterclasses
                </Chip>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E4E0D7] space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">
                Metadata Badges
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="neutral">Neutral Metadata</Badge>
                <Badge variant="accent">Accent Highlight</Badge>
                <Badge variant="outline">Outline Tag</Badge>
                <Badge variant="subtle">Quiet Subtle</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 8. CARDS */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="08. CARD PRIMITIVE"
            title="Card Variations"
            description="Editorial paper surfaces with structured header, body content, and footer meta areas."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="type-eyebrow">STAGE 01</div>
                <CardTitle>Pitch Screening</CardTitle>
                <CardDescription>Initial deck and traction review by the technical panel.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="type-small text-[#52525B]">
                  Shortlisting 20 high-potential early teams for main stage presentation.
                </p>
              </CardContent>
              <CardFooter>
                <span>Format: Online Review</span>
                <span className="text-[#E8590C] font-semibold">Stage 01</span>
              </CardFooter>
            </Card>

            <Card hoverable>
              <CardHeader>
                <div className="type-eyebrow">HOVERABLE SURFACE</div>
                <CardTitle>Startup Showcase</CardTitle>
                <CardDescription>Hover over this card to view micro-elevation feedback.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="type-small text-[#52525B]">
                  Dedicated physical exhibition booths across both days of the conclave.
                </p>
              </CardContent>
              <CardFooter>
                <span>Physical Booth</span>
                <ArrowRight className="w-4 h-4 text-[#18181B]" />
              </CardFooter>
            </Card>

            <Card selected>
              <CardHeader>
                <div className="type-eyebrow text-[#E8590C]">SELECTED STATE</div>
                <CardTitle>Founder Pass</CardTitle>
                <CardDescription>Selected pass tier with active accent hairline ring.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="type-small text-[#52525B]">
                  Priority access to founder dinners, venture office hours, and stage seats.
                </p>
              </CardContent>
              <CardFooter>
                <span className="font-semibold text-[#E8590C]">Selected Tier</span>
                <Check className="w-4 h-4 text-[#E8590C]" />
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 9. ACCORDION & TABS */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="09. INTERACTIVE CONTAINERS"
            title="Accordion & Tabs"
            description="Clean disclosure panels and tabbed segment controls."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Accordion */}
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#18181B] block">
                Accordion Component (FAQ Style)
              </span>
              <Accordion
                defaultOpenId="acc-1"
                items={[
                  {
                    id: 'acc-1',
                    title: 'What are the confirmed dates for the conclave?',
                    content:
                      'Official event dates are in final synchronization with the DVSIET academic calendar and will be formally announced here and across social handles.',
                  },
                  {
                    id: 'acc-2',
                    title: 'Is there a registration fee for students?',
                    content:
                      'The registration fee is currently to be announced. Subsidized delegate passes for students will be made available when registration officially opens.',
                  },
                  {
                    id: 'acc-3',
                    title: 'Who is eligible to participate in the Pitch Arena?',
                    content:
                      'Early-stage startup teams, student innovators, and research spinoffs with a functional MVP or working prototype are eligible to submit applications.',
                  },
                ]}
              />
            </div>

            {/* Tabs */}
            <div className="space-y-6">
              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Segmented Tabs
                </span>
                <Tabs
                  variant="segmented"
                  activeTab={segmentedTab}
                  onChange={setSegmentedTab}
                  tabs={[
                    { id: 'overview', label: 'Day 1 Overview', badge: '09:00' },
                    { id: 'pitch', label: 'Day 2 Pitch Arena', badge: '14:00' },
                    { id: 'expo', label: 'Exhibitor Expo' },
                  ]}
                />
                <div className="p-4 rounded-[3px] border border-[#E4E0D7] bg-white text-xs text-[#52525B]">
                  Active Tab View: <strong className="text-[#18181B]">{segmentedTab.toUpperCase()}</strong>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-semibold text-[#18181B] block">
                  Underline Tabs
                </span>
                <Tabs
                  variant="underline"
                  activeTab={underlineTab}
                  onChange={setUnderlineTab}
                  tabs={[
                    { id: 'tab-1', label: 'General Eligibility' },
                    { id: 'tab-2', label: 'Prize & Grants', badge: 'TBA' },
                    { id: 'tab-3', label: 'Jury Rules' },
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 10. TOAST NOTIFICATIONS */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="10. FEEDBACK"
            title="Toast Notifications"
            description="Polite, accessible system toasts with semantic icons and dismiss actions."
          />

          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setActiveToast({
                    type: 'success',
                    title: 'Registration Waitlist Joined',
                    message: "We'll notify you as soon as official passes are launched.",
                  })
                }
              >
                Trigger Success Toast
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setActiveToast({
                    type: 'alert',
                    title: 'Dates Pending Confirmation',
                    message: 'Official timetable will be dispatched via email.',
                  })
                }
              >
                Trigger Alert Toast
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  setActiveToast({
                    type: 'info',
                    title: 'Showcase Submissions Opening Soon',
                    message: 'Applications will activate prior to conclave commencement.',
                  })
                }
              >
                Trigger Info Toast
              </Button>
            </div>

            {/* Display active toast or static examples */}
            <div className="space-y-3 pt-4 border-t border-[#E4E0D7]">
              {activeToast && (
                <div className="mb-4">
                  <span className="text-xs font-semibold text-[#E8590C] block mb-2">Live Toast Triggered:</span>
                  <Toast
                    type={activeToast.type}
                    title={activeToast.title}
                    message={activeToast.message}
                    onClose={() => setActiveToast(null)}
                  />
                </div>
              )}

              <span className="text-xs font-semibold text-[#18181B] block">Static Toast Specimen:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Toast
                  type="success"
                  title="Submission Acknowledged"
                  message="Pitch deck received for Stage 01 review."
                />
                <Toast
                  type="alert"
                  title="Unconfirmed Schedule"
                  message="Event dates are to be announced."
                />
                <Toast
                  type="info"
                  title="Venue Location"
                  message="DVSIET campus, NH-58, Meerut."
                />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* 11. CTA BAND & MODAL */}
        {/* ------------------------------------------------------------------ */}
        <section className="space-y-6">
          <SectionHeader
            eyebrow="11. CONVERSION & OVERLAYS"
            title="CTABand & Modal Dialog"
            description="Full-width conversion banner and fully accessible modal overlay with keyboard escape handling."
          />

          <div className="space-y-6">
            <CTABand
              eyebrow="STAY INFORMED"
              title="Be the First to Know When Registration Opens"
              description="Join the priority notification list to receive immediate early-bird ticket access, announced speakers, and pitch guidelines."
              primaryAction={{
                label: 'Open Waitlist Dialog',
                onClick: () => setIsModalOpen(true),
              }}
              secondaryAction={{
                label: 'Browse Conclave FAQ',
                href: '/faq',
              }}
              note="Zero spam · Strictly conclave updates · Institutional communications only"
            />

            <div className="text-center pt-2">
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(true)}
              >
                Open Demo Modal Dialog
              </Button>
            </div>
          </div>
        </section>

        {/* Interactive Modal Component */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Priority Registration Notification"
          description="Enter your details to receive early notification when registration opens."
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
                onClick={() => {
                  setIsModalOpen(false);
                  setActiveToast({
                    type: 'success',
                    title: 'Added to Notification Queue',
                    message: "You'll be contacted as soon as passes launch.",
                  });
                }}
              >
                Confirm Interest
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. Priya Sharma"
              required
            />
            <Input
              label="Email Address"
              placeholder="priya@college.edu"
              type="email"
              required
            />
            <Select
              label="Delegate Profile"
              options={[
                { value: 'student', label: 'College Student' },
                { value: 'founder', label: 'Startup Founder' },
                { value: 'investor', label: 'Investor' },
                { value: 'other', label: 'Ecosystem Partner' },
              ]}
            />
            <Checkbox
              label="Keep me informed about Pitch Arena timelines"
              checked={true}
            />
          </div>
        </Modal>

      </div>
    </div>
  );
};
