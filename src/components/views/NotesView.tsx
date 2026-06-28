"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Pin,
  Trash2,
  BookOpen,
  Calendar,
  Smile,
  Frown,
  Meh,
  Sparkles,
  Save,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton, GlassPill } from "@/components/glass/GlassPrimitives";
import { todayKey, dateKey } from "@/lib/storage";
import { cn } from "@/lib/utils";
import { formatRelative } from "@/lib/store";
import type { Note } from "@/lib/types";

type Tab = "notes" | "journal";

export function NotesView() {
  const [tab, setTab] = useState<Tab>("notes");

  return (
    <div className="view-enter space-y-4">
      <GlassCard variant="flat" className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold">Knowledge Base & Journal</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Capture insights, reflect daily, build your second brain.
            </p>
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-foreground/5">
            <button
              onClick={() => setTab("notes")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                tab === "notes" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              Notes
            </button>
            <button
              onClick={() => setTab("journal")}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all",
                tab === "journal" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
              )}
            >
              Journal
            </button>
          </div>
        </div>
      </GlassCard>

      {tab === "notes" ? <NotesTab /> : <JournalTab />}
    </div>
  );
}

function NotesTab() {
  const notes = useStore((s) => s.state.notes);
  const addNote = useStore((s) => s.addNote);
  const updateNote = useStore((s) => s.updateNote);
  const deleteNote = useStore((s) => s.deleteNote);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Note | null>(null);
  const [draft, setDraft] = useState({ title: "", body: "", tags: "" });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return notes;
    return notes.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [notes, search]);

  const startNew = () => {
    setEditing(null);
    setDraft({ title: "", body: "", tags: "" });
  };

  const startEdit = (note: Note) => {
    setEditing(note);
    setDraft({
      title: note.title,
      body: note.body,
      tags: note.tags.join(", "),
    });
  };

  const save = () => {
    if (!draft.title.trim() && !draft.body.trim()) return;
    const tags = draft.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (editing) {
      updateNote(editing.id, { title: draft.title || "Untitled", body: draft.body, tags });
    } else {
      addNote({ title: draft.title || "Untitled", body: draft.body, tags });
    }
    setEditing(null);
    setDraft({ title: "", body: "", tags: "" });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Editor */}
      <GlassCard className="lg:col-span-1 h-fit lg:sticky lg:top-20">
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">
              {editing ? "Edit note" : "New note"}
            </h3>
            <GlassButton size="sm" variant="primary" onClick={save}>
              <Save className="h-3 w-3" /> Save
            </GlassButton>
          </div>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="Title…"
            className="w-full bg-transparent border-b border-border/60 focus:border-primary outline-none py-1.5 text-sm font-medium"
          />
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="Write your insights, code snippets, learnings…"
            rows={8}
            className="w-full bg-foreground/4 rounded-lg p-3 text-sm font-mono resize-y outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            value={draft.tags}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            placeholder="Tags (comma separated)"
            className="w-full bg-foreground/4 rounded-lg p-2 text-xs outline-none focus:ring-2 focus:ring-primary/30"
          />
          {(editing || draft.title || draft.body) && (
            <GlassButton size="sm" variant="ghost" onClick={() => { setEditing(null); setDraft({ title: "", body: "", tags: "" }); }}>
              Cancel
            </GlassButton>
          )}
        </div>
      </GlassCard>

      {/* Notes list */}
      <div className="lg:col-span-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes…"
            className="w-full bg-foreground/4 rounded-xl pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {filtered.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {notes.length === 0 ? "No notes yet. Write your first insight." : "No notes match your search."}
            </p>
            {notes.length === 0 && (
              <GlassButton size="sm" className="mt-3" onClick={startNew}>
                <Plus className="h-3 w-3" /> New note
              </GlassButton>
            )}
          </GlassCard>
        ) : (
          filtered.map((note) => (
            <GlassCard key={note.id} hover className="p-4 group">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold">{note.title}</h3>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatRelative(note.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-3 whitespace-pre-wrap">
                    {note.body}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {note.tags.map((t) => (
                        <GlassPill key={t}>{t}</GlassPill>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GlassButton size="icon" variant="ghost" className="h-7 w-7" onClick={() => startEdit(note)}>
                    <Sparkles className="h-3 w-3" />
                  </GlassButton>
                  <GlassButton
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:text-rose-400"
                    onClick={() => {
                      if (confirm("Delete this note?")) deleteNote(note.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </GlassButton>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}

function JournalTab() {
  const journal = useStore((s) => s.state.journal);
  const addEntry = useStore((s) => s.addJournalEntry);
  const deleteEntry = useStore((s) => s.deleteJournalEntry);

  const today = todayKey();
  const todayEntry = journal.find((e) => e.date === today);

  const [draft, setDraft] = useState({
    date: today,
    mood: (todayEntry?.mood ?? 3) as 1 | 2 | 3 | 4 | 5,
    wins: todayEntry?.wins ?? "",
    blockers: todayEntry?.blockers ?? "",
    tomorrow: todayEntry?.tomorrow ?? "",
  });

  const save = () => {
    addEntry(draft);
  };

  const moodIcons = [
    { v: 1, Icon: Frown, label: "Frustrated" },
    { v: 2, Icon: Frown, label: "Stuck" },
    { v: 3, Icon: Meh, label: "Okay" },
    { v: 4, Icon: Smile, label: "Good" },
    { v: 5, Icon: Smile, label: "Great" },
  ] as const;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Today's entry */}
      <GlassCard variant="elevated">
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-primary" />
                Today's reflection
              </h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>
            <GlassButton size="sm" onClick={save}>
              <Save className="h-3 w-3" /> Save
            </GlassButton>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Mood
            </label>
            <div className="mt-1.5 flex gap-1.5">
              {moodIcons.map(({ v, Icon, label }) => (
                <button
                  key={v}
                  onClick={() => setDraft({ ...draft, mood: v })}
                  className={cn(
                    "flex-1 h-10 rounded-xl border flex items-center justify-center transition-all",
                    draft.mood === v
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border/60 hover:border-primary/30 text-muted-foreground",
                  )}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              What did I win today?
            </label>
            <textarea
              value={draft.wins}
              onChange={(e) => setDraft({ ...draft, wins: e.target.value })}
              placeholder="Things I learned, problems I solved, code that worked…"
              rows={3}
              className="mt-1 w-full bg-foreground/4 rounded-lg p-3 text-sm resize-y outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              What blocked me?
            </label>
            <textarea
              value={draft.blockers}
              onChange={(e) => setDraft({ ...draft, blockers: e.target.value })}
              placeholder="Confusions, bugs, things I avoided…"
              rows={2}
              className="mt-1 w-full bg-foreground/4 rounded-lg p-3 text-sm resize-y outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              Tomorrow I will…
            </label>
            <textarea
              value={draft.tomorrow}
              onChange={(e) => setDraft({ ...draft, tomorrow: e.target.value })}
              placeholder="One specific next step…"
              rows={2}
              className="mt-1 w-full bg-foreground/4 rounded-lg p-3 text-sm resize-y outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </GlassCard>

      {/* Past entries */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold px-1">Past entries ({journal.length})</h3>
        {journal.length === 0 ? (
          <GlassCard className="p-8 text-center">
            <Calendar className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No past entries. Start journaling today.
            </p>
          </GlassCard>
        ) : (
          journal.slice(0, 10).map((entry) => (
            <GlassCard key={entry.id} className="p-4 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {(() => {
                      const m = moodIcons[entry.mood - 1];
                      const Icon = m?.Icon ?? Meh;
                      return <Icon className="h-3 w-3 text-muted-foreground" />;
                    })()}
                  </div>
                  {entry.wins && (
                    <p className="text-xs mt-2 line-clamp-2">
                      <span className="text-emerald-400 font-medium">Wins: </span>
                      <span className="text-muted-foreground">{entry.wins}</span>
                    </p>
                  )}
                  {entry.tomorrow && (
                    <p className="text-xs mt-1 line-clamp-2">
                      <span className="text-primary font-medium">Next: </span>
                      <span className="text-muted-foreground">{entry.tomorrow}</span>
                    </p>
                  )}
                </div>
                <GlassButton
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:text-rose-400"
                  onClick={() => deleteEntry(entry.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </GlassButton>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
}
