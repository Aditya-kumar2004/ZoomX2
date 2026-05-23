import { useMeeting } from "@/components/meeting/MeetingContext";

export function useScreenShare() {
  const {
    isScreenSharing,
    setIsScreenSharing,
    screenStream,
    setScreenStream,
    setScreenSharerName,
    setSwappedMainParticipantId,
    screenStreamRef,
    isScreenSharingRef,
    localStreamRef,
    wsRef,
    peerConnectionsRef,
    myNameRef
  } = useMeeting();

  const handleShareScreen = async () => {
    try {
      if (isScreenSharing) {
        // Stop sharing — replace screen track back with camera track
        screenStreamRef.current?.getTracks().forEach(t => t.stop());
        setScreenStream(null);
        setIsScreenSharing(false);
        isScreenSharingRef.current = false;
        screenStreamRef.current = null;
        setScreenSharerName(null);
        setSwappedMainParticipantId(null);

        // Broadcast stop screen share
        wsRef.current?.send(
          JSON.stringify({
            action: "screen_share",
            display_name: myNameRef.current,
            is_sharing: false
          })
        );

        // Replace video track back to camera in all peer connections
        const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
        if (cameraTrack) {
          peerConnectionsRef.current.forEach(pc => {
            const sender = pc.getSenders().find(s => s.track?.kind === "video");
            if (sender) sender.replaceTrack(cameraTrack);
          });
        }
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        setScreenStream(stream);
        setIsScreenSharing(true);
        isScreenSharingRef.current = true;
        screenStreamRef.current = stream;
        setScreenSharerName(myNameRef.current);

        // Broadcast start screen share
        wsRef.current?.send(
          JSON.stringify({
            action: "screen_share",
            display_name: myNameRef.current,
            is_sharing: true
          })
        );

        // Replace video track with screen track in all peer connections
        const screenTrack = stream.getVideoTracks()[0];
        peerConnectionsRef.current.forEach(pc => {
          const sender = pc.getSenders().find(s => s.track?.kind === "video");
          if (sender && screenTrack) sender.replaceTrack(screenTrack);
        });

        // When user clicks browser's "Stop Sharing" button
        screenTrack.onended = () => {
          setIsScreenSharing(false);
          setScreenStream(null);
          isScreenSharingRef.current = false;
          screenStreamRef.current = null;
          setScreenSharerName(null);
          setSwappedMainParticipantId(null);

          // Broadcast stop screen share
          wsRef.current?.send(
            JSON.stringify({
              action: "screen_share",
              display_name: myNameRef.current,
              is_sharing: false
            })
          );

          // Restore camera
          const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
          if (cameraTrack) {
            peerConnectionsRef.current.forEach(pc => {
              const sender = pc.getSenders().find(s => s.track?.kind === "video");
              if (sender) sender.replaceTrack(cameraTrack);
            });
          }
        };
      }
    } catch (err) {
      console.error("Screen sharing error:", err);
    }
  };

  return {
    handleShareScreen
  };
}
