import { Pencil, RotateCw, Sparkles, ChevronDown } from "lucide-react";

export function MyNotesSection() {
  return (
    <section className="bg-white pt-20 px-6 lg:px-20">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm"
              style={{ background: "linear-gradient(135deg, #5C67F2 0%, #0B5CFF 100%)" }}
            >
              <div className="relative flex items-center justify-center w-full h-full">
                <Pencil size={20} className="text-white fill-white/10" />
                <Sparkles size={11} className="text-white absolute top-1 right-1 fill-white/30" />
              </div>
            </div>
            <h2 className="font-extrabold leading-[1.1] tracking-tight" style={{ fontSize: 42 }}>
              <span className="text-[#0B5CFF]">My </span>
              <span className="bg-gradient-to-r from-[#6E36FF] via-[#A83DFF] to-[#EC4899] bg-clip-text text-transparent">Notes</span>
              <br />
              <span style={{ color: "var(--zoom-dark)" }}>Your new AI note taker</span>
            </h2>
          </div>
          <button
            className="px-6 py-3 rounded-lg text-white font-semibold text-[15px] self-end transition-colors"
            style={{ background: "var(--zoom-blue)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--zoom-blue-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--zoom-blue)")}
          >
            Explore My Notes
          </button>
        </div>

        {/* Mockup */}
        <div
          className="mt-12 rounded-t-2xl overflow-hidden relative"
          style={{
            background: "linear-gradient(180deg, #87CEEB 0%, #B0E0FF 40%, #6FA890 100%)",
            minHeight: 560,
          }}
        >
          <div className="absolute top-4 left-4 px-2 py-1 rounded text-white text-xs font-mono bg-black/30">1.00</div>

          <div className="mx-auto mt-12 mb-0 max-w-[920px] bg-white rounded-t-xl shadow-2xl overflow-hidden">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-3 py-2 border-b border-zinc-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="text-[11px] text-zinc-500 ml-2">
                <span className="font-semibold">zoom</span> Workplace
              </div>
              <div className="flex-1" />
              <div className="text-[11px] text-zinc-400">Q Search</div>
            </div>

            <div className="flex">
              {/* Sidebar */}
              <div className="w-12 bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-3 gap-3 text-[8px] text-zinc-500">
                {["Home", "Calendar", "Team Chat", "Phone", "Hub", "More"].map((l) => (
                  <div key={l} className="flex flex-col items-center gap-0.5">
                    <div className="w-5 h-5 rounded bg-zinc-200" />
                    <span>{l}</span>
                  </div>
                ))}
              </div>

              {/* Doc */}
              <div className="flex-1 p-5 md:p-6">
                {/* Editor formatting toolbar */}
                <div className="flex items-center justify-between border-b border-zinc-200/80 pb-3 mb-5 text-zinc-500 text-xs flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 hover:text-zinc-800 font-semibold cursor-pointer">
                      <span>←</span> Back
                    </button>
                    <div className="w-[1px] h-3.5 bg-zinc-200" />
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-0.5 hover:text-zinc-800 font-semibold cursor-pointer">
                        Text <ChevronDown size={11} className="inline-block" />
                      </button>
                      <button className="font-bold hover:text-zinc-800 cursor-pointer">B</button>
                      <button className="italic hover:text-zinc-800 cursor-pointer">I</button>
                      <button className="underline hover:text-zinc-800 cursor-pointer">U</button>
                      <button className="flex items-center gap-0.5 hover:text-zinc-800 cursor-pointer">
                        A <ChevronDown size={11} className="inline-block" />
                      </button>
                      <button className="hover:text-zinc-800 cursor-pointer">📎</button>
                      <button className="hover:text-zinc-800 cursor-pointer">🔗</button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    <button className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#EBF2FC] text-[#0B5CFF] font-bold text-[11px] hover:bg-[#D9E6FC] transition-colors cursor-pointer">
                      Share
                    </button>
                    <button className="hover:text-zinc-800 cursor-pointer">📹</button>
                    <button className="hover:text-zinc-800 cursor-pointer">•••</button>
                  </div>
                </div>

                <h3 className="text-[20px] font-bold text-zinc-900">[My Note] Q3 Marketing Kickoff</h3>
                <div className="flex gap-4 mt-2 text-[11.5px] text-zinc-500 font-medium">
                  <span className="cursor-pointer hover:text-zinc-800 flex items-center gap-1">📝 Manual notes</span>
                  <span className="cursor-pointer hover:text-zinc-800 flex items-center gap-1">🎙 Transcript</span>
                </div>

                {[
                  {
                    h: "Discussion Highlights",
                    items: [
                      ["Focus Area:", "Revisiting event theme options introduced in a previous meeting."],
                      ["Key Exploration:", "Which theme directions feel strongest for moving forward."],
                      ["Emerging Interest:", "Customer stories and real-world use cases stood out."],
                    ],
                  },
                  {
                    h: "Ideas Generated",
                    items: [
                      ["Customer Storytelling Theme:", "Emphasizes authenticity and engagement."],
                      ["Real-World Use Cases:", "Highlights impact and practical relevance."],
                      ["Hybrid Approach:", "Combines storytelling with tangible results for broader appeal."],
                    ],
                  },
                  {
                    h: "Follow-Up Plans",
                    items: [
                      ["Next Discussion:", "Align on a preferred event theme."],
                      ["Goal:", "Confirm direction to support Q3 objectives and ensure a strong foundation for planning."],
                      ["Outcome:", "A unified theme approach that aligns with overall marketing goals."],
                    ],
                  },
                ].map((sec) => (
                  <div key={sec.h} className="mt-4">
                    <h4 className="font-bold text-[13px] text-zinc-900">{sec.h}</h4>
                    <ul className="mt-1 space-y-0.5 text-[12px] text-zinc-700 list-disc pl-5">
                      {sec.items.map(([b, t]) => (
                        <li key={b}>
                          <span className="font-semibold">{b}</span> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="flex items-center justify-center gap-2 mt-6 pt-3 border-t border-zinc-200">
                  <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-blue-600 hover:bg-blue-50 rounded">
                    <Sparkles size={12} /> Regenerate
                  </button>
                  <button className="flex items-center gap-1 px-3 py-1.5 text-[11px] text-zinc-700 border border-zinc-200 rounded">
                    Template: Short brainstorm <ChevronDown size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            aria-label="Refresh"
            className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow"
          >
            <RotateCw size={16} className="text-zinc-700" />
          </button>
        </div>
      </div>
    </section>
  );
}