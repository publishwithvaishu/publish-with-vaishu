import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";
import { getCategories, getPublishedBooksForSitemap } from "@/lib/queries";

// Regenerate the sitemap at most once an hour.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "daily", priority: 1 },
    { url: `${base}/books`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Category-filtered catalog pages (indexable browse pages).
  let categoryRoutes: MetadataRoute.Sitemap = [];
  let bookRoutes: MetadataRoute.Sitemap = [];
  try {
    const [categories, books] = await Promise.all([
      getCategories(),
      getPublishedBooksForSitemap(),
    ]);

    categoryRoutes = categories.map((c) => ({
      url: `${base}/books?category=${encodeURIComponent(c.slug)}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    bookRoutes = books.map((b) => ({
      url: `${base}/books/${b.id}`,
      lastModified: b.created_at ? new Date(b.created_at) : undefined,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // If the DB is briefly unreachable, still return the static routes so the
    // sitemap never 500s.
  }

  return [...staticRoutes, ...categoryRoutes, ...bookRoutes];
}
