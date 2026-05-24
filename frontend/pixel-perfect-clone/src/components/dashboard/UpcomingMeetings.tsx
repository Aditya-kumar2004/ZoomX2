"use client";

import { useEffect, useState } from "react";
import { api, Meeting } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Clock, Video, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function UpcomingMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchMeetings = async () => {
    try {
      const storedName = localStorage.getItem("zoom_user_name") || "John Doe";
      const data = await api.getUpcomingMeetings(storedName);
      setMeetings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
    // Listen for custom event from schedule modal
    window.addEventListener("meetingScheduled", fetchMeetings);
    return () => window.removeEventListener("meetingScheduled", fetchMeetings);
  }, []);

  const handleStart = async (meeting: Meeting) => {
    try {
      // Use the actual host_name from the meeting so the backend auto-admits them
      const response = await api.joinMeeting(meeting.meeting_id, meeting.host_name);
      toast.success("Starting meeting...");
      // Mark this browser as the host so the meeting room skips the name prompt
      localStorage.setItem('zoom_is_host', 'true');
      localStorage.removeItem('zoom_display_name');
      setTimeout(() => {
        window.location.href = `/meeting/${meeting.meeting_id}`;
      }, 500);
    } catch (error: any) {
      toast.error(error.message || "Failed to start meeting");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-300" />
          <div className="h-6 w-40 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="border-slate-100 shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 md:p-5">
                  <div className="flex gap-4 items-center w-full">
                    <div className="bg-slate-100 rounded-xl w-14 h-14 animate-pulse shrink-0" />
                    <div className="space-y-2 w-full max-w-[200px]">
                      <div className="h-5 w-full bg-slate-200 rounded animate-pulse" />
                      <div className="h-4 w-2/3 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="h-9 w-20 bg-slate-100 rounded-full animate-pulse shrink-0" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <Video className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-medium">No upcoming meetings</p>
        <p className="text-sm">Schedule one to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        Upcoming Meetings
      </h3>
      <div className="space-y-3">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="hover:shadow-md transition-shadow border-slate-200/60 overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex items-center justify-between p-4 md:p-5">
                <div className="flex gap-4 items-center">
                  <div className="bg-blue-50 text-blue-600 rounded-xl w-14 h-14 flex flex-col items-center justify-center font-bold">
                    <span className="text-xs uppercase">{format(new Date(meeting.scheduled_at!), "MMM")}</span>
                    <span className="text-xl leading-none">{format(new Date(meeting.scheduled_at!), "dd")}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{meeting.title}</h4>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      {format(new Date(meeting.scheduled_at!), "h:mm a")} • ID: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{meeting.meeting_id}</span>
                    </p>
                  </div>
                </div>
                <div>
                  <Button 
                    onClick={() => handleStart(meeting)}
                    className="bg-[#0B5CFF] hover:bg-[#094bdd] rounded-full px-6"
                  >
                    Start
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
