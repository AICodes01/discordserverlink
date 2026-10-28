import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { inviteUrl } = await req.json();

    if (!inviteUrl) {
      return NextResponse.json(
        { error: "Invite URL is required" },
        { status: 400 }
      );
    }

    // Clean invite string to extract the code
    let code = inviteUrl.trim();
    code = code.replace(/^(https?:\/\/)?(www\.)?(discord\.gg\/|discord\.com\/invite\/)/i, "");
    code = code.split("?")[0].split("#")[0].replace(/\/+$/, "");

    if (!code) {
      return NextResponse.json(
        { error: "Could not extract invite code" },
        { status: 400 }
      );
    }

    // Call Discord public invite API with member & presence counts
    const discordRes = await fetch(
      `https://discord.com/api/v10/invites/${encodeURIComponent(code)}?with_counts=true`,
      {
        headers: {
          "User-Agent": "DiscordServerLink/1.0",
        },
        next: { revalidate: 60 },
      }
    );

    if (!discordRes.ok) {
      if (discordRes.status === 404) {
        return NextResponse.json(
          { error: "Discord invite link is invalid or expired" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "Failed to fetch Discord server details" },
        { status: discordRes.status }
      );
    }

    const data = await discordRes.json();
    const guild = data.guild;

    if (!guild) {
      return NextResponse.json(
        { error: "Invite does not point to a valid guild" },
        { status: 400 }
      );
    }

    // Check if server already exists in our database
    const existingServer = await prisma.server.findFirst({
      where: {
        OR: [
          { guildId: guild.id },
          { inviteUrl: { contains: code } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        iconUrl: true,
        memberCount: true,
        onlineCount: true,
        categorySlug: true,
      },
    });

    if (existingServer) {
      return NextResponse.json({
        alreadyExists: true,
        existingServer,
        message: `This Discord server (${existingServer.name}) is already listed on our website!`,
      });
    }

    const iconUrl = guild.icon
      ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=256`
      : null;

    const bannerUrl = guild.banner
      ? `https://cdn.discordapp.com/banners/${guild.id}/${guild.banner}.png?size=1024`
      : guild.splash
      ? `https://cdn.discordapp.com/splashes/${guild.id}/${guild.splash}.png?size=1024`
      : null;

    return NextResponse.json({
      success: true,
      alreadyExists: false,
      inviteCode: code,
      guildId: guild.id,
      name: guild.name,
      description: guild.description || "",
      iconUrl,
      bannerUrl,
      memberCount: data.approximate_member_count || 0,
      onlineCount: data.approximate_presence_count || 0,
      isVerified: guild.features?.includes("VERIFIED") || false,
      isPartnered: guild.features?.includes("PARTNERED") || false,
      isNsfw: guild.nsfw || false,
    });
  } catch (error: any) {
    console.error("Error fetching discord invite:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
