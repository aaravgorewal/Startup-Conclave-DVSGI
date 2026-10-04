import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic,
  Linkedin,
  Clock,
  Sparkles,
  ArrowRight,
  Mail,
  CheckCircle2,
  Calendar,
  Building,
  Briefcase,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import {
  SPEAKERS,
  SpeakerItem,
  SpeakerCategory,
  SPEAKERS_STATUS,
} from '../data/content.ts';

// Initials Avatar component when photo is absent
const InitialsAvatar: React.FC<{ name: string; className?: string }> = ({
  name,
  className = '',
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`w-14 h-14 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-[#18181B] font-display font-bold text-base flex items-center justify-center shrink-0 shadow-2xs ${className}`}
      aria-label={`${name}'s avatar`}
    >
      {initials}
    </div>
  );
};

// PersonCard for populated speaker profiles
const PersonCard: React.FC<{ speaker: SpeakerItem }> = ({ speaker }) => {
  return (
    <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-5 sm:p-6 shadow-xs hover:border-[#18181B] hover:shadow-paper transition-all text-left flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Top Header: Avatar + Status + LinkedIn */}
        <div className="flex items-start justify-between gap-3">
          {speaker.photo ? (
            <img
              src={speaker.photo}
              alt={speaker.name}
              className="w-14 h-14 rounded-[3px] object-cover border border-[#E4E0D7] shrink-0"
            />
          ) : (
            <InitialsAvatar name={speaker.name} />
          )}

          <div className="flex items-center gap-2">
            <StatusBadge
              status={speaker.status === 'confirmed' ? 'confirmed' : 'invited'}
              size="sm"
            />
            {speaker.linkedin && (
              <a
                href={speaker.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-[2px] border border-[#E4E0D7] bg-[#FBF9F5] flex items-center justify-center text-[#52525B] hover:text-[#E8590C] hover:border-[#E8590C] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                aria-label={`${speaker.name} on LinkedIn`}
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Identity & Role */}
        <div>
          <h3 className="type-h3 text-[#18181B] font-display">
            {speaker.name}
          </h3>
          <p className="text-xs font-semibold text-[#E8590C] font-sans mt-0.5">
            {speaker.role}
          </p>
          <p className="text-xs text-[#52525B] font-sans flex items-center gap-1.5 mt-1">
            <Building className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
            <span>{speaker.organisation}</span>
          </p>
        </div>

        {/* Bio if available */}
        {speaker.bio && (
          <p className="text-xs text-[#52525B] leading-relaxed line-clamp-3">
            {speaker.bio}
          </p>
        )}
      </div>

      {/* Linked Session Footer */}
      {speaker.linkedSession && (
        <div className="pt-3 border-t border-[#EFECE6] space-y-1 text-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#71717A] block">
            Scheduled Session
          </span>
          <div className="flex items-center gap-1.5 text-[#18181B] font-medium leading-tight">
            <Clock className="w-3.5 h-3.5 text-[#E8590C] shrink-0" />
            <span className="line-clamp-1">{speaker.linkedSession}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const SpeakersPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  // Optional developer preview toggle to test populated state with demo speaker
  const [showDemoSpeaker, setShowDemoSpeaker] = useState(false);

  const categories: (string | SpeakerCategory)[] = [
    'All',
    'Founders',
    'Investors',
    'Industry',
    'Government & Ecosystem',
    'Academic',
    'Mentors',
  ];

  // Base rule: only items with status "confirmed" or "invited" display. "hidden" never shows unless demo toggle active.
  const activeSpeakers = useMemo(() => {
    return SPEAKERS.filter((s) => {
      if (showDemoSpeaker && s.id === 'demo-speaker-01') return true;
      return s.status === 'confirmed' || s.status === 'invited';
    });
  }, [showDemoSpeaker]);

  const filteredSpeakers = useMemo(() => {
    if (selectedCategory === 'All') return activeSpeakers;
    return activeSpeakers.filter((s) => s.category === selectedCategory);
  }, [activeSpeakers, selectedCategory]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setSubscribeStatus('error');
      return;
    }
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 600);
  };

  // 6 Skeleton Cards for the Empty State (No fake faces)
  const skeletonTracks = [
    {
      role: 'Keynote Speaker',
      track: 'Scale Founders & Unicorn Operators',
      description: 'Founders who scaled defensible businesses from zero to national market presence.',
    },
    {
      role: 'Venture Capital Partner',
      track: 'Early-Stage VC Funds',
      description: 'Institutional check writers leading seed and series-A funding rounds in India.',
    },
    {
      role: 'Angel Syndicate Lead',
      track: 'Angel Investors & High-Net-Worth Mentors',
      description: 'Operators actively deploying early angel capital and syndicating seed rounds.',
    },
    {
      role: 'Deep Tech & AI Lead',
      track: 'Product & Systems Architecture',
      description: 'Engineering leaders building foundation models, devtools, and spatial software.',
    },
    {
      role: 'Academic & Incubation Head',
      track: 'Academic Incubators & Grant Accelerators',
      description: 'University incubation heads bridging research patents into commercial startups.',
    },
    {
      role: 'Ecosystem Enabler',
      track: 'Policy, Infrastructure & Cloud Partners',
      description: 'Government catalysts, cloud architect partners, and startup policy drivers.',
    },
  ];

  const isEmpty = activeSpeakers.length === 0;

  return (
    <PageShell
      title="Speakers & Mentors"
      kicker="CURATED LINEUP"
      statusBadge="Announcements In Progress"
      description="Bringing together battle-tested startup founders, venture partners, technical innovators, and ecosystem mentors to DVSIET Meerut."
    >
      <div className="space-y-12 max-w-6xl mx-auto text-left">
        
        {/* Developer Sandbox Switch: Toggle Demo Speaker */}
        <div className="flex items-center justify-between p-3 rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] text-xs text-[#52525B]">
          <span className="font-mono text-[11px]">
            Data Source Status: {activeSpeakers.length} speaker(s) visible (Hidden items excluded by default)
          </span>
          <button
            type="button"
            onClick={() => setShowDemoSpeaker(!showDemoSpeaker)}
            className="inline-flex items-center gap-1.5 font-semibold text-[#E8590C] hover:text-[#C2410C] focus-visible:outline-none"
          >
            {showDemoSpeaker ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showDemoSpeaker ? 'Return to Default Empty State' : 'Preview Populated Card Layout'}</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* CASE A: POPULATED STATE (When speakers exist or preview toggle on) */}
        {/* =================================================================== */}
        {!isEmpty && (
          <div className="space-y-8">
            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E4E0D7] pb-4">
              <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
                Category:
              </span>
              {categories.map((cat) => {
                const count =
                  cat === 'All'
                    ? activeSpeakers.length
                    : activeSpeakers.filter((s) => s.category === cat).length;
                return (
                  <Chip
                    key={cat}
                    active={selectedCategory === cat}
                    onClick={() => setSelectedCategory(cat)}
                    count={count}
                    className="shrink-0"
                  >
                    {cat}
                  </Chip>
                );
              })}
            </div>

            {/* Populated Speaker Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpeakers.map((speaker) => (
                <PersonCard key={speaker.id} speaker={speaker} />
              ))}
            </div>

            {filteredSpeakers.length === 0 && (
              <div className="p-8 text-center rounded-[3px] border border-[#E4E0D7] bg-white">
                <p className="type-h4 text-[#18181B] font-display">No speakers in "{selectedCategory}"</p>
                <p className="text-xs text-[#71717A] mt-1">Check back soon as more speaker invitations are finalized.</p>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* CASE B: PRIMARY EMPTY STATE (Since none are confirmed yet)         */}
        {/* =================================================================== */}
        {isEmpty && (
          <div className="space-y-12">
            
            {/* 1. Polished "Speaker announcements coming soon" Hero */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-paper">
              <div className="mx-auto w-12 h-12 rounded-[3px] border border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-center text-[#E8590C]">
                <Mic className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <StatusBadge status="coming_soon" customLabel={SPEAKERS_STATUS.badge} />
                <h2 className="type-h2 text-[#18181B] font-display mt-2">
                  Speaker Announcements Coming Soon
                </h2>
                <p className="type-body text-[#52525B] max-w-xl mx-auto leading-relaxed">
                  We are actively curating visionary tech founders, venture capital partners, angel investors, and experienced operators. The confirmed lineup will be unveiled in phased announcement batches prior to the conclave.
                </p>
              </div>

              {/* Verified Practitioners Promise */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#71717A]">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-[#E8590C]" />
                  Zero Paid Keynotes · 100% Battle-Tested Operators
                </span>
                <span className="hidden sm:inline text-[#A1A1AA]">·</span>
                <span>In-Person at DVSIET Meerut</span>
              </div>
            </div>

            {/* 2. Six Skeleton-Style Cards Labeled "Announcing soon" (No fake faces) */}
            <div className="space-y-4">
              <div className="border-b border-[#E4E0D7] pb-3 flex items-center justify-between">
                <div>
                  <h3 className="type-h3 text-[#18181B] font-display">
                    Speaker Slots in Finalization
                  </h3>
                  <p className="type-small text-[#71717A]">
                    Six core tracks undergoing confidential coordination. Zero synthetic photos or speculative names.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E8590C] shrink-0 font-semibold hidden sm:inline">
                  Batch 01 Announcing Soon
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skeletonTracks.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs flex flex-col justify-between space-y-5 text-left relative overflow-hidden group hover:border-[#18181B] transition-colors"
                  >
                    <div className="space-y-4">
                      {/* Top Header: Abstract Geometric Monogram Avatar + Status */}
                      <div className="flex items-start justify-between">
                        <div className="w-13 h-13 rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] flex items-center justify-center text-[#71717A] font-mono text-xs font-bold">
                          <span className="text-[#A1A1AA]">0{idx + 1}</span>
                        </div>
                        <StatusBadge status="coming_soon" size="sm" customLabel="Announcing soon" />
                      </div>

                      {/* Role & Track Details */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8590C] block">
                          {item.role}
                        </span>
                        <h4 className="type-h4 text-[#18181B] font-display">
                          {item.track}
                        </h4>
                        <p className="text-xs text-[#52525B] leading-relaxed pt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between text-xs text-[#71717A]">
                      <span className="font-mono text-[11px]">Invitation Active</span>
                      <span className="text-[#E8590C] font-medium font-sans">Batch 01</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. "Get Notified" Email Capture Box */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 max-w-2xl mx-auto shadow-xs text-center space-y-4">
              <div className="w-10 h-10 rounded-[3px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C] mx-auto">
                <Mail className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h3 className="type-h3 text-[#18181B] font-display">
                  Get Notified When Speakers Drop
                </h3>
                <p className="type-small text-[#71717A] max-w-md mx-auto">
                  Be the first to see the full speaker lineup, keynote topics, and workshop mentors as they are confirmed.
                </p>
              </div>

              {subscribeStatus === 'success' ? (
                <div className="p-3.5 rounded-[2px] border border-emerald-200 bg-emerald-50 text-emerald-900 text-xs font-medium">
                  You're subscribed! We'll alert you the instant Batch 01 speakers are published.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-2 max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      className="flex-1 rounded-[3px] border border-[#E4E0D7] bg-[#FBF9F5] px-3.5 py-2.5 text-xs text-[#18181B] placeholder:text-[#A1A1AA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      type="submit"
                      isLoading={subscribeStatus === 'loading'}
                    >
                      Notify Me
                    </Button>
                  </div>
                  {subscribeStatus === 'error' && (
                    <p className="text-xs text-red-600 font-sans">Please enter a valid email address.</p>
                  )}
                  <p className="text-[11px] text-[#71717A]">
                    Zero spam · Strictly conclave speaker updates only.
                  </p>
                </form>
              )}
            </div>

            {/* 4. "Interested in Speaking? Contact us" Callout */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
              <div className="space-y-1 max-w-xl">
                <span className="type-eyebrow text-[#E8590C]">CALL FOR SPEAKERS</span>
                <h3 className="type-h3 text-[#18181B] font-display">
                  Interested in Speaking or Leading a Masterclass?
                </h3>
                <p className="type-body text-[#52525B] text-xs sm:text-sm">
                  If you are a startup founder, angel operator, institutional investor, or technology specialist passionate about grassroots innovation, our secretariat invites your proposal.
                </p>
              </div>
              <Link to="/contact" className="shrink-0">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Contact Secretariat
                </Button>
              </Link>
            </div>

          </div>
        )}

      </div>
    </PageShell>
  );
};
