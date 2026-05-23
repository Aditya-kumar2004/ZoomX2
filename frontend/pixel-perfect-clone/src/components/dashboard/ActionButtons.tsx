"use client";

import { useState } from "react";
import { Plus, Users, Calendar, ArrowUpSquare } from "lucide-react";
import { JoinMeetingModal } from "./JoinMeetingModal";
import { ScheduleMeetingModal } from "./ScheduleMeetingModal";
import { NewMeetingModal } from "./NewMeetingModal";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { handleComingSoon } from "@/lib/utils";

export function ActionButtons() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const router = useRouter();

  // handleNewMeeting moved to NewMeetingModal

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12">
        {/* New Meeting Button (Orange) */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setIsNewMeetingOpen(true)}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#FF742E] hover:bg-[#e06121] transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            <Plus className="w-10 h-10 md:w-12 md:h-12" />
          </button>
          <span className="text-sm font-semibold text-slate-700">
            New Meeting
          </span>
        </div>

        {/* Join Button (Blue) */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setIsJoinOpen(true)}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0B5CFF] hover:bg-[#094bdd] transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <Plus className="w-10 h-10 md:w-12 md:h-12" />
          </button>
          <span className="text-sm font-semibold text-slate-700">Join</span>
        </div>

        {/* Schedule Button (Blue) */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={() => setIsScheduleOpen(true)}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0B5CFF] hover:bg-[#094bdd] transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <Calendar className="w-9 h-9 md:w-10 md:h-10" />
          </button>
          <span className="text-sm font-semibold text-slate-700">Schedule</span>
        </div>

        {/* Share Screen Button (Blue) */}
        <div className="flex flex-col items-center gap-3">
          <button 
            onClick={() => handleComingSoon("Direct Dashboard Screen Share")}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl bg-[#0B5CFF] hover:bg-[#094bdd] transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center text-white focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <ArrowUpSquare className="w-9 h-9 md:w-10 md:h-10" />
          </button>
          <span className="text-sm font-semibold text-slate-700">Share Screen</span>
        </div>
      </div>

      <JoinMeetingModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <ScheduleMeetingModal isOpen={isScheduleOpen} onClose={() => setIsScheduleOpen(false)} />
      <NewMeetingModal isOpen={isNewMeetingOpen} onClose={() => setIsNewMeetingOpen(false)} />
    </>
  );
}
