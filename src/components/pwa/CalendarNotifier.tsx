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
  // Track which (eventId + day) pairs we've already notified for, so
  // recurring events fire again on the next day instead of being
  // permanently suppressed after the first fire.
  const notifiedRef = useRef<Set<string>>(new Set());
  // Track pending setTimeout ids so we can clear them on unmount.
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  // Track the last minute we checked, so we can fire notifications that
  // were missed because the page was closed or the tab was throttled.
  const lastCheckedMinuteRef = useRef<string | null>(null);

  useEffect(() => {
    const check = () => {
      const now = new Date();
      const today = todayKey();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const todayDow = now.getDay();
      const todayDom = now.getDate();
      const lastMin = lastCheckedMinuteRef.current;
      lastCheckedMinuteRef.current = currentTime;

      // v5.77 fix: on first run after page load, initialise lastMin to "00:00"
      // so events scheduled earlier today (but not yet notified) are caught up.
      // Previously lastMin was null on first run, so only exact-minute matches
      // fired — events missed while the page was closed were silently dropped.
      const effectiveLastMin = lastMin === null ? "00:00" : lastMin;

      for (const event of events) {
        // v5.77 fix: check `completed` FIRST. Previously the snooze branch
        // short-circuited before this check, so even completed events kept
        // re-firing if they had a stale `snoozedUntil`.
        if (event.completed) continue;

        // Per-day notification key — resets daily so recurring events
        // can fire again the next day.
        const notifiedKey = `${event.id}:${today}`;

        // Skip already-notified (today) unless snooze period expired
        if (notifiedRef.current.has(notifiedKey)) {
          // Check if snooze expired → re-notify
          if (event.snoozedUntil) {
            const snoozedUntilTime = new Date(event.snoozedUntil).getTime();
            if (now.getTime() >= snoozedUntilTime) {
              // v5.85 fix (3.6): corrected comment — snoozeNotification(event.id, 0) sets
              // snoozedUntil to undefined (minutes <= 0), preventing re-fire loop.
              // so it doesn't re-fire on every 30s tick. Previously the snoozedUntil
              // field was never cleared, causing an infinite re-fire loop every 30s
              // for the rest of the day.
              notifiedRef.current.delete(notifiedKey);
              fireEvent(event, today);
              // Clear snoozedUntil by calling snoozeNotification with 0 minutes
              // (the store action sets snoozedUntil to now + minutes; with 0 it
              // becomes "now" which immediately satisfies the "expired" check,
              // so we instead set it to undefined via a direct store update).
              snoozeNotification(event.id, 0);
            }
            continue;
          } else {
            continue;
          }
        }
        if (!event.time) continue;

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

        // v5.77 fix: removed duplicate `event.time <= currentTime` condition (dead code).
        // v5.77 fix 2: use effectiveLastMin so first-run catches up missed events.
        // Fire when:
        //   (a) current time matches event time exactly, OR
        //   (b) event time has passed since the last check (catches the
        //       case where the page was closed at 9:00 and reopened at
        //       9:05 — the user still gets the 9:00 notification).
        const shouldFire =
          event.time === currentTime ||
          (effectiveLastMin !== null &&
            event.time > effectiveLastMin &&
            event.time <= currentTime);

        if (shouldFire) {
          fireEvent(event, today);
        }
      }
    };

    const fireEvent = (event: typeof events[number], today: string) => {
      const notifiedKey = `${event.id}:${today}`;
      notifiedRef.current.add(notifiedKey);
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
      // Secondary toast: more snooze options + delete. Track the timeout
      // so it can be cleared on unmount.
      const t = setTimeout(() => {
        timeoutsRef.current.delete(t);
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
      timeoutsRef.current.add(t);

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
    };

    // Check immediately, then every 30 seconds
    check();
    // v5.85 fix (7.7): pause interval when tab is hidden to save battery/CPU
    let interval: ReturnType<typeof setInterval> | null = null;
    const startInterval = () => { if (!interval) interval = setInterval(check, 30000); };
    const stopInterval = () => { if (interval) { stopInterval();
      document.removeEventListener("visibilitychange", onVisChange); interval = null; } };
    startInterval();
    const onVisChange = () => { if (document.hidden) stopInterval(); else { startInterval(); check(); } };
    document.addEventListener("visibilitychange", onVisChange);
    return () => {
      stopInterval();
      document.removeEventListener("visibilitychange", onVisChange);
      // Clear any pending secondary-toast timeouts.
      for (const t of timeoutsRef.current) clearTimeout(t);
      timeoutsRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, addNotification, snoozeNotification, dismissNotification, deleteCalendarEvent]);

  return null;
}
