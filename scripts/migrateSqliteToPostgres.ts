import { PrismaClient as SqliteClient } from "@prisma/client";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Migration utility to transfer all 5,306 servers, categories, settings,
 * users, and videos from local SQLite into Cloud PostgreSQL (Vercel Postgres / Neon).
 */
async function main() {
  const targetPostgresUrl = process.env.TARGET_DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL;

  if (!targetPostgresUrl || !targetPostgresUrl.startsWith("postgres")) {
    console.error("❌ Error: TARGET_DATABASE_URL must be a valid PostgreSQL connection string.");
    console.error("Example: TARGET_DATABASE_URL=\"postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require\" npx tsx scripts/migrateSqliteToPostgres.ts");
    process.exit(1);
  }

  console.log("==================================================");
  console.log("🚀 MIGRATING DISCORDSERVERLINK TO POSTGRESQL");
  console.log("==================================================");

  // 1. Read all data from local SQLite database
  const sqlitePrisma = new SqliteClient();
  console.log("1. Reading data from local SQLite database...");

  const [users, categories, servers, siteSettings, videoItems] = await Promise.all([
    sqlitePrisma.user.findMany(),
    sqlitePrisma.category.findMany(),
    sqlitePrisma.server.findMany(),
    sqlitePrisma.siteSetting.findMany(),
    sqlitePrisma.videoItem.findMany(),
  ]);

  console.log(`   - Users: ${users.length}`);
  console.log(`   - Categories: ${categories.length}`);
  console.log(`   - Servers: ${servers.length}`);
  console.log(`   - Site Settings: ${siteSettings.length}`);
  console.log(`   - Video Guides: ${videoItems.length}`);

  await sqlitePrisma.$disconnect();

  // 2. Temporarily switch schema to PostgreSQL to push schema & insert data
  console.log("\n2. Pushing schema to Cloud PostgreSQL database...");
  const schemaPath = path.join(process.cwd(), "prisma", "schema.prisma");
  const originalSchema = fs.readFileSync(schemaPath, "utf-8");

  const postgresSchema = originalSchema.replace(
    'provider = "sqlite"',
    'provider = "postgresql"'
  );
  fs.writeFileSync(schemaPath, postgresSchema, "utf-8");

  try {
    // Push tables to PostgreSQL
    execSync(`npx prisma db push --skip-generate --accept-data-loss`, {
      env: { ...process.env, DATABASE_URL: targetPostgresUrl },
      stdio: "inherit",
    });

    // Generate Postgres client
    execSync(`npx prisma generate`, {
      env: { ...process.env, DATABASE_URL: targetPostgresUrl },
      stdio: "inherit",
    });

    // Dynamic import fresh PrismaClient configured for Postgres
    const { PrismaClient: PostgresClient } = await import("@prisma/client");
    const pgPrisma = new PostgresClient({
      datasources: { db: { url: targetPostgresUrl } },
    });

    console.log("\n3. Inserting data into Cloud PostgreSQL...");

    // Insert Users
    if (users.length > 0) {
      console.log(`   Inserting ${users.length} users...`);
      for (const u of users) {
        await pgPrisma.user.upsert({
          where: { id: u.id },
          create: u,
          update: u,
        });
      }
    }

    // Insert Categories
    if (categories.length > 0) {
      console.log(`   Inserting ${categories.length} categories...`);
      for (const c of categories) {
        await pgPrisma.category.upsert({
          where: { id: c.id },
          create: c,
          update: c,
        });
      }
    }

    // Insert Site Settings
    if (siteSettings.length > 0) {
      console.log(`   Inserting ${siteSettings.length} site settings...`);
      for (const s of siteSettings) {
        await pgPrisma.siteSetting.upsert({
          where: { id: s.id },
          create: s,
          update: s,
        });
      }
    }

    // Insert Videos
    if (videoItems.length > 0) {
      console.log(`   Inserting ${videoItems.length} videos...`);
      for (const v of videoItems) {
        await pgPrisma.videoItem.upsert({
          where: { id: v.id },
          create: v,
          update: v,
        });
      }
    }

    // Batch insert servers
    console.log(`   Inserting ${servers.length} Discord servers in batches of 100...`);
    const BATCH_SIZE = 100;
    let insertedServers = 0;

    for (let i = 0; i < servers.length; i += BATCH_SIZE) {
      const chunk = servers.slice(i, i + BATCH_SIZE);
      await pgPrisma.server.createMany({
        data: chunk,
        skipDuplicates: true,
      });
      insertedServers += chunk.length;
      process.stdout.write(`\r   Progress: ${insertedServers}/${servers.length} servers transferred`);
    }

    const finalPgCount = await pgPrisma.server.count();
    console.log(`\n\n🎉 MIGRATION COMPLETE! Total servers in Cloud PostgreSQL: ${finalPgCount}`);

    await pgPrisma.$disconnect();
  } finally {
    // Restore schema.prisma
    fs.writeFileSync(schemaPath, originalSchema, "utf-8");
  }
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
