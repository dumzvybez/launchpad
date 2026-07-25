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

export const APP_VERSION = "6.010.0";

export type ReleaseHighlightType = "new" | "improved" | "removed" | "fixed";

export type ReleaseHighlight = {
  type: ReleaseHighlightType;
  text: string;
};

export type ReleaseInfo = {
  /** Version string in the MAJOR.XXX.0 style (e.g. "6.003.0", "5.937.0") — must match APP_VERSION for the latest entry. */
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
    version: "6.010.0",
    date: "2026-07-25",
    title: "SEO, visual audit & UI/UX refinement — reading-first lessons, glass readability, mobile polish",
    summary:
      "A comprehensive refinement pass based on a real visual audit: lesson reading is now the focus with the course outline hidden by default, glass surfaces are near-opaque for readable dropdowns and tooltips, the mobile bottom nav and AI Tutor button are touch-friendly, and social-sharing previews now show the correct image and accurate lesson counts. No lesson content changed.",
    highlights: [
      { type: "improved", text: "Lessons now prioritize reading — the course outline is hidden by default and opens as a smooth slide-in overlay when you need it. The reading column is wider and centered, like Apple or Stripe documentation." },
      { type: "fixed", text: "Glass surfaces are more readable: dropdowns, tooltips, and modals now use near-opaque backgrounds so text always meets WCAG contrast standards — no more background bleeding through." },
      { type: "improved", text: "Mobile bottom navigation is now a clear, high-contrast bar with safe-area support. The AI Tutor button is repositioned so it never overlaps the nav or system gestures. All touch targets are at least 44px." },
      { type: "fixed", text: "Social media previews now show the correct Launchpad image at the right size (1200×630), with accurate lesson counts (797 lessons across 38 languages) in the title and description." },
      { type: "improved", text: "Dashboard hierarchy is cleaner — your name is the clear focal point, the career-readiness empty state uses a calm neutral color instead of alarming pink, and stat cards align consistently." },
      { type: "fixed", text: "Resolved a React warning ('Cannot update a component while rendering') by moving URL synchronization into an effect — the console is now clean." },
    ],
  },
  {
    version: "6.009.0",
    date: "2026-07-24",
    title: "Mobile UX redesign — bottom sheets, course outline drawer, no horizontal overflow",
    summary:
      "A complete mobile-first pass: the notification center is now a bottom sheet, lessons have a mobile course outline drawer, the top bar is decluttered, keyboard hints are hidden on mobile, and all 5 standard phone widths (320–430px) have zero horizontal overflow. No lesson content changed.",
    highlights: [
      { type: "fixed", text: "Notification center now opens as a full-width bottom sheet on mobile (was clipped off-screen). Rendered via portal to escape the sticky header's backdrop-filter containing block." },
      { type: "new", text: "Lessons on mobile now have an 'Outline' button that opens a bottom sheet with the full track lesson list — same info as the desktop sidebar, optimized for touch." },
      { type: "fixed", text: "Zero horizontal overflow at 320px, 375px, 390px, 414px, and 430px — the top bar buttons are decluttered (fullscreen and theme toggles hidden on mobile, accessible via Settings)." },
      { type: "fixed", text: "Keyboard shortcut hints (⌘K, Ctrl+K) are now hidden on mobile — the Command Palette tip only shows on desktop. The search button still opens the palette on mobile." },
      { type: "improved", text: "AI Tutor floating chat is now full-screen on mobile (was a cramped 380px panel). The bubble is smaller (48px) and respects iOS safe-area insets." },
      { type: "improved", text: "Version update toast and achievement badge toasts are now full-width on mobile with smaller icons and padding — readable without blocking the screen." },
    ],
  },
  {
    version: "6.008.0",
    date: "2026-07-23",
    title: "Professional UI redesign — documentation-style lessons, collapsible sidebar, glass fixes",
    summary:
      "A complete UI/UX refinement pass: lessons now read like professional documentation with clean typography instead of box-heavy cards, the course outline sidebar is collapsible with a proper compact rail, glass surfaces are more readable, and the dashboard is tighter so key info fits in the first viewport. No lesson content changed.",
    highlights: [
      { type: "improved", text: "Lessons now use a documentation-style layout — clean section headers, left accent borders for callouts, and comfortable spacing instead of many small glass boxes. It reads like a professional course now." },
      { type: "new", text: "The course outline sidebar is now collapsible — click the collapse button for a compact icon rail with a vertical progress indicator, or expand it for the full lesson list. Your preference is remembered across sessions." },
      { type: "fixed", text: "Glass surfaces are more readable: onboarding dropdowns, notification center, and selection menus now use stronger backgrounds so text is always clear." },
      { type: "improved", text: "The dashboard is tighter — the hero, stats, and continue-learning cards now fit in the first viewport on desktop without scrolling." },
      { type: "fixed", text: "Updated all project links to the new website (launchpadedu.vercel.app) and portfolio (dumindu.vercel.app)." },
    ],
  },
  {
    version: "6.007.0",
    date: "2026-07-23",
    title: "Desktop & tablet UX improvements — lesson sidebar, clearer glass, continue lesson",
    summary:
      "A focused UX pass for desktop and tablet: a new sticky lesson sidebar shows where you are in a track, lesson content now uses a comfortable reading width, glass surfaces are clearer with stronger contrast, and the dashboard has a one-click 'Continue your lesson' card. No lesson content changed.",
    highlights: [
      { type: "new", text: "A sticky lesson sidebar now appears on desktop when reading a lesson — it shows every lesson in the track with completion checkmarks, your current position, difficulty, estimated time, and quiz scores, so you always know where you are and what's next." },
      { type: "improved", text: "Lesson content now uses a comfortable reading width instead of stretching across the full page — easier on the eyes for long lessons." },
      { type: "improved", text: "Glass surfaces are clearer: stronger tint and borders in both light and dark themes mean text reads cleanly without the aurora background bleeding through." },
      { type: "new", text: "The dashboard now shows a 'Continue your lesson' card with a one-click Resume button — no more hunting for your place after a break." },
      { type: "improved", text: "The main content area is wider on large desktop screens (1440px+), so dashboards and grids use the space better." },
    ],
  },
  {
    version: "6.006.0",
    date: "2026-07-23",
    title: "Stabilization — dead code removed, types hardened, tests added",
    summary:
      "A maintenance release focused on codebase health: removed 11 MB of dead content bundles, removed the unused Prisma setup, fixed stale documentation, hardened TypeScript, and added a test suite. No lesson content changed.",
    highlights: [
      { type: "removed", text: "Deleted the 10.6 MB legacy content bundle and 445 KB extended bundle that were no longer used — the app now loads exclusively from per-track Markdown files." },
      { type: "removed", text: "Removed the unused Prisma database setup (dependencies, scripts, and dead client file). Certificate storage via Supabase is unaffected." },
      { type: "fixed", text: "TypeScript build errors are no longer silently ignored — real type errors are now caught and fixed at build time." },
      { type: "new", text: "Added a test suite covering lesson content validation, quiz coverage, curriculum module structure, and certificate logic." },
      { type: "fixed", text: "Fixed stale documentation: the content README, daily challenge counts, API health version, and Career Readiness Score formula now match the actual code." },
    ],
  },
  {
    version: "6.005.0",
    date: "2026-07-23",
    title: "Guided lesson experience — course sidebar, sectioned flow, skill badges",
    summary:
      "Lessons now feel like a guided journey, not a long article. A new course sidebar shows where you are in the track, lessons are organized into clear sections, and you always know what skill you're gaining and what to do next. No lesson content changed — this is the experience layer.",
    highlights: [
      { type: "new", text: "A course sidebar shows your track's modules and lessons with completion checkmarks and a 'you are here' highlight — so you always know where you are and what's next." },
      { type: "new", text: "Lessons now have a richer header: track → module → lesson context, difficulty, time, XP, skills gained, and completion status — all at a glance." },
      { type: "new", text: "A 'next lesson' card recommends what to study next, with module-complete celebrations when you finish a whole module." },
      { type: "new", text: "An AI Tutor panel surfaces lesson-aware hints, key takeaways, and common misconceptions right inside the lesson." },
      { type: "improved", text: "The lesson schema gained optional fields for practice challenges, interactive code examples, and next-lesson recommendations — ready for richer content without breaking existing lessons." },
    ],
  },
  {
    version: "6.004.0",
    date: "2026-07-23",
    title: "Scalable curriculum architecture — modules, capstones, assessments",
    summary:
      "The curriculum is now structured around reusable modules, a graduated capstone ladder, and a tiered assessment system — ready to scale from ~21 lessons per track to 100-150+. No lesson content changed; this is architecture only.",
    highlights: [
      { type: "new", text: "Lessons are now organized into reusable modules (Getting Started, Syntax, Functions, OOP, Testing, etc.) shared across all 38 language tracks — the foundation for growing each track to 100-150+ lessons." },
      { type: "new", text: "A graduated capstone ladder: beginner, intermediate, advanced, portfolio, career, and certification capstones. A track can offer multiple capstones so you can demonstrate mastery at each level." },
      { type: "new", text: "A tiered assessment system: lesson quizzes, module quizzes, checkpoint exams, practice exams, capstone evaluations, and a final certificate exam — low-stakes early, high-stakes for the certificate." },
      { type: "improved", text: "Each language track now declares which modules apply and which are optional — SQL skips OOP, HTML skips concurrency, etc. The architecture flexes to fit every language." },
      { type: "improved", text: "Lessons gained optional metadata fields (module, capstone tier, assessment level, search keywords, project tags, career tags) — ready for richer search, AI tutoring, and skill progression without breaking existing content." },
    ],
  },
  {
    version: "6.003.0",
    date: "2026-07-23",
    title: "Faster lesson loading + dark-theme fix + dependency cleanup",
    summary:
      "A verification pass over the per-track content pipeline caught and fixed a blank-screen bug when opening a not-yet-loaded track, plus a handful of missing dependencies that were crashing the app. The theme now follows your system setting by default.",
    highlights: [
      { type: "fixed", text: "Opening a language track you haven't loaded yet now shows its lessons correctly instead of a blank screen — the first lesson auto-loads once the track's content arrives." },
      { type: "fixed", text: "Several required libraries (the Markdown renderer, the certificate image export, and the Supabase client) were listed in the project manifest but never actually installed, causing the app to crash on load. They are now installed." },
      { type: "fixed", text: "Background preloading no longer tries to fetch content for non-lesson tools (like Git), which were producing silent 404 errors in the console." },
      { type: "improved", text: "The app now follows your system's light/dark setting by default instead of always starting in light mode." },
      { type: "improved", text: "Updated the underlying web framework to the latest patch release, which includes security fixes and Turbopack improvements." },
    ],
  },
  {
    version: "6.002.0",
    date: "2026-07-22",
    title: "Scalable content pipeline — lessons now load per-track",
    summary:
      "The entire lesson library has been migrated from a single 11 MB TypeScript bundle to per-track JSON files that load on demand. Opening Python now downloads only Python's content (~200-470 KB), not the entire curriculum.",
    highlights: [
      { type: "improved", text: "Lessons now load per-track instead of one massive bundle — opening Python downloads only Python's content, not all 38 tracks." },
      { type: "new", text: "All 797 lessons migrated to Markdown source files with a build-time compiler that produces per-track JSON." },
      { type: "improved", text: "The track list view now loads instantly from generated metadata — no content fetch needed until you open a specific track." },
      { type: "improved", text: "Your roadmap languages are preloaded in the background for convenience, but other tracks load only when you open them." },
    ],
  },
  {
    version: "6.001.0",
    date: "2026-07-22",
    title: "Identity system finalized — ready for thousands of lessons",
    summary:
      "The stable lesson identity system introduced previously is now finalized with spec-aligned API names and cross-version compatibility. No user-facing behavior changes.",
    highlights: [
      { type: "improved", text: "The identity helper API is now finalized with explicit names, making the stable-identity system clearer to work with for future development." },
      { type: "fixed", text: "Cross-version compatibility: if you upgraded through the previous release, your already-migrated progress is recognized automatically — no re-migration or duplicate backup." },
    ],
  },
  {
    version: "6.000.0",
    date: "2026-07-22",
    title: "Stable lesson identity — the foundation for scaling",
    summary:
      "Every lesson now has a permanent, stable identity (a 'slug') that survives reordering. Your progress, bookmarks, flashcards, and spaced-repetition history will never be lost when lessons are reorganized, expanded, or renumbered.",
    highlights: [
      { type: "new", text: "Every lesson now has a permanent stable identity (a 'slug') separate from its display order. Reordering, inserting, or expanding lessons will never break your progress, bookmarks, flashcards, or study history again." },
      { type: "new", text: "Quiz questions now have globally-unique identities, so spaced-repetition review state stays correctly attached to each question even if quizzes are reordered." },
      { type: "improved", text: "Certificate validation is now powered by auto-generated lesson metadata, eliminating the risk of the server expecting the wrong lesson count." },
      { type: "fixed", text: "Your progress data is automatically migrated to the new stable-identity system on your next visit — a one-time, safe upgrade with a full backup saved first." },
      { type: "improved", text: "Lesson and track counts are now derived from real content at build time instead of being hand-maintained, so they can never go stale as the curriculum grows." },
    ],
  },
  {
    version: "5.937.0",
    date: "2026-07-19",
    title: "Structural prep for variable-length lesson tracks",
    summary:
      "Foundational engineering work to prepare the app for 100-150+ granular topic-based lessons per language. Capstone removed from Learn tab (project verification now lives exclusively in Projects tab). Server-side certificate validation rewritten for variable counts. Data-driven lesson grouping. XP rebalanced. All hardcoded '21 lessons' references updated.",
    highlights: [
      { type: "removed", text: "Capstone-in-Learn-tab fully removed: isCapstone field, AI-Verify-in-lesson UI, /learn/track/capstone URL convention, capstone module in buildLessonGroups, CapstoneLayout component. Project verification now lives exclusively in the Projects tab." },
      { type: "fixed", text: "Server-side certificate validation rewritten: no longer hardcodes 'exactly 21 lesson IDs' — uses server-side TRACK_LESSON_COUNTS metadata to look up the real expected count. Supports variable track lengths and both 2-digit/3-digit lesson ID formats." },
      { type: "new", text: "Data-driven lesson grouping: buildLessonGroups now reads the `group` field from each lesson and produces however many topic-based groups the track defines (W3Schools-style), instead of a hardcoded 4-module split." },
      { type: "fixed", text: "polyglot-master achievement: hardcoded '>= 21 lessons' check replaced with real per-track lesson count (getTrackLessons). Works with variable-length tracks." },
      { type: "improved", text: "XP per lesson reduced from +50 to +10 so 150-lesson tracks don't trivialize the leveling curve. A 150-lesson track now awards ~1,500 XP (similar to the old 21-lesson track's 1,050 XP)." },
      { type: "fixed", text: "localStorage quota: questionRecords (SM-2 spaced-repetition state) added to the quota-overflow pruning — keeps only records for the user's current roadmap languages." },
      { type: "improved", text: "Help Centre and Onboarding text updated: removed hardcoded '21 lessons' / '630 lessons' / '6,000 quiz questions' references." },
    ],
  },
  {
    version: "5.936.0",
    date: "2026-07-18",
    title: "Cleaner minimal background + sidebar centering + AI bubble fix + UI polish",
    summary:
      "Background further reduced to a subtle hint of color (closer to v5.933's clean look). Collapsed sidebar now properly centers the logo, icons, and footer. AI floating bubble repositioned closer to the bottom nav. Overall UI polished: lighter glass shadows, cleaner typography hierarchy, more minimal feel across the app.",
    highlights: [
      { type: "improved", text: "Background further reduced — chroma ~0.06, alpha ~0.15. Closer to v5.933's clean plain look while keeping a subtle hint of color for glass refraction." },
      { type: "fixed", text: "Collapsed sidebar: logo, nav icons, and footer (level ring + Cmd+K) now properly centered." },
      { type: "fixed", text: "AI floating bubble moved from bottom-24 to bottom-20 — just above the bottom nav, not too high." },
      { type: "improved", text: "Glass shadows lightened, blur slightly reduced (24px→20px), card radius refined (1.75rem→1.5rem) for a cleaner, more minimal look." },
      { type: "improved", text: "Typography hierarchy refined — h1 tighter/bolder, h2 medium weight, consistent letter-spacing." },
    ],
  },
  {
    version: "5.935.0",
    date: "2026-07-17",
    title: "Visual comfort + sidebar attach + mobile nav redesign",
    summary:
      "Softened the vivid background colors for eye comfort. Sidebar is now attached to the left edge (not floating) and shows mini group icons when collapsed (restoring the hover-flyout behavior). Badge notifications repositioned below the top bar. Mobile bottom nav redesigned: removed the More button and the green AI pill, all items use transparent liquid glass, AI bubble moved up to clear the nav, footer no longer blocked.",
    highlights: [
      { type: "improved", text: "Background colors softened — reduced chroma and alpha so the vivid gradient is easier on the eyes while still showing glass refraction." },
      { type: "improved", text: "Sidebar attached to the left edge (was floating). Collapse animates right-to-left, expand left-to-right. Collapsed state shows mini group icons with hover flyouts (restored from v5.928)." },
      { type: "fixed", text: "Badge-earned notifications repositioned below the floating top bar (were overlapping it)." },
      { type: "improved", text: "Mobile bottom nav: removed More button (5 items only), removed green AI pill, all items use transparent liquid glass, active item gets pill-shaped highlight." },
      { type: "fixed", text: "AI floating bubble moved up on mobile to clear the bottom nav bar. Removed the green notification dot." },
      { type: "fixed", text: "Footer no longer blocked by the mobile bottom nav bar (added bottom padding on mobile)." },
    ],
  },
  {
    version: "5.934.0",
    date: "2026-07-16",
    title: "Complete Liquid Glass visual overhaul",
    summary:
      "The entire app now uses a true Apple-style Liquid Glass design system — vivid multi-color gradient backgrounds, genuine glass refraction (blur + saturation + specular highlights), pill-shaped buttons and controls, and consistent motion. Every view, dialog, and page updated, including the certificate verification page and Learn tab's lesson content.",
    highlights: [
      { type: "new", text: "True Liquid Glass design system: vivid gradient-mesh background (teal/magenta/amber/violet), glass with backdrop-blur + saturation + edge specular highlights + soft separating shadows." },
      { type: "new", text: "Pill-shaped buttons, nav, and controls — matching Apple's iOS 26 / visionOS design language. Cards use generously-rounded rectangles." },
      { type: "improved", text: "Default theme is now light (vivid background) so the glass refraction effect reads correctly. Dark mode also gets a richer chromatic background." },
      { type: "fixed", text: "Learn tab: 'messy colorful boxes' replaced with unified glass panels. Accent colors now appear only on icons/labels, not full-box backgrounds." },
      { type: "improved", text: "Certificate verification page (/verify/[id]) now uses the same glass background + card treatment as the rest of the app." },
      { type: "improved", text: "Consistent motion tokens (0.4s cubic-bezier easing) across all glass elements — hover, selection, transitions." },
    ],
  },
  {
    version: "5.933.0",
    date: "2026-07-15",
    title: "Version popup header restored, sidebar edge fixed, native dialogs replaced, readability improved",
    summary:
      "Four fixes: the 'What's New' heading and version number that vanished from the version popup are back (without reintroducing horizontal scroll). The sidebar's hard rectangular right edge is now a soft rounded glass boundary. All native browser confirm()/alert() dialogs replaced with themed app modals. AI Bonus Track and Learn tab content reformatted for scannability.",
    highlights: [
      { type: "fixed", text: "Version popup: 'What's New' heading and version badge were invisible (DialogHeader collapsed to 1px by overflow-hidden + flex interaction). Restored with shrink-0; horizontal scroll still eliminated." },
      { type: "improved", text: "Version popup: point descriptions shortened to scannable 1-2 sentences across latest and historical versions." },
      { type: "fixed", text: "Sidebar right-edge: hard rectangular cutoff replaced with proper rounded glass boundary (removed overflow-hidden from wrapper, added visible border)." },
      { type: "fixed", text: "All native browser confirm()/alert() dialogs replaced with themed app modals (Clear All, Reset progress, certificate errors, locked phases, onboarding prompt)." },
      { type: "improved", text: "AI Bonus Track tasks: 'Try this:' action steps now render as highlighted callout boxes instead of being buried in dense paragraphs." },
      { type: "improved", text: "Learn tab lessons: larger text (15px), more line spacing (leading-7), paragraph splitting on double-newlines, more spacing between blocks." },
    ],
  },
  {
    version: "5.932.0",
    date: "2026-07-14",
    title: "Research-backed AI Bonus Track + sidebar timing + version popup scroll + new-user pacing",
    summary:
      "The AI Bonus Track phase for every career is now built from a real consolidated research report (merged from ChatGPT, Gemini, Mistral) — each tool gets a guided what/why/try-this lesson, not a flat checklist. Plus four polish fixes: smoother sidebar collapse, no horizontal scroll in the version popup, staggered first-time-user notifications, and a re-confirmed Community tab fix.",
    highlights: [
      { type: "new", text: "AI Bonus Track rebuilt from a real 2026 research report. Every career gets guided lessons: what each AI tool is, why it matters, and a concrete 'try this' step." },
      { type: "improved", text: "Sidebar collapse is smoother (500ms); page content adjusts faster (200ms) so there's no overlap during expand." },
      { type: "fixed", text: "Version popup: 'What's New' heading restored (was invisible), horizontal scroll eliminated, point descriptions shortened for quick scanning." },
      { type: "improved", text: "First-time users get staggered notifications: view hints immediately, Command Palette tip at 30s, version update at 2min — no more notification stack." },
      { type: "fixed", text: "Sidebar right-edge visual glitch fixed (hard rectangular cutoff replaced with proper rounded glass boundary)." },
      { type: "fixed", text: "Native browser confirm/alert dialogs replaced with themed app modals throughout." },
      { type: "improved", text: "AI Bonus Track and Learn tab content reformatted for readability: shorter paragraphs, bold key terms, better visual hierarchy." },
    ],
  },
  {
    version: "5.931.0",
    date: "2026-07-13",
    title: "Duplicate modules fixed (Skill Tree), Notification Centre, deeper search, certificate security",
    summary:
      "The roadmap duplicate-modules bug is genuinely fixed — the remaining duplicate was in the Skill Tree view (the Roadmap view was fixed in v5.930 but Skill Tree was missed). A full Notification Centre with snooze, persistent history, and iOS 26-inspired card stacking. Command Palette now searches all 630 lessons, 207 projects, your notes, and help topics. Community tab loads reliably. Certificate signature verification hardened.",
    highlights: [
      { type: "fixed", text: "Skill Tree duplicate modules: was rendering both lesson groups and generic engine modules. Now shows only real lesson content." },
      { type: "new", text: "Notification Centre: bell icon with grouped categories, snooze mode, Clear All, and iOS 26-inspired card stacking." },
      { type: "improved", text: "Command Palette searches all 630 lessons, 207 projects, notes, and help topics — ranked by relevance." },
      { type: "fixed", text: "Community tab: Giscus loads at full width (was scrunched to 300px by a CSP block). No more flash on refresh." },
      { type: "fixed", text: "Certificate verification page now actually checks the HMAC signature (was only checking ID format). Fixed a date-format mismatch that would have failed every signed cert." },
      { type: "improved", text: "Version popup: 'What's New' heading, categorized points, toast auto-dismiss after 8s." },
      { type: "improved", text: "Sidebar: reverted an unrequested speed change, kept the timing-sequence overlap fix." },
    ],
  },
  {
    version: "5.930.0",
    date: "2026-07-12",
    title: "Duplicate modules fixed (for real), Career Score Interview fix, Community tab polish",
    summary:
      "The roadmap duplicate-modules bug is genuinely fixed — language phases now show ONLY real lesson content, not both lesson content and generic engine modules. Every language has a unique phase title. The Community tab no longer flashes on refresh. Career Readiness always counts Interview as a required 4th component. Plus a toast-first version popup, sidebar animation fixes, and a redesigned mobile bottom nav.",
    highlights: [
      { type: "fixed", text: "Roadmap duplicate modules: language phases no longer show both 'X fundamentals' / 'Build with X' generic modules AND real lesson groups. Now only real lesson content is shown — the generic engine modules are hidden when lesson groups exist. (Root cause: RoadmapView rendered both phase.modules AND phase.lessonGroups for the same phase — confirmed by tracing the exact code path.)" },
      { type: "fixed", text: "Career Readiness Score: Interview is now ALWAYS counted as a required 4th component (30/30/20/20 weighting) — previously it was excluded when no sessions existed, silently redistributing to 40/40/20." },
      { type: "improved", text: "Every language in the catalog (38+) now has a unique, descriptive phase title — no more generic '{Name} Essentials' fallback. Examples: 'Python Programming', 'HTML & Semantic Markup', 'PostgreSQL & Relational Databases', 'GLSL & Shader Programming'." },
      { type: "improved", text: "Community tab: no more flash when auto-refreshing (fade-out → inject → fade-in transition). Comments now scroll within a fixed-height area instead of growing unboundedly." },
      { type: "new", text: "Version Update popup: now shows a small toast banner first ('Updated to v5.930') with a 'More details' link. The full popup only opens if you click. No more title/description duplication." },
      { type: "improved", text: "Version popup categories are now always visible (collapsible sections with icon labels) — no more hover-to-reveal. Historical versions shown in minimal compact form." },
      { type: "improved", text: "Sidebar: collapse/expand animation timing fixed (no more visual overlap). Nav icons now have subtle hover micro-animations (gear rotates, AI pulses, roadmap bounces, learn tilts)." },
      { type: "improved", text: "Mobile bottom nav redesigned: Home, Roadmap, Learn, AI, Skills, More. AI button is proportionate and styled with liquid-glass." },
      { type: "improved", text: "Navbar restructured into 2 grouped sections: utility toggles (fullscreen + theme) and profile/account." },
    ],
  },
  {
    version: "5.929.0",
    date: "2026-07-11",
    title: "Roadmap engine overhaul + Skill Tree redesign",
    summary:
      "Your primary language now gets the same real-lesson-content treatment as secondary languages — with 'Go to Lesson' links and auto-completion tied to quiz progress. Every language phase has a unique title. The Foundation phase now includes Git/GitHub and terminal basics. The AI Bonus Track and Capstone phases have genuine research-backed depth. And the Skill Tree has been completely redesigned.",
    highlights: [
      { type: "improved", text: "Roadmap overhaul: your primary language now uses real Learn-tab lesson content (the same modules, 'Go to Lesson' links, and auto-completion as secondary languages) instead of generic non-lesson phases. Every language phase — primary and secondary — now has the same high-quality content sourcing." },
      { type: "fixed", text: "Duplicate-modules bug eliminated: old generic 2-module engine content that was appearing alongside real lesson-group content has been fully removed across ALL language phases, not just patched for one case." },
      { type: "improved", text: "Each language phase now has a unique, descriptive title (e.g., 'Python Mastery', 'React Development', 'PostgreSQL & Databases') instead of the generic 'Second Language: X' pattern." },
      { type: "new", text: "Foundation phase redesigned: VS Code setup, Git/GitHub basics, terminal essentials, and your first program — all in one phase with genuine explanatory content (what each tool is, why it matters, how to use it)." },
      { type: "improved", text: "AI Bonus Track content researched via web search and updated with real 2025 industry practices per career (e.g., Copilot/Cursor for SE, MLOps/MLflow for DevOps, Core ML/ML Kit for Mobile, TinyML for Embedded)." },
      { type: "improved", text: "Capstone & Career phase deepened with research-backed content: portfolio best practices, ATS-optimized resume guidance, LeetCode pattern strategy, and mock interview prep with real platform recommendations." },
      { type: "new", text: "Skill Tree completely redesigned: horizontal progress rail instead of vertical zigzag, collapsible phase cards (one level of detail at a time per UX research), lesson-group integration, and no zoom controls needed." },
      { type: "fixed", text: "Sidebar collapse: smooth animation added (was instant), and the expand button is now vertically centered to match the TopBar position." },
    ],
  },
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
