import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://guidinggrace.app";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/subscribe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/signin`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];
}
