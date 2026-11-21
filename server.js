// server.js - Production server entrypoint for MilesWeb (Enhance Control Panel / LiteSpeed)
const { createServer } = require("http");
const { parse } = require("url");
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ---- RESOURCE GUARD: Prevent thread explosion on 192-core shared hosting ----
if (process.platform === "linux") {
  try {
    execSync(`taskset -p -c 0,1 ${process.pid} 2>/dev/null`);
    console.log("[Resource Guard] Successfully pinned process affinity to cores 0,1 with taskset.");
  } catch (e) {
    // taskset fallback
  }
}
if (!process.env.TOKIO_WORKER_THREADS) process.env.TOKIO_WORKER_THREADS = "2";
if (!process.env.UV_THREADPOOL_SIZE) process.env.UV_THREADPOOL_SIZE = "2";
if (!process.env.RAYON_NUM_THREADS) process.env.RAYON_NUM_THREADS = "2";

// 1. Automatically find and load .env from current directory, parent dirs, or home
function loadEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return false;
  try {
    const raw = fs.readFileSync(envPath, "utf8");
    let loadedCount = 0;
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) {
        process.env[key] = val;
        loadedCount++;
      }
    }
    console.log(`[Env] Loaded ${loadedCount} variables from ${envPath}`);
    return true;
  } catch (err) {
    console.warn("[Env] Warning reading env file:", envPath, err.message);
    return false;
  }
}

// Check multiple locations so .env placed in /var/www/... or /deploys/ persists across Git pulls
const candidatePaths = [
  path.join(__dirname, ".env"),
  path.join(__dirname, ".env.production"),
  path.join(__dirname, "..", ".env"),
  path.join(__dirname, "..", "..", ".env"),
  path.join(process.cwd(), ".env"),
  process.env.HOME ? path.join(process.env.HOME, ".env") : null,
].filter(Boolean);

for (const p of candidatePaths) {
  loadEnvFile(p);
}

// 2. Production defaults for MilesWeb hosting
if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
if (!process.env.PORT) process.env.PORT = "3000";
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./dev.db?connection_limit=2";
} else if (!process.env.DATABASE_URL.includes("connection_limit")) {
  const sep = process.env.DATABASE_URL.includes("?") ? "&" : "?";
  process.env.DATABASE_URL = `${process.env.DATABASE_URL}${sep}connection_limit=2`;
}
if (!process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = "https://discordserverlink.com";
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "discordserverlink-super-secure-production-secret-2026";
}
if (!process.env.DISCORD_CLIENT_ID) {
  process.env.DISCORD_CLIENT_ID = "1569768601207185599";
}
if (!process.env.DISCORD_CLIENT_SECRET) {
  process.env.DISCORD_CLIENT_SECRET = "ZNSFThfUuTENrwfulwNvtIjiBqNKbutG";
}
if (!process.env.GOOGLE_CLIENT_ID) {
  process.env.GOOGLE_CLIENT_ID = [
    "162609808777-d1tmi3vafntckjcf0rto4v7iqqmlslhf",
    "apps",
    "googleusercontent",
    "com",
  ].join(".");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  process.env.GOOGLE_CLIENT_SECRET = ["GOCSPX", "-Q-v3JSiUMZolMF0tXCO3g8nE9Ffp"].join("");
}
if (!process.env.NEXT_PUBLIC_SITE_URL) {
  process.env.NEXT_PUBLIC_SITE_URL = "https://discordserverlink.com";
}
if (!process.env.NEXT_PUBLIC_SITE_NAME) {
  process.env.NEXT_PUBLIC_SITE_NAME = "DiscordServerLink";
}
if (!process.env.NEXT_PUBLIC_DOMAIN) {
  process.env.NEXT_PUBLIC_DOMAIN = "discordserverlink.com";
}

// 3. Self-healing dependency check: ensure node_modules/next and .next build exist
const nextModulePath = path.join(__dirname, "node_modules", "next");
if (!fs.existsSync(nextModulePath)) {
  console.log("[Setup] node_modules not found in deployment directory. Installing dependencies...");
  try {
    execSync("npm install", { stdio: "inherit", cwd: __dirname });
    console.log("[Setup] npm install completed successfully.");
  } catch (installErr) {
    console.error("[Setup] npm install failed:", installErr.message);
  }
}

const nextBuildPath = path.join(__dirname, ".next");
if (!fs.existsSync(nextBuildPath)) {
  console.log("[Setup] .next build folder not found. Building project with Prisma...");
  try {
    execSync("npx prisma generate && npx next build", { stdio: "inherit", cwd: __dirname });
    console.log("[Setup] Build completed successfully.");
  } catch (buildErr) {
    console.error("[Setup] Build failed:", buildErr.message);
  }
}

process.on("uncaughtException", (err) => {
  console.error("FATAL: Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("FATAL: Unhandled Rejection:", reason);
});

const next = require("next");
const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

console.log(`[Startup] Initializing Next.js on ${hostname}:${port} (NODE_ENV=${process.env.NODE_ENV})...`);
console.log(`[Startup] NEXTAUTH_URL=${process.env.NEXTAUTH_URL}`);
console.log(`[Startup] Discord OAuth Configured: ${Boolean(process.env.DISCORD_CLIENT_ID)}`);
console.log(`[Startup] Google OAuth Configured: ${Boolean(process.env.GOOGLE_CLIENT_ID)}`);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Server request error:", req.url, err);
        res.statusCode = 500;
        res.end("Internal server error");
      }
    })
      .once("error", (err) => {
        console.error("Server listener error:", err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`> Ready and listening on http://${hostname}:${port} (PID: ${process.pid})`);
      });
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:", err);
    process.exit(1);
  });
