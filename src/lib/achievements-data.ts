import type { Achievement, AppState } from "./types";
import { selectOverallProgress } from "./store";

// 24+ achievement badges with rarity tiers
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
    check: (s: AppState) => {
      const hour = new Date().getHours();
      return hour < 8 && Object.keys(s.tasks).length > 0;
    },
  },
  {
    id: "night-owl",
    title: "Night Owl",
    description: "Study after 10pm.",
    icon: "🦉",
    rarity: "common",
    xp: 40,
    check: (s: AppState) => {
      const hour = new Date().getHours();
      return hour >= 22 && Object.keys(s.tasks).length > 0;
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
    id: "all-6-phases",
    title: "All 6 Phases",
    description: "Complete at least one task in all 6 phases.",
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
    check: (s: AppState) => {
      // Will be re-checked against actual lesson data; simplified here
      const completed = Object.values(s.lessonProgress).filter((p) => p.status === "complete");
      return completed.length >= 30; // 30 lessons = 2 tracks done
    },
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
