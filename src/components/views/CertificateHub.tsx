"use client";

/**
 * CertificateHub — unified view of all earned certificates (v5.924).
 *
 * Lists BOTH language-track certificates (from `state.certificates`) AND the
 * Career Master certificate (from `state.careerCertificate`). Each row opens
 * a detail popup showing the track/career name, completion date, certificate
 * ID, and a Download button that reuses the EXISTING PDF generation in
 * `src/lib/certificate-pdf.ts` (no duplicated logic).
 *
 * Also used by the Learn tab badge: `CertificateDetailDialog` is exported so
 * the Learn tab can open the same popup directly for a specific cert.
 *
 * Empty state: a calm "no certificates yet" card with a CTA to the Learn tab.
 */

import { useState, useMemo } from "react";
import { Award, Download, X, ExternalLink, Trophy } from "lucide-react";
import { useStore } from "@/lib/store";
import { GlassCard, GlassButton } from "@/components/glass/GlassPrimitives";
import { cn } from "@/lib/utils";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import { LANGUAGE_MAP } from "@/lib/career-data";
import { getLessonsForTrack } from "@/lib/lessons-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  openLanguageCertificatePdf,
  openCareerCertificatePdf,
} from "@/lib/certificate-pdf";

/** Unified certificate shape for display. */
export type UnifiedCertificate = {
  kind: "language" | "career";
  certId: string;
  issuedAt: string;
  name: string;
  /** trackName (language) or careerLabel (career) */
  title: string;
  /** trackId for language certs; undefined for career */
  trackId?: string;
};

/**
 * Build the unified list of earned certificates from store state.
 * Exported so the Learn tab badge can check "does this track have a cert?"
 * without duplicating the derivation.
 */
export function useEarnedCertificates(): UnifiedCertificate[] {
  const certificates = useStore((s) => s.state.certificates);
  const careerCertificate = useStore((s) => s.state.careerCertificate);

  return useMemo(() => {
    const langCerts: UnifiedCertificate[] = Object.values(certificates).map((c) => ({
      kind: "language" as const,
      certId: c.certId,
      issuedAt: c.issuedAt,
      name: c.name,
      title: c.trackName,
      trackId: c.trackId,
    }));
    const careerCerts: UnifiedCertificate[] = careerCertificate
      ? [{
          kind: "career" as const,
          certId: careerCertificate.certId,
          issuedAt: careerCertificate.issuedAt,
          name: careerCertificate.name,
          title: careerCertificate.careerLabel,
        }]
      : [];
    // Career cert first (if earned), then language certs by issue date desc.
    return [
      ...careerCerts,
      ...langCerts.sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()),
    ];
  }, [certificates, careerCertificate]);
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

/**
 * The detail popup. Exported so the Learn-tab badge can open it directly for
 * a specific certificate (without going through the hub list).
 */
export function CertificateDetailDialog({
  cert,
  onClose,
}: {
  cert: UnifiedCertificate | null;
  onClose: () => void;
}) {
  const roadmap = useStore((s) => s.state.roadmap);
  const profile = useStore((s) => s.state.profile);
  // For career certs we need totalHours; compute lazily from store.
  // (Mirrors CareerView.computeHoursInvested tier-2 logic, kept lightweight
  // here — the exact number is only shown on the career cert PDF itself.)
  const open = cert !== null;

  const handleDownload = () => {
    if (!cert) return;
    if (cert.kind === "language" && cert.trackId) {
      const trackLessons = getLessonsForTrack(cert.trackId);
      openLanguageCertificatePdf(cert.name, cert.title, cert.trackId, trackLessons);
    } else if (cert.kind === "career") {
      // totalHours: pass 0 — the PDF computes its own display via the store,
      // but our shared helper takes it as a param. We give a best-effort
      // estimate from the roadmap's totalHours field.
      const totalHours = roadmap?.totalHours ?? 0;
      const languageIds = roadmap?.languageIds ?? [];
      openCareerCertificatePdf(cert.name, cert.title, languageIds, totalHours);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 -mt-1">
            <div
              className={cn(
                "h-11 w-11 shrink-0 rounded-2xl flex items-center justify-center shadow-sm",
                cert?.kind === "career"
                  ? "bg-gradient-to-br from-amber-400 to-orange-500"
                  : "bg-gradient-to-br from-teal-400 via-fuchsia-400 to-amber-300",
              )}
            >
              {cert?.kind === "career" ? (
                <Trophy className="h-5 w-5 text-white" />
              ) : (
                <Award className="h-5 w-5 text-white" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {cert?.kind === "career" ? "Career Master Certificate" : "Language Track Certificate"}
              </div>
              <DialogTitle className="text-base font-semibold leading-tight pr-6">
                {cert?.title}
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        {cert && (
          <div className="space-y-3 mt-1">
            <DialogDescription className="sr-only">
              Certificate details for {cert.title}
            </DialogDescription>

            <div className="rounded-xl border border-border/60 bg-card/30 p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Holder</div>
                  <div className="font-medium truncate">{cert.name || profile.name || "Learner"}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Completed</div>
                  <div className="font-medium">{formatDate(cert.issuedAt)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Type</div>
                  <div className="font-medium">{cert.kind === "career" ? "Career" : "Language"}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">Certificate ID</div>
                <div className="font-mono text-xs px-3 py-2 rounded-lg bg-background/60 border border-border/60 break-all">
                  {cert.certId}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <GlassButton variant="primary" size="lg" className="w-full" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download certificate (PDF)
              </GlassButton>
              <a
                href={`/verify/${cert.certId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-1"
              >
                <ExternalLink className="h-3 w-3" />
                View public verification page
              </a>
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed text-center">
              {cert.kind === "career"
                ? "Earned by reaching a 100% Career Readiness Score across your roadmap, quizzes, projects, challenges, and interviews."
                : "Earned by completing every lesson in the track with a 75%+ average quiz score."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * The Dashboard "My Certificates" section. Renders a list of earned certs
 * (each opening the detail popup) or an empty state if none earned.
 */
export function CertificateHub() {
  const certs = useEarnedCertificates();
  const setView = useStore((s) => s.setView);
  const [selected, setSelected] = useState<UnifiedCertificate | null>(null);

  if (certs.length === 0) {
    // Empty state — calm, with a CTA to the Learn tab.
    return (
      <GlassCard className="p-5">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-foreground/5 flex items-center justify-center shrink-0">
            <Award className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">My Certificates</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              You haven&apos;t earned any certificates yet. Complete a language track
              (all lessons + 75% quiz average) to earn your first one.
            </p>
          </div>
          <GlassButton variant="ghost" size="sm" onClick={() => setView("learn")}>
            Start learning
          </GlassButton>
        </div>
      </GlassCard>
    );
  }

  return (
    <>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm">My Certificates</h3>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
              {certs.length}
            </span>
          </div>
          <span className="text-[10px] text-muted-foreground">Click to view & download</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {certs.map((cert) => {
            const isCareer = cert.kind === "career";
            const icon = isCareer ? "🏆" : (cert.trackId ? (ALL_LANGUAGE_INFO[cert.trackId]?.icon ?? (LANGUAGE_MAP[cert.trackId]?.icon ?? "📘")) : "📘");
            return (
              <button
                key={cert.certId}
                onClick={() => setSelected(cert)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                  "border-border/60 bg-card/30 hover:bg-card/60 hover:border-primary/40",
                )}
              >
                <div
                  className={cn(
                    "h-9 w-9 shrink-0 rounded-lg flex items-center justify-center text-lg",
                    isCareer
                      ? "bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/30"
                      : "bg-foreground/5",
                  )}
                >
                  {icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{cert.title}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <span
                      className={cn(
                        "inline-block px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase",
                        isCareer
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                          : "bg-teal-500/15 text-teal-600 dark:text-teal-400",
                      )}
                    >
                      {isCareer ? "Career" : "Language"}
                    </span>
                    <span>{formatDate(cert.issuedAt)}</span>
                  </div>
                </div>
                <Award className="h-4 w-4 text-muted-foreground/60 shrink-0" />
              </button>
            );
          })}
        </div>
      </GlassCard>

      <CertificateDetailDialog cert={selected} onClose={() => setSelected(null)} />
    </>
  );
}
