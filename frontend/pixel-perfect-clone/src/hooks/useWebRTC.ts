import { useMeeting } from "@/components/meeting/MeetingContext";

export function useWebRTC() {
  const {
    wsRef,
    peerConnectionsRef,
    nameToChannelRef,
    channelToNameRef,
    localStreamRef,
    isScreenSharingRef,
    screenStreamRef,
    setRemoteStreams,
    remoteVideoRefs,
    myNameRef
  } = useMeeting();

  const createPeerConnection = (targetChannel: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ]
    });

    // Add all local tracks (camera + mic, or screen)
    const stream = localStreamRef.current;
    if (stream) {
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
    }
    // If screen sharing is active, replace video track
    if (isScreenSharingRef.current && screenStreamRef.current) {
      const screenTrack = screenStreamRef.current.getVideoTracks()[0];
      const sender = pc.getSenders().find(s => s.track?.kind === "video");
      if (sender && screenTrack) sender.replaceTrack(screenTrack);
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: "webrtc",
            target: targetChannel,
            signal_type: "ice-candidate",
            payload: event.candidate,
            sender_name: myNameRef.current
          })
        );
      }
    };

    pc.ontrack = (event) => {
      const displayName = channelToNameRef.current.get(targetChannel);
      if (displayName && event.streams[0]) {
        const stream = event.streams[0];
        setRemoteStreams(prev => {
          const next = new Map(prev);
          next.set(displayName, stream);
          return next;
        });
        // Bind to video element if it already exists
        setTimeout(() => {
          const videoEl = remoteVideoRefs.current.get(displayName);
          if (videoEl) {
            // Force re-binding to ensure newly added tracks are recognized
            videoEl.srcObject = null;
            videoEl.srcObject = stream;
            videoEl.play().catch(e => console.error("Error playing remote video ontrack:", e));
          }
        }, 100);
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        peerConnectionsRef.current.delete(targetChannel);
      }
    };

    peerConnectionsRef.current.set(targetChannel, pc);
    return pc;
  };

  const sendOffer = async (targetChannel: string) => {
    const pc = createPeerConnection(targetChannel);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    wsRef.current?.send(
      JSON.stringify({
        action: "webrtc",
        target: targetChannel,
        signal_type: "offer",
        payload: offer,
        sender_name: myNameRef.current
      })
    );
  };

  const handleOffer = async (payload: RTCSessionDescriptionInit, senderChannel: string, senderName: string) => {
    if (!channelToNameRef.current.has(senderChannel)) {
      channelToNameRef.current.set(senderChannel, senderName);
      nameToChannelRef.current.set(senderName, senderChannel);
    }
    const pc = createPeerConnection(senderChannel);
    await pc.setRemoteDescription(new RTCSessionDescription(payload));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    wsRef.current?.send(
      JSON.stringify({
        action: "webrtc",
        target: senderChannel,
        signal_type: "answer",
        payload: answer,
        sender_name: myNameRef.current
      })
    );
  };

  const handleAnswer = async (payload: RTCSessionDescriptionInit, senderChannel: string) => {
    const pc = peerConnectionsRef.current.get(senderChannel);
    if (pc && pc.signalingState === "have-local-offer") {
      await pc.setRemoteDescription(new RTCSessionDescription(payload));
    }
  };

  const handleICECandidate = async (payload: RTCIceCandidateInit, senderChannel: string) => {
    const pc = peerConnectionsRef.current.get(senderChannel);
    if (pc) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(payload));
      } catch (e) {
        // Suppress candidate add errors
      }
    }
  };

  const cleanupPeerConnections = () => {
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
  };

  return {
    createPeerConnection,
    sendOffer,
    handleOffer,
    handleAnswer,
    handleICECandidate,
    cleanupPeerConnections
  };
}
