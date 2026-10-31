import Link from "next/link";
import { Metadata } from "next";
import {
  Wrench,
  Link2,
  Calculator,
  Clock,
  Palette,
  Send,
  Type,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Discord Tools & Utilities 2026 - DiscordServerLink",
  description:
    "Collection of free Discord tools: Discord PFP Viewer & Grabber, Discord Invite Link Inspector, Permissions Calculator, Snowflake to Timestamp ID Finder, Colored ANSI Text Formatter, Webhook Sender, and Fancy Fonts.",
  alternates: {
    canonical: "https://discordserverlink.com/tools",
  },
};

interface ToolItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  badgeColor: string;
  icon: any;
  color: string;
  description: string;
  features: string[];
}

const TOOLS_LIST: ToolItem[] = [
  {
    id: "tool-discord-pfp-viewer",
    slug: "discord-pfp-viewer",
    title: "Discord PFP Viewer & Grabber",
    category: "Profile Utility",
    badge: "New",
    badgeColor: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    icon: User,
    color: "from-indigo-600 to-purple-600",
    description:
      "View and download any Discord user's profile picture (avatar) and server banner in original high quality (1024x1024) or animated GIF using just their User ID.",
    features: [
      "Full HD 1024×1024 raw image download",
      "Automatic Nitro GIF animated avatar detection",
      "Profile banner & accent color grabber",
      "100% anonymous with no login required",
    ],
  },
  {
    id: "tool-invite-checker",
    slug: "invite-checker",
    title: "Discord Invite Link Inspector",
    category: "Server Utility",
    badge: "Popular",
    badgeColor: "bg-discord-blurple/20 text-discord-blurple border-discord-blurple/30",
    icon: Link2,
    color: "from-blue-600 to-indigo-600",
    description:
      "Check any Discord invite link or code. Instantly view server icon, banner, online presence, total member count, verification status, and expiration.",
    features: ["Real-time Discord API verification", "Online & total member counters", "Server icon & splash preview", "Channel & expiration detection"],
  },
  {
    id: "tool-permissions-calculator",
    slug: "permissions-calculator",
    title: "Discord Permissions Calculator",
    category: "Developer & Admin",
    badge: "Essential",
    badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: Calculator,
    color: "from-emerald-600 to-teal-600",
    description:
      "Calculate bitwise permission integers for Discord bots and server roles. Enter your Client ID to generate an instant 1-click bot invite link.",
    features: ["Full Discord OAuth2 permissions matrix", "Real-time integer calculator", "1-click Bot Invite URL generator", "Preset role permission templates"],
  },
  {
    id: "tool-snowflake-timestamp",
    slug: "snowflake-timestamp",
    title: "Snowflake ID to Timestamp Converter",
    category: "Investigation",
    badge: "Accurate",
    badgeColor: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    icon: Clock,
    color: "from-purple-600 to-pink-600",
    description:
      "Decode any Discord snowflake ID (Users, Servers, Channels, Roles, or Messages) to find the exact creation date, UTC time, and account age.",
    features: ["Exact account & server creation date", "Relative age (e.g. 5 years ago)", "Unix timestamp & epoch millisecond conversion", "Internal worker & process breakdown"],
  },
  {
    id: "tool-markdown-color-text",
    slug: "markdown-color-text",
    title: "Colored ANSI Text & Markdown Styler",
    category: "Formatting",
    badge: "Creative",
    badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Palette,
    color: "from-amber-600 to-orange-600",
    description:
      "Create vibrant colored text messages for Discord using ANSI codeblocks. Preview Red, Green, Blue, Cyan text and formatting before copying.",
    features: ["8 ANSI foreground & background colors", "Bold, underline, and spoiler formatting", "Live Discord dark-theme preview", "1-click formatted code copy"],
  },
  {
    id: "tool-webhook-sender",
    slug: "webhook-sender",
    title: "Discord Webhook Message Sender",
    category: "Developer",
    badge: "Utility",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    icon: Send,
    color: "from-rose-600 to-red-600",
    description:
      "Send custom messages, test embeds, and announcements to any Discord channel using webhooks. Customize bot avatar, name, and embed colors.",
    features: ["Custom bot name & avatar image", "Interactive Discord embed designer", "Live Discord chat preview", "Direct secure webhook delivery"],
  },
  {
    id: "tool-fancy-fonts",
    slug: "fancy-fonts",
    title: "Discord Fancy Font & Nickname Styler",
    category: "Aesthetics",
    badge: "Customization",
    badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    icon: Type,
    color: "from-cyan-600 to-blue-600",
    description:
      "Convert ordinary text into over 15+ aesthetic Unicode font styles for Discord nicknames, channel names, role titles, and server announcements.",
    features: ["Gothic, Monospace, Cursive & Bubble fonts", "Small Caps and Vaporwave text", "1-click copy for Discord channel titles", "100% compatible with Discord app"],
  },
];

export default function ToolsHubPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-zinc-900 via-emerald-950/30 to-zinc-900 border border-zinc-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
            <Wrench className="w-3.5 h-3.5" />
            <span>Free Web-Based Discord Utilities</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Discord <span className="text-emerald-400">Tools & Utilities</span> Hub
          </h1>
          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Free, powerful web tools built for Discord server owners, bot developers, moderators, and community members. Grab user PFPs, inspect invites, calculate permissions, format colored text, and decode snowflake IDs.
          </p>
        </div>
      </div>

      {/* Tools Cards Grid (Cart / Card wise) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>All Available Tools</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
              {TOOLS_LIST.length} Tools
            </span>
          </h2>
          <span className="text-xs text-zinc-400">100% Free • No Login Required</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {TOOLS_LIST.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.slug}`}
                className="group relative flex flex-col justify-between bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1.5"
              >
                <div>
                  {/* Top Bar: Icon & Category */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.badgeColor}`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1">
                    {tool.category}
                  </span>
                  <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {tool.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-zinc-400 leading-relaxed">
                    {tool.description}
                  </p>

                  {/* Features List */}
                  <div className="mt-4 pt-3 border-t border-zinc-800/80 space-y-1.5">
                    {tool.features.slice(0, 3).map((feat, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-[11px] text-zinc-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">Web Tool</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
