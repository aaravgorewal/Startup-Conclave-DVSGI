import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HelpCircle,
  Search,
  ChevronDown,
  X,
  Link as LinkIcon,
  Check,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { Button } from '../components/ui/Button.tsx';
import { FAQS, FaqItem, FaqCategory, EVENT_DATA } from '../data/content.ts';

const CATEGORIES: (string | FaqCategory)[] = [
  'All',
  'General',
  'Registration',
  'Pitch Arena',
  'Sponsors',
  'Venue & Logistics',
];

export const FaqPage: React.FC = () => {
  const location = useLocation();

  // Search & Category State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Expanded Accordion IDs state
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check URL hash for deep-linkable anchors (e.g. #registration-fee)
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const match = FAQS.find((f) => f.id === hash);
      if (match) {
        // Expand item and select its category if filtered
        setOpenIds((prev) => ({ ...prev, [hash]: true }));
        setSelectedCategory('All');

        // Scroll to the anchor with slight delay for render
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 150);
      }
    } else {
      // By default open the first 2 questions for immediate reading
      setOpenIds({
        'who-can-attend': true,
        'registration-fee': true,
      });
    }
  }, [location.hash]);

  // Toggle single accordion item
  const toggleAccordion = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy deep-link to clipboard
  const copyDeepLink = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/faq#${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered FAQs
  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === 'All' || faq.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Get count per category
  const getCategoryCount = (cat: string) => {
    if (cat === 'All') return FAQS.length;
    return FAQS.filter((f) => f.category === cat).length;
  };

  return (
    <PageShell
      title="Frequently Asked Questions"
      kicker="HELP DESK & CONCLAVE ESSENTIALS"
      statusBadge="15 Answers Available"
      description="Clear, transparent answers regarding registration, pitch arena eligibility, logistics, and sponsorships at Startup Conclave 1.0 (DVSIET Meerut)."
    >
      <div className="space-y-12 max-w-4xl mx-auto text-left">
        
        {/* =================================================================== */}
        {/* 1. SEARCH INPUT & CATEGORY FILTER TABS                              */}
        {/* =================================================================== */}
        <div className="space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <label htmlFor="faq-search-input" className="sr-only">
              Search frequently asked questions
            </label>
            <input
              id="faq-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions by keyword (e.g., fee, prototype, food, dates)..."
              className="w-full rounded-[3px] border border-[#E4E0D7] bg-white pl-10 pr-10 py-3 text-xs sm:text-sm text-[#18181B] placeholder:text-[#A1A1AA] shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C]"
            />
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3.5 pointer-events-none" />

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#71717A] hover:text-[#18181B] p-0.5 rounded focus-visible:outline-none"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#E4E0D7] pb-3">
            <span className="text-[11px] font-semibold uppercase text-[#71717A] shrink-0 mr-1 hidden sm:inline">
              Category:
            </span>
            {CATEGORIES.map((cat) => {
              const count = getCategoryCount(cat);
              const isActive = selectedCategory === cat;
              return (
                <Chip
                  key={cat}
                  active={isActive}
                  onClick={() => setSelectedCategory(cat)}
                  count={count}
                  className="shrink-0"
                >
                  {cat}
                </Chip>
              );
            })}
          </div>

          {/* Results count banner if searching */}
          {searchQuery && (
            <div className="flex items-center justify-between text-xs text-[#71717A] pt-1">
              <span>
                Found <strong>{filteredFaqs.length}</strong> matching questions for "{searchQuery}"
              </span>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-[#E8590C] hover:underline font-semibold"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 2. ACCESSIBLE ACCORDION WITH DEEP-LINKABLE ANCHORS                 */}
        {/* =================================================================== */}
        <div className="space-y-3.5">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            const isCopied = copiedId === faq.id;

            return (
              <div
                key={faq.id}
                id={faq.id}
                className={`rounded-[3px] border transition-all duration-200 scroll-mt-24 ${
                  isOpen
                    ? 'border-[#18181B] bg-white shadow-paper'
                    : 'border-[#E4E0D7] bg-white hover:border-[#A1A1AA] shadow-2xs'
                }`}
              >
                {/* Accordion Trigger Header */}
                <button
                  type="button"
                  id={`faq-question-${faq.id}`}
                  onClick={() => toggleAccordion(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${faq.id}`}
                  className="w-full p-4 sm:p-5 flex items-start justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E8590C] rounded-[2px]"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#E8590C]">
                        {faq.category}
                      </span>
                      <span className="text-[#E4E0D7]">·</span>
                      <span className="text-[10px] font-mono text-[#A1A1AA]">
                        #{faq.id}
                      </span>
                    </div>

                    <h3 className="type-h4 text-[#18181B] font-display">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 mt-1">
                    {/* Deep-link copy button */}
                    <button
                      type="button"
                      onClick={(e) => copyDeepLink(faq.id, e)}
                      title="Copy link to this answer"
                      className="p-1 text-[#A1A1AA] hover:text-[#18181B] rounded transition-colors"
                      aria-label={`Copy link to question: ${faq.question}`}
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <LinkIcon className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div
                      className={`w-6 h-6 rounded-[2px] border border-[#E4E0D7] flex items-center justify-center text-[#18181B] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 bg-[#F4F1EA]' : 'bg-white'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </button>

                {/* Accordion Expandable Answer Body */}
                {isOpen && (
                  <div
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                    className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-[#52525B] leading-relaxed border-t border-[#EFECE6] font-sans space-y-2.5 animate-in fade-in duration-150"
                  >
                    <p>{faq.answer}</p>
                    
                    {/* Deep link indicator feedback */}
                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#71717A]">
                      <span className="text-[10px]">Reference Anchor: #{faq.id}</span>
                      <button
                        type="button"
                        onClick={(e) => copyDeepLink(faq.id, e)}
                        className="text-[#E8590C] hover:underline font-semibold flex items-center gap-1"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Link copied!</span>
                          </>
                        ) : (
                          <>
                            <LinkIcon className="w-3 h-3" />
                            <span>Share direct answer link</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty state when no FAQs match search */}
        {filteredFaqs.length === 0 && (
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-10 text-center space-y-3 shadow-xs">
            <HelpCircle className="w-8 h-8 text-[#A1A1AA] mx-auto" />
            <h3 className="type-h4 text-[#18181B] font-display">No matching questions found</h3>
            <p className="text-xs text-[#71717A] max-w-sm mx-auto">
              We couldn't find any questions matching "{searchQuery}". Try broader keywords or contact the secretariat.
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              View All 15 Questions
            </Button>
          </div>
        )}

        {/* =================================================================== */}
        {/* 3. STILL HAVE QUESTIONS? CALLOUT CTA                                */}
        {/* =================================================================== */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 max-w-xl">
            <span className="type-eyebrow text-[#E8590C]">SECRETARIAT ASSISTANCE</span>
            <h3 className="type-h3 text-[#18181B] font-display">
              Still Have Questions?
            </h3>
            <p className="type-body text-[#52525B] text-xs sm:text-sm">
              Our organizing committee and student coordinators are on standby to answer queries about college passes, group delegations, and campus directions.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link to="/contact">
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

      </div>
    </PageShell>
  );
};
