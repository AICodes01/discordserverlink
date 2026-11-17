// server.js - Production server entrypoint for MilesWeb / cPanel Node.js (Phusion Passenger)
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
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
    .listen(port, () => {
      console.log(`> Ready on port ${port} (PID: ${process.pid})`);
    });
});
