import Link from "next/link";
import { Compass, Search, Home, Server, Sparkles, Gamepad2, Flame, Code2, Users, Bot, Laugh } from "lucide-react";

export default function NotFound() {
  const popularCategories = [
    { name: "Gaming", slug: "gaming", icon: Gamepad2, color: "text-rose-400" },
    { name: "Anime", slug: "anime", icon: Flame, color: "text-amber-400" },
    { name: "Tech & Code", slug: "technology", icon: Code2, color: "text-sky-400" },
    { name: "Community", slug: "community", icon: Users, color: "text-emerald-400" },
    { name: "AI & LLMs", slug: "artificial-intelligence", icon: Bot, color: "text-indigo-400" },
    { name: "Memes & Humor", slug: "memes-humor", icon: Laugh, color: "text-yellow-400" },
  ];

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Glow badge & Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-discord-blurple/20 blur-2xl rounded-full" />
          <div className="relative w-20 h-20 mx-auto rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-discord-blurple shadow-2xl">
            <Compass className="w-10 h-10 animate-spin-slow" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold tracking-wider uppercase">
            <span>404 &bull; Page Not Found</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Lost in the Discordverse?
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
            The Discord server link or page you are looking for may have been removed, renamed, or expired.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto">
          <form action="/servers" method="GET" className="relative group">
            <input
              type="text"
              name="q"
              placeholder="Search servers by name or tag (e.g. Minecraft, Valorant)..."
              className="w-full bg-zinc-900/90 border border-zinc-800 text-sm rounded-2xl pl-11 pr-4 py-3.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-2 focus:ring-discord-blurple/20 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-discord-blurple absolute left-4 top-1/2 -translate-y-1/2 transition-colors" />
          </form>
        </div>

        {/* Popular Categories */}
        <div className="space-y-3 pt-2">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Or browse top categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
            {popularCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900/80 border border-zinc-800/80 hover:border-discord-blurple/60 text-xs font-medium text-zinc-300 hover:text-white transition-all hover:scale-105"
                >
                  <Icon className={`w-3.5 h-3.5 ${cat.color}`} />
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 hover:text-white font-semibold text-sm transition"
          >
            <Home className="w-4 h-4 text-zinc-400" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/servers"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-sm shadow-glow-sm hover:shadow-glow transition"
          >
            <Server className="w-4 h-4" />
            <span>Explore All Servers</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
