// ============================================================
// constants.ts — Shared constants imported by BOTH client and server.
//
// v6.0: Extracted from magic numbers that were duplicated across store.ts,
// /api/certificates/create/route.ts, LearnView.tsx, and achievements-data.ts.
// Keeping these in one place ensures the client gate and server gate can
// never disagree (the v5.x bug where the UI said "not eligible" while the
// server said "eligible", or vice versa).
// ============================================================

/**
 * Minimum quiz-average percentage (0-100) required to earn a per-language
 * certificate. Applied identically by:
 *   - selectCertificateEligible (client gate — src/lib/store.ts)
 *   - validateProgressProof     (server gate — /api/certificates/create/route.ts)
 */
export const CERTIFICATE_QUIZ_THRESHOLD = 75;

/**
 * Minimum percentage (0-1) of correct answers required to "pass" a single
 * quiz (independent of certificate eligibility). Applied by:
 *   - XP awarding (store.ts: +30 XP for pass, +60 for perfect)
 *   - LearnView pass/fail display
 *   - first-quiz achievement check
 */
export const QUIZ_PASS_MARK = 0.7;

/**
 * Which quiz-average formula the client and server agree on.
 * "best-attempt-per-lesson" — uses the user's best quiz score per lesson,
 * averaged across all lessons in the track. Matches the server's existing
 * avg(quizScores) gate. The UI selectTrackQuizAverage was migrated to this
 * formula in v6.0 to eliminate the client/server disagreement.
 */
export const CERTIFICATE_QUIZ_FORMULA = "best-attempt-per-lesson" as const;
