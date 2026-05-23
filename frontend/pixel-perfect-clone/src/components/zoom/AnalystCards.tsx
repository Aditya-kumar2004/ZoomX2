import { ChevronDown } from "lucide-react";

export function AnalystCards() {
  return (
    <section className="bg-white py-16 px-6 lg:px-20">
      <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-6">
        {/* Gartner Magic Quadrant Leader */}
        <div className="flex flex-col">
          <div
            className="rounded-2xl p-8 h-[300px] flex flex-col justify-between text-white relative overflow-hidden shadow-sm"
            style={{ background: "linear-gradient(135deg, #091240 0%, #0B5CFF 100%)" }}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2">
                <svg className="w-8 h-10 text-white/70 fill-current shrink-0" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 30C5 24 10 18 18 16C12 18 8 24 6 30C5 31 3 31 2 30ZM4 22C7 17 12 12 20 10C14 12 10 17 8 22C7 23 5 23 4 22ZM6 14C9 10 14 6 22 5C16 6 12 10 10 14C9 15 7 15 6 14Z" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="font-serif text-[26px] font-extrabold tracking-tight leading-none">Gartner</span>
                  <div className="text-[12.5px] tracking-[4px] mt-1.5 font-bold text-white/90">LEADER</div>
                  <div className="text-[10px] tracking-[2.5px] text-white/75 mt-0.5 font-semibold">6TH YEAR IN A ROW</div>
                </div>
                <svg className="w-8 h-10 text-white/70 fill-current scale-x-[-1] shrink-0" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 30C5 24 10 18 18 16C12 18 8 24 6 30C5 31 3 31 2 30ZM4 22C7 17 12 12 20 10C14 12 10 17 8 22C7 23 5 23 4 22ZM6 14C9 10 14 6 22 5C16 6 12 10 10 14C9 15 7 15 6 14Z" />
                </svg>
              </div>
            </div>
            <p className="text-[17.5px] font-bold leading-snug">
              A Leader in the <span className="text-blue-300">Gartner® Magic Quadrant™</span> for UCaaS, Worldwide
            </p>
          </div>
          <button className="mt-5 self-start px-5 py-2.5 rounded-lg text-white font-bold text-[14px] hover:scale-[1.02] transition-transform cursor-pointer" style={{ background: "var(--zoom-blue)" }}>
            Read the report
          </button>
        </div>

        {/* Gartner Voice of the Customer for CCaaS */}
        <div className="flex flex-col">
          <div
            className="rounded-2xl h-[300px] relative overflow-hidden bg-cover bg-center shadow-sm"
            style={{ backgroundImage: "url('/card_ccaas.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
            <p className="absolute bottom-6 left-6 right-6 text-white text-[17.5px] font-bold leading-snug">
              Zoom recognized in the 2026 Gartner Voice of the Customer for CCaaS
            </p>
          </div>
          <button className="mt-5 self-start px-5 py-2.5 rounded-lg text-white font-bold text-[14px] hover:scale-[1.02] transition-transform cursor-pointer" style={{ background: "var(--zoom-blue)" }}>
            Explore the report
          </button>
        </div>

        {/* Forrester Wave */}
        <div className="flex flex-col">
          <div className="rounded-2xl h-[300px] p-6 bg-white shadow-sm" style={{ border: "2px solid #D5C3FF" }}>
            <div className="text-[11px] font-bold tracking-wider text-zinc-900">THE FORRESTER WAVE™</div>
            <div className="text-[12.5px] font-semibold text-zinc-700 mt-0.5">Unified-Communications-As-A-Service Platforms</div>
            <div className="text-[10px] text-zinc-400 font-medium">Q3 2025</div>
            <svg viewBox="0 0 240 180" className="mt-2 w-full h-[200px]">
              <defs>
                <radialGradient id="quad" cx="100%" cy="100%" r="120%">
                  <stop offset="0%" stopColor="#BFE0FF" />
                  <stop offset="50%" stopColor="#DCEEFF" />
                  <stop offset="100%" stopColor="#F0F7FF" />
                </radialGradient>
              </defs>
              <path d="M 240 180 A 220 220 0 0 0 20 0 L 240 0 Z" fill="url(#quad)" opacity="0.6" />
              <path d="M 240 180 A 160 160 0 0 0 80 20 L 240 20 Z" fill="#BFE0FF" opacity="0.5" />
              <text x="6" y="12" fontSize="7" fill="#333" fontWeight="600">Contenders</text>
              <text x="100" y="12" fontSize="7" fill="#333" fontWeight="600">Strong Performers</text>
              <text x="195" y="12" fontSize="7" fill="#333" fontWeight="600">Leaders</text>
              <text x="3" y="100" fontSize="6" fill="#666" transform="rotate(-90 3 100)">Strength of offering</text>
              <text x="120" y="178" fontSize="6" fill="#666" textAnchor="middle">Strength of strategy →</text>
              {/* Dots */}
              <circle cx="205" cy="40" r="5" fill="#0B5CFF" />
              <text x="213" y="43" fontSize="7" fill="#0B5CFF" fontWeight="bold">Zoom</text>
              <circle cx="180" cy="55" r="3" fill="#666" />
              <text x="185" y="57" fontSize="6" fill="#666">Cisco</text>
              <circle cx="195" cy="80" r="3" fill="#666" />
              <text x="200" y="82" fontSize="6" fill="#666">Microsoft</text>
              <circle cx="155" cy="80" r="3" fill="#666" />
              <text x="115" y="82" fontSize="6" fill="#666">RingCentral</text>
              <circle cx="175" cy="95" r="3" fill="#666" />
              <text x="180" y="97" fontSize="6" fill="#666">8x8</text>
              <circle cx="135" cy="100" r="3" fill="#666" />
              <text x="100" y="102" fontSize="6" fill="#666">Dialpad</text>
              <circle cx="125" cy="115" r="3" fill="#666" />
              <text x="100" y="117" fontSize="6" fill="#666">GoTo</text>
              <circle cx="110" cy="135" r="3" fill="#666" />
              <text x="80" y="137" fontSize="6" fill="#666">Vonage</text>
              <circle cx="165" cy="135" r="3" fill="#666" />
              <text x="170" y="137" fontSize="6" fill="#666">Zoho</text>
              <circle cx="145" cy="155" r="3" fill="#666" />
              <text x="125" y="167" fontSize="6" fill="#666">Intermedia</text>
            </svg>
          </div>
          <button className="mt-5 self-start px-5 py-2.5 rounded-lg text-white font-bold text-[14px] hover:scale-[1.02] transition-transform cursor-pointer" style={{ background: "var(--zoom-blue)" }}>
            Read Forrester report
          </button>
        </div>
      </div>
    </section>
  );
}