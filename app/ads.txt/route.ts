import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "ads_txt_code" },
    });

    const defaultAdsTxt = `# ads.txt for discordserverlink.com\n# Add your AdSense publisher ID in the Admin Dashboard > Ads & Monetization\ngoogle.com, pub-8893452174092183, DIRECT, f08c47fec0942fa0\n`;

    const content = setting?.value?.trim() || defaultAdsTxt;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    return new NextResponse("google.com, pub-8893452174092183, DIRECT, f08c47fec0942fa0\n", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
