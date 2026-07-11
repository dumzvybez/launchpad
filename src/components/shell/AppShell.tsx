"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/glass/AuroraBackground";
// v5.865 fix (4.13): getNavItems import removed — unused in AppShell.
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette, useCommandPaletteShortcut } from "./CommandPalette";
import { SplashScreen } from "./SplashScreen";
import { OnboardingFlow } from "./OnboardingFlow";
// Lazy-load all 17 views to cut the initial bundle size.
// Each view (and its heavy deps — react-syntax-highlighter, Pyodide, etc.)
// is only loaded when the user actually navigates to that tab.
// Loading fallback is a centered spinner so users see immediate feedback.
const viewLoadingFallback = () => (
  <div className="flex items-center justify-center py-12">
    <div className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);
const DashboardView = dynamic(() => import("@/components/views/DashboardView").then(m => ({ default: m.DashboardView })), { loading: viewLoadingFallback });
const RoadmapView = dynamic(() => import("@/components/views/RoadmapView").then(m => ({ default: m.RoadmapView })), { loading: viewLoadingFallback });
const LearnView = dynamic(() => import("@/components/views/LearnView").then(m => ({ default: m.LearnView })), { loading: viewLoadingFallback });
const PlaygroundView = dynamic(() => import("@/components/views/PlaygroundView").then(m => ({ default: m.PlaygroundView })), { loading: viewLoadingFallback });
const DailyChallengeView = dynamic(() => import("@/components/views/DailyChallengeView").then(m => ({ default: m.DailyChallengeView })), { loading: viewLoadingFallback });
const FlashcardsView = dynamic(() => import("@/components/views/FlashcardsView").then(m => ({ default: m.FlashcardsView })), { loading: viewLoadingFallback });
const SkillTreeView = dynamic(() => import("@/components/views/SkillTreeView").then(m => ({ default: m.SkillTreeView })), { loading: viewLoadingFallback });
const NotesView = dynamic(() => import("@/components/views/NotesView").then(m => ({ default: m.NotesView })), { loading: viewLoadingFallback });
const ProjectsView = dynamic(() => import("@/components/views/ProjectsView").then(m => ({ default: m.ProjectsView })), { loading: viewLoadingFallback });
const FocusView = dynamic(() => import("@/components/views/FocusView").then(m => ({ default: m.FocusView })), { loading: viewLoadingFallback });
const AnalyticsView = dynamic(() => import("@/components/views/AnalyticsView").then(m => ({ default: m.AnalyticsView })), { loading: viewLoadingFallback });
const CareerView = dynamic(() => import("@/components/views/CareerView").then(m => ({ default: m.CareerView })), { loading: viewLoadingFallback });
const CalendarView = dynamic(() => import("@/components/views/CalendarView").then(m => ({ default: m.CalendarView })), { loading: viewLoadingFallback });
const AITutorView = dynamic(() => import("@/components/views/AITutorView").then(m => ({ default: m.AITutorView })), { loading: viewLoadingFallback });
const CommunityView = dynamic(() => import("@/components/views/CommunityView").then(m => ({ default: m.CommunityView })), { loading: viewLoadingFallback });
const ToolsView = dynamic(() => import("@/components/views/ToolsView").then(m => ({ default: m.ToolsView })), { loading: viewLoadingFallback });
const AccountView = dynamic(() => import("@/components/views/AccountView").then(m => ({ default: m.AccountView })), { loading: viewLoadingFallback });
const SettingsView = dynamic(() => import("@/components/views/SettingsView").then(m => ({ default: m.SettingsView })), { loading: viewLoadingFallback });
import { AITutorFloating } from "@/components/ai/AITutorFloating";
import { BadgeToastContainer } from "@/components/achievements/BadgeToastContainer";
// v5.923: FirstTimeTour removed — replaced by the VersionUpdateDialog (release-notes popup).
import { VersionUpdateDialog } from "@/components/shell/VersionUpdateDialog";
import { FirstVisitHints } from "@/components/shell/FirstVisitHints";
// v5.865 fix (10.2): MobileBanner import removed — dead no-op component.
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { Footer } from "@/components/shell/Footer";
import { X, PanelLeftOpen } from "lucide-react";

export function AppShell() {
  const currentView = useStore((s) => s.currentView);
  const hydrate = useStore((s) => s.hydrate);
  const hydrated = useStore((s) => s.hydrated);
  const focusMode = useStore((s) => s.focusMode);
  const showSplash = useStore((s) => s.state.preferences.showSplash);
  const reduceMotion = useStore((s) => s.state.preferences.reduceMotion);
  const density = useStore((s) => s.state.preferences.density);
  const onboardingCompleted = useStore((s) => s.state.onboardingCompleted);
  const forceOnboarding = useStore((s) => s.forceOnboarding);
  const clearForceOnboarding = useStore((s) => s.clearForceOnboarding);
  const mobileNavOpen = useStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useStore((s) => s.setMobileNavOpen);
  const setView = useStore((s) => s.setView);
  const roadmap = useStore((s) => s.state.roadmap);

  // v5.865 fix (4.3): persist splashDone in sessionStorage so the splash
  // only plays once per browser session (not on every page reload).
  const [splashDone, setSplashDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.sessionStorage.getItem("launchpad:splash-done") === "1"; } catch { return false; }
  });
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  // Section 14 — sidebar collapse state, persisted to localStorage
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try { return window.localStorage.getItem("launchpad:sidebar-collapsed") === "true"; } catch { return false; }
  });
  useEffect(() => {
    try { window.localStorage.setItem("launchpad:sidebar-collapsed", String(sidebarCollapsed)); } catch { /* ignore */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarCollapsed]);

  useEffect(() => {
    hydrate();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrate]);

  useCommandPaletteShortcut();

  // v5.76 — Clean URL routing (pathname-based, no hash).
  // v5.92 (Part 5): Extended to support sub-paths for deep-linking:
  //   /roadmap/phase/3       → roadmap view, phase 3 selected
  //   /learn/python/6        → learn view, track=python, lesson 6
  //   /projects/[projectId]  → projects view, specific project selected
  // On mount: read the pathname and set the view + sub-state.
  // On view change: update the URL via pushState (no page reload).
  // On popstate (back/forward): read the URL and set the view + sub-state.
  const VALID_VIEWS = ["dashboard","roadmap","learn","playground","daily-challenge","flashcards","skill-tree","calendar","notes","projects","focus","analytics","career","ai-tutor","community","tools","account","settings"];

  // v5.92 (Part 5): Parse sub-paths from the URL.
  const parseSubPath = (path: string) => {
    const parts = path.split("/").filter(Boolean); // e.g. ["roadmap", "phase", "3"]
    if (parts.length === 0) return { view: "dashboard", subPath: [] };
    const view = VALID_VIEWS.includes(parts[0]) ? parts[0] : "dashboard";
    return { view, subPath: parts.slice(1) };
  };

  useEffect(() => {
    const viewFromPath = () => {
      const rawPath = window.location.pathname.slice(1); // remove leading /
      const { view, subPath } = parseSubPath(rawPath);

      if (view !== currentView) {
        setView(view as typeof currentView);
      }

      // v5.92 (Part 5): Handle sub-paths for deep-linking
      // v5.928 (#3): Extended to module/task level:
      //   /roadmap/phase/3/module/[moduleId]/task/[taskId]
      if (view === "roadmap" && subPath.length >= 2 && subPath[0] === "phase") {
        const phaseNum = parseInt(subPath[1], 10);
        if (!isNaN(phaseNum) && phaseNum > 0) {
          const phase = useStore.getState().state.roadmap?.phases.find(p => p.number === phaseNum);
          if (phase) {
            useStore.getState().selectPhase(phase.id);
            // v5.928 (#3): parse module/task if present
            // subPath: ["phase", "3", "module", "moduleId", "task", "taskId"]
            const moduleIdx = subPath.indexOf("module");
            if (moduleIdx !== -1 && moduleIdx + 1 < subPath.length) {
              const moduleId = subPath[moduleIdx + 1];
              useStore.getState().selectModule(moduleId);
              const taskIdx = subPath.indexOf("task");
              if (taskIdx !== -1 && taskIdx + 1 < subPath.length) {
                useStore.getState().selectTask(subPath[taskIdx + 1]);
              }
            }
          }
        }
      } else if (view === "roadmap" && subPath.length === 0) {
        // /roadmap (no sub-path) → clear phase selection
        useStore.getState().selectPhase(null);
        useStore.getState().selectModule(null);
        useStore.getState().selectTask(null);
      }

      if (view === "learn" && subPath.length >= 2) {
        // /learn/python/6 → select track=python, lesson 6
        const trackId = subPath[0];
        const lessonNum = parseInt(subPath[1], 10);
        const lessonId = !isNaN(lessonNum) ? `${trackId}-${String(lessonNum).padStart(2, "0")}` : null;
        if (lessonId) {
          useStore.getState().setLearnTabState({
            tab: "lesson",
            selectedLessonId: lessonId,
            selectedTrack: trackId,
          });
        } else if (trackId) {
          // /learn/python → just select the track
          useStore.getState().setLearnTabState({
            tab: "tracks",
            selectedLessonId: null,
            selectedTrack: trackId,
          });
        }
      } else if (view === "learn" && subPath.length === 0) {
        // /learn (no sub-path) → tracks list
        useStore.getState().setLearnTabState({
          tab: "tracks",
          selectedLessonId: null,
          selectedTrack: null,
        });
      }

      if (view === "projects" && subPath.length >= 1) {
        // /projects/[projectId] → set deep-link target for ProjectsView to pick up
        useStore.setState({ deepLinkProjectId: subPath[0] });
      }
    };
    viewFromPath();
    window.addEventListener("popstate", viewFromPath);
    return () => window.removeEventListener("popstate", viewFromPath);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setView]);

  // v5.92 (Part 5): Update URL when the view or sub-state changes.
  // For views with sub-state (roadmap phase, learn lesson), the sub-state
  // components push their own URLs. This effect only handles top-level view changes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const expectedBase = `/${currentView}`;
      // Only pushState if the base view changed (not if we're already on a sub-path
      // of the same view — e.g. /roadmap/phase/3 should not be overwritten to /roadmap)
      const currentBase = "/" + (currentPath.split("/").filter(Boolean)[0] ?? "");
      if (currentBase !== expectedBase) {
        window.history.pushState(null, "", expectedBase);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // Auto-close the mobile drawer whenever the user navigates to a new view.
  // Without this, tapping any nav item in the mobile drawer leaves the
  // drawer covering the screen — the user has to manually tap the backdrop
  // to see the new view.
  useEffect(() => {
    setMobileNavOpen(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView, setMobileNavOpen]);

  // Stable callback so SplashScreen's effect doesn't re-run on every AppShell
  // re-render. Previously the inline arrow broke SplashScreen's effect deps,
  // causing its timers to reset (and the splash to extend) whenever any
  // subscribed store value changed mid-splash.
  // v5.865 fix (4.3): also persist to sessionStorage so reloads skip splash.
  const onSplashDone = useCallback(() => {
    setSplashDone(true);
    try { window.sessionStorage.setItem("launchpad:splash-done", "1"); } catch { /* ignore */ }
  }, []);

  if (hydrated && showSplash && !splashDone) {
    return <SplashScreen onDone={onSplashDone} />;
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <span className="text-xs text-muted-foreground font-mono">Loading launchpad…</span>
        </div>
      </div>
    );
  }

  if ((!onboardingCompleted || forceOnboarding) && !onboardingDismissed) {
    // v5.927 (#7): ensure the URL consistently shows /onboarding throughout
    // the entire onboarding flow (not just whatever the user landed on).
    if (typeof window !== "undefined" && window.location.pathname !== "/onboarding") {
      window.history.replaceState(null, "", "/onboarding");
    }
    return <OnboardingFlow onDone={() => { setOnboardingDismissed(true); clearForceOnboarding(); }} />;
  }

  return (
    <div
      className={cn(
        "relative min-h-screen flex",
        reduceMotion && "reduce-motion",
        density === "compact" && "density-compact",
      )}
    >
      <AuroraBackground />

      {/* Desktop sidebar — v5.928 (#4): full hide on collapse with hover-reveal.
          When collapsed, the container is 0 width. A hover zone at the left edge
          reveals a hamburger icon; clicking it re-expands the sidebar. */}
      {!focusMode && (
        <>
          {sidebarCollapsed ? (
            // Collapsed: thin hover zone at the left edge with a hamburger icon
            <div
              className="hidden lg:flex shrink-0 sticky top-0 self-start h-screen items-start p-3 group"
              style={{ width: "auto" }}
            >
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="h-10 w-10 rounded-xl glass-elevated flex items-center justify-center text-muted-foreground hover:text-foreground transition-all opacity-0 group-hover:opacity-100"
                aria-label="Expand sidebar"
              >
                <PanelLeftOpen className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="hidden lg:block shrink-0 p-3 sticky top-0 self-start h-screen transition-all duration-300 w-[244px]">
              <Sidebar collapsedState={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />
            </div>
          )}
        </>
      )}

      {/* Mobile slide-out drawer */}
      {!focusMode && mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="relative w-[280px] max-w-[85vw] h-full p-3 bg-background">
            <button
              onClick={() => setMobileNavOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg hover:bg-foreground/10"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {!focusMode && <TopBar />}

        {/* Offline banner (Section 14.2) */}
        {!focusMode && <OfflineBanner />}

        {/* v5.865 fix (10.2): MobileBanner removed — was a no-op dead component. */}

        <main className={focusMode ? "flex-1 p-3 sm:p-6" : "flex-1 p-3 sm:p-6 pt-4 pb-24 lg:pb-6"}>
          <div className="max-w-6xl mx-auto">
            {(() => {
              switch (currentView) {
                case "dashboard": return <DashboardView />;
                case "roadmap": return <RoadmapView />;
                case "learn": return <LearnView />;
                case "playground": return <PlaygroundView />;
                case "daily-challenge": return <DailyChallengeView />;
                case "flashcards": return <FlashcardsView />;
                case "skill-tree": return <SkillTreeView />;
                case "calendar": return <CalendarView />;
                case "notes": return <NotesView />;
                case "projects": return <ProjectsView />;
                case "focus": return <FocusView />;
                case "analytics": return <AnalyticsView />;
                case "career": return <CareerView />;
                case "ai-tutor": return <AITutorView />;
                case "community": return <CommunityView />;
                case "tools": return <ToolsView />;
                case "account": return <AccountView />;
                case "settings": return <SettingsView />;
                default: return <DashboardView />;
              }
            })()}
          </div>
        </main>

        {!focusMode && <Footer />}
      </div>

      {/* Mobile bottom navigation (Section 14.3) */}
      {!focusMode && <MobileBottomNav />}

      <CommandPalette />

      {/* AI Tutor floating bubble — always visible (bubble becomes minimize button on ai-tutor tab) */}
      {!focusMode && <AITutorFloating />}

      {/* Badge toasts */}
      <BadgeToastContainer />

      {/* v5.923: Release-notes popup — shown once per version update (and once
          for new users after onboarding). See src/lib/version-info.ts. */}
      <VersionUpdateDialog />

      {/* v5.926 (D2): First-visit contextual hints + Command Palette tip. */}
      <FirstVisitHints />
    </div>
  );
}
