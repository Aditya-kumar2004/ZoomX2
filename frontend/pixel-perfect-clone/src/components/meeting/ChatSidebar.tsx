"use client";

import { useEffect, useState, useRef } from "react";
import { api, ChatMessage, Meeting, getWebSocketUrl } from "@/lib/api";
import { Send, Shield } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";

interface ChatSidebarProps {
  meeting: Meeting;
  currentUser: string;
  isHost: boolean;
}

export function ChatSidebar({ meeting, currentUser, isHost }: ChatSidebarProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.getChatMessages(meeting.meeting_id);
      setMessages(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Connect to WebSocket
    const wsUrl = getWebSocketUrl(meeting.meeting_id);
    const ws = new WebSocket(wsUrl);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat') {
        fetchMessages();
      }
    };
    
    wsRef.current = ws;

    return () => {
      ws.close();
    };
  }, [meeting.meeting_id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msg = input.trim();
    setInput("");
    
    try {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          action: 'chat',
          sender_name: currentUser,
          message: msg
        }));
      } else {
        await api.sendChatMessage(meeting.meeting_id, currentUser, msg);
        await fetchMessages();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1C1C1C] text-gray-200">
      {isHost && (
        <div className="p-3 border-b border-gray-800 bg-[#242424] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Shield className="w-4 h-4 text-green-500" />
            Allow participants to chat
          </div>
          <Switch 
            checked={meeting.chat_enabled} 
            onCheckedChange={() => api.toggleChat(meeting.meeting_id)} 
          />
        </div>
      )}
      
      {!meeting.chat_enabled && !isHost && (
        <div className="p-2 bg-red-500/10 border-b border-red-500/20 text-red-400 text-xs text-center">
          Chat has been disabled by the host
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.sender_name === currentUser;
          return (
            <div key={msg.id} className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-gray-300">
                  {isMe ? "You" : msg.sender_name}
                </span>
                <span className="text-[10px] text-gray-500">
                  {format(new Date(msg.timestamp), "hh:mm a")}
                </span>
              </div>
              <div className="bg-[#2D2D2D] p-3 rounded-xl rounded-tl-sm text-sm break-words w-fit max-w-[90%]">
                {msg.message}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-[#242424]">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={!meeting.chat_enabled && !isHost}
            placeholder={(!meeting.chat_enabled && !isHost) ? "Chat is disabled" : "Type a message..."}
            className="w-full bg-[#1C1C1C] border border-gray-700 rounded-full py-2.5 pl-4 pr-12 text-sm focus:outline-none focus:border-gray-500 transition-colors disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || (!meeting.chat_enabled && !isHost)}
            className="absolute right-2 p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-full transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
