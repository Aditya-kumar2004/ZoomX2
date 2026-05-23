"use client";

import React from "react";
import { useMeeting } from "./MeetingContext";
import { Shield, ChevronUp, X, Copy } from "lucide-react";
import { toast } from "sonner";

export function ConnectionStatus() {
  const { meeting, showDetails, setShowDetails, elapsedTime } = useMeeting();

  if (!meeting) return null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/join?id=${meeting.meeting_id}`);
      toast.success("Invite link copied!");
    }
  };

  return (
    <div className="h-[40px] bg-[#1A1A1A] flex items-center justify-between px-4 text-white border-b border-gray-800">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="bg-green-500 w-4 h-4 rounded text-black flex items-center justify-center">
            <Shield className="w-3 h-3" />
          </div>
          <span className="text-[13px] font-semibold text-green-500 flex items-center gap-2">
            LIVE <span className="text-white font-medium">Instant Meeting</span>
          </span>
        </div>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-[11px] bg-[#2D2D2D] hover:bg-[#3D3D3D] px-2 py-1 rounded border border-gray-700 transition-colors"
        >
          Details <ChevronUp className={`w-3 h-3 transition-transform ${showDetails ? "" : "rotate-180"}`} />
        </button>
        
        {showDetails && (
          <div className="absolute top-12 left-4 bg-[#242424] border border-gray-700 rounded-xl p-6 shadow-2xl z-50 w-80 text-white animate-in slide-in-from-top-2">
             <div className="flex justify-between items-start mb-5">
               <h3 className="font-bold text-[15px]">Meeting Information</h3>
               <button onClick={() => setShowDetails(false)} className="text-gray-400 hover:text-white transition-colors">
                 <X size={18} />
               </button>
             </div>
             <div className="space-y-4 text-sm">
               <div>
                 <p className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Meeting ID</p>
                 <p className="font-mono text-lg font-medium">{meeting.meeting_id}</p>
               </div>
               <div>
                 <p className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Host</p>
                 <p className="font-medium">{meeting.host_name}</p>
               </div>
               <div>
                 <p className="text-gray-400 mb-1 text-xs font-semibold uppercase tracking-wider">Invite Link</p>
                 <div className="flex items-center gap-2 mt-1">
                   <input
                     type="text"
                     readOnly
                     value={typeof window !== "undefined" ? `${window.location.origin}/join?id=${meeting.meeting_id}` : ""}
                     className="bg-[#111] border border-gray-700 text-gray-300 px-3 py-2 rounded-lg flex-1 outline-none text-[11px]"
                   />
                   <button
                     onClick={handleCopyLink}
                     className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white transition-colors"
                   >
                     <Copy size={16} />
                   </button>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-[13px] font-medium absolute left-1/2 -translate-x-1/2">
        <div className="px-3 py-1 bg-[#1A1A1A] border border-gray-700 rounded text-gray-300">
          {elapsedTime}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 text-[12px] bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition-colors shadow-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          {elapsedTime}
        </button>
      </div>
    </div>
  );
}
