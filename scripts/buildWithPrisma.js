const { execSync } = require("child_process");

console.log("=== VERCEL / NEXT.JS PRODUCTION BUILD ===");
const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.PRISMA_DATABASE_URL;

if (dbUrl && (dbUrl.startsWith("postgres") || dbUrl.startsWith("prisma+postgres"))) {
  console.log("1. Cloud PostgreSQL detected. Syncing schema tables...");
  try {
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("2. Checking / populating database with initial dataset...");
    execSync("node scripts/seedDatabase.js", { stdio: "inherit" });
  } catch (err) {
    console.warn("Database sync warning (continuing build):", err.message);
  }
} else {
  console.log("No PostgreSQL detected. Proceeding directly to Next.js build.");
}

console.log("3. Executing next build...");
execSync("next build", { stdio: "inherit" });
