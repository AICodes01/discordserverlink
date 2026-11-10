import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import fs from "fs";
import path from "path";
import { DiscordBot } from "@/lib/botsData";

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
    const userEmail = session.user.email || "";
    const userRole = (session.user as any).role;
    const botId = params.id;

    const filePath = path.join(process.cwd(), "lib", "customBots.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const currentBots: DiscordBot[] = JSON.parse(fileContent);

    const botIndex = currentBots.findIndex(
      (b) => b.id === botId || b.slug === botId
    );
    if (botIndex === -1) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }

    const targetBot = currentBots[botIndex];

    // Check ownership or admin
    const isOwner =
      targetBot.ownerId === userId ||
      (userEmail && targetBot.ownerEmail === userEmail) ||
      userRole === "ADMIN";

    if (!isOwner) {
      return NextResponse.json(
        { error: "Forbidden: You can only remove bots you created." },
        { status: 403 }
      );
    }

    currentBots.splice(botIndex, 1);
    fs.writeFileSync(filePath, JSON.stringify(currentBots, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: `Bot "${targetBot.name}" has been permanently removed.`,
    });
  } catch (error: any) {
    console.error("Delete bot error:", error);
    return NextResponse.json(
      { error: "Failed to delete bot. Please try again." },
      { status: 500 }
    );
  }
}
