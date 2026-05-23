"use client";

import { useEffect, useState } from "react";
import { api, Meeting } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { History, Loader2, Users } from "lucide-react";

export function RecentMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await api.getRecentMeetings();
        setMeetings(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-300" />
          <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="bg-slate-50/50 border-slate-100 shadow-sm">
              <CardContent className="p-4">
                <div className="h-5 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
                <div className="flex justify-between items-center mt-3">
                  <div className="h-4 w-12 bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
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
        <History className="w-12 h-12 mx-auto mb-3 text-slate-300" />
        <p className="text-lg font-medium">No recent meetings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <History className="w-5 h-5 text-slate-500" />
        Recent Meetings
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="bg-slate-50/50 border-slate-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-slate-800 mb-1 truncate" title={meeting.title}>
                {meeting.title}
              </h4>
              <div className="flex justify-between items-center text-sm text-slate-500 mt-3">
                <span className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> 
                  {meeting.participant_count}
                </span>
                <span>
                  {format(new Date(meeting.created_at), "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
