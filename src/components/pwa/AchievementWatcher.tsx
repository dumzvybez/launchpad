"use client";

import { useEffect, useRef } from "react";
import { useStore } from "@/lib/store";

/**
 * AchievementWatcher — watches state changes and triggers the store's
 * achievement check, which queues badge toasts that BadgeToastContainer renders.
 *
 * The actual badge definitions and check logic live in:
 *   src/lib/achievements-data.ts
 *   src/lib/store.ts (checkAchievements action)
 * And the toast rendering is in:
 *   src/components/achievements/BadgeToastContainer.tsx
 */
export function AchievementWatcher() {
  const state = useStore((s) => s.state);
  const checkAchievements = useStore((s) => s.checkAchievements);
  const lastCheckedRef = useRef<number>(0);

  useEffect(() => {
    // Throttle checks to avoid running on every state change
    const now = Date.now();
    if (now - lastCheckedRef.current < 1000) return;
    lastCheckedRef.current = now;

    // Check on relevant state changes
    const hasRelevantChange =
      Object.keys(state.tasks).length > 0 ||
      state.streak.current > 0 ||
      state.lessonProgress &&
        Object.values(state.lessonProgress).some((p) => p.status === "complete") ||
      state.projects.some((p) => p.status === "shipped") ||
      state.focusSessions.some((f) => f.completed) ||
      state.notes.length > 0 ||
      state.chatConversations.some((c) => c.messages.length > 0) ||
      state.dailyChallenge.currentStreak > 0;

    if (hasRelevantChange) {
      checkAchievements();
    }
  }, [state, checkAchievements]);

  return null;
}
