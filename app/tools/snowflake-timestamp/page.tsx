import Link from "next/link";
import { Metadata } from "next";
import {
  Clock,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
  Calendar,
  Layers,
  Cpu,
  Search,
} from "lucide-react";
import SnowflakeConverterClient from "@/components/tools/SnowflakeConverterClient";
import { SITE_URL, DEFAULT_OG_IMAGES, generateBreadcrumbSchema } from "@/lib/seo";
import { getPageSeo } from "@/lib/seoSettings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("tool_snowflake_timestamp");
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/tools/snowflake-timestamp`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/tools/snowflake-timestamp`,
      images: DEFAULT_OG_IMAGES,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/og-image.png"],
    },
  };
}

export default function SnowflakeConverterPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord Snowflake to Timestamp Converter",
      url: "/tools/snowflake-timestamp",
    },
  ]);

  const faqs = [
    {
      q: "Can I find out when an account was created using just their Discord ID?",
      a: "Yes! Every Discord User ID is a 64-bit snowflake integer. The first 42 bits of that integer represent the exact number of milliseconds that have passed since the Discord Epoch (January 1, 2015). Our tool extracts that value to calculate the exact millisecond, day, and year the account was registered.",
    },
    {
      q: "Does this tool work on Server IDs, Channel IDs, and Message IDs?",
      a: "Yes! All Discord entities — including Users, Guilds (Servers), Channels, Roles, Emojis, and Messages — use the exact same Snowflake ID format. You can paste any of these IDs to find out when that specific entity was created.",
    },
    {
      q: "What is the “Discord Epoch”?",
      a: "The Discord Epoch is the custom starting timestamp used by Discord's backend engineering team: January 1, 2015 at 00:00:00 UTC (equivalent to 1420070400000 in Unix milliseconds). All Snowflake timestamps are calculated offset from this date.",
    },
    {
      q: "How can I tell if an account is a newly created alt or scammer?",
      a: "If someone messages you claiming to be a server administrator, trade middleman, or giveaway sponsor, copy their User ID and paste it here. If their account age shows “Created 2 days ago”, it is almost certainly a burner alt account or imposter.",
    },
    {
      q: "How do I copy a Discord User ID or Server ID?",
      a: "Open Discord Settings &gt; Advanced &gt; turn on “Developer Mode”. Now right-click any user avatar, server icon, or message, and select “Copy User ID” or “Copy Server ID”.",
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
    name: "How to Find the Creation Date of a Discord Account or Server",
    description: "Step-by-step guide to decoding Discord Snowflake IDs to reveal creation timestamps and age.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Copy the Snowflake ID",
        text: "Enable Developer Mode in Discord, right-click the user, server, or channel, and select “Copy ID”.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste into the Snowflake Decoder",
        text: "Paste the 17-20 digit number into the search box above.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "View Creation Date & Relative Age",
        text: "Click “Decode ID” to instantly view the exact local date, UTC timestamp, Unix seconds, and relative age.",
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
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-purple-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            <span>Discord Snowflake ID to Timestamp</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Snowflake to Timestamp Converter: <span className="text-purple-400">Discord Account &amp; Server Age Finder</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord Snowflake to Timestamp Converter: Have you ever wanted to know when a specific user joined Discord, when a community server was founded, or the exact millisecond a message was posted? In{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>
              , every entity is given a unique 64-bit integer called a “Snowflake ID”.
            </p>
            <p>
              Unlike random identification numbers, Discord Snowflakes are structured with a timestamp baked directly into the number itself. Our Snowflake Converter calculates the binary offset from the Discord Epoch (Jan 1, 2015) to uncover the exact creation date, local time, UTC timestamp, and account age in years and days.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Simply paste any 17-20 digit Discord ID (User ID, Server ID, or Message ID) below and click “Decode ID” to check its age!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <SnowflakeConverterClient />

      {/* How to Find Creation Date */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Find the Creation Date of a Discord Account or Server
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-purple-400">Step 1</span>
            <h3 className="font-bold text-white text-sm">Copy the Snowflake ID</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enable Developer Mode in Discord, right-click any user or server, and choose “Copy ID”.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-purple-400">Step 2</span>
            <h3 className="font-bold text-white text-sm">Paste into Decoder</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter the 17 to 20-digit number into the search box above and hit “Decode ID”.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-purple-400">Step 3</span>
            <h3 className="font-bold text-white text-sm">View Exact Age</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Read the exact registration date, UTC time, Unix seconds, and relative age breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* How Discord Snowflake IDs Work */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          What is a Discord Snowflake ID and How Does It Work?
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Inspired by Twitter&apos;s Snowflake architecture, Discord uses 64-bit unsigned integers to ensure IDs are globally unique, k-sorted by creation time, and generated without a central database bottleneck. Here is the mathematical structure:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>42 Bits - Millisecond Timestamp</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bits 63 through 22 represent milliseconds elapsed since the Discord Epoch (<code className="text-purple-300">1420070400000</code>). Shifting the ID right by 22 bits isolates this timestamp.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>5 Bits - Internal Worker ID</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bits 21 through 17 represent the internal Discord backend cluster worker node (0 to 31) that originally manufactured the Snowflake.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>5 Bits - Process ID</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bits 16 through 12 specify the internal worker operating process (0 to 31) handling that request to prevent multi-threaded ID collisions.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-discord-blurple" />
              <span>12 Bits - Sequence Increment</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Bits 11 through 0 count up from 0 to 4,095 for IDs generated within the very same millisecond on that process, ensuring zero duplicate IDs worldwide.
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
              <span>⏱️</span>
              <span>Exact Millisecond Precision</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Decodes creation timestamps down to the exact millisecond using 64-bit BigInt calculations.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📅</span>
              <span>Relative Age Calculator</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Instantly calculates account age in years and total days (e.g. 5.4 years old / 1,980 days ago).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🌐</span>
              <span>Local &amp; UTC Formats</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Displays timestamps in your local device timezone, standardized UTC, Unix seconds, and ISO 8601.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔍</span>
              <span>Universal Entity Support</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Decodes IDs for Users, Servers, Channels, Roles, Emojis, and direct chat Messages.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔒</span>
              <span>100% Private Client-Side Math</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Because Snowflakes encode timestamps mathematically, calculations run instantly in your browser with zero network tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-purple-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Explore more tools and directories on DiscordServerLink:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://discordserverlink.com/discord-servers/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Discord Servers</span>
          </a>
          <a
            href="https://discordserverlink.com/best-discord-bots-list/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Bot className="w-3.5 h-3.5 text-discord-blurple" />
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
          <HelpCircle className="w-5 h-5 text-purple-400" />
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
