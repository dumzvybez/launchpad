"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/glass/AuroraBackground";
import { Sidebar, getNavItems } from "./Sidebar";
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
import { FirstTimeTour } from "@/components/tour/FirstTimeTour";
import { MobileBanner } from "@/components/shell/MobileBanner";
import { MobileBottomNav } from "@/components/shell/MobileBottomNav";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";
import { Footer } from "@/components/shell/Footer";
import { X } from "lucide-react";

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

  const [splashDone, setSplashDone] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useCommandPaletteShortcut();

  if (hydrated && showSplash && !splashDone) {
    return <SplashScreen onDone={() => setSplashDone(true)} />;
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

      {/* Desktop sidebar */}
      {!focusMode && (
        <div className="hidden lg:block w-[244px] shrink-0 p-3 sticky top-0 self-start h-screen">
          <Sidebar />
        </div>
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

        {/* Mobile banner */}
        {!focusMode && <MobileBanner />}

        <main className={focusMode ? "flex-1 p-3 sm:p-6" : "flex-1 p-3 sm:p-6 pt-4 pb-24 lg:pb-6"}>
          <div className="max-w-6xl mx-auto">
            {(() => {
              switch (currentView) {
                case "dashboard": return <DashboardView />;
                case "roadmap": return <RoadmapView />;
                case "learn": return <LearnView />;
                case "playground": return <PlaygroundView />;
                case "daily-challenge": return <DailyChallengeView />;
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

      {/* First-time tour overlay */}
      <FirstTimeTour />
    </div>
  );
}
