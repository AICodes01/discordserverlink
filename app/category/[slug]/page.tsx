import prisma from "@/lib/prisma";
import ServerCard from "@/components/ServerCard";
import FAQAccordion, { FAQItem } from "@/components/FAQAccordion";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo";
import { CATEGORY_DATA, CategoryDetails } from "@/lib/categoryContent";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle,
  BookOpen,
  TrendingUp,
  Gamepad2,
  Swords,
  Trophy,
  Users2,
  Wrench,
  Headphones,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Palette,
  Code2,
  GraduationCap,
  Globe,
  Coins,
  Briefcase,
  Heart,
  Box,
  Layout,
  Mic,
} from "lucide-react";

export const revalidate = 60;

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

const ICON_MAP: Record<string, any> = {
  Swords,
  Trophy,
  Users2,
  Wrench,
  Flame,
  BookOpen,
  Sparkles,
  Palette,
  Code2,
  Headphones,
  GraduationCap,
  Globe,
  Coins,
  Briefcase,
  Heart,
  Box,
  Layout,
  ShieldCheck,
  AlertTriangle,
  Zap,
  CheckCircle2,
  CheckCircle,
  TrendingUp,
  Gamepad2,
  Mic,
};

function renderCategoryIcon(iconName: string, className = "w-5 h-5") {
  const IconComponent = ICON_MAP[iconName] || Sparkles;
  return <IconComponent className={className} />;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    return { title: "Category Not Found" };
  }

  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";

  const customData = CATEGORY_DATA[params.slug];
  const title =
    (category.seoTitle || customData?.headline || `${category.name} Discord Servers - Top Communities 2026`) + pageSuffix;
  const description =
    category.seoDescription ||
    customData?.subheadline ||
    `Browse the best active ${category.name} Discord servers. Connect with members, find teammates, and join live voice channels on discordserverlink.com.`;

  const canonical =
    page > 1
      ? `${SITE_URL}/category/${params.slug}?page=${page}`
      : `${SITE_URL}/category/${params.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
    },
  };
}

export default async function CategoryDetailPage({ params, searchParams }: CategoryPageProps) {
  const category = await prisma.category.findUnique({
    where: { slug: params.slug },
  });

  if (!category) {
    notFound();
  }

  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const limit = 24;
  const skip = (page - 1) * limit;

  const [servers, totalCount] = await Promise.all([
    prisma.server.findMany({
      where: {
        categorySlug: category.slug,
        status: "APPROVED",
      },
      orderBy: { lastBumpedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.server.count({
      where: {
        categorySlug: category.slug,
        status: "APPROVED",
      },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Load category-specific custom content
  const content: CategoryDetails = CATEGORY_DATA[category.slug] || {
    headline: `Top ${category.name} Discord Servers 2026`,
    subheadline: category.description,
    serverTypesTitle: `Types of ${category.name} Discord Servers Explained`,
    serverTypesDescription: `Explore different styles of ${category.name} communities to find the perfect fit:`,
    serverTypes: [
      {
        title: `1. Active Discussion & Community Lounges`,
        description: `Engaging chat channels and daily discussions centered around ${category.name} hobbies, news, and events.`,
        tags: [`#${category.slug}`, "#community", "#chat", "#social"],
        icon: "Users2",
        badgeColor: "text-discord-blurple bg-discord-blurple/10 border-discord-blurple/20",
      },
      {
        title: `2. Collaborative & Project Hubs`,
        description: `Spaces where creators, enthusiasts, and specialists collaborate, share resources, and help one another.`,
        tags: [`#${category.slug}`, "#collaborate", "#projects"],
        icon: "Wrench",
        badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      },
      {
        title: `3. Beginner-Friendly & Learning Circles`,
        description: `Welcoming spaces with guides, mentorship channels, and helpful moderators for newcomers to ${category.name}.`,
        tags: [`#${category.slug}`, "#beginners", "#learning"],
        icon: "BookOpen",
        badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      },
      {
        title: `4. Events & Giveaway Communities`,
        description: `Active servers hosting regular voice stage events, contests, challenges, and Discord Nitro raffles.`,
        tags: [`#${category.slug}`, "#events", "#giveaways"],
        icon: "Trophy",
        badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      },
    ],
    howToJoinTitle: `How to Join a ${category.name} Discord Server in 2026`,
    howToJoinSteps: [
      {
        step: 1,
        title: `Browse Our Curated ${category.name} Leaderboard`,
        description: `Review community member counts, verified badges, and tags above to find your ideal match.`,
      },
      {
        step: 2,
        title: "Click 'Join Discord' to Connect",
        description: "You will be safely routed to the official Discord invite. Accept the invitation in your browser or client.",
      },
      {
        step: 3,
        title: "Complete Anti-Bot Verification",
        description: "Review the community rules and click the verification reaction to unlock server text and voice channels.",
      },
      {
        step: 4,
        title: "Select Your Interest Roles in #roles",
        description: "Pick your notification roles to receive alerts for community events, streams, and discussions.",
      },
    ],
    benefitsTitle: `Core Benefits of Joining ${category.name} Communities`,
    benefits: [
      {
        title: "🌟 Connect With Like-Minded Enthusiasts",
        description: `Surround yourself with people who share your exact passion for ${category.name} across worldwide timezones.`,
        icon: "Users2",
      },
      {
        title: "⚡ Real-Time Advice, Feedback & Insights",
        description: `Ask questions and receive instant answers from experienced community members and specialists.`,
        icon: "Sparkles",
      },
      {
        title: "🎁 Community Events & Nitro Giveaways",
        description: `Participate in regular server challenges, watch parties, and Discord Nitro member raffles.`,
        icon: "Trophy",
      },
    ],
    rulesTitle: `${category.name} Discord Guidelines & Etiquette`,
    rulesDescription: `Follow these universal etiquette rules to maintain a friendly, welcoming environment:`,
    rules: [
      {
        title: "1. Respect All Community Members",
        description: "Zero tolerance for toxicity, slurs, harassment, or personal attacks. Treat every chatter with kindness.",
        icon: "ShieldCheck",
      },
      {
        title: "2. Keep Content in Designated Channels",
        description: "Ensure your messages and media are posted in the relevant topical channel to keep general chat organized.",
        icon: "CheckCircle",
      },
      {
        title: "3. No Unsolicited DMs or Spam",
        description: "Never direct-message server members with advertising, spam links, or unsolicited self-promotion.",
        icon: "AlertTriangle",
      },
      {
        title: "4. Follow Discord Community Guidelines",
        description: "All activity must strictly adhere to Discord's official Terms of Service and Community Guidelines.",
        icon: "Zap",
      },
    ],
    faqs: [
      {
        question: `What are the best ${category.name} Discord servers in 2026?`,
        answer: `The top ${category.name} Discord servers are ranked directly on this page based on live member counts, active moderation, and recent bump frequency on DiscordServerLink.`,
      },
      {
        question: `Is it free to join these ${category.name} servers?`,
        answer: `Yes, 100%! Every server listed on DiscordServerLink is free to join. Click 'Join Discord' to launch your invitation immediately.`,
      },
      {
        question: `How do I list my own ${category.name} Discord community?`,
        answer: `Head over to our + Add Server page, paste your Discord invite link, and publish! Community members can bump your listing every 2 hours to keep it at #1 on this directory.`,
      },
      {
        question: `How do I avoid dead or inactive servers?`,
        answer: `Look for servers with a high online-to-total member ratio (marked by the pulsing green dot) and recent bump timestamps.`,
      },
    ],
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
    { name: category.name, url: `/category/${category.slug}` },
  ]);

  const faqSchema = generateFAQSchema(content.faqs);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-white transition">Categories</Link>
        <span>/</span>
        <span className="text-zinc-200 font-bold">{category.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-900 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-discord-blurple/10 border border-discord-blurple/20 text-xs font-bold text-discord-blurple mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Curated {category.name} Directory</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          {content.headline}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          {content.subheadline}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-400 pt-4 border-t border-zinc-800/80">
          <span className="flex items-center gap-1.5 text-discord-green bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse" />
            {totalCount.toLocaleString()} Verified Communities
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <TrendingUp className="w-3.5 h-3.5 text-discord-yellow" />
            Live Bumps Updated Continuously
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-950/80 px-3 py-1.5 rounded-xl border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            100% Free Public Invites
          </span>
        </div>
      </div>

      {/* Servers Grid */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Active {category.name} Communities ({totalCount.toLocaleString()})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Page {page} of {Math.max(1, totalPages)} • Sorted by Live Bump Velocity
            </p>
          </div>
          <span className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl self-start sm:self-auto">
            Showing {servers.length} of {totalCount.toLocaleString()} servers
          </span>
        </div>

        {servers.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map((server) => (
                <ServerCard key={server.id} server={server} />
              ))}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              basePath={`/category/${category.slug}`}
              totalItems={totalCount}
              itemsPerPage={limit}
            />
          </>
        ) : (
          <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-3">
            <p className="text-lg font-bold text-zinc-300">
              No servers currently listed under {category.name}
            </p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Be the first community owner to feature your server in this category!
            </p>
            <Link
              href="/servers/new"
              className="inline-block mt-3 px-6 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-sm font-bold text-white shadow-glow-sm transition"
            >
              + Add {category.name} Server
            </Link>
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* SECTION 1: CATEGORY-SPECIFIC TYPES OF SERVERS */}
      {/* ========================================================= */}
      <section className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-discord-blurple uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Community Classification</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            {content.serverTypesTitle}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-3xl">
            {content.serverTypesDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.serverTypes.map((type, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-3">
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold ${type.badgeColor}`}>
                {renderCategoryIcon(type.icon)}
              </div>
              <h3 className="text-lg font-bold text-white">
                {type.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                {type.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px] text-zinc-500">
                {type.tags.map((t) => (
                  <span key={t} className="bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: HOW TO JOIN & BENEFITS (CATEGORY-SPECIFIC) */}
      {/* ========================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step-by-Step Join Guide */}
        <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-discord-green uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Step-by-Step Tutorial</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {content.howToJoinTitle}
            </h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {content.howToJoinSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <span className="w-6 h-6 rounded-lg bg-discord-blurple text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {step.step}
                </span>
                <div>
                  <strong className="text-white block font-bold">{step.title}</strong>
                  <span className="text-zinc-400">{step.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits of Joining */}
        <div className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Why It Matters</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {content.benefitsTitle}
            </h2>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            {content.benefits.map((b, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
                <strong className="text-white font-bold block mb-1">{b.title}</strong>
                <p className="text-zinc-400">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: RULES & ETIQUETTE (CATEGORY-SPECIFIC) */}
      {/* ========================================================= */}
      <section className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-8 sm:p-12 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Community Guidelines</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {content.rulesTitle}
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            {content.rulesDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {content.rules.map((rule, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {renderCategoryIcon(rule.icon, "w-4 h-4 text-discord-blurple")}
                <span>{rule.title}</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Category FAQs with Schema.org Integration */}
      <FAQAccordion
        faqs={content.faqs}
        title={`Frequently Asked Questions About ${category.name} Discord Servers`}
        description={`Common answers about joining, ranking, and participating in ${category.name} communities.`}
      />
    </div>
  );
}
