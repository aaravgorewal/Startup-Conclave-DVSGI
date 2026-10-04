import React, { useState } from 'react';
import { ArrowUpRight, Check, Copy, Sparkles, Layers, Palette, Type, Shield, Terminal, BookOpen, Building } from 'lucide-react';
import { EVENT_DATA } from '../data/content.ts';

interface Swatch {
  name: string;
  role: string;
  hex: string;
  textCol: string;
  borderCol?: string;
}

interface DirectionSpec {
  id: string;
  name: string;
  tagline: string;
  vibe: string;
  headingFont: string;
  headingFamily: string;
  bodyFont: string;
  bodyFamily: string;
  radiusLabel: string;
  radiusClass: string;
  swatches: Swatch[];
}

export const DesignLabPage: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'electric' | 'editorial' | 'capital'>('all');

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  const directions: DirectionSpec[] = [
    {
      id: 'electric',
      name: 'Direction A: "Electric Dark"',
      tagline: 'High-voltage, builder-first, tech-forward, razor sharp.',
      vibe: 'Best for hackathon builders, student developers, deep-tech founders. Unapologetic contrast and raw energy.',
      headingFont: 'Space Grotesk',
      headingFamily: "'Space Grotesk', sans-serif",
      bodyFont: 'Plus Jakarta Sans',
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
      radiusLabel: '0px (Sharp / None)',
      radiusClass: 'rounded-none',
      swatches: [
        { name: 'Background', role: 'Main canvas', hex: '#080A0E', textCol: '#FFFFFF' },
        { name: 'Surface', role: 'Cards & containers', hex: '#11151F', textCol: '#FFFFFF' },
        { name: 'Primary / Accent', role: 'Electric Lime CTA & focus', hex: '#D4FF00', textCol: '#000000' },
        { name: 'Secondary Accent', role: 'Electric Cyan indicator', hex: '#00F0FF', textCol: '#000000' },
        { name: 'Text', role: 'Headlines & high contrast body', hex: '#FFFFFF', textCol: '#000000' },
        { name: 'Muted', role: 'Subtitles & metadata', hex: '#7E8B9B', textCol: '#FFFFFF' },
        { name: 'Border', role: 'Hairline grid dividers', hex: '#1E2638', textCol: '#FFFFFF' },
      ],
    },
    {
      id: 'editorial',
      name: 'Direction B: "Editorial Light"',
      tagline: 'Prestigious, publication-grade, intellectual, generous whitespace.',
      vibe: 'Best for academic prestige, policy makers, thoughtful storytelling, high-credibility founders.',
      headingFont: 'Fraunces',
      headingFamily: "'Fraunces', Georgia, serif",
      bodyFont: 'Plus Jakarta Sans',
      bodyFamily: "'Plus Jakarta Sans', sans-serif",
      radiusLabel: '2px–4px (Subtle Paper Trim)',
      radiusClass: 'rounded-xs',
      swatches: [
        { name: 'Background', role: 'Warm Alabaster Canvas', hex: '#FBF9F5', textCol: '#18181B', borderCol: '#E4E0D7' },
        { name: 'Surface', role: 'Pristine Paper Cards', hex: '#FFFFFF', textCol: '#18181B', borderCol: '#E4E0D7' },
        { name: 'Primary', role: 'Deep Carbon Ink Text & CTAs', hex: '#18181B', textCol: '#FFFFFF' },
        { name: 'Accent', role: 'Warm Terracotta / Coral', hex: '#E8590C', textCol: '#FFFFFF' },
        { name: 'Text', role: 'Primary Body Typography', hex: '#18181B', textCol: '#FFFFFF' },
        { name: 'Muted', role: 'Metadata & captions', hex: '#71717A', textCol: '#FFFFFF' },
        { name: 'Border', role: 'Warm hairline dividers', hex: '#E4E0D7', textCol: '#18181B', borderCol: '#CCC' },
      ],
    },
    {
      id: 'capital',
      name: 'Direction C: "Capital Navy"',
      tagline: 'Institutional, venture-grade, sovereign wealth & capital allocators.',
      vibe: 'Best for institutional credibility, corporate sponsors, tier-1 venture jury, long-term ecosystem scale.',
      headingFont: 'Outfit',
      headingFamily: "'Outfit', sans-serif",
      bodyFont: 'DM Sans',
      bodyFamily: "'DM Sans', sans-serif",
      radiusLabel: '12px–16px (Refined Modern Curve)',
      radiusClass: 'rounded-xl',
      swatches: [
        { name: 'Background', role: 'Deep Midnight Navy', hex: '#0B132B', textCol: '#FFFFFF' },
        { name: 'Surface', role: 'Venture Marine Surface', hex: '#131D3B', textCol: '#FFFFFF' },
        { name: 'Primary / Accent', role: 'Imperial Gold / Amber', hex: '#E5A93C', textCol: '#0B132B' },
        { name: 'Secondary Accent', role: 'Cobalt highlight', hex: '#3B82F6', textCol: '#FFFFFF' },
        { name: 'Text', role: 'Crisp Off-white', hex: '#F8FAFC', textCol: '#000000' },
        { name: 'Muted', role: 'Subtle slate gray', hex: '#94A3B8', textCol: '#FFFFFF' },
        { name: 'Border', role: 'Polished marine stroke', hex: '#1E2D56', textCol: '#FFFFFF' },
      ],
    },
  ];

  return (
    <div className="w-full bg-[#070a10] text-slate-100 min-h-screen pb-24">
      {/* Design Lab Top Bar Header */}
      <section className="border-b border-slate-800 bg-[#0a0f18] py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400">
                <Palette className="w-4 h-4" />
                <span>Creative Direction Workshop</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400 font-sans normal-case">Temporary Route: /design-lab</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white font-display tracking-tight">
                Startup Conclave 1.0 — Design Lab
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
                Explore three radically distinct visual identities built specifically for the conclave brief. 
                Each direction presents a complete design system: color tokens, typography specimen, corner philosophy, interactive button states, a sample card, and a live mini-hero.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0 self-start md:self-end">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'all'
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Compare All 3
              </button>
              <button
                onClick={() => setActiveTab('electric')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'electric'
                    ? 'bg-[#D4FF00] text-black font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                A: Electric
              </button>
              <button
                onClick={() => setActiveTab('editorial')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'editorial'
                    ? 'bg-[#FBF9F5] text-black font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                B: Editorial
              </button>
              <button
                onClick={() => setActiveTab('capital')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'capital'
                    ? 'bg-[#E5A93C] text-black font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                C: Capital
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Showcase Container */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 space-y-20">

        {/* ========================================================================= */}
        {/* DIRECTION A: ELECTRIC DARK */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'electric') && (
          <section id="direction-electric" className="space-y-8 scroll-mt-20">
            {/* Header / Vibe Banner */}
            <div className="border-b border-[#1E2638] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#D4FF00] tracking-widest uppercase mb-1">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>DIRECTION 01 // HIGH-CONTRAST TECH</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  A) "Electric Dark"
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  {directions[0].tagline} {directions[0].vibe}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="px-2.5 py-1 bg-[#11151F] border border-[#1E2638] text-[#D4FF00]">
                  RADIUS: 0PX (SHARP)
                </span>
                <span className="px-2.5 py-1 bg-[#11151F] border border-[#1E2638] text-white">
                  TYPE: SPACE GROTESK + JAKARTA
                </span>
              </div>
            </div>

            {/* Specimen Box: Palette + Typography + Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#080A0E] border border-[#1E2638] p-6">
              
              {/* Palette Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2638] pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4FF00] font-semibold">
                    01. Color Palette System
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">Click swatch to copy hex</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {directions[0].swatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      onClick={() => copyToClipboard(swatch.hex)}
                      className="group text-left p-3 border border-[#1E2638] bg-[#11151F] hover:border-[#D4FF00] transition-colors relative"
                    >
                      <div
                        className="w-full h-8 border border-white/10 mb-2 flex items-center justify-end px-2"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {copiedHex === swatch.hex && (
                          <span className="text-[10px] font-mono px-1 bg-black text-[#D4FF00]">COPIED</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white tracking-tight">{swatch.name}</div>
                      <div className="text-[11px] font-mono text-[#D4FF00] group-hover:underline flex items-center justify-between mt-0.5">
                        <span>{swatch.hex}</span>
                        <Copy className="w-3 h-3 text-slate-500 group-hover:text-[#D4FF00]" />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-tight">{swatch.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography & Geometry Column */}
              <div className="lg:col-span-6 space-y-5 lg:border-l lg:border-[#1E2638] lg:pl-6">
                <div className="border-b border-[#1E2638] pb-2">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#D4FF00] font-semibold">
                    02. Type Specimen & Geometry
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">
                      Display Heading: Space Grotesk Bold 700 (-0.03em tracking)
                    </span>
                    <p
                      className="text-2xl font-bold text-white tracking-tight mt-1"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      BUILD. CONNECT. PITCH. SCALE.
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] font-mono text-slate-400 block uppercase">
                      Body Typography: Plus Jakarta Sans Regular 400
                    </span>
                    <p
                      className="text-xs text-slate-300 leading-relaxed mt-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      Where Ideas Meet Capital. A 2-day in-person startup, entrepreneurship and innovation conclave at Dewan V.S. Institute of Engineering & Technology (DVSIET), Meerut.
                    </p>
                  </div>
                </div>

                {/* Button States */}
                <div className="pt-2 border-t border-[#1E2638] space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    Interactive Button Styles (Sharp 0px Geometry)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="px-5 py-2.5 bg-[#D4FF00] text-black font-mono font-bold text-xs uppercase tracking-wider border border-[#D4FF00] hover:bg-black hover:text-[#D4FF00] transition-colors"
                    >
                      Primary Action // Register
                    </button>
                    <button
                      className="px-5 py-2.5 bg-transparent text-white font-mono text-xs uppercase tracking-wider border border-[#1E2638] hover:border-[#D4FF00] hover:text-[#D4FF00] transition-colors"
                    >
                      Secondary Outline
                    </button>
                    <button
                      className="px-4 py-2.5 bg-[#00F0FF]/10 text-[#00F0FF] font-mono text-xs uppercase tracking-wider border border-[#00F0FF]/40 hover:bg-[#00F0FF]/20 transition-colors"
                    >
                      Status / Cyan Tag
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Mini Hero Preview: Electric Dark */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Mini Hero & Sample Card Simulation: "Electric Dark"
              </span>

              <div
                className="w-full bg-[#080A0E] border-2 border-[#1E2638] p-6 sm:p-10 relative overflow-hidden"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {/* Tech grid texture */}
                <div
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(#D4FF00 1px, transparent 1px), linear-gradient(to right, #D4FF00 1px, transparent 1px)`,
                    backgroundSize: '36px 36px',
                  }}
                  aria-hidden="true"
                />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Hero Left */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#11151F] border border-[#1E2638] text-[11px] font-mono text-[#D4FF00]">
                      <span className="w-1.5 h-1.5 bg-[#D4FF00]" />
                      <span>DVSIET MEERUT // 2-DAY IN-PERSON CONCLAVE</span>
                    </div>

                    <h3
                      className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.05]"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      WHERE IDEAS MEET <span className="text-[#D4FF00]">CAPITAL</span>.
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                      Bridging 300–500+ student developers, high-conviction founders, and seed capital allocators. Zero fluff, pure engineering and market velocity.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button className="px-6 py-3 bg-[#D4FF00] text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors">
                        Register Attendee Pass
                      </button>
                      <button className="px-6 py-3 bg-transparent text-white font-mono text-xs uppercase tracking-wider border border-[#1E2638] hover:border-[#D4FF00] transition-colors">
                        Explore Pitch Arena
                      </button>
                    </div>

                    <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-400">
                      <span>STATUS: DATES ANNOUNCING SOON</span>
                      <span>·</span>
                      <span>FEES: TO BE ANNOUNCED</span>
                    </div>
                  </div>

                  {/* Sample Card Right */}
                  <div className="lg:col-span-5">
                    <div className="bg-[#11151F] border border-[#1E2638] p-5 space-y-4 relative">
                      <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
                        <span className="text-[11px] font-mono text-[#00F0FF] uppercase tracking-wider">
                          // ARENA-01 TRACK
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">STAGE 01</span>
                      </div>

                      <div className="space-y-1">
                        <h4
                          className="text-lg font-bold text-white"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          Pitch Arena 1.0 Application
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Vetted startup round before active venture partners and angel networks. 5-minute pitch + 3-minute hard Q&A.
                        </p>
                      </div>

                      <div className="p-3 bg-[#080A0E] border border-[#1E2638] text-xs font-mono space-y-1">
                        <div className="text-slate-400">PRIZE POOL & GRANTS:</div>
                        <div className="text-[#D4FF00] font-bold">To be announced</div>
                      </div>

                      <button className="w-full py-2.5 bg-[#1E2638] text-white hover:bg-[#D4FF00] hover:text-black font-mono text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5">
                        <span>Pre-register Startup</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


        {/* ========================================================================= */}
        {/* DIRECTION B: EDITORIAL LIGHT */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'editorial') && (
          <section id="direction-editorial" className="space-y-8 scroll-mt-20">
            {/* Header / Vibe Banner */}
            <div className="border-b border-slate-800 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E8590C] tracking-widest uppercase mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>DIRECTION 02 // SOPHISTICATED EDITORIAL</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight font-display">
                  B) "Editorial Light"
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  {directions[1].tagline} {directions[1].vibe}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-[#E8590C] font-medium">
                  RADIUS: 2–4PX (SUBTLE TRIM)
                </span>
                <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-white font-medium">
                  TYPE: FRAUNCES (SERIF) + JAKARTA
                </span>
              </div>
            </div>

            {/* Specimen Box: Palette + Typography + Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#FBF9F5] text-[#18181B] border border-[#E4E0D7] p-6 rounded-sm">
              
              {/* Palette Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E4E0D7] pb-2">
                  <span className="text-xs uppercase tracking-wider text-[#E8590C] font-bold">
                    01. Color Palette System
                  </span>
                  <span className="text-[11px] text-slate-500">Click swatch to copy hex</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {directions[1].swatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      onClick={() => copyToClipboard(swatch.hex)}
                      className="group text-left p-3 border border-[#E4E0D7] bg-white hover:border-[#E8590C] transition-colors rounded-xs shadow-xs"
                    >
                      <div
                        className="w-full h-8 border border-black/10 mb-2 flex items-center justify-end px-2"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {copiedHex === swatch.hex && (
                          <span className="text-[10px] font-mono px-1 bg-black text-white">COPIED</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-[#18181B] tracking-tight">{swatch.name}</div>
                      <div className="text-[11px] font-mono text-[#E8590C] group-hover:underline flex items-center justify-between mt-0.5">
                        <span>{swatch.hex}</span>
                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#E8590C]" />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1 leading-tight">{swatch.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography & Geometry Column */}
              <div className="lg:col-span-6 space-y-5 lg:border-l lg:border-[#E4E0D7] lg:pl-6">
                <div className="border-b border-[#E4E0D7] pb-2">
                  <span className="text-xs uppercase tracking-wider text-[#E8590C] font-bold">
                    02. Type Specimen & Geometry
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">
                      Display Heading: Fraunces 700 with Editorial Flourish
                    </span>
                    <p
                      className="text-2xl font-bold text-[#18181B] tracking-tight mt-1 leading-tight"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      Where Ideas Meet Capital. <em className="font-normal italic">Where Innovation Meets Opportunity.</em>
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block uppercase font-medium">
                      Body Typography: Plus Jakarta Sans Regular 400 (Clean Contrast)
                    </span>
                    <p
                      className="text-xs text-slate-700 leading-relaxed mt-1"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                      A two-day startup, entrepreneurship and innovation conclave bringing together students, founders, investors, mentors and industry leaders at Dewan V.S. Institute of Engineering & Technology.
                    </p>
                  </div>
                </div>

                {/* Button States */}
                <div className="pt-2 border-t border-[#E4E0D7] space-y-2">
                  <span className="text-[11px] text-slate-500 block uppercase font-medium">
                    Interactive Button Styles (Paper Trim Radius)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="px-5 py-2.5 bg-[#18181B] text-[#FBF9F5] font-semibold text-xs rounded-xs hover:bg-[#E8590C] transition-colors"
                    >
                      Register for Conclave
                    </button>
                    <button
                      className="px-5 py-2.5 bg-transparent text-[#18181B] font-semibold text-xs border border-[#18181B] rounded-xs hover:border-[#E8590C] hover:text-[#E8590C] transition-colors"
                    >
                      View 2-Day Schedule
                    </button>
                    <button
                      className="px-4 py-2.5 bg-[#E8590C]/10 text-[#E8590C] font-medium text-xs rounded-xs hover:bg-[#E8590C]/20 transition-colors"
                    >
                      Sponsorship Prospectus
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Mini Hero Preview: Editorial Light */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Mini Hero & Sample Card Simulation: "Editorial Light"
              </span>

              <div
                className="w-full bg-[#FBF9F5] text-[#18181B] border border-[#E4E0D7] p-6 sm:p-12 relative overflow-hidden rounded-xs"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Hero Left */}
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#E8590C] uppercase tracking-wider">
                      <span>DEWAN V.S. INSTITUTE</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-normal">MEERUT, UTTAR PRADESH</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-600 font-normal">EDITION 1.0</span>
                    </div>

                    <h3
                      className="text-4xl sm:text-5xl font-bold text-[#18181B] tracking-tight leading-[1.12]"
                      style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                    >
                      Catalyzing the next generation of <span className="italic font-normal text-[#E8590C]">regional builders</span>.
                    </h3>

                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
                      A two-day congregation bringing capital networks, technical innovators, and student founders onto one shared campus stage at DVSIET.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button className="px-6 py-3 bg-[#18181B] text-[#FBF9F5] font-semibold text-xs rounded-xs hover:bg-[#E8590C] transition-colors">
                        Reserve Attendee Pass
                      </button>
                      <button className="px-6 py-3 bg-white text-[#18181B] font-semibold text-xs border border-[#E4E0D7] rounded-xs hover:border-[#18181B] transition-colors">
                        Pitch Arena Guidelines
                      </button>
                    </div>

                    <div className="pt-2 flex items-center gap-4 text-xs text-slate-500">
                      <span>Dates announcing soon</span>
                      <span>·</span>
                      <span>Targeting 300–500+ attendees</span>
                    </div>
                  </div>

                  {/* Sample Card Right */}
                  <div className="lg:col-span-5">
                    <div className="bg-white border border-[#E4E0D7] p-6 space-y-4 rounded-xs shadow-sm">
                      <div className="border-b border-[#E4E0D7] pb-3">
                        <span className="text-[11px] uppercase tracking-widest text-[#E8590C] font-semibold">
                          CURATED EXHIBITION
                        </span>
                        <h4
                          className="text-xl font-bold text-[#18181B] mt-1"
                          style={{ fontFamily: "'Fraunces', Georgia, serif" }}
                        >
                          Startup Showcase 1.0
                        </h4>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        Dedicated physical booth corridors for student-led ventures and early prototypes to demo live before investors, mentors, and delegates.
                      </p>

                      <div className="p-3 bg-[#FBF9F5] border border-[#E4E0D7] rounded-xs space-y-1 text-xs">
                        <div className="font-semibold text-[#18181B]">Status: Applications Opening Soon</div>
                        <div className="text-slate-500 text-[11px]">Working prototype required · 2-day on-campus presence</div>
                      </div>

                      <button className="w-full py-2.5 bg-[#18181B] text-white hover:bg-[#E8590C] font-semibold text-xs rounded-xs transition-colors flex items-center justify-center gap-1.5">
                        <span>Showcase Submission Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}


        {/* ========================================================================= */}
        {/* DIRECTION C: CAPITAL NAVY */}
        {/* ========================================================================= */}
        {(activeTab === 'all' || activeTab === 'capital') && (
          <section id="direction-capital" className="space-y-8 scroll-mt-20">
            {/* Header / Vibe Banner */}
            <div className="border-b border-[#1E2D56] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E5A93C] tracking-widest uppercase mb-1">
                  <Building className="w-3.5 h-3.5" />
                  <span>DIRECTION 03 // VENTURE & CAPITAL GRADE</span>
                </div>
                <h2 className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
                  C) "Capital Navy"
                </h2>
                <p className="text-sm text-slate-300 mt-1 max-w-2xl">
                  {directions[2].tagline} {directions[2].vibe}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="px-2.5 py-1 bg-[#131D3B] border border-[#1E2D56] text-[#E5A93C] rounded-md font-medium">
                  RADIUS: 12–16PX (ROUNDED-XL)
                </span>
                <span className="px-2.5 py-1 bg-[#131D3B] border border-[#1E2D56] text-white rounded-md font-medium">
                  TYPE: OUTFIT + DM SANS
                </span>
              </div>
            </div>

            {/* Specimen Box: Palette + Typography + Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0B132B] border border-[#1E2D56] p-6 rounded-xl">
              
              {/* Palette Column */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E2D56] pb-2">
                  <span className="text-xs uppercase tracking-wider text-[#E5A93C] font-bold">
                    01. Color Palette System
                  </span>
                  <span className="text-[11px] text-slate-400">Click swatch to copy hex</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {directions[2].swatches.map((swatch) => (
                    <button
                      key={swatch.hex}
                      onClick={() => copyToClipboard(swatch.hex)}
                      className="group text-left p-3 border border-[#1E2D56] bg-[#131D3B] hover:border-[#E5A93C] transition-colors rounded-lg shadow-sm"
                    >
                      <div
                        className="w-full h-8 border border-white/10 mb-2 rounded-md flex items-center justify-end px-2"
                        style={{ backgroundColor: swatch.hex }}
                      >
                        {copiedHex === swatch.hex && (
                          <span className="text-[10px] font-mono px-1 bg-black text-[#E5A93C] rounded">COPIED</span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-white tracking-tight">{swatch.name}</div>
                      <div className="text-[11px] font-mono text-[#E5A93C] group-hover:underline flex items-center justify-between mt-0.5">
                        <span>{swatch.hex}</span>
                        <Copy className="w-3 h-3 text-slate-400 group-hover:text-[#E5A93C]" />
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 leading-tight">{swatch.role}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Typography & Geometry Column */}
              <div className="lg:col-span-6 space-y-5 lg:border-l lg:border-[#1E2D56] lg:pl-6">
                <div className="border-b border-[#1E2D56] pb-2">
                  <span className="text-xs uppercase tracking-wider text-[#E5A93C] font-bold">
                    02. Type Specimen & Geometry
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase font-medium">
                      Display Heading: Outfit Bold 700 (Clean Modern Corporate)
                    </span>
                    <p
                      className="text-2xl font-bold text-white tracking-tight mt-1"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      WHERE IDEAS MEET CAPITAL.
                    </p>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block uppercase font-medium">
                      Body Typography: DM Sans Regular 400 (Humanist Polish)
                    </span>
                    <p
                      className="text-xs text-slate-300 leading-relaxed mt-1"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      A two-day in-person startup, entrepreneurship and innovation conclave at Dewan V.S. Institute of Engineering & Technology (DVSIET), Meerut. Bringing together students, founders, investors, mentors and industry leaders.
                    </p>
                  </div>
                </div>

                {/* Button States */}
                <div className="pt-2 border-t border-[#1E2D56] space-y-2">
                  <span className="text-[11px] text-slate-400 block uppercase font-medium">
                    Interactive Button Styles (Modern Rounded-XL Curves)
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      className="px-5 py-2.5 bg-[#E5A93C] text-[#0B132B] font-bold text-xs rounded-xl hover:bg-[#F3BA54] shadow-md shadow-[#E5A93C]/10 transition-all active:scale-[0.98]"
                    >
                      Register Delegate
                    </button>
                    <button
                      className="px-5 py-2.5 bg-[#131D3B] text-white font-medium text-xs border border-[#1E2D56] rounded-xl hover:border-[#E5A93C] hover:text-[#E5A93C] transition-colors"
                    >
                      Investor Delegation
                    </button>
                    <button
                      className="px-4 py-2.5 bg-blue-500/10 text-blue-400 font-medium text-xs border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors"
                    >
                      Ecosystem Partner
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Mini Hero Preview: Capital Navy */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Mini Hero & Sample Card Simulation: "Capital Navy"
              </span>

              <div
                className="w-full bg-[#0B132B] border border-[#1E2D56] p-6 sm:p-10 relative overflow-hidden rounded-xl shadow-2xl"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {/* Subtle radial glow */}
                <div
                  className="absolute -top-24 -right-24 w-96 h-96 bg-[#E5A93C]/5 rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />
                <div
                  className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"
                  aria-hidden="true"
                />

                <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  {/* Hero Left */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#131D3B] border border-[#1E2D56] rounded-full text-xs font-medium text-[#E5A93C]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
                      <span>DVSIET Meerut · 2-Day In-Person Conclave</span>
                    </div>

                    <h3
                      className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.1]"
                      style={{ fontFamily: "'Outfit', sans-serif" }}
                    >
                      Where Ideas Meet <span className="text-[#E5A93C]">Capital</span>. Where Innovation Meets Opportunity.
                    </h3>

                    <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                      A high-trust gathering engineered to connect Western UP's rising student founders, academic researchers, and institutional capital allocators.
                    </p>

                    <div className="pt-2 flex flex-wrap items-center gap-3">
                      <button className="px-6 py-3 bg-[#E5A93C] text-[#0B132B] font-bold text-xs rounded-xl hover:bg-[#F3BA54] shadow-md shadow-[#E5A93C]/20 transition-all">
                        Register Attendee Pass
                      </button>
                      <button className="px-6 py-3 bg-[#131D3B] text-white font-medium text-xs border border-[#1E2D56] rounded-xl hover:border-slate-500 transition-colors">
                        Partner Inquiries
                      </button>
                    </div>

                    <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                      <span>Official dates announcing soon</span>
                      <span>·</span>
                      <span>Aiming for 300–500+ attendees</span>
                    </div>
                  </div>

                  {/* Sample Card Right */}
                  <div className="lg:col-span-5">
                    <div className="bg-[#131D3B] border border-[#1E2D56] p-6 space-y-4 rounded-xl shadow-lg">
                      <div className="flex items-center justify-between border-b border-[#1E2D56] pb-3">
                        <span className="text-xs font-semibold text-[#E5A93C] uppercase tracking-wider">
                          VENTURE JURY
                        </span>
                        <span className="text-xs text-slate-400">Under Finalization</span>
                      </div>

                      <div className="space-y-1">
                        <h4
                          className="text-xl font-bold text-white"
                          style={{ fontFamily: "'Outfit', sans-serif" }}
                        >
                          Investors & Jury: Coming Soon
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Accredited angel networks, seed funds, and regional incubation leadership participating as evaluators and keynote guests.
                        </p>
                      </div>

                      <div className="p-3 bg-[#0B132B] border border-[#1E2D56] rounded-lg text-xs space-y-1">
                        <div className="text-slate-400">CONFIDENTIAL CURATION:</div>
                        <div className="text-white font-medium">Profiles revealed prior to pitch shortlisting</div>
                      </div>

                      <button className="w-full py-2.5 bg-[#E5A93C] text-[#0B132B] hover:bg-[#F3BA54] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm">
                        <span>Investor Delegation Inquiries</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Comparison Summary Table */}
        <section className="border-t border-slate-800 pt-10 space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-400" />
            <h3 className="text-xl font-bold text-white font-display">Side-by-Side Architectural Summary</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-800 bg-[#0c121d] rounded-lg">
              <thead className="border-b border-slate-800 bg-slate-900/60 text-slate-300 font-semibold uppercase">
                <tr>
                  <th className="p-3">Attribute</th>
                  <th className="p-3 text-[#D4FF00]">A) Electric Dark</th>
                  <th className="p-3 text-[#E8590C]">B) Editorial Light</th>
                  <th className="p-3 text-[#E5A93C]">C) Capital Navy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-white">Dominant Canvas</td>
                  <td className="p-3 font-mono">#080A0E (Near-black)</td>
                  <td className="p-3 font-mono">#FBF9F5 (Warm off-white)</td>
                  <td className="p-3 font-mono">#0B132B (Deep navy)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Hero Accent</td>
                  <td className="p-3 font-mono text-[#D4FF00]">#D4FF00 (Electric Lime)</td>
                  <td className="p-3 font-mono text-[#E8590C]">#E8590C (Terracotta Coral)</td>
                  <td className="p-3 font-mono text-[#E5A93C]">#E5A93C (Refined Gold)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Heading Font</td>
                  <td className="p-3">Space Grotesk 700</td>
                  <td className="p-3">Fraunces 700 (Serif)</td>
                  <td className="p-3">Outfit 700</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Body Font</td>
                  <td className="p-3">Plus Jakarta Sans</td>
                  <td className="p-3">Plus Jakarta Sans</td>
                  <td className="p-3">DM Sans</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Corner Geometry</td>
                  <td className="p-3 font-mono">0px (Sharp edges)</td>
                  <td className="p-3 font-mono">2px–4px (Paper trim)</td>
                  <td className="p-3 font-mono">12px–16px (Rounded-XL)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-white">Best Suited For</td>
                  <td className="p-3">Hackathons, developers, fast-paced technical energy</td>
                  <td className="p-3">Thought leadership, institutional prestige, editorial rigor</td>
                  <td className="p-3">Venture capital, executive credibility, enterprise sponsors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};
