"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Loader2, 
  ChevronUp, 
  X, 
  User, 
  Shield, 
  Video, 
  Sparkles, 
  MessageSquare, 
  ArrowUpFromLine, 
  Smile, 
  Users,
  CheckCircle,
  Clock,
  Tv
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { formatMeetingId } from "@/lib/utils";


import { MeetingProvider, useMeeting } from "@/components/meeting/MeetingContext";
import { useMeetingSocket } from "@/hooks/useMeetingSocket";
import { useWebRTC } from "@/hooks/useWebRTC";
import { useSpeakerDetection } from "@/hooks/useSpeakerDetection";
import { useMeetingControls } from "@/hooks/useMeetingControls";

import { GalleryLayout } from "@/components/meeting/GalleryLayout";
import { PresentationLayout } from "@/components/meeting/PresentationLayout";
import { PinnedSpeakerLayout } from "@/components/meeting/PinnedSpeakerLayout";
import { MeetingToolbar } from "@/components/meeting/MeetingToolbar";
import { WaitingRoomScreen } from "@/components/meeting/WaitingRoomScreen";
import { ConnectionStatus } from "@/components/meeting/ConnectionStatus";

import { ChatSidebar } from "@/components/meeting/ChatSidebar";
import { ParticipantsSidebar } from "@/components/meeting/ParticipantsSidebar";
import { formatElapsedTime } from "@/lib/utils";

function MeetingRoomContent() {
  const params = useParams();
  const rawMeetingId = params.id as string;
  const meetingId = formatMeetingId(rawMeetingId);

  const context = useMeeting();
  const {
    meeting,
    setMeeting,
    myParticipant,
    setMyParticipant,
    participants,
    setParticipants,
    loading,
    setLoading,
    needsName,
    setNeedsName,
    guestName,
    setGuestName,
    isMicOn,
    setIsMicOn,
    isVideoOn,
    setIsVideoOn,
    localStream,
    setLocalStream,
    isScreenSharing,
    screenStream,
    screenSharerName,
    pinnedParticipantId,
    activeSpeaker,
    meetingEndedState,
    setMeetingEndedState,
    countdown,
    setCountdown,
    activeSidebar,
    setActiveSidebar,
    chatNotif,
    setChatNotif,
    setElapsedTime,
    elapsedTime,
    showDetails,
    setShowDetails,
    localStreamRef,
    screenStreamRef,
    myNameRef,
    chatNotifTimerRef
  } = context;

  const [waitingNotif, setWaitingNotif] = useState<{ id: number; name: string } | null>(null);
  const prevWaitingIdsRef = useRef<Set<number>>(new Set());

  const { connectSocket, disconnectSocket } = useMeetingSocket();
  const { cleanupPeerConnections } = useWebRTC();
  const { startLocalAudioMonitor, stopLocalAudioMonitor, checkAudioLevels } = useSpeakerDetection();

  // 1. Timer for Elapsed Meeting Time
  useEffect(() => {
    if (!meeting?.created_at) return;
    const start = new Date(meeting.created_at).getTime();
    
    const updateTime = () => {
      const now = new Date().getTime();
      const diff = Math.floor(Math.max(0, now - start) / 1000);
      setElapsedTime(formatElapsedTime(diff));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [meeting?.created_at, setElapsedTime]);

  // 2. Initialize Meeting & WebRTC Devices & Socket Connection
  useEffect(() => {
    const initMeeting = async () => {
      try {
        const storedName = localStorage.getItem("zoom_display_name");
        const isHost = localStorage.getItem("zoom_is_host") === "true";

        const data = await api.getMeetingDetail(meetingId);
        setMeeting(data);
        const active = data.participants.filter(p => !p.left_at);
        setParticipants(active);

        if (isHost) {
          const me = active.find(p => p.display_name === data.host_name && p.status === "admitted");
          if (me) {
            setMyParticipant(me);
            myNameRef.current = me.display_name;
          } else {
            await api.joinMeeting(meetingId, data.host_name);
            window.location.reload();
            return;
          }
        } else if (storedName) {
          const me = active.find(p => p.display_name === storedName);
          if (!me) {
            localStorage.removeItem("zoom_display_name");
            setNeedsName(true);
            setLoading(false);
            return;
          }
          setMyParticipant(me);
          myNameRef.current = me.display_name;
        } else {
          setNeedsName(true);
          setLoading(false);
          return;
        }

        const initialVideo = localStorage.getItem("zoom_initial_video_on") !== "false";
        const initialMic = localStorage.getItem("zoom_initial_mic_on") !== "false";
        
        setIsVideoOn(initialVideo);
        setIsMicOn(initialMic);
        setLoading(false);

        // Capture local camera/mic stream
        let capturedStream: MediaStream | null = null;
        try {
          capturedStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          setLocalStream(capturedStream);
          localStreamRef.current = capturedStream;
          // Unused localVideoRef removed
          capturedStream.getVideoTracks().forEach(t => (t.enabled = initialVideo));
          capturedStream.getAudioTracks().forEach(t => (t.enabled = initialMic));
        } catch (err) {
          toast.error("Camera/Mic permissions denied or device not found");
          setIsVideoOn(false);
          setIsMicOn(false);
        }

        // Connect Websocket
        connectSocket();

      } catch (error: any) {
        toast.error("Failed to load meeting details");
        window.location.href = "/dashboard";
      }
    };

    initMeeting();

    return () => {
      disconnectSocket();
      cleanupPeerConnections();
      localStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
      
      // Clear chatNotifTimerRef to prevent memory leaks on unmount
      if (chatNotifTimerRef.current) {
        clearTimeout(chatNotifTimerRef.current);
        chatNotifTimerRef.current = null;
      }
    };
  }, [meetingId]);

  // 3. Local media toggles sync
  useEffect(() => {
    if (localStream) {
      localStream.getAudioTracks().forEach(track => {
        track.enabled = isMicOn && !myParticipant?.is_muted;
      });
      localStream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOn;
      });
    }
  }, [isMicOn, isVideoOn, localStream, myParticipant?.is_muted]);

  // 4. Start local mic level monitoring
  useEffect(() => {
    startLocalAudioMonitor();
    return () => stopLocalAudioMonitor();
  }, [localStream, isMicOn, myParticipant?.is_muted]);

  // 5. Active speaker election interval loop
  useEffect(() => {
    const interval = setInterval(checkAudioLevels, 200);
    return () => clearInterval(interval);
  }, [participants]);

  // Unused localVideoRef effect removed

  // 7. Thank You Countdown Redirect
  useEffect(() => {
    if (!meetingEndedState.isEnded) return;

    localStream?.getTracks().forEach(t => t.stop());
    screenStream?.getTracks().forEach(t => t.stop());
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = "/dashboard";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [meetingEndedState.isEnded, localStream, screenStream]);

  // Monitor waiting room participants for Host notifications
  useEffect(() => {
    if (!meeting || meeting.host_name !== myParticipant?.display_name) return;

    const currentWaiting = participants.filter(p => p.status === "waiting");
    const currentWaitingIds = new Set(currentWaiting.map(p => p.id));

    // Find any newly waiting participant
    const newWaiting = currentWaiting.find(p => !prevWaitingIdsRef.current.has(p.id));

    if (newWaiting) {
      setWaitingNotif({ id: newWaiting.id, name: newWaiting.display_name });
    }

    prevWaitingIdsRef.current = currentWaitingIds;
  }, [participants, meeting, myParticipant]);

  const handleAdmitWaiting = async (id: number) => {
    try {
      await api.admitParticipant(meetingId, id);
      setWaitingNotif(null);
      toast.success("Participant admitted!");
    } catch (err) {
      toast.error("Failed to admit participant");
    }
  };

  const handleDeclineWaiting = async (id: number) => {
    try {
      await api.declineParticipant(meetingId, id);
      setWaitingNotif(null);
      toast.info("Participant declined");
    } catch (err) {
      toast.error("Failed to decline participant");
    }
  };

  // Join Lobby submit
  const handleJoinDirectly = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    try {
      setLoading(true);
      await api.joinMeeting(meetingId, guestName.trim());
      localStorage.setItem("zoom_display_name", guestName.trim());
      localStorage.removeItem("zoom_is_host");
      window.location.reload();
    } catch (error: any) {
      toast.error(error.message || "Failed to join");
      setLoading(false);
    }
  };

  // If ended, show countdown screen
  if (meetingEndedState.isEnded) {
    return (
      <div className="min-h-screen w-screen bg-[#070814] relative flex items-center justify-center text-white p-4 sm:p-6 md:p-10 font-sans overflow-y-auto select-none animate-in fade-in duration-700">
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Futuristic background ambient neon glowing orbs */}
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

        <div className="bg-[#0D0D1F]/70 border border-zinc-800/40 backdrop-blur-2xl rounded-[32px] w-full max-w-5xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-12 overflow-hidden relative animate-in zoom-in-95 duration-500 min-h-[500px]">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 z-30" />

          {/* Left Column: Premium Brand Conversion Showcase (7 cols on desktop) */}
          <div className="hidden md:flex md:col-span-7 p-10 flex-col justify-between bg-zinc-950/20 border-r border-zinc-800/20 relative">
            <div className="space-y-6">
              {/* Brand Logo - EXACT SVG Logo from landing navbar rendered in elegant violet */}
              <div className="inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]">
                <div className="text-violet-500 flex items-center justify-center">
                  <svg viewBox="0 8.8 24 6.4" className="h-8 w-auto fill-current" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
                    <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
                  </svg>
                </div>
                <span className="text-white font-extrabold text-2xl tracking-tighter ml-0.5 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent select-none">X</span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="text-[32px] font-black leading-tight tracking-tight text-white">
                  Join the future of <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 font-extrabold">
                    AI-first workspace
                  </span>
                </h1>
                <p className="text-zinc-400 text-sm leading-relaxed max-w-md">
                  Why stop at meetings? Create a free ZoomX account to access premium collaboration features built to scale your workflow.
                </p>
              </div>

              {/* Interactive Value Cards */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  {
                    icon: <Sparkles className="w-4 h-4 text-yellow-400" />,
                    title: "Smart AI Notes",
                    desc: "Automated meeting summaries, action items, and clear transcripts."
                  },
                  {
                    icon: <MessageSquare className="w-4 h-4 text-violet-400" />,
                    title: "Persistent Team Chat",
                    desc: "Keep the discussion going with channels, thread replies, and sharing."
                  },
                  {
                    icon: <ArrowUpFromLine className="w-4 h-4 text-emerald-400" />,
                    title: "Digital Whiteboards",
                    desc: "Co-annotate, draw, and brainstorm with your team live on any screen."
                  },
                  {
                    icon: <Users className="w-4 h-4 text-indigo-400" />,
                    title: "Up to 100 Guests",
                    desc: "Host large-scale calls, webinars, or team meetups with zero limit."
                  }
                ].map((feat, idx) => (
                  <div key={idx} className="bg-zinc-900/40 border border-zinc-800/40 p-4 rounded-2xl flex flex-col gap-2.5 shadow-sm hover:border-zinc-700/40 transition-colors">
                    <div className="w-8 h-8 rounded-xl bg-zinc-800/50 flex items-center justify-center shrink-0">
                      {feat.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xs mb-0.5">{feat.title}</h3>
                      <p className="text-zinc-500 text-[10px] leading-snug">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[10px] text-zinc-600 font-medium pt-6">
              © {new Date().getFullYear()} ZoomX Technologies Inc. All rights reserved.
            </p>
          </div>

          {/* Right Column: Thank You Details & Actions (5 cols on desktop) */}
          <div className="col-span-12 md:col-span-5 p-8 sm:p-10 flex flex-col justify-center relative">
            {/* Small Brand Header for Mobile Viewport */}
            <div className="flex md:hidden items-center gap-2 mb-8 justify-center">
              <svg viewBox="0 8.8 24 6.4" className="h-6 w-auto fill-current text-violet-500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
                <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
              </svg>
              <span className="text-white font-extrabold text-lg -ml-1 select-none">X</span>
            </div>

            <div className="space-y-8 flex flex-col items-center text-center">
              {/* Check Shield Icon with rotating border */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                {/* Spinning background glow */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 blur-md opacity-40 animate-pulse" />
                <div className="absolute inset-0 rounded-[22px] bg-zinc-855 border border-zinc-700/30" />
                
                {/* Shield Check SVG */}
                <div className="w-16 h-16 rounded-[18px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-violet-500/20 z-10">
                  <svg className="w-8 h-8 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 11 2 2 4-4" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-[26px] font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent leading-none font-sans">
                  Meeting Ended
                </h2>
                <p className="text-zinc-400 text-xs max-w-[280px]">
                  {meetingEndedState.reason === "ended"
                    ? "The meeting session has been closed by the host."
                    : "You have successfully left the meeting room."}
                </p>
              </div>

              {/* Circular Countdown Loader */}
              <div className="w-full bg-[#111124]/80 border border-zinc-800/80 rounded-[24px] p-5 flex flex-col items-center shadow-inner select-none">
                <div className="relative w-18 h-18 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="36" cy="36" r="30" className="stroke-zinc-850" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="36"
                      cy="36"
                      r="30"
                      className="stroke-violet-500 transition-all duration-1000 ease-out"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 30}
                      strokeDashoffset={2 * Math.PI * 30 * (1 - countdown / 10)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-lg font-black font-mono text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text leading-none">
                      {countdown}
                    </span>
                    <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-extrabold mt-0.5">sec</span>
                  </div>
                </div>
                <p className="text-[10px] text-zinc-500 mt-3 font-semibold tracking-wide uppercase">
                  Redirecting to dashboard...
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="w-full space-y-3 pt-2">
                <button
                  onClick={() => {
                    window.location.href = "/signup";
                  }}
                  className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 text-white font-extrabold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_25px_rgba(139,92,246,0.25)] hover:shadow-[0_4px_35px_rgba(139,92,246,0.45)] hover:scale-[1.01] active:scale-[0.99] text-xs tracking-wider uppercase font-sans flex items-center justify-center gap-2 cursor-pointer animate-soft-pulse"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>Create Free Account</span>
                </button>
                <button
                  onClick={() => {
                    window.location.href = "/dashboard";
                  }}
                  className="w-full bg-zinc-900 hover:bg-zinc-855 border border-zinc-800/80 text-zinc-300 font-bold py-3.5 rounded-2xl transition-all active:scale-[0.99] text-xs tracking-wider uppercase font-sans cursor-pointer"
                >
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading spinner
  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#1A1A1A] flex items-center justify-center text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  // Lobby/Needs Join Name input
  if (needsName) {
    return (
      <div className="min-h-screen w-screen bg-[#070814] relative flex items-center justify-center text-white p-4 sm:p-6 md:p-10 font-sans overflow-y-auto select-none animate-in fade-in duration-700">
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Futuristic background ambient neon glowing orbs */}
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-violet-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-fuchsia-600/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-[30%] right-[20%] w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none" />

        <div className="bg-[#0D0D1F]/70 border border-zinc-800/40 backdrop-blur-2xl rounded-[32px] w-full max-w-5xl shadow-[0_25px_60px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-12 overflow-hidden relative animate-in zoom-in-95 duration-500 min-h-[500px]">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 z-30" />

          {/* Left Column: Premium Brand & Features Showcase (7 cols on desktop) */}
          <div className="hidden md:flex md:col-span-7 p-10 flex-col justify-between bg-zinc-950/20 border-r border-zinc-800/20 relative">
            <div className="space-y-6">
              {/* Brand Logo - EXACT SVG Logo from landing navbar rendered in elegant violet */}
              <div className="inline-flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]">
                <div className="text-violet-500 flex items-center justify-center">
                  <svg viewBox="0 8.8 24 6.4" className="h-8 w-auto fill-current" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
                    <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
                  </svg>
                </div>
                <span className="text-white font-extrabold text-2xl tracking-tighter ml-0.5 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent select-none">X</span>
              </div>

              {/* Catchy landing-page headline */}
              <div className="space-y-3">
                <h1 className="text-[32px] font-black leading-tight tracking-tight text-white">
                  Find out what&apos;s possible <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 font-extrabold">
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
                    icon: <Video className="w-4 h-4 text-violet-400" />,
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
              <svg viewBox="0 8.8 24 6.4" className="h-6 w-auto fill-current text-violet-500" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zoom Logo">
                <path d="M5.033 14.649H.743a.74.74 0 0 1-.686-.458.74.74 0 0 1 .16-.808L3.19 10.41H1.06A1.06 1.06 0 0 1 0 9.35h3.957c.301 0 .57.18.686.458a.74.74 0 0 1-.161.808L1.51 13.59h2.464c.585 0 1.06.475 1.06 1.06zM24 11.338c0-1.14-.927-2.066-2.066-2.066-.61 0-1.158.265-1.537.686a2.061 2.061 0 0 0-1.536-.686c-1.14 0-2.066.926-2.066 2.066v3.311a1.06 1.06 0 0 0 1.06-1.06v-2.251a1.004 1.004 0 0 1 2.013 0v2.251c0 .586.474 1.06 1.06 1.06v-3.311a1.004 1.004 0 0 1 2.012 0v2.251c0 .586.475 1.06 1.06 1.06zM16.265 12a2.728 2.728 0 1 1-5.457 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0zm-4.82 0a2.728 2.728 0 1 1-5.458 0 2.728 2.728 0 0 1 5.457 0zm-1.06 0a1.669 1.669 0 1 0-3.338 0 1.669 1.669 0 0 0 3.338 0z" />
              </svg>
              <span className="text-white font-extrabold text-lg -ml-1 select-none">X</span>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white mb-1 md:text-left text-center font-sans">
                  Join Meeting
                </h2>
                <p className="text-zinc-400 text-xs md:text-left text-center">
                  Please enter your display name to enter the meeting.
                </p>
              </div>

              {/* Dynamic Room Details Info Card */}
              <div className="bg-[#14142B]/80 border border-zinc-800/60 rounded-2xl p-4 space-y-2 shadow-inner">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-violet-400">Meeting Room</p>
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm truncate leading-snug">
                    {meeting?.title || "Instant Meeting"}
                  </h4>
                  <p className="text-zinc-500 font-mono text-[10px] flex items-center gap-1.5 font-bold">
                    <span>ID:</span>
                    <span>{meetingId}</span>
                  </p>
                </div>
              </div>

              <form onSubmit={handleJoinDirectly} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="w-4.5 h-4.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Enter your name to join"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      autoFocus
                      required
                      className="w-full bg-[#11111E] border border-zinc-800/80 rounded-2xl pl-10 pr-4 py-3.5 text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!guestName.trim()}
                  className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-500 hover:via-fuchsia-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(139,92,246,0.2)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.4)] active:scale-[0.99] text-xs tracking-wider uppercase font-sans mt-2 cursor-pointer"
                >
                  Join Meeting Room
                </button>
              </form>
              
              <p className="text-center text-[10px] text-zinc-600 leading-normal max-w-xs mx-auto">
                By clicking join, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting lobby
  if (myParticipant?.status === "waiting") {
    return <WaitingRoomScreen />;
  }

  if (!meeting) return null;

  const isHost = meeting.host_name === myParticipant?.display_name;

  return (
    <div className="h-screen w-screen bg-[#1A1A1A] flex flex-col font-sans overflow-hidden">
      {/* Top bar indicators & metadata details */}
      <ConnectionStatus />

      {/* Main conference workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        <div className={`flex-1 h-full p-3 bg-[#111111] transition-all duration-300 relative overflow-hidden ${activeSidebar ? "md:mr-[320px]" : ""}`}>
          
          {/* Waiting Room Toast Notification overlay for Host */}
          {waitingNotif && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1c1c24]/95 backdrop-blur-xl border border-blue-500/25 shadow-2xl rounded-2xl p-4 flex items-center gap-4 z-50 max-w-md w-full animate-in slide-in-from-top-6 duration-300 shadow-blue-900/10 select-none">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md">
                {waitingNotif.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-blue-400 font-extrabold tracking-wider uppercase mb-0.5">Lobby Request</p>
                <p className="text-[12px] text-zinc-100 font-semibold leading-snug">
                  <span className="text-white font-black">{waitingNotif.name}</span>: this user is waiting for you to admit them in the meeting.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleAdmitWaiting(waitingNotif.id)}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md active:scale-95"
                >
                  Admit
                </button>
                <button
                  onClick={() => handleDeclineWaiting(waitingNotif.id)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs px-3 py-2 rounded-xl transition-all active:scale-95"
                >
                  Decline
                </button>
              </div>
            </div>
          )}

          {/* Layout renderer */}
          {(() => {
            const admitted = participants.filter(p => p.status === "admitted");
            const count = admitted.length;

            if (count === 0) {
              return (
                <div className="h-full w-full flex items-center justify-center text-gray-400">
                  No other participants admitted yet.
                </div>
              );
            }

            // 1. Presentation view
            if (screenSharerName !== null) {
              return <PresentationLayout />;
            }

            // 2. Speaker featured view
            const featuredP = pinnedParticipantId
              ? admitted.find(p => p.id === pinnedParticipantId)
              : admitted.find(p => p.display_name === activeSpeaker);
            
            if (featuredP) {
              return <PinnedSpeakerLayout />;
            }

            // 3. Default gallery grid view
            return <GalleryLayout />;
          })()}

          {/* Chat notification toast overlays */}
          {chatNotif && (
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#1c1c1e]/95 backdrop-blur border border-gray-700 rounded-2xl px-4 py-3 shadow-2xl flex items-start gap-3 z-50 max-w-sm w-full animate-in slide-in-from-bottom-4 duration-300 cursor-pointer"
              onClick={() => {
                setActiveSidebar("chat");
                setChatNotif(null);
                if (chatNotifTimerRef.current) {
                  clearTimeout(chatNotifTimerRef.current);
                  chatNotifTimerRef.current = null;
                }
              }}
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {chatNotif.sender.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-blue-400 mb-0.5">{chatNotif.sender}</p>
                <p className="text-sm text-white truncate">{chatNotif.message}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setChatNotif(null);
                }}
                className="text-gray-500 hover:text-white transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebars */}
        {activeSidebar && (
          <div className="w-full md:w-[320px] bg-[#1C1C1C] border-l border-gray-800 absolute right-0 top-0 bottom-0 flex flex-col z-35 shadow-2xl transition-transform duration-300 animate-in slide-in-from-right duration-250">
            <div className="h-14 bg-[#242424] flex items-center justify-between px-4 border-b border-gray-800">
              <span className="text-[14px] font-semibold text-gray-200">
                {activeSidebar === "participants" ? "Participants" : "Meeting Chat"}
              </span>
              <button 
                onClick={() => setActiveSidebar(null)} 
                className="text-gray-400 hover:text-white transition-colors p-1.5 bg-white/5 hover:bg-white/10 rounded-lg"
                title="Close"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {activeSidebar === "chat" && (
                <ChatSidebar meeting={meeting} currentUser={myParticipant?.display_name || ""} isHost={isHost} />
              )}
              {activeSidebar === "participants" && (
                <ParticipantsSidebar meeting={meeting} participants={participants} currentUser={myParticipant?.display_name || ""} isHost={isHost} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating pill toolbar */}
      <MeetingToolbar />
    </div>
  );
}

export default function MeetingRoom() {
  const params = useParams();
  const rawMeetingId = params.id as string;
  const meetingId = formatMeetingId(rawMeetingId);
  return (
    <MeetingProvider meetingId={meetingId}>
      <MeetingRoomContent />
    </MeetingProvider>
  );
}
