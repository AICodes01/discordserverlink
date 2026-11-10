import Link from "next/link";
import { Metadata } from "next";
import {
  Send,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
  Layers,
  Lock,
  ExternalLink,
} from "lucide-react";
import WebhookSenderClient from "@/components/tools/WebhookSenderClient";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Discord Webhook Sender: Test Embeds & Send Custom Discord Webhook Messages",
  description:
    "Discord Webhook Sender & Embed Builder: Send custom announcements, formatted messages, and rich embeds to any Discord channel using webhooks. Live Discord preview, custom bot avatars, and 100% free with no login required.",
  alternates: {
    canonical: `${SITE_URL}/tools/webhook-sender`,
  },
  openGraph: {
    title: "Discord Webhook Sender: Test Embeds & Send Custom Discord Webhook Messages",
    description:
      "Send custom messages and rich embeds to Discord channels via webhooks. Customize bot avatar, username, and embed color with live dark-mode chat preview.",
  },
};

export default function WebhookSenderPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord Webhook Message Sender",
      url: "/tools/webhook-sender",
    },
  ]);

  const faqs = [
    {
      q: "How do I create a Discord Webhook URL?",
      a: "Open your Discord server, right-click the channel where you want messages to appear, select “Edit Channel”, click “Integrations”, select “Webhooks”, click “New Webhook”, and click the “Copy Webhook URL” button.",
    },
    {
      q: "Is it safe to paste my Webhook URL into this tool?",
      a: "Yes! Your Webhook URL is used solely to execute the single outbound HTTP request to Discord's servers to deliver your message. We never save, log, or share your webhook URL with any third parties.",
    },
    {
      q: "Can I mention @everyone or specific roles using a webhook?",
      a: "Yes. Simply include @everyone, @here, or role tags like <@&ROLE_ID> in your message content text box, and Discord will trigger the mention provided your webhook has permission to send messages in that channel.",
    },
    {
      q: "What should I do if my Webhook URL gets leaked or compromised?",
      a: "If someone unauthorized gains access to your webhook URL, go straight to Channel Settings &gt; Integrations &gt; Webhooks in Discord and click “Delete Webhook”. Once deleted, that URL is immediately invalidated permanently.",
    },
    {
      q: "Why does my webhook return “Invalid Webhook Token” or 404?",
      a: "A 404 or Invalid Token response means the Webhook URL was either copied incorrectly, the webhook was deleted from the server, or the target channel no longer exists.",
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
    name: "How to Send Messages Using a Discord Webhook",
    description: "Step-by-step guide to creating a webhook and sending custom announcements and rich embeds.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Create Webhook in Discord",
        text: "In Discord, open Channel Settings > Integrations > Webhooks > New Webhook, and click “Copy Webhook URL”.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Customize Bot Identity & Embed",
        text: "Paste the URL above, set your custom bot username, avatar image, message body, and optional colored rich embed.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Preview & Dispatch",
        text: "Review your live message preview in the simulated Discord chat and click “Send Webhook Message” to publish instantly.",
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
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-rose-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold tracking-wide">
            <Send className="w-3.5 h-3.5" />
            <span>Discord Webhook Sender &amp; Embed Tester</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Webhook Sender: <span className="text-rose-400">Test Embeds &amp; Send Custom Discord Webhook Messages</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord Webhook Sender: Have you ever wanted to post a beautiful server announcement, system notification, or community alert with a custom bot name and avatar without coding a bot from scratch? Fortunately,{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>{" "}
              provides built-in Webhook integrations that let you publish messages directly into any channel using simple HTTP requests.
            </p>
            <p>
              Our Discord Webhook Message Sender gives community leaders, developers, and server moderators a visual editor to compose professional announcements. Override your bot display name, attach custom avatar pictures, design rich colored embeds, and preview your layout in a realistic Discord dark-theme chat window before sending.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Simply paste your Discord Webhook URL below, customize your message and embed, and click “Send Webhook Message” to dispatch!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <WebhookSenderClient />

      {/* How to Send Webhook Messages */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Send Messages Using a Discord Webhook
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-rose-400">Step 1</span>
            <h3 className="font-bold text-white text-sm">Create Webhook in Discord</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Open Channel Settings &gt; Integrations &gt; Webhooks &gt; New Webhook, and click “Copy Webhook URL”.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-rose-400">Step 2</span>
            <h3 className="font-bold text-white text-sm">Customize Bot &amp; Embed</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste the URL, specify your custom bot username, avatar image, message body, and color scheme.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-rose-400">Step 3</span>
            <h3 className="font-bold text-white text-sm">Preview &amp; Send</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Review your live chat preview and click “Send Webhook Message” to deliver it instantly to your server!
            </p>
          </div>
        </div>
      </div>

      {/* Webhook Security & Best Practices */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Discord Webhook Security &amp; Formatting Guide
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Webhooks are powerful communication pipelines into your Discord server. Follow these best practices to keep your channels secure and formatted:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Never Share Webhook URLs Publicly</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Anyone with your Webhook URL can post messages to your channel without logging in. Never commit webhook URLs to public GitHub repositories or public chat messages.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Rich Embeds with Hex Colors</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Use colored left-border accent stripes (like Blurple <code className="text-zinc-300">#5865F2</code> or Emerald <code className="text-zinc-300">#10B981</code>) to visually distinguish rules, giveaways, and changelogs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-discord-blurple" />
              <span>Custom Bot Persona on the Fly</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You do not need to register a bot in the Developer Portal. Every webhook message can have its own unique username and avatar image URL.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Full Markdown Formatting Support</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Webhook message text supports Discord markdown including **bold**, *italics*, strikethrough, &gt; blockquotes, clickable links [Title](URL), and bulleted lists.
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
              <span>🚀</span>
              <span>Direct Discord API Dispatch</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Sends messages straight into your channel using official Discord REST endpoints in real time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎨</span>
              <span>Rich Embed Designer</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Craft beautiful embeds with custom titles, descriptions, and customizable color pickers.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🤖</span>
              <span>Bot Persona Overrides</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Customize the sender&apos;s name and avatar picture for each individual broadcast.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>👁️</span>
              <span>Live Chat Preview</span>
            </h3>
            <p className="text-xs text-zinc-400">
              See a pixel-perfect preview of your announcement formatted on Discord&apos;s dark theme.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔒</span>
              <span>Zero Logging &amp; 100% Free</span>
            </h3>
            <p className="text-xs text-zinc-400">
              We never save or log your Webhook URLs in any database. Your credentials remain private and secure.
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-rose-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Discover more Discord bots, servers, and emojis:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://discordserverlink.com/best-discord-bots-list/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Bot className="w-3.5 h-3.5 text-rose-400" />
            <span>Discord Bots</span>
          </a>
          <a
            href="https://discordserverlink.com/discord-servers/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Sparkles className="w-3.5 h-3.5 text-discord-blurple" />
            <span>Discord Servers</span>
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
          <HelpCircle className="w-5 h-5 text-rose-400" />
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
