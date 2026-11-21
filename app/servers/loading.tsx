import { ServerCardSkeletonGrid } from "@/components/ServerCardSkeleton";

export default function ServersLoading() {
  return (
    <div className="min-h-screen bg-[#0c0e14]">
      {/* Hero bar skeleton */}
      <div className="bg-gradient-to-b from-zinc-900/60 to-transparent border-b border-zinc-800/50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 rounded-xl bg-zinc-800/60 mb-3 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          <div className="h-4 w-96 rounded-lg bg-zinc-800/40 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
          {/* Search bar skeleton */}
          <div className="h-12 w-full max-w-2xl rounded-2xl bg-zinc-800/60 mt-6 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 skeleton-shimmer" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ServerCardSkeletonGrid count={12} />
      </div>
    </div>
  );
}
