import Link from "next/link";
import { Metadata } from "next";
import { BOT_CATEGORIES, getAllBots, DiscordBot } from "@/lib/botsData";
import BotCard from "@/components/BotCard";
import Pagination from "@/components/Pagination";
import BotSEOContent from "@/components/BotSEOContent";
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
  PlusCircle,
  Zap,
  Clock,
  Layers,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Best Discord Bots List 2026 - Top Discord Bots Directory | DiscordServerLink",
  description:
    "Explore the Best Discord Bots List 2026 to automate tasks on your server. Find pre-made bots for music, moderation, gaming, giveaways, verification, leveling, and AI chatbots.",
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

  const allBots = getAllBots();

  // Filter bots
  let filtered = allBots;
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
        <div className="relative z-10 max-w-4xl space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
              <Bot className="w-3.5 h-3.5" />
              <span>Best Discord Bots List 2026</span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
              Updated Regular
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Best <span className="text-discord-blurple">Discord Bots</span> List 2026
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Are you searching for the Best Discord Bots to automate tasks on your Server? If so, then you have come to the right place. There are millions of pre-made bots available to add directly in your server to handle different tasks automatically including, music, moderation, gaming, giveaways, verification, leveling, AI chatbots, and much more.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm">
              In this post, you’ll discover a large collection of Discord bots that can automate various server tasks according to your needs. Here you’ll find the most powerful, reliable, and popular bots with up-to-date features and clear use cases and you can filter bots by category, features, and popularity. So, find the right bot for your server today and add now.
            </p>
          </div>

          {/* Quick Search & Add Bot Action Bar */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl">
            <form method="GET" action="/bots" className="relative flex-1">
              {currentCategory !== "all" && (
                <input type="hidden" name="category" value={currentCategory} />
              )}
              <input
                type="text"
                name="q"
                defaultValue={searchQuery}
                placeholder="Search bots by name, tag, or feature..."
                className="w-full bg-zinc-950/90 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple transition-all"
              />
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <Link
              href="/bots/new"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold shadow-glow-sm hover:shadow-glow transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add Discord Bot</span>
            </Link>
          </div>

          {/* Key Spec Highlight Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
            <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Discord Bots</span>
              <span className="text-xs sm:text-sm font-bold text-white">Invite Links</span>
            </div>
            <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Total Bots</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-400">600+ Active</span>
            </div>
            <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Benefits</span>
              <span className="text-xs sm:text-sm font-bold text-indigo-300">Automate Tasks</span>
            </div>
            <div className="bg-zinc-950/50 rounded-xl p-3 border border-zinc-800/80">
              <span className="text-[10px] uppercase font-bold text-zinc-500 block">Type / Updates</span>
              <span className="text-xs sm:text-sm font-bold text-amber-300">Free / Regular</span>
            </div>
          </div>
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
          <Link
            href="/bots/new"
            className="text-xs font-semibold text-discord-blurple hover:underline hidden sm:inline-flex items-center gap-1"
          >
            <span>Can't find your bot? Add it here &rarr;</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {BOT_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.slug] || Bot;
            const isActive = currentCategory === cat.slug;
            const count =
              cat.slug === "all"
                ? allBots.length
                : allBots.filter((b) => b.category === cat.slug).length;

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
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-white" : "text-zinc-400 group-hover:text-discord-blurple"
                  }`}
                />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-zinc-800 text-zinc-400"
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
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/bots"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 text-white hover:bg-zinc-700 transition-colors"
            >
              <span>Reset Filters</span>
            </Link>
            <Link
              href="/bots/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-discord-blurple text-white hover:bg-discord-hover transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add This Bot</span>
            </Link>
          </div>
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

      {/* Bottom SEO Content with Step-by-Step Guide & Developer Promotion */}
      <BotSEOContent />
    </div>
  );
}
