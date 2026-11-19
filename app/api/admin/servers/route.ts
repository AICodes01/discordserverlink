import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllFallbackServers, findFallbackServer } from "@/lib/fallbackServers";

async function checkAdmin(session: any) {
  if (!session?.user) return false;
  const role = (session.user as any)?.role;
  return role === "ADMIN" || role === "MODERATOR";
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "ALL";
    const tier = searchParams.get("tier") || "ALL";
    const q = (searchParams.get("q") || "").toLowerCase().trim();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    try {
      const where: any = {};
      if (status !== "ALL") {
        where.status = status;
      }
      if (tier === "featured") {
        where.isFeatured = true;
      } else if (tier === "partner") {
        where.isPartnered = true;
      } else if (tier === "normal") {
        where.isFeatured = false;
        where.isPartnered = false;
      }
      if (q) {
        where.OR = [
          { name: { contains: q } },
          { slug: { contains: q } },
          { guildId: { contains: q } },
        ];
      }

      const [servers, totalCount, totalServers, pendingServers, approvedServers] = await Promise.all([
        prisma.server.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        }),
        prisma.server.count({ where }),
        prisma.server.count(),
        prisma.server.count({ where: { status: "PENDING" } }),
        prisma.server.count({ where: { status: "APPROVED" } }),
      ]);

      return NextResponse.json({
        servers,
        totalCount,
        totalServers,
        pendingServers,
        approvedServers,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      });
    } catch (dbErr) {
      console.warn("Falling back to in-memory servers in admin API:", dbErr);
      const all = getAllFallbackServers();
      const filtered = all
        .filter((s) => {
          const matchesQuery =
            !q ||
            s.name.toLowerCase().includes(q) ||
            s.slug.toLowerCase().includes(q) ||
            (s.guildId && s.guildId.includes(q));
          const matchesStatus = status === "ALL" || s.status === status;
          let matchesTier = true;
          if (tier === "featured") matchesTier = !!s.isFeatured;
          else if (tier === "partner") matchesTier = !!s.isPartnered;
          else if (tier === "normal") matchesTier = !s.isFeatured && !s.isPartnered;
          return matchesQuery && matchesStatus && matchesTier;
        });

      const paginated = filtered.slice(skip, skip + limit);

      return NextResponse.json({
        servers: paginated,
        totalCount: filtered.length,
        totalServers: all.length,
        pendingServers: all.filter((s) => s.status === "PENDING").length,
        approvedServers: all.filter((s) => s.status === "APPROVED").length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, isFeatured, isVerified, isPartnered, isNsfw, status, name, shortDescription, longDescription, categorySlug, reviewReason } = body;

    if (!id) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
    if (typeof isVerified === "boolean") updateData.isVerified = isVerified;
    if (typeof isPartnered === "boolean") updateData.isPartnered = isPartnered;
    if (typeof isNsfw === "boolean") updateData.isNsfw = isNsfw;
    if (status) {
      updateData.status = status;
      if (status === "APPROVED") {
        updateData.reviewedAt = new Date();
        updateData.reviewedBy = (session?.user as any)?.name || (session?.user as any)?.email;
      }
    }
    if (reviewReason !== undefined) updateData.reviewReason = reviewReason;
    if (name) updateData.name = name;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (longDescription) updateData.longDescription = longDescription;
    if (categorySlug) updateData.categorySlug = categorySlug;

    let server: any = null;
    try {
      server = await prisma.server.update({
        where: { id },
        data: updateData,
      });

      // Log admin audit action
      const adminId = (session?.user as any)?.id;
      if (adminId) {
        await prisma.auditLog.create({
          data: {
            userId: adminId,
            action: "SERVER_UPDATED",
            targetType: "Server",
            targetId: id,
            details: JSON.stringify(updateData),
          },
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn("DB update failed, updating in-memory server:", dbErr);
      const fallback = findFallbackServer(id);
      if (fallback) {
        Object.assign(fallback, updateData);
        server = fallback;
      } else {
        server = { id, ...updateData };
      }
    }

    return NextResponse.json({ success: true, server });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!(await checkAdmin(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 });
    }

    try {
      await prisma.server.delete({
        where: { id },
      });

      const adminId = (session?.user as any)?.id;
      if (adminId) {
        await prisma.auditLog.create({
          data: {
            userId: adminId,
            action: "SERVER_DELETED",
            targetType: "Server",
            targetId: id,
          },
        }).catch(() => {});
      }
    } catch (dbErr) {
      console.warn("DB delete failed, marking server rejected in fallback:", dbErr);
      const fallback = findFallbackServer(id);
      if (fallback) {
        fallback.status = "REJECTED";
      }
    }

    return NextResponse.json({ success: true, message: "Server deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
