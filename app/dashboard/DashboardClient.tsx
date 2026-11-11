"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Server,
  Bot,
  Eye,
  Rocket,
  Users,
  Sparkles,
  ExternalLink,
  Trash2,
  Clock,
  ShieldCheck,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  MessageSquare,
  Flame,
  Award,
  Layers,
  HelpCircle,
  X,
  Send,
  Loader2,
  ArrowRight,
  RefreshCw,
  Check,
  Shield,
  Search,
} from "lucide-react";

const CATEGORY_OPTIONS = [
  { slug: "community", name: "Community & Hangout" },
  { slug: "gaming", name: "Gaming" },
  { slug: "anime", name: "Anime & Manga" },
  { slug: "technology", name: "Technology & Coding" },
  { slug: "music", name: "Music" },
  { slug: "crypto", name: "Crypto & Trading" },
  { slug: "art", name: "Art & Design" },
  { slug: "education", name: "Education & Study" },
  { slug: "roleplay", name: "Roleplay & Lore" },
  { slug: "movies-entertainment", name: "Movies & Entertainment" },
  { slug: "esports-tournaments", name: "eSports & Tournaments" },
  { slug: "artificial-intelligence", name: "Artificial Inteligence" },
  { slug: "sports-fitness", name: "Sports & Fitness" },
  { slug: "movies-television", name: "Movies & Television" },
  { slug: "podcasts-talk", name: "Podcasts & Talk" },
  { slug: "memes-humor", name: "Memes & Humor" },
];

interface DashboardClientProps {
  user: any;
  initialServers: any[];
  initialBots: any[];
  initialPromotions: any[];
}

export default function DashboardClient({
  user,
  initialServers,
  initialBots,
  initialPromotions,
}: DashboardClientProps) {
  const [servers, setServers] = useState<any[]>(initialServers);
  const [bots, setBots] = useState<any[]>(initialBots);
  const [promotions, setPromotions] = useState<any[]>(initialPromotions);
  const [activeTab, setActiveTab] = useState<"servers" | "discord-guilds" | "bots" | "promotions">("servers");

  // Discord Guilds Sync State
  const [discordGuilds, setDiscordGuilds] = useState<any[]>([]);
  const [loadingGuilds, setLoadingGuilds] = useState(false);
  const [guildsError, setGuildsError] = useState<string | null>(null);
  const [guildSearch, setGuildSearch] = useState("");
  const [guildFilter, setGuildFilter] = useState<"all" | "unlisted" | "listed">("all");

  // Quick-Add Server Modal State
  const [quickAddModalOpen, setQuickAddModalOpen] = useState(false);
  const [selectedGuildToAdd, setSelectedGuildToAdd] = useState<any>(null);
  const [quickInviteUrl, setQuickInviteUrl] = useState("");
  const [quickCategory, setQuickCategory] = useState("community");
  const [quickShortDesc, setQuickShortDesc] = useState("");
  const [quickTags, setQuickTags] = useState("");
  const [isSubmittingServer, setIsSubmittingServer] = useState(false);
  const [quickAddStatus, setQuickAddStatus] = useState<{
    type: "success" | "error";
    message: string;
    slug?: string;
  } | null>(null);

  // Promotion Modal State
  const [promoteModalOpen, setPromoteModalOpen] = useState(false);
  const [selectedServerForPromo, setSelectedServerForPromo] = useState<any>(null);
  const [promoPlan, setPromoPlan] = useState<"1_month" | "3_months">("1_month");
  const [promoContact, setPromoContact] = useState(user?.name ? `@${user.name}` : "");
  const [promoNotes, setPromoNotes] = useState("");
  const [isSubmittingPromo, setIsSubmittingPromo] = useState(false);
  const [promoStatus, setPromoStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: "server" | "bot"; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch Discord Guilds
  const fetchDiscordGuilds = async () => {
    setLoadingGuilds(true);
    setGuildsError(null);
    try {
      const res = await fetch("/api/dashboard/discord-guilds");
      const data = await res.json();
      if (!res.ok) {
        setGuildsError(data.message || data.error || "Failed to load Discord servers.");
      } else {
        setDiscordGuilds(data.guilds || []);
      }
    } catch {
      setGuildsError("Network error fetching Discord servers.");
    } finally {
      setLoadingGuilds(false);
    }
  };

  useEffect(() => {
    fetchDiscordGuilds();
  }, []);

  const unlistedGuildsCount = discordGuilds.filter((g) => !g.isListed).length;

  const handleOpenQuickAdd = (guild: any) => {
    setSelectedGuildToAdd(guild);
    setQuickInviteUrl("");
    setQuickShortDesc(`Official Discord community for ${guild.name}. Connect, chat, and hangout with fellow members!`);
    setQuickTags("community, chat, hangout");
    setQuickCategory("community");
    setQuickAddStatus(null);
    setQuickAddModalOpen(true);
  };

  const handleQuickAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuildToAdd || !quickInviteUrl.trim() || !quickShortDesc.trim()) return;

    setIsSubmittingServer(true);
    setQuickAddStatus(null);

    try {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedGuildToAdd.name,
          guildId: selectedGuildToAdd.id,
          iconUrl: selectedGuildToAdd.iconUrl || "",
          inviteUrl: quickInviteUrl.trim(),
          categorySlug: quickCategory,
          shortDescription: quickShortDesc.trim(),
          longDescription: quickShortDesc.trim(),
          tags: quickTags.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setQuickAddStatus({
          type: "error",
          message: data.error || "Failed to publish server.",
        });
      } else {
        setQuickAddStatus({
          type: "success",
          message: `Server "${selectedGuildToAdd.name}" listed successfully on DiscordServerLink!`,
          slug: data.server?.slug,
        });

        if (data.server) {
          setServers((prev) => [data.server, ...prev]);
        }

        setDiscordGuilds((prev) =>
          prev.map((g) =>
            g.id === selectedGuildToAdd.id
              ? { ...g, isListed: true, listedServer: data.server }
              : g
          )
        );
      }
    } catch {
      setQuickAddStatus({
        type: "error",
        message: "Network error listing server.",
      });
    } finally {
      setIsSubmittingServer(false);
    }
  };

  // Aggregate Stats
  const totalServers = servers.length;
  const totalBots = bots.length;
  const totalViews = servers.reduce((acc, s) => acc + (s.viewsCount || 0), 0);
  const totalJoins = servers.reduce((acc, s) => acc + (s.joinsCount || 0), 0);
  const totalBumps = servers.reduce((acc, s) => acc + (s.bumpsCount || 0), 0);

  // Handle Promotion Request Submission
  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServerForPromo || !promoContact.trim()) return;

    setIsSubmittingPromo(true);
    setPromoStatus(null);

    try {
      const res = await fetch("/api/dashboard/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serverId: selectedServerForPromo.id,
          plan: promoPlan,
          contactInfo: promoContact.trim(),
          notes: promoNotes.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPromoStatus({ type: "error", message: data.error || "Failed to submit request." });
      } else {
        setPromoStatus({
          type: "success",
          message: data.message || "Promotion request submitted successfully!",
        });
        if (data.promotion) {
          setPromotions([data.promotion, ...promotions]);
          setServers(
            servers.map((s) =>
              s.id === selectedServerForPromo.id
                ? { ...s, promotionRequests: [data.promotion] }
                : s
            )
          );
        }
        setTimeout(() => {
          setPromoteModalOpen(false);
          setPromoStatus(null);
          setPromoNotes("");
        }, 2000);
      }
    } catch {
      setPromoStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setIsSubmittingPromo(false);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);

    try {
      const endpoint =
        itemToDelete.type === "server"
          ? `/api/dashboard/servers/${itemToDelete.id}`
          : `/api/dashboard/bots/${itemToDelete.id}`;

      const res = await fetch(endpoint, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        if (itemToDelete.type === "server") {
          setServers(servers.filter((s) => s.id !== itemToDelete.id));
        } else {
          setBots(bots.filter((b) => b.id !== itemToDelete.id));
        }
        setDeleteModalOpen(false);
        setItemToDelete(null);
      } else {
        alert(data.error || "Failed to delete item.");
      }
    } catch {
      alert("Failed to delete item due to a network error.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Calculate days remaining helper
  const calculateDaysRemaining = (featuredUntil: string | Date | null | undefined) => {
    if (!featuredUntil) return 0;
    const diff = new Date(featuredUntil).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* User Header Profile */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4 relative z-10">
          {user?.image ? (
            <img
              src={user.image}
              alt={user.name || "User Avatar"}
              className="w-16 h-16 rounded-2xl border-2 border-discord-blurple object-cover shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-discord-blurple text-white font-black text-xl flex items-center justify-center shadow-lg">
              {user?.name?.slice(0, 2).toUpperCase() || "US"}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {user?.name || "Community Creator"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{user?.email || "Signed in with Discord"}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative z-10">
          <Link
            href="/servers/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Add Server</span>
          </Link>
          <Link
            href="/bots/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>+ Add Bot</span>
          </Link>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>My Servers</span>
            <Server className="w-4 h-4 text-discord-blurple" />
          </div>
          <p className="text-2xl font-black text-white">{totalServers}</p>
          <p className="text-[11px] text-zinc-500">Live directory listings</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>My Bots</span>
            <Bot className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalBots}</p>
          <p className="text-[11px] text-zinc-500">Developer submissions</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalViews.toLocaleString()}</p>
          <p className="text-[11px] text-zinc-500">Page views received</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Server Bumps</span>
            <Rocket className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalBumps.toLocaleString()}</p>
          <p className="text-[11px] text-zinc-500">Leaderboard boosts</p>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Discord Joins</span>
            <Users className="w-4 h-4 text-discord-green" />
          </div>
          <p className="text-2xl font-black text-white">{totalJoins.toLocaleString()}</p>
          <p className="text-[11px] text-zinc-500">Join button conversions</p>
        </div>
      </div>

      {/* Banner: Discord Account Servers Detected */}
      {unlistedGuildsCount > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-discord-blurple/20 via-indigo-950/30 to-purple-950/20 border border-discord-blurple/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-glow-sm animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-discord-blurple flex items-center justify-center text-white shadow-glow-sm shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>You have {unlistedGuildsCount} Discord server{unlistedGuildsCount > 1 ? "s" : ""} ready to list</span>
                <span className="px-2 py-0.5 rounded-full bg-discord-green/20 text-discord-green border border-discord-green/30 text-[10px] font-black uppercase">
                  1-Click Add
                </span>
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                We detected servers on your Discord account where you hold Administrator permissions. Add them to DiscordServerLink now to start getting members and bumps.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab("discord-guilds")}
            className="px-4 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-xs shadow-glow transition shrink-0 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>View Discord Servers</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("servers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "servers"
              ? "bg-discord-blurple text-white shadow-glow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Server className="w-4 h-4" />
          <span>My Listed Servers ({totalServers})</span>
        </button>

        <button
          onClick={() => setActiveTab("discord-guilds")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "discord-guilds"
              ? "bg-discord-blurple text-white shadow-glow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <svg className="w-4 h-4 fill-current text-indigo-400" viewBox="0 0 127.14 96.36">
            <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
          </svg>
          <span>Add Discord Servers</span>
          {unlistedGuildsCount > 0 ? (
            <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-zinc-950 font-black text-[10px]">
              {unlistedGuildsCount} new
            </span>
          ) : (
            <span className="text-zinc-500 font-mono text-[10px]">({discordGuilds.length})</span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("bots")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "bots"
              ? "bg-discord-blurple text-white shadow-glow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>My Bots ({totalBots})</span>
        </button>

        <button
          onClick={() => setActiveTab("promotions")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            activeTab === "promotions"
              ? "bg-discord-blurple text-white shadow-glow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Promotions &amp; Billing ({promotions.length})</span>
        </button>
      </div>

      {/* TAB 1: MY SERVERS */}
      {activeTab === "servers" && (
        <div className="space-y-4">
          {servers.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                <Server className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Discord servers submitted yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  List your Discord community for free to get discovered by thousands of active members.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("discord-guilds")}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow-sm cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Choose from Your Discord Servers</span>
                </button>
                <Link
                  href="/servers/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
                >
                  <span>Manual Form</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {servers.map((server) => {
                const daysRemaining = calculateDaysRemaining(server.featuredUntil);
                const isFeaturedActive = server.isFeatured && (!server.featuredUntil || daysRemaining > 0);
                const hasPendingPromo =
                  !isFeaturedActive &&
                  server.promotionRequests &&
                  server.promotionRequests[0]?.status === "PENDING";

                return (
                  <div
                    key={server.id}
                    className="p-5 sm:p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                  >
                    {/* Server Info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      {server.iconUrl ? (
                        <img
                          src={server.iconUrl}
                          alt={server.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-zinc-800 shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-discord-blurple text-white font-bold text-lg flex items-center justify-center shrink-0">
                          {server.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/server/${server.slug}`}
                            className="text-base font-bold text-white hover:text-discord-blurple transition truncate"
                          >
                            {server.name}
                          </Link>
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-zinc-800 text-zinc-300 capitalize">
                            {server.categorySlug}
                          </span>

                          {/* Featured Plan Badge with Countdown */}
                          {isFeaturedActive && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1 shadow-sm">
                              <Sparkles className="w-3 h-3 fill-current" />
                              <span>Featured Active &bull; {daysRemaining} days remaining</span>
                            </span>
                          )}

                          {hasPendingPromo && (
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>Promotion Pending Review</span>
                            </span>
                          )}

                          {!isFeaturedActive && !hasPendingPromo && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-950 text-zinc-400 border border-zinc-800">
                              Normal Server
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {server.shortDescription}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                          <span>
                            Members: <strong className="text-zinc-200">{server.memberCount.toLocaleString()}</strong>
                          </span>
                          <span>&bull;</span>
                          <span className="text-zinc-400">
                            Last Bumped: {new Date(server.lastBumpedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex items-center gap-4 sm:gap-6 bg-zinc-950/70 border border-zinc-800/80 px-4 py-2.5 rounded-2xl shrink-0 w-full lg:w-auto justify-between lg:justify-start">
                      <div className="text-center">
                        <p className="text-[11px] text-zinc-400">Views</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          <Eye className="w-3 h-3 text-sky-400" />
                          <span>{server.viewsCount.toLocaleString()}</span>
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-[11px] text-zinc-400">Bumps</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                          <Rocket className="w-3 h-3 text-amber-400" />
                          <span>{server.bumpsCount.toLocaleString()}</span>
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-[11px] text-zinc-400">Join Clicks</p>
                        <p className="text-sm font-bold text-emerald-400 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{server.joinsCount.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2.5 shrink-0 w-full lg:w-auto justify-end">
                      {!isFeaturedActive && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedServerForPromo(server);
                            setPromoteModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Sparkles className="w-3.5 h-3.5 fill-current" />
                          <span>Promote Server ($5)</span>
                        </button>
                      )}

                      <Link
                        href={`/server/${server.slug}`}
                        className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setItemToDelete({ type: "server", id: server.id, name: server.name });
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                        title="Delete Server Listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB: DISCORD ACCOUNT SERVERS */}
      {activeTab === "discord-guilds" && (
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <svg className="w-5 h-5 fill-current text-discord-blurple" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
                <span>Discord Account Servers</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-1 max-w-xl">
                These are Discord servers linked to your account where you hold <strong>Owner</strong> or <strong>Administrator</strong> permissions. Click <strong>&ldquo;+ Add to Website&rdquo;</strong> to list them on DiscordServerLink in seconds.
              </p>
            </div>

            <button
              onClick={fetchDiscordGuilds}
              disabled={loadingGuilds}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingGuilds ? "animate-spin text-discord-blurple" : ""}`} />
              <span>{loadingGuilds ? "Syncing..." : "Sync from Discord"}</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          {discordGuilds.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-zinc-900/60 p-3 rounded-2xl border border-zinc-800">
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <button
                  onClick={() => setGuildFilter("all")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    guildFilter === "all"
                      ? "bg-zinc-800 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  All ({discordGuilds.length})
                </button>
                <button
                  onClick={() => setGuildFilter("unlisted")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                    guildFilter === "unlisted"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  <span>Ready to List</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-zinc-950 text-[10px] font-black">
                    {unlistedGuildsCount}
                  </span>
                </button>
                <button
                  onClick={() => setGuildFilter("listed")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    guildFilter === "listed"
                      ? "bg-zinc-800 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Already Listed ({discordGuilds.filter((g) => g.isListed).length})
                </button>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter servers..."
                  value={guildSearch}
                  onChange={(e) => setGuildSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loadingGuilds && discordGuilds.length === 0 && (
            <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-3">
              <Loader2 className="w-8 h-8 text-discord-blurple animate-spin mx-auto" />
              <p className="text-sm font-bold text-white">Connecting to Discord API...</p>
              <p className="text-xs text-zinc-400">Fetching servers where you have Administrator permissions.</p>
            </div>
          )}

          {/* Error State */}
          {guildsError && (
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>{guildsError}</span>
              </div>
              <button
                onClick={fetchDiscordGuilds}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition shrink-0 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loadingGuilds && discordGuilds.length === 0 && !guildsError && (
            <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-white">No Manageable Servers Detected</h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We could not find any Discord servers where you are the Owner or have Administrator/Manage Server permissions.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/servers/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow-sm"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Use Standard Invite Submission</span>
                </Link>
              </div>
            </div>
          )}

          {/* Guilds Grid */}
          {!loadingGuilds && discordGuilds.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discordGuilds
                .filter((g) => {
                  if (guildFilter === "unlisted") return !g.isListed;
                  if (guildFilter === "listed") return g.isListed;
                  return true;
                })
                .filter((g) =>
                  !guildSearch ? true : g.name.toLowerCase().includes(guildSearch.toLowerCase())
                )
                .map((guild) => (
                  <div
                    key={guild.id}
                    className={`p-5 rounded-3xl border transition-all flex flex-col justify-between gap-4 ${
                      guild.isListed
                        ? "bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700"
                        : "bg-zinc-900/90 border-discord-blurple/30 hover:border-discord-blurple/70 shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {guild.iconUrl ? (
                        <img
                          src={guild.iconUrl}
                          alt={guild.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-zinc-800 shrink-0 bg-zinc-800"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-discord-blurple text-white font-black text-lg flex items-center justify-center shrink-0">
                          {guild.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white truncate" title={guild.name}>
                            {guild.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] flex-wrap">
                          {guild.isOwner ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30 font-semibold flex items-center gap-1">
                              👑 Server Owner
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-semibold flex items-center gap-1">
                              🛡️ Administrator
                            </span>
                          )}

                          <span className="text-zinc-500 font-mono text-[10px]">
                            ID: {guild.id}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 gap-3">
                      {guild.isListed ? (
                        <>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Listed on Website</span>
                          </span>

                          <Link
                            href={`/server/${guild.listedServer.slug}`}
                            className="px-3.5 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition flex items-center gap-1"
                          >
                            <span>View Listing</span>
                            <ExternalLink className="w-3 h-3 text-zinc-400" />
                          </Link>
                        </>
                      ) : (
                        <>
                          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Not yet listed</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenQuickAdd(guild)}
                              className="px-4 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition flex items-center gap-1.5 cursor-pointer"
                            >
                              <PlusCircle className="w-3.5 h-3.5" />
                              <span>+ Add to Website</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MY BOTS */}
      {activeTab === "bots" && (
        <div className="space-y-4">
          {bots.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-zinc-900/60 border border-zinc-800 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 text-zinc-500 flex items-center justify-center mx-auto">
                <Bot className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">No Discord bots submitted yet</h3>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  List your custom Discord bot on our developer directory to gain new server installs.
                </p>
              </div>
              <Link
                href="/bots/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Your First Bot</span>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bots.map((bot) => (
                <div
                  key={bot.id}
                  className="p-5 sm:p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={bot.iconUrl}
                      alt={bot.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-zinc-800 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/bot/${bot.slug}`}
                          className="text-base font-bold text-white hover:text-discord-blurple transition"
                        >
                          {bot.name}
                        </Link>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800 text-zinc-300 uppercase">
                          {bot.category}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-1">{bot.shortDescription}</p>
                      <p className="text-[11px] text-zinc-500">Prefix: {bot.prefix}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Link
                      href={`/bot/${bot.slug}`}
                      className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                    >
                      View Bot
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setItemToDelete({ type: "bot", id: bot.id, name: bot.name });
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition cursor-pointer"
                      title="Delete Bot Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROMOTIONS & BILLING */}
      {activeTab === "promotions" && (
        <div className="space-y-6">
          {/* Promotion Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Starter Boost
                </span>
                <span className="text-2xl font-black text-white">$5.00</span>
              </div>
              <h3 className="text-lg font-black text-white">1 Month Featured Placement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Featured badge on your server listing, placement in the homepage Featured carousel, and priority ranking at the top of your category hub for 30 consecutive days.
              </p>
              <ul className="text-xs text-zinc-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Homepage Featured Carousel Placement</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Category Top Position for 30 Days</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Gold &ldquo;Featured&rdquo; Verification Badge</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-b from-indigo-950/40 to-zinc-900 border border-discord-blurple/50 space-y-4 relative overflow-hidden shadow-glow-sm">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-discord-blurple/20 text-white border border-discord-blurple/40">
                  Best Value &bull; Save $5!
                </span>
                <span className="text-2xl font-black text-white">$10.00</span>
              </div>
              <h3 className="text-lg font-black text-white">3 Months Featured Placement</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Maximum visibility for expanding communities. Stay pinned and featured across the website for 90 days at only $3.33/month.
              </p>
              <ul className="text-xs text-zinc-300 space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>90 Days Guaranteed Featured Exposure</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Priority Review Verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Direct Admin Concierge Support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* User's Promotion Requests History */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Promotion Requests History
            </h3>

            {promotions.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-zinc-900/40 border border-zinc-800 text-xs text-zinc-400">
                You have not submitted any promotion requests yet. Choose a server from the &ldquo;My Servers&rdquo; tab and click &ldquo;Promote Server&rdquo;.
              </div>
            ) : (
              <div className="space-y-3">
                {promotions.map((p) => (
                  <div
                    key={p.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">
                          {p.server?.name || "Server"}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-300">
                          {p.plan === "3_months" ? "3 Months ($10)" : "1 Month ($5)"}
                        </span>
                        {p.status === "PENDING" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            Pending Admin Contact
                          </span>
                        )}
                        {p.status === "APPROVED" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active / Approved
                          </span>
                        )}
                        {p.status === "REJECTED" && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                            Rejected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400">
                        Requested: {new Date(p.createdAt).toLocaleDateString()} &bull; Contact:{" "}
                        <strong className="text-zinc-300">{p.contactInfo}</strong>
                      </p>
                      {p.notes && (
                        <p className="text-xs text-zinc-500 italic">Notes: &ldquo;{p.notes}&rdquo;</p>
                      )}
                    </div>

                    <div className="text-xs text-zinc-400 text-right">
                      {p.status === "PENDING" && (
                        <span className="text-amber-400 font-medium">
                          The main admin will message you soon to arrange payment.
                        </span>
                      )}
                      {p.status === "APPROVED" && (
                        <span className="text-emerald-400 font-medium">
                          Paid &bull; Featured placement active
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* PROMOTION REQUEST MODAL */}
      {promoteModalOpen && selectedServerForPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => {
                setPromoteModalOpen(false);
                setPromoStatus(null);
              }}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Featured Server Promotion</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                Promote &ldquo;{selectedServerForPromo.name}&rdquo;
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Boost your server to the homepage Carousel and top of your category page.
              </p>
            </div>

            {promoStatus && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm ${
                  promoStatus.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border border-red-500/30 text-red-300"
                }`}
              >
                {promoStatus.message}
              </div>
            )}

            <form onSubmit={handlePromoSubmit} className="space-y-5">
              {/* Plan Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Select Featured Plan
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPromoPlan("1_month")}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      promoPlan === "1_month"
                        ? "bg-discord-blurple/15 border-discord-blurple text-white shadow-glow-sm"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <p className="text-xs font-semibold">1 Month</p>
                    <p className="text-xl font-black text-white mt-1">$5.00</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">30 Days Featured</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPromoPlan("3_months")}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                      promoPlan === "3_months"
                        ? "bg-discord-blurple/15 border-discord-blurple text-white shadow-glow-sm"
                        : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    <div className="absolute top-2 right-2 text-[9px] font-bold bg-amber-500 text-zinc-950 px-1.5 py-0.5 rounded-full">
                      SAVE $5
                    </div>
                    <p className="text-xs font-semibold">3 Months</p>
                    <p className="text-xl font-black text-white mt-1">$10.00</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">90 Days Featured</p>
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Your Discord Username or Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. @username or user#1234 or email@example.com"
                  value={promoContact}
                  onChange={(e) => setPromoContact(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                />
                <p className="text-[11px] text-zinc-500">
                  The main admin will reach out to this contact handle to collect payment and verify.
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Additional Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Preferred payment method (PayPal, UPI, Crypto, Card), target dates, etc."
                  value={promoNotes}
                  onChange={(e) => setPromoNotes(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple resize-none"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 space-y-1">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>How Payment &amp; Activation Works:</span>
                </p>
                <p>
                  1. You submit this request &bull; 2. The main admin receives a notification &bull; 3. Admin contacts you to receive payment &bull; 4. Admin activates your Featured status immediately with live days countdown.
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPromoteModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPromo}
                  className="flex-1 py-3 px-4 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm hover:shadow-glow transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingPromo ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Request ({promoPlan === "3_months" ? "$10" : "$5"})</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-zinc-950 border border-red-500/30 p-6 sm:p-8 space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white">
                Delete {itemToDelete.type === "server" ? "Server" : "Bot"}?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white">&ldquo;{itemToDelete.name}&rdquo;</strong>? This action cannot be undone and will remove all associated reviews and ranking metrics.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setItemToDelete(null);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold transition"
              >
                Keep Listing
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK ADD SERVER MODAL */}
      {quickAddModalOpen && selectedGuildToAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setQuickAddModalOpen(false);
                setQuickAddStatus(null);
              }}
              className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-discord-blurple/20 border border-discord-blurple/30 text-discord-blurple text-xs font-bold">
                <Server className="w-3.5 h-3.5" />
                <span>Quick Server Listing</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white pt-1">
                List &ldquo;{selectedGuildToAdd.name}&rdquo;
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Publish your Discord server to the public directory to gain members, reviews, and 2-hour bumps.
              </p>
            </div>

            {/* Server Card Preview */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center gap-3">
              {selectedGuildToAdd.iconUrl ? (
                <img
                  src={selectedGuildToAdd.iconUrl}
                  alt={selectedGuildToAdd.name}
                  className="w-12 h-12 rounded-xl object-cover bg-zinc-800 shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-discord-blurple text-white font-bold text-base flex items-center justify-center shrink-0">
                  {selectedGuildToAdd.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold text-white truncate">{selectedGuildToAdd.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-zinc-500 font-mono">Guild ID: {selectedGuildToAdd.id}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    Verified Owner/Admin
                  </span>
                </div>
              </div>
            </div>

            {quickAddStatus && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm space-y-2 ${
                  quickAddStatus.type === "success"
                    ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                    : "bg-red-500/10 border border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {quickAddStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{quickAddStatus.message}</span>
                </div>
                {quickAddStatus.slug && (
                  <div>
                    <Link
                      href={`/server/${quickAddStatus.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-white underline font-bold hover:text-emerald-300"
                    >
                      <span>View your new public server page →</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {(!quickAddStatus || quickAddStatus.type === "error") && (
              <form onSubmit={handleQuickAddServer} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Permanent Discord Invite Link <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://discord.gg/yourinvitecode"
                    value={quickInviteUrl}
                    onChange={(e) => setQuickInviteUrl(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                  />
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Tip: In Discord, create an invite link set to &ldquo;Never expire&rdquo;.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Primary Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={quickCategory}
                    onChange={(e) => setQuickCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Short Description (1-2 sentences) <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    maxLength={180}
                    value={quickShortDesc}
                    onChange={(e) => setQuickShortDesc(e.target.value)}
                    placeholder="A welcoming community for gaming, voice chat, and giveaways..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                  />
                  <p className="text-[10px] text-zinc-500 text-right">
                    {quickShortDesc.length} / 180 characters
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                    Keywords &amp; Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={quickTags}
                    onChange={(e) => setQuickTags(e.target.value)}
                    placeholder="e.g. gaming, hangout, voice, anime"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setQuickAddModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingServer}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingServer ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Publishing...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Publish Server</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {quickAddStatus?.type === "success" && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setQuickAddModalOpen(false);
                    setQuickAddStatus(null);
                    setActiveTab("servers");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition shadow-glow cursor-pointer"
                >
                  Go to My Listed Servers
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
