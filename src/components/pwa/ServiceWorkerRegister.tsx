"use client";

import { useEffect } from "react";

/**
 * ServiceWorkerRegister — registers /sw.js on mount (production only).
 * The SW caches the app shell so it works offline after first load.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    let intervalId: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    const register = async () => {
      if (cancelled) return;
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        if (cancelled) return;
        // Check for updates every hour. Track the interval id so we can
        // clear it on unmount — previously it leaked forever and held a
        // reference to `reg` even after the component was gone.
        intervalId = setInterval(() => {
          if (!cancelled) reg.update();
        }, 60 * 60 * 1000);
      } catch (err) {
        console.warn("[SW] registration failed:", err);
      }
    };

    // Register after page load to avoid blocking
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("load", register);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return null;
}
