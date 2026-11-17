// server.js - Production server entrypoint for MilesWeb (Enhance Control Panel / LiteSpeed)
const { createServer } = require("http");
const { parse } = require("url");

// 1. Fallback environment variables if not provided by host
if (!process.env.NODE_ENV) process.env.NODE_ENV = "production";
if (!process.env.PORT) process.env.PORT = "3000";
if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "file:./dev.db";
if (!process.env.NEXTAUTH_URL) process.env.NEXTAUTH_URL = "https://discordserverlink.com";
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = "discordserverlink-super-secure-production-secret-2026";
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

console.log(`[Startup] Initializing Next.js app on ${hostname}:${port} (NODE_ENV=${process.env.NODE_ENV})...`);

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
