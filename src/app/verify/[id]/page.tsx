import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certificate Verification",
  description: "Verify a Launchpad certificate ID.",
  robots: { index: true, follow: true },
};

const DEV_PORTFOLIO_URL = "https://duminduwanasinghe-dev.vercel.app/";

/**
 * Public certificate verification page.
 *
 * URL pattern: /verify/LP-ABC12345  (or /verify/LP-CAREER-XXXXXXXX)
 *
 * IMPORTANT — per Section 3.2 of Prompt-2-updated.txt:
 * Launchpad stores all data on-device. There is NO central database to query.
 * This page cannot look up who a certificate belongs to — that's by design
 * for privacy. Instead, it confirms the ID format is valid and tells the
 * verifier how to authenticate the certificate holder (ask them to show the
 * certificate alongside their completed track in the Launchpad app).
 *
 * This page is server-rendered (no client state) so it loads fast and works
 * even for non-Launchpad users (e.g. an employer checking a candidate's cert).
 */
export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = await params;

  // Decode URL-encoded IDs (in case the LP-XXXXXXXX contains chars that got encoded)
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
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-2xl">
                ⚠️
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Invalid Certificate ID
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The ID <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">{id}</code> does not match the Launchpad certificate format.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Launchpad certificate IDs follow the format <code className="font-mono">LP-XXXXXXXX</code> (8 alphanumeric characters) for language certificates, or <code className="font-mono">LP-CAREER-XXXXXXXX</code> for Career Master certificates. Please double-check the ID and try again.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const certType = isCareerCert ? "Career Master Certificate" : "Language Track Certificate";

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Top gradient bar — teal/violet/amber = Launchpad brand */}
        <div className="bg-gradient-to-r from-teal-500 via-violet-500 to-amber-500 p-1" />

        <div className="p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-teal-400 via-violet-400 to-amber-300 flex items-center justify-center text-2xl shrink-0">
              🏅
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Launchpad Certificate Verification
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Privacy-first · on-device · no central database
              </p>
            </div>
          </div>

          {/* Certificate ID display */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 mb-5 border border-slate-200 dark:border-slate-700">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-mono mb-1">
              Certificate ID
            </div>
            <div className="font-mono text-lg font-bold text-slate-900 dark:text-white break-all">
              {id}
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Valid format · {certType}
            </div>
          </div>

          {/* Verification explanation */}
          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <p>
              <strong className="text-slate-900 dark:text-white">✅ This ID format is valid.</strong>
            </p>
            <p>
              Launchpad certificates are generated locally on the learner&apos;s device.
              They cannot be looked up centrally because Launchpad stores no user
              data on servers — this is by design for privacy.
            </p>
            <p>
              To verify authenticity, ask the certificate holder to show you the
              certificate alongside their completed track in the Launchpad app.
              The certificate ID on the PDF should match this ID exactly.
            </p>
          </div>

          {/* Privacy-first callout */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-teal-500/5 to-violet-500/5 border border-teal-500/20">
            <div className="flex items-start gap-3">
              <div className="text-xl shrink-0">🔒</div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white mb-1">
                  Why no central lookup?
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Launchpad is the only coding education platform that combines AI-personalization,
                  complete free-ness, and 100% on-device privacy. Your data never leaves your
                  browser — no accounts, no tracking, no servers storing your progress.
                </p>
              </div>
            </div>
          </div>

          {/* Footer link */}
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Learn more about Launchpad&apos;s privacy-first approach:
            </p>
            <a
              href={DEV_PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-teal-600 dark:text-teal-400 hover:underline"
            >
              duminduwanasinghe-dev.vercel.app →
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
