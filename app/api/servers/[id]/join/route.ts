import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await prisma.server.update({
      where: { id },
      data: { joinsCount: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const server = await prisma.server.update({
      where: { id },
      data: { joinsCount: { increment: 1 } },
      select: { inviteUrl: true },
    });

    if (server?.inviteUrl) {
      return NextResponse.redirect(server.inviteUrl, { status: 302 });
    }

    return NextResponse.redirect(new URL("/", req.url));
  } catch (err: any) {
    return NextResponse.redirect(new URL("/", req.url));
  }
}
