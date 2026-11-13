import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const parseHost = (str?: string) => {
    if (!str) return "NOT_SET";
    try {
      const u = new URL(str.replace("prisma+", ""));
      return { host: u.host, path: u.pathname, protocol: u.protocol };
    } catch {
      return "INVALID_URL";
    }
  };

  let dbStatus = "UNKNOWN";
  let dbError = null;
  let userCount = 0;

  try {
    userCount = await prisma.user.count();
    dbStatus = "CONNECTED";
  } catch (err: any) {
    dbStatus = "FAILED";
    dbError = err.message;
  }

  return NextResponse.json({
    dbStatus,
    dbError,
    userCount,
    DATABASE_URL: parseHost(process.env.DATABASE_URL),
    POSTGRES_URL: parseHost(process.env.POSTGRES_URL),
    PRISMA_DATABASE_URL: parseHost(process.env.PRISMA_DATABASE_URL),
    POSTGRES_PRISMA_URL: parseHost(process.env.POSTGRES_PRISMA_URL),
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
