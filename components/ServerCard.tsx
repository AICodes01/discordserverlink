"use client";

import Link from "next/link";
import { CheckCircle2, Award, Sparkles, Users, Radio, ExternalLink } from "lucide-react";

interface ServerCardProps {
  server: {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    iconUrl?: string | null;
    bannerUrl?: string | null;
    memberCount: number;
    onlineCount: number;
    categorySlug: string;
    tags?: string;
    isFeatured?: boolean;
    isVerified?: boolean;
    isPartnered?: boolean;
    bumpsCount?: number;
    lastBumpedAt?: Date | string;
  };
}

export default function ServerCard({ server }: ServerCardProps) {
  const tagsList = server.tags
    ? server.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 3)
    : [];

  const handleJoinClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Fire and forget join click metric
      fetch(`/api/servers/${server.id}/join`, { method: "POST" });
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="group relative rounded-2xl bg-zinc-900/80 border border-zinc-800/80 hover:border-discord-blurple/50 transition-all duration-300 hover:shadow-glow flex flex-col overflow-hidden">
      {/* Banner Area */}
      <div className="relative h-28 w-full bg-gradient-to-r from-zinc-800 via-indigo-950/40 to-zinc-900 overflow-hidden">
        {server.bannerUrl ? (
          <img
            src={server.bannerUrl}
            alt={`${server.name} banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#5865F2_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/30 to-transparent" />

        {/* Badges on Banner */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {server.isFeatured && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/90 text-zinc-950 shadow-sm backdrop-blur-sm">
              <Sparkles className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
          {server.isPartnered && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-discord-blurple/90 text-white shadow-sm backdrop-blur-sm">
              <Award className="w-3 h-3 fill-current" />
              Partner
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 pt-0 flex-1 flex flex-col -mt-8 relative z-20">
        {/* Icon & Member metrics row */}
        <div className="flex items-end justify-between mb-3">
          <Link href={`/server/${server.slug}`} className="relative block group-hover:scale-105 transition-transform">
            {server.iconUrl ? (
              <img
                src={server.iconUrl}
                alt={`${server.name} Discord icon`}
                className="w-16 h-16 rounded-2xl border-4 border-zinc-900 bg-zinc-800 object-cover shadow-lg"
                loading="lazy"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl border-4 border-zinc-900 bg-discord-blurple flex items-center justify-center text-white text-xl font-black shadow-lg">
                {server.name.slice(0, 2).toUpperCase()}
              </div>
            )}
            {/* Green Online status dot on icon */}
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-discord-green border-2 border-zinc-900"
              title="Active Server"
            />
          </Link>

          {/* Member stats */}
          <div className="flex items-center gap-3 text-xs font-semibold text-zinc-400 bg-zinc-950/70 border border-zinc-800/80 px-2.5 py-1.5 rounded-xl">
            <span className="flex items-center gap-1 text-discord-green" title="Online members">
              <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse" />
              {server.onlineCount ? server.onlineCount.toLocaleString() : "Active"}
            </span>
            <span className="text-zinc-600">|</span>
            <span className="flex items-center gap-1 text-zinc-300" title="Total members">
              <Users className="w-3 h-3 text-zinc-400" />
              {server.memberCount ? server.memberCount.toLocaleString() : "100+"}
            </span>
          </div>
        </div>

        {/* Server Name & Verified mark */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <Link
            href={`/server/${server.slug}`}
            className="text-base font-bold text-white hover:text-discord-blurple transition line-clamp-1"
          >
            {server.name}
          </Link>
          {server.isVerified && (
            <span title="Verified Server">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-3 flex-1">
          {server.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Link
            href={`/category/${server.categorySlug}`}
            className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 transition capitalize"
          >
            {server.categorySlug}
          </Link>
          {tagsList.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase()}`}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-950/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700 transition"
            >
              #{tag}
            </Link>
          ))}
        </div>

        {/* Card Footer Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
          <Link
            href={`/server/${server.slug}`}
            className="flex-1 text-center py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition"
          >
            View Server
          </Link>
          <a
            href={`/server/${server.slug}`}
            onClick={handleJoinClick}
            className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-discord-blurple hover:bg-discord-hover text-xs font-bold text-white shadow-glow-sm transition"
          >
            <span>Join</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
