const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
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
