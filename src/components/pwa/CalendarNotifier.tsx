"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Check, Trash2, Clock } from "lucide-react";
import { useStore } from "@/lib/store";
import { todayKey } from "@/lib/storage";

/**
 * CalendarNotifier — checks calendar events every 30 seconds and fires
 * an in-app notification + browser notification when an event's time arrives.
 *
 * Section 8: supports snooze (5/10/15/30 min), Mark Done, and Delete.
 * Handles recurring events (daily/weekly/monthly) by checking if the event
 * should fire on the current day.
 */
export function CalendarNotifier() {
  const events = useStore((s) => s.state.calendarEvents);
  const activeNotifications = useStore((s) => s.state.activeNotifications);
  const addNotification = useStore((s) => s.addNotification);
  const snoozeNotification = useStore((s) => s.snoozeNotification);
  const dismissNotification = useStore((s) => s.dismissNotification);
  const deleteCalendarEvent = useStore((s) => s.deleteCalendarEvent);
  const notifiedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = todayKey();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const todayDow = now.getDay();
      const todayDom = now.getDate();

      for (const event of events) {
        // Skip already-notified (in this session) unless snooze period expired
        if (notifiedRef.current.has(event.id)) {
          // Check if snooze expired → re-notify
          if (event.snoozedUntil) {
            const snoozedUntilTime = new Date(event.snoozedUntil).getTime();
            if (now.getTime() >= snoozedUntilTime) {
              // Snooze expired — allow re-notify
              notifiedRef.current.delete(event.id);
            } else {
              continue;
            }
          } else {
            continue;
          }
        }
        if (!event.time) continue;
        if (event.completed) continue;

        // Check if event should fire today based on frequency
        let firesToday = false;
        if (!event.frequency || event.frequency === "one-time") {
          firesToday = event.date === today;
        } else if (event.frequency === "daily") {
          firesToday = true;
        } else if (event.frequency === "weekly") {
          firesToday = (event.weekdays ?? []).includes(todayDow);
        } else if (event.frequency === "monthly") {
          firesToday = todayDom === (event.dayOfMonth ?? 1);
        }

        if (!firesToday) continue;

        // Fire when current time matches event time (within 1 minute)
        if (event.time === currentTime) {
          notifiedRef.current.add(event.id);
          addNotification(event.id);

          // Fire in-app toast notification with action buttons (Section 8)
          // Primary toast: Mark Done + Snooze 5m
          toast.info(`📅 ${event.title}`, {
            description: `${event.time}${event.duration ? ` · ${event.duration}m` : ""}${event.notes ? ` — ${event.notes.slice(0, 60)}` : ""}`,
            duration: 20000,
            action: {
              label: "Mark done",
              onClick: () => dismissNotification(event.id),
            },
            cancel: {
              label: "Snooze 5m",
              onClick: () => snoozeNotification(event.id, 5),
            },
            style: {
              background: "linear-gradient(135deg, oklch(0.20 0.014 250 / 0.95), oklch(0.16 0.012 250 / 0.95))",
              border: "1px solid oklch(0.80 0.16 195 / 0.4)",
              color: "white",
              backdropFilter: "blur(20px)",
            },
            icon: <CalendarIcon className="h-4 w-4 text-primary" />,
          });
          // Secondary toast: more snooze options + delete
          setTimeout(() => {
            toast("Snooze or dismiss", {
              description: "Choose a longer snooze or delete this reminder",
              duration: 20000,
              action: {
                label: "10m",
                onClick: () => snoozeNotification(event.id, 10),
              },
              cancel: {
                label: "Delete",
                onClick: () => deleteCalendarEvent(event.id),
              },
            });
          }, 500);

          // Fire native browser notification (if permission granted)
          if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
            try {
              const n = new Notification(`📅 ${event.title}`, {
                body: `Scheduled for ${event.time}${event.duration ? ` · ${event.duration}m` : ""}`,
                icon: "/icons/icon-192.png",
                tag: event.id,
                requireInteraction: true,
              });
              n.onclick = () => {
                window.focus();
                n.close();
              };
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
  }, [events, addNotification, snoozeNotification, dismissNotification]);

  return null;
}
