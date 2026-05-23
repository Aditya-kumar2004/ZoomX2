import { useMeeting } from "@/components/meeting/MeetingContext";
import { api } from "@/lib/api";

export function useMeetingControls() {
  const {
    isMicOn,
    setIsMicOn,
    isVideoOn,
    setIsVideoOn,
    myParticipant,
    activeSidebar,
    setActiveSidebar,
    wsRef,
    meeting,
    meetingId,
    localStreamRef,
    screenStreamRef,
    setMeetingEndedState,
    showReactionsMenu,
    setShowReactionsMenu,
    setChatNotif,
    chatNotifTimerRef
  } = useMeeting();

  const toggleMic = () => {
    if (!myParticipant?.is_muted) {
      setIsMicOn(prev => !prev);
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(prev => !prev);
  };

  const toggleSidebar = (sidebar: "participants" | "chat") => {
    const next = activeSidebar === sidebar ? null : sidebar;
    setActiveSidebar(next);
    // Dismiss chat notification when opening chat
    if (sidebar === "chat") {
      setChatNotif(null);
      if (chatNotifTimerRef.current) {
        clearTimeout(chatNotifTimerRef.current);
        chatNotifTimerRef.current = null;
      }
    }
  };

  const handleReaction = (emoji: string) => {
    if (wsRef.current && myParticipant) {
      wsRef.current.send(
        JSON.stringify({
          action: "reaction",
          participant_id: myParticipant.id,
          emoji: emoji
        })
      );
    }
    setShowReactionsMenu(false);
  };

  const handleLeave = async () => {
    let reason: "ended" | "left" = "left";
    try {
      if (meeting?.host_name === myParticipant?.display_name) {
        await api.endMeeting(meetingId);
        reason = "ended";
      } else if (myParticipant) {
        await api.removeParticipant(meetingId, myParticipant.id);
        reason = "left";
      }
    } catch (error) {
      console.error("Error leaving meeting:", error);
    }
    localStorage.removeItem("zoom_display_name");
    localStorage.removeItem("zoom_is_host");

    // Stop local media tracks immediately so camera light goes off
    localStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());

    setMeetingEndedState({ isEnded: true, reason });
  };

  return {
    toggleMic,
    toggleVideo,
    toggleSidebar,
    handleReaction,
    handleLeave
  };
}
