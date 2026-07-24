"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Command,

  Maximize,
  Minimize,
  Menu,
  User,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassButton } from "@/components/glass/GlassPrimitives";
import { ThemeToggle } from "@/components/glass/ThemeToggle";
import { getNavItems } from "./Sidebar";
import { NotificationCentre } from "./NotificationCentre";
import { cn } from "@/lib/utils";

export function TopBar() {
  const setCommandOpen = useStore((s) => s.setCommandOpen);
  const setView = useStore((s) => s.setView);
  const currentView = useStore((s) => s.currentView);
  const profile = useStore((s) => s.state.profile);
  // v5.865 fix (4.13): roadmap no longer needed — getNavItems() takes no args.
  const setMobileNavOpen = useStore((s) => s.setMobileNavOpen);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // v5.865 fix (4.13): getNavItems no longer takes a parameter.
  const nav = getNavItems();
  const currentNav = nav.find((n) => n.id === currentView);

  // Fullscreen tracking
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click outside to close popovers
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen?.();
    }
  };

  return (
    <header className="sticky top-3 z-30 px-3 sm:px-4">
      <div
        className="rounded-2xl h-14 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 border"
        style={{
          background: "var(--glass-tint-strong)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderColor: "var(--glass-border)",
          boxShadow:
            "0 1px 0 0 var(--glass-highlight) inset, " +
            "0 -1px 1px 0 oklch(0 0 0 / 0.06) inset, " +
            "0 8px 24px -8px var(--glass-shadow), " +
            "0 2px 8px -2px oklch(0 0 0 / 0.08)",
        }}
      >
        {/* Hamburger — mobile/tablet only */}
        <button
          onClick={() => setMobileNavOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Page title — v6.009: hide hint on mobile to save space */}
        <div className="flex flex-col min-w-0">
          <h1 className="text-sm font-semibold tracking-tight truncate">
            {currentNav?.label || "Dashboard"}
          </h1>
          <p className="text-[10px] text-muted-foreground truncate hidden sm:block">
            {currentNav?.hint}
          </p>
        </div>

        {/* Search trigger — center (desktop only) */}
        <button
          onClick={() => setCommandOpen(true)}
          className="hidden md:flex items-center gap-2 mx-auto h-9 w-full max-w-md rounded-xl bg-foreground/4 hover:bg-foreground/8 border border-border/60 px-3 text-sm text-muted-foreground transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search tasks, notes, jump to view…</span>
          <kbd className="hidden lg:inline-flex font-mono text-[10px] px-1.5 py-0.5 rounded bg-foreground/10 border border-border/40 items-center gap-0.5">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        {/* v6.009: Mobile-optimized right side — only essential buttons.
            Fullscreen and theme toggles hidden on mobile (accessible via Settings). */}
        <div className="flex items-center gap-1 ml-auto md:ml-0 shrink-0">
          {/* Mobile search */}
          <GlassButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setCommandOpen(true)}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </GlassButton>

          {/* Group 1: utility toggles — fullscreen hidden on mobile */}
          <div className="flex items-center gap-1">
            {/* Fullscreen toggle — desktop only */}
            <GlassButton
              variant="ghost"
              size="icon"
              className="hidden sm:flex"
              onClick={toggleFullscreen}
              aria-label="Toggle fullscreen"
              title="Toggle fullscreen"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </GlassButton>

            {/* v5.931: Notification Centre — bell with count badge + snooze/clear-all panel */}
            <NotificationCentre />

            {/* Theme toggle — hidden on mobile (in Settings) */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
          </div>

          {/* Group 2: profile — separated by a divider */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-expanded={showProfileMenu}
              aria-haspopup="menu"
              className="flex items-center gap-2 ml-1 pl-3 border-l border-border/60 hover:bg-foreground/4 rounded-lg transition-colors"
              title="Profile menu"
            >
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-xs font-medium max-w-[120px] truncate">{profile.name || "Guest"}</span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {profile.careerId ? "Learner" : "Setup"}
                </span>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300 flex items-center justify-center text-xs font-bold text-white">
                {profile.name?.[0]?.toUpperCase() || "?"}
              </div>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:block" />
            </button>
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-popover shadow-2xl py-2 z-50">
                <button
                  onClick={() => { setView("account"); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-foreground/5 transition-colors"
                >
                  <User className="h-4 w-4" /> Account
                </button>
                <button
                  onClick={() => { setView("settings"); setShowProfileMenu(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-foreground/5 transition-colors"
                >
                  <Settings className="h-4 w-4" /> Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
