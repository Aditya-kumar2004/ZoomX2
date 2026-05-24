"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleMeetingModal({ isOpen, onClose }: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState("My Meeting");
  const [description, setDescription] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("60");
  const [isLoading, setIsLoading] = useState(false);
  const [dateError, setDateError] = useState("");
  const [formattedPreview, setFormattedPreview] = useState("");
  const [hostName, setHostName] = useState("John Doe");

  // Load user name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("zoom_user_name");
    if (stored) {
      setHostName(stored);
    }
  }, [isOpen]);

  // Reset and initialize fields when modal opens
  useEffect(() => {
    if (isOpen) {
      const d = new Date();
      d.setHours(d.getHours() + 1);
      d.setMinutes(0);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      
      setScheduledAt(`${year}-${month}-${day}T${hours}:${minutes}`);
      setTitle("My Meeting");
      setDescription("");
      setDateError("");
    }
  }, [isOpen]);

  // Validate date selection and format preview in local timezone
  useEffect(() => {
    if (!scheduledAt) {
      setDateError("Date & Time is required");
      setFormattedPreview("");
      return;
    }

    const selected = new Date(scheduledAt);
    if (isNaN(selected.getTime())) {
      setDateError("Invalid date format");
      setFormattedPreview("");
      return;
    }

    const now = new Date();
    // Allow a 60-second grace period so selecting the current minute does not trigger an immediate validation error
    const tolerance = 60000;
    if (selected.getTime() < now.getTime() - tolerance) {
      setDateError("Date & Time cannot be in the past");
    } else {
      setDateError("");
    }

    try {
      const formatted = selected.toLocaleString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
      });
      setFormattedPreview(formatted);
    } catch (e) {
      setFormattedPreview("");
    }
  }, [scheduledAt]);

  const getMinDateTimeString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduledAt) return;

    const dateVal = new Date(scheduledAt);
    const now = new Date();
    const tolerance = 60000;
    
    if (dateVal.getTime() < now.getTime() - tolerance) {
      setDateError("Date & Time cannot be in the past");
      toast.error("Cannot schedule a meeting in the past.");
      return;
    }

    try {
      setIsLoading(true);
      const dateIso = dateVal.toISOString();
      
      await api.scheduleMeeting({
        title,
        description,
        scheduled_at: dateIso,
        duration_minutes: parseInt(duration),
        host_name: hostName
      });
      
      toast.success("Meeting scheduled successfully!");
      // Dispatch custom event to trigger refresh in parent component
      window.dispatchEvent(new Event("meetingScheduled"));
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to schedule meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl text-center font-semibold">Schedule Meeting</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSchedule} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Topic</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="scheduledAt" 
                className={dateError ? "text-red-500 font-semibold" : "font-medium"}
              >
                Date & Time
              </Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                min={getMinDateTimeString()}
                className={
                  dateError 
                    ? "border-red-500 focus-visible:ring-red-500 bg-red-50/10 focus-visible:border-red-500 focus-visible:ring-offset-0 focus:border-red-500" 
                    : "focus-visible:ring-[#0B5CFF]"
                }
                required
              />
              {dateError ? (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in slide-in-from-top-1">
                  <span>⚠️</span> {dateError}
                </p>
              ) : formattedPreview ? (
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-1.5 animate-in fade-in">
                  <span>📅</span> {formattedPreview}
                </p>
              ) : (
                <p className="text-xs text-slate-400 mt-1.5">
                  Choose a future date and time for your meeting.
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Minutes</SelectItem>
                  <SelectItem value="30">30 Minutes</SelectItem>
                  <SelectItem value="45">45 Minutes</SelectItem>
                  <SelectItem value="60">1 Hour</SelectItem>
                  <SelectItem value="120">2 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-[#0B5CFF] hover:bg-[#094bdd] min-w-24 font-medium transition-colors"
              disabled={isLoading || !title.trim() || !!dateError || !scheduledAt}
            >
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
