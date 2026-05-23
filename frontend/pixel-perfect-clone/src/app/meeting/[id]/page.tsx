"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ChevronUp, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";

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
  const meetingId = params.id as string;

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
      <div className="h-screen w-screen bg-[#1A1A1A] flex items-center justify-center text-white p-4 font-sans select-none animate-in fade-in duration-300">
        <div className="bg-[#242424]/90 border border-gray-800 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md shadow-2xl flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 animate-bounce">
            <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Thank You for using ZoomX!
          </h2>
          <p className="text-gray-400 text-sm mb-6 max-w-xs font-medium">
            {meetingEndedState.reason === "ended"
              ? "The meeting was ended by the host."
              : "You have left the meeting."}
          </p>
          <div className="w-full bg-[#1A1A1A] border border-gray-800 rounded-2xl p-4 mb-6 flex flex-col items-center">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" className="stroke-gray-800" strokeWidth="4" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-blue-500 transition-all duration-1000"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 28}
                  strokeDashoffset={2 * Math.PI * 28 * (1 - countdown / 10)}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-lg font-bold font-mono text-blue-400">
                {countdown}s
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-3 font-medium">
              Redirecting to your dashboard automatically
            </p>
          </div>
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] text-sm"
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
        <div className={`flex-1 p-3 bg-[#111111] transition-all duration-300 relative ${activeSidebar ? "mr-[320px]" : ""}`}>
          
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
          <div className="w-[320px] bg-[#1C1C1C] border-l border-gray-800 absolute right-0 top-0 bottom-0 flex flex-col z-10 shadow-2xl transition-transform duration-300">
            <div className="h-12 bg-[#242424] flex items-center justify-between px-4 border-b border-gray-800">
              <span className="text-[14px] font-semibold text-gray-200">
                {activeSidebar === "participants" ? "Participants" : "Meeting Chat"}
              </span>
              <button onClick={() => setActiveSidebar(null)} className="text-gray-400 hover:text-white transition-colors">
                <ChevronUp className="w-4 h-4 rotate-180" />
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
  const meetingId = params.id as string;
  return (
    <MeetingProvider meetingId={meetingId}>
      <MeetingRoomContent />
    </MeetingProvider>
  );
}
