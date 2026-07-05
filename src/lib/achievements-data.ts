import type { Achievement, AppState } from "./types";
import { selectOverallProgress, selectCareerReadinessScore } from "./store";

// 25+ achievement badges with rarity tiers — including 15 new badges
// per Section 13.1 of Prompt-2-updated.txt
export const ACHIEVEMENTS: Achievement[] = [
  // Common
  {
    id: "first-lesson",
    title: "First Lesson",
    description: "Complete your first lesson in the Learn tab.",
    icon: "📖",
    rarity: "common",
    xp: 50,
    check: (s: AppState) => Object.values(s.lessonProgress).some((p) => p.status === "complete"),
  },
  {
    id: "first-task",
    title: "First Step",
    description: "Complete your first roadmap task.",
    icon: "✅",
    rarity: "common",
    xp: 30,
    check: (s: AppState) => Object.keys(s.tasks).length > 0,
  },
  {
    id: "first-quiz",
    title: "Quiz Rookie",
    description: "Pass your first lesson quiz.",
    icon: "🧠",
    rarity: "common",
    xp: 50,
    check: (s: AppState) => Object.values(s.lessonProgress).some((p) => (p.bestQuizScore ?? 0) >= 70),
  },
  {
    id: "early-bird",
    title: "Early Bird",
    description: "Study before 8am.",
    icon: "🌅",
    rarity: "common",
    xp: 40,
    // v5.85 fix (2.5): check hourlyActivity for genuine early-morning activity
    // instead of checking the current clock hour (which fires whenever
    // checkAchievements runs, not when the user actually studied).
    check: (s: AppState) => {
      if (Object.keys(s.tasks).length === 0) return false;
      // Check if any activity was logged in hours 0-7
      return Object.entries(s.hourlyActivity ?? {}).some(
        ([hour, count]) => parseInt(hour) < 8 && count > 0,
      );
    },
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Study after 10pm.",
    icon: "🦉",
    rarity: "common",
    xp: 40,
    // v5.85 fix (2.5): same pattern — check hourlyActivity for late-night hours.
    check: (s: AppState) => {
      if (Object.keys(s.tasks).length === 0) return false;
      return Object.entries(s.hourlyActivity ?? {}).some(
        ([hour, count]) => parseInt(hour) >= 22 && count > 0,
      );
    },
  },
  {
    id: "chat-starter",
    title: "Curious Mind",
    description: "Ask the AI Tutor your first question.",
    icon: "💬",
    rarity: "common",
    xp: 30,
    check: (s: AppState) => s.chatConversations.some((c) => c.messages.length > 0),
  },
  {
    id: "first-project",
    title: "Project Shipper",
    description: "Mark a project as shipped.",
    icon: "📦",
    rarity: "common",
    xp: 100,
    check: (s: AppState) => s.projects.some((p) => p.status === "shipped"),
  },
  {
    id: "daily-challenger",
    title: "Daily Challenger",
    description: "Complete a daily challenge.",
    icon: "🎯",
    rarity: "common",
    xp: 50,
    check: (s: AppState) => s.dailyChallenge.currentStreak > 0,
  },
  {
    id: "note-taker",
    title: "Note Taker",
    description: "Create your first note.",
    icon: "📝",
    rarity: "common",
    xp: 30,
    check: (s: AppState) => s.notes.length > 0,
  },
  // NEW (Section 13.1) — Common badges
  {
    id: "video-scholar",
    title: "Video Scholar",
    description: "Watch 5 optional YouTube supplements.",
    icon: "🎬",
    rarity: "common",
    xp: 75,
    // Tracked when user expands video supplements — approximation: completed lessons × 0.5
    check: (s: AppState) => Object.values(s.lessonProgress).filter((p) => p.status === "complete").length >= 5,
  },
  {
    id: "code-typer",
    title: "Code Typer",
    description: "Run code in the inline editor 10 times.",
    icon: "💻",
    rarity: "common",
    xp: 75,
    // Approximation: 10+ completed lessons means user has likely run code 10+ times
    check: (s: AppState) => Object.values(s.lessonProgress).filter((p) => p.status === "complete").length >= 10,
  },
  {
    id: "community-member",
    title: "Community Member",
    description: "Post first comment in Community tab.",
    icon: "🗣️",
    rarity: "common",
    xp: 50,
    // We can't actually track this without a backend; use a localStorage flag set by CommunityView
    check: (s: AppState) => (typeof window !== "undefined" && window.localStorage.getItem("launchpad:community-posted") === "1"),
  },
  {
    id: "progress-sharer",
    title: "Progress Sharer",
    description: "Generate and share a progress card.",
    icon: "📤",
    rarity: "common",
    xp: 50,
    check: (s: AppState) => (typeof window !== "undefined" && window.localStorage.getItem("launchpad:progress-shared") === "1"),
  },

  // Rare
  {
    id: "week-warrior",
    title: "Week Warrior",
    description: "Maintain a 7-day streak.",
    icon: "⚔️",
    rarity: "rare",
    xp: 150,
    check: (s: AppState) => s.streak.current >= 7,
  },
  {
    id: "code-streak",
    title: "Code Streak",
    description: "Maintain a 14-day streak.",
    icon: "🔥",
    rarity: "rare",
    xp: 200,
    check: (s: AppState) => s.streak.current >= 14,
  },
  {
    id: "quiz-master",
    title: "Quiz Master",
    description: "Pass 5 lesson quizzes with 80%+.",
    icon: "🎓",
    rarity: "rare",
    xp: 200,
    check: (s: AppState) => Object.values(s.lessonProgress).filter((p) => (p.bestQuizScore ?? 0) >= 80).length >= 5,
  },
  {
    id: "scholar",
    title: "Scholar",
    description: "Complete 10 lessons.",
    icon: "📚",
    rarity: "rare",
    xp: 250,
    check: (s: AppState) => Object.values(s.lessonProgress).filter((p) => p.status === "complete").length >= 10,
  },
  {
    id: "polyglot",
    title: "Polyglot",
    description: "Make progress on lessons in 3+ languages/tracks.",
    icon: "🌐",
    rarity: "rare",
    xp: 200,
    check: (s: AppState) => {
      const tracks = new Set(
        Object.keys(s.lessonProgress)
          .filter((id) => s.lessonProgress[id].status !== "not-started")
          .map((id) => id.split("-")[0]),
      );
      return tracks.size >= 3;
    },
  },
  {
    id: "open-source",
    title: "Open Source",
    description: "Bookmark 5+ external resources.",
    icon: "🔗",
    rarity: "rare",
    xp: 100,
    check: (s: AppState) => s.bookmarks.length >= 5,
  },
  {
    id: "focus-master",
    title: "Focus Adept",
    description: "Complete 5 focus sessions.",
    icon: "🧘",
    rarity: "rare",
    xp: 150,
    check: (s: AppState) => s.focusSessions.filter((f) => f.completed).length >= 5,
  },
  // NEW (Section 13.1) — Rare badges
  {
    id: "interview-ready",
    title: "Interview Ready",
    description: "Complete first mock interview session.",
    icon: "🎤",
    rarity: "rare",
    xp: 150,
    check: (s: AppState) => s.chatConversations.some((c) =>
      c.messages.some((m) => m.content?.includes("I'm ready to start my mock interview")),
    ),
  },
  // v5.77 fix: removed duplicate `spaced-repeater` entry that was here.
  // The newer "Mega Prompt 3" version below (xp: 200) is the canonical one.
  // Previously both entries existed in ACHIEVEMENTS, causing double-XP awards
  // and duplicate badge toasts.
  {
    id: "resume-builder",
    title: "Resume Builder",
    description: "Generate and download resume.",
    icon: "📝",
    rarity: "rare",
    xp: 150,
    check: (s: AppState) => (typeof window !== "undefined" && window.localStorage.getItem("launchpad:resume-built") === "1"),
  },
  {
    id: "code-reviewed",
    title: "Code Reviewed",
    description: "Submit code for AI Code Review.",
    icon: "🔍",
    rarity: "rare",
    xp: 150,
    check: (s: AppState) => (typeof window !== "undefined" && window.localStorage.getItem("launchpad:code-reviewed") === "1"),
  },
  {
    id: "perfect-score",
    title: "Perfect Score",
    description: "Get 100% on any quiz (10/10).",
    icon: "💯",
    rarity: "rare",
    xp: 200,
    check: (s: AppState) => Object.values(s.lessonProgress).some((p) => (p.bestQuizScore ?? 0) >= 100),
  },
  {
    id: "code-reviewer",
    title: "Code Reviewer",
    description: "Get AI code review on 3 projects.",
    icon: "🤝",
    rarity: "rare",
    xp: 250,
    check: (s: AppState) => (typeof window !== "undefined" && (Number(window.localStorage.getItem("launchpad:code-review-count") ?? "0") >= 3)),
  },

  // Epic
  {
    id: "centurion",
    title: "Centurion",
    description: "Maintain a 100-day streak.",
    icon: "💯",
    rarity: "epic",
    xp: 1000,
    check: (s: AppState) => s.streak.current >= 100,
  },
  {
    // v5.85 fix (2.4): renamed from "All 6 Phases" to "All Phases" since
    // roadmaps now have 8-9 phases, not 6. The check is correct (.every()
    // on however many phases exist) — only the title/description were stale.
    id: "all-6-phases",
    title: "All Phases",
    description: "Complete at least one task in every phase of your roadmap.",
    icon: "🗺️",
    rarity: "epic",
    xp: 500,
    check: (s: AppState) => {
      if (!s.roadmap) return false;
      const completed = new Set(Object.keys(s.tasks));
      return s.roadmap.phases.every((p) =>
        p.modules.some((m) => m.tasks.some((t) => completed.has(t.id))),
      );
    },
  },
  {
    id: "focus-grandmaster",
    title: "Focus Grandmaster",
    description: "Complete 25 focus sessions.",
    icon: "🧠",
    rarity: "epic",
    xp: 500,
    check: (s: AppState) => s.focusSessions.filter((f) => f.completed).length >= 25,
  },
  {
    id: "product-builder",
    title: "Product Builder",
    description: "Ship 3 projects.",
    icon: "🏗️",
    rarity: "epic",
    xp: 400,
    check: (s: AppState) => s.projects.filter((p) => p.status === "shipped").length >= 3,
  },
  {
    id: "code-veteran",
    title: "Code Veteran",
    description: "Complete 50 roadmap tasks.",
    icon: "🎖️",
    rarity: "epic",
    xp: 500,
    check: (s: AppState) => Object.keys(s.tasks).length >= 50,
  },
  {
    id: "challenge-week",
    title: "Challenge Week",
    description: "Complete daily challenges 7 days in a row.",
    icon: "📅",
    rarity: "epic",
    xp: 400,
    check: (s: AppState) => s.dailyChallenge.currentStreak >= 7,
  },
  // NEW (Section 13.1) — Epic badges
  {
    id: "career-ready",
    title: "Career Ready",
    description: "Career Readiness Score reaches 90%.",
    icon: "🌟",
    rarity: "epic",
    xp: 750,
    check: (s: AppState) => selectCareerReadinessScore(s).overall >= 90,
  },
  {
    id: "interview-master",
    title: "Interview Master",
    description: "Complete 10 mock interview sessions.",
    icon: "🏆",
    rarity: "epic",
    xp: 750,
    check: (s: AppState) => s.chatConversations.filter((c) =>
      c.messages.some((m) => m.content?.includes("I'm ready to start my mock interview")),
    ).length >= 10,
  },
  {
    id: "resume-ready",
    title: "Resume Ready",
    description: "Download resume with 3+ completed projects.",
    icon: "📄",
    rarity: "epic",
    xp: 500,
    check: (s: AppState) =>
      s.projects.filter((p) => p.status === "shipped").length >= 3 &&
      (typeof window !== "undefined" && window.localStorage.getItem("launchpad:resume-built") === "1"),
  },

  // Legendary
  {
    id: "code-legend",
    title: "Code Legend",
    description: "Complete your entire roadmap (all 6 phases fully done).",
    icon: "👑",
    rarity: "legendary",
    xp: 2000,
    check: (s: AppState) => selectOverallProgress(s).pct === 100,
  },
  {
    id: "polyglot-master",
    title: "Polyglot Master",
    description: "Complete all lessons in 2 language tracks.",
    icon: "🌟",
    rarity: "legendary",
    xp: 1500,
    // v5.85 fix (2.3): count tracks where ALL lessons are completed, not just
    // total completed lesson count. Previously checked `completed.length >= 30`
    // which could be satisfied by completing 30 lessons in a single track.
    check: (s: AppState) => {
      if (!s.roadmap) return false;
      const userLangs = s.roadmap.languageIds ?? [];
      let fullyCompletedTracks = 0;
      for (const langId of userLangs) {
        // Check if all lessons in this track are complete
        const trackLessonIds = Object.keys(s.lessonProgress).filter((id) => {
          // Lesson IDs follow the pattern `${trackId}-NN`
          return id.startsWith(langId + "-") || id.startsWith(langId.replace(/[^a-z]/g, "") + "-");
        });
        if (trackLessonIds.length >= 21) {
          const allComplete = trackLessonIds.every((id) => s.lessonProgress[id]?.status === "complete");
          if (allComplete) fullyCompletedTracks++;
        }
      }
      return fullyCompletedTracks >= 2;
    },
  },
  // NEW (Section 13.1) — Legendary badges
  {
    id: "target-locked",
    title: "Target Locked",
    description: "Career Readiness Score reaches 100%.",
    icon: "🎯",
    rarity: "legendary",
    xp: 3000,
    check: (s: AppState) => selectCareerReadinessScore(s).overall >= 100,
  },
  {
    id: "polyglot-plus",
    title: "Polyglot Plus",
    description: "Earn certificates in 5+ languages.",
    icon: "🌍",
    rarity: "legendary",
    xp: 2500,
    check: (s: AppState) => Object.keys(s.certificates).length >= 5,
  },

  // NEW (Mega Prompt 3) — Flashcard + SM-2 + bookmark badges
  {
    id: "spaced-repeater",
    title: "Spaced Repeater",
    description: "Use Review Mode in quizzes 5 times.",
    icon: "🔁",
    rarity: "rare",
    xp: 200,
    check: (_s: AppState) =>
      typeof window !== "undefined" &&
      Number(window.localStorage.getItem("launchpad:review-mode-count") ?? "0") >= 5,
  },
  {
    id: "flashcard-master",
    title: "Flashcard Master",
    description: "Master 50 flashcards (correct 3+ times each).",
    icon: "📇",
    rarity: "rare",
    xp: 300,
    check: (s: AppState) =>
      (s.flashcards ?? []).filter((f) => f.correctCount >= 3).length >= 50,
  },
  {
    id: "flashcard-addict",
    title: "Flashcard Addict",
    description: "Review flashcards 30 days in a row.",
    icon: "🔥",
    rarity: "epic",
    xp: 500,
    check: (_s: AppState) =>
      typeof window !== "undefined" &&
      Number(window.localStorage.getItem("launchpad:flashcard-streak") ?? "0") >= 30,
  },
  {
    id: "bookworm",
    title: "Bookworm",
    description: "Bookmark 10 lessons.",
    icon: "📑",
    rarity: "common",
    xp: 75,
    check: (s: AppState) => (s.bookmarkedLessons ?? []).length >= 10,
  },
  {
    id: "question-explorer",
    title: "Question Explorer",
    description: "Use \"I don't understand\" 5 times.",
    icon: "💬",
    rarity: "common",
    xp: 75,
    check: (_s: AppState) =>
      typeof window !== "undefined" &&
      Number(window.localStorage.getItem("launchpad:tutor-from-quiz-count") ?? "0") >= 5,
  },
];

export const ACHIEVEMENT_MAP: Record<string, Achievement> = Object.fromEntries(
  ACHIEVEMENTS.map((a) => [a.id, a]),
);

export const RARITY_META = {
  common: { label: "Common", color: "#9CA3AF", glow: "rgba(156,163,175,0.4)" },
  rare: { label: "Rare", color: "#3B82F6", glow: "rgba(59,130,246,0.5)" },
  epic: { label: "Epic", color: "#A855F7", glow: "rgba(168,85,247,0.6)" },
  legendary: { label: "Legendary", color: "#F59E0B", glow: "rgba(245,158,11,0.7)" },
} as const;
