"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { useMeetingControls } from "@/hooks/useMeetingControls";
import { useScreenShare } from "@/hooks/useScreenShare";
import { handleComingSoon } from "@/lib/utils";
import {
  Mic,
  MicOff,
  Video,
  PhoneOff,
  Shield,
  Users,
  MessageSquare,
  ArrowUpFromLine,
  AppWindow,
  CircleDot,
  Maximize,
  Smile
} from "lucide-react";

export function MeetingToolbar() {
  const {
    isMicOn,
    isVideoOn,
    isScreenSharing,
    myParticipant,
    activeSidebar,
    chatNotif,
    participants,
    showReactionsMenu,
    setShowReactionsMenu,
    meeting
  } = useMeeting();

  const { toggleMic, toggleVideo, toggleSidebar, handleReaction, handleLeave } = useMeetingControls();
  const { handleShareScreen } = useScreenShare();

  const isHost = meeting?.host_name === myParticipant?.display_name;
  const admittedCount = participants.filter(p => p.status === "admitted").length;

  return (
    <div className="h-[80px] bg-transparent flex items-center justify-between px-6 shrink-0 z-20 relative">
      <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex items-center gap-1 bg-[#111]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2 shadow-2xl shadow-black/60">
        
        {/* Mic Button */}
        <button
          onClick={toggleMic}
          className={`group flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 relative ${
            myParticipant?.is_muted || !isMicOn
              ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
              : "hover:bg-white/10 text-white"
          }`}
        >
          {myParticipant?.is_muted || !isMicOn ? (
            <MicOff className="w-5 h-5 mb-1" />
          ) : (
            <Mic className="w-5 h-5 mb-1" />
          )}
          <span className="text-[9px] font-medium leading-none opacity-70">
            {myParticipant?.is_muted || !isMicOn ? "Unmute" : "Mute"}
          </span>
        </button>

        {/* Video Button */}
        <button
          onClick={toggleVideo}
          className={`group flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
            !isVideoOn ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" : "hover:bg-white/10 text-white"
          }`}
        >
          {!isVideoOn ? (
            <PhoneOff className="w-5 h-5 mb-1" />
          ) : (
            <Video className="w-5 h-5 mb-1" />
          )}
          <span className="text-[9px] font-medium leading-none opacity-70">
            {!isVideoOn ? "Start Video" : "Stop Video"}
          </span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Security */}
        <button 
          onClick={() => handleComingSoon("Meeting Security Settings")}
          className="flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 border-0 cursor-pointer bg-transparent"
        >
          <Shield className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-none opacity-70">Security</span>
        </button>

        {/* Participants */}
        <button
          onClick={() => toggleSidebar("participants")}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 relative ${
            activeSidebar === "participants"
              ? "bg-blue-500/20 text-blue-400 shadow-inner"
              : "hover:bg-white/10 text-gray-400 hover:text-white"
          }`}
        >
          <div className="relative">
            <Users className="w-5 h-5 mb-1" />
            <span className="absolute -top-1.5 -right-2.5 bg-blue-500 text-[8px] px-1 rounded-full text-white font-bold min-w-[14px] text-center">
              {admittedCount}
            </span>
          </div>
          <span className="text-[9px] font-medium leading-none opacity-70 mt-1">Participants</span>
        </button>

        {/* Chat */}
        <button
          onClick={() => toggleSidebar("chat")}
          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 relative ${
            activeSidebar === "chat" ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/10 text-gray-400 hover:text-white"
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-none opacity-70">Chat</span>
          {/* Unread dot */}
          {chatNotif && activeSidebar !== "chat" && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Share Screen */}
        <button
          onClick={handleShareScreen}
          className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-all duration-200 ${
            isScreenSharing
              ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
              : "text-emerald-400 hover:bg-emerald-500/10"
          }`}
        >
          <ArrowUpFromLine className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-none opacity-70">
            {isScreenSharing ? "Stop Share" : "Share Screen"}
          </span>
        </button>

        {/* Polling */}
        <button 
          onClick={() => handleComingSoon("Live Audience Polling & Q&A")}
          className="hidden md:flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 border-0 cursor-pointer bg-transparent"
        >
          <AppWindow className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-none opacity-70">Polling</span>
        </button>

        {/* Record */}
        <button 
          onClick={() => handleComingSoon("Cloud Meeting Recording")}
          className="hidden md:flex flex-col items-center justify-center w-14 h-14 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 border-0 cursor-pointer bg-transparent"
        >
          <CircleDot className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-none opacity-70">Record</span>
        </button>

        {/* Breakout Rooms */}
        <button 
          onClick={() => handleComingSoon("Breakout Group Session Rooms")}
          className="hidden lg:flex flex-col items-center justify-center w-[68px] h-14 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 border-0 cursor-pointer bg-transparent"
        >
          <Maximize className="w-5 h-5 mb-1" />
          <span className="text-[9px] font-medium leading-none opacity-70">Breakout Rooms</span>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-white/10 mx-1" />

        {/* Reactions */}
        <div className="relative">
          <button
            onClick={() => setShowReactionsMenu(!showReactionsMenu)}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-200 ${
              showReactionsMenu ? "bg-white/10 text-white" : "hover:bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            <Smile className="w-5 h-5 mb-1" />
            <span className="text-[9px] font-medium leading-none opacity-70">Reactions</span>
          </button>

          {showReactionsMenu && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-2 shadow-2xl animate-in slide-in-from-bottom-2 duration-150">
              {["👍", "❤️", "😂", "😮", "🎉", "👏"].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-1.5 rounded-xl hover:bg-white/10"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Leave / End Meeting — right side */}
      <div className="absolute right-6 bottom-4 flex items-center gap-2">
        <button
          onClick={handleLeave}
          className="text-[12px] font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2.5 rounded-xl transition-all hidden sm:block"
        >
          Leave
        </button>
        <button
          onClick={handleLeave}
          className="text-[12px] font-bold text-white px-5 py-2.5 rounded-xl transition-all shadow-lg"
          style={{ background: "linear-gradient(135deg, #e02828, #c91f1f)" }}
        >
          {isHost ? "End Meeting" : "Leave"}
        </button>
      </div>
    </div>
  );
}
