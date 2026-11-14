import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import slugify from "slugify";
import { evaluateServerModeration } from "@/lib/moderation";
import { queryFallbackServers } from "@/lib/fallbackServers";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const tag = searchParams.get("tag") || "";
  const sort = searchParams.get("sort") || "bumped"; // bumped, members, newest, popular
  const limit = parseInt(searchParams.get("limit") || "24", 10);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const skip = (page - 1) * limit;

  try {
    const where: any = {
      status: "APPROVED",
    };

    if (query) {
      where.OR = [
        { name: { contains: query } },
        { shortDescription: { contains: query } },
        { tags: { contains: query } },
      ];
    }

    if (category) {
      where.categorySlug = category;
    }

    if (tag) {
      where.tags = { contains: tag };
    }

    let orderBy: any = { lastBumpedAt: "desc" };
    if (sort === "members") {
      orderBy = { memberCount: "desc" };
    } else if (sort === "newest") {
      orderBy = { createdAt: "desc" };
    } else if (sort === "popular") {
      orderBy = { joinsCount: "desc" };
    } else if (sort === "bumps") {
      orderBy = { bumpsCount: "desc" };
    }

    const [servers, total] = await Promise.all([
      prisma.server.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          shortDescription: true,
          iconUrl: true,
          bannerUrl: true,
          memberCount: true,
          onlineCount: true,
          categorySlug: true,
          tags: true,
          isFeatured: true,
          isVerified: true,
          isPartnered: true,
          bumpsCount: true,
          lastBumpedAt: true,
          createdAt: true,
        },
      }),
      prisma.server.count({ where }),
    ]);

    return NextResponse.json({
      servers,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.warn("Falling back to offline servers dataset in api/servers:", error?.message);
    const result = queryFallbackServers({
      query: query || undefined,
      category: category || undefined,
      tag: tag || undefined,
      sort: sort || undefined,
      skip,
      limit,
    });
    return NextResponse.json({
      servers: result.servers,
      total: result.totalCount,
      page,
      totalPages: Math.ceil(result.totalCount / limit),
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const ownerId = (session?.user as any)?.id;
    if (!ownerId) {
      return NextResponse.json(
        { error: "Authentication required. You must be signed in to submit a Discord server." },
        { status: 401 }
      );
    }

    // Verify user has connected Discord account
    const dbUser = await prisma.user.findUnique({
      where: { id: ownerId },
      select: { id: true, email: true, discordId: true, discordAccessToken: true, role: true },
    });

    const isPrivileged = dbUser?.role === "ADMIN" || dbUser?.role === "MODERATOR";
    const hasDiscord = Boolean(dbUser?.discordId || dbUser?.discordAccessToken || (session?.user as any)?.hasDiscord);

    if (!hasDiscord && !isPrivileged && dbUser?.email !== "demo@discordserverlink.com") {
      return NextResponse.json(
        {
          error: "To add and manage Discord servers, please connect your Discord account.",
          requiresDiscordLink: true,
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      name,
      shortDescription,
      longDescription,
      inviteUrl,
      categorySlug,
      tags,
      iconUrl,
      bannerUrl,
      guildId,
      memberCount,
      onlineCount,
      isVerified,
      isPartnered,
      isNsfw,
    } = body;

    if (!name || !shortDescription || !inviteUrl) {
      return NextResponse.json(
        { error: "Name, short description, and invite URL are required" },
        { status: 400 }
      );
    }

    // Check if server with this guildId already exists
    if (guildId) {
      const existingGuild = await prisma.server.findUnique({
        where: { guildId },
        select: { id: true, name: true, slug: true },
      });
      if (existingGuild) {
        return NextResponse.json(
          {
            error: `"${existingGuild.name}" is already listed on our website!`,
            alreadyExists: true,
            slug: existingGuild.slug,
          },
          { status: 409 }
        );
      }
    }

    // Generate unique slug
    let baseSlug = slugify(name, { lower: true, strict: true }) || "server";
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.server.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Site setting check
    const approvalSetting = await prisma.siteSetting.findUnique({
      where: { key: "require_server_approval" },
    });

    // Evaluate automated moderation filters (member count, adult keywords, illegal terms)
    const moderation = evaluateServerModeration({
      name,
      shortDescription,
      longDescription,
      tags,
      memberCount: typeof memberCount === "number" ? memberCount : 0,
      isNsfw: Boolean(isNsfw),
      requireSiteApproval: approvalSetting?.value === "true",
    });

    const status = moderation.status; // "PENDING" or "APPROVED"
    const reviewReason = moderation.reasons.length > 0 ? moderation.reasons.join(" • ") : null;

    const server = await prisma.server.create({
      data: {
        name,
        slug,
        shortDescription,
        longDescription: longDescription || shortDescription,
        inviteUrl,
        categorySlug: categorySlug || "community",
        tags: Array.isArray(tags) ? tags.join(",") : (tags || ""),
        iconUrl: iconUrl || null,
        bannerUrl: bannerUrl || null,
        guildId: guildId || null,
        memberCount: memberCount || 0,
        onlineCount: onlineCount || 0,
        isVerified: !!isVerified,
        isPartnered: !!isPartnered,
        isNsfw: !!isNsfw,
        status,
        reviewReason,
        ownerId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        server,
        needsReview: moderation.needsReview,
        reviewReason,
        message: moderation.needsReview
          ? "Your server has been submitted and is currently in the moderation review queue. Once reviewed and approved by our team, it will appear publicly on the website."
          : "Server submitted successfully and is now live on DiscordServerLink!",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Server create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create server" },
      { status: 500 }
    );
  }
}
