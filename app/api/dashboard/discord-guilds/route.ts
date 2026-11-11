import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        discordId: true,
        discordAccessToken: true,
        email: true,
      },
    });

    const accessToken =
      (session.user as any)?.accessToken || user?.discordAccessToken;

    if (!accessToken) {
      // Demo fallback if testing with demo credentials
      if (user?.email === "demo@discordserverlink.com") {
        const demoGuilds = [
          {
            id: "1098765432109876543",
            name: "Cyberpunk 2077 Hangout",
            iconUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=150&auto=format&fit=crop&q=80",
            isOwner: true,
            canManage: true,
            isListed: false,
            listedServer: null,
          },
          {
            id: "1098765432109876544",
            name: "Indie Game Developers Hub",
            iconUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=150&auto=format&fit=crop&q=80",
            isOwner: false,
            canManage: true,
            isListed: false,
            listedServer: null,
          },
        ];
        return NextResponse.json({ guilds: demoGuilds, isDemo: true });
      }

      return NextResponse.json({
        guilds: [],
        error: "NO_DISCORD_TOKEN",
        message:
          "Connect with Discord to automatically sync and list your Discord servers.",
      });
    }

    // Fetch user guilds from Discord API
    const discordRes = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      next: { revalidate: 30 },
    });

    if (discordRes.status === 401) {
      return NextResponse.json({
        guilds: [],
        error: "TOKEN_EXPIRED",
        message: "Discord session expired. Please sign out and sign in again.",
      });
    }

    if (!discordRes.ok) {
      const errText = await discordRes.text();
      console.warn("Discord API guilds fetch failed:", errText);
      return NextResponse.json(
        { guilds: [], error: "DISCORD_API_ERROR", message: "Failed to fetch servers from Discord." },
        { status: 502 }
      );
    }

    const rawGuilds = await discordRes.json();

    if (!Array.isArray(rawGuilds)) {
      return NextResponse.json({ guilds: [] });
    }

    // Filter only servers where user is Owner or has Administrator (0x8) or Manage Guild (0x20)
    const manageable = rawGuilds.filter((g: any) => {
      if (g.owner) return true;
      try {
        const perms = BigInt(g.permissions || 0);
        const isAdmin = (perms & BigInt(0x8)) === BigInt(0x8);
        const canManage = (perms & BigInt(0x20)) === BigInt(0x20);
        return isAdmin || canManage;
      } catch {
        return false;
      }
    });

    // Check which of these guilds are already listed in our database
    const guildIds = manageable.map((g: any) => g.id);
    const listedServers = await prisma.server.findMany({
      where: {
        guildId: { in: guildIds },
      },
      select: {
        id: true,
        guildId: true,
        slug: true,
        name: true,
        isFeatured: true,
        featuredUntil: true,
        memberCount: true,
      },
    });

    const listedMap = new Map(listedServers.map((s) => [s.guildId, s]));

    const guilds = manageable.map((g: any) => {
      const listed = listedMap.get(g.id);
      const isAnimated = g.icon?.startsWith("a_");
      const iconUrl = g.icon
        ? `https://cdn.discordapp.com/icons/${g.id}/${g.icon}.${isAnimated ? "gif" : "png"}?size=256`
        : null;

      return {
        id: g.id,
        name: g.name,
        iconUrl,
        isOwner: !!g.owner,
        canManage: true,
        isListed: !!listed,
        listedServer: listed || null,
      };
    });

    return NextResponse.json({ guilds });
  } catch (error: any) {
    console.error("Failed to load discord guilds:", error);
    return NextResponse.json(
      { error: error.message || "Internal error fetching guilds" },
      { status: 500 }
    );
  }
}
