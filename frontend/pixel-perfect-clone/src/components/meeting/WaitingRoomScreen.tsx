"use client";

import React, { useState, useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Video, VideoOff, Sparkles, LogIn, LogOut, User } from "lucide-react";
import { useMeeting } from "./MeetingContext";

export function WaitingRoomScreen() {
  const { meeting, myParticipant } = useMeeting();
  
  // Interactive state for preview mic/video buttons
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle local camera preview capturing when videoOn is toggled
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    if (videoOn) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(s => {
          activeStream = s;
          setStream(s);
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(err => {
          console.warn("Failed to capture preview stream:", err);
          setVideoOn(false);
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
        setStream(null);
      }
    }
    
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [videoOn]);

  if (!meeting || !myParticipant) return null;

  const handleLeave = () => {
    localStorage.removeItem("zoom_display_name");
    localStorage.removeItem("zoom_is_host");
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col text-zinc-800 font-sans select-none overflow-y-auto animate-in fade-in duration-500 pb-6 pt-16 relative">
      
      {/* Floating Video Preview Card (Top Left Corner) */}
      <div className="absolute top-6 left-6 w-[260px] aspect-[16/10] bg-[#111116] border border-zinc-800/10 rounded-[20px] flex flex-col justify-between p-3.5 shadow-lg select-none z-20 overflow-hidden">
        {/* Live Camera Preview or Initials Screen */}
        <div className="flex-1 flex flex-col items-center justify-center text-center relative w-full h-full">
          {videoOn ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="absolute inset-0 w-full h-full object-cover rounded-[20px] z-0"
            />
          ) : (
            <div className="flex flex-col items-center justify-center z-10">
              <div className="w-12 h-12 rounded-[14px] bg-[#2d2d2d] border border-zinc-700/30 flex items-center justify-center font-bold text-white text-base shadow mb-1.5">
                {myParticipant.display_name.substring(0, 2).toUpperCase()}
              </div>
              <p className="text-white font-bold text-[13px] tracking-wide mt-1 capitalize drop-shadow">
                {myParticipant.display_name}
              </p>
            </div>
          )}
        </div>
        
        {/* Toggle Controls (Mic, Video, Profile) */}
        <div className="flex items-center justify-center gap-2.5 z-10 w-full pt-2">
          {/* Microphone Toggle */}
          <button 
            onClick={() => setMicOn(!micOn)}
            className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-all ${
              micOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-[#E02424] hover:bg-[#C81E1E] text-white"
            }`}
            title={micOn ? "Mute Microphone" : "Unmute Microphone"}
          >
            {micOn ? (
              <Mic className="w-4 h-4" />
            ) : (
              <MicOff className="w-4 h-4" />
            )}
          </button>

          {/* Camera Toggle */}
          <button 
            onClick={() => setVideoOn(!videoOn)}
            className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-all ${
              videoOn ? "bg-white/10 hover:bg-white/20 text-white" : "bg-[#E02424] hover:bg-[#C81E1E] text-white"
            }`}
            title={videoOn ? "Turn Camera Off" : "Turn Camera On"}
          >
            {videoOn ? (
              <Video className="w-4 h-4" />
            ) : (
              <VideoOff className="w-4 h-4" />
            )}
          </button>

          {/* Profile Card Action Toggle */}
          <button 
            className="w-[34px] h-[34px] rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            title="Profile details"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Centered Information panel */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-4xl mx-auto px-6 py-12 text-center">
        
        {/* Centered Title */}
        <h1 className="text-2xl md:text-[26px] font-bold text-zinc-900 leading-tight max-w-2xl font-sans mt-8">
          {meeting.title}
        </h1>
        
        {/* Scheduled time */}
        <p className="text-[#747487] text-[13px] font-medium tracking-wide mt-1.5">
          Scheduled: {meeting.scheduled_at ? new Date(meeting.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "1:00 PM"}
        </p>

        {/* Waiting Status with light-blue spinner */}
        <div className="flex items-center justify-center gap-2.5 text-[14px] font-semibold text-zinc-700 mt-8">
          <span>Waiting for the host to start the meeting.</span>
          <div className="w-[14px] h-[14px] rounded-full border-[2.2px] border-zinc-200 border-t-[#0E71EB] animate-spin shrink-0" />
        </div>

        {/* Links: Host Sign In / Exit */}
        <div className="flex items-center justify-center gap-4 text-[13px] font-bold text-[#0E71EB] mt-4">
          <button className="hover:underline cursor-pointer">
            Host Sign In
          </button>
          <span className="text-zinc-300 font-normal">|</span>
          <button 
            onClick={handleLeave}
            className="hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Exit</span>
            <svg className="w-3.5 h-3.5 stroke-current stroke-[2.5] fill-none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
          </button>
        </div>

        {/* Premium Zoom AI Companion Banner */}
        <div className="w-full max-w-[800px] bg-gradient-to-r from-[#E6EFFF] via-[#EDF0FF] to-[#F5EBFF] border border-[#DCE4F5] rounded-[24px] p-8 md:p-10 shadow-sm mt-10 relative overflow-hidden flex flex-col items-center justify-center">
          {/* Header Title */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="text-[#0E71EB] w-7 h-7 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 fill-current animate-pulse" />
            </div>
            <h2 className="text-xl md:text-[22px] font-extrabold text-[#0B0B1E] tracking-tight leading-none">
              Work Happy with <span className="text-[#0E71EB]">zoom AI Companion</span>
            </h2>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-[720px]">
            {/* Card 1 */}
            <div className="bg-white border border-[#E2E8F5] p-5 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 group cursor-pointer text-left">
              <div className="w-[34px] h-[34px] rounded-full bg-[#EBF2FF] text-[#0E71EB] flex items-center justify-center group-hover:bg-[#0E71EB] group-hover:text-white transition-all duration-300 shrink-0">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <p className="text-[12px] font-extrabold text-zinc-800 leading-snug group-hover:text-zinc-950 transition-colors">
                Summarize recent messages
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-[#E2E8F5] p-5 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 group cursor-pointer text-left">
              <div className="w-[34px] h-[34px] rounded-full bg-[#ECEFFF] text-[#4F46E5] flex items-center justify-center group-hover:bg-[#4F46E5] group-hover:text-white transition-all duration-300 shrink-0">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <p className="text-[12px] font-extrabold text-zinc-800 leading-snug group-hover:text-zinc-950 transition-colors">
                List my action items
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-[#E2E8F5] p-5 rounded-[20px] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col gap-3 group cursor-pointer text-left">
              <div className="w-[34px] h-[34px] rounded-full bg-[#F5EBFF] text-[#9333EA] flex items-center justify-center group-hover:bg-[#9333EA] group-hover:text-white transition-all duration-300 shrink-0">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <p className="text-[12px] font-extrabold text-zinc-800 leading-snug group-hover:text-zinc-950 transition-colors">
                Show me the meeting highlights
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Centered footer */}
      <footer className="text-[10px] text-zinc-400 font-semibold mt-auto pt-10 pb-4 text-center w-full">
        <p>
          © 2026 Zoom Communications, Inc. All rights reserved.{" "}
          <span className="hover:underline cursor-pointer">Privacy & Legal Policies</span> |{" "}
          <span className="hover:underline cursor-pointer">Send Report</span>
        </p>
      </footer>
    </div>
  );
}
