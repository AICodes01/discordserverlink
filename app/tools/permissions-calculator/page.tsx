import Link from "next/link";
import { Metadata } from "next";
import {
  Calculator,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
  Lock,
  ShieldAlert,
  KeyRound,
  ExternalLink,
} from "lucide-react";
import PermissionsCalculatorClient from "@/components/tools/PermissionsCalculatorClient";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";
import { getPageSeo } from "@/lib/seoSettings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("tool_permissions_calculator");
  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${SITE_URL}/tools/permissions-calculator`,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
    },
  };
}

export default function PermissionsCalculatorPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord Permissions Calculator",
      url: "/tools/permissions-calculator",
    },
  ]);

  const faqs = [
    {
      q: "Where do I find my Discord Bot Client ID?",
      a: "Go to the official Discord Developer Portal (discord.com/developers/applications), select your bot application, and open the “General Information” tab. Your Client ID (Application ID) is a 17-20 digit number located right under your bot's name.",
    },
    {
      q: "What is a Discord permission integer?",
      a: "Discord uses a bitwise integer system where every individual permission (like Send Messages, Manage Roles, Administrator) corresponds to a unique power of 2. When multiple permissions are combined using bitwise-OR math, they produce a single decimal number (like 8 for Administrator, or 274878221376 for Moderation bots).",
    },
    {
      q: "Is it dangerous to give a bot “Administrator” permissions?",
      a: "Yes! The Administrator permission (integer value 8) bypasses every single channel override and gives the bot unrestricted access to delete channels, kick members, and modify server settings. Best security practice is to only grant the specific permissions your bot requires to operate.",
    },
    {
      q: "Can server channel overrides take away a bot's permissions?",
      a: "Yes, unless the bot has the Administrator permission. Channel-specific permission denies (marked with a red X) will override role-level permissions. If a bot has Administrator, channel overrides are ignored completely.",
    },
    {
      q: "Why does my bot invite link show “Invalid OAuth2”?",
      a: "This usually occurs if you pasted an invalid Bot Token instead of the Application Client ID, or if your bot has not enabled the “bot” scope in the Discord Developer Portal under the Installation / OAuth2 tab.",
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
    name: "How to Generate a Discord Bot Invite Link with Custom Permissions",
    description: "Step-by-step guide to calculating permission integers and generating official Discord bot authorization links.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Select Required Permissions",
        text: "Check off the exact permissions your bot needs across General, Text, and Voice categories.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Enter Bot Client ID (Optional)",
        text: "Paste your 18-digit Discord Application Client ID from the Discord Developer Portal into the input box.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Copy Integer or Invite URL",
        text: "Copy the calculated permission decimal integer or click “Authorize & Invite Bot” to add the bot to your server.",
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
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
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-emerald-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wide">
            <Calculator className="w-3.5 h-3.5" />
            <span>Discord Permissions Calculator</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord Permissions Calculator: <span className="text-emerald-400">Bot Permission Integer &amp; Invite URL Generator</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord Permissions Calculator: Are you building a custom Discord bot or inviting a bot to your server and want to make sure it only has the exact permissions it needs? In{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>
              , permissions are encoded as a single decimal integer using bitwise flags, which can be confusing to calculate manually.
            </p>
            <p>
              Our Discord Permissions Calculator makes server security and bot authorization simple. Check or uncheck permissions across General Server, Text Channel, and Voice categories, and watch the permission integer calculate in real time. Paste your Application Client ID to generate an official 1-click Discord OAuth2 authorization URL with slash commands (<code className="text-emerald-300">applications.commands</code>) enabled.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Select your required permissions below and copy the calculated integer or generated invite link!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <PermissionsCalculatorClient />

      {/* How to Use Calculator */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Generate a Discord Bot Invite Link with Custom Permissions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400">Step 1</span>
            <h3 className="font-bold text-white text-sm">Select Permissions</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Toggle the exact permissions your bot needs (e.g., Send Messages, Embed Links, Manage Roles).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400">Step 2</span>
            <h3 className="font-bold text-white text-sm">Enter Client ID</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Paste your bot&apos;s Application ID from the Discord Developer Portal into the Client ID box.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-emerald-400">Step 3</span>
            <h3 className="font-bold text-white text-sm">Authorize &amp; Invite</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Copy the permission integer or click “Authorize &amp; Invite Bot” to add it to your server in 1 click!
            </p>
          </div>
        </div>
      </div>

      {/* Discord Security & Permissions Best Practices */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Discord Bot Security &amp; Permissions Best Practices
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          Securing your Discord server starts with granting the right level of bot authority. Keep these principles in mind:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Avoid Full Administrator Access</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Never grant Administrator (<code className="text-red-400">value 8</code>) to public bots unless strictly required. Compromised bots with Administrator can nuke channels and ban members in seconds.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Principle of Least Privilege</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Only grant the exact permissions a bot needs to perform its job. For example, a music bot only needs View Channels, Connect, Speak, and Use Voice Activity.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>Audit High-Risk Permissions</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Be extra vigilant with Mention Everyone, Manage Roles, Manage Webhooks, and Manage Channels. These permissions can be abused if a bot account token leaks.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-discord-blurple" />
              <span>Slash Commands Scope Included</span>
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Our generator automatically includes both <code className="text-discord-blurple">scope=bot</code> and <code className="text-discord-blurple">scope=applications.commands</code> so modern Discord slash commands work immediately.
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
              <span>🔢</span>
              <span>Bitwise Integer Calculations</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Calculates 64-bit BigInt permission decimals instantly using bitwise binary math.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔗</span>
              <span>1-Click Bot Invite Generator</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Generates official Discord OAuth2 invite links with pre-configured permissions and slash commands.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚠️</span>
              <span>Dangerous Permission Badges</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Clearly flags high-risk permissions (like Administrator, Manage Roles, and Mention Everyone).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>⚡</span>
              <span>Quick Role Presets</span>
            </h3>
            <p className="text-xs text-zinc-400">
              1-click shortcuts for Select All, Administrator Only (8), and Clear All options.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🛡️</span>
              <span>Discord API v10 Standard</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Fully aligned with Discord&apos;s latest developer documentation and OAuth2 authorization flow.
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-emerald-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Browse verified Discord bots, servers, and emojis:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="https://discordserverlink.com/best-discord-bots-list/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 hover:text-white transition-colors border border-zinc-700/60"
          >
            <Bot className="w-3.5 h-3.5 text-emerald-400" />
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
          <HelpCircle className="w-5 h-5 text-emerald-400" />
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
