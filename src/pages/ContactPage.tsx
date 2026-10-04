import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Rocket,
  Handshake,
  Ticket,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Input } from '../components/ui/Input.tsx';
import { Select } from '../components/ui/Select.tsx';
import { Textarea } from '../components/ui/Textarea.tsx';
import { Toast } from '../components/ui/Toast.tsx';
import { EVENT_DATA } from '../data/content.ts';

export const ContactPage: React.FC = () => {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General');
  const [message, setMessage] = useState('');

  // Status & Validation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Full name is required.';
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      newErrors.email = 'A valid email address is required.';
    }
    if (!message.trim() || message.length < 15) {
      newErrors.message = 'Please provide a message (minimum 15 characters).';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setToastMessage('Message sent successfully! Our secretariat desk will reply within 24 hours.');
      setName('');
      setEmail('');
      setTopic('General');
      setMessage('');
      setErrors({});
    }, 700);
  };

  return (
    <PageShell
      title="Contact Secretariat"
      kicker="DVSIET MEERUT · GET IN TOUCH"
      statusBadge="Secretariat Active"
      description="Connect directly with the Startup Conclave 1.0 organizing committee for delegate queries, speaking opportunities, partnerships, or press inquiries."
    >
      <div className="space-y-16 max-w-6xl mx-auto text-left">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="mb-4">
            <Toast
              type="success"
              title="Message Dispatched"
              message={toastMessage}
              onClose={() => setToastMessage(null)}
            />
          </div>
        )}

        {/* =================================================================== */}
        {/* 1. SPLIT: DIRECT INQUIRY FORM (LEFT) + QUICK LINKS (RIGHT)          */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 shadow-paper space-y-6">
            <div className="border-b border-[#E4E0D7] pb-4 space-y-1">
              <span className="type-eyebrow text-[#E8590C]">
                SEND A MESSAGE
              </span>
              <h2 className="type-h2 text-[#18181B] font-display">
                How Can We Help You?
              </h2>
              <p className="type-body text-[#52525B] text-xs sm:text-sm">
                Fill in the details below. Messages are routed directly to the appropriate conclave committee member.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  placeholder="e.g. Ananya Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                  required
                />

                <Input
                  label="Email Address"
                  type="email"
                  placeholder="ananya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  required
                />
              </div>

              {/* Topic Dropdown: General / Sponsorship / Speaking / Startup / Media */}
              <Select
                label="Topic of Inquiry"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                options={[
                  { value: 'General', label: 'General / Attendee Queries' },
                  { value: 'Sponsorship', label: 'Sponsorship & Partnerships' },
                  { value: 'Speaking', label: 'Speaking / Panel Proposal' },
                  { value: 'Startup', label: 'Startup Pitch Arena & Showcase' },
                  { value: 'Media', label: 'Press & Media Accreditation' },
                ]}
                helperText="Routes your message directly to the designated department"
              />

              <Textarea
                label="Your Message"
                placeholder="Share your question, proposal, or institution details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={errors.message}
                required
                rows={5}
              />

              <div className="pt-3 border-t border-[#EFECE6] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <span className="text-xs text-[#71717A]">
                  Typical response time: Within 24 business hours.
                </span>

                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>

          {/* Quick Links & Campus Anchor (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Links Box */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <span className="type-eyebrow text-[#E8590C] block">
                EXPEDITE YOUR REQUEST
              </span>
              <h3 className="type-h3 text-[#18181B] font-display">
                Dedicated Portals
              </h3>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Save time by navigating directly to dedicated registration, pitch, or sponsorship workflows:
              </p>

              <div className="space-y-2.5 pt-1">
                <Link
                  to="/pitch#application-form"
                  className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Rocket className="w-4 h-4 text-[#E8590C]" />
                    <span className="font-semibold text-[#18181B] group-hover:text-[#E8590C]">
                      Pitch Arena Application
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/sponsors#enquiry-form"
                  className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Handshake className="w-4 h-4 text-[#E8590C]" />
                    <span className="font-semibold text-[#18181B] group-hover:text-[#E8590C]">
                      Sponsorship Inquiry Form
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:translate-x-0.5 transition-transform" />
                </Link>

                <Link
                  to="/register"
                  className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-2.5 text-xs">
                    <Ticket className="w-4 h-4 text-[#E8590C]" />
                    <span className="font-semibold text-[#18181B] group-hover:text-[#E8590C]">
                      Attendee Pre-Registration
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#71717A] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-7 shadow-xs space-y-4">
              <span className="type-eyebrow text-[#E8590C] block">
                COMMUNITY CHANNELS
              </span>
              <h3 className="type-h4 text-[#18181B] font-display">
                Follow Official Updates
              </h3>
              <p className="text-xs text-[#52525B]">
                Stay informed with keynote reveals, schedule drops, and investor lineup announcements.
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href={EVENT_DATA.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center gap-2 text-xs font-semibold text-[#18181B] transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-[#0077B5]" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href={EVENT_DATA.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center gap-2 text-xs font-semibold text-[#18181B] transition-colors"
                >
                  <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                  <span>X / Twitter</span>
                </a>

                <a
                  href={EVENT_DATA.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center gap-2 text-xs font-semibold text-[#18181B] transition-colors"
                >
                  <Instagram className="w-4 h-4 text-[#E4405F]" />
                  <span>Instagram</span>
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] hover:border-[#18181B] flex items-center gap-2 text-xs font-semibold text-[#18181B] transition-colors"
                >
                  <Youtube className="w-4 h-4 text-[#FF0000]" />
                  <span>YouTube</span>
                </a>
              </div>
            </div>

          </div>

        </div>

        {/* =================================================================== */}
        {/* 2. ORGANISER CONTACT CARDS                                          */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4">
            <span className="type-eyebrow text-[#E8590C]">SECRETARIAT DIRECTORY</span>
            <h2 className="type-h2 text-[#18181B] font-display">Organiser Contact Desks</h2>
            <p className="type-body text-[#52525B] max-w-xl mt-0.5">
              Direct departmental channels for rapid coordination and faculty delegations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: General Secretariat */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs space-y-3.5 hover:border-[#18181B] transition-colors">
              <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="type-h4 text-[#18181B] font-display">General Secretariat</h3>
                <span className="text-[10px] font-mono text-[#71717A] uppercase">Registration & Venue</span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed">
                General inquiries, pass confirmation assistance, and campus bus arrival coordination.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] space-y-1 text-xs">
                <a
                  href={`mailto:${EVENT_DATA.inquiries.general}`}
                  className="font-semibold text-[#E8590C] hover:underline block truncate"
                >
                  {EVENT_DATA.inquiries.general}
                </a>
                <span className="text-[#71717A] font-mono block text-[11px]">
                  +91 121 244 0495
                </span>
              </div>
            </div>

            {/* Card 2: Sponsorship */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs space-y-3.5 hover:border-[#18181B] transition-colors">
              <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Handshake className="w-4 h-4" />
              </div>
              <div>
                <h3 className="type-h4 text-[#18181B] font-display">Corporate Relations</h3>
                <span className="text-[10px] font-mono text-[#71717A] uppercase">Partnerships & Tiers</span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Custom sponsor packages, branded maker pavilions, and cloud partner allocations.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] space-y-1 text-xs">
                <a
                  href={`mailto:${EVENT_DATA.inquiries.sponsorship}`}
                  className="font-semibold text-[#E8590C] hover:underline block truncate"
                >
                  {EVENT_DATA.inquiries.sponsorship}
                </a>
                <span className="text-[#71717A] font-mono block text-[11px]">
                  +91 121 244 0496
                </span>
              </div>
            </div>

            {/* Card 3: Pitch Arena & Startups */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs space-y-3.5 hover:border-[#18181B] transition-colors">
              <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Rocket className="w-4 h-4" />
              </div>
              <div>
                <h3 className="type-h4 text-[#18181B] font-display">Startup Arena Desk</h3>
                <span className="text-[10px] font-mono text-[#71717A] uppercase">Competition & Demo</span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Deck submissions, technical screening questions, and exhibition booth inquiries.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] space-y-1 text-xs">
                <a
                  href={`mailto:${EVENT_DATA.inquiries.pitch}`}
                  className="font-semibold text-[#E8590C] hover:underline block truncate"
                >
                  {EVENT_DATA.inquiries.pitch}
                </a>
                <span className="text-[#71717A] font-mono block text-[11px]">
                  +91 121 244 0497
                </span>
              </div>
            </div>

            {/* Card 4: Speakers & Keynotes */}
            <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 shadow-xs space-y-3.5 hover:border-[#18181B] transition-colors">
              <div className="w-9 h-9 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center text-[#E8590C]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="type-h4 text-[#18181B] font-display">Speaker Relations</h3>
                <span className="text-[10px] font-mono text-[#71717A] uppercase">Keynotes & Panels</span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed">
                Proposals from founders, VC partners, and technical masterclass leaders.
              </p>
              <div className="pt-2 border-t border-[#EFECE6] space-y-1 text-xs">
                <a
                  href="mailto:speakers@dvsiet.ac.in"
                  className="font-semibold text-[#E8590C] hover:underline block truncate"
                >
                  speakers@dvsiet.ac.in
                </a>
                <span className="text-[#71717A] font-mono block text-[11px]">
                  +91 121 244 0498
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Physical Campus Address Card */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1">
            <div className="type-eyebrow text-[#E8590C] flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              <span>INSTITUTIONAL HEADQUARTERS</span>
            </div>
            <h3 className="type-h3 text-[#18181B] font-display">
              Dewan V.S. Institute of Engineering & Technology (DVSIET)
            </h3>
            <p className="text-xs sm:text-sm text-[#52525B]">
              NH-58, Bypass Road, Partapur, Meerut, Uttar Pradesh 250103, India.
            </p>
          </div>

          <Link to="/venue" className="shrink-0">
            <Button
              variant="secondary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Campus Travel Guide
            </Button>
          </Link>
        </div>

      </div>
    </PageShell>
  );
};
