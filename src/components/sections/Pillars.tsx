import React from 'react';
import { Hammer, Users, Presentation, TrendingUp } from 'lucide-react';
import { EVENT_DATA } from '../../data/content.ts';

export interface PillarsProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  className?: string;
}

export const Pillars: React.FC<PillarsProps> = ({
  title = "The Four Conclave Pillars",
  eyebrow = "CORE FOUNDATION",
  description = "Four interconnected action areas engineered to take early ideas from zero to sustainable market scale.",
  className = "",
}) => {
  const pillarDetails = [
    {
      num: "01",
      title: "BUILD",
      icon: <Hammer className="w-5 h-5 text-[#E8590C]" />,
      summary: "Product Engineering & Toolkits",
      desc: "Equipping student makers, engineers, and technical builders with practical toolkits, frameworks, and architecture blueprints to build defensible products from scratch.",
    },
    {
      num: "02",
      title: "CONNECT",
      icon: <Users className="w-5 h-5 text-[#E8590C]" />,
      summary: "High-Density Peer & Mentor Networks",
      desc: "Fostering authentic, unhurried connections between aspiring founders, veteran operators, technical co-founders, and regional policy champions.",
    },
    {
      num: "03",
      title: "PITCH",
      icon: <Presentation className="w-5 h-5 text-[#E8590C]" />,
      summary: "Rigorous Venture Mainstage",
      desc: "A competitive live arena where shortlisted early-stage startups showcase unit economics, user traction, and business viability before an accredited venture jury.",
    },
    {
      num: "04",
      title: "SCALE",
      icon: <TrendingUp className="w-5 h-5 text-[#E8590C]" />,
      summary: "Go-to-Market & Capital Syndication",
      desc: "Deep-dive workshops focused on early revenue mechanics, regulatory navigation, customer acquisition economics, and institutional seed syndication.",
    },
  ];

  return (
    <div className={`space-y-6 text-left ${className}`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E4E0D7]">
        <div className="space-y-1">
          <div className="type-eyebrow text-[#E8590C]">
            {eyebrow}
          </div>
          <h2 className="type-h2 text-[#18181B] font-display">
            {title}
          </h2>
          {description && (
            <p className="type-body text-[#52525B] max-w-2xl">
              {description}
            </p>
          )}
        </div>
        <div className="text-xs font-mono text-[#71717A] shrink-0">
          BUILD · CONNECT · PITCH · SCALE
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {pillarDetails.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 space-y-3.5 shadow-xs flex flex-col justify-between hover:border-[#18181B] transition-colors text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#E8590C]">
                  {pillar.num}
                </span>
                <div className="w-8 h-8 rounded-[2px] bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-center">
                  {pillar.icon}
                </div>
              </div>

              <div>
                <h3 className="type-h3 text-[#18181B] font-display">
                  {pillar.title}
                </h3>
                <span className="text-xs font-semibold text-[#71717A] font-sans block mt-0.5">
                  {pillar.summary}
                </span>
              </div>

              <p className="text-xs text-[#52525B] leading-relaxed font-sans">
                {pillar.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-[#EFECE6] text-[11px] font-mono text-[#71717A]">
              Edition 1.0 Track
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
