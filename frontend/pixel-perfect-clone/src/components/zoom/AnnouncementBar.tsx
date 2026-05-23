"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { handleComingSoon } from "@/lib/utils";

export function AnnouncementBar() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <div className="w-full bg-[#0C1033] pt-2 pb-4 px-4 flex justify-center items-center">
      <div className="max-w-[960px] w-full bg-[#181B3D]/65 border border-white/8 rounded-2xl md:rounded-full py-2.5 px-5 md:px-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6 backdrop-blur-md shadow-lg transition-all">
        <p className="text-white text-[13px] md:text-[14px] font-normal text-center md:text-left leading-relaxed">
          AI note taking across platforms that's secure, personalized, and under your control.
        </p>
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-center md:justify-end">
          <button
            onClick={() => handleComingSoon("AI Personal Notes Integration")}
            className="inline-flex items-center text-white text-[13px] font-semibold px-5 py-2 rounded-full transition-all shrink-0 hover:scale-[1.02] cursor-pointer border-0"
            style={{ background: "linear-gradient(90deg, #0B5CFF 0%, #E21B70 100%)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #2470FF 0%, #FF2E93 100%)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "linear-gradient(90deg, #0B5CFF 0%, #E21B70 100%)")}
          >
            Explore My Notes
          </button>
          <button
            aria-label="Close announcement"
            onClick={() => setOpen(false)}
            className="text-white/60 hover:text-white transition-colors p-1 cursor-pointer bg-transparent border-0"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}