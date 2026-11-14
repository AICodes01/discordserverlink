import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

const DEFAULT_ADS_TXT = `google.com, pub-7551201031226261, DIRECT, f08c47fec0942fa0\n`;

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "ads_txt_code" },
    });

    const content = setting?.value?.trim() || DEFAULT_ADS_TXT;

    return new NextResponse(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    });
  } catch (error) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const seed = require("@/prisma/seed-data.json");
      const setting = (seed.siteSettings || []).find((s: any) => s.key === "ads_txt_code");
      const content = setting?.value?.trim() || DEFAULT_ADS_TXT;
      return new NextResponse(content, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    } catch {
      return new NextResponse(DEFAULT_ADS_TXT, {
        status: 200,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
        },
      });
    }
  }
}
