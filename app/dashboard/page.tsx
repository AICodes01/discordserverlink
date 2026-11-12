import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import DashboardClient from "./DashboardClient";
import { DiscordBot } from "@/lib/botsData";

export const metadata: Metadata = {
  title: "My Community Dashboard - DiscordServerLink",
  description:
    "Manage your submitted Discord servers and bots, track views, bumps, and join metrics, and request featured promotions.",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email || "";

  // Check Discord account link status
  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { discordId: true, discordAccessToken: true, role: true },
  });
  const hasDiscord = Boolean(
    dbUser?.discordId ||
    dbUser?.discordAccessToken ||
    (session.user as any).hasDiscord ||
    (session.user as any).accessToken
  );

  // 1. Fetch user's servers
  let userServers: any[] = [];
  try {
    userServers = await prisma.server.findMany({
      where: { ownerId: userId },
      include: {
        promotionRequests: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Dashboard fetch servers error:", err);
  }

  // 2. Fetch user's bots from customBots.json
  let userBots: DiscordBot[] = [];
  try {
    const filePath = path.join(process.cwd(), "lib", "customBots.json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      const allBots: DiscordBot[] = JSON.parse(content);
      userBots = allBots.filter(
        (b) =>
          b.ownerId === userId ||
          (userEmail && b.ownerEmail?.toLowerCase() === userEmail.toLowerCase())
      );
    }
  } catch (err) {
    console.error("Dashboard fetch bots error:", err);
  }

  // 3. Fetch user's promotion requests
  let userPromotions: any[] = [];
  try {
    userPromotions = await prisma.promotionRequest.findMany({
      where: { userId },
      include: {
        server: {
          select: {
            id: true,
            name: true,
            slug: true,
            iconUrl: true,
            isFeatured: true,
            featuredUntil: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Dashboard fetch promotions error:", err);
  }

  return (
    <DashboardClient
      user={{
        ...session.user,
        hasDiscord,
        role: dbUser?.role || (session.user as any).role,
      }}
      initialServers={userServers}
      initialBots={userBots}
      initialPromotions={userPromotions}
    />
  );
}
