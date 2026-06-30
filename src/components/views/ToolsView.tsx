"use client";

import { useState, useEffect } from "react";
import { Calendar, StickyNote, Timer, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { todayKey } from "@/lib/storage";
import { CalendarView } from "./CalendarView";
import { NotesView } from "./NotesView";
import { FocusView } from "./FocusView";

/**
 * ToolsView — a redesigned productivity hub.
 *
 * Layout (v2.68):
 *   ┌─────────────────────────────────────────────────────────────┐
 *   │ Hero card: greeting + today's snapshot (events, notes, focus)│
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ Tab switcher: [📅 Calendar] [📝 Notes] [⏱ Focus Timer]      │
 *   ├─────────────────────────────────────────────────────────────┤
 *   │ Active tool view (Calendar / Notes / Focus)                  │
 *   └─────────────────────────────────────────────────────────────┘
 *
 * The active tab is persisted to localStorage so refresh keeps your place.
 * The Focus timer's running state is also shown as a live badge in the tab.
 */

type ToolTab = "calendar" | "notes" | "focus";

const TABS: { id: ToolTab; label: string; icon: typeof Calendar; description: string }[] = [
  { id: "calendar", label: "Calendar", icon: Calendar, description: "Plan study sessions, set recurring events, and get reminders." },
  { id: "notes",    label: "Notes",    icon: StickyNote, description: "Capture knowledge with tagged notes and a daily journal." },
  { id: "focus",    label: "Focus",    icon: Timer, description: "Pomodoro-style focus timer with habit tracking and stats." },
];

const STORAGE_KEY = "launchpad:tools-tab";

export function ToolsView() {
  // Restore last active tab from localStorage
  const [activeTab, setActiveTab] = useState<ToolTab>("calendar");
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "calendar" || saved === "notes" || saved === "focus") {
        setActiveTab(saved);
      }
    } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, activeTab); } catch { /* ignore */ }
  }, [activeTab]);

  const tab = TABS.find((t) => t.id === activeTab)!;

  // Snapshot data for the hero card
  const calendarEvents = useStore((s) => s.state.calendarEvents);
  const notes = useStore((s) => s.state.notes);
  const focusSessions = useStore((s) => s.state.focusSessions);
  const streak = useStore((s) => s.state.streak.current);

  const today = todayKey();
  const todaysEvents = calendarEvents.filter((e) => e.date === today).length;
  const todaysNotes = notes.filter((n) => n.updatedAt?.startsWith(today)).length;
  const todaysFocusMinutes = focusSessions
    .filter((f) => f.completed && f.startedAt.startsWith(today))
    .reduce((sum, f) => sum + f.durationMinutes, 0);

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Burning the midnight oil" :
                   hour < 12 ? "Good morning" :
                   hour < 17 ? "Good afternoon" :
                   hour < 21 ? "Good evening" :
                               "Wrapping up the day";

  return (
    <div className="space-y-4">
      {/* Hero card — greeting + today's snapshot */}
      <div className="rounded-2xl p-5 glass-elevated relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background: "radial-gradient(circle at 0% 0%, oklch(0.80 0.18 195 / 0.20) 0%, transparent 50%), radial-gradient(circle at 100% 100%, oklch(0.76 0.2 320 / 0.15) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide">
              <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Productivity Hub
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">{greeting} 👋</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {streak > 0 ? (
                <>You're on a <strong className="text-foreground">{streak}-day streak</strong>. Keep it going.</>
              ) : (
                <>Pick a tool below to plan your day.</>
              )}
            </p>
          </div>

          {/* Today's snapshot — 3 mini stats */}
          <div className="flex gap-3">
            <SnapshotStat
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Today's events"
              value={todaysEvents}
              accent="text-teal-500"
              onClick={() => setActiveTab("calendar")}
            />
            <SnapshotStat
              icon={<StickyNote className="h-3.5 w-3.5" />}
              label="Notes today"
              value={todaysNotes}
              accent="text-fuchsia-500"
              onClick={() => setActiveTab("notes")}
            />
            <SnapshotStat
              icon={<Timer className="h-3.5 w-3.5" />}
              label="Focus today"
              value={todaysFocusMinutes > 0 ? `${todaysFocusMinutes}m` : "—"}
              accent="text-amber-500"
              onClick={() => setActiveTab("focus")}
            />
          </div>
        </div>
      </div>

      {/* Tab switcher — large, clear, accessible */}
      <div
        role="tablist"
        aria-label="Tools"
        className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-foreground/5"
      >
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = t.id === activeTab;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={active}
              aria-controls={`tool-panel-${t.id}`}
              id={`tool-tab-${t.id}`}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex-1 sm:flex-initial justify-center",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                active
                  ? "bg-background text-foreground shadow-sm border border-border/60"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Active tab description */}
      <div className="text-xs text-muted-foreground px-1 leading-relaxed">{tab.description}</div>

      {/* Active tool view */}
      <div
        id={`tool-panel-${activeTab}`}
        role="tabpanel"
        aria-labelledby={`tool-tab-${activeTab}`}
        className="view-enter"
      >
        {activeTab === "calendar" && <CalendarView />}
        {activeTab === "notes" && <NotesView />}
        {activeTab === "focus" && <FocusView />}
      </div>
    </div>
  );
}

// ============================================================
// SnapshotStat — a single mini-stat tile in the hero card
// ============================================================
function SnapshotStat({
  icon,
  label,
  value,
  accent,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors text-left min-w-[88px]"
    >
      <span className={cn("flex items-center gap-1 text-[10px] uppercase tracking-wide font-medium", accent)}>
        {icon}
        {label}
      </span>
      <span className="text-lg font-bold font-mono leading-tight">{value}</span>
    </button>
  );
}
