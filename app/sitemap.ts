import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { getAllBots } from "@/lib/botsData";
import { getAllPostsSync } from "@/lib/blog";

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
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/bots`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/bots/new`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/servers/new`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      },
      {
        url: `${SITE_URL}/emojis`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/tools`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/tools/discord-pfp-viewer`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      },
      {
        url: `${SITE_URL}/tools/invite-checker`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/tools/permissions-calculator`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/tools/snowflake-timestamp`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/tools/markdown-color-text`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/tools/webhook-sender`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
      {
        url: `${SITE_URL}/tools/fancy-fonts`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];

    // 2. Dynamic Server Pages
    let serverRoutes: MetadataRoute.Sitemap = [];
    try {
      const servers = await prisma.server.findMany({
        where: { status: "APPROVED" },
        select: { slug: true, updatedAt: true, lastBumpedAt: true },
        take: 5000,
        orderBy: { lastBumpedAt: "desc" },
      });

      serverRoutes = servers.map((s) => ({
        url: `${SITE_URL}/server/${s.slug}`,
        lastModified: s.updatedAt || s.lastBumpedAt,
        changeFrequency: "daily",
        priority: 0.85,
      }));
    } catch (e) {
      // fallback
    }

    // 3. Category Pages
    let categoryRoutes: MetadataRoute.Sitemap = [];
    try {
      const categories = await prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      });

      categoryRoutes = categories.map((c) => ({
        url: `${SITE_URL}/category/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "daily",
        priority: 0.8,
      }));
    } catch (e) {
      // fallback
    }

    // 4. Tag Pages
    let tagRoutes: MetadataRoute.Sitemap = [];
    try {
      const tags = await prisma.tag.findMany({
        select: { slug: true, updatedAt: true },
      });

      tagRoutes = tags.map((t) => ({
        url: `${SITE_URL}/tag/${t.slug}`,
        lastModified: t.updatedAt,
        changeFrequency: "weekly",
        priority: 0.75,
      }));
    } catch (e) {
      // fallback
    }

    // 5. Bot Pages (All 50+ bots)
    const allBots = getAllBots();
    const botRoutes: MetadataRoute.Sitemap = allBots.map((b) => ({
      url: `${SITE_URL}/bot/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    // 6. Blog Articles
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
      const posts = getAllPostsSync();
      blogRoutes = posts.map((post) => ({
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: post.date ? new Date(post.date) : new Date(),
        changeFrequency: "weekly",
        priority: 0.75,
      }));
    } catch (e) {
      // fallback
    }

    return [
      ...staticRoutes,
      ...categoryRoutes,
      ...tagRoutes,
      ...serverRoutes,
      ...botRoutes,
      ...blogRoutes,
    ];
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
