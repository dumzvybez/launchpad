"use client";

import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Monitor,
  Eye,
  Calendar,
  Download,
  Upload,
  RotateCcw,
  Database,
  AlertTriangle,
  Check,
  Palette,
  Sparkles,
  HelpCircle,
  Plus,
  Minus,
  Bell,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  BACKGROUND_THEMES,
  getBackgroundTheme,
} from "@/lib/career-data";
import { getLastAutoBackupTime } from "@/lib/storage";
import { HelpCentre } from "@/components/help/HelpCentre";

export function SettingsView() {
  const state = useStore((s) => s.state);
  const setPreference = useStore((s) => s.setPreference);
  const resetAll = useStore((s) => s.resetAll);
  const exportBackup = useStore((s) => s.exportBackup);
  const importBackup = useStore((s) => s.importBackup);
  const runAutoBackup = useStore((s) => s.runAutoBackup);
  const { theme, setTheme } = useTheme();

  const [confirmReset, setConfirmReset] = useState(false);
  const [customColor, setCustomColor] = useState(state.preferences.customBackground ?? "#6366F1");
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  useEffect(() => {
    setLastBackup(getLastAutoBackupTime());
  }, [state.lastAutoBackup]);

  const handleExport = () => {
    exportBackup();
    toast.success("Backup downloaded");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        const { importState } = await import("@/lib/storage");
        const data = await importState(file);
        importBackup(data);
        toast.success("Backup restored");
      } catch (err) {
        toast.error(`Import failed: ${(err as Error).message}`);
      }
    };
    input.click();
  };

  const handleRunBackupNow = () => {
    runAutoBackup();
    setLastBackup(getLastAutoBackupTime());
    toast.success("Auto-backup saved");
  };

  const handleSetTheme = (themeId: string) => {
    setPreference("backgroundTheme", themeId);
    toast.success(`Theme: ${BACKGROUND_THEMES.find((t) => t.id === themeId)?.label ?? themeId}`);
  };

  const handleSetCustomColor = (color: string) => {
    setCustomColor(color);
    setPreference("backgroundTheme", "custom");
    setPreference("customBackground", color);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Everything here actually works — and your data stays on this device.
        </p>
      </div>

      {/* Appearance */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4" /> Appearance
        </h2>

        {/* Dark/Light mode */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Theme mode
            </label>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border transition-colors",
                    theme === t ? "border-primary bg-primary/10" : "border-border/60 hover:bg-foreground/5",
                  )}
                >
                  {t === "light" && <Sun className="h-3.5 w-3.5" />}
                  {t === "dark" && <Moon className="h-3.5 w-3.5" />}
                  {t === "system" && <Monitor className="h-3.5 w-3.5" />}
                  {t[0].toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Background theme picker */}
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
              Background theme
            </label>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {BACKGROUND_THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => t.id === "custom" ? setPreference("backgroundTheme", "custom") : handleSetTheme(t.id)}
                  className={cn(
                    "h-10 rounded-lg border-2 transition-all relative",
                    state.preferences.backgroundTheme === t.id
                      ? "border-primary scale-105"
                      : "border-border/60 hover:border-border",
                  )}
                  style={{ background: t.swatch }}
                  title={t.label}
                >
                  {state.preferences.backgroundTheme === t.id && (
                    <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 mt-2 text-[10px] text-muted-foreground">
              {BACKGROUND_THEMES.map((t) => (
                <div key={t.id} className="text-center truncate">{t.label}</div>
              ))}
            </div>
          </div>

          {/* Custom color picker (when custom selected) */}
          {state.preferences.backgroundTheme === "custom" && (
            <div className="rounded-lg border border-border/60 p-3 bg-card/40">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
                Custom background color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleSetCustomColor(e.target.value)}
                  className="h-10 w-16 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => handleSetCustomColor(e.target.value)}
                  className="flex-1 px-2 py-1.5 rounded-md bg-background border border-border text-xs font-mono"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-2">
                {getBackgroundTheme("custom", customColor)?.description}
              </p>
            </div>
          )}
        </div>
      </GlassCard>

      {/* Layout & motion */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Eye className="h-4 w-4" /> Layout & motion
        </h2>
        <div className="space-y-3">
          {/* Density */}
          <SettingRow
            label="Density"
            description="Comfortable adds breathing room; compact fits more on screen."
          >
            <div className="flex gap-1">
              {(["comfortable", "compact"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setPreference("density", d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                    state.preferences.density === d
                      ? "border-primary bg-primary/10"
                      : "border-border/60 hover:bg-foreground/5",
                  )}
                >
                  {d[0].toUpperCase() + d.slice(1)}
                </button>
              ))}
            </div>
          </SettingRow>

          {/* Reduce motion */}
          <SettingRow
            label="Reduce motion"
            description="Disables animations and transitions."
          >
            <Toggle
              checked={state.preferences.reduceMotion}
              onChange={(v) => setPreference("reduceMotion", v)}
            />
          </SettingRow>

          {/* Splash screen */}
          <SettingRow
            label="Show splash screen"
            description="Plays the animated intro on every page load."
          >
            <Toggle
              checked={state.preferences.showSplash}
              onChange={(v) => setPreference("showSplash", v)}
            />
          </SettingRow>

          {/* Week starts on */}
          <SettingRow
            label="Week starts on"
            description="For calendar and heatmap displays."
          >
            <div className="flex gap-1">
              {([["Sunday", 0], ["Monday", 1]] as const).map(([label, val]) => (
                <button
                  key={val}
                  onClick={() => setPreference("weekStartsOn", val)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs border transition-colors",
                    state.preferences.weekStartsOn === val
                      ? "border-primary bg-primary/10"
                      : "border-border/60 hover:bg-foreground/5",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </SettingRow>
        </div>
      </GlassCard>

      {/* Data & backup */}
      <GlassCard className="p-5">
        <h2 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <Database className="h-4 w-4" /> Data & backup
        </h2>

        <div className="space-y-3">
          <SettingRow
            label="Auto-backup (daily)"
            description="Saves a snapshot to localStorage every day. Last backup: never"
          >
            <span className="text-[10px] text-muted-foreground font-mono">
              {lastBackup ? new Date(lastBackup).toLocaleString() : "never"}
            </span>
          </SettingRow>

          <div className="flex flex-wrap gap-2">
            <GlassButton variant="ghost" size="sm" onClick={handleRunBackupNow}>
              <Check className="h-3.5 w-3.5" /> Backup now
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" /> Download backup
            </GlassButton>
            <GlassButton variant="ghost" size="sm" onClick={handleImport}>
              <Upload className="h-3.5 w-3.5" /> Restore from file
            </GlassButton>
          </div>

          <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                  Reset all data
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Erases everything: profile, progress, lessons, chats, badges, settings. Cannot be undone. To change career/languages without losing progress, use "Restart Onboarding" below instead.
                </p>
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="text-xs px-3 py-1.5 rounded-md border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3 inline mr-1" /> Reset everything
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        resetAll();
                        setConfirmReset(false);
                        toast.success("All data reset");
                        setTimeout(() => window.location.reload(), 500);
                      }}
                      className="text-xs px-3 py-1.5 rounded-md bg-rose-500 text-white hover:bg-rose-600"
                    >
                      Yes, delete everything
                    </button>
                    <button
                      onClick={() => setConfirmReset(false)}
                      className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-foreground/5"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Restart Onboarding (Regenerate Plan) — preserves progress */}
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <div className="flex items-start gap-2">
                <RotateCcw className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
                    Restart Onboarding (Regenerate Plan)
                  </div>
                  <p className="text-[11px] text-muted-foreground mb-2">
                    Restarts onboarding so you can change your career, languages, or availability. Your lesson progress and badges are preserved — only your roadmap gets regenerated.
                  </p>
                  <button
                    onClick={() => {
                      useStore.getState().startOnboardingAgain();
                      toast.success("Restarting onboarding...");
                      setTimeout(() => window.location.reload(), 500);
                    }}
                    className="text-xs px-3 py-1.5 rounded-md border border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3 inline mr-1" /> Restart Onboarding
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Help Centre */}
      <HelpCentre />
    </div>
  );
}

function SettingRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium">{label}</div>
        {description && <div className="text-[11px] text-muted-foreground">{description}</div>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-foreground/20",
      )}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}
