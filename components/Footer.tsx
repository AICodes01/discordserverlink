import Link from "next/link";
import { Compass, ShieldCheck, Zap, Globe, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 text-zinc-400 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-discord-blurple flex items-center justify-center text-white">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 127.14 96.36">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
              </div>
              <span className="text-xl font-black text-white">
                DiscordServer<span className="text-discord-blurple">Link</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              The fastest and most SEO-friendly directory to discover, share, and promote Discord servers. Connect with hundreds of thousands of active community members worldwide.
            </p>
            <div className="flex items-center space-x-3 text-xs text-zinc-500">
              <span className="flex items-center gap-1 text-discord-green font-medium">
                <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse"></span>
                99.9% Uptime
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-zinc-400">
                <Zap className="w-3.5 h-3.5 text-discord-yellow" />
                Ultra-fast Next.js SSR
              </span>
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4">
              Top Categories
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/category/gaming" className="hover:text-white transition">
                  Gaming Servers
                </Link>
              </li>
              <li>
                <Link href="/category/anime" className="hover:text-white transition">
                  Anime & Manga
                </Link>
              </li>
              <li>
                <Link href="/category/technology" className="hover:text-white transition">
                  Coding & Tech
                </Link>
              </li>
              <li>
                <Link href="/category/community" className="hover:text-white transition">
                  Chill & Hangout
                </Link>
              </li>
              <li>
                <Link href="/category/music" className="hover:text-white transition">
                  Music Producers
                </Link>
              </li>
              <li>
                <Link href="/category/education" className="hover:text-white transition">
                  Study & Education
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tags */}
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4">
              Trending Tags
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tag/minecraft" className="hover:text-white transition">
                  Minecraft SMP
                </Link>
              </li>
              <li>
                <Link href="/tag/valorant" className="hover:text-white transition">
                  Valorant LFG
                </Link>
              </li>
              <li>
                <Link href="/tag/programming" className="hover:text-white transition">
                  Programming
                </Link>
              </li>
              <li>
                <Link href="/tag/ai" className="hover:text-white transition">
                  AI & LLMs
                </Link>
              </li>
              <li>
                <Link href="/tag/giveaways" className="hover:text-white transition">
                  Nitro Giveaways
                </Link>
              </li>
              <li>
                <Link href="/tag/roleplay" className="hover:text-white transition">
                  Roleplay (RP)
                </Link>
              </li>
            </ul>
          </div>

          {/* Links & Legal */}
          <div>
            <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider mb-4">
              Platform & Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/servers/new" className="text-discord-blurple hover:underline font-semibold">
                  + Add Your Server
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition">
                  Server Categories
                </Link>
              </li>
              <li>
                <Link href="/bots" className="hover:text-white transition">
                  Discord Bots
                </Link>
              </li>
              <li>
                <Link href="/emojis" className="hover:text-white transition">
                  Discord Emojis
                </Link>
              </li>
              <li>
                <Link href="/tools" className="hover:text-white transition">
                  Free Discord Tools
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition font-medium text-discord-blurple">
                  Blog & Guides
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition">
                  XML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {currentYear} discordserverlink.com. Not affiliated with or endorsed by Discord, Inc.</p>
          <div className="flex items-center space-x-6">
            <Link href="/" className="hover:text-zinc-400 transition">
              Home
            </Link>
            <Link href="/servers" className="hover:text-zinc-400 transition">
              Servers
            </Link>
            <Link href="/blog" className="hover:text-zinc-400 transition">
              Blog
            </Link>
            <Link href="/sitemap.xml" className="hover:text-zinc-400 transition">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
