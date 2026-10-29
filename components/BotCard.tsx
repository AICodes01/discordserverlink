import Link from "next/link";
import { DiscordBot } from "@/lib/botsData";
import { CheckCircle2, Server, Star, Plus, ExternalLink, Bot } from "lucide-react";

interface BotCardProps {
  bot: DiscordBot;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  moderation: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  music: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  ai: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
  utility: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  gaming: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  economy: { bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20" },
  anime: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
};

export default function BotCard({ bot }: BotCardProps) {
  const catStyle = CATEGORY_COLORS[bot.category] || {
    bg: "bg-zinc-800",
    text: "text-zinc-300",
    border: "border-zinc-700",
  };

  return (
    <div className="group relative flex flex-col justify-between bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-discord-blurple/50 rounded-2xl p-5 transition-all duration-300 hover:shadow-xl hover:shadow-discord-blurple/5 hover:-translate-y-1">
      <div>
        {/* Top Header: Avatar & Info */}
        <div className="flex items-start gap-4">
          <Link href={`/bot/${bot.slug}`} className="relative shrink-0">
            <img
              src={bot.iconUrl}
              alt={`${bot.name} icon`}
              className="w-14 h-14 rounded-2xl object-cover bg-zinc-800 border border-zinc-700/80 group-hover:border-discord-blurple transition-colors"
              loading="lazy"
            />
            {bot.isVerified && (
              <span
                title="Verified Discord Bot"
                className="absolute -bottom-1 -right-1 bg-zinc-950 rounded-full p-0.5 text-discord-blurple"
              >
                <CheckCircle2 className="w-4 h-4 fill-discord-blurple text-zinc-950" />
              </span>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Link
                href={`/bot/${bot.slug}`}
                className="font-bold text-base text-white group-hover:text-discord-blurple transition-colors truncate"
              >
                {bot.name}
              </Link>
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
              >
                {bot.categoryLabel}
              </span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-400">
              <span className="flex items-center gap-1 font-medium text-zinc-300">
                <Server className="w-3.5 h-3.5 text-discord-blurple" />
                <span>{bot.formattedServers}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="flex items-center gap-1 text-amber-400 font-medium">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{bot.rating}</span>
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-[11px] font-mono bg-zinc-800/80 px-1.5 py-0.5 rounded text-zinc-300">
                {bot.prefix}
              </span>
            </div>
          </div>
        </div>

        {/* Short Description */}
        <p className="mt-3.5 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {bot.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {bot.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-zinc-800/60 text-zinc-400 border border-zinc-800"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-5 pt-4 border-t border-zinc-800/80">
        <a
          href={bot.inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-discord-blurple hover:bg-discord-hover text-white px-3 py-2 rounded-xl text-xs font-semibold shadow-glow-sm hover:shadow-glow transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Invite</span>
        </a>
        <Link
          href={`/bot/${bot.slug}`}
          className="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-600 transition-colors"
        >
          <span>View</span>
          <ExternalLink className="w-3 h-3 text-zinc-400" />
        </Link>
      </div>
    </div>
  );
}
