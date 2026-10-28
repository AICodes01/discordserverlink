import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const server = await prisma.server.update({
      where: { id },
      data: {
        joinsCount: { increment: 1 },
      },
      select: {
        inviteUrl: true,
      },
    });

    return NextResponse.json({
      success: true,
      inviteUrl: server.inviteUrl,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server not found" },
      { status: 404 }
    );
  }
}
