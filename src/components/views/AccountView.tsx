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

export function AccountView() {
  const state = useStore((s) => s.state);
  const updateProfile = useStore((s) => s.updateProfile);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState(state.profile.name);

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
          <span className="text-xs text-muted-foreground font-mono">
            {earnedBadges.length} / {ACHIEVEMENTS.length}
          </span>
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
    </div>
  );
}
