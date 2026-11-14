import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";
import { SITE_URL } from "@/lib/seo";
import { getAllBots } from "@/lib/botsData";
import { getAllPostsSync } from "@/lib/blog";
import { getSitemapConfig } from "@/lib/seoSettings";
import { getAllFallbackServers, DEFAULT_CATEGORIES } from "@/lib/fallbackServers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const cfg = await getSitemapConfig();

    // 1. Static high priority routes
    let staticRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeStatic) {
      staticRoutes = [
        {
          url: SITE_URL,
          lastModified: new Date(),
          changeFrequency: cfg.staticFreq,
          priority: cfg.staticPriority,
        },
        {
          url: `${SITE_URL}/servers`,
          lastModified: new Date(),
          changeFrequency: "hourly",
          priority: cfg.staticPriority,
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
          priority: 0.85,
        },
        {
          url: `${SITE_URL}/emojis`,
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.85,
        },
        {
          url: `${SITE_URL}/about-us`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        },
        {
          url: `${SITE_URL}/contact-us`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        },
        {
          url: `${SITE_URL}/privacy-policy`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        },
        {
          url: `${SITE_URL}/terms`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        },
        {
          url: `${SITE_URL}/disclaimer`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        },
        {
          url: `${SITE_URL}/dmca`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        },
      ];
    }

    // 2. Tools & Utilities routes
    let toolsRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeTools) {
      const toolPaths = [
        "/tools",
        "/tools/discord-pfp-viewer",
        "/tools/invite-checker",
        "/tools/permissions-calculator",
        "/tools/snowflake-timestamp",
        "/tools/markdown-color-text",
        "/tools/webhook-sender",
        "/tools/fancy-fonts",
      ];
      toolsRoutes = toolPaths.map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: cfg.toolsFreq,
        priority: cfg.toolsPriority,
      }));
    }

    // 3. Dynamic Server Pages
    let serverRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeServers) {
      try {
        const servers = await prisma.server.findMany({
          where: { status: "APPROVED" },
          select: { slug: true, updatedAt: true, lastBumpedAt: true },
          take: cfg.serversLimit,
          orderBy: { lastBumpedAt: "desc" },
        });

        serverRoutes = servers.map((s) => ({
          url: `${SITE_URL}/server/${s.slug}`,
          lastModified: s.updatedAt || s.lastBumpedAt,
          changeFrequency: cfg.serversFreq,
          priority: cfg.serversPriority,
        }));
      } catch (e) {
        // Fallback servers for sitemap
        const fb = getAllFallbackServers().slice(0, cfg.serversLimit || 5000);
        serverRoutes = fb.map((s) => ({
          url: `${SITE_URL}/server/${s.slug}`,
          lastModified: new Date(),
          changeFrequency: cfg.serversFreq,
          priority: cfg.serversPriority,
        }));
      }
    }

    // 4. Category Pages
    let categoryRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeCategories) {
      try {
        const categories = await prisma.category.findMany({
          select: { slug: true, updatedAt: true },
        });

        categoryRoutes = categories.map((c) => ({
          url: `${SITE_URL}/category/${c.slug}`,
          lastModified: c.updatedAt,
          changeFrequency: cfg.categoriesFreq,
          priority: cfg.categoriesPriority,
        }));
      } catch (e) {
        categoryRoutes = DEFAULT_CATEGORIES.map((c) => ({
          url: `${SITE_URL}/category/${c.slug}`,
          lastModified: new Date(),
          changeFrequency: cfg.categoriesFreq,
          priority: cfg.categoriesPriority,
        }));
      }
    }

    // 5. Tag Pages
    let tagRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeTags) {
      try {
        const tags = await prisma.tag.findMany({
          select: { slug: true, updatedAt: true },
          take: 500,
        });

        tagRoutes = tags.map((t) => ({
          url: `${SITE_URL}/tag/${t.slug}`,
          lastModified: t.updatedAt,
          changeFrequency: cfg.tagsFreq,
          priority: cfg.tagsPriority,
        }));
      } catch (e) {
        // fallback
      }
    }

    // 6. Bot Pages
    let botRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeBots) {
      const allBots = getAllBots();
      botRoutes = allBots.map((b) => ({
        url: `${SITE_URL}/bot/${b.slug}`,
        lastModified: new Date(),
        changeFrequency: cfg.botsFreq,
        priority: cfg.botsPriority,
      }));
    }

    // 7. Blog Articles
    let blogRoutes: MetadataRoute.Sitemap = [];
    if (cfg.includeBlog) {
      try {
        const posts = getAllPostsSync();
        blogRoutes = posts.map((post) => ({
          url: `${SITE_URL}/blog/${post.slug}`,
          lastModified: post.date ? new Date(post.date) : new Date(),
          changeFrequency: cfg.blogFreq,
          priority: cfg.blogPriority,
        }));
      } catch (e) {
        // fallback
      }
    }

    // 8. Custom URLs added by Admin
    const customRouteItems: MetadataRoute.Sitemap = cfg.customUrls.map((customUrl) => ({
      url: customUrl.startsWith("http") ? customUrl : `${SITE_URL}${customUrl.startsWith("/") ? "" : "/"}${customUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    // Combine all routes
    const combined = [
      ...staticRoutes,
      ...toolsRoutes,
      ...categoryRoutes,
      ...tagRoutes,
      ...serverRoutes,
      ...botRoutes,
      ...blogRoutes,
      ...customRouteItems,
    ];

    // Filter out excluded URLs
    const excludedPatterns = cfg.excludedUrls.map((u) => u.toLowerCase().trim()).filter(Boolean);
    const filtered = combined.filter((entry) => {
      const lower = entry.url.toLowerCase();
      return !excludedPatterns.some((pattern) => lower.includes(pattern));
    });

    return filtered;
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
