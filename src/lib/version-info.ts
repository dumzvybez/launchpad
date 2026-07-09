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

export const APP_VERSION = "5.923.0";

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
