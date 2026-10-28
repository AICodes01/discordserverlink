import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 180+ Search keywords to harvest 1000+ servers across all categories
const HARVEST_QUERIES = [
  // Gaming - Major Games & Franchises
  "minecraft", "roblox", "valorant", "fortnite", "genshin impact", "honkai star rail",
  "fivem", "gta rp", "rust", "counter strike 2", "cs2", "apex legends", "overwatch 2",
  "league of legends", "destiny 2", "rocket league", "call of duty", "warzone", "steam",
  "deadlock", "clover rpg", "lethal company", "helldivers 2", "palworld", "brawlhalla",
  "terraria", "warframe", "rainbow six siege", "pokemon", "zelda", "dota 2",
  "elden ring", "dark souls", "monster hunter", "cyberpunk 2077", "fallout", "skyrim",
  "among us", "phasmophobia", "sea of thieves", "tarkov", "pubg", "brawl stars",
  "clash royale", "clash of clans", "genshin", "wuthering waves", "zenless zone zero",
  "sims", "stardew valley", "animal crossing", "roblox bedwars", "blox fruits", "blade ball",
  "anime defenders", "deepwoken", "hypixel", "wynncraft", "lfg", "esports", "scrims",

  // Anime & Manga
  "anime", "manga", "vtuber", "hololive", "nijisanji", "one piece", "naruto",
  "jujutsu kaisen", "demon slayer", "attack on titan", "my hero academia", "bleach",
  "dragon ball", "chainsaw man", "solo leveling", "blue lock", "hunter x hunter",
  "spy x family", "death note", "haikyuu", "tokyo ghoul", "black clover", "berserk",
  "jojo", "evangelion", "fate grand order", "gundam", "mudae", "karuta", "anigame",
  "otaku", "cosplay", "anime community", "manhwa", "webtoon",

  // Technology, Coding & AI
  "technology", "programming", "coding", "python", "javascript", "typescript",
  "react", "nextjs", "vue", "angular", "nodejs", "web development", "fullstack",
  "artificial intelligence", "machine learning", "chatgpt", "openai", "deep learning",
  "linux", "arch linux", "ubuntu", "cybersecurity", "ethical hacking", "ctf",
  "devops", "docker", "kubernetes", "cloud", "aws", "rust lang", "golang", "csharp",
  "cpp", "java", "game development", "unity", "unreal engine", "godot", "blender 3d",

  // Music & Audio
  "music", "music production", "beatmaker", "producer", "fl studio", "ableton",
  "logic pro", "audio engineering", "mixing and mastering", "vocalist", "songwriter",
  "hip hop", "rap", "rnb", "edm", "house music", "techno", "lofi", "rock", "metal",
  "indie music", "guitar", "piano", "synth", "singers", "sound design",

  // Education & Study
  "education", "study", "study room", "homework help", "math", "calculus", "physics",
  "chemistry", "biology", "science", "stem", "computer science", "college", "university",
  "medical school", "languages", "language exchange", "learn english", "learn spanish",
  "learn japanese", "learn korean", "learn french", "learn german", "polyglot",
  "pomodoro", "study hall", "academic",

  // Finance, Stocks & Crypto
  "finance", "crypto", "cryptocurrency", "bitcoin", "ethereum", "solana", "web3",
  "defi", "nft", "stocks", "stock market", "options trading", "day trading",
  "investing", "personal finance", "fire movement", "real estate", "forex", "commodities",

  // Art & Design
  "art", "digital art", "drawing", "illustration", "concept art", "3d art", "blender",
  "3d modeling", "animation", "graphic design", "ui ux design", "photoshop", "procreate",
  "pixel art", "character design", "commissions", "artist alley",

  // Community & Social
  "community", "chill", "hangout", "friends", "social", "lounge", "vibes", "wholesome",
  "memes", "international", "lgbtq", "voice chat", "movie night", "gaming community",
  "aesthetic", "cozy", "cafe", "safe space"
];

// Map server title/desc/keywords to one of our 8 categories
function categorizeServer(text: string): string {
  const t = text.toLowerCase();
  if (
    t.includes("minecraft") || t.includes("roblox") || t.includes("valorant") ||
    t.includes("fortnite") || t.includes("game") || t.includes("gaming") ||
    t.includes("esport") || t.includes("scrim") || t.includes("lfg") ||
    t.includes("fivem") || t.includes("rust") || t.includes("gta") ||
    t.includes("apex") || t.includes("cs2") || t.includes("overwatch") ||
    t.includes("league of legends") || t.includes("pokemon") || t.includes("steam") ||
    t.includes("brawl") || t.includes("clash") || t.includes("palworld") ||
    t.includes("destiny") || t.includes("terraria") || t.includes("warframe")
  ) {
    return "gaming";
  }
  if (
    t.includes("anime") || t.includes("manga") || t.includes("vtuber") ||
    t.includes("genshin") || t.includes("honkai") || t.includes("weeb") ||
    t.includes("otaku") || t.includes("mudae") || t.includes("karuta") ||
    t.includes("anigame") || t.includes("cosplay") || t.includes("manhwa") ||
    t.includes("jujutsu") || t.includes("naruto") || t.includes("one piece")
  ) {
    return "anime";
  }
  if (
    t.includes("code") || t.includes("coding") || t.includes("program") ||
    t.includes("developer") || t.includes("software") || t.includes("python") ||
    t.includes("javascript") || t.includes("tech") || t.includes("ai") ||
    t.includes("machine learning") || t.includes("linux") || t.includes("security") ||
    t.includes("hack") || t.includes("web dev") || t.includes("rust lang") ||
    t.includes("unity") || t.includes("unreal") || t.includes("devops")
  ) {
    return "technology";
  }
  if (
    t.includes("music") || t.includes("beat") || t.includes("producer") ||
    t.includes("audio") || t.includes("fl studio") || t.includes("ableton") ||
    t.includes("vocal") || t.includes("song") || t.includes("mixing") ||
    t.includes("hiphop") || t.includes("rap") || t.includes("edm") ||
    t.includes("lofi") || t.includes("guitar") || t.includes("instrument")
  ) {
    return "music";
  }
  if (
    t.includes("study") || t.includes("homework") || t.includes("math") ||
    t.includes("science") || t.includes("school") || t.includes("college") ||
    t.includes("university") || t.includes("education") || t.includes("physics") ||
    t.includes("language") || t.includes("polyglot") || t.includes("pomodoro")
  ) {
    return "education";
  }
  if (
    t.includes("crypto") || t.includes("stock") || t.includes("trade") ||
    t.includes("trading") || t.includes("finance") || t.includes("bitcoin") ||
    t.includes("ethereum") || t.includes("forex") || t.includes("invest") ||
    t.includes("solana") || t.includes("defi") || t.includes("nft")
  ) {
    return "finance";
  }
  if (
    t.includes("art") || t.includes("drawing") || t.includes("design") ||
    t.includes("illustration") || t.includes("3d") || t.includes("blender") ||
    t.includes("render") || t.includes("photoshop") || t.includes("ui ux") ||
    t.includes("animation") || t.includes("creative") || t.includes("commission")
  ) {
    return "art";
  }
  return "community";
}

async function main() {
  console.log("===============================================================");
  console.log("🚀 DISCORD.COM/SERVERS 1,000 SERVER COLLECTOR & AUTO-FETCHER");
  console.log("===============================================================");

  // Find admin user to assign as listing submitter
  const adminUser = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!adminUser) {
    console.error("Admin user not found in database. Exiting.");
    return;
  }

  // PHASE 1: DISCOVERY - Collect server URLs from https://discord.com/servers
  console.log("\n[PHASE 1] Harvesting server links from https://discord.com/servers...");
  const discoveredMap = new Map<string, { path: string; guildId: string; query: string }>();

  for (const query of HARVEST_QUERIES) {
    const url = `https://discord.com/servers?query=${encodeURIComponent(query)}`;
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });
      if (res.ok) {
        const html = await res.text();
        const matches = html.match(/\/servers\/[a-zA-Z0-9_\-\.]*?[0-9]{15,22}/g) || [];
        for (const path of matches) {
          const idMatch = path.match(/([0-9]{15,22})$/);
          if (idMatch && idMatch[1]) {
            const guildId = idMatch[1];
            if (!discoveredMap.has(guildId)) {
              discoveredMap.set(guildId, { path, guildId, query });
            }
          }
        }
      }
    } catch (e) {
      // Continue
    }

    process.stdout.write(
      `\rScanned: "${query.padEnd(20)}" | Discovered: ${discoveredMap.size} unique servers`
    );

    if (discoveredMap.size >= 1200) {
      console.log("\nReached discovery target buffer (1,200+ servers). Moving to auto-fetch.");
      break;
    }
    await delay(120);
  }

  console.log(`\nDiscovery completed! Total unique server IDs collected: ${discoveredMap.size}`);

  // PHASE 2: AUTO-FETCH & SAVE TO DATABASE ONE BY ONE
  console.log("\n[PHASE 2] Auto-fetching Discord server metadata and importing to database...\n");

  const serverList = Array.from(discoveredMap.values());
  let addedCount = 0;
  let skippedCount = 0;
  let targetTotal = 1000;

  for (let i = 0; i < serverList.length; i++) {
    if (addedCount >= targetTotal) {
      console.log(`\n🎉 Successfully reached target of ${targetTotal} servers added!`);
      break;
    }

    const item = serverList[i];
    const serverPageUrl = `https://discord.com${item.path}`;

    try {
      // 1. Fetch server page on discord.com/servers/[slug]
      const pageRes = await fetch(serverPageUrl, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!pageRes.ok) {
        skippedCount++;
        continue;
      }

      const html = await pageRes.text();

      // Extract official invite code (vanity or code)
      const inviteMatch = html.match(/discord\.gg\/([a-zA-Z0-9_\-]+)/);
      const inviteCode = inviteMatch ? inviteMatch[1] : null;

      // Extract title / H1
      const titleMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
      let name = titleMatch
        ? titleMatch[1].replace(/<[^>]+>/g, "").replace(/\u2060/g, "").trim()
        : null;

      // Extract description
      const descMatch = html.match(/name="description" content="(.*?)"/);
      let description = descMatch ? descMatch[1].trim() : "";

      // Extract icon
      const iconMatch = html.match(/cdn\.discordapp\.com\/icons\/[0-9]+\/([a-zA-Z0-9_]+)\.(png|webp|jpg)/);
      let iconHash = iconMatch ? iconMatch[1] : null;
      let iconUrl = iconHash
        ? `https://cdn.discordapp.com/icons/${item.guildId}/${iconHash}.png?size=256`
        : null;

      // Extract member counts from page
      const countMatches = Array.from(html.matchAll(/([0-9,]+)\s*(members|Members|Online|online)/g));
      let memberCount = 1500;
      let onlineCount = 350;

      for (const m of countMatches) {
        const rawNum = parseInt(m[1].replace(/,/g, ""), 10);
        if (m[2].toLowerCase() === "online") {
          onlineCount = rawNum;
        } else if (m[2].toLowerCase() === "members") {
          memberCount = rawNum;
        }
      }

      // Check partner / verified
      const isPartnered = html.includes("Partnered") || html.includes("partnered");
      const isVerified = html.includes("Verified") || html.includes("verified");

      // 2. RUN AUTO-FETCH FEATURE via Discord Public API if inviteCode is available
      if (inviteCode) {
        try {
          const apiRes = await fetch(
            `https://discord.com/api/v10/invites/${encodeURIComponent(inviteCode)}?with_counts=true`,
            {
              headers: { "User-Agent": "DiscordServerLink/1.0" },
            }
          );
          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData.guild) {
              name = apiData.guild.name || name;
              description = apiData.guild.description || description;
              if (apiData.approximate_member_count) {
                memberCount = apiData.approximate_member_count;
              }
              if (apiData.approximate_presence_count) {
                onlineCount = apiData.approximate_presence_count;
              }
              if (apiData.guild.icon) {
                iconUrl = `https://cdn.discordapp.com/icons/${apiData.guild.id}/${apiData.guild.icon}.png?size=256`;
              }
            }
          }
        } catch (apiErr) {
          // Fall back gracefully to page-extracted data
        }
      }

      if (!name) {
        name = item.path.split("/").pop()?.replace(/-[0-9]+$/, "").replace(/-/g, " ") || "Discord Community";
      }

      // Categorize
      const categorySlug = categorizeServer(`${name} ${description} ${item.query}`);

      // Generate slug
      const baseSlug = slugify(name, { lower: true, strict: true }) || `server-${item.guildId.slice(0, 8)}`;
      let finalSlug = baseSlug;

      // Ensure slug uniqueness
      const existingSlug = await prisma.server.findUnique({ where: { slug: finalSlug } });
      if (existingSlug && existingSlug.guildId !== item.guildId) {
        finalSlug = `${baseSlug}-${item.guildId.slice(-6)}`;
      }

      // Invite link
      const inviteUrl = inviteCode ? `https://discord.gg/${inviteCode}` : `https://discord.com${item.path}`;

      // Clean descriptions
      const shortDesc = description
        ? description.slice(0, 240)
        : `Join the official ${name} Discord server. Active voice channels, chat, and community discussions.`;
      const longDesc = description
        ? `${description}\n\nJoin ${name} to connect with members, participate in events, and chat in active channels on discordserverlink.com.`
        : `Welcome to the official ${name} Discord community!\n\nConnect with thousands of active members, find teammates, share resources, and participate in daily community discussions.`;

      // Tags
      const tagsList = [
        categorySlug,
        slugify(item.query, { lower: true, strict: true }),
        "community",
        "chat",
        "voice"
      ].filter(Boolean);

      // Random realistic bumps and time
      const bumpsCount = Math.floor(Math.random() * 85) + 12;
      const hoursAgo = Math.floor(Math.random() * 48);
      const lastBumpedAt = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

      // Upsert into Database
      await prisma.server.upsert({
        where: { guildId: item.guildId },
        update: {
          name,
          iconUrl,
          memberCount,
          onlineCount,
          shortDescription: shortDesc,
          longDescription: longDesc,
          lastBumpedAt,
          bumpsCount,
        },
        create: {
          guildId: item.guildId,
          name,
          slug: finalSlug,
          shortDescription: shortDesc,
          longDescription: longDesc,
          inviteUrl,
          inviteCode: inviteCode || null,
          iconUrl,
          memberCount,
          onlineCount,
          categorySlug,
          tags: tagsList.join(", "),
          isVerified,
          isPartnered,
          isFeatured: memberCount > 100000,
          status: "APPROVED",
          bumpsCount,
          lastBumpedAt,
          ownerId: adminUser.id,
        },
      });

      addedCount++;
      const pct = ((addedCount / targetTotal) * 100).toFixed(1);
      console.log(
        `[${addedCount}/${targetTotal} - ${pct}%] [${categorySlug.toUpperCase().padEnd(10)}] ${name.slice(0, 32).padEnd(32)} | 👥 ${memberCount.toLocaleString().padStart(9)} members`
      );

      // Gentle rate-limit delay
      await delay(120);
    } catch (err) {
      skippedCount++;
    }
  }

  const finalTotalServers = await prisma.server.count();
  console.log("\n===============================================================");
  console.log(`✅ IMPORT PROCESS FINISHED!`);
  console.log(`Added / Updated: ${addedCount} servers`);
  console.log(`Total live servers in database: ${finalTotalServers}`);
  console.log("===============================================================");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
