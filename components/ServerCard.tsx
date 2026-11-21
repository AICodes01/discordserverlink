"use client";

import Link from "next/link";
import { useState, useRef } from "react";
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
    inviteUrl?: string;
  };
}

export default function ServerCard({ server }: ServerCardProps) {
  const isFeatured = !!server.isFeatured;

  const tagsList = server.tags
    ? server.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => {
          const lower = t.toLowerCase();
          return (
            Boolean(t) &&
            lower !== "partner" &&
            lower !== "partnered" &&
            lower !== "partner server" &&
            lower !== "featured"
          );
        })
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

  // Ripple click effect
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      width:120px; height:120px;
      left:${x - 60}px; top:${y - 60}px;
      background:rgba(139,92,246,0.18);
      transform:scale(0); z-index:50;
      animation:ripple-spread 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
    `;
    card.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleCardClick}
      className={`group relative rounded-2xl flex flex-col overflow-hidden transition-all duration-300 cursor-pointer ${
        isFeatured
          ? "bg-gradient-to-b from-violet-950/25 via-zinc-900/95 to-zinc-950 border border-violet-500/40 hover:border-fuchsia-400/80 shadow-[0_0_25px_-5px_rgba(139,92,246,0.3)] hover:shadow-[0_0_35px_-2px_rgba(236,72,153,0.45)] ring-1 ring-violet-500/20 hover:-translate-y-1"
          : "bg-zinc-900/80 border border-zinc-800/80 hover:border-discord-blurple/50 hover:shadow-glow"
      }`}
    >
      {/* Top ambient highlight for featured servers */}
      {isFeatured && (
        <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 animate-pulse z-30" />
      )}

      {/* Banner Area */}
      <div className="relative h-28 w-full bg-gradient-to-r from-zinc-800 via-indigo-950/40 to-zinc-900 overflow-hidden">
        {server.bannerUrl ? (
          <img
            src={server.bannerUrl}
            alt={`${server.name} banner`}
            width={400}
            height={112}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full opacity-30 bg-[radial-gradient(#5865F2_1px,transparent_1px)] [background-size:16px_16px]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />

        {/* Shimmer sweep effect on featured server */}
        {isFeatured && (
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-fuchsia-400/15 to-transparent pointer-events-none" />
        )}

        {/* Badges on Banner */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
          {isFeatured && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-[0_0_16px_rgba(217,70,239,0.55)] border border-white/25 backdrop-blur-md tracking-wider uppercase animate-pulse">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              FEATURED
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
                width={64}
                height={64}
                className={`w-16 h-16 rounded-2xl bg-zinc-800 object-cover shadow-lg transition-all ${
                  isFeatured
                    ? "border-4 border-zinc-900 ring-2 ring-violet-400/90 shadow-[0_0_16px_rgba(168,85,247,0.45)]"
                    : "border-4 border-zinc-900"
                }`}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div
                className={`w-16 h-16 rounded-2xl border-4 border-zinc-900 flex items-center justify-center text-white text-xl font-black shadow-lg ${
                  isFeatured
                    ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 ring-2 ring-violet-400/90 shadow-[0_0_16px_rgba(168,85,247,0.45)]"
                    : "bg-discord-blurple"
                }`}
              >
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
          <div
            className={`flex items-center gap-3 text-xs font-semibold px-2.5 py-1.5 rounded-xl border ${
              isFeatured
                ? "bg-zinc-950/90 border-violet-500/30 text-violet-100"
                : "bg-zinc-950/80 border-zinc-800/90 text-zinc-300"
            }`}
          >
            <span className="flex items-center gap-1 text-discord-green" title="Online members">
              <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse" />
              <span suppressHydrationWarning>
                {server.onlineCount ? server.onlineCount.toLocaleString("en-US") : "Active"}
              </span>
            </span>
            <span className="text-zinc-500">|</span>
            <span className="flex items-center gap-1 text-zinc-200" title="Total members">
              <Users className="w-3 h-3 text-zinc-400" />
              <span suppressHydrationWarning>
                {server.memberCount ? server.memberCount.toLocaleString("en-US") : "100+"}
              </span>
            </span>
          </div>
        </div>

        {/* Server Name & Verified mark */}
        <div className="mb-1.5 flex items-center gap-1.5">
          <Link
            href={`/server/${server.slug}`}
            className={`text-base font-bold transition line-clamp-1 ${
              isFeatured
                ? "text-white group-hover:text-fuchsia-300"
                : "text-white hover:text-discord-blurple"
            }`}
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
        <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2 mb-3 flex-1">
          {server.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Link
            href={`/category/${server.categorySlug}`}
            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition capitalize ${
              isFeatured
                ? "bg-violet-500/15 border border-violet-500/30 text-violet-300 hover:bg-violet-500/25"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {server.categorySlug}
          </Link>
          {tagsList.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag.toLowerCase()}`}
              className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-zinc-950/80 text-zinc-300 border border-zinc-800 hover:border-zinc-700 transition"
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
          {isFeatured ? (
            <a
              href={server.inviteUrl || `/api/servers/${server.id}/join`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleJoinClick}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-fuchsia-600 hover:to-cyan-400 text-xs font-black text-white shadow-[0_0_18px_rgba(99,102,241,0.5)] hover:shadow-[0_0_26px_rgba(236,72,153,0.65)] transition-all hover:scale-105 active:scale-95 group/join border border-white/20"
              title={`Join ${server.name} Discord Community`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-white animate-bounce" />
              <span>Join Server</span>
              <ExternalLink className="w-3 h-3 group-hover/join:translate-x-0.5 transition-transform" />
            </a>
          ) : (
            <a
              href={server.inviteUrl || `/api/servers/${server.id}/join`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleJoinClick}
              className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-discord-blurple hover:bg-discord-hover text-xs font-bold text-white shadow-glow-sm hover:shadow-glow transition-all"
              title={`Join ${server.name} Discord Community`}
            >
              <span>Join</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
