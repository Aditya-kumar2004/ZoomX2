"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useMeeting } from "./MeetingContext";

export function WaitingRoomScreen() {
  const { meeting, myParticipant } = useMeeting();

  if (!meeting || !myParticipant) return null;

  return (
    <div className="h-screen w-screen bg-[#1A1A1A] flex flex-col items-center justify-center text-white p-4 text-center animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="w-20 h-20 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Please wait...</h2>
        <p className="text-gray-400 text-base">The meeting host will let you in soon.</p>
        <p className="text-gray-600 text-sm mt-2">{meeting.title} &bull; {myParticipant.display_name}</p>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("zoom_display_name");
          localStorage.removeItem("zoom_is_host");
          window.location.href = "/dashboard";
        }}
        className="text-sm text-gray-500 hover:text-red-400 transition-colors border border-gray-700 px-4 py-2 rounded-lg"
      >
        Leave Waiting Room
      </button>
    </div>
  );
}
