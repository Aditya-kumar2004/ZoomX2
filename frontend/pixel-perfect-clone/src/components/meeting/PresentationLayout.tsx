"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { ParticipantTile } from "./ParticipantTile";
import { Loader2 } from "lucide-react";

export function PresentationLayout() {
  const {
    participants,
    screenSharerName,
    screenStream,
    remoteStreams,
    swappedMainParticipantId,
    setSwappedMainParticipantId,
    myNameRef
  } = useMeeting();

  const admitted = participants.filter(p => p.status === "admitted");
  const isLocalScreenShare = screenSharerName === myNameRef.current;

  // Find who is the participant in the main large view
  let mainViewContent = null;

  if (swappedMainParticipantId === null) {
    // Show screen share in the main view
    mainViewContent = (
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-black border border-gray-800 flex items-center justify-center">
        {isLocalScreenShare ? (
          <video
            ref={(el) => {
              if (el && screenStream) {
                if (el.srcObject !== screenStream) {
                  el.srcObject = screenStream;
                }
              }
            }}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : remoteStreams.has(screenSharerName || "") ? (
          <video
            ref={(el) => {
              if (el && screenSharerName) {
                const stream = remoteStreams.get(screenSharerName);
                if (stream && el.srcObject !== stream) {
                  el.srcObject = stream;
                }
              }
            }}
            autoPlay
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <span>Connecting Screen Share...</span>
          </div>
        )}
        
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{screenSharerName}&apos;s Screen Share (Presentation Mode)</span>
        </div>
      </div>
    );
  } else {
    // Show swapped participant in the main view
    const swappedP = admitted.find(p => p.id === swappedMainParticipantId);
    if (swappedP) {
      mainViewContent = (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-800">
          <ParticipantTile p={swappedP} isLarge />
          <button
            onClick={() => setSwappedMainParticipantId(null)}
            className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs font-semibold text-white transition-all z-20"
          >
            Reset to Screen Share
          </button>
        </div>
      );
    }
  }

  // Renders side strip cards (filmstrip)
  const renderFilmstripCards = () => {
    const cards: React.ReactNode[] = [];
    
    // If swapped, the screen share becomes a card in the filmstrip
    if (swappedMainParticipantId !== null && screenSharerName) {
      cards.push(
        <div
          key="screenshare-card"
          onClick={() => setSwappedMainParticipantId(null)}
          className="relative bg-black border border-gray-700 rounded-xl overflow-hidden cursor-pointer aspect-video shrink-0 group hover:border-blue-500 transition-all w-[160px] md:w-full h-full md:h-auto"
        >
          {isLocalScreenShare ? (
            <video
              ref={(el) => {
                if (el && screenStream) {
                  if (el.srcObject !== screenStream) {
                    el.srcObject = screenStream;
                  }
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : remoteStreams.has(screenSharerName) ? (
            <video
              ref={(el) => {
                if (el) {
                  const stream = remoteStreams.get(screenSharerName);
                  if (stream && el.srcObject !== stream) {
                    el.srcObject = stream;
                  }
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-[10px]">
              Connecting...
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 bg-black/85 px-2 py-1 text-white text-[11px] font-semibold truncate flex items-center justify-between">
            <span>{screenSharerName}&apos;s Screen</span>
            <span className="text-blue-400 text-[9px] uppercase tracking-wider">Focus</span>
          </div>
        </div>
      );
    }

    // Render other participants in filmstrip
    admitted.forEach(p => {
      if (p.id === swappedMainParticipantId) return; // already in main view
      cards.push(
        <div
          key={`filmstrip-p-${p.id}`}
          onClick={() => setSwappedMainParticipantId(p.id)}
          className="cursor-pointer aspect-video shrink-0 w-[160px] md:w-full h-full md:h-auto hover:scale-[1.02] transition-transform duration-200"
        >
          <ParticipantTile p={p} />
        </div>
      );
    });

    return cards;
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-3 overflow-hidden">
      {/* Large Main Presentation Area */}
      <div className="flex-1 h-full min-w-0">
        {mainViewContent}
      </div>

      {/* Scrollable Filmstrip Area (Right side or bottom, responsive) */}
      <div className="w-full md:w-[260px] h-[110px] md:h-full overflow-x-auto md:overflow-y-auto pb-1 md:pb-0 pr-1 flex flex-row md:flex-col gap-2 shrink-0 select-none scrollbar-thin">
        {renderFilmstripCards()}
      </div>
    </div>
  );
}
