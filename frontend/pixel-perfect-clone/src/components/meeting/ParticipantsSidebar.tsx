"use client";

import { useEffect, useState } from "react";
import { api, Meeting, Participant } from "@/lib/api";
import { Mic, MicOff, Video, Check, X } from "lucide-react";

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
    <div className="flex flex-col h-full bg-[#1C1C1C] text-gray-200">
      <div className="flex-1 overflow-y-auto">
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
          return (
            <div key={p.id} className="flex items-center justify-between p-3 hover:bg-[#2D2D2D] transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                  {p.display_name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {p.display_name} {isMe && "(You)"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-400">
                {/* Status indicators */}
                {p.is_muted ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4 text-green-500" />}
                <Video className="w-4 h-4 text-gray-500" />

                {/* Host Controls */}
                {isHost && !isMe && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                    <button 
                      onClick={() => handleMute(p.id)}
                      className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                    >
                      {p.is_muted ? "Unmute" : "Mute"}
                    </button>
                    <button 
                      onClick={() => handleRemove(p.id)}
                      className="text-xs bg-red-500/20 text-red-400 hover:bg-red-500/40 px-2 py-1 rounded"
                    >
                      Remove
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
