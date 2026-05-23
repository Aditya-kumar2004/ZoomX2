"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { ParticipantTile } from "./ParticipantTile";

export function PinnedSpeakerLayout() {
  const { participants, pinnedParticipantId, setPinnedParticipantId, activeSpeaker } = useMeeting();

  const admitted = participants.filter(p => p.status === "admitted");

  const featuredP = pinnedParticipantId
    ? admitted.find(p => p.id === pinnedParticipantId)
    : admitted.find(p => p.display_name === activeSpeaker);

  if (!featuredP) return null;

  const otherParticipants = admitted.filter(p => p.id !== featuredP.id);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Large Featured Tile */}
      <div className="flex-1 min-h-0 relative rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center">
        <ParticipantTile p={featuredP} isLarge />
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white flex items-center gap-2 z-20">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>{pinnedParticipantId ? "Pinned Speaker" : "Active Speaker"} ({featuredP.display_name})</span>
        </div>
      </div>

      {/* Horizontal Scrollable Filmstrip at Bottom */}
      {otherParticipants.length > 0 && (
        <div className="h-[120px] shrink-0 mt-3 flex gap-2 overflow-x-auto py-1 select-none scrollbar-thin">
          {otherParticipants.map(p => (
            <div
              key={`speaker-other-${p.id}`}
              onClick={() => setPinnedParticipantId(p.id)}
              className="h-full aspect-video shrink-0 cursor-pointer hover:scale-[1.02] transition-transform duration-200"
            >
              <ParticipantTile p={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
