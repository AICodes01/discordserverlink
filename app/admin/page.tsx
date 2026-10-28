import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import AdminDashboardClient from "./AdminDashboardClient";

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

  const [
    servers,
    categories,
    users,
    settings,
    auditLogs,
    stats,
    viewsToday,
    viewsYesterday,
    totalViews,
    totalVideos,
    videosList,
    allTimePageViews,
    todayPageViews,
    yesterdayPageViews,
    deviceStats,
    recentVisitorLogs,
  ] = await Promise.all([
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
  ]);

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
