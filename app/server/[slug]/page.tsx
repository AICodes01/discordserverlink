import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Award,
  Sparkles,
  ExternalLink,
  Calendar,
  Share2,
  Shield,
  MessageSquare,
  Globe,
  Tag,
  Star,
  Flag,
  Info,
  Layers,
} from "lucide-react";
import ServerBumpButton from "@/components/ServerBumpButton";
import ServerCard from "@/components/ServerCard";
import ReviewForm from "./ReviewForm";
import ShareModalButton from "./ShareModalButton";
import { generateServerSchema, generateBreadcrumbSchema, SITE_URL, SITE_NAME } from "@/lib/seo";

export const revalidate = 60;

interface ServerPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: ServerPageProps): Promise<Metadata> {
  const server = await prisma.server.findUnique({
    where: { slug: params.slug },
    select: {
      name: true,
      shortDescription: true,
      iconUrl: true,
      bannerUrl: true,
      memberCount: true,
      categorySlug: true,
    },
  });

  if (!server) {
    return {
      title: "Server Not Found",
    };
  }

  const title = `${server.name} Discord Server - Join Community`;
  const description = `${server.name} has ${server.memberCount.toLocaleString()} members. ${server.shortDescription} Join on discordserverlink.com.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/server/${params.slug}`,
    },
    openGraph: {
      title: `${server.name} Discord Server`,
      description,
      url: `${SITE_URL}/server/${params.slug}`,
      siteName: SITE_NAME,
      images: [
        {
          url: server.bannerUrl || server.iconUrl || "/og-image.png",
          width: 1200,
          height: 630,
          alt: `${server.name} Discord banner`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${server.name} Discord Server`,
      description,
      images: [server.bannerUrl || server.iconUrl || "/og-image.png"],
    },
  };
}

export default async function ServerDetailPage({ params }: ServerPageProps) {
  const server = await prisma.server.findUnique({
    where: { slug: params.slug },
    include: {
      owner: {
        select: {
          name: true,
          username: true,
          image: true,
        },
      },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: {
            select: {
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!server) {
    notFound();
  }

  // Fetch similar servers in the same category
  const similarServers = await prisma.server.findMany({
    where: {
      categorySlug: server.categorySlug,
      id: { not: server.id },
      status: "APPROVED",
    },
    orderBy: { bumpsCount: "desc" },
    take: 3,
  });

  // Calculate average rating
  const reviewCount = server.reviews.length;
  const avgRating =
    reviewCount > 0
      ? (
          server.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        ).toFixed(1)
      : "5.0";

  // SEO JSON-LD structured schemas
  const serverSchema = generateServerSchema({
    name: server.name,
    slug: server.slug,
    shortDescription: server.shortDescription,
    iconUrl: server.iconUrl,
    memberCount: server.memberCount,
    lastBumpedAt: server.lastBumpedAt,
    categorySlug: server.categorySlug,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Servers", url: "/servers" },
    { name: server.categorySlug.toUpperCase(), url: `/category/${server.categorySlug}` },
    { name: server.name, url: `/server/${server.slug}` },
  ]);

  const tags = server.tags
    ? server.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  // Fetch category name
  const category = await prisma.category.findUnique({
    where: { slug: server.categorySlug },
    select: { name: true },
  });
  const categoryName = category?.name || server.categorySlug;

  const submitterName =
    server.owner?.name || server.owner?.username || "Community Staff";

  const listingDate = new Date(server.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pb-20">
      {/* Inject SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serverSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero Banner Header */}
      <div className="relative h-64 sm:h-80 w-full bg-zinc-900 overflow-hidden">
        {server.bannerUrl ? (
          <img
            src={server.bannerUrl}
            alt={`${server.name} banner`}
            className="w-full h-full object-cover filter brightness-[0.7]"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-zinc-900 via-indigo-950/60 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0e14] via-[#0c0e14]/50 to-transparent" />
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 relative z-20">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs text-zinc-400 mb-4 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-zinc-800 w-fit">
          <Link href="/" className="hover:text-white transition">Home</Link>
          <span>/</span>
          <Link href="/servers" className="hover:text-white transition">Servers</Link>
          <span>/</span>
          <Link href={`/category/${server.categorySlug}`} className="hover:text-white transition capitalize">
            {server.categorySlug}
          </Link>
          <span>/</span>
          <span className="text-zinc-200 font-medium truncate max-w-[150px]">
            {server.name}
          </span>
        </nav>

        {/* Server Header Profile Card */}
        <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            {/* Left: Icon & Title info */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="relative flex-shrink-0">
                {server.iconUrl ? (
                  <img
                    src={server.iconUrl}
                    alt={`${server.name} Discord icon`}
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-4 border-zinc-900 object-cover shadow-2xl"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-3xl border-4 border-zinc-900 bg-discord-blurple flex items-center justify-center text-white text-3xl font-black shadow-2xl">
                    {server.name.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span
                  className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-discord-green border-2 border-zinc-900"
                  title="Online and active"
                />
              </div>

              <div>
                <div className="flex items-center flex-wrap gap-2.5">
                  <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    {server.name}
                  </h1>
                  {server.isVerified && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  )}
                  {server.isPartnered && (
                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-discord-blurple/10 text-discord-blurple border border-discord-blurple/20">
                      <Award className="w-3.5 h-3.5" />
                      Partner
                    </span>
                  )}
                </div>

                <p className="mt-2 text-sm text-zinc-300 max-w-2xl leading-relaxed">
                  {server.shortDescription}
                </p>

                {/* Member Metrics Row */}
                <div className="mt-4 flex items-center flex-wrap gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-discord-green bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <span className="w-2 h-2 rounded-full bg-discord-green animate-pulse" />
                    {server.onlineCount.toLocaleString()} Online
                  </span>
                  <span className="flex items-center gap-1.5 text-zinc-300 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <Users className="w-3.5 h-3.5 text-zinc-400" />
                    {server.memberCount.toLocaleString()} Total Members
                  </span>
                  <span className="flex items-center gap-1 text-amber-400 bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-800">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {avgRating} ({reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Join & Share Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col items-stretch gap-3 w-full md:w-56 flex-shrink-0">
              <a
                href={server.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-base shadow-glow hover:shadow-glow-sm transition text-center"
              >
                <span>Join Discord</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <ShareModalButton serverName={server.name} slug={server.slug} />
            </div>
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Long Description & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            {/* SEO Community Context & Indexing Card */}
            <div className="rounded-3xl bg-gradient-to-r from-zinc-900/90 via-indigo-950/20 to-zinc-900/90 border border-zinc-800 p-6 sm:p-7 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-discord-blurple/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-3 text-xs font-bold text-discord-blurple uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>Community Overview & Directory Listing</span>
              </div>

              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
                The <strong className="text-white font-bold">{server.name}</strong> Discord server was officially added under the{" "}
                <Link
                  href={`/category/${server.categorySlug}`}
                  className="text-discord-blurple hover:underline font-semibold"
                >
                  {categoryName}
                </Link>{" "}
                category by{" "}
                <span className="text-zinc-100 font-semibold">{submitterName}</span> on{" "}
                <time dateTime={new Date(server.createdAt).toISOString()} className="text-zinc-100 font-medium">
                  {listingDate}
                </time>
                {tags.length > 0 && (
                  <>
                    {" "}with tags{" "}
                    {tags.map((tag, idx) => (
                      <span key={tag}>
                        <Link
                          href={`/tag/${tag.toLowerCase()}`}
                          className="text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
                        >
                          #{tag}
                        </Link>
                        {idx < tags.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </>
                )}
                . Whether you are looking for active voice channels, friendly members, or the latest community events, you can join <strong className="text-white">{server.name}</strong> today via the official Discord invite link on <span className="text-zinc-200 font-medium">discordserverlink.com</span>!
              </p>

              {/* Micro-badges metadata summary */}
              <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Listed: <strong className="text-zinc-300">{listingDate}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Category: <strong className="text-zinc-300 capitalize">{categoryName}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Submitted by: <strong className="text-zinc-300">{submitterName}</strong></span>
                </span>
              </div>
            </div>

            {/* Long Description Card */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-zinc-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-discord-blurple" />
                <span>About {server.name}</span>
              </h2>

              <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {server.longDescription || server.shortDescription}
              </div>

              {/* Tags Cloud */}
              {tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-800">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Associated Tags</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <Link
                        key={t}
                        href={`/tag/${t.toLowerCase()}`}
                        className="px-3 py-1 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition"
                      >
                        #{t}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-current" />
                  <span>Community Reviews ({reviewCount})</span>
                </h2>
                <div className="text-sm font-bold text-zinc-300">
                  {avgRating} / 5.0 Rating
                </div>
              </div>

              {/* Review Form */}
              <ReviewForm serverId={server.id} />

              {/* Review List */}
              <div className="space-y-4 pt-4">
                {server.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {rev.user.image ? (
                          <img
                            src={rev.user.image}
                            alt={rev.user.name || "User"}
                            className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                            {rev.user.name?.slice(0, 2).toUpperCase() || "US"}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-white">
                            {rev.user.name || rev.user.username}
                          </p>
                          <p className="text-[10px] text-zinc-500">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      {rev.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Sidebar with Bump Button & Info */}
          <div className="space-y-6">
            {/* Bump Card */}
            <div className="rounded-3xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-discord-yellow" />
                <span>Support This Server</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Bump this server to push it to the top of discordserverlink.com. Cooldown is 2 hours.
              </p>
              <ServerBumpButton
                serverId={server.id}
                initialBumps={server.bumpsCount}
                lastBumpedAt={server.lastBumpedAt}
              />
            </div>

            {/* Server Meta Info Card */}
            <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-zinc-400">
                Server Details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Category</span>
                  <Link
                    href={`/category/${server.categorySlug}`}
                    className="font-bold text-discord-blurple hover:underline capitalize"
                  >
                    {server.categorySlug}
                  </Link>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Language</span>
                  <span className="font-semibold text-zinc-200 uppercase">
                    {server.language}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Listed Since</span>
                  <span className="font-semibold text-zinc-200">
                    {new Date(server.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-zinc-800">
                  <span className="text-zinc-400">Owner</span>
                  <span className="font-semibold text-zinc-200">
                    {server.owner?.name || server.owner?.username || "Community"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-zinc-400">Total Joins</span>
                  <span className="font-semibold text-zinc-200">
                    {server.joinsCount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Similar Servers */}
            {similarServers.length > 0 && (
              <div className="rounded-3xl bg-zinc-900/60 border border-zinc-800 p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Similar {server.categorySlug} Servers</span>
                </h3>
                <div className="space-y-3">
                  {similarServers.map((s) => (
                    <Link
                      key={s.id}
                      href={`/server/${s.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-2xl hover:bg-zinc-800/60 transition group"
                    >
                      {s.iconUrl ? (
                        <img
                          src={s.iconUrl}
                          alt={s.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-discord-blurple flex items-center justify-center text-white text-xs font-bold">
                          {s.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="overflow-hidden flex-1">
                        <p className="text-xs font-bold text-zinc-200 group-hover:text-discord-blurple truncate">
                          {s.name}
                        </p>
                        <p className="text-[11px] text-zinc-500">
                          {s.memberCount.toLocaleString()} members
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
