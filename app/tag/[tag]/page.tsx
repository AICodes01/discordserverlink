import prisma from "@/lib/prisma";
import ServerCard from "@/components/ServerCard";
import FAQAccordion, { FAQItem } from "@/components/FAQAccordion";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo";
import {
  Tag as TagIcon,
  Sparkles,
  BookOpen,
  Zap,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60;

interface TagPageProps {
  params: {
    tag: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({ params, searchParams }: TagPageProps): Promise<Metadata> {
  const tagName = decodeURIComponent(params.tag);
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const pageSuffix = page > 1 ? ` - Page ${page}` : "";

  const title = `Top #${tagName} Discord Servers 2026${pageSuffix} - DiscordServerLink`;
  const description = `Discover the best Discord servers tagged with #${tagName}. Connect with active players, developers, and community members on discordserverlink.com.`;

  const canonical =
    page > 1
      ? `${SITE_URL}/tag/${params.tag}?page=${page}`
      : `${SITE_URL}/tag/${params.tag}`;

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

function getTagFAQs(tagName: string): FAQItem[] {
  return [
    {
      question: `How do I find the most active #${tagName} Discord servers?`,
      answer: `Our #${tagName} directory ranks servers automatically based on live bump activity and online presence. Look for listings with high online counts and recent bump timestamps to connect with communities where voice channels and chats are active right now.`,
    },
    {
      question: `How can I add the #${tagName} tag to my own Discord server?`,
      answer: `When adding or editing your server on DiscordServerLink, simply include "${tagName}" in the comma-separated Tags field. Your server will instantly appear on this dedicated #${tagName} directory page and be indexed by search engines.`,
    },
    {
      question: `Is it safe to join servers tagged with #${tagName}?`,
      answer: `Yes. All listings undergo automated URL invite verification. Look for communities with Verified badges, zero-tolerance anti-harassment rules, and active moderation teams to ensure a safe, welcoming experience.`,
    },
    {
      question: `How often is the #${tagName} Discord server leaderboard updated?`,
      answer: `The leaderboard updates in real time! Whenever an owner or community member clicks the "Bump Server" button, their server shoots straight to #1 on this tag page.`,
    },
  ];
}

export default async function TagDetailPage({ params, searchParams }: TagPageProps) {
  const tagName = decodeURIComponent(params.tag).toLowerCase();
  const page = Math.max(1, parseInt(searchParams?.page || "1", 10));
  const limit = 24;
  const skip = (page - 1) * limit;

  let servers: any[] = [];
  let totalCount = 0;

  try {
    const [dbServers, dbTotal] = await Promise.all([
      prisma.server.findMany({
        where: {
          tags: { contains: tagName },
          status: "APPROVED",
        },
        orderBy: { lastBumpedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.server.count({
        where: {
          tags: { contains: tagName },
          status: "APPROVED",
        },
      }),
    ]);
    servers = dbServers;
    totalCount = dbTotal;
  } catch {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const seed = require("@/prisma/seed-data.json");
      const matched = (seed.servers || []).filter(
        (s: any) => s.tags && s.tags.toLowerCase().includes(tagName)
      );
      totalCount = matched.length;
      servers = matched.slice(skip, skip + limit);
    } catch {}
  }

  const totalPages = Math.ceil(totalCount / limit);

  const faqs = getTagFAQs(tagName);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Servers", url: "/servers" },
    { name: `#${tagName}`, url: `/tag/${tagName}` },
  ]);

  const faqSchema = generateFAQSchema(faqs);

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
        <Link href="/servers" className="hover:text-white transition">Servers</Link>
        <span>/</span>
        <span className="text-zinc-200 font-bold">#{tagName}</span>
      </nav>

      {/* Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/20 to-zinc-900 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-800/90 text-xs font-bold text-discord-blurple mb-3">
          <TagIcon className="w-3.5 h-3.5" />
          <span>Curated Tag Directory</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          #{tagName} Discord Servers
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-3xl leading-relaxed">
          Explore {totalCount.toLocaleString()} active communities tagged with <strong className="text-white">#{tagName}</strong>. Find teammates, join discussions, and chat with passionate fans on discordserverlink.com.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold text-zinc-400 pt-4 border-t border-zinc-800/80">
          <span className="flex items-center gap-1.5 text-discord-green bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse" />
            {totalCount.toLocaleString()} Listed Servers
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <TrendingUp className="w-3.5 h-3.5 text-discord-yellow" />
            Live Bumping Rank
          </span>
          <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            Verified Discord Invites
          </span>
        </div>
      </div>

      {/* Server Listings */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Top Communities for #{tagName} ({totalCount.toLocaleString()})
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Page {page} of {Math.max(1, totalPages)} • Real-time Bump Leaderboard
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
              basePath={`/tag/${encodeURIComponent(tagName)}`}
              totalItems={totalCount}
              itemsPerPage={limit}
            />
          </>
        ) : (
          <div className="text-center py-20 bg-zinc-900/40 rounded-3xl border border-zinc-800 space-y-3">
            <p className="text-lg font-bold text-zinc-300">
              No servers currently listed with #{tagName}
            </p>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Be the first community owner to feature your server under this tag!
            </p>
            <Link
              href="/servers/new"
              className="inline-block mt-3 px-6 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-sm font-bold text-white shadow-glow-sm transition"
            >
              + Add #{tagName} Server
            </Link>
          </div>
        )}
      </section>

      {/* ShoutMeLoud-Style SEO Guide Section */}
      <section className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 sm:p-12 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-discord-blurple uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Tag Mastery & Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            The Insider&apos;s Guide to Finding #{tagName} Discord Servers
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Finding high-retention servers requires more than just searching generic terms. Here are 3 proven tips from DiscordServerLink:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">1. Verify Active Discussions</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Before committing to a server, review their recent text chat channels. A thriving #{tagName} community will have daily ongoing conversations and active voice channels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">2. Check Member Roles & Ranks</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Well-structured Discord servers use self-assignable roles for #{tagName} interests, making it effortless to tag teammates and find squads quickly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">3. Utilize Daily Bumping</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Community members can boost their favorite #{tagName} server every 2 hours. Frequent bumps indicate an engaged, passionate community that welcomes newcomers.
            </p>
          </div>
        </div>

        {/* Pro Tip Box */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-discord-blurple/15 to-indigo-950/30 border border-discord-blurple/30 flex items-start gap-3.5">
          <Zap className="w-5 h-5 text-discord-yellow flex-shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
            <strong className="text-white font-bold">Pro-Tip for Server Leaders:</strong> Using targeted, specific tags like <em>#{tagName}</em> instead of broad keywords helps your server rank higher on Google search and connects you with members who are genuinely interested in your niche.
          </div>
        </div>
      </section>

      {/* Tag FAQs with Schema.org Integration */}
      <FAQAccordion
        faqs={faqs}
        title={`Frequently Asked Questions About #${tagName} Servers`}
        description={`Quick answers on discovering and ranking #{tagName} Discord communities.`}
      />
    </div>
  );
}
