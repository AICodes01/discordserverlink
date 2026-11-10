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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(await checkAdmin(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    const body = await req.json();
    const { action, adminNotes, durationDays: customDuration } = body;

    const request = await prisma.promotionRequest.findUnique({
      where: { id },
      include: {
        server: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Promotion request not found." },
        { status: 404 }
      );
    }

    if (action === "approve") {
      const days =
        Number(customDuration) ||
        request.durationDays ||
        (request.plan === "3_months" ? 90 : 30);
      const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

      const [updatedRequest, updatedServer] = await prisma.$transaction([
        prisma.promotionRequest.update({
          where: { id },
          data: {
            status: "APPROVED",
            approvedAt: new Date(),
            expiresAt,
            adminNotes: adminNotes || "Payment received and activated by admin.",
          },
          include: {
            server: true,
            user: {
              select: { id: true, name: true, email: true, username: true },
            },
          },
        }),
        prisma.server.update({
          where: { id: request.serverId },
          data: {
            isFeatured: true,
            featuredUntil: expiresAt,
            promotionPlan: request.plan,
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: (session.user as any)?.id || null,
            action: "PROMOTION_APPROVED",
            targetType: "SERVER",
            targetId: request.serverId,
            details: `Admin approved ${days}-day promotion ($${request.amount}) for server "${request.server.name}" (ID: ${request.serverId})`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: `Promotion approved successfully! Server is now Featured until ${expiresAt.toLocaleDateString()}.`,
        promotion: updatedRequest,
        server: updatedServer,
      });
    } else if (action === "reject") {
      const updatedRequest = await prisma.$transaction([
        prisma.promotionRequest.update({
          where: { id },
          data: {
            status: "REJECTED",
            adminNotes: adminNotes || "Request rejected by administrator.",
          },
          include: {
            server: true,
            user: {
              select: { id: true, name: true, email: true, username: true },
            },
          },
        }),
        prisma.auditLog.create({
          data: {
            userId: (session.user as any)?.id || null,
            action: "PROMOTION_REJECTED",
            targetType: "SERVER",
            targetId: request.serverId,
            details: `Admin rejected promotion request for server "${request.server.name}". Note: ${adminNotes || "None"}`,
          },
        }),
      ]);

      return NextResponse.json({
        success: true,
        message: "Promotion request rejected.",
        promotion: updatedRequest[0],
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Expected 'approve' or 'reject'." },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Failed to update promotion status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(await checkAdmin(session))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = params;
    await prisma.promotionRequest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Promotion request deleted." });
  } catch (error: any) {
    console.error("Failed to delete promotion request:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
