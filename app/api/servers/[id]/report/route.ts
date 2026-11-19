import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, email, reason, comment, serverSlug } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json({ error: "Your name is required." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
    }

    if (!reason || typeof reason !== "string") {
      return NextResponse.json({ error: "Please select a report reason." }, { status: 400 });
    }

    if (!comment || typeof comment !== "string" || !comment.trim()) {
      return NextResponse.json({ error: "Please provide comment details." }, { status: 400 });
    }

    // Try to find server in DB
    let targetServer = await prisma.server.findUnique({
      where: { id },
      select: { id: true, name: true, slug: true, guildId: true },
    });

    if (!targetServer && serverSlug) {
      targetServer = await prisma.server.findUnique({
        where: { slug: serverSlug },
        select: { id: true, name: true, slug: true, guildId: true },
      });
    }

    const serverName = targetServer ? targetServer.name : "Server (" + id + ")";
    const finalSlug = targetServer ? targetServer.slug : serverSlug || id;

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const reportData = {
      reporterName: name.trim(),
      reporterEmail: email.trim().toLowerCase(),
      reason: reason.trim(),
      comment: comment.trim(),
      serverId: id,
      serverName,
      serverSlug: finalSlug,
      guildId: targetServer?.guildId || null,
      status: "PENDING", // PENDING, INVESTIGATING, RESOLVED, DISMISSED
      submittedAt: new Date().toISOString(),
    };

    const auditLog = await prisma.auditLog.create({
      data: {
        action: "SERVER_REPORT",
        targetType: "Server",
        targetId: id,
        details: JSON.stringify(reportData),
        ipAddress: ip,
      },
    });

    return NextResponse.json({
      success: true,
      reportId: auditLog.id,
      message: "Report submitted successfully.",
    });
  } catch (error: any) {
    console.error("Error submitting server report:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}
