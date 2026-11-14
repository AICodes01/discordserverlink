const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  const pubSnippet = "google.com, pub-7551201031226261, DIRECT, f08c47fec0942fa0";
  const clientId = "ca-pub-7551201031226261";
  const headScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7551201031226261" crossorigin="anonymous"></script>`;

  await prisma.siteSetting.upsert({
    where: { key: "ads_txt_code" },
    create: { key: "ads_txt_code", value: pubSnippet },
    update: { value: pubSnippet },
  });

  await prisma.siteSetting.upsert({
    where: { key: "adsense_client_id" },
    create: { key: "adsense_client_id", value: clientId },
    update: { value: clientId },
  });

  await prisma.siteSetting.upsert({
    where: { key: "head_code" },
    create: { key: "head_code", value: headScript },
    update: { value: headScript },
  });

  console.log("✓ Updated dev.db with publisher ID pub-7551201031226261");

  // Also sync seed-data.json
  const seedFile = path.join(__dirname, "..", "prisma", "seed-data.json");
  if (fs.existsSync(seedFile)) {
    const seed = JSON.parse(fs.readFileSync(seedFile, "utf-8"));
    if (seed.siteSettings) {
      for (const s of seed.siteSettings) {
        if (s.key === "ads_txt_code") s.value = pubSnippet;
        if (s.key === "adsense_client_id") s.value = clientId;
        if (s.key === "head_code") s.value = headScript;
      }
      fs.writeFileSync(seedFile, JSON.stringify(seed, null, 2));
      console.log("✓ Updated prisma/seed-data.json with publisher ID pub-7551201031226261");
    }
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
