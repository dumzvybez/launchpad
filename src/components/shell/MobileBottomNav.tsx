"use client";

import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Bot,
  Workflow,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/lib/types";

/**
 * MobileBottomNav — v6.010 (UI-B mobile refinement).
 *
 * Mobile-first redesign goals:
 * - Fixed, high-contrast bar attached to the bottom of the viewport.
 * - 56px content height + safe-area-inset-bottom padding for iOS home
 *   indicator / Android gesture bar.
 * - 5 items max (Home, Roadmap, Learn, AI, Skills).
 * - Each item is a ≥44px touch target.
 * - Active item: solid pill with primary tint + glow + clear icon/label color.
 * - Inactive: muted-foreground, plain.
 * - Top border + glass background for separation from content above.
 * - The AppShell adds `pb-24 lg:pb-0` on the main content area so the
 *   footer/body is never blocked by this bar.
 *
 * Note: globals.css defines `.safe-bottom` (padding-bottom: env(safe-area-
 * inset-bottom)). We use both the class AND an inline style fallback for
 * robustness on older iOS Safari versions.
 */
const NAV_ITEMS: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "learn", label: "Learn", icon: GraduationCap },
  { id: "ai-tutor", label: "AI", icon: Bot },
  { id: "skill-tree", label: "Skills", icon: Workflow },
];

export function MobileBottomNav() {
  const currentView = useStore((s) => s.currentView);
  const setView = useStore((s) => s.setView);

  return (
    <nav
      aria-label="Primary mobile navigation"
      className={cn(
        // Fixed to viewport bottom, only on mobile (< lg).
        "lg:hidden fixed bottom-0 left-0 right-0 z-40",
        // High-contrast glass background with a strong top border for separation.
        "glass-elevated border-t border-border/70",
        // Reserve space for the iOS home indicator / Android gesture bar.
        "safe-bottom",
      )}
      style={{
        // Inline fallback: ensures safe-area even if the .safe-bottom class
        // is overridden by another stylesheet. 8px minimum so the bar isn't
        // flush against the screen edge on devices without a home indicator.
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 6px)",
        // Subtle top highlight so the bar reads as a distinct surface.
        boxShadow: "0 -1px 0 0 rgb(0 0 0 / 0.04), 0 -8px 24px -12px rgb(0 0 0 / 0.18)",
      }}
    >
      <div className="grid grid-cols-5 gap-0.5 px-1.5 pt-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              // Each button is a ≥48px touch target (44px min + breathing room).
              className={cn(
                "relative flex flex-col items-center justify-center gap-1",
                "min-h-[48px] min-w-[44px] rounded-xl transition-all",
                "active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {/* Active pill background — sits behind icon+label */}
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-1.5 inset-y-1 rounded-xl bg-primary/12 border border-primary/25 shadow-[0_0_14px_-3px] shadow-primary/30"
                />
              )}
              <Icon
                className={cn(
                  "relative h-[22px] w-[22px] transition-transform",
                  active && "scale-110",
                )}
                strokeWidth={active ? 2.4 : 2}
              />
              <span
                className={cn(
                  "relative text-[10px] leading-none font-medium tracking-tight",
                  active && "font-semibold",
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
