import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase";
import { generateCertificateId, generateCareerCertificateId } from "@/lib/certificate-utils";

/**
 * POST /api/certificates/create
 *
 * Creates a new certificate in the Supabase certificates table.
 * Uses the service role key (server-side only) — the anon key cannot insert.
 *
 * Request body:
 *   - holderName: string (public display name)
 *   - certificateType: "language" | "career"
 *   - languageCompleted: string | null (track ID for language certs, null for career)
 *   - joinedDate: string (ISO timestamp of account creation)
 *
 * Response:
 *   - 200: { ok: true, certId: "LP-XXXXXXXX" }
 *   - 400: { error: "Missing required fields" }
 *   - 500: { error: "Failed to create certificate" }
 *
 * Unique ID generation:
 *   1. Generate a candidate ID (8-char base36, padded).
 *   2. Query Supabase to check if it already exists.
 *   3. If collision → regenerate and retry (max 10 attempts).
 *   4. Insert with the service role key.
 *   5. The database primary key constraint is the final safety net.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { holderName, certificateType, languageCompleted, joinedDate } = body;

    if (!holderName || !certificateType) {
      return NextResponse.json(
        { error: "Missing required fields: holderName, certificateType" },
        { status: 400 },
      );
    }

    const supabase = createServerClient();

    // Generate a guaranteed-unique certificate ID.
    // Try up to 10 times — with 8 chars of base36 entropy (2.8 trillion
    // possibilities), collisions are astronomically unlikely.
    let certId = "";
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      // Generate candidate ID
      certId =
        certificateType === "career"
          ? generateCareerCertificateId(holderName, certificateType, new Date().toISOString().slice(0, 10))
          : generateCertificateId(holderName, languageCompleted ?? "track", new Date().toISOString().slice(0, 10));

      // Check if this ID already exists
      const { data: existing } = await supabase
        .from("certificates")
        .select("id")
        .eq("id", certId)
        .maybeSingle();

      if (!existing) {
        // ID is free — proceed to insert
        break;
      }

      attempts++;
      if (attempts >= maxAttempts) {
        return NextResponse.json(
          { error: "Failed to generate a unique certificate ID after 10 attempts" },
          { status: 500 },
        );
      }
    }

    // Insert the certificate row
    const { error: insertError } = await supabase.from("certificates").insert({
      id: certId,
      holder_name: holderName,
      certificate_type: certificateType,
      language_completed: languageCompleted ?? null,
      issue_date: new Date().toISOString(),
      joined_date: joinedDate ?? new Date().toISOString(),
    });

    if (insertError) {
      // If it's a unique constraint violation (primary key collision despite
      // our check — race condition), retry would go here. For now, return error.
      console.error("[certificates/create] insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create certificate: " + insertError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, certId });
  } catch (err) {
    console.error("[certificates/create] error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
