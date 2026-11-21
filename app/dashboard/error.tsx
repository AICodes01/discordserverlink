"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#0c0e14] px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 110 18A9 9 0 0112 3z" />
        </svg>
      </div>
      <h2 className="text-xl font-black text-white mb-2">Dashboard Failed to Load</h2>
      <p className="text-sm text-zinc-400 max-w-sm mb-6">
        Something went wrong while loading your dashboard. This is usually a temporary issue.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2.5 rounded-xl bg-discord-blurple hover:bg-discord-hover text-white text-sm font-bold transition shadow-glow-sm cursor-pointer"
      >
        Try Again
      </button>
    </div>
  );
}
