"use client";

import { useState } from "react";
import { X, Hash, User, Loader2, MicOff, VideoOff } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { formatMeetingId } from "@/lib/utils";


interface JoinMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function JoinMeetingModal({ isOpen, onClose }: JoinMeetingModalProps) {
  const [meetingId, setMeetingId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [nameError, setNameError] = useState("");
  const [noAudio, setNoAudio] = useState(false);
  const [noVideo, setNoVideo] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMeetingId = meetingId.trim();
    if (!cleanMeetingId) return;

    if (!displayName.trim()) {
      setNameError("Name is compulsory");
      return;
    }

    setNameError("");

    try {
      setIsJoining(true);
      toast.loading("Validating meeting...", { id: "join-toast" });
      
      const formattedMeetingId = formatMeetingId(cleanMeetingId);
      
      const validation = await api.validateMeeting(formattedMeetingId);
      if (!validation.valid) {
        toast.dismiss("join-toast");
        toast.error(`Cannot join: ${validation.error}`);
        setIsJoining(false);
        return;
      }

      toast.loading("Joining meeting...", { id: "join-toast" });
      await api.joinMeeting(formattedMeetingId, displayName);
      
      // Store preferences
      localStorage.setItem('zoom_initial_video_on', noVideo ? 'false' : 'true');
      localStorage.setItem('zoom_initial_mic_on', noAudio ? 'false' : 'true');
      localStorage.setItem('zoom_display_name', displayName);
      localStorage.removeItem('zoom_is_host'); // ensure not treated as host
      
      toast.dismiss("join-toast");
      toast.success("Joined successfully! Redirecting...");
      
      setTimeout(() => {
        window.location.href = `/meeting/${formattedMeetingId}`;
      }, 500);
    } catch (error: any) {
      toast.dismiss("join-toast");
      toast.error(error.message || "Failed to join meeting");
      setIsJoining(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-800">Join Meeting</h2>
          <button 
            onClick={onClose}
            disabled={isJoining}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleJoin} className="p-6">
          <div className="space-y-5">
            
            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Meeting ID or Personal Link
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. 123-456-789"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    disabled={isJoining}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0B5CFF] focus:ring-4 focus:ring-[#0B5CFF]/10 text-zinc-800 text-sm font-medium outline-none transition-all disabled:opacity-70 disabled:bg-zinc-50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      if (e.target.value.trim()) {
                        setNameError("");
                      }
                    }}
                    disabled={isJoining}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      nameError 
                        ? "border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" 
                        : "border-zinc-200 focus:border-[#0B5CFF] focus:ring-4 focus:ring-[#0B5CFF]/10"
                    } text-zinc-800 text-sm font-medium outline-none transition-all disabled:opacity-70 disabled:bg-zinc-50`}
                  />
                </div>
                {nameError && (
                  <p className="text-red-500 text-xs font-semibold mt-1.5 animate-in fade-in slide-in-from-top-1 flex items-center gap-1">
                    <span>⚠️</span> {nameError}
                  </p>
                )}
              </div>
            </div>

            <div className="h-px bg-zinc-100 my-2" />

            {/* Toggles */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                    <MicOff className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">Do not connect to audio</span>
                </div>
                <Switch checked={noAudio} onCheckedChange={setNoAudio} disabled={isJoining} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                    <VideoOff className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">Turn off my video</span>
                </div>
                <Switch checked={noVideo} onCheckedChange={setNoVideo} disabled={isJoining} />
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isJoining}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isJoining || !meetingId.trim()}
              className="flex-[2] px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0B5CFF] hover:bg-[#094bdd] transition-all shadow-lg hover:shadow-[#0B5CFF]/25 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
