"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
  Loader2, 
  User, 
  Hash, 
  Shield, 
  Video, 
  Sparkles, 
  ArrowUpFromLine, 
  Smile 
} from "lucide-react";
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
      <div className="h-screen w-screen bg-[#070814] flex items-center justify-center relative select-none">
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <Loader2 className="w-10 h-10 text-[#0B5CFF] animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-[#070814] flex items-center justify-center p-4 relative select-none animate-in fade-in duration-500">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-red-600/5 blur-[130px] pointer-events-none" />
        
        <div className="bg-[#0D0D1F]/80 border border-zinc-800/40 backdrop-blur-2xl p-10 rounded-[32px] w-full max-w-md shadow-2xl relative text-center space-y-6">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500 rounded-t-full" />
          
          <div className="w-16 h-16 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center mx-auto shadow-inner animate-pulse">
            <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 5-10 10" />
              <path d="m5 5 10 10" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">Cannot Join Meeting</h2>
            <p className="text-zinc-400 text-xs leading-relaxed">{error}</p>
          </div>
          
          <a
            href="/dashboard"
            className="inline-block w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800/80 text-zinc-300 font-bold py-3.5 rounded-2xl transition-all text-xs tracking-wider uppercase font-sans cursor-pointer text-center"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#070814] relative flex items-center justify-center text-white p-4 sm:p-6 md:p-10 font-sans overflow-y-auto select-none animate-in fade-in duration-700">
      {/* Subtle grid mesh overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Futuristic background ambient neon glowing orbs */}
      <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-[#0B5CFF]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

      <div className="bg-[#0D0D1F]/70 border border-zinc-800/40 backdrop-blur-2xl rounded-[32px] w-full max-w-5xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-12 overflow-hidden relative animate-in zoom-in-95 duration-500 min-h-[500px]">
        {/* Top accent gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#0B5CFF] via-indigo-500 to-purple-500 z-30" />

        {/* Left Column: Premium Brand & Features Showcase (7 cols on desktop) */}
        <div className="hidden md:flex md:col-span-7 p-10 flex-col justify-between bg-zinc-950/20 border-r border-zinc-800/20 relative">
          <div className="space-y-6">
            {/* Brand Logo - EXACT SVG Logo from landing navbar */}
            <div className="inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]">
              <div className="text-[#0B5CFF] flex items-center justify-center">
                <svg viewBox="0 8.8 24 6.4" className="h-8 w-auto fill-current" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
                  <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
                </svg>
              </div>
              <span className="text-white font-extrabold text-2xl tracking-tighter ml-0.5 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">X</span>
            </div>

            {/* Catchy landing-page headline */}
            <div className="space-y-3">
              <h1 className="text-[32px] font-black leading-tight tracking-tight text-white">
                Find out what&apos;s possible <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0B5CFF] via-indigo-400 to-purple-400 font-extrabold">
                  when work connects
                </span>
              </h1>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                Bridge the gap between talking and doing with the AI-first collaboration platform built for seamless hybrid teams.
              </p>
            </div>

            {/* Core Features List */}
            <div className="space-y-4 pt-4">
              {[
                {
                  icon: <Video className="w-4 h-4 text-[#0B5CFF]" />,
                  title: "Ultra-HD Video & Audio",
                  desc: "Crystal-clear lag-free video streams optimized for any bandwidth."
                },
                {
                  icon: <ArrowUpFromLine className="w-4 h-4 text-emerald-400" />,
                  title: "Seamless Screen Sharing",
                  desc: "One-click interactive window sharing with real-time audio playback."
                },
                {
                  icon: <Smile className="w-4 h-4 text-purple-400" />,
                  title: "Dynamic Lobby & Reactions",
                  desc: "Express yourself with expressive circular emojis and waitlist management."
                },
                {
                  icon: <Shield className="w-4 h-4 text-indigo-400" />,
                  title: "End-to-End Encryption",
                  desc: "Enterprise-grade security controls to keep all conversation private."
                }
              ].map((feat, idx) => (
                <div key={idx} className="flex gap-3 items-start animate-fade-slide" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="w-8 h-8 rounded-xl bg-zinc-800/40 border border-zinc-700/30 flex items-center justify-center shrink-0 shadow-inner">
                    {feat.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xs leading-none mb-0.5">{feat.title}</h3>
                    <p className="text-zinc-500 text-[11px] leading-snug">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micro Footer */}
          <p className="text-[10px] text-zinc-600 font-medium pt-6">
            © {new Date().getFullYear()} ZoomX Technologies Inc. All rights reserved.
          </p>
        </div>

        {/* Right Column: Name Entry Form (5 cols on desktop) */}
        <div className="col-span-12 md:col-span-5 p-8 sm:p-10 flex flex-col justify-center relative">
          {/* Small Brand Header for Mobile Viewport */}
          <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
            <svg viewBox="0 8.8 24 6.4" className="h-6 w-auto fill-current text-[#0B5CFF]" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
              <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
            </svg>
            <span className="text-white font-extrabold text-lg -ml-1 select-none">X</span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white mb-1 md:text-left text-center">
                Join Meeting
              </h2>
              <p className="text-zinc-400 text-xs md:text-left text-center">
                Please enter your display name to enter the meeting.
              </p>
            </div>

            {/* Dynamic Room Details Info Card */}
            <div className="bg-[#14142B]/80 border border-zinc-800/60 rounded-2xl p-4 space-y-2 shadow-inner">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#0B5CFF]">You&apos;re Invited to Join</p>
              <div className="space-y-1">
                <h4 className="text-white font-bold text-sm truncate leading-snug">
                  {meetingInfo?.title || "Instant Meeting"}
                </h4>
                <p className="text-zinc-500 font-mono text-[10px] flex items-center gap-1.5 font-bold">
                  <span>ID:</span>
                  <span>{meetingId}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-4.5 h-4.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Enter your name to join"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    autoFocus
                    disabled={isJoining}
                    required
                    className="w-full bg-[#11111E] border border-zinc-800/80 rounded-2xl pl-10 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-[#0B5CFF] focus:ring-2 focus:ring-[#0B5CFF]/10 transition-all text-sm font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isJoining || !displayName.trim()}
                className="w-full bg-gradient-to-r from-[#0B5CFF] via-indigo-600 to-[#0B5CFF] hover:from-[#0040CC] hover:to-[#0040CC] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(11,92,255,0.2)] hover:shadow-[0_4px_30px_rgba(11,92,255,0.4)] active:scale-[0.99] text-xs tracking-wider uppercase font-sans mt-2 cursor-pointer"
              >
                {isJoining ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Joining Meeting...</span>
                  </span>
                ) : (
                  "Join Meeting Room"
                )}
              </button>
            </form>
            
            <p className="text-center text-[10px] text-zinc-600 leading-normal max-w-xs mx-auto">
              By clicking join, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        <a href="/dashboard" className="text-xs text-zinc-500 hover:text-zinc-300 font-semibold tracking-wide uppercase transition-colors">
          ← Back to Dashboard
        </a>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#070814] flex items-center justify-center relative">
          {/* Subtle grid mesh overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <Loader2 className="w-10 h-10 text-[#0B5CFF] animate-spin" />
        </div>
      }
    >
      <JoinPageInner />
    </Suspense>
  );
}
