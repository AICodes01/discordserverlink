import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;
    const serverId = params.id;

    const server = await prisma.server.findUnique({
      where: { id: serverId },
      select: { id: true, ownerId: true, name: true },
    });

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    // Only owner or admin can delete
    if (server.ownerId !== userId && userRole !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: You can only remove your own servers." },
        { status: 403 }
      );
    }

    await prisma.server.delete({
      where: { id: serverId },
    });

    return NextResponse.json({
      success: true,
      message: `Server "${server.name}" has been permanently removed.`,
    });
  } catch (error: any) {
    console.error("Delete server error:", error);
    return NextResponse.json(
      { error: "Failed to delete server. Please try again." },
      { status: 500 }
    );
  }
}
