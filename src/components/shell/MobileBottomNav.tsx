"use client";

import {
  LayoutDashboard,
  Map,
  GraduationCap,
  Bot,
  MoreHorizontal,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/lib/types";

/**
 * MobileBottomNav — fixed bottom navigation bar for mobile (Section 14.3).
 *
 * Shows 5 most important tabs: Dashboard, Roadmap, Learn, AI Tutor, More.
 * "More" opens the mobile slide-out drawer with all other tabs.
 *
 * Only visible on screens < lg breakpoint.
 */
const NAV_ITEMS: { id: ViewId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Home", icon: LayoutDashboard },
  { id: "roadmap", label: "Roadmap", icon: Map },
  { id: "learn", label: "Learn", icon: GraduationCap },
  { id: "ai-tutor", label: "AI", icon: Bot },
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
      <div className="grid grid-cols-5 gap-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 py-1.5 rounded-lg transition-colors",
                active
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
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
