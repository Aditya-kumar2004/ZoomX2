"use client";

import { useState } from "react";

const LOGOS = [
  <span key="nyt" className="font-serif text-[18px] font-bold tracking-tight text-[#232733]" style={{ fontFamily: "Georgia, serif" }}>The New York Times</span>,
  <span key="wm" className="font-sans font-extrabold text-[20px] flex items-center gap-1 text-[#232733]">Walmart <span className="text-[#0B5CFF] text-[15px] font-black">✱</span></span>,
  <span key="wn" className="flex flex-col items-center text-[#232733] select-none">
    <span className="font-black text-[20px] tracking-[0.05em] leading-none" style={{ background: "linear-gradient(to bottom, #E2E8F0 55%, #232733 55%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>WERNER</span>
    <span className="text-[9px] tracking-[4.5px] font-extrabold text-zinc-500 leading-none mt-1">ENTERPRISES</span>
  </span>,
  <span key="mof" className="font-sans font-extrabold text-[16px] flex items-center gap-1.5 text-[#232733]">MOFFITT <span className="inline-flex w-[18px] h-[18px] rounded-full border-2 border-[#232733] items-center justify-center text-[9px] font-black">M</span></span>,
  <span key="ex" className="text-[20px] text-[#232733]"><span className="italic font-black">Exxon</span><span className="font-bold">Mobil</span></span>,
  <span key="cap" className="font-sans font-extrabold text-[18px] text-[#232733] flex items-center">Capital <span className="italic font-bold ml-0.5 text-[19px] relative -top-[1px]">One</span></span>,
];

export function TrustLogos() {
  const [isPaused, setIsPaused] = useState(false);
  const items = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section className="bg-white pt-16 pb-8 px-6 lg:px-20 select-none">
      <h3 className="text-center text-[19px] font-bold mb-10 text-[#232733]">
        Trusted by millions. Built for you.
      </h3>
      
      <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6">
        {/* Marquee Wrapper */}
        <div className="flex-1 overflow-hidden marquee-mask">
          <div 
            className="flex gap-20 animate-marquee w-max"
            style={{ animationPlayState: isPaused ? "paused" : "running" }}
          >
            {items.map((logo, i) => (
              <div key={i} className="shrink-0 flex items-center">{logo}</div>
            ))}
          </div>
        </div>

        {/* Play / Pause Toggle Button */}
        <button 
          onClick={() => setIsPaused(!isPaused)}
          className="w-10 h-10 border border-zinc-200 hover:border-zinc-300 rounded-full flex items-center justify-center text-[#0B5CFF] hover:bg-blue-50 transition-all cursor-pointer shrink-0"
          aria-label={isPaused ? "Play logo animation" : "Pause logo animation"}
        >
          {isPaused ? (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M8 5v14l11-7z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          )}
        </button>
      </div>
    </section>
  );
}