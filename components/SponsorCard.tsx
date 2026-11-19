"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, Zap, Trophy } from "lucide-react";

interface SponsorCardProps {
  className?: string;
}

export default function SponsorCard({ className = "" }: SponsorCardProps) {
  return (
    <Link
      href="/login?callbackUrl=/dashboard"
      className={`group relative rounded-2xl flex flex-col justify-between overflow-hidden transition-all duration-300 p-6 min-h-[380px] bg-gradient-to-b from-[#1e1b4b] via-[#15172b] to-[#0c0e18] border border-indigo-500/40 hover:border-fuchsia-400/80 shadow-[0_0_25px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_-2px_rgba(236,72,153,0.5)] ring-1 ring-indigo-500/20 hover:-translate-y-1 ${className}`}
    >
      {/* Top ambient highlight line matching featured cards */}
      <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-violet-500 via-fuchsia-400 to-cyan-400 animate-pulse z-30" />

      {/* Decorative background curves / geometric lines inspired by Discord Nitro & the sponsor image */}
      <div className="absolute -right-8 -bottom-8 w-60 h-60 opacity-20 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-400">
          <path
            d="M20 180 C 80 140, 120 100, 180 20"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M50 190 C 100 150, 140 110, 190 50"
            stroke="currentColor"
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M80 200 C 120 160, 160 120, 200 80"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>

      {/* Shimmer sweep effect on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-fuchsia-400/10 to-transparent pointer-events-none" />

      {/* Top Header Row with Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="p-2.5 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] group-hover:scale-105 transition-transform">
          <Zap className="w-5 h-5 fill-indigo-400 text-indigo-400" />
        </div>
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.55)] border border-white/20 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 fill-white animate-pulse" />
          Featured Slot
        </span>
      </div>

      {/* Middle Content */}
      <div className="relative z-10 my-4 space-y-2.5">
        <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-200 transition-colors">
          Become a sponsor
        </h3>
        <p className="text-sm font-semibold text-indigo-200/90 leading-snug">
          Want your server to show here?
        </p>
        <p className="text-xs text-zinc-300/90 leading-relaxed pt-1">
          Reach thousands of daily Discord enthusiasts! Pin your server to the top of our directory to get instant real members, high voice activity, and verified recognition.
        </p>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/20 border border-indigo-500/30 text-indigo-200">
            ⭐ #1 Top Placement
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-violet-500/20 border border-violet-500/30 text-violet-200">
            🚀 10x More Clicks
          </span>
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-500/20 border border-cyan-500/30 text-cyan-200">
            ⚡ Instant Activation
          </span>
        </div>
      </div>

      {/* Bottom CTA Row matching user reference */}
      <div className="relative z-10 pt-4 border-t border-indigo-500/20 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:via-violet-500 hover:to-fuchsia-500 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all group-hover:scale-105 active:scale-95 border border-white/20">
          <span>Sponsor</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
        <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200 transition-colors">
          Get Started &rarr;
        </span>
      </div>
    </Link>
  );
}
