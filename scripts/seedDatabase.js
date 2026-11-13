const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const prisma = new PrismaClient();

async function syncBlogPosts() {
  const blogFile = path.join(__dirname, "..", "lib", "blogData.json");
  if (!fs.existsSync(blogFile)) return;
  try {
    const blogPosts = JSON.parse(fs.readFileSync(blogFile, "utf-8"));
    if (blogPosts && blogPosts.length > 0) {
      console.log(`Synchronizing ${blogPosts.length} blog posts into database...`);
      for (const bp of blogPosts) {
        try {
          await prisma.blogPost.upsert({
            where: { slug: bp.slug },
            create: {
              slug: bp.slug,
              title: bp.title,
              excerpt: bp.excerpt,
              content: bp.content,
              featuredImage: bp.featuredImage || "/og-image.png",
              category: bp.category || "Discord Servers",
              author: bp.author || "DiscordServerLink Team",
              readingTime: bp.readingTime || "4 min read",
              published: bp.published ?? true,
              createdAt: bp.date ? new Date(bp.date) : new Date(),
              updatedAt: bp.modified ? new Date(bp.modified) : new Date(),
            },
            update: {
              content: bp.content,
              excerpt: bp.excerpt,
              title: bp.title,
              featuredImage: bp.featuredImage || "/og-image.png",
              category: bp.category || "Discord Servers",
              readingTime: bp.readingTime || "4 min read",
              published: bp.published ?? true,
            },
          });
        } catch (bpErr) {
          console.warn(`Error upserting post ${bp.slug}:`, bpErr.message);
        }
      }
      console.log(`✓ Synchronized ${blogPosts.length} cleaned blog posts`);
    }
  } catch (err) {
    console.warn("Could not seed blog posts:", err.message);
  }
}

async function main() {
  // 1. Synchronize blog posts
  await syncBlogPosts();

  // 2. Ensure default root admin user exists
  try {
    await prisma.user.upsert({
      where: { email: "admin@discordserverlink.com" },
      create: {
        id: "cmvqr9ryj0000m12nbl63i1cg",
        email: "admin@discordserverlink.com",
        name: "Chief Admin",
        role: "ADMIN",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      },
      update: {},
    });
  } catch (e) {
    console.warn("Root admin user upsert warning:", e.message);
  }

  // 3. Ensure Category records exist
  const dataFile = path.join(__dirname, "..", "prisma", "seed-data.json");
  if (fs.existsSync(dataFile)) {
    try {
      const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));
      if (data.categories && data.categories.length > 0) {
        for (const c of data.categories) {
          try {
            await prisma.category.upsert({
              where: { id: c.id },
              create: c,
              update: c,
            });
          } catch {}
        }
        console.log(`✓ Verified ${data.categories.length} categories`);
      }
      if (data.siteSettings && data.siteSettings.length > 0) {
        for (const s of data.siteSettings) {
          try {
            await prisma.siteSetting.upsert({
              where: { id: s.id },
              create: s,
              update: s,
            });
          } catch {}
        }
      }
    } catch (e) {}
  }

  // 4. Check current server count
  let serverCount = 0;
  try {
    serverCount = await prisma.server.count();
    console.log(`Current servers in database: ${serverCount}`);
  } catch (err) {
    console.log("Could not query server count:", err.message);
  }

  // If already contains the full dataset (30,000+ servers), skip re-seeding
  if (serverCount >= 30000) {
    console.log(`Database already has full 31k dataset (${serverCount} servers). Skipping seed.`);
    return;
  }

  const gzPath = path.join(__dirname, "..", "prisma", "servers-31k.json.gz");
  if (!fs.existsSync(gzPath)) {
    console.log("No servers-31k.json.gz found. Skipping server import.");
    return;
  }

  console.log(`\n=== IMPORTING 31,209 DISCORD SERVERS ===`);
  console.log(`Replacing ${serverCount} outdated servers with fresh 31,209 dataset...`);

  // Remove old servers and related cascading records
  try {
    await prisma.bump.deleteMany();
    await prisma.review.deleteMany();
    await prisma.promotionRequest.deleteMany();
    await prisma.server.deleteMany();
    console.log("✓ Previous servers removed cleanly from database.");
  } catch (delErr) {
    console.warn("Delete warning:", delErr.message);
  }

  // Decompress and parse
  console.log("Decompressing servers-31k.json.gz...");
  const gzBuffer = fs.readFileSync(gzPath);
  const jsonStr = zlib.gunzipSync(gzBuffer).toString("utf-8");
  const rawServers = JSON.parse(jsonStr);
  console.log(`Decompressed ${rawServers.length} servers. Formatting dates...`);

  const servers = rawServers.map((s) => ({
    id: s.id,
    guildId: s.guildId || null,
    name: s.name,
    slug: s.slug,
    shortDescription: s.shortDescription || "",
    longDescription: s.longDescription || s.shortDescription || "",
    inviteUrl: s.inviteUrl,
    inviteCode: s.inviteCode || null,
    iconUrl: s.iconUrl || null,
    bannerUrl: s.bannerUrl || null,
    memberCount: typeof s.memberCount === "number" ? s.memberCount : 0,
    onlineCount: typeof s.onlineCount === "number" ? s.onlineCount : 0,
    categorySlug: s.categorySlug || "community",
    tags: s.tags || "",
    language: s.language || "en",
    isNsfw: Boolean(s.isNsfw),
    isFeatured: Boolean(s.isFeatured),
    isVerified: Boolean(s.isVerified),
    isPartnered: Boolean(s.isPartnered),
    status: s.status || "APPROVED",
    reviewReason: s.reviewReason || null,
    bumpsCount: typeof s.bumpsCount === "number" ? s.bumpsCount : 0,
    viewsCount: typeof s.viewsCount === "number" ? s.viewsCount : 0,
    joinsCount: typeof s.joinsCount === "number" ? s.joinsCount : 0,
    ownerId: s.ownerId || "cmvqr9ryj0000m12nbl63i1cg",
    lastBumpedAt: s.lastBumpedAt ? new Date(s.lastBumpedAt) : new Date(),
    createdAt: s.createdAt ? new Date(s.createdAt) : new Date(),
    updatedAt: s.updatedAt ? new Date(s.updatedAt) : new Date(),
  }));

  const BATCH_SIZE = 500;
  console.log(`Inserting ${servers.length} servers in batches of ${BATCH_SIZE}...`);
  const startTime = Date.now();

  for (let i = 0; i < servers.length; i += BATCH_SIZE) {
    const chunk = servers.slice(i, i + BATCH_SIZE);
    try {
      await prisma.server.createMany({
        data: chunk,
        skipDuplicates: true,
      });
    } catch (batchErr) {
      console.warn(`Batch ${i} error, falling back:`, batchErr.message);
      for (const item of chunk) {
        try {
          await prisma.server.create({ data: item });
        } catch {}
      }
    }

    const currentCount = Math.min(i + BATCH_SIZE, servers.length);
    if (currentCount % 5000 === 0 || currentCount === servers.length) {
      console.log(`✓ Inserted ${currentCount} / ${servers.length} servers...`);
    }
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✓ 31,209 servers successfully imported into database in ${duration}s!`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
