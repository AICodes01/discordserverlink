import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import AdminDashboardClient from "./AdminDashboardClient";
import seedData from "@/prisma/seed-data.json";
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
  let categories: any[] = seedData.categories || DEFAULT_CATEGORIES;
  let users: any[] = seedData.users || [];
  let settings: any[] = seedData.siteSettings || [];
  let auditLogs: any[] = [];
  let stats: any = [TOTAL_SERVERS_COUNT, 0, { _sum: { memberCount: 15400000 } }, 84000, 5];
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
        take: 25,
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
        take: 100,
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
        prisma.server.count({ where: { status: "APPROVED" } }),
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
      prisma.videoItem.findMany({ take: 50, orderBy: { createdAt: "desc" } }),
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
        take: 50,
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

    servers = (results[0] || []).slice(0, 25);
    if (results[1] && results[1].length > 0) categories = results[1];
    if (results[2] && results[2].length > 0) users = results[2];
    if (results[3] && results[3].length > 0) settings = results[3];
    auditLogs = results[4] || [];
    stats = results[5] || [TOTAL_SERVERS_COUNT, 0, TOTAL_SERVERS_COUNT, { _sum: { memberCount: 15400000 } }, 84000, 5];
    viewsToday = results[6] || 0;
    viewsYesterday = results[7] || 0;
    totalViews = results[8] || 0;
    totalVideos = results[9] || 0;
    videosList = results[10] || [];
    allTimePageViews = results[11] || [];
    todayPageViews = results[12] || [];
    yesterdayPageViews = results[13] || [];
    deviceStats = results[14] || [];
    recentVisitorLogs = results[15] || [];
    blogPosts = results[16] || [];
    promotions = results[17] || [];
  } catch (err) {
    console.warn("Admin prefetch warning (using fallback data):", err);
    categories = seedData.categories || DEFAULT_CATEGORIES;
    users = seedData.users || [];
    settings = seedData.siteSettings || [];
    const all = getAllFallbackServers();
    servers = all.slice(0, 25);
    stats = [
      all.length || TOTAL_SERVERS_COUNT,
      0,
      all.length || TOTAL_SERVERS_COUNT,
      { _sum: { memberCount: 15400000 } },
      84000,
      users.length || 5,
    ];
    blogPosts = await getAllPosts();
  }

  // Ensure servers has initial data even if DB returned empty
  if (servers.length === 0) {
    servers = getAllFallbackServers().slice(0, 25);
  }

  const [
    totalServers = TOTAL_SERVERS_COUNT,
    pendingServers = 0,
    approvedServers = TOTAL_SERVERS_COUNT,
    totalMembersSum = { _sum: { memberCount: 15400000 } },
    totalBumps = 84000,
    totalUsers = 5,
  ] = Array.isArray(stats) ? stats : [];

  const pageWiseStats = Array.isArray(allTimePageViews)
    ? allTimePageViews
        .map((item) => {
          const today =
            todayPageViews.find((t) => t.path === item.path)?._count?.path || 0;
          const yesterday =
            yesterdayPageViews.find((y) => y.path === item.path)?._count?.path || 0;
          return {
            path: item.path,
            allTime: item._count?.path || 0,
            today,
            yesterday,
          };
        })
        .sort((a, b) => b.today - a.today)
    : [];

  const deviceMap = Array.isArray(deviceStats)
    ? deviceStats.reduce((acc, curr) => {
        if (curr) acc[curr.device || "desktop"] = curr._count?.device || 0;
        return acc;
      }, {} as Record<string, number>)
    : {};

  const settingsMap = Array.isArray(settings)
    ? settings.reduce((acc, curr) => {
        if (curr?.key) acc[curr.key] = String(curr.value || "");
        return acc;
      }, {} as Record<string, string>)
    : {};

  return (
    <AdminDashboardClient
      initialServers={servers}
      initialTotalServerCount={totalServers || TOTAL_SERVERS_COUNT}
      initialCategories={categories}
      initialUsers={users}
      initialSettings={settingsMap}
      initialLogs={auditLogs}
      initialVideos={videosList}
      initialBlogPosts={blogPosts}
      initialPromotions={promotions}
      stats={{
        totalServers: totalServers || TOTAL_SERVERS_COUNT,
        pendingServers: pendingServers || 0,
        approvedServers: approvedServers || (totalServers - pendingServers),
        totalMembers: totalMembersSum?._sum?.memberCount || 15400000,
        totalBumps: totalBumps || 84000,
        totalUsers: totalUsers || 5,
      }}
      analytics={{
        viewsToday: viewsToday || 0,
        viewsYesterday: viewsYesterday || 0,
        totalViews: totalViews || 0,
        totalVideos: totalVideos || 0,
        pageWiseStats,
        deviceStats: deviceMap,
        recentVisitors: recentVisitorLogs,
      }}
      currentAdminRole={role}
    />
  );
}
