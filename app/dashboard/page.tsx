import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { Metadata } from "next";
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";
import DashboardLoading from "./loading";
import { DiscordBot } from "@/lib/botsData";

export const metadata: Metadata = {
  title: "My Community Dashboard - DiscordServerLink",
  description:
    "Manage your submitted Discord servers and bots, track views, bumps, and join metrics, and request featured promotions.",
};

// Use force-dynamic so session/data is always fresh
export const dynamic = "force-dynamic";

// Separate async component that fetches data — wrapped in Suspense
async function DashboardData({ userId, userEmail }: { userId: string; userEmail: string }) {
  // Run all 3 queries in parallel instead of sequentially
  const [dbUser, userServers, userPromotions] = await Promise.allSettled([
    prisma.user.findUnique({
      where: { id: userId },
      select: { discordId: true, discordAccessToken: true, role: true },
    }),
    prisma.server.findMany({
      where: { ownerId: userId },
      include: {
        promotionRequests: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.promotionRequest.findMany({
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
    }),
  ]);

  const resolvedDbUser = dbUser.status === "fulfilled" ? dbUser.value : null;
  const resolvedServers = userServers.status === "fulfilled" ? userServers.value : [];
  const resolvedPromotions = userPromotions.status === "fulfilled" ? userPromotions.value : [];

  // Fetch bots from JSON (sync, fast)
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

  // Build session user shape for client
  const hasDiscord = Boolean(
    resolvedDbUser?.discordId || resolvedDbUser?.discordAccessToken
  );

  return {
    dbUser: resolvedDbUser,
    hasDiscord,
    userServers: resolvedServers,
    userBots,
    userPromotions: resolvedPromotions,
  };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const userId = (session.user as any).id as string;
  const userEmail = session.user.email || "";

  // Fetch all data in parallel
  const data = await DashboardData({ userId, userEmail });

  return (
    <DashboardClient
      user={{
        ...session.user,
        hasDiscord: data.hasDiscord || (session.user as any).hasDiscord,
        role: data.dbUser?.role || (session.user as any).role,
      }}
      initialServers={data.userServers}
      initialBots={data.userBots}
      initialPromotions={data.userPromotions}
    />
  );
}
