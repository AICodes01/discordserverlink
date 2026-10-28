"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Link as LinkIcon,
  Search,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Zap,
  TrendingUp,
  ShieldCheck,
  Rocket,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import FAQAccordion, { FAQItem } from "@/components/FAQAccordion";
import { generateFAQSchema } from "@/lib/seo";

const ADD_SERVER_FAQS: FAQItem[] = [
  {
    question: "How long does it take for my Discord server to appear on DiscordServerLink?",
    answer: "Your listing appears **immediately**! As soon as you click 'Publish to DiscordServerLink', your public server page is generated, indexed, and made discoverable on the homepage, category hubs, and tag pages.",
  },
  {
    question: "How does the 2-Hour Bumping feature help my community grow?",
    answer: "Bumping is the single most powerful organic growth tool on DiscordServerLink. Whenever you or any member of your community clicks the 'Bump Server' button on your listing, your server shoots directly to the **#1 spot** on our homepage and category feeds. You can bump every 2 hours, 24/7.",
  },
  {
    question: "What happens if someone tries to add a server that already exists?",
    answer: "Our system automatically detects existing server IDs and invite codes to prevent duplicate listings. If a server is already in our directory, a popup will notify the submitter with a direct link to the existing server profile where they can view, share, and bump it.",
  },
  {
    question: "Does listing on DiscordServerLink help my server rank on Google?",
    answer: "Yes, absolutely! Every server page on DiscordServerLink is rendered on the server with custom meta tags, OpenGraph social preview cards, clean canonical URLs, and structured JSON-LD schemas. Search engines like Google crawl and index your server's keywords, helping you gain traffic from organic search.",
  },
  {
    question: "Can I edit my server's description, tags, or invite code later?",
    answer: "Yes. You can edit your server details anytime from your dashboard or contact our verified moderators via the Admin Panel. Changing tags, updating banners, or refreshing invite links takes effect in real time.",
  },
  {
    question: "Are there any listing fees or hidden charges?",
    answer: "No, listing your Discord server on DiscordServerLink is **100% free forever**. You get instant indexing, unlimited bumps, member count sync, and review collection at zero cost.",
  },
];

export default function AddServerPage() {
  const router = useRouter();
  const [inviteUrl, setInviteUrl] = useState("");
  const [fetchingDiscord, setFetchingDiscord] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Duplicate Server Detection Modal State
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [duplicateServer, setDuplicateServer] = useState<{
    name: string;
    slug: string;
    iconUrl?: string | null;
    memberCount?: number;
    categorySlug?: string;
  } | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("gaming");
  const [tags, setTags] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [guildId, setGuildId] = useState("");
  const [memberCount, setMemberCount] = useState(0);
  const [onlineCount, setOnlineCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isPartnered, setIsPartnered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const faqSchema = generateFAQSchema(ADD_SERVER_FAQS);

  const handleFetchDiscord = async () => {
    if (!inviteUrl.trim()) {
      setFetchError("Please enter a Discord invite link");
      return;
    }

    setFetchingDiscord(true);
    setFetchError(null);

    try {
      const res = await fetch("/api/discord/fetch-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setFetchError(data.error || "Failed to fetch Discord server");
      } else if (data.alreadyExists && data.existingServer) {
        // TRIGGER DUPLICATE POPUP
        setDuplicateServer(data.existingServer);
        setShowDuplicateModal(true);
      } else {
        setName(data.name || "");
        if (data.description) {
          setShortDescription(data.description);
          setLongDescription(data.description);
        }
        if (data.iconUrl) setIconUrl(data.iconUrl);
        if (data.bannerUrl) setBannerUrl(data.bannerUrl);
        if (data.guildId) setGuildId(data.guildId);
        if (data.memberCount) setMemberCount(data.memberCount);
        if (data.onlineCount) setOnlineCount(data.onlineCount);
        if (data.isVerified) setIsVerified(true);
        if (data.isPartnered) setIsPartnered(true);
      }
    } catch {
      setFetchError("Network error while inspecting invite link");
    } finally {
      setFetchingDiscord(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortDescription || !inviteUrl) {
      setSubmitError("Please fill out all required fields.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          shortDescription,
          longDescription,
          inviteUrl,
          categorySlug,
          tags,
          iconUrl,
          bannerUrl,
          guildId,
          memberCount,
          onlineCount,
          isVerified,
          isPartnered,
        }),
      });

      const data = await res.json();

      if (res.status === 409 || data.alreadyExists) {
        setDuplicateServer({
          name: name,
          slug: data.slug,
          iconUrl: iconUrl,
          memberCount: memberCount,
        });
        setShowDuplicateModal(true);
        setSubmitError(data.error || "This server already exists on our website!");
        return;
      }

      if (!res.ok) {
        setSubmitError(data.error || "Failed to create server");
      } else {
        router.push(`/server/${data.server.slug}`);
      }
    } catch {
      setSubmitError("Failed to save server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* ========================================================= */}
      {/* DUPLICATE SERVER POPUP MODAL */}
      {/* ========================================================= */}
      {showDuplicateModal && duplicateServer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-amber-500/30 p-6 sm:p-8 space-y-5 shadow-2xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Server Already Listed!
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white pt-2">
                {duplicateServer.name}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                This Discord server is already published and indexed on <strong className="text-zinc-200">DiscordServerLink</strong>. You can view its live profile, share it, or bump it directly to the top of the leaderboard below!
              </p>
            </div>

            {duplicateServer.iconUrl && (
              <img
                src={duplicateServer.iconUrl}
                alt={duplicateServer.name}
                className="w-16 h-16 rounded-2xl mx-auto border-2 border-zinc-700 object-cover shadow-lg"
              />
            )}

            <div className="space-y-2.5 pt-2">
              <Link
                href={`/server/${duplicateServer.slug}`}
                className="w-full py-3.5 px-6 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-sm shadow-glow transition flex items-center justify-center gap-2"
              >
                <span>View Server Listing &amp; Bump Page</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  setShowDuplicateModal(false);
                  setInviteUrl("");
                  setName("");
                  setShortDescription("");
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition"
              >
                Close &amp; List a Different Server
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-discord-blurple/10 border border-discord-blurple/20 text-xs font-bold text-discord-blurple mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Free Discord Server Listing &amp; Growth Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          List Your Discord Server
        </h1>
        <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Reach thousands of organic, active Discord users daily. Enter your invite link below to
          automatically import your icons, banners, and member metrics in seconds.
        </p>
      </div>

      {/* Main Submission Form */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Step 1: Discord Invite Auto-Fetch */}
        <div className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-4">
          <label className="block text-sm font-bold text-white">
            1. Enter Your Discord Invite Link <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://discord.gg/your-code or discord.gg/code"
                value={inviteUrl}
                onChange={(e) => setInviteUrl(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
              />
              <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="button"
              onClick={handleFetchDiscord}
              disabled={fetchingDiscord}
              className="py-3 px-6 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-glow-sm flex-shrink-0 disabled:opacity-50"
            >
              {fetchingDiscord ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Inspecting Invite...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Auto-Fetch Details</span>
                </>
              )}
            </button>
          </div>

          {fetchError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-xl">
              {fetchError}
            </p>
          )}

          {name && (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-discord-green/10 border border-discord-green/20 text-discord-green text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Loaded &amp; Verified: <strong>{name}</strong> ({memberCount.toLocaleString()} members)</span>
            </div>
          )}
        </div>

        {/* Step 2: Server Details Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Server Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Aetheria Gaming Community"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Primary Category <span className="text-red-400">*</span>
              </label>
              <select
                value={categorySlug}
                onChange={(e) => setCategorySlug(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
              >
                <option value="gaming">Gaming</option>
                <option value="anime">Anime &amp; Manga</option>
                <option value="technology">Technology &amp; Coding</option>
                <option value="community">Community &amp; Hangout</option>
                <option value="music">Music &amp; Audio</option>
                <option value="education">Education &amp; Science</option>
                <option value="finance">Crypto &amp; Finance</option>
                <option value="art">Art &amp; Design</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Short Summary (Shown in Google Snippets &amp; Cards) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              required
              maxLength={180}
              placeholder="1-2 sentences highlighting why visitors should join your community..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Characters: {shortDescription.length} / 180 (optimizes for Google SERP display)
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Detailed Description &amp; Community Rules
            </label>
            <textarea
              rows={5}
              value={longDescription}
              onChange={(e) => setLongDescription(e.target.value)}
              placeholder="Detail your channels, event calendar, leveling bots, voice rooms, and server rules..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
              Keywords &amp; SEO Tags (Comma Separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g. minecraft, valorant, voice-chat, chill, giveaways"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-200 focus:outline-none focus:border-discord-blurple"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Separate tags with commas. Helps users discover your server through search tags.
            </p>
          </div>

          {/* Media preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Icon URL
              </label>
              <input
                type="text"
                value={iconUrl}
                onChange={(e) => setIconUrl(e.target.value)}
                placeholder="https://cdn.discordapp.com/icons/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                Banner URL (Optional)
              </label>
              <input
                type="text"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-zinc-200 focus:outline-none focus:border-discord-blurple"
              />
            </div>
          </div>

          {submitError && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
              {submitError}
            </p>
          )}

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-discord-blurple to-indigo-600 hover:from-discord-hover hover:to-indigo-500 text-white font-bold text-base shadow-glow transition flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publishing Server...</span>
                </>
              ) : (
                <>
                  <span>Publish to DiscordServerLink</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ShoutMeLoud-Style Growth Blueprint Editorial */}
      <section className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-discord-green uppercase tracking-wider">
            <Rocket className="w-4 h-4" />
            <span>Server Growth Masterclass</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            The Blueprint to 10,000+ Discord Members in 2026 (ShoutMeLoud Guide)
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Let&apos;s be honest: creating a Discord server is easy, but keeping it vibrant and growing requires a proven strategy. Here are the 4 non-negotiable tactics top server founders use on DiscordServerLink:
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-discord-blurple font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Step 1: Master the 5-Second Onboarding Rule</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              When a new user joins, do not overwhelm them with 40 channels. Keep your public channels under 8 initially. Create a clear <code>#welcome-and-rules</code> channel with auto-role reactions so visitors instantly feel oriented.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-discord-blurple font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Step 2: Maintain a Consistent Bumping Schedule</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              On DiscordServerLink, the bump button resets every 2 hours. Assign a &quot;Bump Squad&quot; role or use a reminder channel to bump your listing around the clock. Servers that bump at least 6 times daily receive up to <strong>14x more organic join clicks</strong>.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <div className="flex items-center gap-2 text-discord-blurple font-bold text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Step 3: Host Weekly Community Rituals</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Dead servers lack scheduled events. Host weekly game tournaments, movie watch parties, or Discord Nitro giveaways. Regular voice events create habitual returning members who invite their personal friends.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-r from-discord-blurple/15 to-indigo-950/30 border border-discord-blurple/30 flex items-start gap-3.5">
          <Zap className="w-5 h-5 text-discord-yellow flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
            <strong className="text-white font-bold">SEO Ranking Hack:</strong> Always write unique descriptions for your server listing. Search engines like Google downrank duplicate copy. A thoughtful, original summary helps your server outrank competitors for niche search terms.
          </div>
        </div>
      </section>

      {/* FAQs Section with Schema.org Integration */}
      <FAQAccordion
        faqs={ADD_SERVER_FAQS}
        title="Frequently Asked Questions About Listing Your Server"
        description="Clear answers on publishing, indexing, and accelerating your server's growth."
      />
    </div>
  );
}
