"use client";

import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trash2,
  Check,
  X,
  BookOpen,
  Code2,
  RotateCw,
  AlertCircle,
  Coffee,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton, GlassPill } from "@/components/glass/GlassPrimitives";
import { dateKey, todayKey } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/types";

const EVENT_CONFIG: Record<CalendarEvent["type"], { icon: typeof BookOpen; color: string; bg: string }> = {
  study: { icon: BookOpen, color: "text-teal-400", bg: "bg-teal-400/15 border-teal-400/30" },
  project: { icon: Code2, color: "text-fuchsia-400", bg: "bg-fuchsia-400/15 border-fuchsia-400/30" },
  review: { icon: RotateCw, color: "text-amber-400", bg: "bg-amber-400/15 border-amber-400/30" },
  deadline: { icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/15 border-rose-400/30" },
  break: { icon: Coffee, color: "text-cyan-400", bg: "bg-cyan-400/15 border-cyan-400/30" },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function CalendarView() {
  const events = useStore((s) => s.state.calendarEvents);
  const addEvent = useStore((s) => s.addCalendarEvent);
  const deleteEvent = useStore((s) => s.deleteCalendarEvent);
  const updateEvent = useStore((s) => s.updateCalendarEvent);

  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string>(todayKey());
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    time: "09:00",
    duration: 60,
    type: "study" as CalendarEvent["type"],
    notes: "",
    frequency: "one-time" as CalendarEvent["frequency"],
    weekdays: [] as number[],
    dayOfMonth: 1,
  });

  // Build calendar grid (6 weeks = 42 cells)
  const grid = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    // Monday-first
    const startOffset = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();

    const cells: { date: string; day: number; isCurrent: boolean; isToday: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      let dayNum: number;
      let isCurrent = false;
      const cellDate = new Date(year, month, 1);
      if (i < startOffset) {
        dayNum = daysInPrev - startOffset + i + 1;
        cellDate.setMonth(month - 1);
      } else if (i < startOffset + daysInMonth) {
        dayNum = i - startOffset + 1;
        isCurrent = true;
      } else {
        dayNum = i - startOffset - daysInMonth + 1;
        cellDate.setMonth(month + 1);
      }
      cellDate.setDate(dayNum);
      const dKey = dateKey(cellDate);
      cells.push({
        date: dKey,
        day: dayNum,
        isCurrent,
        isToday: dKey === todayKey(),
      });
    }
    return cells;
  }, [cursor]);

  // Events for selected date
  const selectedEvents = useMemo(
    () => events.filter((e) => e.date === selectedDate).sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    [events, selectedDate],
  );

  // Events by date for calendar dots
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, [events]);

  const handleAdd = () => {
    if (!draft.title.trim()) return;
    addEvent({
      title: draft.title,
      date: selectedDate,
      time: draft.time,
      duration: draft.duration,
      type: draft.type,
      notes: draft.notes,
      frequency: draft.frequency,
      weekdays: draft.frequency === "weekly" ? draft.weekdays : undefined,
      dayOfMonth: draft.frequency === "monthly" ? draft.dayOfMonth : undefined,
    });
    setDraft({ title: "", time: "09:00", duration: 60, type: "study", notes: "", frequency: "one-time", weekdays: [], dayOfMonth: 1 });
    setShowAdd(false);
  };

  const prevMonth = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const nextMonth = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => {
    const t = new Date();
    setCursor(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDate(todayKey());
  };

  return (
    <div className="view-enter space-y-4">
      <GlassCard variant="flat" className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-primary" /> Study Calendar
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Plan study sessions, project deadlines, and reviews.
            </p>
          </div>
          <GlassButton size="sm" onClick={() => setShowAdd(!showAdd)}>
            <Plus className="h-3 w-3" /> New event
          </GlassButton>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar grid */}
        <GlassCard className="lg:col-span-2">
          <div className="p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold tracking-tight">
                {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
              </h3>
              <div className="flex items-center gap-1">
                <GlassButton variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </GlassButton>
                <GlassButton variant="ghost" size="sm" onClick={goToday}>
                  Today
                </GlassButton>
                <GlassButton variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </GlassButton>
              </div>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-center text-[10px] font-mono uppercase tracking-wider text-muted-foreground py-1">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {grid.map((cell, i) => {
                const cellEvents = eventsByDate[cell.date] || [];
                const isSelected = cell.date === selectedDate;
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(cell.date)}
                    className={cn(
                      "aspect-square rounded-lg p-1.5 flex flex-col items-start transition-all border",
                      cell.isCurrent
                        ? "bg-foreground/3 hover:bg-foreground/8 border-transparent"
                        : "bg-transparent opacity-40 border-transparent hover:opacity-70",
                      isSelected && "border-primary ring-2 ring-primary/30",
                      cell.isToday && !isSelected && "bg-primary/5 border-primary/30",
                    )}
                  >
                    <span className={cn(
                      "text-xs font-medium",
                      cell.isToday && "text-primary font-bold",
                    )}>
                      {cell.day}
                    </span>
                    {cellEvents.length > 0 && (
                      <div className="mt-auto flex flex-wrap gap-0.5 w-full">
                        {cellEvents.slice(0, 3).map((e, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              "h-1 w-1 rounded-full",
                              EVENT_CONFIG[e.type].color.replace("text-", "bg-"),
                            )}
                          />
                        ))}
                        {cellEvents.length > 3 && (
                          <span className="text-[8px] text-muted-foreground">+{cellEvents.length - 3}</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </GlassCard>

        {/* Day detail */}
        <GlassCard>
          <div className="p-5">
            <div className="mb-4">
              <span className="text-eyebrow">Selected day</span>
              <h3 className="text-base font-semibold mt-1">
                {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "short",
                  day: "numeric",
                })}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Add event form */}
            {showAdd && (
              <div className="glass-flat rounded-xl p-3 mb-3 space-y-2 view-enter">
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  placeholder="Event title…"
                  className="w-full bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  autoFocus
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="time"
                    value={draft.time}
                    onChange={(e) => setDraft({ ...draft, time: e.target.value })}
                    className="bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <select
                    value={draft.type}
                    onChange={(e) => setDraft({ ...draft, type: e.target.value as CalendarEvent["type"] })}
                    className="bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="study">Study</option>
                    <option value="project">Project</option>
                    <option value="review">Review</option>
                    <option value="deadline">Deadline</option>
                    <option value="break">Break</option>
                  </select>
                </div>
                {/* Frequency (Section 8) */}
                <div>
                  <label className="text-[10px] uppercase text-muted-foreground block mb-1">Repeat</label>
                  <select
                    value={draft.frequency}
                    onChange={(e) => setDraft({ ...draft, frequency: e.target.value as CalendarEvent["frequency"] })}
                    className="w-full bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="one-time">One-time (on selected date)</option>
                    <option value="daily">Daily (every day)</option>
                    <option value="weekly">Weekly (on selected weekdays)</option>
                    <option value="monthly">Monthly (on a day of month)</option>
                  </select>
                </div>
                {draft.frequency === "weekly" && (
                  <div>
                    <label className="text-[10px] uppercase text-muted-foreground block mb-1">Repeat on</label>
                    <div className="flex gap-1">
                      {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            const wd = draft.weekdays.includes(i)
                              ? draft.weekdays.filter((x) => x !== i)
                              : [...draft.weekdays, i];
                            setDraft({ ...draft, weekdays: wd });
                          }}
                          className={cn(
                            "h-7 w-7 rounded-full text-[10px] font-mono",
                            draft.weekdays.includes(i)
                              ? "bg-primary text-primary-foreground"
                              : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10",
                          )}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {draft.frequency === "monthly" && (
                  <div>
                    <label className="text-[10px] uppercase text-muted-foreground block mb-1">Day of month</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={draft.dayOfMonth}
                      onChange={(e) => setDraft({ ...draft, dayOfMonth: parseInt(e.target.value) || 1 })}
                      className="w-full bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                )}
                <input
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  placeholder="Notes (optional)…"
                  className="w-full bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
                />
                <div className="flex items-center gap-1.5">
                  <GlassButton size="sm" onClick={handleAdd}>
                    <Check className="h-3 w-3" /> Add
                  </GlassButton>
                  <GlassButton size="sm" variant="ghost" onClick={() => setShowAdd(false)}>
                    <X className="h-3 w-3" />
                  </GlassButton>
                </div>
              </div>
            )}

            {/* Events list */}
            <div className="space-y-2">
              {selectedEvents.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-xs text-muted-foreground mb-2">No events scheduled for this day.</p>
                  <p className="text-[10px] text-muted-foreground/70">Click "+ Add event" to create a study session, deadline, or break.</p>
                </div>
              ) : (
                selectedEvents.map((e) => {
                  const cfg = EVENT_CONFIG[e.type];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={e.id}
                      className={cn(
                        "rounded-xl p-3 border flex items-start gap-3 group",
                        cfg.bg,
                        e.completed && "opacity-60",
                      )}
                    >
                      <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.color)} />
                      <div className="flex-1 min-w-0">
                        <div className={cn("text-xs font-semibold", e.completed && "line-through")}>
                          {e.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {e.time && (
                            <span className="text-[10px] font-mono text-muted-foreground flex items-center gap-0.5">
                              <Clock className="h-2.5 w-2.5" /> {e.time}
                            </span>
                          )}
                          {e.duration && (
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {e.duration}m
                            </span>
                          )}
                        </div>
                        {e.notes && (
                          <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{e.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => updateEvent(e.id, { completed: !e.completed })}
                          className="h-6 w-6 rounded-md hover:bg-foreground/10 flex items-center justify-center"
                        >
                          <Check className={cn("h-3 w-3", e.completed && "text-emerald-400")} />
                        </button>
                        <button
                          onClick={() => deleteEvent(e.id)}
                          className="h-6 w-6 rounded-md hover:bg-rose-500/15 hover:text-rose-400 flex items-center justify-center"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Upcoming events */}
      <GlassCard>
        <div className="p-5">
          <span className="text-eyebrow">Upcoming</span>
          <h3 className="text-base font-semibold mt-1 mb-4">Next 7 days</h3>
          <div className="space-y-2">
            {(() => {
              const upcoming: { date: string; events: CalendarEvent[] }[] = [];
              for (let i = 0; i < 7; i++) {
                const d = new Date();
                d.setDate(d.getDate() + i);
                const key = dateKey(d);
                const dayEvents = events.filter((e) => e.date === key);
                if (dayEvents.length > 0) upcoming.push({ date: key, events: dayEvents });
              }
              if (upcoming.length === 0) {
                return (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No upcoming events in the next 7 days.
                  </div>
                );
              }
              return upcoming.map(({ date, events: dayEvents }) => (
                <div key={date} className="flex items-start gap-3">
                  <div className="text-center shrink-0 w-12">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">
                      {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short" })}
                    </div>
                    <div className="text-lg font-bold text-stat">
                      {new Date(date + "T00:00:00").getDate()}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {dayEvents.map((e) => {
                      const cfg = EVENT_CONFIG[e.type];
                      const Icon = cfg.icon;
                      return (
                        <div key={e.id} className="flex items-center gap-2 text-xs">
                          <Icon className={cn("h-3 w-3", cfg.color)} />
                          <span className="font-medium">{e.title}</span>
                          {e.time && <span className="text-[10px] text-muted-foreground font-mono">{e.time}</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
