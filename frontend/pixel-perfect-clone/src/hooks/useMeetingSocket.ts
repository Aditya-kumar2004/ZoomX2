import { useMeeting } from "@/components/meeting/MeetingContext";
import { useWebRTC } from "./useWebRTC";
import { api, getWebSocketUrl } from "@/lib/api";
import { toast } from "sonner";

export function useMeetingSocket() {
  const context = useMeeting();
  const {
    meetingId,
    wsRef,
    myChannelRef,
    nameToChannelRef,
    channelToNameRef,
    localStreamRef,
    activeSidebarRef,
    chatNotifTimerRef,
    setChatNotif,
    setReactions,
    setScreenSharerName,
    setSwappedMainParticipantId,
    setMeetingEndedState,
    setMeeting,
    setParticipants,
    myParticipantRef,
    setMyParticipant,
    isMicOn,
    setIsMicOn,
    myNameRef
  } = context;

  const { sendOffer, handleOffer, handleAnswer, handleICECandidate } = useWebRTC();

  const connectSocket = () => {
    const ws = new WebSocket(getWebSocketUrl(meetingId));
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "announce", display_name: myNameRef.current }));
    };

    ws.onmessage = async (event) => {
      const wsData = JSON.parse(event.data);

      if (wsData.type === "connected") {
        myChannelRef.current = wsData.channel_name;

      } else if (wsData.type === "peer_announced") {
        const { display_name, channel_name } = wsData;
        if (channel_name === myChannelRef.current) return;
        nameToChannelRef.current.set(display_name, channel_name);
        channelToNameRef.current.set(channel_name, display_name);
        
        if (localStreamRef.current) {
          await sendOffer(channel_name);
        }

      } else if (wsData.type === "webrtc") {
        const { signal_type, payload, sender_channel, sender_name } = wsData;
        if (signal_type === "offer") {
          await handleOffer(payload, sender_channel, sender_name);
        } else if (signal_type === "answer") {
          await handleAnswer(payload, sender_channel);
        } else if (signal_type === "ice-candidate") {
          await handleICECandidate(payload, sender_channel);
        }

      } else if (wsData.type === "chat") {
        if (activeSidebarRef.current !== "chat") {
          if (chatNotifTimerRef.current) clearTimeout(chatNotifTimerRef.current);
          setChatNotif({ sender: wsData.sender_name, message: wsData.message });
          chatNotifTimerRef.current = setTimeout(() => setChatNotif(null), 4500);
        }

      } else if (wsData.type === "reaction") {
        setReactions(prev => ({ ...prev, [wsData.participant_id]: wsData.emoji }));
        setTimeout(() => {
          setReactions(prev => {
            const next = { ...prev };
            delete next[wsData.participant_id];
            return next;
          });
        }, 4000);

      } else if (wsData.type === "screen_share") {
        const { display_name, is_sharing } = wsData;
        if (is_sharing) {
          setScreenSharerName(display_name);
        } else {
          setScreenSharerName(null);
          setSwappedMainParticipantId(null);
        }

      } else if (wsData.type === "state_update") {
        if (wsData.event === "meeting_ended") {
          setMeetingEndedState({ isEnded: true, reason: "ended" });
          return;
        }

        try {
          const pollData = await api.getMeetingDetail(meetingId);
          setMeeting(pollData);
          const activePoll = pollData.participants.filter(p => !p.left_at);
          setParticipants(activePoll);

          const currentMe = myParticipantRef.current;
          if (currentMe && !activePoll.find(p => p.id === currentMe.id)) {
            toast.error("You were removed from the meeting");
            setMeetingEndedState({ isEnded: true, reason: "removed" });
            return;
          }

          const updatedMe = activePoll.find(p => p.id === currentMe?.id);
          if (updatedMe) {
            setMyParticipant(updatedMe);
            if (updatedMe.is_muted && isMicOn) {
              setIsMicOn(false);
              toast.info("You were muted by the host");
            }
          }
        } catch (e) {
          console.error("Error syncing state", e);
        }
      }
    };
  };

  const disconnectSocket = () => {
    wsRef.current?.close();
    wsRef.current = null;
  };

  return {
    connectSocket,
    disconnectSocket
  };
}
