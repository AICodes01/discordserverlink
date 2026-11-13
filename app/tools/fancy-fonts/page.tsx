import Link from "next/link";
import { Metadata } from "next";
import {
  Type,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
  Hash,
  Crown,
  Laptop,
} from "lucide-react";
import FancyFontsClient from "@/components/tools/FancyFontsClient";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";
import { getPageSeo } from "@/lib/seoSettings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("tool_fancy_fonts");
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/tools/fancy-fonts`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function FancyFontsPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord Fancy Fonts & Nickname Generator",
      url: "/tools/fancy-fonts",
    },
  ]);

  const faqs = [
    {
      q: "Will other people on Discord be able to see these fancy fonts?",
      a: "Yes, 100%! Our generator converts your text into universal Unicode characters rather than proprietary font files. This means every member in your server will see your fancy nickname, channel name, or bio on Windows, Mac, iOS, Android, and web browsers without needing to install anything.",
    },
    {
      q: "Can I get banned for using fancy fonts in my Discord name?",
      a: "No. Unicode characters are fully supported by Discord's system. However, certain competitive gaming servers or strict communities may require standard Latin letters for easy @mention tagging, so always check your local server rules.",
    },
    {
      q: "Can I use these fonts in Discord channel names?",
      a: "Yes! Fancy fonts look amazing in text and voice channel titles (e.g. 『💬』ɢᴇɴᴇʀᴀʟ-ᴄʜᴀᴛ or 『📢』ᴀɴɴᴏᴜɴᴄᴇᴍᴇɴᴛꜱ). Small Caps and Monospace are especially popular among professional community managers.",
    },
    {
      q: "Do I need Discord Nitro to use custom fonts?",
      a: "Not at all. You can use all of these aesthetic fonts for free on any Discord account, whether you have Discord Nitro or not.",
    },
    {
      q: "Why do some characters show as boxes or question marks on older phones?",
      a: "If a viewer is using a very outdated operating system (like Android 7 or older), their device might not have the newest Unicode glyphs installed. On modern iOS, Android, Mac, and Windows devices, all styles render perfectly.",
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
    name: "How to Use Fancy Fonts on Discord",
    description: "Step-by-step guide to generating aesthetic fonts and pasting them into Discord nicknames and channel names.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Type Your Nickname or Channel Title",
        text: "Type or paste the text you want to style into the input box above.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Choose Your Aesthetic Style",
        text: "Browse through over 15+ font styles including Small Caps, Gothic Fraktur, Cursive Script, Double-Struck, and Bubble text.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy and Paste into Discord",
        text: "Click the “Copy” button next to your favorite style, open Discord, and paste it into your Server Nickname, Channel Title, or About Me Bio.",
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
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-cyan-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wide">
            <Type className="w-3.5 h-3.5" />
            <span>Discord Fancy Fonts & Nickname Generator</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Fancy Fonts & Aesthetic Nickname Generator: <span className="text-cyan-400">Copy & Paste Discord Fonts</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord Fancy Fonts & Aesthetic Nickname Generator: Have you ever noticed other Discord members using cool gothic letters, aesthetic cursive, or sleek small-caps in their server nicknames and wondered how they do it? By default,{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>{" "}
              does not have an option to change text font families inside the app.
            </p>
            <p>
              Our Discord Fancy Font Generator is a free tool that converts regular text into over 15+ stylish Unicode font variations. Because these styles use universal symbols and glyphs recognized by modern computers and smartphones, your aesthetic font will display everywhere on Discord without requiring viewers to install any plugins or extensions.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Simply type your text or nickname in the input box below and click the “Copy” button on your favorite style to paste it directly into Discord!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <FancyFontsClient />

      {/* How to Use Fancy Fonts on Discord */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Use Fancy Fonts on Discord
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-cyan-400">Step 1</span>
            <h3 className="font-bold text-white text-sm">Enter Your Text</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Type your gamer tag, server channel name, role title, or status message in the box above.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-cyan-400">Step 2</span>
            <h3 className="font-bold text-white text-sm">Pick Your Style</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Browse converted styles like Small Caps, Gothic Fraktur, Cursive, Monospace, and Bubbles.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-cyan-400">Step 3</span>
            <h3 className="font-bold text-white text-sm">Copy &amp; Paste</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hit “Copy” to put the formatted text on your clipboard. Paste it directly into your Discord profile or server!
            </p>
          </div>
        </div>
      </div>

      {/* Where to Use Fancy Fonts on Discord? */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Where Can You Use Fancy Fonts on Discord?
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Because our generator produces standard Unicode characters, you can paste these aesthetic fonts across almost every part of the Discord ecosystem:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Smile className="w-4 h-4 text-cyan-400" />
              <span>Server Nicknames &amp; User Bios</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Stand out in member lists and voice channels. Go to Server Settings &gt; Edit Server Profile to customize your nickname for each community.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Hash className="w-4 h-4 text-discord-blurple" />
              <span>Text &amp; Voice Channel Names</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Organize your server with clean typography like <code className="text-cyan-300">#ɢᴇɴᴇʀᴀʟ-ᴄʜᴀᴛ</code> or <code className="text-cyan-300">#ʀᴜʟᴇꜱ</code> to give your server an aesthetic, professional look.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Role Titles &amp; Staff Badges</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Give VIPs, moderators, and server boosters prestigious custom titles like <code className="text-amber-300">𝔄𝔡𝔪𝔦𝔫𝔦𝔰𝔱𝔯𝔞𝔱𝔬𝔯</code> or <code className="text-amber-300">ᴠɪᴘ ᴍᴇᴍʙᴇʀ</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Laptop className="w-4 h-4 text-emerald-400" />
              <span>Status Messages &amp; Announcements</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Catch everyone’s eye in the server sidebar with a styled custom status, or emphasize important server announcements.
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
              <span>🔤</span>
              <span>15+ Aesthetic Unicode Styles</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Includes Small Caps, Gothic Fraktur, Cursive Script, Double-Struck, Bubbles, Monospace, and more.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📱</span>
              <span>Universal Device Compatibility</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Renders cleanly on Windows, macOS, Linux, iOS (iPhone/iPad), Android, and Discord web clients.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚡</span>
              <span>1-Click Fast Copy</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Copies any styled variation to your clipboard in under a second with visual feedback confirmation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔒</span>
              <span>100% Free &amp; Private</span>
            </h3>
            <p className="text-xs text-zinc-400">
              All font transformations happen client-side in your browser. We never log or store your text.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>💎</span>
              <span>No Discord Nitro Required</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Anyone with a free Discord account can use these fonts across all servers without paying for Nitro.
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-cyan-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Explore more directories and utilities on DiscordServerLink:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://discordserverlink.com/discord-servers/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
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
          <HelpCircle className="w-5 h-5 text-cyan-400" />
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
