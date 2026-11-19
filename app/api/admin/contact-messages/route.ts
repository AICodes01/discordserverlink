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
      where: { action: "CONTACT_FORM_SUBMISSION" },
      orderBy: { createdAt: "desc" },
      take: 200,
    });

    const messages = logs.map((log) => {
      let parsed: any = {};
      try {
        parsed = JSON.parse(log.details || "{}");
      } catch {
        parsed = { message: log.details };
      }

      return {
        id: log.id,
        name: parsed.name || "Anonymous",
        email: parsed.email || "",
        subject: parsed.subject || "General Inquiry",
        message: parsed.message || "",
        status: parsed.status || "UNREAD",
        createdAt: log.createdAt,
        submittedAt: parsed.submittedAt || log.createdAt,
      };
    });

    const unreadCount = messages.filter((m) => m.status === "UNREAD").length;

    return NextResponse.json({
      messages,
      totalCount: messages.length,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching contact messages:", error);
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
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing message ID or status" }, { status: 400 });
    }

    const log = await prisma.auditLog.findUnique({ where: { id } });
    if (!log) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    let parsed: any = {};
    try {
      parsed = JSON.parse(log.details || "{}");
    } catch {
      parsed = { message: log.details };
    }

    parsed.status = status;

    await prisma.auditLog.update({
      where: { id },
      data: { details: JSON.stringify(parsed) },
    });

    return NextResponse.json({ success: true, status });
  } catch (error: any) {
    console.error("Error updating contact message status:", error);
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
      return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
    }

    await prisma.auditLog.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting contact message:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
