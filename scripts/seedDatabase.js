const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

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
  // Always synchronize blog posts first so all 14 articles exist in PostgreSQL
  await syncBlogPosts();

  let serverCount = 0;
  try {
    serverCount = await prisma.server.count();
    console.log(`Current servers in database: ${serverCount}`);
  } catch (err) {
    console.log("Could not query server count:", err.message);
  }

  if (serverCount > 0) {
    console.log("Database already contains servers. Skipping seed.");
    return;
  }

  const dataFile = path.join(__dirname, "..", "prisma", "seed-data.json");
  if (!fs.existsSync(dataFile)) {
    console.log("No seed-data.json found. Skipping.");
    return;
  }

  console.log("Seeding database with initial dataset...");
  const data = JSON.parse(fs.readFileSync(dataFile, "utf-8"));

  // 1. Users
  if (data.users && data.users.length > 0) {
    for (const u of data.users) {
      try {
        await prisma.user.upsert({
          where: { id: u.id },
          create: u,
          update: u,
        });
      } catch (e) {}
    }
    console.log(`✓ Inserted ${data.users.length} users`);
  }

  // 2. Categories
  if (data.categories && data.categories.length > 0) {
    for (const c of data.categories) {
      try {
        await prisma.category.upsert({
          where: { id: c.id },
          create: c,
          update: c,
        });
      } catch (e) {}
    }
    console.log(`✓ Inserted ${data.categories.length} categories`);
  }

  // 3. Site Settings
  if (data.siteSettings && data.siteSettings.length > 0) {
    for (const s of data.siteSettings) {
      try {
        await prisma.siteSetting.upsert({
          where: { id: s.id },
          create: s,
          update: s,
        });
      } catch (e) {}
    }
    console.log(`✓ Inserted ${data.siteSettings.length} site settings`);
  }

  // 4. Video Items
  if (data.videoItems && data.videoItems.length > 0) {
    for (const v of data.videoItems) {
      try {
        await prisma.videoItem.upsert({
          where: { id: v.id },
          create: v,
          update: v,
        });
      } catch (e) {}
    }
  }

  // 5. Servers in batches of 100
  if (data.servers && data.servers.length > 0) {
    const BATCH_SIZE = 100;
    for (let i = 0; i < data.servers.length; i += BATCH_SIZE) {
      const chunk = data.servers.slice(i, i + BATCH_SIZE);
      try {
        await prisma.server.createMany({
          data: chunk,
          skipDuplicates: true,
        });
      } catch (batchErr) {
        // Fallback row-by-row
        for (const item of chunk) {
          try {
            await prisma.server.create({ data: item });
          } catch {}
        }
      }
    }
    console.log(`✓ Inserted ${data.servers.length} Discord servers`);
  }
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
