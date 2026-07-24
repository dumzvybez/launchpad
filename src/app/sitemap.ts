import { MetadataRoute } from "next";

// v5.77 fixes:
//   1. Use env-var base URL (with dev fallback) so self-hosters get correct URLs.
//   2. Use a fixed build-time date instead of `new Date()` so search engines
//      don't see "every URL changed just now" on every fetch.
//   3. Remove `/verify` entry (it's a 404 — only `/verify/[id]` exists).
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://launchpadedu.vercel.app";
// Fixed date — update on each release. Avoids search engines distrusting lastmod.
const LAST_MODIFIED = new Date("2026-07-04");

export default function sitemap(): MetadataRoute.Sitemap {
  // v5.85 fix (4.2): All routes except / and /verify/[id] are SPA-rendered
  // (identical HTML). We keep them for completeness but search engines should
  // focus on / and /verify/[id] which have distinct server-rendered content.
  return [
    { url: BASE_URL, lastModified: LAST_MODIFIED, priority: 1, changeFrequency: "weekly" },
    { url: `${BASE_URL}/dashboard`, lastModified: LAST_MODIFIED, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/roadmap`, lastModified: LAST_MODIFIED, priority: 0.9, changeFrequency: "weekly" },
    { url: `${BASE_URL}/learn`, lastModified: LAST_MODIFIED, priority: 0.9, changeFrequency: "monthly" },
    { url: `${BASE_URL}/flashcards`, lastModified: LAST_MODIFIED, priority: 0.8, changeFrequency: "weekly" },
    { url: `${BASE_URL}/playground`, lastModified: LAST_MODIFIED, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/daily-challenge`, lastModified: LAST_MODIFIED, priority: 0.8, changeFrequency: "daily" },
    { url: `${BASE_URL}/ai-tutor`, lastModified: LAST_MODIFIED, priority: 0.8, changeFrequency: "monthly" },
    { url: `${BASE_URL}/projects`, lastModified: LAST_MODIFIED, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/analytics`, lastModified: LAST_MODIFIED, priority: 0.7, changeFrequency: "daily" },
    { url: `${BASE_URL}/career`, lastModified: LAST_MODIFIED, priority: 0.7, changeFrequency: "weekly" },
    { url: `${BASE_URL}/tools`, lastModified: LAST_MODIFIED, priority: 0.6, changeFrequency: "monthly" },
    { url: `${BASE_URL}/community`, lastModified: LAST_MODIFIED, priority: 0.6, changeFrequency: "daily" },
    { url: `${BASE_URL}/settings`, lastModified: LAST_MODIFIED, priority: 0.5, changeFrequency: "monthly" },
    // v5.77 fix: removed `/verify` entry — it's a 404 (only `/verify/[id]` exists).
  ];
}
