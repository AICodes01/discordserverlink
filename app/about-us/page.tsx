import Link from "next/link";
import { Metadata } from "next";
import {
  Compass,
  ShieldCheck,
  Zap,
  Users,
  Sparkles,
  Heart,
  Globe,
  Layers,
  ArrowRight,
  Bot,
  Smile,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { SITE_URL, SITE_NAME, generateBreadcrumbSchema } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us - DiscordServerLink | Discover, Join & Promote Discord Servers",
  description:
    "Learn about DiscordServerLink.com: The fastest, most transparent Discord server, bot, and emoji directory. Explore our mission, values, and how we empower thousands of communities worldwide.",
  alternates: {
    canonical: `${SITE_URL}/about-us`,
  },
  openGraph: {
    title: "About Us - DiscordServerLink | Discover, Join & Promote Discord Servers",
    description:
      "The fastest, most transparent Discord server directory. Discover active communities, promote your server for free, and download custom animated emojis.",
    url: `${SITE_URL}/about-us`,
  },
};

export default function AboutUsPage() {
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "About Us", url: "/about-us" },
  ]);

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About DiscordServerLink",
    description:
      "DiscordServerLink is a community-driven directory designed to help users discover, join, and promote active Discord servers, bots, and custom emojis.",
    url: `${SITE_URL}/about-us`,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.ico`,
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-zinc-200 font-medium">About Us</span>
      </nav>

      {/* Hero Header */}
      <div className="rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/40 to-zinc-900 border border-zinc-800 p-8 sm:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple text-xs font-bold tracking-wide">
            <Compass className="w-3.5 h-3.5" />
            <span>Our Mission &amp; Vision</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Connecting Communities, <span className="text-discord-blurple">One Server at a Time</span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Welcome to <strong>DiscordServerLink.com</strong> — the modern, lightning-fast public directory engineered to help millions of Discord users discover active communities, download custom emojis, explore top bots, and promote their own servers for free.
          </p>
        </div>
      </div>

      {/* Key Numbers Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-white">5,300+</span>
          <p className="text-xs text-zinc-400 font-medium">Verified Discord Servers</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-discord-blurple">15</span>
          <p className="text-xs text-zinc-400 font-medium">Curated Genre Categories</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">1,000+</span>
          <p className="text-xs text-zinc-400 font-medium">Custom Animated Emojis</p>
        </div>
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-2xl sm:text-3xl font-black text-amber-400">100%</span>
          <p className="text-xs text-zinc-400 font-medium">Free Organic Bumping</p>
        </div>
      </div>

      {/* Story & Philosophy */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-discord-blurple uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Why We Built DiscordServerLink</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-white">
            A Better, Fairer Way to Grow Discord Servers
          </h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-zinc-300 leading-relaxed">
          <p>
            Building a vibrant community on Discord is one of the most rewarding experiences on the internet. However, server owners know how frustrating it is to get noticed in a crowded market dominated by slow directories, pay-to-win listing sites, and spammy link redirects.
          </p>
          <p>
            We created <strong>DiscordServerLink</strong> to fix that. We believed there should be a platform that puts server quality, genuine engagement, and community safety above paywalls. Whether you manage a 50-person indie game study lounge or an 80,000-member competitive esports network, you deserve an honest, clean space to showcase your passion.
          </p>
          <p>
            Built with modern Next.js server-side rendering, DiscordServerLink delivers instantaneous search, up-to-the-minute member counts, and rich SEO ranking so that your listing gets discovered on both our directory and search engines like Google.
          </p>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Our 4 Core Pillars</h2>
          <p className="text-sm text-zinc-400">What makes DiscordServerLink the preferred directory for thousands of creators:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Fair 2-Hour Organic Bumping</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Every server owner and member can bump their server listing every 2 hours for free. Bumping sends your community directly to the top of our homepage and category feeds, rewarding active, tight-knit communities rather than large advertising budgets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Safety &amp; Strict Compliance</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We enforce strict compliance with Discord&apos;s official Terms of Service and Community Guidelines. Servers promoting hate speech, cyberbullying, phishing, malicious files, or illegal content are permanently banned from our index.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Zero Paywalls to Join</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We never charge visitors to discover or join Discord servers. You can explore thousands of verified gaming, coding, anime, finance, and fitness servers with direct, transparent invitation links that launch inside your Discord client immediately.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">4. Complete Discord Ecosystem</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Beyond servers, we provide a complete suite of resources: curated Discord Bot directories, over 1,000+ custom animated emojis, and free web utilities (PFP Viewer, Permissions Calculator, Webhook Sender, and ANSI Styler).
            </p>
          </div>
        </div>
      </div>

      {/* Community FAQ */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-10 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-white">
          Frequently Asked Questions About Us
        </h2>
        <div className="space-y-3 pt-2">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-1.5">
            <h3 className="font-bold text-sm text-white">Is DiscordServerLink affiliated with Discord, Inc.?</h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              No. DiscordServerLink is an independent community directory and is not affiliated with, endorsed by, or sponsored by Discord, Inc. &ldquo;Discord&rdquo; is a registered trademark of Discord, Inc.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-1.5">
            <h3 className="font-bold text-sm text-white">How much does it cost to list my server?</h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              It is 100% free! You can add your Discord server, tag your interests, and bump your listing every 2 hours without ever entering credit card details or paying a dime.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 space-y-1.5">
            <h3 className="font-bold text-sm text-white">How do I get in touch with the team?</h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              You can contact our support and moderation team anytime via our{" "}
              <Link href="/contact-us" className="text-discord-blurple underline font-semibold">
                Contact Us page
              </Link>{" "}
              or by emailing <code className="text-zinc-200">support@discordserverlink.com</code>.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl bg-gradient-to-r from-discord-blurple/20 via-indigo-950/40 to-discord-blurple/10 border border-discord-blurple/30 p-8 sm:p-10 text-center space-y-5">
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Ready to Grow Your Discord Community?
        </h2>
        <p className="text-sm text-zinc-300 max-w-xl mx-auto leading-relaxed">
          Join thousands of active server owners who trust DiscordServerLink to expand their audience every single day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/servers/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold shadow-glow hover:shadow-glow-lg transition-all"
          >
            <span>+ Add Your Server Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-sm font-semibold border border-zinc-700 transition-colors"
          >
            <span>Explore All Categories</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
