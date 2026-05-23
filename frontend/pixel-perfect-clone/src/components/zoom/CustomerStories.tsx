"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

// SVGs for Logos
const MlbLogo = () => (
  <div className="flex items-center gap-2 select-none text-white">
    <div className="w-[42px] h-[26px] rounded flex overflow-hidden border border-white/20">
      <div className="w-1/2 bg-[#002D72] flex items-center justify-end">
        <svg className="w-[21px] h-[26px] text-white translate-x-[3.5px]" viewBox="0 0 22 28" fill="currentColor">
          <path d="M22 6.5c-0.8 0-1.5 0.7-1.5 1.5s0.7 1.5 1.5 1.5V6.5zM22 10.5c-1.5 0-2.5 1.2-2.5 2.5v3.5c0 0.8-0.5 1.5-1.2 1.8l-2.5 1.2v2l3.2-1.5c1.2-0.6 2-1.8 2-3.2v-6.3z" />
        </svg>
      </div>
      <div className="w-1/2 bg-[#DF152A] flex items-center justify-start">
        <svg className="w-[21px] h-[26px] text-white -translate-x-[3.5px]" viewBox="0 0 22 28" fill="currentColor">
          <path d="M0 6.5v3c1.5 0 2.5 1.2 2.5 2.5v9c0 1.1-0.9 2-2 2v2c2.2 0 4-1.8 4-4V12c0-2.2-1.8-4-4-4V6.5z" />
          <path d="M0 7.5L6.5 4.5l0.8 1.5L0 9.2V7.5z" />
        </svg>
      </div>
    </div>
  </div>
);

const TheShareCoLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
      {/* Symmetrical share spiral waves */}
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16z" className="opacity-40" />
      <path d="M12.5 7.25c.34-.84.97-1.5 1.77-1.88a6.5 6.5 0 00-6.9 1.95 6.5 6.5 0 00-.73 7.82c.54-.73 1.25-1.28 2.08-1.57a4.5 4.5 0 01.37-3.9 4.5 4.5 0 013.41-2.42zm2.98 1.96c.86.3 1.54.91 1.96 1.7a6.5 6.5 0 00-2.4-6.75 6.5 6.5 0 00-7.75.98c.7.57 1.22 1.3 1.48 2.14a4.5 4.5 0 013.9.36 4.5 4.5 0 012.81 1.57zm-1.07 5.04c-.34.84-.97 1.5-1.77 1.88a6.5 6.5 0 006.9-1.95 6.5 6.5 0 00.73-7.82c-.54.73-1.25 1.28-2.08 1.57a4.5 4.5 0 01-.37 3.9 4.5 4.5 0 01-3.41 2.42zm-2.98-1.96c-.86-.3-1.54-.91-1.96-1.7a6.5 6.5 0 002.4 6.75 6.5 6.5 0 007.75-.98c-.7-.57-1.22-1.3-1.48-2.14a4.5 4.5 0 01-3.9-.36 4.5 4.5 0 01-2.81-1.57z" />
    </svg>
    <span className="font-extrabold text-[17px] text-white tracking-tight">TheShareCo</span>
  </div>
);

const CricutLogo = () => (
  <div className="flex items-center gap-1.5 select-none">
    <span className="font-extrabold text-[19px] tracking-tight text-white flex items-center gap-0.5">
      cricut
      <span className="w-[14px] h-[14px] rounded-full border border-white flex items-center justify-center text-[7px] font-black relative top-[1.5px]">c</span>
    </span>
  </div>
);

const CapitalOneLogo = () => (
  <div className="flex items-center gap-1.5 text-white select-none">
    <span className="font-sans font-extrabold text-[17px] tracking-tight whitespace-nowrap">Capital One</span>
  </div>
);

const STORIES = [
  {
    logoComponent: <MlbLogo />,
    title: "Major League Baseball™ and Zoom expand the employee-fan experience",
    quote: "Zoom has allowed us to continue a tradition of really being a technology-focused company and making sure that we are using cutting-edge technology not only to advance our business but also for our fans.",
    who: "Noah Garden, Chief Revenue Officer",
    image: "/story_mlb.png",
    logoRotate: false,
    btnBg: "bg-white text-[#0E0E2A]",
  },
  {
    logoComponent: <TheShareCoLogo />,
    title: "Advancing mental wellness through TheShareCo's journey with Zoom Video SDK",
    quote: "Zoom Video SDKs full flexibility in layout customization allowed us to achieve a real-life experience within the limited real estate presented by a phone or smart device.",
    who: "Tan Han Sing, Founder and CEO, TheShareCo",
    image: "/story_theshareco.png",
    logoRotate: false,
    btnBg: "bg-[#0B5CFF] text-white",
  },
  {
    logoComponent: <CricutLogo />,
    title: "Cricut scales creativity with reliable video",
    quote: "Zoom has become our primary platform for keeping our global team aligned as we scale our crafting ecosystem and release new creative products.",
    who: "Ashish Arora, CEO, Cricut",
    image: "/story_cricut.png",
    logoRotate: false,
    btnBg: "bg-white text-[#0E0E2A]",
  },
  {
    logoComponent: <CapitalOneLogo />,
    title: "Capital One transforms collaboration across hybrid workspaces",
    quote: "Zoom's robust infrastructure and developer-friendly SDKs allowed us to integrate high-quality video calling directly into our associate portals.",
    who: "Rob Alexander, Chief Information Officer, Capital One",
    image: "/story_capone.png",
    logoRotate: true,
    btnBg: "bg-white text-[#0E0E2A]",
  },
];

export function CustomerStories() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0B5CFF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0B5CFF]" /> Customer stories
          </div>
          <h2 className="mt-4 font-bold text-[36px] md:text-[44px] text-[#0E0E2A] tracking-tight">
            Businesses achieve more with Zoom
          </h2>
        </div>

        {/* Interactive Accordion Cards Row */}
        <div className="flex flex-col md:flex-row gap-4 w-full min-h-[450px] md:min-h-[500px] items-stretch">
          {STORIES.map((s, i) => {
            const isActive = activeIndex === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                className={`relative rounded-[32px] overflow-hidden text-white cursor-pointer transition-all duration-500 ease-in-out flex flex-col justify-between p-6 md:p-10 select-none ${
                  isActive 
                    ? "w-full md:w-auto md:flex-[3.8] min-h-[400px] md:min-h-full" 
                    : "w-full md:w-auto md:flex-[1] md:max-w-[125px] min-h-[90px] md:min-h-full items-center justify-center"
                }`}
                style={{
                  backgroundImage: `url(${s.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Background Dark Overlay */}
                <div 
                  className={`absolute inset-0 bg-black transition-opacity duration-500 z-0 ${
                    isActive ? "opacity-55" : "opacity-75 hover:opacity-60"
                  }`} 
                />

                {/* Content Container */}
                {isActive ? (
                  <>
                    {/* Top Section: Logo */}
                    <div className="relative z-10 animate-fade-slide">
                      {s.logoComponent}
                    </div>

                    {/* Bottom Section: Story Text & Action */}
                    <div className="relative z-10 mt-6 flex flex-col md:flex-row md:items-end justify-between gap-6 flex-1">
                      <div className="max-w-full md:max-w-[640px] animate-fade-slide flex flex-col justify-end h-full">
                        <h3 className="text-[22px] md:text-[32px] font-extrabold leading-tight text-white tracking-tight break-words">
                          {s.title}
                        </h3>
                        <p className="mt-4 text-[13px] md:text-[15px] text-zinc-200 leading-relaxed font-medium break-words">
                          "{s.quote}"
                        </p>
                        <p className="mt-3 text-[13px] md:text-[15px] font-bold text-white opacity-95 break-words">
                          - {s.who}
                        </p>
                      </div>

                      {/* Styled circular arrow button */}
                      <div className={`shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg self-start md:self-end ${s.btnBg}`}>
                        <ArrowUpRight size={24} className="stroke-[2.5]" />
                      </div>
                    </div>
                  </>
                ) : (
                  /* Inactive State: Centered (and rotated if applicable) Logo */
                  <div className={`relative z-10 flex items-center justify-center w-full h-full transition-transform duration-500 ${
                    s.logoRotate ? "md:rotate-[-90deg] md:whitespace-nowrap" : ""
                  }`}>
                    {s.logoComponent}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}