"use client";

import NextLink from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Server,
  Bot,
  Smile,
  Wrench,
  PlusCircle,
  ShieldAlert,
  Search,
  Menu,
  X,
  User,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/servers?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isAdmin =
    (session?.user as any)?.role === "ADMIN" ||
    (session?.user as any)?.role === "MODERATOR";

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <NextLink href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-discord-blurple flex items-center justify-center text-white shadow-glow-sm group-hover:scale-105 transition-transform">
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 127.14 96.36"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center">
                  DiscordServer<span className="text-discord-blurple">Link</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-medium tracking-wide -mt-1">
                  discordserverlink.com
                </span>
              </div>
            </NextLink>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search Minecraft, Gaming, Anime, Tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/90 border border-zinc-800 text-sm rounded-xl pl-10 pr-4 py-2 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple focus:ring-1 focus:ring-discord-blurple transition-all"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>
          </div>

          {/* Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            <NextLink
              href="/categories"
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center space-x-1.5"
            >
              <Server className="w-4 h-4 text-discord-blurple" />
              <span>Server</span>
            </NextLink>
            <NextLink
              href="/bots"
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center space-x-1.5"
            >
              <Bot className="w-4 h-4 text-indigo-400" />
              <span>Bots</span>
            </NextLink>
            <NextLink
              href="/emojis"
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center space-x-1.5"
            >
              <Smile className="w-4 h-4 text-amber-400" />
              <span>Emojis</span>
            </NextLink>
            <NextLink
              href="/tools"
              className="px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors flex items-center space-x-1.5"
            >
              <Wrench className="w-4 h-4 text-emerald-400" />
              <span>Tools</span>
            </NextLink>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-3">
            <NextLink
              href="/servers/new"
              className="hidden sm:inline-flex items-center space-x-1.5 bg-discord-blurple hover:bg-discord-hover text-white px-3.5 py-2 rounded-xl text-sm font-semibold shadow-glow-sm hover:shadow-glow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Server</span>
            </NextLink>

            {/* User Auth state */}
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-zinc-800 transition border border-transparent hover:border-zinc-700"
                >
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-8 h-8 rounded-full border border-discord-blurple object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-xs">
                      {session.user?.name?.slice(0, 2).toUpperCase() || "US"}
                    </div>
                  )}
                  <span className="hidden xl:inline text-xs font-semibold text-zinc-200 max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-zinc-800">
                      <p className="text-xs text-zinc-400">Signed in as</p>
                      <p className="text-sm font-bold text-white truncate">
                        {session.user?.name || session.user?.email}
                      </p>
                      {isAdmin && (
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-discord-blurple/20 text-discord-blurple border border-discord-blurple/30">
                          {(session.user as any)?.role}
                        </span>
                      )}
                    </div>

                    <NextLink
                      href="/servers/new"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
                    >
                      <PlusCircle className="w-4 h-4 text-discord-blurple" />
                      <span>Add Discord Server</span>
                    </NextLink>

                    {isAdmin && (
                      <NextLink
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2.5 text-sm text-discord-green hover:bg-discord-green/10 transition font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        <span>Admin Control Panel</span>
                      </NextLink>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <NextLink
                  href="/login"
                  className="px-3 py-2 rounded-xl text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition flex items-center space-x-1.5"
                >
                  <User className="w-4 h-4" />
                  <span>Login</span>
                </NextLink>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-zinc-950 border-b border-zinc-800 px-4 pt-2 pb-5 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-sm rounded-xl pl-10 pr-4 py-2.5 text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
            />
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </form>

          <div className="flex flex-col space-y-1">
            <NextLink
              href="/categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition flex items-center space-x-2"
            >
              <Server className="w-5 h-5 text-discord-blurple" />
              <span>Server</span>
            </NextLink>
            <NextLink
              href="/bots"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition flex items-center space-x-2"
            >
              <Bot className="w-5 h-5 text-indigo-400" />
              <span>Bots</span>
            </NextLink>
            <NextLink
              href="/emojis"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition flex items-center space-x-2"
            >
              <Smile className="w-5 h-5 text-amber-400" />
              <span>Emojis</span>
            </NextLink>
            <NextLink
              href="/tools"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-zinc-300 hover:text-white hover:bg-zinc-900 transition flex items-center space-x-2"
            >
              <Wrench className="w-5 h-5 text-emerald-400" />
              <span>Tools</span>
            </NextLink>
            <NextLink
              href="/servers/new"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-base font-medium text-discord-blurple hover:bg-zinc-900 transition flex items-center space-x-2"
            >
              <PlusCircle className="w-5 h-5" />
              <span>+ Add Server</span>
            </NextLink>
            {isAdmin && (
              <NextLink
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg text-base font-medium text-discord-green hover:bg-zinc-900 transition flex items-center space-x-2"
              >
                <ShieldAlert className="w-5 h-5" />
                <span>Admin Panel</span>
              </NextLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
