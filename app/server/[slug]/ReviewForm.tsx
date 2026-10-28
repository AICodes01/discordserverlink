"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function ReviewForm({ serverId }: { serverId: string }) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!session) {
    return (
      <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 text-center space-y-2">
        <p className="text-xs text-zinc-400">
          Want to share your experience with this Discord server?
        </p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition"
        >
          Sign in to write a review
        </Link>
      </div>
    );
  }

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
        setMsg("Thank you! Your review has been submitted.");
        setContent("");
      }
    } catch (err: any) {
      setError("Failed to post review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        placeholder="How is the community, staff activity, and atmosphere? Share your honest thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-discord-blurple"
      />

      <div className="flex items-center justify-between">
        <div>
          {error && <span className="text-xs text-red-400">{error}</span>}
          {msg && <span className="text-xs text-emerald-400">{msg}</span>}
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-xs font-bold shadow-glow-sm transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
}
