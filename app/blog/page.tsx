import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import { BookOpen, Search, Sparkles, Compass, Flame } from "lucide-react";
import { SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Latest Discord Servers, Emojis & Bots Blog 2026 - DiscordServerLink",
  description:
    "Discover the latest Discord server links, best bot recommendations, custom emoji packs, and community growth guides on discordserverlink.com.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

interface BlogPageProps {
  searchParams?: {
    q?: string;
    category?: string;
  };
}

export const revalidate = 60;

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const allPosts = getAllPosts();
  const searchQuery = (searchParams?.q || "").toLowerCase().trim();
  const categoryFilter = searchParams?.category || "all";

  // Filter posts
  let filtered = allPosts;
  if (categoryFilter !== "all") {
    filtered = filtered.filter(
      (p) => (p.category || "").toLowerCase() === categoryFilter.toLowerCase()
    );
  }
  if (searchQuery) {
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(searchQuery) ||
        p.excerpt.toLowerCase().includes(searchQuery)
    );
  }

  const featuredPost = filtered.length > 0 ? filtered[0] : null;
  const remainingPosts = filtered.length > 1 ? filtered.slice(1) : [];

  const categories = [
    { slug: "all", label: "All Posts" },
    { slug: "discord servers", label: "Discord Servers" },
    { slug: "anime", label: "Anime" },
    { slug: "gaming", label: "Gaming" },
    { slug: "bots & tools", label: "Bots & Tools" },
    { slug: "ai & tech", label: "AI & Tech" },
    { slug: "growth", label: "Growth & Promo" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-xs font-bold tracking-wide">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Official DiscordServerLink Blog & Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Latest <span className="text-discord-blurple">Discord Guides</span>, Lists & Insights
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Expertly curated lists of Discord servers, top bot showcases, moderation guides, and server growth strategies to help you discover and build active communities.
          </p>

          {/* Search Form */}
          <form method="GET" action="/blog" className="pt-2 max-w-md relative">
            {categoryFilter !== "all" && (
              <input type="hidden" name="category" value={categoryFilter} />
            )}
            <input
              type="text"
              name="q"
              defaultValue={searchQuery}
              placeholder="Search guides (e.g. anime, bots, fortnite)..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>
        </div>
      </div>

      {/* Categories Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isActive = categoryFilter.toLowerCase() === cat.slug;
            const count =
              cat.slug === "all"
                ? allPosts.length
                : allPosts.filter(
                    (p) => (p.category || "").toLowerCase() === cat.slug
                  ).length;

            if (count === 0 && cat.slug !== "all") return null;

            return (
              <Link
                key={cat.slug}
                href={
                  cat.slug === "all"
                    ? `/blog${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`
                    : `/blog?category=${encodeURIComponent(cat.slug)}${searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""}`
                }
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-discord-blurple text-white border-discord-blurple shadow-glow-sm"
                    : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800"
                }`}
              >
                <span>{cat.label}</span>
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

      {/* Featured Article */}
      {featuredPost && !searchQuery && categoryFilter === "all" && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-discord-yellow" />
            <span>Latest Featured Guide</span>
          </h2>
          <BlogCard post={featuredPost} featured={true} />
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>
              {searchQuery || categoryFilter !== "all"
                ? "Search Results"
                : "All Articles & Lists"}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {filtered.length} Posts
            </span>
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(searchQuery || categoryFilter !== "all" ? filtered : remainingPosts).map(
              (post) => (
                <BlogCard key={post.slug} post={post} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-4">
            <BookOpen className="w-12 h-12 text-zinc-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">No articles found</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              We couldn&apos;t find any posts matching &ldquo;{searchQuery}&rdquo;. Try another search keyword.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-discord-blurple text-white hover:bg-discord-hover transition-colors"
            >
              <span>View All Articles</span>
            </Link>
          </div>
        )}
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Looking for Active Discord Servers to Join?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
            Browse our directory of over 5,300+ Discord communities across Gaming, Anime, Technology, Chill Hangouts, and Music.
          </p>
        </div>
        <Link
          href="/categories"
          className="inline-flex items-center gap-2 bg-discord-blurple hover:bg-discord-hover text-white px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Browse All Servers</span>
        </Link>
      </div>
    </div>
  );
}
