"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { ACHIEVEMENT_MAP, RARITY_META } from "@/lib/achievements-data";

export function BadgeToastContainer() {
  const pendingToasts = useStore((s) => s.pendingBadgeToasts);
  const dismissBadgeToast = useStore((s) => s.dismissBadgeToast);
  const [visibleToasts, setVisibleToasts] = useState<string[]>([]);

  // Delay showing new toasts by 0.5s so they don't clash with ongoing actions
  useEffect(() => {
    if (pendingToasts.length === 0) return;
    // For each new toast that isn't visible yet, schedule it to appear after 0.5s
    const newToasts = pendingToasts.filter((id) => !visibleToasts.includes(id));
    if (newToasts.length === 0) return;

    const timers = newToasts.map((id) =>
      setTimeout(() => {
        setVisibleToasts((prev) => [...prev, id]);
      }, 500),
    );

    return () => timers.forEach(clearTimeout);
  }, [pendingToasts, visibleToasts]);

  // Auto-dismiss after 5.5s (visible time)
  useEffect(() => {
    if (visibleToasts.length === 0) return;
    const timers = visibleToasts.map((id) =>
      setTimeout(() => {
        dismissBadgeToast(id);
        setVisibleToasts((prev) => prev.filter((v) => v !== id));
      }, 5500),
    );
    return () => timers.forEach(clearTimeout);
  }, [visibleToasts, dismissBadgeToast]);

  if (visibleToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
      {visibleToasts.map((badgeId) => {
        const badge = ACHIEVEMENT_MAP[badgeId];
        if (!badge) return null;
        const rarity = RARITY_META[badge.rarity];
        return (
          <div
            key={badgeId}
            className="pointer-events-auto rounded-2xl border-2 p-4 min-w-[280px] max-w-[360px] bg-popover shadow-2xl flex items-center gap-3"
            style={{
              borderColor: rarity.color,
              boxShadow: `0 8px 32px -8px ${rarity.glow}, 0 0 0 1px ${rarity.color}40`,
              animation: "badge-toast-in 500ms cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{
                background: `linear-gradient(135deg, ${rarity.color}40, ${rarity.color}20)`,
                boxShadow: `0 0 20px ${rarity.glow}`,
              }}
            >
              {badge.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wide" style={{ color: rarity.color }}>
                🏅 {rarity.label} badge earned
              </div>
              <div className="font-semibold text-sm">{badge.title}</div>
              <div className="text-[11px] text-muted-foreground">{badge.description}</div>
            </div>
            <button
              onClick={() => {
                dismissBadgeToast(badgeId);
                setVisibleToasts((prev) => prev.filter((v) => v !== badgeId));
              }}
              className="p-1 rounded hover:bg-foreground/10 shrink-0"
              aria-label="Dismiss"
            >
              <span className="text-xs text-muted-foreground">✕</span>
            </button>
          </div>
        );
      })}
      <style>{`
        @keyframes badge-toast-in {
          from { opacity: 0; transform: translateY(-20px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
