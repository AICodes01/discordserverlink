"use client";

import { useState } from "react";
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
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"servers" | "bots" | "promotions">("servers");

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
          // Update the server's pending request in local state
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

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
        <button
          onClick={() => setActiveTab("servers")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "servers"
              ? "bg-discord-blurple text-white shadow-glow-sm"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800/60"
          }`}
        >
          <Server className="w-4 h-4" />
          <span>My Servers ({totalServers})</span>
        </button>

        <button
          onClick={() => setActiveTab("bots")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
              <Link
                href="/servers/new"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Your First Server</span>
              </Link>
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
    </div>
  );
}
