import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import {
  generateSignedCertificateId,
  generateSignedCareerCertificateId,
} from "@/lib/certificate-utils";
import { getExpectedLessonCount, TRACK_LESSON_SLUGS } from "@/lib/lessons-meta";
import { CERTIFICATE_QUIZ_THRESHOLD } from "@/lib/constants";
import {
  LESSON_SLUGS,
  SLUG_TO_ID,
} from "@/lib/lessons-meta-generated";

export const runtime = "nodejs";
export const maxDuration = 30;

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
 * v5.866: Validate the client's progress proof.
 * Returns { valid: boolean, error?: string }.
 * On failure, the error message is logged server-side with full detail
 * so future 403s are diagnosable from Vercel logs.
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
    console.error("[certificates/create] 403 REASON: progressProof is null/undefined");
    return { valid: false, error: "Progress proof is required" };
  }

  if (certificateType === "language") {
    if (!languageCompleted) {
      console.error("[certificates/create] 403 REASON: languageCompleted is null for a language cert");
      return { valid: false, error: "languageCompleted is required for language certificates" };
    }

    const trackId = languageCompleted;
    const completedIds = progressProof.completedLessonIds ?? [];
    const quizScores = progressProof.quizScores ?? {};

    // v5.866: log what we received for debugging
    console.log("[certificates/create] language cert validation:", {
      trackId,
      completedIdsCount: completedIds.length,
      quizScoresCount: Object.keys(quizScores).length,
      completedIdsPreview: completedIds.slice(0, 3),
    });

    // v6.0: The server now validates against the REAL lesson set using stable
    // slugs (from TRACK_LESSON_SLUGS, build-generated). This replaces the v5.x
    // approach of reconstructing expected positional IDs from a count.
    //
    // Backward compatibility: the client may submit EITHER:
    //   - stable slugs (v6.0+ clients): "python-variables-and-data-types", etc.
    //   - legacy positional ids (v5.x clients): "python-01", ..., "python-21"
    //   - legacy capstone ids: "python-capstone"
    //
    // We normalize each submitted id to its slug via LESSON_SLUGS, then check
    // the slug set covers the full expected slug set from TRACK_LESSON_SLUGS.
    const expectedSlugs = TRACK_LESSON_SLUGS[trackId];
    const expectedCount = getExpectedLessonCount(trackId);

    // v6.0: Loud failure for unknown tracks (getExpectedLessonCount now returns
    // 0 instead of the legacy 21 fallback). This prevents the v5.x bug where
    // a track not in the generated map would silently expect 21 lessons.
    if (expectedCount === 0 || !expectedSlugs || expectedSlugs.length === 0) {
      console.error("[certificates/create] 403 REASON: unknown track", { trackId });
      return {
        valid: false,
        error: `Unknown track: "${trackId}" has no generated lesson metadata. Run \`bun run gen:meta\` to regenerate.`,
      };
    }

    // Normalize each submitted completed id to its canonical slug.
    // - If it's already a slug (in SLUG_TO_ID), keep it.
    // - If it's a positional id (in LESSON_SLUGS), map to slug.
    // - If it's a capstone id ("track-capstone"), map via LESSON_SLUGS.
    // - Otherwise (unknown), pass through (will fail the expected-set check).
    const normalizeToSlug = (id: string): string => {
      if (SLUG_TO_ID[id]) return id;        // already a slug
      const slug = LESSON_SLUGS[id];        // positional or capstone id → slug
      return slug ?? id;                     // unknown — passthrough (will be rejected)
    };

    const completedSlugs = new Set(completedIds.map(normalizeToSlug));
    // Only count slugs that actually belong to this track (defensive: a
    // malicious client submitting other tracks' slugs shouldn't count).
    const expectedSlugSet = new Set(expectedSlugs);
    const trackCompletedSlugs = [...completedSlugs].filter((s) => expectedSlugSet.has(s));

    const missingSlugs = expectedSlugs.filter((s) => !completedSlugs.has(s));

    if (missingSlugs.length > 0) {
      console.error("[certificates/create] 403 REASON: incomplete track", {
        trackId,
        expectedCount,
        missingCount: missingSlugs.length,
        missingPreview: missingSlugs.slice(0, 5),
        receivedCount: trackCompletedSlugs.length,
        receivedPreview: trackCompletedSlugs.slice(0, 5),
      });
      return {
        valid: false,
        error: `Incomplete track: ${missingSlugs.length} of ${expectedCount} lessons not completed. Expected ${expectedCount}, got ${trackCompletedSlugs.length}.`,
      };
    }

    // Check 2: at least expectedCount quiz scores with valid values.
    // v6.0: quizScores keys may be slugs OR positional ids (backward compat);
    // we count valid numeric scores regardless of key form.
    const scoreValues = Object.values(quizScores).filter((s) => typeof s === "number" && s >= 0 && s <= 100);
    if (scoreValues.length < expectedCount) {
      console.error("[certificates/create] 403 REASON: insufficient quiz scores", {
        trackId,
        receivedScores: scoreValues.length,
        expectedScores: expectedCount,
        allKeys: Object.keys(quizScores).slice(0, 5),
      });
      return {
        valid: false,
        error: `Insufficient quiz data: expected ${expectedCount} quiz scores, got ${scoreValues.length}.`,
      };
    }

    // Check 3: quiz average ≥ CERTIFICATE_QUIZ_THRESHOLD (75%).
    // v6.0: uses the shared constant (was a hardcoded 75 literal).
    const avg = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
    if (avg < CERTIFICATE_QUIZ_THRESHOLD) {
      console.error("[certificates/create] 403 REASON: quiz average too low", {
        trackId,
        average: avg,
        required: CERTIFICATE_QUIZ_THRESHOLD,
      });
      return {
        valid: false,
        error: `Quiz average too low: ${avg.toFixed(1)}% (required: ≥${CERTIFICATE_QUIZ_THRESHOLD}%).`,
      };
    }

    console.log("[certificates/create] language cert validation PASSED:", { trackId, avg });
    return { valid: true };
  } else if (certificateType === "career") {
    const score = progressProof.careerReadinessScore;
    if (typeof score !== "number" || score !== 100) {
      console.error("[certificates/create] 403 REASON: career readiness score invalid", { score });
      return {
        valid: false,
        error: `Career readiness score must be 100 (got: ${score}).`,
      };
    }
    return { valid: true };
  }

  console.error("[certificates/create] 403 REASON: unknown certificate type", { certificateType });
  return { valid: false, error: `Unknown certificate type: ${certificateType}` };
}

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

function sanitizeHolderName(name: string): string {
  return name
    .replace(/[\x00-\x1F\x7F]/g, "")
    .replace(/[\u200B-\u200F\u2028-\u202F\u0080-\u009F\uFEFF]/g, "")
    .normalize("NFKC")
    .trim()
    .slice(0, 100);
}

export async function POST(req: NextRequest) {
  try {
    const certSecret = process.env.CERT_SECRET;
    if (!certSecret || certSecret.length < 32) {
      console.error("[certificates/create] 500: CERT_SECRET not set or too short");
      return NextResponse.json(
        { error: "Certificate signing is not configured. The deployer must set CERT_SECRET (min 32 characters)." },
        { status: 500 },
      );
    }

    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.allowed) {
      console.error("[certificates/create] 429: rate limited", { ip });
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
      );
    }

    const body = await req.json();
    const { holderName, certificateType, languageCompleted, joinedDate, progressProof } = body;

    if (!holderName || typeof holderName !== "string") {
      return NextResponse.json({ error: "Missing required field: holderName" }, { status: 400 });
    }
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
    const cleanJoinedDate = validateJoinedDate(joinedDate);

    // v5.866: progress proof validation with detailed logging
    const proofResult = validateProgressProof(certificateType, cleanLang, progressProof ?? null);
    if (!proofResult.valid) {
      // The validateProgressProof function already logged the specific reason
      return NextResponse.json(
        { error: `Progress validation failed: ${proofResult.error}` },
        { status: 403 },
      );
    }

    const supabase = createServerClient();

    const issueDate = new Date().toISOString();
    let certId = "";
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
      console.error("[certificates/create] 500: failed to generate unique ID after 10 attempts");
      return NextResponse.json(
        { error: "Failed to generate a unique certificate ID after 10 attempts" },
        { status: 500 },
      );
    }

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
      return NextResponse.json(
        { error: "Failed to create certificate in registry. Please try again later." },
        { status: 500 },
      );
    }

    console.log("[certificates/create] SUCCESS:", { certId, holderName: cleanName, type: certificateType });
    return NextResponse.json({ ok: true, certId });
  } catch (err) {
    console.error("[certificates/create] unhandled error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
