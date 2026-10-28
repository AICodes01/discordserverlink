import prisma from "@/lib/prisma";
import Link from "next/link";
import FAQAccordion, { FAQItem } from "@/components/FAQAccordion";
import {
  Gamepad2,
  Flame,
  Code2,
  Users,
  Headphones,
  GraduationCap,
  TrendingUp,
  Palette,
  Layers,
  ArrowRight,
  BookOpen,
  Zap,
  Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import { generateBreadcrumbSchema, generateFAQSchema, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  title: "All Discord Server Categories 2026 - DiscordServerLink",
  description:
    "Browse Discord servers across Gaming, Anime, Technology, Music, Chill, Crypto, and Education on discordserverlink.com.",
  alternates: {
    canonical: `${SITE_URL}/categories`,
  },
};

const categoryIcons: Record<string, any> = {
  gaming: Gamepad2,
  anime: Flame,
  technology: Code2,
  community: Users,
  music: Headphones,
  education: GraduationCap,
  finance: TrendingUp,
  art: Palette,
};

const CATEGORIES_HUB_FAQS: FAQItem[] = [
  {
    question: "How are categories organized on DiscordServerLink?",
    answer: "Every community is tagged and cataloged into 8 primary genres: Gaming, Anime & Manga, Technology & Coding, Community & Social, Music & Audio, Education & Study, Crypto & Finance, and Art & Design. This makes finding specific sub-communities instantaneous.",
  },
  {
    question: "Can a Discord server belong to multiple categories?",
    answer: "A server has one primary category hub for structured directory indexing, but can feature up to 10 distinct tags (e.g. #minecraft, #chill, #giveaways) to be discovered across multiple interest searches.",
  },
  {
    question: "How do I choose the right category when adding my server?",
    answer: "Select the category that best matches your server's core purpose. If your server is primarily for Valorant or Minecraft LFG, choose **Gaming**. If it's a general hangout with gaming on the side, choose **Community & Social**.",
  },
];

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
  });

  // Count servers per category
  const counts = await prisma.server.groupBy({
    by: ["categorySlug"],
    where: { status: "APPROVED" },
    _count: { id: true },
  });

  const countMap = counts.reduce((acc, curr) => {
    acc[curr.categorySlug] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Categories", url: "/categories" },
  ]);

  const faqSchema = generateFAQSchema(CATEGORIES_HUB_FAQS);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-900 border border-zinc-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-discord-blurple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-800/90 text-xs font-bold text-discord-blurple mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>Category Directory Hub</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Explore Discord Categories
        </h1>
        <p className="mt-3 text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed">
          Discover tailored communities across every genre, game, and interest on{" "}
          <span className="text-zinc-100 font-semibold">discordserverlink.com</span>.
        </p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const Icon = categoryIcons[cat.slug] || Layers;
          const serverCount = countMap[cat.slug] || 0;

          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 hover:border-discord-blurple/60 hover:bg-zinc-800/40 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 group-hover:bg-discord-blurple text-zinc-300 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-zinc-950 border border-zinc-800 text-zinc-400">
                    {serverCount} {serverCount === 1 ? "Server" : "Servers"}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white group-hover:text-discord-blurple transition">
                  {cat.name}
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-800/60 flex items-center justify-between text-xs font-semibold text-discord-blurple">
                <span>Explore {cat.name} Servers</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ShoutMeLoud-Style SEO Guide Section */}
      <section className="rounded-3xl bg-zinc-900/50 border border-zinc-800 p-8 sm:p-12 space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-discord-blurple uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>Navigation Best Practices</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Finding Your Niche on Discord: The Smart Member&apos;s Checklist
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            With over 19 million active Discord servers worldwide, finding a community that truly matches your personality can feel like searching for a needle in a haystack. Here is how we recommend navigating:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">Start With Primary Category</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Begin by exploring our primary category pages. These pages feature hand-curated hubs where community sizes range from intimate 100-member study groups to 100k+ esports organizations.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">Drill Down via Tags</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Looking for something ultra-specific like <em>#python-help</em> or <em>#minecraft-smp</em>? Use the tag filters to eliminate irrelevant servers and land straight in the right chatroom.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-950/70 border border-zinc-800 space-y-2">
            <h3 className="text-sm font-bold text-white">Read Community Reviews</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every server profile on DiscordServerLink includes real member ratings and reviews. Check what active chatters say about server moderation and toxicity before joining.
            </p>
          </div>
        </div>
      </section>

      {/* Category FAQs */}
      <FAQAccordion
        faqs={CATEGORIES_HUB_FAQS}
        title="Frequently Asked Questions About Categories"
        description="Understanding Discord server taxonomies and navigation."
      />
    </div>
  );
}
