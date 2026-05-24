"use client";

import { useEffect, useState } from "react";
import { api, Meeting, Participant } from "@/lib/api";
import { Mic, MicOff, Video, Check, X, UserMinus } from "lucide-react";

interface ParticipantsSidebarProps {
  meeting: Meeting;
  participants: Participant[];
  currentUser: string;
  isHost: boolean;
}

export function ParticipantsSidebar({ meeting, participants, currentUser, isHost }: ParticipantsSidebarProps) {
  const waitingParticipants = participants.filter(p => p.status === 'waiting');
  const admittedParticipants = participants.filter(p => p.status === 'admitted');

  const handleMute = async (participantId: number) => {
    try {
      await api.muteParticipant(meeting.meeting_id, participantId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemove = async (participantId: number) => {
    try {
      await api.removeParticipant(meeting.meeting_id, participantId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdmit = async (participantId: number) => {
    try {
      await api.admitParticipant(meeting.meeting_id, participantId);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDecline = async (participantId: number) => {
    try {
      await api.declineParticipant(meeting.meeting_id, participantId);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1C1C1C] text-gray-200 overflow-x-hidden">
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {isHost && waitingParticipants.length > 0 && (
          <div className="mb-4">
            <div className="p-2 bg-yellow-500/10 text-yellow-500 text-xs font-semibold px-4">
              Waiting Room ({waitingParticipants.length})
            </div>
            {waitingParticipants.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 hover:bg-[#2D2D2D] transition-colors border-b border-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-500/20 text-gray-400 flex items-center justify-center font-bold text-xs">
                    {p.display_name.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{p.display_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleAdmit(p.id)} className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-medium transition-colors">
                    Admit
                  </button>
                  <button onClick={() => handleDecline(p.id)} className="text-gray-400 hover:text-red-400 p-1 rounded-full transition-colors">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-2 text-gray-400 text-xs font-semibold px-4 uppercase tracking-wider">
          In Meeting
        </div>
        
        {admittedParticipants.map((p) => {
          const isMe = p.display_name === currentUser;
          const isParticipantHost = p.display_name === meeting.host_name;
          return (
            <div key={p.id} className="flex items-center justify-between p-2.5 hover:bg-[#2D2D2D] transition-colors border-b border-gray-800/30 group">
              <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                <div className="w-7 h-7 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {p.display_name.substring(0, 2).toUpperCase()}
                </div>
                <span className="text-xs font-semibold truncate text-zinc-100" title={p.display_name}>
                  {p.display_name}{" "}
                  {(isMe || isParticipantHost) && (
                    <span className="text-zinc-500 font-normal">
                      ({[isMe ? "You" : "", isParticipantHost ? "Host" : ""].filter(Boolean).join(", ")})
                    </span>
                  )}
                </span>
              </div>
 
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Status indicators (only shown if not host controls, or if it is current user) */}
                {(!isHost || isMe) ? (
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    {p.is_muted ? <MicOff className="w-3.5 h-3.5 text-red-500" /> : <Mic className="w-3.5 h-3.5 text-green-500" />}
                    <Video className="w-3.5 h-3.5" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleMute(p.id)}
                      className={`flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-bold transition-all ${
                        p.is_muted 
                          ? "bg-emerald-950/40 text-emerald-400 hover:bg-emerald-950/60 hover:text-emerald-300 border border-emerald-900/30"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50"
                      }`}
                    >
                      {p.is_muted ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                      <span>{p.is_muted ? "Unmute" : "Mute"}</span>
                    </button>
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="flex items-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-bold bg-red-950/40 text-red-400 hover:bg-red-950/60 hover:text-red-300 transition-all border border-red-900/30"
                    >
                      <UserMinus className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
