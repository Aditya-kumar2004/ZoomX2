"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const TABS = ["Collaboration", "Customer support", "Marketing", "Sales", "Employee engagement"];

const CONTENT: Record<string, { bullets: [string, string][]; cta: string }> = {
  Collaboration: {
    bullets: [
      ["Support hybrid and remote work:", "Keep global teams engaged with reliable video, chat, documents, and more."],
      ["Seamless communication:", "Save time and cut costs with Meetings, Phone, Chat, and more, in one UCaaS platform."],
      ["Keep workflows moving:", "From brainstorms to documents, Zoom helps teams cut friction and avoid stalls."],
      ["Do more with AI:", "Built-in AI summarizes meetings, drafts follow-ups, and automates next steps."],
    ],
    cta: "Explore products",
  },
  "Customer support": {
    bullets: [
      ["Omnichannel support:", "Meet customers wherever they are — voice, chat, video, social."],
      ["AI-powered agents:", "Resolve issues faster with intelligent routing and assist."],
      ["Unified workspace:", "Give agents one place to see context, history, and tools."],
      ["Actionable insights:", "Spot trends, coach teams, and improve CSAT continuously."],
    ],
    cta: "Explore Contact Center",
  },
  Marketing: {
    bullets: [
      ["Reach the right audience:", "Run webinars, events, and campaigns from a single platform."],
      ["Engage in real time:", "Use polls, Q&A, and interactive video to drive attention."],
      ["Measure what matters:", "Track engagement and pipeline impact across channels."],
      ["Built-in AI assist:", "Draft emails, recaps, and follow-ups with one click."],
    ],
    cta: "Explore Events",
  },
  Sales: {
    bullets: [
      ["Close more deals:", "Use Zoom Revenue Accelerator to coach reps with conversation insights."],
      ["Streamline outreach:", "Meetings, Phone, and Chat in one connected platform."],
      ["AI-powered prep:", "Get briefs, summaries, and next steps before every call."],
      ["Actionable analytics:", "Forecast better with real customer signal."],
    ],
    cta: "Explore Revenue Accelerator",
  },
  "Employee engagement": {
    bullets: [
      ["Connect your workforce:", "Town halls, meetings, and chat that scale globally."],
      ["Recognize and reward:", "Foster culture with rich, interactive experiences."],
      ["Listen continuously:", "Surveys, polls, and feedback baked in."],
      ["AI for HR:", "Summaries and follow-ups for every conversation."],
    ],
    cta: "Explore Workvivo",
  },
};

export function PlatformTabs() {
  const [active, setActive] = useState("Collaboration");
  const data = CONTENT[active];

  return (
    <section className="bg-white py-16 px-6 lg:px-20">
      <h2 className="text-center font-extrabold leading-[1.1] tracking-tight" style={{ fontSize: 44, color: "var(--zoom-dark)" }}>
        One platform.
        <br />
        Endless ways to work together.
      </h2>

      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {TABS.map((t) => {
          const isActive = t === active;
          return (
            <button
              key={t}
              onClick={() => setActive(t)}
              className="px-6 py-2.5 text-[15px] font-semibold transition-all rounded-xl cursor-pointer"
              style={{
                color: isActive ? "var(--zoom-blue)" : "var(--zoom-muted)",
                background: isActive ? "#FFFFFF" : "transparent",
                border: isActive ? "1px solid #0B5CFF" : "1px solid transparent",
              }}
            >
              {t}
            </button>
          );
        })}
      </div>

      <div className="max-w-[1200px] mx-auto mt-12 grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side: Text and CTA Button */}
        <div key={active} className="animate-fade-slide">
          <ul className="space-y-5 text-[15.5px] leading-[1.7]" style={{ color: "var(--zoom-dark)" }}>
            {data.bullets.map(([b, t]) => (
              <li key={b} className="flex gap-3">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-600" />
                <span>
                  <span className="font-bold">{b}</span> {t}
                </span>
              </li>
            ))}
          </ul>
          <button
            className="mt-10 px-6 py-3 rounded-lg text-white font-bold text-[15px] hover:scale-[1.02] transition-transform cursor-pointer shadow-sm"
            style={{ background: "var(--zoom-blue)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--zoom-blue-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--zoom-blue)")}
          >
            {data.cta}
          </button>
        </div>

        {/* Right Side: Mockup whiteboard window on top of forest backdrop */}
        <div key={active + "-img"} className="rounded-2xl overflow-hidden shadow-2xl animate-fade-slide relative p-6 bg-cover bg-center flex flex-col justify-center items-center" style={{ backgroundImage: "url('/card_canvas.png')", minHeight: 440 }}>
          <div className="absolute inset-0 bg-black/15" />

          {/* Floating meeting control bar */}
          <div className="relative z-10 w-full max-w-[480px] mb-4">
            <div className="bg-[#181B3D]/95 text-white text-[10px] py-2 px-4 rounded-xl flex items-center justify-between shadow-lg border border-white/10 select-none">
              <span className="hover:text-zinc-300">🎙 Mute</span>
              <span className="hover:text-zinc-300">📹 Stop Video</span>
              <span className="hover:text-zinc-300">🛡 Security</span>
              <span className="hover:text-zinc-300">👥 Participants</span>
              <span className="bg-green-600 px-2 py-0.5 rounded text-white font-bold shrink-0">New Share</span>
              <span className="hover:text-zinc-300">⏸ Pause</span>
              <span className="hover:text-zinc-300">✎ Annotate</span>
            </div>
            <div className="bg-green-700/90 backdrop-blur-sm text-white text-[9.5px] px-3 py-1 rounded-b-lg border-x border-b border-green-600/30 flex items-center justify-between mx-auto max-w-[90%]">
              <span>You are screen sharing Q3 Brainstorm board</span>
              <button className="bg-red-600 px-2 py-0.5 rounded text-[9px] font-bold cursor-pointer">Stop Share</button>
            </div>
          </div>

          {/* Whiteboard / Canvas Dashboard Window */}
          <div className="relative z-10 w-full bg-white rounded-xl shadow-2xl border border-zinc-200/80 overflow-hidden flex flex-col max-w-[500px]">
            {/* Window chrome / Header */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200 bg-zinc-50">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <div className="text-[10px] font-bold text-zinc-500 ml-2 border-r border-zinc-200 pr-3 shrink-0">zoom Workplace</div>
              <div className="flex gap-2.5 text-[9.5px] text-zinc-500 font-bold overflow-x-auto no-scrollbar">
                <span className="border-b-2 border-blue-500 text-blue-600 pb-0.5 cursor-pointer">Page 1</span>
                <span className="hover:text-zinc-800 cursor-pointer">Explorations B</span>
                <span className="hover:text-zinc-800 cursor-pointer">Sign-in screen</span>
                <span className="hover:text-zinc-800 cursor-pointer">Old staff</span>
              </div>
              <div className="flex-1" />
              <div className="text-[9.5px] text-zinc-400 font-semibold shrink-0">Q Search</div>
            </div>

            <div className="flex flex-1 min-h-[200px]">
              {/* Drawing toolbar */}
              <div className="w-10 bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-3 gap-2.5 text-zinc-400 select-none">
                <div className="p-1 hover:bg-zinc-200 rounded text-xs cursor-pointer">↗</div>
                <div className="p-1 hover:bg-zinc-200 rounded text-xs cursor-pointer">⚃</div>
                <div className="p-1 hover:bg-zinc-200 rounded text-xs cursor-pointer font-bold text-zinc-800">T</div>
                <div className="p-1 hover:bg-zinc-200 rounded text-xs cursor-pointer">✏</div>
                <div className="p-1 hover:bg-zinc-200 rounded text-xs cursor-pointer">⎔</div>
                <div className="p-1 hover:bg-zinc-200 rounded text-xs cursor-pointer">⚝</div>
                <div className="w-4 h-4 rounded-full bg-blue-500 border border-white cursor-pointer" />
              </div>

              {/* Main Whiteboard Canvas */}
              <div className="flex-1 p-4 bg-white relative flex gap-3">
                {/* Left dashboard section */}
                <div className="flex-1 border border-zinc-100 rounded-lg p-2.5 bg-zinc-50/50">
                  <div className="text-[11px] font-bold text-zinc-800">Dashboard</div>
                  <div className="flex gap-4 mt-2">
                    <div>
                      <div className="text-[11px] font-extrabold text-zinc-900 leading-none">11.8M</div>
                      <div className="text-[8px] text-zinc-400 font-semibold mt-0.5">Users</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-extrabold text-zinc-900 leading-none">8.226M</div>
                      <div className="text-[8px] text-zinc-400 font-semibold mt-0.5">Active</div>
                    </div>
                  </div>
                  {/* Mock charts */}
                  <div className="mt-3 flex gap-2 items-center">
                    <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-r-zinc-200 shrink-0" />
                    <div className="flex-1 space-y-1">
                      <div className="h-1.5 bg-zinc-200 rounded w-full" />
                      <div className="h-1.5 bg-zinc-200 rounded w-3/4" />
                    </div>
                  </div>
                </div>

                {/* Right video grid sidebar */}
                <div className="w-28 flex flex-col gap-2">
                  {[
                    { name: "Aaliyah Morgan", img: "/card_meetings.png" },
                    { name: "Marketing Huddle", img: "/card_webinars.png" },
                    { name: "Imani Patel", img: "/card_ccaas.png" }
                  ].map((p) => (
                    <div
                      key={p.name}
                      className="flex-1 rounded-lg relative overflow-hidden text-white text-[8px] font-bold bg-cover bg-center border border-zinc-100 shadow-sm min-h-[50px]"
                      style={{ backgroundImage: `url('${p.img}')` }}
                    >
                      <div className="absolute inset-0 bg-black/15" />
                      <div className="absolute bottom-1 left-1 bg-black/45 px-1 rounded-md max-w-[90%] truncate">
                        {p.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}