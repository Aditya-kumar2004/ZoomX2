// src/lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/meetings';

export const getWebSocketUrl = (meetingId: string) => {
  if (process.env.NEXT_PUBLIC_WS_URL) {
    return `${process.env.NEXT_PUBLIC_WS_URL}/ws/meeting/${meetingId}/`;
  }
  try {
    const url = new URL(API_BASE_URL);
    const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${wsProtocol}//${url.host}/ws/meeting/${meetingId}/`;
  } catch (e) {
    return `ws://localhost:8000/ws/meeting/${meetingId}/`;
  }
};

export interface Meeting {
  id: number;
  meeting_id: string;
  title: string;
  description: string;
  host_name: string;
  meeting_type: 'instant' | 'scheduled';
  status: 'waiting' | 'active' | 'ended';
  scheduled_at: string | null;
  duration_minutes: number;
  invite_link: string;
  created_at: string;
  participant_count: number;
  participants: Participant[];
  chat_enabled: boolean;
}

export interface Participant {
  id: number;
  display_name: string;
  joined_at: string;
  left_at: string | null;
  is_muted: boolean;
  status: 'waiting' | 'admitted' | 'declined';
}

export interface ChatMessage {
  id: number;
  sender_name: string;
  message: string;
  timestamp: string;
}

// Helper for fetch with error handling
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    let errorMessage = '';
    
    if (errorData.error) {
      errorMessage = errorData.error;
    } else if (typeof errorData === 'object' && errorData !== null) {
      // Parse field-level validation errors from Django REST Framework (e.g. {"scheduled_at": ["..."]})
      const messages = Object.entries(errorData).map(([key, value]) => {
        const fieldName = key.replace('_', ' ');
        const formattedField = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
        const msgStr = Array.isArray(value) ? value.join(', ') : String(value);
        return `${formattedField}: ${msgStr}`;
      });
      if (messages.length > 0) {
        errorMessage = messages.join('\n');
      }
    }

    if (!errorMessage) {
      errorMessage = `API Error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Get all meetings
  getAllMeetings: () => fetchApi<Meeting[]>('/'),

  // Get upcoming scheduled meetings
  getUpcomingMeetings: (hostName?: string) => {
    const url = hostName ? `/upcoming/?host_name=${encodeURIComponent(hostName)}` : '/upcoming/';
    return fetchApi<Meeting[]>(url);
  },

  // Get recent ended meetings
  getRecentMeetings: () => fetchApi<Meeting[]>('/recent/'),

  // Get specific meeting details
  getMeetingDetail: (meetingId: string) => fetchApi<Meeting>(`/${meetingId}/`),

  // Check if a meeting is valid/joinable
  validateMeeting: (meetingId: string) => fetchApi<{ valid: boolean; error?: string; meeting_id?: string; title?: string; host_name?: string; status?: string }>(`/${meetingId}/validate/`),

  // Create an instant meeting
  createInstantMeeting: (hostName?: string, durationMinutes: number = 60, meetingId?: string) => {
    const finalHostName = hostName || (typeof window !== "undefined" ? localStorage.getItem("zoom_user_name") : null) || 'John Doe';
    return fetchApi<Meeting>('/create/', {
      method: 'POST',
      body: JSON.stringify({ host_name: finalHostName, duration_minutes: durationMinutes, meeting_id: meetingId }),
    });
  },

  // Schedule a future meeting
  scheduleMeeting: (data: { title: string; description?: string; host_name?: string; scheduled_at: string; duration_minutes: number }) =>
    fetchApi<Meeting>('/schedule/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Join a meeting
  joinMeeting: (meetingId: string, displayName: string) =>
    fetchApi<{ message: string; participant_id: number; meeting: Meeting }>(`/${meetingId}/join/`, {
      method: 'POST',
      body: JSON.stringify({ display_name: displayName }),
    }),

  // End a meeting
  endMeeting: (meetingId: string) =>
    fetchApi<{ message: string }>(`/${meetingId}/end/`, {
      method: 'PATCH',
    }),

  // --- NEW FEATURES ---
  getChatMessages: (meetingId: string) => 
    fetchApi<ChatMessage[]>(`/${meetingId}/chat/`),
    
  sendChatMessage: (meetingId: string, senderName: string, message: string) => 
    fetchApi(`/${meetingId}/chat/`, { method: 'POST', body: JSON.stringify({ sender_name: senderName, message }) }),
    
  muteParticipant: (meetingId: string, participantId: number) => 
    fetchApi(`/${meetingId}/participants/${participantId}/mute/`, { method: 'PATCH' }),
    
  removeParticipant: (meetingId: string, participantId: number) => 
    fetchApi(`/${meetingId}/participants/${participantId}/remove/`, { method: 'DELETE' }),

  toggleChat: (meetingId: string) => 
    fetchApi(`/${meetingId}/chat/toggle/`, { method: 'PATCH' }),

  admitParticipant: (meetingId: string, participantId: number) => 
    fetchApi(`/${meetingId}/participants/${participantId}/admit/`, { method: 'PATCH' }),

  declineParticipant: (meetingId: string, participantId: number) => 
    fetchApi(`/${meetingId}/participants/${participantId}/decline/`, { method: 'PATCH' }),
};
