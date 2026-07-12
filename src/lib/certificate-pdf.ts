"use client";

/**
 * certificate-pdf.ts — Shared certificate PDF generation (v5.924).
 *
 * Extracted from LearnView.tsx (`generateCertificate`) and CareerView.tsx
 * (`generateCareerCertificate`) so the new Certificate Hub on the Dashboard
 * can reuse the exact same PDF generation without duplicating logic.
 *
 * v5.924 PDF FIX (Mode A + Mode D): the previous templates used
 *   `width: 100vw; min-height: 100vh; padding: 50px; overflow: hidden;`
 * with `@page { size: landscape; margin: 0; }`. Two problems:
 *   1. `min-height` (not `height`) let the cert box grow past one page when
 *      content exceeded `100vh − 100px padding` → an empty page 2 tail.
 *   2. Generic `landscape` (no paper size) made the actual page height vary
 *      by the user's default paper, so the same cert split on Letter but not
 *      A4, etc.
 * The fix: lock to `@page { size: A4 landscape; margin: 0; }` and size the
 * cert to the A4 landscape printable area (`297mm × 210mm`) with `height`
 * (not `min-height`) and `overflow: hidden`. Padding is reduced so content
 * fits reliably. `print-color-adjust: exact` is set on body + .cert so the
 * gradient background and colored seals always print.
 */

import { useStore } from "@/lib/store";
import { ALL_LANGUAGE_INFO } from "@/lib/lessons-meta";
import type { Lesson } from "@/lib/types";
import { openPrintableHtml } from "@/lib/print-utils";
import { toast } from "sonner";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Build the HTML for a Language Track certificate. Exported (not just opened
 * directly) so a future "preview in dialog" feature can reuse it.
 *
 * Reads the stored certId from `state.certificates[trackId]` — does NOT
 * generate a fallback ID. If no cert is stored, returns null.
 */
export function buildLanguageCertificateHtml(
  name: string,
  trackName: string,
  trackId: string,
  trackLessons: Lesson[],
): string | null {
  const stored = useStore.getState().state.certificates[trackId];
  if (!stored?.certId) return null;
  const certId = stored.certId;
  const issuedAt = stored.issuedAt ?? new Date().toISOString();
  const date = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const trackInfo = ALL_LANGUAGE_INFO[trackId];
  const trackIcon = trackInfo?.icon ?? "📘";
  const trackColor = trackInfo?.color ?? "#3B82F6";
  const lessonCount = trackLessons.length;
  const quizCount = trackLessons.reduce((sum, l) => sum + l.quiz.length, 0);
  const skillsMastered = trackLessons
    .filter((l) => !l.isCapstone)
    .slice(0, 6)
    .map((l) => l.title);
  const skillsList = skillsMastered
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Launchpad Certificate — ${escapeHtml(name)} — ${escapeHtml(trackName)}</title>
  <style>
    /* v5.924: lock to A4 landscape so page height is fixed (297×210mm)
       regardless of the user's default paper size. margin:0 lets the cert
       bleed to the page edge; the inner .border provides visual margin. */
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    /* v5.924: height (not min-height) + A4 landscape mm sizing → content
       can never overflow into a page 2. overflow:hidden is a belt-and-
       suspenders clip. Padding reduced from 50px to 32px to guarantee fit. */
    .cert {
      width: 297mm; height: 210mm;
      background: linear-gradient(135deg, #fefce8 0%, #f0fdfa 50%, #fdf4ff 100%);
      padding: 32px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative;
      overflow: hidden;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .watermark {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg);
      font-size: 200px; font-weight: 900; color: rgba(45, 212, 191, 0.04);
      pointer-events: none; user-select: none; letter-spacing: -0.05em; z-index: 0;
    }
    .border { position: absolute; inset: 18px; border: 3px solid #1f2937; border-radius: 12px; z-index: 1; }
    .border-inner { position: absolute; inset: 26px; border: 1px solid #6b7280; border-radius: 8px; z-index: 1; }
    .content { position: relative; z-index: 2; text-align: center; max-width: 760px; }
    .logo {
      font-size: 34px; font-weight: bold; letter-spacing: -0.02em;
      background: linear-gradient(135deg, #2DD4BF 0%, #E879F9 50%, #FCD34D 100%);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .subtitle { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #6b7280; margin-bottom: 22px; }
    .title { font-size: 26px; font-weight: bold; color: #1f2937; margin-bottom: 6px; }
    .body-text { font-size: 13px; color: #4b5563; max-width: 580px; line-height: 1.55; margin: 0 auto 18px; }
    .name { font-size: 36px; font-weight: bold; font-style: italic; color: #111827; margin: 8px 0 18px; border-bottom: 2px solid #1f2937; padding-bottom: 6px; display: inline-block; min-width: 300px; }
    .track-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 6px; }
    .track-icon { font-size: 30px; }
    .track { font-size: 20px; color: #1f2937; font-weight: bold; }
    .track-detail { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
    .skills-box { background: rgba(255,255,255,0.55); border: 1px solid #e5e7eb; border-radius: 8px; padding: 10px 18px; margin: 0 auto 22px; max-width: 480px; }
    .skills-title { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
    .skills-list { list-style: none; padding: 0; margin: 0; font-size: 11px; color: #374151; columns: 2; column-gap: 24px; }
    .skills-list li { padding: 2px 0; break-inside: avoid; }
    .signatures { display: flex; gap: 80px; margin-top: 22px; justify-content: center; }
    .sig { text-align: center; }
    .sig-line { width: 200px; border-top: 1px solid #1f2937; margin-bottom: 6px; }
    .sig-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; }
    .cert-id { position: absolute; bottom: 34px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #9ca3af; font-family: monospace; z-index: 2; }
    .seal {
      position: absolute; bottom: 56px; right: 56px;
      width: 84px; height: 84px; border-radius: 50%;
      background: linear-gradient(135deg, ${trackColor}, #E879F9);
      display: flex; align-items: center; justify-content: center;
      color: #ffffff; font-weight: bold; font-size: 11px; text-align: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: rotate(-12deg);
      z-index: 2;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    @media screen { body { background: #f3f4f6; } .cert { box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin: 20px auto; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="watermark">Launchpad</div>
    <div class="border"></div>
    <div class="border-inner"></div>
    <div class="content">
      <div class="logo">Launchpad</div>
      <div class="subtitle">Coding Education Platform</div>
      <div class="title">Certificate of Completion</div>
      <div class="body-text">This certifies that the bearer has successfully completed all required lessons, exercises, and quizzes in the track below, demonstrating proficiency in the fundamentals of the technology.</div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="track-row">
        <span class="track-icon">${trackIcon}</span>
        <span class="track">${escapeHtml(trackName)} Track</span>
      </div>
      <div class="track-detail">${lessonCount} lessons · ${quizCount} quiz questions · Completed ${date}</div>
      <div class="skills-box">
        <div class="skills-title">Skills Mastered</div>
        <ul class="skills-list">${skillsList}</ul>
      </div>
      <div class="signatures">
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-label">Launchpad</div>
        </div>
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-label">Date · ${date}</div>
        </div>
      </div>
    </div>
    <div class="seal">VERIFIED<br/>${date.split(",")[0]}</div>
    <div class="cert-id">Certificate ID: ${certId}</div>
  </div>
</body>
</html>`;
}

/**
 * Build the HTML for a Career Master certificate. Returns null if no career
 * cert is stored in state.
 */
export function buildCareerCertificateHtml(
  name: string,
  careerLabel: string,
  languageIds: string[],
  totalHours: number,
): string | null {
  const stored = useStore.getState().state.careerCertificate;
  if (!stored?.certId) return null;
  const certId = stored.certId;
  const issuedAt = stored.issuedAt;
  const date = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const langs = languageIds.map((id) => ALL_LANGUAGE_INFO[id]?.name ?? id);
  const langsList = langs
    .map((l) => `<span class="lang-chip">${escapeHtml(l)}</span>`)
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Launchpad Career Master Certificate — ${escapeHtml(name)}</title>
  <style>
    /* v5.924: A4 landscape locked, margin:0, height (not min-height) — see
       buildLanguageCertificateHtml for the full Mode-A fix rationale. */
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .cert {
      width: 297mm; height: 210mm;
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 30%, #fefce8 70%, #fdf4ff 100%);
      padding: 32px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      position: relative;
      overflow: hidden;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    .watermark {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg);
      font-size: 220px; font-weight: 900; color: rgba(245, 158, 11, 0.06);
      pointer-events: none; user-select: none; letter-spacing: -0.05em; z-index: 0;
    }
    .border { position: absolute; inset: 18px; border: 4px solid #D97706; border-radius: 12px; z-index: 1; box-shadow: inset 0 0 0 1px #FCD34D; }
    .border-inner { position: absolute; inset: 28px; border: 1px solid #F59E0B; border-radius: 8px; z-index: 1; }
    .content { position: relative; z-index: 2; text-align: center; max-width: 820px; }
    .logo {
      font-size: 38px; font-weight: bold; letter-spacing: -0.02em;
      background: linear-gradient(135deg, #F59E0B 0%, #E879F9 50%, #2DD4BF 100%);
      -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }
    .subtitle { font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #92400E; margin-bottom: 22px; }
    .title { font-size: 30px; font-weight: bold; color: #78350F; margin-bottom: 6px; }
    .body-text { font-size: 13px; color: #4b5563; max-width: 620px; line-height: 1.55; margin: 0 auto 18px; }
    .name { font-size: 40px; font-weight: bold; font-style: italic; color: #78350F; margin: 8px 0 18px; border-bottom: 2px solid #D97706; padding-bottom: 6px; display: inline-block; min-width: 350px; }
    .career { font-size: 22px; color: #78350F; font-weight: bold; margin-bottom: 12px; }
    .langs-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-bottom: 10px; }
    .lang-chip { padding: 4px 10px; border: 1px solid #F59E0B; border-radius: 12px; font-size: 11px; color: #92400E; background: rgba(252, 211, 77, 0.25); }
    .stats { font-size: 12px; color: #6b7280; margin-bottom: 22px; }
    .signatures { display: flex; gap: 80px; margin-top: 22px; justify-content: center; }
    .sig { text-align: center; }
    .sig-line { width: 200px; border-top: 1px solid #78350F; margin-bottom: 6px; }
    .sig-label { font-size: 11px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.1em; }
    .cert-id { position: absolute; bottom: 34px; left: 50%; transform: translateX(-50%); font-size: 10px; color: #92400E; font-family: monospace; z-index: 2; }
    .seal {
      position: absolute; bottom: 56px; right: 56px;
      width: 100px; height: 100px; border-radius: 50%;
      background: linear-gradient(135deg, #F59E0B, #D97706);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      color: #ffffff; font-weight: bold; font-size: 10px; text-align: center;
      box-shadow: 0 4px 16px rgba(217, 119, 6, 0.4);
      transform: rotate(-12deg);
      z-index: 2;
      border: 3px solid #FCD34D;
      -webkit-print-color-adjust: exact; print-color-adjust: exact;
    }
    @media screen { body { background: #f3f4f6; } .cert { box-shadow: 0 10px 40px rgba(0,0,0,0.1); margin: 20px auto; } }
  </style>
</head>
<body>
  <div class="cert">
    <div class="watermark">Launchpad</div>
    <div class="border"></div>
    <div class="border-inner"></div>
    <div class="content">
      <div class="logo">Launchpad</div>
      <div class="subtitle">Coding Education Platform</div>
      <div class="title">Career Master Certificate</div>
      <div class="body-text">This certifies that the bearer has demonstrated mastery across the entire career curriculum — completing the full personalized roadmap, all linked lessons, and shipped capstone projects with production-grade quality.</div>
      <div class="name">${escapeHtml(name)}</div>
      <div class="career">${escapeHtml(careerLabel)} — Mastery Achieved</div>
      <div class="langs-row">${langsList}</div>
      <div class="stats">~${Math.round(totalHours)} hours invested · ${langs.length} technologies mastered · Completed ${date}</div>
      <div class="signatures">
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-label">Launchpad</div>
        </div>
        <div class="sig">
          <div class="sig-line"></div>
          <div class="sig-label">Date · ${date}</div>
        </div>
      </div>
    </div>
    <div class="seal">CAREER<br/>MASTER<br/>${date.split(",")[0]}</div>
    <div class="cert-id">Certificate ID: ${certId}</div>
  </div>
</body>
</html>`;
}

/**
 * Open the Language Track certificate PDF in a new tab (print-to-PDF).
 * Reused by LearnView, the Dashboard Certificate Hub, and the Learn-tab badge.
 * Returns false if no cert is stored for the track.
 */
export function openLanguageCertificatePdf(
  name: string,
  trackName: string,
  trackId: string,
  trackLessons: Lesson[],
): boolean {
  const html = buildLanguageCertificateHtml(name, trackName, trackId, trackLessons);
  if (!html) {
    console.error("[openLanguageCertificatePdf] no stored certId for track:", trackId);
    toast.error("Certificate not issued yet", {
      description: "Click 'Issue certificate' first. If you already clicked it and got an error, please try again.",
    });
    return false;
  }
  const stored = useStore.getState().state.certificates[trackId]!;
  openPrintableHtml(html, {
    filename: `launchpad-certificate-${trackId}-${stored.certId}`,
    title: `Launchpad ${trackName} Certificate`,
  });
  return true;
}

/**
 * Open the Career Master certificate PDF in a new tab.
 * Reused by CareerView and the Dashboard Certificate Hub.
 * Returns false if no career cert is stored.
 */
export function openCareerCertificatePdf(
  name: string,
  careerLabel: string,
  languageIds: string[],
  totalHours: number,
): boolean {
  const html = buildCareerCertificateHtml(name, careerLabel, languageIds, totalHours);
  if (!html) {
    console.error("[openCareerCertificatePdf] no stored career certId");
    toast.error("Career Master Certificate not issued yet", {
      description: "Click 'Issue certificate' first. If you already clicked it and got an error, please try again.",
    });
    return false;
  }
  const stored = useStore.getState().state.careerCertificate!;
  openPrintableHtml(html, {
    filename: `launchpad-career-certificate-${stored.certId}`,
    title: "Launchpad Career Master Certificate",
  });
  return true;
}
