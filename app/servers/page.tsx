import prisma from "@/lib/prisma";
import ServerCard from "@/components/ServerCard";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Search, Filter, Layers, Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Discord Servers - Search & Browse",
  description:
    "Search and discover thousands of active Discord servers by topic, game, tags, and category on discordserverlink.com.",
};

export const revalidate = 60;

interface ServersPageProps {
  searchParams: {
    q?: string;
    category?: string;
    tag?: string;
    sort?: string;
    page?: string;
  };
}

export default async function ServersPage({ searchParams }: ServersPageProps) {
  const query = searchParams.q || "";
  const category = searchParams.category || "";
  const tag = searchParams.tag || "";
  const sort = searchParams.sort || "bumped";
  const page = parseInt(searchParams.page || "1", 10);
  const limit = 24;
  const skip = (page - 1) * limit;

  const where: any = { status: "APPROVED" };

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { shortDescription: { contains: query } },
      { tags: { contains: query } },
    ];
  }

  if (category) {
    where.categorySlug = category;
  }

  if (tag) {
    where.tags = { contains: tag };
  }

  let orderBy: any = { lastBumpedAt: "desc" };
  if (sort === "members") {
    orderBy = { memberCount: "desc" };
  } else if (sort === "newest") {
    orderBy = { createdAt: "desc" };
  } else if (sort === "popular") {
    orderBy = { joinsCount: "desc" };
  } else if (sort === "bumps") {
    orderBy = { bumpsCount: "desc" };
  }

  const [servers, totalCount, categories] = await Promise.all([
    prisma.server.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    }),
    prisma.server.count({ where }),
    prisma.category.findMany({
      orderBy: { displayOrder: "asc" },
      select: { name: true, slug: true },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Bar */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Explore Discord Servers
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Browse {totalCount.toLocaleString()} community servers listed on discordserverlink.com
        </p>

        {/* Filter & Search Bar */}
        <div className="mt-6 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-4">
          <form method="GET" action="/servers" className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search server names, keywords, or tags..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                name="category"
                defaultValue={category}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                name="sort"
                defaultValue={sort}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                <option value="bumped">Recently Bumped</option>
                <option value="members">Most Members</option>
                <option value="popular">Most Joined</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full h-full py-2.5 px-4 bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold rounded-xl transition"
              >
                Filter Servers
              </button>
            </div>
          </form>

          {/* Active filter badges */}
          {(query || category || tag) && (
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/60 text-xs">
              <span className="text-zinc-500">Active filters:</span>
              {query && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                  Query: {query}
                </span>
              )}
              {category && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 capitalize">
                  Category: {category}
                </span>
              )}
              {tag && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                  Tag: #{tag}
                </span>
              )}
              <Link href="/servers" className="text-discord-blurple hover:underline ml-2">
                Clear all
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Servers Grid */}
      {servers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <ServerCard key={server.id} server={server} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800">
          <p className="text-lg font-bold text-zinc-300">No servers matched your criteria</p>
          <p className="text-sm text-zinc-500 mt-1">
            Try adjusting your search terms or filter options.
          </p>
          <Link
            href="/servers"
            className="inline-block mt-4 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold text-white transition"
          >
            Reset Filters
          </Link>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/servers"
        extraParams={{
          q: query || undefined,
          category: category || undefined,
          tag: tag || undefined,
          sort: sort !== "bumped" ? sort : undefined,
        }}
        totalItems={totalCount}
        itemsPerPage={limit}
      />
    </div>
  );
}
