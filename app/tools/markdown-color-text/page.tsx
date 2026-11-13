import Link from "next/link";
import { Metadata } from "next";
import {
  Palette,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
  Eye,
  Terminal,
  Code2,
} from "lucide-react";
import MarkdownColorTextClient from "@/components/tools/MarkdownColorTextClient";
import { SITE_URL, DEFAULT_OG_IMAGES, generateBreadcrumbSchema } from "@/lib/seo";
import { getPageSeo } from "@/lib/seoSettings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("tool_markdown_color_text");
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/tools/markdown-color-text`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `${SITE_URL}/tools/markdown-color-text`,
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

export default function MarkdownColorTextPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord Colored Text Generator",
      url: "/tools/markdown-color-text",
    },
  ]);

  const faqs = [
    {
      q: "Does colored text work on Discord Mobile (iOS and Android)?",
      a: "ANSI colored codeblocks render in full, vivid color on Discord Desktop (Windows, macOS, Linux) and Discord Web. On the official Discord mobile app, messages inside ANSI codeblocks will display cleanly as monospaced text, and Discord is gradually expanding mobile terminal color support.",
    },
    {
      q: "Do I need Discord Nitro to send colored text?",
      a: "No! ANSI codeblocks are a native Discord markdown feature available to all users for free. You do not need Nitro or server boosts to send colorful messages.",
    },
    {
      q: "Why is my colored text showing strange symbols like [32m in Discord?",
      a: "If you see raw escape codes like [32m instead of color, you likely forgot the opening ```ansi and closing ``` codeblock syntax, or sent it in a channel where code formatting was stripped. Our tool generates the full, valid ```ansi codeblock automatically so this never happens.",
    },
    {
      q: "Can I use colored text in channel names or server nicknames?",
      a: "No. ANSI escape codes only work inside chat messages within ```ansi codeblocks. For channel titles, nicknames, and role names, use our Discord Fancy Fonts tool which utilizes universal Unicode characters.",
    },
    {
      q: "Can I combine bold, underline, and colors together?",
      a: "Yes! Our generator allows you to combine any foreground color with bold and underline styling. You can also mix multiple colored lines inside the same codeblock.",
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
    name: "How to Send Colored Text on Discord",
    description: "Step-by-step guide to formatting and sending colored messages in Discord using ANSI codeblocks.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Type Your Message",
        text: "Enter your announcement, rules text, or alert into the message box above.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Pick Color & Styling",
        text: "Select your desired color (Green, Red, Blue, Cyan, Yellow, Pink, White) and toggle Bold or Underline if desired.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy and Paste into Discord",
        text: "Click the “Copy Code for Discord” button and paste the generated ```ansi codeblock into any Discord channel.",
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
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-amber-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide">
            <Palette className="w-3.5 h-3.5" />
            <span>Discord ANSI Color Text Generator</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Colored Text Generator: <span className="text-amber-400">ANSI Color Text &amp; Markdown Formatter</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord Colored Text Generator: Did you know that you can send vibrant colored text in Discord messages without installing third-party clients, bots, or modifications? Unfortunately,{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>{" "}
              does not have built-in color picker buttons in its chat bar, making it difficult to remember complicated terminal escape sequences.
            </p>
            <p>
              Our Discord Colored Text Generator makes it effortless to create eye-catching server rules, tournament announcements, and VIP notices. Pick from 8 vivid foreground colors, toggle bold and underline styling, test your message in a live Discord dark-theme preview, and copy the ready-to-paste ANSI code with one click.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Simply select your desired color, type your message below, and click “Copy Code for Discord” to paste colorful text into any chat!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <MarkdownColorTextClient />

      {/* How to Send Colored Text on Discord */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Send Colored Text on Discord
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-amber-400">Step 1</span>
            <h3 className="font-bold text-white text-sm">Type Your Message</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Write your announcement, rule highlight, or alert into the text box above.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-amber-400">Step 2</span>
            <h3 className="font-bold text-white text-sm">Choose Your Color</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Click Green, Red, Blue, Cyan, Yellow, Pink, or White, and optionally enable Bold or Underline.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-amber-400">Step 3</span>
            <h3 className="font-bold text-white text-sm">Copy &amp; Paste</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hit “Copy Code for Discord” and paste the formatted block directly into any Discord channel.
            </p>
          </div>
        </div>
      </div>

      {/* How Discord Colored Text Works */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How Does Colored Text Work in Discord?
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Discord added native support for ANSI terminal escape color codes inside multiline codeblocks. Here is how the syntax works under the hood:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>The ```ansi Codeblock Wrapper</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Discord requires you to wrap the message in triple backticks with the <code className="text-amber-300">ansi</code> language identifier, telling the Discord chat parser to interpret color codes.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>ANSI Escape Sequences</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Colors are triggered using the ASCII escape character <code className="text-emerald-300">\u001b[</code> followed by the color number (e.g. 31 for Red, 32 for Green, 34 for Blue) and closed with <code className="text-emerald-300">[0m</code>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Eye className="w-4 h-4 text-discord-blurple" />
              <span>Realistic Dark Theme Preview</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our live chat simulator matches Discord&apos;s exact <code className="text-zinc-300">#313338</code> dark theme background so you know precisely how your text will look to members before sending.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span>Best Use Cases</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use green for server status updates, red for strict server rules and warnings, blue for links and guides, and yellow for important community alerts.
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
              <span>🎨</span>
              <span>8 ANSI Foreground Colors</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Select Gray, Red, Green, Yellow, Blue, Pink, Cyan, and White with clean contrast.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔠</span>
              <span>Bold &amp; Underline Styles</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Combine color codes with terminal bold (1) and underline (4) formatting for extra emphasis.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👁️</span>
              <span>Live Discord Dark-Theme Preview</span>
            </h3>
            <p className="text-xs text-zinc-400">
              See a pixel-accurate preview of your message against Discord&apos;s real dark background.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>📋</span>
              <span>1-Click Formatted Code Copy</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Automatically builds and copies the complete, valid ```ansi codeblock straight to clipboard.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>💎</span>
              <span>100% Free &amp; Zero Nitro Required</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Works on all standard Discord accounts without subscriptions or bot installations.
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-amber-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Check out more tools and directories on DiscordServerLink:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://discordserverlink.com/discord-servers/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
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
            <Smile className="w-3.5 h-3.5 text-emerald-400" />
            <span>Discord Emojis</span>
          </a>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-amber-400" />
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
