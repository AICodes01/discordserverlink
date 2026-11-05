"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Smile,
  HelpCircle,
  ExternalLink,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Zap,
  Flame,
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  ShieldCheck,
  Server,
  Bot,
} from "lucide-react";

interface EmojiSEOContentProps {
  onKeywordClick?: (keyword: string) => void;
}

export default function EmojiSEOContent({ onKeywordClick }: EmojiSEOContentProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const keywords = [
    "Discord emojis",
    "animated Discord emoji",
    "Discord emoji formats",
    "WebP Discord emoji",
    "PNG Discord emoji",
    "GIF Discord emoji",
    "best Discord emoji packs",
    "Discord emoji library",
    "custom Discord emote upload",
  ];

  const faqs = [
    {
      q: "How many custom emojis can I add to my Discord server?",
      a: "Every standard Discord server starts with 50 free static emoji slots and 50 free animated emoji slots (100 total emojis) without paying a single dollar. By unlocking Server Boost Levels, you can expand up to 250 static and 250 animated emojis (500 total emojis!).",
    },
    {
      q: "Can I use animated GIF emojis without Discord Nitro?",
      a: "Yes! Any server member can use custom animated emojis within the server where they are uploaded for free. If you have a Discord Nitro subscription, you can also use those animated emojis across all other servers, direct messages (DMs), and group chats.",
    },
    {
      q: "What is the recommended size and format for Discord emojis?",
      a: "Discord supports GIF, PNG, WebP, and JPG files. The file must be under 256KB in size. Discord officially recommends a 1:1 square ratio (128x128px is ideal), and Discord will automatically scale it down to 32x32px in standard chat view.",
    },
    {
      q: "Are all emojis on DiscordServerLink free to download?",
      a: "Yes, 100% of the emojis in our library are free to download and use on your servers. They are stored directly on our servers for instant download and copy with zero third-party ads or waiting times.",
    },
    {
      q: "How can I submit my own custom Discord emoji pack?",
      a: "Simply scroll down to our 'Submit Discord Emoji' form on this page! Choose your GIF, PNG, or WebP image, give it a name and shortcode, and submit it for free. Our team reviews submissions daily to feature top creative packs for the community.",
    },
  ];

  return (
    <div className="space-y-12 pt-6">
      {/* Main Editorial Article Container */}
      <article className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-10 space-y-8 shadow-xl">
        {/* Section 1: Discord Emojis Intro */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <Smile className="w-3.5 h-3.5" />
            <span>Editorial Guide & Information</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Discord Emojis
          </h2>

          <div className="prose prose-invert max-w-none text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-4">
            <p>
              Emojis are one of the most popular ways to express emotions and creativity on{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 font-semibold hover:underline inline-flex items-center gap-0.5"
              >
                Discord <ExternalLink className="w-3 h-3 inline ml-0.5" />
              </a>
              . Whether you’re chatting with friends, managing a community, or simply spicing up conversations, emojis add personality and fun to every message. With Discord’s flexibility, users can enjoy a wide range of emojis in formats like GIF, PNG, and WebP, making communication more interactive and engaging.
            </p>
            <p>
              Here we have listed a wide range of animated emojis, and we regularly update this collection with new and unique ones. You can use these emojis in your servers and chats to make conversations more fun and lively. Everything you need is available in one place.
            </p>
          </div>

          {/* Quick Cross Links Banner */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-zinc-300">Also view:</span>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="https://discordserverlink.com/discord-servers/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400 text-amber-400 font-semibold transition-all"
              >
                <Server className="w-3.5 h-3.5" />
                <span>Discord Servers</span>
              </Link>
              <Link
                href="https://discordserverlink.com/best-discord-bots-list/"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-400 text-amber-400 font-semibold transition-all"
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Discord Bots</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Specification Table */}
        <div className="space-y-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Discord Emoji Library Overview</span>
          </h3>
          <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/60 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/90 text-zinc-300">
                    <th className="py-3 px-4 font-bold text-amber-400 w-1/3">Feature</th>
                    <th className="py-3 px-4 font-bold text-amber-400 w-2/3">Specification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Total Emojis</td>
                    <td className="py-2.5 px-4 font-semibold text-emerald-400">1,000+ Active & Stored on Server</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Supported Formats</td>
                    <td className="py-2.5 px-4">Animated GIF, Static PNG, WebP</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Download Cost</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-400">100% FREE</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Discord Size Limit</td>
                    <td className="py-2.5 px-4">Under 256 KB (Square 1:1, auto-scaled to 32x32px)</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Update Frequency</td>
                    <td className="py-2.5 px-4">Regular Weekly Additions</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Platform Compatibility</td>
                    <td className="py-2.5 px-4">Discord Desktop, Mobile (iOS / Android), and Web</td>
                  </tr>
                  <tr className="hover:bg-zinc-900/40 transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">Community Submissions</td>
                    <td className="py-2.5 px-4">Free User Uploads Supported</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section 2: How to Add Custom Emojis to Discord? */}
        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-400" />
              <span>How to Add Custom Emojis to Discord?</span>
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Adding this Emojis to your discord chat is an easy process. Follow the steps below to add now and use.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-2">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Step 1
              </span>
              <h4 className="text-xs font-bold text-white">Open Discord</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Open Discord and go to your Server.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Step 2
              </span>
              <h4 className="text-xs font-bold text-white">Server Settings</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Click on &ldquo;Server Settings&rdquo; and then select &ldquo;Emoji.&rdquo;
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Step 3
              </span>
              <h4 className="text-xs font-bold text-white">Upload Emoji</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Click &ldquo;Upload Emoji,&rdquo; then select a GIF, PNG, or WebP from your device.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Step 4
              </span>
              <h4 className="text-xs font-bold text-white">Name & Save</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Name your emoji (e.g., <code>:partyjam:</code>), then save. The emoji will now be available for use by your community or, if you’re a Nitro subscriber, across all servers.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2 relative">
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Step 5
              </span>
              <h4 className="text-xs font-bold text-white">Size & Square</h4>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Ensure each emoji is under 256KB and square (Discord resizes to 32x32px).
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Keywords Badges */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Keywords:
            </span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/80">
            <strong>Keywords:</strong> Discord emojis, animated Discord emoji, Discord emoji formats, WebP Discord emoji, PNG Discord emoji, GIF Discord emoji, best Discord emoji packs, Discord emoji library, custom Discord emote upload.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {keywords.map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => onKeywordClick && onKeywordClick(kw)}
                className="px-3 py-1.5 rounded-xl bg-zinc-950/80 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-800 hover:border-amber-400/50 text-xs font-medium transition-all cursor-pointer"
                title={`Filter emojis matching "${kw}"`}
              >
                #{kw}
              </button>
            ))}
          </div>
        </div>

        {/* Section 4: Submit Discord Emoji Copy & Call to Action */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950 border border-amber-500/20 space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-amber-400" />
            <span>Submit Discord Emoji</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Do you have a unique emoji pack you’d like to share with others? On our website, you can submit your own emojis for free and showcase them to thousands of Discord users. This helps others discover new creative designs while giving your collection the visibility it deserves.
          </p>
          <div className="pt-1">
            <a
              href="#submit-emoji"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all shadow-md"
            >
              <Smile className="w-3.5 h-3.5" />
              <span>Scroll to Submission Form Below</span>
            </a>
          </div>
        </div>

        {/* Section 5: Why Use Custom Discord Emojis? (SEO Expansion in User's Style) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Why Use Custom Discord Emojis on Your Server?</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-300">
            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                1
              </div>
              <h4 className="font-bold text-white text-sm">Boost Server Engagement</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Members love using expressive reaction emojis in chat channels, polls, and announcements. Adding trendy memes and animated icons makes conversations 10x more lively.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                2
              </div>
              <h4 className="font-bold text-white text-sm">Build Community Identity</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Custom server emojis represent your community&apos;s inside jokes, mascot, and theme. Whether it’s Anime, Pepe, or Gaming, unique emojis make your server memorable.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold">
                3
              </div>
              <h4 className="font-bold text-white text-sm">Reward Server Boosters</h4>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                When members boost your Discord server, you unlock additional emoji slots. Having fresh, high-quality emojis ready to upload keeps boosters excited and active.
              </p>
            </div>
          </div>
        </div>

        {/* Section 6: Frequently Asked Questions (FAQ) */}
        <div className="space-y-4 pt-2">
          <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Frequently Asked Questions (FAQ)</span>
          </h3>

          <div className="space-y-2">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/60 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-left font-bold text-xs sm:text-sm text-zinc-100 hover:text-amber-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500 shrink-0 ml-2" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-zinc-400 border-t border-zinc-800/60 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </article>
    </div>
  );
}
