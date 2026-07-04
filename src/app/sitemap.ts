import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://launchpad--dev.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/dashboard`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/roadmap`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/learn`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/flashcards`, lastModified: now, priority: 0.8, changeFrequency: "weekly" },
    { url: `${base}/playground`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/daily-challenge`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${base}/ai-tutor`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/projects`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/analytics`, lastModified: now, priority: 0.7, changeFrequency: "daily" },
    { url: `${base}/career`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/tools`, lastModified: now, priority: 0.6, changeFrequency: "monthly" },
    { url: `${base}/community`, lastModified: now, priority: 0.6, changeFrequency: "daily" },
    { url: `${base}/settings`, lastModified: now, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/verify`, lastModified: now, priority: 0.4, changeFrequency: "monthly" },
  ];
}
