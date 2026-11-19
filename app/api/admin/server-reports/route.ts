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

    const logs = await prisma.auditLog.findMany({
      where: { action: "SERVER_REPORT" },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const reports = logs.map((log) => {
      let parsed: any = {};
      try {
        parsed = JSON.parse(log.details || "{}");
      } catch {
        parsed = { comment: log.details };
      }

      return {
        id: log.id,
        serverId: log.targetId || parsed.serverId || "",
        serverName: parsed.serverName || "Discord Server",
        serverSlug: parsed.serverSlug || "",
        reporterName: parsed.reporterName || "Anonymous Reporter",
        reporterEmail: parsed.reporterEmail || "",
        reason: parsed.reason || "Rule Violation",
        comment: parsed.comment || "",
        status: parsed.status || "PENDING",
        adminNotes: parsed.adminNotes || "",
        ipAddress: log.ipAddress || "",
        createdAt: log.createdAt,
        submittedAt: parsed.submittedAt || log.createdAt,
      };
    });

    const pendingCount = reports.filter((r) => r.status === "PENDING").length;

    return NextResponse.json({
      reports,
      totalCount: reports.length,
      pendingCount,
    });
  } catch (error: any) {
    console.error("Error fetching server reports:", error);
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
    const { id, status, adminNotes } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing report ID or status" }, { status: 400 });
    }

    const log = await prisma.auditLog.findUnique({ where: { id } });
    if (!log) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(log.details || "{}");
    } catch {
      parsed = { comment: log.details };
    }

    parsed.status = status;
    if (adminNotes !== undefined) {
      parsed.adminNotes = adminNotes;
    }
    parsed.updatedAt = new Date().toISOString();
    parsed.updatedBy = (session?.user as any)?.email || "admin";

    await prisma.auditLog.update({
      where: { id },
      data: { details: JSON.stringify(parsed) },
    });

    return NextResponse.json({ success: true, status, adminNotes: parsed.adminNotes });
  } catch (error: any) {
    console.error("Error updating server report status:", error);
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
      return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
    }

    await prisma.auditLog.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting server report:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
