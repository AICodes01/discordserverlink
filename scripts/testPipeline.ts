import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function testPipeline() {
  console.log("Testing discovery & auto-fetching pipeline...");
  const admin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (!admin) {
    console.error("Admin not found");
    return;
  }

  // 1. Fetch query
  const res = await fetch("https://discord.com/servers?query=valorant", {
    headers: { "User-Agent": USER_AGENT },
  });
  console.log("Discovery status:", res.status);
  const text = await res.text();

  const paths = Array.from(text.matchAll(/\/servers\/([a-zA-Z0-9_\-\.]+)-([0-9]{15,22})/g));
  console.log("Found server paths:", paths.length);

  const sample = paths.slice(0, 3);
  for (const match of sample) {
    const fullPath = match[0];
    const slugName = match[1];
    const guildId = match[2];
    console.log(`\nAuto-fetching server: ${guildId} (${slugName})...`);

    // Fetch server discovery page
    const pageRes = await fetch(`https://discord.com${fullPath}`, {
      headers: { "User-Agent": USER_AGENT },
    });
    console.log("Page res status:", pageRes.status);
    const pageHtml = await pageRes.text();

    const inviteMatch = pageHtml.match(/discord\.gg\/([a-zA-Z0-9_\-]+)/);
    const inviteCode = inviteMatch ? inviteMatch[1] : null;

    const titleMatch = pageHtml.match(/<h1[^>]*>(.*?)<\/h1>/);
    let name = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, "").replace(/\u2060/g, "").trim()
      : slugName.replace(/-/g, " ");

    const descMatch = pageHtml.match(/name="description" content="(.*?)"/);
    const description = descMatch ? descMatch[1].trim() : "";

    const countMatches = Array.from(pageHtml.matchAll(/([0-9,]+)\s*(members|Members|Online|online)/g));
    let memberCount = 1000;
    let onlineCount = 200;
    for (const m of countMatches) {
      const num = parseInt(m[1].replace(/,/g, ""), 10);
      if (m[2].toLowerCase() === "online") onlineCount = num;
      if (m[2].toLowerCase() === "members") memberCount = num;
    }

    const iconMatch = pageHtml.match(/cdn\.discordapp\.com\/icons\/[0-9]+\/([a-zA-Z0-9_]+)\.(png|webp|jpg)/);
    const iconUrl = iconMatch
      ? `https://cdn.discordapp.com/icons/${guildId}/${iconMatch[1]}.png?size=256`
      : null;

    console.log("Extracted:", {
      name,
      guildId,
      inviteCode,
      memberCount,
      onlineCount,
      iconUrl,
    });

    // Save to database
    const slug = `${slugify(name, { lower: true, strict: true })}-${guildId.slice(-6)}`;
    await prisma.server.upsert({
      where: { guildId },
      update: { memberCount, onlineCount, name },
      create: {
        guildId,
        name,
        slug,
        shortDescription: description.slice(0, 240) || `Join ${name} Discord server!`,
        longDescription: description || `Welcome to ${name} Discord server.`,
        inviteUrl: inviteCode ? `https://discord.gg/${inviteCode}` : `https://discord.com${fullPath}`,
        inviteCode,
        iconUrl,
        memberCount,
        onlineCount,
        categorySlug: "gaming",
        tags: "gaming, valorant, community",
        status: "APPROVED",
        ownerId: admin.id,
      },
    });
    console.log("Upserted successfully!");
  }
}

testPipeline()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
