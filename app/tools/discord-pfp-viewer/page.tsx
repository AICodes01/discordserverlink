import Link from "next/link";
import { Metadata } from "next";
import {
  User,
  ArrowLeft,
  HelpCircle,
  Sparkles,
  ExternalLink,
  Bot,
  Smile,
  ShieldCheck,
  CheckCircle,
} from "lucide-react";
import DiscordPfpViewerClient from "@/components/tools/DiscordPfpViewerClient";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Discord PFP Viewer & Grabber: Discord Profile Picture Downloader",
  description:
    "Discord PFP Viewer & Grabber, Discord Profile Picture Downloader: View and download any Discord user's profile picture and server banner in original high quality (1024x1024) or animated GIF using their User ID.",
  alternates: {
    canonical: `${SITE_URL}/tools/discord-pfp-viewer`,
  },
  openGraph: {
    title: "Discord PFP Viewer & Grabber: Discord Profile Picture Downloader",
    description:
      "Free tool to view and download any Discord user avatar and server banner in HD 1024x1024 or animated GIF. 100% anonymous & no login required.",
  },
};

export default function DiscordPfpViewerPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    {
      name: "Discord PFP Viewer & Grabber",
      url: "/tools/discord-pfp-viewer",
    },
  ]);

  const faqs = [
    {
      q: "Can I download PFPs by username?",
      a: "No. Discord usernames can change, but User IDs are permanent. Using the ID ensures you always find the exact account you are looking for.",
    },
    {
      q: "Does this work for animated avatars?",
      a: "Yes! If the user has a Nitro animated avatar, our tool will provide the .gif file. If it’s a standard avatar, you will get a high-quality .png.",
    },
    {
      q: "Is this tool safe?",
      a: "Absolutely. We do not store your data, and we do not require access to your Discord account. This tool simply looks up public profile data using the official Discord API.",
    },
    {
      q: "Why does the result say “User Not Found”?",
      a: "Double-check that you copied the User ID (a long string of numbers like 395696...) and not the username. Also, ensure the user account still exists and hasn’t been deleted.",
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
    name: "How to Download a Discord Profile Picture",
    description: "Step-by-step guide to download any Discord user avatar and profile banner in HD.",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Get the User ID",
        text: "You need the unique “User ID” of the person (not their username). Turn on Developer Mode on Discord and copy their User ID.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Paste & Search",
        text: "Enter the ID into the search box above and click “Grab”.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "View & Save",
        text: "The tool will instantly display their current Avatar and Profile Banner. Click the “Download High Res” button to save it to your device.",
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
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-6 sm:p-10 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-wide">
            <User className="w-3.5 h-3.5" />
            <span>Discord PFP Viewer & Grabber</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Discord PFP Viewer & Grabber: <span className="text-discord-blurple">Discord Profile Picture Downloader</span>
          </h1>

          <div className="space-y-3 text-zinc-300 text-sm sm:text-base leading-relaxed">
            <p>
              Discord PFP Viewer & Grabber, Discord Profile Picture Downloader: Have you ever seen a cool profile picture on Discord and wanted to see it in full size? Unfortunately,{" "}
              <a
                href="https://discord.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-discord-blurple underline font-semibold hover:text-discord-hover"
              >
                Discord
              </a>{" "}
              doesn’t allow you to enlarge avatars or save them directly within the app.
            </p>
            <p>
              The Discord PFP Viewer & Grabber is a free tool that lets you view and download any user’s profile picture (avatar) and server banner in original high quality. Whether it’s a static image or an animated GIF, our tool extracts the raw file directly from Discord’s servers using just the User ID.
            </p>
            <p className="text-zinc-400 text-xs sm:text-sm font-medium">
              Just enter the Discord user ID below and hit the “Check” button to view the Profile Picture in HD, and click to download.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Tool Component */}
      <DiscordPfpViewerClient />

      {/* How to Download a Discord Profile Picture */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Download a Discord Profile Picture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-discord-blurple">Step 1</span>
            <h3 className="font-bold text-white text-sm">Get the User ID</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              You need the unique “User ID” of the person (not their username). See our guide below on how to find this.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-discord-blurple">Step 2</span>
            <h3 className="font-bold text-white text-sm">Paste & Search</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter the ID into the search box above and click “Grab”.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1.5">
            <span className="text-xs font-bold text-discord-blurple">Step 3</span>
            <h3 className="font-bold text-white text-sm">View & Save</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The tool will instantly display their current Avatar and Profile Banner. Click the “Download High Res” button to save it to your device.
            </p>
          </div>
        </div>
      </div>

      {/* How to Find a Discord User ID? */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          How to Find a Discord User ID?
        </h2>
        <p className="text-sm text-zinc-300 leading-relaxed">
          To use this tool, you need to enable “Developer Mode” on Discord. It takes 10 seconds. Follow the steps below to turn on Developer Mode and copy the Discord user’s ID.
        </p>
        <div className="space-y-2.5 pt-2">
          {[
            "Open Discord Settings (Gear Icon).",
            "Go to Advanced (under App Settings).",
            "Toggle Developer Mode to ON.",
            "Now, right-click any user’s name in a chat or member list and select “Copy User ID”.",
          ].map((step, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs sm:text-sm text-zinc-200"
            >
              <span className="w-6 h-6 rounded-lg bg-discord-blurple/20 text-discord-blurple font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🖼️</span>
              <span>Full HD Quality</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Fetches the maximum size image available (usually 1024×1024).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🎥</span>
              <span>GIF Support</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Automatically detects and downloads animated profile pictures (Nitros) as .gif files.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🚩</span>
              <span>Banner Downloader</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Unlike other tools, we also fetch the user’s Profile Banner if they have one set.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🔒</span>
              <span>100% Anonymous</span>
            </h3>
            <p className="text-xs text-zinc-400">
              The user will never know you viewed or downloaded their PFP. No notification is sent.
            </p>
          </div>

          <div className="sm:col-span-2 p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🚀</span>
              <span>No Login Needed</span>
            </h3>
            <p className="text-xs text-zinc-400">
              You do not need to sign in with your Discord account to use this tool.
            </p>
          </div>
        </div>
      </div>

      {/* Related Resources Links (Preserving requested URLs) */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-zinc-900 to-indigo-950/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-white">Recommended Discord Resources</h4>
          <p className="text-xs text-zinc-400">Check out our directories for Discord bots and server emojis:</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
          <HelpCircle className="w-5 h-5 text-discord-blurple" />
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
