import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import { Calendar, Clock, ArrowRight, User } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (featured) {
    return (
      <div className="group relative rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-discord-blurple/50 overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-discord-blurple/10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">
        {/* Featured Image */}
        <div className="lg:col-span-7 relative h-64 sm:h-80 lg:h-full min-h-[260px] rounded-2xl overflow-hidden bg-zinc-800">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-xl bg-discord-blurple text-white text-xs font-bold shadow-lg">
              Featured Guide
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-xs text-zinc-400">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800 text-discord-blurple font-semibold border border-zinc-700">
                {post.category || "Discord Guides"}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>{formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-zinc-500" />
                <span>{post.readingTime}</span>
              </span>
            </div>

            <Link href={`/blog/${post.slug}`}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-discord-blurple transition-colors leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-3 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-300 font-bold">
                DL
              </div>
              <span>{post.author}</span>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-discord-blurple hover:text-white transition-colors group-hover:translate-x-1 duration-200"
            >
              <span>Read Full Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-zinc-900/80 hover:bg-zinc-900 border border-zinc-800/80 hover:border-discord-blurple/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-discord-blurple/5 hover:-translate-y-1">
      {/* Thumbnail */}
      <Link href={`/blog/${post.slug}`} className="relative h-48 w-full overflow-hidden bg-zinc-800 block">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {post.category && (
          <span className="absolute top-3 left-3 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-950/80 backdrop-blur-sm text-zinc-200 border border-zinc-700/80">
            {post.category}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-zinc-500" />
              <span>{formattedDate}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{post.readingTime}</span>
            </span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block">
            <h3 className="text-base font-bold text-white group-hover:text-discord-blurple transition-colors line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 truncate max-w-[130px]">
            {post.author}
          </span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-discord-blurple group-hover:text-white transition-colors"
          >
            <span>Read More</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
