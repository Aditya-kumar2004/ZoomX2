"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronUp, X } from "lucide-react";
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
      <div className="h-screen w-screen bg-[#09090E] relative flex items-center justify-center text-white p-4 font-sans select-none overflow-hidden animate-in fade-in duration-700">
        {/* Futuristic background ambient neon glowing orbs */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px]" />
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-purple-600/5 blur-[120px]" />
        
        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />

        <div className="bg-[#141423]/70 border border-zinc-800/40 backdrop-blur-2xl p-10 rounded-[32px] w-full max-w-[440px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center text-center relative overflow-hidden animate-in zoom-in-95 duration-500">
          {/* Top accent gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          
          {/* Check Shield Icon with rotating border */}
          <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
            {/* Spinning background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-600 to-purple-500 blur-md opacity-40 animate-pulse" />
            <div className="absolute inset-0 rounded-[22px] bg-zinc-800/50 border border-zinc-700/30" />
            
            {/* Shield Check SVG */}
            <div className="w-16 h-16 rounded-[18px] bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 z-10">
              <svg className="w-8 h-8 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 11 2 2 4-4" />
              </svg>
            </div>
          </div>

          <h2 className="text-[26px] font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent mb-2.5">
            Thank You for using ZoomX!
          </h2>
          <p className="text-zinc-400 text-sm mb-8 max-w-[320px] font-medium leading-relaxed">
            {meetingEndedState.reason === "ended"
              ? "The meeting has been ended by the host."
              : "You have successfully left the meeting room."}
          </p>
          
          {/* Circular Countdown Loader */}
          <div className="w-full bg-[#0D0D15]/80 border border-zinc-800/80 rounded-[24px] p-6 mb-8 flex flex-col items-center shadow-inner">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-zinc-800/50" strokeWidth="4.5" fill="transparent" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  className="stroke-blue-500 transition-all duration-1000 ease-out"
                  strokeWidth="5"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * (1 - countdown / 10)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-[20px] font-black font-mono text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">
                  {countdown}
                </span>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold -mt-1">sec</span>
              </div>
            </div>
            <p className="text-xs text-zinc-500 mt-4 font-semibold tracking-wide">
              Redirecting you to the dashboard automatically
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.25)] hover:shadow-[0_4px_30px_rgba(99,102,241,0.45)] hover:scale-[1.01] active:scale-[0.99] text-sm tracking-wide"
          >
            Go to Dashboard Now
          </button>
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
      <div className="h-screen w-screen bg-[#1A1A1A] flex items-center justify-center text-white p-4">
        <div className="bg-[#242424] p-8 rounded-2xl w-full max-w-md shadow-2xl border border-gray-800">
          <h2 className="text-2xl font-bold mb-2">Join Meeting</h2>
          <p className="text-gray-400 mb-6">Please enter your name to join this meeting.</p>
          <form onSubmit={handleJoinDirectly}>
            <input
              type="text"
              placeholder="Your Name"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 mb-4"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors">
              Join Now
            </button>
          </form>
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
            if (isScreenSharing && screenSharerName !== null) {
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
