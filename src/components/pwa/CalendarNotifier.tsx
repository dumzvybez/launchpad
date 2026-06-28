"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Calendar as CalendarIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import { todayKey } from "@/lib/storage";

/**
 * CalendarNotifier — checks calendar events every 30 seconds and fires
 * a browser notification + toast when an event's time arrives.
 * Uses a ref to track which events have been notified.
 */
export function CalendarNotifier() {
  const events = useStore((s) => s.state.calendarEvents);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Request notification permission on mount
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "default") {
        // Don't auto-request — wait until user creates first event
      }
    }
  }, []);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = todayKey();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      for (const event of events) {
        if (notifiedRef.current.has(event.id)) continue;
        if (!event.time) continue;
        if (event.date !== today) continue;
        if (event.completed) continue;

        // Fire when current time matches event time (within 1 minute)
        if (event.time === currentTime) {
          notifiedRef.current.add(event.id);

          // Fire toast notification
          toast.info(`📅 ${event.title}`, {
            description: `Scheduled for ${event.time}${event.duration ? ` · ${event.duration}m` : ""}`,
            duration: 10000,
            style: {
              background: "linear-gradient(135deg, oklch(0.20 0.014 250 / 0.95), oklch(0.16 0.012 250 / 0.95))",
              border: "1px solid oklch(0.80 0.16 195 / 0.4)",
              color: "white",
              backdropFilter: "blur(20px)",
            },
            icon: <CalendarIcon className="h-4 w-4 text-primary" />,
          });

          // Fire native browser notification (if permission granted)
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              new Notification(`📅 ${event.title}`, {
                body: `Scheduled for ${event.time}${event.duration ? ` · ${event.duration}m` : ""}`,
                icon: "/icons/icon-192.png",
                tag: event.id,
              });
            } catch {
              // ignore
            }
          }
        }
      }
    };

    // Check immediately, then every 30 seconds
    check();
    const interval = setInterval(check, 30000);
    return () => clearInterval(interval);
  }, [events]);

  return null;
}
