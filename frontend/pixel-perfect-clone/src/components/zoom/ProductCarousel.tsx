"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Video, Pencil, LayoutGrid, Sparkles, Radio, DoorOpen } from "lucide-react";

// Redesigned cards array matching the reference image order and mockups
const cards = [
  {
    id: "meetings",
    label: "Meetings",
    icon: Video,
    accent: "rgba(15,15,40,0.85)",
    bg: "url('/card_meetings.png')",
    type: "meetings"
  },
  {
    id: "mynotes",
    label: "My Notes",
    icon: Pencil,
    accent: "#1A3FBF",
    bg: "linear-gradient(160deg, #1A3FBF 0%, #2d5fcf 100%)",
    type: "mynotes",
    featured: true
  },
  {
    id: "canvas",
    label: "Canvas",
    icon: LayoutGrid,
    accent: "rgba(15,15,40,0.85)",
    bg: "url('/card_canvas.png')",
    type: "canvas"
  },
  {
    id: "ai_companion",
    label: "AI Companion",
    icon: Sparkles,
    accent: "rgba(15,15,40,0.85)",
    bg: "linear-gradient(160deg, #090B1E 0%, #151D45 100%)",
    type: "ai_companion"
  },
  {
    id: "webinars",
    label: "Webinars",
    icon: Radio,
    accent: "rgba(15,15,40,0.85)",
    bg: "url('/card_webinars.png')",
    type: "webinars"
  },
  {
    id: "bonsai",
    label: "Bonsai",
    icon: Sparkles,
    accent: "rgba(15,15,40,0.85)",
    bg: "linear-gradient(160deg, #F3F4F6 0%, #FFFFFF 100%)",
    type: "bonsai"
  },
  {
    id: "rooms",
    label: "Rooms",
    icon: DoorOpen,
    accent: "rgba(15,15,40,0.85)",
    bg: "url('/card_rooms.png')",
    type: "rooms"
  }
];

export function ProductCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1); // Set My Notes as initial active card

  const scroll = (dir: -1 | 1) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cardWidth = 276; // Card width (260px) + gap (16px)
    container.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
    setActive((a) => Math.max(0, Math.min(cards.length - 1, a + dir)));
  };

  return (
    <div className="relative pb-6">
      <div className="relative">
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-4 overflow-x-auto px-6 lg:px-20 py-8 snap-x snap-mandatory"
        >
          {cards.map((c, i) => {
            const Icon = c.icon;
            const isFeatured = i === active;
            return (
              <div
                key={c.id}
                className="snap-center shrink-0 rounded-2xl overflow-hidden relative transition-all duration-300"
                style={{
                  width: 260,
                  height: 340,
                  background: c.bg.startsWith("url") ? undefined : c.bg,
                  backgroundImage: c.bg.startsWith("url") ? c.bg : undefined,
                  backgroundSize: c.bg.startsWith("url") ? "cover" : undefined,
                  backgroundPosition: c.bg.startsWith("url") ? "center" : undefined,
                  transform: isFeatured ? "scale(1.05)" : "scale(0.98)",
                  boxShadow: isFeatured ? "0 20px 40px rgba(0,0,0,0.3)" : "0 10px 20px rgba(0,0,0,0.15)",
                  border: c.type === "bonsai" ? "1px solid #E5E7EB" : "none"
                }}
              >
                {/* Top label bar */}
                <div
                  className="absolute top-0 left-0 right-0 px-4 py-2.5 flex items-center gap-2 z-20"
                  style={{ background: c.type === "mynotes" ? "#1A3FBF" : "rgba(15,15,40,0.85)" }}
                >
                  <Icon size={16} className="text-white" />
                  <span className="text-white text-[14px] font-semibold">{c.label}</span>
                </div>

                {/* Card-specific overlay content */}
                
                {/* 1. Meetings Card */}
                {c.type === "meetings" && (
                  <div className="absolute inset-0 flex items-end p-3 pt-12">
                    <div className="bg-black/50 backdrop-blur-md rounded-full px-2.5 py-1 text-[9px] text-white font-medium flex items-center gap-1.5 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span>Jane Cooper</span>
                    </div>
                  </div>
                )}

                {/* 2. My Notes Card */}
                {c.type === "mynotes" && (
                  <div className="absolute inset-0 pt-12 px-3 pb-4 flex flex-col justify-between">
                    <div className="bg-white rounded-lg p-3 shadow-xl text-[10px] text-zinc-700 flex-1 overflow-hidden">
                      <div className="flex gap-1.5 mb-2 items-center">
                        <div className="w-2 h-2 rounded-full bg-red-400" />
                        <div className="w-2 h-2 rounded-full bg-yellow-400" />
                        <div className="w-2 h-2 rounded-full bg-green-400" />
                        <span className="ml-auto text-[8px] text-zinc-400">My Notes</span>
                      </div>
                      <div className="font-bold text-zinc-950 text-[10px] mb-1">
                        Patrick's Note - 03.21.2026
                      </div>
                      <div className="text-[8px] font-bold text-zinc-400 uppercase tracking-wider mb-1">Transcript</div>
                      <div className="space-y-1.5">
                        <div>
                          <div className="flex items-center gap-1 text-[8px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            <span className="font-semibold text-zinc-800">Speaker 1</span>
                            <span className="text-zinc-400">02:00:01</span>
                          </div>
                          <p className="text-[8px] leading-snug mt-0.5 text-zinc-500">
                            Shawna Owen met with company executives Rob and Max the current marketing
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-[8px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
                            <span className="font-semibold text-zinc-800">Speaker 2</span>
                            <span className="text-zinc-400">06:26:20</span>
                          </div>
                        </div>
                        <div className="text-[8px] text-zinc-400">00:01:32</div>
                      </div>
                    </div>
                    <div className="mt-2.5 px-1 text-[11px] font-medium text-white/90 leading-tight">
                      Share budget expectations with Rob |
                    </div>
                  </div>
                )}

                {/* 3. Canvas Card */}
                {c.type === "canvas" && (
                  <div className="absolute inset-0 pt-12 px-3 pb-3 flex flex-col justify-between">
                    <div className="bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white flex-1 flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-[12px] mb-1">Q1 Kickoff</div>
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <div className="w-3.5 h-3.5 rounded-full bg-green-600 flex items-center justify-center text-[7px] font-bold text-white">ML</div>
                          <span className="text-[8px] text-white/60">Maurice Lawson</span>
                        </div>
                        <div className="space-y-1.5 text-[8px] text-white/80">
                          <div className="flex items-center gap-1 font-bold text-white/95">
                            <span className="text-green-400">✓</span>
                            <span>1. Q1 Goals & Outcomes</span>
                          </div>
                          <div className="flex items-start gap-1 pl-2.5 text-white/70">
                            <span className="text-green-400">✓</span>
                            <span className="leading-tight">Launched Feature Alpha on March 12</span>
                          </div>
                          <div className="flex items-start gap-1 pl-2.5 text-white/70">
                            <span className="text-green-400">✓</span>
                            <span className="leading-tight">WAU increased by 22%, primarily thro</span>
                          </div>
                          <div className="flex items-start gap-1 pl-2.5 text-white/70">
                            <span className="text-green-400">✓</span>
                            <span className="leading-tight">Onboarding completion rate reached</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-t border-white/20 pt-2 text-[8px] text-white/75">
                        <span className="hover:text-white cursor-pointer font-semibold">H1 ▾</span>
                        <span className="w-px h-3 bg-white/20" />
                        <span className="hover:text-white cursor-pointer font-bold">B</span>
                        <span className="hover:text-white cursor-pointer italic font-serif">I</span>
                        <span className="hover:text-white cursor-pointer underline">U</span>
                        <span className="hover:text-white cursor-pointer line-through">S</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. AI Companion Card */}
                {c.type === "ai_companion" && (
                  <div className="absolute inset-0 pt-12 px-3 pb-3 flex flex-col justify-between relative">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.18)_0%,transparent_75%)] pointer-events-none" />
                    <div className="flex-1 flex flex-col justify-center items-center px-1">
                      <div className="w-full bg-[#0E1020]/90 border border-white/10 rounded-xl p-3 shadow-2xl relative backdrop-blur-sm">
                        <div className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-300 text-[8px] font-bold px-2 py-0.5 rounded-full mb-1.5">
                          <span>✨ Daily Standup</span>
                          <span className="cursor-pointer hover:text-white text-[7px]">✕</span>
                        </div>
                        <div className="text-[11px] font-medium text-white/95 leading-snug">
                          List my action items from this meeting
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 px-1 text-[8px] text-zinc-400">
                      <button className="w-4.5 h-4.5 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-white hover:bg-zinc-700 font-bold">+</button>
                      <button className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/80 hover:bg-zinc-700 text-zinc-300 flex items-center gap-0.5">🌐 All sources</button>
                      <button className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700/80 hover:bg-zinc-700 text-zinc-300">⚙ Mode</button>
                    </div>
                  </div>
                )}

                {/* 5. Webinars Card */}
                {c.type === "webinars" && (
                  <div className="absolute inset-0 pt-12 flex flex-col justify-between overflow-hidden">
                    <div className="absolute left-3 top-16 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg text-[9px] animate-soft-pulse">
                      <span>👏</span> <span className="text-[8px] text-white">Clap</span>
                    </div>
                    <div className="absolute right-3 top-24 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg text-[9px] animate-soft-pulse" style={{ animationDelay: "0.5s" }}>
                      <span>❤️</span> <span className="text-[8px] text-white">Love</span>
                    </div>
                    <div className="absolute left-4 bottom-14 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 shadow-lg text-[9px] animate-soft-pulse" style={{ animationDelay: "1s" }}>
                      <span>😊</span> <span className="text-[8px] text-white">Haha</span>
                    </div>

                    <div className="mt-auto p-2.5">
                      <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-1 flex items-center justify-around text-white/80 text-[8px]">
                        <div className="flex flex-col items-center cursor-pointer hover:text-white">
                          <span>💬</span>
                          <span className="scale-75 origin-top text-[6px]">Chat</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer hover:text-white">
                          <span>😀</span>
                          <span className="scale-75 origin-top text-[6px]">React</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer hover:text-white">
                          <span>📤</span>
                          <span className="scale-75 origin-top text-[6px]">Share</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer hover:text-white">
                          <span>🛡</span>
                          <span className="scale-75 origin-top text-[6px]">Host</span>
                        </div>
                        <div className="flex flex-col items-center cursor-pointer hover:text-white">
                          <span>•••</span>
                          <span className="scale-75 origin-top text-[6px]">More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. Bonsai Card */}
                {c.type === "bonsai" && (
                  <div className="absolute inset-0 pt-10 flex">
                    <div className="flex-1 bg-zinc-50 flex">
                      {/* Client List */}
                      <div className="w-1/2 p-2 border-r border-zinc-200">
                        <div className="text-[9px] font-bold text-zinc-800 mb-1">Clients</div>
                        <div className="space-y-1 text-[7px] text-zinc-600">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="truncate">ACME</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="truncate">Aperture</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                            <span className="truncate">Black Mesa</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            <span className="truncate">Con Sec</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="truncate">Elos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <span className="truncate">Dubai Air</span>
                          </div>
                        </div>
                      </div>
                      {/* Floating Action Menu */}
                      <div className="w-1/2 p-1.5 flex items-center justify-center relative">
                        <div className="bg-white border border-zinc-200 shadow-md rounded-md p-1 w-full text-[7px] font-medium text-zinc-700 space-y-0.5 relative z-10 scale-95 origin-center">
                          <div className="flex items-center gap-1 p-0.5 hover:bg-zinc-50 rounded">
                            <span>📄</span>
                            <span className="truncate">Send Proposal</span>
                          </div>
                          <div className="flex items-center gap-1 p-0.5 bg-green-500 text-white rounded relative">
                            <span>📝</span>
                            <span className="truncate font-semibold">Send Contract</span>
                            {/* SVG Mouse Cursor Overlay */}
                            <div className="absolute right-1 -bottom-2 pointer-events-none drop-shadow-md">
                              <svg width="6" height="8" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 0V9.33333L2.66667 6.66667H6.66667L0 0Z" fill="black"/>
                              </svg>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 p-0.5 hover:bg-zinc-50 rounded">
                            <span>💵</span>
                            <span className="truncate">Send Invoice</span>
                          </div>
                          <div className="flex items-center gap-1 p-0.5 hover:bg-zinc-50 rounded">
                            <span>👥</span>
                            <span className="truncate">Invite to Portal</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. Rooms Card */}
                {c.type === "rooms" && (
                  <div className="absolute inset-0 pt-12 px-3 pb-3 flex flex-col justify-end">
                    <div className="absolute right-2.5 top-16 w-16 space-y-1">
                      <div className="h-8 bg-black/60 rounded border border-white/20 overflow-hidden flex items-center justify-center text-[7px] text-white">
                        <span>👤 Rob</span>
                      </div>
                      <div className="h-8 bg-black/60 rounded border border-white/20 overflow-hidden flex items-center justify-center text-[7px] text-white">
                        <span>👤 Max</span>
                      </div>
                    </div>
                    
                    <div className="bg-black/65 backdrop-blur-sm border border-white/10 rounded-lg p-2 text-white text-[9px] w-[130px] leading-tight">
                      <div className="font-bold">Boardroom A</div>
                      <div className="text-[7px] text-white/70 mt-0.5">In Use · 3 Participants</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Re-designed consolidated controls row flanking dot indicators */}
      <div className="flex items-center justify-center gap-6 mt-4 pb-4">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous slide"
          className="w-10 h-10 rounded-full bg-blue-50/80 hover:bg-blue-100/90 flex items-center justify-center transition-all cursor-pointer shadow-sm border border-blue-100/20"
        >
          <ChevronLeft size={18} className="text-[#0E0E2A]" />
        </button>

        {/* Navigation dot indicators */}
        <div className="flex items-center gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!scrollRef.current) return;
                const container = scrollRef.current;
                const cardWidth = 276;
                container.scrollTo({ left: cardWidth * i, behavior: "smooth" });
                setActive(i);
              }}
              aria-label={`Slide ${i + 1}`}
              className="rounded-full transition-all cursor-pointer"
              style={{
                width: i === active ? 20 : 8,
                height: 8,
                background: i === active ? "#0E0E2A" : "#E2E8F0",
              }}
            />
          ))}
        </div>

        <button
          onClick={() => scroll(1)}
          aria-label="Next slide"
          className="w-10 h-10 rounded-full bg-blue-50/80 hover:bg-blue-100/90 flex items-center justify-center transition-all cursor-pointer shadow-sm border border-blue-100/20"
        >
          <ChevronRight size={18} className="text-[#0E0E2A]" />
        </button>
      </div>
    </div>
  );
}