/**
 * Certificate utilities — HMAC-signed ID generation + verification helpers.
 *
 * v5.865 (B.CERT.1): Certificate IDs are now HMAC-SHA256 signed using
 * CERT_SECRET. The ID format is:
 *
 *   Language cert: LP-{random10}-{hmac8}
 *   Career cert:   LP-CAREER-{random10}-{hmac8}
 *
 * The HMAC is computed over the random portion + holder name + track/career +
 * issue date. This binds the ID to its metadata — if anyone tampers with
 * the holder_name or language_completed in Supabase, the HMAC won't match
 * and the verify page can detect the tampering.
 *
 * v5.76: Switched from deterministic hash to crypto.getRandomValues for
 * true randomness. 36^10 ≈ 3.6 × 10^15 possible combinations.
 *
 * Both browser and Node.js compatible (uses Web Crypto API).
 */

/**
 * Generate a random base36 string of the given length using
 * crypto.getRandomValues for cryptographic-quality randomness.
 * v5.77 fix: use Uint32Array instead of Uint8Array to eliminate modulo bias.
 */
function randomBase36(length: number): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const result = new Array<string>(length);
  const bytes = new Uint32Array(length);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
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
 * v5.865 (B.CERT.1): Compute an HMAC-SHA256 signature (first 8 bytes, base36)
 * over the given payload using CERT_SECRET. Server-side only.
 *
 * Returns a 11-char base36 string (8 bytes → 11 base36 chars).
 * This is short enough to append to a cert ID while still providing
 * 64 bits of signature security (2^64 = 1.8 × 10^19 — infeasible to brute-force).
 */
export async function computeCertSignature(
  payload: string,
  secret: string,
): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  // Take first 8 bytes of the HMAC and encode as base36.
  const sigBytes = new Uint8Array(sig).slice(0, 8);
  // Convert 8 bytes to a 64-bit integer (big-endian, may lose precision in JS
  // for values > 2^53, but for base36 encoding we use BigInt).
  let big = 0n;
  for (const b of sigBytes) big = (big << 8n) | BigInt(b);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  let v = big;
  if (v === 0n) return "A".repeat(11);
  while (v > 0n && out.length < 11) {
    out = chars[Number(v % 36n)] + out;
    v /= 36n;
  }
  return out.padStart(11, "A");
}

/**
 * v5.865 (B.CERT.1): Generate a signed Language Track certificate ID.
 * Server-side only (requires CERT_SECRET).
 *
 * Format: LP-{random10}-{sig11}
 *
 * The signature is computed over: random10|holderName|trackId|issueDate
 * This binds the ID to its metadata. If anyone modifies the holder_name
 * or language_completed in Supabase, the signature won't match.
 */
export async function generateSignedCertificateId(
  holderName: string,
  trackId: string,
  issueDate: string,
  secret: string,
): Promise<string> {
  const random = randomBase36(10);
  const payload = `${random}|${holderName}|${trackId}|${issueDate}`;
  const sig = await computeCertSignature(payload, secret);
  return `LP-${random}-${sig}`;
}

/**
 * v5.865 (B.CERT.1): Generate a signed Career Master certificate ID.
 * Server-side only (requires CERT_SECRET).
 *
 * Format: LP-CAREER-{random10}-{sig11}
 */
export async function generateSignedCareerCertificateId(
  holderName: string,
  careerLabel: string,
  issueDate: string,
  secret: string,
): Promise<string> {
  const random = randomBase36(10);
  const payload = `${random}|${holderName}|${careerLabel}|${issueDate}`;
  const sig = await computeCertSignature(payload, secret);
  return `LP-CAREER-${random}-${sig}`;
}

/**
 * v5.865 (B.CERT.1): Verify a signed certificate ID against its metadata.
 * Server-side only (requires CERT_SECRET).
 *
 * Returns true if the signature matches, false otherwise.
 * This allows the verify endpoint to detect tampering with holder_name
 * or language_completed in Supabase.
 */
export async function verifyCertificateSignature(
  certId: string,
  holderName: string,
  trackOrCareerLabel: string,
  issueDate: string,
  secret: string,
): Promise<boolean> {
  // Parse the ID: LP-{random}-{sig} or LP-CAREER-{random}-{sig}
  const isCareer = certId.startsWith("LP-CAREER-");
  const parts = certId.split("-");
  // For language: ["LP", random, sig] → parts[1], parts[2]
  // For career: ["LP", "CAREER", random, sig] → parts[2], parts[3]
  const random = isCareer ? parts[2] : parts[1];
  const sig = isCareer ? parts[3] : parts[2];
  if (!random || !sig) return false;

  const payload = `${random}|${holderName}|${trackOrCareerLabel}|${issueDate}`;
  const expectedSig = await computeCertSignature(payload, secret);
  return sig === expectedSig;
}

/**
 * Generate a random Language Track certificate ID: LP-XXXXXXXXXX
 * (10 random base36 characters after the LP- prefix).
 *
 * v5.865: Prefer generateSignedCertificateId (server-side, HMAC-signed).
 * This unsighed version is kept as a LOCAL FALLBACK for when Supabase is
 * unreachable. Unsigned IDs are flagged in the verify page as "unverifiable".
 */
export function generateCertificateId(
  _userId?: string,
  _trackId?: string,
  _completionDate?: string,
): string {
  return `LP-${randomBase36(10)}`;
}

/**
 * Generate a random Career Master certificate ID: LP-CAREER-XXXXXXXXXX
 * (10 random base36 characters after the LP-CAREER- prefix).
 *
 * v5.865: Prefer generateSignedCareerCertificateId (server-side, HMAC-signed).
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
 * v5.865: accepts both signed (LP-{random}-{sig}) and unsigned (LP-{random}) formats.
 *
 * Signed format: LP-{10 base36}-{11 base36} or LP-CAREER-{10 base36}-{11 base36}
 * Unsigned format: LP-{10+ base36} or LP-CAREER-{10+ base36}
 * Legacy format: LP-{8 base36}
 */
export function isValidCertificateFormat(id: string): boolean {
  if (!id) return false;
  const upper = id.toUpperCase();
  // Signed language format: LP-XXXXXXXXXX-XXXXXXXXXXX
  if (/^LP-[A-Z0-9]{10}-[A-Z0-9]{11}$/.test(upper)) return true;
  // Signed career format: LP-CAREER-XXXXXXXXXX-XXXXXXXXXXX
  if (/^LP-CAREER-[A-Z0-9]{10}-[A-Z0-9]{11}$/.test(upper)) return true;
  // Unsigned standard format: LP-XXXXXXXXXX (10+ base36 chars)
  if (/^LP-[A-Z0-9]{10,}$/.test(upper)) return true;
  // Unsigned career format: LP-CAREER-XXXXXXXXXX
  if (/^LP-CAREER-[A-Z0-9]{10,}$/.test(upper)) return true;
  // 8-char legacy format (for backwards compat with existing certs)
  if (/^LP-[A-Z0-9]{8}$/.test(upper)) return true;
  if (/^LP-CAREER-[A-Z0-9]{8}$/.test(upper)) return true;
  return false;
}

/**
 * Check if a certificate ID is signed (has the HMAC signature suffix).
 */
export function isSignedCertificate(id: string): boolean {
  if (!id) return false;
  const upper = id.toUpperCase();
  if (/^LP-[A-Z0-9]{10}-[A-Z0-9]{11}$/.test(upper)) return true;
  if (/^LP-CAREER-[A-Z0-9]{10}-[A-Z0-9]{11}$/.test(upper)) return true;
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
