import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { DISCORD_BOTS, BOT_CATEGORIES } from "@/lib/botsData";
import BotCard from "@/components/BotCard";
import {
  CheckCircle2,
  Server,
  Star,
  Plus,
  ExternalLink,
  Bot,
  ArrowLeft,
  Shield,
  Layers,
  Terminal,
  Globe,
  Share2,
} from "lucide-react";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";

interface BotDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return DISCORD_BOTS.map((bot) => ({
    slug: bot.slug,
  }));
}

export async function generateMetadata({
  params,
}: BotDetailPageProps): Promise<Metadata> {
  const bot = DISCORD_BOTS.find((b) => b.slug === params.slug);
  if (!bot) {
    return { title: "Discord Bot Not Found - DiscordServerLink" };
  }

  const title = `${bot.name} Discord Bot - Invite, Prefix & Features 2026`;
  const description = `${bot.shortDescription} Invite ${bot.name} to your server (${bot.formattedServers} servers). Default prefix: ${bot.prefix}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/bot/${bot.slug}`,
    },
    openGraph: {
      title,
      description,
      images: [bot.iconUrl],
    },
  };
}

export default function BotDetailPage({ params }: BotDetailPageProps) {
  const bot = DISCORD_BOTS.find((b) => b.slug === params.slug);
  if (!bot) notFound();

  // Find similar bots in the same category
  const similarBots = DISCORD_BOTS.filter(
    (b) => b.category === bot.category && b.id !== bot.id
  ).slice(0, 3);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Bots", url: "/bots" },
    { name: bot.name, url: `/bot/${bot.slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Back Link */}
      <div>
        <Link
          href="/bots"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Discord Bots</span>
        </Link>
      </div>

      {/* Main Bot Hero Card */}
      <div className="relative rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex items-start sm:items-center gap-6">
            <div className="relative shrink-0">
              <img
                src={bot.iconUrl}
                alt={`${bot.name} logo`}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-zinc-800 border-2 border-zinc-700 shadow-xl"
              />
              {bot.isVerified && (
                <span
                  title="Verified Discord Developer Bot"
                  className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-1 text-discord-blurple shadow-md"
                >
                  <CheckCircle2 className="w-6 h-6 fill-discord-blurple text-zinc-950" />
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                  {bot.name}
                </h1>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30">
                  {bot.categoryLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-zinc-400">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-200">
                  <Server className="w-4 h-4 text-discord-blurple" />
                  <span>{bot.formattedServers} Servers</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{bot.rating} ({bot.votesCount.toLocaleString()} votes)</span>
                </span>
                <span className="text-zinc-600">•</span>
                <span className="flex items-center gap-1 font-mono text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700">
                  <Terminal className="w-3 h-3 text-zinc-400" />
                  <span>Prefix: {bot.prefix}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0">
            <a
              href={bot.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-discord-blurple hover:bg-discord-hover text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Invite {bot.name}</span>
            </a>
            {bot.websiteUrl && (
              <a
                href={bot.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Official Website</span>
                <ExternalLink className="w-3 h-3 text-zinc-500" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Grid: Details & Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Overview & Features */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Bot className="w-5 h-5 text-discord-blurple" />
              <span>About {bot.name}</span>
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
              {bot.longDescription}
            </p>
          </div>

          {/* Key Features */}
          {bot.features && bot.features.length > 0 && (
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Key Features & Capabilities</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {bot.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800 text-xs font-medium text-zinc-200"
                  >
                    <div className="w-2 h-2 rounded-full bg-discord-blurple shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-3">
            <h3 className="text-sm font-bold text-zinc-300">Category Tags</h3>
            <div className="flex flex-wrap gap-2">
              {bot.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/bots?q=${encodeURIComponent(tag)}`}
                  className="px-3 py-1 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 text-xs text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Bot Specs & Stats */}
        <div className="space-y-6">
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
              Bot Information
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Total Servers</span>
                <span className="font-semibold text-white">{bot.serverCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Default Prefix</span>
                <span className="font-mono font-bold text-discord-blurple bg-zinc-800 px-2 py-0.5 rounded">
                  {bot.prefix}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Verified</span>
                <span className="font-semibold text-emerald-400">
                  {bot.isVerified ? "Yes (Official Discord Verified)" : "Community Bot"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">Category</span>
                <span className="font-semibold text-white">{bot.categoryLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-400">User Rating</span>
                <span className="font-semibold text-amber-400">★ {bot.rating} / 5.0</span>
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-800">
              <a
                href={bot.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-discord-blurple hover:bg-discord-hover text-white py-3 rounded-xl text-xs font-bold shadow-glow-sm hover:shadow-glow transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Discord</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Bots Section */}
      {similarBots.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>More {bot.categoryLabel} Bots</span>
            </h2>
            <Link
              href={`/bots?category=${bot.category}`}
              className="text-xs font-semibold text-discord-blurple hover:text-white transition-colors"
            >
              View all {bot.categoryLabel} bots &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {similarBots.map((sb) => (
              <BotCard key={sb.id} bot={sb} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
