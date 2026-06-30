"use client";

import { useState } from "react";
import { Calendar, StickyNote, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { CalendarView } from "./CalendarView";
import { NotesView } from "./NotesView";
import { FocusView } from "./FocusView";

/**
 * ToolsView — merges Calendar + Notes + Focus into a single tabbed view.
 *
 * Three internal tabs at the top let users switch between the three
 * productivity tools without navigating between sidebar entries.
 */

type ToolTab = "calendar" | "notes" | "focus";

const TABS: { id: ToolTab; label: string; icon: typeof Calendar; description: string }[] = [
  { id: "calendar", label: "Calendar", icon: Calendar, description: "Study planner with recurring events & reminders" },
  { id: "notes", label: "Notes", icon: StickyNote, description: "Knowledge base & journal" },
  { id: "focus", label: "Focus Timer", icon: Timer, description: "Pomodoro & habit tracking" },
];

export function ToolsView() {
  const [activeTab, setActiveTab] = useState<ToolTab>("calendar");
  const tab = TABS.find((t) => t.id === activeTab)!;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Your productivity toolkit — calendar, notes, and focus timer in one place.
        </p>
      </div>

      {/* Tab switcher — large, clear, accessible */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-foreground/5">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-initial justify-center",
                active
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active tab description */}
      <div className="text-xs text-muted-foreground px-1">{tab.description}</div>

      {/* Active tool view */}
      <div className="view-enter">
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "notes" && <NotesView />}
        {activeTab === "focus" && <FocusView />}
      </div>
    </div>
  );
}
