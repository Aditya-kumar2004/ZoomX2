"use client";

import { useState } from "react";
import { X, Clock, Loader2, Video, Key } from "lucide-react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

interface NewMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewMeetingModal({ isOpen, onClose }: NewMeetingModalProps) {
  const [duration, setDuration] = useState("60");
  const [usePMI, setUsePMI] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsStarting(true);
      toast.loading("Connecting to server...");
      
      // Wait for the API call to complete
      const pmiId = usePMI ? "853-291-4072" : undefined;
      const storedName = localStorage.getItem("zoom_user_name") || "John Doe";
      const meeting = await api.createInstantMeeting(storedName, parseInt(duration), pmiId);
      
      toast.dismiss();
      toast.success("Meeting created! Redirecting...", {
        action: {
          label: 'Copy Link',
          onClick: () => navigator.clipboard.writeText(`${window.location.origin}/join?id=${meeting.meeting_id}`)
        },
        duration: 2000
      });
      
      // Store host flag — host skips the name-entry form
      localStorage.setItem('zoom_is_host', 'true');
      localStorage.removeItem('zoom_display_name');
      
      // Delay navigation slightly so toast is visible and React can render it
      setTimeout(() => {
        window.location.href = `/meeting/${meeting.meeting_id}`;
      }, 1000);
      
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || "Failed to create meeting");
      setIsStarting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-800">Start a Meeting</h2>
          <button 
            onClick={onClose}
            disabled={isStarting}
            className="p-1.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleStart} className="p-6">
          <div className="space-y-6">
            
            {/* Toggles */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <Video className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-zinc-700">Start with video</span>
                </div>
                <Switch checked={videoOn} onCheckedChange={setVideoOn} disabled={isStarting} />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-zinc-700">Use Personal Meeting ID</span>
                    <span className="block text-xs text-zinc-500 font-mono mt-0.5">853 291 4072</span>
                  </div>
                </div>
                <Switch checked={usePMI} onCheckedChange={setUsePMI} disabled={isStarting} />
              </div>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Duration Select */}
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">
                Meeting Duration
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  disabled={isStarting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 focus:border-[#0B5CFF] focus:ring-4 focus:ring-[#0B5CFF]/10 text-zinc-700 text-sm font-medium appearance-none bg-white transition-all outline-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">1 Hour</option>
                  <option value="120">2 Hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isStarting}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isStarting}
              className="flex-[2] px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0B5CFF] hover:bg-[#094bdd] transition-all shadow-lg hover:shadow-[#0B5CFF]/25 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isStarting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Meeting"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
