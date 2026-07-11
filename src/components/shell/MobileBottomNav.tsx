"use client";

import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Bot,
  MoreHorizontal,
  Workflow,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/lib/types";

/**
 * MobileBottomNav — v5.930 (#7) redesigned.
 * Items: Home, Roadmap, Learn, AI, Skill Tree (replaces Flashcards).
 * AI bubble is proportionate, liquid-glass styled, cleanly integrated.
 * Order: Home → Roadmap → Learn → AI → Skill Tree → More (6 items in a 6-col grid).
 * Deviation note: added "More" as a 6th item for access to all other tabs.
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
  const setMobileNavOpen = useStore((s) => s.setMobileNavOpen);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-elevated border-t border-border/60 px-1 py-1 safe-area-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 8px)" }}
    >
      <div className="grid grid-cols-6 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          const isAI = item.id === "ai-tutor";
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-all",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground",
                // v5.930 (#7): AI button gets liquid-glass styling, proportionate size
                isAI && "glass-elevated border border-primary/20",
              )}
            >
              <Icon className={cn("h-4 w-4 transition-transform", active && "scale-110")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
        {/* More button — opens mobile drawer with all tabs */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>
    </nav>
  );
}
