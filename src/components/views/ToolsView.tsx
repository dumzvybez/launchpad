"use client";

import { useState, useEffect, type ReactNode } from "react";
import { Calendar, StickyNote, Timer, Sparkles, ChevronDown, ChevronUp, Plus, Flame, BookOpen, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { todayKey, dateKey } from "@/lib/storage";
import { CalendarView, eventOccursOn } from "./CalendarView";
import { NotesView } from "./NotesView";
import { FocusView } from "./FocusView";

/**
 * ToolsView v4.32 — Complete UX/UI Redesign (Section 9)
 *
 * New design: a unified dashboard showing all three tools side-by-side
 * in a responsive grid. No more tab switching — everything is visible
 * and accessible at once. Each tool is in a collapsible card that
 * expands when interacted with.
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────────┐
 *   │ Hero: greeting + streak + 3 stat cards              │
 *   ├──────────────┬──────────────┬───────────────────────┤
 *   │ 📅 Calendar   │ 📝 Notes     │ ⏱ Focus Timer        │
 *   │ (live events) │ (recent)     │ (current session)     │
 *   │ [Expand ▼]   │ [Expand ▼]  │ [Expand ▼]           │
 *   └──────────────┴──────────────┴───────────────────────┘
 *   │ Expanded tool view (full width when expanded)        │
 *   └─────────────────────────────────────────────────────┘
 */

const STORAGE_KEY = "launchpad:tools-tab";

export function ToolsView() {
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  // Snapshot data
  const calendarEvents = useStore((s) => s.state.calendarEvents);
  const notes = useStore((s) => s.state.notes);
  const focusSessions = useStore((s) => s.state.focusSessions);
  const streak = useStore((s) => s.state.streak.current);
  const habits = useStore((s) => s.state.habits);

  const today = todayKey();
  const todaysEvents = calendarEvents.filter((e) => eventOccursOn(e, today));
  const todaysNotes = notes.filter((n) => n.updatedAt && dateKey(new Date(n.updatedAt)) === today);
  const todaysFocusMinutes = focusSessions
    .filter((f) => f.completed && dateKey(new Date(f.startedAt)) === today)
    .reduce((sum, f) => sum + f.durationMinutes, 0);
  const todaysHabits = habits.filter((h) => h.date === today);
  const completedHabitsToday = todaysHabits.length > 0
    ? Object.values(todaysHabits[0].habits).filter(Boolean).length
    : 0;

  const hour = new Date().getHours();
  const greeting = hour < 5 ? "Burning the midnight oil" :
                   hour < 12 ? "Good morning" :
                   hour < 17 ? "Good afternoon" :
                   hour < 21 ? "Good evening" :
                               "Wrapping up the day";

  return (
    <div className="space-y-4">
      {/* Hero card — compact greeting + stats */}
      <div className="rounded-2xl p-4 sm:p-5 glass-elevated relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background: "radial-gradient(circle at 0% 0%, oklch(0.80 0.18 195 / 0.20) 0%, transparent 50%), radial-gradient(circle at 100% 100%, oklch(0.76 0.2 320 / 0.15) 0%, transparent 50%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground uppercase tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Productivity Hub
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-1">{greeting} 👋</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {streak > 0 ? (
                  <><Flame className="h-3.5 w-3.5 inline text-orange-500" /> <strong className="text-foreground">{streak}-day streak</strong> — keep it going.</>
                ) : (
                  <>Pick a tool below to plan your day.</>
                )}
              </p>
            </div>
          </div>

          {/* Stats row — 4 mini cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            <StatCard
              icon={<Calendar className="h-3.5 w-3.5" />}
              label="Events today"
              value={todaysEvents.length}
              accent="text-teal-500"
              bg="bg-teal-500/10"
              onClick={() => setExpandedTool(expandedTool === "calendar" ? null : "calendar")}
            />
            <StatCard
              icon={<StickyNote className="h-3.5 w-3.5" />}
              label="Notes today"
              value={todaysNotes.length}
              accent="text-fuchsia-500"
              bg="bg-fuchsia-500/10"
              onClick={() => setExpandedTool(expandedTool === "notes" ? null : "notes")}
            />
            <StatCard
              icon={<Timer className="h-3.5 w-3.5" />}
              label="Focus today"
              value={todaysFocusMinutes > 0 ? `${todaysFocusMinutes}m` : "—"}
              accent="text-amber-500"
              bg="bg-amber-500/10"
              onClick={() => setExpandedTool(expandedTool === "focus" ? null : "focus")}
            />
            <StatCard
              icon={<Zap className="h-3.5 w-3.5" />}
              label="Habits today"
              value={`${completedHabitsToday}/5`}
              accent="text-violet-500"
              bg="bg-violet-500/10"
              onClick={() => setExpandedTool(expandedTool === "focus" ? null : "focus")}
            />
          </div>
        </div>
      </div>

      {/* Tool cards — 3-column grid on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Calendar card */}
        <ToolCard
          icon={<Calendar className="h-4 w-4" />}
          title="Calendar"
          color="teal"
          expanded={expandedTool === "calendar"}
          onToggle={() => setExpandedTool(expandedTool === "calendar" ? null : "calendar")}
          preview={
            <div className="space-y-1.5">
              {todaysEvents.length > 0 ? (
                todaysEvents.slice(0, 3).map((e) => (
                  <div key={e.id} className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground font-mono">{e.time || "all-day"}</span>
                    <span className="flex-1 truncate">{e.title}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2">No events today. Add one to plan your study schedule.</p>
              )}
              {todaysEvents.length > 3 && (
                <p className="text-[10px] text-muted-foreground">+{todaysEvents.length - 3} more</p>
              )}
            </div>
          }
        >
          <CalendarView />
        </ToolCard>

        {/* Notes card */}
        <ToolCard
          icon={<StickyNote className="h-4 w-4" />}
          title="Notes"
          color="fuchsia"
          expanded={expandedTool === "notes"}
          onToggle={() => setExpandedTool(expandedTool === "notes" ? null : "notes")}
          preview={
            <div className="space-y-1.5">
              {notes.length > 0 ? (
                notes.slice(0, 3).map((n) => (
                  <div key={n.id} className="flex items-center gap-2 text-xs">
                    <span className="flex-1 truncate font-medium">{n.title}</span>
                    {n.pinned && <span className="text-[10px] text-amber-500">📌</span>}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2">No notes yet. Capture your first insight.</p>
              )}
              {notes.length > 3 && (
                <p className="text-[10px] text-muted-foreground">+{notes.length - 3} more</p>
              )}
            </div>
          }
        >
          <NotesView />
        </ToolCard>

        {/* Focus card */}
        <ToolCard
          icon={<Timer className="h-4 w-4" />}
          title="Focus Timer"
          color="amber"
          expanded={expandedTool === "focus"}
          onToggle={() => setExpandedTool(expandedTool === "focus" ? null : "focus")}
          preview={
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Clock className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-muted-foreground">Today:</span>
                <span className="font-bold">{todaysFocusMinutes}m</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                <span className="text-muted-foreground">Habits:</span>
                <span className="font-bold">{completedHabitsToday}/5</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-teal-500" />
                <span className="text-muted-foreground">Sessions:</span>
                <span className="font-bold">{focusSessions.filter((f) => f.completed && dateKey(new Date(f.startedAt)) === today).length}</span>
              </div>
            </div>
          }
        >
          <FocusView />
        </ToolCard>
      </div>

      {/* Expanded tool view — full width */}
      {expandedTool && (
        <div className="rounded-2xl glass-elevated p-4 view-enter">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold flex items-center gap-2">
              {expandedTool === "calendar" && <><Calendar className="h-4 w-4 text-teal-500" /> Calendar</>}
              {expandedTool === "notes" && <><StickyNote className="h-4 w-4 text-fuchsia-500" /> Notes</>}
              {expandedTool === "focus" && <><Timer className="h-4 w-4 text-amber-500" /> Focus Timer</>}
            </h2>
            <button
              onClick={() => setExpandedTool(null)}
              className="p-1.5 rounded-lg hover:bg-foreground/10 transition-colors"
              aria-label="Collapse"
            >
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          {expandedTool === "calendar" && <CalendarView />}
          {expandedTool === "notes" && <NotesView />}
          {expandedTool === "focus" && <FocusView />}
        </div>
      )}
    </div>
  );
}

// ============================================================
// StatCard — compact stat tile
// ============================================================
function StatCard({
  icon,
  label,
  value,
  accent,
  bg,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  accent: string;
  bg: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all text-left",
        "hover:scale-[1.02] active:scale-[0.98]",
        bg
      )}
    >
      <div className={cn("shrink-0", accent)}>{icon}</div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium truncate">{label}</div>
        <div className="text-base font-bold leading-tight">{value}</div>
      </div>
    </button>
  );
}

// ============================================================
// ToolCard — collapsible tool preview card
// ============================================================
function ToolCard({
  icon,
  title,
  color,
  expanded,
  onToggle,
  preview,
  children,
}: {
  icon: ReactNode;
  title: string;
  color: "teal" | "fuchsia" | "amber";
  expanded: boolean;
  onToggle: () => void;
  preview: ReactNode;
  children: ReactNode;
}) {
  const colorClasses = {
    teal: { text: "text-teal-500", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    fuchsia: { text: "text-fuchsia-500", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
    amber: { text: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  };
  const c = colorClasses[color];

  return (
    <div className={cn("rounded-2xl glass-elevated overflow-hidden transition-all", expanded && "ring-1 ring-primary/30")}>
      <button
        onClick={onToggle}
        className={cn("w-full flex items-center gap-2 p-3 transition-colors", c.bg, "hover:brightness-110")}
      >
        <span className={c.text}>{icon}</span>
        <span className="text-sm font-semibold flex-1 text-left">{title}</span>
        <span className="text-[10px] text-muted-foreground">
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </span>
      </button>
      <div className="p-3">
        {preview}
      </div>
    </div>
  );
}
