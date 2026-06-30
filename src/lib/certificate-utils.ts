/**
 * Certificate utilities — deterministic ID generation + verification helpers.
 *
 * Per Section 3.1 of Prompt-2-updated.txt:
 * - ID format: `LP-XXXXXXXX` (8 chars, base36, uppercased)
 * - Deterministic hash of `userId-trackId-completionDate`
 * - Bug fix: original simpleHash could return 1-2 char strings for small
 *   inputs (e.g. `Math.abs(0).toString(36) === "0"`). This version pads
 *   to 8 chars and slices to guarantee the length.
 *
 * Browser-compatible — no Node crypto needed.
 */

export function generateCertificateId(
  userId: string,
  trackId: string,
  completionDate: string,
): string {
  const raw = `${userId}-${trackId}-${completionDate}`;
  const hash = simpleHash(raw);
  // Pad to ensure 8 chars even for short hash outputs
  const padded = hash.padStart(8, "0").slice(0, 8);
  return `LP-${padded.toUpperCase()}`;
}

/**
 * Generate a Career Master certificate ID — `LP-CAREER-XXXXXXXX`.
 * Same hashing rules as `generateCertificateId` (padded to 8 chars).
 */
export function generateCareerCertificateId(
  userId: string,
  careerId: string,
  completionDate: string,
): string {
  const raw = `CAREER-${userId}-${careerId}-${completionDate}`;
  const hash = simpleHash(raw);
  const padded = hash.padStart(8, "0").slice(0, 8);
  return `LP-CAREER-${padded.toUpperCase()}`;
}

/**
 * Browser-compatible simple hash (returns a base36 string).
 * Uses the classic djb2-style hash. Returns variable-length string —
 * callers must pad if they need a fixed width.
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit int
  }
  return Math.abs(hash).toString(36);
}

/**
 * Validate the format of a certificate ID.
 * Accepts: `LP-XXXXXXXX` (8 base36 chars) or `LP-CAREER-XXXXXXXX`.
 */
export function isValidCertificateFormat(id: string): boolean {
  if (!id) return false;
  const upper = id.toUpperCase();
  // Standard format: LP-XXXXXXXX (8 base36 chars)
  if (/^LP-[A-Z0-9]{8}$/.test(upper)) return true;
  // Career Master format: LP-CAREER-XXXXXXXX
  if (/^LP-CAREER-[A-Z0-9]{8,}$/.test(upper)) return true;
  return false;
}

/**
 * Extract the prefix type from a certificate ID.
 */
export function getCertificateType(id: string): "language" | "career" | "invalid" {
  if (!id) return "invalid";
  const upper = id.toUpperCase();
  if (upper.startsWith("LP-CAREER-")) return "career";
  if (upper.startsWith("LP-")) return "language";
  return "invalid";
}
