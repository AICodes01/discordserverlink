"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
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
  Lock,
} from "lucide-react";
import FAQAccordion, { FAQItem } from "@/components/FAQAccordion";
import { generateFAQSchema } from "@/lib/seo";
import ServerSubmissionContent from "@/components/ServerSubmissionContent";

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
  const { data: session, status } = useSession();
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
        if (data.needsReview) {
          router.push(`/dashboard?notice=review_pending&server=${encodeURIComponent(data.server.name)}`);
        } else {
          router.push(`/server/${data.server.slug}`);
        }
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

      {/* ========================================================= */}
      {/* SUBMIT YOUR SERVER HERO & INTRO */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 overflow-hidden shadow-2xl space-y-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-discord-blurple/10 border border-discord-blurple/20 text-xs font-bold text-discord-blurple">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Submit Your Server • 100% Free Listing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Submit Your Server
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Submit Your Server: Adding your server to the Discord Directory is one of the best ways to grow your Discord community and connect with millions of passionate users. If you own a{" "}
              <Link
                href="https://discordserverlink.com/"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord server
              </Link>{" "}
              and want to list it for free to reach thousands of active users who are looking for new communities, then you’ve come to the right place.
            </p>
            <p>
              On our Discord Server Directory website,{" "}
              <Link
                href="https://discordserverlink.com/"
                className="text-white font-bold underline decoration-discord-blurple underline-offset-4 hover:text-discord-blurple"
              >
                DiscordServerLink.com
              </Link>
              , you can submit your server link for free and showcase it to thousands of active Discord users every day. Scroll down to the Discord Sever Link form below to submit and list your server now.
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-2">
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Submit Your Discord Server
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              DiscordServerLink.com allows all users to submit their server link to the website for free without registration. However, we also offer a paid plan. We have made the process very easy and simple. Just fill out a simple form with accurate details such as name, category, tags, and a short description.
            </p>
          </div>

          {/* Specification Overview Table */}
          <div className="pt-2">
            <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950/70">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/90 text-xs uppercase font-bold text-zinc-400 border-b border-zinc-800">
                  <tr>
                    <th scope="col" className="px-5 py-3 text-white">
                      Discord Server Link
                    </th>
                    <th scope="col" className="px-5 py-3 text-white">
                      Submit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">Link Type</td>
                    <td className="px-5 py-3 text-discord-blurple font-medium">
                      Discord Server Join Link
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">Listing Cost</td>
                    <td className="px-5 py-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                        FREE
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">Link Approval</td>
                    <td className="px-5 py-3 text-zinc-300">Required</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">Contact us</td>
                    <td className="px-5 py-3">
                      <Link
                        href="https://discordserverlink.com/contact-us/"
                        className="text-discord-blurple underline font-semibold hover:text-discord-hover"
                      >
                        Here
                      </Link>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">Platform</td>
                    <td className="px-5 py-3">
                      <a
                        href="https://discord.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-discord-blurple underline font-semibold hover:text-discord-hover"
                      >
                        Discord
                      </a>
                    </td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="px-5 py-3 font-semibold text-white">How to Promote</td>
                    <td className="px-5 py-3 text-emerald-400 font-medium">
                      Fill the Form
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Main Submission Form or Login Barrier */}
      {status === "unauthenticated" ? (
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-3xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-8 h-8" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl font-black text-white">Sign In Required to Submit Server</h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Only logged-in users can list a Discord server. Signing in links your server to your user dashboard so you can view live analytics (views, bumps, join clicks) and manage or promote it.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/login?callbackUrl=/servers/new"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-sm shadow-glow hover:shadow-glow-sm transition hover:scale-105"
            >
              <span>Sign In with Discord to Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : !(session?.user as any)?.hasDiscord && (session?.user as any)?.role !== "ADMIN" && (session?.user as any)?.email !== "demo@discordserverlink.com" ? (
        <div className="rounded-3xl bg-gradient-to-b from-indigo-950/40 via-zinc-900 to-zinc-900 border border-indigo-500/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl backdrop-blur-xl">
          <div className="w-16 h-16 rounded-3xl bg-discord-blurple/20 border border-discord-blurple/40 text-discord-blurple flex items-center justify-center mx-auto shadow-inner">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 127.14 96.36">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
            </svg>
          </div>
          <div className="space-y-3 max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-white">Discord Account Required</h2>
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm font-semibold text-center">
              To add and manage Discord servers, please connect your Discord account.
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You are currently signed in as <strong className="text-zinc-200">{session?.user?.email}</strong>. Because Discord requires verified ownership or admin permissions to list a server, connecting your Discord account takes only 5 seconds.
            </p>
          </div>
          <button
            type="button"
            onClick={() => signIn("discord", { callbackUrl: "/servers/new" })}
            className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-sm shadow-glow transition hover:scale-105 cursor-pointer"
          >
            <span>Connect Discord Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
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
              className="py-3 px-6 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-glow-sm flex-shrink-0 disabled:opacity-50 cursor-pointer"
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
              <span>Loaded &amp; Verified: <strong>{name}</strong> ({memberCount.toLocaleString("en-US")} members)</span>
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
                <option value="movies-entertainment">Movies &amp; Entertainment</option>
                <option value="esports-tournaments">eSports &amp; Tournaments</option>
                <option value="artificial-intelligence">Artificial Inteligence</option>
                <option value="sports-fitness">Sports &amp; Fitness</option>
                <option value="movies-television">Movies &amp; Television</option>
                <option value="podcasts-talk">Podcasts &amp; Talk</option>
                <option value="memes-humor">Memes &amp; Humor</option>
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
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-discord-blurple to-indigo-600 hover:from-discord-hover hover:to-indigo-500 text-white font-bold text-base shadow-glow transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
      )}

      {/* ========================================================= */}
      {/* RULES, BENEFITS, WHY DISCORDSERVERLINK, CONCLUSION & DISCLAIMER */}
      {/* ========================================================= */}
      <ServerSubmissionContent />

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
