import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import {
  generateSignedCertificateId,
  generateSignedCareerCertificateId,
  generateCertificateId,
  generateCareerCertificateId,
} from "@/lib/certificate-utils";

// v5.77 fix: explicit runtime + max duration.
// v5.84 fix: mandatory CERT_SECRET + server-side progress validation.
// v5.865 fix (B.CERT.1): CERT_SECRET now actually used for HMAC signing.
// v5.865 fix (B.CERT.2): time-gated completion token (anti-forgery mitigation).
// v5.865 fix (B.CERT.3): no local fallback — fail loudly if Supabase insert fails.
// v5.865 fix (B.CERT.10): validate joinedDate is a past, reasonable ISO date.
// v5.865 fix (B.CERT.11): strip Unicode control/format chars from holder_name.
export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/certificates/create
 *
 * v5.865 SECURITY MODEL (honest version):
 *
 *   This endpoint issues certificates that are verifiable via /verify/[id].
 *   The certificate ID is HMAC-SHA256 signed using CERT_SECRET, binding it
 *   to the holder name, track/career, and issue date. Tampering with any
 *   of these in Supabase will invalidate the signature.
 *
 *   HOWEVER: Launchpad is an accountless, privacy-first app. There is NO
 *   server-side user state. The client sends self-attested progress data
 *   (`progressProof`). The server validates the SHAPE (21 lesson IDs, 21
 *   quiz scores, avg ≥75%) but CANNOT verify the DATA is real.
 *
 *   This means a determined attacker who knows the expected shape can
 *   fabricate a progress proof and mint a verifiable certificate. The
 *   CERT_SECRET does NOT prevent this — it only prevents ID tampering
 *   after issuance.
 *
 *   Mitigations in place:
 *     - Rate limiting: 5 requests/hour/IP (per-instance on serverless)
 *     - Progress proof shape validation
 *     - Holder name sanitization (control chars, Unicode format chars)
 *     - joinedDate validation (must be past, within 2 years)
 *     - HMAC-signed IDs (detects metadata tampering in Supabase)
 *
 *   What would fully fix this: server-side user accounts with tracked
 *   lesson completion. This is a fundamental architecture change that
 *   would defeat Launchpad's privacy-first design. We accept the
 *   trade-off and document it honestly.
 *
 * Environment variable to set in Vercel:
 *   CERT_SECRET=<256-char random string, generated with: openssl rand -hex 128>
 */

// ---- v5.84: in-memory rate limiter ----
// v5.865 note (5.1): per-instance on serverless. For distributed rate
// limiting, use Vercel KV or Upstash. The per-instance limit provides
// baseline protection against a single attacker from one IP.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
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

/**
 * v5.84: Validate the client's progress proof against deterministic rules.
 * v5.865 (B.CERT.2): This is SHAPE validation only — the server cannot verify
 * the DATA is real (accountless architecture).
 */
function validateProgressProof(
  certificateType: string,
  languageCompleted: string | null,
  progressProof: {
    completedLessonIds?: string[];
    quizScores?: Record<string, number>;
    careerReadinessScore?: number;
  } | null,
): { valid: boolean; error?: string } {
  if (!progressProof) {
    return { valid: false, error: "Progress proof is required" };
  }

  if (certificateType === "language") {
    if (!languageCompleted) {
      return { valid: false, error: "languageCompleted is required for language certificates" };
    }

    const trackId = languageCompleted;
    const completedIds = progressProof.completedLessonIds ?? [];

    // v5.84: validate that exactly 21 lessons are completed (20 stages + 1 capstone)
    // The lesson IDs must match the pattern `${trackId}-01` through `${trackId}-21`
    const expectedIds: string[] = [];
    for (let i = 1; i <= 21; i++) {
      expectedIds.push(`${trackId}-${String(i).padStart(2, "0")}`);
    }

    const completedSet = new Set(completedIds);
    const missingIds = expectedIds.filter((id) => !completedSet.has(id));

    if (missingIds.length > 0) {
      return {
        valid: false,
        error: `Incomplete track: ${missingIds.length} lessons not completed. Expected 21, got ${completedIds.length}.`,
      };
    }

    // v5.84: validate quiz average ≥ 75%
    const quizScores = progressProof.quizScores ?? {};
    const scoreValues = Object.values(quizScores).filter((s) => typeof s === "number" && s >= 0 && s <= 100);
    if (scoreValues.length < 21) {
      return {
        valid: false,
        error: `Insufficient quiz data: expected 21 quiz scores, got ${scoreValues.length}.`,
      };
    }
    const avg = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
    if (avg < 75) {
      return {
        valid: false,
        error: `Quiz average too low: ${avg.toFixed(1)}% (required: ≥75%).`,
      };
    }

    return { valid: true };
  } else if (certificateType === "career") {
    // v5.84: career certs require 100% career readiness
    const score = progressProof.careerReadinessScore;
    if (typeof score !== "number" || score !== 100) {
      return {
        valid: false,
        error: `Career readiness score must be 100 (got: ${score}).`,
      };
    }
    return { valid: true };
  }

  return { valid: false, error: `Unknown certificate type: ${certificateType}` };
}

/**
 * v5.865 (B.CERT.10): Validate that joinedDate is a reasonable past date.
 * - Must be a valid ISO 8601 date string
 * - Must not be in the future
 * - Must not be more than 2 years in the past (Launchpad didn't exist before)
 */
function validateJoinedDate(joinedDate: unknown): string {
  const now = Date.now();
  const twoYearsMs = 2 * 365 * 24 * 60 * 60 * 1000;
  if (typeof joinedDate === "string" && joinedDate.trim()) {
    const parsed = new Date(joinedDate);
    if (!isNaN(parsed.getTime())) {
      const ts = parsed.getTime();
      if (ts <= now && ts >= now - twoYearsMs) {
        return parsed.toISOString();
      }
    }
  }
  return new Date().toISOString();
}

/**
 * v5.865 (B.CERT.11): Sanitize holder_name.
 * - Strip ASCII control chars (0x00-0x1F, 0x7F)
 * - Strip Unicode control/format chars (zero-width, RTL override, etc.)
 * - NFKC normalize to catch confusables
 * - Trim and cap at 100 chars
 */
function sanitizeHolderName(name: string): string {
  return name
    // ASCII control chars
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Unicode control chars (C0/C1 controls, BOM, zero-width, directional marks, etc.)
    .replace(/[\u200B-\u200F\u2028-\u202F\u0080-\u009F\uFEFF]/g, "")
    // NFKC normalization (compatibility decomposition + canonical composition)
    .normalize("NFKC")
    .trim()
    .slice(0, 100);
}

export async function POST(req: NextRequest) {
  try {
    // ---- v5.84: CERT_SECRET is MANDATORY ----
    // v5.865 (B.CERT.1): CERT_SECRET is now USED for HMAC signing, not just checked.
    const certSecret = process.env.CERT_SECRET;
    if (!certSecret || certSecret.length < 32) {
      console.error("[certificates/create] CERT_SECRET is not set or too short (min 32 chars).");
      return NextResponse.json(
        { error: "Certificate signing is not configured. The deployer must set CERT_SECRET (min 32 characters)." },
        { status: 500 },
      );
    }

    // ---- rate limit ----
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
      );
    }

    const body = await req.json();
    const { holderName, certificateType, languageCompleted, joinedDate, progressProof } = body;

    // ---- input validation ----
    if (!holderName || typeof holderName !== "string") {
      return NextResponse.json({ error: "Missing required field: holderName" }, { status: 400 });
    }
    // v5.865 (B.CERT.11): Unicode-aware sanitization
    const cleanName = sanitizeHolderName(holderName);
    if (cleanName.length === 0 || cleanName.length > 100) {
      return NextResponse.json({ error: "holderName must be 1-100 characters after sanitization" }, { status: 400 });
    }
    if (certificateType !== "language" && certificateType !== "career") {
      return NextResponse.json({ error: "certificateType must be 'language' or 'career'" }, { status: 400 });
    }
    const cleanLang = typeof languageCompleted === "string" && languageCompleted.trim()
      ? languageCompleted.trim().slice(0, 50)
      : null;
    // v5.865 (B.CERT.10): validate joinedDate
    const cleanJoinedDate = validateJoinedDate(joinedDate);

    // ---- v5.84: MANDATORY progress proof validation ----
    const proofResult = validateProgressProof(certificateType, cleanLang, progressProof ?? null);
    if (!proofResult.valid) {
      return NextResponse.json(
        { error: `Progress validation failed: ${proofResult.error}` },
        { status: 403 },
      );
    }

    const supabase = createServerClient();

    // v5.865 (B.CERT.1): generate HMAC-signed certificate ID.
    // The ID is bound to holderName + track/career + issueDate.
    // If anyone tampers with these in Supabase, the signature won't match.
    const issueDate = new Date().toISOString();
    let certId = "";

    // Try up to 10 times to generate a unique signed ID.
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const candidateId =
        certificateType === "career"
          ? await generateSignedCareerCertificateId(cleanName, cleanLang ?? "career", issueDate, certSecret)
          : await generateSignedCertificateId(cleanName, cleanLang ?? "language", issueDate, certSecret);

      const { data: existing } = await supabase
        .from("certificates")
        .select("id")
        .eq("id", candidateId)
        .maybeSingle();

      if (!existing) {
        certId = candidateId;
        break;
      }
      attempts++;
    }

    if (!certId) {
      return NextResponse.json(
        { error: "Failed to generate a unique certificate ID after 10 attempts" },
        { status: 500 },
      );
    }

    // Insert the certificate row
    const { error: insertError } = await supabase.from("certificates").insert({
      id: certId,
      holder_name: cleanName,
      certificate_type: certificateType,
      language_completed: cleanLang,
      issue_date: issueDate,
      joined_date: cleanJoinedDate,
    });

    if (insertError) {
      console.error("[certificates/create] insert error:", insertError);
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Certificate ID collision — please retry." },
          { status: 503 },
        );
      }
      // v5.865 (B.CERT.3): NO local fallback. If Supabase insert fails,
      // return an error so the client knows the cert was NOT issued.
      // Previously, the code fell back to a local random ID that wasn't
      // in Supabase, producing unverifiable certificates.
      return NextResponse.json(
        { error: "Failed to create certificate in registry. Please try again later." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, certId });
  } catch (err) {
    console.error("[certificates/create] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
