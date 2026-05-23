import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a ISO datetime string into full local readable preview text.
 */
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short"
    });
  } catch (e) {
    return "";
  }
}

/**
 * Format a datetime string into standard hours/minutes time representation.
 */
export function formatTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return format(date, "h:mm a");
  } catch (e) {
    return "";
  }
}

/**
 * Format a datetime string to extract day of month.
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return format(date, "dd");
  } catch (e) {
    return "";
  }
}

/**
 * Format a datetime string to extract short month name.
 */
export function formatMonth(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    return format(date, "MMM");
  } catch (e) {
    return "";
  }
}

/**
 * Convert minutes duration to user-friendly label.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} Minutes`;
  }
  const hours = minutes / 60;
  return hours === 1 ? "1 Hour" : `${hours} Hours`;
}

/**
 * Format elapsed seconds into HH:MM:SS format.
 */
export function formatElapsedTime(seconds: number): string {
  const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

/**
 * Ensure a meeting ID is formatted as XXX-XXX-XXX.
 */
export function formatMeetingId(meetingId: string | null | undefined): string {
  if (!meetingId) return "";
  const cleaned = meetingId.replace(/[^a-zA-Z0-9]/g, "");
  if (cleaned.length === 9) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6, 9)}`;
  }
  return meetingId;
}

import { toast } from "sonner";

/**
 * Shows a beautiful and polite 'Feature Coming Soon' notification.
 */
export function handleComingSoon(featureName: string) {
  toast.info("✨ Feature Coming Soon", {
    description: `We are working hard to bring "${featureName}" to you in a future update. Thank you for your patience! 💙`,
    duration: 4000,
    style: {
      borderRadius: '16px',
      background: '#0E0E2A',
      color: '#FFFFFF',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    }
  });
}

