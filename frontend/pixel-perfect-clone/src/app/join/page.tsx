"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  User, 
  Shield, 
  Video, 
  Sparkles, 
  ArrowUpFromLine, 
  Smile,
  ArrowLeft,
  Lock,
  MessageSquare,
  Users
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
      <div className="h-screen w-screen bg-[#04040d] flex items-center justify-center relative select-none overflow-hidden">
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-[35%] left-[35%] w-[30%] h-[30%] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-violet-500 animate-spin" />
          <p className="text-zinc-500 text-xs font-semibold uppercase tracking-widest">Verifying Link...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen w-screen bg-[#04040d] flex items-center justify-center p-4 relative select-none overflow-hidden">
        {/* Background gradients and mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        <div className="absolute top-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-red-950/15 blur-[150px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-[#090A16]/85 border border-red-500/15 backdrop-blur-2xl p-10 rounded-[32px] w-full max-w-md shadow-2xl relative text-center space-y-6"
        >
          {/* Top highlight bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500/70 rounded-t-full" />
          
          <div className="w-16 h-16 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto shadow-inner relative overflow-hidden group">
            <div className="absolute inset-0 bg-red-500/5 blur-[5px] group-hover:scale-125 transition-transform" />
            <svg className="w-8 h-8 text-red-500 relative z-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-xl font-black text-white tracking-tight">Access Restricted</h2>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-[280px] mx-auto">{error}</p>
          </div>
          
          <a
            href="/dashboard"
            className="inline-flex w-full bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800/80 text-zinc-300 font-bold py-4 rounded-2xl transition-all duration-200 text-xs tracking-wider uppercase font-sans cursor-pointer text-center justify-center items-center hover:text-white"
          >
            Back to Dashboard
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#04040d] relative flex items-center justify-center text-white p-4 sm:p-6 md:p-8 font-sans overflow-x-hidden overflow-y-auto select-none">
      
      {/* Background gradients and mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />
      
      {/* Pulsing neon radial blobs */}
      <motion.div 
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -20, 20, 0],
          scale: [1, 1.08, 0.95, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none -z-10" 
      />
      <motion.div 
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 30, -20, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[130px] pointer-events-none -z-10" 
      />
      <motion.div 
        className="absolute top-[30%] right-[30%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none -z-10" 
      />

      {/* Floating particles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-400/30 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.7, 0.1],
              scale: [1, Math.random() * 1.5 + 1, 1],
            }}
            transition={{
              duration: 9 + Math.random() * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 6,
            }}
          />
        ))}
      </div>

      {/* Split screen outer container */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center z-10 py-6">
        
        {/* Left Column: Premium Brand & Features Showcase */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="col-span-12 md:col-span-7 flex flex-col justify-center space-y-8"
        >
          {/* Logo & Tagline */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-flex items-center gap-2 self-start">
              <div className="text-violet-500 flex items-center justify-center p-2.5 bg-violet-500/10 rounded-2xl border border-violet-500/20 backdrop-blur-md">
                <svg viewBox="0 8.8 24 6.4" className="h-6 w-auto fill-current" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
                  <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
                </svg>
              </div>
              <span className="text-white font-extrabold text-2xl tracking-tighter ml-0.5 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">X</span>
            </div>
            
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-semibold text-violet-400 self-start sm:self-center">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-first collaboration</span>
            </div>
          </div>

          {/* Heading and Subtext */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-white">
              Find out what&apos;s possible <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 font-extrabold relative">
                when work connects
              </span>
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Bridge communication and collaboration with AI-powered meetings built for modern teams.
            </p>
          </div>

          {/* Feature Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {[
              {
                icon: <Video className="w-5 h-5" />,
                title: "Ultra-HD Meetings",
                desc: "Lag-free HD video and high fidelity spatial audio streaming.",
                glowColor: "group-hover:text-violet-400 border-violet-500/20 bg-violet-500/5"
              },
              {
                icon: <Sparkles className="w-5 h-5" />,
                title: "Smart AI Notes",
                desc: "Real-time action items, summaries, and smart chapters.",
                glowColor: "group-hover:text-amber-400 border-amber-500/20 bg-amber-500/5"
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "End-to-End Encryption",
                desc: "Advanced security controls ensuring total confidentiality.",
                glowColor: "group-hover:text-emerald-400 border-emerald-500/20 bg-emerald-500/5"
              },
              {
                icon: <Smile className="w-5 h-5" />,
                title: "Seamless Collaboration",
                desc: "In-call whiteboards, chat threads, and rich interactions.",
                glowColor: "group-hover:text-indigo-400 border-indigo-500/20 bg-indigo-500/5"
              }
            ].map((feat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group relative bg-[#090A16]/55 border border-zinc-800/40 hover:border-violet-500/25 backdrop-blur-xl p-4 sm:p-5 rounded-2xl flex gap-4 transition-all duration-300 shadow-md"
              >
                {/* Micro-glow background gradient */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-violet-500/0 via-violet-500/0 to-violet-500/3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 shadow-inner transition-colors duration-300 ${feat.glowColor}`}>
                  {feat.icon}
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-xs leading-none group-hover:text-violet-200 transition-colors">{feat.title}</h3>
                  <p className="text-zinc-500 text-[11px] leading-snug group-hover:text-zinc-400 transition-colors">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Left bottom micro branding footer */}
          <p className="text-[10px] text-zinc-600 font-medium pt-4 hidden md:block">
            © {new Date().getFullYear()} ZoomX Technologies Inc. All rights reserved.
          </p>
        </motion.div>

        {/* Right Column: Floating Premium Meeting Join Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="col-span-12 md:col-span-5 flex justify-center md:justify-end"
        >
          <div className="w-full max-w-md bg-[#090A16]/65 border border-purple-500/15 backdrop-blur-2xl p-6 sm:p-8 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_60px_rgba(139,92,246,0.08)] transition-all duration-500 relative overflow-hidden">
            {/* Ambient glows inside card */}
            <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-purple-500/5 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[120px] h-[120px] bg-fuchsia-500/5 rounded-full blur-[40px] pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Join Meeting
                </h2>
                <p className="text-zinc-400 text-xs leading-normal">
                  You are invited to join this room. Set your display name to start.
                </p>
              </div>

              {/* Dynamic Room Details Info Card */}
              <div className="bg-[#101026]/80 border border-zinc-800/60 rounded-2xl p-5 space-y-3.5 relative overflow-hidden shadow-inner">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400">Invite Details</p>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-extrabold text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    <span>Active Room</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <h4 className="text-white font-extrabold text-sm truncate leading-snug">
                    {meetingInfo?.title || "Instant Meeting"}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-500 text-[11px] font-semibold">
                    <p className="flex items-center gap-1">
                      <span>ID:</span>
                      <span className="font-mono text-zinc-400">{meetingId}</span>
                    </p>
                    <span className="text-zinc-700">•</span>
                    <p className="flex items-center gap-1">
                      <span>Host:</span>
                      <span className="text-zinc-400">{meetingInfo?.host_name || "John Doe"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleJoin} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Your Name
                  </label>
                  <div className="relative group">
                    <User className="w-4.5 h-4.5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-violet-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="Enter your display name to join"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      autoFocus
                      disabled={isJoining}
                      required
                      className="w-full bg-[#070712] border border-zinc-800/80 rounded-2xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-650 focus:outline-none focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10 transition-all text-xs font-semibold disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Primary Join Button */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isJoining || !displayName.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_35px_rgba(139,92,246,0.45)] text-xs tracking-wider uppercase font-sans mt-2 cursor-pointer"
                >
                  {isJoining ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Joining Room...</span>
                    </span>
                  ) : (
                    "Join Meeting Room"
                  )}
                </motion.button>
              </form>
              
              {/* Secondary Navigation */}
              <div className="flex flex-col items-center gap-4 pt-2">
                <a 
                  href="/dashboard" 
                  className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500 hover:text-zinc-300 font-bold tracking-widest uppercase transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Dashboard</span>
                </a>
                <p className="text-center text-[10px] text-zinc-600 leading-normal max-w-xs">
                  By clicking join, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen bg-[#04040d] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
          <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        </div>
      }
    >
      <JoinPageInner />
    </Suspense>
  );
}
