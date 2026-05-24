"use client";

import React, { useState } from "react";
import { useMeeting } from "./MeetingContext";
import { Shield, ChevronUp, X, Copy, Mail, Clock, Check } from "lucide-react";
import { toast } from "sonner";
import { useMeetingControls } from "@/hooks/useMeetingControls";

export function ConnectionStatus() {
  const { meeting, showDetails, setShowDetails, elapsedTime, myParticipant } = useMeeting();
  const { handleLeave } = useMeetingControls();
  const [copiedId, setCopiedId] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!meeting) return null;

  const isHost = meeting.host_name === myParticipant?.display_name;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/join?id=${meeting.meeting_id}`);
      toast.success("Invite link copied!");
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyId = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(meeting.meeting_id);
      toast.success("Meeting ID copied!");
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className="h-[40px] bg-[#1A1A1A] flex items-center justify-between px-3 sm:px-4 text-white border-b border-gray-800 select-none">
      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1.5">
          <div className="bg-green-500 w-4 h-4 rounded text-black flex items-center justify-center">
            <Shield className="w-3 h-3" />
          </div>
          <span className="text-[12px] sm:text-[13px] font-semibold text-green-500 flex items-center gap-1">
            LIVE <span className="hidden sm:inline text-white font-medium">Instant Meeting</span>
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-center bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-semibold rounded border border-blue-500/30 transition-all w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 text-[11px]"
          title="Meeting Details"
        >
          <span className="hidden sm:inline mr-1">Meeting Details</span>
          <span className="sm:hidden text-[11px] font-bold font-serif">i</span>{" "}
          <ChevronUp className={`hidden sm:inline w-3 h-3 text-blue-400 transition-transform ${showDetails ? "" : "rotate-180"}`} />
        </button>
        
        {showDetails && (
          <div className="absolute top-12 left-4 right-4 sm:right-auto sm:w-80 bg-[#242424] border border-gray-700 rounded-2xl p-5 sm:p-6 shadow-2xl z-50 text-white animate-in slide-in-from-top-2">
             <div className="flex justify-between items-start mb-5">
               <h3 className="font-bold text-[15px]">Meeting Information</h3>
               <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white transition-colors">
                 <X size={18} />
               </button>
             </div>
             <div className="space-y-4 text-sm">
               <div>
                 <p className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Meeting ID</p>
                 <div className="flex items-center justify-between bg-[#111] border border-gray-700 rounded-xl px-3 py-2">
                   <p className="font-mono text-lg font-bold text-white tracking-wider">{meeting.meeting_id}</p>
                    <button
                      onClick={handleCopyId}
                      className="text-gray-400 hover:text-white hover:bg-zinc-800 p-1.5 rounded-lg transition-colors flex items-center justify-center"
                      title="Copy Meeting ID"
                    >
                      {copiedId ? (
                        <Check size={15} className="text-green-400 animate-in zoom-in-50" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                 </div>
               </div>
               <div>
                 <p className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Host</p>
                 <p className="font-medium bg-[#111] border border-gray-700 rounded-xl px-3 py-2">{meeting.host_name}</p>
               </div>
               <div>
                 <p className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Invite Link</p>
                 <div className="flex items-center gap-2 mt-1">
                   <input
                     type="text"
                     readOnly
                     value={typeof window !== "undefined" ? `${window.location.origin}/join?id=${meeting.meeting_id}` : ""}
                     className="bg-[#111] border border-gray-700 text-gray-300 px-3 py-2 rounded-xl flex-1 outline-none text-[11px] font-mono"
                   />
                    <button
                      onClick={handleCopyLink}
                      className="bg-blue-600 hover:bg-blue-700 p-2.5 rounded-xl text-white transition-colors flex items-center justify-center"
                      title="Copy Invite Link"
                    >
                      {copiedLink ? (
                        <Check size={15} className="text-green-400 animate-in zoom-in-50" />
                      ) : (
                        <Copy size={15} />
                      )}
                    </button>
                 </div>
               </div>

               <div className="pt-3 border-t border-gray-800/80 space-y-2">
                 <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-2">Share Invitation</p>
                 <div className="grid grid-cols-2 gap-2">
                   {/* Share on WhatsApp */}
                   <a
                     href={typeof window !== "undefined" ? `https://api.whatsapp.com/send?text=${encodeURIComponent(
                       `Join my ZoomX Meeting!\n\nMeeting ID: ${meeting.meeting_id}\nInvite Link: ${window.location.origin}/join?id=${meeting.meeting_id}`
                     )}` : "#"}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center justify-center gap-2 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/30 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                   >
                     <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
                       <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.967C16.528 2.01 14.07 1.045 11.58 1.045 6.137 1.045 1.71 5.414 1.707 10.84c-.001 1.637.452 3.235 1.311 4.674l-.993 3.626 3.73-.976.302.18z" />
                     </svg>
                     <span>WhatsApp</span>
                   </a>
                   {/* Share via Email */}
                   <a
                     href={typeof window !== "undefined" ? `mailto:?subject=${encodeURIComponent(
                       `Invitation to ZoomX Meeting: ${meeting.title}`
                     )}&body=${encodeURIComponent(
                       `Hi there,\n\nYou are invited to a ZoomX meeting.\n\nMeeting ID: ${meeting.meeting_id}\nInvite Link: ${window.location.origin}/join?id=${meeting.meeting_id}\n\nJoin us now!`
                     )}` : "#"}
                     className="flex items-center justify-center gap-2 bg-[#EA4335]/10 text-[#EA4335] hover:bg-[#EA4335]/20 border border-[#EA4335]/30 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                   >
                     <Mail size={14} />
                     <span>Email</span>
                   </a>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-[12px] font-medium absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-800/60 border border-zinc-700/50 rounded-full text-zinc-300 backdrop-blur-sm select-none font-mono">
          <Clock className="w-3.5 h-3.5 text-zinc-400" />
          <span>{elapsedTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2">
        <div className="flex items-center gap-1.5 bg-red-600/10 text-red-400 border border-red-500/20 px-2 sm:px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-bold select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
          <span className="tracking-wide">REC</span>
        </div>
        {/* Sleek, red Zoom-style End/Leave button on mobile */}
        <button
          onClick={handleLeave}
          className="md:hidden text-[10px] font-black text-white px-2.5 py-1 rounded bg-red-600 hover:bg-red-500 transition-colors border-0 uppercase tracking-wider shrink-0 cursor-pointer shadow-md shadow-red-600/20 font-sans"
        >
          {isHost ? "End" : "Leave"}
        </button>
      </div>
    </div>
  );
}
