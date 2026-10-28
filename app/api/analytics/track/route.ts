import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { path, title, referrer } = body;

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    // Do not track internal admin/api routes
    if (path.startsWith("/admin") || path.startsWith("/api") || path.startsWith("/_next")) {
      return NextResponse.json({ skipped: true });
    }

    const userAgent = req.headers.get("user-agent") || "";
    let device = "desktop";
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      device = "tablet";
    } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) {
      device = "mobile";
    }

    await prisma.pageView.create({
      data: {
        path: path.slice(0, 255),
        title: title ? String(title).slice(0, 255) : null,
        referrer: referrer ? String(referrer).slice(0, 255) : null,
        userAgent: userAgent.slice(0, 255),
        device,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    // Fail gracefully so client is never disrupted
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
