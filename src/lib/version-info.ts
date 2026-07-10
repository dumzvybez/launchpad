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

export const APP_VERSION = "5.925.0";

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

// Newest first. Only the LATEST entry (RELEASES[0]) is shown in the popup,
// but keeping a history lets you add a "previous releases" view later.
export const RELEASES: ReleaseInfo[] = [
  {
    version: "5.925.0",
    date: "2026-07-09",
    title: "Integrity fixes + AI-Verify flow",
    summary:
      "Seven correctness/integrity fixes plus a new shared AI-Verify flow for Projects and Capstones. Quiz scoring is now deterministic, badges require real actions, roadmap sync is scoped correctly, Career Readiness math is fixed, flashcards persist, and Career-tab popups no longer overlap.",
    highlights: [
      {
        type: "fixed",
        text: "Quiz answer-scoring race condition (review mode): the score was computed against a question set that shrank mid-submit (SM-2 promoted answered questions out of the “due” set), so correct answers appeared marked wrong. Now a snapshot of questions + answers is frozen at submit time — scoring is 100% deterministic.",
      },
      {
        type: "fixed",
        text: "Badges no longer fire on page views. “Video Scholar” now requires actually expanding 5 video supplements; “Code Typer” now requires actually clicking Run 10 times (was: fired after 5/10 quiz passes with zero real action).",
      },
      {
        type: "fixed",
        text: "Roadmap auto-completion scope: lesson/quiz completion no longer auto-completes tasks in Foundations, Milestone, AI Bonus, or Capstone phases. Only “Second Language: X” phases (the only true 1:1 language-track mapping) auto-sync. Other phases use manual Mark Complete.",
      },
      {
        type: "new",
        text: "AI-Verify flow (shared): one reusable dialog powers both the Projects tab (“Verify Project”) and capstone lessons (“AI Verify Capstone”). Submit code via paste-text (multi-file with “+” button) or text-file upload; the AI assesses against requirements and returns a parseable VERDICT: PASS/FAIL. Verified projects count toward Career Readiness; verified capstones mark the lesson complete (unblocks certificates).",
      },
      {
        type: "new",
        text: "Multi-file input + text-file upload added to the AI Tutor’s Code Review mode too (same UX, no verdict UI).",
      },
      {
        type: "fixed",
        text: "Career Readiness Score math: the quiz dimension divided by attempted-lesson count (not total lessons), so 20/126 lessons at 95% avg showed 95% instead of ~15%. Now divides by total lessons — score is now consistent with the Analytics tab.",
      },
      {
        type: "fixed",
        text: "Flashcard review position + filter now persist across refresh (was resetting to card 1 / “due” filter every time).",
      },
      {
        type: "fixed",
        text: "Career tab popups (Resume builder + Suggested Next Steps) no longer overlap underlying content — both now portal to document.body, escaping the GlassCard backdrop-filter containing block that trapped them.",
      },
    ],
  },
  {
    version: "5.924.0",
    date: "2026-07-09",
    title: "Certificate Hub + PDF export fixes",
    summary:
      "All your earned certificates are now in one place on the Dashboard, and the recurring PDF 2-page-split bug is fixed across every printable surface — verified with actual generated PDFs.",
    highlights: [
      {
        type: "new",
        text: "Certificate Hub on the Dashboard — every earned certificate (language tracks + Career Master) in one list, each opening a detail popup with the cert ID, completion date, and a download button.",
      },
      {
        type: "new",
        text: "\"Certified\" badge next to completed languages in the Learn tab — click it to open the same certificate detail popup.",
      },
      {
        type: "new",
        text: "Sensible empty state on the hub when you have no certificates yet, with a shortcut to start learning.",
      },
      {
        type: "fixed",
        text: "PDF 2-page-split bug fixed across all 5 printable surfaces (both certificate types, achievement & dashboard share cards, career resume). Root cause: an unconditional @page { margin: 0 } injected by the print wrapper was overriding each surface's own page sizing, plus min-height: 100vh let certificates overflow. Now each surface locks to a fixed paper size + height.",
      },
      {
        type: "fixed",
        text: "Text contrast on share cards — the dark gradient card background was being dropped in print (white text on white). Added print-color-adjust: exact everywhere and bumped low-opacity text.",
      },
      {
        type: "fixed",
        text: "Orientation consistency — certificates and share cards now always render in A4 landscape; the resume always renders in A4 portrait. No more device-dependent orientation flips.",
      },
      {
        type: "improved",
        text: "Certificate PDF generation logic extracted to a shared module (certificate-pdf.ts) so the Learn tab, Career tab, and new Dashboard hub all reuse the exact same code — no duplication.",
      },
    ],
  },
  {
    version: "5.923.0",
    date: "2026-07-09",
    title: "Instant roadmaps — onboarding, simplified",
    summary:
      "Roadmap generation is now always instant and 100% on-device. The optional API-key step and all AI roadmap code have been removed — the built-in deterministic engine is the only generator.",
    highlights: [
      {
        type: "removed",
        text: "The optional API-key onboarding step. Onboarding now flows straight from your time commitment to an instant roadmap — no key prompt, no skip choice, no test-connection button.",
      },
      {
        type: "removed",
        text: "All AI-powered roadmap generation code (Gemini / Groq / OpenRouter / OpenAI / Anthropic) and the Pass 1 / Pass 2 retry logic. The deterministic engine is called directly.",
      },
      {
        type: "removed",
        text: "The “AI services unavailable” fallback choice screen — with a single generation path it’s no longer needed.",
      },
      {
        type: "new",
        text: "Version-update notification (this popup). You’ll see what changed once after every release, and new users see it once after onboarding.",
      },
      {
        type: "improved",
        text: "The onboarding summary page no longer mentions AI for roadmap generation — your plan is always instant and built-in.",
      },
      {
        type: "improved",
        text: "Help Centre, Privacy Policy, and README updated to reflect on-device roadmap generation.",
      },
      {
        type: "fixed",
        text: "Removed a dead import of a non-existent export in the onboarding prerequisites step.",
      },
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
