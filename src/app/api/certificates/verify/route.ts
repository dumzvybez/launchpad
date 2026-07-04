import { NextRequest, NextResponse } from "next/server";
import { createBrowserClient } from "@/lib/supabase";

// v5.77 fix: explicit runtime + this is a read-only public lookup.
export const runtime = "nodejs";

/**
 * GET /api/certificates/verify?id=LP-XXXXXXXX
 *
 * Looks up a certificate by ID using the anon key (public read access via RLS).
 * Returns only public fields — never exposes email, phone, or progress data.
 *
 * Response:
 *   - 200: { valid: true, holderName, certificateType, languageCompleted, issueDate, joinedDate }
 *   - 404: { valid: false, error: "Certificate not found" }
 *   - 400: { error: "Missing certificate ID" }
 *   - 503: { error: "Certificate verification is not configured" }
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing certificate ID" },
      { status: 400 },
    );
  }

  // v5.77 fix: validate ID length to prevent abuse (megabyte-long IDs forwarded to Supabase).
  if (id.length > 64) {
    return NextResponse.json(
      { error: "Certificate ID too long" },
      { status: 400 },
    );
  }

  const supabase = createBrowserClient();

  if (!supabase) {
    // Supabase not configured — fall back to format validation only
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

  return NextResponse.json({
    valid: true,
    holderName: data.holder_name,
    certificateType: data.certificate_type,
    languageCompleted: data.language_completed,
    issueDate: data.issue_date,
    joinedDate: data.joined_date,
  });
}
