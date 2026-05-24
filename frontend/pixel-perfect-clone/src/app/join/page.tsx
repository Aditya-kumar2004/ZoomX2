"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Loader2, Video, User, Hash } from "lucide-react";
import { formatMeetingId } from "@/lib/utils";


function JoinPageInner() {
  const searchParams = useSearchParams();
  const rawMeetingId = searchParams.get("id") || "";
  const meetingId = formatMeetingId(rawMeetingId);

  const [displayName, setDisplayName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [meetingInfo, setMeetingInfo] = useState<{ title: string; host_name: string } | null>(null);
  const [error, setError] = useState("");

  // Validate the meeting ID on page load
  useEffect(() => {
    if (!meetingId) {
      setError("No meeting ID provided in the link.");
      setIsValidating(false);
      return;
    }

    const validate = async () => {
      try {
        const res = await api.validateMeeting(meetingId);
        if (res.valid) {
          setMeetingInfo({ title: res.title || "Meeting", host_name: res.host_name || "John Doe" });
        } else {
          setError(
            res.error === "ended"
              ? "This meeting has already ended."
              : "This meeting does not exist."
          );
        }
      } catch {
        setError("Could not reach the server. Please try again.");
      } finally {
        setIsValidating(false);
      }
    };

    validate();
  }, [meetingId]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim() || !meetingId) return;

    try {
      setIsJoining(true);
      await api.joinMeeting(meetingId, displayName.trim());

      // Mark as participant (not host)
      localStorage.setItem("zoom_display_name", displayName.trim());
      localStorage.removeItem("zoom_is_host");

      // Redirect to meeting room
      window.location.href = `/meeting/${meetingId}`;
    } catch (err: any) {
      toast.error(err.message || "Failed to join meeting");
      setIsJoining(false);
    }
  };

  // Loading state while validating
  if (isValidating) {
    return (
      <div className="h-screen w-screen bg-[#0f0f0f] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="h-screen w-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="text-center text-white max-w-sm">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center mx-auto mb-4">
            <Video className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Cannot Join Meeting</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/dashboard"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl">ZoomX</span>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1c1c1c] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
          {/* Meeting info header */}
          <div className="bg-blue-600/10 border-b border-gray-800 px-6 py-4">
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mb-1">
              You&apos;re invited to join
            </p>
            <h2 className="text-white font-bold text-lg leading-tight">
              {meetingInfo?.title || "Meeting"}
            </h2>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
              <Hash className="w-3 h-3" />
              {meetingId}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleJoin} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Your Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter your name to join"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isJoining}
                  autoFocus
                  className="w-full bg-[#111] border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-60 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isJoining || !displayName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isJoining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Joining...
                </>
              ) : (
                "Join Meeting"
              )}
            </button>

            <p className="text-center text-xs text-gray-600">
              By joining, you agree to our terms of service.
            </p>
          </form>
        </div>

        <div className="text-center mt-4">
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-400 transition-colors">
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#0f0f0f] flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <JoinPageInner />
    </Suspense>
  );
}
