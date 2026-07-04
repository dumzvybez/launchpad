import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description: "Verify a Launchpad certificate ID.",
  robots: { index: true, follow: true },
};

const DEV_PORTFOLIO_URL = "https://duminduwanasinghe-dev.vercel.app/";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://launchpad--dev.vercel.app";

/**
 * Public certificate verification page (v5.76).
 *
 * URL pattern: /verify/LP-ABC12345 (or /verify/LP-CAREER-XXXXXXXX)
 *
 * Queries the Supabase certificates table via the verify API endpoint.
 * Only displays public fields: holder name, cert type, language/track,
 * issue date, and join date. Never exposes email, phone, or progress data.
 */
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;
  const id = decodeURIComponent(rawId).toUpperCase();

  // Basic format validation
  const isLanguageCert = /^LP-[A-Z0-9]{8}$/.test(id);
  const isCareerCert = /^LP-CAREER-[A-Z0-9]+$/.test(id);

  if (!isLanguageCert && !isCareerCert) {
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
              Launchpad certificate IDs follow the format <code className="font-mono">LP-XXXXXXXX</code> (8 alphanumeric characters) for language certificates, or <code className="font-mono">LP-CAREER-XXXXXXXX</code> for Career Master certificates.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Query the verify API
  let certData: {
    valid: boolean;
    holderName?: string;
    certificateType?: string;
    languageCompleted?: string | null;
    issueDate?: string;
    joinedDate?: string;
    error?: string;
  } | null = null;

  try {
    const res = await fetch(`${BASE_URL}/api/certificates/verify?id=${encodeURIComponent(id)}`, {
      // Cache for 1 hour — certificate data doesn't change
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      certData = await res.json();
    } else if (res.status === 404) {
      certData = { valid: false, error: "Certificate not found" };
    } else if (res.status === 503) {
      // Supabase not configured — show the old format-only verification
      certData = null;
    }
  } catch {
    // Network error — fall back to format-only
    certData = null;
  }

  // If Supabase is not configured (503) or network error, show format-only verification
  if (!certData) {
    const certType = isCareerCert ? "Career Master Certificate" : "Language Track Certificate";
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
        <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 via-violet-500 to-amber-500 p-1" />
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 via-violet-400 to-amber-300 flex items-center justify-center text-2xl shrink-0">🏅</div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Launchpad Certificate</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">ID format verified</p>
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-200 dark:border-slate-700">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mb-1">Certificate ID</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-white break-all">{id}</div>
              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                Valid format · {certType}
              </div>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              This certificate ID has a valid format. Full database verification will be available once the certificate registry is online.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Certificate not found in database
  if (!certData.valid) {
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
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return iso;
    }
  };

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

          {/* Valid badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-4">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Verified · This is a genuine Launchpad certificate
          </div>

          {/* Privacy notice */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-teal-500/5 to-violet-500/5 border border-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="text-xl shrink-0">🔒</div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">Privacy Notice</div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Only the holder&apos;s display name, certificate type, completed track, and dates are shown — similar to how university degrees or professional certifications work. No email, phone number, or learning progress data is ever exposed through certificate verification.
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
