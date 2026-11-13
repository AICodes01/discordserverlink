import Link from "next/link";
import { Metadata } from "next";
import {
  Link2,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
  Activity,
  Users,
  Search,
  ExternalLink,
} from "lucide-react";
import InviteCheckerClient from "@/components/tools/InviteCheckerClient";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";
import { getPageSeo } from "@/lib/seoSettings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("tool_invite_checker");
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/tools/invite-checker`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function InviteCheckerPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord Invite Link Checker",
      url: "/tools/invite-checker",
    },
  ]);

  const faqs = [
    {
      q: "Can I inspect a server without joining it on my Discord account?",
      a: "Yes! That is one of the biggest benefits of this tool. You can preview the server's real member counts, online presence, banner, description, and welcome channel without adding the server to your Discord client.",
    },
    {
      q: "Why does an invite link return “Expired or Invalid”?",
      a: "Discord invite links can expire based on time (e.g. 24 hours, 7 days) or max uses (e.g. 10 clicks). An invite can also become invalid if the server was deleted, if the channel was removed, or if the invite was revoked by a server administrator.",
    },
    {
      q: "Does this tool work with vanity URLs (like discord.gg/valorant)?",
      a: "Yes! Our inspector handles standard invite codes (discord.gg/abc123xyz), full URLs (https://discord.com/invite/...), and vanity custom invites (discord.gg/minecraft) seamlessly.",
    },
    {
      q: "What does the “Guild ID” tell me?",
      a: "The Guild ID is the server's permanent unique snowflake identifier. You can copy this ID and paste it into our Snowflake Timestamp tool to find out the exact date and year the server was created.",
    },
    {
      q: "Is it safe to inspect invite links here?",
      a: "Yes, completely safe. We do not store your IP address or invite searches, and we do not require your Discord login. The tool makes a secure, read-only query to the official Discord API.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Check if a Discord Invite Link is Valid",
    description: "Step-by-step guide to inspecting Discord invite links and checking live server statistics.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the Invite Link",
        text: "Copy any Discord invite URL or vanity link (such as discord.gg/gaming or https://discord.gg/xyz).",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste & Inspect",
        text: "Paste the invite code into the search box above and click the “Inspect Server” button.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Review Live Metadata & Join",
        text: "Instantly view real-time online members, total member count, server icon, banner, and validity status before clicking to join.",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Back button */}
      <div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Discord Tools</span>
        </Link>
      </div>

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <Link2 className="w-3.5 h-3.5" />
            <span>Discord Invite Link Inspector</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Invite Link Checker: <span className="text-discord-blurple">Inspect Server Invite Status &amp; Member Counts</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord Invite Link Checker: Have you ever come across a suspicious Discord link or wanted to check if a server invite is still active, safe, and active before clicking it? While{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>{" "}
              shows a basic preview modal when you click an invite in-app, it forces you to open Discord and doesn&apos;t give you detailed server analytics.
            </p>
            <p>
              Our Discord Invite Link Checker is a free tool that queries the official Discord API to verify any invite link or vanity URL. It reveals the server&apos;s real-time online members, total member count, server icon, splash banner, unique Guild ID, destination channel, and expiration timestamp.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Simply paste any Discord invite URL (like discord.gg/minecraft) or invite code below and hit “Inspect Server” to check its status.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <InviteCheckerClient />

      {/* How to Check a Discord Invite Link */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Check if a Discord Invite Link is Valid
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-discord-blurple">Step 1</span>
            <h3 className="font-bold text-white text-sm">Copy the Invite Code</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Grab any Discord link (e.g., discord.gg/valorant or https://discord.gg/abc123xyz) from a website or chat.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-discord-blurple">Step 2</span>
            <h3 className="font-bold text-white text-sm">Paste &amp; Inspect</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste the code into the search box above and click the “Inspect Server” button.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-discord-blurple">Step 3</span>
            <h3 className="font-bold text-white text-sm">View Stats &amp; Join</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Check live member counts, active presence, server features, and expiration status before deciding to join.
            </p>
          </div>
        </div>
      </div>

      {/* How to Tell if a Discord Invite is Safe? */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Tell if a Discord Invite Link is Safe or Expired?
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Before clicking random links sent in direct messages, always check these key safety indicators:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Discord Domain Verification</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Legitimate invite links always point to <code className="text-zinc-300">discord.gg</code> or <code className="text-zinc-300">discord.com/invite</code>. Beware of typo domains like disc0rd or disord-gift.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Healthy Online-to-Total Member Ratio</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Real active communities typically have 15% to 35% of their total members online. Servers with 50,000 members but only 10 online are often filled with inactive bot accounts.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-discord-blurple" />
              <span>Expiration &amp; Single-Use Links</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our tool checks the <code className="text-zinc-300">expires_at</code> field so you know whether the invite is temporary (24 hours) or a permanent invite that never expires.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span>Guild ID &amp; Server Verification</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Copy the unique Guild ID with 1-click and use our Snowflake Tool to see when the server was registered. Beware of brand-new servers impersonating established communities.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚡</span>
              <span>Live Discord API Queries</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Fetches up-to-the-second data directly from Discord&apos;s public API endpoint with zero caching delays.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👥</span>
              <span>Online &amp; Total Member Counts</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Shows accurate approximate member counts and current active online presences for any community.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🖼️</span>
              <span>HD Icon &amp; Banner Preview</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Displays full-resolution server icons and high-quality 1024px server splash banners.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🛡️</span>
              <span>Safe Preview Without Joining</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Inspect suspicious or unknown server links completely anonymously without cluttering your server list.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔗</span>
              <span>Vanity &amp; Custom Link Support</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Inspects standard random invite hashes, full discord.com URLs, and custom server vanity links (e.g. discord.gg/minecraft).
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-indigo-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Discover more active communities and tools on DiscordServerLink:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://discordserverlink.com/discord-servers/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-discord-blurple" />
            <span>Discord Servers</span>
          </a>
          <a
            href="https://discordserverlink.com/best-discord-bots-list/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
            <span>Discord Bots</span>
          </a>
          <a
            href="https://discordserverlink.com/discord-emojis/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span>Discord Emojis</span>
          </a>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-discord-blurple" />
          <span>Frequently Asked Questions (FAQ)</span>
        </h2>

        <div className="space-y-3 pt-2">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-2"
            >
              <h3 className="font-bold text-sm text-white">{f.q}</h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {f.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
