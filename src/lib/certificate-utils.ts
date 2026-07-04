/**
 * Certificate utilities — random ID generation + verification helpers.
 *
 * v5.76: Switched from deterministic hash to crypto.getRandomValues for
 * true randomness. IDs are now 10 chars (base36: A-Z + 0-9), giving
 * 36^10 ≈ 3.6 × 10^15 possible combinations — collision is virtually
 * impossible even without the database uniqueness check.
 *
 * ID format:
 *   Language cert: LP-XXXXXXXXXX (10 random base36 chars)
 *   Career cert:   LP-CAREER-XXXXXXXXXX (10 random base36 chars)
 *
 * Both browser and Node.js compatible (uses Web Crypto API).
 */

/**
 * Generate a random base36 string of the given length using
 * crypto.getRandomValues for cryptographic-quality randomness.
 * v5.77 fix: use Uint32Array instead of Uint8Array to eliminate modulo bias
 * (256 % 36 = 4 with uint8; 2^32 % 36 ≈ 0 with uint32 — negligible bias).
 */
function randomBase36(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const result = new Array<string>(length);
  // v5.77 fix: allocate only `length` uint32s (was `length * 2` uint8s with
  // half the bytes unused).
  const bytes = new Uint32Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for environments without Web Crypto.
    // Note: Math.random is NOT cryptographically secure. In modern browsers
    // and Node 18+ this branch never runs. If it ever does, the IDs are
    // predictable — but certificate IDs don't need to be unguessable in a
    // strong sense (the 36^10 search space is already brute-force-resistant).
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 0x100000000);
    }
  }
  for (let i = 0; i < length; i++) {
    result[i] = chars[bytes[i] % chars.length];
  }
  return result.join("");
}

/**
 * Generate a random Language Track certificate ID: LP-XXXXXXXXXX
 * (10 random base36 characters after the LP- prefix).
 */
export function generateCertificateId(
  _userId?: string,
  _trackId?: string,
  _completionDate?: string,
): string {
  // Parameters are accepted for backward compatibility but ignored —
  // IDs are now fully random, not derived from user/track/date.
  return `LP-${randomBase36(10)}`;
}

/**
 * Generate a random Career Master certificate ID: LP-CAREER-XXXXXXXXXX
 * (10 random base36 characters after the LP-CAREER- prefix).
 */
export function generateCareerCertificateId(
  _userId?: string,
  _careerId?: string,
  _completionDate?: string,
): string {
  return `LP-CAREER-${randomBase36(10)}`;
}

/**
 * Validate the format of a certificate ID.
 * Accepts: `LP-XXXXXXXXXX` (10+ base36 chars) or `LP-CAREER-XXXXXXXXXX`.
 */
export function isValidCertificateFormat(id: string): boolean {
  if (!id) return false;
  const upper = id.toUpperCase();
  // Standard format: LP-XXXXXXXXXX (10+ base36 chars)
  if (/^LP-[A-Z0-9]{10,}$/.test(upper)) return true;
  // Career Master format: LP-CAREER-XXXXXXXXXX
  if (/^LP-CAREER-[A-Z0-9]{10,}$/.test(upper)) return true;
  // Also accept 8-char legacy format (for backwards compat with existing certs)
  if (/^LP-[A-Z0-9]{8}$/.test(upper)) return true;
  if (/^LP-CAREER-[A-Z0-9]{8}$/.test(upper)) return true;
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
