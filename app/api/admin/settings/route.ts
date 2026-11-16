import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import seedData from "@/prisma/seed-data.json";

// In-memory runtime settings cache for resilient fallback
const inMemorySettings: Record<string, string> = {};

export async function GET() {
  try {
    let map: Record<string, string> = {};
    try {
      const settings = await prisma.siteSetting.findMany();
      if (settings && settings.length > 0) {
        map = settings.reduce((acc, curr) => {
          acc[curr.key] = curr.value;
          return acc;
        }, {} as Record<string, string>);
      }
    } catch (dbErr) {
      console.warn("DB siteSetting.findMany failed, using fallback:", dbErr);
    }

    // Merge seed data defaults and runtime updates
    if (seedData.siteSettings) {
      for (const s of seedData.siteSettings) {
        if (!map[s.key]) {
          map[s.key] = s.value;
        }
      }
    }

    Object.assign(map, inMemorySettings);

    return NextResponse.json({ settings: map });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { settings } = await req.json();

    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "Invalid settings payload" }, { status: 400 });
    }

    // Update in-memory settings
    for (const [key, value] of Object.entries(settings)) {
      inMemorySettings[key] = String(value);
    }

    // Persist to database if reachable
    try {
      for (const [key, value] of Object.entries(settings)) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: {
            key,
            value: String(value),
          },
        });
      }
    } catch (dbErr) {
      console.warn("Prisma siteSetting.upsert warning (saved to in-memory cache):", dbErr);
    }

    // Revalidate modified routes so changes show immediately
    const pathsToRevalidate = [
      "/",
      "/servers",
      "/categories",
      "/bots",
      "/emojis",
      "/tools",
      "/tools/discord-pfp-viewer",
      "/tools/fancy-fonts",
      "/tools/invite-checker",
      "/tools/markdown-color-text",
      "/tools/permissions-calculator",
      "/tools/snowflake-timestamp",
      "/tools/webhook-sender",
      "/sitemap.xml",
    ];

    for (const p of pathsToRevalidate) {
      try {
        revalidatePath(p);
      } catch (err) {
        // safe ignore
      }
    }

    return NextResponse.json({ success: true, message: "Settings saved and cache revalidated" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
