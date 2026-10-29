"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smile,
  Search,
  Copy,
  Check,
  Download,
  Flame,
  Laugh,
  Heart,
  Gamepad2,
  Sparkles,
  Zap,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { DISCORD_EMOJIS, EMOJI_CATEGORIES, DiscordEmoji } from "@/lib/emojisData";

const CATEGORY_ICON_MAP: Record<string, any> = {
  all: Smile,
  pepe: Flame,
  memes: Laugh,
  anime: Heart,
  gaming: Gamepad2,
  aesthetic: Sparkles,
  animated: Zap,
};

export default function EmojisPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Filter emojis
  const filtered = DISCORD_EMOJIS.filter((emoji) => {
    const matchesCategory =
      selectedCategory === "all" || emoji.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      emoji.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      emoji.shortcode.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return matchesCategory && matchesSearch;
  });

  const handleCopyShortcode = (shortcode: string, id: string) => {
    navigator.clipboard.writeText(shortcode);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = async (emoji: DiscordEmoji) => {
    try {
      const response = await fetch(emoji.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const ext = emoji.isAnimated ? "gif" : "png";
      link.download = `${emoji.name.toLowerCase().replace(/\s+/g, "_")}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Fallback: open in new tab
      window.open(emoji.url, "_blank");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-amber-950/30 to-zinc-900 border border-zinc-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide">
            <Smile className="w-3.5 h-3.5" />
            <span>Discord Emojis & Stickers Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Best <span className="text-amber-400">Discord Emojis</span> & Animated Icons
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Browse our curated collection of Pepe, Memes, Anime, Gaming, and Aesthetic Discord emojis. 1-click copy shortcodes or download ready-to-upload PNG and GIF assets for your server.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-md relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search emojis by name (e.g. pepe, gigachad, anya)..."
              className="w-full bg-zinc-950/80 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all"
            />
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EMOJI_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICON_MAP[cat.slug] || Smile;
            const isActive = selectedCategory === cat.slug;
            const count =
              cat.slug === "all"
                ? DISCORD_EMOJIS.length
                : DISCORD_EMOJIS.filter((e) => e.category === cat.slug).length;

            return (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`group flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? "bg-amber-500 text-zinc-950 border-amber-400 shadow-glow-sm font-bold"
                    : "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white border-zinc-800"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-zinc-950" : "text-zinc-400 group-hover:text-amber-400"}`} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? "bg-black/20 text-black" : "bg-zinc-800 text-zinc-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white">
            {filtered.length} {filtered.length === 1 ? "Emoji" : "Emojis"} Found
          </span>
          {searchQuery && (
            <span className="text-xs text-zinc-400">matching &ldquo;{searchQuery}&rdquo;</span>
          )}
        </div>
        <span className="text-xs text-zinc-400">Click emoji to copy shortcode</span>
      </div>

      {/* Emoji Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((emoji) => {
            const isCopied = copiedId === emoji.id;
            return (
              <div
                key={emoji.id}
                className="group relative flex flex-col items-center justify-between bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-amber-400/50 rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1"
              >
                {/* Badge if Animated */}
                {emoji.isAnimated && (
                  <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                    GIF
                  </span>
                )}

                {/* Emoji Graphic Display */}
                <button
                  type="button"
                  onClick={() => handleCopyShortcode(emoji.shortcode, emoji.id)}
                  className="w-16 h-16 flex items-center justify-center p-1 rounded-2xl hover:bg-zinc-800/60 transition-transform group-hover:scale-110 my-2 cursor-pointer"
                  title="Click to copy shortcode"
                >
                  <img
                    src={emoji.url}
                    alt={emoji.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-md"
                    loading="lazy"
                  />
                </button>

                {/* Name & Shortcode */}
                <div className="w-full text-center space-y-1 mt-1">
                  <p className="text-xs font-bold text-white truncate px-1">
                    {emoji.name}
                  </p>
                  <button
                    onClick={() => handleCopyShortcode(emoji.shortcode, emoji.id)}
                    className="font-mono text-[10px] text-zinc-400 hover:text-amber-400 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-800/80 truncate block w-full transition-colors"
                  >
                    {isCopied ? "✓ Copied!" : emoji.shortcode}
                  </button>
                </div>

                {/* Actions: Copy & Download */}
                <div className="w-full flex items-center gap-1.5 mt-3 pt-2 border-t border-zinc-800/60">
                  <button
                    onClick={() => handleCopyShortcode(emoji.shortcode, emoji.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[10px] font-semibold text-zinc-200 transition-colors"
                    title="Copy shortcode"
                  >
                    {isCopied ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-400" />
                    )}
                    <span>{isCopied ? "Done" : "Copy"}</span>
                  </button>

                  <button
                    onClick={() => handleDownload(emoji)}
                    className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                    title="Download emoji image file"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-3">
          <Smile className="w-10 h-10 text-zinc-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No emojis found</h3>
          <p className="text-xs text-zinc-400">
            No emojis match &ldquo;{searchQuery}&rdquo;. Try another term or choose another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-amber-500 text-zinc-950 hover:bg-amber-400 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Guide: How to Add Custom Emojis to Discord */}
      <div className="bg-zinc-900/70 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>How to Add Custom Emojis to Your Discord Server</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-zinc-300">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <span className="font-bold text-amber-400">Step 1: Download</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Find the emoji you love above and click the download button to save the PNG or animated GIF.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <span className="font-bold text-amber-400">Step 2: Server Settings</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Open Discord on desktop or mobile, click your Server Name, and select <strong>Server Settings</strong>.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <span className="font-bold text-amber-400">Step 3: Upload Emoji</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Navigate to the <strong>Emoji</strong> tab in the sidebar and click the purple <strong>Upload Emoji</strong> button.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <span className="font-bold text-amber-400">Step 4: Use & Enjoy</span>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Your server members can now type <code>:emoji_name:</code> to react and chat with the new custom emoji!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
