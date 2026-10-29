"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Server as ServerIcon,
  Layers,
  Users,
  Settings,
  History,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Award,
  Search,
  Trash2,
  Edit,
  ExternalLink,
  PlusCircle,
  Save,
  Rocket,
  Shield,
  Ban,
  Lock,
  BarChart3,
  TrendingUp,
  Eye,
  Video,
  Globe,
  FileCode,
  DollarSign,
  Megaphone,
  Copy,
  Smartphone,
  Monitor,
  Tablet,
  Check,
  Code2,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import AdminBlogManager from "@/components/admin/AdminBlogManager";

interface AdminProps {
  initialServers: any[];
  initialCategories: any[];
  initialUsers: any[];
  initialSettings: Record<string, string>;
  initialLogs: any[];
  initialVideos?: any[];
  initialBlogPosts?: any[];
  stats: {
    totalServers: number;
    pendingServers: number;
    totalMembers: number;
    totalBumps: number;
    totalUsers: number;
  };
  analytics?: {
    viewsToday: number;
    viewsYesterday: number;
    totalViews: number;
    totalVideos: number;
    pageWiseStats: Array<{
      path: string;
      allTime: number;
      today: number;
      yesterday: number;
    }>;
    deviceStats: Record<string, number>;
    recentVisitors: any[];
  };
  currentAdminRole: string;
}

export default function AdminDashboardClient({
  initialServers,
  initialCategories,
  initialUsers,
  initialSettings,
  initialLogs,
  initialVideos = [],
  initialBlogPosts = [],
  stats,
  analytics,
  currentAdminRole,
}: AdminProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "ads" | "servers" | "categories" | "blog" | "users" | "settings" | "logs"
  >("overview");

  // State
  const [servers, setServers] = useState(initialServers);
  const [categories, setCategories] = useState(initialCategories);
  const [users, setUsers] = useState(initialUsers);
  const [settings, setSettings] = useState(initialSettings);
  const [auditLogs, setAuditLogs] = useState(initialLogs);
  const [videos, setVideos] = useState<any[]>(initialVideos);
  const [blogPosts, setBlogPosts] = useState<any[]>(initialBlogPosts);

  // Filters
  const [serverSearch, setServerSearch] = useState("");
  const [serverStatusFilter, setServerStatusFilter] = useState("ALL");
  const [userSearch, setUserSearch] = useState("");
  const [pageSearch, setPageSearch] = useState("");
  const [pageSort, setPageSort] = useState<"today" | "yesterday" | "allTime">("today");

  // Notifications
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Video Form Modal State
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [newVideoThumb, setNewVideoThumb] = useState("");
  const [newVideoCategory, setNewVideoCategory] = useState("community");
  const [newVideoPlatform, setNewVideoPlatform] = useState("youtube");
  const [newVideoViews, setNewVideoViews] = useState("1000");
  const [videoLoading, setVideoLoading] = useState(false);

  // Category Form Modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatIcon, setNewCatIcon] = useState("Compass");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [catLoading, setCatLoading] = useState(false);

  // Edit Server Modal state
  const [editingServer, setEditingServer] = useState<any | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  // Handlers for Server actions
  const handleToggleServerFlag = async (
    id: string,
    field: "isFeatured" | "isVerified" | "isPartnered" | "isNsfw",
    currentVal: boolean
  ) => {
    try {
      const res = await fetch("/api/admin/servers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, [field]: !currentVal }),
      });
      if (res.ok) {
        setServers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, [field]: !currentVal } : s))
        );
        showToast(`Server flag updated.`);
      } else {
        showToast("Failed to update flag.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
  };

  const handleChangeServerStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/servers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setServers((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        showToast(`Server status changed to ${newStatus}`);
      } else {
        showToast("Failed to update status", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const handleDeleteServer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/servers?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setServers((prev) => prev.filter((s) => s.id !== id));
        showToast(`Server "${name}" deleted.`);
      } else {
        showToast("Failed to delete server", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const handleSaveEditServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingServer) return;
    setEditLoading(true);

    try {
      const res = await fetch("/api/admin/servers", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingServer),
      });
      if (res.ok) {
        setServers((prev) =>
          prev.map((s) => (s.id === editingServer.id ? editingServer : s))
        );
        setEditingServer(null);
        showToast("Server successfully updated!");
      } else {
        showToast("Failed to update server", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setEditLoading(false);
    }
  };

  // Handlers for Categories
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCatLoading(true);

    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          icon: newCatIcon,
          description: newCatDesc,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCategories([...categories, data.category]);
        setShowCatModal(false);
        setNewCatName("");
        setNewCatDesc("");
        showToast(`Category "${newCatName}" created!`);
      } else {
        showToast(data.error || "Failed to create category", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setCatLoading(false);
    }
  };

  // Handlers for Videos
  const handleCreateVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    setVideoLoading(true);
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newVideoTitle,
          url: newVideoUrl,
          thumbnail: newVideoThumb || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
          platform: newVideoPlatform,
          categorySlug: newVideoCategory,
          viewsCount: parseInt(newVideoViews) || 0,
          featured: true,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setVideos([data.video, ...videos]);
        setShowVideoModal(false);
        setNewVideoTitle("");
        setNewVideoUrl("");
        setNewVideoThumb("");
        showToast("Video added successfully!");
      } else {
        showToast(data.error || "Failed to add video", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setVideoLoading(false);
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete video "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/videos?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setVideos(videos.filter((v) => v.id !== id));
        showToast("Video deleted");
      } else {
        showToast("Failed to delete video", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  // Handlers for Users
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        showToast(`User role changed to ${newRole}`);
      } else {
        showToast("Failed to update user role", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  const handleToggleBanUser = async (userId: string, currentBanned: boolean) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, banned: !currentBanned }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, banned: !currentBanned } : u))
        );
        showToast(currentBanned ? "User unbanned" : "User suspended");
      } else {
        showToast("Failed to update user status", "error");
      }
    } catch {
      showToast("Network error", "error");
    }
  };

  // Handlers for Settings & Monetization
  const [settingsLoading, setSettingsLoading] = useState(false);
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSettingsLoading(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        showToast("Configuration saved and applied live!");
      } else {
        showToast("Failed to save settings", "error");
      }
    } catch {
      showToast("Network error", "error");
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filtered servers
  const filteredServers = servers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(serverSearch.toLowerCase()) ||
      s.slug.toLowerCase().includes(serverSearch.toLowerCase()) ||
      (s.guildId && s.guildId.includes(serverSearch));
    const matchesStatus =
      serverStatusFilter === "ALL" ? true : s.status === serverStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filtered and sorted page-wise stats
  const pageWiseList = (analytics?.pageWiseStats || [])
    .filter((p) => p.path.toLowerCase().includes(pageSearch.toLowerCase()))
    .sort((a, b) => b[pageSort] - a[pageSort]);

  // Traffic Growth calculation
  const viewsToday = analytics?.viewsToday || 0;
  const viewsYesterday = analytics?.viewsYesterday || 0;
  const diffViews = viewsToday - viewsYesterday;
  const pctGrowth =
    viewsYesterday > 0
      ? ((diffViews / viewsYesterday) * 100).toFixed(1)
      : "+100";
  const isPositiveGrowth = diffViews >= 0;

  // Helper to determine page label
  const getPageTypeLabel = (path: string) => {
    if (path === "/") return { label: "Homepage", color: "text-discord-blurple bg-discord-blurple/10 border-discord-blurple/20" };
    if (path.startsWith("/category/")) return { label: "Category", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (path.startsWith("/server/")) return { label: "Server Detail", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    if (path.startsWith("/tag/")) return { label: "Tag Filter", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
    if (path === "/categories") return { label: "Categories Hub", color: "text-sky-400 bg-sky-500/10 border-sky-500/20" };
    if (path === "/servers/new") return { label: "Add Server Form", color: "text-pink-400 bg-pink-500/10 border-pink-500/20" };
    return { label: "Public Page", color: "text-zinc-400 bg-zinc-800 border-zinc-700" };
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-zinc-100 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === "success"
              ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
              : "bg-red-950/90 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-5 flex flex-col justify-between flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-discord-blurple flex items-center justify-center text-white shadow-glow-sm">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white">Admin Console</h2>
              <p className="text-[10px] text-zinc-400 font-medium">
                discordserverlink.com
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "overview"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Shield className="w-4 h-4" />
                <span>Overview</span>
              </div>
              {stats.pendingServers > 0 && (
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500 text-zinc-950 font-bold text-[10px]">
                  {stats.pendingServers}
                </span>
              )}
            </button>

            {/* NEW TAB: STATS & ANALYTICS */}
            <button
              onClick={() => setActiveTab("stats")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "stats"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                <span>Stats & Analytics</span>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                {viewsToday.toLocaleString()}
              </span>
            </button>

            {/* NEW TAB: ADS & MONETIZATION */}
            <button
              onClick={() => setActiveTab("ads")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "ads"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>Ads & Monetization</span>
              </div>
              <span className="text-[10px] text-amber-400 font-bold">
                AdSense
              </span>
            </button>

            <button
              onClick={() => setActiveTab("servers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "servers"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ServerIcon className="w-4 h-4" />
                <span>Servers Directory</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {servers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("categories")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "categories"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>Categories</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("blog")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "blog"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-discord-blurple" />
                <span>Blog & Articles</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {blogPosts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "users"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4" />
                <span>Users & Staff</span>
              </div>
              <span className="text-[10px] text-zinc-500 font-mono">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "settings"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site & SEO Config</span>
            </button>

            <button
              onClick={() => setActiveTab("logs")}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === "logs"
                  ? "bg-discord-blurple text-white shadow-glow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              }`}
            >
              <History className="w-4 h-4" />
              <span>Audit History</span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <span>Exit to Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        {/* ==================== TAB: OVERVIEW ==================== */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Dashboard Overview
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Real-time metrics and administration controls for discordserverlink.com
              </p>
            </div>

            {/* Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Total Servers
                </span>
                <p className="text-3xl font-black text-white mt-2">
                  {servers.length}
                </p>
                <div className="mt-2 text-[11px] text-discord-green font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{servers.filter((s) => s.status === "APPROVED").length} Approved & Live</span>
                </div>
              </div>

              {/* Views Today Overview Card */}
              <div
                onClick={() => setActiveTab("stats")}
                className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800 cursor-pointer hover:border-discord-blurple/50 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Views Today
                  </span>
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-3xl font-black text-emerald-400 mt-2">
                  {viewsToday.toLocaleString()}
                </p>
                <div className="mt-2 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <span className={`font-bold ${isPositiveGrowth ? "text-emerald-400" : "text-red-400"}`}>
                    {isPositiveGrowth ? `+${pctGrowth}%` : `${pctGrowth}%`}
                  </span>
                  <span>vs yesterday ({viewsYesterday.toLocaleString()})</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Members Indexed
                </span>
                <p className="text-3xl font-black text-discord-blurple mt-2">
                  {stats.totalMembers.toLocaleString()}
                </p>
                <div className="mt-2 text-[11px] text-zinc-400">
                  Across all community listings
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-zinc-900/70 border border-zinc-800">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Registered Users
                </span>
                <p className="text-3xl font-black text-white mt-2">
                  {users.length}
                </p>
                <div className="mt-2 text-[11px] text-zinc-400">
                  {users.filter((u) => u.role === "ADMIN").length} Admins & Staff
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Servers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Quick Actions */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Quick Administration
                </h3>
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveTab("stats")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 text-xs font-bold transition"
                  >
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>View Traffic & Page-Wise Stats</span>
                    </span>
                    <span>→</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("ads")}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 text-xs font-bold transition"
                  >
                    <span className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-amber-400" />
                      <span>Configure AdSense & ads.txt</span>
                    </span>
                    <span>→</span>
                  </button>

                  <Link
                    href="/servers/new"
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow-sm"
                  >
                    <span>+ Add New Discord Server</span>
                    <PlusCircle className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => {
                      setShowCatModal(true);
                      setActiveTab("categories");
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                  >
                    <span>+ Create New Category</span>
                    <Layers className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Moderation Spotlight */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Recent Server Submissions
                  </h3>
                  <button
                    onClick={() => setActiveTab("servers")}
                    className="text-xs text-discord-blurple hover:underline font-semibold"
                  >
                    View All ({servers.length}) →
                  </button>
                </div>

                <div className="divide-y divide-zinc-800/80">
                  {servers.slice(0, 5).map((server) => (
                    <div
                      key={server.id}
                      className="py-3 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {server.iconUrl ? (
                          <img
                            src={server.iconUrl}
                            alt=""
                            className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300 flex-shrink-0">
                            {server.name.slice(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">
                            {server.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            /{server.categorySlug} • {server.memberCount?.toLocaleString()} members
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            server.status === "APPROVED"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : server.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20"
                          }`}
                        >
                          {server.status}
                        </span>
                        <Link
                          href={`/server/${server.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ==================== TAB: STATS & ANALYTICS ============= */}
        {/* ========================================================= */}
        {activeTab === "stats" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400 mb-2">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Real-Time Platform Analytics</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Traffic Stats & Analytics
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Monitor live visits, daily comparative volume, page-by-page traffic, and video assets
                </p>
              </div>

              <button
                onClick={() => setShowVideoModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow-sm self-start sm:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Add Video Guide</span>
              </button>
            </div>

            {/* Primary KPI Metrics: Views Today, Yesterday Views, Total Views, Total Videos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Views Today */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 border border-emerald-500/30 relative overflow-hidden shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <span>Views Today</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <Eye className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-4xl font-black text-white mt-3">
                  {viewsToday.toLocaleString()}
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 rounded-lg font-bold flex items-center gap-1 ${
                    isPositiveGrowth
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}>
                    <TrendingUp className="w-3 h-3" />
                    {isPositiveGrowth ? `+${pctGrowth}%` : `${pctGrowth}%`}
                  </span>
                  <span className="text-zinc-400 text-[11px]">vs yesterday</span>
                </div>
              </div>

              {/* Yesterday Views */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <span>Yesterday Views</span>
                  <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300">
                    <History className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-4xl font-black text-zinc-200 mt-3">
                  {viewsYesterday.toLocaleString()}
                </p>
                <p className="mt-3 text-[11px] text-zinc-500 font-medium">
                  Full 24-hour baseline completed
                </p>
              </div>

              {/* Total Views (All-Time) */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <span>Total Views (All-Time)</span>
                  <div className="w-8 h-8 rounded-xl bg-discord-blurple/10 flex items-center justify-center text-discord-blurple">
                    <Globe className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-4xl font-black text-discord-blurple mt-3">
                  {(analytics?.totalViews || 0).toLocaleString()}
                </p>
                <p className="mt-3 text-[11px] text-zinc-500 font-medium">
                  Cumulative recorded directory visits
                </p>
              </div>

              {/* Total Videos */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 shadow-xl">
                <div className="flex items-center justify-between text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  <span>Total Videos</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                    <Video className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-4xl font-black text-amber-400 mt-3">
                  {videos.length}
                </p>
                <p className="mt-3 text-[11px] text-zinc-500 font-medium">
                  {videos.reduce((a, b) => a + (b.viewsCount || 0), 0).toLocaleString()} total video impressions
                </p>
              </div>
            </div>

            {/* Page-Wise Views Breakdown Table */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <FileCode className="w-5 h-5 text-discord-blurple" />
                    <span>Page-Wise Traffic Breakdown</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Individual URL performance comparing Today vs. Yesterday vs. All-Time
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Search Page Path */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter path (e.g. /category/)..."
                      value={pageSearch}
                      onChange={(e) => setPageSearch(e.target.value)}
                      className="bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-discord-blurple w-48 sm:w-56"
                    />
                  </div>

                  {/* Sort Controls */}
                  <div className="inline-flex rounded-xl bg-zinc-950 p-1 border border-zinc-800 text-xs">
                    <button
                      onClick={() => setPageSort("today")}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        pageSort === "today"
                          ? "bg-discord-blurple text-white shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setPageSort("yesterday")}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        pageSort === "yesterday"
                          ? "bg-discord-blurple text-white shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Yesterday
                    </button>
                    <button
                      onClick={() => setPageSort("allTime")}
                      className={`px-3 py-1 rounded-lg font-bold transition ${
                        pageSort === "allTime"
                          ? "bg-discord-blurple text-white shadow"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      All-Time
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/70">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                      <tr>
                        <th className="py-3.5 px-4 font-bold">Page Path</th>
                        <th className="py-3.5 px-4 font-bold">Section</th>
                        <th className="py-3.5 px-4 font-bold text-right text-emerald-400">
                          Views Today
                        </th>
                        <th className="py-3.5 px-4 font-bold text-right text-zinc-300">
                          Yesterday Views
                        </th>
                        <th className="py-3.5 px-4 font-bold text-right text-discord-blurple">
                          All-Time Views
                        </th>
                        <th className="py-3.5 px-4 font-bold">Traffic Share</th>
                        <th className="py-3.5 px-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60 font-mono">
                      {pageWiseList.length > 0 ? (
                        pageWiseList.map((item) => {
                          const badge = getPageTypeLabel(item.path);
                          const totalAllViews = analytics?.totalViews || 1;
                          const pctShare = Math.min(
                            100,
                            Math.round((item.allTime / totalAllViews) * 100)
                          );

                          return (
                            <tr
                              key={item.path}
                              className="hover:bg-zinc-900/40 transition font-sans"
                            >
                              <td className="py-3 px-4 font-mono font-bold text-white text-xs">
                                {item.path}
                              </td>

                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badge.color}`}
                                >
                                  {badge.label}
                                </span>
                              </td>

                              <td className="py-3 px-4 text-right font-mono font-black text-emerald-400">
                                {item.today.toLocaleString()}
                              </td>

                              <td className="py-3 px-4 text-right font-mono text-zinc-300">
                                {item.yesterday.toLocaleString()}
                              </td>

                              <td className="py-3 px-4 text-right font-mono font-bold text-discord-blurple">
                                {item.allTime.toLocaleString()}
                              </td>

                              <td className="py-3 px-4 min-w-[140px]">
                                <div className="flex items-center gap-2">
                                  <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                                    <div
                                      className="bg-discord-blurple h-full rounded-full transition-all duration-500"
                                      style={{ width: `${Math.max(5, pctShare)}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-mono text-zinc-400 w-8 text-right">
                                    {pctShare}%
                                  </span>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-right font-sans">
                                <Link
                                  href={item.path}
                                  target="_blank"
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold transition"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-8 text-center text-zinc-500 font-sans"
                          >
                            No pages match your search filter "{pageSearch}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Device Distribution & Real-Time Hits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Device Breakdown */}
              <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-discord-blurple" />
                  <span>Traffic by Device</span>
                </h3>

                <div className="space-y-4 pt-2">
                  {/* Desktop */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Desktop</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {(analytics?.deviceStats?.desktop || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-discord-blurple h-full rounded-full"
                        style={{
                          width: `${Math.round(
                            ((analytics?.deviceStats?.desktop || 0) /
                              Math.max(1, analytics?.totalViews || 1)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Mobile */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Mobile</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {(analytics?.deviceStats?.mobile || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{
                          width: `${Math.round(
                            ((analytics?.deviceStats?.mobile || 0) /
                              Math.max(1, analytics?.totalViews || 1)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Tablet */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2 text-zinc-300">
                        <Tablet className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Tablet</span>
                      </span>
                      <span className="font-mono font-bold text-white">
                        {(analytics?.deviceStats?.tablet || 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{
                          width: `${Math.round(
                            ((analytics?.deviceStats?.tablet || 0) /
                              Math.max(1, analytics?.totalViews || 1)) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time recent visitor stream */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Recent Visitor Log</span>
                  </h3>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Latest 15 Page Hits
                  </span>
                </div>

                <div className="divide-y divide-zinc-800/60 max-h-60 overflow-y-auto">
                  {(analytics?.recentVisitors || []).slice(0, 15).map((log) => (
                    <div
                      key={log.id}
                      className="py-2.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex items-center gap-2.5">
                        {log.device === "mobile" ? (
                          <Smartphone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : log.device === "tablet" ? (
                          <Tablet className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5 text-discord-blurple flex-shrink-0" />
                        )}
                        <span className="font-mono font-bold text-white truncate">
                          {log.path}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 flex-shrink-0">
                        <span className="truncate max-w-[120px] hidden sm:inline">
                          {log.referrer ? log.referrer.replace(/^https?:\/\/(www\.)?/, "") : "Direct"}
                        </span>
                        <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Media Showcase Management */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-amber-400" />
                    <span>Platform Videos & Media ({videos.length})</span>
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Embed video guides, Discord tutorials, and community spotlights
                  </p>
                </div>

                <button
                  onClick={() => setShowVideoModal(true)}
                  className="px-4 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow-sm self-start sm:self-auto flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {videos.map((vid) => (
                  <div
                    key={vid.id}
                    className="rounded-2xl bg-zinc-950/70 border border-zinc-800 overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {vid.thumbnail && (
                        <div className="h-32 w-full relative overflow-hidden bg-zinc-900">
                          <img
                            src={vid.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white">
                            {vid.platform}
                          </span>
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/80 text-zinc-300">
                            {vid.viewsCount?.toLocaleString()} views
                          </span>
                        </div>
                      )}
                      <div className="p-4 space-y-1.5">
                        <h4 className="text-xs font-bold text-white line-clamp-2">
                          {vid.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400">
                          Category: #{vid.categorySlug || "community"}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 border-t border-zinc-800/80 flex items-center justify-between mt-2">
                      <Link
                        href={vid.url}
                        target="_blank"
                        className="text-xs font-bold text-discord-blurple hover:underline flex items-center gap-1"
                      >
                        <span>Watch Video</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => handleDeleteVideo(vid.id, vid.title)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* ==================== TAB: ADS & MONETIZATION ============ */}
        {/* ========================================================= */}
        {activeTab === "ads" && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400 mb-2">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Monetization & Ad Networks</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Ads & Monetization Control
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Configure Google AdSense slots, header/footer ad placements, ads.txt verification, and head code
                </p>
              </div>

              <button
                type="submit"
                disabled={settingsLoading}
                className="px-6 py-2.5 rounded-xl bg-discord-green hover:bg-emerald-500 text-zinc-950 font-bold text-xs transition flex items-center gap-2 shadow-lg self-start sm:self-auto"
              >
                <Save className="w-4 h-4" />
                <span>{settingsLoading ? "Saving..." : "Save All Ads Settings"}</span>
              </button>
            </div>

            {/* Google AdSense Publisher Setup */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Google AdSense Account Integration</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Connect your official Google AdSense publisher ID to auto-monetize
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Google AdSense
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    AdSense Publisher Client ID
                  </label>
                  <input
                    type="text"
                    placeholder="ca-pub-8893452174092183"
                    value={settings.adsense_client_id || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, adsense_client_id: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-discord-blurple"
                  />
                  <p className="text-[11px] text-zinc-500 mt-1">
                    Found in your Google AdSense dashboard under Account &gt; Settings
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800">
                    <input
                      type="checkbox"
                      id="adsense_auto"
                      checked={settings.adsense_auto_ads_enabled === "true"}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          adsense_auto_ads_enabled: e.target.checked ? "true" : "false",
                        })
                      }
                      className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 text-discord-blurple focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="adsense_auto" className="text-xs font-bold text-zinc-200 cursor-pointer">
                      Enable AdSense Auto Ads
                      <span className="block text-[11px] font-normal text-zinc-400 mt-0.5">
                        Google automatically optimizes placements across public pages
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Ad Spaces (Header, In-Feed, Sidebar, Footer) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-discord-blurple" />
                  <span>Custom Ad Spaces & Placements</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Insert responsive banner HTML or custom ad network codes in high-converting zones
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Header Leaderboard Ad */}
                <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        1. Header Leaderboard Banner (728x90)
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Placed below navbar on all public pages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.ad_header_enabled === "true"}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ad_header_enabled: e.target.checked ? "true" : "false",
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-green"></div>
                    </label>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="<!-- Paste Google AdSense or Custom Ad HTML here -->"
                    value={settings.ad_header_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, ad_header_code: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                {/* 2. In-Feed Grid Ad */}
                <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        2. In-Feed Server Grid Ad Card
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Embedded directly inside server directory cards
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.ad_infeed_enabled === "true"}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ad_infeed_enabled: e.target.checked ? "true" : "false",
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-green"></div>
                    </label>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="<!-- Paste In-Feed Ad Unit HTML code here -->"
                    value={settings.ad_infeed_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, ad_infeed_code: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                {/* 3. Sidebar Ad */}
                <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        3. Sidebar / Detail Ad (300x250)
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Displayed on server profile pages & category sidebars
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.ad_sidebar_enabled === "true"}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ad_sidebar_enabled: e.target.checked ? "true" : "false",
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-green"></div>
                    </label>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="<!-- Paste Sidebar Ad Unit HTML code here -->"
                    value={settings.ad_sidebar_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, ad_sidebar_code: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                {/* 4. Footer Leaderboard Ad */}
                <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        4. Bottom Footer Leaderboard Ad
                      </h4>
                      <p className="text-[10px] text-zinc-500">
                        Placed right above site footer on all pages
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.ad_footer_enabled === "true"}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            ad_footer_enabled: e.target.checked ? "true" : "false",
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-discord-green"></div>
                    </label>
                  </div>

                  <textarea
                    rows={4}
                    placeholder="<!-- Paste Footer Ad Unit HTML code here -->"
                    value={settings.ad_footer_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, ad_footer_code: e.target.value })
                    }
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[11px] font-mono text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic ads.txt Code Editor */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Dynamic ads.txt Editor</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Served live at <code className="text-discord-blurple">/ads.txt</code> for Google AdSense and Authorized Digital Sellers crawler
                  </p>
                </div>

                <Link
                  href="/ads.txt"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-200 transition self-start sm:self-auto"
                >
                  <span>Test Live /ads.txt</span>
                  <ExternalLink className="w-3.5 h-3.5 text-discord-blurple" />
                </Link>
              </div>

              <textarea
                rows={5}
                placeholder="google.com, pub-8893452174092183, DIRECT, f08c47fec0942fa0"
                value={settings.ads_txt_code || ""}
                onChange={(e) =>
                  setSettings({ ...settings, ads_txt_code: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-discord-blurple leading-relaxed"
              />

              <div className="flex items-center justify-between text-[11px] text-zinc-500">
                <span>Standard AdSense Format: <code className="text-zinc-400">google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code></span>
                <button
                  type="button"
                  onClick={() => {
                    const snippet = `google.com, ${settings.adsense_client_id || "pub-8893452174092183"}, DIRECT, f08c47fec0942fa0`;
                    setSettings({ ...settings, ads_txt_code: snippet });
                    showToast("Pasted default AdSense ads.txt format!");
                  }}
                  className="text-discord-blurple hover:underline font-bold"
                >
                  Insert Default AdSense Template
                </button>
              </div>
            </div>

            {/* Head Code & Script Injection */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span>Head Code & Script Injection</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Inject custom scripts, meta verification tags, and analytics beacons directly into platform HTML
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>HTML &lt;head&gt; Code Injection</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      Injected inside &lt;head&gt; across all public pages
                    </span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder={`<!-- Google tag (gtag.js) -->\n<script async src="https://pagead2.googlesyndication.com/..."></script>\n<meta name="google-site-verification" content="..." />`}
                    value={settings.head_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, head_code: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-discord-blurple leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5 flex items-center justify-between">
                    <span>Footer / &lt;body&gt; End Code Injection</span>
                    <span className="text-[10px] text-zinc-500 font-normal">
                      Injected right before &lt;/body&gt; closing tag
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="<!-- Custom chat widget, retargeting pixel, or footer scripts -->"
                    value={settings.body_end_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, body_end_code: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-discord-blurple leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Other Essentials (GA4, Search Console) */}
            <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Other SEO & Analytics Essentials</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Verified platform credentials for search engines and webmaster tools
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Google Analytics 4 Measurement ID
                  </label>
                  <input
                    type="text"
                    placeholder="G-DSL8893452"
                    value={settings.google_analytics_id || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, google_analytics_id: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Google Search Console Verification Token
                  </label>
                  <input
                    type="text"
                    placeholder="GSC-DISCORD-SERVER-LINK-VERIFICATION-TOKEN-2026"
                    value={settings.google_verification_code || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, google_verification_code: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-discord-blurple"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={settingsLoading}
              className="px-8 py-3.5 rounded-xl bg-discord-green hover:bg-emerald-500 text-zinc-950 font-bold text-sm transition flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{settingsLoading ? "Saving All Changes..." : "Save All Ads & Essentials"}</span>
            </button>
          </form>
        )}

        {/* ==================== TAB: SERVERS DIRECTORY ============= */}
        {activeTab === "servers" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Servers Directory ({servers.length})
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Approve, feature, edit, or remove Discord server listings
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/servers/new"
                  className="px-4 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition flex items-center gap-1.5 shadow-glow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Add Server</span>
                </Link>
              </div>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by server name, slug, or Discord Guild ID..."
                  value={serverSearch}
                  onChange={(e) => setServerSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                />
              </div>

              <select
                value={serverStatusFilter}
                onChange={(e) => setServerStatusFilter(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 font-semibold focus:outline-none focus:border-discord-blurple"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPROVED">Approved Only</option>
                <option value="PENDING">Pending Approval</option>
                <option value="REJECTED">Rejected</option>
                <option value="BANNED">Banned</option>
              </select>
            </div>

            {/* Servers Table */}
            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/60 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                    <tr>
                      <th className="py-3 px-4">Community</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Members</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Badges</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {filteredServers.map((server) => (
                      <tr key={server.id} className="hover:bg-zinc-900/40 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {server.iconUrl ? (
                              <img
                                src={server.iconUrl}
                                alt=""
                                className="w-8 h-8 rounded-xl object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                                {server.name.slice(0, 2)}
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white">{server.name}</p>
                              <p className="text-[10px] font-mono text-zinc-500">
                                /{server.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 text-[11px] font-medium">
                            {server.categorySlug}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-zinc-300">
                          {server.memberCount?.toLocaleString() || 0}
                        </td>

                        <td className="py-3 px-4">
                          <select
                            value={server.status}
                            onChange={(e) =>
                              handleChangeServerStatus(server.id, e.target.value)
                            }
                            className={`px-2 py-1 rounded-lg text-xs font-bold border ${
                              server.status === "APPROVED"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : server.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                                : "bg-red-500/10 text-red-400 border-red-500/30"
                            }`}
                          >
                            <option value="APPROVED">APPROVED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="REJECTED">REJECTED</option>
                            <option value="BANNED">BANNED</option>
                          </select>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                handleToggleServerFlag(
                                  server.id,
                                  "isFeatured",
                                  server.isFeatured
                                )
                              }
                              title="Toggle Featured"
                              className={`p-1 rounded-md text-[10px] font-bold border transition ${
                                server.isFeatured
                                  ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                                  : "bg-zinc-800 text-zinc-500 border-transparent hover:text-zinc-300"
                              }`}
                            >
                              ⭐ Feat
                            </button>

                            <button
                              onClick={() =>
                                handleToggleServerFlag(
                                  server.id,
                                  "isVerified",
                                  server.isVerified
                                )
                              }
                              title="Toggle Verified"
                              className={`p-1 rounded-md text-[10px] font-bold border transition ${
                                server.isVerified
                                  ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                                  : "bg-zinc-800 text-zinc-500 border-transparent hover:text-zinc-300"
                              }`}
                            >
                              ✓ Verif
                            </button>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              href={`/server/${server.slug}`}
                              target="_blank"
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            <button
                              onClick={() => setEditingServer(server)}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteServer(server.id, server.name)
                              }
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: CATEGORIES ==================== */}
        {activeTab === "categories" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  Categories ({categories.length})
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Directory hierarchy and SEO landing pages
                </p>
              </div>

              <button
                onClick={() => setShowCatModal(true)}
                className="px-4 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition flex items-center gap-1.5 shadow-glow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ New Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-zinc-800 text-discord-blurple font-bold">
                        /{c.slug}
                      </span>
                      <span className="text-[10px] text-zinc-500">
                        Icon: {c.icon}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{c.name}</h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {c.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                    <Link
                      href={`/category/${c.slug}`}
                      target="_blank"
                      className="text-xs text-discord-blurple hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>Preview Page</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB: BLOG & ARTICLES ==================== */}
        {activeTab === "blog" && (
          <AdminBlogManager initialPosts={blogPosts} showToast={showToast} />
        )}

        {/* ==================== TAB: USERS ==================== */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Users & Permissions
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Manage server owners, assign Admin/Moderator roles, or suspend abusive accounts
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Servers Owned</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img
                              src={u.image}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-300">
                              {u.name?.slice(0, 2) || "US"}
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-white">{u.name || u.username}</p>
                            <p className="text-[11px] text-zinc-500">{u.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleUpdateUserRole(u.id, e.target.value)
                          }
                          className="px-2 py-1 rounded-lg text-xs font-bold border border-zinc-700 bg-zinc-900 text-zinc-200"
                        >
                          <option value="USER">USER</option>
                          <option value="MODERATOR">MODERATOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-300">
                        {u._count?.servers || 0}
                      </td>

                      <td className="py-3.5 px-4">
                        {u.banned ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            SUSPENDED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ACTIVE
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleToggleBanUser(u.id, u.banned)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition ${
                            u.banned
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-red-500/10 text-red-400 border-red-500/30"
                          }`}
                        >
                          {u.banned ? "Unban Account" : "Suspend Account"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB: GENERAL SETTINGS ============== */}
        {activeTab === "settings" && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Site & SEO Configuration
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Customize platform branding, Google metadata, and cooldown parameters
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
                General Branding & Domain
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                    Platform Name
                  </label>
                  <input
                    type="text"
                    value={settings.site_name || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_name: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                    Primary Domain
                  </label>
                  <input
                    type="text"
                    value={settings.site_domain || ""}
                    onChange={(e) =>
                      setSettings({ ...settings, site_domain: e.target.value })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  Hero Tagline
                </label>
                <input
                  type="text"
                  value={settings.site_tagline || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, site_tagline: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
                Directory Rules & Bumping
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                    Bump Cooldown (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={settings.bump_cooldown_hours || "2"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        bump_cooldown_hours: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                    Require Admin Approval for New Servers?
                  </label>
                  <select
                    value={settings.require_server_approval || "false"}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        require_server_approval: e.target.value,
                      })
                    }
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  >
                    <option value="false">No (Instant publish upon submission)</option>
                    <option value="true">Yes (Must be approved by Admin/Mod)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
                Homepage Announcement Bar
              </h3>

              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  id="ann-check"
                  checked={settings.announcement_banner_enabled === "true"}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      announcement_banner_enabled: e.target.checked
                        ? "true"
                        : "false",
                    })
                  }
                  className="rounded bg-zinc-950 border-zinc-800 text-discord-blurple focus:ring-0"
                />
                <label htmlFor="ann-check" className="text-xs font-bold text-zinc-200">
                  Enable Announcement Banner
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  Announcement Text
                </label>
                <input
                  type="text"
                  value={settings.announcement_text || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, announcement_text: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  Announcement Target Link
                </label>
                <input
                  type="text"
                  value={settings.announcement_link || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, announcement_link: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                />
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-zinc-800">
                Google SEO Metadata
              </h3>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  Default Meta Title
                </label>
                <input
                  type="text"
                  value={settings.seo_meta_title || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, seo_meta_title: e.target.value })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-400 mb-1.5">
                  Default Meta Description
                </label>
                <textarea
                  rows={3}
                  value={settings.seo_meta_description || ""}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      seo_meta_description: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={settingsLoading}
              className="px-8 py-3.5 rounded-xl bg-discord-green hover:bg-emerald-500 text-zinc-950 font-bold text-sm transition flex items-center gap-2 shadow-lg"
            >
              <Save className="w-4 h-4" />
              <span>{settingsLoading ? "Saving..." : "Save All Settings"}</span>
            </button>
          </form>
        )}

        {/* ==================== TAB: AUDIT LOGS ==================== */}
        {activeTab === "logs" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Audit History & Logs
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Moderator and administration activity trail
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 overflow-hidden bg-zinc-950/60 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/90 text-zinc-400 uppercase tracking-wider text-[10px] border-b border-zinc-800">
                  <tr>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Target</th>
                    <th className="py-3 px-4">Details</th>
                    <th className="py-3 px-4">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-900/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-discord-blurple">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-zinc-300">
                        {log.targetType || "System"}{" "}
                        {log.targetId && `(${log.targetId.slice(0, 8)}...)`}
                      </td>
                      <td className="py-3 px-4 text-zinc-400 font-mono text-[11px] truncate max-w-xs">
                        {log.details || "-"}
                      </td>
                      <td className="py-3 px-4 text-zinc-500 text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ==================== MODAL: ADD VIDEO ==================== */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleCreateVideo}
            className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-400" />
                <span>Add Video Asset / Guide</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Video Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. How to Setup Discord Server Bots (2026 Tutorial)"
                value={newVideoTitle}
                onChange={(e) => setNewVideoTitle(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Video URL (YouTube / TikTok / Discord)
              </label>
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={newVideoUrl}
                onChange={(e) => setNewVideoUrl(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Thumbnail URL
              </label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/photo-..."
                value={newVideoThumb}
                onChange={(e) => setNewVideoThumb(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Platform
                </label>
                <select
                  value={newVideoPlatform}
                  onChange={(e) => setNewVideoPlatform(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                >
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                  <option value="discord">Discord Clip</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={newVideoCategory}
                  onChange={(e) => setNewVideoCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Initial Views Count
              </label>
              <input
                type="number"
                value={newVideoViews}
                onChange={(e) => setNewVideoViews(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowVideoModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={videoLoading}
                className="px-5 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-xs font-bold text-white shadow-glow-sm"
              >
                {videoLoading ? "Adding..." : "Add Video"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL: ADD CATEGORY ==================== */}
      {showCatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <form
            onSubmit={handleCreateCategory}
            className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white">Create New Category</h3>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Category Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sports & Fitness"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Icon Name (Lucide Icon)
              </label>
              <input
                type="text"
                placeholder="e.g. Trophy, Compass, Gamepad2"
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                required
                placeholder="Short description for SEO and category page..."
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setShowCatModal(false)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={catLoading}
                className="px-5 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-xs font-bold text-white shadow-glow-sm"
              >
                {catLoading ? "Creating..." : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ==================== MODAL: EDIT SERVER ==================== */}
      {editingServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <form
            onSubmit={handleSaveEditServer}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white">
              Edit Server: {editingServer.name}
            </h3>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Server Name
              </label>
              <input
                type="text"
                required
                value={editingServer.name || ""}
                onChange={(e) =>
                  setEditingServer({ ...editingServer, name: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Short Description
              </label>
              <input
                type="text"
                required
                value={editingServer.shortDescription || ""}
                onChange={(e) =>
                  setEditingServer({
                    ...editingServer,
                    shortDescription: e.target.value,
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 mb-1">
                Full Description
              </label>
              <textarea
                rows={4}
                value={editingServer.longDescription || ""}
                onChange={(e) =>
                  setEditingServer({
                    ...editingServer,
                    longDescription: e.target.value,
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Category
                </label>
                <select
                  value={editingServer.categorySlug || "gaming"}
                  onChange={(e) =>
                    setEditingServer({
                      ...editingServer,
                      categorySlug: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                >
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1">
                  Status
                </label>
                <select
                  value={editingServer.status || "APPROVED"}
                  onChange={(e) =>
                    setEditingServer({
                      ...editingServer,
                      status: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                >
                  <option value="APPROVED">APPROVED</option>
                  <option value="PENDING">PENDING</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="BANNED">BANNED</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-800">
              <button
                type="button"
                onClick={() => setEditingServer(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={editLoading}
                className="px-5 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-xs font-bold text-white shadow-glow-sm"
              >
                {editLoading ? "Saving..." : "Save Server Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
