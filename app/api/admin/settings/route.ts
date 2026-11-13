import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany();
    const map = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json({ settings: map, raw: settings });
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
