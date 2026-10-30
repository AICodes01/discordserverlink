"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  ArrowLeft,
  Sparkles,
  Link as LinkIcon,
  CheckCircle,
  ExternalLink,
  Shield,
  Layers,
  HelpCircle,
  Info,
} from "lucide-react";

const CATEGORIES = [
  { slug: "moderation", label: "Moderation" },
  { slug: "music", label: "Music" },
  { slug: "ai", label: "AI & Chatbots" },
  { slug: "utility", label: "Utility" },
  { slug: "gaming", label: "Gaming" },
  { slug: "economy", label: "Economy" },
  { slug: "anime", label: "Anime" },
];

export default function NewBotPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [category, setCategory] = useState("utility");
  const [prefix, setPrefix] = useState("/");
  const [iconUrl, setIconUrl] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [features, setFeatures] = useState("");
  const [tags, setTags] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successSlug, setSuccessSlug] = useState<string | null>(null);

  // Auto-generate invite URL when Client ID is filled and inviteUrl is empty
  const handleClientIdChange = (id: string) => {
    setClientId(id);
    const trimmed = id.trim();
    if (trimmed && (!inviteUrl || inviteUrl.includes("client_id="))) {
      setInviteUrl(
        `https://discord.com/oauth2/authorize?client_id=${trimmed}&scope=bot%20applications.commands&permissions=8`
      );
    }
  };

  const previewIcon =
    iconUrl.trim() ||
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80";

  const featureList = features
    .split(",")
    .map((f) => f.trim())
    .filter(Boolean);

  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your Discord bot's name.");
      return;
    }

    if (!shortDescription.trim() || shortDescription.trim().length < 10) {
      setError("Short description must be at least 10 characters.");
      return;
    }

    const finalInvite =
      inviteUrl.trim() ||
      (clientId.trim()
        ? `https://discord.com/oauth2/authorize?client_id=${clientId.trim()}&scope=bot%20applications.commands&permissions=8`
        : "");

    if (!finalInvite) {
      setError("Please provide either your Discord Client ID or an Invite URL.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/bots/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          clientId: clientId.trim(),
          inviteUrl: finalInvite,
          category,
          prefix: prefix.trim() || "/",
          iconUrl: previewIcon,
          shortDescription: shortDescription.trim(),
          longDescription: longDescription.trim() || shortDescription.trim(),
          features: featureList.length > 0 ? featureList : ["Slash Commands", "24/7 Uptime"],
          tags: tagList.length > 0 ? tagList : [category, "bot"],
          websiteUrl: websiteUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit Discord bot.");
      }

      setSuccessSlug(data.slug);
      setTimeout(() => {
        router.push(`/bot/${data.slug}`);
      }, 1500);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/bots"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Bots Directory</span>
        </Link>
        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold">
          100% Free Listing
        </span>
      </div>

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <Bot className="w-3.5 h-3.5" />
            <span>Developer Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            List Your <span className="text-discord-blurple">Discord Bot</span> for Free
          </h1>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Reach thousands of active Discord server owners searching for moderation, music, economy, and AI bots. Free public indexing and SEO promotion.
          </p>
        </div>
      </div>

      {/* Main Grid: Form + Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Form (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
              {error}
            </div>
          )}

          {successSlug && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                Bot listed successfully! Redirecting to your bot page...
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Bot Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Bot Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CyberGuard"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Category <span className="text-red-400">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.slug} value={cat.slug}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Client ID & Prefix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5 flex items-center justify-between">
                  <span>Discord Client / App ID</span>
                  <span className="text-[10px] text-zinc-500 font-normal">Optional auto-invite</span>
                </label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => handleClientIdChange(e.target.value)}
                  placeholder="e.g. 1198555191834247269"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Default Prefix
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="/"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
                />
              </div>
            </div>

            {/* Invite URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Bot Invite URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                required
                value={inviteUrl}
                onChange={(e) => setInviteUrl(e.target.value)}
                placeholder="https://discord.com/oauth2/authorize?client_id=...&scope=bot"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple font-mono text-xs"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                Your direct Discord OAuth2 invite link or official bot invitation page.
              </p>
            </div>

            {/* Icon / Avatar URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Avatar / Icon Image URL
              </label>
              <input
                type="url"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://... (Discord CDN, Imgur, or direct image link)"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Short Description <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={140}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="1-2 punchy sentences describing what your bot does."
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>Shown on cards across the directory.</span>
                <span>{shortDescription.length}/140</span>
              </div>
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Detailed Overview / Documentation
              </label>
              <textarea
                rows={4}
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                placeholder="Explain commands, setup steps, permissions, and key benefits..."
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple resize-y"
              />
            </div>

            {/* Features (comma separated) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                Key Features (comma separated)
              </label>
              <input
                type="text"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="e.g. Auto-mod, Reaction Roles, Leveling, Web Dashboard"
                className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
              />
            </div>

            {/* Search Tags & Website */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. music, spotify, games, economy"
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                  Website / Support Server
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-zinc-950 border border-zinc-700/80 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-discord-blurple hover:bg-discord-hover text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-glow-sm hover:shadow-glow disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <span>Publishing Bot...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish Discord Bot to Directory</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Live Preview Card (5 cols) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Live Directory Preview</span>
            <span className="text-discord-blurple">Interactive</span>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl group hover:border-discord-blurple/50 transition-all">
            <div className="p-5 space-y-4">
              {/* Header row */}
              <div className="flex items-start gap-3.5">
                <img
                  src={previewIcon}
                  alt={name || "Bot Preview"}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=256&auto=format&fit=crop&q=80";
                  }}
                  className="w-14 h-14 rounded-2xl object-cover bg-zinc-800 border border-zinc-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-base truncate">
                      {name || "Your Bot Name"}
                    </h3>
                    <span className="text-emerald-400 text-xs font-bold">★ New</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                    <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] uppercase font-semibold text-zinc-300">
                      {category}
                    </span>
                    <span>Prefix: {prefix || "/"}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
                {shortDescription ||
                  "Your punchy bot description will appear here on directory cards and category search listings."}
              </p>

              {/* Feature bullets preview */}
              <div className="space-y-1.5 pt-1 border-t border-zinc-800/80">
                {(featureList.length > 0
                  ? featureList.slice(0, 3)
                  : ["Slash Commands support", "Customizable settings", "24/7 Uptime"]
                ).map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{f}</span>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(tagList.length > 0 ? tagList : [category, "discord", "bot"]).map(
                  (tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 text-[10px]"
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>

              {/* Buttons */}
              <div className="pt-2 flex items-center gap-2 border-t border-zinc-800">
                <button
                  type="button"
                  className="flex-1 bg-discord-blurple text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Invite Bot</span>
                </button>
                <button
                  type="button"
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Quick submission tip */}
          <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-white">
              <Info className="w-4 h-4 text-indigo-400" />
              <span>Instant Public Activation</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Your bot is immediately visible in the directory upon submission. You can share your custom bot link with users right away.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
