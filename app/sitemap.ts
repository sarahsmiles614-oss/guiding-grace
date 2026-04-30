import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://guidinggrace.app";
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/daily`, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${base}/today`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/subscribe`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/devotions`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/bible-365`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/study-guide`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/grace-challenge`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/scripture-match`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/promises`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/prayer-wall`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/nightly-reflections`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${base}/heavens-hearts`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/heroes-villains`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/testimony-wall`, lastModified: now, changeFrequency: "daily", priority: 0.6 },
    { url: `${base}/shame-recycle`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
