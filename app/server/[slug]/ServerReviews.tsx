"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ReviewItem {
  id: string;
  rating: number;
  content: string;
  createdAt: string | Date;
  user: {
    name?: string | null;
    username?: string | null;
    image?: string | null;
  };
}

interface ServerReviewsProps {
  serverId: string;
  serverName: string;
  initialReviews: ReviewItem[];
}

export default function ServerReviews({
  serverId,
  serverName,
  initialReviews,
}: ServerReviewsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews || []);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount > 0
      ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewCount).toFixed(1)
      : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.trim().length < 5) {
      setError("Please write at least 5 characters in your review.");
      return;
    }

    setLoading(true);
    setError(null);
    setMsg(null);

    try {
      const res = await fetch(`/api/servers/${serverId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, content }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit review");
      } else {
        const newReview: ReviewItem = data.review || {
          id: `rev-${Date.now()}`,
          rating,
          content: content.trim(),
          createdAt: new Date().toISOString(),
          user: {
            name: session?.user?.name || "Community Member",
            image: session?.user?.image || null,
            username: session?.user?.name || "Member",
          },
        };

        // Instantly add review to top of the list so it appears immediately!
        setReviews((prev) => [newReview, ...prev]);
        setMsg("Thank you! Your review has been posted.");
        setContent("");
        setRating(5);

        // Revalidate server data in background
        router.refresh();
      }
    } catch (err: any) {
      setError("Failed to post review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
      {!session ? (
        <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center space-y-2">
          <p className="text-xs text-zinc-400">
            Want to share your experience with {serverName}?
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition"
          >
            Sign in to write a review
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-bold text-zinc-200">Write a Review</h3>

          {/* Star Selector */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-400 mr-2">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 text-zinc-600 hover:text-amber-400 focus:outline-none transition"
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= rating ? "text-amber-400 fill-current" : "text-zinc-600"
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-bold text-amber-400 ml-2">{rating}.0 / 5</span>
          </div>

          <textarea
            rows={3}
            placeholder={`How is the community, staff activity, and atmosphere in ${serverName}? Share your honest thoughts...`}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
          />

          <div className="flex items-center justify-between">
            <div>
              {error && <span className="text-xs text-red-400">{error}</span>}
              {msg && <span className="text-xs text-emerald-400 font-medium">{msg}</span>}
            </div>

            <button
              type="submit"
              disabled={loading || !content.trim()}
              className="px-4 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white font-bold text-xs shadow-glow transition disabled:opacity-50"
            >
              {loading ? "Posting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4 pt-2">
        {reviews.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No reviews yet. Be the first to share your experience with this server!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 space-y-2 animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {rev.user?.image ? (
                    <img
                      src={rev.user.image}
                      alt={rev.user.name || "User"}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300">
                      {rev.user?.name?.slice(0, 2).toUpperCase() || "US"}
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold text-white">
                      {rev.user?.name || rev.user?.username || "Community Member"}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex items-center gap-0.5 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {rev.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
