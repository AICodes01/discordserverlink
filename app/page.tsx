import Link from "next/link";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import ServerCard from "@/components/ServerCard";
import BlogSlider from "@/components/BlogSlider";
import HomeSEOContent from "@/components/HomeSEOContent";
import { getAllPosts } from "@/lib/blog";
import { generateItemListSchema, SITE_URL, SITE_NAME } from "@/lib/seo";
import {
  Compass,
  Sparkles,
  TrendingUp,
  PlusCircle,
  Search,
  Users,
  ShieldCheck,
  Zap,
  Gamepad2,
  Flame,
  Code2,
  Headphones,
  GraduationCap,
  Palette,
  Layers,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Discord Servers List (2026) - Find, Join & Promote Top Communities | DiscordServerLink",
  description:
    "Explore 5,300+ active Discord servers. Find gaming squads, anime hubs, coding groups, and chill voice chats. Join instantly or add your server for free on discordserverlink.com!",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    title: "Discord Servers List 2026 - Best Discord Servers to Join",
    description:
      "Explore 5,300+ active Discord servers with direct invite links, member counts, and live bumps. Add your server for free on DiscordServerLink.",
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - Top Discord Server Directory`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Discord Servers List 2026 - DiscordServerLink",
    description:
      "Discover active Discord servers for gaming, anime, tech, and chill chats.",
    images: ["/og-image.png"],
  },
};

// Icon mapping for categories
const categoryIcons: Record<string, any> = {
  gaming: Gamepad2,
  anime: Flame,
  technology: Code2,
  community: Users,
  music: Headphones,
  education: GraduationCap,
  finance: TrendingUp,
  art: Palette,
};

export const revalidate = 60; // ISR cache for fast page loads

export default async function HomePage() {
  let featuredServers: any[] = [];
  let recentlyBumpedServers: any[] = [];
  let categories: any[] = [];
  let totalServers = 120;
  let totalMembers = 350000;
  let totalBumps = 12000;
  let latestBlogPosts: any[] = [];

  try {
    const [dbFeatured, dbRecent, dbCategories, totalStats, allBlogPosts] =
      await Promise.all([
        // 1. Featured servers
        prisma.server.findMany({
          where: { status: "APPROVED", isFeatured: true },
          orderBy: { lastBumpedAt: "desc" },
          take: 6,
        }),
        // 2. Recently bumped / trending servers
        prisma.server.findMany({
          where: { status: "APPROVED" },
          orderBy: { lastBumpedAt: "desc" },
          take: 12,
        }),
        // 3. Categories with server count
        prisma.category.findMany({
          orderBy: { displayOrder: "asc" },
        }),
        // 4. Platform aggregates
        Promise.all([
          prisma.server.count({ where: { status: "APPROVED" } }),
          prisma.server.aggregate({
            where: { status: "APPROVED" },
            _sum: { memberCount: true },
          }),
          prisma.bump.count(),
        ]),
        // 5. Blog Posts
        getAllPosts(),
      ]);

    featuredServers = dbFeatured;
    recentlyBumpedServers = dbRecent;
    categories = dbCategories;
    const [totalServersCount, totalMembersSum, totalBumpsCount] = totalStats;
    totalServers = totalServersCount || 120;
    totalMembers = totalMembersSum._sum.memberCount || 350000;
    totalBumps = totalBumpsCount || 12000;
    latestBlogPosts = allBlogPosts;
  } catch (error) {
    // Graceful fallback for local builds / offline database
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const seed = require("@/prisma/seed-data.json");
      categories = seed.categories || [];
      featuredServers = (seed.servers || []).filter((s: any) => s.isFeatured).slice(0, 6);
      recentlyBumpedServers = (seed.servers || []).slice(0, 12);
      totalServers = seed.servers ? seed.servers.length : 120;
    } catch {}
    const allBlogPosts = await getAllPosts();
    latestBlogPosts = allBlogPosts;
  }

  // Generate ItemList schema for top featured servers for Google Carousel SERPs
  const itemListSchema = generateItemListSchema(
    (featuredServers.length > 0 ? featuredServers : recentlyBumpedServers)
      .slice(0, 10)
      .map((s, idx) => ({
        name: s.name,
        url: `/server/${s.slug}`,
        image: s.iconUrl,
        position: idx + 1,
      }))
  );

  return (
    <div className="space-y-16 pb-16">
      {/* ItemList Structured Schema for Google Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-zinc-800/60 bg-gradient-to-b from-indigo-950/20 via-zinc-950 to-zinc-950">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-discord-blurple/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs font-semibold text-zinc-300 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-discord-green animate-ping" />
            <span>Over {totalMembers.toLocaleString()} Discord members discovered</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Discover, Join & Promote <br />
            <span className="bg-gradient-to-r from-discord-blurple via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              Top Discord Servers
            </span>
          </h1>

          {/* Subheading */}
          <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            Welcome to{" "}
            <span className="font-semibold text-zinc-200">discordserverlink.com</span> — the
            ultra-fast, 100% free Discord server list featuring over{" "}
            <span className="text-zinc-200 font-semibold">
              {totalServers.toLocaleString()}+
            </span>{" "}
            listed servers,{" "}
            <span className="text-zinc-200 font-semibold">
              {totalMembers.toLocaleString()}+
            </span>{" "}
            total members, and{" "}
            <span className="text-zinc-200 font-semibold">
              {totalBumps.toLocaleString()}+
            </span>{" "}
            bumps. Find active voice chats, gaming squads, anime hubs, and software developer circles.
          </p>

          {/* Large Hero Search */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form action="/servers" method="GET" className="relative group">
              <input
                type="text"
                name="q"
                placeholder="Search by name, game, or keywords (e.g. Minecraft, Valorant, Chill, Python)..."
                className="w-full bg-zinc-900/90 border border-zinc-700/80 rounded-2xl pl-12 pr-32 py-4 text-base text-zinc-100 placeholder-zinc-500 shadow-2xl focus:outline-none focus:border-discord-blurple focus:ring-2 focus:ring-discord-blurple/30 transition-all"
              />
              <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <button
                type="submit"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-glow-sm"
              >
                Search
              </button>
            </form>

            {/* Popular quick-tag pills */}
            <div className="mt-4 flex items-center justify-center flex-wrap gap-2 text-xs">
              <span className="text-zinc-500 font-medium">Popular:</span>
              {["Minecraft", "Valorant", "Anime", "Roblox", "Coding", "Chill", "Giveaways"].map(
                (tag) => (
                  <Link
                    key={tag}
                    href={`/tag/${tag.toLowerCase()}`}
                    className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition"
                  >
                    #{tag}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Spotlight Section */}
      {featuredServers.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Sparkles className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Featured Servers</h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Hand-picked & high-engagement verified Discord communities
                </p>
              </div>
            </div>
            <Link
              href="/servers?sort=popular"
              className="text-xs sm:text-sm font-semibold text-discord-blurple hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
          </div>
        </section>
      )}

      {/* Categories Explorer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Browse by Category</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Explore tailored communities for your exact hobbies and games
              </p>
            </div>
          </div>
          <Link
            href="/categories"
            className="text-xs sm:text-sm font-semibold text-discord-blurple hover:underline flex items-center gap-1"
          >
            <span>All categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.slug] || Compass;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 hover:border-discord-blurple/60 hover:bg-zinc-800/50 transition-all flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-zinc-800 group-hover:bg-discord-blurple text-zinc-300 group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-sm font-bold text-white group-hover:text-discord-blurple transition truncate">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    Explore servers
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recently Bumped / Trending Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-discord-green/10 border border-discord-green/20 text-discord-green">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Recently Bumped & Trending</h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Servers actively bumping and engaging right now
              </p>
            </div>
          </div>
          <Link
            href="/servers"
            className="text-xs sm:text-sm font-semibold text-discord-blurple hover:underline flex items-center gap-1"
          >
            <span>See more</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentlyBumpedServers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>

        {/* Call to action banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-discord-blurple via-indigo-600 to-purple-600 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Own a Discord Server?
            </h3>
            <p className="mt-3 text-sm sm:text-base text-indigo-100 leading-relaxed">
              Add your server to <span className="font-bold">discordserverlink.com</span> for
              free. Get indexed on Google search, attract active members, and bump your server
              regularly to rank #1.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/servers/new"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-100 shadow-lg transition flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4 text-discord-blurple" />
                <span>Add Your Discord Server</span>
              </Link>
              <Link
                href="/servers"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-900/60 hover:bg-indigo-900 text-white font-semibold text-sm transition"
              >
                Explore Directory
              </Link>
            </div>
          </div>
        </div>

        {/* Latest Blog & Guides Slider Section */}
        {latestBlogPosts.length > 0 && <BlogSlider posts={latestBlogPosts} />}
      </section>

      {/* SEO Content & Comprehensive Guide Section */}
      <HomeSEOContent />
    </div>
  );
}
