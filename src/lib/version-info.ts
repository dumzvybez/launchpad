// ============================================================
// version-info.ts — Single source of truth for app version + release notes.
//
// HOW TO UPDATE ON A NEW RELEASE (for the developer):
//   1. Bump APP_VERSION below (and in package.json) to the new version.
//   2. Add a NEW ReleaseInfo object to the TOP of the RELEASES array.
//   3. Commit & deploy. Existing users will see the popup once on their next
//      visit; new users will see it once after they finish onboarding.
//
// The popup is shown by VersionUpdateDialog whenever the user's
// `lastSeenReleaseVersion` preference differs from APP_VERSION.
// ============================================================

export const APP_VERSION = "5.928.0";

export type ReleaseHighlightType = "new" | "improved" | "removed" | "fixed";

export type ReleaseHighlight = {
  type: ReleaseHighlightType;
  text: string;
};

export type ReleaseInfo = {
  /** Semantic version, e.g. "5.923.0" — must match APP_VERSION for the latest entry. */
  version: string;
  /** ISO date (YYYY-MM-DD) the release shipped. */
  date: string;
  /** Short headline shown at the top of the popup. */
  title: string;
  /** One or two sentences summarising the release. */
  summary: string;
  /** Bullet-point changes, shown with coloured badges. */
  highlights: ReleaseHighlight[];
};

// Newest first. Only the LATEST entry (RELEASES[0]) is shown in the popup.
//
// v5.926 (D3) DUAL-FORMAT RELEASE NOTES:
//   - This file (version-info.ts) holds the USER-FACING summary shown in the
//     popup. Plain language a non-developer understands — no file names, no
//     internal component/function names, no "root cause" technical detail.
//   - CHANGELOG.md holds the TECHNICAL developer-facing record (unchanged).
//   To ship a new release: bump APP_VERSION, add a ReleaseInfo here (user-
//   facing), AND add a technical entry to CHANGELOG.md. Both are required.
export const RELEASES: ReleaseInfo[] = [
  {
    version: "5.928.0",
    date: "2026-07-10",
    title: "Command Palette fix, version popup polish, deeper roadmap links",
    summary:
      "The Command Palette finally navigates instead of marking tasks complete. The version-update popup lost its duplicate title and auto-scroll bug. Roadmap URLs now go down to the task level. The sidebar fully hides when collapsed. And the Analytics tab no longer counts lessons from languages you don't study.",
    highlights: [
      { type: "fixed", text: "Command Palette: searching for a roadmap task and clicking it now NAVIGATES to that task in the Roadmap view. Previously it was marking the task complete — a bug reported multiple times that's now genuinely fixed (the click handler was wired to toggleTask instead of navigation)." },
      { type: "fixed", text: "Version-update popup: the latest version's title and description no longer appear twice (once as a header, once in the expanded card). Each piece of info now appears exactly once." },
      { type: "fixed", text: "Version-update popup: opens scrolled to the TOP (showing the latest version first), not the bottom. The auto-scroll was caused by autoFocus on the 'Got it' button." },
      { type: "fixed", text: "Version-update popup: the latest version's categories now behave like all others — collapsed by default, expanding on hover (desktop) or tap (mobile), not all shown open simultaneously." },
      { type: "fixed", text: "Analytics tab: the 'Lessons completed' count no longer includes lessons from languages you browsed but aren't in your plan. It now only counts lessons from your assigned roadmap languages." },
      { type: "improved", text: "Roadmap URLs now extend to the module and task level (e.g. /roadmap/phase/3/module/phase-3-m-1/task/phase-3-m-1-t-1). The browser Back button works correctly at each depth — going back from a task returns to the module, then the phase, then the roadmap grid." },
      { type: "improved", text: "Sidebar: collapsing the side panel now fully hides it (was leaving a thin 68px bar with icons). A hamburger icon appears when you hover near the left edge — click it to re-expand." },
      { type: "new", text: "'When you study' feature verified functional — it tracks real task completion timestamps and unlocks after 10 tasks with a time-of-day pattern chart and an Early Bird / Day Sprinter / Evening Coder / Night Owl personality badge." },
    ],
  },
  {
    version: "5.927.0",
    date: "2026-07-10",
    title: "Consistent Career Score, smarter interviews, polished playground",
    summary:
      "Your Career Readiness Score is now identical on the Dashboard and Career tab. Interview scoring requires a meaningful number of questions before it counts. The Playground is cleaner. Flashcards finally stay put when you switch tabs. Plus a redesigned version-update popup with history.",
    highlights: [
      { type: "fixed", text: "Career Readiness Score now shows the exact same values and breakdown on both the Dashboard and the Career tab (was duplicated with stale data on the Dashboard)." },
      { type: "improved", text: "Interview scoring redesigned: you need to answer at least 10 questions per language you're studying before the score 'warms up.' Below that, you'll see transparent progress like '12/40 questions across 2 sessions' instead of a misleading percentage." },
      { type: "improved", text: "Playground redesigned: compact language dropdown (was a wide tab row), example code defaults to collapsed, and the VS Code suggestion moved below the editor so it doesn't push your code down." },
      { type: "fixed", text: "Flashcards now stay on your current card when you switch tabs and come back (was resetting — the third attempt at this fix; the root cause was an index-clamp gap during remount)." },
      { type: "new", text: "Version-update popup redesigned: frosted liquid-glass styling, version history (older versions listed but collapsed — click to expand), and a 'What's New' button in Settings to reopen it anytime." },
      { type: "new", text: "First-visit tips added to every major tab — a brief, auto-dismissing hint the first time you open each one, plus a one-time tip about Ctrl+K (the Command Palette)." },
      { type: "fixed", text: "PWA install bug fixed: the broken screenshot image is gone for real this time (the service worker was serving a stale cached manifest from an old version)." },
      { type: "fixed", text: "Footer cleaned up: removed the personal name/link, centered the remaining items (copyright, privacy, help, GitHub, command-palette hint)." },
      { type: "improved", text: "Onboarding generation stages now advance at a more deliberate, readable pace (was too abrupt). The address bar consistently shows /onboarding throughout the flow." },
      { type: "improved", text: "New liquid-glass visual patterns: sliding segmented toggles, icon-slide buttons, frosted toggle switches, and a three-ring spinner for AI-verify loading — all adapted to the app's dark theme." },
    ],
  },
  {
    version: "5.926.0",
    date: "2026-07-09",
    title: "Faster AI, fairer scoring, cleaner design",
    summary:
      "AI responses now arrive all at once (no more token-by-token waiting). Projects must be AI-verified to count toward your Career Readiness. The Career Readiness Score is simpler and fairer. Plus a cleaner capstone layout, first-visit tips, and smoother animations.",
    highlights: [
      { type: "new", text: "First-visit tips: the first time you open each tab, a brief hint explains what it's for. Plus a one-time tip about Ctrl+K (the Command Palette — jump anywhere fast)." },
      { type: "improved", text: "AI responses are now displayed all at once instead of streaming in word-by-word. This is simpler, faster to read, and works consistently across all AI providers." },
      { type: "improved", text: "Career Readiness Score simplified to 4 dimensions (Roadmap, Knowledge, Projects, Interviews) — the daily-challenges dimension was removed. Your Interview score now shows how many sessions you've completed and how many questions you've answered." },
      { type: "improved", text: "Capstone project lessons (lesson 21 of each language) have a cleaner, better-organized layout with a clear status indicator and AI Verify button." },
      { type: "improved", text: "Version-update popup redesigned: changes are grouped by New / Fixed / Improved / Removed, shown as expandable stacked cards. Hover (desktop) or tap (mobile) to explore each category." },
      { type: "fixed", text: "Flashcard review position now actually survives a page refresh (a previous fix didn't hold — the index was being reset during app startup)." },
      { type: "fixed", text: "AI Code Review and Interview Mode setup screens no longer push the chat input out of view on smaller windows." },
      { type: "fixed", text: "AI-Verify no longer shows 'empty response' when you submit code — the full review now displays correctly." },
      { type: "removed", text: "Self-marking a project as 'Shipped' is gone. The only way a project counts toward your Career Readiness now is passing the AI verification — so your score reflects real, verified work." },
      { type: "removed", text: "Server-side rate limiting on AI chat removed — since you use your own API key, there's no need for a shared limit." },
    ],
  },
  {
    version: "5.925.0",
    date: "2026-07-09",
    title: "Quiz scoring fix + AI-Verify for projects and capstones",
    summary:
      "Quiz answers are now scored deterministically (no more correct answers marked wrong on retry). Badges require real actions. The new AI-Verify flow lets you submit project or capstone code for AI review — verified work counts toward your certificates and Career Readiness.",
    highlights: [
      { type: "fixed", text: "Quiz scoring bug fixed: in review mode, correct answers were sometimes marked wrong due to a timing issue. Now scoring is 100% consistent — the same answer always gets the same result." },
      { type: "fixed", text: "Badges now require real actions: 'Video Scholar' needs you to actually open 5 video supplements; 'Code Typer' needs you to actually run code 10 times (not just complete quizzes)." },
      { type: "fixed", text: "Career Readiness Score was showing ~98% after completing only 1/6 of the curriculum — now it correctly reflects your actual progress." },
      { type: "fixed", text: "Flashcard review position now persists across refresh (was resetting to card 1 every time)." },
      { type: "fixed", text: "Career-tab popups (Resume builder, Suggested Next Steps) no longer overlap underlying content." },
      { type: "new", text: "AI-Verify: submit your project or capstone code for AI review. Verified projects count toward Career Readiness; verified capstones complete the lesson and count toward your certificate." },
      { type: "improved", text: "Roadmap auto-completion no longer over-fires — only 'Second Language' phases auto-complete from lesson progress; other phases use manual Mark Complete." },
    ],
  },
  {
    version: "5.924.0",
    date: "2026-07-09",
    title: "Certificate hub + PDF export fixes",
    summary:
      "All your earned certificates are now in one place on the Dashboard, and the recurring PDF 2-page-split bug is fixed across every printable surface — verified with actual generated PDFs.",
    highlights: [
      { type: "new", text: "Certificate Hub on the Dashboard — every earned certificate (language tracks + Career Master) in one list, each opening a detail popup with the cert ID, completion date, and a download button." },
      { type: "new", text: "'Certified' badge next to completed languages in the Learn tab — click it to view the certificate." },
      { type: "fixed", text: "PDF export no longer splits across 2 pages — fixed for certificates, share cards, and the career resume. Text contrast on share cards is also fixed." },
      { type: "fixed", text: "PDF orientation is now consistent: certificates and share cards always render in landscape; the resume always renders in portrait, regardless of device." },
    ],
  },
];
/** Convenience: the latest release info (shown in the popup). */
export const LATEST_RELEASE: ReleaseInfo = RELEASES[0];

/** Human-readable label for a highlight type, used for the badge + a11y. */
export const HIGHLIGHT_LABELS: Record<ReleaseHighlightType, string> = {
  new: "New",
  improved: "Improved",
  removed: "Removed",
  fixed: "Fixed",
};
