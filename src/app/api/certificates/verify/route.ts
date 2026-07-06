import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/supabase";
import { isValidCertificateFormat, isSignedCertificate, verifyCertificateSignature } from "@/lib/certificate-utils";

// v5.77 fix: explicit runtime + this is a read-only public lookup.
// v5.865 fix (5.6): add rate limiting to prevent certificate ID enumeration.
// v5.865 fix (B.CERT.1): verify HMAC signature if the ID is signed.
export const runtime = "nodejs";

/**
 * GET /api/certificates/verify?id=LP-XXXXXXXX
 *
 * Looks up a certificate by ID using the anon key (public read access via RLS).
 * Returns only public fields — never exposes email, phone, or progress data.
 *
 * v5.865 (B.CERT.1): If the ID is signed (has HMAC suffix), verifies the
 * signature against the stored holder_name + language_completed + issue_date.
 * If the signature doesn't match, returns a "tampered" warning (but still
 * shows the data — the user can decide whether to trust it).
 *
 * Response:
 *   - 200: { valid: true, holderName, certificateType, languageCompleted, issueDate, joinedDate, signed }
 *   - 404: { valid: false, error: "Certificate not found" }
 *   - 400: { error: "Missing certificate ID" }
 *   - 429: { error: "Rate limit exceeded" }
 *   - 503: { error: "Certificate verification is not configured" }
 */

// v5.865 (5.6): in-memory rate limiter — 30 verifications/hour/IP.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 30;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  for (const [key, val] of rateLimitMap) {
    if (now >= val.resetAt) rateLimitMap.delete(key);
  }
  const entry = rateLimitMap.get(ip);
  if (!entry || now >= entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfterSec: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count++;
  return { allowed: true, retryAfterSec: 0 };
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 1];
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing certificate ID" },
      { status: 400 },
    );
  }

  // v5.77 fix: validate ID length to prevent abuse.
  if (id.length > 64) {
    return NextResponse.json(
      { error: "Certificate ID too long" },
      { status: 400 },
    );
  }

  // v5.865 (5.6): rate limit verification requests.
  const ip = getClientIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  const supabase = createBrowserClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Certificate verification is not configured. Please try again later." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("certificates")
    .select("id, holder_name, certificate_type, language_completed, issue_date, joined_date")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[certificates/verify] query error:", error);
    return NextResponse.json(
      { error: "Failed to verify certificate" },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { valid: false, error: "Certificate not found. Please double-check the ID and try again." },
      { status: 404 },
    );
  }

  // v5.865 (B.CERT.1): verify HMAC signature if the ID is signed.
  let signatureValid = false;
  let signed = false;
  if (isSignedCertificate(id)) {
    signed = true;
    const certSecret = process.env.CERT_SECRET;
    if (certSecret && certSecret.length >= 32) {
      const trackOrLabel = data.certificate_type === "career"
        ? "career"
        : (data.language_completed ?? "language");
      try {
        signatureValid = await verifyCertificateSignature(
          id,
          data.holder_name,
          trackOrLabel,
          data.issue_date,
          certSecret,
        );
      } catch (err) {
        console.error("[certificates/verify] signature verification error:", err);
        signatureValid = false;
      }
    }
  }

  return NextResponse.json({
    valid: true,
    holderName: data.holder_name,
    certificateType: data.certificate_type,
    languageCompleted: data.language_completed,
    issueDate: data.issue_date,
    joinedDate: data.joined_date,
    signed,
    signatureValid,
  });
}
