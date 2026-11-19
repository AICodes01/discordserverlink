import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Known aggressive crawlers and non-beneficial scrapers that consume massive bandwidth
const BLOCKED_BOT_KEYWORDS = [
  // Commercial SEO Scrapers (harvest directory data without sending search traffic)
  "ahrefsbot",
  "semrushbot",
  "mj12bot",
  "dotbot",
  "blexbot",
  "dataforseobot",
  "petalbot",
  "aspiegelbot",
  "zoominfobot",
  "megaindex",
  "seokicks",
  "serpstatbot",

  // Aggressive AI Training Scrapers
  "bytespider",
  "gptbot",
  "chatgpt-user",
  "claudebot",
  "anthropic-ai",
  "ccbot",
  "cohere-ai",
  "diffbot",
  "omgilibot",
  "omgili",
  "perplexitybot",
  "turnitinbot",
  "youbot",
  "imagesiftbot",
  "timpibot",
  "webzio",

  // Generic Scripted Scrapers & Scanners
  "python-requests",
  "go-http-client",
  "scrapy",
  "httpx",
  "masscan",
  "zgrab",
];

// Essential bots that MUST always be allowed (Search engines & Social link previews)
const ESSENTIAL_BOTS = [
  // Major Search Engines & Webmaster Verification Tools
  "googlebot",
  "google-inspectiontool",
  "mediapartners-google",
  "bingbot",
  "msnbot",
  "bingpreview",
  "duckduckbot",
  "yandex",
  "slurp",
  "baiduspider",
  "applebot",

  // Social Media Link Embeds & Unfurl Previews
  "discordbot",
  "twitterbot",
  "facebookexternalhit",
  "facebot",
  "whatsapp",
  "telegrambot",
  "linkedinbot",
  "slackbot",
  "pinterest",
  "skypeuripreview",

  // Cloudflare internal checks & proxies
  "cloudflare",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Always bypass authentication routes (OAuth callbacks must never be blocked)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();

  // 2. Allow essential search engine crawlers and social link embed scrapers
  const isEssentialBot = ESSENTIAL_BOTS.some((bot) => userAgent.includes(bot));
  if (isEssentialBot) {
    return NextResponse.next();
  }

  // 3. Reject aggressive commercial and AI scrapers before database query or page rendering
  if (userAgent) {
    for (const blocked of BLOCKED_BOT_KEYWORDS) {
      if (userAgent.includes(blocked)) {
        return new NextResponse("Access forbidden for automated scrapers.", {
          status: 403,
          headers: {
            "Content-Type": "text/plain",
            "Retry-After": "86400",
          },
        });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to all application routes, skipping static assets and manifests
    "/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|ads.txt|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
