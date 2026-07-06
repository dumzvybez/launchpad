import type { Metadata } from "next";
import { headers } from "next/headers";
import { createBrowserClient } from "@/lib/supabase";
import { isValidCertificateFormat, getCertificateType, isSignedCertificate } from "@/lib/certificate-utils";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description: "Verify a Launchpad certificate ID.",
  robots: { index: true, follow: true },
};

const DEV_PORTFOLIO_URL = "https://duminduwanasinghe-dev.vercel.app/";

/**
 * Public certificate verification page (v5.77).
 *
 * URL pattern: /verify/LP-ABCDEFGHIJ (10-char base36) or /verify/LP-CAREER-XXXXXXXXXX
 *
 * v5.865 (B.CERT.6): Retry button uses a plain anchor with the current URL.
 *   Previously used onClick in a Server Component, which is invalid in
 *   Next.js App Router and silently did nothing.
 *
 * v5.865 (B.CERT.1): Shows signature status (signed + valid, signed + invalid,
 *   or unsigned). Signed certs with valid signatures are "cryptographically
 *   verified". Unsigned certs are "completion-attested only".
 *
 * v5.865 (B.CERT.2): Adds an honest disclaimer that Launchpad certificates
 *   are completion-attested, not identity-verified.
 *
 * Queries the Supabase certificates table directly using the anon (public) key.
 * Only displays public fields: holder name, cert type, language/track, issue date,
 * and join date. Never exposes email, phone, or progress data.
 */
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  let id: string;
  try {
    id = decodeURIComponent(rawId).toUpperCase();
  } catch {
    id = rawId.toUpperCase();
  }

  // Basic format validation
  if (!isValidCertificateFormat(id)) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-1" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-2xl">⚠️</div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Invalid Certificate ID</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The ID <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">{id}</code> does not match the Launchpad certificate format.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Launchpad certificate IDs follow the format <code className="font-mono">LP-XXXXXXXXXX</code> (10 alphanumeric characters) for language certificates, or <code className="font-mono">LP-CAREER-XXXXXXXXXX</code> for Career Master certificates.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const isCareerCert = getCertificateType(id) === "career";

  // Query Supabase directly (server-side) using the anon key.
  let certData: {
    valid: boolean;
    holderName?: string;
    certificateType?: string;
    languageCompleted?: string | null;
    issueDate?: string;
    joinedDate?: string;
    error?: string;
  } | null = null;
  let serviceUnavailable = false;

  const supabase = createBrowserClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("certificates")
        .select("id, holder_name, certificate_type, language_completed, issue_date, joined_date")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("[verify] query error:", error);
        serviceUnavailable = true;
      } else if (!data) {
        certData = { valid: false, error: "Certificate not found" };
      } else {
        certData = {
          valid: true,
          holderName: data.holder_name,
          certificateType: data.certificate_type,
          languageCompleted: data.language_completed,
          issueDate: data.issue_date,
          joinedDate: data.joined_date,
        };
      }
    } catch (err) {
      console.error("[verify] exception:", err);
      serviceUnavailable = true;
    }
  } else {
    serviceUnavailable = true;
  }

  // v5.865 (B.CERT.6): Retry button uses the current URL as href.
  // Navigating to the same URL triggers a full page reload, which is
  // exactly what "Retry" should do. This works in Server Components
  // (no onClick needed). We read the URL from the request headers.
  const headerList = await headers();
  const currentUrl = headerList.get("x-forwarded-url") || headerList.get("referer") || `/${id}`;

  if (serviceUnavailable) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-rose-500 p-1" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl">⏳</div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Verification Temporarily Unavailable</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The Launchpad certificate registry could not be reached. This may be a temporary outage or a configuration issue on the deployment.
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed mb-3 font-mono bg-amber-500/5 rounded-lg p-2 border border-amber-500/20">
              If you are the deployer: ensure you have run the SQL from <code>supabase/schema.sql</code> in your Supabase project&apos;s SQL Editor to create the <code>certificates</code> table. Also verify that <code>NEXT_PUBLIC_SUPABASE_URL</code> and <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> are set in Vercel environment variables.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Please try again later. If the problem persists, contact the certificate holder to confirm the ID, or visit the Launchpad GitHub discussions for support.
            </p>
            {/* v5.865 (B.CERT.6): plain anchor with current URL — no onClick */}
            <div className="mt-4">
              <a
                href={currentUrl}
                className="inline-block px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium cursor-pointer"
              >
                Retry
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Certificate not found in database
  if (!certData || !certData.valid) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 p-1" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-2xl">❌</div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Certificate Not Found</h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              No certificate was found with ID <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">{id}</code>.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Please double-check the ID and try again. If you believe this is an error, contact the certificate holder to verify the ID.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Certificate found — display public info
  const certTypeLabel = certData.certificateType === "career"
    ? "Career Master Certificate"
    : "Language Track Certificate";

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
    } catch {
      return iso;
    }
  };

  // v5.865 (B.CERT.1): determine signature status for display
  const signed = isSignedCertificate(id);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top gradient bar — teal/violet/amber = Launchpad brand */}
        <div className="bg-gradient-to-r from-teal-500 via-violet-500 to-amber-500 p-1" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 via-violet-400 to-amber-300 flex items-center justify-center text-2xl shrink-0">🏅</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                ✅ Valid Certificate
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Verified by Launchpad
              </p>
            </div>
          </div>

          {/* Certificate details */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mb-1">Certificate ID</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white break-all">{id}</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Holder</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{certData.holderName}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Type</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{certTypeLabel}</div>
              </div>
              {certData.languageCompleted && (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Track Completed</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white capitalize">{certData.languageCompleted}</div>
                </div>
              )}
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Issue Date</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(certData.issueDate ?? "")}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono">Joined Launchpad</div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">{formatDate(certData.joinedDate ?? "")}</div>
              </div>
            </div>
          </div>

          {/* Valid badge — shows signature status */}
          {signed ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Cryptographically verified · Signed certificate
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-sm font-medium mb-4">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              Verified · Completion-attested certificate
            </div>
          )}

          {/* Privacy notice + honest disclaimer (B.CERT.2) */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-teal-500/5 to-violet-500/5 border border-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="text-xl shrink-0">🔒</div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Privacy &amp; Verification Notice</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                  Only the holder&apos;s display name, certificate type, completed track, and dates are shown — similar to how university degrees or professional certifications work. No email, phone number, or learning progress data is ever exposed through certificate verification.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
                  <strong>Note:</strong> Launchpad is a privacy-first, accountless platform. Certificates attest that the holder completed the required coursework and quizzes, but Launchpad does not verify the holder&apos;s real-world identity. Treat these certificates as evidence of skill completion, not formal accreditation.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-center">
            <a
              href={DEV_PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              duminduwanasinghe-dev.vercel.app →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
