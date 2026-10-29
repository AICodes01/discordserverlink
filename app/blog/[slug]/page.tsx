import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  BookOpen,
  User,
  Sparkles,
} from "lucide-react";
import { SITE_URL, generateBreadcrumbSchema } from "@/lib/seo";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) {
    return { title: "Article Not Found - DiscordServerLink" };
  }

  const title = `${post.title} - DiscordServerLink`;
  const description = post.excerpt.slice(0, 160);

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.author],
      images: [post.featuredImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [post.featuredImage],
    },
  };
}

export const revalidate = 60;

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.slug, 3);

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [post.featuredImage],
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "DiscordServerLink",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Back button & Breadcrumb */}
      <div className="flex items-center justify-between text-xs text-zinc-400">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 hover:text-white transition-colors font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Guides</span>
        </Link>
        <span className="hidden sm:inline font-medium text-zinc-500">
          Published {formattedDate}
        </span>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        {post.category && (
          <span className="inline-block px-3 py-1 rounded-full bg-discord-blurple/20 text-discord-blurple text-xs font-bold border border-discord-blurple/30 uppercase tracking-wider">
            {post.category}
          </span>
        )}

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-zinc-400 pt-2 border-b border-zinc-800 pb-5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-discord-blurple flex items-center justify-center text-white text-xs font-bold">
              DL
            </div>
            <span className="font-semibold text-zinc-200">{post.author}</span>
          </div>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <span>{formattedDate}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span>{post.readingTime}</span>
          </span>
        </div>
      </header>

      {/* Featured Banner Image */}
      {post.featuredImage && (
        <div className="relative rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl max-h-[460px]">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Main Post Content */}
      <div
        className="blog-content bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-lg"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Author Footer Card */}
      <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-discord-blurple flex items-center justify-center text-white text-xl font-bold shrink-0 shadow-glow-sm">
          DL
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h3 className="font-bold text-white text-base">{post.author}</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified Author
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Written by the DiscordServerLink editorial team. We curate the fastest growing Discord servers, Discord bot showcases, emojis, and server growth strategies.
          </p>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-discord-blurple" />
              <span>Related Guides & Lists</span>
            </h2>
            <Link
              href="/blog"
              className="text-xs font-semibold text-discord-blurple hover:text-white transition-colors"
            >
              View all articles &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((rp) => (
              <BlogCard key={rp.slug} post={rp} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
