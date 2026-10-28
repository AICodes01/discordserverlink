import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // 1. Static high priority routes
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${SITE_URL}/servers`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/categories`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/servers/new`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
    ];

    // 2. Dynamic Server Pages
    const servers = await prisma.server.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true, lastBumpedAt: true },
      take: 5000,
      orderBy: { lastBumpedAt: "desc" },
    });

    const serverRoutes: MetadataRoute.Sitemap = servers.map((s) => ({
      url: `${SITE_URL}/server/${s.slug}`,
      lastModified: s.updatedAt || s.lastBumpedAt,
      changeFrequency: "daily",
      priority: 0.85,
    }));

    // 3. Category Pages
    const categories = await prisma.category.findMany({
      select: { slug: true, updatedAt: true },
    });

    const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${SITE_URL}/category/${c.slug}`,
      lastModified: c.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    }));

    // 4. Tag Pages
    const tags = await prisma.tag.findMany({
      select: { slug: true, updatedAt: true },
    });

    const tagRoutes: MetadataRoute.Sitemap = tags.map((t) => ({
      url: `${SITE_URL}/tag/${t.slug}`,
      lastModified: t.updatedAt,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    return [...staticRoutes, ...categoryRoutes, ...tagRoutes, ...serverRoutes];
  } catch (error) {
    console.error("Sitemap generation error:", error);
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}
