const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("Reading data from local SQLite database...");
  const [users, categories, siteSettings, videoItems, sampleServers] =
    await Promise.all([
      prisma.user.findMany(),
      prisma.category.findMany(),
      prisma.siteSetting.findMany(),
      prisma.videoItem.findMany(),
      prisma.server.findMany({ take: 50 }),
    ]);

  const payload = {
    users,
    categories,
    siteSettings,
    videoItems,
    servers: sampleServers,
  };

  const outputPath = path.join(__dirname, "..", "prisma", "seed-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(payload, null, 2));
  const stats = fs.statSync(outputPath);

  console.log("✅ Successfully exported compact seed-data.json!");
  console.log(`   - File size: ${(stats.size / 1024).toFixed(2)} KB`);
  console.log(`   - Sample Servers: ${sampleServers.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Users: ${users.length}`);
  console.log(`   - Site Settings: ${siteSettings.length}`);
}

main()
  .catch((e) => {
    console.error("Export error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
