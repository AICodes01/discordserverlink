import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { findFallbackServer } from "@/lib/fallbackServers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    try {
      await prisma.server.update({
        where: { id },
        data: { joinsCount: { increment: 1 } },
      });
    } catch {}
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const server = await prisma.server.update({
      where: { id },
      data: { joinsCount: { increment: 1 } },
      select: { inviteUrl: true },
    });

    if (server?.inviteUrl) {
      return NextResponse.redirect(server.inviteUrl, { status: 302 });
    }
  } catch (err: any) {
    // Database unavailable, resolve from fallback dataset
    const fb = findFallbackServer(id);
    if (fb?.inviteUrl) {
      return NextResponse.redirect(fb.inviteUrl, { status: 302 });
    }
  }

  return NextResponse.redirect(new URL("/", req.url));
}
