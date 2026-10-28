import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);

    const server = await prisma.server.findUnique({
      where: { id },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Get bump cooldown setting (default 2 hours)
    const cooldownSetting = await prisma.siteSetting.findUnique({
      where: { key: "bump_cooldown_hours" },
    });
    const cooldownHours = parseFloat(cooldownSetting?.value || "2");
    const cooldownMs = cooldownHours * 60 * 60 * 1000;

    const lastBump = new Date(server.lastBumpedAt).getTime();
    const now = Date.now();
    const timeSinceLastBump = now - lastBump;

    if (timeSinceLastBump < cooldownMs) {
      const remainingMs = cooldownMs - timeSinceLastBump;
      const remainingMins = Math.ceil(remainingMs / (60 * 1000));
      return NextResponse.json(
        {
          error: `Server was bumped recently. Please wait ${remainingMins} more minute(s) before bumping again.`,
          remainingMs,
        },
        { status: 429 }
      );
    }

    const userId = (session?.user as any)?.id || null;

    // Perform bump
    const updatedServer = await prisma.$transaction(async (tx) => {
      await tx.bump.create({
        data: {
          serverId: server.id,
          userId,
        },
      });

      return await tx.server.update({
        where: { id: server.id },
        data: {
          bumpsCount: { increment: 1 },
          lastBumpedAt: new Date(),
        },
        select: {
          id: true,
          bumpsCount: true,
          lastBumpedAt: true,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Server successfully bumped to the top!",
      server: updatedServer,
      cooldownMs,
    });
  } catch (error: any) {
    console.error("Bump error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to bump server" },
      { status: 500 }
    );
  }
}
