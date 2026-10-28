import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const videos = await prisma.videoItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ videos });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { title, url, thumbnail, platform, categorySlug, featured, viewsCount } = body;

    if (!title || !url) {
      return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
    }

    const video = await prisma.videoItem.create({
      data: {
        title,
        url,
        thumbnail: thumbnail || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
        platform: platform || "youtube",
        categorySlug: categorySlug || "community",
        featured: !!featured,
        viewsCount: parseInt(viewsCount) || 0,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session?.user as any)?.id,
        action: "CREATE_VIDEO",
        targetType: "VideoItem",
        targetId: video.id,
        details: `Created video item: ${title}`,
      },
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const video = await prisma.videoItem.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, video });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.videoItem.delete({
      where: { id },
    });

    await prisma.auditLog.create({
      data: {
        userId: (session?.user as any)?.id,
        action: "DELETE_VIDEO",
        targetType: "VideoItem",
        targetId: id,
        details: `Deleted video item: ${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
