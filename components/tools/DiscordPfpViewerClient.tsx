"use client";

import { useState } from "react";
import {
  User,
  Search,
  Download,
  Image as ImageIcon,
  Film,
  Flag,
  Copy,
  Check,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function DiscordPfpViewerClient() {
  const [userIdInput, setUserIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const handleSearch = async (overrideId?: string) => {
    const idToLookup = (overrideId !== undefined ? overrideId : userIdInput).trim();
    if (!idToLookup) {
      setError("Please enter a Discord User ID.");
      return;
    }

    if (!/^\d{17,21}$/.test(idToLookup)) {
      setError(
        "Invalid format. Discord User IDs are 17-20 digit numbers (e.g. 159985870458322944). See the guide below to find a User ID."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setUserData(null);

    try {
      const res = await fetch("/api/tools/discord-pfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: idToLookup }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch Discord user profile.");
      }

      setUserData(data.user);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while grabbing the PFP.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const loadExample = (id: string) => {
    setUserIdInput(id);
    handleSearch(id);
  };

  return (
    <div className="bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6 shadow-xl">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-2">
          Enter Discord User ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={userIdInput}
              onChange={(e) => setUserIdInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="e.g. 159985870458322944 (17-20 digit Snowflake ID)"
              className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple font-mono"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            onClick={() => handleSearch()}
            disabled={loading}
            className="bg-discord-blurple hover:bg-discord-hover text-white font-bold px-7 py-3 rounded-xl transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            {loading ? (
              <span>Grabbing...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Grab PFP / Check</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Examples */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-zinc-400">
          <span>Quick test examples:</span>
          <button
            type="button"
            onClick={() => loadExample("159985870458322944")}
            className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            MEE6 (Bot)
          </button>
          <button
            type="button"
            onClick={() => loadExample("155149108183695360")}
            className="px-2 py-0.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            Dyno (Bot)
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm leading-relaxed">
          {error}
        </div>
      )}

      {/* User Profile Result Card */}
      {userData && (
        <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/80 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          {/* Banner preview or accent bar */}
          {userData.hasBanner ? (
            <div className="relative w-full h-36 sm:h-48 bg-zinc-900 overflow-hidden border-b border-zinc-800">
              <img
                src={userData.bannerUrl}
                alt={`${userData.username} profile banner`}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-zinc-950/80 text-[10px] font-bold text-white border border-zinc-700">
                {userData.isAnimatedBanner ? "GIF Banner" : "HD Banner"}
              </span>
            </div>
          ) : userData.accentColor ? (
            <div
              className="w-full h-16 border-b border-zinc-800"
              style={{ backgroundColor: userData.accentColor }}
            />
          ) : null}

          <div className="p-6 sm:p-8 space-y-6">
            {/* Profile header row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar Display */}
              <div className="relative shrink-0 -mt-12 sm:-mt-16">
                <img
                  src={userData.avatarUrl}
                  alt={`${userData.username} avatar`}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover bg-zinc-800 border-4 border-zinc-950 shadow-2xl"
                />
                {userData.isAnimatedAvatar && (
                  <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-full bg-discord-blurple text-[10px] font-black text-white shadow-md">
                    GIF
                  </span>
                )}
              </div>

              {/* User Identity Details */}
              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className="text-xl sm:text-2xl font-black text-white">
                    {userData.globalName}
                  </h2>
                  {userData.isBot && (
                    <span className="px-2 py-0.5 rounded-md bg-discord-blurple text-[10px] font-bold text-white uppercase tracking-wider">
                      Bot
                    </span>
                  )}
                </div>

                <p className="font-mono text-xs text-zinc-400">{userData.tag}</p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-xs text-zinc-400">
                  <button
                    onClick={() => copyToClipboard(userData.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-800 text-zinc-300 font-mono transition-colors"
                  >
                    {copiedId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span>ID: {userData.id}</span>
                  </button>

                  {userData.accountAge && (
                    <span className="inline-flex items-center gap-1.5 text-zinc-400">
                      <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Created {userData.accountAge}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Download Action Row */}
            <div className="pt-4 border-t border-zinc-800/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
                Download High-Resolution Files:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {/* PNG HD */}
                <a
                  href={userData.avatarPng}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`${userData.username}-pfp-hd.png`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download High Res (PNG 1024px)</span>
                </a>

                {/* WEBP */}
                <a
                  href={userData.avatarWebp}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={`${userData.username}-pfp-1024.webp`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors border border-zinc-700"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Download WEBP (1024px)</span>
                </a>

                {/* GIF (if animated) */}
                {userData.isAnimatedAvatar && userData.avatarGif && (
                  <a
                    href={userData.avatarGif}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${userData.username}-animated-pfp.gif`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Download Animated GIF (1024px)</span>
                  </a>
                )}

                {/* Banner Download */}
                {userData.hasBanner && (
                  <a
                    href={userData.bannerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={`${userData.username}-banner.png`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-emerald-400 text-xs font-bold transition-colors border border-zinc-700"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Download Profile Banner (HD)</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
