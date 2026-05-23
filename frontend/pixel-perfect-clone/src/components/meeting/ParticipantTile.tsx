"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { Participant } from "@/lib/api";
import { Mic, MicOff } from "lucide-react";

interface ParticipantTileProps {
  p: Participant;
  isLarge?: boolean;
}

export function ParticipantTile({ p, isLarge = false }: ParticipantTileProps) {
  const {
    myParticipant,
    isVideoOn,
    localStream,
    isScreenSharing,
    remoteStreams,
    remoteVideoRefs,
    reactions,
    activeSpeaker,
    pinnedParticipantId,
    setPinnedParticipantId,
    isMicOn,
    screenStream
  } = useMeeting();

  const isMe = p.display_name === myParticipant?.display_name;
  const isLocalVideo = isMe && ((isVideoOn && localStream) || isScreenSharing);
  const isSpeaking = activeSpeaker === p.display_name;
  const isPinned = pinnedParticipantId === p.id;

  const avatarColors = [
    "bg-blue-600",
    "bg-purple-600",
    "bg-green-600",
    "bg-orange-600",
    "bg-pink-600",
    "bg-teal-600",
    "bg-red-600",
    "bg-indigo-600",
    "bg-yellow-600"
  ];
  const avatarColor = avatarColors[p.id % avatarColors.length];

  return (
    <div
      className={`relative bg-[#1E1E1E] rounded-xl overflow-hidden flex items-center justify-center border transition-all duration-300 group ${
        isSpeaking ? "border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]" : "border-gray-800"
      }`}
      style={{
        width: "100%",
        height: "100%",
        aspectRatio: isLarge ? "16/9" : undefined,
        minHeight: isLarge ? "0" : "100px"
      }}
    >
      {/* Video or Avatar */}
      {isMe ? (
        isLocalVideo ? (
          <video
            key={isScreenSharing ? "screen" : "camera"}
            ref={(el) => {
              if (el) {
                const stream = isScreenSharing && screenStream ? screenStream : localStream;
                if (el.srcObject !== stream) {
                  el.srcObject = stream;
                }
              }
            }}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!isScreenSharing ? "scale-x-[-1]" : ""}`}
          />
        ) : (
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-white bg-blue-600 text-2xl">
            {p.display_name.substring(0, 2).toUpperCase()}
          </div>
        )
      ) : remoteStreams.has(p.display_name) ? (
        <video
          ref={(el) => {
            if (el) {
              remoteVideoRefs.current.set(p.display_name, el);
              const stream = remoteStreams.get(p.display_name);
              if (stream && el.srcObject !== stream) {
                el.srcObject = stream;
              }
            } else {
              remoteVideoRefs.current.delete(p.display_name);
            }
          }}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-white ${avatarColor} text-2xl`}>
          {p.display_name.substring(0, 2).toUpperCase()}
        </div>
      )}

      {/* Reaction overlay */}
      {reactions[p.id] && (
        <div className="absolute bottom-12 left-6 text-5xl animate-bounce pointer-events-none z-10">
          {reactions[p.id]}
        </div>
      )}

      {/* Pin overlay toggle on hover */}
      <div className="absolute top-2 right-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setPinnedParticipantId(isPinned ? null : p.id);
          }}
          className="text-white hover:text-blue-400 transition-colors p-1"
          title={isPinned ? "Unpin video" : "Pin video"}
        >
          <svg className={`w-4 h-4 ${isPinned ? "fill-blue-500 text-blue-500" : "text-gray-300"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </button>
      </div>

      {/* Name label */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-3 py-2 flex items-center justify-between z-10">
        <span className="text-white text-xs font-semibold truncate flex items-center gap-1.5">
          {p.display_name}
          {isMe ? " (You)" : ""}
          {isSpeaking && (
            <span className="flex items-center gap-0.5" title="Speaking">
              <span className="w-1 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="w-1 h-3.5 bg-blue-500 rounded-full animate-pulse delay-75" />
              <span className="w-1 h-1.5 bg-blue-500 rounded-full animate-pulse delay-150" />
            </span>
          )}
        </span>
        <div className="flex items-center gap-1">
          {p.is_muted || (isMe && !isMicOn) ? (
            <div className="bg-red-500/30 p-1 rounded-full border border-red-500/30">
              <MicOff className="w-3.5 h-3.5 text-red-400" />
            </div>
          ) : (
            <div className="bg-black/40 p-1 rounded-full">
              <Mic className="w-3.5 h-3.5 text-green-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
