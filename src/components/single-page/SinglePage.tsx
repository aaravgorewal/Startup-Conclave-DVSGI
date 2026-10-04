import React, { useState } from 'react';
import {
  ArrowRight,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
  Mail,
  Phone,
  Send,
  Check,
  Rocket,
  Handshake,
  TrendingUp,
  Award,
  Layers,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { CONFIG } from '../../config.ts';

export const SinglePage: React.FC = () => {
  // Mobile navigation state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Partner Modal State
  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [partnerData, setPartnerData] = useState({
    company: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  });
  const [partnerSuccess, setPartnerSuccess] = useState(false);
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);

  // Registration Form State (id="register")
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regCollege, setRegCollege] = useState('');
  const [regType, setRegType] = useState('Student');
  const [regWantsToPitch, setRegWantsToPitch] = useState(false);
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [regReferenceId, setRegReferenceId] = useState('');
  const [regError, setRegError] = useState('');

  // FAQ Accordion Open State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Schedule Active Tab (Day 1 vs Day 2)
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  // Smooth scroll handler for nav anchors
  const handleNavClick = (anchor: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Partner Form Submit Handler
  const handlePartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSubmitting(true);
    setTimeout(() => {
      setPartnerSubmitting(false);
      setPartnerSuccess(true);
      setTimeout(() => {
        setPartnerModalOpen(false);
        setPartnerSuccess(false);
        setPartnerData({
          company: '',
          contactName: '',
          email: '',
          phone: '',
          message: '',
        });
      }, 2000);
    }, 600);
  };

  // Registration Form Submit Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regWhatsapp.trim()) {
      setRegError('Please provide your name, email, and WhatsApp number.');
      return;
    }
    setRegError('');
    const id = `SC1-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegReferenceId(id);
    setRegSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF8EC] text-[#111111] font-sans selection:bg-[#FF6B1A] selection:text-white">
      
      {/* =================================================================== */}
      {/* 1. STICKY TOP BAR                                                   */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 bg-[#FFF8EC] border-b-2 border-[#111111] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        
        {/* Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2 font-display font-extrabold text-lg sm:text-xl tracking-tight text-[#111111] hover:text-[#FF6B1A] transition-colors"
        >
          <span className="w-3 h-3 bg-[#FF6B1A] border-2 border-[#111111] inline-block -rotate-12" />
          <span>{CONFIG.event.name.toUpperCase()}</span>
        </a>

        {/* Desktop Anchor Links */}
        <nav className="hidden md:flex items-center gap-6 font-mono text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => handleNavClick('about')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick('schedule')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Schedule
          </button>
          <button
            onClick={() => handleNavClick('pitch')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Pitch
          </button>
          <button
            onClick={() => handleNavClick('partners')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            Partners
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="hover:text-[#FF6B1A] transition-colors cursor-pointer"
          >
            FAQ
          </button>
        </nav>

        {/* Desktop Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('register')}
            className="brutal-btn bg-[#FF6B1A] text-white px-4 py-2 font-display font-bold text-xs uppercase tracking-wider rounded-[2px] cursor-pointer"
          >
            Register Now
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 brutal-border bg-white rounded-[2px] text-[#111111]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b-2 border-[#111111] bg-[#FFD400] p-5 space-y-3 font-mono text-sm font-bold uppercase tracking-wider animate-in fade-in">
          <button
            onClick={() => handleNavClick('about')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            01 • About
          </button>
          <button
            onClick={() => handleNavClick('inside')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            02 • What's Inside
          </button>
          <button
            onClick={() => handleNavClick('schedule')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            03 • Schedule
          </button>
          <button
            onClick={() => handleNavClick('pitch')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            04 • Pitch Arena
          </button>
          <button
            onClick={() => handleNavClick('speakers')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            05 • Speakers
          </button>
          <button
            onClick={() => handleNavClick('partners')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            06 • Partners
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="block w-full text-left py-1.5 hover:underline"
          >
            FAQ
          </button>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. HERO SECTION                                                     */}
      {/* =================================================================== */}
      <section className="relative px-4 sm:px-8 pt-12 sm:pt-20 pb-14 sm:pb-20 max-w-6xl mx-auto text-left">
        
        {/* Floating Sticker Badge */}
        <div className="inline-block mb-6">
          <div className="bg-[#FFD400] text-[#111111] font-mono text-xs sm:text-sm font-black px-3.5 py-1 brutal-border brutal-shadow-sm -rotate-2 uppercase tracking-wide">
            {CONFIG.event.badgeSticker}
          </div>
        </div>

        {/* Huge Headline */}
        <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight leading-[0.98] sm:leading-[0.95] text-[#111111] text-balance">
          Where Ideas Meet{' '}
          <span className="highlight-yellow font-black">
            {CONFIG.event.taglineHighlightedWord}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 sm:mt-8 text-base sm:text-xl lg:text-2xl text-[#111111] font-sans font-medium max-w-3xl leading-snug">
          {CONFIG.event.subline}
        </p>

        {/* Quick Info Strip */}
        <div className="mt-8 p-3 sm:p-4 bg-white brutal-border brutal-shadow-sm inline-flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs sm:text-sm font-bold text-[#111111]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#FF6B1A]" />
            Date: {CONFIG.event.date}
          </span>
          <span className="text-[#111111]/30 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#FF6B1A]" />
            {CONFIG.event.venue}
          </span>
          <span className="text-[#111111]/30 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FF6B1A]" />
            {CONFIG.event.duration}
          </span>
          <span className="text-[#111111]/30 hidden sm:inline">|</span>
          <span className="bg-[#FFD400] px-2 py-0.5 border border-[#111111] text-[11px] uppercase">
            {CONFIG.event.mode}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={() => handleNavClick('register')}
            className="brutal-btn bg-[#FF6B1A] text-white px-7 py-3.5 font-display font-bold text-base sm:text-lg uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Register Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              setRegWantsToPitch(true);
              handleNavClick('register');
            }}
            className="brutal-btn bg-[#FFD400] text-[#111111] px-7 py-3.5 font-display font-bold text-base sm:text-lg uppercase tracking-wider rounded-[2px] flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Apply to Pitch</span>
            <Rocket className="w-5 h-5 text-[#111111]" />
          </button>
        </div>
      </section>

      {/* Marquee Ticker Strip directly under hero */}
      <div className="w-full bg-[#111111] text-[#FFD400] border-y-2 border-[#111111] py-3 overflow-hidden font-display font-black text-sm sm:text-base tracking-widest uppercase select-none">
        <div className="animate-marquee whitespace-nowrap">
          <span>{CONFIG.event.marqueeText.repeat(10)}</span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 3. ABOUT (01)                                                       */}
      {/* =================================================================== */}
      <section id="about" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.about.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
            About The Conclave
          </span>
        </div>

        {/* Narrative */}
        <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-[#111111] max-w-4xl text-balance">
          {CONFIG.about.headline}
        </h2>

        <p className="mt-6 text-base sm:text-lg text-[#111111]/85 font-sans leading-relaxed max-w-3xl">
          {CONFIG.about.introText}
        </p>

        {/* Four Pillars as 1 Line Each */}
        <div className="mt-10 space-y-3 font-sans">
          {CONFIG.about.pillars.map((pillar) => (
            <div
              key={pillar.tag}
              className="p-4 sm:p-5 bg-white brutal-border brutal-shadow-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 hover:bg-[#FFF2D6] transition-colors"
            >
              <span className="font-mono font-black text-sm sm:text-base px-3 py-1 bg-[#111111] text-[#FFD400] border border-[#111111] shrink-0 self-start sm:self-center tracking-widest">
                {pillar.tag}
              </span>
              <p className="text-sm sm:text-base font-semibold text-[#111111]">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 4. WHAT'S INSIDE (02)                                               */}
      {/* =================================================================== */}
      <section id="inside" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.whatsInside.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
            Program Formats
          </span>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#111111]">
          {CONFIG.whatsInside.headline}
        </h2>

        {/* Compact Grid of Formats (1 line each) */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 font-sans">
          {CONFIG.whatsInside.items.map((item, idx) => (
            <div
              key={item.title}
              className="p-4 bg-white brutal-border brutal-shadow-sm flex items-start gap-3.5 hover:translate-x-0.5 transition-transform"
            >
              <span className="font-mono text-xs font-bold text-[#FF6B1A] shrink-0 mt-0.5">
                {(idx + 1).toString().padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display font-bold text-base text-[#111111]">
                  {item.title}
                </h3>
                <p className="text-xs text-[#111111]/80 mt-0.5">
                  {item.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 5. SCHEDULE (03)                                                    */}
      {/* =================================================================== */}
      <section id="schedule" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
              {CONFIG.schedule.sectionNum}
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
              Itinerary Overview
            </span>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 font-mono text-xs font-bold">
            <button
              onClick={() => setActiveDay(1)}
              className={`px-3.5 py-2 brutal-border cursor-pointer transition-all ${
                activeDay === 1
                  ? 'bg-[#111111] text-[#FFD400] brutal-shadow-sm'
                  : 'bg-white text-[#111111]'
              }`}
            >
              DAY 01: BUILD
            </button>
            <button
              onClick={() => setActiveDay(2)}
              className={`px-3.5 py-2 brutal-border cursor-pointer transition-all ${
                activeDay === 2
                  ? 'bg-[#111111] text-[#FFD400] brutal-shadow-sm'
                  : 'bg-white text-[#111111]'
              }`}
            >
              DAY 02: PITCH
            </button>
          </div>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl tracking-tight text-[#111111]">
          {CONFIG.schedule.headline}
        </h2>
        <p className="mt-2 text-xs font-mono text-[#FF6B1A] font-bold">
          {CONFIG.schedule.note}
        </p>

        {/* Schedule Display */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Day 1 Column */}
          <div
            className={`p-6 sm:p-8 bg-white brutal-border brutal-shadow space-y-4 ${
              activeDay === 1 ? 'ring-2 ring-[#FF6B1A]' : 'opacity-85 hidden lg:block'
            }`}
          >
            <div className="border-b-2 border-[#111111] pb-3">
              <span className="font-mono text-xs font-black text-[#FF6B1A] uppercase tracking-wider block">
                PHASE 01
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#111111]">
                {CONFIG.schedule.day1.title}
              </h3>
              <p className="text-xs font-sans text-[#111111]/70 mt-1">
                {CONFIG.schedule.day1.theme}
              </p>
            </div>

            <ul className="space-y-3 font-sans text-sm">
              {CONFIG.schedule.day1.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-[#FF6B1A] border border-[#111111] mt-1.5 shrink-0" />
                  <span className="font-semibold text-[#111111]">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Day 2 Column */}
          <div
            className={`p-6 sm:p-8 bg-white brutal-border brutal-shadow space-y-4 ${
              activeDay === 2 ? 'ring-2 ring-[#FF6B1A]' : 'opacity-85 hidden lg:block'
            }`}
          >
            <div className="border-b-2 border-[#111111] pb-3">
              <span className="font-mono text-xs font-black text-[#FF6B1A] uppercase tracking-wider block">
                PHASE 02
              </span>
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[#111111]">
                {CONFIG.schedule.day2.title}
              </h3>
              <p className="text-xs font-sans text-[#111111]/70 mt-1">
                {CONFIG.schedule.day2.theme}
              </p>
            </div>

            <ul className="space-y-3 font-sans text-sm">
              {CONFIG.schedule.day2.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 bg-[#FFD400] border border-[#111111] mt-1.5 shrink-0" />
                  <span className="font-semibold text-[#111111]">{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 6. PITCH ARENA (04) — FULL-WIDTH BOLD COLOURED BAND                  */}
      {/* =================================================================== */}
      <section id="pitch" className="bg-[#FF6B1A] text-[#111111] border-b-2 border-[#111111] py-16 sm:py-24 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto text-left space-y-8">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-2xl sm:text-3xl text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border-2 border-[#111111]">
              {CONFIG.pitchArena.sectionNum}
            </span>
            <span className="font-mono text-xs font-black uppercase tracking-wider bg-white text-[#111111] px-2.5 py-1 border-2 border-[#111111] -rotate-1">
              FLAGSHIP COMPETITION
            </span>
          </div>

          <div className="space-y-3 max-w-3xl">
            <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-[#111111]">
              {CONFIG.pitchArena.headline}
            </h2>
            <p className="font-display text-xl sm:text-2xl text-white font-extrabold">
              {CONFIG.pitchArena.tagline}
            </p>
            <p className="text-sm sm:text-base font-sans text-[#111111] font-medium leading-relaxed">
              {CONFIG.pitchArena.description}
            </p>
          </div>

          {/* Process in One Row */}
          <div className="p-4 sm:p-6 bg-white brutal-border brutal-shadow">
            <span className="text-[11px] font-mono font-black uppercase text-[#111111] tracking-wider block mb-4">
              STAGE COMPETITION PIPELINE
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-sans">
              {CONFIG.pitchArena.process.map((p, idx) => (
                <div key={p.step} className="p-3 bg-[#FFF8EC] border-2 border-[#111111] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#FF6B1A]">{p.step}</span>
                    {idx < 4 && <span className="font-mono text-xs text-[#111111]/40 hidden sm:inline">→</span>}
                  </div>
                  <div className="font-display font-black text-base text-[#111111]">{p.label}</div>
                  <div className="text-[11px] text-[#111111]/70">{p.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Facts & Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-2">
            <div className="flex flex-wrap items-center gap-3 font-mono text-xs font-bold text-[#111111]">
              {CONFIG.pitchArena.facts.map((fact) => (
                <span key={fact.label} className="bg-white px-3 py-1.5 border-2 border-[#111111] shadow-[2px_2px_0px_#111111]">
                  <strong>{fact.label}:</strong> {fact.value}
                </span>
              ))}
            </div>

            <button
              onClick={() => {
                setRegWantsToPitch(true);
                handleNavClick('register');
              }}
              className="brutal-btn bg-[#FFD400] text-[#111111] px-6 py-3 font-display font-extrabold text-sm sm:text-base uppercase tracking-wider rounded-[2px] cursor-pointer self-start sm:self-auto shrink-0"
            >
              Apply to Pitch →
            </button>
          </div>

        </div>
      </section>

      {/* =================================================================== */}
      {/* 7. SPEAKERS & INVESTORS (05) — HONEST COMING SOON                   */}
      {/* =================================================================== */}
      <section id="speakers" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.speakersInvestors.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
            Curated Lineup
          </span>
        </div>

        <div className="p-8 sm:p-12 bg-white brutal-border brutal-shadow space-y-5 text-left relative overflow-hidden">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="bg-[#FF6B1A] text-white font-mono text-xs font-black px-3 py-1 border-2 border-[#111111] rotate-1">
              {CONFIG.speakersInvestors.badge}
            </span>
            <span className="font-mono text-xs text-[#111111]/70">
              Batch 01 Revealing Soon
            </span>
          </div>

          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111]">
            {CONFIG.speakersInvestors.headline}
          </h2>

          <p className="text-sm sm:text-base font-sans text-[#111111]/85 max-w-2xl leading-relaxed">
            {CONFIG.speakersInvestors.description}
          </p>

          <div className="pt-3 border-t-2 border-[#111111] flex items-center gap-2 font-mono text-xs font-bold text-[#FF6B1A]">
            <CheckCircle2 className="w-4 h-4 text-[#FF6B1A]" />
            <span>{CONFIG.speakersInvestors.promise}</span>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 8. PARTNERS (06)                                                    */}
      {/* =================================================================== */}
      <section id="partners" className="px-4 sm:px-8 py-16 sm:py-24 max-w-6xl mx-auto text-left border-b-2 border-[#111111]">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            {CONFIG.partners.sectionNum}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
            Ecosystem Alliances
          </span>
        </div>

        <div className="p-8 sm:p-12 bg-[#FFF2D6] brutal-border brutal-shadow space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111]">
                {CONFIG.partners.headline}
              </h2>
              <p className="text-sm sm:text-base font-sans text-[#111111]/85 mt-2 max-w-2xl">
                {CONFIG.partners.subline}
              </p>
            </div>

            <button
              onClick={() => setPartnerModalOpen(true)}
              className="brutal-btn bg-[#111111] text-[#FFD400] px-6 py-3 font-display font-bold text-sm sm:text-base uppercase tracking-wider rounded-[2px] cursor-pointer shrink-0"
            >
              Become a Partner
            </button>
          </div>

          <div className="pt-4 border-t-2 border-[#111111] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <span className="text-[#FF6B1A] font-bold">
              {CONFIG.partners.badge}
            </span>
            <div className="flex flex-wrap gap-2 text-[#111111]/80">
              {CONFIG.partners.tiersPreview.map((tier) => (
                <span key={tier} className="bg-white px-2 py-0.5 border border-[#111111]">
                  {tier}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =================================================================== */}
      {/* 9. REGISTRATION (07) — ANCHORED SECTION (id="register")             */}
      {/* =================================================================== */}
      <section id="register" className="px-4 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto text-left border-b-2 border-[#111111] scroll-mt-16">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono font-black text-2xl sm:text-3xl text-[#FF6B1A]">
            07
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
            Registration
          </span>
        </div>

        <div className="p-6 sm:p-10 bg-white brutal-border brutal-shadow-lg space-y-6">
          
          <div className="border-b-2 border-[#111111] pb-4">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-[#111111]">
              Register Your Free Seat
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[#111111]/80 mt-1">
              Join students, founders, and mentors at DVSIET Meerut. Priority access confirmed upon launch.
            </p>
          </div>

          {regSubmitted ? (
            <div className="p-6 sm:p-8 bg-[#FFD400] border-2 border-[#111111] text-center space-y-4 animate-in fade-in">
              <div className="w-12 h-12 bg-white border-2 border-[#111111] flex items-center justify-center mx-auto text-[#111111]">
                <Check className="w-7 h-7 stroke-[3]" />
              </div>
              <h3 className="font-display font-extrabold text-2xl text-[#111111]">
                You're on the Priority List!
              </h3>
              <p className="text-sm font-sans text-[#111111] max-w-md mx-auto">
                Thank you, <strong>{regName}</strong>. We've logged your registration for {regCollege}. Reference Code:
              </p>
              <div className="font-mono font-black text-lg sm:text-xl text-[#FF6B1A] bg-white px-4 py-2 border-2 border-[#111111] inline-block">
                {regReferenceId}
              </div>
              <p className="text-xs font-mono text-[#111111]/70">
                You'll receive WhatsApp/email alerts when exact dates & badge pickups go live.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setRegSubmitted(false);
                    setRegName('');
                    setRegEmail('');
                    setRegWhatsapp('');
                    setRegCollege('');
                  }}
                  className="text-xs font-mono font-bold text-[#111111] underline hover:text-[#FF6B1A]"
                >
                  Register another attendee
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4 font-sans text-xs sm:text-sm">
              {regError && (
                <div className="p-3 bg-red-100 border-2 border-red-500 text-red-700 text-xs font-bold">
                  {regError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111111] block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Aryan Sharma"
                    className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111111] block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="aryan@college.edu"
                    className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-[#111111] block">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={regWhatsapp}
                    onChange={(e) => setRegWhatsapp(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#111111] block">I am a *</label>
                  <select
                    value={regType}
                    onChange={(e) => setRegType(e.target.value)}
                    className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
                  >
                    <option value="Student">Student (College / School)</option>
                    <option value="Founder">Startup Founder / Builder</option>
                    <option value="Professional">Working Professional</option>
                    <option value="Investor">Investor / Mentor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#111111] block">College / Organisation Name *</label>
                <input
                  type="text"
                  required
                  value={regCollege}
                  onChange={(e) => setRegCollege(e.target.value)}
                  placeholder="e.g. DVSIET Meerut or Startup Name"
                  className="w-full p-2.5 bg-[#FFF8EC] border-2 border-[#111111] font-sans focus:outline-none focus:bg-white"
                />
              </div>

              {/* Pitch Arena Tick Option */}
              <div className="p-3.5 bg-[#FFD400]/40 border-2 border-[#111111] flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="pitchCheck"
                  checked={regWantsToPitch}
                  onChange={(e) => setRegWantsToPitch(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-[#FF6B1A] border-2 border-[#111111] rounded-none cursor-pointer"
                />
                <label htmlFor="pitchCheck" className="text-xs font-bold text-[#111111] cursor-pointer">
                  I want to pitch in the Startup Pitch Arena (Day 2 mainstage)
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full brutal-btn bg-[#FF6B1A] text-white p-3.5 font-display font-black text-base uppercase tracking-wider rounded-[2px] cursor-pointer"
                >
                  Submit Registration Free →
                </button>
              </div>
            </form>
          )}

        </div>
      </section>

      {/* =================================================================== */}
      {/* 10. FAQ ACCORDION (6 Questions)                                     */}
      {/* =================================================================== */}
      <section id="faq" className="px-4 sm:px-8 py-16 sm:py-24 max-w-4xl mx-auto text-left border-b-2 border-[#111111]">
        
        <div className="flex items-center gap-3 mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#111111] bg-[#FFD400] px-2.5 py-0.5 border border-[#111111]">
            Clear Answers
          </span>
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-[#111111] mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {CONFIG.faq.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white brutal-border brutal-shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left font-display font-bold text-base sm:text-lg flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#FF6B1A] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-sm font-sans text-[#111111]/85 border-t border-[#111111]/15 leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =================================================================== */}
      {/* 11. FOOTER                                                          */}
      {/* =================================================================== */}
      <footer className="px-4 sm:px-8 py-12 sm:py-16 max-w-6xl mx-auto text-left font-sans text-xs sm:text-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b-2 border-[#111111]">
          
          <div className="space-y-2">
            <div className="font-display font-black text-xl text-[#111111]">
              {CONFIG.event.name.toUpperCase()}
            </div>
            <p className="text-xs text-[#111111]/70 font-mono">
              {CONFIG.event.tagline}
            </p>
            <div className="font-bold text-[#FF6B1A] pt-1">
              Organised at DVSIET, Meerut
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            <span className="font-black text-[#111111] uppercase block mb-1">Secretariat Desk</span>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <a href={`mailto:${CONFIG.contact.email}`} className="hover:underline">
                {CONFIG.contact.email}
              </a>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#FF6B1A]" />
              <span>{CONFIG.contact.phone}</span>
            </div>
            <div className="text-[#111111]/60 pt-1">
              {CONFIG.contact.city}
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono font-black text-[#111111] uppercase block text-xs">Social & Community</span>
            <div className="flex items-center gap-3">
              <a
                href={CONFIG.contact.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 brutal-border bg-white hover:bg-[#FFD400] transition-colors"
                aria-label="LinkedIn"
              >
                LinkedIn
              </a>
              <a
                href={CONFIG.contact.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 brutal-border bg-white hover:bg-[#FFD400] transition-colors"
                aria-label="Twitter"
              >
                X (Twitter)
              </a>
              <a
                href={CONFIG.contact.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 brutal-border bg-white hover:bg-[#FFD400] transition-colors"
                aria-label="Instagram"
              >
                Instagram
              </a>
            </div>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-[#111111]/70">
          <span>© {new Date().getFullYear()} Startup Conclave 1.0. All rights reserved.</span>
          <span>Dewan V.S. Institute of Engineering & Technology, Meerut.</span>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* PARTNER MODAL FORM                                                  */}
      {/* =================================================================== */}
      {partnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFF8EC] brutal-border brutal-shadow-lg p-6 sm:p-8 max-w-lg w-full text-left space-y-4">
            
            <div className="flex items-center justify-between border-b-2 border-[#111111] pb-3">
              <h3 className="font-display font-black text-xl text-[#111111]">
                Partner With Startup Conclave 1.0
              </h3>
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="p-1 brutal-border bg-white hover:bg-[#FFD400]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {partnerSuccess ? (
              <div className="p-6 bg-[#FFD400] border-2 border-[#111111] text-center space-y-2">
                <Check className="w-8 h-8 text-[#111111] mx-auto stroke-[3]" />
                <h4 className="font-display font-bold text-lg">Thank You!</h4>
                <p className="text-xs font-sans">
                  Your inquiry has been received. Our partnership secretariat will connect within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePartnerSubmit} className="space-y-3 font-sans text-xs">
                <div>
                  <label className="font-bold text-[#111111] block mb-1">Company / Organisation *</label>
                  <input
                    type="text"
                    required
                    value={partnerData.company}
                    onChange={(e) => setPartnerData({ ...partnerData, company: e.target.value })}
                    placeholder="e.g. Acme Tech"
                    className="w-full p-2 bg-white border-2 border-[#111111]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#111111] block mb-1">Contact Name *</label>
                    <input
                      type="text"
                      required
                      value={partnerData.contactName}
                      onChange={(e) => setPartnerData({ ...partnerData, contactName: e.target.value })}
                      placeholder="e.g. Rahul Dev"
                      className="w-full p-2 bg-white border-2 border-[#111111]"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-[#111111] block mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={partnerData.phone}
                      onChange={(e) => setPartnerData({ ...partnerData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-2 bg-white border-2 border-[#111111]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={partnerData.email}
                    onChange={(e) => setPartnerData({ ...partnerData, email: e.target.value })}
                    placeholder="partner@acme.com"
                    className="w-full p-2 bg-white border-2 border-[#111111]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#111111] block mb-1">Partnership Interest / Message</label>
                  <textarea
                    rows={3}
                    value={partnerData.message}
                    onChange={(e) => setPartnerData({ ...partnerData, message: e.target.value })}
                    placeholder="Tell us what sponsorship or community track you'd like to sponsor..."
                    className="w-full p-2 bg-white border-2 border-[#111111]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPartnerModalOpen(false)}
                    className="px-4 py-2 border-2 border-[#111111] font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={partnerSubmitting}
                    className="brutal-btn bg-[#FF6B1A] text-white px-5 py-2 font-display font-bold text-xs uppercase"
                  >
                    {partnerSubmitting ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
