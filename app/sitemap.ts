import type { MetadataRoute } from "next";
import { getAllSitemapEntries, getSiteBaseUrl } from "@/lib/sitemap-urls";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteBaseUrl();
  const entries = await getAllSitemapEntries();

  return entries.map((entry) => ({
    url: `${baseUrl}${entry.path}`,
    lastModified: entry.lastModified,
    changeFrequency: entry.path === "/" ? "daily" : "weekly",
    priority: entry.path === "/" ? 1 : entry.path.split("/").length <= 2 ? 0.8 : 0.6,
  }));
}
