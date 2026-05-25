"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import { Meeting, Participant } from "@/lib/api";

interface MeetingContextProps {
  meetingId: string;
  
  // States
  meeting: Meeting | null;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>;
  myParticipant: Participant | null;
  setMyParticipant: (p: Participant | null) => void;
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  needsName: boolean;
  setNeedsName: React.Dispatch<React.SetStateAction<boolean>>;
  guestName: string;
  setGuestName: React.Dispatch<React.SetStateAction<string>>;
  remoteStreams: Map<string, MediaStream>;
  setRemoteStreams: React.Dispatch<React.SetStateAction<Map<string, MediaStream>>>;
  isMicOn: boolean;
  setIsMicOn: React.Dispatch<React.SetStateAction<boolean>>;
  isVideoOn: boolean;
  setIsVideoOn: React.Dispatch<React.SetStateAction<boolean>>;
  localStream: MediaStream | null;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  isScreenSharing: boolean;
  setIsScreenSharing: React.Dispatch<React.SetStateAction<boolean>>;
  screenStream: MediaStream | null;
  setScreenStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  screenSharerName: string | null;
  setScreenSharerName: React.Dispatch<React.SetStateAction<string | null>>;
  swappedMainParticipantId: number | null;
  setSwappedMainParticipantId: React.Dispatch<React.SetStateAction<number | null>>;
  pinnedParticipantId: number | null;
  setPinnedParticipantId: React.Dispatch<React.SetStateAction<number | null>>;
  activeSpeaker: string | null;
  setActiveSpeaker: React.Dispatch<React.SetStateAction<string | null>>;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  meetingEndedState: { isEnded: boolean; reason: "ended" | "left" | "removed" };
  setMeetingEndedState: React.Dispatch<React.SetStateAction<{ isEnded: boolean; reason: "ended" | "left" | "removed" }>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  showReactionsMenu: boolean;
  setShowReactionsMenu: React.Dispatch<React.SetStateAction<boolean>>;
  reactions: Record<number, string>;
  setReactions: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  activeSidebar: "participants" | "chat" | null;
  setActiveSidebar: (sidebar: "participants" | "chat" | null) => void;
  chatNotif: { sender: string; message: string } | null;
  setChatNotif: React.Dispatch<React.SetStateAction<{ sender: string; message: string } | null>>;
  elapsedTime: string;
  setElapsedTime: React.Dispatch<React.SetStateAction<string>>;
  showDetails: boolean;
  setShowDetails: React.Dispatch<React.SetStateAction<boolean>>;

  // Refs
  wsRef: React.MutableRefObject<WebSocket | null>;
  peerConnectionsRef: React.MutableRefObject<Map<string, RTCPeerConnection>>;
  nameToChannelRef: React.MutableRefObject<Map<string, string>>;
  channelToNameRef: React.MutableRefObject<Map<string, string>>;
  localStreamRef: React.MutableRefObject<MediaStream | null>;
  screenStreamRef: React.MutableRefObject<MediaStream | null>;
  isScreenSharingRef: React.MutableRefObject<boolean>;
  myNameRef: React.MutableRefObject<string>;
  myParticipantRef: React.MutableRefObject<Participant | null>;
  activeSpeakerRef: React.MutableRefObject<string | null>;
  lastSpokeTimeRef: React.MutableRefObject<number>;
  consecutiveSpeakingCountsRef: React.MutableRefObject<Map<string, number>>;
  localAudioMonitorRef: React.MutableRefObject<{ stop: () => void } | null>;
  localAudioLevelRef: React.MutableRefObject<number>;
  activeSidebarRef: React.MutableRefObject<"participants" | "chat" | null>;
  chatNotifTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
  remoteVideoRefs: React.MutableRefObject<Map<string, HTMLVideoElement>>;
  myChannelRef: React.MutableRefObject<string | null>;
}

const MeetingContext = createContext<MeetingContextProps | undefined>(undefined);

export function MeetingProvider({ children, meetingId }: { children: ReactNode; meetingId: string }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [myParticipant, setMyParticipantState] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [needsName, setNeedsName] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [screenSharerName, setScreenSharerName] = useState<string | null>(null);
  const [swappedMainParticipantId, setSwappedMainParticipantId] = useState<number | null>(null);
  const [pinnedParticipantId, setPinnedParticipantId] = useState<number | null>(null);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [meetingEndedState, setMeetingEndedState] = useState<{ isEnded: boolean; reason: "ended" | "left" | "removed" }>({
    isEnded: false,
    reason: "ended"
  });
  const [countdown, setCountdown] = useState(10);
  const [showReactionsMenu, setShowReactionsMenu] = useState(false);
  const [reactions, setReactions] = useState<Record<number, string>>({});
  const [activeSidebar, setActiveSidebarState] = useState<"participants" | "chat" | null>(null);
  const [chatNotif, setChatNotif] = useState<{ sender: string; message: string } | null>(null);
  const [elapsedTime, setElapsedTime] = useState("00:00:00");
  const [showDetails, setShowDetails] = useState(false);

  // Refs
  const wsRef = useRef<WebSocket | null>(null);
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const nameToChannelRef = useRef<Map<string, string>>(new Map());
  const channelToNameRef = useRef<Map<string, string>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const isScreenSharingRef = useRef(false);
  const myNameRef = useRef<string>("");
  const myParticipantRef = useRef<Participant | null>(null);
  const activeSpeakerRef = useRef<string | null>(null);
  const lastSpokeTimeRef = useRef<number>(0);
  const consecutiveSpeakingCountsRef = useRef<Map<string, number>>(new Map());
  const localAudioMonitorRef = useRef<{ stop: () => void } | null>(null);
  const localAudioLevelRef = useRef<number>(0);
  const activeSidebarRef = useRef<"participants" | "chat" | null>(null);
  const chatNotifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remoteVideoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const myChannelRef = useRef<string | null>(null);

  const setMyParticipant = (p: Participant | null) => {
    setMyParticipantState(p);
    myParticipantRef.current = p;
  };

  const setActiveSidebar = (sidebar: "participants" | "chat" | null) => {
    setActiveSidebarState(sidebar);
    activeSidebarRef.current = sidebar;
  };

  return (
    <MeetingContext.Provider
      value={{
        meetingId,
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
        remoteStreams,
        setRemoteStreams,
        isMicOn,
        setIsMicOn,
        isVideoOn,
        setIsVideoOn,
        localStream,
        setLocalStream,
        isScreenSharing,
        setIsScreenSharing,
        screenStream,
        setScreenStream,
        screenSharerName,
        setScreenSharerName,
        swappedMainParticipantId,
        setSwappedMainParticipantId,
        pinnedParticipantId,
        setPinnedParticipantId,
        activeSpeaker,
        setActiveSpeaker,
        currentPage,
        setCurrentPage,
        meetingEndedState,
        setMeetingEndedState,
        countdown,
        setCountdown,
        showReactionsMenu,
        setShowReactionsMenu,
        reactions,
        setReactions,
        activeSidebar,
        setActiveSidebar,
        chatNotif,
        setChatNotif,
        elapsedTime,
        setElapsedTime,
        showDetails,
        setShowDetails,
        
        wsRef,
        peerConnectionsRef,
        nameToChannelRef,
        channelToNameRef,
        localStreamRef,
        screenStreamRef,
        isScreenSharingRef,
        myNameRef,
        myParticipantRef,
        activeSpeakerRef,
        lastSpokeTimeRef,
        consecutiveSpeakingCountsRef,
        localAudioMonitorRef,
        localAudioLevelRef,
        activeSidebarRef,
        chatNotifTimerRef,
        remoteVideoRefs,
        myChannelRef
      }}
    >
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeeting() {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error("useMeeting must be used within a MeetingProvider");
  }
  return context;
}
