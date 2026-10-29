import Link from "next/link";
import { Metadata } from "next";
import { BOT_CATEGORIES, DISCORD_BOTS, DiscordBot } from "@/lib/botsData";
import BotCard from "@/components/BotCard";
import Pagination from "@/components/Pagination";
import {
  Bot,
  Shield,
  Music,
  Sparkles,
  Wrench,
  Gamepad2,
  Coins,
  Flame,
  Search,
  CheckCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Top Discord Bots Directory 2026 - Best Bots for Your Server",
  description:
    "Explore the top Discord bots for moderation, music, AI, economy, gaming, and utilities. Compare features, server counts, and invite bots to your Discord server in 1-click.",
  alternates: {
    canonical: "https://discordserverlink.com/bots",
  },
};

const CATEGORY_ICON_MAP: Record<string, any> = {
  all: Bot,
  moderation: Shield,
  music: Music,
  ai: Sparkles,
  utility: Wrench,
  gaming: Gamepad2,
  economy: Coins,
  anime: Flame,
};

interface BotsPageProps {
  searchParams?: {
    category?: string;
    page?: string;
    q?: string;
  };
}

export const revalidate = 60;

export default async function BotsPage({ searchParams }: BotsPageProps) {
  const currentCategory = searchParams?.category || "all";
  const searchQuery = (searchParams?.q || "").toLowerCase().trim();
  const currentPage = Math.max(1, parseInt(searchParams?.page || "1", 10) || 1);
  const pageSize = 25;

  // Filter bots
  let filtered = DISCORD_BOTS;
  if (currentCategory !== "all") {
    filtered = filtered.filter((bot) => bot.category === currentCategory);
  }
  if (searchQuery) {
    filtered = filtered.filter(
      (bot) =>
        bot.name.toLowerCase().includes(searchQuery) ||
        bot.shortDescription.toLowerCase().includes(searchQuery) ||
        bot.tags.some((t) => t.toLowerCase().includes(searchQuery))
    );
  }

  const totalBots = filtered.length;
  const totalPages = Math.ceil(totalBots / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const pageBots = filtered.slice(startIndex, startIndex + pageSize);

  // Active category object
  const activeCatObj =
    BOT_CATEGORIES.find((c) => c.slug === currentCategory) || BOT_CATEGORIES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <Bot className="w-3.5 h-3.5" />
            <span>Official Discord Bots Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Top <span className="text-discord-blurple">Discord Bots</span> for Every Server
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Discover and invite over 50+ hand-picked, verified Discord bots. From enterprise auto-moderation and AI companions to high-fidelity music streaming and economy RPGs.
          </p>

          {/* Quick Search */}
          <form method="GET" action="/bots" className="pt-2 max-w-md relative">
            {currentCategory !== "all" && (
              <input type="hidden" name="category" value={currentCategory} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search bots by name, tag, or feature..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Browse by Category</span>
            <span className="text-xs font-normal text-zinc-500">
              ({BOT_CATEGORIES.length - 1} genres)
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BOT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.slug] || Bot;
            const isActive = currentCategory === cat.slug;
            const count =
              cat.slug === "all"
                ? DISCORD_BOTS.length
                : DISCORD_BOTS.filter((b) => b.category === cat.slug).length;

            return (
              <Link
                key={cat.slug}
                href={
                  cat.slug === "all"
                    ? `/bots${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`
                    : `/bots?category=${cat.slug}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`
                }
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-discord-blurple text-white border-discord-blurple shadow-glow-sm"
                    : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-zinc-400 group-hover:text-discord-blurple"}`} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{activeCatObj.name}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {totalBots} {totalBots === 1 ? "Bot" : "Bots"}
            </span>
          </h3>
          <p className="text-xs text-zinc-400 mt-1">{activeCatObj.description}</p>
        </div>

        {totalBots > 0 && (
          <div className="text-xs text-zinc-400">
            Showing <span className="font-semibold text-white">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-white">
              {Math.min(startIndex + pageSize, totalBots)}
            </span>{" "}
            of <span className="font-semibold text-white">{totalBots}</span> bots
          </div>
        )}
      </div>

      {/* Bot Cards Grid (25 items per page) */}
      {pageBots.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageBots.map((bot) => (
            <BotCard key={bot.id} bot={bot} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800/80 space-y-4">
          <Bot className="w-12 h-12 text-zinc-600 mx-auto" />
          <h4 className="text-lg font-bold text-white">No Discord bots found</h4>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto">
            We couldn't find any bots matching &ldquo;{searchQuery}&rdquo;. Try another keyword or browse all categories.
          </p>
          <Link
            href="/bots"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-discord-blurple text-white hover:bg-discord-hover transition-colors"
          >
            <span>Reset Filters</span>
          </Link>
        </div>
      )}

      {/* Pagination (25 Bots per page) */}
      {totalPages > 1 && (
        <div className="pt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalBots}
            itemsPerPage={pageSize}
            basePath="/bots"
            extraParams={{
              ...(currentCategory !== "all" ? { category: currentCategory } : {}),
              ...(searchQuery ? { q: searchQuery } : {}),
            }}
          />
        </div>
      )}
    </div>
  );
}
