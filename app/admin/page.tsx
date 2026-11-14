import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import AdminDashboardClient from "./AdminDashboardClient";
import {
  getAllFallbackServers,
  DEFAULT_CATEGORIES,
  TOTAL_SERVERS_COUNT,
} from "@/lib/fallbackServers";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to owner portal
  if (!session?.user) {
    redirect("/taplu?callbackUrl=/admin");
  }

  const role = (session.user as any)?.role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    redirect("/taplu?error=unauthorized");
  }

  // Pre-fetch initial admin state
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);

  let servers: any[] = [];
  let categories: any[] = [];
  let users: any[] = [];
  let settings: any[] = [];
  let auditLogs: any[] = [];
  let stats: any = [0, 0, { _sum: { memberCount: 0 } }, 0, 0];
  let viewsToday = 0;
  let viewsYesterday = 0;
  let totalViews = 0;
  let totalVideos = 0;
  let videosList: any[] = [];
  let allTimePageViews: any[] = [];
  let todayPageViews: any[] = [];
  let yesterdayPageViews: any[] = [];
  let deviceStats: any[] = [];
  let recentVisitorLogs: any[] = [];
  let blogPosts: any[] = [];
  let promotions: any[] = [];

  try {
    const results = await Promise.all([
      prisma.server.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          owner: {
            select: { name: true, email: true, username: true },
          },
        },
      }),
      prisma.category.findMany({
        orderBy: { displayOrder: "asc" },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          username: true,
          role: true,
          banned: true,
          createdAt: true,
          _count: { select: { servers: true, reviews: true } },
        },
      }),
      prisma.siteSetting.findMany(),
      prisma.auditLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      Promise.all([
        prisma.server.count(),
        prisma.server.count({ where: { status: "PENDING" } }),
        prisma.server.aggregate({ _sum: { memberCount: true } }),
        prisma.bump.count(),
        prisma.user.count(),
      ]),
      prisma.pageView.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.pageView.count({
        where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
      }),
      prisma.pageView.count(),
      prisma.videoItem.count(),
      prisma.videoItem.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.pageView.groupBy({ by: ["path"], _count: { path: true } }),
      prisma.pageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: todayStart } },
        _count: { path: true },
      }),
      prisma.pageView.groupBy({
        by: ["path"],
        where: { createdAt: { gte: yesterdayStart, lt: todayStart } },
        _count: { path: true },
      }),
      prisma.pageView.groupBy({ by: ["device"], _count: { device: true } }),
      prisma.pageView.findMany({ take: 20, orderBy: { createdAt: "desc" } }),
      getAllPosts(),
      prisma.promotionRequest.findMany({
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
      }),
    ]);

    servers = results[0];
    categories = results[1];
    users = results[2];
    settings = results[3];
    auditLogs = results[4];
    stats = results[5];
    viewsToday = results[6];
    viewsYesterday = results[7];
    totalViews = results[8];
    totalVideos = results[9];
    videosList = results[10];
    allTimePageViews = results[11];
    todayPageViews = results[12];
    yesterdayPageViews = results[13];
    deviceStats = results[14];
    recentVisitorLogs = results[15];
    blogPosts = results[16];
    promotions = results[17] || [];
  } catch (err) {
    console.warn("Admin prefetch warning (using fallback data):", err);
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const seed = require("@/prisma/seed-data.json");
      categories = seed.categories || DEFAULT_CATEGORIES;
      users = seed.users || [];
      settings = seed.siteSettings || [];
      servers = getAllFallbackServers();
      stats = [servers.length || TOTAL_SERVERS_COUNT, 0, { _sum: { memberCount: 15400000 } }, 84000, users.length || 5];
    } catch {
      categories = DEFAULT_CATEGORIES;
      servers = getAllFallbackServers();
      stats = [TOTAL_SERVERS_COUNT, 0, { _sum: { memberCount: 15400000 } }, 84000, 5];
    }
    blogPosts = await getAllPosts();
  }

  const [
    totalServers,
    pendingServers,
    totalMembersSum,
    totalBumps,
    totalUsers,
  ] = stats;

  const pageWiseStats = allTimePageViews
    .map((item) => {
      const today =
        todayPageViews.find((t) => t.path === item.path)?._count.path || 0;
      const yesterday =
        yesterdayPageViews.find((y) => y.path === item.path)?._count.path || 0;
      return {
        path: item.path,
        allTime: item._count.path,
        today,
        yesterday,
      };
    })
    .sort((a, b) => b.today - a.today);

  const deviceMap = deviceStats.reduce((acc, curr) => {
    acc[curr.device || "desktop"] = curr._count.device;
    return acc;
  }, {} as Record<string, number>);

  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <AdminDashboardClient
      initialServers={servers}
      initialCategories={categories}
      initialUsers={users}
      initialSettings={settingsMap}
      initialLogs={auditLogs}
      initialVideos={videosList}
      initialBlogPosts={blogPosts}
      initialPromotions={promotions}
      stats={{
        totalServers,
        pendingServers,
        totalMembers: totalMembersSum._sum.memberCount || 0,
        totalBumps,
        totalUsers,
      }}
      analytics={{
        viewsToday,
        viewsYesterday,
        totalViews,
        totalVideos,
        pageWiseStats,
        deviceStats: deviceMap,
        recentVisitors: recentVisitorLogs,
      }}
      currentAdminRole={role}
    />
  );
}
