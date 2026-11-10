const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=== VERCEL / NEXT.JS PRODUCTION BUILD ===");
const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.PRISMA_DATABASE_URL;

const schemaPath = path.join(__dirname, "..", "prisma", "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

if (dbUrl && (dbUrl.startsWith("postgres") || dbUrl.startsWith("prisma+postgres"))) {
  console.log("1. Cloud PostgreSQL detected. Ensuring postgresql provider in schema...");
  if (schema.includes('provider = "sqlite"')) {
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema, "utf-8");
  }
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
    execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
    console.log("2. Checking / populating database with initial dataset...");
    execSync("node scripts/seedDatabase.js", { stdio: "inherit" });
  } catch (err) {
    console.warn("Database sync warning (continuing build):", err.message);
  }
} else {
  console.log("Local SQLite detected (or no remote PostgreSQL). Ensuring sqlite provider in schema...");
  if (schema.includes('provider = "postgresql"')) {
    schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, schema, "utf-8");
  }
  try {
    execSync("npx prisma generate", { stdio: "inherit" });
  } catch (err) {
    console.warn("Prisma generate warning:", err.message);
  }
}

console.log("3. Executing next build...");
execSync("next build", { stdio: "inherit" });
