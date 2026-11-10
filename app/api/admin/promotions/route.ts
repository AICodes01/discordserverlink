import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

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

    const where: any = {};
    if (status !== "ALL") {
      where.status = status;
    }

    const promotions = await prisma.promotionRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            isFeatured: true,
            featuredUntil: true,
            promotionPlan: true,
            memberCount: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ promotions });
  } catch (error: any) {
    console.error("Failed to fetch admin promotions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
