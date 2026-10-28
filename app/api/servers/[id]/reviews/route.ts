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
    const userId = (session?.user as any)?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to leave a review" },
        { status: 401 }
      );
    }

    const { rating, content } = await req.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 5) {
      return NextResponse.json(
        { error: "Review comment must be at least 5 characters" },
        { status: 400 }
      );
    }

    const server = await prisma.server.findUnique({
      where: { id },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        serverId: server.id,
        userId,
        rating: Math.round(rating),
        content: content.trim(),
        status: "APPROVED",
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    console.error("Review error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to post review" },
      { status: 500 }
    );
  }
}
