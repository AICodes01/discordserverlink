import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
    const q = searchParams.get("q") || "";

    const where: any = {};
    if (status !== "ALL") {
      where.status = status;
    }
    if (q) {
      where.OR = [
        { name: { contains: q } },
        { slug: { contains: q } },
        { guildId: { contains: q } },
      ];
    }

    const servers = await prisma.server.findMany({
      where,
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
    });

    return NextResponse.json({ servers });
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
    const { id, isFeatured, isVerified, isPartnered, isNsfw, status, name, shortDescription, longDescription, categorySlug } = body;

    if (!id) {
      return NextResponse.json({ error: "Server ID is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (typeof isFeatured === "boolean") updateData.isFeatured = isFeatured;
    if (typeof isVerified === "boolean") updateData.isVerified = isVerified;
    if (typeof isPartnered === "boolean") updateData.isPartnered = isPartnered;
    if (typeof isNsfw === "boolean") updateData.isNsfw = isNsfw;
    if (status) updateData.status = status;
    if (name) updateData.name = name;
    if (shortDescription) updateData.shortDescription = shortDescription;
    if (longDescription) updateData.longDescription = longDescription;
    if (categorySlug) updateData.categorySlug = categorySlug;

    const server = await prisma.server.update({
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
      });
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
      });
    }

    return NextResponse.json({ success: true, message: "Server deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
