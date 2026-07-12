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
 * MobileBottomNav — v5.935: redesigned to match the uploaded reference image.
 *
 * Changes from v5.934:
 * - Full-width bar attached to the bottom (not floating).
 * - Removed the "More" button (5 items only: Home, Roadmap, Learn, AI, Skills).
 * - Removed the green always-showing pill on the AI button — ALL items now use
 *   the same transparent liquid-glass treatment.
 * - Active item: pill-shaped glass highlight with primary tint + glow (matching
 *   the reference image's selected-item style).
 * - Inactive items: plain icons, no background.
 * - Safe-area padding for iOS notch devices.
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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-elevated border-t border-border/60 safe-area-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="grid grid-cols-5 gap-1 px-2 py-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                // v5.935: pill-shaped active highlight (liquid glass), plain inactive
                "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-full transition-all",
                active
                  ? "glass-flat text-primary border border-primary/30 shadow-[0_0_12px_-2px] shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform", active && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
