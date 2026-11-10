import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();

    const { serverId, plan, contactInfo, notes } = body;

    if (!serverId || !plan || !contactInfo) {
      return NextResponse.json(
        { error: "Server ID, promotion plan, and contact information are required." },
        { status: 400 }
      );
    }

    // Verify user owns the server
    const server = await prisma.server.findUnique({
      where: { id: serverId },
      select: { id: true, name: true, ownerId: true },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    if (server.ownerId !== userId) {
      return NextResponse.json(
        { error: "You can only request promotions for servers you own." },
        { status: 403 }
      );
    }

    // Define pricing and duration
    let durationDays = 30;
    let amount = 5.0;
    if (plan === "3_months") {
      durationDays = 90;
      amount = 10.0;
    } else {
      // default 1 month
      durationDays = 30;
      amount = 5.0;
    }

    // Check if there is already a pending request for this server
    const existingPending = await prisma.promotionRequest.findFirst({
      where: {
        serverId,
        status: "PENDING",
      },
    });

    if (existingPending) {
      return NextResponse.json(
        {
          error:
            "A promotion request is already pending for this server. The main admin will connect with you shortly.",
        },
        { status: 409 }
      );
    }

    const newRequest = await prisma.promotionRequest.create({
      data: {
        serverId,
        userId,
        plan: plan === "3_months" ? "3_months" : "1_month",
        durationDays,
        amount,
        contactInfo: contactInfo.trim(),
        notes: notes ? notes.trim() : null,
        status: "PENDING",
      },
    });

    // Also create audit log for admin
    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "PROMOTION_REQUEST_SUBMITTED",
          targetType: "Server",
          targetId: serverId,
          details: `User submitted promotion request for "${server.name}" (${plan === "3_months" ? "$10 for 3 Months" : "$5 for 1 Month"}). Contact: ${contactInfo}`,
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      promotion: newRequest,
      message: `Promotion request for "${server.name}" submitted successfully! The main admin will contact you manually to complete the payment.`,
    });
  } catch (error: any) {
    console.error("Create promotion request error:", error);
    return NextResponse.json(
      { error: "Internal server error while submitting promotion request." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const requests = await prisma.promotionRequest.findMany({
      where: { userId },
      include: {
        server: {
          select: { id: true, name: true, slug: true, iconUrl: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, requests });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch promotions" }, { status: 500 });
  }
}
