import { ArrowUpRight } from "lucide-react";

function ArrowBtn() {
  return (
    <button className="absolute bottom-6 right-6 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105 transition-transform z-20">
      <ArrowUpRight size={20} className="text-[#0E0E2A] stroke-[2.5]" />
    </button>
  );
}

export function WhatsNew() {
  return (
    <section className="bg-white pb-20 px-6 lg:px-10">
      {/* Container */}
      <div className="max-w-[1240px] mx-auto">
        
        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Meet My Notes (Left Column) */}
          <div className="relative rounded-[24px] p-8 text-white overflow-hidden flex flex-col min-h-[460px] md:min-h-[500px]" style={{ background: "linear-gradient(180deg, #0B5CFF 0%, #0639A6 100%)" }}>
            <h3 className="text-[24px] font-bold leading-tight mb-3 z-10 relative">Meet My Notes:<br />Your new AI note taker</h3>
            <p className="text-[15px] opacity-90 max-w-[280px] z-10 relative">
              Capture insights from your conversations on Zoom, in person, and across third-party platforms.
            </p>
            {/* Image mockup inside card 1 */}
            <div className="absolute bottom-0 right-0 left-0 h-[60%] flex items-end justify-center px-4 md:px-8">
               <div className="w-full max-w-[280px] h-[75%] bg-white/20 rounded-t-2xl overflow-hidden relative shadow-2xl backdrop-blur-md border border-white/30 p-4">
                  <div className="bg-white/15 p-4 rounded-xl border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[11px] font-semibold opacity-95">[My Notes] Q3 Campaign Planning</span>
                       <span className="opacity-60 text-[12px] tracking-widest">•••</span>
                    </div>
                    <p className="text-[11px] opacity-85 leading-relaxed">
                      The audience definition is a bit too broad, but there's clear momentum around focusing on digital channels. Focus: Clarify campaign goal.
                    </p>
                  </div>
               </div>
            </div>
            <ArrowBtn />
          </div>

          {/* Card 2: Zoom wins Emmy (Middle Column) */}
          <div className="relative rounded-[24px] p-8 text-white overflow-hidden flex flex-col min-h-[460px] md:min-h-[500px]" style={{ background: "linear-gradient(180deg, #1A56E8 0%, #0D3EBB 100%)" }}>
            <h3 className="text-[24px] font-bold leading-tight mb-3 z-10 relative max-w-[300px]">Zoom wins Emmy for Engineering, Science &amp; Technology</h3>
            <p className="text-[15px] opacity-90 max-w-[280px] z-10 relative">
              From remote work to broadcast technology, Zoom is changing how the world connects.
            </p>
            {/* Image mockup inside card 2 */}
            <div className="absolute bottom-0 right-0 left-0 h-[50%] flex items-end justify-center pb-12">
               <div className="text-[100px] leading-none opacity-90 drop-shadow-2xl">🏆</div>
            </div>
            <ArrowBtn />
          </div>

          {/* Card 3 & 4 Stack (Right Column) */}
          <div className="flex flex-col gap-5 min-h-[460px] md:min-h-[500px]">
            {/* Top Right */}
            <div className="relative rounded-[24px] p-8 text-white overflow-hidden flex-1" style={{ background: "linear-gradient(135deg, #0E47D8 0%, #0932A0 100%)" }}>
              <h3 className="text-[22px] font-bold leading-tight mb-3 max-w-[280px]">Eric Yuan on accessible AI: Include AI tools for business</h3>
              <p className="text-[14.5px] opacity-90 max-w-[280px]">
                Zoom CEO, Eric Yuan, discusses how Zoom is making AI available at no extra cost.
              </p>
              <ArrowBtn />
            </div>

            {/* Bottom Right */}
            <div className="relative rounded-[24px] p-8 text-white overflow-hidden flex-1" style={{ background: "linear-gradient(135deg, #0B5CFF 0%, #073DB0 100%)" }}>
              <h3 className="text-[22px] font-bold leading-tight mb-3 max-w-[280px]">Zoom launches AI app for frontline workers</h3>
              <p className="text-[14.5px] opacity-90 max-w-[280px]">
                The app handles scheduling, updates, chat, push-to-talk, tasks, and more.
              </p>
              <ArrowBtn />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}