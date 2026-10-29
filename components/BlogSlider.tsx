"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import { BookOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

interface BlogSliderProps {
  posts: BlogPost[];
}

export default function BlogSlider({ posts }: BlogSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  // Check scroll position to update buttons and active indicator
  const updateScrollState = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Approximate active card index
    const cardWidth = clientWidth >= 1024 ? clientWidth / 3 : clientWidth >= 640 ? clientWidth / 2 : clientWidth;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), Math.max(0, posts.length - 1)));
  }, [posts.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const slide = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;

    // Slide by 1 card on desktop (clientWidth / 3) or responsive width
    const scrollAmount =
      clientWidth >= 1024
        ? clientWidth / 3 + 8 // desktop: slide 1 card with gap
        : clientWidth >= 640
        ? clientWidth / 2 + 8 // tablet: slide 1 card
        : clientWidth; // mobile: slide 1 card

    scrollRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const cardWidth =
      clientWidth >= 1024
        ? clientWidth / 3 + 8
        : clientWidth >= 640
        ? clientWidth / 2 + 8
        : clientWidth;

    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
  };

  if (!posts || posts.length === 0) return null;

  // Total visible pages or steps (on desktop, 3 visible, so max starting index is posts.length - 3)
  const totalSlides = Math.max(1, posts.length - 2);

  return (
    <div className="mt-16 pt-12 border-t border-zinc-800/80 space-y-6">
      {/* Header with Title and Slide Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-2xl bg-discord-blurple/10 border border-discord-blurple/20 text-discord-blurple shadow-glow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Latest Discord Guides & Lists</h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              Hand-curated server lists, bot recommendations, and community growth insights
            </p>
          </div>
        </div>

        {/* Action Controls: Slide Arrows & View All Link */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 rounded-xl p-1 shadow-sm">
            <button
              onClick={() => slide("left")}
              disabled={!canScrollLeft}
              aria-label="Previous articles"
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-300 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="h-4 w-[1px] bg-zinc-800" />
            <button
              onClick={() => slide("right")}
              disabled={!canScrollRight}
              aria-label="Next articles"
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-300 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/blog"
            className="text-xs sm:text-sm font-semibold text-discord-blurple hover:text-white transition-colors flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl bg-discord-blurple/10 hover:bg-discord-blurple border border-discord-blurple/20 hover:border-discord-blurple"
          >
            <span>View all ({posts.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Slider Viewport (showing 3 items on desktop, 2 on tablet, 1 on mobile) */}
      <div className="relative">
        {/* Subtle Edge Fade Gradients for visual depth */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#0c0e14] to-transparent z-10 pointer-events-none" />
        )}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#0c0e14] to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {posts.map((post) => (
            <div
              key={post.slug}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start flex flex-col"
            >
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </div>

      {/* Slide Pagination Dots */}
      <div className="flex items-center justify-center gap-1.5 pt-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx
                ? "w-6 h-2 bg-discord-blurple"
                : "w-2 h-2 bg-zinc-700 hover:bg-zinc-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
