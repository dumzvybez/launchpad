/**
 * Certificate tests — validate certificate ID generation, format validation,
 * signature verification, and progress-proof validation logic.
 *
 * Tests:
 *   - Certificate ID format validation (valid/invalid IDs)
 *   - Certificate type detection (language vs career)
 *   - Signed vs unsigned detection
 *   - HMAC signature generation and verification
 *   - Progress proof validation (completion + quiz average thresholds)
 *   - Invalid progress rejection
 */
import { describe, it, expect } from "vitest";
import {
  isValidCertificateFormat,
  getCertificateType,
  isSignedCertificate,
  generateCertificateId,
  generateCareerCertificateId,
  computeCertSignature,
  generateSignedCertificateId,
  generateSignedCareerCertificateId,
  verifyCertificateSignature,
} from "@/lib/certificate-utils";
import { CERTIFICATE_QUIZ_THRESHOLD } from "@/lib/constants";
import { TRACK_LESSON_SLUGS, getExpectedLessonCount } from "@/lib/lessons-meta";

const TEST_SECRET = "test-secret-for-verification-pass-only-min-32-chars-long-aaa";

// ---- Certificate ID format tests ----

describe("Certificate: ID format validation", () => {
  it("accepts signed language format LP-{10}-{11}", () => {
    expect(isValidCertificateFormat("LP-ABCDEFGHIJ-KLMNOPQRSTU")).toBe(true);
  });

  it("accepts signed career format LP-CAREER-{10}-{11}", () => {
    expect(isValidCertificateFormat("LP-CAREER-ABCDEFGHIJ-KLMNOPQRSTU")).toBe(true);
  });

  it("accepts unsigned language format LP-{10+}", () => {
    expect(isValidCertificateFormat("LP-ABCDEFGHIJ")).toBe(true);
    expect(isValidCertificateFormat("LP-ABCDEFGHIJKL")).toBe(true);
  });

  it("accepts unsigned career format LP-CAREER-{10+}", () => {
    expect(isValidCertificateFormat("LP-CAREER-ABCDEFGHIJ")).toBe(true);
  });

  it("accepts 8-char legacy format", () => {
    expect(isValidCertificateFormat("LP-ABCDEFGH")).toBe(true);
  });

  it("rejects invalid formats", () => {
    expect(isValidCertificateFormat("")).toBe(false);
    expect(isValidCertificateFormat("LP-")).toBe(false);
    expect(isValidCertificateFormat("ABCDEFGH")).toBe(false);
    expect(isValidCertificateFormat("LP-ABC")).toBe(false); // too short
    expect(isValidCertificateFormat("WRONG-ABCDEFGHIJ")).toBe(false);
    expect(isValidCertificateFormat("LP-CAREER-")).toBe(false);
  });
});

describe("Certificate: type detection", () => {
  it("detects language certificates", () => {
    expect(getCertificateType("LP-ABCDEFGHIJ")).toBe("language");
    expect(getCertificateType("LP-ABCDEFGHIJ-KLMNOPQRSTU")).toBe("language");
  });

  it("detects career certificates", () => {
    expect(getCertificateType("LP-CAREER-ABCDEFGHIJ")).toBe("career");
    expect(getCertificateType("LP-CAREER-ABCDEFGHIJ-KLMNOPQRSTU")).toBe("career");
  });

  it("returns invalid for bad IDs", () => {
    expect(getCertificateType("")).toBe("invalid");
    expect(getCertificateType("WRONG")).toBe("invalid");
  });
});

describe("Certificate: signed detection", () => {
  it("identifies signed certificates (with HMAC suffix)", () => {
    expect(isSignedCertificate("LP-ABCDEFGHIJ-KLMNOPQRSTU")).toBe(true);
    expect(isSignedCertificate("LP-CAREER-ABCDEFGHIJ-KLMNOPQRSTU")).toBe(true);
  });

  it("identifies unsigned certificates", () => {
    expect(isSignedCertificate("LP-ABCDEFGHIJ")).toBe(false);
    expect(isSignedCertificate("LP-CAREER-ABCDEFGHIJ")).toBe(false);
    expect(isSignedCertificate("LP-ABCDEFGH")).toBe(false);
  });
});

// ---- ID generation tests ----

describe("Certificate: ID generation", () => {
  it("generateCertificateId produces valid unsigned language IDs", () => {
    const id = generateCertificateId();
    expect(id).toMatch(/^LP-[A-Z0-9]{10}$/);
    expect(isValidCertificateFormat(id)).toBe(true);
    expect(getCertificateType(id)).toBe("language");
    expect(isSignedCertificate(id)).toBe(false);
  });

  it("generateCareerCertificateId produces valid unsigned career IDs", () => {
    const id = generateCareerCertificateId();
    expect(id).toMatch(/^LP-CAREER-[A-Z0-9]{10}$/);
    expect(isValidCertificateFormat(id)).toBe(true);
    expect(getCertificateType(id)).toBe("career");
    expect(isSignedCertificate(id)).toBe(false);
  });

  it("generated IDs are unique (randomness check)", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateCertificateId());
    }
    // With 36^10 possible values, 100 IDs should all be unique
    expect(ids.size).toBe(100);
  });
});

// ---- HMAC signature tests ----

describe("Certificate: HMAC signature", () => {
  it("computeCertSignature is deterministic for same payload+secret", async () => {
    const sig1 = await computeCertSignature("test-payload", TEST_SECRET);
    const sig2 = await computeCertSignature("test-payload", TEST_SECRET);
    expect(sig1).toBe(sig2);
    expect(sig1.length).toBe(11);
  });

  it("computeCertSignature differs for different payloads", async () => {
    const sig1 = await computeCertSignature("payload-a", TEST_SECRET);
    const sig2 = await computeCertSignature("payload-b", TEST_SECRET);
    expect(sig1).not.toBe(sig2);
  });

  it("computeCertSignature differs for different secrets", async () => {
    const sig1 = await computeCertSignature("same-payload", TEST_SECRET);
    const sig2 = await computeCertSignature("same-payload", "different-secret-also-min-32-chars-long-xxx");
    expect(sig1).not.toBe(sig2);
  });
});

describe("Certificate: signed ID generation + verification", () => {
  it("generateSignedCertificateId produces signed language IDs", async () => {
    const id = await generateSignedCertificateId("Alice", "python", "2026-01-01", TEST_SECRET);
    expect(id).toMatch(/^LP-[A-Z0-9]{10}-[A-Z0-9]{11}$/);
    expect(isSignedCertificate(id)).toBe(true);
    expect(getCertificateType(id)).toBe("language");
  });

  it("generateSignedCareerCertificateId produces signed career IDs", async () => {
    const id = await generateSignedCareerCertificateId("Alice", "Software Engineer", "2026-01-01", TEST_SECRET);
    expect(id).toMatch(/^LP-CAREER-[A-Z0-9]{10}-[A-Z0-9]{11}$/);
    expect(isSignedCertificate(id)).toBe(true);
    expect(getCertificateType(id)).toBe("career");
  });

  it("verifyCertificateSignature returns true for valid signature", async () => {
    const holderName = "Alice";
    const trackId = "python";
    const issueDate = "2026-01-01";
    const id = await generateSignedCertificateId(holderName, trackId, issueDate, TEST_SECRET);
    const valid = await verifyCertificateSignature(id, holderName, trackId, issueDate, TEST_SECRET);
    expect(valid).toBe(true);
  });

  it("verifyCertificateSignature returns false for tampered holder name", async () => {
    const id = await generateSignedCertificateId("Alice", "python", "2026-01-01", TEST_SECRET);
    const valid = await verifyCertificateSignature(id, "Bob", "python", "2026-01-01", TEST_SECRET);
    expect(valid).toBe(false);
  });

  it("verifyCertificateSignature returns false for tampered track", async () => {
    const id = await generateSignedCertificateId("Alice", "python", "2026-01-01", TEST_SECRET);
    const valid = await verifyCertificateSignature(id, "Alice", "javascript", "2026-01-01", TEST_SECRET);
    expect(valid).toBe(false);
  });

  it("verifyCertificateSignature returns false for wrong secret", async () => {
    const id = await generateSignedCertificateId("Alice", "python", "2026-01-01", TEST_SECRET);
    const valid = await verifyCertificateSignature(id, "Alice", "python", "2026-01-01", "wrong-secret-min-32-chars-long-bbbbbbbbbbbb");
    expect(valid).toBe(false);
  });

  it("verifyCertificateSignature works for career certificates", async () => {
    const holderName = "Alice";
    const careerLabel = "Software Engineer";
    const issueDate = "2026-01-01";
    const id = await generateSignedCareerCertificateId(holderName, careerLabel, issueDate, TEST_SECRET);
    const valid = await verifyCertificateSignature(id, holderName, careerLabel, issueDate, TEST_SECRET);
    expect(valid).toBe(true);
  });
});

// ---- Progress proof validation (mirrors /api/certificates/create logic) ----

/**
 * This mirrors the validateProgressProof function from the certificate create
 * API route. We test the LOGIC here since the function is not exported from
 * the route file. If the route logic changes, these tests should be updated
 * to match.
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
  if (!progressProof) return { valid: false, error: "Progress proof is required" };

  if (certificateType === "language") {
    if (!languageCompleted) return { valid: false, error: "languageCompleted is required" };

    const trackId = languageCompleted;
    const expectedSlugs = TRACK_LESSON_SLUGS[trackId];
    const expectedCount = getExpectedLessonCount(trackId);

    if (expectedCount === 0 || !expectedSlugs || expectedSlugs.length === 0) {
      return { valid: false, error: `Unknown track: "${trackId}"` };
    }

    const completedIds = progressProof.completedLessonIds ?? [];
    const completedSet = new Set(completedIds);
    const missing = expectedSlugs.filter((s) => !completedSet.has(s));

    if (missing.length > 0) {
      return { valid: false, error: `Incomplete: ${missing.length} of ${expectedCount} lessons not completed` };
    }

    const quizScores = progressProof.quizScores ?? {};
    const scoreValues = Object.values(quizScores).filter((s) => typeof s === "number" && s >= 0 && s <= 100);
    if (scoreValues.length < expectedCount) {
      return { valid: false, error: `Insufficient quiz data: expected ${expectedCount}, got ${scoreValues.length}` };
    }

    const avg = scoreValues.reduce((sum, s) => sum + s, 0) / scoreValues.length;
    if (avg < CERTIFICATE_QUIZ_THRESHOLD) {
      return { valid: false, error: `Quiz average too low: ${avg.toFixed(1)}% (required: ≥${CERTIFICATE_QUIZ_THRESHOLD}%)` };
    }

    return { valid: true };
  }

  if (certificateType === "career") {
    const score = progressProof.careerReadinessScore ?? 0;
    if (score < 100) {
      return { valid: false, error: `Career Readiness Score too low: ${score}% (required: 100%)` };
    }
    return { valid: true };
  }

  return { valid: false, error: `Unknown certificate type: "${certificateType}"` };
}

describe("Certificate: progress proof validation", () => {
  // Use a real track for testing — python has 21 lessons
  const TEST_TRACK = "python";
  const testSlugs = TRACK_LESSON_SLUGS[TEST_TRACK];
  const testCount = getExpectedLessonCount(TEST_TRACK);

  it("accepts valid completion with passing quiz average", () => {
    const quizScores: Record<string, number> = {};
    for (const slug of testSlugs) quizScores[slug] = 80; // 80% > 75% threshold
    const result = validateProgressProof("language", TEST_TRACK, {
      completedLessonIds: testSlugs,
      quizScores,
    });
    expect(result.valid).toBe(true);
  });

  it("rejects null progress proof", () => {
    const result = validateProgressProof("language", TEST_TRACK, null);
    expect(result.valid).toBe(false);
    expect(result.error).toContain("required");
  });

  it("rejects language cert without languageCompleted", () => {
    const result = validateProgressProof("language", null, { completedLessonIds: [] });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("languageCompleted");
  });

  it("rejects unknown track", () => {
    const result = validateProgressProof("language", "nonexistent-track", {
      completedLessonIds: [],
      quizScores: {},
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Unknown track");
  });

  it("rejects incomplete track (missing lessons)", () => {
    const incomplete = testSlugs.slice(0, testCount - 1); // missing 1 lesson
    const quizScores: Record<string, number> = {};
    for (const slug of incomplete) quizScores[slug] = 80;
    const result = validateProgressProof("language", TEST_TRACK, {
      completedLessonIds: incomplete,
      quizScores,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Incomplete");
  });

  it("rejects insufficient quiz scores", () => {
    const quizScores: Record<string, number> = {};
    for (const slug of testSlugs.slice(0, testCount - 1)) quizScores[slug] = 80; // 1 fewer score
    const result = validateProgressProof("language", TEST_TRACK, {
      completedLessonIds: testSlugs,
      quizScores,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("Insufficient quiz data");
  });

  it(`rejects quiz average below ${CERTIFICATE_QUIZ_THRESHOLD}%`, () => {
    const quizScores: Record<string, number> = {};
    for (const slug of testSlugs) quizScores[slug] = 70; // 70% < 75% threshold
    const result = validateProgressProof("language", TEST_TRACK, {
      completedLessonIds: testSlugs,
      quizScores,
    });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("too low");
  });

  it("accepts quiz average exactly at threshold (75%)", () => {
    const quizScores: Record<string, number> = {};
    for (const slug of testSlugs) quizScores[slug] = CERTIFICATE_QUIZ_THRESHOLD;
    const result = validateProgressProof("language", TEST_TRACK, {
      completedLessonIds: testSlugs,
      quizScores,
    });
    expect(result.valid).toBe(true);
  });
});

describe("Certificate: career progress validation", () => {
  it("accepts 100% career readiness score", () => {
    const result = validateProgressProof("career", null, { careerReadinessScore: 100 });
    expect(result.valid).toBe(true);
  });

  it("rejects career readiness below 100%", () => {
    const result = validateProgressProof("career", null, { careerReadinessScore: 99 });
    expect(result.valid).toBe(false);
    expect(result.error).toContain("too low");
  });

  it("rejects career readiness of 0", () => {
    const result = validateProgressProof("career", null, { careerReadinessScore: 0 });
    expect(result.valid).toBe(false);
  });

  it("rejects missing career readiness score", () => {
    const result = validateProgressProof("career", null, {});
    expect(result.valid).toBe(false);
  });
});
