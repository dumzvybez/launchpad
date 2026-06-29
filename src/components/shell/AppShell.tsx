"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AuroraBackground } from "@/components/glass/AuroraBackground";
import { Sidebar, getNavItems } from "./Sidebar";
import { TopBar } from "./TopBar";
import { CommandPalette, useCommandPaletteShortcut } from "./CommandPalette";
import { SplashScreen } from "./SplashScreen";
import { OnboardingFlow } from "./OnboardingFlow";
import { DashboardView } from "@/components/views/DashboardView";
import { RoadmapView } from "@/components/views/RoadmapView";
import { LearnView } from "@/components/views/LearnView";
import { PlaygroundView } from "@/components/views/PlaygroundView";
import { DailyChallengeView } from "@/components/views/DailyChallengeView";
import { SkillTreeView } from "@/components/views/SkillTreeView";
import { NotesView } from "@/components/views/NotesView";
import { ProjectsView } from "@/components/views/ProjectsView";
import { FocusView } from "@/components/views/FocusView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { CareerView } from "@/components/views/CareerView";
import { CalendarView } from "@/components/views/CalendarView";
import { AITutorView } from "@/components/views/AITutorView";
import { CommunityView } from "@/components/views/CommunityView";
import { AccountView } from "@/components/views/AccountView";
import { SettingsView } from "@/components/views/SettingsView";
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
            {currentView === "dashboard" && <DashboardView />}
            {currentView === "roadmap" && <RoadmapView />}
            {currentView === "learn" && <LearnView />}
            {currentView === "playground" && <PlaygroundView />}
            {currentView === "daily-challenge" && <DailyChallengeView />}
            {currentView === "skill-tree" && <SkillTreeView />}
            {currentView === "calendar" && <CalendarView />}
            {currentView === "notes" && <NotesView />}
            {currentView === "projects" && <ProjectsView />}
            {currentView === "focus" && <FocusView />}
            {currentView === "analytics" && <AnalyticsView />}
            {currentView === "career" && <CareerView />}
            {currentView === "ai-tutor" && <AITutorView />}
            {currentView === "community" && <CommunityView />}
            {currentView === "account" && <AccountView />}
            {currentView === "settings" && <SettingsView />}
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
