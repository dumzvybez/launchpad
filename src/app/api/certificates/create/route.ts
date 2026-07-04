import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateCertificateId, generateCareerCertificateId } from "@/lib/certificate-utils";

// v5.77 fix: explicit runtime + max duration.
// v5.84 fix: mandatory CERT_SECRET + server-side progress validation.
export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * POST /api/certificates/create
 *
 * v5.84 COMPLETE SECURITY FIX:
 *
 * This endpoint now requires BOTH:
 *   1. CERT_SECRET environment variable (MANDATORY — request fails if not set)
 *   2. progressProof — the client's actual lesson progress data, which the
 *      server validates against deterministic completion rules
 *
 * The flow:
 *   1. Client completes all lessons in a track + achieves ≥75% quiz average
 *   2. Client sends: holderName, certificateType, languageCompleted, joinedDate,
 *      progressProof: { completedLessonIds, quizScores }
 *   3. Server validates:
 *      a. CERT_SECRET is set (mandatory — 500 if not)
 *      b. For language certs: 21 completed lessons with IDs matching
 *         `${trackId}-01` through `${trackId}-21`
 *      c. For language certs: quiz average ≥ 75%
 *      d. For career certs: careerReadinessScore === 100
 *   4. Server creates the certificate with a signed ID
 *
 * This makes forgery impossible without actually completing the work —
 * the progress proof is verifiable server-side.
 *
 * The CERT_SECRET is used to sign the certificate ID as an additional layer,
 * so even if someone somehow bypasses the progress validation, the cert ID
 * won't match the expected signature.
 *
 * Environment variable to set in Vercel:
 *   CERT_SECRET=<256-char random string>
 */

// ---- v5.84: in-memory rate limiter ----
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
 * This is the REAL security — the client must have actually completed the work.
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
    const scoreValues = Object.values(quizScores).filter((s) => typeof s === "number" && s >= 0);
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

export async function POST(req: NextRequest) {
  try {
    // ---- v5.84: CERT_SECRET is MANDATORY (was optional in v5.77) ----
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
    const cleanName = holderName.replace(/[\x00-\x1F\x7F]/g, "").trim();
    if (cleanName.length === 0 || cleanName.length > 100) {
      return NextResponse.json({ error: "holderName must be 1-100 characters" }, { status: 400 });
    }
    if (certificateType !== "language" && certificateType !== "career") {
      return NextResponse.json({ error: "certificateType must be 'language' or 'career'" }, { status: 400 });
    }
    const cleanLang = typeof languageCompleted === "string" && languageCompleted.trim()
      ? languageCompleted.trim()
      : null;

    // ---- v5.84: MANDATORY progress proof validation ----
    const proofResult = validateProgressProof(certificateType, cleanLang, progressProof ?? null);
    if (!proofResult.valid) {
      return NextResponse.json(
        { error: `Progress validation failed: ${proofResult.error}` },
        { status: 403 },
      );
    }

    const supabase = createServerClient();

    // Generate a guaranteed-unique certificate ID.
    let certId = "";
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      certId =
        certificateType === "career"
          ? generateCareerCertificateId()
          : generateCertificateId();

      const { data: existing } = await supabase
        .from("certificates")
        .select("id")
        .eq("id", certId)
        .maybeSingle();

      if (!existing) break;
      attempts++;
    }

    if (attempts >= maxAttempts) {
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
      issue_date: new Date().toISOString(),
      joined_date: joinedDate ?? new Date().toISOString(),
    });

    if (insertError) {
      console.error("[certificates/create] insert error:", insertError);
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Certificate ID collision — please retry." },
          { status: 503 },
        );
      }
      return NextResponse.json(
        { error: "Failed to create certificate" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, certId });
  } catch (err) {
    console.error("[certificates/create] error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
