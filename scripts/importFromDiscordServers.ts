import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Search categories to crawl on discordservers.com
const CATEGORIES = [
  "gaming",
  "anime",
  "community",
  "music",
  "technology",
  "roleplay",
  "minecraft",
  "chill",
  "roblox",
  "valorant",
  "art",
  "education",
  "crypto",
  "programming",
  "social",
];

// Helper to delay between requests to be gentle and prevent rate-limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Map crawled tags/category to internal categorySlug
function mapToInternalCategory(tags: string[], defaultCat: string): string {
  const combined = [...tags, defaultCat].join(" ").toLowerCase();
  if (combined.includes("game") || combined.includes("minecraft") || combined.includes("roblox") || combined.includes("valorant") || combined.includes("lfg") || combined.includes("fortnite") || combined.includes("esport")) {
    return "gaming";
  }
  if (combined.includes("anime") || combined.includes("manga") || combined.includes("vtuber") || combined.includes("genshin") || combined.includes("honkai")) {
    return "anime";
  }
  if (combined.includes("tech") || combined.includes("code") || combined.includes("program") || combined.includes("dev") || combined.includes("python") || combined.includes("javascript") || combined.includes("ai")) {
    return "technology";
  }
  if (combined.includes("music") || combined.includes("beat") || combined.includes("producer") || combined.includes("audio") || combined.includes("singer") || combined.includes("hiphop")) {
    return "music";
  }
  if (combined.includes("study") || combined.includes("learn") || combined.includes("school") || combined.includes("college") || combined.includes("education") || combined.includes("science")) {
    return "education";
  }
  if (combined.includes("crypto") || combined.includes("stock") || combined.includes("trade") || combined.includes("finance") || combined.includes("invest") || combined.includes("bitcoin")) {
    return "finance";
  }
  if (combined.includes("art") || combined.includes("design") || combined.includes("draw") || combined.includes("paint") || combined.includes("3d") || combined.includes("photo")) {
    return "art";
  }
  return "community";
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (err) {
    return null;
  }
}

async function main() {
  console.log("==================================================");
  console.log("🚀 Starting Discord Servers Collector from discordservers.com");
  console.log("==================================================");

  // 1. Get default admin user to assign as owner
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    console.error("Admin user not found. Please run seed first.");
    return;
  }

  // 2. Discover server IDs from all search category pages
  const discoveredGuildIds = new Set<string>();

  for (const cat of CATEGORIES) {
    const searchUrl = `https://discordservers.com/search/${cat}`;
    process.stdout.write(`Scanning category: [${cat}]... `);
    const html = await fetchHtml(searchUrl);

    if (html) {
      const idMatches = Array.from(html.matchAll(/href="\/server\/([0-9]{15,22})"/g));
      let foundInCat = 0;
      for (const m of idMatches) {
        if (m[1]) {
          discoveredGuildIds.add(m[1]);
          foundInCat++;
        }
      }
      console.log(`found ${foundInCat} servers.`);
    } else {
      console.log(`failed to fetch.`);
    }
    await delay(300);
  }

  const uniqueIds = Array.from(discoveredGuildIds);
  console.log(`\nFound a total of ${uniqueIds.length} unique Discord servers!`);
  console.log("Beginning extraction and database import...\n");

  let importedCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < uniqueIds.length; i++) {
    const guildId = uniqueIds[i];
    const serverUrl = `https://discordservers.com/server/${guildId}`;

    try {
      const html = await fetchHtml(serverUrl);
      if (!html) {
        skippedCount++;
        continue;
      }

      // Parse JSON-LD for name, description, icon
      const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
      let name = "";
      let description = "";
      let iconUrl: string | null = null;

      if (jsonLdMatch) {
        try {
          const parsed = JSON.parse(jsonLdMatch[1]);
          name = parsed.name || parsed.headline || "";
          description = parsed.description || "";
          if (parsed.image?.url) {
            iconUrl = parsed.image.url;
          }
        } catch {
          // ignore
        }
      }

      // Fallback name & description from title/meta
      if (!name) {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/);
        if (titleMatch) {
          name = titleMatch[1].split("-")[0].trim();
        }
      }

      if (!description) {
        const metaDescMatch = html.match(/<meta name="description" content="([^"]+)"/);
        if (metaDescMatch) {
          description = metaDescMatch[1];
        }
      }

      // Clean name
      name = name.replace(/[^\x20-\x7E\u00C0-\u024F\u1E00-\u1EFF]/g, " ").trim();
      if (!name || name.length < 2) {
        name = `Community ${guildId.slice(-4)}`;
      }

      // Parse tags
      const tagMatches = Array.from(html.matchAll(/href="\/search\/([^"]+)"/g));
      const extractedTags = tagMatches
        .map((m) => decodeURIComponent(m[1]).toLowerCase().replace(/[^a-z0-9_-]/g, ""))
        .filter((t) => t && !CATEGORIES.includes(t))
        .slice(0, 8);

      const tagsString = extractedTags.join(",");

      // Parse Member Count
      let memberCount = 1000;
      const memMatches = html.match(/([0-9,]+)\s*(?:Members|members)/);
      if (memMatches && memMatches[1]) {
        memberCount = parseInt(memMatches[1].replace(/,/g, ""), 10) || 1000;
      }

      // Try Discord Widget for live presence & instant invite
      let onlineCount = Math.floor(memberCount * 0.22);
      let inviteUrl = `https://discord.com/invite/servers`;

      try {
        const widgetRes = await fetch(`https://discord.com/api/guilds/${guildId}/widget.json`, {
          headers: { "User-Agent": USER_AGENT },
        });
        if (widgetRes.ok) {
          const widgetData = await widgetRes.json();
          if (widgetData.presence_count) {
            onlineCount = widgetData.presence_count;
          }
          if (widgetData.instant_invite) {
            inviteUrl = widgetData.instant_invite;
          }
        }
      } catch {
        // use defaults
      }

      // If iconUrl is missing or default, construct CDN avatar
      if (!iconUrl) {
        iconUrl = `https://cdn.discordapp.com/icons/${guildId}/default.png`;
      }

      // Map to internal category
      const categorySlug = mapToInternalCategory(extractedTags, "community");

      // Generate base slug
      let baseSlug = slugify(name, { lower: true, strict: true }) || `server-${guildId.slice(-6)}`;
      let slug = baseSlug;

      // Check if guild already exists
      const existingServer = await prisma.server.findFirst({
        where: {
          OR: [{ guildId }, { slug }],
        },
      });

      if (existingServer) {
        // Update member counts & details
        await prisma.server.update({
          where: { id: existingServer.id },
          data: {
            memberCount: Math.max(existingServer.memberCount, memberCount),
            onlineCount: Math.max(existingServer.onlineCount, onlineCount),
            shortDescription: description.slice(0, 180) || existingServer.shortDescription,
            longDescription: description || existingServer.longDescription,
            tags: tagsString || existingServer.tags,
            inviteUrl: inviteUrl.includes("discord") ? inviteUrl : existingServer.inviteUrl,
          },
        });
        console.log(`[${i + 1}/${uniqueIds.length}] 🔄 Updated: ${name} (${memberCount.toLocaleString()} members)`);
      } else {
        // Create new server listing
        await prisma.server.create({
          data: {
            guildId,
            name,
            slug,
            shortDescription:
              description.slice(0, 180) ||
              `Welcome to ${name}! Join thousands of active members in voice chats and community discussions.`,
            longDescription:
              description ||
              `## Welcome to ${name}!\n\nJoin our active Discord community. Chat with fellow members, participate in events, and have fun!`,
            inviteUrl,
            categorySlug,
            tags: tagsString,
            iconUrl,
            memberCount,
            onlineCount,
            isVerified: memberCount > 10000,
            isPartnered: memberCount > 25000,
            isFeatured: memberCount > 50000,
            status: "APPROVED",
            bumpsCount: Math.floor(Math.random() * 80) + 10,
            lastBumpedAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 120)),
            ownerId: adminUser.id,
          },
        });
        console.log(`[${i + 1}/${uniqueIds.length}] ✅ Added: ${name} (${categorySlug} | ${memberCount.toLocaleString()} members)`);
        importedCount++;
      }

      await delay(250); // polite crawl delay
    } catch (err: any) {
      console.log(`[${i + 1}/${uniqueIds.length}] ⚠️ Error on ${guildId}: ${err.message}`);
      skippedCount++;
    }
  }

  console.log("\n==================================================");
  console.log(`🎉 Scraping & Import Completed!`);
  console.log(`✅ Newly Added Servers: ${importedCount}`);
  console.log(`📊 Total Database Servers: ${await prisma.server.count()}`);
  console.log("==================================================");
}

main()
  .catch((e) => {
    console.error("Crawler error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
