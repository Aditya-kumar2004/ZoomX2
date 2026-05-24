"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { ParticipantTile } from "./ParticipantTile";

export function PinnedSpeakerLayout() {
  const { participants, pinnedParticipantId, setPinnedParticipantId, activeSpeaker, myNameRef } = useMeeting();

  const [isMobile, setIsMobile] = React.useState(false);
  const [isCameraSwapped, setIsCameraSwapped] = React.useState(false);

  React.useEffect(() => {
    const checkSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  const admitted = participants.filter(p => p.status === "admitted");

  // Premium Zoom mobile 2-participant overlay layout
  if (isMobile && admitted.length === 2) {
    const me = admitted.find(p => p.display_name === myNameRef.current) || admitted[0];
    const other = admitted.find(p => p.display_name !== myNameRef.current) || admitted[1];

    const backgroundParticipant = isCameraSwapped ? me : other;
    const pipParticipant = isCameraSwapped ? other : me;

    return (
      <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex items-center justify-center bg-black">
        {/* Background Full-Screen video */}
        <div className="absolute inset-0 w-full h-full">
          <ParticipantTile p={backgroundParticipant} isLarge />
        </div>

        {/* Floating badge for active speaker label */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white flex items-center gap-2 z-20">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>Active Speaker: {backgroundParticipant.display_name}</span>
        </div>

        {/* Floating Picture-in-Picture Card (Bottom-Right, styled beautifully) */}
        <div 
          onClick={() => setIsCameraSwapped(!isCameraSwapped)}
          className="absolute bottom-4 right-4 w-[100px] aspect-[9/16] sm:w-[120px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl hover:scale-[1.05] active:scale-[0.98] transition-all duration-300 z-30 cursor-pointer bg-zinc-900 group"
          title="Tap to swap camera"
        >
          <ParticipantTile p={pipParticipant} />
          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
            <svg className="w-5 h-5 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

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
