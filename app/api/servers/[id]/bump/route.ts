import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { findFallbackServer, bumpFallbackServer } from "@/lib/fallbackServers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id || null;

    // 1. Try finding server in DB, then fallback to in-memory 31k dataset
    let server: any = null;
    try {
      server = await prisma.server.findUnique({
        where: { id },
      });
    } catch (e) {
      // Remote DB offline / unreachable
    }

    if (!server) {
      server = findFallbackServer(id);
    }

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // 2. Get bump cooldown setting (default 2 hours)
    let cooldownHours = 2;
    try {
      const cooldownSetting = await prisma.siteSetting.findUnique({
        where: { key: "bump_cooldown_hours" },
      });
      if (cooldownSetting?.value) {
        cooldownHours = parseFloat(cooldownSetting.value) || 2;
      }
    } catch {}

    const cooldownMs = cooldownHours * 60 * 60 * 1000;
    const lastBump = server.lastBumpedAt ? new Date(server.lastBumpedAt).getTime() : 0;
    const now = Date.now();
    const timeSinceLastBump = now - lastBump;

    // Enforce cooldown interval
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

    // 3. Perform bump in database if reachable
    let updatedServer: any = null;
    try {
      updatedServer = await prisma.$transaction(async (tx) => {
        if (userId) {
          try {
            await tx.bump.create({
              data: {
                serverId: server.id,
                userId,
              },
            });
          } catch {}
        }

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
    } catch (dbErr) {
      console.warn("Database write skipped during bump (using in-memory state):", dbErr);
    }

    // 4. Update in-memory fallback dataset so server instantly ranks #1
    const bumpedFallback = bumpFallbackServer(server.id);

    const finalServer = updatedServer || {
      id: server.id,
      bumpsCount: bumpedFallback?.bumpsCount || (server.bumpsCount || 0) + 1,
      lastBumpedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      message: "Server successfully bumped to the top!",
      server: finalServer,
      cooldownMs,
    });
  } catch (error: any) {
    console.error("Bump error:", error);
    return NextResponse.json(
      { error: "Unable to bump server at this moment. Please try again shortly." },
      { status: 500 }
    );
  }
}
