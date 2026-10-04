import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Car,
  Train,
  Plane,
  Building,
  Utensils,
  Hotel,
  ShieldCheck,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { PageShell } from '../components/ui/PageShell.tsx';
import { StatusBadge } from '../components/ui/StatusBadge.tsx';
import { Button } from '../components/ui/Button.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { EVENT_DATA } from '../data/content.ts';

export const VenuePage: React.FC = () => {
  // Transit Tabs State ('road' | 'rail' | 'air')
  const [activeTab, setActiveTab] = useState<'road' | 'rail' | 'air'>('road');

  // Direct Google Maps search / directions URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=Dewan+V.S.+Institute+of+Engineering+%26+Technology+Meerut+Uttar+Pradesh`;
  const googleMapsViewUrl = `https://www.google.com/maps/search/?api=1&query=Dewan+V.S.+Institute+of+Engineering+%26+Technology+NH-58+Partapur+Meerut`;

  return (
    <PageShell
      title="Venue & Campus Travel Guide"
      kicker="HOST CAMPUS · MEERUT, UTTAR PRADESH"
      statusBadge="In-Person Campus Venue"
      description="Hosted at Dewan V.S. Institute of Engineering & Technology (DVSIET), situated along the high-speed Delhi-Meerut Expressway corridor."
    >
      <div className="space-y-16 max-w-6xl mx-auto text-left">
        
        {/* =================================================================== */}
        {/* 1. ADDRESS BLOCK & ACTION HERO                                      */}
        {/* =================================================================== */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-10 shadow-paper space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E4E0D7]">
            <div className="space-y-2 max-w-2xl">
              <div className="type-eyebrow text-[#E8590C] flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>OFFICIAL CONCLAVE VENUE</span>
              </div>
              <h1 className="type-h2 text-[#18181B] font-display">
                Dewan V.S. Institute of Engineering & Technology (DVSIET)
              </h1>
              <p className="text-xs sm:text-sm text-[#52525B] font-sans leading-relaxed">
                By-Pass Road, Partapur, Meerut, Uttar Pradesh 250103, India.
              </p>
            </div>

            {/* [Get Directions] Primary Action Button */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<Navigation className="w-4 h-4" />}
                >
                  Get Directions
                </Button>
              </a>

              <a
                href={googleMapsViewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ExternalLink className="w-4 h-4 text-[#71717A]" />}
                >
                  Open in Maps
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Landmark & Geographic Markers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-sans">
            <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                Primary Highway
              </span>
              <span className="font-semibold text-[#18181B] block">
                Delhi-Meerut Expressway (NE-3) / NH-58
              </span>
            </div>

            <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                Nearest Rapid Rail
              </span>
              <span className="font-semibold text-[#18181B] block">
                Namo Bharat RRTS (Partapur / Meerut South)
              </span>
            </div>

            <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                Local Landmark
              </span>
              <span className="font-semibold text-[#18181B] block">
                Near Partapur Bypass Flyover
              </span>
            </div>

            <div className="p-3.5 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1">
              <span className="text-[10px] font-mono text-[#71717A] uppercase tracking-wider block">
                Campus Pedigree
              </span>
              <span className="font-semibold text-[#E8590C] block">
                Dewan VS Group of Institutions
              </span>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. EMBEDDED GOOGLE MAPS IFRAME AREA                                 */}
        {/* =================================================================== */}
        <div className="space-y-4">
          <div className="border-b border-[#E4E0D7] pb-3 flex items-center justify-between">
            <div>
              <span className="type-eyebrow text-[#E8590C]">INTERACTIVE CAMPUS MAP</span>
              <h2 className="type-h3 text-[#18181B] font-display">Campus Location & Satellite View</h2>
            </div>
            <span className="text-xs font-mono text-[#71717A] hidden sm:inline">
              Partapur, Meerut · 250103
            </span>
          </div>

          {/* Map Frame Container with clean hairline border and fallback affordance */}
          <div className="relative w-full h-[360px] sm:h-[440px] rounded-[3px] border border-[#E4E0D7] overflow-hidden bg-[#F4F1EA] shadow-xs">
            <iframe
              title="Google Map location of DVSIET Meerut"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3489.924840890637!2d77.62534577546083!3d28.927909375505087!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c6600c3b0ebad%3A0x6bfe76e27ebbf2e6!2sDewan%20V.S.%20Institute%20of%20Engineering%20and%20Technology!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[15%] contrast-[1.05]"
            />

            {/* Direct overlay banner for quick launch */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm border border-[#E4E0D7] p-2.5 rounded-[2px] text-xs shadow-md hidden sm:flex items-center gap-3">
              <span className="font-semibold text-[#18181B]">DVSIET Campus Gate 1</span>
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E8590C] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Navigate</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 3. "HOW TO REACH" TABS (Road, Rail, Air) with TO BE VERIFIED tags    */}
        {/* =================================================================== */}
        <div className="space-y-6">
          <div className="border-b border-[#E4E0D7] pb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="type-eyebrow text-[#E8590C]">TRANSIT & COMMUTE</span>
              <h2 className="type-h2 text-[#18181B] font-display">How to Reach the Conclave</h2>
              <p className="type-body text-[#52525B] max-w-xl mt-0.5">
                Convenient connections across highway networks, regional rapid transit (RRTS), and railways.
              </p>
            </div>

            {/* Tab switchers */}
            <div
              role="tablist"
              aria-label="Transit Mode Selector"
              className="inline-flex rounded-[3px] border border-[#E4E0D7] bg-white p-1 shadow-xs"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'road'}
                onClick={() => setActiveTab('road')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] text-xs font-semibold font-sans transition-all focus-visible:outline-none min-h-[38px] ${
                  activeTab === 'road'
                    ? 'bg-[#18181B] text-[#FBF9F5]'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA]'
                }`}
              >
                <Car className="w-3.5 h-3.5" />
                <span>By Road</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'rail'}
                onClick={() => setActiveTab('rail')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] text-xs font-semibold font-sans transition-all focus-visible:outline-none min-h-[38px] ${
                  activeTab === 'rail'
                    ? 'bg-[#18181B] text-[#FBF9F5]'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA]'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>By Rail / RRTS</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'air'}
                onClick={() => setActiveTab('air')}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-[2px] text-xs font-semibold font-sans transition-all focus-visible:outline-none min-h-[38px] ${
                  activeTab === 'air'
                    ? 'bg-[#18181B] text-[#FBF9F5]'
                    : 'text-[#52525B] hover:text-[#18181B] hover:bg-[#F4F1EA]'
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>By Air</span>
              </button>
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 shadow-xs space-y-6">
            
            {/* Tab 1: By Road */}
            {activeTab === 'road' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                  <div className="flex items-center gap-2">
                    <Car className="w-5 h-5 text-[#E8590C]" />
                    <h3 className="type-h3 text-[#18181B] font-display">Road Transit & Driving Route</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                    Notice: Travel times to be verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#52525B] font-sans">
                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">From Delhi / NCR via Expressway</span>
                    <p className="leading-relaxed">
                      Take the Delhi-Meerut Expressway (NE-3) from Akshardham / Sarai Kale Khan. Continue toward the Partapur interchange. Travel time approximately 45–60 minutes depending on departure time.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Distance: ~55 km from East Delhi
                    </span>
                  </div>

                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">From Noida / Ghaziabad</span>
                    <p className="leading-relaxed">
                      Access via NH-9 / DME connection at Vijay Nagar or Indirapuram. Follow signs to Meerut Bypass at Partapur.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Distance: ~45 km from Ghaziabad
                    </span>
                  </div>

                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">Intercity Buses & Cabs</span>
                    <p className="leading-relaxed">
                      UPSRTC buses run continuously from ISBT Anand Vihar and Kashmere Gate to Meerut. Local auto-rickshaws and app cabs operate regularly at the Partapur bypass.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Disembarkation: Partapur Bypass Stop
                    </span>
                  </div>
                </div>

                {/* To be verified banner */}
                <div className="p-3.5 rounded-[2px] border border-[#FED7AA] bg-[#FFF7ED] text-xs text-[#9A3412] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Guidance (To be verified):</strong> Toll plaza congestion and peak morning rush on NH-58 may vary during conclave dates. Delegates driving private vehicles are advised to factor an extra 15–20 minutes.
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: By Rail / RRTS */}
            {activeTab === 'rail' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-[#E8590C]" />
                    <h3 className="type-h3 text-[#18181B] font-display">Rapid Rail (Namo Bharat) & Railway Stations</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                    Notice: RRTS schedules to be verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-[#52525B] font-sans">
                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">Namo Bharat (RRTS Rapid Rail)</span>
                    <p className="leading-relaxed">
                      High-speed regional rail connection operating between Sahibabad, Ghaziabad, and Meerut South / Partapur section. Fast, air-conditioned transit with trains every 10–15 minutes.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Nearest Station: Meerut South / Partapur
                    </span>
                  </div>

                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">Meerut City Station (MTC)</span>
                    <p className="leading-relaxed">
                      Main railway junction with regular daily express trains from New Delhi, Hazrat Nizamuddin, and Dehradun. Approximately 10–12 km from DVSIET campus via local taxi or auto.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Distance: ~10 km (20 min cab)
                    </span>
                  </div>

                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">Meerut Cantt Station (MUT)</span>
                    <p className="leading-relaxed">
                      Secondary railway terminal for northern intercity passenger trains. Approximately 14 km from the DVSIET Partapur campus.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Distance: ~14 km (25 min cab)
                    </span>
                  </div>
                </div>

                {/* To be verified banner */}
                <div className="p-3.5 rounded-[2px] border border-[#FED7AA] bg-[#FFF7ED] text-xs text-[#9A3412] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Guidance (To be verified):</strong> Rapid Rail (RRTS) feeder shuttle connections from Meerut South station directly to the DVSIET campus gate are being coordinated with local transport authorities. Confirm feeder frequency on arrival.
                  </span>
                </div>
              </div>
            )}

            {/* Tab 3: By Air */}
            {activeTab === 'air' && (
              <div className="space-y-5 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFECE6] pb-3">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-[#E8590C]" />
                    <h3 className="type-h3 text-[#18181B] font-display">Airport Connections</h3>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFF7ED] text-[#9A3412] border border-[#FED7AA]">
                    Notice: Transit duration to be verified
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-[#52525B] font-sans">
                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">
                      Indira Gandhi International Airport (DEL) — New Delhi
                    </span>
                    <p className="leading-relaxed">
                      Primary international and domestic flight gateway. Connected to DVSIET Meerut via the Delhi-Meerut Expressway. Pre-paid airport cabs, app taxis (Uber / Ola), or Airport Express Metro to Delhi rail links are readily available.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Distance: ~85 km (Approx. 90–110 min drive)
                    </span>
                  </div>

                  <div className="p-4 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] space-y-1.5">
                    <span className="font-bold text-[#18181B] block">
                      Hindon Airport (HDO) — Ghaziabad
                    </span>
                    <p className="leading-relaxed">
                      Regional domestic hub with select RCS-UDAN scheduled flights from regional cities. Located closer to Meerut along the expressway corridor.
                    </p>
                    <span className="text-[11px] font-mono text-[#71717A] block pt-1">
                      Distance: ~48 km (Approx. 50–60 min drive)
                    </span>
                  </div>
                </div>

                {/* To be verified banner */}
                <div className="p-3.5 rounded-[2px] border border-[#FED7AA] bg-[#FFF7ED] text-xs text-[#9A3412] flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Guidance (To be verified):</strong> Outstation delegates arriving at Delhi Airport are strongly encouraged to schedule flights arriving before 08:00 AM on Day 1 to comfortably arrive before the inauguration ceremony.
                  </span>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* =================================================================== */}
        {/* 4. STAY & FOOD SECTION                                              */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Accommodation / Stay Card */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#E4E0D7] pb-3">
              <Hotel className="w-5 h-5 text-[#E8590C]" />
              <h3 className="type-h3 text-[#18181B] font-display">Accommodation & Stay</h3>
            </div>

            <p className="text-xs text-[#52525B] leading-relaxed font-sans">
              Visiting delegates, speakers, and outstation attendees have access to multiple hospitality clusters across Meerut:
            </p>

            <ul className="text-xs space-y-3 text-[#52525B] font-sans">
              <li className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5]">
                <strong className="text-[#18181B] block">Partapur & Delhi Road Corridor (Within 2–5 km):</strong>
                <span>Business hotels and transit guest lodges located adjacent to the expressway exit.</span>
              </li>
              <li className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5]">
                <strong className="text-[#18181B] block">Meerut Cantt / City Center (Within 8–12 km):</strong>
                <span>Full-service star hotels, heritage boutique stays, and business accommodations.</span>
              </li>
            </ul>

            <div className="text-[11px] text-[#71717A] font-mono pt-1">
              * Conclave discounted hotel partner codes will be emailed to registered delegates.
            </div>
          </div>

          {/* Food & Dining Card */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#E4E0D7] pb-3">
              <Utensils className="w-5 h-5 text-[#E8590C]" />
              <h3 className="type-h3 text-[#18181B] font-display">Food & Campus Dining</h3>
            </div>

            <p className="text-xs text-[#52525B] leading-relaxed font-sans">
              Curated dining arrangements are organized on-campus for all registered pass holders across the conclave:
            </p>

            <ul className="text-xs space-y-3 text-[#52525B] font-sans">
              <li className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5]">
                <strong className="text-[#18181B] block">Day 1 & Day 2 Networking Luncheon:</strong>
                <span>Dedicated dining lawn serving vegetarian regional meals for delegates and founders.</span>
              </li>
              <li className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5]">
                <strong className="text-[#18181B] block">Atrium Tea & Refreshment Lounges:</strong>
                <span>Continuous tea, coffee, and water hydration stations open throughout session intervals.</span>
              </li>
            </ul>

            <div className="text-[11px] text-[#71717A] font-mono pt-1">
              * Dedicated VIP dining area reserved for investors, jury, and keynote speakers.
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* 5. PARKING & ACCESSIBILITY INFO                                     */}
        {/* =================================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Parking Information */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#E4E0D7] pb-3">
              <Car className="w-5 h-5 text-[#E8590C]" />
              <h3 className="type-h3 text-[#18181B] font-display">Campus Parking Provisions</h3>
            </div>

            <p className="text-xs text-[#52525B] leading-relaxed font-sans">
              DVSIET provides expansive, secure on-campus parking bays for delegate vehicles:
            </p>

            <ul className="text-xs space-y-2 text-[#52525B] font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <span><strong>Four-Wheeler Parking (Gate 1):</strong> Reserved paved parking spaces with security marshals.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <span><strong>Two-Wheeler Parking (Gate 2):</strong> Dedicated covered student and delegate two-wheeler parking.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <span><strong>VIP & Speaker Drop-off:</strong> Porch drop-off access directly outside the Central Auditorium.</span>
              </li>
            </ul>

            <div className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] text-[11px] text-[#71717A] font-sans">
              Note: Please follow campus traffic volunteer marshals upon entry at the main gate.
            </div>
          </div>

          {/* Accessibility Info */}
          <div className="rounded-[3px] border border-[#E4E0D7] bg-white p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-[#E4E0D7] pb-3">
              <ShieldCheck className="w-5 h-5 text-[#E8590C]" />
              <h3 className="type-h3 text-[#18181B] font-display">Accessibility & Special Needs</h3>
            </div>

            <p className="text-xs text-[#52525B] leading-relaxed font-sans">
              Startup Conclave 1.0 is committed to ensuring an inclusive physical environment for all attendees:
            </p>

            <ul className="text-xs space-y-2 text-[#52525B] font-sans">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <span><strong>Step-Free Entry:</strong> Ramp access provided across main auditorium and exhibition foyers.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <span><strong>Elevator Provisions:</strong> Elevator access to multi-floor seminar complexes.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E8590C] shrink-0 mt-0.5" />
                <span><strong>Accessible Restrooms:</strong> Clearly signposted accessible washroom facilities on the ground floor.</span>
              </li>
            </ul>

            <div className="p-3 rounded-[2px] border border-[#EFECE6] bg-[#FBF9F5] text-[11px] text-[#71717A] font-sans">
              Need personalized physical assistance? Contact our volunteer secretariat desk upon check-in.
            </div>
          </div>

        </div>

        {/* =================================================================== */}
        {/* 6. ON-GROUND CONTACT DESK PLACEHOLDER                               */}
        {/* =================================================================== */}
        <div className="rounded-[3px] border border-[#E4E0D7] bg-[#F4F1EA] p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <span className="type-eyebrow text-[#E8590C]">ON-GROUND LOGISTICS DESK</span>
            <h3 className="type-h3 text-[#18181B] font-display">
              Have Questions About Reaching Campus?
            </h3>
            <p className="type-body text-[#52525B] text-xs sm:text-sm">
              Our venue management team is available to assist with directions, transit coordination, or group student delegations.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-sans text-[#18181B]">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#E8590C]" />
                <span>{EVENT_DATA.helplinePhone} (10 AM – 5 PM IST)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#E8590C]" />
                <a href={`mailto:${EVENT_DATA.contactEmail}`} className="underline font-medium hover:text-[#E8590C]">
                  {EVENT_DATA.contactEmail}
                </a>
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <a
              href={googleMapsDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="primary"
                size="md"
                rightIcon={<Navigation className="w-4 h-4" />}
              >
                Get Directions
              </Button>
            </a>
          </div>
        </div>

      </div>
    </PageShell>
  );
};
