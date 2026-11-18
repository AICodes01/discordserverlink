import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Block aggressive AI scrapers and commercial SEO crawlers completely
        userAgent: [
          "AhrefsBot",
          "SemrushBot",
          "MJ12bot",
          "DotBot",
          "BLEXBot",
          "DataForSeoBot",
          "PetalBot",
          "Bytespider",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
          "CCBot",
          "Diffbot",
          "Cohere-ai",
          "PerplexityBot",
          "TurnitinBot",
          "Omgilibot",
          "Scrapy",
        ],
        disallow: ["/"],
      },
      {
        // Google Search Crawler - full access to public server directory
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/taplu", "/dashboard/"],
      },
      {
        // Bing Search Crawler
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/taplu", "/dashboard/"],
      },
      {
        // General Search Crawlers - polite rate limiting
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/login", "/taplu", "/dashboard/"],
        crawlDelay: 2,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
