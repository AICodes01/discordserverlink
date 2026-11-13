import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SITE_URL } from "@/lib/seo";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const sitemapUrl = `${SITE_URL}/sitemap.xml`;
    const results: Record<string, string> = {};

    // Ping Google
    try {
      const googleRes = await fetch(
        `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        { method: "GET" }
      );
      results.google = googleRes.status === 200 ? "Success (HTTP 200)" : `Status ${googleRes.status}`;
    } catch (e: any) {
      results.google = `Failed: ${e.message}`;
    }

    // Ping Bing
    try {
      const bingRes = await fetch(
        `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`,
        { method: "GET" }
      );
      results.bing = bingRes.status === 200 ? "Success (HTTP 200)" : `Status ${bingRes.status}`;
    } catch (e: any) {
      results.bing = `Failed: ${e.message}`;
    }

    return NextResponse.json({
      success: true,
      sitemapUrl,
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
