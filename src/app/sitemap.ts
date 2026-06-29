import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://launchpad--pi.vercel.app";
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/?view=dashboard`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/?view=roadmap`, lastModified: now, priority: 0.9, changeFrequency: "weekly" },
    { url: `${base}/?view=learn`, lastModified: now, priority: 0.9, changeFrequency: "monthly" },
    { url: `${base}/?view=playground`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/?view=daily-challenge`, lastModified: now, priority: 0.8, changeFrequency: "daily" },
    { url: `${base}/?view=ai-tutor`, lastModified: now, priority: 0.8, changeFrequency: "monthly" },
    { url: `${base}/?view=analytics`, lastModified: now, priority: 0.7, changeFrequency: "daily" },
    { url: `${base}/?view=career`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/?view=projects`, lastModified: now, priority: 0.7, changeFrequency: "weekly" },
    { url: `${base}/?view=settings`, lastModified: now, priority: 0.5, changeFrequency: "monthly" },
    { url: `${base}/google53e23fb6a2391241.html`, lastModified: now, priority: 0.3, changeFrequency: "yearly" },
  ];
}
