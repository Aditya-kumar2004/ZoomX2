import { useMeeting } from "@/components/meeting/MeetingContext";

export function useSpeakerDetection() {
  const {
    localAudioMonitorRef,
    localAudioLevelRef,
    localStream,
    isMicOn,
    myParticipant,
    peerConnectionsRef,
    channelToNameRef,
    participants,
    setActiveSpeaker,
    activeSpeakerRef,
    lastSpokeTimeRef,
    consecutiveSpeakingCountsRef,
    myNameRef
  } = useMeeting();

  const startLocalAudioMonitor = () => {
    if (localAudioMonitorRef.current) {
      localAudioMonitorRef.current.stop();
      localAudioMonitorRef.current = null;
    }

    if (localStream && isMicOn && !myParticipant?.is_muted) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          const source = ctx.createMediaStreamSource(localStream);
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          
          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          const interval = setInterval(() => {
            const audioTrack = localStream.getAudioTracks()[0];
            if (!audioTrack || !audioTrack.enabled || !isMicOn || myParticipant?.is_muted) {
              localAudioLevelRef.current = 0;
              return;
            }
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const average = sum / bufferLength;
            localAudioLevelRef.current = average / 255;
          }, 200);

          localAudioMonitorRef.current = {
            stop: () => {
              clearInterval(interval);
              ctx.close().catch(() => {});
            }
          };
        }
      } catch (err) {
        console.error("Local mic level monitor init error:", err);
      }
    } else {
      localAudioLevelRef.current = 0;
    }
  };

  const stopLocalAudioMonitor = () => {
    if (localAudioMonitorRef.current) {
      localAudioMonitorRef.current.stop();
      localAudioMonitorRef.current = null;
    }
    localAudioLevelRef.current = 0;
  };

  const checkAudioLevels = async () => {
    const currentLevels = new Map<string, number>();

    // 1. Local level
    const myName = myNameRef.current;
    if (myName) {
      currentLevels.set(myName, localAudioLevelRef.current);
    }

    // 2. Remote levels
    for (const [channelName, pc] of peerConnectionsRef.current.entries()) {
      const displayName = channelToNameRef.current.get(channelName);
      if (!displayName) continue;

      try {
        const partInfo = participants.find(p => p.display_name === displayName);
        if (partInfo?.is_muted) {
          currentLevels.set(displayName, 0);
          continue;
        }

        const stats = await pc.getStats();
        let rtpLevel = 0;
        stats.forEach(report => {
          if (report.type === "inbound-rtp" && report.kind === "audio") {
            if (report.audioLevel !== undefined) {
              rtpLevel = report.audioLevel;
            }
          }
        });
        currentLevels.set(displayName, rtpLevel);
      } catch (e) {
        console.error("Stats error for", displayName, e);
      }
    }

    // 3. Update consecutive speaking counts
    const threshold = 0.02;
    const currentlySpeaking = new Set<string>();

    currentLevels.forEach((level, name) => {
      const count = consecutiveSpeakingCountsRef.current.get(name) || 0;
      if (level > threshold) {
        const nextCount = count + 1;
        consecutiveSpeakingCountsRef.current.set(name, nextCount);
        if (nextCount >= 2) {
          currentlySpeaking.add(name);
        }
      } else {
        consecutiveSpeakingCountsRef.current.set(name, 0);
      }
    });

    // 4. Determine dominant speaker
    let highestLevel = 0;
    let newDominantSpeaker: string | null = null;

    currentlySpeaking.forEach(name => {
      const lvl = currentLevels.get(name) || 0;
      if (lvl > highestLevel) {
        highestLevel = lvl;
        newDominantSpeaker = name;
      }
    });

    if (newDominantSpeaker) {
      setActiveSpeaker(newDominantSpeaker);
      activeSpeakerRef.current = newDominantSpeaker;
      lastSpokeTimeRef.current = Date.now();
    } else {
      const elapsedSinceLastSpeak = Date.now() - lastSpokeTimeRef.current;
      if (elapsedSinceLastSpeak > 1500) {
        setActiveSpeaker(null);
        activeSpeakerRef.current = null;
      }
    }
  };

  return {
    startLocalAudioMonitor,
    stopLocalAudioMonitor,
    checkAudioLevels
  };
}
