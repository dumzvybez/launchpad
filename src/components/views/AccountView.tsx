"use client";

import { useState } from "react";
import {
  User,
  Trophy,
  Flame,
  Award,
  Star,
  Crown,
  Gem,
  Pencil,
  Save,
  X,
  Briefcase,
  GraduationCap,
  Code2,
  Lock,
  Clock,
} from "lucide-react";
import { useStore, selectLevel, selectEarnedXP, selectOverallProgress } from "@/lib/store";
import { GlassCard, GlassButton, ProgressRing, ProgressBar } from "@/components/glass/GlassPrimitives";
import { LogoMark } from "@/components/shell/Sidebar";
import { cn } from "@/lib/utils";
import { ACHIEVEMENTS, RARITY_META } from "@/lib/achievements-data";
import { CAREER_MAP, LANGUAGE_MAP, OCCUPATION_MAP } from "@/lib/career-data";
import { openPrintableHtml, copyHtmlAsPng, downloadHtmlAsPng } from "@/lib/print-utils";

export function AccountView() {
  const state = useStore((s) => s.state);
  const updateProfile = useStore((s) => s.updateProfile);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(state.profile.name);
  const [showShareModal, setShowShareModal] = useState(false);

  const level = selectLevel(state);
  const earnedXP = selectEarnedXP(state);
  const overall = selectOverallProgress(state);
  const earnedBadges = state.badges.filter((b) => b.unlockedAt);
  const career = state.profile.careerId ? CAREER_MAP[state.profile.careerId] : null;
  const occupation = state.profile.occupationId ? OCCUPATION_MAP[state.profile.occupationId] : null;

  const handleSaveName = () => {
    updateProfile({ name });
    setEditingName(false);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
        <p className="text-sm text-muted-foreground mt-1">Your profile and achievements.</p>
      </div>

      {/* Profile card — only name is editable */}
      <GlassCard className="p-5">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center text-3xl font-bold text-white shrink-0">
            {state.profile.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            {/* Name — editable */}
            <div>
              <div className="flex items-center justify-between gap-2">
                <label className="text-[10px] uppercase text-muted-foreground">Name</label>
                {!editingName && (
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                )}
              </div>
              {editingName ? (
                <div className="flex gap-2 mt-1">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-card/60 border border-border text-sm"
                    autoFocus
                  />
                  <GlassButton variant="primary" size="sm" onClick={handleSaveName}>
                    <Save className="h-3.5 w-3.5" /> Save
                  </GlassButton>
                  <GlassButton variant="ghost" size="sm" onClick={() => { setEditingName(false); setName(state.profile.name); }}>
                    <X className="h-3.5 w-3.5" />
                  </GlassButton>
                </div>
              ) : (
                <h2 className="text-xl font-bold mt-0.5">{state.profile.name || "Anonymous Learner"}</h2>
              )}
            </div>

            {/* Career — read-only */}
            <div className="flex items-start gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[10px] uppercase text-muted-foreground">Career</div>
                <div className="text-sm font-medium">
                  {career?.label ?? "—"}{state.profile.subPath ? ` (${state.profile.subPath})` : ""}
                </div>
              </div>
              <Lock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
            </div>

            {/* Occupation — read-only */}
            <div className="flex items-start gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-[10px] uppercase text-muted-foreground">Occupation</div>
                <div className="text-sm font-medium">{occupation?.label ?? "—"}</div>
              </div>
              <Lock className="h-3 w-3 text-muted-foreground shrink-0 mt-1" />
            </div>

            {/* Skill level — read-only */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
                  Skill level <Lock className="h-2.5 w-2.5" />
                </div>
                <div className="text-sm font-medium capitalize">{state.profile.skillLevel ?? "—"}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
                  Hours/day <Lock className="h-2.5 w-2.5" />
                </div>
                <div className="text-sm font-medium">{state.profile.hoursPerDay ?? "—"}h</div>
              </div>
              <div>
                <div className="text-[10px] uppercase text-muted-foreground flex items-center gap-1">
                  Days/week <Lock className="h-2.5 w-2.5" />
                </div>
                <div className="text-sm font-medium">{state.profile.daysPerWeek ?? "—"}</div>
              </div>
            </div>

            <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2 text-[11px] text-amber-700 dark:text-amber-300 flex items-start gap-1.5">
              <Lock className="h-3 w-3 shrink-0 mt-0.5" />
              <span>To change your career, skill level, occupation, languages, or availability, go to Settings → Reset.</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Level & XP */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <ProgressRing value={level.pct} size={72} strokeWidth={6}>
            <div className="flex flex-col items-center">
              <span className="text-[10px] text-muted-foreground uppercase">Level</span>
              <span className="text-lg font-bold">{level.level}</span>
            </div>
          </ProgressRing>
          <div className="flex-1">
            <div className="text-xs text-muted-foreground">Total XP</div>
            <div className="text-2xl font-bold font-mono">{earnedXP.toLocaleString()}</div>
            <div className="text-[10px] text-muted-foreground mt-1">
              {level.xpInLevel} / {level.xpForNextLevel} XP to Level {level.level + 1}
            </div>
            <ProgressBar value={level.pct} className="h-1.5 mt-1" />
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Streak</div>
            <div className="text-2xl font-bold font-mono text-orange-500">{state.streak.current}d</div>
            <div className="text-[10px] text-muted-foreground">Best: {state.streak.longest}d</div>
          </div>
        </div>
      </GlassCard>

      {/* Languages — read-only */}
      {state.roadmap && state.roadmap.languageIds.length > 0 && (
        <GlassCard className="p-5">
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Code2 className="h-4 w-4" /> Your languages <Lock className="h-3 w-3 text-muted-foreground" />
          </h2>
          <div className="flex flex-wrap gap-2">
            {state.roadmap.languageIds.map((id) => {
              const lang = LANGUAGE_MAP[id];
              if (!lang) return null;
              return (
                <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-foreground/5 border border-border/60">
                  <span className="text-lg">{lang.icon}</span>
                  <div>
                    <div className="text-xs font-medium">{lang.name}</div>
                    <div className="text-[10px] text-muted-foreground">{lang.tagline}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* Achievements */}
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Trophy className="h-4 w-4" /> Achievements
          </h2>
          <div className="flex items-center gap-2">
            {/* Section 8.2 — Share My Achievements button — opens modal with PNG/clipboard/PDF options */}
            <button
              onClick={() => setShowShareModal(true)}
              className="text-[11px] px-2.5 py-1 rounded-md bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              📤 Share Achievements
            </button>
            <span className="text-xs text-muted-foreground font-mono">
              {earnedBadges.length} / {ACHIEVEMENTS.length}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 text-[10px]">
          {Object.entries(RARITY_META).map(([rarity, meta]) => {
            const count = earnedBadges.filter((b) => b.rarity === rarity).length;
            const total = ACHIEVEMENTS.filter((a) => a.rarity === rarity).length;
            return (
              <div key={rarity} className="flex items-center gap-1" style={{ color: meta.color }}>
                {rarity === "legendary" && <Crown className="h-3 w-3" />}
                {rarity === "epic" && <Gem className="h-3 w-3" />}
                {rarity === "rare" && <Star className="h-3 w-3" />}
                {rarity === "common" && <Award className="h-3 w-3" />}
                <span className="font-mono font-semibold">{count}/{total}</span>
                <span className="capitalize">{rarity}</span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {ACHIEVEMENTS.map((badge) => {
            const earned = earnedBadges.find((b) => b.id === badge.id);
            const rarity = RARITY_META[badge.rarity];
            return (
              <div
                key={badge.id}
                className={cn(
                  "rounded-lg border-2 p-3 text-center transition-all",
                  earned ? "bg-card/80" : "opacity-50 grayscale",
                )}
                style={{
                  borderColor: earned ? rarity.color : "var(--border)",
                  boxShadow: earned ? `0 0 12px ${rarity.glow}` : "none",
                }}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className="text-xs font-semibold truncate">{badge.title}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">{badge.description}</div>
                <div
                  className="text-[9px] font-mono uppercase mt-1.5"
                  style={{ color: rarity.color }}
                >
                  {rarity.label} · {badge.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Member info */}
      <GlassCard className="p-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <LogoMark size={32} />
          <div>
            <div className="font-mono">Launchpad member since {state.profile.startDate ? new Date(state.profile.startDate).toLocaleDateString() : "today"}</div>
            <div className="text-[10px]">Privacy-first · All data on this device</div>
          </div>
        </div>
      </GlassCard>

      {showShareModal && (
        <ShareAchievementsModal onClose={() => setShowShareModal(false)} state={state} />
      )}
    </div>
  );
}

// ============================================================
// ShareAchievementsModal — modal with PNG/clipboard/PDF options
// ============================================================
function ShareAchievementsModal({
  onClose,
  state,
}: {
  onClose: () => void;
  state: import("@/lib/types").AppState;
}) {
  const [busy, setBusy] = useState<null | "png" | "clipboard" | "pdf">(null);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const earnedBadges = state.badges.filter((b) => b.unlockedAt);
  const lessonsDone = Object.values(state.lessonProgress).filter((p) => p.status === "complete").length;
  const projectsShipped = state.projects.filter((p) => p.status === "shipped").length;

  const cardInnerHtml = buildAchievementsCardInnerHtml({
    name: state.profile.name || "Learner",
    badgesCount: earnedBadges.length,
    streak: state.streak.current,
    lessonsDone,
    projectsShipped,
    badges: earnedBadges.map((b) => ({ icon: b.icon, title: b.title })),
  });

  const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>Launchpad Achievements — ${state.profile.name || "Learner"}</title>
<style>${ACHIEVEMENTS_CARD_CSS}</style></head><body>${cardInnerHtml}</body></html>`;

  const filename = `launchpad-achievements-${(state.profile.name || "learner").replace(/\s+/g, "-").toLowerCase()}`;

  const markShared = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("launchpad:progress-shared", "1");
    }
  };

  const handlePng = async () => {
    setBusy("png"); setStatus(null);
    const r = await downloadHtmlAsPng(cardInnerHtml, filename, { width: 1200, height: 675 });
    setBusy(null);
    setStatus({ ok: r.ok, msg: r.ok ? "PNG downloaded." : `Failed: ${r.error}` });
    if (r.ok) markShared();
  };

  const handleCopyClipboard = async () => {
    setBusy("clipboard"); setStatus(null);
    const r = await copyHtmlAsPng(cardInnerHtml, { width: 1200, height: 675 });
    setBusy(null);
    setStatus({
      ok: r.ok,
      msg: r.ok ? "Image copied to clipboard. Paste with Ctrl/⌘+V." : `Clipboard unavailable: ${r.error}`,
    });
    if (r.ok) markShared();
  };

  const handlePdf = () => {
    setBusy("pdf");
    const ok = openPrintableHtml(fullHtml, { filename, title: "Launchpad Achievements Card" });
    setBusy(null);
    setStatus({
      ok,
      msg: ok
        ? "Opened in a new tab — click Download Now to save as PDF."
        : "Popup blocked — downloaded the HTML file instead.",
    });
    markShared();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-achievements-title"
    >
      <div
        className="max-w-md w-full bg-card rounded-xl shadow-2xl p-5 overflow-hidden border border-border/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 id="share-achievements-title" className="text-sm font-semibold">🏆 Share Achievements</h3>
          <button onClick={onClose} className="text-xs text-muted-foreground hover:text-foreground p-1 rounded" aria-label="Close">✕</button>
        </div>
        <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
          Generate a beautiful 1200×675 shareable card showing off your badges and progress.
        </p>

        {/* Mini preview */}
        <div className="rounded-lg p-4 mb-4 text-white text-xs overflow-hidden" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="font-bold text-sm bg-gradient-to-r from-teal-400 via-fuchsia-400 to-amber-300 bg-clip-text text-transparent">🏆 Launchpad</div>
            <div className="opacity-70 text-[10px]">{state.profile.name || "Learner"}</div>
          </div>
          <div className="opacity-80 text-[10px] mb-1">{earnedBadges.length} badges · 🔥 {state.streak.current}d streak</div>
          <div className="opacity-80 text-[10px] mb-1">{lessonsDone} lessons · {projectsShipped} projects shipped</div>
          <div className="opacity-60 text-[10px] mt-2">Learning. Building. Growing.</div>
        </div>

        <div className="space-y-2">
          <GlassButton variant="primary" className="w-full justify-center" onClick={handlePng} disabled={busy !== null}>
            <Trophy className="h-3.5 w-3.5" /> {busy === "png" ? "Rendering PNG…" : "Download as PNG image"}
          </GlassButton>
          <GlassButton variant="ghost" className="w-full justify-center" onClick={handleCopyClipboard} disabled={busy !== null}>
            <Trophy className="h-3.5 w-3.5" /> {busy === "clipboard" ? "Copying…" : "Copy to clipboard (PNG)"}
          </GlassButton>
          <GlassButton variant="ghost" className="w-full justify-center" onClick={handlePdf} disabled={busy !== null}>
            <Trophy className="h-3.5 w-3.5" /> {busy === "pdf" ? "Opening…" : "Open printable page (Save as PDF)"}
          </GlassButton>
        </div>

        {status && (
          <div className={cn(
            "mt-3 rounded-md p-2 text-xs",
            status.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30",
          )} role="status">
            {status.ok ? "✅ " : "⚠️ "}{status.msg}
          </div>
        )}
      </div>
    </div>
  );
}

const ACHIEVEMENTS_CARD_CSS = `
  @page { size: 1200px 675px; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body {
    width: 100%; min-height: 100vh;
    background: #0a0a0a;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .card {
    width: 1200px; height: 675px;
    background:
      radial-gradient(circle at 15% 20%, rgba(45, 212, 191, 0.18) 0%, transparent 40%),
      radial-gradient(circle at 85% 75%, rgba(232, 121, 249, 0.15) 0%, transparent 45%),
      radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.06) 0%, transparent 60%),
      linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #312E81 100%);
    color: white;
    padding: 48px 56px;
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 25px 80px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
  }
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: relative; z-index: 1; }
  .brand { display: flex; align-items: center; gap: 12px; }
  .brand-logo { width: 44px; height: 44px; background: linear-gradient(135deg, #2DD4BF, #E879F9, #FCD34D); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .brand-text { font-size: 28px; font-weight: 800; letter-spacing: -1px; background: linear-gradient(135deg, #2DD4BF, #E879F9, #FCD34D); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
  .user-name { font-size: 16px; font-weight: 600; opacity: 0.9; }
  .title { font-size: 36px; font-weight: 800; margin: 12px 0 4px; position: relative; z-index: 1; }
  .subtitle { font-size: 14px; opacity: 0.7; margin-bottom: 24px; position: relative; z-index: 1; }
  .stats-row { display: flex; gap: 32px; margin-bottom: 28px; padding: 16px 0; border-top: 1px solid rgba(255,255,255,0.1); border-bottom: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 1; }
  .stat { display: flex; flex-direction: column; gap: 2px; }
  .stat-value { font-size: 28px; font-weight: 800; }
  .stat-value .accent { color: #2DD4BF; }
  .stat-value .accent-2 { color: #E879F9; }
  .stat-value .accent-3 { color: #FCD34D; }
  .stat-label { font-size: 10px; opacity: 0.6; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .badges-title { font-size: 12px; opacity: 0.7; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; font-weight: 600; position: relative; z-index: 1; }
  .badges { display: flex; flex-wrap: wrap; gap: 8px; flex: 1; align-content: flex-start; position: relative; z-index: 1; }
  .badge { padding: 8px 14px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; font-size: 13px; font-weight: 500; }
  .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.1); position: relative; z-index: 1; }
  .tagline { font-size: 13px; opacity: 0.7; font-style: italic; }
  .url { font-size: 11px; opacity: 0.5; font-family: monospace; }
  @media print { body { background: white; padding: 0; } .card { box-shadow: none; border-radius: 0; } }
`;

function buildAchievementsCardInnerHtml(opts: {
  name: string;
  badgesCount: number;
  streak: number;
  lessonsDone: number;
  projectsShipped: number;
  badges: { icon: string; title: string }[];
}): string {
  const badgesHtml = opts.badges.length > 0
    ? opts.badges.map((b) => `<span class="badge">${escapeHtmlAttr2(b.icon)} ${escapeHtmlAttr2(b.title)}</span>`).join("")
    : '<span style="opacity:0.5;font-size:14px;">No badges earned yet — start learning to unlock your first badge!</span>';
  return `<div class="card">
    <div class="header">
      <div class="brand">
        <div class="brand-logo">🏆</div>
        <div class="brand-text">Launchpad</div>
      </div>
      <div class="user-name">${escapeHtmlAttr2(opts.name)}</div>
    </div>
    <div class="title">Achievements Unlocked</div>
    <div class="subtitle">Coding journey milestones — earned through dedication and practice</div>
    <div class="stats-row">
      <div class="stat">
        <div class="stat-value">🏅 <span class="accent">${opts.badgesCount}</span></div>
        <div class="stat-label">Badges Earned</div>
      </div>
      <div class="stat">
        <div class="stat-value">🔥 <span class="accent-2">${opts.streak}</span></div>
        <div class="stat-label">Day Streak</div>
      </div>
      <div class="stat">
        <div class="stat-value">📚 <span class="accent-3">${opts.lessonsDone}</span></div>
        <div class="stat-label">Lessons Done</div>
      </div>
      <div class="stat">
        <div class="stat-value">📦 <span class="accent">${opts.projectsShipped}</span></div>
        <div class="stat-label">Projects Shipped</div>
      </div>
    </div>
    <div class="badges-title">Badge Collection</div>
    <div class="badges">${badgesHtml}</div>
    <div class="footer">
      <div class="tagline">Learning. Building. Growing.</div>
      <div class="url">launchpad--pi.vercel.app</div>
    </div>
  </div>`;
}

function escapeHtmlAttr2(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === '"' ? "&quot;" : "&#39;",
  );
}
