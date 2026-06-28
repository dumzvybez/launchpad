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

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
        // Check for updates every hour
        setInterval(() => reg.update(), 60 * 60 * 1000);
      } catch (err) {
        console.warn("[SW] registration failed:", err);
      }
    };

    // Register after page load to avoid blocking
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
